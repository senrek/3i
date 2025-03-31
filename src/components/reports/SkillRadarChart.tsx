
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from 'recharts';

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

const SkillRadarChart = ({ 
  data, 
  title = 'Skill Analysis', 
  description = 'Your skills compared to career requirements' 
}: SkillRadarChartProps) => {
  return (
    <Card className="border border-border/50 rounded-2xl overflow-hidden h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-1">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                stroke="var(--muted-foreground)"
              />
              <Radar
                name="Your Skills"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillRadarChart;
