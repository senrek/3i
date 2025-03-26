
import React from 'react';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const CareerInsightsCard = () => {
  return (
    <Card className="border border-border/50 rounded-2xl overflow-hidden h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Career Insights</CardTitle>
        <CardDescription>
          Based on your assessment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Career Focus Areas</h3>
          <div className="space-y-2">
            {[
              { label: 'Technology', percentage: 85 },
              { label: 'Business', percentage: 70 },
              { label: 'Creative', percentage: 65 },
              { label: 'Science', percentage: 60 },
              { label: 'Social', percentage: 45 },
            ].map((area, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{area.label}</span>
                  <span className="font-medium">{area.percentage}%</span>
                </div>
                <Progress value={area.percentage} className="h-1.5" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Education Pathways</h3>
          <ul className="space-y-2 text-sm">
            {[
              "Bachelor's degree in Computer Science or related field",
              "Coding bootcamps for technical foundations",
              "Specialized certifications in technologies",
              "Advanced degrees for specialized roles",
            ].map((path, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-muted-foreground">{path}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerInsightsCard;
