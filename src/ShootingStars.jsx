import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Trail } from '@react-three/drei';
import * as THREE from 'three';

const SHOOTING_STAR_COUNT = 5;
const SPAWN_RADIUS = 80; // How far out the stars spawn
const MAX_SPEED = 0.8; // Halved from 2
const MIN_SPEED = 0.5; // Halved from 1
const TRAIL_LENGTH = 0.8;
const TRAIL_WIDTH = 2;
const STAR_SIZE = 0.1;

function Star() {
  const meshRef = useRef();
  const trailRef = useRef();

  // Initialize star properties
  const [initialPosition, initialVelocity] = useMemo(() => {
    const R = SPAWN_RADIUS * Math.sqrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;
    const x = R * Math.cos(theta);
    const y = (Math.random() - 0.5) * SPAWN_RADIUS * 0.5; // More horizontal spread
    const z = R * Math.sin(theta) - SPAWN_RADIUS * 0.8; // Start further back

    const position = new THREE.Vector3(x, y, z);
    
    const targetX = (Math.random() - 0.5) * 10;
    const targetY = (Math.random() - 0.2) * 5 + y; // Aim slightly up/down from current y
    const targetZ = z + SPAWN_RADIUS * 1.5; // Ensure they fly towards camera and beyond

    const velocity = new THREE.Vector3(targetX - x, targetY - y, targetZ - z)
      .normalize()
      .multiplyScalar(MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED));

    return [position, velocity];
  }, []);

  // Store current position and velocity in refs to modify them in useFrame
  const pos = useRef(initialPosition.clone());
  const vel = useRef(initialVelocity.clone());

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    pos.current.add(vel.current.clone().multiplyScalar(delta * 60)); // Multiply by 60 for more intuitive speed control relative to 60fps
    meshRef.current.position.copy(pos.current);

    // Reset star if it goes too far (e.g., beyond a certain z or out of view)
    if (pos.current.z > SPAWN_RADIUS * 0.5 || Math.abs(pos.current.x) > SPAWN_RADIUS * 1.5 || Math.abs(pos.current.y) > SPAWN_RADIUS * 0.75) {
      const R = SPAWN_RADIUS * Math.sqrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      pos.current.x = R * Math.cos(theta);
      pos.current.y = (Math.random() - 0.5) * SPAWN_RADIUS * 0.5;
      pos.current.z = R * Math.sin(theta) - SPAWN_RADIUS * 0.8; // Reset z further back

      const targetX = (Math.random() - 0.5) * 10;
      const targetY = (Math.random() - 0.2) * 5 + pos.current.y;
      const targetZ = pos.current.z + SPAWN_RADIUS * 1.5;

      vel.current
        .set(targetX - pos.current.x, targetY - pos.current.y, targetZ - pos.current.z)
        .normalize()
        .multiplyScalar(MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED));
      
      // For Trail, it might be better to reset the trail target as well or re-initialize the component
      // For simplicity here, we are just repositioning the mesh. A full Trail reset might need more.
      if (trailRef.current) {
        // No direct API to reset Trail internal points, but moving the target (meshRef) is what it follows.
      }
    }
  });

  return (
    <Trail
      ref={trailRef}
      width={TRAIL_WIDTH}
      length={TRAIL_LENGTH}
      color={new THREE.Color(2, 1.5, 5)} // Emissive color, can be > 1 for bloom if postprocessing is used
      attenuation={(t) => t * t}
    >
      <mesh ref={meshRef} position={initialPosition}>
        <sphereGeometry args={[STAR_SIZE, 8, 8]} />
        <meshBasicMaterial color={[10, 5, 20]} toneMapped={false} /> {/* Bright emissive color for the star head */}
      </mesh>
    </Trail>
  );
}

export default function ShootingStars() {
  return (
    <group>
      {Array.from({ length: SHOOTING_STAR_COUNT }).map((_, i) => (
        <Star key={i} />
      ))}
    </group>
  );
} 