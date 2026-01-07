// app/components/FloatingShapes.tsx
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Mesh } from "three";
import { Float, Stars } from "@react-three/drei";

function NeonCube(props: any) {
  const meshRef = useRef<Mesh>(null!);
  const [hovered, setHover] = useState(false);

  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.5;
    meshRef.current.rotation.y += delta * 0.2;
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh
        {...props}
        ref={meshRef}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        scale={hovered ? 1.2 : 1}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={hovered ? "#ff00ff" : "#00ffff"} // Cyan to Pink
          emissive={hovered ? "#ff00ff" : "#00ffff"}
          emissiveIntensity={2}
          roughness={0.1}
        />
      </mesh>
    </Float>
  );
}

export default function Scene3D() {
  return (
    <div className="absolute inset-0 z-0 bg-slate-950">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />

        {/* Objek-objek melayang */}
        <NeonCube position={[-2, 0, 0]} />
        <NeonCube position={[2, 1, -2]} />
        <NeonCube position={[0, -2, 1]} />
      </Canvas>
    </div>
  );
}
