import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Question } from '@/data/unifiedQuestions';
import { Timer } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string | null;
  onAnswerSelect: (value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLastQuestion: boolean;
  isFirstQuestion: boolean;
  showTimer?: boolean;
  timeLimit?: number;
  disabled?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  onPrevious,
  isLastQuestion,
  isFirstQuestion,
  showTimer = false,
  timeLimit = 0,
  disabled = false
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    if (selectedAnswer) {
      setSelectedOptions(selectedAnswer.split(','));
    } else {
      setSelectedOptions([]);
    }
  }, [selectedAnswer]);

  useEffect(() => {
    setTimeLeft(timeLimit);

    if (!showTimer || !timeLimit) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [question.id, timeLimit, showTimer, onNext]);

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'aptitude':
        return 'bg-blue-500';
      case 'personality':
        return 'bg-green-500';
      case 'interest':
        return 'bg-purple-500';
      case 'learning-style':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryLabel = (category: string) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleOptionSelect = (value: string) => {
    if (disabled) return;
    
    let newSelectedOptions: string[];
    
    // For multiple selection questions (100-103)
    if (question.id.startsWith('int_') && Number(question.id.replace(/\D/g, '')) >= 100) {
      if (value === 'F') {
        // If "None of the above" is selected, clear other selections
        newSelectedOptions = ['F'];
      } else if (selectedOptions.includes(value)) {
        // Remove if already selected
        newSelectedOptions = selectedOptions.filter(opt => opt !== value);
      } else {
        // Add new selection if under limit and not "None of the above"
        if (selectedOptions.includes('F')) {
          newSelectedOptions = [value];
        } else if (selectedOptions.length < 3) {
          newSelectedOptions = [...selectedOptions, value];
        } else {
          return; // Don't allow more than 3 selections
        }
      }
    } else {
      // For regular single-selection questions
      newSelectedOptions = [value];
    }
    
    setSelectedOptions(newSelectedOptions);
    onAnswerSelect(newSelectedOptions.join(','));
  };

  const categoryColor = getCategoryColor(question.category);
  const categoryGradient = `bg-gradient-to-r from-${question.category}-500/50 to-${question.category}-500/10`;

  const isMultipleSelection = question.id.startsWith('int_') && Number(question.id.replace(/\D/g, '')) >= 100;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

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
        {isMultipleSelection && (
          <p className="text-sm text-muted-foreground mt-2">
            Select up to 3 options
          </p>
        )}
        {showTimer && timeLimit > 0 && (
          <div className="flex items-center gap-2 text-blue-600 mt-2">
            <Timer className="w-5 h-5" />
            <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isMultipleSelection ? (
          <div className="space-y-3">
            {question.options.map((option) => (
              <div
                key={option.value}
                className={`flex items-center space-x-2 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50 ${
                  selectedOptions.includes(option.value) ? 'bg-primary/10 border-primary/50' : ''
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Checkbox
                  id={option.value}
                  checked={selectedOptions.includes(option.value)}
                  onCheckedChange={() => handleOptionSelect(option.value)}
                  disabled={disabled || (selectedOptions.length >= 3 && !selectedOptions.includes(option.value) && option.value !== 'F')}
                />
                <Label
                  htmlFor={option.value}
                  className={`flex-1 cursor-pointer font-normal ${disabled ? 'cursor-not-allowed' : ''}`}
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        ) : (
          <RadioGroup
            value={selectedAnswer || ''}
            onValueChange={handleOptionSelect}
            className="space-y-3"
            disabled={disabled}
          >
            {question.options.map((option) => (
              <div
                key={option.value}
                className={`flex items-center space-x-2 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50 ${
                  selectedAnswer === option.value ? 'bg-primary/10 border-primary/50' : ''
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <RadioGroupItem 
                  value={option.value} 
                  id={option.value} 
                  className="border-primary"
                  disabled={disabled}
                />
                <Label
                  htmlFor={option.value}
                  className={`flex-1 cursor-pointer font-normal ${disabled ? 'cursor-not-allowed' : ''}`}
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirstQuestion || disabled}
          className="rounded-xl"
        >
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedAnswer || disabled}
          className={`rounded-xl ${categoryColor}`}
        >
          {isLastQuestion ? 'Finish' : 'Next'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuestionCard;
