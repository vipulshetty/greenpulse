
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Droplet, ThermometerIcon, Sun, Sprout } from 'lucide-react';
import { cn } from '@/lib/utils';
import PlantModel from './plant/PlantModel';
import PlantSensorDetails from './plant/PlantSensorDetails';

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
          <PlantSensorDetails 
            details={details}
            activeDetail={activeDetail}
            setActiveDetail={setActiveDetail}
          />
        )}
      </div>
    </motion.div>
  );
};

export default InteractivePlant;
