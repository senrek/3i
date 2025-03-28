
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
    const analysisInsights = analyzeResponses(answers, questions);
    
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

  // Enhanced helper function to analyze responses with more detailed insights
  const analyzeResponses = (responses: Record<string, string>, allQuestions: any[]) => {
    // Categorize responses by question type
    const aptitudeResponses = Object.entries(responses).filter(([id]) => id.startsWith('apt_'));
    const personalityResponses = Object.entries(responses).filter(([id]) => id.startsWith('per_'));
    const interestResponses = Object.entries(responses).filter(([id]) => id.startsWith('int_'));
    const learningStyleResponses = Object.entries(responses).filter(([id]) => id.startsWith('lrn_'));
    
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
    };
    
    const interestAnalysis = {
      A: interestResponses.filter(([, val]) => val === 'A').length,
      B: interestResponses.filter(([, val]) => val === 'B').length,
      C: interestResponses.filter(([, val]) => val === 'C').length,
    };
    
    const learningStyleAnalysis = {
      A: learningStyleResponses.filter(([, val]) => val === 'A').length,
      B: learningStyleResponses.filter(([, val]) => val === 'B').length,
      C: learningStyleResponses.filter(([, val]) => val === 'C').length,
      D: learningStyleResponses.filter(([, val]) => val === 'D').length,
    };
    
    // Determine dominant styles
    const aptitudeStyle = getDominantStyle(aptitudeAnalysis);
    const personalityStyle = getDominantPersonalityStyle(personalityAnalysis);
    const interestStyle = getDominantInterestStyle(interestAnalysis);
    const learningStyle = getDominantLearningStyle(learningStyleAnalysis);
    
    // Identify specific aptitude areas based on question content
    const technicalAptitude = calculateSpecificAptitude(responses, ['apt_8', 'apt_9', 'apt_13', 'apt_14']);
    const creativeAptitude = calculateSpecificAptitude(responses, ['apt_4', 'apt_5', 'apt_12', 'apt_20']);
    const leadershipAptitude = calculateSpecificAptitude(responses, ['apt_6', 'apt_7', 'apt_15', 'apt_16']);
    const analyticalAptitude = calculateSpecificAptitude(responses, ['apt_10', 'apt_11', 'apt_18', 'apt_19']);
    
    // Extract key personality traits
    const isExtroverted = personalityResponses.filter(([id]) => ['per_1', 'per_3', 'per_6'].includes(id))
      .filter(([, val]) => val === 'A').length > 1;
    
    const isStructured = personalityResponses.filter(([id]) => ['per_4', 'per_5', 'per_15'].includes(id))
      .filter(([, val]) => val === 'A').length > 1;
    
    const isDetail = personalityResponses.filter(([id]) => ['per_7', 'per_10'].includes(id))
      .filter(([, val]) => val === 'B').length > 1;
    
    const isFeeling = personalityResponses.filter(([id]) => ['per_11', 'per_12', 'per_13'].includes(id))
      .filter(([, val]) => val === 'B').length > 1;
    
    // Generate career area recommendations based on aptitude and interest patterns
    const careerAreaRecommendations = generateCareerAreaRecommendations(
      {technical: technicalAptitude, creative: creativeAptitude, leadership: leadershipAptitude, analytical: analyticalAptitude},
      {extroverted: isExtroverted, structured: isStructured, detail: isDetail, feeling: isFeeling},
      interestStyle
    );
    
    return {
      aptitudeStyle,
      personalityStyle,
      interestStyle,
      learningStyle,
      specificAptitudes: {
        technical: technicalAptitude,
        creative: creativeAptitude,
        leadership: leadershipAptitude,
        analytical: analyticalAptitude
      },
      personalityTraits: {
        extroverted: isExtroverted,
        structured: isStructured,
        detailOriented: isDetail,
        peopleOriented: isFeeling
      },
      careerAreaRecommendations,
      rawAnalysis: {
        aptitude: aptitudeAnalysis,
        personality: personalityAnalysis,
        interest: interestAnalysis,
        learningStyle: learningStyleAnalysis
      }
    };
  };
  
  // Calculate specific aptitude score based on relevant questions
  const calculateSpecificAptitude = (responses: Record<string, string>, questionIds: string[]): number => {
    let score = 0;
    let answered = 0;
    
    questionIds.forEach(id => {
      if (responses[id]) {
        answered++;
        if (responses[id] === 'A') score += 3;
        else if (responses[id] === 'B') score += 2;
        else if (responses[id] === 'C') score += 1;
      }
    });
    
    return answered > 0 ? Math.round((score / (answered * 3)) * 100) : 0;
  };
  
  // Generate career area recommendations based on aptitude profiles
  const generateCareerAreaRecommendations = (
    aptitudes: {technical: number, creative: number, leadership: number, analytical: number},
    personalityTraits: {extroverted: boolean, structured: boolean, detail: boolean, feeling: boolean},
    interestStyle: string
  ): string[] => {
    const recommendations: string[] = [];
    
    // Technical careers
    if (aptitudes.technical > 70 && aptitudes.analytical > 60) {
      recommendations.push("Technology & Engineering");
    }
    
    // Creative careers
    if (aptitudes.creative > 70) {
      recommendations.push("Design & Creative Arts");
    }
    
    // Leadership careers
    if (aptitudes.leadership > 70 && personalityTraits.extroverted) {
      recommendations.push("Management & Leadership");
    }
    
    // Analytical careers
    if (aptitudes.analytical > 70 && personalityTraits.detail) {
      recommendations.push("Research & Analysis");
    }
    
    // People-oriented careers
    if (personalityTraits.feeling && personalityTraits.extroverted) {
      recommendations.push("Healthcare & Social Services");
    }
    
    // Detail-oriented careers
    if (personalityTraits.detail && personalityTraits.structured) {
      recommendations.push("Finance & Accounting");
    }
    
    // Based on interest style
    if (interestStyle === 'creative') {
      recommendations.push("Media & Communication");
    } else if (interestStyle === 'practical') {
      recommendations.push("Business & Entrepreneurship");
    }
    
    // If no specific recommendations, add general ones
    if (recommendations.length === 0) {
      recommendations.push("Education & Training");
      recommendations.push("Business & Management");
    }
    
    return recommendations;
  };
  
  // Helper to get dominant style for aptitude
  const getDominantStyle = (analysis: Record<string, number>) => {
    const maxVal = Math.max(analysis.A, analysis.B, analysis.C, analysis.D);
    
    if (analysis.A === maxVal) return 'analytical';
    if (analysis.B === maxVal) return 'practical';
    if (analysis.C === maxVal) return 'creative';
    return 'reflective';
  };
  
  // Helper to get dominant personality style
  const getDominantPersonalityStyle = (analysis: Record<string, number>) => {
    if (analysis.A > analysis.B) return 'extroverted';
    return 'introverted';
  };
  
  // Helper to get dominant interest style
  const getDominantInterestStyle = (analysis: Record<string, number>) => {
    if (analysis.C > (analysis.A + analysis.B)) return 'passionate';
    if (analysis.B > analysis.A) return 'curious';
    return 'selective';
  };
  
  // Helper to get dominant learning style
  const getDominantLearningStyle = (analysis: Record<string, number>) => {
    const maxVal = Math.max(analysis.A, analysis.B, analysis.C, analysis.D);
    
    if (analysis.A === maxVal) return 'visual';
    if (analysis.B === maxVal) return 'auditory';
    if (analysis.C === maxVal) return 'kinesthetic';
    return 'reading/writing';
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
