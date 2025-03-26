
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface AssessmentProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining?: number;
  totalTime?: number;
}

const AssessmentProgress = ({
  currentQuestion,
  totalQuestions,
  timeRemaining,
  totalTime,
}: AssessmentProgressProps) => {
  const progressPercentage = ((currentQuestion) / totalQuestions) * 100;
  const timePercentage = timeRemaining !== undefined && totalTime ? (timeRemaining / totalTime) * 100 : null;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-6 space-y-3">
      <div className="flex justify-between items-center">
        <div className="text-sm">
          Question <span className="font-medium">{currentQuestion}</span> of{' '}
          <span className="font-medium">{totalQuestions}</span>
        </div>
        
        {timeRemaining !== undefined && (
          <div className="text-sm">
            Time Remaining: <span className="font-medium">{formatTime(timeRemaining)}</span>
          </div>
        )}
      </div>
      
      <Progress value={progressPercentage} className="h-2" />
      
      {timePercentage !== null && (
        <div className="pt-1">
          <Progress 
            value={timePercentage} 
            className={`h-1 ${timePercentage < 20 ? 'bg-destructive' : ''}`}
          />
        </div>
      )}
    </div>
  );
};

export default AssessmentProgress;
