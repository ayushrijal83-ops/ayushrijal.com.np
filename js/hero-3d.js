import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

(function () {
  "use strict";

  var canvas = document.getElementById("hero-canvas");
  var container = canvas ? canvas.closest(".hero-visual") : null;
  if (!canvas || !container) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isSmall = window.matchMedia("(max-width: 640px)").matches;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
  } catch (e) {
    renderer = null;
  }
  if (!renderer) {
    canvas.style.display = "none";
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 5.6);

  /* ---------------- Lights ---------------- */
  var ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  var keyLight = new THREE.PointLight(0x00e5ff, 3, 14, 2);
  keyLight.position.set(2.6, 2.1, 3.2);
  scene.add(keyLight);

  var rimLight = new THREE.PointLight(0xffffff, 1, 14, 2);
  rimLight.position.set(-3, -1.6, -2);
  scene.add(rimLight);

  /* ---------------- Glow halo (fakes bloom, cheap) ---------------- */
  function makeRadialTexture(inner, mid, outer, size) {
    var c = document.createElement("canvas");
    c.width = c.height = size;
    var ctx = c.getContext("2d");
    var grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, inner);
    grad.addColorStop(0.5, mid);
    grad.addColorStop(1, outer);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(c);
  }

  var glowTex = makeRadialTexture(
    "rgba(255,255,255,1)",
    "rgba(255,255,255,0.35)",
    "rgba(255,255,255,0)",
    256
  );
  var glowMat = new THREE.SpriteMaterial({
    map: glowTex,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  var glowSprite = new THREE.Sprite(glowMat);
  glowSprite.scale.set(5.2, 5.2, 1);
  glowSprite.position.z = -0.8;
  scene.add(glowSprite);

  var sparkTex = makeRadialTexture(
    "rgba(255,255,255,1)",
    "rgba(255,255,255,0.55)",
    "rgba(255,255,255,0)",
    64
  );

  /* ---------------- Core: glass sphere + wireframe shell ---------------- */
  var core = new THREE.Group();
  scene.add(core);

  var glassGeo = new THREE.IcosahedronGeometry(1.24, isSmall ? 2 : 3);
  var glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x0c2830,
    metalness: 0.2,
    roughness: 0.15,
    transparent: true,
    opacity: 0.4,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    emissive: 0x00e5ff,
    emissiveIntensity: 0.14
  });
  var glassMesh = new THREE.Mesh(glassGeo, glassMat);
  core.add(glassMesh);

  var wireGeo = new THREE.IcosahedronGeometry(1.42, 1);
  var wireEdgesGeo = new THREE.EdgesGeometry(wireGeo);
  var wireMat = new THREE.LineBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.5 });
  var wireMesh = new THREE.LineSegments(wireEdgesGeo, wireMat);
  core.add(wireMesh);

  /* ---------------- Orbiting node network (particle shell) ---------------- */
  var particleShell = new THREE.Group();
  scene.add(particleShell);

  var nodeCount = isSmall ? 90 : 170;
  var nodePts = [];
  var positions = new Float32Array(nodeCount * 3);
  for (var i = 0; i < nodeCount; i++) {
    var y = 1 - (i / (nodeCount - 1)) * 2;
    var r = Math.sqrt(Math.max(0, 1 - y * y));
    var phi = i * Math.PI * (3 - Math.sqrt(5));
    var radius = 1.85 + (Math.random() - 0.5) * 0.3;
    var x = Math.cos(phi) * r * radius;
    var z = Math.sin(phi) * r * radius;
    var yy = y * radius;
    positions[i * 3] = x;
    positions[i * 3 + 1] = yy;
    positions[i * 3 + 2] = z;
    nodePts.push(new THREE.Vector3(x, yy, z));
  }

  var particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  var particleMat = new THREE.PointsMaterial({
    size: isSmall ? 0.09 : 0.075,
    map: sparkTex,
    transparent: true,
    opacity: 0.9,
    color: 0x00e5ff,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  });
  var particles = new THREE.Points(particleGeo, particleMat);
  particleShell.add(particles);

  var linePositions = [];
  var neighborK = 2;
  var maxLineNodes = Math.min(nodePts.length, isSmall ? 40 : 70);
  for (var a = 0; a < maxLineNodes; a++) {
    var dists = [];
    for (var b = 0; b < maxLineNodes; b++) {
      if (a === b) continue;
      dists.push({ i: b, d: nodePts[a].distanceToSquared(nodePts[b]) });
    }
    dists.sort(function (p, q) { return p.d - q.d; });
    for (var k = 0; k < neighborK; k++) {
      var bIdx = dists[k].i;
      linePositions.push(
        nodePts[a].x, nodePts[a].y, nodePts[a].z,
        nodePts[bIdx].x, nodePts[bIdx].y, nodePts[bIdx].z
      );
    }
  }
  var lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
  var lineMat = new THREE.LineBasicMaterial({
    color: 0x00e5ff,
    transparent: true,
    opacity: 0.2,
    blending: THREE.AdditiveBlending
  });
  var lines = new THREE.LineSegments(lineGeo, lineMat);
  particleShell.add(lines);

  /* ---------------- Theme-aware material presets ---------------- */
  var THEME_PRESETS = {
    dark: {
      accent: "#00e5ff",
      ambient: 0.5,
      key: 3.2,
      rim: 1,
      glassColor: 0x0c2830,
      glassOpacity: 0.42,
      glassEmissive: 0.16,
      wireOpacity: 0.5,
      particleOpacity: 0.9,
      lineOpacity: 0.2,
      glowOpacity: 0.9
    },
    light: {
      accent: "#00808f",
      ambient: 1,
      key: 1.8,
      rim: 0.7,
      glassColor: 0xeaf7fa,
      glassOpacity: 0.3,
      glassEmissive: 0.08,
      wireOpacity: 0.4,
      particleOpacity: 0.75,
      lineOpacity: 0.16,
      glowOpacity: 0.4
    }
  };

  function applyThemeToScene(theme) {
    var p = THEME_PRESETS[theme] || THEME_PRESETS.dark;
    var accentColor = new THREE.Color(p.accent);
    wireMat.color.copy(accentColor);
    wireMat.opacity = p.wireOpacity;
    particleMat.color.copy(accentColor);
    particleMat.opacity = p.particleOpacity;
    lineMat.color.copy(accentColor);
    lineMat.opacity = p.lineOpacity;
    glassMat.emissive.copy(accentColor);
    glassMat.emissiveIntensity = p.glassEmissive;
    glassMat.opacity = p.glassOpacity;
    glassMat.color.set(p.glassColor);
    keyLight.color.copy(accentColor);
    keyLight.intensity = p.key;
    rimLight.intensity = p.rim;
    ambient.intensity = p.ambient;
    glowMat.color.copy(accentColor);
    glowMat.opacity = p.glowOpacity;
  }

  applyThemeToScene(document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");

  document.addEventListener("themechange", function (e) {
    var theme = e.detail && e.detail.theme === "light" ? "light" : "dark";
    applyThemeToScene(theme);
    if (reduceMotion) render();
  });

  /* ---------------- Sizing ---------------- */
  function resize() {
    var rect = container.getBoundingClientRect();
    var w = rect.width, h = rect.height;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    render();
  }

  if ("ResizeObserver" in window) {
    new ResizeObserver(resize).observe(container);
  } else {
    window.addEventListener("resize", resize);
  }
  resize();

  /* ---------------- Animation loop ---------------- */
  var running = false;
  var visible = true;
  var lastTime = 0;
  var targetTiltX = 0, targetTiltY = 0, tiltX = 0, tiltY = 0;

  function render() {
    renderer.render(scene, camera);
  }

  function frame(time) {
    if (!running) return;
    var dt = lastTime ? Math.min(time - lastTime, 50) : 16;
    lastTime = time;

    core.rotation.y += dt * 0.00016;
    core.rotation.x = Math.sin(time * 0.00012) * 0.08;
    particleShell.rotation.y -= dt * 0.00009;
    particleShell.rotation.x += dt * 0.00003;

    tiltX += (targetTiltX - tiltX) * 0.05;
    tiltY += (targetTiltY - tiltY) * 0.05;
    scene.rotation.x = tiltX;
    scene.rotation.y = tiltY;

    render();
    requestAnimationFrame(frame);
  }

  function start() {
    if (reduceMotion) { render(); return; }
    if (running) return;
    running = true;
    lastTime = 0;
    requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
  }

  function onPointerMove(e) {
    var rect = container.getBoundingClientRect();
    var px = (e.clientX - rect.left) / rect.width - 0.5;
    var py = (e.clientY - rect.top) / rect.height - 0.5;
    targetTiltY = Math.max(-1, Math.min(1, px)) * 0.35;
    targetTiltX = Math.max(-1, Math.min(1, py)) * -0.22;
  }

  if (!reduceMotion) {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
  }

  canvas.addEventListener("webglcontextlost", function (e) {
    e.preventDefault();
    stop();
  }, false);

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { stop(); } else if (visible) { start(); }
  });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible = entry.isIntersecting;
        if (visible && !document.hidden) { start(); } else { stop(); }
      });
    }, { threshold: 0.1 });
    io.observe(canvas);
  } else {
    start();
  }
})();
