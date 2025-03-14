import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, PerspectiveCamera, ContactShadows, Environment, useTexture } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Droplet, ThermometerIcon, Sun, Sprout } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as THREE from 'three';

// This is a placeholder model - in a production app, you would use a real plant model
function PlantModel({ soilMoisture, temperature, lightIntensity, nutrientLevel, ...props }) {
  const group = useRef<THREE.Group>();
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
    <group ref={group as React.RefObject<THREE.Group>} {...props} position={[0, -1.2, 0]}>
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
}

interface InteractivePlantProps {
  sensorData: {
    temperature: number;
    humidity: number;
    soilMoisture: number;
    lightIntensity: number;
    nitrogenLevel: number;
    phosphorusLevel: number;
  };
  className?: string;
}

const InteractivePlant: React.FC<InteractivePlantProps> = ({ sensorData, className }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [activeDetail, setActiveDetail] = useState<string | null>(null);
  
  const toggleDetails = () => setShowDetails(!showDetails);
  
  const details = [
    { 
      id: 'moisture', 
      icon: <Droplet className="h-5 w-5" />, 
      label: 'Soil Moisture', 
      value: sensorData.soilMoisture, 
      unit: '%',
      color: '#3b82f6'
    },
    { 
      id: 'temperature', 
      icon: <ThermometerIcon className="h-5 w-5" />, 
      label: 'Temperature', 
      value: sensorData.temperature, 
      unit: '°C',
      color: '#f59e0b'
    },
    { 
      id: 'light', 
      icon: <Sun className="h-5 w-5" />, 
      label: 'Light', 
      value: sensorData.lightIntensity, 
      unit: '%',
      color: '#fbbf24'
    },
    { 
      id: 'nutrients', 
      icon: <Sprout className="h-5 w-5" />, 
      label: 'Nutrients', 
      value: (sensorData.nitrogenLevel + sensorData.phosphorusLevel) / 2, 
      unit: 'mg/kg',
      color: '#10b981'
    }
  ];

  return (
    <motion.div 
      className={cn(
        "relative bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden", 
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="aspect-square md:aspect-[4/3] w-full relative">
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={40} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} />
          <PlantModel 
            soilMoisture={sensorData.soilMoisture} 
            temperature={sensorData.temperature} 
            lightIntensity={sensorData.lightIntensity} 
            nutrientLevel={(sensorData.nitrogenLevel + sensorData.phosphorusLevel) / 2}
          />
          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={5} blur={2.5} far={4} />
          <Environment preset="sunset" />
          <OrbitControls 
            enablePan={false} 
            minPolarAngle={Math.PI / 6} 
            maxPolarAngle={Math.PI / 2} 
            minDistance={3} 
            maxDistance={7}
          />
        </Canvas>

        {/* Plant name overlay */}
        <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-sm">
          <h3 className="font-medium text-foreground">Plant Name: Harmony</h3>
        </div>

        {/* Interactive details toggle button */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-4 right-4 gap-1 shadow-md"
          onClick={toggleDetails}
        >
          {showDetails ? (
            <>Hide Details <ChevronDown className="h-4 w-4" /></>
          ) : (
            <>Show Details <ChevronUp className="h-4 w-4" /></>
          )}
        </Button>

        {/* Plant detail indicators - appear when hovering over the model */}
        {showDetails && (
          <motion.div 
            className="absolute bottom-16 left-0 right-0 mx-auto px-4 pb-4 space-y-2 w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {details.map((detail) => (
                <motion.div 
                  key={detail.id}
                  className={cn(
                    "bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg cursor-pointer transition-all shadow-sm",
                    activeDetail === detail.id ? "ring-2 ring-primary" : "hover:bg-background"
                  )}
                  onClick={() => setActiveDetail(detail.id === activeDetail ? null : detail.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="p-1.5 rounded-full" 
                      style={{ backgroundColor: `${detail.color}20` }}
                    >
                      <div style={{ color: detail.color }}>{detail.icon}</div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{detail.label}</p>
                      <p className="font-medium">
                        {detail.value.toFixed(1)}{detail.unit}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default InteractivePlant;
