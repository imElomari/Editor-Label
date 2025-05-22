"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Stage,
  Html,
  useGLTF,
} from "@react-three/drei";
import { MousePointerClick, MouseIcon } from "lucide-react";
import * as THREE from "three";

function Model() {
  const { nodes } = useGLTF("/model.gltf");

  return (
    <group position={[0, -1, 0]} rotation={[0, Math.PI, 0]} scale={0.5}>
      {["can_250ml", "can_250ml_1", "can_250ml_2"].map((part, index) => {
        const meshNode = nodes[part] as THREE.Mesh;
        return (
          <mesh
            key={part}
            geometry={meshNode.geometry}
            castShadow
            receiveShadow
          >
            <meshPhysicalMaterial
              color={index === 2 ? "#FFFFFF" : "#B8B8B8"}
              metalness={index === 2 ? 0.1 : 0.9}
              roughness={0.1}
              envMapIntensity={1.5}
              clearcoat={0.5}
              clearcoatRoughness={0.1}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export function ThreeDPreview() {
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [3, 1, 8], fov: 35 }}>
        <Suspense fallback={<Html center>Loading...</Html>}>
          <Environment
            files="/env/studio.hdr"
            background={true}
            blur={0}
            resolution={1024}
          />
          <Stage intensity={0.3} preset="rembrandt" adjustCamera={false}>
            <Model />
          </Stage>
          <OrbitControls
            minDistance={3}
            maxDistance={10}
            enablePan={false}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Suspense>
      </Canvas>

      <div className="absolute bottom-0 left-0 right-0 p-2 bg-white/80 backdrop-blur-sm border-t">
        <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <MousePointerClick size={16} />
            Drag to rotate
          </span>
          <span className="flex items-center gap-1">
            <MouseIcon size={16} />
            Scroll to zoom
          </span>
          
        </div>
      </div>
    </div>
  );
}

useGLTF.preload("/model.gltf");
