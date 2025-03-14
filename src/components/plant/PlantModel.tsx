
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PlantModelProps {
  soilMoisture: number;
  temperature: number;
  lightIntensity: number;
  nutrientLevel: number;
  position?: [number, number, number];
  [key: string]: any;
}

const PlantModel: React.FC<PlantModelProps> = ({ 
  soilMoisture, 
  temperature, 
  lightIntensity, 
  nutrientLevel,
  ...props 
}) => {
  const group = useRef<THREE.Group>(null);
  const { nodes, materials } = {
    nodes: {
      pot: { geometry: new THREE.BoxGeometry(1, 1, 1) },
      soil: { geometry: new THREE.CylinderGeometry(0.8, 0.8, 0.3, 32) },
      stem1: { geometry: new THREE.CylinderGeometry(0.05, 0.08, 1.5, 8) },
      stem2: { geometry: new THREE.CylinderGeometry(0.04, 0.06, 1.2, 8) },
      leaf1: { geometry: new THREE.SphereGeometry(0.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2) },
      leaf2: { geometry: new THREE.SphereGeometry(0.25, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2) },
      leaf3: { geometry: new THREE.SphereGeometry(0.35, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2) },
      leaf4: { geometry: new THREE.SphereGeometry(0.28, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2) },
    },
    materials: {
      pot: new THREE.MeshStandardMaterial({ color: '#a67c52' }),
      soil: new THREE.MeshStandardMaterial({ color: '#3a2a18', roughness: 1 }),
      stem: new THREE.MeshStandardMaterial({ color: '#4a7c3d', roughness: 0.8 }),
      leaf: new THREE.MeshStandardMaterial({ 
        color: '#9bdeac', 
        roughness: 0.5, 
        metalness: 0.1, 
        side: THREE.DoubleSide 
      }),
    }
  };

  // Calculate plant health based on sensor values (simplified)
  const plantHealth = (soilMoisture + lightIntensity + nutrientLevel) / 3;
  const leafColor = plantHealth > 70 
    ? '#9bdeac' // Healthy
    : plantHealth > 40 
      ? '#c5e29f' // Moderate
      : '#ebd896'; // Unhealthy

  // Update leaf material color based on plant health
  useEffect(() => {
    if (materials.leaf) {
      materials.leaf.color.set(leafColor);
    }
  }, [plantHealth, materials.leaf, leafColor]);

  // Subtle animation for leaves
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t / 4) * 0.1;
    if (group.current.children.length > 3) {
      // Animate leaves subtly
      for (let i = 3; i < group.current.children.length; i++) {
        const child = group.current.children[i] as THREE.Object3D;
        if (child.rotation) {
          child.rotation.z = Math.sin(t / 2 + i) * 0.05;
        }
      }
    }
  });

  return (
    <group ref={group} {...props} position={props.position || [0, -1.2, 0]}>
      {/* Pot */}
      <mesh 
        castShadow 
        receiveShadow 
        geometry={nodes.pot.geometry} 
        material={materials.pot} 
        position={[0, 0, 0]} 
        scale={[1, 0.8, 1]}
      />
      
      {/* Soil with moisture level visualization */}
      <mesh 
        receiveShadow 
        geometry={nodes.soil.geometry} 
        position={[0, 0.5, 0]} 
        scale={[1, 0.2, 1]}
      >
        <meshStandardMaterial 
          color="#3a2a18" 
          roughness={1} 
          metalness={0.1} 
          opacity={1} 
          transparent
        />
        <mesh 
          position={[0, -0.1, 0]} 
          scale={[soilMoisture / 100, 0.1, soilMoisture / 100]}
        >
          <cylinderGeometry args={[1, 1, 1, 32]} />
          <meshStandardMaterial color="#553c25" transparent opacity={0.8} />
        </mesh>
      </mesh>
      
      {/* Stems */}
      <mesh 
        castShadow 
        geometry={nodes.stem1.geometry} 
        material={materials.stem} 
        position={[0, 1.2, 0]} 
      />
      <mesh 
        castShadow 
        geometry={nodes.stem2.geometry} 
        material={materials.stem} 
        position={[0.3, 1.4, 0.2]} 
        rotation={[0, 0, Math.PI / 6]} 
      />
      
      {/* Leaves */}
      <mesh 
        castShadow 
        geometry={nodes.leaf1.geometry} 
        material={materials.leaf} 
        position={[0, 1.8, 0]} 
        rotation={[0, 0, 0]} 
        scale={[1, 0.2, 1]}
      />
      <mesh 
        castShadow 
        geometry={nodes.leaf2.geometry} 
        material={materials.leaf} 
        position={[0.6, 1.6, 0.2]} 
        rotation={[0, Math.PI / 3, 0]} 
        scale={[1, 0.15, 1]}
      />
      <mesh 
        castShadow 
        geometry={nodes.leaf3.geometry} 
        material={materials.leaf} 
        position={[-0.5, 1.5, -0.2]} 
        rotation={[0, -Math.PI / 4, 0]} 
        scale={[1, 0.18, 1]}
      />
      <mesh 
        castShadow 
        geometry={nodes.leaf4.geometry} 
        material={materials.leaf} 
        position={[0.2, 2.1, 0.5]} 
        rotation={[Math.PI / 6, Math.PI / 5, 0]} 
        scale={[1, 0.12, 1]}
      />
    </group>
  );
};

export default PlantModel;
