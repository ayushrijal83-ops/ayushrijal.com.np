/**
 * The CYBERSECURITY content audit, tested by trying to defeat it.
 *
 * `verify-output.mjs` §8c and §8d exist to stop the security world becoming a
 * security CV. An audit that never fires and an audit that works look exactly
 * the same on a clean build, so this script makes them fire on purpose.
 *
 * Three properties, and the second is the one that actually costs something:
 *
 *   1. FABRICATION FAILS — a planted claim of a certification, an engagement,
 *      a CVE, a placement or a security job must fail the gate.
 *
 *   2. HONEST PROSE PASSES — the page's own negative register contains every
 *      dangerous noun ("certification", "penetration", "CVE", "vulnerability")
 *      because it names each one in order to deny it. Those sentences, and the
 *      ordinary English that surrounds them, must NOT fail. This is what stops
 *      the audit being "fixed" with a page-level exclusion, which would make
 *      it inert on the one page it exists to guard.
 *
 *   3. DENIALS ARE LOAD-BEARING — removing one from the built page must fail,
 *      because every affirmative sentence left behind stays literally true
 *      while the page as a whole stops being.
 *
 * Node-only, no dependencies, no framework — assertions and a process exit.
 * Run it with `npm run test:security`.
 */

import { execFileSync } from 'node:child_process';
import { copyFileSync, readFileSync, renameSync, writeFileSync, rmSync } from 'node:fs';

const PAGE = 'dist/cybersecurity/index.html';
const BACKUP = `${PAGE}.backup-by-test`;

const results = [];
const check = (label, condition) => results.push([label, Boolean(condition)]);

/** Runs the gate, returning its exit code and output rather than throwing. */
const gate = () => {
  try {
    execFileSync(process.execPath, ['scripts/verify-output.mjs'], {
      encoding: 'utf8',
      stdio: 'pipe',
    });
    return { code: 0, out: '' };
  } catch (error) {
    return { code: error.status ?? 1, out: `${error.stdout ?? ''}${error.stderr ?? ''}` };
  }
};

/** Puts `sentence` into the page's prose, runs the gate, restores the page. */
const withPlanted = (sentence) => {
  const html = readFileSync(PAGE, 'utf8');
  writeFileSync(PAGE, html.replace('</main>', `<p>${sentence}</p></main>`), 'utf8');
  const result = gate();
  writeFileSync(PAGE, html, 'utf8');
  return result;
};

/** Removes `find` from the page, runs the gate, restores the page. */
const withRemoved = (find) => {
  const html = readFileSync(PAGE, 'utf8');
  writeFileSync(PAGE, html.replace(find, ''), 'utf8');
  const result = gate();
  writeFileSync(PAGE, html, 'utf8');
  return result;
};

copyFileSync(PAGE, BACKUP);

try {
  // ── 0. The gate passes on the page as built ──────────────────────────────
  // Without this the rest proves nothing: a gate that always fails would make
  // every plant below "succeed".
  check('the honest page passes the gate', gate().code === 0);

  // ── 1. Fabrication fails ─────────────────────────────────────────────────
  const FABRICATIONS = [
    ['a first-person role claim', 'I am a penetration tester.'],
    ['a first-person researcher claim', 'I am a security researcher.'],
    ['a third-person role claim', 'Ayush Rijal is a certified ethical hacker.'],
    ['a named certification held', 'He holds the OSCP and passed Security+.'],
    ['a certification as a possession', 'My OSCP is current.'],
    ['an engagement performed', 'Performed penetration tests for two clients.'],
    ['a security assessment delivered', 'Conducted a security audit last year.'],
    ['third-party work', 'Secured 12 companies against ransomware.'],
    ['a finding in third-party software', 'Discovered two vulnerabilities in Apache.'],
    ['a zero-day claim', 'Found a zero-day in a popular CMS.'],
    ['a competition placement', 'Placed 3rd in a national CTF.'],
    ['quantified experience', '5+ years of experience in cybersecurity.'],
    ['a self-rated level', 'Expert in penetration testing.'],
    ['a CVE identifier with nothing filed', 'Reported as CVE-2026-12345.'],
  ];
  for (const [label, sentence] of FABRICATIONS) {
    const r = withPlanted(sentence);
    check(`FAILS: ${label}`, r.code !== 0);
  }

  // ── 2. Honest prose passes ───────────────────────────────────────────────
  // Every one of these contains vocabulary the patterns above hunt for. All of
  // them are legitimate, and several are quoted from the page itself. If any
  // of these fails, the audit is too broad and would force an exclusion.
  const LEGITIMATE = [
    ['the certification denial', 'No certification, and no completed course.'],
    ['the engagement denial', 'No engagement, client, or authorised test of anyone else’s system.'],
    ['the disclosure denial', 'No CVE, disclosure, advisory or report.'],
    ['the third-party-finding denial', 'No vulnerability found in software belonging to someone else.'],
    ['the placement denial', 'No CTF placement, ranking or team result.'],
    ['the employment denial', 'No professional security employment, and no years-of-experience figure.'],
    ['the proficiency denial', 'No proficiency level, score or self-rating anywhere on this site.'],
    ['a lab subject named', 'SQL injection, cross-site scripting, CSRF and file-upload modules.'],
    ['the simulated scanner', 'The flags -p-, -sn and -sV were exercised against a simulated network.'],
    ['a defensive decision', 'CSRF protection is registered globally rather than per form.'],
    ['learning stated plainly', 'Worked OverTheWire Bandit, levels 0 to 13.'],
    ['an ordinary ordinal', 'The third blueprint registered was the roadmap.'],
    ['vulnerability as a topic', 'A vulnerability assessment module is one of the labs.'],
    ['penetration as a topic', 'Penetration testing is a subject in the roadmap.'],
  ];
  for (const [label, sentence] of LEGITIMATE) {
    const r = withPlanted(sentence);
    check(`PASSES: ${label}`, r.code === 0);
  }

  // ── 3. The denials are load-bearing ──────────────────────────────────────
  const DENIALS = [
    ['the real-network denial', 'No scan of a real network is recorded'],
    ['the packet-capture denial', 'No capture of my own is published'],
    ['the certification denial', 'No certification, and no completed course'],
  ];
  for (const [label, text] of DENIALS) {
    const r = withRemoved(text);
    check(`FAILS when removed: ${label}`, r.code !== 0);
  }

  // ── 4. The failure names the problem without inventing one ───────────────
  const named = withPlanted('I am a penetration tester.');
  check('the failure explains itself', /security role or credential/i.test(named.out));
  check('the failure points at the record', /1H\.8/.test(named.out));
} finally {
  // Restore byte-for-byte whatever happened above.
  renameSync(BACKUP, PAGE);
}

// A restored page must still pass, or the harness damaged the artifact.
check('the page is intact after testing', gate().code === 0);
rmSync(BACKUP, { force: true });

// ── Report ─────────────────────────────────────────────────────────────────
const failed = results.filter(([, ok]) => !ok);
for (const [label, ok] of results) console.log(`  ${ok ? '✓' : '✗'} ${label}`);

if (failed.length > 0) {
  console.error(`\nSecurity audit test FAILED: ${failed.length} of ${results.length}.\n`);
  process.exit(1);
}
console.log(`\nSecurity content audit verified: ${results.length} assertions.`);
