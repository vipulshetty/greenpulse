
import React from 'react';
import { motion } from 'framer-motion';
import { Droplet, Thermometer as ThermometerIcon, Sun, Sprout } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SensorDetail {
  id: string;
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  color: string;
}

interface PlantSensorDetailsProps {
  details: SensorDetail[];
  activeDetail: string | null;
  setActiveDetail: (id: string | null) => void;
  className?: string;
}

const PlantSensorDetails: React.FC<PlantSensorDetailsProps> = ({
  details,
  activeDetail,
  setActiveDetail,
  className,
}) => {
  return (
    <motion.div 
      className={cn("absolute bottom-16 left-0 right-0 mx-auto px-4 pb-4 space-y-2 w-full", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {details.map((detail) => (
          <motion.div 
            key={detail.id}
            className={cn(
              "bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg cursor-pointer transition-all shadow-sm",
              activeDetail === detail.id ? "ring-2 ring-primary" : "hover:bg-background"
            )}
            onClick={() => setActiveDetail(detail.id === activeDetail ? null : detail.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center gap-2">
              <div 
                className="p-1.5 rounded-full" 
                style={{ backgroundColor: `${detail.color}20` }}
              >
                <div style={{ color: detail.color }}>{detail.icon}</div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{detail.label}</p>
                <p className="font-medium">
                  {detail.value.toFixed(1)}{detail.unit}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PlantSensorDetails;
