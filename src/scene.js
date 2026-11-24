import * as THREE from "three";

// Simplex noise (Ashima Arts / Stefan Gustavson), GLSL
const noiseGLSL = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const blobVertex = /* glsl */ `
uniform float uTime;
uniform float uAmp;
varying vec3 vNormal;
varying vec3 vView;
varying float vNoise;
${noiseGLSL}
void main(){
  vec3 p = position;
  float n = snoise(normal * 1.4 + vec3(uTime * 0.35));
  float n2 = snoise(normal * 3.2 - vec3(uTime * 0.5)) * 0.35;
  float d = (n + n2) * uAmp;
  p += normal * d;
  vNoise = d;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vView = normalize(-mv.xyz);
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * mv;
}`;

const blobFragment = /* glsl */ `
uniform float uTime;
varying vec3 vNormal;
varying vec3 vView;
varying float vNoise;
void main(){
  vec3 coral = vec3(1.0, 0.478, 0.349);
  vec3 sun   = vec3(1.0, 0.776, 0.361);
  vec3 teal  = vec3(0.098, 0.702, 0.651);
  vec3 blue  = vec3(0.145, 0.341, 0.839);
  float fres = pow(1.0 - max(dot(normalize(vNormal), normalize(vView)), 0.0), 2.2);
  float t = vNoise * 2.2 + 0.5 + sin(uTime * 0.4) * 0.15;
  vec3 col = mix(blue, teal, smoothstep(0.0, 0.5, t));
  col = mix(col, coral, smoothstep(0.45, 0.85, t));
  col = mix(col, sun, smoothstep(0.8, 1.1, t));
  vec3 light = normalize(vec3(0.6, 0.8, 0.7));
  float diff = max(dot(normalize(vNormal), light), 0.0);
  float spec = pow(max(dot(reflect(-light, normalize(vNormal)), normalize(vView)), 0.0), 28.0);
  col = col * (0.55 + 0.6 * diff) + spec * 0.6 + fres * vec3(0.75, 0.85, 1.0) * 0.9;
  gl_FragColor = vec4(col, 1.0);
}`;

function makeBubbleShape() {
  const s = new THREE.Shape();
  const w = 1.6, h = 1.1, r = 0.42;
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(-w / 2 + 0.55, -h / 2);
  s.lineTo(-w / 2 + 0.2, -h / 2 - 0.42); // tail
  s.lineTo(-w / 2 + 0.95, -h / 2);
  s.lineTo(w / 2 - r, -h / 2);
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r);
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r);
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  return s;
}

