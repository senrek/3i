
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export interface Option {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
  category?: 'aptitude' | 'personality' | 'interest' | 'learning-style';
}

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string | null;
  onAnswerSelect: (value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLastQuestion: boolean;
  isFirstQuestion: boolean;
}

const QuestionCard = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  onPrevious,
  isLastQuestion,
  isFirstQuestion,
}: QuestionCardProps) => {
  return (
    <Card className="w-full max-w-3xl mx-auto border border-border/50 rounded-2xl overflow-hidden shadow-lg animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium leading-relaxed">
          {question.text}
          {question.category && (
            <span className="text-xs font-normal bg-secondary text-secondary-foreground px-2 py-1 rounded-full ml-2 align-middle">
              {question.category.charAt(0).toUpperCase() + question.category.slice(1).replace('-', ' ')}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedAnswer || ''}
          onValueChange={onAnswerSelect}
          className="space-y-3"
        >
          {question.options.map((option) => (
            <div
              key={option.value}
              className="flex items-center space-x-2 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
            >
              <RadioGroupItem 
                value={option.value} 
                id={option.value} 
                className="border-primary"
              />
              <Label
                htmlFor={option.value}
                className="flex-1 cursor-pointer font-normal"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirstQuestion}
          className="rounded-xl"
        >
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedAnswer}
          className="rounded-xl"
        >
          {isLastQuestion ? 'Finish' : 'Next'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuestionCard;
