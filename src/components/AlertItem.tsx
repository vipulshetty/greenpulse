
import React from 'react';
import { 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  ThermometerIcon,
  Droplet,
  Sun,
  Sprout
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AlertData {
  id: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  message: string;
  timestamp: Date;
  source: 'temperature' | 'moisture' | 'light' | 'nutrients' | 'system';
  read?: boolean;
}

interface AlertItemProps {
  alert: AlertData;
  onClick?: () => void;
  className?: string;
}

const AlertItem = ({ alert, onClick, className }: AlertItemProps) => {
  const getAlertIcon = () => {
    const sourceIcons = {
      temperature: <ThermometerIcon className="h-4 w-4" />,
      moisture: <Droplet className="h-4 w-4" />,
      light: <Sun className="h-4 w-4" />,
      nutrients: <Sprout className="h-4 w-4" />,
      system: <Info className="h-4 w-4" />
    };
    
    return sourceIcons[alert.source];
  };
  
  const getStatusIcon = () => {
    switch (alert.type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-plant-warning" />;
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-plant-alert" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-plant-success" />;
      default:
        return null;
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <div 
      className={cn(
        "flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors duration-200",
        "hover:bg-muted",
        !alert.read && "bg-secondary",
        alert.read && "bg-background",
        className
      )}
      onClick={onClick}
    >
      <div className={cn(
        "p-2 rounded-full",
        alert.type === 'info' && "bg-blue-100",
        alert.type === 'warning' && "bg-amber-100",
        alert.type === 'critical' && "bg-red-100",
        alert.type === 'success' && "bg-green-100"
      )}>
        {getStatusIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={cn(
            "inline-flex items-center text-xs gap-1 px-2 py-0.5 rounded-full font-medium",
            alert.type === 'info' && "bg-blue-100 text-blue-800",
            alert.type === 'warning' && "bg-amber-100 text-amber-800",
            alert.type === 'critical' && "bg-red-100 text-red-800",
            alert.type === 'success' && "bg-green-100 text-green-800"
          )}>
            {getAlertIcon()}
            {alert.source}
          </span>
          <span className="text-xs text-muted-foreground">{formatTime(alert.timestamp)}</span>
        </div>
        <p className="text-sm mt-1 text-foreground">{alert.message}</p>
      </div>
    </div>
  );
};

export default AlertItem;
