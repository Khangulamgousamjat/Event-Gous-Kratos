'use client';

import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, Sparkles, Html, Instances, Instance } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

/* ---------------------------------------------------------------
   KRATOS 2027 – ULTRA‑PREMIUM DNA HELIX WITH REFINED HOVER UI
   --------------------------------------------------------------- */

const METAL_COLOR = "#d0d0d0";
const GLOW_COLOR = "#00ffff";

/** ---------------------------------------------------------------
 *  DNA Strand – rendered with InstancedMesh for performance.
 * --------------------------------------------------------------- */
function DNAStrandSegments({ points, explosionFactor, color }: { points: THREE.Vector3[]; explosionFactor: number; color: string }) {
  const segmentsCount = points.length - 1;
  const scatterData = useMemo(() => {
    return Array.from({ length: segmentsCount }).map(() => ({
      direction: new THREE.Vector3((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12),
      rotation: new THREE.Vector3(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
    }));
  }, [segmentsCount]);

  return (
    <Instances range={segmentsCount}>
      <cylinderGeometry args={[0.25, 0.25, 1.2, 12]} />
      <meshPhysicalMaterial color={color} metalness={1} roughness={0.1} clearcoat={1} />
      {points.map((p, i) => {
        if (i === points.length - 1) return null;
        const next = points[i + 1];
        const center = new THREE.Vector3().addVectors(p, next).multiplyScalar(0.5);
        const dir = new THREE.Vector3().subVectors(next, p);
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
        return (
          <KineticSegment
            key={i}
            basePosition={center}
            baseQuaternion={quat}
            scatterDir={scatterData[i].direction}
            scatterRot={scatterData[i].rotation}
            explosionFactor={explosionFactor}
          />
        );
      })}
    </Instances>
  );
}

function KineticSegment({ basePosition, baseQuaternion, scatterDir, scatterRot, explosionFactor }: any) {
  const ref = useRef<any>(null);
  useFrame(() => {
    if (!ref.current) return;
    const pos = basePosition.clone().add(scatterDir.clone().multiplyScalar(explosionFactor));
    ref.current.position.copy(pos);
    const targetQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(scatterRot.x, scatterRot.y, scatterRot.z));
    ref.current.quaternion.copy(baseQuaternion).slerp(targetQuat, explosionFactor);
  });
  return <Instance ref={ref} />;
}

/** ---------------------------------------------------------------
 *  DNA Helix – builds the geometry and places interactive nodes.
 * --------------------------------------------------------------- */
function DNAHelix({ organizers, onSelect, activeOrg, isMobile }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const count = 60;
  const length = 55;
  const radius = 6;
  const turns = 3;
  const [explosionFactor, setExplosionFactor] = useState(0);

  // Build helix points once
  const helixData = useMemo(() => {
    const pointsA: THREE.Vector3[] = [];
    const pointsB: THREE.Vector3[] = [];
    const rungs: any[] = [];
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const angle = t * Math.PI * 2 * turns;
      const x = t * length - length / 2;
      const y1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      const y2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;
      pointsA.push(new THREE.Vector3(x, y1, z1));
      pointsB.push(new THREE.Vector3(x, y2, z2));
      if (i % 4 === 0) rungs.push({ pA: pointsA[i], pB: pointsB[i], id: i });
    }
    return { pointsA, pointsB, rungs };
  }, []);

  // Map organizers to helix positions
  const nodes = useMemo(() => {
    return organizers.map((org: any, i: number) => {
      const t = (i + 0.5) / organizers.length;
      const idx = Math.floor(t * (count - 1));
      return { ...org, position: helixData.pointsA[idx] };
    });
  }, [organizers, helixData]);

  // Animate explosion (detach) factor
  useEffect(() => {
    gsap.to({ val: explosionFactor }, {
      val: activeOrg ? 1 : 0,
      duration: 2.2,
      ease: "power3.inOut",
      onUpdate: function () { setExplosionFactor(this.targets()[0].val); }
    });
  }, [activeOrg]);

  // Slow helix rotation when detached
  useFrame((state) => {
    if (groupRef.current) {
      const baseSpeed = 0.12; // slightly slower overall
      const speedFactor = activeOrg ? 0.1 : 1; // 90% slower when exploded

      // Auto-rotate the group to be more vertical/diagonal on mobile to fit the screen
      if (isMobile && !activeOrg) {
        groupRef.current.rotation.z = Math.PI / 2.5; // Rotate 72 degrees for vertical fit
      } else {
        groupRef.current.rotation.z = 0;
      }

      groupRef.current.rotation.x = state.clock.elapsedTime * baseSpeed * speedFactor;
    }
  });

  return (
    <>
      <group ref={groupRef}>
        <DNAStrandSegments points={helixData.pointsA} explosionFactor={explosionFactor} color={METAL_COLOR} />
        <DNAStrandSegments points={helixData.pointsB} explosionFactor={explosionFactor} color={METAL_COLOR} />
        {helixData.rungs.map((r) => (
          <Rung key={r.id} pA={r.pA} pB={r.pB} explosionFactor={explosionFactor} radius={radius} />
        ))}
        {nodes.map((node: any) => (
          <group key={node.id} position={node.position}>
            <Float speed={activeOrg ? 0 : 1.5} rotationIntensity={activeOrg ? 0 : 0.8} floatIntensity={activeOrg ? 0 : 0.4}>
              {/* Smaller button – sphere for a cleaner look */}
              <mesh
                onClick={(e) => { e.stopPropagation(); onSelect(node); }}
                onPointerOver={() => (document.body.style.cursor = 'pointer')}
                onPointerOut={() => (document.body.style.cursor = 'auto')}
              >
                <sphereGeometry args={[1.2, 16, 16]} />
                <meshPhysicalMaterial
                  color={activeOrg?.id === node.id ? GLOW_COLOR : "#111"}
                  emissive={"#002222"}
                  emissiveIntensity={2}
                  metalness={1}
                  roughness={0}
                  transmission={0.6}
                  thickness={2}
                  opacity={activeOrg && activeOrg.id !== node.id ? 0.05 : 1}
                  transparent
                />
              </mesh>
              {/* Organizer name label with specialty highlight beside it */}
              <Html distanceFactor={18} position={[0, 2.5, 0]} center>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: activeOrg ? 0 : 1,
                    scale: activeOrg ? 0.8 : 1,
                    display: activeOrg ? 'none' : 'flex'
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: 'rgba(0,15,30,0.7)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${node.organizerName.toLowerCase().includes('rahil') ? '#ffd700' : node.organizerName.toLowerCase().includes('pranav') ? '#ff00ff' : GLOW_COLOR + '44'}`,
                    borderRadius: '8px',
                    padding: '4px 12px',
                    color: node.organizerName.toLowerCase().includes('rahil') ? '#ffd700' : node.organizerName.toLowerCase().includes('pranav') ? '#ff00ff' : GLOW_COLOR,
                    fontSize: '11px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    boxShadow: `0 0 20px ${node.organizerName.toLowerCase().includes('rahil') ? '#ffd70044' : node.organizerName.toLowerCase().includes('pranav') ? '#ff00ff44' : GLOW_COLOR + '22'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'currentColor' }} />
                  {node.organizerName}
                  {node.organizerName.toLowerCase().includes('rahil') && (
                    <span style={{ fontSize: '9px', opacity: 0.8, background: '#ffd700', color: '#000', padding: '1px 6px', borderRadius: '4px', marginLeft: '4px' }}>FRONTEND</span>
                  )}
                  {node.organizerName.toLowerCase().includes('pranav') && (
                    <span style={{ fontSize: '9px', opacity: 0.8, background: '#ff00ff', color: '#fff', padding: '1px 6px', borderRadius: '4px', marginLeft: '4px' }}>BACKEND</span>
                  )}
                </motion.div>
              </Html>

              {/* Cross overlay when the button is active */}
              {activeOrg?.id === node.id && (
                <Html distanceFactor={15} position={[0, 1.8, 0]} center>
                  <div style={{
                    fontSize: '28px',
                    color: GLOW_COLOR,
                    transform: 'rotate(45deg)',
                    pointerEvents: 'none'
                  }}>✕</div>
                </Html>
              )}


            </Float>
          </group>
        ))}
      </group>
    </>
  );
}

