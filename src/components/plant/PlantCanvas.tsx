
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows, Environment } from '@react-three/drei';
import PlantModel from './PlantModel';
import { SensorDataType } from './types';

interface PlantCanvasProps {
  sensorData: SensorDataType;
  activeDetail: string | null;
}

const PlantCanvas: React.FC<PlantCanvasProps> = ({ sensorData, activeDetail }) => {
  const nutrientLevel = (sensorData.nitrogenLevel + sensorData.phosphorusLevel) / 2;
  
  return (
    <Canvas shadows dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={40} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <PlantModel 
        soilMoisture={sensorData.soilMoisture} 
        temperature={sensorData.temperature} 
        lightIntensity={sensorData.lightIntensity} 
        nutrientLevel={nutrientLevel}
        highlightedPart={activeDetail}
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
  );
};

export default PlantCanvas;
