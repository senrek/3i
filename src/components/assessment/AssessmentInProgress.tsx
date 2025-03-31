import React, { useState } from 'react';
import QuestionCard from '@/components/assessment/QuestionCard';
import { AssessmentProgress } from '@/components/assessment/AssessmentProgress';
import { Button } from '@/components/ui/button';
import { PlayIcon } from 'lucide-react';

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
  const [isAutoTesting, setIsAutoTesting] = useState(false);

  const startAutoTest = async () => {
    setIsAutoTesting(true);
    const maxQuestions = Math.min(110, questions.length);
    const delay = 800; // Delay between questions in milliseconds

    for (let i = currentQuestion - 1; i < maxQuestions; i++) {
      const question = questions[i];
      
      // For questions 100-103 (multiple selection)
      if (question.id.startsWith('int_') && Number(question.id.replace(/\D/g, '')) >= 100) {
        // Randomly select 1-3 options, excluding the last option (None of the above)
        const numSelections = Math.floor(Math.random() * 3) + 1;
        const availableOptions = question.options.slice(0, -1); // Exclude last option
        const selectedIndices = new Set<number>();
        
        while (selectedIndices.size < numSelections && selectedIndices.size < availableOptions.length) {
          selectedIndices.add(Math.floor(Math.random() * availableOptions.length));
        }
        
        const selectedValues = Array.from(selectedIndices).map(index => availableOptions[index].value);
        onAnswerSelect(selectedValues.join(','));
      } else {
        // For single selection questions
        const randomIndex = Math.floor(Math.random() * question.options.length);
        onAnswerSelect(question.options[randomIndex].value);
      }
      
      await new Promise(resolve => setTimeout(resolve, delay));
      if (i < maxQuestions - 1) {
        onNext();
      }
    }
    
    setIsAutoTesting(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col justify-center py-12">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <AssessmentProgress 
            currentQuestion={currentQuestion}
            totalQuestions={totalQuestions}
          />
          {currentQuestion === 1 && !isAutoTesting && (
            <Button
              onClick={startAutoTest}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              disabled={isAutoTesting}
            >
              <PlayIcon size={16} />
              Auto Complete
            </Button>
          )}
        </div>
        
        {questions.length > 0 && currentQuestion <= questions.length && (
          <QuestionCard
            question={questions[currentQuestion - 1]}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={onAnswerSelect}
            onNext={onNext}
            onPrevious={onPrevious}
            isLastQuestion={isLastQuestion ?? (currentQuestion === totalQuestions)}
            isFirstQuestion={isFirstQuestion ?? (currentQuestion === 1)}
            disabled={isAutoTesting}
          />
        )}
      </div>
    </div>
  );
};

export default AssessmentInProgress;
