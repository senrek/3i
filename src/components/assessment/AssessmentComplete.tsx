
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface AssessmentCompleteProps {
  assessmentType: string;
  onViewResults: () => void;
  nextAssessment?: {
    id: string;
    name: string;
  };
}

const AssessmentComplete = ({
  assessmentType,
  onViewResults,
  nextAssessment,
}: AssessmentCompleteProps) => {
  return (
    <Card className="w-full max-w-lg mx-auto border border-border/50 rounded-2xl overflow-hidden shadow-lg animate-scale-in bg-card/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto my-4 flex items-center justify-center rounded-full bg-primary/10 p-4">
          <CheckCircle className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-2xl">Assessment Completed!</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-muted-foreground">
          Congratulations! You have successfully completed the {assessmentType} assessment.
        </p>
        
        <div className="rounded-lg bg-muted p-4 my-4">
          <p className="text-sm text-muted-foreground">
            Your responses have been recorded and will be used to generate your career path recommendations.
          </p>
        </div>
        
        {nextAssessment && (
          <p className="text-sm">
            Continue with the{' '}
            <Link
              to={`/assessments/${nextAssessment.id}`}
              className="text-primary font-medium hover:underline"
            >
              {nextAssessment.name}
            </Link>{' '}
            assessment to improve your results.
          </p>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-3 pt-2">
        <Button onClick={onViewResults} className="w-full rounded-xl">
          View Results
        </Button>
        
        {nextAssessment ? (
          <Button asChild variant="outline" className="w-full rounded-xl">
            <Link to={`/assessments/${nextAssessment.id}`}>
              Start Next Assessment
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline" className="w-full rounded-xl">
            <Link to="/dashboard">
              Return to Dashboard
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AssessmentComplete;
