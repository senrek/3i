
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { calculateCategoryScore, mapScoresToCareers } from '@/utils/assessmentScoring';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAssessment = (assessment: any, questions: any[]) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);

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

  const completeAssessment = async () => {
    if (!user) {
      toast.error("You must be logged in to complete the assessment");
      navigate('/login');
      return;
    }
    
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
    
    // Analyze answers to extract key insights
    const analysisInsights = analyzeResponses(answers);
    
    // Generate career recommendations based on scores
    const careerRecommendations = mapScoresToCareers(
      aptitudeScore,
      personalityScore,
      interestScore,
      learningStyleScore,
      analysisInsights
    );
    
    console.log('Career Recommendations:', careerRecommendations);
    
    // Prepare scores object
    const scores = {
      aptitude: aptitudeScore,
      personality: personalityScore,
      interest: interestScore,
      learningStyle: learningStyleScore,
      careerRecommendations,
      analysisInsights
    };
    
    try {
      // Save the assessment results to Supabase
      const { data, error } = await supabase
        .from('user_assessments')
        .insert({
          user_id: user.id,
          assessment_id: assessment.id,
          responses: answers,
          scores: scores,
          completed_at: new Date().toISOString()
        })
        .select('id')
        .single();
      
      if (error) {
        throw error;
      }
      
      setAssessmentId(data.id);
      
      // Mark the assessment as completed
      setIsCompleted(true);
      
      // Show success message
      toast.success(`Career Analysis Assessment completed successfully!`);
    } catch (error: any) {
      console.error('Error saving assessment results:', error);
      toast.error(`Failed to save assessment results: ${error.message}`);
    }
  };

  // Helper function to analyze responses
  const analyzeResponses = (responses: Record<string, string>) => {
    // Simple analysis of response patterns
    const aptitudeResponses = Object.entries(responses).filter(([id]) => id.startsWith('apt_'));
    const personalityResponses = Object.entries(responses).filter(([id]) => id.startsWith('per_'));
    const interestResponses = Object.entries(responses).filter(([id]) => id.startsWith('int_'));
    
    // Count of A/B/C/D answers for each category
    const aptitudeAnalysis = {
      A: aptitudeResponses.filter(([, val]) => val === 'A').length,
      B: aptitudeResponses.filter(([, val]) => val === 'B').length,
      C: aptitudeResponses.filter(([, val]) => val === 'C').length,
      D: aptitudeResponses.filter(([, val]) => val === 'D').length,
    };
    
    const personalityAnalysis = {
      A: personalityResponses.filter(([, val]) => val === 'A').length,
      B: personalityResponses.filter(([, val]) => val === 'B').length,
      C: personalityResponses.filter(([, val]) => val === 'C').length,
      D: personalityResponses.filter(([, val]) => val === 'D').length,
    };
    
    const interestAnalysis = {
      A: interestResponses.filter(([, val]) => val === 'A').length,
      B: interestResponses.filter(([, val]) => val === 'B').length,
      C: interestResponses.filter(([, val]) => val === 'C').length,
      D: interestResponses.filter(([, val]) => val === 'D').length,
    };
    
    // Determine dominant styles
    const aptitudeStyle = getDominantStyle(aptitudeAnalysis);
    const personalityStyle = getDominantStyle(personalityAnalysis);
    const interestStyle = getDominantStyle(interestAnalysis);
    
    return {
      aptitudeStyle,
      personalityStyle,
      interestStyle,
      rawAnalysis: {
        aptitude: aptitudeAnalysis,
        personality: personalityAnalysis,
        interest: interestAnalysis
      }
    };
  };
  
  // Helper to get dominant style
  const getDominantStyle = (analysis: Record<string, number>) => {
    const maxVal = Math.max(analysis.A, analysis.B, analysis.C, analysis.D);
    
    if (analysis.A === maxVal) return 'analytical';
    if (analysis.B === maxVal) return 'practical';
    if (analysis.C === maxVal) return 'creative';
    return 'reflective';
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
    assessmentId,
    handleStartAssessment,
    handleAnswerSelect,
    handleNextQuestion,
    handlePreviousQuestion,
    handleViewResults
  };
};
