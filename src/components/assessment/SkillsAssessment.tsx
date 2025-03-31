import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SkillsQuestion } from '@/data/skillsQuestions';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TablesInsert } from '@/integrations/supabase/types';
import { motion, AnimatePresence } from 'framer-motion';

interface SkillsAssessmentProps {
  questions: SkillsQuestion[];
  onComplete: (answers: Record<string, string>) => void;
  assessmentId: string;
  userId: string;
}

export function SkillsAssessment({ questions, onComplete, assessmentId, userId }: SkillsAssessmentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 0);
  const [totalTimeLeft, setTotalTimeLeft] = useState(
    questions.reduce((acc, q) => acc + q.timeLimit, 0)
  );
  const [isAutoTesting, setIsAutoTesting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Function to handle moving to next question
  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(questions[currentQuestionIndex + 1].timeLimit);
      return true;
    }
    return false;
  };

  // Function to handle completing the assessment
    const completeAssessment = async (finalAnswers: Record<string, string>) => {
    try {
      const scores = calculateScores(finalAnswers);
      const completedAt = new Date().toISOString();

      // Save to user_assessments
      const { error: responseError } = await supabase
        .from('user_assessments')
        .upsert({
          id: assessmentId,
          user_id: userId,
          assessment_id: 'skills',
          responses: finalAnswers,
          scores: {
            overall: scores.overall_score,
            numerical: scores.numerical_score,
            logical: scores.logical_score,
            verbal: scores.verbal_score,
            clerical: scores.clerical_score,
            spatial: scores.spatial_score,
            leadership: scores.leadership_score,
            social: scores.social_score,
            mechanical: scores.mechanical_score
          },
          completed_at: completedAt
        });

      if (responseError) throw responseError;

      // Save to skill_assessments
      const { error: skillError } = await supabase
        .from('skill_assessments')
        .insert({
          assessment_id: assessmentId,
          user_id: userId,
          overall_score: scores.overall_score,
          numerical_score: scores.numerical_score,
          logical_score: scores.logical_score,
          verbal_score: scores.verbal_score,
          clerical_score: scores.clerical_score,
          spatial_score: scores.spatial_score,
          leadership_score: scores.leadership_score,
          social_score: scores.social_score,
          mechanical_score: scores.mechanical_score,
          completed_at: completedAt
        });

      if (skillError) throw skillError;

      toast.success('Assessment completed successfully!');
      onComplete(finalAnswers);
    } catch (err) {
      console.error('Error saving assessment:', err);
      toast.error('Failed to save assessment results');
    }
  };

  // Auto-complete functionality
  const startAutoTest = async () => {
    try {
      setIsAutoTesting(true);
      toast.info('Starting auto-complete...');
      
      // Generate all answers upfront for ALL questions
      const finalAnswers: Record<string, string> = {};
      
      // Generate answers for ALL questions
      questions.forEach(q => {
        finalAnswers[q.id] = (Math.floor(Math.random() * 5) + 1).toString();
      });

      // Verify we have answers for all questions
      if (Object.keys(finalAnswers).length !== questions.length) {
        throw new Error(`Missing answers. Expected ${questions.length}, got ${Object.keys(finalAnswers).length}`);
      }

      // Set all answers immediately
      setAnswers(finalAnswers);

      // Save to Supabase directly without animation
      const scores = calculateScores(finalAnswers);
      const completedAt = new Date().toISOString();

      // Save to user_assessments first
      const { error: responseError } = await supabase
        .from('user_assessments')
        .upsert({
          id: assessmentId,
          user_id: userId,
          assessment_id: 'skills',
          responses: finalAnswers,
          scores: {
            overall: scores.overall_score,
            numerical: scores.numerical_score,
            logical: scores.logical_score,
            verbal: scores.verbal_score,
            clerical: scores.clerical_score,
            spatial: scores.spatial_score,
            leadership: scores.leadership_score,
            social: scores.social_score,
            mechanical: scores.mechanical_score
          },
          completed_at: completedAt
        });

      if (responseError) throw responseError;

      // Save to skill_assessments
      const { error: skillError } = await supabase
        .from('skill_assessments')
        .upsert({  // Changed from insert to upsert
          assessment_id: assessmentId,
          user_id: userId,
          overall_score: scores.overall_score,
          numerical_score: scores.numerical_score,
          logical_score: scores.logical_score,
          verbal_score: scores.verbal_score,
          clerical_score: scores.clerical_score,
          spatial_score: scores.spatial_score,
          leadership_score: scores.leadership_score,
          social_score: scores.social_score,
          mechanical_score: scores.mechanical_score,
          completed_at: completedAt
        });

      if (skillError) throw skillError;

      // Wait a moment for the data to be available
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verify the data was saved
      const { data: verifyData, error: verifyError } = await supabase
        .from('skill_assessments')
        .select('*')
        .eq('assessment_id', assessmentId)
        .eq('user_id', userId)
        .single();

      if (verifyError || !verifyData) {
        throw new Error('Failed to verify saved data');
      }

      // Call onComplete with all answers
      onComplete(finalAnswers);
      
      toast.success(`Successfully completed all ${questions.length} questions!`);
    } catch (error) {
      console.error('Auto-test error:', error);
      toast.error('Failed to auto-complete assessment');
    } finally {
      setIsAutoTesting(false);
    }
  };

  // Handle manual next question
  const handleNext = async () => {
    const hasMoreQuestions = moveToNextQuestion();
    if (!hasMoreQuestions) {
      await completeAssessment(answers);
    }
  };

  // Timer effect
  useEffect(() => {
    if (isAutoTesting) return; // Don't run timer during auto-testing

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleNext();
          return questions[currentQuestionIndex + 1]?.timeLimit || 0;
        }
        return prev - 1;
      });
      setTotalTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, questions, isAutoTesting]);

  const calculateScores = (answers: Record<string, string>) => {
    // Initialize scores for each category
    const scores = {
      numerical: 0,
      logical: 0,
      verbal: 0,
      clerical: 0,
      spatial: 0,
      leadership: 0,
      social: 0,
      mechanical: 0
    };

    // Calculate scores based on answers
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = questions.find(q => q.id === questionId);
      if (question) {
        const score = parseInt(answer);
        switch (question.category) {
          case 'Numerical Ability':
            scores.numerical += score;
            break;
          case 'Logical Ability':
            scores.logical += score;
            break;
          case 'Verbal Ability':
            scores.verbal += score;
            break;
          case 'Clerical and Organizing Skills':
            scores.clerical += score;
            break;
          case 'Spatial & Visualization Ability':
            scores.spatial += score;
            break;
          case 'Leadership & Decision making skills':
            scores.leadership += score;
            break;
          case 'Social & Co-operation Skills':
            scores.social += score;
            break;
          case 'Mechanical Abilities':
            scores.mechanical += score;
            break;
        }
      }
    });

    // Calculate overall score (average of all scores)
    const overallScore = Object.values(scores).reduce((acc, score) => acc + score, 0) / Object.keys(scores).length;

    return {
      overall_score: Math.round(overallScore),
      numerical_score: Math.round(scores.numerical / questions.filter(q => q.category === 'Numerical Ability').length),
      logical_score: Math.round(scores.logical / questions.filter(q => q.category === 'Logical Ability').length),
      verbal_score: Math.round(scores.verbal / questions.filter(q => q.category === 'Verbal Ability').length),
      clerical_score: Math.round(scores.clerical / questions.filter(q => q.category === 'Clerical and Organizing Skills').length),
      spatial_score: Math.round(scores.spatial / questions.filter(q => q.category === 'Spatial & Visualization Ability').length),
      leadership_score: Math.round(scores.leadership / questions.filter(q => q.category === 'Leadership & Decision making skills').length),
      social_score: Math.round(scores.social / questions.filter(q => q.category === 'Social & Co-operation Skills').length),
      mechanical_score: Math.round(scores.mechanical / questions.filter(q => q.category === 'Mechanical Abilities').length)
    };
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700">{currentQuestion.category}</h1>
          <div className="flex gap-4">
            <Button
              onClick={startAutoTest}
              disabled={isAutoTesting}
              variant="outline"
              className="bg-white hover:bg-gray-50"
            >
              {isAutoTesting ? "Auto Completing..." : "Auto Complete"}
            </Button>
            <div className="flex gap-8">
              <div className="text-sm">
                <div className="text-gray-600">Time Left for this Question</div>
                <div className="text-xl font-bold text-blue-600">{formatTime(timeLeft)}</div>
              </div>
              <div className="text-sm">
                <div className="text-gray-600">Total Time Remaining</div>
                <div className="text-xl font-bold text-blue-600">{formatTime(totalTimeLeft)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-medium">
            {currentQuestionIndex + 1}/{questions.length}
          </div>
          <Progress value={progress} className="w-full max-w-md mx-4" />
        </div>

        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-4">
              Question {currentQuestionIndex + 1}
            </h2>
            <p className="text-gray-800">{currentQuestion.text}</p>
          </div>

          {currentQuestion.imageUrl && (
            <div className="mb-6">
              <img 
                src={currentQuestion.imageUrl} 
                alt="Question visual"
                className="max-w-full h-auto rounded-lg shadow-md" 
              />
            </div>
          )}

          <RadioGroup
            value={answers[currentQuestion.id] || ''}
            onValueChange={(value) => {
              setAnswers(prev => ({
                ...prev,
                [currentQuestion.id]: value
              }));
            }}
            className="space-y-3"
          >
            <AnimatePresence>
              {currentQuestion.options.map((option) => (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    backgroundColor: selectedOption === option.value ? '#e5e7eb' : 'transparent',
                    transition: { duration: 0.3 }
                  }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-gray-50"
                >
                  <RadioGroupItem 
                    value={option.value} 
                    id={option.value}
                    disabled={isAutoTesting}
                  />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                    {option.label}
                  </Label>
                </motion.div>
              ))}
            </AnimatePresence>
          </RadioGroup>

          <div className="mt-6 flex justify-between">
            <div className="ml-auto">
              <Button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isAutoTesting}
              >
                {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 