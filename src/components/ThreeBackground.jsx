import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const isMobile = window.innerWidth < 768;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.06);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = isMobile ? 9.5 : 8;

    // Optimized Renderer with capped pixel ratio (1.5x max, 1.0x on mobile for high FPS)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // 1. Inner Geometric Shape (Icosahedron with Cyan wireframe)
    const innerGeo = new THREE.IcosahedronGeometry(isMobile ? 2.0 : 2.4, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x22F0D8,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    // 2. Outer Geometric Shape (Violet wireframe, simplified detail = 1)
    const outerGeo = new THREE.IcosahedronGeometry(isMobile ? 3.0 : 3.5, 1);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x7C5CFF,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    scene.add(outerMesh);

    // 3. Glowing Center Core (Torus ring, reduced segments 12x48 for performance)
    const torusGeo = new THREE.TorusGeometry(isMobile ? 1.3 : 1.6, 0.05, 12, 48);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0xFF4FD8,
      transparent: true,
      opacity: 0.75,
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    scene.add(torusMesh);

    // 4. Adaptive Particle Field (250 on mobile, 450 on desktop for 60fps smooth load)
    const particleCount = isMobile ? 250 : 450;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorPalette = [
      new THREE.Color(0x7C5CFF), // Violet
      new THREE.Color(0x22F0D8), // Cyan
      new THREE.Color(0xFF4FD8), // Magenta
      new THREE.Color(0xFFB84D), // Amber
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 22;
      positions[i3 + 1] = (Math.random() - 0.5) * 22;
      positions[i3 + 2] = (Math.random() - 0.5) * 18;

      const chosenColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = chosenColor.r;
      colors[i3 + 1] = chosenColor.g;
      colors[i3 + 2] = chosenColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 0.08 : 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse & Touch Tracking for Interactive Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handlePointer = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      mouseX = (clientX - halfW) / halfW;
      mouseY = (clientY - halfH) / halfH;
    };

    window.addEventListener('mousemove', handlePointer);
    window.addEventListener('touchmove', handlePointer, { passive: true });

    // Resize Handler
    const onResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      const newMobile = newW < 768;

      camera.aspect = newW / newH;
      camera.position.z = newMobile ? 9.5 : 8;
      camera.updateProjectionMatrix();

      renderer.setSize(newW, newH);
      renderer.setPixelRatio(newMobile ? 1 : Math.min(window.devicePixelRatio, 1.5));
    };

    window.addEventListener('resize', onResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse/touch interpolation
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Rotate geometric meshes
      innerMesh.rotation.x = elapsedTime * 0.3 + targetY * 0.6;
      innerMesh.rotation.y = elapsedTime * 0.4 + targetX * 0.6;

      outerMesh.rotation.x = -elapsedTime * 0.18 + targetY * 0.4;
      outerMesh.rotation.y = -elapsedTime * 0.22 + targetX * 0.4;

      torusMesh.rotation.x = elapsedTime * 0.5 + targetY * 0.8;
      torusMesh.rotation.y = elapsedTime * 0.7 + targetX * 0.8;
      torusMesh.rotation.z = elapsedTime * 0.25;

      // Gently rotate particle field
      particles.rotation.y = elapsedTime * 0.06 + targetX * 0.2;
      particles.rotation.x = targetY * 0.15;

      // Slight camera drift
      camera.position.x = targetX * 0.8;
      camera.position.y = -targetY * 0.8;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointer);
      window.removeEventListener('touchmove', handlePointer);
      window.removeEventListener('resize', onResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      innerGeo.dispose();
      innerMat.dispose();
      outerGeo.dispose();
      outerMat.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  );
}
