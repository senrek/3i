import { Progress } from "@/components/ui/progress";

interface AssessmentProgressProps {
  currentQuestion: number;
  totalQuestions: number;
}

export function AssessmentProgress({ currentQuestion, totalQuestions }: AssessmentProgressProps) {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-gray-700">
          Question {currentQuestion} of {totalQuestions}
        </div>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
