import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, XCircle, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NPKAnalysisProps {
  nitrogenLevel: number;
  phosphorusLevel: number;
  potassiumLevel: number;
  healthStatus?: string;
  recommendation?: string;
}

interface Disease {
  name: string;
  severity: 'low' | 'medium' | 'high';
  cause: string;
}

const NPKAnalysis = ({ nitrogenLevel, phosphorusLevel, potassiumLevel, healthStatus, recommendation }: NPKAnalysisProps) => {
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
  // Use API health status if available, otherwise fallback to local logic
  const overallHealth = healthStatus ? (healthStatus.toLowerCase().includes('healthy') ? 'healthy' : 'critical') :
    (diseases.every(d => d.severity === 'low') ? 'healthy' :
      diseases.some(d => d.severity === 'high') ? 'critical' : 'warning');

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

  const healthStatusObj = getHealthStatus();

  const getNutrientStatus = (value: number, min: number, max: number) => {
    if (value < min) return { status: 'low', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
    if (value > max) return { status: 'high', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' };
    return { status: 'optimal', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
  };

  const nitrogenStatus = getNutrientStatus(nitrogenLevel, 10, 25);
  const phosphorusStatus = getNutrientStatus(phosphorusLevel, 5, 15);
  const potassiumStatus = getNutrientStatus(potassiumLevel, 8, 20);

  // Simple health message for farmers
  const getHealthMessage = () => {
    // If we have a recommendation from the API, use it
    if (recommendation && recommendation !== "Waiting for data...") {
      const isHealthy = healthStatus?.toLowerCase().includes('healthy');
      return {
        icon: isHealthy ? '✅' : '🚨',
        title: healthStatus || 'Plant Health Analysis',
        message: recommendation,
        color: isHealthy ? 'text-green-700' : 'text-red-700',
        bg: isHealthy ? 'bg-green-50' : 'bg-red-50',
        border: isHealthy ? 'border-green-300' : 'border-red-300'
      };
    }

    if (overallHealth === 'critical') {
      return {
        icon: '🚨',
        title: 'Plant Needs Urgent Care!',
        message: 'Your plant is not getting enough nutrients. Add fertilizer soon to keep it healthy.',
        color: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-300'
      };
    } else if (overallHealth === 'warning') {
      return {
        icon: '⚠️',
        title: 'Plant Needs Attention',
        message: 'Your plant is okay but could be healthier. Consider adding some fertilizer.',
        color: 'text-orange-700',
        bg: 'bg-orange-50',
        border: 'border-orange-300'
      };
    } else {
      return {
        icon: '✅',
        title: 'Plant is Healthy!',
        message: 'Your plant is getting good nutrition. Keep doing what you\'re doing!',
        color: 'text-green-700',
        bg: 'bg-green-50',
        border: 'border-green-300'
      };
    }
  };

  const healthMessage = getHealthMessage();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6"
    >
      <Card className="overflow-hidden bg-white border border-green-100 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-gray-900 text-lg">
            <Leaf className="h-5 w-5 text-green-600" />
            Plant Health Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Health Status Message - Big and Clear */}
          <div className={cn("p-6 rounded-lg border-2", healthMessage.bg, healthMessage.border)}>
            <div className="text-center">
              <div className="text-5xl mb-3">{healthMessage.icon}</div>
              <h3 className={cn("text-2xl font-bold mb-2", healthMessage.color)}>
                {healthMessage.title}
              </h3>
              <p className="text-base text-gray-700 max-w-xl mx-auto">
                {healthMessage.message}
              </p>
            </div>
          </div>

          {/* NPK Values in 3 Columns - Simple Display */}
          <div>
            <h4 className="text-sm font-semibold text-gray-600 mb-3 text-center">Nutrient Levels</h4>
            <div className="grid grid-cols-3 gap-3">
              {/* Nitrogen */}
              <div className={cn("p-4 rounded-lg border text-center", nitrogenStatus.bg, nitrogenStatus.border)}>
                <div className="text-xs text-gray-600 mb-1">Nitrogen</div>
                <div className={cn("text-2xl font-bold", nitrogenStatus.color)}>
                  {nitrogenLevel}
                </div>
                <div className={cn("text-xs font-semibold mt-1", nitrogenStatus.color)}>
                  {nitrogenStatus.status === 'low' && '⬇️ Low'}
                  {nitrogenStatus.status === 'high' && '⬆️ High'}
                  {nitrogenStatus.status === 'optimal' && '✓ Good'}
                </div>
              </div>

              {/* Phosphorus */}
              <div className={cn("p-4 rounded-lg border text-center", phosphorusStatus.bg, phosphorusStatus.border)}>
                <div className="text-xs text-gray-600 mb-1">Phosphorus</div>
                <div className={cn("text-2xl font-bold", phosphorusStatus.color)}>
                  {phosphorusLevel}
                </div>
                <div className={cn("text-xs font-semibold mt-1", phosphorusStatus.color)}>
                  {phosphorusStatus.status === 'low' && '⬇️ Low'}
                  {phosphorusStatus.status === 'high' && '⬆️ High'}
                  {phosphorusStatus.status === 'optimal' && '✓ Good'}
                </div>
              </div>

              {/* Potassium */}
              <div className={cn("p-4 rounded-lg border text-center", potassiumStatus.bg, potassiumStatus.border)}>
                <div className="text-xs text-gray-600 mb-1">Potassium</div>
                <div className={cn("text-2xl font-bold", potassiumStatus.color)}>
                  {potassiumLevel}
                </div>
                <div className={cn("text-xs font-semibold mt-1", potassiumStatus.color)}>
                  {potassiumStatus.status === 'low' && '⬇️ Low'}
                  {potassiumStatus.status === 'high' && '⬆️ High'}
                  {potassiumStatus.status === 'optimal' && '✓ Good'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NPKAnalysis;