
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { toast } from "sonner";
import { assessments } from '@/data/assessments';
import { unifiedQuestions } from '@/data/unifiedQuestions';
import AssessmentNotFound from '@/components/assessment/AssessmentNotFound';
import AssessmentComplete from '@/components/assessment/AssessmentComplete';
import AssessmentIntroCard from '@/components/assessment/AssessmentIntroCard';
import AssessmentInProgress from '@/components/assessment/AssessmentInProgress';
import { useAssessment } from '@/hooks/useAssessment';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const AssessmentTakePage = () => {
  const { id } = useParams<{ id: string }>();
  const { isLoading, isAuthenticated } = useRequireAuth();
  
  const [assessment, setAssessment] = useState<typeof assessments[0] | undefined>(undefined);
  const [questions, setQuestions] = useState<any[]>([]);

  // Set the assessment and questions based on the id parameter
  useEffect(() => {
    if (!id) return;
    
    const foundAssessment = assessments.find(a => a.id === id);
    
    if (foundAssessment) {
      setAssessment(foundAssessment);
      
      // Set all unified questions for the assessment
      setQuestions(unifiedQuestions);
    } else {
      toast.error("Assessment not found");
    }
  }, [id]);

  // Use the custom assessment hook
  const {
    currentQuestion,
    selectedAnswer,
    isCompleted,
    isStarted,
    handleStartAssessment,
    handleAnswerSelect,
    handleNextQuestion,
    handlePreviousQuestion,
    handleViewResults
  } = useAssessment(assessment, questions);

  // Show loading while checking authentication
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">Loading...</div>;
  }

  // If not authenticated, the useRequireAuth hook will redirect to login

  // If no assessment found
  if (!assessment) {
    return <AssessmentNotFound />;
  }

  // Assessment completed view
  if (isCompleted) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
        <AssessmentComplete 
          assessmentType={assessment.title}
          onViewResults={handleViewResults}
          nextAssessment={undefined}
        />
      </div>
    );
  }

  // Assessment not yet started view
  if (!isStarted) {
    return <AssessmentIntroCard assessment={assessment} onStartAssessment={handleStartAssessment} />;
  }

  // Assessment in progress view
  return (
    <AssessmentInProgress
      currentQuestion={currentQuestion}
      totalQuestions={questions.length}
      questions={questions}
      selectedAnswer={selectedAnswer}
      onAnswerSelect={handleAnswerSelect}
      onNext={handleNextQuestion}
      onPrevious={handlePreviousQuestion}
      isLastQuestion={currentQuestion === questions.length}
      isFirstQuestion={currentQuestion === 1}
    />
  );
};

export default AssessmentTakePage;
