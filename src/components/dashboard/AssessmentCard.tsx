
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, Progress, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface AssessmentCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: number; // in minutes
  questionCount: number;
  progress: number; // percentage (0-100)
  status: 'not_started' | 'in_progress' | 'completed';
}

const AssessmentCard = ({ 
  id, 
  title, 
  description, 
  icon, 
  duration, 
  questionCount, 
  progress, 
  status 
}: AssessmentCardProps) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'not_started':
        return <Badge variant="outline">Not Started</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">In Progress</Badge>;
      case 'completed':
        return <Badge variant="success" className="bg-green-500 text-white hover:bg-green-600">Completed</Badge>;
      default:
        return null;
    }
  };

  const getActionButton = () => {
    switch (status) {
      case 'not_started':
        return (
          <Button asChild className="w-full rounded-xl">
            <Link to={`/assessments/${id}`}>Start Assessment</Link>
          </Button>
        );
      case 'in_progress':
        return (
          <Button asChild className="w-full rounded-xl">
            <Link to={`/assessments/${id}`}>Continue Assessment</Link>
          </Button>
        );
      case 'completed':
        return (
          <Button asChild variant="outline" className="w-full rounded-xl">
            <Link to={`/assessments/${id}`}>View Results</Link>
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="hover-scale subtle-shadow border border-border/50 rounded-2xl overflow-hidden">
      <CardHeader className="relative pb-2">
        <div className="absolute right-6 top-6">
          {getStatusBadge()}
        </div>
        <div className="flex items-center gap-2 text-primary mb-2">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{duration} min</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{questionCount} questions</span>
          </div>
        </div>
        
        {status !== 'not_started' && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <ProgressBar value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        {getActionButton()}
      </CardFooter>
    </Card>
  );
};

export default AssessmentCard;
