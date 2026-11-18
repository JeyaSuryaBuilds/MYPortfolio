import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useInView, useIsMobile, useReducedMotion } from '../utils/hooks';

const PALETTE = ['#3987FF', '#8052D6', '#C5A253', '#B8BAC5'];

function Particles({ count, still }) {
  const ref = useRef();
  const { positions, colors } = useMemo(() => {
    const p = new Float32Array(count * 3);
    const c = new Float32Array(count * 3);
    const col = new THREE.Color();
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 14 - 1.5;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
      col.set(PALETTE[Math.floor(Math.random() * PALETTE.length)]);
      c.set([col.r, col.g, col.b], i * 3);
    }
    return { positions: p, colors: c };
  }, [count]);

  useFrame((state, dt) => {
    if (still || !ref.current) return;
    ref.current.rotation.y += dt * 0.025;
    ref.current.position.x += (state.pointer.x * 0.5 - ref.current.position.x) * 0.03;
    ref.current.position.y += (state.pointer.y * 0.3 - ref.current.position.y) * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} vertexColors transparent opacity={0.4} depthWrite={false} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
}

function Wire({ geometry, color, position, scale, speed, opacity = 0.32 }) {
  const ref = useRef();
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.x += dt * speed;
    ref.current.rotation.y += dt * speed * 1.3;
  });
  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.8}>
      <mesh ref={ref} position={position} scale={scale}>
        {geometry}
        <meshBasicMaterial color={color} wireframe transparent opacity={opacity} />
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  const [ref, inView] = useInView('0px');
  const mobile = useIsMobile();
  const reduced = useReducedMotion();

  return (
    <div ref={ref} className="hero-scene" aria-hidden="true">
      <Canvas
        dpr={[1, mobile ? 1.25 : 1.75]}
        camera={{ position: [0, 0, 6], fov: 55 }}
        frameloop={inView && !reduced ? 'always' : 'demand'}
        gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance' }}
      >
        <Particles count={mobile ? 150 : 280} still={reduced} />
        {/* Kept to the left, behind the text, so nothing crosses the face */}
        <Wire geometry={<icosahedronGeometry args={[1, 1]} />} color="#C5A253" position={[-4.3, -1.3, -2]} scale={1.2} speed={0.1} opacity={0.2} />
        <Wire geometry={<torusGeometry args={[1, 0.01, 8, 120]} />} color="#3987FF" position={[-4.3, -1.3, -2]} scale={2} speed={0.07} opacity={0.3} />
      </Canvas>
    </div>
  );
}