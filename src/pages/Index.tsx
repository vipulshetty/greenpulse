
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import SensorGrid from '@/components/SensorGrid';
import DashboardCharts from '@/components/DashboardCharts';
import PageTransition from '@/components/PageTransition';
import { motion } from 'framer-motion';

// Mock data generation utility
const generateMockTimeData = (hours: number, baseValue: number, variance: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Create some realistic-looking variations
    const randomFactor = Math.sin(i / 2) * variance * Math.random();
    const value = Math.max(0, baseValue + randomFactor);
    
    data.push({
      time: timeString,
      value: Number(value.toFixed(1))
    });
  }
  
  return data;
};

const Index = () => {
  // State for sensor data (would normally come from an API/IoT devices)
  const [sensorData, setSensorData] = useState({
    temperature: 23.5,
    humidity: 68,
    soilMoisture: 42,
    lightIntensity: 76,
    nitrogenLevel: 15,
    phosphorusLevel: 8.3
  });
  
  // Simulate updating sensor values periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(prev => ({
        temperature: Number((prev.temperature + (Math.random() * 0.6 - 0.3)).toFixed(1)),
        humidity: Math.min(100, Math.max(0, prev.humidity + Math.floor(Math.random() * 3 - 1))),
        soilMoisture: Math.min(100, Math.max(0, prev.soilMoisture + Math.floor(Math.random() * 3 - 1))),
        lightIntensity: Math.min(100, Math.max(0, prev.lightIntensity + Math.floor(Math.random() * 4 - 2))),
        nitrogenLevel: Number((prev.nitrogenLevel + (Math.random() * 0.4 - 0.2)).toFixed(1)),
        phosphorusLevel: Number((prev.phosphorusLevel + (Math.random() * 0.3 - 0.15)).toFixed(1))
      }));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Mock data for charts
  const temperatureData = generateMockTimeData(24, 23, 5);
  const moistureData = generateMockTimeData(24, 45, 15);

  return (
    <PageTransition>
      <Helmet>
        <title>Dashboard | GreenPulse</title>
      </Helmet>
      
      <Layout>
        <div className="space-y-6">
          <motion.h1 
            className="text-2xl font-semibold gradient-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Plant Monitoring Dashboard
          </motion.h1>
          
          {/* Sensor Cards Grid */}
          <SensorGrid sensorData={sensorData} />
          
          {/* Charts, 3D Plant and Control Panel */}
          <DashboardCharts 
            temperatureData={temperatureData}
            moistureData={moistureData}
            sensorData={sensorData}
          />
        </div>
      </Layout>
    </PageTransition>
  );
};

export default Index;
