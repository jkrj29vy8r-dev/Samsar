"use client";

import { useMemo, useRef } from "react";
import type { ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Icosahedron, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

/* Paleta de brand Verdikt (vezi app/globals.css). */
const BRAND = "#10b981";
const BRAND_2 = "#0ea5e9";
const VIOLET = "#8b5cf6";

/* Nor de particule în formă de coajă sferică, colorat cu paleta de brand.
 * 1200 particule — sub pragul sigur pentru mobil (baseline 3000). */
function Particles({ count = 1200 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color(BRAND),
      new THREE.Color(BRAND_2),
      new THREE.Color(VIOLET),
    ];

    for (let i = 0; i < count; i++) {
      const radius = 3.4 + Math.random() * 3.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const color = palette[i % palette.length];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [count]);

  useFrame((_, delta) => {
    const points = pointsRef.current;
    if (!points) return;
    points.rotation.y += delta * 0.04;
    points.rotation.x += delta * 0.015;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* Blob-ul central: icosaedru distorsionat, gloss emerald, cu un wireframe
 * sky în jur. Plutește lent (Float). */
function Blob() {
  return (
    <Float speed={1.2} rotationIntensity={0.5} floatIntensity={1}>
      <Icosahedron args={[1.5, 12]}>
        <MeshDistortMaterial
          color={BRAND}
          roughness={0.28}
          metalness={0.12}
          distort={0.3}
          speed={1.3}
        />
      </Icosahedron>
      <Icosahedron args={[1.74, 2]}>
        <meshBasicMaterial
          color={BRAND_2}
          wireframe
          transparent
          opacity={0.16}
        />
      </Icosahedron>
    </Float>
  );
}

/* Parallax fin: grupul se înclină ușor după poziția cursorului/degetului. */
function ParallaxGroup({ children }: { children: ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    group.rotation.y = THREE.MathUtils.lerp(
      group.rotation.y,
      pointer.x * 0.35,
      0.05,
    );
    group.rotation.x = THREE.MathUtils.lerp(
      group.rotation.x,
      -pointer.y * 0.25,
      0.05,
    );
  });

  return <group ref={groupRef}>{children}</group>;
}

export default function Hero3DScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 5, 3]} intensity={1.3} />
      <directionalLight position={[-4, -2, -3]} intensity={0.4} color={BRAND_2} />
      <ParallaxGroup>
        <Blob />
        <Particles />
      </ParallaxGroup>
    </Canvas>
  );
}
