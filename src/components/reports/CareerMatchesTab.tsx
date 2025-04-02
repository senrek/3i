
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { analyzePersonality, generateCareerRecommendations } from '@/utils/responseAnalysis';
import CareerResultCard from './CareerResultCard';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { FileDown, ChartBar } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CareerMatchesTabProps {
  reportId: string;
  responses: Record<string, string> | null;
}

const CareerMatchesTab: React.FC<CareerMatchesTabProps> = ({ reportId, responses }) => {
  const [isGeneratingAiContent, setIsGeneratingAiContent] = useState(false);
  const [aiGeneratedInsights, setAiGeneratedInsights] = useState<string | null>(null);
  
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

  // Generate personalized skill match data for radar chart based on responses
  const generateSkillMatchData = () => {
    if (!responses || Object.keys(responses).length === 0) {
      // Default data if no responses
      return [
        { subject: 'Technical', A: 75, fullMark: 100 },
        { subject: 'Creative', A: 60, fullMark: 100 },
        { subject: 'Analytical', A: 85, fullMark: 100 },
        { subject: 'Leadership', A: 70, fullMark: 100 },
        { subject: 'Communication', A: 80, fullMark: 100 },
        { subject: 'Business', A: 65, fullMark: 100 },
      ];
    }

    // Analyze technical aptitude
    const technicalScore = analyzeAptitudeArea('technical', responses);
    
    // Analyze creative aptitude
    const creativeScore = analyzeAptitudeArea('creative', responses);
    
    // Analyze analytical aptitude
    const analyticalScore = analyzeAptitudeArea('analytical', responses);
    
    // Analyze leadership aptitude
    const leadershipScore = analyzeAptitudeArea('leadership', responses);
    
    // Analyze communication aptitude
    const communicationScore = analyzeAptitudeArea('social', responses);
    
    // Analyze business aptitude
    const businessScore = analyzeAptitudeArea('business', responses);

    return [
      { subject: 'Technical', A: technicalScore, fullMark: 100 },
      { subject: 'Creative', A: creativeScore, fullMark: 100 },
      { subject: 'Analytical', A: analyticalScore, fullMark: 100 },
      { subject: 'Leadership', A: leadershipScore, fullMark: 100 },
      { subject: 'Communication', A: communicationScore, fullMark: 100 },
      { subject: 'Business', A: businessScore, fullMark: 100 },
    ];
  };

  // Helper function to analyze aptitude in specific areas (simplified version)
  const analyzeAptitudeArea = (area: string, responses: Record<string, string>): number => {
    const areaQuestions: Record<string, string[]> = {
      technical: ['apt_8', 'apt_9', 'apt_13', 'apt_27', 'apt_32', 'apt_47', 'apt_57'],
      creative: ['apt_4', 'apt_5', 'apt_12', 'apt_20', 'apt_29', 'apt_46', 'apt_88'],
      analytical: ['apt_18', 'apt_23', 'apt_25', 'apt_26', 'apt_38', 'apt_52', 'apt_54'],
      social: ['apt_3', 'apt_6', 'apt_7', 'apt_28', 'apt_35', 'apt_36', 'apt_41'],
      leadership: ['apt_15', 'apt_16', 'apt_33', 'apt_39', 'apt_40', 'apt_43'],
      business: ['apt_10', 'apt_24', 'apt_48', 'apt_56']
    };
    
    const questions = areaQuestions[area] || [];
    let score = 0;
    let answeredCount = 0;
    
    questions.forEach(q => {
      if (responses[q]) {
        answeredCount++;
        if (responses[q] === 'A') score += 3;
        else if (responses[q] === 'B') score += 2;
        else if (responses[q] === 'C') score += 1;
      }
    });
    
    return answeredCount > 0 ? Math.round((score / (answeredCount * 3)) * 100) : 60;
  };
  
  // Career match data for radar chart
  const matchData = generateSkillMatchData();

  // Generate AI enhanced insights
  const generateAiInsights = async () => {
    if (!responses || Object.keys(responses).length === 0) {
      toast.error("Cannot generate insights without assessment data");
      return;
    }

    try {
      setIsGeneratingAiContent(true);
      
      const userName = responses.userName || "User";
      const userAge = responses.age || "18-24";
      const userLocation = responses.location || "India";
      
      // Extract scores for AI content generation
      const scores = {
        aptitude: analyzeAptitudeArea('analytical', responses) + analyzeAptitudeArea('technical', responses) / 2,
        personality: analyzeAptitudeArea('social', responses) + analyzeAptitudeArea('leadership', responses) / 2,
        interest: analyzeAptitudeArea('creative', responses) * 1.2,
        learningStyle: 70 // Default value
      };
      
      // Get strengths and weaknesses
      const strengthAreas = [
        matchData.find(item => item.A >= 80)?.subject || "Analytical Thinking",
        matchData.find(item => item.A >= 75 && item.subject !== (matchData.find(item => item.A >= 80)?.subject))?.subject || "Communication"
      ];
      
      const developmentAreas = [
        matchData.find(item => item.A <= 65)?.subject || "Creative Thinking",
        matchData.find(item => item.A <= 70 && item.subject !== (matchData.find(item => item.A <= 65)?.subject))?.subject || "Business Acumen"
      ];
      
      const response = await fetch('/api/generate-ai-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentType: 'careerRecommendation',
          assessmentData: {
            userName,
            age: userAge,
            location: userLocation,
            scores: scores,
            strengthAreas,
            developmentAreas,
            completedAt: new Date().toISOString(),
            topCareer: careerRecommendations[0]
          }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setAiGeneratedInsights(data.content);
        toast.success("Generated career insights successfully");
      } else {
        throw new Error("Failed to generate AI content");
      }
    } catch (error) {
      console.error("Error generating AI insights:", error);
      toast.error("Could not generate career insights");
    } finally {
      setIsGeneratingAiContent(false);
    }
  };

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
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Recommended Career Paths</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={generateAiInsights} 
            disabled={isGeneratingAiContent}
            className="flex items-center gap-2"
          >
            <ChartBar className="h-4 w-4" />
            {isGeneratingAiContent ? "Generating..." : "Generate In-depth Analysis"}
          </Button>
        </div>
        
        <p className="text-muted-foreground mb-4">
          Based on your assessment results, these career paths may be a good fit for your skills, 
          interests, and personality.
        </p>
        
        {aiGeneratedInsights && (
          <Card className="border border-border/50 rounded-lg shadow-sm mb-6 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">AI-Generated Career Insights</CardTitle>
              <CardDescription>
                Personalized career analysis based on your assessment results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                {aiGeneratedInsights.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="my-2">{paragraph}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
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
