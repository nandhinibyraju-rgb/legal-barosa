import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Hero3DCharacter:
 * Supplementary 3D smiling character with floating client review bubbles.
 * 
 * Features:
 * 1. Approachable, smooth-shaded 3D head-and-shoulders character with a warm smile.
 * 2. Idle animation: gentle bobbing (translateY) and head rotation/tilt loop (4-6s cycle).
 * 3. 3-4 Floating review bubble chips above the character with star ratings & snippets.
 * 4. Staggered float motion and slow rotating crossfade cycle (1-2 visible at a time).
 * 5. Positioned in available negative space in the hero section on large screens.
 * 6. Low-poly, GPU-accelerated procedural geometry (zero external asset load overhead).
 * 7. Gracefully hidden on mobile (< lg) for optimal mobile performance.
 */

// VERIFIED CLIENT REVIEWS FROM OFFICIAL DOCUMENTATION:
const REAL_CLIENT_QUOTES = [
  {
    id: 1,
    clientName: 'Shiva',
    text: 'OTS settled at approximately 58% of principal. Getting the NOC was a huge relief.',
    badge: 'OTS Settlement',
    badgeColor: 'text-[#12B9F2] bg-[#12B9F2]/10 border-[#12B9F2]/30',
  },
  {
    id: 2,
    clientName: 'Raju',
    text: 'Within 9 weeks, interim relief/status quo was obtained regarding the auction.',
    badge: 'DRT Assistance',
    badgeColor: 'text-[#078BE8] bg-[#078BE8]/10 border-[#078BE8]/30',
  },
  {
    id: 3,
    clientName: 'Mallaiah',
    text: 'Settlement closed at around 64% of outstanding amount with CIBIL update.',
    badge: 'ARC Settlement',
    badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  },
  {
    id: 4,
    clientName: 'Sita',
    text: 'Account was preserved as Standard and our operations were able to stabilise.',
    badge: 'Restructuring',
    badgeColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  },
];

