
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, User, TrendingUp, Check, AlertTriangle } from 'lucide-react';

interface CareerInsightsCardProps {
  strengthAreas?: string[];
  developmentAreas?: string[];
}

const CareerInsightsCard = ({ 
  strengthAreas = ['Problem Solving', 'Critical Thinking', 'Adaptability'],
  developmentAreas = ['Technical Skills', 'Leadership', 'Time Management']
}: CareerInsightsCardProps) => {
  return (
    <Card className="border border-border/50 rounded-2xl overflow-hidden h-full">
      <CardHeader className="pb-2 bg-muted/20">
        <div className="flex items-center gap-2">
          <BarChart className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">Career Insights</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            <h3 className="font-medium">Strength Areas</h3>
          </div>
          
          <ul className="space-y-2">
            {strengthAreas.map((strength, index) => (
              <li key={index} className="flex items-center gap-2 text-sm bg-green-50 dark:bg-green-950/30 p-2 rounded-lg border border-green-100 dark:border-green-900/50">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h3 className="font-medium">Development Areas</h3>
          </div>
          
          <ul className="space-y-2">
            {developmentAreas.map((area, index) => (
              <li key={index} className="flex items-center gap-2 text-sm bg-amber-50 dark:bg-amber-950/30 p-2 rounded-lg border border-amber-100 dark:border-amber-900/50">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="border-t border-border/50 pt-4">
          <p className="text-sm text-muted-foreground italic">
            Insights are derived from your assessment responses and provide guidance for your career development journey.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerInsightsCard;
