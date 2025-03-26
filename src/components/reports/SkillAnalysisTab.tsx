
import React from 'react';
import SkillRadarChart from '@/components/reports/SkillRadarChart';
import SkillGapsCard from '@/components/reports/SkillGapsCard';

interface SkillAnalysisTabProps {
  skillData: Array<{
    name: string;
    value: number;
    fullMark: number;
  }>;
}

const SkillAnalysisTab = ({ skillData }: SkillAnalysisTabProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <SkillRadarChart 
          skills={skillData} 
          title="Your Skill Profile"
          description="Visual representation of your strengths and areas for development"
        />
      </div>
      <div>
        <SkillGapsCard />
      </div>
    </div>
  );
};

export default SkillAnalysisTab;
