
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { toast } from 'sonner';

interface ReportPDFGeneratorProps {
  reportId: string;
  userName?: string;
}

const ReportPDFGenerator = ({ reportId, userName = 'Student' }: ReportPDFGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    
    // In a real application, you would call a backend service to generate the PDF
    // This is just a simulation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success('Career analysis PDF report generated successfully!');
    // In a real app, you would download the actual PDF
    
    setIsGenerating(false);
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
            disabled={isGenerating}
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
