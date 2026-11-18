import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html, OrbitControls } from '@react-three/drei';
import { useInView, useIsMobile, useReducedMotion } from '../utils/hooks';

const NODES = [
  { label: 'Python', color: '#C5A253', r: 0.78, pos: [0, 0, 0], note: 'Primary' },
  { label: 'Java', color: '#3987FF', r: 0.52, pos: [2.3, 0.6, -0.4], note: 'Secondary' },
  { label: 'React', color: '#8052D6', r: 0.34, pos: [-2.2, 0.9, 0.2] },
  { label: 'Flask', color: '#B8BAC5', r: 0.3, pos: [-1.2, -1.45, 0.6] },
  { label: 'Gemini API', color: '#3987FF', r: 0.3, pos: [1.2, -1.5, 0.5] },
  { label: 'MySQL', color: '#C5A253', r: 0.26, pos: [-3.1, -0.5, -0.6] },
  { label: 'Git', color: '#8052D6', r: 0.24, pos: [3.4, -0.9, -0.2] },
];

function Orb({ node, still }) {
  const mesh = useRef();
  const [hover, setHover] = useState(false);

  useFrame((_, dt) => {
    if (!mesh.current) return;
    const target = hover ? 1.18 : 1;
    mesh.current.scale.x += (target - mesh.current.scale.x) * Math.min(1, dt * 8);
    mesh.current.scale.setScalar(mesh.current.scale.x);
    if (!still) mesh.current.rotation.y += dt * 0.4;
  });

  return (
    <Float speed={still ? 0 : 1.4} rotationIntensity={0.15} floatIntensity={0.7}>
      <group position={node.pos}>
        <mesh
          ref={mesh}
          onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { setHover(false); document.body.style.cursor = ''; }}
        >
          <icosahedronGeometry args={[node.r, 2]} />
          <meshStandardMaterial color={node.color} metalness={0.75} roughness={0.28} emissive={node.color} emissiveIntensity={hover ? 0.5 : 0.18} flatShading />
        </mesh>
        <Html center distanceFactor={9} position={[0, -(node.r + 0.38), 0]} style={{ pointerEvents: 'none' }}>
          <span className={`orb-label ${node.note ? 'orb-label-main' : ''}`}>{node.label}</span>
        </Html>
      </group>
    </Float>
  );
}

function Rings({ still }) {
  const ref = useRef();
  useFrame((_, dt) => {
    if (!still && ref.current) ref.current.rotation.z += dt * 0.05;
  });
  return (
    <group ref={ref} rotation={[1.15, 0, 0]}>
      <mesh>
        <torusGeometry args={[2.9, 0.008, 8, 160]} />
        <meshBasicMaterial color="#C5A253" transparent opacity={0.5} />
      </mesh>
      <mesh>
        <torusGeometry args={[3.7, 0.006, 8, 160]} />
        <meshBasicMaterial color="#3987FF" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

export default function TechCluster() {
  const [ref, inView] = useInView('100px');
  const mobile = useIsMobile();
  const reduced = useReducedMotion();
  const nodes = useMemo(() => (mobile ? NODES.slice(0, 5) : NODES), [mobile]);

  return (
    <div ref={ref} className="tech-cluster glass" role="img" aria-label="Interactive 3D cluster of core technologies: Python, Java, React, Flask, Gemini API, MySQL and Git">
      {inView && (
        <Canvas dpr={[1, mobile ? 1.25 : 1.75]} camera={{ position: [0, 0, 8.5], fov: 45 }} gl={{ antialias: !mobile, alpha: true }}>
          <ambientLight intensity={0.55} />
          <pointLight position={[5, 4, 5]} intensity={55} color="#C5A253" />
          <pointLight position={[-5, -3, 4]} intensity={45} color="#3987FF" />
          <pointLight position={[0, 5, -4]} intensity={35} color="#8052D6" />
          <Rings still={reduced} />
          {nodes.map((n) => (
            <Orb key={n.label} node={n} still={reduced} />
          ))}
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={!mobile} autoRotate={!reduced} autoRotateSpeed={0.6} minPolarAngle={1.1} maxPolarAngle={2.0} />
        </Canvas>
      )}
      <p className="tech-hint">{mobile ? 'Core technologies' : 'Drag to rotate. Hover an orb.'}</p>
    </div>
  );
}
