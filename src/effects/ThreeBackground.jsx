import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 35;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 1. Particle System (Cyber Dust & Digital Stars)
    const particleCount = 380;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const greenColor = new THREE.Color(0x22c55e); // Emerald Green
    const cyanColor = new THREE.Color(0x06b6d4);  // Cyan
    const whiteColor = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

      const mixRatio = Math.random();
      const col = mixRatio > 0.6 ? greenColor : mixRatio > 0.2 ? cyanColor : whiteColor;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Material with circular texture generated via canvas
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(34, 197, 94, 0.8)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 1.4,
      map: particleTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.75,
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    // 2. Wireframe 3D Cyber Geometries (Floating in deep space)
    const ringGroup = new THREE.Group();

    // Outer Gyro Ring
    const torusGeom1 = new THREE.TorusGeometry(14, 0.08, 16, 100);
    const torusMat1 = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const ring1 = new THREE.Mesh(torusGeom1, torusMat1);
    ringGroup.add(ring1);

    // Inner Gyro Ring
    const torusGeom2 = new THREE.TorusGeometry(10, 0.06, 16, 80);
    const torusMat2 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    });
    const ring2 = new THREE.Mesh(torusGeom2, torusMat2);
    ring2.rotation.x = Math.PI / 3;
    ringGroup.add(ring2);

    // Cyber Floating Icosahedron
    const icoGeom = new THREE.IcosahedronGeometry(6, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const ico = new THREE.Mesh(icoGeom, icoMat);
    ringGroup.add(ico);

    ringGroup.position.set(0, 2, -10);
    scene.add(ringGroup);

    // 3. Mouse Interaction & Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smooth lerping to mouse target
      targetX += (mouseX * 4 - targetX) * 0.05;
      targetY += (-mouseY * 4 - targetY) * 0.05;

      camera.position.x = targetX;
      camera.position.y = targetY;
      camera.lookAt(scene.position);

      // Subtle rotation for particles
      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = elapsedTime * 0.015;

      // Gyro rings rotation
      ringGroup.rotation.x = elapsedTime * 0.15;
      ringGroup.rotation.y = elapsedTime * 0.2;
      ringGroup.rotation.z = Math.sin(elapsedTime * 0.3) * 0.1;

      ring1.rotation.z = elapsedTime * 0.1;
      ring2.rotation.y = -elapsedTime * 0.15;
      ico.rotation.x = -elapsedTime * 0.12;
      ico.rotation.y = elapsedTime * 0.18;

      renderer.render(scene, camera);
    };

    animate();


    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      geometry.dispose();
      particleMaterial.dispose();
      particleTexture.dispose();
      torusGeom1.dispose();
      torusMat1.dispose();
      torusGeom2.dispose();
      torusMat2.dispose();
      icoGeom.dispose();
      icoMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-1000"
      style={{ opacity: 0.85 }}
      aria-hidden="true"
    />
  );
};

export default ThreeBackground;
