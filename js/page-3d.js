import * as THREE from "three";

(function () {
  "use strict";

  var canvas = document.querySelector(".page-hero-canvas");
  var container = canvas ? canvas.closest(".page-hero-visual") : null;
  if (!canvas || !container) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isSmall = window.matchMedia("(max-width: 640px)").matches;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false, powerPreference: "high-performance" });
  } catch (e) {
    renderer = null;
  }
  if (!renderer) {
    canvas.style.display = "none";
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall ? 1 : 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100);
  camera.position.set(0, 0, 5.2);

  var ambient = new THREE.AmbientLight(0xffffff, 0.55);
  scene.add(ambient);
  var keyLight = new THREE.PointLight(0x00e5ff, 2.9, 12, 2);
  keyLight.position.set(2.2, 1.8, 3);
  scene.add(keyLight);
  var rimLight = new THREE.PointLight(0xffffff, 0.9, 12, 2);
  rimLight.position.set(-2.6, -1.4, -2);
  scene.add(rimLight);

  function radialTex(inner, outer, size) {
    var c = document.createElement("canvas");
    c.width = c.height = size;
    var ctx = c.getContext("2d");
    var grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, inner);
    grad.addColorStop(1, outer);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(c);
  }

  var glowSprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: radialTex("rgba(255,255,255,1)", "rgba(255,255,255,0)", 256),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  }));
  glowSprite.scale.set(4.8, 4.8, 1);
  glowSprite.position.z = -0.6;
  scene.add(glowSprite);

  var sparkTex = radialTex("rgba(255,255,255,1)", "rgba(255,255,255,0)", 64);

  var core = new THREE.Group();
  scene.add(core);

  var glassGeo = new THREE.IcosahedronGeometry(1.1, isSmall ? 1 : 2);
  var glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x0c2830,
    metalness: 0.2,
    roughness: 0.16,
    transparent: true,
    opacity: 0.38,
    clearcoat: 1,
    clearcoatRoughness: 0.14,
    emissive: 0x00e5ff,
    emissiveIntensity: 0.16
  });
  core.add(new THREE.Mesh(glassGeo, glassMat));

  var wireGeo = new THREE.IcosahedronGeometry(1.28, 1);
  var wireMat = new THREE.LineBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.5 });
  var wireMesh = new THREE.LineSegments(new THREE.EdgesGeometry(wireGeo), wireMat);
  core.add(wireMesh);

  var ringGroup = new THREE.Group();
  scene.add(ringGroup);
  var ringSpecs = [
    { radius: 1.75, tube: 0.01, tilt: [1.1, 0.25, 0], speed: 0.00024 },
    { radius: 1.95, tube: 0.007, tilt: [0.4, 1.1, 0.3], speed: -0.00018 }
  ];
  var rings = ringSpecs.map(function (spec) {
    var geo = new THREE.TorusGeometry(spec.radius, spec.tube, 8, isSmall ? 32 : 56);
    var mat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.4 });
    var mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.set(spec.tilt[0], spec.tilt[1], spec.tilt[2]);
    mesh.userData.speed = spec.speed;
    ringGroup.add(mesh);
    return mesh;
  });

  var shell = new THREE.Group();
  scene.add(shell);

  var nodeCount = isSmall ? 40 : 70;
  var nodePts = [];
  var positions = new Float32Array(nodeCount * 3);
  for (var i = 0; i < nodeCount; i++) {
    var y = 1 - (i / (nodeCount - 1)) * 2;
    var r = Math.sqrt(Math.max(0, 1 - y * y));
    var phi = i * Math.PI * (3 - Math.sqrt(5));
    var radius = 1.65 + (Math.random() - 0.5) * 0.25;
    var x = Math.cos(phi) * r * radius;
    var z = Math.sin(phi) * r * radius;
    var yy = y * radius;
    positions[i * 3] = x; positions[i * 3 + 1] = yy; positions[i * 3 + 2] = z;
    nodePts.push(new THREE.Vector3(x, yy, z));
  }
  var particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  var particleMat = new THREE.PointsMaterial({
    size: isSmall ? 0.085 : 0.07,
    map: sparkTex,
    transparent: true,
    opacity: 0.9,
    color: 0x00e5ff,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  });
  shell.add(new THREE.Points(particleGeo, particleMat));

  var linePositions = [];
  var maxLineNodes = Math.min(nodePts.length, isSmall ? 24 : 42);
  for (var a = 0; a < maxLineNodes; a++) {
    var dists = [];
    for (var b = 0; b < maxLineNodes; b++) {
      if (a === b) continue;
      dists.push({ i: b, d: nodePts[a].distanceToSquared(nodePts[b]) });
    }
    dists.sort(function (p, q) { return p.d - q.d; });
    for (var k = 0; k < 2; k++) {
      var bIdx = dists[k].i;
      linePositions.push(nodePts[a].x, nodePts[a].y, nodePts[a].z, nodePts[bIdx].x, nodePts[bIdx].y, nodePts[bIdx].z);
    }
  }
  var lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
  var lineMat = new THREE.LineBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending });
  shell.add(new THREE.LineSegments(lineGeo, lineMat));

  var THEME_PRESETS = {
    dark: {
      accent: "#00e5ff", ambient: 0.55, key: 2.9, rim: 0.9,
      glassColor: 0x0c2830, glassOpacity: 0.38, glassEmissive: 0.16,
      wireOpacity: 0.5, ringOpacity: 0.42, particleOpacity: 0.9, lineOpacity: 0.2, glowOpacity: 0.85
    },
    light: {
      accent: "#00808f", ambient: 1, key: 1.7, rim: 0.6,
      glassColor: 0xeaf7fa, glassOpacity: 0.26, glassEmissive: 0.08,
      wireOpacity: 0.38, ringOpacity: 0.28, particleOpacity: 0.72, lineOpacity: 0.15, glowOpacity: 0.38
    }
  };

  var currentTheme = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";

  function applyTheme(theme) {
    currentTheme = theme;
    var p = THEME_PRESETS[theme] || THEME_PRESETS.dark;
    var c = new THREE.Color(p.accent);
    wireMat.color.copy(c); wireMat.opacity = p.wireOpacity;
    rings.forEach(function (m) { m.material.color.copy(c); m.material.opacity = p.ringOpacity; });
    particleMat.color.copy(c); particleMat.opacity = p.particleOpacity;
    lineMat.color.copy(c); lineMat.opacity = p.lineOpacity;
    glassMat.emissive.copy(c); glassMat.emissiveIntensity = p.glassEmissive;
    glassMat.opacity = p.glassOpacity; glassMat.color.set(p.glassColor);
    keyLight.color.copy(c); keyLight.intensity = p.key;
    rimLight.intensity = p.rim;
    ambient.intensity = p.ambient;
    glowSprite.material.color.copy(c); glowSprite.material.opacity = p.glowOpacity;
  }

  applyTheme(currentTheme);
  document.addEventListener("themechange", function (e) {
    applyTheme(e.detail && e.detail.theme === "light" ? "light" : "dark");
    if (reduceMotion) render();
  });

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

  var running = false, visible = true, lastTime = 0, frameSkip = 0;
  var targetTiltX = 0, targetTiltY = 0, tiltX = 0, tiltY = 0;

  function render() {
    renderer.render(scene, camera);
  }

  function frame(time) {
    if (!running) return;

    frameSkip = (frameSkip + 1) % 3;
    if (frameSkip === 0) {
      var dt = lastTime ? Math.min(time - lastTime, 80) : 32;
      lastTime = time;

      core.rotation.y += dt * 0.00015;
      core.rotation.x = Math.sin(time * 0.0001) * 0.06;
      shell.rotation.y -= dt * 0.00008;
      rings.forEach(function (m) { m.rotation.z += m.userData.speed * dt; });
      glassMat.emissiveIntensity = (THEME_PRESETS[currentTheme] || THEME_PRESETS.dark).glassEmissive * (0.85 + Math.sin(time * 0.0016) * 0.3);

      tiltX += (targetTiltX - tiltX) * 0.08;
      tiltY += (targetTiltY - tiltY) * 0.08;
      scene.rotation.x = tiltX;
      scene.rotation.y = tiltY;

      render();
    }

    requestAnimationFrame(frame);
  }

  function start() {
    if (reduceMotion) { render(); return; }
    if (running) return;
    running = true; lastTime = 0;
    requestAnimationFrame(frame);
  }
  function stop() { running = false; }

  if (!reduceMotion) {
    window.addEventListener("pointermove", function (e) {
      var rect = container.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width - 0.5;
      var py = (e.clientY - rect.top) / rect.height - 0.5;
      targetTiltY = Math.max(-1, Math.min(1, px)) * 0.3;
      targetTiltX = Math.max(-1, Math.min(1, py)) * -0.18;
    }, { passive: true });
  }

  canvas.addEventListener("webglcontextlost", function (e) { e.preventDefault(); stop(); }, false);
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
