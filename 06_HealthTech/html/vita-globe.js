const THREE_URL = "https://esm.sh/three@0.160.1";
const FONT_LOADER_URL = "https://esm.sh/three@0.160.1/examples/jsm/loaders/FontLoader.js?deps=three@0.160.1";
const TEXT_GEOMETRY_URL = "https://esm.sh/three@0.160.1/examples/jsm/geometries/TextGeometry.js?deps=three@0.160.1";
const FONT_URL = "https://cdn.jsdelivr.net/npm/three@0.160.1/examples/fonts/helvetiker_bold.typeface.json";

let threeModulePromise;
let textModulePromise;

function loadThree() {
  if (!threeModulePromise) threeModulePromise = import(THREE_URL);
  return threeModulePromise;
}

function loadTextTools() {
  if (!textModulePromise) {
    textModulePromise = Promise.all([
      import(FONT_LOADER_URL),
      import(TEXT_GEOMETRY_URL),
      fetch(FONT_URL).then((response) => response.json()),
    ]);
  }
  return textModulePromise;
}

function makeRibbonGeometry(THREE, radius = 1.07, height = 0.32, segments = 168) {
  const positions = [];
  const uvs = [];
  const indices = [];

  for (let i = 0; i <= segments; i += 1) {
    const theta = (i / segments) * Math.PI * 2;
    const x = Math.sin(theta) * radius;
    const z = Math.cos(theta) * radius;

    positions.push(x, -height / 2, z, x, height / 2, z);
    uvs.push(i / segments, 0, i / segments, 1);
  }

  for (let i = 0; i < segments; i += 1) {
    const a = i * 2;
    indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function makeRibbonTexture(THREE) {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 256;

  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#062a2d");
  gradient.addColorStop(0.5, "#0b171c");
  gradient.addColorStop(1, "#041b20");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(124, 224, 197, .38)";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(0, 52);
  ctx.lineTo(canvas.width, 52);
  ctx.moveTo(0, 204);
  ctx.lineTo(canvas.width, 204);
  ctx.stroke();

  ctx.font = "900 118px Inter, Manrope, Segoe UI, Arial, sans-serif";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";

  for (let x = -16; x < canvas.width; x += 510) {
    ctx.fillStyle = "rgba(3, 25, 28, .8)";
    ctx.fillText("VitaFlow", x + 10, 139);
    ctx.fillStyle = "rgba(124, 224, 197, .35)";
    ctx.fillText("VitaFlow", x + 4, 133);
    ctx.fillStyle = "#ffffff";
    ctx.fillText("VitaFlow", x, 128);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function makeGlobeGrid(THREE, group) {
  const material = new THREE.MeshBasicMaterial({
    color: 0xd9fff4,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
  });

  [-0.58, -0.28, 0, 0.28, 0.58].forEach((y) => {
    const radius = Math.sqrt(1 - y * y);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.004, 8, 144), material);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    group.add(ring);
  });

  [0, Math.PI / 4, Math.PI / 2, (Math.PI * 3) / 4].forEach((rotation) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.005, 0.004, 8, 144), material);
    ring.rotation.y = rotation;
    group.add(ring);
  });
}

class VitaGlobe extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: relative;
          display: inline-block;
          width: 64px;
          height: 64px;
          contain: layout paint;
        }

        canvas {
          position: absolute;
          inset: -20%;
          width: 140%;
          height: 140%;
          display: block;
        }

        .fallback {
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #f7fff9;
          background: radial-gradient(circle at 30% 25%, #d9fff4, #16a6a0 45%, #063f45 100%);
          font: 900 22px/1 Inter, Manrope, "Segoe UI", Arial, sans-serif;
          box-shadow: 0 12px 28px rgba(11, 111, 111, .28);
        }

        :host(.ready) .fallback {
          opacity: 0;
        }
      </style>
      <canvas aria-hidden="true"></canvas>
      <span class="fallback">V</span>
    `;

    this.canvas = this.shadowRoot.querySelector("canvas");
    this.start();
  }

  disconnectedCallback() {
    this.stopped = true;
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.renderer) this.renderer.dispose();
  }

  async start() {
    try {
      const THREE = await loadThree();
      this.THREE = THREE;
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
      this.camera.position.set(0, 0, 5.2);

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: true,
      });
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      this.model = new THREE.Group();
      this.model.rotation.x = -0.12;
      this.scene.add(this.model);

      this.scene.add(new THREE.AmbientLight(0xffffff, 1.1));

      const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
      keyLight.position.set(2.6, 2.8, 4.2);
      this.scene.add(keyLight);

      const backLight = new THREE.DirectionalLight(0x79e6cb, 1.2);
      backLight.position.set(-3.5, -1.2, -2.4);
      this.scene.add(backLight);

      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1, 96, 64),
        new THREE.MeshPhysicalMaterial({
          color: 0x18aaa7,
          emissive: 0x002c30,
          emissiveIntensity: 0.18,
          metalness: 0.12,
          roughness: 0.23,
          clearcoat: 1,
          clearcoatRoughness: 0.12,
        }),
      );
      this.model.add(sphere);

      makeGlobeGrid(THREE, this.model);

      const ribbon = new THREE.Mesh(
        makeRibbonGeometry(THREE),
        new THREE.MeshStandardMaterial({
          map: makeRibbonTexture(THREE),
          metalness: 0.18,
          roughness: 0.38,
          side: THREE.DoubleSide,
        }),
      );
      ribbon.rotation.x = 0.08;
      this.model.add(ribbon);

      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(1.012, 96, 64),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.12,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      this.model.add(glow);

      this.addVolumeText().catch(() => {});
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this);
      this.resize();
      this.classList.add("ready");
      this.animate(0);
    } catch {
      this.classList.remove("ready");
    }
  }

  async addVolumeText() {
    const THREE = this.THREE;
    const [{ FontLoader }, { TextGeometry }, fontData] = await loadTextTools();
    const font = new FontLoader().parse(fontData);
    const geometry = new TextGeometry("VitaFlow", {
      font,
      size: 0.26,
      height: 0.055,
      curveSegments: 8,
      bevelEnabled: true,
      bevelThickness: 0.014,
      bevelSize: 0.01,
      bevelSegments: 2,
    });

    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    const width = box.max.x - box.min.x;
    const text = new THREE.Mesh(
      geometry,
      [
        new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.05, roughness: 0.18 }),
        new THREE.MeshStandardMaterial({ color: 0xb8d7d4, metalness: 0.1, roughness: 0.25 }),
      ],
    );

    text.position.set(-width / 2, -0.13, 1.13);
    text.rotation.x = 0.08;
    this.model.add(text);
  }

  resize() {
    if (!this.renderer || !this.camera) return;

    const rect = this.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width * 1.4));
    const height = Math.max(1, Math.round(rect.height * 1.4));
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  animate(time) {
    if (this.stopped) return;

    const slide = this.closest(".slide");
    const shouldRender = !slide || slide.classList.contains("active");

    if (shouldRender && this.renderer && this.scene && this.camera && this.model) {
      this.model.rotation.y = time * 0.00058;
      this.renderer.render(this.scene, this.camera);
    }

    requestAnimationFrame((nextTime) => this.animate(nextTime));
  }
}

customElements.define("vita-globe", VitaGlobe);
