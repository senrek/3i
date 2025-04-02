import React, { useState, useEffect } from 'react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import ReportHeader from '@/components/reports/ReportHeader';
import LoadingPlaceholder from '@/components/reports/LoadingPlaceholder';
import ReportSummaryCard from '@/components/reports/ReportSummaryCard';
import ReportPDFGenerator, { generatePDF } from '@/components/reports/ReportPDFGenerator';
import ReportTabs from '@/components/reports/ReportTabs';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportData = async () => {
      if (!user) return;
      
      try {
        setError(null);
        console.log("Fetching report data for user:", user.id);
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name, email')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          console.warn("Could not fetch profile data:", profileError);
          // Continue with default name handling
        }
        
        const { data: assessments, error: assessmentError } = await supabase
          .from('user_assessments')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false })
          .limit(1);
        
        if (assessmentError) {
          console.error("Error fetching assessments:", assessmentError);
          throw new Error(`Error fetching assessments: ${assessmentError.message}`);
        }
        
        console.log("Fetched assessments:", assessments);
        
        if (assessments && assessments.length > 0) {
          const assessment = assessments[0];
          console.log("Working with assessment:", assessment);
          
          let validScores: ReportScores | null = null;
          let responses: Record<string, string> | null = null;
          let strengthAreas: string[] = [];
          let developmentAreas: string[] = [];
          
          if (assessment.scores) {
            const scoresObj = assessment.scores as Record<string, any>;
            console.log("Raw scores:", scoresObj);
            
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
              console.log("Parsed valid scores:", validScores);
            } catch (e) {
              console.error('Error parsing scores:', e);
              validScores = null;
            }
          }
          
          if (assessment.responses) {
            try {
              responses = assessment.responses as Record<string, string>;
              console.log("Responses sample:", Object.keys(responses).slice(0, 3));
              
              const aptitudeQuestions = Object.entries(responses).filter(([id]) => id.startsWith('apt_'));
              const personalityQuestions = Object.entries(responses).filter(([id]) => id.startsWith('per_'));
              const interestQuestions = Object.entries(responses).filter(([id]) => id.startsWith('int_'));
              
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
              
              if (strengthAreas.length === 0) {
                strengthAreas = ['Problem Solving', 'Critical Thinking', 'Adaptability'];
              }
              
              if (developmentAreas.length === 0) {
                developmentAreas = ['Technical Skills', 'Leadership', 'Time Management'];
              }
              
              console.log("Generated strengths:", strengthAreas);
              console.log("Generated development areas:", developmentAreas);
              
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
          console.log("Report data set successfully");
        } else {
          console.log("No assessments found for user");
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
        const errorMessage = `Error loading report data: ${error.message}`;
        setError(errorMessage);
        toast.error(errorMessage);
        
        setReportData({
          id: 'error',
          completedAt: new Date().toISOString(),
          assessmentCompleted: false,
          scores: null,
          userName: user?.email || 'User',
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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
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
      ) : error ? (
        <div className="text-center py-12 space-y-4">
          <h3 className="text-lg font-medium text-red-600">Error loading report data</h3>
          <p className="text-muted-foreground">{error}</p>
          <Button asChild>
            <Link to="/assessments">Go to Assessments</Link>
          </Button>
        </div>
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

          {!reportData?.assessmentCompleted && (
            <div className="text-center py-12 space-y-6">
              <h3 className="text-xl font-medium">No assessment results found</h3>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Complete the Career Analysis Assessment to receive personalized career recommendations,
                skill analysis, and a comprehensive PDF report for your career planning.
              </p>
              <Button asChild size="lg" className="mt-4">
                <Link to="/assessments/career-analysis">Take Assessment Now</Link>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReportsPage;
