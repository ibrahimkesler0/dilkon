import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import categoryMap from "./brainCategories.json";

const BROCA_RE = /Opercular part of inferior frontal|Triangular part of inferior frontal/i;
const WERNICKE_RE = /Superior temporal gyrus|Supramarginal gyrus|Angular gyrus|Transverse temporal/i;
const MOTOR_RE = /Precentral gyrus/i;
const SPEECH_TRACT_RE = /Arcuate fasciculus|Frontal aslant|Superior longitudinal|Uncinate|Inferior longitudinal/i;

// Normalize GLB node names because Three.js GLTFLoader sanitizes dots/spaces/brackets
const normKey = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
const NORM_CATEGORY_MAP = new Map();
for (const [rawName, cat] of Object.entries(categoryMap)) {
  NORM_CATEGORY_MAP.set(normKey(rawName), {
    rawName,
    cat,
    isLeft: /\.l\s*$/i.test(rawName),
  });
}

export const REGION_LABELS = {
  idle: "SOL YARIMKÜRE · DİL MERKEZİ",
  broca: "BROCA ALANI · KONUŞMA ÜRETİMİ & AKICILIK",
  wernicke: "WERNICKE ALANI · DİL ANLAMA & İŞİTME",
  motor: "MOTOR KORTEKS · ARTİKÜLASYON KONTROLÜ",
  tracts: "ARKUAT FASİKÜL · SİNİR AĞLARI",
  cerebellum: "SEREBELLUM · RİTİM & KOORDİNASYON",
  brainstem: "BEYİN SAPI · SES & FONASYON YOLU",
  all: "BÜTÜNCÜL DİL & KONUŞMA AĞI",
};

// Camera yaw/pitch nudges to frame each anatomical focus cleanly
const REGION_ANGLES = {
  idle: { ry: 0, rx: 0, explode: 0, shell: 1 },
  broca: { ry: 0.25, rx: 0.05, explode: 0.14, shell: 0.82 },
  wernicke: { ry: -0.22, rx: 0.08, explode: 0.14, shell: 0.82 },
  motor: { ry: 0.05, rx: 0.34, explode: 0.12, shell: 0.85 },
  tracts: { ry: 0.12, rx: 0.08, explode: 0.36, shell: 0.28 },
  cerebellum: { ry: -0.58, rx: -0.24, explode: 0.16, shell: 0.78 },
  brainstem: { ry: 0.65, rx: -0.28, explode: 0.22, shell: 0.45 },
  all: { ry: 0.15, rx: 0.14, explode: 0.24, shell: 0.5 },
};

function classifyNode(obj) {
  const entry =
    NORM_CATEGORY_MAP.get(normKey(obj.name)) ||
    NORM_CATEGORY_MAP.get(normKey(obj.parent?.name));
  if (!entry) return null;

  const { rawName, cat, isLeft } = entry;

  if (cat === "cerebellum") return "cerebellum";
  if (cat === "brainstem") return "brainstem";
  if (cat === "tracts") {
    return SPEECH_TRACT_RE.test(rawName) ? "tracts" : "deepCore";
  }
  if (cat === "diencephalon" || cat === "deep_grey") return "deepCore";

  if (cat === "cortex") {
    if (isLeft && BROCA_RE.test(rawName)) return "broca";
    if (isLeft && WERNICKE_RE.test(rawName)) return "wernicke";
    if (isLeft && MOTOR_RE.test(rawName)) return "motor";
    return isLeft ? "cortexLeft" : "cortexRight";
  }
  return null;
}

function normalizeGeometry(srcGeo, matrixWorld) {
  let g = srcGeo.clone();
  if (!g.attributes.normal) g.computeVertexNormals();
  g.applyMatrix4(matrixWorld);
  if (g.index) g = g.toNonIndexed();
  for (const key of Object.keys(g.attributes)) {
    if (key !== "position" && key !== "normal") g.deleteAttribute(key);
  }
  g.morphAttributes = {};
  g.clearGroups();
  return g;
}

