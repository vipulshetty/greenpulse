
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Power, Droplet, Sprout } from 'lucide-react';
import { motion } from 'framer-motion';

interface ControlPanelProps {
  className?: string;
}

const ControlPanel = ({ className }: ControlPanelProps) => {
  const [autoWatering, setAutoWatering] = useState(true);
  const [wateringActive, setWateringActive] = useState(false);
  const [autoFertilizing, setAutoFertilizing] = useState(true);
  const [moistureThreshold, setMoistureThreshold] = useState([30]);
  const [lightIntensity, setLightIntensity] = useState([70]);

  const toggleWatering = () => {
    setWateringActive(!wateringActive);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
    >
      <Card className={cn("backdrop-blur-sm bg-card/90 border-primary/20", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="text-primary/80"
            >
              <Power className="h-4 w-4" />
            </motion.div>
            Control Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* System Status */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/20 rounded-full">
                <Power className="h-4 w-4 text-primary" />
              </div>
              <span>System Status</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.span 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-xs font-medium bg-green-100 text-green-800 px-2 py-0.5 rounded-full"
              >
                Active
              </motion.span>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Watering Controls */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.div 
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="p-2 bg-blue-100 rounded-full"
                >
                  <Droplet className="h-4 w-4 text-blue-600" />
                </motion.div>
                <span>Watering System</span>
              </div>
              <Button 
                variant={wateringActive ? "default" : "outline"} 
                size="sm"
                onClick={toggleWatering}
                className="group"
              >
                {wateringActive ? (
                  <><Pause className="h-4 w-4 mr-1" /> Stop</>
                ) : (
                  <><Play className="h-4 w-4 mr-1" /> Start</>
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-watering" className="text-sm">
                Auto Watering
              </Label>
              <Switch
                id="auto-watering"
                checked={autoWatering}
                onCheckedChange={setAutoWatering}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="moisture-threshold" className="text-sm">
                  Moisture Threshold
                </Label>
                <span className="text-sm font-medium">{moistureThreshold}%</span>
              </div>
              <Slider
                id="moisture-threshold"
                min={0}
                max={100}
                step={1}
                value={moistureThreshold}
                onValueChange={setMoistureThreshold}
                disabled={!autoWatering}
                className={!autoWatering ? "opacity-50" : ""}
              />
            </div>
          </motion.div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Fertilizing Controls */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.div 
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="p-2 bg-green-100 rounded-full"
                >
                  <Sprout className="h-4 w-4 text-green-600" />
                </motion.div>
                <span>Fertilizing System</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-fertilizing" className="text-sm">
                Auto Fertilizing
              </Label>
              <Switch
                id="auto-fertilizing"
                checked={autoFertilizing}
                onCheckedChange={setAutoFertilizing}
              />
            </div>
          </motion.div>

          {/* Light Controls */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-2"
          >
            <div className="flex justify-between">
              <Label htmlFor="light-intensity" className="text-sm">
                Light Intensity
              </Label>
              <span className="text-sm font-medium">{lightIntensity}%</span>
            </div>
            <Slider
              id="light-intensity"
              min={0}
              max={100}
              step={1}
              value={lightIntensity}
              onValueChange={setLightIntensity}
            />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ControlPanel;
