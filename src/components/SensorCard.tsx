
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';

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
    <Card className={cn("sensor-card animate-fade-in", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={cn("status-indicator", statusClasses[status])} />
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          </div>
          <div className="text-plant-primary">{icon}</div>
        </div>
        
        <div className="mt-2">
          <div className="sensor-value text-foreground">{value} <span className="text-sm font-normal">{unit}</span></div>
        </div>
        
        {percentage !== null && (
          <div className="mt-3">
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{minValue}</span>
              <span>{maxValue} {unit}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SensorCard;
