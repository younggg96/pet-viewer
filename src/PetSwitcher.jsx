import React from 'react';
import './PetSwitcher.css'; // We will create this CSS file

// SVG Icons for Prev/Next (can be similar to MusicPlayer ones or custom)
const PrevIcon = () => (
  <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" fill="currentColor">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
  </svg>
);

const NextIcon = () => (
  <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" fill="currentColor">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
  </svg>
);

function PetSwitcher({ onPrev, onNext, currentPetName }) {
  return (
    <div className="pet-switcher-container">
      <button onClick={onPrev} className="pet-switch-button" aria-label="Previous Pet">
        <PrevIcon />
      </button>
      <div className="pet-switcher-name">{currentPetName}</div>
      <button onClick={onNext} className="pet-switch-button" aria-label="Next Pet">
        <NextIcon />
      </button>
    </div>
  );
}

export default PetSwitcher; 