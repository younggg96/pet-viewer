import React, { useRef, useState, useEffect, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";
import PhotoSign from './PhotoSign'; // Import the new PhotoSign component

// Helper component to load and display the model, enabling Suspense
function ActualModel({ modelPath, modelRef, scale, positionY, onClick, onPointerOver, onPointerOut }) {
  const { scene } = useGLTF(modelPath);
  // It's important to apply scale and position to the primitive or a wrapping group
  // Also, clone the scene if you intend to reuse it or prevent modifications to the original cache
  return (
    <primitive
      object={scene.clone()} // Clone for safety if this model is re-used elsewhere or props change
      ref={modelRef}
      position={[0, positionY, 0]} // Use positionY from props for vertical adjustment
      scale={scale}      // Use scale from props
      castShadow
      dispose={null} // Important: dispose={null} if you handle disposal elsewhere or not needed for cloned scene
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    />
  );
}

export default function PetModel({ petData }) {
  const { modelPath, name, info, scale = 1, positionY = 0, imgPath } = petData;
  const modelRef = useRef();
  const [showInfo, setShowInfo] = useState(false);
  const [hover, setHover] = useState(false);
  
  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.position.y = positionY + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.05;
      if (hover) {
        modelRef.current.rotation.y += delta * 0.8;
      } else {
        modelRef.current.rotation.y += delta * 0.2;
      }
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    setShowInfo(!showInfo);
  };

  const handlePointerOver = () => {
    setHover(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHover(false);
    document.body.style.cursor = 'auto';
  };

  useEffect(() => {
    // Reset showInfo when petData changes, so the card doesn't persist from a previous model
    setShowInfo(false);
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [petData]); // Depend on petData

  // Define properties for the PhotoSign
  // Adjusted X and Z values to move the sign further from the model and slightly more forward
  // Adjusted Y value to better align with pet's center
  const signPosition = [positionY > -0.5 ? 1.8 : 2.2, positionY + 0.7, 0.5]; 
  const signScale = [1, 1, 1]; 
  const signRotation = [0, -Math.PI / 6, 0]; 

  return (
    <>
      <Suspense fallback={
        <Html center>
          <div className="loading-spinner"></div>
        </Html>
      }>
        <ActualModel 
          modelPath={modelPath} 
          modelRef={modelRef} 
          scale={scale} 
          positionY={positionY}
          onClick={handleClick} 
          onPointerOver={handlePointerOver} 
          onPointerOut={handlePointerOut} 
        />
        {/* Add the PhotoSign component here if imgPath exists */}
        {imgPath && 
          <PhotoSign 
            imgPath={imgPath} 
            position={signPosition} 
            scale={signScale} 
            rotation={signRotation} 
          />
        }
      </Suspense>
      
      {showInfo && (
        <Html position={[0, positionY + 1.8, 0]}> {/* Adjust HTML info card position based on model's Y */}
          <div className="pet-info-card">
            {imgPath && <img src={imgPath} alt={name} className="pet-info-image" />}
            <h3>{name}</h3>
            {info.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </Html>
      )}
    </>
  );
}

// Preload models if paths are known, but handle errors gracefully
// This part should be adapted when we define the list of pets in App.jsx
// For now, I'll remove the hardcoded preload here as it will be managed by App.jsx potentially
// try {
//   useGLTF.preload("/models/corgi.glb"); // This would need to be dynamic
// } catch (e) {
//   console.log("Model preload failed");
// }