function getBoxCenter(geo) {
  geo.computeBoundingBox();
  return geo.boundingBox.getCenter(new THREE.Vector3());
}

export function initBrainStage({ canvas, onProgress, onReady, onTelemetry }) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
  } catch {
    onReady?.();
    return createNoopController();
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  const scene = new THREE.Scene();

  // Studio PBR environment lighting
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.65;

  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0.05, 8.2);

  // Sculptural 3-point clinical studio lighting
  const hemi = new THREE.HemisphereLight(0xfffaf2, 0x2a2f38, 0.85);
  scene.add(hemi);

  const keyLight = new THREE.DirectionalLight(0xfff4e4, 2.2);
  keyLight.position.set(4.5, 5.5, 6);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xd97a54, 1.35);
  rimLight.position.set(-5, 2.5, -4);
  scene.add(rimLight);

  const fillLight = new THREE.DirectionalLight(0x9bc4b8, 0.65);
  fillLight.position.set(-4, -3, 3.5);
  scene.add(fillLight);

  const coreGlow = new THREE.PointLight(0xe07b52, 0, 8, 2);
  coreGlow.position.set(0, 0, 0);
  scene.add(coreGlow);

  // Root transform hierarchy
  const stageRoot = new THREE.Group();
  scene.add(stageRoot);

  const brainPivot = new THREE.Group();
  stageRoot.add(brainPivot);

  // Minimal precision meridian arcs around the brain sculpture
  const ringsGroup = new THREE.Group();
  stageRoot.add(ringsGroup);

  const ringMat1 = new THREE.MeshBasicMaterial({
    color: 0xb85635,
    transparent: true,
    opacity: 0.24,
  });
  const ringMat2 = new THREE.MeshBasicMaterial({
    color: 0x2d5e52,
    transparent: true,
    opacity: 0.18,
  });

  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.18, 0.0045, 8, 180), ringMat1);
  ring1.rotation.set(Math.PI / 2.25, 0.22, 0);
  ringsGroup.add(ring1);

  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.55, 0.0035, 8, 180), ringMat2);
  ring2.rotation.set(Math.PI / 2.8, -0.42, 0.3);
  ringsGroup.add(ring2);

  // Subtle architectural dust motes
  const moteCount = 160;
  const motePos = new Float32Array(moteCount * 3);
  for (let i = 0; i < moteCount; i++) {
    const r = 2.6 + Math.random() * 4.4;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    motePos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    motePos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    motePos[i * 3 + 2] = r * Math.cos(ph) - 1.2;
  }
  const moteGeo = new THREE.BufferGeometry();
  moteGeo.setAttribute("position", new THREE.BufferAttribute(motePos, 3));
  const moteMat = new THREE.PointsMaterial({
    color: 0x121417,
    size: 0.024,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
  });
  const motes = new THREE.Points(moteGeo, moteMat);
  scene.add(motes);

  // Material palette (sculpted travertine on light paper -> luminous alabaster on obsidian)
  const PALETTE = {
    alabasterLight: new THREE.Color(0xcbc0ae),
    alabasterDark: new THREE.Color(0xe0d8ca),
    terracotta: new THREE.Color(0xc95a34),
    terracottaGlow: new THREE.Color(0xeb7046),
    sage: new THREE.Color(0x287865),
    sageGlow: new THREE.Color(0x3ba68e),
    goldTract: new THREE.Color(0xe0844c),
    bronzeCore: new THREE.Color(0x6e5b4e),
    black: new THREE.Color(0x000000),
    inkMote: new THREE.Color(0x181b20),
    paperMote: new THREE.Color(0xf2eee6),
  };

  // Sculptural parts map populated after GLB load
  const parts = {};
  const partMeta = {};

  // Scroll + interactive state (target vs current for buttery lerp)
  const target = {
    x: 1.48,
    y: 0.06,
    z: 0,
    rotX: 0.08,
    rotY: -1.18, // left-hemisphere heroic 3/4 view
    rotZ: 0.02,
    scale: 1.0,
    explode: 0,
    shellOpacity: 1,
    ringOpacity: 1,
    darkMode: 0, // 0 = paper light, 1 = obsidian dark
    camZ: 8.2,
    sceneOpacity: 1,
    highlight: "idle",
  };

  const current = { ...target };

  // Interactive overrides (hovering a service or swiping a review)
  let activeServiceRegion = null;
  let reviewSpinOffset = 0;
  let inspectMode = false;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  const dragOffset = { rx: 0, ry: 0, trx: 0, try: 0 };

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener(
    "pointermove",
    (e) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
      if (inspectMode && isDragging) {
        dragOffset.try += (e.clientX - dragStartX) * 0.008;
        dragOffset.trx = THREE.MathUtils.clamp(dragOffset.trx + (e.clientY - dragStartY) * 0.006, -1.1, 1.1);
        dragStartX = e.clientX;
        dragStartY = e.clientY;
      }
    },
    { passive: true }
  );

  canvas.addEventListener("pointerdown", (e) => {
    if (!inspectMode) return;
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });

  window.addEventListener("pointerup", () => {
    isDragging = false;
  });

  // Load real Apache-2.0 MRI-derived 3D human brain GLB
  const draco = new DRACOLoader();
  draco.setDecoderPath("/draco/");
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);

  loader.load(
    "/models/brain.glb",
    (gltf) => {
      gltf.scene.updateMatrixWorld(true);

      const buckets = {
        cortexLeft: [],
        cortexRight: [],
        broca: [],
        wernicke: [],
        motor: [],
        tracts: [],
        cerebellum: [],
        brainstem: [],
        deepCore: [],
      };

      gltf.scene.traverse((obj) => {
        if (!obj.isMesh || !obj.geometry) return;
        const groupKey = classifyNode(obj);
        if (!groupKey) return;
        const norm = normalizeGeometry(obj.geometry, obj.matrixWorld);
        if (norm.attributes.position.count > 0) {
          buckets[groupKey].push(norm);
        }
      });

      const merged = {};
      for (const [key, list] of Object.entries(buckets)) {
        if (!list.length) continue;
        const geo = mergeGeometries(list, false);
        list.forEach((g) => g.dispose());
        if (geo) merged[key] = geo;
      }

      // Compute exact anatomical canonical orientation from real centroids
      const cLeft = merged.cortexLeft ? getBoxCenter(merged.cortexLeft) : new THREE.Vector3(-1, 0, 0);
      const cRight = merged.cortexRight ? getBoxCenter(merged.cortexRight) : new THREE.Vector3(1, 0, 0);
      const cBroca = merged.broca ? getBoxCenter(merged.broca) : new THREE.Vector3(0, 0, 1);
      const cCereb = merged.cerebellum ? getBoxCenter(merged.cerebellum) : new THREE.Vector3(0, -1, -1);

      const leftAxis = new THREE.Vector3().subVectors(cLeft, cRight).normalize();
      const frontHint = new THREE.Vector3().subVectors(cBroca, cCereb).normalize();
      const upAxis = new THREE.Vector3().crossVectors(frontHint, leftAxis).normalize();
      // Ensure cortex is strictly above brainstem (+Y = superior)
      if (merged.brainstem) {
        const cStem = getBoxCenter(merged.brainstem);
        const cTop = cLeft.clone().add(cRight).multiplyScalar(0.5);
        if (new THREE.Vector3().subVectors(cTop, cStem).dot(upAxis) < 0) {
          upAxis.negate();
        }
      }
      const frontAxis = new THREE.Vector3().crossVectors(leftAxis, upAxis).normalize();

      const basis = new THREE.Matrix4().makeBasis(leftAxis, upAxis, frontAxis);
      const alignMat = basis.clone().invert();

      // Apply alignment and compute unified bounding box
      const wholeBox = new THREE.Box3();
      for (const geo of Object.values(merged)) {
        geo.applyMatrix4(alignMat);
        geo.computeBoundingBox();
        wholeBox.union(geo.boundingBox);
      }

      const center = wholeBox.getCenter(new THREE.Vector3());
      const size = wholeBox.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const normScale = 3.25 / maxDim;

      const normMat = new THREE.Matrix4()
        .makeScale(normScale, normScale, normScale)
        .multiply(new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z));

      // Create sculpted meshes with outward explode vectors
      const explodeDirs = {
        cortexLeft: new THREE.Vector3(0.95, 0.12, 0.05),
        cortexRight: new THREE.Vector3(-1.15, 0.14, 0.05),
        broca: new THREE.Vector3(1.05, 0.08, 0.35),
        wernicke: new THREE.Vector3(1.05, 0.02, -0.25),
        motor: new THREE.Vector3(0.9, 0.38, 0.04),
        cerebellum: new THREE.Vector3(0, -0.65, -0.65),
        brainstem: new THREE.Vector3(0, -0.8, -0.1),
        tracts: new THREE.Vector3(0, 0, 0),
        deepCore: new THREE.Vector3(0, 0, 0),
      };

      for (const [key, geo] of Object.entries(merged)) {
        geo.applyMatrix4(normMat);

        const isOuterShell = key === "cortexLeft" || key === "cortexRight";
        const isTract = key === "tracts";
        const isCore = key === "deepCore";

        const mat = new THREE.MeshPhysicalMaterial({
          color: isTract
            ? PALETTE.goldTract.clone()
            : isCore
              ? PALETTE.bronzeCore.clone()
              : PALETTE.alabasterLight.clone(),
          roughness: isTract ? 0.28 : isOuterShell ? 0.44 : 0.38,
          metalness: isTract ? 0.25 : 0.04,
          clearcoat: isOuterShell ? 0.22 : 0.35,
          clearcoatRoughness: 0.32,
          transparent: isOuterShell || isTract,
          opacity: 1,
          emissive: isTract ? PALETTE.terracottaGlow.clone() : PALETTE.black.clone(),
          emissiveIntensity: isTract ? 0.45 : 0,
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.name = key;
        if (isOuterShell) mesh.renderOrder = 2;
        if (isTract) mesh.renderOrder = 1;

        brainPivot.add(mesh);
        parts[key] = mesh;
        partMeta[key] = {
          explodeDir: explodeDirs[key] || new THREE.Vector3(),
          isOuterShell,
          isTract,
          isCore,
          glow: 0,
        };
      }

      draco.dispose();
      onProgress?.(100);
      onReady?.();
    },
    (xhr) => {
      if (xhr.total > 0) {
        onProgress?.(Math.min(96, Math.round((xhr.loaded / xhr.total) * 96)));
      }
    },
    () => {
      onReady?.();
    }
  );

  // Viewport responsive layout multiplier
  let isMobile = false;
  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    isMobile = w < 960;
  }
  window.addEventListener("resize", resize);
  resize();

  // Main render loop
  const clock = new THREE.Clock();
  const tmpColor = new THREE.Color();
  const tmpEmissive = new THREE.Color();
  let lastTelemetryTime = 0;

  function tick() {
    requestAnimationFrame(tick);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    const k = 1 - Math.exp(-dt * 5.2);

    // Effective region & nudges
    const activeRegion = activeServiceRegion || target.highlight || "idle";
    const regAngle = REGION_ANGLES[activeRegion] || REGION_ANGLES.idle;

    const goalX = isMobile ? 0 : target.x;
    const goalY = isMobile ? target.y * 0.5 + 0.15 : target.y;
    const goalScale = target.scale * (isMobile ? 0.68 : 1);
    const goalExplode = Math.max(target.explode, activeServiceRegion ? regAngle.explode : 0);
    const goalShell = activeServiceRegion ? Math.min(target.shellOpacity, regAngle.shell) : target.shellOpacity;

    current.x = THREE.MathUtils.lerp(current.x, goalX, k);
    current.y = THREE.MathUtils.lerp(current.y, goalY, k);
    current.z = THREE.MathUtils.lerp(current.z, target.z, k);
    current.rotX = THREE.MathUtils.lerp(current.rotX, target.rotX + (activeServiceRegion ? regAngle.rx : 0), k);
    current.rotY = THREE.MathUtils.lerp(
      current.rotY,
      target.rotY + reviewSpinOffset + (activeServiceRegion ? regAngle.ry : 0),
      k
    );
    current.rotZ = THREE.MathUtils.lerp(current.rotZ, target.rotZ, k);
    current.scale = THREE.MathUtils.lerp(current.scale, goalScale, k);
    current.explode = THREE.MathUtils.lerp(current.explode, goalExplode, k);
    current.shellOpacity = THREE.MathUtils.lerp(current.shellOpacity, goalShell, k);
    current.ringOpacity = THREE.MathUtils.lerp(current.ringOpacity, target.ringOpacity, k);
    current.darkMode = THREE.MathUtils.lerp(current.darkMode, target.darkMode, k);
    current.camZ = THREE.MathUtils.lerp(current.camZ, target.camZ + (isMobile ? 1.8 : 0), k);
    current.sceneOpacity = THREE.MathUtils.lerp(current.sceneOpacity, target.sceneOpacity, k);

    pointer.x = THREE.MathUtils.lerp(pointer.x, pointer.tx, 0.06);
    pointer.y = THREE.MathUtils.lerp(pointer.y, pointer.ty, 0.06);
    dragOffset.rx = THREE.MathUtils.lerp(dragOffset.rx, inspectMode ? dragOffset.trx : 0, 0.09);
    dragOffset.ry = THREE.MathUtils.lerp(dragOffset.ry, inspectMode ? dragOffset.try : 0, 0.09);

    // Subtle breathing motion (alive even when scroll is paused)
    const breathe = reduceMotion ? 0 : Math.sin(t * 0.9) * 0.055;
    const idleSpin = reduceMotion ? 0 : Math.sin(t * 0.45) * 0.08;

    stageRoot.position.set(current.x, current.y + breathe, current.z);
    stageRoot.scale.setScalar(current.scale);

    brainPivot.rotation.set(
      current.rotX + pointer.y * 0.14 + dragOffset.rx,
      current.rotY + pointer.x * 0.24 + idleSpin + dragOffset.ry,
      current.rotZ
    );

    camera.position.z = current.camZ;
    canvas.style.opacity = String(isMobile ? Math.min(current.sceneOpacity, 0.48) : current.sceneOpacity);

    // Update each anatomical part (explode + glow + translucent shell)
    const pulse = 0.5 + 0.5 * Math.sin(t * 2.6);
    const baseAlabaster = tmpColor.lerpColors(PALETTE.alabasterLight, PALETTE.alabasterDark, current.darkMode);

    for (const [key, mesh] of Object.entries(parts)) {
      const meta = partMeta[key];
      const mat = mesh.material;

      // Exploded-view offset
      mesh.position.copy(meta.explodeDir).multiplyScalar(current.explode * 0.85);

      // Is this region highlighted right now?
      const isIdleAccent = activeRegion === "idle" && (key === "broca" || key === "wernicke");
      const isActive =
        activeRegion === key ||
        (activeRegion === "all" && !meta.isOuterShell && !meta.isCore) ||
        (activeRegion === "broca" && key === "tracts");

      const targetGlow = isActive ? 1 : isIdleAccent ? 0.42 : 0;
      meta.glow = THREE.MathUtils.lerp(meta.glow, targetGlow, k * 1.2);

      if (meta.isOuterShell) {
        mat.color.copy(baseAlabaster);
        // Right hemisphere fades slightly more when exploded to reveal left-hemisphere language tracts
        const shellTargetOp = key === "cortexRight" ? Math.max(0.16, current.shellOpacity - current.explode * 0.55) : current.shellOpacity;
        mat.opacity = shellTargetOp;
        mat.depthWrite = shellTargetOp > 0.88;
        mat.emissiveIntensity = current.darkMode * 0.06;
        mat.emissive.setHex(0x28231e);
      } else if (meta.isTract) {
        const tractVis = Math.max(0.55, meta.glow);
        mat.opacity = 0.92;
        mat.emissive.copy(activeRegion === "wernicke" || activeRegion === "cerebellum" ? PALETTE.sageGlow : PALETTE.terracottaGlow);
        mat.emissiveIntensity = 0.35 + tractVis * (0.75 + pulse * 0.45);
      } else if (meta.isCore) {
        mat.color.copy(PALETTE.bronzeCore);
        mat.emissiveIntensity = current.explode * 0.15;
        mat.emissive.setHex(0x3a241a);
      } else {
        // Highlightable speech / language regions
        const useSage = key === "wernicke" || key === "cerebellum";
        const accentBase = useSage ? PALETTE.sage : PALETTE.terracotta;
        const accentGlow = useSage ? PALETTE.sageGlow : PALETTE.terracottaGlow;

        mat.color.copy(baseAlabaster).lerp(accentBase, meta.glow * 0.88);
        tmpEmissive.copy(accentGlow);
        mat.emissive.copy(tmpEmissive);
        mat.emissiveIntensity = meta.glow * (0.48 + pulse * 0.34);
      }
    }

    // Internal accent light glows stronger when cortex opens or region is highlighted
    coreGlow.intensity = (current.explode * 10 + (activeRegion !== "idle" ? 4.5 : 0)) * (0.85 + pulse * 0.25);

    // Adapt lighting & ambient rings/motes smoothly between Light Paper and Dark Obsidian sections
    scene.environmentIntensity = THREE.MathUtils.lerp(0.7, 0.52, current.darkMode);
    keyLight.intensity = THREE.MathUtils.lerp(2.1, 2.45, current.darkMode);
    rimLight.intensity = THREE.MathUtils.lerp(1.15, 2.1, current.darkMode);

    ring1.rotation.z = t * 0.14;
    ring2.rotation.z = -t * 0.1;
    ringMat1.opacity = current.ringOpacity * THREE.MathUtils.lerp(0.24, 0.36, current.darkMode);
    ringMat2.opacity = current.ringOpacity * THREE.MathUtils.lerp(0.18, 0.28, current.darkMode);

    motes.rotation.y = t * 0.018;
    moteMat.color.lerpColors(PALETTE.inkMote, PALETTE.paperMote, current.darkMode);
    moteMat.opacity = THREE.MathUtils.lerp(0.18, 0.34, current.darkMode) * current.sceneOpacity;

    renderer.render(scene, camera);

    // Emit HUD telemetry ~12fps
    if (onTelemetry && t - lastTelemetryTime > 0.08) {
      lastTelemetryTime = t;
      const deg = (((Math.round(THREE.MathUtils.radToDeg(brainPivot.rotation.y)) % 360) + 360) % 360)
        .toString()
        .padStart(3, "0");
      onTelemetry({
        deg,
        regionLabel: REGION_LABELS[activeRegion] || REGION_LABELS.idle,
        dark: current.darkMode > 0.5,
      });
    }
  }

  tick();

  return {
    target,
    setRegionFocus(regionKey) {
      activeServiceRegion = regionKey || null;
    },
    nudgeReview(dir = 1) {
      reviewSpinOffset += dir * 0.38;
    },
    setInspectMode(enabled) {
      inspectMode = !!enabled;
      canvas.style.pointerEvents = inspectMode ? "auto" : "none";
      canvas.style.cursor = inspectMode ? "grab" : "default";
      if (!inspectMode) {
        dragOffset.trx = 0;
        dragOffset.try = 0;
      }
    },
  };
}

function createNoopController() {
  return {
    target: {},
    setRegionFocus() {},
    nudgeReview() {},
    setInspectMode() {},
  };
}