/** ---------------------------------------------------------------
 *  Rung – cross‑link between the two helix strands.
 * --------------------------------------------------------------- */
function Rung({ pA, pB, explosionFactor, radius }: any) {
  const ref = useRef<THREE.Mesh>(null);
  const scatterDir = useMemo(() => new THREE.Vector3((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20), []);
  const scatterRot = useMemo(() => new THREE.Vector3(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI), []);

  useFrame(() => {
    if (!ref.current) return;
    const center = new THREE.Vector3().addVectors(pA, pB).multiplyScalar(0.5);
    const pos = center.clone().add(scatterDir.clone().multiplyScalar(explosionFactor));
    ref.current.position.copy(pos);
    ref.current.rotation.set(scatterRot.x * explosionFactor, scatterRot.y * explosionFactor, Math.PI / 2 + scatterRot.z * explosionFactor);
    ref.current.scale.set(1, 1, 1 - explosionFactor * 0.85);
  });

  return (
    <mesh ref={ref}>
      <cylinderGeometry args={[0.07, 0.07, radius * 2, 8]} />
      <meshStandardMaterial color="#333" metalness={1} roughness={0.1} transparent opacity={1 - explosionFactor * 0.9} />
    </mesh>
  );
}

/** ---------------------------------------------------------------
 *  CameraRig – follows the active organizer when selected.
 * --------------------------------------------------------------- */
function CameraRig({ activeOrg }: any) {
  const { camera } = useThree();
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (activeOrg) {
      const target = new THREE.Vector3().copy(activeOrg.position);
      // Keep camera at a fixed distance for full side‑button visibility
      // (Removed zoom‑in animation)
      gsap.to(lookAtTarget.current, { x: target.x, y: target.y, z: target.z, duration: 2.1, ease: "expo.out" });
    } else {
      // Reset look‑at target to centre when no organizer selected
      gsap.to(lookAtTarget.current, { x: 0, y: 0, z: 0, duration: 2.8 });
    }
  }, [activeOrg, camera]);

  useFrame(() => {
    camera.lookAt(lookAtTarget.current);
  });

  return null;
}

