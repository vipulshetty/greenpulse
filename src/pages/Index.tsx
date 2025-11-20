
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import SensorGrid from '@/components/SensorGrid';
import DashboardCharts from '@/components/DashboardCharts';
import PageTransition from '@/components/PageTransition';
import NPKAnalysis from '@/components/NPKAnalysis';
import PlantDiseaseDetector from '@/components/PlantDiseaseDetector';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, AlertCircle, Loader2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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

// Helper to map WMO weather codes to text
const getWeatherDescription = (code: number): string => {
  if (code === 0) return "Clear Sky";
  if (code === 1) return "Mainly Clear";
  if (code === 2) return "Partly Cloudy";
  if (code === 3) return "Overcast";
  if (code >= 45 && code <= 48) return "Foggy";
  if (code >= 51 && code <= 55) return "Drizzle";
  if (code >= 61 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Showers";
  if (code >= 95 && code <= 99) return "Thunderstorm";
  return "Unknown";
};

const Index = () => {
  // State for sensor data (would normally come from an API/IoT devices)
  const [sensorData, setSensorData] = useState({
    temperature: 0,
    humidity: 0,
    soilMoisture: 0,
    lightIntensity: 0,
    nitrogenLevel: 15,
    phosphorusLevel: 8.3,
    potassiumLevel: 12.5
  });

  const [weatherData, setWeatherData] = useState({
    windSpeed: 0,
    condition: "Loading..."
  });

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'loading' | 'online' | 'offline' | 'error'>('loading');
  
  // Fetch data from ThingSpeak
  useEffect(() => {
    const channelId = import.meta.env.VITE_THINGSPEAK_CHANNEL_ID;
    const apiKey = import.meta.env.VITE_THINGSPEAK_API_KEY;

    const fetchData = async () => {
      if (!channelId || !apiKey) {
        console.warn("ThingSpeak credentials missing in .env file");
        setConnectionStatus('error');
        return;
      }

      try {
        const response = await fetch(`https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&results=1`);
        const data = await response.json();
        
        if (data.feeds && data.feeds.length > 0) {
          const feed = data.feeds[0];
          const feedTime = new Date(feed.created_at);
          setLastUpdated(feedTime);

          // Check if data is stale (older than 5 minutes)
          const now = new Date();
          const diffInMinutes = (now.getTime() - feedTime.getTime()) / 1000 / 60;
          
          if (diffInMinutes > 5) {
            setConnectionStatus('offline');
          } else {
            setConnectionStatus('online');
          }

          setSensorData(prev => ({
            ...prev,
            temperature: parseFloat(feed.field1) || 0,
            humidity: parseFloat(feed.field2) || 0,
            soilMoisture: parseFloat(feed.field3) || 0,
            lightIntensity: parseFloat(feed.field4) || 0,
            // NPK values are not in the feed, so we keep the default/mock values or could randomize them slightly
            // For now, we'll just keep them static or let them be handled separately if needed
          }));
        } else {
            setConnectionStatus('loading'); // Or 'offline' if empty
        }
      } catch (error) {
        console.error("Error fetching ThingSpeak data:", error);
        setConnectionStatus('error');
      }
    };

    fetchData();
    // ThingSpeak free tier allows updates every 15 seconds
    const interval = setInterval(fetchData, 15000);
    
    return () => clearInterval(interval);
  }, []);

  // Fetch Weather Data (Wind Speed & Cloud/Condition)
  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=wind_speed_10m,weather_code`
        );
        const data = await response.json();
        
        if (data.current) {
          setWeatherData({
            windSpeed: data.current.wind_speed_10m,
            condition: getWeatherDescription(data.current.weather_code)
          });
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setWeatherData({ windSpeed: 0, condition: "Unavailable" });
      }
    };

    // Get user location or use default (e.g., London)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("Geolocation denied/error, using default location (London)", error);
          fetchWeather(51.5074, -0.1278);
        }
      );
    } else {
      fetchWeather(51.5074, -0.1278);
    }
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <motion.h1 
              className="text-3xl font-bold gradient-text flex items-center gap-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              🌱 Plant Monitoring
            </motion.h1>

            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {connectionStatus === 'online' && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex gap-1.5 items-center px-3 py-1">
                  <Wifi className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Live</span>
                </Badge>
              )}
              
              {connectionStatus === 'offline' && (
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 flex gap-1.5 items-center px-3 py-1">
                  <WifiOff className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Offline</span>
                </Badge>
              )}

              {connectionStatus === 'error' && (
                <Badge variant="destructive" className="flex gap-1.5 items-center px-3 py-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Error</span>
                </Badge>
              )}

              {connectionStatus === 'loading' && (
                <Badge variant="secondary" className="flex gap-1.5 items-center px-3 py-1">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span className="text-xs font-medium">Connecting...</span>
                </Badge>
              )}

              {lastUpdated && connectionStatus === 'online' && (
                <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{formatDistanceToNow(lastUpdated, { addSuffix: true })}</span>
                </div>
              )}
            </motion.div>
          </div>
          
          {/* NPK Analysis Section */}
          <NPKAnalysis 
            nitrogenLevel={sensorData.nitrogenLevel}
            phosphorusLevel={sensorData.phosphorusLevel}
            potassiumLevel={sensorData.potassiumLevel}
          />
          
          {/* Sensor Cards Grid */}
          <SensorGrid 
            sensorData={sensorData} 
            windSpeed={weatherData.windSpeed}
            weatherCondition={weatherData.condition}
          />

          {/* AI Disease Detection Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <PlantDiseaseDetector />
          </motion.div>
          
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
