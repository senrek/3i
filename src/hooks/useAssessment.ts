
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
    // The new question set uses numerical IDs without prefixes, so we need to adapt our categorization
    
    // Helper function to check if a question is about a specific topic based on keywords or question numbers
    const isQuestionAbout = (questionId: string, questionNumbers: string[]) => {
      // Check if the question ID is in the format "apt_12", "per_5", etc.
      if (questionId.includes('_')) {
        const parts = questionId.split('_');
        if (parts.length === 2 && !isNaN(Number(parts[1]))) {
          return questionNumbers.includes(parts[1]);
        }
      }
      
      // For questions without standard format (like new questions), check the raw number
      const numericPart = questionId.replace(/\D/g, '');
      return questionNumbers.includes(numericPart);
    };
    
    // Define question categories by question numbers
    const technicalQuestions = ['8', '9', '14', '15', '27', '31', '44'];
    const creativeQuestions = ['4', '5', '13', '21', '30', '39', '46'];
    const analyticalQuestions = ['19', '20', '33', '36', '38', '45'];
    const socialQuestions = ['7', '29', '32', '35', '40', '41', '47'];
    const leadershipQuestions = ['6', '16', '17', '26', '43', '49'];
    const businessQuestions = ['11', '25', '48'];
    
    // Categorize responses
    const technicalResponses = Object.entries(responses).filter(([id]) => 
      technicalQuestions.some(num => isQuestionAbout(id, [num]))
    );
    
    const creativeResponses = Object.entries(responses).filter(([id]) => 
      creativeQuestions.some(num => isQuestionAbout(id, [num]))
    );
    
    const analyticalResponses = Object.entries(responses).filter(([id]) => 
      analyticalQuestions.some(num => isQuestionAbout(id, [num]))
    );
    
    const socialResponses = Object.entries(responses).filter(([id]) => 
      socialQuestions.some(num => isQuestionAbout(id, [num]))
    );
    
    const leadershipResponses = Object.entries(responses).filter(([id]) => 
      leadershipQuestions.some(num => isQuestionAbout(id, [num]))
    );
    
    const businessResponses = Object.entries(responses).filter(([id]) => 
      businessQuestions.some(num => isQuestionAbout(id, [num]))
    );
    
    // Count of A/B/C/D answers for each category
    const analyzeResponsePattern = (responsesList: [string, string][]) => {
      return {
        A: responsesList.filter(([, val]) => val === 'A').length,
        B: responsesList.filter(([, val]) => val === 'B').length,
        C: responsesList.filter(([, val]) => val === 'C').length,
        D: responsesList.filter(([, val]) => val === 'D').length,
      };
    };
    
    const technicalAnalysis = analyzeResponsePattern(technicalResponses);
    const creativeAnalysis = analyzeResponsePattern(creativeResponses);
    const analyticalAnalysis = analyzeResponsePattern(analyticalResponses);
    const socialAnalysis = analyzeResponsePattern(socialResponses);
    const leadershipAnalysis = analyzeResponsePattern(leadershipResponses);
    const businessAnalysis = analyzeResponsePattern(businessResponses);
    
    // Analyze personality questions
    const personalityResponses = Object.entries(responses).filter(([id]) => 
      id.startsWith('per_') || (Number(id.replace(/\D/g, '')) >= 54 && Number(id.replace(/\D/g, '')) <= 77)
    );
    
    const personalityAnalysis = analyzeResponsePattern(personalityResponses);
    
    // Analyze learning style questions
    const learningStyleResponses = Object.entries(responses).filter(([id]) => 
      id.startsWith('lrn_') || (Number(id.replace(/\D/g, '')) >= 90 && Number(id.replace(/\D/g, '')) <= 97)
    );
    
    const learningStyleAnalysis = analyzeResponsePattern(learningStyleResponses);
    
    // Analyze interest questions
    const interestResponses = Object.entries(responses).filter(([id]) => 
      id.startsWith('int_') || (Number(id.replace(/\D/g, '')) >= 83 && Number(id.replace(/\D/g, '')) <= 89)
    );
    
    const interestAnalysis = analyzeResponsePattern(interestResponses);
    
    // Calculate specific aptitude scores based on relevant questions
    const calculateSkillScore = (responses: [string, string][]) => {
      let score = 0;
      let answered = 0;
      
      responses.forEach(([, answer]) => {
        answered++;
        if (answer === 'A') score += 3;
        else if (answer === 'B') score += 2;
        else if (answer === 'C') score += 1;
        else if (answer === 'D') score += 0;
      });
      
      return answered > 0 ? Math.round((score / (answered * 3)) * 100) : 0;
    };
    
    const technicalAptitude = calculateSkillScore(technicalResponses);
    const creativeAptitude = calculateSkillScore(creativeResponses);
    const analyticalAptitude = calculateSkillScore(analyticalResponses);
    const socialAptitude = calculateSkillScore(socialResponses);
    const leadershipAptitude = calculateSkillScore(leadershipResponses);
    const businessAptitude = calculateSkillScore(businessResponses);
    
    // Extract key personality traits
    const isExtroverted = personalityResponses.filter(([id]) => 
      ['54', '55', '56', '59'].some(num => isQuestionAbout(id, [num]))
    ).filter(([, val]) => val === 'A').length > 1;
    
    const isStructured = personalityResponses.filter(([id]) => 
      ['75', '76', '77'].some(num => isQuestionAbout(id, [num]))
    ).filter(([, val]) => val === 'A').length > 1;
    
    const isDetail = personalityResponses.filter(([id]) => 
      ['19', '20', '33'].some(num => isQuestionAbout(id, [num]))
    ).filter(([, val]) => val === 'A').length > 1;
    
    const isFeeling = personalityResponses.filter(([id]) => 
      ['68', '69', '71', '72'].some(num => isQuestionAbout(id, [num]))
    ).filter(([, val]) => val === 'B').length > 1;
    
    // Determine strengths and gaps
    const getStrengthsAndGaps = () => {
      const strengths = [];
      const gaps = [];
      
      // Technical domain
      if (technicalAptitude > 70) strengths.push("Technical Proficiency");
      else if (technicalAptitude < 50) gaps.push("Technical Skills");
      
      // Creative domain
      if (creativeAptitude > 70) strengths.push("Creativity");
      else if (creativeAptitude < 50) gaps.push("Creative Thinking");
      
      // Analytical domain
      if (analyticalAptitude > 70) strengths.push("Analytical Thinking");
      else if (analyticalAptitude < 50) gaps.push("Analytical Thinking");
      
      // Social domain
      if (socialAptitude > 70) strengths.push("Communication Skills");
      else if (socialAptitude < 50) gaps.push("Interpersonal Abilities");
      
      // Leadership domain
      if (leadershipAptitude > 70) strengths.push("Leadership Potential");
      else if (leadershipAptitude < 50) gaps.push("Leadership Skills");
      
      // Business domain
      if (businessAptitude > 70) strengths.push("Business Acumen");
      else if (businessAptitude < 50) gaps.push("Business Knowledge");
      
      // Personality-based
      if (isExtroverted) strengths.push("Team Collaboration");
      if (isDetail) strengths.push("Attention to Detail");
      if (isStructured) strengths.push("Organization");
      if (isFeeling) strengths.push("Empathy");
      
      // Ensure we have at least 3 strengths and gaps
      if (strengths.length < 3) {
        const additionalStrengths = ["Problem Solving", "Critical Thinking", "Adaptability", "Self-Direction", "Continuous Learning"];
        for (const strength of additionalStrengths) {
          if (!strengths.includes(strength)) {
            strengths.push(strength);
            if (strengths.length >= 3) break;
          }
        }
      }
      
      if (gaps.length < 3) {
        const additionalGaps = ["Data Analysis", "Technical Certifications", "Career Focus", "Self-Motivation", "Critical Thinking"];
        for (const gap of additionalGaps) {
          if (!gaps.includes(gap)) {
            gaps.push(gap);
            if (gaps.length >= 3) break;
          }
        }
      }
      
      return { strengths, gaps };
    };
    
    const { strengths, gaps } = getStrengthsAndGaps();
    
    // Generate career area recommendations based on aptitude profiles
    const generateCareerAreaRecommendations = () => {
      const recommendations: string[] = [];
      
      // Technical careers
      if (technicalAptitude > 70 && analyticalAptitude > 60) {
        recommendations.push("Technology & Engineering");
      }
      
      // Creative careers
      if (creativeAptitude > 70) {
        recommendations.push("Design & Creative Arts");
      }
      
      // Leadership careers
      if (leadershipAptitude > 70 && isExtroverted) {
        recommendations.push("Management & Leadership");
      }
      
      // Analytical careers
      if (analyticalAptitude > 70 && isDetail) {
        recommendations.push("Research & Analysis");
      }
      
      // People-oriented careers
      if (socialAptitude > 70 && isFeeling) {
        recommendations.push("Healthcare & Social Services");
      }
      
      // Detail-oriented careers
      if (isDetail && isStructured && businessAptitude > 60) {
        recommendations.push("Finance & Accounting");
      }
      
      // If no specific recommendations, add general ones
      if (recommendations.length === 0) {
        recommendations.push("Education & Training");
        recommendations.push("Business & Management");
      }
      
      return recommendations;
    };
    
    // Helper to get dominant style based on responses
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
    
    // Final analysis results
    return {
      aptitudeStyle: getDominantStyle({
        A: technicalAnalysis.A + analyticalAnalysis.A,
        B: technicalAnalysis.B + analyticalAnalysis.B,
        C: creativeAnalysis.A + creativeAnalysis.B,
        D: socialAnalysis.A + socialAnalysis.B
      }),
      personalityStyle: getDominantPersonalityStyle(personalityAnalysis),
      interestStyle: getDominantInterestStyle(interestAnalysis),
      learningStyle: getDominantLearningStyle(learningStyleAnalysis),
      specificAptitudes: {
        technical: technicalAptitude,
        creative: creativeAptitude,
        analytical: analyticalAptitude,
        social: socialAptitude,
        leadership: leadershipAptitude,
        business: businessAptitude
      },
      personalityTraits: {
        extroverted: isExtroverted,
        structured: isStructured,
        detailOriented: isDetail,
        peopleOriented: isFeeling
      },
      strengthAreas: strengths,
      developmentAreas: gaps,
      careerAreaRecommendations: generateCareerAreaRecommendations(),
      rawAnalysis: {
        technical: technicalAnalysis,
        creative: creativeAnalysis,
        analytical: analyticalAnalysis,
        social: socialAnalysis,
        leadership: leadershipAnalysis,
        business: businessAnalysis,
        personality: personalityAnalysis,
        interest: interestAnalysis,
        learningStyle: learningStyleAnalysis
      }
    };
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
