
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import CareerResultCard from '@/components/reports/CareerResultCard';
import CareerInsightsCard from '@/components/reports/CareerInsightsCard';

interface CareerMatchesTabProps {
  reportId: string;
  responses?: Record<string, string> | null;
}

// Define interface for the career recommendation structure
interface CareerRecommendation {
  careerTitle: string;
  suitabilityPercentage: number;
  careerDescription: string;
  keySkills: string[];
  educationPathways?: string[];
  workNature?: string[];
  gapAnalysis?: string[];
}

const CareerMatchesTab = ({ reportId, responses }: CareerMatchesTabProps) => {
  const { user } = useAuth();
  const [careerResults, setCareerResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [insightsData, setInsightsData] = useState<{
    strengthAreas: string[];
    developmentAreas: string[];
  }>({
    strengthAreas: [],
    developmentAreas: [],
  });

  useEffect(() => {
    const fetchCareerData = async () => {
      if (!user) return;
      
      try {
        // Fetch assessment data
        const { data, error } = await supabase
          .from('user_assessments')
          .select('scores, responses')
          .eq('id', reportId)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data && data.scores) {
          // Extract career recommendations
          let recommendations: CareerRecommendation[] = [];
          const userResponses = data.responses as Record<string, string> || {};
          
          // Generate insights based on responses
          const strengths: string[] = [];
          const developments: string[] = [];
          
          if (typeof data.scores === 'object' && data.scores !== null) {
            // Extract career recommendations from scores
            const scoresObj = data.scores as Record<string, any>;
            recommendations = Array.isArray(scoresObj.careerRecommendations) 
              ? scoresObj.careerRecommendations as CareerRecommendation[]
              : [];
              
            // Process responses to determine strength and development areas
            if (Object.keys(userResponses).length > 0) {
              // Count of A and B answers (high scores) for different categories
              let aptitudeHighCount = 0;
              let personalityHighCount = 0;
              let interestHighCount = 0;
              let learningHighCount = 0;
              
              // Process responses to generate insights
              Object.entries(userResponses).forEach(([questionId, answer]) => {
                // Simple logic to determine strengths based on question categories and answers
                if (questionId.startsWith('apt_') && (answer === 'A' || answer === 'B')) {
                  aptitudeHighCount++;
                }
                if (questionId.startsWith('per_') && (answer === 'A' || answer === 'B')) {
                  personalityHighCount++;
                }
                if (questionId.startsWith('int_') && (answer === 'A' || answer === 'B')) {
                  interestHighCount++;
                }
                if (questionId.startsWith('lrn_') && (answer === 'A' || answer === 'B')) {
                  learningHighCount++;
                }
              });
              
              // Determine strengths based on answer patterns
              if (aptitudeHighCount > 5) strengths.push('Analytical Thinking');
              if (aptitudeHighCount > 7) strengths.push('Problem Solving');
              if (personalityHighCount > 5) strengths.push('Communication Skills');
              if (personalityHighCount > 7) strengths.push('Emotional Intelligence');
              if (interestHighCount > 5) strengths.push('Creativity');
              if (learningHighCount > 5) strengths.push('Adaptability');
              
              // Determine development areas
              if (aptitudeHighCount < 4) developments.push('Analytical Reasoning');
              if (personalityHighCount < 4) developments.push('Interpersonal Skills');
              if (interestHighCount < 4) developments.push('Career Exploration');
              if (learningHighCount < 4) developments.push('Learning Methodology');
            }
          }
          
          // Ensure we have some default values if analysis is inconclusive
          if (strengths.length === 0) {
            strengths.push('Self-Motivation', 'Persistence');
          }
          
          if (developments.length === 0) {
            developments.push('Strategic Planning', 'Technical Skills');
          }
          
          // Map career recommendations to the format expected by CareerResultCard
          const mappedCareers = recommendations.slice(0, 4).map(career => ({
            id: career.careerTitle.toLowerCase().replace(/\s+/g, '-'),
            title: career.careerTitle,
            matchPercentage: career.suitabilityPercentage,
            description: career.careerDescription,
            skills: career.keySkills,
            educationPathways: career.educationPathways || [],
            workNature: career.workNature || []
          }));
          
          setCareerResults(mappedCareers);
          setInsightsData({
            strengthAreas: strengths,
            developmentAreas: developments
          });
        } else {
          // Use fallback data if no career recommendations found
          setCareerResults([]);
        }
      } catch (error: any) {
        console.error('Error fetching career data:', error);
        toast.error(`Failed to load career data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCareerData();
  }, [user, reportId, responses]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-40">Loading career data...</div>;
  }

  if (careerResults.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No career recommendations found</h3>
        <p className="text-muted-foreground mt-2">
          Please complete the career assessment to see personalized recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-6 lg:grid-cols-8">
      <div className="md:col-span-6 lg:col-span-5 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {careerResults.map((career, index) => (
            <CareerResultCard
              key={career.id}
              title={career.title}
              matchPercentage={career.matchPercentage}
              description={career.description}
              skills={career.skills}
              isPrimary={index === 0}
              reportId={reportId}
              educationPathways={career.educationPathways}
              workNature={career.workNature}
            />
          ))}
        </div>
      </div>
      <div className="md:col-span-2 lg:col-span-3">
        <CareerInsightsCard 
          strengthAreas={insightsData.strengthAreas}
          developmentAreas={insightsData.developmentAreas}
        />
      </div>
    </div>
  );
};

export default CareerMatchesTab;
