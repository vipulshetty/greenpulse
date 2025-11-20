
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PlantModelProps {
  soilMoisture: number;
  temperature: number;
  lightIntensity: number;
  nutrientLevel: number;
  highlightedPart?: string | null;
  position?: [number, number, number];
}

const PlantModel: React.FC<PlantModelProps> = ({ 
  soilMoisture, 
  temperature, 
  lightIntensity, 
  nutrientLevel,
  highlightedPart,
  position = [0, -1.2, 0]
}) => {
  const group = useRef<THREE.Group>(null);
  
  // Calculate plant health based on sensor values
  const plantHealth = (soilMoisture + lightIntensity + nutrientLevel) / 3;
  const isHealthy = plantHealth > 60;
  
  // Dynamic colors based on health
  const leafColor = plantHealth > 70 
    ? '#22c55e' // Vibrant green - Healthy
    : plantHealth > 50 
      ? '#84cc16' // Yellow-green - Moderate
      : plantHealth > 30
        ? '#facc15' // Yellow - Poor
        : '#f59e0b'; // Orange - Very poor

  const stemColor = plantHealth > 60 ? '#15803d' : '#4d7c0f';
  
  // Define improved geometries
  const potGeometry = new THREE.CylinderGeometry(0.9, 0.7, 1, 32);
  const soilGeometry = new THREE.CylinderGeometry(0.88, 0.88, 0.15, 32);
  const stem1Geometry = new THREE.CylinderGeometry(0.06, 0.1, 2, 16);
  const stem2Geometry = new THREE.CylinderGeometry(0.04, 0.08, 1.5, 16);
  const stem3Geometry = new THREE.CylinderGeometry(0.035, 0.07, 1.3, 16);
  
  // Better leaf geometry - more organic shape
  const createLeafGeometry = (size: number) => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(size * 0.5, size * 0.3, size, 0);
    shape.quadraticCurveTo(size * 0.7, -size * 0.1, size * 0.5, -size * 0.3);
    shape.quadraticCurveTo(size * 0.3, -size * 0.1, 0, 0);
    
    const extrudeSettings = {
      steps: 1,
      depth: 0.02,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelSegments: 3
    };
    
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  };
  
  // Materials with better appearance
  const potMaterial = new THREE.MeshStandardMaterial({ 
    color: '#92400e',
    roughness: 0.8,
    metalness: 0.1
  });
  
  const soilMaterial = new THREE.MeshStandardMaterial({ 
    color: '#422006', 
    roughness: 1,
    metalness: 0
  });
  
  const stemMaterial = new THREE.MeshStandardMaterial({ 
    color: stemColor, 
    roughness: 0.6,
    metalness: 0.1
  });
  
  const leafMaterial = new THREE.MeshStandardMaterial({ 
    color: leafColor, 
    roughness: 0.4, 
    metalness: 0.2,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.95
  });
  
  const flowerCenterMaterial = new THREE.MeshStandardMaterial({ 
    color: '#fcd34d',
    roughness: 0.3,
    metalness: 0.1
  });
  
  const flowerPetalMaterial = new THREE.MeshStandardMaterial({ 
    color: isHealthy ? '#fb7185' : '#d1d5db',
    roughness: 0.3,
    metalness: 0.1
  });

  // Update materials based on plant health
  useEffect(() => {
    leafMaterial.color.set(leafColor);
    stemMaterial.color.set(stemColor);
  }, [plantHealth]);

  // Highlight selected part if needed
  useEffect(() => {
    // Reset all materials to original
    potMaterial.emissive = new THREE.Color(0x000000);
    soilMaterial.emissive = new THREE.Color(0x000000);
    stemMaterial.emissive = new THREE.Color(0x000000);
    leafMaterial.emissive = new THREE.Color(0x000000);
    
    // Highlight based on the active detail
    if (highlightedPart) {
      switch(highlightedPart) {
        case 'moisture':
          soilMaterial.emissive = new THREE.Color(0x3b82f6);
          soilMaterial.emissiveIntensity = 0.3;
          break;
        case 'temperature':
          stemMaterial.emissive = new THREE.Color(0xf59e0b);
          stemMaterial.emissiveIntensity = 0.3;
          break;
        case 'light':
          leafMaterial.emissive = new THREE.Color(0xfbbf24);
          leafMaterial.emissiveIntensity = 0.3;
          break;
        case 'nutrients':
          potMaterial.emissive = new THREE.Color(0x10b981);
          potMaterial.emissiveIntensity = 0.3;
          break;
      }
    }
  }, [highlightedPart]);

  // Natural swaying animation
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    
    // Gentle rotation
    group.current.rotation.y = Math.sin(t / 8) * 0.05;
    
    // Animate leaves with natural sway
    if (group.current.children && group.current.children.length > 4) {
      for (let i = 4; i < group.current.children.length; i++) {
        const child = group.current.children[i] as THREE.Mesh;
        if (child && 'rotation' in child) {
          child.rotation.z = Math.sin(t + i * 0.5) * 0.08;
          child.rotation.x = Math.cos(t * 0.5 + i) * 0.05;
        }
      }
    }
  });

  return (
    <group ref={group} position={position}>
      {/* Improved Pot */}
      <mesh 
        castShadow 
        receiveShadow 
        geometry={potGeometry} 
        material={potMaterial}
        position={[0, 0, 0]}
      />
      
      {/* Soil */}
      <mesh 
        receiveShadow 
        geometry={soilGeometry}
        material={soilMaterial}
        position={[0, 0.5, 0]}
      />
      
      {/* Moisture indicator in soil */}
      <mesh position={[0, 0.57, 0]}>
        <cylinderGeometry args={[0.85 * (soilMoisture / 100), 0.85 * (soilMoisture / 100), 0.02, 32]} />
        <meshStandardMaterial color="#1e40af" transparent opacity={0.3} />
      </mesh>
      
      {/* Main Stem */}
      <mesh 
        castShadow 
        geometry={stem1Geometry}
        material={stemMaterial}
        position={[0, 1.5, 0]}
      />
      
      {/* Branch stems */}
      <mesh 
        castShadow 
        geometry={stem2Geometry}
        material={stemMaterial}
        position={[0.4, 1.7, 0]}
        rotation={[0, 0, Math.PI / 5]}
      />
      <mesh 
        castShadow 
        geometry={stem3Geometry}
        material={stemMaterial}
        position={[-0.35, 1.5, 0]}
        rotation={[0, 0, -Math.PI / 6]}
      />
      
      {/* Leaves - more realistic shapes */}
      <mesh 
        castShadow 
        geometry={createLeafGeometry(0.5)}
        material={leafMaterial}
        position={[0, 2.3, 0]}
        rotation={[Math.PI / 2, 0, Math.PI / 4]}
      />
      <mesh 
        castShadow 
        geometry={createLeafGeometry(0.45)}
        material={leafMaterial}
        position={[0.65, 2, 0.1]}
        rotation={[Math.PI / 2.2, 0.3, Math.PI / 3]}
      />
      <mesh 
        castShadow 
        geometry={createLeafGeometry(0.52)}
        material={leafMaterial}
        position={[-0.6, 1.8, -0.1]}
        rotation={[Math.PI / 1.8, -0.4, -Math.PI / 4]}
      />
      <mesh 
        castShadow 
        geometry={createLeafGeometry(0.42)}
        material={leafMaterial}
        position={[0.3, 2.5, 0.3]}
        rotation={[Math.PI / 2.5, 0.2, Math.PI / 6]}
      />
      <mesh 
        castShadow 
        geometry={createLeafGeometry(0.38)}
        material={leafMaterial}
        position={[-0.3, 2.2, -0.2]}
        rotation={[Math.PI / 2.3, -0.3, -Math.PI / 5]}
      />
      <mesh 
        castShadow 
        geometry={createLeafGeometry(0.48)}
        material={leafMaterial}
        position={[0.15, 1.9, 0.4]}
        rotation={[Math.PI / 2.1, 0.5, Math.PI / 8]}
      />
      
      {/* Flowers - only if plant is healthy */}
      {isHealthy && (
        <>
          {/* Flower 1 */}
          <group position={[0.2, 2.6, 0.2]}>
            <mesh geometry={new THREE.SphereGeometry(0.08, 16, 16)} material={flowerCenterMaterial} />
            {[0, 1, 2, 3, 4].map((i) => (
              <mesh
                key={i}
                geometry={new THREE.SphereGeometry(0.12, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2)}
                material={flowerPetalMaterial}
                position={[
                  Math.cos((i * Math.PI * 2) / 5) * 0.15,
                  0,
                  Math.sin((i * Math.PI * 2) / 5) * 0.15
                ]}
                rotation={[0, 0, (i * Math.PI * 2) / 5]}
                scale={[1, 0.3, 1]}
              />
            ))}
          </group>
          
          {/* Flower 2 */}
          <group position={[-0.4, 2.1, -0.1]}>
            <mesh geometry={new THREE.SphereGeometry(0.06, 16, 16)} material={flowerCenterMaterial} />
            {[0, 1, 2, 3, 4].map((i) => (
              <mesh
                key={i}
                geometry={new THREE.SphereGeometry(0.1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2)}
                material={flowerPetalMaterial}
                position={[
                  Math.cos((i * Math.PI * 2) / 5) * 0.12,
                  0,
                  Math.sin((i * Math.PI * 2) / 5) * 0.12
                ]}
                rotation={[0, 0, (i * Math.PI * 2) / 5]}
                scale={[1, 0.3, 1]}
              />
            ))}
          </group>
        </>
      )}
    </group>
  );
};

export default PlantModel;
