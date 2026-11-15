// 3D enamel crest built from the school's logo: laurel wreath, T-over-M monogram, wordmark.
import * as THREE from "three";
import { RoomEnvironment } from "../vendor/jsm/environments/RoomEnvironment.js";
import { FontLoader } from "../vendor/jsm/loaders/FontLoader.js";
import { TextGeometry } from "../vendor/jsm/geometries/TextGeometry.js";

const stage = document.querySelector("[data-crest]");
if (stage) init();

function init() {
  const canvas = stage.querySelector("canvas");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  } catch (e) { stage.classList.add("no-gl"); return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.9;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0, 7.6);

  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(3, 4, 6); scene.add(key);
  const rimL = new THREE.DirectionalLight(0xff8fc8, 0.9); rimL.position.set(-5, -2, -3); scene.add(rimL);

  const C = {
    enamel: new THREE.MeshPhysicalMaterial({ color: 0xfbf8f2, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.12, side: THREE.DoubleSide }),
    rim: new THREE.MeshPhysicalMaterial({ color: 0x24195e, roughness: 0.28, metalness: 0.35, clearcoat: 1, clearcoatRoughness: 0.1 }),
    ink: new THREE.MeshPhysicalMaterial({ color: 0x2a1c72, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.08 }),
    magenta: new THREE.MeshPhysicalMaterial({ color: 0xd9147a, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.08 }),
    leaf: new THREE.MeshPhysicalMaterial({ color: 0x5aa823, roughness: 0.34, clearcoat: 1, clearcoatRoughness: 0.1, sheen: 0.4, sheenColor: new THREE.Color(0xd9ff9c) }),
    stem: new THREE.MeshPhysicalMaterial({ color: 0x5c9a22, roughness: 0.4, clearcoat: 0.6 })
  };

  const crest = new THREE.Group();
  const spin = new THREE.Group();
  spin.add(crest);
  scene.add(spin);

  const R = 1.64, H = 0.18, FZ = H / 2; // disc radius, thickness, front face z

  // enamel disc with a softly rounded edge (lathe profile, rotated to face the camera)
  const prof = [];
  prof.push(new THREE.Vector2(0, H / 2));
  for (let i = 0; i <= 10; i++) { const a = Math.PI / 2 - (i / 10) * Math.PI; prof.push(new THREE.Vector2(R - 0.07 + Math.cos(a) * 0.07, Math.sin(a) * (H / 2))); }
  prof.push(new THREE.Vector2(0, -H / 2));
  const disc = new THREE.Mesh(new THREE.LatheGeometry(prof, 128), C.enamel);
  disc.rotation.x = Math.PI / 2;
  crest.add(disc);

  // indigo rim, front and back
  const ringGeo = new THREE.TorusGeometry(R - 0.12, 0.045, 16, 160);
  const ringF = new THREE.Mesh(ringGeo, C.rim); ringF.position.z = FZ; crest.add(ringF);
  const ringB = ringF.clone(); ringB.position.z = -FZ; crest.add(ringB);

  // monogram: crossbar of the T over a geometric M
  const ext = { depth: 0.09, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.018, bevelSegments: 3, curveSegments: 6 };
  const s = 0.86;
  const P = (pts) => { const sh = new THREE.Shape(); pts.forEach(([x, y], i) => (i ? sh.lineTo(x * s, y * s) : sh.moveTo(x * s, y * s))); sh.closePath(); return sh; };
  // two separate T tops, one over each stem of the M, with a gap in the middle (as on the real logo)
  const barL = P([[-0.8, 0.45], [-0.095, 0.45], [-0.095, 0.57], [-0.8, 0.57]]);
  const barR = P([[0.095, 0.45], [0.8, 0.45], [0.8, 0.57], [0.095, 0.57]]);
  const em = P([[-0.535, -0.4], [-0.535, 0.45], [-0.36, 0.45], [0, -0.14], [0.36, 0.45], [0.535, 0.45], [0.535, -0.4], [0.35, -0.4], [0.35, 0.17], [0, -0.4], [-0.35, 0.17], [-0.35, -0.4]]);
  const mono = new THREE.Mesh(new THREE.ExtrudeGeometry([barL, barR, em], ext), C.ink);
  mono.position.set(0, 0.02, FZ);
  crest.add(mono);

  // laurel: a stem along each side with paired leaves, like the logo
  const leafShape = (() => { const L = 0.27, w = 0.085, sh = new THREE.Shape(); sh.moveTo(0, 0); sh.quadraticCurveTo(w, L * 0.42, 0, L); sh.quadraticCurveTo(-w, L * 0.42, 0, 0); return sh; })();
  const leafGeo = new THREE.ExtrudeGeometry(leafShape, { depth: 0.035, bevelEnabled: true, bevelThickness: 0.018, bevelSize: 0.014, bevelSegments: 3, curveSegments: 10 });
  const WR = 1.3, WC = new THREE.Vector2(0, -0.04);
  const deg = d => (d * Math.PI) / 180;
  const branch = (dir) => {
    // dir -1 = left branch, sweeping from the bottom (262°) up to 128°; dir 1 mirrors it
    const a0 = deg(262), a1 = deg(128), N = 13;
    const pts = [];
    for (let i = 0; i <= 40; i++) {
      const a = a0 + (a1 - a0) * (i / 40);
      pts.push(new THREE.Vector3(-dir * Math.cos(a) * WR + WC.x, WC.y + Math.sin(a) * WR, FZ + 0.03));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    crest.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 60, 0.018, 6, false), C.stem));
    for (let i = 0; i < N; i++) {
      const t = 0.04 + (i / (N - 1)) * 0.92;
      const p = curve.getPoint(t), tg = curve.getTangent(t);
      const ang = Math.atan2(tg.y, tg.x);
      const size = 1.12 - t * 0.38;
      for (const side of [1, -1]) {
        const lf = new THREE.Mesh(leafGeo, C.leaf);
        lf.position.set(p.x, p.y, FZ + 0.005);
        // leaves point forward along the stem, splayed to either side
        lf.rotation.z = ang - Math.PI / 2 + side * deg(38);
        lf.scale.setScalar(size);
        crest.add(lf);
      }
    }
    // tip leaf
    const tip = new THREE.Mesh(leafGeo, C.leaf);
    const p = curve.getPoint(1), tg = curve.getTangent(1);
    tip.position.set(p.x, p.y, FZ + 0.005); tip.rotation.z = Math.atan2(tg.y, tg.x) - Math.PI / 2; tip.scale.setScalar(0.85);
    crest.add(tip);
  };
  branch(1); branch(-1);

  // lettering
  new FontLoader().load("media/helvetiker_bold.typeface.json", (font) => {
    const tg = (str, size) => { const g = new TextGeometry(str, { font, size, depth: 0.05, curveSegments: 5, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.006, bevelSegments: 2 }); g.computeBoundingBox(); return g; };
    // TINY TOT, straight, above the monogram
    const top = new THREE.Mesh(tg("TINY TOT", 0.2), C.magenta);
    const bb = top.geometry.boundingBox;
    top.position.set(-(bb.max.x - bb.min.x) / 2, 0.66, FZ);
    crest.add(top);
    // MONTESSORI on a smile-shaped arc under the M
    const word = "MONTESSORI", r = 0.93, cy = 0.05, span = deg(104);
    const glyphs = [...word].map(ch => { const g = tg(ch, 0.145); return { g, w: g.boundingBox.max.x - g.boundingBox.min.x }; });
    const gap = 0.025; const total = glyphs.reduce((a, b) => a + b.w + gap, -gap);
    let acc = 0;
    glyphs.forEach(({ g, w }) => {
      const mid = acc + w / 2; acc += w + gap;
      const a = deg(270) - span / 2 + (mid / total) * span;
      g.translate(-w / 2, 0, 0);
      const m = new THREE.Mesh(g, C.magenta);
      m.position.set(Math.cos(a) * r, cy + Math.sin(a) * r, FZ);
      m.rotation.z = a + Math.PI / 2; // letter tops face the centre
      crest.add(m);
    });
    // back side
    const back = new THREE.Group(); back.rotation.y = Math.PI; back.position.z = -FZ; crest.add(back);
    const add = (str, size, y, mat) => { const g = tg(str, size); const w = g.boundingBox.max.x - g.boundingBox.min.x; const m = new THREE.Mesh(g, mat); m.position.set(-w / 2, y, 0); back.add(m); };
    add("SINCE", 0.2, 0.42, C.magenta);
    add("2002", 0.62, -0.26, C.ink);
    add("GONAPINUWALA", 0.13, -0.62, C.magenta);
    render();
  });

  // ---------- size ----------
  const resize = () => {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    render();
  };
  new ResizeObserver(resize).observe(stage);

  // ---------- interaction: drag to spin with momentum ----------
  let rotY = -0.35, vel = 0, dragging = false, lastX = 0, lastT = 0, tiltX = 0, tiltTarget = 0;
  stage.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    dragging = true; lastX = e.clientX; lastT = performance.now(); vel = 0;
    stage.setPointerCapture(e.pointerId); stage.classList.add("is-drag", "was-dragged");
    kick();
  });
  stage.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const now = performance.now(), dx = e.clientX - lastX, dt = Math.max(1, now - lastT);
    const k = 6 / stage.clientWidth;
    rotY += dx * k; vel = (dx * k) / dt * 16; lastX = e.clientX; lastT = now;
    kick();
  });
  const end = (e) => { if (!dragging) return; dragging = false; stage.classList.remove("is-drag"); try { stage.releasePointerCapture(e.pointerId); } catch (_) {} kick(); };
  stage.addEventListener("pointerup", end);
  stage.addEventListener("pointercancel", end);
  stage.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { vel -= 0.12; kick(); }
    if (e.key === "ArrowRight") { vel += 0.12; kick(); }
  });
  stage.tabIndex = 0;

  // tilt follows scroll through the section
  const section = stage.closest("section");
  addEventListener("scroll", () => {
    const r = section.getBoundingClientRect();
    const p = (innerHeight - r.top) / (innerHeight + r.height); // 0..1
    tiltTarget = (p - 0.5) * 0.5;
    kick();
  }, { passive: true });

  // ---------- loop (only while visible) ----------
  let visible = false, raf = 0, last = performance.now(), t = 0;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick(); }).observe(stage);
  function kick() { if (!raf && visible) { last = performance.now(); raf = requestAnimationFrame(loop); } }
  function loop(now) {
    raf = 0;
    const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
    if (!dragging) {
      rotY += vel * dt * 60;
      vel *= Math.pow(0.04, dt);             // friction
      if (!reduce && Math.abs(vel) < 0.02) rotY += dt * 0.32; // gentle idle turn
    }
    tiltX += (tiltTarget - tiltX) * Math.min(1, dt * 6);
    spin.rotation.y = rotY;
    spin.rotation.x = tiltX * 0.6;
    crest.position.y = reduce ? 0 : Math.sin(t * 1.3) * 0.05;
    render();
    const settling = Math.abs(vel) > 0.0005 || Math.abs(tiltTarget - tiltX) > 0.001;
    if (visible && (!reduce || dragging || settling)) raf = requestAnimationFrame(loop);
  }
  function render() { renderer.render(scene, camera); }
  resize();
}
