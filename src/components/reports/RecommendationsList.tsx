
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { List, ListItem } from '@/components/ui/list';

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
  // Personalized recommendations based on assessment responses and areas
  const getPersonalizedRecommendations = () => {
    const recommendations: string[] = [];
    
    // Add recommendations based on strength areas
    if (strengthAreas.includes('Analytical Thinking')) {
      recommendations.push('Consider roles that require problem-solving and data analysis');
    }
    
    if (strengthAreas.includes('Communication Skills')) {
      recommendations.push('Look for opportunities that involve presenting information or working in teams');
    }
    
    if (strengthAreas.includes('Creativity')) {
      recommendations.push('Explore careers that reward innovative thinking and creative solutions');
    }
    
    if (strengthAreas.includes('Leadership')) {
      recommendations.push('Seek leadership roles in group projects or extracurricular activities');
    }
    
    if (strengthAreas.includes('Problem Solving')) {
      recommendations.push('Consider STEM fields or careers with complex challenges to solve');
    }
    
    // Add recommendations based on development areas
    if (developmentAreas.includes('Technical Skills')) {
      recommendations.push('Take online courses to strengthen technical abilities in your field of interest');
    }
    
    if (developmentAreas.includes('Interpersonal Skills')) {
      recommendations.push('Practice active listening and join activities that promote teamwork');
    }
    
    if (developmentAreas.includes('Career Focus')) {
      recommendations.push('Research industries thoroughly and arrange informational interviews with professionals');
    }
    
    if (developmentAreas.includes('Critical Thinking')) {
      recommendations.push('Engage in brain teasers, debates, and critical analysis of current events');
    }
    
    if (developmentAreas.includes('Time Management')) {
      recommendations.push('Use productivity tools and practice prioritizing tasks');
    }
    
    if (developmentAreas.includes('Leadership')) {
      recommendations.push('Volunteer for leadership positions in school or community projects');
    }
    
    // Add general recommendations if needed
    if (recommendations.length < 3) {
      recommendations.push(
        'Create a personal development plan with specific goals and timelines',
        'Build a network of mentors and peers in your areas of interest',
        'Keep a portfolio of your projects and achievements'
      );
    }
    
    return recommendations;
  };
  
  const personalizedRecommendations = getPersonalizedRecommendations();
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Your Strengths</CardTitle>
        </CardHeader>
        <CardContent>
          <List>
            {strengthAreas.map((strength, index) => (
              <ListItem key={index} className="py-2">
                <span className="font-medium text-primary">• {strength}</span>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Areas for Development</CardTitle>
        </CardHeader>
        <CardContent>
          <List>
            {developmentAreas.map((area, index) => (
              <ListItem key={index} className="py-2">
                <span className="font-medium text-amber-600">• {area}</span>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Personalized Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <List>
            {personalizedRecommendations.map((recommendation, index) => (
              <ListItem key={index} className="py-2">
                <span className="text-gray-700">• {recommendation}</span>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendationsList;
