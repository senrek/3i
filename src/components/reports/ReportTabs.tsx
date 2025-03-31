
// We need to update this component to pass strengthAreas and developmentAreas to SkillAnalysisTab
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CareerMatchesTab from './CareerMatchesTab';
import SkillAnalysisTab from './SkillAnalysisTab';
import CareerInsightsCard from './CareerInsightsCard';

interface SkillData {
  name: string;
  value: number;
  fullMark: number;
}

interface ReportTabsProps {
  reportId: string;
  skillData: SkillData[];
  responses?: Record<string, string> | null;
  strengthAreas?: string[];
  developmentAreas?: string[];
}

const ReportTabs = ({ 
  reportId, 
  skillData,
  responses,
  strengthAreas = [],
  developmentAreas = []
}: ReportTabsProps) => {
  return (
    <div className="space-y-8">
      {/* Career insights card for strengths and development areas */}
      <CareerInsightsCard 
        strengthAreas={strengthAreas}
        developmentAreas={developmentAreas}
      />
      
      <Tabs defaultValue="careers" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="careers">Career Matches</TabsTrigger>
          <TabsTrigger value="skills">Skill Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="careers" className="mt-6">
          <CareerMatchesTab reportId={reportId} />
        </TabsContent>
        
        <TabsContent value="skills" className="mt-6">
          <SkillAnalysisTab 
            skillData={skillData} 
            responses={responses}
            strengthAreas={strengthAreas}
            developmentAreas={developmentAreas}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportTabs;
