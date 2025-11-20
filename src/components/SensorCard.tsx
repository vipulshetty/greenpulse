
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
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className={cn("overflow-hidden bg-white border border-green-100 shadow-sm hover:shadow-md transition-shadow duration-200", className)}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className={cn("status-indicator", statusClasses[status])} />
              <h3 className="text-sm font-medium text-gray-700">{title}</h3>
            </div>
            <div className="text-green-600">
              {icon}
            </div>
          </div>
          
          <div className="mt-2">
            <div className="text-3xl font-bold text-gray-900">
              {value}
              <span className="text-base font-normal text-gray-500 ml-1">{unit}</span>
            </div>
          </div>
          
          {percentage !== null && (
            <div className="mt-4">
              <div className="w-full bg-green-50 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-green-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{minValue}</span>
                <span>{maxValue} {unit}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SensorCard;
