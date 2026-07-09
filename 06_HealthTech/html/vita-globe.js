const THREE_URL = "https://esm.sh/three@0.160.1";
const FONT_LOADER_URL = "https://esm.sh/three@0.160.1/examples/jsm/loaders/FontLoader.js?deps=three@0.160.1";
const TEXT_GEOMETRY_URL = "https://esm.sh/three@0.160.1/examples/jsm/geometries/TextGeometry.js?deps=three@0.160.1";
const FONT_URL = "https://cdn.jsdelivr.net/npm/three@0.160.1/examples/fonts/helvetiker_bold.typeface.json";
const LAND_URL = new URL("./vita-globe-land.png", import.meta.url).href;
const BUMP_URL = new URL("./vita-globe-bump.png", import.meta.url).href;

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

function loadTexture(THREE, url) {
  return new Promise((resolve, reject) => {
    new THREE.TextureLoader().load(
      url,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 8;
        resolve(texture);
      },
      undefined,
      reject,
    );
  });
}

function makeRibbonGeometry(THREE, radius = 1.16, height = 0.38, segments = 192) {
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
  canvas.width = 3072;
  canvas.height = 384;

  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#1b5f5f");
  gradient.addColorStop(0.18, "#0e4548");
  gradient.addColorStop(0.52, "#071c22");
  gradient.addColorStop(0.82, "#0c3b40");
  gradient.addColorStop(1, "#2a716c");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255,255,255,.22)";
  ctx.fillRect(0, 34, canvas.width, 10);
  ctx.fillStyle = "rgba(0,0,0,.28)";
  ctx.fillRect(0, canvas.height - 48, canvas.width, 18);

  ctx.strokeStyle = "rgba(127,255,230,.92)";
  ctx.lineWidth = 10;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  for (let x = -70; x < canvas.width; x += 510) {
    ctx.beginPath();
    ctx.moveTo(x, 210);
    ctx.lineTo(x + 86, 210);
    ctx.lineTo(x + 113, 166);
    ctx.lineTo(x + 147, 258);
    ctx.lineTo(x + 185, 210);
    ctx.lineTo(x + 265, 210);
    ctx.stroke();
  }

  ctx.font = "900 112px Inter, Manrope, Segoe UI, Arial, sans-serif";
  ctx.textBaseline = "middle";
  for (let x = 250; x < canvas.width; x += 760) {
    ctx.fillStyle = "rgba(0,0,0,.48)";
    ctx.fillText("VitaFlow", x + 9, 205);
    ctx.strokeStyle = "rgba(255,255,255,.58)";
    ctx.lineWidth = 5;
    ctx.strokeText("VitaFlow", x, 196);
    ctx.fillStyle = "rgba(255,255,255,.92)";
    ctx.fillText("VitaFlow", x, 196);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function makeGlobeGrid(THREE, group) {
  const material = new THREE.MeshBasicMaterial({
    color: 0xe9fff8,
    transparent: true,
    opacity: 0.24,
    depthWrite: false,
  });

  [-0.72, -0.43, -0.18, 0.12, 0.42, 0.68].forEach((y) => {
    const radius = Math.sqrt(1 - y * y);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.0038, 8, 168), material);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    group.add(ring);
  });

  [0, Math.PI / 6, Math.PI / 3, Math.PI / 2, (Math.PI * 2) / 3, (Math.PI * 5) / 6].forEach((rotation) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.006, 0.0035, 8, 168), material);
    ring.rotation.y = rotation;
    group.add(ring);
  });
}

