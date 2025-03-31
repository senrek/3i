
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const AssessmentNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <Card className="w-full max-w-md mx-auto animate-fade-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Assessment Not Found</CardTitle>
          <CardDescription>
            The assessment you're looking for doesn't exist.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <AlertCircle className="h-16 w-16 text-muted-foreground" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pt-2">
          <Button onClick={() => navigate('/assessments')}>
            Return to Assessments
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AssessmentNotFound;
