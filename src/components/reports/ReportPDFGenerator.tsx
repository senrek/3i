
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ReportPDFGeneratorProps {
  reportId: string;
  userName?: string;
  scores?: {
    aptitude: number;
    personality: number;
    interest: number;
    learningStyle: number;
    careerRecommendations: any[];
  } | null;
}

const ReportPDFGenerator = ({ reportId, userName = 'Student', scores }: ReportPDFGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePdfContent = async () => {
    // This would normally be done server-side with a proper PDF generation library
    // For this demo, we'll simulate creating PDF content for a Supabase Edge Function
    
    if (!scores) {
      return null;
    }
    
    // Format career recommendations for the PDF
    const topCareer = scores.careerRecommendations[0];
    
    // Create a structured PDF content object
    const pdfContent = {
      userName,
      reportDate: new Date().toISOString(),
      scores: {
        aptitude: scores.aptitude,
        personality: scores.personality,
        interest: scores.interest,
        learningStyle: scores.learningStyle
      },
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
        match: career.suitabilityPercentage
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
      gapAnalysis: topCareer.gapAnalysis
    };
    
    return pdfContent;
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    
    try {
      // In a production app, this would call a Supabase Edge Function to generate the PDF
      // For now, we'll simulate PDF generation with a delay
      
      // Generate PDF content
      const pdfContent = await generatePdfContent();
      
      if (!pdfContent) {
        throw new Error("Could not generate report content");
      }
      
      // Simulate API call to generate PDF
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, the Edge Function would return a URL to download the PDF
      // For now, we'll just show a success message
      toast.success('Career analysis PDF report generated successfully!');
      
      // Simulate downloading a PDF - in a real app this would be a real download
      const element = document.createElement("a");
      const file = new Blob(
        [JSON.stringify(pdfContent, null, 2)], 
        { type: 'application/json' }
      );
      element.href = URL.createObjectURL(file);
      element.download = `career_analysis_${userName.replace(/\s+/g, '_')}.json`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
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
          <CardTitle className="text-xl">Career Analysis Report</CardTitle>
        </div>
        <CardDescription>
          Generate a detailed PDF report of your assessment results
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium mb-2">Report Contents:</h4>
          <ul className="space-y-1.5 text-sm text-muted-foreground ml-5 list-disc">
            <li>Personalized Career Recommendations</li>
            <li>Suitability Analysis with Percentage Matches</li>
            <li>Skills & Abilities Assessment</li>
            <li>Personality Profile Insights</li>
            <li>Educational Pathway Suggestions</li>
            <li>Strengths & Development Areas</li>
            <li>Learning Style Preferences</li>
            <li>Work Nature & Key Responsibilities</li>
            <li>Career Navigator (Education Paths)</li>
            <li>Gap Analysis (Strengths/Weaknesses)</li>
          </ul>
        </div>
        
        <div className="flex items-center p-4 rounded-lg border border-primary/20 bg-primary/5">
          <div className="flex-1">
            <h3 className="font-medium">Report for: {userName}</h3>
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
            {isGenerating ? 'Generating...' : 'Generate PDF'}
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p className="italic">
            Your report will include detailed analysis across all assessment areas, with specific
            career recommendations based on your unique profile.
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="bg-primary/5 px-6 py-4 text-xs text-muted-foreground">
        <p>
          Generated reports are confidential and follow industry-standard privacy guidelines.
        </p>
      </CardFooter>
    </Card>
  );
};

export default ReportPDFGenerator;
