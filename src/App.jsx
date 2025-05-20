import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Html,
  Stars,
  useGLTF,
} from "@react-three/drei";
import PetModel from "./PetModel";
import MusicPlayer from "./MusicPlayer";
import ControlsHint from "./ControlsHint";
import ShootingStars from "./ShootingStars";
import PetSwitcher from "./PetSwitcher";
import "./App.css";

const pets = [
  {
    id: "bobi",
    name: "Bobi the Corgi",
    modelPath: "/models/corgi.glb",
    imgPath: "/pic/bobi.png",
    info: ["🐾 Loves belly rubs & treats", "💤 Expert at napping"],
    scale: 2,
    positionY: -0.5,
  },
  {
    id: "molly",
    name: "Molly",
    modelPath: "/models/cat.glb",
    imgPath: "/pic/molly.png",
    info: ["🐄 Likes milk and meowing", "🖤🤍 Black and white beauty"],
    scale: 1.2,
    positionY: -0.7,
  },
  {
    id: "mochi",
    name: "Mochi",
    modelPath: "/models/mochi.glb",
    imgPath: "/pic/mochi.png",
    info: ["🐰 Fluffy and energetic", "🥕 Loves carrots"],
    scale: 1.5,
    positionY: -0.6,
  },
  {
    id: "me",
    name: "Me",
    modelPath: "/models/me.glb",
    imgPath: "/pic/me.png",
    info: ["🧑‍💻 Loves coding & pets!", "✨ Dreamer & Creator"],
    scale: 1.0,
    positionY: -0.8,
  }
];

// Preload all pet models
pets.forEach((pet) => {
  try {
    useGLTF.preload(pet.modelPath);
  } catch (e) {
    console.warn(`Failed to preload model: ${pet.modelPath}`, e);
  }
});

function Floor() {
  return (
    <mesh
      receiveShadow
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1.05, 0]}
    >
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#303045" roughness={0.8} metalness={0.2} />
    </mesh>
  );
}

// Scene component to separate suspense content
function Scene({ currentPet }) {
  return (
    <>
      <PetModel petData={currentPet} />
      <ShootingStars />
    </>
  );
}

export default function App() {
  const [currentPetIndex, setCurrentPetIndex] = useState(0);

  const handleNextPet = () => {
    setCurrentPetIndex((prevIndex) => (prevIndex + 1) % pets.length);
  };

  const handlePrevPet = () => {
    setCurrentPetIndex(
      (prevIndex) => (prevIndex - 1 + pets.length) % pets.length
    );
  };

  const currentPet = pets[currentPetIndex];

  return (
    <div className="app-container">
      <PetSwitcher
        onPrev={handlePrevPet}
        onNext={handleNextPet}
        currentPetName={currentPet.name}
      />
      <Canvas shadows camera={{ position: [0, 1.5, 5], fov: 60 }}>
        <color attach="background" args={["#1a1a2e"]} />
        <fog attach="fog" args={["#1a1a2e", 5, 20]} />
        <Stars
          radius={100}
          depth={60}
          count={5000}
          factor={5}
          saturation={0}
          fade
          speed={2}
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
          target={[0, currentPet.positionY + 0.5, 0]}
        />
        <Suspense
          fallback={
            <Html center>
              <div className="loading-spinner"></div>
            </Html>
          }
        >
          <Scene currentPet={currentPet} />
        </Suspense>
      </Canvas>
      <MusicPlayer />
      <ControlsHint />
    </div>
  );
}
