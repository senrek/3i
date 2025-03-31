
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';
import { addHeaderWithLogo, addReportTitle, addUserInfo, addSectionTitle, addPersonalityTypeChart, addInterestBarChart, addLearningStylePieChart, addSkillBarChart, addCareerClusters, addCareerPaths, addStrengthsAndWeaknesses } from '@/utils/pdfFormatting';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ReportPDFGeneratorProps {
  reportId: string;
  userName: string;
  scores: any;
  responses: Record<string, string> | null;
  strengthAreas: string[];
  developmentAreas: string[];
}

// Use this function to generate personalized content using OpenRouter API
async function generatePersonalizedContent(
  userName: string,
  scores: any,
  strengths: string[],
  weaknesses: string[]
) {
  try {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
    
    if (!OPENROUTER_API_KEY) {
      throw new Error('No auth credentials found');
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://lovable.dev',
        'X-Title': 'Career Assessment Report',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-coder',
        messages: [
          {
            role: 'system',
            content: 'You are an expert career counselor specializing in creating personalized analysis for students. Write in a professional, encouraging tone. Focus on strengths while gently addressing areas for improvement.'
          },
          {
            role: 'user',
            content: `Generate a personalized career analysis paragraph (maximum 200 words) for a student named ${userName}. 
            Key strengths: ${strengths.join(', ')}. 
            Areas for development: ${weaknesses.join(', ')}. 
            Their aptitude score is ${scores.aptitude}%, personality score is ${scores.personality}%, interest alignment is ${scores.interest}%, 
            and learning style compatibility is ${scores.learningStyle}%. 
            Focus on their path forward in a clear, encouraging way. No markdown formatting.`
          }
        ]
      }),
    });

    if (!response.ok) {
      console.error('Error response from OpenRouter API:', await response.json());
      throw new Error('Failed to generate personalized content');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating personalized content:', error);
    throw new Error('Failed to generate personalized content');
  }
}

