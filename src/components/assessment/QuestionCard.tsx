
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export interface Option {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
  category: 'aptitude' | 'personality' | 'interest' | 'learning-style';
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
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'aptitude':
        return 'bg-blue-500';
      case 'personality':
        return 'bg-purple-500';
      case 'interest':
        return 'bg-green-500';
      case 'learning-style':
        return 'bg-amber-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch(category) {
      case 'aptitude':
        return 'Aptitude';
      case 'personality':
        return 'Personality';
      case 'interest':
        return 'Interest';
      case 'learning-style':
        return 'Learning Style';
      default:
        return 'Other';
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto border border-border/50 rounded-2xl overflow-hidden shadow-lg animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <Badge 
            className={`${getCategoryColor(question.category)} text-white px-3 py-1 text-xs font-medium`}
          >
            {getCategoryLabel(question.category)}
          </Badge>
          <span className="text-sm text-muted-foreground">Question ID: {question.id}</span>
        </div>
        <CardTitle className="text-xl font-medium leading-relaxed">
          {question.text}
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
