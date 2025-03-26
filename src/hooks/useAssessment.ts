
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { calculateCategoryScore } from '@/utils/assessmentScoring';

export const useAssessment = (assessment: any, questions: any[]) => {
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

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

  const handleViewResults = () => {
    navigate('/reports');
  };

  return {
    currentQuestion,
    answers,
    selectedAnswer,
    isCompleted,
    isStarted,
    handleStartAssessment,
    handleAnswerSelect,
    handleNextQuestion,
    handlePreviousQuestion,
    handleViewResults
  };
};
