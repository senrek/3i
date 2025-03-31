import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { unifiedQuestions } from '@/data/unifiedQuestions';
import { AssessmentProgress } from '@/components/assessment/AssessmentProgress';
import CareerClustersDisplay from '@/components/assessment/CareerClustersDisplay';
import { generateCareerClusters } from '@/utils/careerRecommendations';
import { Clock, HelpCircle } from 'lucide-react';
import QuestionCard from '@/components/assessment/QuestionCard';
import { SkillsInstructions } from '@/components/assessment/SkillsInstructions';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useToast } from '@/components/ui/use-toast';

interface CareerCluster {
  name: string;
  value: number;
  occupations: string[];
  description: string;
  skills: string[];
  educationPaths: string[];
}

export default function AssessmentPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [careerClusters, setCareerClusters] = useState<CareerCluster[]>([]);
  const [selectedClusters, setSelectedClusters] = useState<string[]>([]);
  const [showClusters, setShowClusters] = useState(false);
  const [showSkillsInstructions, setShowSkillsInstructions] = useState(false);
  const [isSkillsAssessment, setIsSkillsAssessment] = useState(false);
  const navigate = useNavigate();
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  const totalQuestions = unifiedQuestions.length;
  const progress = (currentQuestionIndex / totalQuestions) * 100;

  // Function to update career clusters
  const updateCareerClusters = async () => {
    try {
      const clusters = await generateCareerClusters(answers);
      setCareerClusters(clusters);
      // Select top 3 clusters by value
      const topClusters = clusters
        .sort((a, b) => b.value - a.value)
        .slice(0, 3)
        .map(cluster => cluster.name);
      setSelectedClusters(topClusters);
    } catch (error) {
      console.error('Error generating career clusters:', error);
    }
  };

  // Show career clusters after 50% completion
  useEffect(() => {
    if (progress >= 50 && !showClusters) {
      setShowClusters(true);
      updateCareerClusters();
    }
  }, [progress, showClusters]);

  useEffect(() => {
    // Show skills instructions after question 110
    if (currentQuestionIndex === 110) {
      setShowSkillsInstructions(true);
    }
  }, [currentQuestionIndex]);

  const handleAnswer = (value: string) => {
    const questionId = unifiedQuestions[currentQuestionIndex].id;
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = async () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      if (currentQuestionIndex === 109) {
        // Save first part answers before showing skills instructions
        await saveAnswers(answers);
      }
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      await saveAnswers(answers);
      navigate('/assessment/results');
    }
  };

  const handleContinueToSkills = () => {
    setShowSkillsInstructions(false);
    setIsSkillsAssessment(true);
    setCurrentQuestionIndex(111); // Skip the instruction question
  };

  const saveAnswers = async (answersToSave: Record<string, string>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to save your assessment results.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('assessment_responses')
        .insert([
          {
            user_id: user.id,
            answers: answersToSave,
            completed_at: new Date().toISOString(),
            is_skills_assessment: isSkillsAssessment
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your answers have been saved.",
      });
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        title: "Error",
        description: "There was a problem saving your answers.",
        variant: "destructive",
      });
    }
  };

  if (showSkillsInstructions) {
    return <SkillsInstructions onContinue={handleContinueToSkills} />;
  }

  const currentQuestion = unifiedQuestions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Assessment Overview */}
        <Card className="mb-8 p-6 bg-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Comprehensive Career Assessment
              </h1>
              <p className="text-gray-600 mb-4 md:mb-0">
                Discover your aptitude, personality traits, and interests for targeted career recommendations.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">Duration: 45 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">Questions: {totalQuestions}</span>
              </div>
            </div>
          </div>
        </Card>

        <AssessmentProgress 
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
        />
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <QuestionCard
                question={currentQuestion}
                selectedAnswer={answers[currentQuestion.id]}
                onAnswerSelect={handleAnswer}
                onNext={handleNext}
                onPrevious={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                isLastQuestion={currentQuestionIndex === totalQuestions - 1}
                isFirstQuestion={currentQuestionIndex === 0}
                showTimer={isSkillsAssessment}
                timeLimit={currentQuestion.timeLimit}
              />
            </div>
            
            {showClusters && (
              <div className="space-y-6">
                <CareerClustersDisplay
                  careerClusters={careerClusters}
                  selectedClusters={selectedClusters}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 