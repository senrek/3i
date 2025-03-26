import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';
import { Assessment } from '@/data/assessments';

interface AssessmentCardProps {
  assessment: Assessment;
  progress?: number;
  isCompleted?: boolean;
}

const AssessmentCard = ({ 
  assessment, 
  progress = 0, 
  isCompleted = false 
}: AssessmentCardProps) => {
  const { id, title, description, icon: Icon, duration, questionCount } = assessment;
  
  return (
    <Card className="border border-border/50 rounded-2xl overflow-hidden hover:border-primary/50 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
          {isCompleted ? (
            <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
          ) : progress > 0 ? (
            <Badge variant="outline" className="border-amber-500 bg-amber-500/10 text-amber-700">
              In Progress
            </Badge>
          ) : (
            <Badge variant="outline">Not Started</Badge>
          )}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center justify-between text-sm mb-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{duration} minutes</span>
          </div>
          <div className="text-muted-foreground">
            {questionCount} questions
          </div>
        </div>
        
        {!isCompleted && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <Button asChild className="w-full rounded-xl">
          <Link to={isCompleted ? `/reports/${id}` : `/assessments/${id}`}>
            {isCompleted ? 'View Results' : progress > 0 ? 'Continue Assessment' : 'Start Assessment'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AssessmentCard;
