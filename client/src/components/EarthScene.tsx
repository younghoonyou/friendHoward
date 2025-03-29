import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Earth from './Earth';

interface EarthSceneProps {
  scrollY: number;
}

const EarthScene: React.FC<EarthSceneProps> = ({ scrollY }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraPosition, setCameraPosition] = useState([0, 0, 3]);
  
  // Adjust camera position based on scroll position for a more dynamic view
  useEffect(() => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
    
    // Start with side view and move to top view as user scrolls
    // 49.2827, -123.1207
    const initialX = 0;
    const finalX = -1.5;
    const initialY = 0;
    const finalY = 2;
    const initialZ = 3;
    const finalZ = 2.5;
    
    const newX = initialX + progress * (finalX - initialX);
    const newY = initialY + progress * (finalY - initialY);
    const newZ = initialZ + progress * (finalZ - initialZ);
    
    setCameraPosition([newX, newY, newZ]);
  }, [scrollY]);

  return (
    <div className="canvas-container">
      <Canvas
        ref={canvasRef}
        camera={{ 
          position: cameraPosition as [number, number, number], 
          fov: 60
        }}
        style={{ 
          background: 'linear-gradient(to bottom, #000235, #020659)',
        }}
      >
        {/* Ambient light for base illumination */}
        <ambientLight intensity={1.4} />
        
        {/* Main directional light as the sun */}
        <directionalLight 
          position={[5, 3, 5]} 
          intensity={1.5} 
          castShadow 
        />
        
        {/* Secondary light for better visibility of Canada/Taiwan */}
        <pointLight
          position={[-3, 1, 2]}
          intensity={0.6}
          color="white"
        />
        
        {/* Beautiful star field */}
        <Stars 
          radius={100} 
          depth={50} 
          count={5000} 
          factor={4} 
          saturation={0} 
          fade
        />
        
        {/* Earth with flight path */}
        <Earth scrollY={scrollY} />
        
        {/* Camera controls - limited to prevent disorientation */}
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          minDistance={2}
          maxDistance={8}
          zoomSpeed={0.5}
          rotateSpeed={0.3}
          minPolarAngle={Math.PI / 4} // Limit vertical rotation
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
};

export default EarthScene;