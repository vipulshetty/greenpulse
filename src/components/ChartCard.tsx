
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DataPoint {
  time: string;
  value: number;
}

interface ChartCardProps {
  title: string;
  data: DataPoint[];
  dataKey?: string;
  yAxisUnit?: string;
  color?: string;
  className?: string;
}

const ChartCard = ({ 
  title, 
  data, 
  dataKey = 'value',
  yAxisUnit = '',
  color = "#9bdeac",
  className 
}: ChartCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        duration: 0.8, 
        delay: 0.1 
      }}
      whileHover={{ 
        scale: 1.02, 
        transition: { type: "spring", stiffness: 400 } 
      }}
    >
      <Card className={cn("overflow-hidden backdrop-blur-md bg-card/80 border border-primary/10 shadow-lg", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="h-[200px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 5,
                  right: 5,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(224, 224, 224, 0.4)" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12, fill: 'rgba(120, 120, 120, 0.9)' }}
                  tickMargin={10}
                  stroke="rgba(180, 180, 180, 0.3)"
                />
                <YAxis 
                  unit={yAxisUnit}
                  tick={{ fontSize: 12, fill: 'rgba(120, 120, 120, 0.9)' }}
                  tickMargin={10}
                  stroke="rgba(180, 180, 180, 0.3)"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(200, 200, 200, 0.3)',
                    padding: '12px'
                  }}
                  formatter={(value: number) => [`${value}${yAxisUnit}`, title]}
                  labelFormatter={(label) => `Time: ${label}`}
                  animationDuration={300}
                />
                <defs>
                  <linearGradient id={`colorGradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <Line
                  type="monotone"
                  dataKey={dataKey}
                  stroke={color}
                  strokeWidth={3}
                  dot={{ r: 3, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ 
                    r: 6, 
                    strokeWidth: 0,
                    fill: color,
                    // Removing the boxShadow property as it's not valid for SVG elements in Recharts
                  }}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ChartCard;
