
import React from 'react';
import { Droplet, ThermometerIcon, Sun, Sprout, Wind, Cloud } from 'lucide-react';
import SensorCard from './SensorCard';
import { motion } from 'framer-motion';

interface SensorGridProps {
  sensorData: {
    temperature: number;
    humidity: number;
    soilMoisture: number;
    lightIntensity: number;
    nitrogenLevel: number;
    phosphorusLevel: number;
  };
}

const SensorGrid = ({ sensorData }: SensorGridProps) => {
  // Determine status based on sensor values
  const getMoistureStatus = (value: number) => {
    if (value < 30) return 'alert';
    if (value < 40) return 'warning';
    if (value > 80) return 'warning';
    return 'healthy';
  };
  
  const getTemperatureStatus = (value: number) => {
    if (value < 15 || value > 30) return 'alert';
    if (value < 18 || value > 27) return 'warning';
    return 'healthy';
  };
  
  const getLightStatus = (value: number) => {
    if (value < 20) return 'alert';
    if (value < 40) return 'warning';
    if (value > 90) return 'warning';
    return 'healthy';
  };
  
  const getNutrientStatus = (value: number) => {
    if (value < 5) return 'alert';
    if (value < 10) return 'warning';
    return 'healthy';
  };

  // Stagger animations for child components
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <motion.div 
      className="dashboard-grid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <SensorCard
        title="Soil Moisture"
        value={sensorData.soilMoisture}
        unit="%"
        icon={<Droplet />}
        status={getMoistureStatus(sensorData.soilMoisture)}
        minValue={0}
        maxValue={100}
      />
      
      <SensorCard
        title="Temperature"
        value={sensorData.temperature}
        unit="°C"
        icon={<ThermometerIcon />}
        status={getTemperatureStatus(sensorData.temperature)}
        minValue={10}
        maxValue={35}
      />
      
      <SensorCard
        title="Humidity"
        value={sensorData.humidity}
        unit="%"
        icon={<Cloud />}
        status="healthy"
        minValue={0}
        maxValue={100}
      />
      
      <SensorCard
        title="Light Intensity"
        value={sensorData.lightIntensity}
        unit="%"
        icon={<Sun />}
        status={getLightStatus(sensorData.lightIntensity)}
        minValue={0}
        maxValue={100}
      />
      
      <SensorCard
        title="Nitrogen Level"
        value={sensorData.nitrogenLevel}
        unit="mg/kg"
        icon={<Sprout />}
        status={getNutrientStatus(sensorData.nitrogenLevel)}
        minValue={0}
        maxValue={30}
      />
      
      <SensorCard
        title="Phosphorus Level"
        value={sensorData.phosphorusLevel}
        unit="mg/kg"
        icon={<Sprout />}
        status={getNutrientStatus(sensorData.phosphorusLevel)}
        minValue={0}
        maxValue={20}
      />
      
      <SensorCard
        title="Wind Speed"
        value="3.2"
        unit="m/s"
        icon={<Wind />}
        status="normal"
      />
      
      <SensorCard
        title="Forecast"
        value="Partly Cloudy"
        unit=""
        icon={<Cloud />}
        status="normal"
      />
    </motion.div>
  );
};

export default SensorGrid;
