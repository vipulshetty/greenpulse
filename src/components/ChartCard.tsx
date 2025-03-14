
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
      transition={{ duration: 0.6, delay: 0.1 }}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
    >
      <Card className={cn("overflow-hidden backdrop-blur-sm bg-card/90", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
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
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                />
                <YAxis 
                  unit={yAxisUnit}
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    border: 'none',
                    padding: '10px'
                  }}
                  formatter={(value: number) => [`${value}${yAxisUnit}`, title]}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey={dataKey}
                  stroke={color}
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 1 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
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
