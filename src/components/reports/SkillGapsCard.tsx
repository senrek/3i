
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
    'Critical Thinking': 'You excel at analyzing information objectively and making reasoned judgments. This allows you to evaluate situations from multiple perspectives and reach sound conclusions.',
    'Problem Solving': 'You demonstrate strong abilities in finding effective solutions to complex challenges. Your analytical approach helps you break down problems and identify practical solutions.',
    'Adaptability': 'You show excellent capacity to adjust to new conditions and environments. This flexibility allows you to thrive in changing circumstances and embrace new challenges.',
    'Team Collaboration': 'You work effectively with others to achieve shared goals and outcomes. Your cooperative nature and communication skills make you a valuable team member.',
    'Leadership Potential': 'You exhibit capabilities in guiding and influencing others positively. Your ability to motivate and direct teams helps achieve collective objectives efficiently.',
    'Career Interest Clarity': 'You have a well-defined understanding of your career interests and goals. This clarity helps you make focused decisions about your educational and professional path.',
    'Self-Direction': 'You take initiative and responsibility for your own learning and development. This independence allows you to pursue goals without requiring constant supervision.',
    'Continuous Learning': 'You actively seek opportunities to expand your knowledge and skills. This commitment to growth keeps your capabilities relevant and advancing in your field.',
    'Analytical Thinking': 'You excel at breaking down complex information into logical components. This skill helps you understand patterns and relationships that others might miss.',
    'Communication Skills': 'You effectively express ideas and listen to others. Your ability to convey thoughts clearly and understand different perspectives enhances collaboration.',
    'Creativity': 'You demonstrate original thinking and innovative approaches to tasks. This imaginative capacity allows you to develop unique solutions and perspectives.',
  };
  
  return descriptions[strength] || 'You demonstrate notable proficiency in this area based on your assessment responses. This strength will be valuable across various career paths and educational journeys.';
};

const getGapDescription = (gap: string): string => {
  const descriptions: Record<string, string> = {
    'Communication': 'Developing clearer expression and active listening skills would enhance your effectiveness. Focus on structured communication practice and seeking feedback from others.',
    'Leadership': 'Building skills in guiding teams and taking initiative would benefit your career progression. Consider seeking opportunities to lead small projects or group activities.',
    'Technical Skills': 'Strengthening specific technical competencies would expand your career opportunities. Identify key technologies in your field of interest and pursue targeted learning.',
    'Data Analysis': 'Enhancing your ability to interpret and draw conclusions from data would be valuable. Consider courses in statistics, data visualization, or analytical software tools.',
    'Technical Certifications': 'Pursuing relevant certifications would validate your skills for employers. Research industry-recognized credentials that align with your career interests.',
    'Leadership Skills': 'Developing your ability to inspire and guide others would open management pathways. Seek opportunities to lead projects and practice decision-making in groups.',
    'Technical Proficiency': 'Building stronger technical foundations would expand your career opportunities. Focus on learning fundamental concepts and practicing applied skills regularly.',
    'Analytical Thinking': 'Developing more structured approaches to problem analysis would be beneficial. Practice breaking down complex problems into manageable components.',
    'Career Focus': 'Narrowing your career interests would help direct your professional development efforts. Explore specific roles through research and informational interviews.',
    'Self-Motivation': 'Building stronger internal drive would help you pursue goals more effectively. Set clear objectives and develop accountability systems for your progress.',
    'Interpersonal Abilities': 'Developing skills for effective interaction with diverse individuals is recommended. Practice active listening and empathetic communication regularly.',
    'Critical Thinking': 'Strengthening your ability to evaluate information objectively would enhance your decision-making. Practice questioning assumptions and considering alternative perspectives.',
  };
  
  return descriptions[gap] || 'This area presents an opportunity for targeted development to enhance your career prospects. Consider seeking specific training, mentorship, or practical experience to strengthen these skills.';
};

export default SkillGapsCard;
