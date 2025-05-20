import React, { useRef } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export default function PhotoSign({ imgPath, position, scale = [1, 1, 1], rotation = [0, 0, 0] }) {
  const texture = useTexture(imgPath);
  const meshRef = useRef();

  return (
    <mesh ref={meshRef} position={position} scale={scale} rotation={rotation} castShadow receiveShadow>
      <planeGeometry args={[1, 1]} /> {/* Base size, will be scaled by props */}
      <meshStandardMaterial 
        map={texture} 
        side={THREE.DoubleSide} // Show texture on both sides of the plane
        metalness={0.2}      // Give it a bit of a physical look
        roughness={0.8}
      />
    </mesh>
  );
} 