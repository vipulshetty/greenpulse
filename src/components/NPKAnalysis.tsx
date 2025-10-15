import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, XCircle, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NPKAnalysisProps {
  nitrogenLevel: number;
  phosphorusLevel: number;
  potassiumLevel: number;
}

interface Disease {
  name: string;
  severity: 'low' | 'medium' | 'high';
  cause: string;
}

const NPKAnalysis = ({ nitrogenLevel, phosphorusLevel, potassiumLevel }: NPKAnalysisProps) => {
  // Analyze NPK levels and predict potential diseases
  const analyzeDiseases = (): Disease[] => {
    const diseases: Disease[] = [];

    // Nitrogen-related diseases
    if (nitrogenLevel < 10) {
      diseases.push({
        name: 'Nitrogen Deficiency',
        severity: 'high',
        cause: 'Yellowing of older leaves, stunted growth'
      });
    } else if (nitrogenLevel > 25) {
      diseases.push({
        name: 'Excessive Vegetative Growth',
        severity: 'medium',
        cause: 'Too much nitrogen delays flowering and fruiting'
      });
    }

    // Phosphorus-related diseases
    if (phosphorusLevel < 5) {
      diseases.push({
        name: 'Phosphorus Deficiency',
        severity: 'high',
        cause: 'Purple/dark leaves, poor root development'
      });
    } else if (phosphorusLevel > 15) {
      diseases.push({
        name: 'Zinc & Iron Deficiency Risk',
        severity: 'medium',
        cause: 'Excess phosphorus blocks micronutrient uptake'
      });
    }

    // Potassium-related diseases
    if (potassiumLevel < 8) {
      diseases.push({
        name: 'Potassium Deficiency',
        severity: 'high',
        cause: 'Leaf edge burning, weak stems, disease susceptibility'
      });
    } else if (potassiumLevel > 20) {
      diseases.push({
        name: 'Calcium & Magnesium Deficiency Risk',
        severity: 'medium',
        cause: 'Excess potassium blocks other nutrient absorption'
      });
    }

    // Combined deficiency issues
    if (nitrogenLevel < 10 && phosphorusLevel < 5) {
      diseases.push({
        name: 'Severe Nutrient Depletion',
        severity: 'high',
        cause: 'Multiple deficiencies causing poor overall health'
      });
    }

    if (diseases.length === 0) {
      diseases.push({
        name: 'Healthy Nutrient Balance',
        severity: 'low',
        cause: 'NPK levels are within optimal range'
      });
    }

    return diseases;
  };

  const diseases = analyzeDiseases();
  const overallHealth = diseases.every(d => d.severity === 'low') ? 'healthy' : 
                        diseases.some(d => d.severity === 'high') ? 'critical' : 'warning';

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'medium': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      default: return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/10 border-red-500/20';
      case 'medium': return 'bg-orange-500/10 border-orange-500/20';
      default: return 'bg-green-500/10 border-green-500/20';
    }
  };

  const getHealthStatus = () => {
    switch (overallHealth) {
      case 'critical': return { text: 'Critical', color: 'text-red-500', bg: 'bg-red-500/10' };
      case 'warning': return { text: 'Needs Attention', color: 'text-orange-500', bg: 'bg-orange-500/10' };
      default: return { text: 'Healthy', color: 'text-green-500', bg: 'bg-green-500/10' };
    }
  };

  const healthStatus = getHealthStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <Card className="overflow-hidden backdrop-blur-md bg-gradient-to-br from-card/90 to-card/70 border border-primary/10 shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              NPK Analysis & Disease Prediction
            </CardTitle>
            <motion.div 
              className={cn("px-3 py-1 rounded-full text-sm font-medium", healthStatus.bg, healthStatus.color)}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {healthStatus.text}
            </motion.div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* NPK Values */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Current Nutrient Levels</h3>
              
              <div className="space-y-3">
                {/* Nitrogen */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20">
                  <div>
                    <p className="text-sm font-medium">Nitrogen (N)</p>
                    <p className="text-xs text-muted-foreground">Optimal: 10-25 mg/kg</p>
                  </div>
                  <motion.div 
                    className="text-2xl font-bold text-blue-600"
                    key={nitrogenLevel}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    {nitrogenLevel}
                  </motion.div>
                </div>

                {/* Phosphorus */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20">
                  <div>
                    <p className="text-sm font-medium">Phosphorus (P)</p>
                    <p className="text-xs text-muted-foreground">Optimal: 5-15 mg/kg</p>
                  </div>
                  <motion.div 
                    className="text-2xl font-bold text-purple-600"
                    key={phosphorusLevel}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    {phosphorusLevel}
                  </motion.div>
                </div>

                {/* Potassium */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20">
                  <div>
                    <p className="text-sm font-medium">Potassium (K)</p>
                    <p className="text-xs text-muted-foreground">Optimal: 8-20 mg/kg</p>
                  </div>
                  <motion.div 
                    className="text-2xl font-bold text-amber-600"
                    key={potassiumLevel}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    {potassiumLevel}
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Disease Predictions */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Disease Risk Assessment</h3>
              
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                {diseases.map((disease, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className={cn(
                      "p-3 rounded-lg border",
                      getSeverityColor(disease.severity)
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {getSeverityIcon(disease.severity)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{disease.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{disease.cause}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NPKAnalysis;