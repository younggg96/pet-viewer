import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";

export default function PetModel() {
  const modelRef = useRef();
  const [showInfo, setShowInfo] = useState(false);
  const [hover, setHover] = useState(false);
  
  // Check if model file exists, otherwise use fallback
  const [modelAvailable, setModelAvailable] = useState(false);
  
  useEffect(() => {
    // Check if model exists
    fetch('/models/corgi.glb')
      .then(response => {
        if (response.ok) {
          setModelAvailable(true);
        }
      })
      .catch(() => {
        console.log('Model file not found, using fallback');
      });
  }, []);
  
  // Use real model if available
  const { scene } = useGLTF("/models/corgi.glb", false, !modelAvailable);
  
  // Simple animation - with safety checks
  useFrame((state, delta) => {
    if (modelRef.current) {
      // Gentle bobbing motion
      modelRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.05;
      
      // Subtle rotation
      if (hover) {
        modelRef.current.rotation.y += delta * 0.8;
      } else {
        modelRef.current.rotation.y += delta * 0.2;
      }
    }
  });

  // Handle click on model
  const handleClick = (e) => {
    e.stopPropagation();
    setShowInfo(!showInfo);
  };

  // Add cursor pointer on hover
  const handlePointerOver = () => {
    setHover(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHover(false);
    document.body.style.cursor = 'auto';
  };

  // Clean up cursor style on unmount
  useEffect(() => {
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <>
      {modelAvailable && scene ? (
        <primitive
          object={scene}
          ref={modelRef}
          position={[0, 0, 0]}
          scale={[1, 1, 1]}
          castShadow
          dispose={null}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        />
      ) : (
        // Fallback model - a simple mesh
        <group 
          ref={modelRef}
          position={[0, 0.5, 0]}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <mesh castShadow>
            <boxGeometry args={[1, 0.6, 1.5]} />
            <meshStandardMaterial color="#f9c26c" />
          </mesh>
          <mesh position={[0, 0.5, 0.6]} castShadow>
            <boxGeometry args={[0.8, 0.4, 0.4]} />
            <meshStandardMaterial color="#f9c26c" />
          </mesh>
          <mesh position={[0.3, -0.1, 0.8]} castShadow>
            <boxGeometry args={[0.1, 0.3, 0.1]} />
            <meshStandardMaterial color="#f9c26c" />
          </mesh>
          <mesh position={[-0.3, -0.1, 0.8]} castShadow>
            <boxGeometry args={[0.1, 0.3, 0.1]} />
            <meshStandardMaterial color="#f9c26c" />
          </mesh>
          <mesh position={[0.3, -0.1, -0.6]} castShadow>
            <boxGeometry args={[0.1, 0.3, 0.1]} />
            <meshStandardMaterial color="#f9c26c" />
          </mesh>
          <mesh position={[-0.3, -0.1, -0.6]} castShadow>
            <boxGeometry args={[0.1, 0.3, 0.1]} />
            <meshStandardMaterial color="#f9c26c" />
          </mesh>
          <mesh position={[0, 0, -0.8]} castShadow>
            <boxGeometry args={[0.2, 0.2, 0.3]} />
            <meshStandardMaterial color="#f9c26c" />
          </mesh>
          <mesh position={[0.2, 0.5, 0.8]} castShadow>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          <mesh position={[-0.2, 0.5, 0.8]} castShadow>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#222" />
          </mesh>
        </group>
      )}
      
      {showInfo && (
        <Html position={[0, 1.8, 0]}>
          <div className="pet-info-card">
            <h3>My name is Bobi</h3>
            <p>🐾 Loves belly rubs & treats</p>
            <p>💤 Expert at napping</p>
          </div>
        </Html>
      )}
    </>
  );
}

// Try to preload model, but don't throw error if not found
try {
  useGLTF.preload("/models/corgi.glb");
} catch (e) {
  console.log("Model preload failed, will use fallback");
}
