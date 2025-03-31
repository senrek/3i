
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

export interface AssessmentCardProps {
  id: string; // Add id to props
  title: string;
  description: string;
  icon: LucideIcon;
  duration: number;
  questionCount: number;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
}

const AssessmentCard = ({ 
  id,  // Use id in the component
  title, 
  description, 
  icon: Icon, 
  duration, 
  questionCount, 
  progress, 
  status 
}: AssessmentCardProps) => {
  return (
    <Card className="overflow-hidden border border-border/40 transition-all hover:border-border/80 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="rounded-md bg-primary/10 p-2">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="text-sm font-medium">
              {duration} min • {questionCount} questions
            </div>
          </div>
          <div className={`text-xs rounded-full px-2 py-1 ${
            status === 'completed' 
              ? 'bg-green-100 text-green-700' 
              : status === 'in_progress' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700'
          }`}>
            {status === 'completed' 
              ? 'Completed' 
              : status === 'in_progress' 
                ? 'In Progress' 
                : 'Not Started'}
          </div>
        </div>
        <CardTitle className="text-xl mt-2">{title}</CardTitle>
        <CardDescription className="line-clamp-2 mt-1">{description}</CardDescription>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex justify-between mb-1 text-xs">
          <span>Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardContent>

      <CardFooter className="pb-4">
        <Button asChild className="w-full">
          <Link to={`/assessments/${id}`}>
            {status === 'completed' 
              ? 'View Results' 
              : status === 'in_progress' 
                ? 'Continue' 
                : 'Start Assessment'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AssessmentCard;
