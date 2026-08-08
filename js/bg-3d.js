import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

(function () {
  "use strict";

  var canvas = document.getElementById("bg-3d-canvas");
  if (!canvas) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isTiny = window.matchMedia("(max-width: 560px)").matches;

  /* Skip the ambient full-page scene on small phones — keep the budget for
     the hero visual and card tilts, protect battery/scroll smoothness. */
  if (isTiny) {
    canvas.style.display = "none";
    return;
  }

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: false,
      powerPreference: "low-power"
    });
  } catch (e) {
    renderer = null;
  }
  if (!renderer) {
    canvas.style.display = "none";
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 60);
  camera.position.set(0, 0, 10);

  var ambient = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambient);
  var accentLight = new THREE.PointLight(0x00e5ff, 2, 30);
  accentLight.position.set(0, 0, 8);
  scene.add(accentLight);

  /* World group — moves opposite to scroll so the page feels like it is
     travelling through one continuous 3D space. */
  var world = new THREE.Group();
  scene.add(world);

  function docHeight() {
    return Math.max(document.documentElement.scrollHeight, window.innerHeight);
  }

  var WORLD_UNITS_PER_PAGE = 26; /* how many 3D units the full document height maps to */

  /* ---------------- Starfield ---------------- */
  function sparkTexture() {
    var size = 64;
    var c = document.createElement("canvas");
    c.width = c.height = size;
    var ctx = c.getContext("2d");
    var grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.5, "rgba(255,255,255,0.45)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(c);
  }
  var starTex = sparkTexture();

  var STAR_COUNT = 260;
  var starPositions = new Float32Array(STAR_COUNT * 3);
  var worldDepth = WORLD_UNITS_PER_PAGE * 2;
  for (var i = 0; i < STAR_COUNT; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 22;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * worldDepth;
    starPositions[i * 3 + 2] = -Math.random() * 14 - 1;
  }
  var starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  var starMat = new THREE.PointsMaterial({
    size: 0.05,
    map: starTex,
    transparent: true,
    opacity: 0.55,
    color: 0x00e5ff,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  });
  var stars = new THREE.Points(starGeo, starMat);
  world.add(stars);

  /* ---------------- Floating wireframe shards, one roughly per section ---------------- */
  var shardGeoms = [
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.OctahedronGeometry(1, 0),
    new THREE.TetrahedronGeometry(1.1, 0)
  ];
  var SHARD_COUNT = 7;
  var shards = [];
  for (var s = 0; s < SHARD_COUNT; s++) {
    var geo = shardGeoms[s % shardGeoms.length];
    var edges = new THREE.EdgesGeometry(geo);
    var mat = new THREE.LineBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.28 });
    var mesh = new THREE.LineSegments(edges, mat);
    var scale = 0.6 + Math.random() * 0.9;
    mesh.scale.setScalar(scale);
    mesh.position.set(
      (Math.random() > 0.5 ? 1 : -1) * (4 + Math.random() * 6),
      -(s / SHARD_COUNT) * worldDepth + worldDepth * 0.15,
      -3 - Math.random() * 6
    );
    mesh.userData.spin = (Math.random() - 0.5) * 0.0004;
    world.add(mesh);
    shards.push(mesh);
  }

  /* ---------------- Theme presets ---------------- */
  var PRESETS = {
    dark: { accent: "#00e5ff", starOpacity: 0.55, shardOpacity: 0.28, ambient: 0.7, key: 2 },
    light: { accent: "#00808f", starOpacity: 0.3, shardOpacity: 0.16, ambient: 1.1, key: 1.1 }
  };

  function applyTheme(theme) {
    var p = PRESETS[theme] || PRESETS.dark;
    var color = new THREE.Color(p.accent);
    starMat.color.copy(color);
    starMat.opacity = p.starOpacity;
    shards.forEach(function (m) {
      m.material.color.copy(color);
      m.material.opacity = p.shardOpacity;
    });
    ambient.intensity = p.ambient;
    accentLight.color.copy(color);
    accentLight.intensity = p.key;
  }

  applyTheme(document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");
  document.addEventListener("themechange", function (e) {
    applyTheme(e.detail && e.detail.theme === "light" ? "light" : "dark");
    if (reduceMotion) render();
  });

  /* ---------------- Sizing ---------------- */
  function resize() {
    var w = window.innerWidth, h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    render();
  }
  window.addEventListener("resize", resize);
  resize();

  /* ---------------- Scroll-driven world movement ---------------- */
  var targetScrollY = 0, worldY = 0;
  var targetTiltX = 0, targetTiltY = 0, tiltX = 0, tiltY = 0;

  function updateScrollTarget() {
    var page = docHeight() - window.innerHeight;
    var progress = page > 0 ? window.scrollY / page : 0;
    targetScrollY = progress * WORLD_UNITS_PER_PAGE;
  }
  window.addEventListener("scroll", updateScrollTarget, { passive: true });
  updateScrollTarget();

  var recomputeTimer = null;
  var mo = new MutationObserver(function () {
    clearTimeout(recomputeTimer);
    recomputeTimer = setTimeout(updateScrollTarget, 300);
  });
  mo.observe(document.body, { childList: true, subtree: true });

  function onPointerMove(e) {
    targetTiltY = (e.clientX / window.innerWidth - 0.5) * 0.12;
    targetTiltX = (e.clientY / window.innerHeight - 0.5) * -0.08;
  }
  if (!reduceMotion) {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
  }

  /* ---------------- Render loop ---------------- */
  var running = false;

  function render() {
    renderer.render(scene, camera);
  }

  function frame(time) {
    if (!running) return;

    if (!reduceMotion) {
      worldY += (targetScrollY - worldY) * 0.06;
      tiltX += (targetTiltX - tiltX) * 0.04;
      tiltY += (targetTiltY - tiltY) * 0.04;
      world.position.y = worldY;
      world.rotation.x = tiltX;
      world.rotation.y = tiltY;
      shards.forEach(function (m) { m.rotation.y += m.userData.spin * 16; m.rotation.x += m.userData.spin * 10; });
      stars.rotation.y += 0.00002;
    }

    render();
    requestAnimationFrame(frame);
  }

  function start() {
    if (reduceMotion) {
      render();
      return;
    }
    if (running) return;
    running = true;
    requestAnimationFrame(frame);
  }

  function stop() { running = false; }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { stop(); } else { start(); }
  });

  canvas.addEventListener("webglcontextlost", function (e) {
    e.preventDefault();
    stop();
  }, false);

  start();
})();
