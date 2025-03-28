
import React, { useState, useEffect } from 'react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import ReportHeader from '@/components/reports/ReportHeader';
import LoadingPlaceholder from '@/components/reports/LoadingPlaceholder';
import ReportSummaryCard from '@/components/reports/ReportSummaryCard';
import ReportPDFGenerator from '@/components/reports/ReportPDFGenerator';
import ReportTabs from '@/components/reports/ReportTabs';

interface ReportData {
  id: string;
  completedAt: string;
  assessmentCompleted: boolean;
  scores: {
    aptitude: number;
    personality: number;
    interest: number;
    learningStyle: number;
    careerRecommendations: any[];
  } | null;
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
          
          setReportData({
            id: assessments.id,
            completedAt: assessments.completed_at,
            assessmentCompleted: true,
            scores: assessments.scores,
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

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
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

          {reportData?.assessmentCompleted && (
            <>
              <ReportPDFGenerator 
                reportId={reportData.id} 
                userName={reportData.userName} 
                scores={reportData.scores}
              />
              
              {reportData.scores && (
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
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ReportsPage;
