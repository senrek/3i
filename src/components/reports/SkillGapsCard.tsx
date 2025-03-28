
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';

interface SkillGapsCardProps {
  gapAreas?: string[];
  strengths?: string[];
}

const SkillGapsCard = ({ 
  gapAreas = ['Communication', 'Leadership', 'Technical Skills'],
  strengths = ['Critical Thinking', 'Problem Solving', 'Adaptability']
}: SkillGapsCardProps) => {
  return (
    <Card className="border border-border/50 rounded-2xl overflow-hidden h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">Skills Assessment</CardTitle>
        </div>
        <CardDescription>
          Your current skill profile with areas for development
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 space-y-6">
        {/* Strengths */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <h3 className="font-medium">Key Strengths</h3>
          </div>
          
          <div className="space-y-2">
            {strengths.map((strength, index) => (
              <div key={index} className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-100 dark:border-green-900/50">
                <p className="font-medium text-sm">{strength}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {getStrengthDescription(strength)}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Development Areas */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h3 className="font-medium">Development Areas</h3>
          </div>
          
          <div className="space-y-2">
            {gapAreas.map((gap, index) => (
              <div key={index} className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-100 dark:border-amber-900/50">
                <p className="font-medium text-sm">{gap}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {getGapDescription(gap)}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t border-border/50 pt-4">
          <p className="text-xs text-muted-foreground">
            This analysis is based on your assessment responses and provides a comprehensive
            view of your current skill profile and areas where targeted development can
            enhance your career prospects.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper functions to provide meaningful descriptions
const getStrengthDescription = (strength: string): string => {
  const descriptions: Record<string, string> = {
    'Critical Thinking': 'You excel at analyzing information objectively and making reasoned judgments.',
    'Problem Solving': 'You demonstrate strong abilities in finding effective solutions to complex challenges.',
    'Adaptability': 'You show excellent capacity to adjust to new conditions and environments.',
    'Team Collaboration': 'You work effectively with others to achieve shared goals and outcomes.',
    'Leadership Potential': 'You exhibit capabilities in guiding and influencing others positively.',
    'Career Interest Clarity': 'You have a well-defined understanding of your career interests and goals.',
    'Self-Direction': 'You take initiative and responsibility for your own learning and development.',
    'Continuous Learning': 'You actively seek opportunities to expand your knowledge and skills.',
  };
  
  return descriptions[strength] || 'You demonstrate notable proficiency in this area based on your assessment.';
};

const getGapDescription = (gap: string): string => {
  const descriptions: Record<string, string> = {
    'Communication': 'Developing clearer expression and active listening skills would enhance your effectiveness.',
    'Leadership': 'Building skills in guiding teams and taking initiative would benefit your career progression.',
    'Technical Skills': 'Strengthening specific technical competencies would expand your career opportunities.',
    'Data Analysis': 'Enhancing your ability to interpret and draw conclusions from data would be valuable.',
    'Technical Certifications': 'Pursuing relevant certifications would validate your skills for employers.',
    'Leadership Skills': 'Developing your ability to inspire and guide others would open management pathways.',
    'Technical Proficiency': 'Building stronger technical foundations would expand your career opportunities.',
    'Analytical Thinking': 'Developing more structured approaches to problem analysis would be beneficial.',
    'Career Focus': 'Narrowing your career interests would help direct your professional development efforts.',
    'Self-Motivation': 'Building stronger internal drive would help you pursue goals more effectively.',
    'Interpersonal Abilities': 'Developing skills for effective interaction with diverse individuals is recommended.',
  };
  
  return descriptions[gap] || 'This area presents an opportunity for targeted development to enhance your career prospects.';
};

export default SkillGapsCard;
