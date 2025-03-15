
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Droplet, Thermometer as ThermometerIcon, Sun, Sprout } from 'lucide-react';
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
        "relative rounded-xl shadow-2xl overflow-hidden border border-primary/20", 
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.2)" }}
    >
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-background/30 via-transparent to-background/20 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

      <div className="aspect-square md:aspect-[4/3] w-full relative">
        <PlantCanvas 
          sensorData={sensorData}
          activeDetail={activeDetail}
        />

        {/* Plant name overlay */}
        <motion.div 
          className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-sm border border-primary/10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            delay: 0.5, 
            duration: 0.8,
            type: "spring",
            stiffness: 200
          }}
        >
          <h3 className="font-medium text-foreground flex items-center gap-2">
            <Sprout className="h-4 w-4 text-primary" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Plant Name: Harmony
            </span>
          </h3>
        </motion.div>

        {/* Interactive details toggle button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute bottom-4 right-4"
          >
            <Button
              variant="secondary"
              size="sm"
              className="gap-1 shadow-xl bg-background/80 backdrop-blur-md border border-primary/10"
              onClick={toggleDetails}
            >
              <AnimatePresence mode="wait">
                {showDetails ? (
                  <motion.div 
                    className="flex items-center gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key="hide"
                  >
                    Hide Details <ChevronDown className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <motion.div 
                    className="flex items-center gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key="show"
                  >
                    Show Details <ChevronUp className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </motion.div>

        {/* Plant detail indicators - appear when hovering over the model */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
            >
              <PlantSensorDetails 
                details={details}
                activeDetail={activeDetail}
                setActiveDetail={setActiveDetail}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default InteractivePlant;
