import React from 'react';

// Styles for this component are in App.css under the .controls-hint class
// If more specific styles are needed in the future, consider creating ControlsHint.css

function ControlsHint() {
  return (
    <div className="controls-hint">
      <p>Use mouse to rotate • Scroll to zoom • Right-click to pan</p>
    </div>
  );
}

export default ControlsHint; 