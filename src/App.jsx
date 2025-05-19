import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Html, Stars } from "@react-three/drei";
import PetModel from "./PetModel";
import "./App.css";

function Floor() {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.05, 0]}>
      <planeGeometry args={[2, 2]} />
      <meshStandardMaterial color="#303045" roughness={0.8} metalness={0.2} />
    </mesh>
  );
}

// Scene component to separate suspense content
function Scene() {
  return (
    <>
      <PetModel />
      <Floor />
    </>
  );
}

export default function App() {
  return (
    <div className="app-container">
      <Canvas shadows camera={{ position: [0, 1.5, 5], fov: 60 }}>
        <color attach="background" args={["#1a1a2e"]} />
        <fog attach="fog" args={["#1a1a2e", 5, 20]} />
        <Stars 
          radius={100} 
          depth={50} 
          count={5000} 
          factor={4} 
          saturation={0} 
          fade 
          speed={1}
        />
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <Environment preset="sunset" />
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05}
          minDistance={3}
          maxDistance={10}
        />
        <Suspense
          fallback={
            <Html center>
              <div className="loading-spinner"></div>
            </Html>
          }
        >
          <Scene />
        </Suspense>
      </Canvas>
      <div className="controls-hint">
        <p>Use mouse to rotate • Scroll to zoom • Right-click to pan</p>
      </div>
    </div>
  );
}
