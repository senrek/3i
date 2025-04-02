
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SkillRadarChart from './SkillRadarChart';
import RecommendationsList from './RecommendationsList';
import AssessmentHistoryList from './AssessmentHistoryList';
import CareerMatchesTab from './CareerMatchesTab';

interface ReportTabsProps {
  reportId: string;
  skillData: Array<{
    name: string;
    value: number;
    fullMark: number;
  }>;
  responses: Record<string, string> | null;
  strengthAreas: string[];
  developmentAreas: string[];
}

const ReportTabs: React.FC<ReportTabsProps> = ({ 
  reportId, 
  skillData, 
  responses, 
  strengthAreas, 
  developmentAreas 
}) => {
  return (
    <Tabs defaultValue="career-matches" className="w-full">
      <TabsList className="grid grid-cols-4 mb-8">
        <TabsTrigger value="career-matches">Career Matches</TabsTrigger>
        <TabsTrigger value="skill-analysis">Skill Analysis</TabsTrigger>
        <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      
      <TabsContent value="career-matches" className="space-y-8">
        <p className="text-muted-foreground">
          Explore career paths that align with your unique skills and interests.
        </p>
        <CareerMatchesTab 
          reportId={reportId} 
          responses={responses} 
        />
      </TabsContent>
      
      <TabsContent value="skill-analysis" className="space-y-8">
        <p className="text-muted-foreground">
          Understand your strengths and areas for development based on your assessment results.
        </p>
        
        <SkillRadarChart 
          data={skillData}
          title="Skill Analysis"
          description="Your skills compared to career requirements"
        />
      </TabsContent>
      
      <TabsContent value="recommendations" className="space-y-8">
        <p className="text-muted-foreground">
          Personalized recommendations to help you achieve your career goals.
        </p>
        
        <RecommendationsList
          responses={responses}
          strengthAreas={strengthAreas}
          developmentAreas={developmentAreas}
        />
      </TabsContent>
      
      <TabsContent value="history" className="space-y-8">
        <AssessmentHistoryList />
      </TabsContent>
    </Tabs>
  );
};

export default ReportTabs;
