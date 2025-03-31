
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import CareerResultCard from '@/components/reports/CareerResultCard';
import CareerInsightsCard from '@/components/reports/CareerInsightsCard';

interface CareerMatchesTabProps {
  reportId: string;
  responses?: Record<string, string> | null;
  strengthAreas?: string[];
  developmentAreas?: string[];
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

const CareerMatchesTab = ({ 
  reportId, 
  responses,
  strengthAreas = ['Problem Solving', 'Critical Thinking', 'Adaptability'],
  developmentAreas = ['Technical Skills', 'Leadership', 'Time Management']
}: CareerMatchesTabProps) => {
  const { user } = useAuth();
  const [careerResults, setCareerResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [careerAreas, setCareerAreas] = useState<string[]>([]);

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
          let careerAreaRecommendations: string[] = [];
          
          if (typeof data.scores === 'object' && data.scores !== null) {
            // Extract career recommendations from scores
            const scoresObj = data.scores as Record<string, any>;
            recommendations = Array.isArray(scoresObj.careerRecommendations) 
              ? scoresObj.careerRecommendations as CareerRecommendation[]
              : [];
              
            // Extract career area recommendations if available
            if (scoresObj.analysisInsights && scoresObj.analysisInsights.careerAreaRecommendations) {
              careerAreaRecommendations = scoresObj.analysisInsights.careerAreaRecommendations;
            } else {
              // Fallback career areas based on top careers
              careerAreaRecommendations = recommendations.slice(0, 3).map(career => {
                if (career.careerTitle.includes("Engineer") || career.careerTitle.includes("Data")) 
                  return "Technology & Engineering";
                else if (career.careerTitle.includes("Design")) 
                  return "Design & Creative Arts";
                else if (career.careerTitle.includes("Doctor") || career.careerTitle.includes("Psychologist"))
                  return "Healthcare & Medicine";
                else if (career.careerTitle.includes("Analyst") || career.careerTitle.includes("Financial"))
                  return "Business & Finance";
                else
                  return "Professional Services";
              });
            }
          }
          
          // Map career recommendations to the format expected by CareerResultCard
          const mappedCareers = recommendations.slice(0, 4).map(career => ({
            id: career.careerTitle.toLowerCase().replace(/\s+/g, '-'),
            title: career.careerTitle,
            matchPercentage: career.suitabilityPercentage,
            description: career.careerDescription,
            skills: career.keySkills,
            educationPathways: career.educationPathways || [],
            workNature: career.workNature || [],
            gapAnalysis: career.gapAnalysis || []
          }));
          
          setCareerResults(mappedCareers);
          setCareerAreas([...new Set(careerAreaRecommendations)]);
        } else {
          // Use fallback data if no career recommendations found
          setCareerResults([]);
          setCareerAreas(["Technology", "Business", "Creative Arts"]);
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
    <div className="space-y-6">
      {/* Career Areas Section */}
      <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
        <h3 className="text-lg font-medium mb-3">Recommended Career Fields</h3>
        <div className="flex flex-wrap gap-2">
          {careerAreas.map((area, index) => (
            <div key={index} className="px-3 py-1.5 bg-primary/10 text-primary-foreground rounded-full text-sm">
              {area}
            </div>
          ))}
        </div>
      </div>
      
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
            strengthAreas={strengthAreas}
            developmentAreas={developmentAreas}
          />
        </div>
      </div>
    </div>
  );
};

export default CareerMatchesTab;
