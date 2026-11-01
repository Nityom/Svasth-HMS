import { useEffect, useRef } from 'react';
import type * as ThreeTypes from 'three';

export default function LogoOrbit() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;
    let releaseScene = () => {};

    import('three').then((THREE) => {
      if (cancelled || !root) return;

      let renderer: ThreeTypes.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      } catch {
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(root.clientWidth, root.clientHeight);
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.domElement.setAttribute('aria-hidden', 'true');
      root.appendChild(renderer.domElement);
      root.classList.add('logo-scene-ready');

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, root.clientWidth / root.clientHeight, 0.1, 100);
      camera.position.set(0, 0, 7.2);

      scene.add(new THREE.HemisphereLight(0xeaffef, 0x245945, 2.2));
      const keyLight = new THREE.DirectionalLight(0xffffff, 3.1);
      keyLight.position.set(-3, 4, 5);
      scene.add(keyLight);
      const greenLight = new THREE.PointLight(0x62d49a, 7, 8);
      greenLight.position.set(2.4, -1.5, 2.8);
      scene.add(greenLight);

      const sculpture = new THREE.Group();
      scene.add(sculpture);

      const halo = new THREE.Mesh(
        new THREE.CircleGeometry(0.82, 72),
        new THREE.MeshBasicMaterial({ color: 0x9cd9b2, transparent: true, opacity: 0.17, depthWrite: false }),
      );
      halo.position.z = -0.08;
      sculpture.add(halo);
      const emblemFrame = new THREE.Mesh(
        new THREE.TorusGeometry(0.88, 0.075, 16, 96),
        new THREE.MeshPhysicalMaterial({ color: 0x91d3aa, roughness: 0.2, metalness: 0.3, clearcoat: 1 }),
      );
      sculpture.add(emblemFrame);

      const logoGroup = new THREE.Group();
      sculpture.add(logoGroup);
      const loader = new THREE.TextureLoader();
      const logoTexture = loader.load('/Svaasth_logo.png', (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      });
      const logo = new THREE.Mesh(
        new THREE.PlaneGeometry(1.04, 1.28),
        new THREE.MeshBasicMaterial({ map: logoTexture, transparent: true, side: THREE.DoubleSide, depthWrite: false, depthTest: false }),
      );
      // Keep the brand mark in front of the glass sphere so it remains fully legible.
      logo.position.z = 0.04;
      logo.renderOrder = 10;
      logoGroup.add(logo);

      const ringMaterials = [
        new THREE.MeshBasicMaterial({ color: 0xb5e1c2, transparent: true, opacity: 0.8 }),
        new THREE.MeshBasicMaterial({ color: 0x76c898, transparent: true, opacity: 0.58 }),
        new THREE.MeshBasicMaterial({ color: 0xe4c18b, transparent: true, opacity: 0.75 }),
      ];
      const ringSpecs = [
        { radius: 1.52, tube: 0.012, rotation: [0.87, 0.2, -0.4], speed: 0.22 },
        { radius: 1.82, tube: 0.009, rotation: [1.28, -0.34, 0.18], speed: -0.16 },
        { radius: 1.3, tube: 0.01, rotation: [0.18, 1.04, 0.36], speed: 0.12 },
      ] as const;

      const rings = ringSpecs.map((spec, index) => {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(spec.radius, spec.tube, 8, 160), ringMaterials[index]);
        ring.rotation.set(spec.rotation[0], spec.rotation[1], spec.rotation[2]);
        sculpture.add(ring);
        return ring;
      });

      const beads: ThreeTypes.Mesh[] = [];
      ringSpecs.forEach((spec, index) => {
        const bead = new THREE.Mesh(
          new THREE.SphereGeometry(index === 2 ? 0.065 : 0.05, 20, 20),
          new THREE.MeshStandardMaterial({ color: index === 2 ? 0xe7c68e : 0x86d3a2, emissive: index === 2 ? 0x6d4211 : 0x144b2b, emissiveIntensity: 0.4, roughness: 0.28, metalness: 0.35 }),
        );
        sculpture.add(bead);
        beads.push(bead);
      });

      const particlePositions = new Float32Array(84 * 3);
      for (let i = 0; i < 84; i += 1) {
        const radius = 2.05 + Math.random() * 1.1;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 2.2;
      }
      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0xc3ecd0, size: 0.026, transparent: true, opacity: 0.8, sizeAttenuation: true }));
      scene.add(particles);

      const pointer = new THREE.Vector2(0, 0);
      const target = new THREE.Vector2(0, 0);
      let dragging = false;
      let previousPointer = { x: 0, y: 0 };
      const onPointerMove = (event: PointerEvent) => {
        const bounds = root!.getBoundingClientRect();
        if (dragging) {
          target.x += (event.clientX - previousPointer.x) * 0.012;
          target.y += (event.clientY - previousPointer.y) * 0.009;
          target.x = THREE.MathUtils.clamp(target.x, -1.4, 1.4);
          target.y = THREE.MathUtils.clamp(target.y, -0.9, 0.9);
          previousPointer = { x: event.clientX, y: event.clientY };
          return;
        }
        target.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.9;
        target.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.6;
      };
      const onPointerLeave = () => { if (!dragging) target.set(0, 0); };
      const onPointerDown = (event: PointerEvent) => {
        dragging = true;
        previousPointer = { x: event.clientX, y: event.clientY };
        root!.classList.add('logo-orbit-dragging');
        root!.setPointerCapture(event.pointerId);
      };
      const onPointerUp = (event: PointerEvent) => {
        dragging = false;
        root!.classList.remove('logo-orbit-dragging');
        if (root!.hasPointerCapture(event.pointerId)) root!.releasePointerCapture(event.pointerId);
      };
      root.addEventListener('pointermove', onPointerMove, { passive: true });
      root.addEventListener('pointerleave', onPointerLeave);
      root.addEventListener('pointerdown', onPointerDown);
      root.addEventListener('pointerup', onPointerUp);
      root.addEventListener('pointercancel', onPointerUp);

      const resizeObserver = new ResizeObserver(() => {
        if (!root) return;
        const width = root.clientWidth;
        const height = root.clientHeight;
        if (!width || !height) return;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      });
      resizeObserver.observe(root);

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let frame = 0;
      const clock = new THREE.Clock();
      const render = () => {
        const elapsed = clock.getElapsedTime();
        pointer.lerp(target, 0.035);
        sculpture.rotation.y += (pointer.x * 0.72 - sculpture.rotation.y) * 0.045;
        sculpture.rotation.x += (-pointer.y * 0.48 - sculpture.rotation.x) * 0.045;
        if (!reduceMotion) {
          sculpture.rotation.y += 0.0024;
          sculpture.position.y = Math.sin(elapsed * 0.72) * 0.075;
          rings.forEach((ring, index) => { ring.rotation.z += ringSpecs[index].speed * 0.003; });
          particles.rotation.y = elapsed * 0.025;
          beads.forEach((bead, index) => {
            const angle = elapsed * (0.45 + index * 0.13) + index * 2.1;
            const radius = ringSpecs[index].radius;
            bead.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, Math.sin(angle * 1.4) * 0.42);
          });
        }
        renderer.render(scene, camera);
        if (!reduceMotion) frame = window.requestAnimationFrame(render);
      };
      render();

      releaseScene = () => {
        window.cancelAnimationFrame(frame);
        resizeObserver.disconnect();
        root.removeEventListener('pointermove', onPointerMove);
        root.removeEventListener('pointerleave', onPointerLeave);
        root.removeEventListener('pointerdown', onPointerDown);
        root.removeEventListener('pointerup', onPointerUp);
        root.removeEventListener('pointercancel', onPointerUp);
        renderer.dispose();
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
            object.geometry.dispose();
            const material = object.material;
            if (Array.isArray(material)) material.forEach((item) => item.dispose());
            else material.dispose();
          }
        });
        logoTexture.dispose();
        ringMaterials.forEach((material) => material.dispose());
        if (renderer.domElement.parentElement === root) root.removeChild(renderer.domElement);
        root.classList.remove('logo-scene-ready');
      };
    }).catch(() => {});

    return () => {
      cancelled = true;
      releaseScene();
    };
  }, []);

  return (
    <div className="logo-orbit-scene" ref={rootRef} aria-label="Drag to rotate the interactive Svaasth HMS logo and orbital rings">
      <img className="logo-orbit-fallback" src="/Svaasth_logo.png" alt="Svaasth HMS" />
    </div>
  );
}
