
import React from 'react';
import QuestionCard from '@/components/assessment/QuestionCard';
import AssessmentProgress from '@/components/assessment/AssessmentProgress';

interface AssessmentInProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  questions: any[];
  selectedAnswer: string | null;
  onAnswerSelect: (value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLastQuestion?: boolean;  // Added as optional prop
  isFirstQuestion?: boolean; // Added as optional prop
}

const AssessmentInProgress = ({
  currentQuestion,
  totalQuestions,
  questions,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  onPrevious,
  isLastQuestion,
  isFirstQuestion
}: AssessmentInProgressProps) => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col justify-center py-12">
      <div className="container mx-auto">
        <AssessmentProgress 
          currentQuestion={currentQuestion}
          totalQuestions={totalQuestions}
        />
        
        {questions.length > 0 && currentQuestion <= questions.length && (
          <QuestionCard
            question={questions[currentQuestion - 1]}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={onAnswerSelect}
            onNext={onNext}
            onPrevious={onPrevious}
            isLastQuestion={isLastQuestion ?? (currentQuestion === totalQuestions)}
            isFirstQuestion={isFirstQuestion ?? (currentQuestion === 1)}
          />
        )}
      </div>
    </div>
  );
};

export default AssessmentInProgress;