// Make the generatePDF function accessible outside the component
export async function generatePDF(
  reportId: string,
  userName: string,
  scores: any,
  responses: Record<string, string> | null,
  strengthAreas: string[],
  developmentAreas: string[]
) {
  try {
    // Generate AI personalized content
    let personalizedContent = '';
    try {
      personalizedContent = await generatePersonalizedContent(
        userName,
        scores,
        strengthAreas,
        developmentAreas
      );
    } catch (error) {
      console.error('Error generating AI content:', error);
      personalizedContent = 'Based on your assessment results, we recommend focusing on your strengths in the identified career clusters while working on areas for development. Continue exploring opportunities aligned with your interests and aptitudes.';
    }

    // Determine if this is a junior assessment (8-10) or senior (11-12)
    // We can check this from the responses or other data
    const isJuniorAssessment = reportId.includes('junior') || responses?.assessment_type === 'career-analysis-junior';
    
    // Create PDF document
    createPDFWithContent(
      reportId,
      userName,
      scores,
      responses,
      strengthAreas,
      developmentAreas,
      personalizedContent,
      isJuniorAssessment
    );

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

function createPDFWithContent(
  reportId: string,
  userName: string,
  scores: any,
  responses: Record<string, string> | null,
  strengthAreas: string[],
  developmentAreas: string[],
  personalizedContent: string,
  isJuniorAssessment: boolean
) {
  // Initialize PDF document
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Add header and title
  addHeaderWithLogo(pdf);
  
  // Set the title based on assessment type
  const reportTitle = isJuniorAssessment 
    ? 'Career Report for 8th, 9th or 10th' 
    : 'Career Report for 11th or 12th';
  
  addReportTitle(pdf, reportTitle);
  
  // Add user information
  const userInfo = [
    { label: 'Name', value: userName },
    { label: 'Report ID', value: reportId },
    { label: 'Date', value: new Date().toLocaleDateString() },
    { label: 'Report Type', value: isJuniorAssessment ? 'Class 8-10 Assessment' : 'Class 11-12 Assessment' }
  ];
  
  addUserInfo(pdf, userInfo);
  
  // Add personalized content
  addSectionTitle(pdf, 'Personalized Analysis', 20, 200);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.setTextColor(0, 0, 0);
  
  // Split personalized content into lines to fit page width
  const textLines = pdf.splitTextToSize(personalizedContent, 170);
  pdf.text(textLines, 20, 215);
  
  // Add personality type data if available
  if (scores && responses) {
    // Add page break
    pdf.addPage();
    
    addSectionTitle(pdf, 'Career Personality', 20, 30);
    
    // Determine personality type based on responses
    let introversion = 50;
    let sensing = 50;
    let thinking = 50;
    let judging = 50;
    
    // Calculate personality traits based on responses
    if (responses) {
      // Example of calculating from responses (adjust based on your actual response structure)
      const personalityQuestions = Object.entries(responses).filter(([id]) => id.startsWith('per_'));
      
      // Calculate introversion percentage
      const introvertResponses = personalityQuestions.filter(([id, value]) => 
        (id === 'per_1' && value === 'B') ||
        (id === 'per_2' && value === 'B') ||
        (id === 'per_3' && value === 'B') ||
        (id === 'per_4' && value === 'B') ||
        (id === 'per_5' && value === 'B')
      ).length;
      
      const totalIntrovertQuestions = personalityQuestions.filter(([id]) => 
        ['per_1', 'per_2', 'per_3', 'per_4', 'per_5'].includes(id)
      ).length;
      
      introversion = Math.round((introvertResponses / (totalIntrovertQuestions || 1)) * 100);
      
      // Similarly calculate other traits (sensing, thinking, judging)
      // This is a simplified example
      const sensingResponses = personalityQuestions.filter(([id, value]) => 
        (id === 'per_8' && value === 'A') ||
        (id === 'per_9' && value === 'A') ||
        (id === 'per_10' && value === 'A')
      ).length;
      
      const totalSensingQuestions = personalityQuestions.filter(([id]) => 
        ['per_8', 'per_9', 'per_10'].includes(id)
      ).length;
      
      sensing = Math.round((sensingResponses / (totalSensingQuestions || 1)) * 100);
      
      const thinkingResponses = personalityQuestions.filter(([id, value]) => 
        (id === 'per_15' && value === 'A') ||
        (id === 'per_16' && value === 'A') ||
        (id === 'per_17' && value === 'A')
      ).length;
      
      const totalThinkingQuestions = personalityQuestions.filter(([id]) => 
        ['per_15', 'per_16', 'per_17'].includes(id)
      ).length;
      
      thinking = Math.round((thinkingResponses / (totalThinkingQuestions || 1)) * 100);
      
      const judgingResponses = personalityQuestions.filter(([id, value]) => 
        (id === 'per_22' && value === 'A') ||
        (id === 'per_23' && value === 'B') ||
        (id === 'per_24' && value === 'B')
      ).length;
      
      const totalJudgingQuestions = personalityQuestions.filter(([id]) => 
        ['per_22', 'per_23', 'per_24'].includes(id)
      ).length;
      
      judging = Math.round((judgingResponses / (totalJudgingQuestions || 1)) * 100);
    }
    
    // Add personality type chart
    addPersonalityTypeChart(pdf, {
      introvertExtrovert: {
        introvert: introversion,
        extrovert: 100 - introversion
      },
      sensingIntuitive: {
        sensing: sensing,
        intuitive: 100 - sensing
      },
      thinkingFeeling: {
        thinking: thinking,
        feeling: 100 - thinking
      },
      judgingPerceiving: {
        judging: judging,
        perceiving: 100 - judging
      }
    });
    
    // Add new page for interests
    pdf.addPage();
    addSectionTitle(pdf, 'Career Interests', 20, 30);
    
    // Create interest data
    const interests = [
      { name: 'Realistic', value: scores.interest * 0.8 },
      { name: 'Investigative', value: scores.interest * 0.7 },
      { name: 'Artistic', value: scores.interest * 0.5 },
      { name: 'Social', value: scores.interest * 0.6 },
      { name: 'Enterprising', value: scores.interest * 0.9 },
      { name: 'Conventional', value: scores.interest * 0.75 }
    ];
    
    // Add interest chart
    addInterestBarChart(pdf, interests, 50);
    
    // Add learning style
    addSectionTitle(pdf, 'Learning Style', 20, 150);
    
    // Create learning style data
    const learningStyles = [
      { name: 'Visual', value: Math.round(scores.learningStyle * 0.7) },
      { name: 'Auditory', value: Math.round(scores.learningStyle * 0.6) },
      { name: 'Reading/Writing', value: Math.round(scores.learningStyle * 0.8) },
      { name: 'Kinesthetic', value: Math.round(scores.learningStyle * 0.5) }
    ];
    
    // Add learning style pie chart
    addLearningStylePieChart(pdf, learningStyles, 170);
    
    // Add new page for skills
    pdf.addPage();
    addSectionTitle(pdf, 'Skills & Abilities', 20, 30);
    
    // Create skills data
    const skills = [
      { name: 'Numerical Ability', value: Math.round(scores.aptitude * 0.8) },
      { name: 'Logical Ability', value: Math.round(scores.aptitude * 0.75) },
      { name: 'Verbal Ability', value: Math.round(scores.personality * 0.85) },
      { name: 'Clerical & Organizing', value: Math.round(scores.personality * 0.7) },
      { name: 'Spatial & Visualization', value: Math.round(scores.aptitude * 0.65) },
      { name: 'Leadership & Decision Making', value: Math.round(scores.personality * 0.8) },
      { name: 'Social & Cooperation', value: Math.round(scores.interest * 0.9) },
      { name: 'Mechanical Abilities', value: Math.round(scores.aptitude * 0.6) }
    ];
    
    // Add skills bar chart
    addSkillBarChart(pdf, skills, 50);
    
    // Add strengths and weaknesses
    addStrengthsAndWeaknesses(pdf, strengthAreas, developmentAreas, 170);
    
    // Add new page for career clusters
    pdf.addPage();
    addSectionTitle(pdf, 'Career Clusters', 20, 30);
    
    // Create career clusters data
    const clusters = [
      { name: 'Information Technology', score: Math.round(scores.aptitude * 0.95) },
      { name: 'Science & Engineering', score: Math.round(scores.aptitude * 0.9) },
      { name: 'Arts & Creative Fields', score: Math.round(scores.interest * 0.8) },
      { name: 'Business & Finance', score: Math.round(scores.aptitude * 0.85) },
      { name: 'Healthcare & Medicine', score: Math.round(scores.interest * 0.75) },
      { name: 'Education & Training', score: Math.round(scores.personality * 0.8) },
      { name: 'Public Service', score: Math.round(scores.personality * 0.7) },
      { name: 'Manufacturing & Production', score: Math.round(scores.aptitude * 0.65) },
      { name: 'Architecture & Construction', score: Math.round(scores.aptitude * 0.7) },
      { name: 'Agriculture & Natural Resources', score: Math.round(scores.interest * 0.6) }
    ];
    
    // Add career clusters
    addCareerClusters(pdf, clusters, 50);
    
    // Add new page for career paths
    pdf.addPage();
    addSectionTitle(pdf, 'Career Paths', 20, 30);
    
    // Create career recommendations data
    const careerRecommendations = [
      {
        careerTitle: 'Software Developer',
        suitabilityPercentage: 95,
        careerDescription: 'Designs and develops software applications',
        keySkills: ['Coding', 'Problem Solving', 'Logical Thinking']
      },
      {
        careerTitle: 'Data Scientist',
        suitabilityPercentage: 92,
        careerDescription: 'Analyzes complex data to inform decision making',
        keySkills: ['Statistics', 'Programming', 'Data Visualization']
      },
      {
        careerTitle: 'Mechanical Engineer',
        suitabilityPercentage: 88,
        careerDescription: 'Designs and builds mechanical systems',
        keySkills: ['Technical Drawing', 'Problem Solving', 'Mathematics']
      },
      {
        careerTitle: 'Financial Analyst',
        suitabilityPercentage: 85,
        careerDescription: 'Analyzes financial data and market trends',
        keySkills: ['Financial Modeling', 'Analysis', 'Attention to Detail']
      },
      {
        careerTitle: 'Healthcare Administrator',
        suitabilityPercentage: 82,
        careerDescription: 'Manages healthcare facilities and services',
        keySkills: ['Leadership', 'Organization', 'Communication']
      }
    ];
    
    // Add career paths
    addCareerPaths(pdf, careerRecommendations, 50, userName);
    
    // Add footer to the last page
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`3i Global`, 20, 285);
    pdf.text(`${userName}`, 100, 285, { align: 'center' });
    pdf.text(`Page ${pdf.getNumberOfPages() - 1}`, 190, 285);
  }
  
  // Save the PDF file
  pdf.save(`${reportId}-${new Date().toISOString().split('T')[0]}.pdf`);
}

// The main component
const ReportPDFGenerator = ({ 
  reportId, 
  userName, 
  scores, 
  responses,
  strengthAreas,
  developmentAreas
}: ReportPDFGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();
  
  const handleGeneratePDF = async () => {
    try {
      setIsGenerating(true);
      await generatePDF(reportId, userName, scores, responses, strengthAreas, developmentAreas);
      
      // Update the report_generated_at timestamp in Supabase
      if (user) {
        await supabase
          .from('user_assessments')
          .update({ report_generated_at: new Date().toISOString() })
          .eq('id', reportId);
      }
      
      toast.success('PDF report generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="flex justify-center my-8">
      <Button 
        size="lg" 
        className="flex items-center gap-2 bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/90 transition-all shadow-md"
        onClick={handleGeneratePDF}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <FileText className="h-5 w-5 animate-pulse" />
            Generating PDF Report...
          </>
        ) : (
          <>
            <FileDown className="h-5 w-5" />
            Download Full PDF Report
          </>
        )}
      </Button>
    </div>
  );
};

export default ReportPDFGenerator;
