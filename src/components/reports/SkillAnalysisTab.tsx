
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SkillRadarChart from '@/components/reports/SkillRadarChart';
import SkillGapsCard from '@/components/reports/SkillGapsCard';

interface SkillData {
  name: string;
  value: number;
  fullMark: number;
}

interface SkillAnalysisTabProps {
  skillData: SkillData[];
  responses?: Record<string, string> | null;
  strengthAreas?: string[];
  developmentAreas?: string[];
}

const SkillAnalysisTab = ({ 
  skillData, 
  responses,
  strengthAreas = [], 
  developmentAreas = [] 
}: SkillAnalysisTabProps) => {
  // Use provided strengths and development areas if available
  let gapAreas = developmentAreas;
  let strengths = strengthAreas;
  
  // If not provided, analyze responses
  if ((gapAreas.length === 0 || strengths.length === 0) && responses) {
    const aptitudeQuestions = Object.keys(responses).filter(q => q.startsWith('apt_'));
    const personalityQuestions = Object.keys(responses).filter(q => q.startsWith('per_'));
    const interestQuestions = Object.keys(responses).filter(q => q.startsWith('int_'));
    
    // Count A and B answers for each category
    const aptitudeABCount = aptitudeQuestions.filter(q => ['A', 'B'].includes(responses[q])).length;
    const personalityABCount = personalityQuestions.filter(q => ['A', 'B'].includes(responses[q])).length;
    const interestABCount = interestQuestions.filter(q => ['A', 'B'].includes(responses[q])).length;
    
    // Determine gaps based on low AB counts
    if (gapAreas.length === 0) {
      gapAreas = [];
      if (aptitudeABCount < (aptitudeQuestions.length * 0.5)) {
        gapAreas.push('Technical Proficiency', 'Analytical Thinking');
      }
      
      if (personalityABCount < (personalityQuestions.length * 0.5)) {
        gapAreas.push('Communication Skills', 'Interpersonal Abilities');
      }
      
      if (interestABCount < (interestQuestions.length * 0.5)) {
        gapAreas.push('Career Focus', 'Self-Motivation');
      }
      
      // Ensure we have at least some gap areas
      if (gapAreas.length === 0) {
        gapAreas = ['Data Analysis', 'Technical Certifications', 'Leadership Skills'];
      }
      
      // Limit to at most 5 gap areas
      gapAreas = gapAreas.slice(0, 5);
    }
    
    // Determine strengths based on high AB counts
    if (strengths.length === 0) {
      strengths = [];
      if (aptitudeABCount > (aptitudeQuestions.length * 0.7)) {
        strengths.push('Problem Solving', 'Critical Thinking');
      }
      
      if (personalityABCount > (personalityQuestions.length * 0.7)) {
        strengths.push('Team Collaboration', 'Leadership Potential');
      }
      
      if (interestABCount > (interestQuestions.length * 0.7)) {
        strengths.push('Career Interest Clarity', 'Self-Direction');
      }
      
      // Ensure we have at least some strengths
      if (strengths.length === 0) {
        strengths = ['Adaptability', 'Continuous Learning', 'Problem Solving'];
      }
      
      // Limit to at most 5 strengths
      strengths = strengths.slice(0, 5);
    }
  }
  
  return (
    <div className="grid gap-6 md:grid-cols-5">
      <div className="md:col-span-3 space-y-6">
        <Card className="border border-border/50 rounded-2xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Skill Composition Analysis</CardTitle>
            <CardDescription>
              A comprehensive view of your current skill distribution
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[400px]">
              <SkillRadarChart data={skillData} />
            </div>
            
            <div className="mt-6 text-sm text-muted-foreground">
              <p>
                This radar chart illustrates your skill distribution across key career competency areas.
                The further a point extends from the center, the stronger that particular skill area.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-2 space-y-6">
        <SkillGapsCard 
          gapAreas={gapAreas}
          strengths={strengths}
        />
      </div>
    </div>
  );
};

export default SkillAnalysisTab;
