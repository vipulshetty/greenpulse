
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SensorCardProps {
  title: string;
  value: number | string;
  unit: string;
  icon: React.ReactNode;
  status?: 'healthy' | 'warning' | 'alert' | 'normal';
  minValue?: number;
  maxValue?: number;
  className?: string;
}

const SensorCard = ({ 
  title, 
  value, 
  unit, 
  icon, 
  status = 'normal',
  minValue,
  maxValue,
  className 
}: SensorCardProps) => {
  const statusClasses = {
    healthy: 'status-healthy',
    warning: 'status-warning',
    alert: 'status-alert',
    normal: 'bg-gray-300'
  };

  // Calculate percentage if min and max values are provided
  const calculatePercentage = () => {
    if (typeof value === 'number' && minValue !== undefined && maxValue !== undefined) {
      return Math.max(0, Math.min(100, ((value - minValue) / (maxValue - minValue)) * 100));
    }
    return null;
  };

  const percentage = calculatePercentage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
    >
      <Card className={cn("sensor-card overflow-hidden", className)}>
        <CardContent className="p-4 relative">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className={cn("status-indicator", statusClasses[status])} />
              <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            </div>
            <div className="text-plant-primary transform transition-transform hover:scale-110">{icon}</div>
          </div>
          
          <div className="mt-2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="sensor-value text-foreground"
            >
              {value} <span className="text-sm font-normal">{unit}</span>
            </motion.div>
          </div>
          
          {percentage !== null && (
            <div className="mt-3">
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="bg-primary h-full rounded-full"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{minValue}</span>
                <span>{maxValue} {unit}</span>
              </div>
            </div>
          )}

          {/* Add a subtle gradient overlay for visual appeal */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-background/5 pointer-events-none" />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SensorCard;
