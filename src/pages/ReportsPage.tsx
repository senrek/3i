
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
import { Json } from '@/integrations/supabase/types';

// Define a proper type for scores
interface ReportScores {
  aptitude: number;
  personality: number;
  interest: number;
  learningStyle: number;
  careerRecommendations: Array<{
    careerTitle: string;
    suitabilityPercentage: number;
    careerDescription: string;
    educationPathways: string[];
    keySkills: string[];
    workNature: string[];
    gapAnalysis: string[];
  }>;
  analysisInsights?: {
    aptitudeStyle?: string;
    personalityStyle?: string;
    interestStyle?: string;
    rawAnalysis?: Record<string, any>;
  };
}

interface ReportData {
  id: string;
  completedAt: string;
  assessmentCompleted: boolean;
  scores: ReportScores | null;
  userName: string;
  responses: Record<string, string> | null;
  rawResponses: Record<string, any> | null;
  strengthAreas: string[];
  developmentAreas: string[];
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
          .limit(1);
        
        if (error) {
          throw error;
        }
        
        if (assessments && assessments.length > 0) {
          const assessment = assessments[0];
          const userData = assessment.profiles as any;
          const userName = userData?.first_name && userData?.last_name 
            ? `${userData.first_name} ${userData.last_name}` 
            : user.email || 'User';
          
          // Ensure scores has the right structure
          let validScores: ReportScores | null = null;
          let responses: Record<string, string> | null = null;
          let strengthAreas: string[] = [];
          let developmentAreas: string[] = [];
          
          if (assessment.scores) {
            // Convert from Json to the expected format
            const scoresObj = assessment.scores as Record<string, any>;
            
            // Extract values with proper type checking
            try {
              validScores = {
                aptitude: typeof scoresObj.aptitude === 'number' ? scoresObj.aptitude : 0,
                personality: typeof scoresObj.personality === 'number' ? scoresObj.personality : 0,
                interest: typeof scoresObj.interest === 'number' ? scoresObj.interest : 0,
                learningStyle: typeof scoresObj.learningStyle === 'number' ? scoresObj.learningStyle : 0,
                careerRecommendations: Array.isArray(scoresObj.careerRecommendations) 
                  ? scoresObj.careerRecommendations 
                  : [],
                analysisInsights: scoresObj.analysisInsights || {}
              };
            } catch (e) {
              console.error('Error parsing scores:', e);
              validScores = null;
            }
          }
          
          if (assessment.responses) {
            try {
              responses = assessment.responses as Record<string, string>;
              
              // Generate insights based on responses
              const aptitudeQuestions = Object.entries(responses).filter(([id]) => id.startsWith('apt_'));
              const personalityQuestions = Object.entries(responses).filter(([id]) => id.startsWith('per_'));
              const interestQuestions = Object.entries(responses).filter(([id]) => id.startsWith('int_'));
              
              // Generate strength areas based on high-scoring answers (A and B)
              if (aptitudeQuestions.filter(([, val]) => val === 'A' || val === 'B').length > 3) {
                strengthAreas.push('Analytical Thinking');
              }
              if (personalityQuestions.filter(([, val]) => val === 'A' || val === 'B').length > 3) {
                strengthAreas.push('Communication Skills');
              }
              if (interestQuestions.filter(([, val]) => val === 'A' || val === 'B').length > 3) {
                strengthAreas.push('Creativity');
              }
              if (aptitudeQuestions.filter(([, val]) => val === 'A').length > 2) {
                strengthAreas.push('Problem Solving');
              }
              if (personalityQuestions.filter(([, val]) => val === 'A').length > 2) {
                strengthAreas.push('Leadership');
              }
              
              // Generate development areas based on low-scoring answers (C and D)
              if (aptitudeQuestions.filter(([, val]) => val === 'C' || val === 'D').length > 2) {
                developmentAreas.push('Technical Skills');
              }
              if (personalityQuestions.filter(([, val]) => val === 'C' || val === 'D').length > 2) {
                developmentAreas.push('Interpersonal Skills');
              }
              if (interestQuestions.filter(([, val]) => val === 'C' || val === 'D').length > 2) {
                developmentAreas.push('Career Focus');
              }
              if (aptitudeQuestions.filter(([, val]) => val === 'D').length > 1) {
                developmentAreas.push('Critical Thinking');
              }
              
              // Ensure we have at least some default values if nothing is detected
              if (strengthAreas.length === 0) {
                strengthAreas = ['Problem Solving', 'Critical Thinking', 'Adaptability'];
              }
              
              if (developmentAreas.length === 0) {
                developmentAreas = ['Technical Skills', 'Leadership', 'Time Management'];
              }
              
            } catch (e) {
              console.error('Error parsing responses:', e);
              responses = null;
            }
          }
          
          setReportData({
            id: assessment.id,
            completedAt: assessment.completed_at || new Date().toISOString(),
            assessmentCompleted: true,
            scores: validScores,
            userName,
            responses,
            rawResponses: assessment.responses as Record<string, any> || null,
            strengthAreas,
            developmentAreas
          });
        } else {
          setReportData({
            id: 'no-assessment',
            completedAt: new Date().toISOString(),
            assessmentCompleted: false,
            scores: null,
            userName: user.email || 'User',
            responses: null,
            rawResponses: null,
            strengthAreas: [],
            developmentAreas: []
          });
        }
      } catch (error: any) {
        console.error('Error fetching assessment data:', error);
        toast.error(`Error loading report data: ${error.message}`);
        setReportData({
          id: 'error',
          completedAt: new Date().toISOString(),
          assessmentCompleted: false,
          scores: null,
          userName: user.email || 'User',
          responses: null,
          rawResponses: null,
          strengthAreas: [],
          developmentAreas: []
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
        return 'N/A';
      }
      
      return new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
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
                responses={reportData.responses}
                strengthAreas={reportData.strengthAreas}
                developmentAreas={reportData.developmentAreas}
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
                responses={reportData.responses}
                strengthAreas={reportData.strengthAreas}
                developmentAreas={reportData.developmentAreas}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ReportsPage;
