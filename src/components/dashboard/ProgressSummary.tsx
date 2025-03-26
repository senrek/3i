
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProgressSummaryProps {
  totalProgress: number;
  assessmentsCompleted: number;
  totalAssessments: number;
}

const ProgressSummary = ({ 
  totalProgress, 
  assessmentsCompleted, 
  totalAssessments 
}: ProgressSummaryProps) => {
  return (
    <Card className="border border-border/50 rounded-2xl overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Assessment Progress</CardTitle>
        <CardDescription>
          Track your overall assessment completion
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Overall Progress</span>
            <span className="font-medium">{Math.round(totalProgress)}%</span>
          </div>
          <Progress value={totalProgress} className="h-2" />
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Assessments Completed</span>
          <span className="font-medium">{assessmentsCompleted} of {totalAssessments}</span>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          {[
            { label: 'Aptitude', value: assessmentsCompleted >= 1 ? 'Completed' : 'Pending' },
            { label: 'Personality', value: assessmentsCompleted >= 2 ? 'Completed' : 'Pending' },
            { label: 'Interests', value: assessmentsCompleted >= 3 ? 'Completed' : 'Pending' },
          ].map((item, index) => (
            <div key={index} className="rounded-lg bg-muted p-3">
              <p className="text-xs font-medium">{item.label}</p>
              <p className={`mt-1 text-xs ${item.value === 'Completed' ? 'text-green-600' : 'text-amber-600'}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressSummary;
