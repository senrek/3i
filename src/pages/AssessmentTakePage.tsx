
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { Brain, AlertCircle } from 'lucide-react';
import QuestionCard from '@/components/assessment/QuestionCard';
import AssessmentProgress from '@/components/assessment/AssessmentProgress';
import AssessmentComplete from '@/components/assessment/AssessmentComplete';
import { assessments } from '@/data/assessments';
import { unifiedQuestions } from '@/data/unifiedQuestions';

const AssessmentTakePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
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
      navigate('/assessments');
    }
  }, [id, navigate]);

  // Set the selected answer when navigating to a question with an existing answer
  useEffect(() => {
    if (questions.length > 0 && currentQuestion <= questions.length) {
      const questionId = questions[currentQuestion - 1].id;
      setSelectedAnswer(answers[questionId] || null);
    }
  }, [currentQuestion, answers, questions]);

  const handleStartAssessment = () => {
    setIsStarted(true);
  };

  const handleAnswerSelect = (value: string) => {
    if (!questions[currentQuestion - 1]) return;
    
    const questionId = questions[currentQuestion - 1].id;
    setSelectedAnswer(value);
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      // Complete the assessment
      completeAssessment();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const completeAssessment = () => {
    // In a real application, you would send the answers to your backend
    console.log('Assessment completed with answers:', answers);
    
    // Calculate scores by category
    const aptitudeQuestions = questions.filter(q => q.category === 'aptitude');
    const personalityQuestions = questions.filter(q => q.category === 'personality');
    const interestQuestions = questions.filter(q => q.category === 'interest');
    const learningStyleQuestions = questions.filter(q => q.category === 'learning-style');
    
    const aptitudeScore = calculateCategoryScore(aptitudeQuestions, answers);
    const personalityScore = calculateCategoryScore(personalityQuestions, answers);
    const interestScore = calculateCategoryScore(interestQuestions, answers);
    const learningStyleScore = calculateCategoryScore(learningStyleQuestions, answers);
    
    console.log('Aptitude Score:', aptitudeScore);
    console.log('Personality Score:', personalityScore);
    console.log('Interest Score:', interestScore);
    console.log('Learning Style Score:', learningStyleScore);
    
    // Mark the assessment as completed
    setIsCompleted(true);
    
    // Show success message
    toast.success(`Career Analysis Assessment completed successfully!`);
  };
  
  const calculateCategoryScore = (categoryQuestions: any[], answers: Record<string, string>) => {
    let score = 0;
    let totalPossibleScore = 0;
    
    categoryQuestions.forEach(question => {
      const answer = answers[question.id];
      if (!answer) return;
      
      // This is a simplified scoring system - in a real application, 
      // you would implement a more sophisticated scoring algorithm
      if (answer === 'A') score += 3;
      else if (answer === 'B') score += 2;
      else if (answer === 'C') score += 1;
      
      totalPossibleScore += 3;
    });
    
    return totalPossibleScore > 0 ? (score / totalPossibleScore) * 100 : 0;
  };

  const handleViewResults = () => {
    navigate('/reports');
  };

  // If no assessment found
  if (!assessment) {
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
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
        <Card className="w-full max-w-lg mx-auto border border-border/50 rounded-2xl overflow-hidden shadow-lg animate-scale-in">
          <CardHeader className="pb-2">
            <div className="flex justify-center py-4">
              <div className="rounded-full bg-primary/10 p-4">
                <Brain className="h-12 w-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">{assessment.title}</CardTitle>
            <CardDescription className="text-center">
              {assessment.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <span>Duration:</span>
                <span className="font-medium">{assessment.duration} minutes</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Questions:</span>
                <span className="font-medium">{assessment.questionCount}</span>
              </div>
            </div>
            
            <div className="rounded-lg bg-muted p-4">
              <h3 className="text-sm font-medium mb-2">Instructions</h3>
              <ul className="text-sm text-muted-foreground space-y-1 ml-5 list-disc">
                <li>This assessment combines questions about your aptitude, personality, interests, and learning style.</li>
                <li>Read each question carefully before answering.</li>
                <li>Select the option that best represents your preferences, skills, or behaviors.</li>
                <li>Be honest in your responses for the most accurate results.</li>
                <li>You can go back to change your answers before submitting.</li>
                <li>Your responses will be used to generate personalized career recommendations.</li>
                <li>After completion, you'll receive a comprehensive career analysis report.</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pt-2">
            <Button onClick={handleStartAssessment} className="rounded-xl">
              Start Assessment
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Assessment in progress view
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col justify-center py-12">
      <div className="container mx-auto">
        <AssessmentProgress 
          currentQuestion={currentQuestion}
          totalQuestions={questions.length}
        />
        
        {questions.length > 0 && currentQuestion <= questions.length && (
          <QuestionCard
            question={questions[currentQuestion - 1]}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            onNext={handleNextQuestion}
            onPrevious={handlePreviousQuestion}
            isLastQuestion={currentQuestion === questions.length}
            isFirstQuestion={currentQuestion === 1}
          />
        )}
      </div>
    </div>
  );
};

export default AssessmentTakePage;
