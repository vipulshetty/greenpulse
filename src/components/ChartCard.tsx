
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';
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
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className={cn("overflow-hidden bg-white border border-green-100 shadow-sm hover:shadow-md transition-shadow duration-200", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-[200px] w-full">
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
                <defs>
                  <linearGradient id={`colorGradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  stroke="#d1d5db"
                />
                
                <YAxis 
                  unit={yAxisUnit}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  stroke="#d1d5db"
                />
                
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e5e7eb',
                  }}
                />
                
                <Area
                  type="monotone"
                  dataKey={dataKey}
                  fill={`url(#colorGradient-${color.replace('#', '')})`}
                  stroke="transparent"
                />
                
                <Line
                  type="monotone"
                  dataKey={dataKey}
                  stroke={color}
                  strokeWidth={2}
                  dot={{ r: 2, fill: color }}
                  activeDot={{ r: 4, fill: color }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ChartCard;
