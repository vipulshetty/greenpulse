
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Droplet, 
  ThermometerIcon, 
  Sun, 
  Sprout, 
  Wind, 
  Cloud
} from 'lucide-react';
import Layout from '@/components/Layout';
import SensorCard from '@/components/SensorCard';
import ChartCard from '@/components/ChartCard';
import ControlPanel from '@/components/ControlPanel';

// Mock data for demonstration
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
  const lightData = generateMockTimeData(24, 70, 30);
  
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

  return (
    <>
      <Helmet>
        <title>Dashboard | GreenPulse</title>
      </Helmet>
      
      <Layout>
        <div className="space-y-6">
          <h1 className="text-2xl font-semibold">Plant Monitoring Dashboard</h1>
          
          {/* Sensor Cards Grid */}
          <div className="dashboard-grid">
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
          </div>
          
          {/* Charts and Control Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
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
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Index;