/** ---------------------------------------------------------------
 *  Main component – renders the canvas and UI overlay.
 * --------------------------------------------------------------- */
export default function PostCreditsCinematic({ organizers }: { organizers: any[] }) {
  const [activeOrg, setActiveOrg] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const displayOrganizers = useMemo(() => {
    const list = organizers?.length ? [...organizers].slice(0, 8) : [];
    const dummyData = [
      {
        id: 'shubham',
        organizerName: 'Shubham Mykal',
        role: 'Event Lead',
        description: 'Driving the vision of Kratos 2027 with absolute precision.',
        imageUrl: '/images/organizers/shubham.jpg',
        instagramUrl: 'https://www.instagram.com/shubham_chintu_25?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=='
      },
      {
        id: 'sayali',
        organizerName: 'Sayali Patil',
        role: 'Creative Head',
        description: 'Mastermind behind the visual identity and aesthetic of Kratos.',
        imageUrl: '/images/organizers/dummy-2.png',
        instagramUrl: 'https://www.instagram.com/by.sayaliii_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=='
      },
      {
        id: 'rahil',
        organizerName: 'Rahil Hussain',
        role: 'Frontend Lead',
        description: 'Crafting the immersive technical interfaces of the multiverse.',
        imageUrl: '/images/organizers/dummy-0.png',
        instagramUrl: 'https://www.instagram.com/ifeelrahiii/?utm_source=ig_web_button_share_sheet'
      },
      {
        id: 'pranav',
        organizerName: 'Pranav Birhade',
        role: 'Backend Architect',
        description: 'Ensuring absolute database integrity and high-speed performance.',
        imageUrl: '/images/organizers/dummy-1.png',
        instagramUrl: 'https://www.instagram.com/pranav.404error/?__pwa=1#'
      },
      {
        id: 'aashish',
        organizerName: 'Aashish Bhole',
        role: 'Head of Events',
        description: 'Managing operations and logistical excellence for Kratos.',
        imageUrl: '/images/organizers/dummy-3.png',
        instagramUrl: 'https://www.instagram.com/aashish.__47?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=='
      },
      {
        id: 'samrat',
        organizerName: 'Samrat Kajbe',
        role: 'Technical Wing',
        description: 'Pushing the boundaries of innovation and technical systems.',
        imageUrl: '/images/organizers/dummy-0.png',
        instagramUrl: 'https://www.instagram.com/k_.samrat?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=='
      },
      {
        id: 'vaibhavi',
        organizerName: 'Vaibhavi Ade',
        role: 'Core Architect',
        description: 'Design lead focusing on immersive 3D experiences and visual flow.',
        imageUrl: '/images/organizers/dummy-2.png',
        instagramUrl: 'why?'
      },
    ];

    let i = 0;
    while (list.length < 8) {
      const dummy = dummyData[i % dummyData.length];
      const isNamedDummy = list.some(o => o.organizerName === dummy.organizerName);
      list.push({
        ...dummy,
        id: isNamedDummy ? `dummy-${list.length}` : dummy.id,
        organizerName: isNamedDummy ? `${dummy.organizerName} ${Math.floor(list.length / 4) + 1}` : dummy.organizerName
      });
      i++;
    }

    // Find Rani's photo if she exists
    const rani = list.find(org => org.organizerName?.toLowerCase().includes('rani'));
    const raniPhoto = rani?.imageUrl || '/images/organizers/dummy-2.png';

    // Force override for Vaibhavi
    return list.map(org => {
      if (org.organizerName?.toLowerCase().includes('vaibhavi')) {
        return {
          ...org,
          organizerName: 'Vaibhavi Ade',
          imageUrl: raniPhoto,
          instagramUrl: 'why?',
          instagram: 'why?'
        };
      }
      return org;
    });
  }, [organizers]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) return <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 10000 }} />;

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 9999 }}>
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <PerspectiveCamera
            makeDefault
            fov={isMobile ? 45 : 35}
            position={[0, 0, isMobile ? 80 : 50]}
          />
          <color attach="background" args={['#000000']} />
          <ambientLight intensity={0.5} />
          <pointLight position={[20, 20, 20]} intensity={1.5} />
          <pointLight position={[-20, -20, -20]} color={GLOW_COLOR} intensity={2.5} />
          <DNAHelix
            organizers={displayOrganizers}
            onSelect={setActiveOrg}
            activeOrg={activeOrg}
            isMobile={isMobile}
          />
          <CameraRig activeOrg={activeOrg} />
          <Sparkles count={activeOrg ? 500 : 200} scale={70} size={1} speed={0.2} color={GLOW_COLOR} />
          <Environment preset="night" />
          <EffectComposer multisampling={0}>
            <Bloom luminanceThreshold={1} intensity={2} mipmapBlur />
            <Vignette darkness={1.3} />
            <ChromaticAberration offset={new THREE.Vector2(0.001, 0.001)} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* Organizer Detail Panel – appears when a node is selected */}
      <AnimatePresence mode="wait">
        {activeOrg && (
          <motion.div
            key={activeOrg.id}
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            style={{
              position: 'fixed',
              left: '50%',
              // Optimized position for larger photos
              top: isMobile ? '50%' : '42%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(0,15,30,0.94)',
              backdropFilter: 'blur(45px) saturate(180%)',
              borderRadius: '28px',
              border: `1.5px solid ${GLOW_COLOR}aa`,
              padding: isMobile ? '16px' : '20px',
              width: isMobile ? '90%' : '280px',
              maxWidth: '320px',
              // Increased height to allow larger photos
              maxHeight: isMobile ? '80vh' : '62vh',
              color: '#fff',
              boxShadow: `0 0 100px ${GLOW_COLOR}20, inset 0 0 30px ${GLOW_COLOR}05`,
              zIndex: 10000,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              boxSizing: 'border-box'
            }}
          >
            {/* Holographic Pulse Ring */}
            <motion.div
              animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                position: 'absolute',
                inset: '-2px',
                borderRadius: '28px',
                border: `2px solid ${GLOW_COLOR}88`,
                pointerEvents: 'none',
                boxShadow: `0 0 20px ${GLOW_COLOR}33`
              }}
            />
            {/* Top Close Button (Accessibility) */}
            <button
              onClick={() => setActiveOrg(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                color: '#fff',
                cursor: 'pointer',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px'
              }}
            >✕</button>

            {/* Photo Section */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{ position: 'relative', flexShrink: 0 }}
            >
              <img
                src={activeOrg.imageUrl || activeOrg.photoUrl || `/images/organizers/${activeOrg.id}.jpg`}
                alt={activeOrg.organizerName}
                style={{
                  width: '100%',
                  height: '180px', // Increased space for photos
                  borderRadius: '16px',
                  objectFit: 'cover',
                  objectPosition: (activeOrg.id === 'samrat' || activeOrg.organizerName.toLowerCase().includes('samrat')) ? 'center center' : 'center top',
                  boxShadow: `0 8px 25px rgba(0,0,0,0.6)`,
                }}
              />
              {/* Conditional Neon Badges */}
              {activeOrg.organizerName.toLowerCase().includes('rahil') && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: '#00ffff',
                  color: '#000',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '9px',
                  fontWeight: 900,
                  boxShadow: '0 0 15px #00ffff',
                  letterSpacing: '1px'
                }}>FRONTEND</div>
              )}
              {activeOrg.organizerName.toLowerCase().includes('pranav') && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: '#ff00ff',
                  color: '#fff',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '9px',
                  fontWeight: 900,
                  boxShadow: '0 0 15px #ff00ff',
                  letterSpacing: '1px'
                }}>BACKEND</div>
              )}
            </motion.div>


            {/* Info Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              style={{ overflowY: 'auto', flexGrow: 1, paddingRight: '4px' }}
            >
              <h3 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 900, color: GLOW_COLOR, textAlign: 'center', letterSpacing: '1px' }}>
                {activeOrg.organizerName}
              </h3>
              <p style={{ margin: '0 0 8px', fontSize: '11px', textAlign: 'center', opacity: 0.6, letterSpacing: '2px', textTransform: 'uppercase' }}>
                {activeOrg.role}
              </p>

              {/* Instagram Integration */}
              {(activeOrg.instagram) && (
                <motion.div
                  whileHover={{ scale: 1.1, color: '#ff00ff' }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    color: GLOW_COLOR,
                    marginBottom: '15px',
                    cursor: (activeOrg.instagram || "").toLowerCase().includes('why') ? 'default' : 'pointer'
                  }}
                  onClick={() => {
                    const url = activeOrg.instagram || "";
                    if (!url.toLowerCase().includes('why')) window.open(url, '_blank');
                  }}
                >
                  {!(activeOrg.instagram || "").toLowerCase().includes('why') ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  ) : (
                    <span style={{ fontSize: '12px', fontWeight: 900, color: '#ff00ff', letterSpacing: '2px' }}>[ NO_SOCIAL ]</span>
                  )}
                  <span style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '1px' }}>
                    {(activeOrg.instagram || "").toLowerCase().includes('why')
                      ? 'INSTA=WHY?'
                      : `@${(activeOrg.instagram).split('instagram.com/')[1]?.split('/')[0]?.split('?')[0]}`
                    }
                  </span>
                </motion.div>
              )}

              <div style={{
                height: '1px',
                background: `linear-gradient(to right, transparent, ${GLOW_COLOR}, transparent)`,
                margin: '10px 0',
                opacity: 0.3
              }} />

              {(activeOrg.description || activeOrg.intro) && (
                <p style={{ fontSize: '12px', lineHeight: 1.5, opacity: 0.9, textAlign: 'center', fontStyle: 'italic', marginBottom: '10px' }}>
                  "{activeOrg.description || activeOrg.intro}"
                </p>
              )}
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: GLOW_COLOR }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveOrg(null)}
              style={{
                marginTop: '20px',
                width: '100%',
                padding: '10px',
                background: `${GLOW_COLOR}22`,
                border: `1px solid ${GLOW_COLOR}`,
                borderRadius: '8px',
                color: GLOW_COLOR,
                fontWeight: 900,
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Close Dossier
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Header – Cinematic & Centered */}
      <div style={{ position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', textAlign: 'center', width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 style={{
            color: '#fff',
            fontSize: '48px',
            fontWeight: 900,
            margin: 0,
            letterSpacing: '0.1em',
            lineHeight: 1,
            textTransform: 'uppercase',
            textShadow: `0 0 20px rgba(255,255,255,0.2), 0 0 40px ${GLOW_COLOR}44`
          }}>
            SEE YOU SOON ON <br />
            <span style={{
              fontSize: '84px',
              color: GLOW_COLOR,
              letterSpacing: '0.2em',
              textShadow: `0 0 30px ${GLOW_COLOR}, 0 0 60px ${GLOW_COLOR}aa`
            }}>KRATOS 2027</span>
          </h2>
          <div style={{
            color: GLOW_COLOR,
            fontSize: '10px',
            letterSpacing: '1.5em',
            textTransform: 'uppercase',
            marginTop: '25px',
            fontWeight: 900,
            opacity: 0.6
          }}>KINETIC_OVERRIDE_ENABLED // EST. 2027</div>
        </motion.div>
      </div>

      {/* Footer */}
      <div style={{ position: 'absolute', bottom: '60px', right: '60px', pointerEvents: 'none' }}>
        <p style={{ color: 'rgba(0,255,255,0.3)', fontSize: '11px', letterSpacing: '1em', textTransform: 'uppercase', margin: 0, fontWeight: 900 }}>
          Integrated Holographic Dossier // v2.7
        </p>
      </div>
    </div>
  );
}
