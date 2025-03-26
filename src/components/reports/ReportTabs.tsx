
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CareerMatchesTab from '@/components/reports/CareerMatchesTab';
import SkillAnalysisTab from '@/components/reports/SkillAnalysisTab';

interface ReportTabsProps {
  reportId: string;
  skillData: Array<{
    name: string;
    value: number;
    fullMark: number;
  }>;
}

const ReportTabs = ({ reportId, skillData }: ReportTabsProps) => {
  return (
    <Tabs defaultValue="careers" className="space-y-6">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="careers">Career Matches</TabsTrigger>
        <TabsTrigger value="skills">Skill Analysis</TabsTrigger>
      </TabsList>
      
      <TabsContent value="careers" className="mt-0 space-y-6">
        <CareerMatchesTab reportId={reportId} />
      </TabsContent>
      
      <TabsContent value="skills" className="mt-0 space-y-6">
        <SkillAnalysisTab skillData={skillData} />
      </TabsContent>
    </Tabs>
  );
};

export default ReportTabs;
