
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Lightbulb, BarChartBig, Bookmark, GraduationCap } from 'lucide-react';
import ProgressSummary from '@/components/dashboard/ProgressSummary';
import AssessmentCard from '@/components/dashboard/AssessmentCard';

const DashboardPage = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [assessmentCount, setAssessmentCount] = useState(0);
  
  useEffect(() => {
    // Fetch user assessment data
    const fetchAssessments = async () => {
      if (!user) return;
      
      try {
        const { count, error } = await supabase
          .from('user_assessments')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        setAssessmentCount(count || 0);
      } catch (error) {
        console.error('Error fetching assessments:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAssessments();
  }, [user]);
  
  // Derive progress values
  const totalAssessments = 3; // Total number of assessment types
  const assessmentsCompleted = Math.min(assessmentCount, totalAssessments);
  const totalProgress = (assessmentsCompleted / totalAssessments) * 100;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your career assessment dashboard
        </p>
      </div>
      
      {/* Progress Summary Card */}
      <ProgressSummary 
        totalProgress={totalProgress} 
        assessmentsCompleted={assessmentsCompleted} 
        totalAssessments={totalAssessments}
      />
      
      {/* Assessment Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { id: "aptitude", title: 'Aptitude Test', description: 'Evaluate your analytical capabilities', icon: Lightbulb, duration: 15, questionCount: 25, progress: 0, status: 'not_started' as const },
          { id: "personality", title: 'Personality Analysis', description: 'Discover your personality traits', icon: BarChartBig, duration: 20, questionCount: 30, progress: 0, status: 'not_started' as const },
          { id: "interest", title: 'Interest Inventory', description: 'Identify your career interests', icon: Bookmark, duration: 10, questionCount: 20, progress: 0, status: 'not_started' as const },
          { id: "career-analysis", title: 'Career Assessment', description: 'Get comprehensive career guidance', icon: GraduationCap, duration: 45, questionCount: 50, progress: 0, status: 'not_started' as const },
        ].map((assessment, index) => (
          <AssessmentCard
            key={index}
            id={assessment.id}
            title={assessment.title}
            description={assessment.description}
            icon={assessment.icon}
            duration={assessment.duration}
            questionCount={assessment.questionCount}
            progress={assessment.progress}
            status={assessment.status}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
