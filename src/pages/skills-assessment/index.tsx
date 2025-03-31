import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SkillsAssessment } from '@/components/assessment/SkillsAssessment';
import { skillsQuestions } from '@/data/skillsQuestions';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useToast } from '@/components/ui/use-toast';

export default function SkillsAssessmentPage() {
  const navigate = useNavigate();
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  const handleComplete = async (answers: Record<string, string>) => {
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

      // Save answers to Supabase
      const { error } = await supabase
        .from('skills_assessment_responses')
        .insert([
          {
            user_id: user.id,
            answers,
            completed_at: new Date().toISOString(),
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your skills assessment has been saved.",
      });

      // Navigate to results page
      navigate('/assessment/results');
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        title: "Error",
        description: "There was a problem saving your assessment results.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <SkillsAssessment 
        questions={skillsQuestions} 
        onComplete={handleComplete} 
      />
    </div>
  );
} 