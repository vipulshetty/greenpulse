
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplet, Thermometer as ThermometerIcon, Sun, Sprout } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SensorDetail {
  id: string;
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  color: string;
}

interface PlantSensorDetailsProps {
  details: SensorDetail[];
  activeDetail: string | null;
  setActiveDetail: (id: string | null) => void;
  className?: string;
}

const PlantSensorDetails: React.FC<PlantSensorDetailsProps> = ({
  details,
  activeDetail,
  setActiveDetail,
  className,
}) => {
  // Card appearance animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <motion.div 
      className={cn("absolute bottom-16 left-0 right-0 mx-auto px-4 pb-4 w-full z-10", className)}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <AnimatePresence>
          {details.map((detail) => (
            <TooltipProvider key={detail.id}>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <motion.div 
                    variants={itemVariants}
                    className={cn(
                      "bg-background/80 backdrop-blur-md px-3 py-3 rounded-xl cursor-pointer transition-all duration-300 shadow-lg border border-transparent",
                      activeDetail === detail.id 
                        ? "ring-2 ring-primary border-primary/20 shadow-[0_0_20px_rgba(155,222,172,0.5)]" 
                        : "hover:bg-background hover:shadow-xl hover:scale-105"
                    )}
                    onClick={() => setActiveDetail(detail.id === activeDetail ? null : detail.id)}
                    whileHover={{ 
                      y: -5,
                      boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)",
                      transition: { type: "spring", stiffness: 400, damping: 17 }
                    }}
                    whileTap={{ scale: 0.97 }}
                    layout
                  >
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className="p-2 rounded-full" 
                        style={{ backgroundColor: `${detail.color}20` }}
                        initial={{ rotate: 0 }}
                        animate={{ 
                          rotate: activeDetail === detail.id ? [0, -10, 10, -5, 5, 0] : 0,
                          scale: activeDetail === detail.id ? [1, 1.1, 1] : 1,
                        }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      >
                        <motion.div 
                          style={{ color: detail.color }}
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ 
                            repeat: Infinity, 
                            repeatType: "reverse",
                            duration: 2,
                            ease: "easeInOut"
                          }}
                        >
                          {detail.icon}
                        </motion.div>
                      </motion.div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">{detail.label}</p>
                        <p className="font-semibold text-foreground flex items-center">
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            key={`${detail.value}`} // Force re-animation when value changes
                            transition={{ duration: 0.5 }}
                            className="relative"
                          >
                            <span className="relative z-10">{detail.value.toFixed(1)}{detail.unit}</span>
                            {activeDetail === detail.id && (
                              <motion.span 
                                className="absolute inset-0 bg-primary/10 rounded-md -z-10"
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 0.3 }}
                              />
                            )}
                          </motion.span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  className="bg-background/90 backdrop-blur-md border-primary/20 shadow-lg"
                  sideOffset={5}
                >
                  <p>View {detail.label.toLowerCase()} details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PlantSensorDetails;
