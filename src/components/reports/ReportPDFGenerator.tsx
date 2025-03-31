import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { supabase } from '@/integrations/supabase/client';
import { 
  formatPersonalityType, 
  formatLearningStyle, 
  formatCurrentStage,
  formatCareerClusters,
  getProgressBarColors,
  createGradientHeader,
  createProfileBlock,
  createPlanningStageVisual,
  createPersonalityChart,
  createPersonalityAnalysisSection,
  createInterestTypesChart,
  createMotivatorTypesChart,
  createLearningStylesChart,
  createSkillsAndAbilitiesSection,
  createCareerClustersSection,
  createSelectedClustersSection,
  createCareerPathSection,
  createSummarySheetSection,
  generatePdfDate,
  generateCareerReportContent,
  formatSkillLevel,
  formatLearningImprovement
} from '@/utils/pdfFormatting';
import { generateCareerClusters } from '@/utils/careerRecommendations';
import { TablesInsert } from '@/integrations/supabase/types';

interface ReportPDFGeneratorProps {
  reportId: string;
  userName: string;
  scores: any;
  responses: Record<string, string> | null;
  strengthAreas: string[];
  developmentAreas: string[];
}

const ReportPDFGenerator: React.FC<ReportPDFGeneratorProps> = ({ 
  reportId, 
  userName, 
  scores, 
  responses,
  strengthAreas,
  developmentAreas
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generatePdf = async () => {
    try {
      setIsGenerating(true);
      toast.info('Starting PDF generation...');

      // Fetch user assessment data with better error handling
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('user_assessments')
        .select('*')
        .eq('id', reportId)
        .single();

      if (assessmentError) {
        console.error('Error fetching assessment data:', assessmentError);
        toast.error('Error fetching assessment data. Please try again.');
        return;
      }

      // Fetch skill assessment data with better error handling
      let skillAssessmentData = null;
      const { data: skillData, error: skillAssessmentError } = await supabase
        .from('skill_assessments')
        .select('*')
        .eq('assessment_id', reportId)
        .maybeSingle(); // Use maybeSingle instead of single to handle no rows case

      if (skillAssessmentError) {
        console.error('Error fetching skill assessment data:', skillAssessmentError);
        // Don't return here, continue with assessment data scores
      } else if (skillData) {
        skillAssessmentData = skillData;
      }

      // Use skill assessment data if available, otherwise use assessment data scores
      const finalScores = skillAssessmentData || {
        overall_score: assessmentData.scores?.overall || 0,
        numerical_score: assessmentData.scores?.numerical || 0,
        logical_score: assessmentData.scores?.logical || 0,
        verbal_score: assessmentData.scores?.verbal || 0,
        clerical_score: assessmentData.scores?.clerical || 0,
        spatial_score: assessmentData.scores?.spatial || 0,
        leadership_score: assessmentData.scores?.leadership || 0,
        social_score: assessmentData.scores?.social || 0,
        mechanical_score: assessmentData.scores?.mechanical || 0
      };

      // Generate AI content for different sections with better error handling
      const [
        careerInterestContent,
        careerMotivatorContent,
        skillsContent,
        careerClustersContent
      ] = await Promise.all([
        generateAIContent('careerInterest', {
          userName,
          completedAt: assessmentData.completed_at,
          scores: finalScores,
          responses: assessmentData.responses
        }).catch(() => generateDefaultContent('careerInterest', finalScores)),
        generateAIContent('careerMotivator', {
          userName,
          completedAt: assessmentData.completed_at,
          scores: finalScores,
          responses: assessmentData.responses
        }).catch(() => generateDefaultContent('careerMotivator', finalScores)),
        generateAIContent('skills', {
          userName,
          completedAt: skillAssessmentData?.completed_at || assessmentData.completed_at,
          scores: finalScores,
          responses: assessmentData.responses
        }).catch(() => generateDefaultContent('skills', finalScores)),
        generateAIContent('careerClusters', {
          userName,
          completedAt: assessmentData.completed_at,
          scores: finalScores,
          responses: assessmentData.responses
        }).catch(() => generateDefaultContent('careerClusters', finalScores))
      ]);

      // Create PDF document with error handling
      try {
        const pdf = new jsPDF();
        
        // Add content to PDF with proper error handling
        const content = await generateCareerReportContent({
          userName,
          completedAt: assessmentData.completed_at,
          scores: finalScores,
          strengthAreas,
          developmentAreas
        }, userName);

        // Add each section to the PDF
        pdf.addPage();
        
        // Add profile section
        pdf.addPage(createProfileBlock(
          userName,
          '', // email
          '', // phone
          '', // age
          '', // location
          new Date(assessmentData.completed_at).toLocaleDateString()
        ));

        // Add skills section
        pdf.addPage(createSkillsAndAbilitiesSection(finalScores));

        // Add summary sheet
        pdf.addPage(createSummarySheetSection(content.summarySheetData));

        // Save the PDF
        pdf.save(`career_report_${userName}_${new Date().toISOString().split('T')[0]}.pdf`);
        
        toast.success('PDF report generated successfully!');
      } catch (pdfError) {
        console.error('Error creating PDF:', pdfError);
        toast.error('Error creating PDF. Please try again.');
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        scores: scores ? "present" : "missing",
        userName: userName ? "present" : "missing",
        reportId: reportId ? "present" : "missing"
      });
      toast.error("Error generating PDF report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Helper function to generate AI content using Supabase Edge Function
  const generateAIContent = async (contentType: string, data: any) => {
    try {
      // Fetch skill assessment data if needed
      let skillData = null;
      if (contentType === 'skills' || contentType === 'careerClusters') {
        const { data: skillAssessmentData, error: skillError } = await supabase
          .from('skill_assessments')
          .select('*')
          .eq('assessment_id', reportId)
          .single();

        if (!skillError) {
          skillData = skillAssessmentData;
        }
      }

      // Call Supabase Edge Function
      const { data: result, error } = await supabase.functions.invoke('generate-ai-content', {
        body: {
          contentType,
          assessmentData: {
            ...data,
            skillAssessment: skillData,
            userName,
            completedAt: data.completedAt || new Date().toISOString()
          }
        }
      });

      if (error) {
        console.error(`Error calling generate-ai-content function:`, error);
        throw new Error(`Failed to generate ${contentType} content`);
      }

      if (!result?.content) {
        throw new Error(`No content returned for ${contentType}`);
      }

      return result.content;
    } catch (error) {
      console.error(`Error generating ${contentType} content:`, error);
      // Instead of throwing, return a default content based on available data
      return generateDefaultContent(contentType, data);
    }
  };
  
  // Helper function to generate default content when AI generation fails
  const generateDefaultContent = (contentType: string, data: any) => {
    switch (contentType) {
      case 'skills':
        return formatSkillsContent(data.skillAssessment || data.scores);
      case 'careerClusters':
        return formatCareerClustersContent(data.scores);
      case 'careerInterest':
        return formatCareerInterestContent(data.scores);
      case 'careerMotivator':
        return formatCareerMotivatorContent(data.scores);
      default:
        return 'Content generation failed. Please try again.';
    }
  };

  // Helper functions to format content from available data
  const formatSkillsContent = (scores: any) => {
    const skillLevels = {
      numerical_score: 'Numerical Ability',
      logical_score: 'Logical Ability',
      verbal_score: 'Verbal Ability',
      clerical_score: 'Clerical Skills',
      spatial_score: 'Spatial Ability',
      leadership_score: 'Leadership Skills',
      social_score: 'Social Skills',
      mechanical_score: 'Mechanical Ability'
    };

    let content = 'Skills and Abilities Assessment\n\n';
    content += `Overall Skill Level: ${scores.overall_score || 0}%\n\n`;
    
    Object.entries(skillLevels).forEach(([key, label]) => {
      const score = scores[key] || 0;
      content += `${label}: ${score}%\n`;
    });

    return content;
  };

  const formatCareerClustersContent = (scores: any) => {
    // Format career clusters based on scores
    return `Career Clusters Analysis based on your assessment scores:\n\n` +
           `Overall Aptitude: ${scores.aptitude || 0}%\n` +
           `Technical Skills: ${scores.technical || 0}%\n` +
           `Analytical Skills: ${scores.analytical || 0}%`;
  };

  const formatCareerInterestContent = (scores: any) => {
    // Format career interests based on scores
    return `Career Interest Analysis based on your assessment:\n\n` +
           `Interest Level: ${scores.interest || 0}%\n` +
           `Career Alignment: ${scores.alignment || 0}%`;
  };

  const formatCareerMotivatorContent = (scores: any) => {
    // Format career motivators based on scores
    return `Career Motivator Analysis based on your assessment:\n\n` +
           `Motivation Level: ${scores.motivation || 0}%\n` +
           `Work Style Preference: ${scores.workStyle || 'Balanced'}`;
  };
  
  // Helper function to get interest type bullet points
  const getInterestTypeBullets = (interestType: string): string[] => {
    const bullets: Record<string, string[]> = {
      'Investigative': [
        'You are analytical, intellectual, observant and enjoy research.',
        'You enjoy using logic and solving complex problems.',
        'You are interested in occupations that require observation, learning and investigation.',
        'You are introspective and focused on creative problem solving.',
        'You prefer working with ideas and using technology.'
      ],
      'Conventional': [
        'You are efficient, careful, conforming, organized and conscientious.',
        'You are organized, detail-oriented and do well with manipulating data and numbers.',
        'You are persistent and reliable in carrying out tasks.',
        'You enjoy working with data, details and creating reports',
        'You prefer working in a structured environment.',
        'You like to work with data, and you have a numerical or clerical ability.'
      ],
      'Realistic': [
        'You are active, stable and enjoy hands-on or manual activities.',
        'You prefer to work with things rather than ideas and people.',
        'You tend to communicate in a frank, direct manner and value material things.',
        'You may be uncomfortable or less adept with human relations.',
        'You value practical things that you can see and touch.',
        'You have good skills at handling tools, mechanical drawings, machines or animals.'
      ],
      'Enterprising': [
        'You are energetic, ambitious, adventurous, and confident.',
        'You are skilled in leadership and speaking.',
        'You generally enjoy starting your own business, promoting ideas and managing people.',
        'You are effective at public speaking and are generally social.',
        'You like activities that requires to persuade others and leadership roles.',
        'You like the promotion of products, ideas, or services.'
      ],
      'Artistic': [
        'You are creative, original, independent, chaotic, and innovative.',
        'You like to work with creative ideas and self-expression.',
        'You appreciate art, drama, music, or creative writing.',
        'You value aesthetics and creativity.',
        'You prefer unstructured situations and use your imagination.',
        'You create original work using your talents and imagination.'
      ],
      'Social': [
        'You are friendly, helpful, outgoing, understanding and cooperative.',
        'You enjoy working with others to assist them with personal development.',
        'You prefer to find solutions through talking with others and creating rapport.',
        'You like working through problems by talking through issues with others.',
        'You like to engage in social interactions and relationship building.',
        'You have an interest in helping, teaching, counseling, or serving others.'
      ]
    };
    
    return bullets[interestType] || [
      'You have a strong interest in this particular field.',
      'You exhibit natural talents and inclinations related to this interest area.',
      'Your assessment responses indicate a good fit for careers in this domain.',
      'This interest type aligns well with your personality and aptitude.',
      'Consider exploring career options that leverage this interest area.'
    ];
  };
  
  // Helper function to get motivator type bullet points
  const getMotivatorTypeBullets = (motivatorType: string): string[] => {
    const bullets: Record<string, string[]> = {
      'Social Service': [
        'You like to do work which has some social responsibility.',
        'You like to do work which impacts the world.',
        'You like to receive social recognition for the work that you do.'
      ],
      'Independence': [
        'You enjoy working independently.',
        'You dislike too much supervision.',
        'You dislike group activities.'
      ],
      'Continuous Learning': [
        'You like to have consistent professional growth in your field of work.',
        'You like to work in an environment where there is need to update your knowledge at regular intervals.',
        'You like it when your work achievements are evaluated at regular intervals.'
      ],
      'Structured work environment': [
        'You prefer working in organized and predictable environments.',
        'You like having clear guidelines and procedures.',
        'You appreciate stability and consistency in your work.'
      ],
      'Adventure': [
        'You enjoy taking risks and facing challenges.',
        'You prefer dynamic and changing work environments.',
        'You are energized by new experiences and opportunities.'
      ],
      'High Paced Environment': [
        'You thrive in fast-paced work settings.',
        'You enjoy meeting tight deadlines and managing pressure.',
        'You are motivated by constant activity and quick decision-making.'
      ],
      'Creativity': [
        'You value expressing your original ideas.',
        'You enjoy work that allows for innovation and imagination.',
        'You are motivated by opportunities to create something new.'
      ]
    };
    
    return bullets[motivatorType] || [
      'This motivator significantly influences your career satisfaction.',
      'Your assessment responses indicate a strong preference for this value.',
      'Consider career options that align with this motivational factor.',
      'Work environments that support this value will likely increase your job satisfaction.',
      'This motivator should be a key consideration in your career planning.'
    ];
  };
  
  const drawDimensionBar = (
    pdf: any,
    y: number,
    leftLabel: string,
    rightLabel: string,
    leftDescription: string,
    rightDescription: string,
    percentage: number
  ) => {
    const startX = 20;
    const barWidth = 80; // Reduced from 100
    const barHeight = 10; // Reduced from 15
    const labelWidth = 40; // Reduced from 60
    
    // Draw labels
    pdf.setFontSize(8); // Reduced from 10
    pdf.setTextColor(39, 174, 96); // Green for left label
    pdf.text(leftLabel, startX, y);
    pdf.setTextColor(128, 128, 128); // Gray for descriptions
    pdf.setFontSize(6); // Reduced from 8
    pdf.text(leftDescription, startX, y + 4);

    pdf.setFontSize(8);
    pdf.setTextColor(231, 76, 60); // Red for right label
    pdf.text(rightLabel, startX + labelWidth + barWidth + 5, y);
    pdf.setFontSize(6);
    pdf.setTextColor(128, 128, 128);
    pdf.text(rightDescription, startX + labelWidth + barWidth + 5, y + 4);

    // Draw background bar
    pdf.setFillColor(240, 240, 240);
    pdf.rect(startX + labelWidth, y - 5, barWidth, barHeight, 'F');

    // Draw percentage bar
    const leftPercentage = 100 - percentage;
    const rightPercentage = percentage;
    
    if (leftPercentage > rightPercentage) {
      pdf.setFillColor(39, 174, 96); // Green
    } else {
      pdf.setFillColor(231, 76, 60); // Red
    }
    
    const filledWidth = (barWidth * rightPercentage) / 100;
    pdf.rect(startX + labelWidth, y - 5, filledWidth, barHeight, 'F');

    // Add percentage text
    pdf.setFontSize(7);
    pdf.setTextColor(255, 255, 255);
    if (rightPercentage >= 15) {
      pdf.text(`${rightPercentage}%`, startX + labelWidth + filledWidth - 10, y + 1);
    }
    if (leftPercentage >= 15) {
      pdf.setTextColor(0, 0, 0);
      pdf.text(`${leftPercentage}%`, startX + labelWidth + 5, y + 1);
    }
  };
  
  const fetchSkillAssessmentData = async () => {
    try {
      const { data, error } = await supabase
        .from('skill_assessments')
        .select('*')
        .eq('user_id', userId)
        .eq('assessment_id', assessmentId)
        .single();

      if (error) {
        console.error('Error fetching skill assessment data:', error);
        return null;
      }

      if (!data) {
        console.warn('No skill assessment data found for user:', userId);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching skill assessment data:', error);
      return null;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-white border rounded-lg shadow-sm p-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Download Detailed PDF Report</h3>
          <p className="text-sm text-muted-foreground">
            Get a comprehensive PDF report with detailed analysis of your assessment results
          </p>
        </div>
        <Button 
          onClick={generatePdf} 
          disabled={isGenerating}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          {isGenerating ? "Generating PDF..." : "Generate PDF Report"}
        </Button>
      </div>
    </div>
  );
};

export default ReportPDFGenerator;
