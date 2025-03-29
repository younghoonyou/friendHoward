import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Html, Billboard } from '@react-three/drei';
import * as THREE from 'three';

// Vancouver coordinates: [49.2827, -123.1207]
// Taipei coordinates: [25.0330, 121.5654]
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

  // Load textures
  const earthTexture = useTexture('/earth-texture.jpg');
  const planeTexture = useTexture('/airplane.png');

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

    if (planeRef.current && curveRef.current) {
      try {
        // Move the plane along the path based on scroll progress
        const curve = new THREE.CatmullRomCurve3(
          curveRef.current.geometry.getAttribute('position').array as unknown as THREE.Vector3[]
        );
        const position = curve.getPoint(pathProgress);
        console.log(position)
        
      //   if (position) {
      //     planeRef.current.position.set(position.x, position.y, position.z);
          
      //     // Orient the plane in the direction of travel
      //     if (pathProgress < 0.99) {
      //       const tangent = curve.getTangent(Math.min(pathProgress + 0.01, 0.99));
      //       const lookAt = new THREE.Vector3().addVectors(position, tangent);
            
      //       // Get the direction vector from position to lookAt
      //       const direction = new THREE.Vector3().subVectors(lookAt, position).normalize();
            
      //       // Calculate rotation for the plane to face the direction of travel
      //       const angle = Math.atan2(direction.x, direction.z);
      //       planeRef.current.rotation.y = angle;
      //       planeRef.current.rotation.x = Math.asin(-direction.y);
      //     }
      //   }
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
    const radius = 1;
    const start = latLongToVector3(startCoordinates[0], startCoordinates[1], radius);
    const end = latLongToVector3(endCoordinates[0], endCoordinates[1], radius);
    
    // Calculate intermediate points for a more natural arc
    // Create a higher arc to make it more visible
    const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    midPoint.normalize().multiplyScalar(radius * 1.5); // Higher arc (1.5 times radius)
    
    // Create additional control points for a smoother curve
    const quarterPoint = new THREE.Vector3().addVectors(start, midPoint).multiplyScalar(0.5);
    quarterPoint.normalize().multiplyScalar(radius * 1.3);
    
    const threeQuarterPoint = new THREE.Vector3().addVectors(midPoint, end).multiplyScalar(0.5);
    threeQuarterPoint.normalize().multiplyScalar(radius * 1.3);
    
    const curve = new THREE.CatmullRomCurve3([
      start,
      quarterPoint,
      midPoint,
      threeQuarterPoint,
      end
    ]);
    
    const points = curve.getPoints(100); // More points for smoother curve
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    
    return { geometry, curve };
  };

  const { geometry: pathGeometry } = createFlightPath();

  // Mark the beginning and end points
  const startMarker = latLongToVector3(startCoordinates[0], startCoordinates[1], 1.03); // Slightly above surface
  const endMarker = latLongToVector3(endCoordinates[0], endCoordinates[1], 1.03); // Slightly above surface

  return (
    <group>
      {/* Earth group with all markers - all rotate together */}
      <group ref={earthGroupRef}>
        {/* Earth sphere */}
        <mesh>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial map={earthTexture} />
        </mesh>
        
        {/* Flight path - using dashed line for more visual interest */}
        <primitive 
          object={new THREE.Line(
            pathGeometry,
            new THREE.LineDashedMaterial({ 
              color: 'red', 
              dashSize: 0.05, 
              gapSize: 0.05,
              linewidth: 5
            })
          )} 
          ref={curveRef} 
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
      </group>
      
      {/* Airplane using sprite/billboard with your provided image - outside the rotating group */}
      <group ref={planeRef} scale={0.8}>
        <Billboard
          follow={true}
          lockX={false}
          lockY={false}
          lockZ={false}
        >
          <mesh>
            <planeGeometry args={[1, 0.5]} />
            <meshBasicMaterial 
              map={planeTexture} 
              transparent={true} 
              side={THREE.DoubleSide} 
            />
          </mesh>
          
          {/* Small light for visibility */}
          <pointLight 
            position={[0, 0, 0]} 
            intensity={0.5} 
            color="white" 
            distance={0.5} 
          />
        </Billboard>
      </group>
    </group>
  );
};

export default Earth;