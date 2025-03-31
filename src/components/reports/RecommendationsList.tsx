
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { List, ListItem } from '@/components/ui/list';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RecommendationsListProps {
  responses: Record<string, string> | null;
  strengthAreas: string[];
  developmentAreas: string[];
}

const RecommendationsList: React.FC<RecommendationsListProps> = ({ 
  responses, 
  strengthAreas, 
  developmentAreas 
}) => {
  // Generate development recommendations based on development areas
  const developmentRecommendations = developmentAreas.map(area => {
    switch (area) {
      case 'Technical Skills':
        return 'Take online courses to improve your technical abilities';
      case 'Leadership':
        return 'Volunteer for leadership roles in group projects';
      case 'Critical Thinking':
        return 'Practice analyzing complex problems and consider multiple solutions';
      case 'Career Focus':
        return 'Research specific careers that match your interests';
      case 'Interpersonal Skills':
        return 'Join clubs or activities that require teamwork';
      case 'Time Management':
        return 'Use planning tools to organize your tasks and priorities';
      default:
        return `Focus on developing your ${area} through practice and learning`;
    }
  });

  // Generate strength-based recommendations
  const strengthRecommendations = strengthAreas.map(strength => {
    switch (strength) {
      case 'Problem Solving':
        return 'Pursue challenges that showcase your problem-solving abilities';
      case 'Critical Thinking':
        return 'Seek opportunities where analytical skills are valued';
      case 'Creativity':
        return 'Explore careers that allow creative expression';
      case 'Communication Skills':
        return 'Consider roles that involve presenting or explaining information';
      case 'Leadership':
        return 'Look for positions with leadership progression paths';
      case 'Adaptability':
        return 'Environments with variety and change would suit your flexible nature';
      default:
        return `Leverage your ${strength} in your academic and career choices`;
    }
  });

  return (
    <div className="space-y-8">
      <Card className="border border-border/50 rounded-lg shadow-sm">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-xl">Strengths to Leverage</CardTitle>
          <CardDescription>
            Areas where you show significant capabilities
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {strengthAreas.map((strength, index) => (
              <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {strength}
              </Badge>
            ))}
          </div>
          <ScrollArea className="h-[200px] rounded-md border p-4">
            <List>
              {strengthRecommendations.map((recommendation, index) => (
                <ListItem key={index} className="py-2">
                  {recommendation}
                </ListItem>
              ))}
            </List>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="border border-border/50 rounded-lg shadow-sm">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-xl">Development Areas</CardTitle>
          <CardDescription>
            Areas with potential for growth and improvement
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {developmentAreas.map((area, index) => (
              <Badge key={index} variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                {area}
              </Badge>
            ))}
          </div>
          <ScrollArea className="h-[200px] rounded-md border p-4">
            <List>
              {developmentRecommendations.map((recommendation, index) => (
                <ListItem key={index} className="py-2">
                  {recommendation}
                </ListItem>
              ))}
            </List>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="border border-border/50 rounded-lg shadow-sm">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-xl">Next Steps</CardTitle>
          <CardDescription>
            Recommended actions to advance your career development
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <List>
            <ListItem className="py-2">
              Research educational pathways that align with your identified strengths and interests
            </ListItem>
            <ListItem className="py-2">
              Schedule an appointment with a career counselor to discuss your assessment results
            </ListItem>
            <ListItem className="py-2">
              Explore extracurricular activities or courses to develop your identified growth areas
            </ListItem>
            <ListItem className="py-2">
              Create a personal development plan with specific goals and timelines
            </ListItem>
            <ListItem className="py-2">
              Connect with professionals in your fields of interest through networking events or informational interviews
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendationsList;
