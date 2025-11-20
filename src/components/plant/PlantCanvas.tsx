
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
    <div className="w-full h-full bg-gradient-to-b from-sky-100 to-green-50">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 1, 5]} fov={45} />
        
        {/* Improved Lighting Setup */}
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[5, 8, 5]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.4} color="#bbf7d0" />
        <pointLight position={[5, 2, 5]} intensity={0.3} color="#fef3c7" />
        
        <PlantModel 
          soilMoisture={sensorData.soilMoisture} 
          temperature={sensorData.temperature} 
          lightIntensity={sensorData.lightIntensity} 
          nutrientLevel={nutrientLevel}
          highlightedPart={activeDetail}
        />
        
        <ContactShadows 
          position={[0, -1.4, 0]} 
          opacity={0.5} 
          scale={6} 
          blur={2} 
          far={4} 
          color="#1a5c3a"
        />
        
        <Environment preset="park" background={false} />
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={true}
          minPolarAngle={Math.PI / 6} 
          maxPolarAngle={Math.PI / 2.2} 
          minDistance={3.5} 
          maxDistance={8}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default PlantCanvas;
