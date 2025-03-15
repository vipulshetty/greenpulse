
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
  
  // Define geometries and materials
  const potGeometry = new THREE.BoxGeometry(1, 1, 1);
  const soilGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.3, 32);
  const stem1Geometry = new THREE.CylinderGeometry(0.05, 0.08, 1.5, 8);
  const stem2Geometry = new THREE.CylinderGeometry(0.04, 0.06, 1.2, 8);
  const leaf1Geometry = new THREE.SphereGeometry(0.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const leaf2Geometry = new THREE.SphereGeometry(0.25, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const leaf3Geometry = new THREE.SphereGeometry(0.35, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const leaf4Geometry = new THREE.SphereGeometry(0.28, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  
  const potMaterial = new THREE.MeshStandardMaterial({ color: '#a67c52' });
  const soilMaterial = new THREE.MeshStandardMaterial({ color: '#3a2a18', roughness: 1 });
  const stemMaterial = new THREE.MeshStandardMaterial({ color: '#4a7c3d', roughness: 0.8 });
  const leafMaterial = new THREE.MeshStandardMaterial({ 
    color: '#9bdeac', 
    roughness: 0.5, 
    metalness: 0.1, 
    side: THREE.DoubleSide 
  });

  // Calculate plant health based on sensor values (simplified)
  const plantHealth = (soilMoisture + lightIntensity + nutrientLevel) / 3;
  const leafColor = plantHealth > 70 
    ? '#9bdeac' // Healthy
    : plantHealth > 40 
      ? '#c5e29f' // Moderate
      : '#ebd896'; // Unhealthy

  // Update leaf material color based on plant health
  useEffect(() => {
    if (leafMaterial) {
      leafMaterial.color.set(leafColor);
    }
  }, [plantHealth, leafMaterial, leafColor]);

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

  // Subtle animation for leaves
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t / 4) * 0.1;
    
    // Type guard to check if children exist
    if (group.current.children && group.current.children.length > 3) {
      // Animate leaves subtly
      for (let i = 3; i < group.current.children.length; i++) {
        const child = group.current.children[i] as THREE.Object3D;
        if (child && 'rotation' in child) {
          child.rotation.z = Math.sin(t / 2 + i) * 0.05;
        }
      }
    }
  });

  return (
    <group ref={group} position={position}>
      {/* Pot */}
      <mesh 
        castShadow 
        receiveShadow 
        geometry={potGeometry} 
        material={potMaterial}
        position={[0, 0, 0]} 
        scale={[1, 0.8, 1]}
      />
      
      {/* Soil with moisture level visualization */}
      <mesh 
        receiveShadow 
        geometry={soilGeometry}
        material={soilMaterial}
        position={[0, 0.5, 0]} 
        scale={[1, 0.2, 1]}
      />
      <mesh 
        position={[0, 0.4, 0]} 
        scale={[soilMoisture / 100, 0.1, soilMoisture / 100]}
      >
        <cylinderGeometry args={[1, 1, 1, 32]} />
        <meshStandardMaterial color="#553c25" transparent opacity={0.8} />
      </mesh>
      
      {/* Stems */}
      <mesh 
        castShadow 
        geometry={stem1Geometry}
        material={stemMaterial}
        position={[0, 1.2, 0]} 
      />
      <mesh 
        castShadow 
        geometry={stem2Geometry}
        material={stemMaterial}
        position={[0.3, 1.4, 0.2]} 
        rotation={[0, 0, Math.PI / 6]} 
      />
      
      {/* Leaves */}
      <mesh 
        castShadow 
        geometry={leaf1Geometry}
        material={leafMaterial}
        position={[0, 1.8, 0]} 
        rotation={[0, 0, 0]} 
        scale={[1, 0.2, 1]}
      />
      <mesh 
        castShadow 
        geometry={leaf2Geometry}
        material={leafMaterial}
        position={[0.6, 1.6, 0.2]} 
        rotation={[0, Math.PI / 3, 0]} 
        scale={[1, 0.15, 1]}
      />
      <mesh 
        castShadow 
        geometry={leaf3Geometry}
        material={leafMaterial}
        position={[-0.5, 1.5, -0.2]} 
        rotation={[0, -Math.PI / 4, 0]} 
        scale={[1, 0.18, 1]}
      />
      <mesh 
        castShadow 
        geometry={leaf4Geometry}
        material={leafMaterial}
        position={[0.2, 2.1, 0.5]} 
        rotation={[Math.PI / 6, Math.PI / 5, 0]} 
        scale={[1, 0.12, 1]}
      />
    </group>
  );
};

export default PlantModel;
