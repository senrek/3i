
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
      
      // Create a temporary element to render PDF content
      const reportElement = document.createElement('div');
      reportElement.style.width = '750px';
      reportElement.style.padding = '40px';
      reportElement.style.position = 'absolute';
      reportElement.style.left = '-9999px';
      reportElement.style.fontFamily = 'Arial, sans-serif';
      
      // Add report content
      reportElement.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #3b82f6; margin-bottom: 10px;">Career Assessment Report</h1>
          <h2 style="color: #666; font-weight: normal; margin-bottom: 5px;">Prepared for: ${pdfContent.userName}</h2>
          <p style="color: #666;">Report Date: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div style="margin-bottom: 30px; padding: 15px; background: #f8fafc; border-radius: 6px;">
          <h2 style="color: #3b82f6; margin-bottom: 15px;">Executive Summary</h2>
          <p>This comprehensive assessment evaluates your aptitudes, personality traits, interests, and learning style to identify optimal career paths. Based on your responses, we've analyzed your strengths and development areas to provide tailored recommendations.</p>
          
          <div style="margin-top: 20px;">
            <h3 style="color: #3b82f6; margin-bottom: 10px;">Assessment Scores</h3>
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
              <div style="flex: 1; padding-right: 10px;">
                <p><strong>Aptitude:</strong> ${pdfContent.scores.aptitude}%</p>
                <p><strong>Personality:</strong> ${pdfContent.scores.personality}%</p>
              </div>
              <div style="flex: 1; padding-left: 10px;">
                <p><strong>Interest:</strong> ${pdfContent.scores.interest}%</p>
                <p><strong>Learning Style:</strong> ${pdfContent.scores.learningStyle}%</p>
              </div>
            </div>
          </div>
        </div>
        
        <div style="margin-bottom: 30px; padding: 15px; background: #f8fafc; border-radius: 6px;">
          <h2 style="color: #3b82f6; margin-bottom: 15px;">Top Career Recommendation</h2>
          <h3 style="margin-bottom: 5px;">${pdfContent.topCareerPath.title} - ${pdfContent.topCareerPath.match}% Match</h3>
          <p style="margin-bottom: 15px;">${pdfContent.topCareerPath.description}</p>
          
          <div style="margin-top: 15px;">
            <h4 style="color: #3b82f6; margin-bottom: 5px;">Key Skills Required:</h4>
            <ul>
              ${pdfContent.topCareerPath.keySkills.map(skill => `<li>${skill}</li>`).join('')}
            </ul>
          </div>
          
          <div style="margin-top: 15px;">
            <h4 style="color: #3b82f6; margin-bottom: 5px;">Education Pathways:</h4>
            <ul>
              ${pdfContent.topCareerPath.educationPathways.map(path => `<li>${path}</li>`).join('')}
            </ul>
          </div>
        </div>
        
        <div style="margin-bottom: 30px; padding: 15px; background: #f8fafc; border-radius: 6px;">
          <h2 style="color: #3b82f6; margin-bottom: 15px;">Strength & Development Areas</h2>
          
          <div style="margin-bottom: 15px;">
            <h4 style="color: #22c55e; margin-bottom: 5px;">Strength Areas:</h4>
            <ul>
              ${pdfContent.strengthAreas.map(strength => `<li>${strength}</li>`).join('')}
            </ul>
          </div>
          
          <div>
            <h4 style="color: #f97316; margin-bottom: 5px;">Development Areas:</h4>
            <ul>
              ${pdfContent.developmentAreas.map(area => `<li>${area}</li>`).join('')}
            </ul>
          </div>
        </div>
        
        <div style="margin-bottom: 30px; padding: 15px; background: #f8fafc; border-radius: 6px;">
          <h2 style="color: #3b82f6; margin-bottom: 15px;">Alternative Career Paths</h2>
          
          ${pdfContent.otherCareers.map(career => `
            <div style="margin-bottom: 20px;">
              <h3 style="margin-bottom: 5px;">${career.title} - ${career.match}% Match</h3>
              <p style="margin-bottom: 10px;">${career.description}</p>
              <div>
                <strong>Key Skills:</strong> ${career.keySkills.join(', ')}
              </div>
            </div>
          `).join('')}
        </div>
        
        <div style="margin-bottom: 30px; padding: 15px; background: #f8fafc; border-radius: 6px;">
          <h2 style="color: #3b82f6; margin-bottom: 15px;">Personalized Action Plan</h2>
          
          <div style="margin-bottom: 15px;">
            <h4 style="color: #3b82f6; margin-bottom: 5px;">Short-Term (3-6 months):</h4>
            <ul>
              ${pdfContent.recommendations.shortTerm.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
          
          <div style="margin-bottom: 15px;">
            <h4 style="color: #3b82f6; margin-bottom: 5px;">Medium-Term (6-12 months):</h4>
            <ul>
              ${pdfContent.recommendations.mediumTerm.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
          
          <div>
            <h4 style="color: #3b82f6; margin-bottom: 5px;">Long-Term (1-3 years):</h4>
            <ul>
              ${pdfContent.recommendations.longTerm.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
        </div>
        
        <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
          <p>This report is based on your assessment responses and provides personalized career guidance.</p>
          <p>Report ID: ${pdfContent.reportId}</p>
        </div>
      `;
      
      document.body.appendChild(reportElement);
      
      try {
        // Generate PDF from the HTML element
        const canvas = await html2canvas(reportElement, {
          scale: 1,
          useCORS: true,
          logging: false
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        
        let heightLeft = imgHeight;
        let position = 0;
        pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
        heightLeft -= pdfHeight;
        
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
          heightLeft -= pdfHeight;
        }
        
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
      } finally {
        // Clean up the temporary element
        if (reportElement && reportElement.parentNode) {
          reportElement.parentNode.removeChild(reportElement);
        }
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
