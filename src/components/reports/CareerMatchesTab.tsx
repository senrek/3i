
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import CareerResultCard from '@/components/reports/CareerResultCard';
import CareerInsightsCard from '@/components/reports/CareerInsightsCard';

interface CareerMatchesTabProps {
  reportId: string;
}

const CareerMatchesTab = ({ reportId }: CareerMatchesTabProps) => {
  const { user } = useAuth();
  const [careerResults, setCareerResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCareerData = async () => {
      if (!user) return;
      
      try {
        // Fetch assessment data
        const { data, error } = await supabase
          .from('user_assessments')
          .select('scores')
          .eq('id', reportId)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data && data.scores && data.scores.careerRecommendations) {
          // Map career recommendations to the format expected by CareerResultCard
          const mappedCareers = data.scores.careerRecommendations.slice(0, 4).map(career => ({
            id: career.careerTitle.toLowerCase().replace(/\s+/g, '-'),
            title: career.careerTitle,
            matchPercentage: career.suitabilityPercentage,
            description: career.careerDescription,
            skills: career.keySkills
          }));
          
          setCareerResults(mappedCareers);
        } else {
          // Use fallback data if no career recommendations found
          setCareerResults([]);
        }
      } catch (error) {
        console.error('Error fetching career data:', error);
        toast.error('Error fetching career data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCareerData();
  }, [user, reportId]);

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
            />
          ))}
        </div>
      </div>
      <div className="md:col-span-2 lg:col-span-3">
        <CareerInsightsCard />
      </div>
    </div>
  );
};

export default CareerMatchesTab;
