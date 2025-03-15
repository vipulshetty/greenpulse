
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
  
  const statusColors = {
    healthy: '#4caf50',
    warning: '#ff9800',
    alert: '#f44336',
    normal: '#9e9e9e'
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
      whileHover={{ 
        scale: 1.03, 
        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.2 } 
      }}
    >
      <Card className={cn("overflow-hidden backdrop-blur-md bg-gradient-to-br from-card/90 to-card/70 border border-primary/10 shadow-lg rounded-xl", className)}>
        <CardContent className="p-4 relative">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <motion.span 
                className={cn("status-indicator", statusClasses[status])}
                animate={{ 
                  scale: [1, 1.2, 1],
                  boxShadow: [
                    `0 0 0px ${statusColors[status]}20`,
                    `0 0 8px ${statusColors[status]}40`,
                    `0 0 0px ${statusColors[status]}20`
                  ]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
              <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            </div>
            <motion.div 
              className="text-plant-primary transform transition-transform"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              {icon}
            </motion.div>
          </div>
          
          <div className="mt-2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="sensor-value text-foreground"
            >
              <motion.span
                key={`${value}`} // Force re-animation when value changes
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {value}
              </motion.span>
              <span className="text-sm font-normal"> {unit}</span>
            </motion.div>
          </div>
          
          {percentage !== null && (
            <div className="mt-3">
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="bg-gradient-to-r from-primary/80 to-primary h-full rounded-full"
                  style={{
                    boxShadow: '0 0 10px rgba(155, 222, 172, 0.5)'
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{minValue}</span>
                <span>{maxValue} {unit}</span>
              </div>
            </div>
          )}

          {/* Add a subtle gradient overlay for visual appeal */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-transparent to-background/5 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SensorCard;