export function initHeroScene(canvas) {
  if (!canvas) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    return; // WebGL desteklenmiyor
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  const root = new THREE.Group();
  scene.add(root);

  // Lights for standard materials
  scene.add(new THREE.AmbientLight(0xffffff, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(3, 4, 5);
  scene.add(key);
  const rim = new THREE.PointLight(0xff7a59, 30, 20);
  rim.position.set(-4, -2, 3);
  scene.add(rim);

  // --- Voice blob ---
  const blobUniforms = { uTime: { value: 0 }, uAmp: { value: 0.28 } };
  const blob = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.55, 64),
    new THREE.ShaderMaterial({ vertexShader: blobVertex, fragmentShader: blobFragment, uniforms: blobUniforms })
  );
  root.add(blob);

  // --- Sound-wave rings ---
  const rings = [];
  const ringColors = [0xffc65c, 0x19b3a6, 0xff7a59, 0xffffff];
  for (let i = 0; i < 4; i++) {
    const pts = [];
    const segs = 256;
    for (let j = 0; j <= segs; j++) {
      const a = (j / segs) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a), Math.sin(a), 0));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const line = new THREE.LineLoop(
      geo,
      new THREE.LineBasicMaterial({ color: ringColors[i], transparent: true, opacity: 0.55 - i * 0.08 })
    );
    line.userData = { base: 2.2 + i * 0.42, phase: i * 1.3, freq: 6 + i * 2, basePts: pts.map((p) => p.clone()) };
    line.rotation.x = Math.PI / 2.3 + i * 0.12;
    line.rotation.y = i * 0.35;
    root.add(line);
    rings.push(line);
  }

  // --- Floating speech bubbles ---
  const bubbleGeo = new THREE.ExtrudeGeometry(makeBubbleShape(), {
    depth: 0.28, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.1, bevelSegments: 6, curveSegments: 24,
  });
  bubbleGeo.center();
  const dotGeo = new THREE.SphereGeometry(0.11, 20, 20);
  const bubbleDefs = [
    { color: 0xffffff, dot: 0x0b1e3f, pos: [-2.6, 1.6, 0.6], scale: 0.62, speed: 0.6 },
    { color: 0xffc65c, dot: 0x0b1e3f, pos: [2.5, 1.9, -0.4], scale: 0.48, speed: 0.8 },
    { color: 0x19b3a6, dot: 0xffffff, pos: [2.3, -1.9, 0.8], scale: 0.55, speed: 0.7 },
    { color: 0xff7a59, dot: 0xffffff, pos: [-2.2, -1.8, -0.6], scale: 0.42, speed: 0.9 },
  ];
  const bubbles = bubbleDefs.map((d, i) => {
    const g = new THREE.Group();
    const m = new THREE.Mesh(
      bubbleGeo,
      new THREE.MeshPhysicalMaterial({ color: d.color, roughness: 0.25, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.15 })
    );
    g.add(m);
    const dm = new THREE.MeshStandardMaterial({ color: d.dot, roughness: 0.4 });
    for (let k = -1; k <= 1; k++) {
      const dot = new THREE.Mesh(dotGeo, dm);
      dot.position.set(k * 0.36, 0.05, 0.3);
      g.add(dot);
    }
    g.position.set(...d.pos);
    g.scale.setScalar(d.scale);
    g.userData = { ...d, offset: i * 1.7, basePos: new THREE.Vector3(...d.pos) };
    root.add(g);
    return g;
  });

  // --- Particles ---
  const pCount = 420;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const r = 3 + Math.random() * 5;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    pPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    pPos[i * 3 + 2] = r * Math.cos(ph) - 2;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  const particles = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({ color: 0xffffff, size: 0.035, transparent: true, opacity: 0.6, depthWrite: false })
  );
  scene.add(particles);

  // Optional custom GLB model: drop any .glb file into src/models/ to replace the blob
  const glbFiles = Object.values(import.meta.glob("./models/*.glb", { query: "?url", import: "default", eager: true }));
  if (glbFiles.length) {
    import("three/examples/jsm/loaders/GLTFLoader.js").then(({ GLTFLoader }) => {
      new GLTFLoader().load(glbFiles[0], (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        const holder = new THREE.Group();
        holder.add(model);
        holder.scale.setScalar(3.6 / size);
        blob.visible = false;
        root.add(holder);
        root.userData.custom = holder;
      });
    });
  }

  // --- Layout / interaction ---
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener("pointermove", (e) => {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  let scrollY = 0;
  window.addEventListener("scroll", () => { scrollY = window.scrollY; }, { passive: true });

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const mobile = w < 900;
    const compact = w >= 900 && w < 1240;
    root.position.x = mobile ? 0 : compact ? 2.15 : 2.85;
    root.position.y = mobile ? -1.6 : 0;
    root.scale.setScalar(mobile ? 0.62 : compact ? 0.84 : 1);
    canvas.style.opacity = mobile ? "0.55" : "1";
  }
  window.addEventListener("resize", resize);
  resize();

  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);

  const clock = new THREE.Clock();
  const tmp = new THREE.Vector3();

  function tick() {
    requestAnimationFrame(tick);
    if (!visible) return;
    const t = clock.getElapsedTime() * (reduce ? 0.2 : 1);

    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;

    blobUniforms.uTime.value = t;
    // "speaking" amplitude pulse
    blobUniforms.uAmp.value = 0.22 + Math.abs(Math.sin(t * 1.6)) * 0.12 * (0.6 + 0.4 * Math.sin(t * 0.7));
    blob.rotation.y = t * 0.15;

    if (root.userData.custom) root.userData.custom.rotation.y = t * 0.4;

    rings.forEach((ring) => {
      const { base, phase, freq, basePts } = ring.userData;
      const pos = ring.geometry.attributes.position;
      for (let j = 0; j < pos.count; j++) {
        const p = basePts[j];
        const a = (j / (pos.count - 1)) * Math.PI * 2;
        const r = base + Math.sin(a * freq + t * 2 + phase) * 0.06 * (1 + Math.sin(t + phase));
        tmp.copy(p).multiplyScalar(r);
        pos.setXYZ(j, tmp.x, tmp.y, tmp.z);
      }
      pos.needsUpdate = true;
      ring.rotation.z = t * 0.1 * (phase % 2 ? 1 : -1);
    });

    bubbles.forEach((b) => {
      const { basePos, speed, offset } = b.userData;
      b.position.y = basePos.y + Math.sin(t * speed + offset) * 0.25;
      b.position.x = basePos.x + Math.cos(t * speed * 0.7 + offset) * 0.12;
      b.rotation.y = Math.sin(t * 0.6 + offset) * 0.45 - pointer.x * 0.3;
      b.rotation.z = Math.sin(t * 0.5 + offset) * 0.12;
    });

    particles.rotation.y = t * 0.02;
    particles.rotation.x = t * 0.01;

    root.rotation.y = pointer.x * 0.35;
    root.rotation.x = pointer.y * 0.2;
    camera.position.y = -scrollY * 0.002;

    renderer.render(scene, camera);
  }
  tick();
}
