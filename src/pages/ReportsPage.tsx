
import React, { useState, useEffect } from 'react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import ReportHeader from '@/components/reports/ReportHeader';
import LoadingPlaceholder from '@/components/reports/LoadingPlaceholder';
import ReportSummaryCard from '@/components/reports/ReportSummaryCard';
import ReportPDFGenerator from '@/components/reports/ReportPDFGenerator';
import ReportTabs from '@/components/reports/ReportTabs';

// Define a proper type for scores
interface ReportScores {
  aptitude: number;
  personality: number;
  interest: number;
  learningStyle: number;
  careerRecommendations: any[];
}

interface ReportData {
  id: string;
  completedAt: string;
  assessmentCompleted: boolean;
  scores: ReportScores | null;
  userName: string;
}

const ReportsPage = () => {
  useRequireAuth(); // Require authentication for this page
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  // Fetch report data from Supabase
  useEffect(() => {
    const fetchReportData = async () => {
      if (!user) return;
      
      try {
        // Fetch latest assessment for the user
        const { data: assessments, error } = await supabase
          .from('user_assessments')
          .select('*, profiles:user_id(first_name, last_name)')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false })
          .limit(1)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (assessments) {
          const userData = assessments.profiles as any;
          const userName = userData?.first_name && userData?.last_name 
            ? `${userData.first_name} ${userData.last_name}` 
            : user.email || 'User';
          
          // Ensure scores has the right structure
          let validScores: ReportScores | null = null;
          
          if (assessments.scores) {
            // Convert from Json to the expected format
            const scoresObj = assessments.scores as Record<string, any>;
            
            // Extract values with proper type checking
            validScores = {
              aptitude: typeof scoresObj.aptitude === 'number' ? scoresObj.aptitude : 0,
              personality: typeof scoresObj.personality === 'number' ? scoresObj.personality : 0,
              interest: typeof scoresObj.interest === 'number' ? scoresObj.interest : 0,
              learningStyle: typeof scoresObj.learningStyle === 'number' ? scoresObj.learningStyle : 0,
              careerRecommendations: Array.isArray(scoresObj.careerRecommendations) 
                ? scoresObj.careerRecommendations 
                : []
            };
          }
          
          setReportData({
            id: assessments.id,
            completedAt: assessments.completed_at || new Date().toISOString(),
            assessmentCompleted: true,
            scores: validScores,
            userName
          });
        } else {
          setReportData({
            id: 'no-assessment',
            completedAt: new Date().toISOString(),
            assessmentCompleted: false,
            scores: null,
            userName: user.email || 'User'
          });
        }
      } catch (error) {
        console.error('Error fetching assessment data:', error);
        setReportData({
          id: 'error',
          completedAt: new Date().toISOString(),
          assessmentCompleted: false,
          scores: null,
          userName: user.email || 'User'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReportData();
  }, [user]);

  // Format date for display - with error handling
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateString);
        return 'Invalid Date';
      }
      
      return new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Error';
    }
  };

  return (
    <div className="space-y-8">
      <ReportHeader />

      {isLoading ? (
        <LoadingPlaceholder />
      ) : (
        <>
          <ReportSummaryCard 
            reportData={reportData} 
            formatDate={formatDate} 
          />

          {reportData?.assessmentCompleted && reportData?.scores && (
            <>
              <ReportPDFGenerator 
                reportId={reportData.id} 
                userName={reportData.userName} 
                scores={reportData.scores}
              />
              
              <ReportTabs 
                reportId={reportData.id} 
                skillData={[
                  { name: 'Analytical', value: reportData.scores.aptitude, fullMark: 100 },
                  { name: 'Communication', value: Math.round(reportData.scores.personality * 0.8), fullMark: 100 },
                  { name: 'Technical', value: Math.round(reportData.scores.aptitude * 0.9), fullMark: 100 },
                  { name: 'Creativity', value: Math.round(reportData.scores.interest * 0.7), fullMark: 100 },
                  { name: 'Leadership', value: Math.round(reportData.scores.personality * 0.6), fullMark: 100 },
                  { name: 'Problem Solving', value: Math.round(reportData.scores.aptitude * 0.85), fullMark: 100 },
                ]} 
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ReportsPage;
