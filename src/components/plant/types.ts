
import { ReactNode } from 'react';

export interface SensorDataType {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  lightIntensity: number;
  nitrogenLevel: number;
  phosphorusLevel: number;
}

export interface SensorDetailType {
  id: string;
  icon: ReactNode;
  label: string;
  value: number;
  unit: string;
  color: string;
}