function makeRimMaterial(THREE) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      rimColor: { value: new THREE.Color(0xdffff8) },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vView;

      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vView = normalize(cameraPosition - worldPosition.xyz);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 rimColor;
      varying vec3 vNormal;
      varying vec3 vView;

      void main() {
        float rim = 1.0 - max(dot(vNormal, vView), 0.0);
        float alpha = pow(rim, 2.2) * 0.72;
        gl_FragColor = vec4(rimColor, alpha);
      }
    `,
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
          width: 96px;
          height: 96px;
          overflow: visible;
        }

        canvas {
          position: absolute;
          inset: -18%;
          width: 136%;
          height: 136%;
          display: block;
          pointer-events: none;
        }

        .fallback {
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #f7fff9;
          background: radial-gradient(circle at 30% 25%, #effff9, #78d9cf 34%, #0b746f 100%);
          font: 900 24px/1 Inter, Manrope, "Segoe UI", Arial, sans-serif;
          box-shadow: 0 14px 32px rgba(11, 111, 111, .28);
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
      this.camera = new THREE.PerspectiveCamera(25, 1, 0.1, 100);
      this.camera.position.set(0, 0, 5.35);

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;

      const [landTexture, bumpTexture] = await Promise.all([
        loadTexture(THREE, LAND_URL),
        loadTexture(THREE, BUMP_URL),
      ]);

      this.model = new THREE.Group();
      this.model.rotation.x = -0.12;
      this.model.rotation.z = -0.08;
      this.scene.add(this.model);

      this.scene.add(new THREE.AmbientLight(0xffffff, 1.65));

      const keyLight = new THREE.DirectionalLight(0xffffff, 3.8);
      keyLight.position.set(2.8, 3.4, 5.2);
      this.scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0x93fff0, 1.45);
      fillLight.position.set(-3.2, 1.2, 2.4);
      this.scene.add(fillLight);

      const backLight = new THREE.DirectionalLight(0x6ff5da, 2.1);
      backLight.position.set(-3.8, -1.3, -3.2);
      this.scene.add(backLight);

      const globe = new THREE.Mesh(
        new THREE.SphereGeometry(1, 128, 96),
        new THREE.MeshPhysicalMaterial({
          color: 0x86ddd2,
          emissive: 0x064f51,
          emissiveIntensity: 0.16,
          metalness: 0.04,
          roughness: 0.14,
          clearcoat: 1,
          clearcoatRoughness: 0.04,
          transparent: true,
          opacity: 0.68,
          bumpMap: bumpTexture,
          bumpScale: 0.035,
        }),
      );
      this.model.add(globe);

      const backLand = new THREE.Mesh(
        new THREE.SphereGeometry(1.011, 128, 96),
        new THREE.MeshBasicMaterial({
          map: landTexture,
          transparent: true,
          opacity: 0.28,
          side: THREE.BackSide,
          depthWrite: false,
        }),
      );
      this.model.add(backLand);

      makeGlobeGrid(THREE, this.model);

      const frontLand = new THREE.Mesh(
        new THREE.SphereGeometry(1.018, 128, 96),
        new THREE.MeshStandardMaterial({
          map: landTexture,
          transparent: true,
          opacity: 0.96,
          metalness: 0.04,
          roughness: 0.42,
          depthWrite: false,
        }),
      );
      this.model.add(frontLand);

      const glass = new THREE.Mesh(
        new THREE.SphereGeometry(1.055, 128, 96),
        new THREE.MeshPhysicalMaterial({
          color: 0xeafff9,
          transparent: true,
          opacity: 0.22,
          metalness: 0,
          roughness: 0.03,
          clearcoat: 1,
          clearcoatRoughness: 0.02,
          depthWrite: false,
        }),
      );
      this.model.add(glass);

      const rim = new THREE.Mesh(new THREE.SphereGeometry(1.075, 128, 96), makeRimMaterial(THREE));
      this.model.add(rim);

      const ribbonGroup = new THREE.Group();
      ribbonGroup.rotation.x = 0.22;
      this.model.add(ribbonGroup);

      const ribbon = new THREE.Mesh(
        makeRibbonGeometry(THREE),
        new THREE.MeshStandardMaterial({
          map: makeRibbonTexture(THREE),
          color: 0xffffff,
          metalness: 0.32,
          roughness: 0.26,
          side: THREE.DoubleSide,
        }),
      );
      ribbonGroup.add(ribbon);

      const edgeMaterial = new THREE.MeshStandardMaterial({
        color: 0x4ba79d,
        emissive: 0x0b4c4b,
        emissiveIntensity: 0.18,
        metalness: 0.38,
        roughness: 0.22,
      });
      [-0.205, 0.205].forEach((y) => {
        const edge = new THREE.Mesh(new THREE.TorusGeometry(1.16, 0.018, 12, 192), edgeMaterial);
        edge.rotation.x = Math.PI / 2;
        edge.position.y = y;
        ribbonGroup.add(edge);
      });

      this.ribbonGroup = ribbonGroup;
      this.addVolumeText().catch(() => {});
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this);
      this.resize();
      this.classList.add("ready");
      this.animate(0);
    } catch (error) {
      this.classList.remove("ready");
      this.dataset.error = error.message || "render failed";
    }
  }

  async addVolumeText() {
    const THREE = this.THREE;
    const [{ FontLoader }, { TextGeometry }, fontData] = await loadTextTools();
    const font = new FontLoader().parse(fontData);

    const textMaterial = [
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.12,
        roughness: 0.18,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x9fb8b5,
        metalness: 0.2,
        roughness: 0.28,
      }),
    ];

    [0, Math.PI].forEach((angle) => {
      const geometry = new TextGeometry("VitaFlow", {
        font,
        size: 0.31,
        height: 0.08,
        curveSegments: 10,
        bevelEnabled: true,
        bevelThickness: 0.016,
        bevelSize: 0.012,
        bevelSegments: 3,
      });
      geometry.computeBoundingBox();

      const width = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
      const text = new THREE.Mesh(geometry, textMaterial);
      const radius = 1.245;
      text.position.set(Math.sin(angle) * radius - Math.cos(angle) * width / 2, -0.16, Math.cos(angle) * radius);
      text.rotation.y = angle;
      text.rotation.x = 0.03;
      this.ribbonGroup.add(text);
    });
  }

  resize() {
    if (!this.renderer || !this.camera) return;

    const rect = this.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width * 1.72));
    const height = Math.max(1, Math.round(rect.height * 1.72));
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  animate(time) {
    if (this.stopped) return;

    const slide = this.closest(".slide");
    const shouldRender = !slide || slide.classList.contains("active");

    if (shouldRender && this.renderer && this.scene && this.camera && this.model) {
      if (this.startedAt == null) this.startedAt = time;
      const elapsed = time - this.startedAt;
      this.model.rotation.y = -0.06 + elapsed * 0.00042;
      this.renderer.render(this.scene, this.camera);
    }

    requestAnimationFrame((nextTime) => this.animate(nextTime));
  }
}

customElements.define("vita-globe", VitaGlobe);