export default function Hero3DCharacter() {
  const mountRef = useRef(null);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  // Rotating cycle for review bubbles: each bubble visible ~4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveReviewIndex((prev) => (prev + 1) % REAL_CLIENT_QUOTES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = 240;
    const height = 250;

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 4.3);

    // 2. RENDERER (Antialiased, Transparent)
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance' 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 3. LIGHTING (Soft 3-point studio lighting with brand blue rim glow)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(2.5, 3.5, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x60a5fa, 0.7);
    fillLight.position.set(-3, 1, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x12b9f2, 1.4);
    rimLight.position.set(0, 2.5, -2.5);
    scene.add(rimLight);

    // 4. CHARACTER MESH GROUP
    const characterGroup = new THREE.Group();
    scene.add(characterGroup);

    // Materials
    const skinMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd9c0,
      roughness: 0.35,
      metalness: 0.05,
    });

    const hairMaterial = new THREE.MeshStandardMaterial({
      color: 0x0c1e38,
      roughness: 0.45,
      metalness: 0.1,
    });

    const suitMaterial = new THREE.MeshStandardMaterial({
      color: 0x0646a8,
      roughness: 0.5,
      metalness: 0.15,
    });

    const shirtMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.0,
    });

    const accentMaterial = new THREE.MeshStandardMaterial({
      color: 0x12b9f2,
      roughness: 0.2,
      metalness: 0.8,
    });

    const smileMaterial = new THREE.MeshBasicMaterial({
      color: 0x8a2c38,
    });

    // --- A. HEAD GROUP ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.45, 0);
    characterGroup.add(headGroup);

    // Head base (smooth sphere)
    const headGeo = new THREE.SphereGeometry(0.72, 32, 32);
    const headMesh = new THREE.Mesh(headGeo, skinMaterial);
    headGroup.add(headMesh);

    // Hair cap (sleek stylized side-parted hair)
    const hairGeo = new THREE.SphereGeometry(0.76, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55);
    const hairMesh = new THREE.Mesh(hairGeo, hairMaterial);
    hairMesh.position.set(0, 0.12, -0.04);
    headGroup.add(hairMesh);

    // Hair fringe / styled lock
    const fringeGeo = new THREE.CylinderGeometry(0.12, 0.22, 0.5, 16);
    const fringeMesh = new THREE.Mesh(fringeGeo, hairMaterial);
    fringeMesh.rotation.z = Math.PI * 0.35;
    fringeMesh.rotation.x = 0.2;
    fringeMesh.position.set(-0.25, 0.56, 0.52);
    headGroup.add(fringeMesh);

    // Ears
    const earGeo = new THREE.SphereGeometry(0.14, 16, 16);
    earGeo.scale(0.6, 1, 0.8);
    const leftEar = new THREE.Mesh(earGeo, skinMaterial);
    leftEar.position.set(-0.73, 0.02, 0);
    headGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, skinMaterial);
    rightEar.position.set(0.73, 0.02, 0);
    headGroup.add(rightEar);

    // --- WARM SMILING EYES (Curved Torus Arcs: ^ ^) ---
    const eyeArcGeo = new THREE.TorusGeometry(0.09, 0.024, 12, 24, Math.PI * 0.95);
    
    // Left smiling eye
    const leftEye = new THREE.Mesh(eyeArcGeo, hairMaterial);
    leftEye.position.set(-0.24, 0.1, 0.65);
    leftEye.rotation.x = -0.15;
    leftEye.rotation.z = Math.PI * 0.02;
    headGroup.add(leftEye);

    // Right smiling eye
    const rightEye = new THREE.Mesh(eyeArcGeo, hairMaterial);
    rightEye.position.set(0.24, 0.1, 0.65);
    rightEye.rotation.x = -0.15;
    rightEye.rotation.z = -Math.PI * 0.02;
    headGroup.add(rightEye);

    // Eyebrows (friendly uplifted)
    const browGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.18, 8);
    const leftBrow = new THREE.Mesh(browGeo, hairMaterial);
    leftBrow.position.set(-0.24, 0.25, 0.64);
    leftBrow.rotation.z = Math.PI * 0.45;
    headGroup.add(leftBrow);

    const rightBrow = new THREE.Mesh(browGeo, hairMaterial);
    rightBrow.position.set(0.24, 0.25, 0.64);
    rightBrow.rotation.z = -Math.PI * 0.45;
    headGroup.add(rightBrow);

    // Rosy Cheeks
    const cheekGeo = new THREE.SphereGeometry(0.09, 16, 16);
    cheekGeo.scale(1.2, 0.6, 0.4);
    const cheekMat = new THREE.MeshBasicMaterial({ color: 0xffa094, transparent: true, opacity: 0.5 });
    
    const leftCheek = new THREE.Mesh(cheekGeo, cheekMat);
    leftCheek.position.set(-0.4, -0.06, 0.58);
    headGroup.add(leftCheek);

    const rightCheek = new THREE.Mesh(cheekGeo, cheekMat);
    rightCheek.position.set(0.4, -0.06, 0.58);
    headGroup.add(rightCheek);

    // Warm Smile (curved torus arc facing up)
    const smileGeo = new THREE.TorusGeometry(0.18, 0.03, 16, 32, Math.PI * 0.72);
    const smileMesh = new THREE.Mesh(smileGeo, smileMaterial);
    smileMesh.position.set(0, -0.16, 0.65);
    smileMesh.rotation.x = 0.2;
    smileMesh.rotation.z = Math.PI * 1.14;
    headGroup.add(smileMesh);

    // --- B. NECK & TORSO GROUP ---
    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.26, 0.32, 0.32, 24);
    const neckMesh = new THREE.Mesh(neckGeo, skinMaterial);
    neckMesh.position.set(0, -0.22, 0);
    characterGroup.add(neckMesh);

    // Shirt collar (white V-shape)
    const collarGeo = new THREE.ConeGeometry(0.38, 0.42, 4);
    const collarMesh = new THREE.Mesh(collarGeo, shirtMaterial);
    collarMesh.position.set(0, -0.32, 0.16);
    collarMesh.rotation.y = Math.PI * 0.25;
    collarMesh.rotation.x = -0.3;
    characterGroup.add(collarMesh);

    // Brand Blue Suit Torso (smooth rounded shoulders)
    const torsoGeo = new THREE.CylinderGeometry(0.55, 0.95, 0.9, 32);
    torsoGeo.scale(1.3, 1, 0.75);
    const torsoMesh = new THREE.Mesh(torsoGeo, suitMaterial);
    torsoMesh.position.set(0, -0.72, 0);
    characterGroup.add(torsoMesh);

    // Lapel pin (LegalBharosa emblem in glowing brand cyan)
    const pinGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.02, 16);
    const pinMesh = new THREE.Mesh(pinGeo, accentMaterial);
    pinMesh.position.set(-0.35, -0.52, 0.38);
    pinMesh.rotation.x = Math.PI * 0.45;
    pinMesh.rotation.z = -0.2;
    characterGroup.add(pinMesh);

    // 5. ANIMATION LOOP (Gentle bob and head tilt idle cycle)
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Slow idle bobbing (4-6s cycle)
      characterGroup.position.y = Math.sin(time * 1.2) * 0.06;

      // Slight head rotation and curious tilt
      headGroup.rotation.y = Math.sin(time * 0.8) * 0.10;
      headGroup.rotation.z = Math.cos(time * 0.7) * 0.04;
      headGroup.rotation.x = Math.sin(time * 0.9) * 0.025;

      renderer.render(scene, camera);
    };

    animate();

    // 6. CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      headGeo.dispose();
      hairGeo.dispose();
      fringeGeo.dispose();
      earGeo.dispose();
      eyeArcGeo.dispose();
      browGeo.dispose();
      cheekGeo.dispose();
      smileGeo.dispose();
      neckGeo.dispose();
      collarGeo.dispose();
      torsoGeo.dispose();
      pinGeo.dispose();
      skinMaterial.dispose();
      hairMaterial.dispose();
      suitMaterial.dispose();
      shirtMaterial.dispose();
      accentMaterial.dispose();
      smileMaterial.dispose();
      cheekMat.dispose();
    };
  }, []);

  return (
    <aside 
      aria-label="LegalBharosa 3D Advisor and client testimonials"
      className="absolute right-4 lg:right-6 xl:right-12 2xl:right-20 top-[18%] lg:top-[16%] xl:top-[15%] z-20 pointer-events-none hidden lg:flex flex-col items-center select-none"
    >
      {/* ======================================================== */}
      {/* FLOATING REVIEW BUBBLE STACK (Above character head) */}
      {/* ======================================================== */}
      <div className="relative w-64 h-24 mb-1 pointer-events-auto">
        {REAL_CLIENT_QUOTES.map((rev, index) => {
          const isActive = index === activeReviewIndex;
          // Staggered vertical floating offsets (translateY 4-8px)
          const staggeredDelays = ['0s', '0.4s', '0.8s', '1.2s'];
          const delay = staggeredDelays[index % staggeredDelays.length];

          return (
            <div
              key={rev.id}
              style={{
                animationDelay: delay,
              }}
              className={`absolute inset-x-0 top-0 transition-all duration-700 ease-out transform ${
                isActive
                  ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                  : 'opacity-0 translate-y-3 scale-95 pointer-events-none'
              } animate-bounce-subtle`}
            >
              {/* Glass Speech Bubble Chip */}
              <div className="rounded-2xl p-3 bg-[#05070D]/85 hover:bg-[#05070D]/95 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(18,185,242,0.25)] flex flex-col gap-1.5 transition-transform duration-300 hover:scale-[1.02] cursor-default">
                {/* Top Row: Client Name + Category Pill */}
                <div className="flex items-center justify-between">
                  <span className="text-white text-xs font-bold tracking-tight">
                    {rev.clientName}
                  </span>
                  <span className={`text-[9.5px] font-mono font-medium px-2 py-0.5 rounded-full border ${rev.badgeColor}`}>
                    {rev.badge}
                  </span>
                </div>

                {/* Review Snippet Quote */}
                <p className="font-manrope font-semibold text-[11.5px] text-white leading-tight">
                  "{rev.text}"
                </p>

                {/* Micro Verified Subtext */}
                <div className="flex items-center justify-between text-[9px] text-slate-400 font-inter pt-1 border-t border-white/10">
                  <span className="flex items-center gap-1 text-cyan-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#12B9F2] animate-ping" />
                    Verified Client Case
                  </span>
                  <span className="text-slate-400">LegalBharosa 2.0</span>
                </div>
              </div>

              {/* Chat Bubble Speech Pointer Arrow */}
              <div className="w-3 h-3 bg-[#05070D]/90 border-r border-b border-white/20 transform rotate-45 mx-auto -mt-1.5 shadow-sm" />
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 3D CHARACTER THREE.JS CANVAS CONTAINER */}
      {/* ======================================================== */}
      <div 
        ref={mountRef} 
        className="w-[240px] h-[250px] relative filter drop-shadow-[0_12px_30px_rgba(0,0,0,0.6)]"
      >
        {/* Soft contained back-glow behind character */}
        <div 
          aria-hidden="true"
          className="absolute inset-x-8 top-12 bottom-6 rounded-full bg-[radial-gradient(circle_at_center,rgba(18,185,242,0.20)_0%,rgba(6,70,168,0.08)_50%,transparent_75%)] blur-2xl pointer-events-none -z-10"
        />
      </div>

      {/* Small Advisor Badge beneath character */}
      <div className="-mt-3 z-10 px-2.5 py-0.5 rounded-full bg-[#05070D]/90 border border-white/15 text-[10px] font-manrope font-medium text-slate-300 shadow-sm flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span>Legal Advocate Advisor</span>
      </div>
    </aside>
  );
}
// Final submission update
