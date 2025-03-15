import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import PlantCanvas from './plant/PlantCanvas';
import PlantSensorDetails from './plant/PlantSensorDetails';
import { SensorDataType, SensorDetailType } from './plant/types';

interface InteractivePlantProps {
  sensorData: SensorDataType;
  className?: string;
}

const InteractivePlant: React.FC<InteractivePlantProps> = ({ sensorData, className }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [activeDetail, setActiveDetail] = useState<string | null>(null);
  
  const toggleDetails = () => setShowDetails(!showDetails);
  
  const details: SensorDetailType[] = [
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
        <PlantCanvas 
          sensorData={sensorData}
          activeDetail={activeDetail}
        />

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
