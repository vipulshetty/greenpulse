
import React from 'react';
import ChartCard from './ChartCard';
import ControlPanel from './ControlPanel';
import { motion } from 'framer-motion';

interface DataPoint {
  time: string;
  value: number;
}

interface DashboardChartsProps {
  temperatureData: DataPoint[];
  moistureData: DataPoint[];
}

const DashboardCharts = ({ temperatureData, moistureData }: DashboardChartsProps) => {
  return (
    <motion.div 
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <ChartCard
        title="Temperature History (24h)"
        data={temperatureData}
        yAxisUnit="°C"
        color="#f59e0b"
        className="lg:col-span-1"
      />
      
      <ChartCard
        title="Moisture History (24h)"
        data={moistureData}
        yAxisUnit="%"
        color="#3b82f6"
        className="lg:col-span-1"
      />
      
      <ControlPanel className="lg:col-span-1" />
    </motion.div>
  );
};

export default DashboardCharts;
