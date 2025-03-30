
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
        return 'bg-blue-600 hover:bg-blue-700';
      case 'personality':
        return 'bg-purple-600 hover:bg-purple-700';
      case 'interest':
        return 'bg-green-600 hover:bg-green-700';
      case 'learning-style':
        return 'bg-amber-600 hover:bg-amber-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
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
  
  // Get gradient background for category
  const getCategoryGradient = (category: string) => {
    switch(category) {
      case 'aptitude':
        return 'bg-gradient-to-r from-blue-500 to-blue-700';
      case 'personality':
        return 'bg-gradient-to-r from-purple-500 to-purple-700';
      case 'interest':
        return 'bg-gradient-to-r from-green-500 to-green-700';
      case 'learning-style':
        return 'bg-gradient-to-r from-amber-500 to-amber-700';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-700';
    }
  };

  const categoryColor = getCategoryColor(question.category);
  const categoryGradient = getCategoryGradient(question.category);

  return (
    <Card className="w-full max-w-3xl mx-auto border border-border/50 rounded-2xl overflow-hidden shadow-lg animate-fade-in">
      <div className={`${categoryGradient} h-2`}></div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <Badge 
            className={`${categoryColor} text-white px-3 py-1 text-xs font-medium shadow-sm`}
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
              className={`flex items-center space-x-2 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50 ${
                selectedAnswer === option.value ? 'bg-primary/10 border-primary/50' : ''
              }`}
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
          className={`rounded-xl ${categoryColor}`}
        >
          {isLastQuestion ? 'Finish' : 'Next'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuestionCard;
