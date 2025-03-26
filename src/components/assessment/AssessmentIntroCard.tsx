
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';
import { Assessment } from '@/data/assessments';

interface AssessmentIntroCardProps {
  assessment: Assessment;
  onStartAssessment: () => void;
}

const AssessmentIntroCard = ({ assessment, onStartAssessment }: AssessmentIntroCardProps) => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <Card className="w-full max-w-lg mx-auto border border-border/50 rounded-2xl overflow-hidden shadow-lg animate-scale-in">
        <CardHeader className="pb-2">
          <div className="flex justify-center py-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Brain className="h-12 w-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">{assessment.title}</CardTitle>
          <CardDescription className="text-center">
            {assessment.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>Duration:</span>
              <span className="font-medium">{assessment.duration} minutes</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Questions:</span>
              <span className="font-medium">{assessment.questionCount}</span>
            </div>
          </div>
          
          <div className="rounded-lg bg-muted p-4">
            <h3 className="text-sm font-medium mb-2">Instructions</h3>
            <ul className="text-sm text-muted-foreground space-y-1 ml-5 list-disc">
              <li>This assessment combines questions about your aptitude, personality, interests, and learning style.</li>
              <li>Read each question carefully before answering.</li>
              <li>Select the option that best represents your preferences, skills, or behaviors.</li>
              <li>Be honest in your responses for the most accurate results.</li>
              <li>You can go back to change your answers before submitting.</li>
              <li>Your responses will be used to generate personalized career recommendations.</li>
              <li>After completion, you'll receive a comprehensive career analysis report.</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pt-2">
          <Button onClick={onStartAssessment} className="rounded-xl">
            Start Assessment
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AssessmentIntroCard;
