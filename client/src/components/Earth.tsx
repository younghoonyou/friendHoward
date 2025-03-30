import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Html, Billboard } from '@react-three/drei';
import * as THREE from 'three';

// Vancouver location: [49.2827, -123.1207]
// Taiwan location: [25.0330, 121.5654]
const startCoordinates = [49.2827, -123.1207];
const endCoordinates = [25.0330, 121.5654];

// Calculate the rotation needed to position Vancouver at the front of the globe
const vancouverLongitudeRadians = (-123.1207 + 180) * (Math.PI / 180);
const initialRotation = vancouverLongitudeRadians;

// Calculate the total rotation needed from Vancouver to Taipei
const taipeiLongitudeRadians = (121.5654 + 180) * (Math.PI / 180);
const totalRotationNeeded = taipeiLongitudeRadians - vancouverLongitudeRadians;

const Earth: React.FC<{ scrollY: number }> = ({ scrollY }) => {
  const earthGroupRef = useRef<THREE.Group>(null);
  const curveRef = useRef<any>(null);
  const planeRef = useRef<THREE.Group>(null);
  const [pathProgress, setPathProgress] = useState(0);
  const [earthRotation, setEarthRotation] = useState(initialRotation);
  const [lightIntensity, setLightIntensity] = useState(0);
  const [EarthRadius, setEarthRadius] = useState(1);

  // Load textures
  const earthTexture = useTexture('earth-texture.jpg');
  const planeTexture = useTexture('airplane.png');

  // Pulsing light effect
  useEffect(() => {
    const interval = setInterval(() => {
      setLightIntensity(prev => {
        return Math.sin(Date.now() / 300) * 0.5 + 0.5;  // Pulsing intensity between 0 and 1
      });
    }, 16);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 768) {
        setEarthRadius(0.8); // Smaller on mobile
      } else {
        setEarthRadius(1); // Default size on larger screens
      }
    };

    updateSize(); // Call on mount
    window.addEventListener("resize", updateSize); // Listen for window resize

    return () => window.removeEventListener("resize", updateSize); // Cleanup
  }, []);


  useEffect(() => {
    if (!earthGroupRef.current) return;
    
    // Calculate path progress based on scroll position (0 to 1)
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
    setPathProgress(progress);
    
    // Calculate earth rotation based on progress
    // Start at initialRotation, then rotate by progress * totalRotationNeeded
    const newRotation = initialRotation + (progress * totalRotationNeeded);
    setEarthRotation(newRotation);
  }, [scrollY]);

  useFrame(() => {
    if (earthGroupRef.current) {
      // Set the earth's rotation based on scroll position
      earthGroupRef.current.rotation.y = earthRotation;
    }

    if (planeRef.current) {
      try {
        // Get the pre-calculated curve
        const { curve } = flightPathData.current;
        
        // Get position on the curve based on scroll progress
        const point = curve.getPointAt(pathProgress);
        
        // Position the plane at that point
        planeRef.current.position.copy(point);
        
        // Offset the plane a little bit outward from the curve
        const normalizedPosition = point.clone().normalize();
        planeRef.current.position.add(normalizedPosition.multiplyScalar(0.05));
        
        // Set rotation to look along the path
        if (pathProgress < 0.99) {
          // Get a point slightly ahead to orient the plane

          const normalizedPos = planeRef.current.position.clone().normalize();
          planeRef.current.position.add(normalizedPos.multiplyScalar(0.01));
        }
        
        // Make the plane larger so it's more visible
        const scale = window.innerWidth < 768 ? 0.7 : 1;
        planeRef.current.scale.set(scale, scale, scale);
      } catch (err) {
        console.error('Error updating flight path:', err);
      }
    }
  });

  // Convert lat/lng to 3D position on sphere
  const latLongToVector3 = (lat: number, lon: number, radius: number): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    return new THREE.Vector3(x, y, z);
  };

  // Create the flight path with more control points for a smoother curve
  const createFlightPath = () => {
    // We add a bit of elevation to the path so it's above the Earth's surface
    const radius = EarthRadius * 1.05;
    const start = latLongToVector3(startCoordinates[0], startCoordinates[1], radius);
    const end = latLongToVector3(endCoordinates[0], endCoordinates[1], radius);
    
    // Calculate intermediate points for a more natural arc
    // Create a much higher arc to make it more visible
    const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    midPoint.normalize().multiplyScalar(radius * 1.8); // Higher arc (1.8 times radius)
    
    // Create additional control points for a smoother curve
    const quarterPoint = new THREE.Vector3().addVectors(start, midPoint).multiplyScalar(0.5);
    quarterPoint.normalize().multiplyScalar(radius * 1.5);
    
    const threeQuarterPoint = new THREE.Vector3().addVectors(midPoint, end).multiplyScalar(0.5);
    threeQuarterPoint.normalize().multiplyScalar(radius * 1.5);
    
    // Add more control points for an even smoother curve
    const curve = new THREE.CatmullRomCurve3([
      start,
      quarterPoint,
      midPoint,
      threeQuarterPoint,
      end
    ]);
    
    const points = curve.getPoints(200); // More points for smoother curve
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    // Important: This is needed for the dashed line to work properly
    geometry.computeBoundingSphere();
    
    return { geometry, curve, points };
  };

  // Store the flight path data for reference
  const flightPathData = useRef(createFlightPath());
  
  // Update the flight path when the Earth radius changes
  useEffect(() => {
    flightPathData.current = createFlightPath();
  }, [EarthRadius]);

  // Mark the beginning and end points
  const startMarker = latLongToVector3(startCoordinates[0], startCoordinates[1], 1.03); // Slightly above surface
  const endMarker = latLongToVector3(endCoordinates[0], endCoordinates[1], 1.03); // Slightly above surface

  return (
    <group>
      {/* Earth group with all markers - all rotate together */}
      <group ref={earthGroupRef}>
        {/* Earth sphere */}
        <mesh>
          <sphereGeometry args={[EarthRadius, 64, 64]} />
          <meshStandardMaterial map={earthTexture} />
        </mesh>
        
        {/* Flight path - using dashed line for more visual interest */}
        <primitive 
          object={new THREE.Line(
            flightPathData.current.geometry,
            new THREE.LineDashedMaterial({ 
              color: 'red', 
              dashSize: 0.1, 
              gapSize: 0.03,
              linewidth: 5,
              transparent: true,
              opacity: 1
            })
          )} 
          ref={curveRef} 
          onUpdate={(self:any) => {
            // Important: We need to call this to make the dashed line work
            self.computeLineDistances();
          }}
        />
        
        {/* Canada marker - glowing point */}
        <group position={startMarker}>
          {/* Inner bright core */}
          <mesh scale={0.01}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial color="blue" />
          </mesh>
          
          {/* Outer glow */}
          <mesh scale={0.025}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial 
              color="lightblue" 
              transparent={true} 
              opacity={0.5 * lightIntensity} 
            />
          </mesh>
          
          {/* Point light */}
          <pointLight 
            color="blue" 
            intensity={1 * lightIntensity} 
            distance={0.2} 
          />
          
          {/* Label */}
          <Billboard position={[0, 0.05, 0]}>
            <Html distanceFactor={10}>
              <div style={{ 
                color: 'white', 
                backgroundColor: 'rgba(0,0,100,0.7)', 
                padding: '2px 5px', 
                borderRadius: '3px',
                fontSize: '10px',
                fontWeight: 'bold',
                userSelect: 'none'
              }}>
                Canada
              </div>
            </Html>
          </Billboard>
        </group>
        
        {/* Taiwan marker - glowing point */}
        <group position={endMarker}>
          {/* Inner bright core */}
          <mesh scale={0.015}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial color="green" />
          </mesh>
          
          {/* Outer glow */}
          <mesh scale={0.025}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial 
              color="lightgreen" 
              transparent={true} 
              opacity={0.5 * lightIntensity} 
            />
          </mesh>
          
          {/* Point light */}
          <pointLight 
            color="green" 
            intensity={1 * lightIntensity} 
            distance={0.2} 
          />
          
          {/* Label */}
          <Billboard position={[0, 0.05, 0]}>
            <Html distanceFactor={10}>
              <div style={{ 
                color: 'white', 
                backgroundColor: 'rgba(0,100,0,0.7)', 
                padding: '2px 5px', 
                borderRadius: '3px',
                fontSize: '10px',
                fontWeight: 'bold',
                userSelect: 'none'
              }}>
                Taiwan
              </div>
            </Html>
          </Billboard>
        </group>
        
        {/* Airplane using sprite/billboard with your provided image - inside the rotating group */}
        <group ref={planeRef}>
          <Billboard
            follow={true}
            lockX={false}
            lockY={false}
            lockZ={false}
          >
            {/* Larger plane mesh for better visibility */}
            <mesh>
              <planeGeometry args={[0.4, 0.2]} />
              <meshBasicMaterial 
                map={planeTexture} 
                transparent={true} 
                side={THREE.DoubleSide}
                color="white" // Make it brighter
              />
            </mesh>
          </Billboard>
        </group>
      </group>
    </group>
  );
};

export default Earth;