
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { analyzePersonality, generateCareerRecommendations } from '@/utils/responseAnalysis';
import CareerResultCard from './CareerResultCard';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface CareerMatchesTabProps {
  reportId: string;
  responses: Record<string, string> | null;
}

const CareerMatchesTab: React.FC<CareerMatchesTabProps> = ({ reportId, responses }) => {
  // Default recommendations in case responses are not available
  const defaultRecommendations = [
    {
      title: "Software Engineer",
      match: 85,
      description: "Design, develop, and maintain software systems and applications.",
      keySkills: ["Programming", "Problem-solving", "Logical thinking", "Software design"],
      educationPathways: ["Bachelor's in Computer Science or related field", "Coding bootcamps"],
      workEnvironment: "Collaborative team settings with flexible work arrangements.",
      growthOpportunities: "Career progression to senior developer, technical lead, or engineering manager."
    },
    {
      title: "Data Scientist",
      match: 78,
      description: "Analyze complex datasets to identify patterns and provide insights.",
      keySkills: ["Statistical analysis", "Machine learning", "Programming", "Data visualization"],
      educationPathways: ["Bachelor's or Master's in Statistics, Mathematics, or Computer Science"],
      workEnvironment: "Collaborative work with cross-functional teams, often with remote options.",
      growthOpportunities: "Advancement to senior data scientist or AI specialist."
    },
    {
      title: "UX/UI Designer",
      match: 72,
      description: "Create intuitive and engaging digital experiences for users.",
      keySkills: ["User research", "Visual design", "Wireframing", "Prototyping"],
      educationPathways: ["Bachelor's in Design or HCI", "UX/UI design bootcamps"],
      workEnvironment: "Creative studios, tech companies, or design agencies.",
      growthOpportunities: "Progression to senior designer, UX lead, or creative director."
    }
  ];

  // Generate recommendations based on responses if available
  let careerRecommendations = defaultRecommendations;
  
  if (responses && Object.keys(responses).length > 0) {
    try {
      const personalityInsights = analyzePersonality(responses);
      careerRecommendations = generateCareerRecommendations(responses, personalityInsights);
      
      // Fallback to default if no recommendations generated
      if (!careerRecommendations || careerRecommendations.length === 0) {
        careerRecommendations = defaultRecommendations;
      }
    } catch (error) {
      console.error("Error generating career recommendations:", error);
    }
  }

  // Career match data for radar chart
  const matchData = [
    { subject: 'Technical', A: 75, fullMark: 100 },
    { subject: 'Creative', A: 60, fullMark: 100 },
    { subject: 'Analytical', A: 85, fullMark: 100 },
    { subject: 'Leadership', A: 70, fullMark: 100 },
    { subject: 'Communication', A: 80, fullMark: 100 },
    { subject: 'Business', A: 65, fullMark: 100 },
  ];

  return (
    <div className="space-y-8">
      <Card className="border border-border/50 rounded-lg shadow-sm">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-xl">Career Match Profile</CardTitle>
          <CardDescription>
            An overview of how your skills and interests align with different career areas
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={matchData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <Radar name="Your Profile" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h3 className="text-lg font-medium">Recommended Career Paths</h3>
        <p className="text-muted-foreground mb-4">
          Based on your assessment results, these career paths may be a good fit for your skills, 
          interests, and personality.
        </p>
        
        {careerRecommendations.map((career, index) => (
          <CareerResultCard 
            key={index}
            career={career}
            index={index}
            reportId={reportId}
          />
        ))}
      </div>
    </div>
  );
};

export default CareerMatchesTab;
