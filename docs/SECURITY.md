# Security foundation — V2

Status: **M02 baseline.** This documents the decisions the architecture is
built on, and is written before the functionality it constrains, deliberately.
M01 found V1 shipping third-party code with no integrity checking and no
policy of any kind (PROJECT_PROGRESS §11, R3).

---

## 1. Threat model

A static personal site. There is no login, no database, no user data and no
server runtime. That removes most of the usual attack surface and leaves three
things that genuinely matter:

| # | Risk | Mitigation |
|---|---|---|
| T1 | A supply-chain compromise executes attacker code on the apex domain | No CDN-delivered code. Every dependency is installed from npm at an exact version and resolved through a committed lockfile with integrity hashes. |
| T2 | A credential leaks into the repository or into the shipped bundle | No credential is ever needed at request time. Tokens exist only inside a GitHub Actions runner. |
| T3 | Untrusted third-party data (the GitHub API) is rendered into HTML | All external data is escaped by Astro's default expression escaping. URLs are validated before being used as `href`. |

---

## 2. Dependency policy

**Exact versions only. No ranges.** Every entry in `package.json` is pinned
without `^` or `~`, and `package-lock.json` is committed. `npm ci` in CI
therefore installs a byte-identical tree, and any change to a dependency is a
visible diff in a reviewed commit rather than something that happens silently
on someone else's machine.

**No third-party origins at runtime.** No CDN scripts, no CDN styles, no Google
Fonts. Fonts are self-hosted from `/fonts`. This is a direct response to R3:
V1 loaded three.js from jsDelivr through an import map, and import maps
structurally cannot carry a Subresource Integrity hash, so that dependency was
unpinnable by construction.

**On vendoring Pretext.** The M02 brief asked for `@chenglou/pretext@0.0.8` to
be vendored or pinned. It is pinned exactly, and the lockfile records a
`sha512` integrity hash that `npm ci` verifies on every install. That is
strictly stronger than copying the file into `src/vendor/`, which would give up
provenance and integrity verification in exchange for a copy that no tool
checks. The package is also dependency-free, so the pin covers the whole
subtree. If the architect prefers a literal vendored copy, `.gitattributes`
already reserves `src/vendor/**`.

**Current dependency tree (direct):**

| Package | Version | Why |
|---|---|---|
| `astro` | 7.2.4 | Static site framework |
| `@chenglou/pretext` | 0.0.8 | Text layout engine, Home only |
| `@astrojs/check` + `typescript` | 0.9.10 / 5.9.3 | Type checking |
| `@types/node` | 24.10.1 | Types for the build-time snapshot reader |

`@chenglou/pretext` has **no runtime dependencies of its own**.

---

## 3. GitHub token handling

**The token never leaves the build.** This is not a preference; a static site
has no request-time runtime, so there is nowhere for a secret to live even by
mistake.

```
GitHub Actions (push + scheduled)
  └─ fetch REST + GraphQL with secrets.GITHUB_TOKEN     ← runner only, never shipped
       └─ normalise → src/data/github.generated.json    ← gitignored
            └─ read at build time by src/lib/github.ts
                 └─ static HTML with the data baked in  ← what a visitor receives
```

Rules:

1. **Never** reference a token in client-side code, in an `import.meta.env.PUBLIC_*`
   variable, or in any file under `public/`. Astro exposes `PUBLIC_`-prefixed
   variables to the browser; a token must never carry that prefix.
2. The workflow uses the automatically-provisioned `secrets.GITHUB_TOKEN` with
   the minimum scope needed for public read access. No personal access token is
   stored in the repository settings unless GraphQL requires one, and if it
   does it is fine-grained, read-only and public-scope.
3. `.env` and `.env.*` (except `.env.example`) are gitignored, as are
   `*.pem`, `*.key`, `.npmrc` and `.netrc`.
4. `src/data/github.generated.json` is gitignored. The committed fallback is
   `src/data/github.snapshot.json`, which contains only public data.

**Fallback contract.** Fresh data → last committed snapshot → an explicit
"not yet compiled" state. A failed fetch must never blank the site and must
never be replaced with invented numbers.

---

## 4. Content Security Policy

GitHub Pages serves static files and **cannot set response headers**. So the
policy ships as a `<meta http-equiv>` in `BaseLayout.astro`, with the known
limitations stated honestly:

| Directive | Value | Note |
|---|---|---|
| `default-src` | `'self'` | |
| `script-src` | `'self'` | No inline scripts are emitted; all JS is external modules. |
| `style-src` | `'self' 'unsafe-inline'` | Required: Astro inlines small stylesheets, and the typography islands set `style` properties via CSSOM. |
| `img-src` | `'self' data:` | |
| `font-src` | `'self'` | Self-hosted only. |
| `connect-src` | `'self'` | No client-side API calls at all. |
| `object-src`, `base-uri`, `form-action` | `'none'` | |

**Known limitation:** `frame-ancestors` and `report-uri` are ignored when a CSP
is delivered by `<meta>`. Clickjacking protection therefore requires a real
`X-Frame-Options`/`frame-ancestors` header, which Pages cannot send. If that
becomes a requirement, the deployment target has to move to something with a
header layer (Cloudflare Pages or Netlify). Recorded rather than papered over.

---

## 5. Output hygiene

- Astro escapes all `{expression}` interpolation by default. `set:html` is not
  used anywhere in this codebase.
- K9 from M01 — `repo.html_url` interpolated **unescaped** into an `href` in
  V1's `main.js` — does not carry over: `src/lib/github.ts` types `url` as a
  string from a build-time-validated snapshot, and it is rendered through
  normal escaped interpolation.
- Every external link carries `rel="noopener noreferrer"`.

---

## 6. Status

| Item | Status |
|---|---|
| Secrets in repository | Clean — none present |
| `.gitignore` covering `.env`, keys, `node_modules`, `dist` | In place |
| Exact-pinned dependencies + committed lockfile | In place |
| Third-party runtime origins | None |
| CSP | Meta-tag policy shipped; header-only directives unavailable on Pages |
| `npm audit` | 0 vulnerabilities at M02 |
| Client-side credentials | None — no client-side network calls exist |
