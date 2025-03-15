
import React from 'react';
import { motion } from 'framer-motion';
import ChartCard from './ChartCard';
import ControlPanel from './ControlPanel';
import InteractivePlant from './InteractivePlant';

interface DataPoint {
  time: string;
  value: number;
}

interface DashboardChartsProps {
  temperatureData: DataPoint[];
  moistureData: DataPoint[];
  sensorData: {
    temperature: number;
    humidity: number;
    soilMoisture: number;
    lightIntensity: number;
    nitrogenLevel: number;
    phosphorusLevel: number;
  };
}

const DashboardCharts = ({ temperatureData, moistureData, sensorData }: DashboardChartsProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200
      }
    }
  };

  return (
    <motion.div 
      className="space-y-6 mt-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={itemVariants}
        className="lg:col-span-3 mb-4"
      >
        <InteractivePlant sensorData={sensorData} className="lg:col-span-3 mb-2" />
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants}>
          <ChartCard
            title="Temperature History (24h)"
            data={temperatureData}
            yAxisUnit="°C"
            color="#f59e0b"
            className="lg:col-span-1"
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <ChartCard
            title="Moisture History (24h)"
            data={moistureData}
            yAxisUnit="%"
            color="#3b82f6"
            className="lg:col-span-1"
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <ControlPanel className="lg:col-span-1" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardCharts;
