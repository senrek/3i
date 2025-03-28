
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ReportPDFGeneratorProps {
  reportId: string;
  userName?: string;
  scores?: {
    aptitude: number;
    personality: number;
    interest: number;
    learningStyle: number;
    careerRecommendations: any[];
    analysisInsights?: any;
  } | null;
  responses?: Record<string, string> | null;
  strengthAreas?: string[];
  developmentAreas?: string[];
}

const ReportPDFGenerator = ({ 
  reportId, 
  userName = 'Student', 
  scores,
  responses,
  strengthAreas = ['Problem Solving', 'Critical Thinking', 'Adaptability'],
  developmentAreas = ['Technical Skills', 'Leadership', 'Time Management']
}: ReportPDFGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePdfContent = async () => {
    // This would normally be done server-side with a proper PDF generation library
    // For this implementation, we'll create a PDF using client-side libraries
    
    if (!scores) {
      return null;
    }
    
    // Format career recommendations for the PDF
    const topCareer = scores.careerRecommendations[0];
    
    // Analyze responses to provide more personalized insights
    const responseInsights = {
      learningPreferences: [] as string[],
      workStylePreferences: [] as string[],
      personalityTraits: [] as string[]
    };
    
    if (responses) {
      // Simple analysis of learning preferences based on responses
      if (Object.keys(responses).some(q => q.startsWith('lrn_') && responses[q] === 'A')) {
        responseInsights.learningPreferences.push('Visual Learning');
      }
      if (Object.keys(responses).some(q => q.startsWith('lrn_') && responses[q] === 'B')) {
        responseInsights.learningPreferences.push('Auditory Learning');
      }
      if (Object.keys(responses).some(q => q.startsWith('lrn_') && responses[q] === 'C')) {
        responseInsights.learningPreferences.push('Kinesthetic Learning');
      }
      
      // Work style preferences
      if (Object.keys(responses).filter(q => q.startsWith('per_') && ['A', 'B'].includes(responses[q])).length > 3) {
        responseInsights.workStylePreferences.push('Collaborative Work Environment');
      } else {
        responseInsights.workStylePreferences.push('Independent Work Environment');
      }
      
      // Personality traits
      const personalityResponses = Object.keys(responses).filter(q => q.startsWith('per_'));
      const aCount = personalityResponses.filter(q => responses[q] === 'A').length;
      const bCount = personalityResponses.filter(q => responses[q] === 'B').length;
      const cCount = personalityResponses.filter(q => responses[q] === 'C').length;
      
      if (aCount > bCount && aCount > cCount) {
        responseInsights.personalityTraits.push('Extroverted', 'Assertive');
      } else if (bCount > aCount && bCount > cCount) {
        responseInsights.personalityTraits.push('Balanced', 'Adaptable');
      } else {
        responseInsights.personalityTraits.push('Reflective', 'Detail-oriented');
      }
    }
    
    // Create a structured PDF content object
    const pdfContent = {
      userName,
      reportDate: new Date().toISOString(),
      reportId,
      scores: {
        aptitude: scores.aptitude,
        personality: scores.personality,
        interest: scores.interest,
        learningStyle: scores.learningStyle
      },
      strengthAreas,
      developmentAreas,
      topCareerPath: {
        title: topCareer.careerTitle,
        match: topCareer.suitabilityPercentage,
        description: topCareer.careerDescription,
        educationPathways: topCareer.educationPathways,
        keySkills: topCareer.keySkills,
        workNature: topCareer.workNature
      },
      otherCareers: scores.careerRecommendations.slice(1, 4).map(career => ({
        title: career.careerTitle,
        match: career.suitabilityPercentage,
        description: career.careerDescription,
        keySkills: career.keySkills.slice(0, 3)
      })),
      skillAnalysis: {
        strengths: [
          { name: 'Analytical Thinking', score: scores.aptitude > 70 ? 'Excellent' : 'Good' },
          { name: 'Problem Solving', score: scores.aptitude > 65 ? 'Good' : 'Average' },
          { name: 'Technical Aptitude', score: scores.aptitude > 75 ? 'Excellent' : 'Good' }
        ],
        development: [
          { name: 'Communication', score: scores.personality < 70 ? 'Needs Improvement' : 'Good' },
          { name: 'Leadership', score: scores.personality < 65 ? 'Needs Improvement' : 'Average' }
        ]
      },
      personalization: responseInsights,
      gapAnalysis: topCareer.gapAnalysis,
      recommendations: {
        shortTerm: [
          "Research educational pathways for your top career match",
          "Identify and build missing skills from the gap analysis",
          "Connect with professionals in your preferred career field"
        ],
        mediumTerm: [
          "Select suitable educational programs that align with your career goals",
          "Gain practical experience through internships or part-time roles",
          "Continue developing your personal and professional portfolio"
        ],
        longTerm: [
          "Pursue advanced qualifications if required for career progression",
          "Expand your professional network within the industry",
          "Regularly reassess your career path and make adjustments as needed"
        ]
      }
    };
    
    return pdfContent;
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    
    try {
      // Prepare for PDF generation
      const pdfContent = await generatePdfContent();
      
      if (!pdfContent) {
        throw new Error("Could not generate report content");
      }
      
      // Create PDF with multiple pages
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15; // 15mm margins
      const contentWidth = pageWidth - (margin * 2);
      const lineHeight = 7;
      
      // Helper function to add page
      const addNewPage = () => {
        pdf.addPage();
        return margin; // Return starting Y position
      };
      
      // Helper function for text wrapping
      const addWrappedText = (text, x, y, maxWidth, lineHeight) => {
        const lines = pdf.splitTextToSize(text, maxWidth);
        for (let i = 0; i < lines.length; i++) {
          pdf.text(lines[i], x, y + (i * lineHeight));
        }
        return y + (lines.length * lineHeight);
      };
      
      // Function to add section header
      const addSectionHeader = (title, y) => {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.setTextColor(59, 130, 246); // #3b82f6 - Blue color
        pdf.text(title, margin, y);
        pdf.setLineWidth(0.5);
        pdf.setDrawColor(59, 130, 246);
        pdf.line(margin, y + 1, pageWidth - margin, y + 1);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(10);
        return y + 8; // Return next position
      };
      
      // === PAGE 1: Cover Page ===
      // Header
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(22);
      pdf.setTextColor(59, 130, 246); // Blue color
      pdf.text('Career Assessment Report', pageWidth/2, 30, { align: 'center' });
      
      // Subtitle
      pdf.setFontSize(14);
      pdf.text('For Classes 11-12', pageWidth/2, 40, { align: 'center' });
      
      // User info
      pdf.setFontSize(14);
      pdf.setTextColor(0);
      pdf.text(`Prepared for: ${pdfContent.userName}`, pageWidth/2, 60, { align: 'center' });
      pdf.setFontSize(10);
      pdf.text(`Report Date: ${new Date().toLocaleDateString()}`, pageWidth/2, 70, { align: 'center' });
      
      // Logo placeholder (you could add a logo image here)
      pdf.setFillColor(240, 240, 240);
      pdf.roundedRect(pageWidth/2 - 25, 85, 50, 50, 2, 2, 'F');
      pdf.setFontSize(10);
      pdf.text('Career Analysis', pageWidth/2, 115, { align: 'center' });
      
      // Report description
      pdf.setFontSize(12);
      let yPos = 150;
      pdf.text("This report provides a comprehensive analysis of your aptitudes, personality traits, interests, and learning style to identify optimal career paths aligned with your unique profile.", margin, yPos, { maxWidth: contentWidth });
      
      // Footer
      pdf.setFontSize(8);
      pdf.text(`Report ID: ${pdfContent.reportId}`, margin, pageHeight - 10);
      pdf.text('Page 1 of 8', pageWidth - margin, pageHeight - 10, { align: 'right' });
      
      // === PAGE 2: Executive Summary ===
      pdf.addPage();
      yPos = margin;
      
      // Page title
      yPos = addSectionHeader('Executive Summary', yPos);
      
      // Assessment Scores
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Assessment Scores', margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      yPos += 7;
      
      // Score table
      pdf.setDrawColor(200, 200, 200);
      pdf.setFillColor(245, 245, 245);
      pdf.rect(margin, yPos, contentWidth, 30, 'FD');
      
      const scoreTableX = margin + 5;
      pdf.text(`Aptitude: ${pdfContent.scores.aptitude}%`, scoreTableX, yPos + 7);
      pdf.text(`Personality: ${pdfContent.scores.personality}%`, scoreTableX, yPos + 15);
      pdf.text(`Interest: ${pdfContent.scores.interest}%`, scoreTableX + contentWidth/2, yPos + 7);
      pdf.text(`Learning Style: ${pdfContent.scores.learningStyle}%`, scoreTableX + contentWidth/2, yPos + 15);
      
      yPos += 40;
      
      // Strengths & Development Areas
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Key Strengths', margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      yPos += 7;
      
      pdfContent.strengthAreas.forEach((strength, index) => {
        pdf.text(`• ${strength}`, margin + 5, yPos);
        yPos += 7;
        
        // Check if we need a new page
        if (yPos > pageHeight - margin && index < pdfContent.strengthAreas.length - 1) {
          yPos = addNewPage();
        }
      });
      
      yPos += 5;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Development Areas', margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      yPos += 7;
      
      pdfContent.developmentAreas.forEach((area, index) => {
        pdf.text(`• ${area}`, margin + 5, yPos);
        yPos += 7;
        
        // Check if we need a new page
        if (yPos > pageHeight - margin && index < pdfContent.developmentAreas.length - 1) {
          yPos = addNewPage();
        }
      });
      
      // Footer
      pdf.setFontSize(8);
      pdf.text('Page 2 of 8', pageWidth - margin, pageHeight - 10, { align: 'right' });
      
      // === PAGE 3: Top Career Recommendation ===
      pdf.addPage();
      yPos = margin;
      
      // Page title
      yPos = addSectionHeader('Top Career Recommendation', yPos);
      
      // Career Title and Match
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.text(pdfContent.topCareerPath.title, margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);
      pdf.setTextColor(34, 197, 94); // Green color
      pdf.text(`${pdfContent.topCareerPath.match}% Match`, margin + contentWidth - 30, yPos);
      pdf.setTextColor(0);
      
      yPos += 10;
      
      // Career Description
      pdf.setFontSize(10);
      yPos = addWrappedText(pdfContent.topCareerPath.description, margin, yPos, contentWidth, lineHeight);
      
      yPos += 10;
      
      // Key Skills
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Key Skills Required', margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      yPos += 7;
      
      pdfContent.topCareerPath.keySkills.forEach((skill, index) => {
        pdf.text(`• ${skill}`, margin + 5, yPos);
        yPos += 7;
        
        // Check if we need a new page
        if (yPos > pageHeight - margin && index < pdfContent.topCareerPath.keySkills.length - 1) {
          yPos = addNewPage();
        }
      });
      
      // Footer
      pdf.setFontSize(8);
      pdf.text('Page 3 of 8', pageWidth - margin, pageHeight - 10, { align: 'right' });
      
      // === PAGE 4: Education Pathways ===
      pdf.addPage();
      yPos = margin;
      
      // Page title
      yPos = addSectionHeader('Education Pathways', yPos);
      
      // Education Pathways
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text(`Education Pathways for ${pdfContent.topCareerPath.title}`, margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      yPos += 7;
      
      pdfContent.topCareerPath.educationPathways.forEach((path, index) => {
        pdf.text(`${index + 1}. ${path}`, margin + 5, yPos);
        yPos += 10;
        
        // Check if we need a new page
        if (yPos > pageHeight - margin && index < pdfContent.topCareerPath.educationPathways.length - 1) {
          yPos = addNewPage();
        }
      });
      
      yPos += 10;
      
      // Work Nature
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Work Responsibilities', margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      yPos += 7;
      
      pdfContent.topCareerPath.workNature.forEach((work, index) => {
        pdf.text(`• ${work}`, margin + 5, yPos);
        yPos += 10;
        
        // Check if we need a new page
        if (yPos > pageHeight - margin && index < pdfContent.topCareerPath.workNature.length - 1) {
          yPos = addNewPage();
        }
      });
      
      // Footer
      pdf.setFontSize(8);
      pdf.text('Page 4 of 8', pageWidth - margin, pageHeight - 10, { align: 'right' });
      
      // === PAGE 5: Alternative Career Paths ===
      pdf.addPage();
      yPos = margin;
      
      // Page title
      yPos = addSectionHeader('Alternative Career Paths', yPos);
      
      // Alternative Careers
      pdfContent.otherCareers.forEach((career, index) => {
        // Check if we need a new page
        if (yPos > pageHeight - 50) {
          yPos = addNewPage();
          yPos = addSectionHeader('Alternative Career Paths (Continued)', yPos);
        }
        
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text(`${career.title} - ${career.match}% Match`, margin, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        yPos += 7;
        
        yPos = addWrappedText(career.description, margin + 5, yPos, contentWidth - 10, lineHeight);
        yPos += 5;
        
        pdf.text(`Key Skills: ${career.keySkills.join(', ')}`, margin + 5, yPos);
        yPos += 15; // Extra space between careers
      });
      
      // Footer
      pdf.setFontSize(8);
      pdf.text('Page 5 of 8', pageWidth - margin, pageHeight - 10, { align: 'right' });
      
      // === PAGE 6: Gap Analysis ===
      pdf.addPage();
      yPos = margin;
      
      // Page title
      yPos = addSectionHeader('Gap Analysis & Development Plan', yPos);
      
      // Gap Analysis
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Areas for Development', margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      yPos += 7;
      
      pdfContent.gapAnalysis.forEach((gap, index) => {
        pdf.text(`• ${gap}`, margin + 5, yPos);
        yPos += 10;
        
        // Check if we need a new page
        if (yPos > pageHeight - margin && index < pdfContent.gapAnalysis.length - 1) {
          yPos = addNewPage();
        }
      });
      
      yPos += 10;
      
      // Learning Style
      if (pdfContent.personalization.learningPreferences.length > 0) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text('Your Learning Preferences', margin, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        yPos += 7;
        
        pdfContent.personalization.learningPreferences.forEach(style => {
          pdf.text(`• ${style}`, margin + 5, yPos);
          yPos += 7;
        });
      }
      
      // Footer
      pdf.setFontSize(8);
      pdf.text('Page 6 of 8', pageWidth - margin, pageHeight - 10, { align: 'right' });
      
      // === PAGE 7: Action Plan ===
      pdf.addPage();
      yPos = margin;
      
      // Page title
      yPos = addSectionHeader('Personalized Action Plan', yPos);
      
      // Short Term
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Short-Term (3-6 months)', margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      yPos += 7;
      
      pdfContent.recommendations.shortTerm.forEach((rec, index) => {
        pdf.text(`${index + 1}. ${rec}`, margin + 5, yPos);
        yPos += 10;
      });
      
      yPos += 5;
      
      // Medium Term
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Medium-Term (6-12 months)', margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      yPos += 7;
      
      pdfContent.recommendations.mediumTerm.forEach((rec, index) => {
        pdf.text(`${index + 1}. ${rec}`, margin + 5, yPos);
        yPos += 10;
      });
      
      yPos += 5;
      
      // Long Term
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Long-Term (1-3 years)', margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      yPos += 7;
      
      pdfContent.recommendations.longTerm.forEach((rec, index) => {
        pdf.text(`${index + 1}. ${rec}`, margin + 5, yPos);
        yPos += 10;
      });
      
      // Footer
      pdf.setFontSize(8);
      pdf.text('Page 7 of 8', pageWidth - margin, pageHeight - 10, { align: 'right' });
      
      // === PAGE 8: Conclusion ===
      pdf.addPage();
      yPos = margin;
      
      // Page title
      yPos = addSectionHeader('Conclusion', yPos);
      
      // Conclusion text
      pdf.setFontSize(10);
      let conclusionText = "This career assessment report is designed to guide you in making informed decisions about your educational and career path. The insights provided are based on your responses to the assessment questions, which measured your aptitudes, personality traits, interests, and learning preferences.";
      yPos = addWrappedText(conclusionText, margin, yPos, contentWidth, lineHeight);
      yPos += 10;
      
      conclusionText = "Remember that this report is a tool to help you explore possibilities that align with your strengths and preferences. Your career journey is unique, and this report serves as a starting point for further exploration and development.";
      yPos = addWrappedText(conclusionText, margin, yPos, contentWidth, lineHeight);
      yPos += 10;
      
      conclusionText = "We recommend discussing these results with your teachers, career counselors, or mentors who can provide additional guidance specific to your situation and goals.";
      yPos = addWrappedText(conclusionText, margin, yPos, contentWidth, lineHeight);
      yPos += 15;
      
      // Next Steps
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Next Steps', margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      yPos += 7;
      
      pdf.text('1. Research the recommended career paths in more detail', margin + 5, yPos); yPos += 7;
      pdf.text('2. Speak with professionals in your field of interest', margin + 5, yPos); yPos += 7;
      pdf.text('3. Explore educational institutions offering relevant programs', margin + 5, yPos); yPos += 7;
      pdf.text('4. Develop a personal plan to address identified gaps', margin + 5, yPos); yPos += 7;
      pdf.text('5. Consider shadowing or internship opportunities', margin + 5, yPos); yPos += 7;
      
      // Certificate
      yPos += 20;
      pdf.setFillColor(245, 245, 245);
      pdf.rect(margin, yPos, contentWidth, 40, 'F');
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Career Assessment Certificate', pageWidth/2, yPos + 15, { align: 'center' });
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text(`This certifies that ${pdfContent.userName} has completed the Career Analysis Assessment`, pageWidth/2, yPos + 25, { align: 'center' });
      
      // Footer
      pdf.setFontSize(8);
      pdf.text('Page 8 of 8', pageWidth - margin, pageHeight - 10, { align: 'right' });
      
      // Save the PDF
      pdf.save(`CareerAssessment_${userName.replace(/\s+/g, '_')}_${reportId.slice(0, 8)}.pdf`);
      
      toast.success('Career assessment report generated successfully!');
      
      // Store report generation record in Supabase
      const { error } = await supabase
        .from('user_assessments')
        .update({ 
          report_generated_at: new Date().toISOString()
        })
        .eq('id', reportId);
      
      if (error) {
        console.error('Error updating report generation status:', error);
      }
      
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      toast.error(`Failed to generate PDF: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="border border-border/50 rounded-2xl overflow-hidden">
      <CardHeader className="pb-2 bg-primary/5">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">Enterprise Career Analysis Report</CardTitle>
        </div>
        <CardDescription>
          Generate a comprehensive professional report with detailed career insights
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium mb-2">Professional Report Contents:</h4>
          <ul className="space-y-1.5 text-sm text-muted-foreground ml-5 list-disc">
            <li>Executive Summary of Career Aptitude</li>
            <li>Personalized Career Path Recommendations</li>
            <li>Detailed Suitability Analysis with Match Percentages</li>
            <li>Comprehensive Skills & Competencies Assessment</li>
            <li>Personality Profile & Work Style Analysis</li>
            <li>Educational Roadmap with Timeline Projections</li>
            <li>Strengths & Development Areas Analysis</li>
            <li>Learning Style & Knowledge Acquisition Patterns</li>
            <li>Industry-Specific Insights & Trends</li>
            <li>Strategic Development Plan (Short/Medium/Long Term)</li>
          </ul>
        </div>
        
        <div className="flex items-center p-4 rounded-lg border border-primary/20 bg-primary/5">
          <div className="flex-1">
            <h3 className="font-medium">Personalized Report for: {userName}</h3>
            <p className="text-sm text-muted-foreground">
              Assessment ID: {reportId}
            </p>
          </div>
          <Button 
            onClick={handleGeneratePDF} 
            disabled={isGenerating || !scores}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {isGenerating ? 'Generating...' : 'Generate PDF Report'}
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p className="italic">
            This report is generated based on your actual assessment responses and provides enterprise-grade 
            career guidance with specific recommendations tailored to your unique profile.
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="bg-primary/5 px-6 py-4 text-xs text-muted-foreground">
        <p>
          Generated reports follow industry standards for career development planning and adhere to strict confidentiality protocols.
        </p>
      </CardFooter>
    </Card>
  );
};

export default ReportPDFGenerator;
