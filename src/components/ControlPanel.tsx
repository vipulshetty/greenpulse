
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Droplet, Fan, SunMedium, AlertTriangle } from "lucide-react";
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ControlPanelProps {
  className?: string;
}

const ControlPanel = ({ className }: ControlPanelProps) => {
  const [autoIrrigation, setAutoIrrigation] = useState(true);
  const [autoPump, setAutoPump] = useState(false);
  const [fanSpeed, setFanSpeed] = useState([35]);
  const [lightIntensity, setLightIntensity] = useState([70]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
    >
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader>
          <CardTitle className="text-lg font-medium">System Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplet className="text-blue-500" size={18} />
                <Label htmlFor="auto-irrigation" className="text-sm font-medium">
                  Auto Irrigation
                </Label>
              </div>
              <Switch
                id="auto-irrigation"
                checked={autoIrrigation}
                onCheckedChange={setAutoIrrigation}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplet className="text-blue-500" size={18} />
                <Label htmlFor="auto-pump" className="text-sm font-medium">
                  Water Pump
                </Label>
              </div>
              <Switch
                id="auto-pump"
                checked={autoPump}
                onCheckedChange={setAutoPump}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Fan className="text-gray-500" size={18} />
                  <Label className="text-sm font-medium">Fan Speed</Label>
                </div>
                <span className="text-sm font-medium">{fanSpeed}%</span>
              </div>
              <Slider
                value={fanSpeed}
                onValueChange={setFanSpeed}
                max={100}
                step={1}
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SunMedium className="text-amber-500" size={18} />
                  <Label className="text-sm font-medium">Light Intensity</Label>
                </div>
                <span className="text-sm font-medium">{lightIntensity}%</span>
              </div>
              <Slider
                value={lightIntensity}
                onValueChange={setLightIntensity}
                max={100}
                step={1}
              />
            </div>
          </div>
          
          <Button
            variant="outline"
            className="w-full gap-2"
          >
            <AlertTriangle size={16} />
            <span>Reset System</span>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ControlPanel;
