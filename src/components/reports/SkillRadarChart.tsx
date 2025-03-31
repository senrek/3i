
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  Radar, 
  Tooltip, 
  Legend 
} from 'recharts';

interface Skill {
  name: string;
  value: number;
  fullMark: number;
}

interface SkillRadarChartProps {
  data: Skill[];
  title?: string;
  description?: string;
}

const getRadarFillColor = (value: number) => {
  // Average the values to determine color scheme
  const averageValue = value;
  
  if (averageValue >= 75) return 'rgba(76, 175, 80, 0.2)'; // Green
  if (averageValue >= 60) return 'rgba(139, 195, 74, 0.2)'; // Light green
  if (averageValue >= 45) return 'rgba(255, 193, 7, 0.2)'; // Amber
  return 'rgba(244, 67, 54, 0.2)'; // Red
};

const getRadarStrokeColor = (value: number) => {
  const averageValue = value;
  
  if (averageValue >= 75) return '#4caf50'; // Green
  if (averageValue >= 60) return '#8bc34a'; // Light green
  if (averageValue >= 45) return '#ffc107'; // Amber
  return '#f44336'; // Red
};

const SkillRadarChart = ({ 
  data, 
  title = 'Skill Analysis', 
  description = 'Your skills compared to career requirements' 
}: SkillRadarChartProps) => {
  // Calculate the average value of all skills
  const averageSkillValue = data.reduce((sum, skill) => sum + skill.value, 0) / data.length;
  
  // Determine fill color based on average skill value
  const fillColor = getRadarFillColor(averageSkillValue);
  const strokeColor = getRadarStrokeColor(averageSkillValue);
  
  return (
    <Card className="border border-border/50 rounded-2xl overflow-hidden h-full shadow-md">
      <CardHeader className="pb-2 bg-primary/5">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-1">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="var(--border)" strokeDasharray="3 3" />
              <PolarAngleAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                stroke="var(--muted-foreground)"
              />
              <Radar
                name="Your Skills"
                dataKey="value"
                stroke={strokeColor}
                fill={fillColor}
                fillOpacity={0.7}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px'
                }}
                formatter={(value: number) => [`${value}%`, 'Skill Level']}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillRadarChart;
