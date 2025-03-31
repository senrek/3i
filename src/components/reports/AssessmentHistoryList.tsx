
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileDown, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { generatePDF } from './ReportPDFGenerator';

interface Assessment {
  id: string;
  completed_at: string;
  report_generated_at: string | null;
  assessment_id: string;
  scores: any;
  responses: Record<string, string>;
}

const AssessmentHistoryList: React.FC = () => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchAssessments();
    }
  }, [user]);

  const fetchAssessments = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_assessments')
        .select('*')
        .eq('user_id', user?.id)
        .order('completed_at', { ascending: false });

      if (error) {
        throw error;
      }

      setAssessments(data || []);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      toast.error('Failed to load assessment history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async (assessment: Assessment) => {
    try {
      setGeneratingPDF(assessment.id);

      // Determine assessment type (junior vs senior)
      const isJuniorAssessment = assessment.assessment_id?.includes('junior') || 
                                assessment.responses?.assessment_type === 'career-analysis-junior';

      // Get profile info for the user
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, last_name, email')
        .eq('id', user?.id)
        .single();

      // Construct user name
      const firstName = profileData?.first_name || '';
      const lastName = profileData?.last_name || '';
      const userName = (firstName || lastName) 
        ? `${firstName} ${lastName}`.trim()
        : user?.email || 'User';

      // Analyze responses to determine strengths and development areas
      const { strengthAreas, developmentAreas } = analyzeResponses(assessment.responses);

      // Generate PDF
      await generatePDF(
        assessment.id,
        userName,
        assessment.scores,
        assessment.responses,
        strengthAreas,
        developmentAreas,
        isJuniorAssessment
      );

      // Update the report_generated_at timestamp in Supabase
      await supabase
        .from('user_assessments')
        .update({ report_generated_at: new Date().toISOString() })
        .eq('id', assessment.id);

      // Update local state
      setAssessments(prev => 
        prev.map(a => 
          a.id === assessment.id 
            ? { ...a, report_generated_at: new Date().toISOString() } 
            : a
        )
      );

      toast.success('PDF report generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF report');
    } finally {
      setGeneratingPDF(null);
    }
  };

  // Helper function to analyze responses to determine strengths and development areas
  const analyzeResponses = (responses: Record<string, string>) => {
    // Default values if can't analyze properly
    const defaultStrengths = ['Problem Solving', 'Critical Thinking', 'Adaptability'];
    const defaultDevelopmentAreas = ['Technical Skills', 'Leadership', 'Time Management'];

    try {
      if (!responses) {
        return {
          strengthAreas: defaultStrengths,
          developmentAreas: defaultDevelopmentAreas
        };
      }

      // Categorize responses by question type
      const aptitudeQuestions = Object.entries(responses).filter(([id]) => 
        id.startsWith('apt_') || (Number(id.replace(/\D/g, '')) >= 1 && Number(id.replace(/\D/g, '')) <= 53)
      );
      
      const personalityQuestions = Object.entries(responses).filter(([id]) => 
        id.startsWith('per_') || (Number(id.replace(/\D/g, '')) >= 54 && Number(id.replace(/\D/g, '')) <= 77)
      );
      
      const interestQuestions = Object.entries(responses).filter(([id]) => 
        id.startsWith('int_') || (Number(id.replace(/\D/g, '')) >= 78 && Number(id.replace(/\D/g, '')) <= 92)
      );

      // Generate strength areas based on high-scoring answers (A and B)
      const strengthAreas: string[] = [];
      
      if (aptitudeQuestions.filter(([, val]) => val === 'A' || val === 'B').length > 3) {
        strengthAreas.push('Analytical Thinking');
      }
      
      if (personalityQuestions.filter(([, val]) => val === 'A' || val === 'B').length > 3) {
        strengthAreas.push('Communication Skills');
      }
      
      if (interestQuestions.filter(([, val]) => val === 'A' || val === 'B').length > 3) {
        strengthAreas.push('Creativity');
      }
      
      if (aptitudeQuestions.filter(([, val]) => val === 'A').length > 2) {
        strengthAreas.push('Problem Solving');
      }
      
      if (personalityQuestions.filter(([, val]) => val === 'A').length > 2) {
        strengthAreas.push('Leadership');
      }

      // Generate development areas based on low-scoring answers (C and D)
      const developmentAreas: string[] = [];
      
      if (aptitudeQuestions.filter(([, val]) => val === 'C' || val === 'D').length > 2) {
        developmentAreas.push('Technical Skills');
      }
      
      if (personalityQuestions.filter(([, val]) => val === 'C' || val === 'D').length > 2) {
        developmentAreas.push('Interpersonal Skills');
      }
      
      if (interestQuestions.filter(([, val]) => val === 'C' || val === 'D').length > 2) {
        developmentAreas.push('Career Focus');
      }
      
      if (aptitudeQuestions.filter(([, val]) => val === 'D').length > 1) {
        developmentAreas.push('Critical Thinking');
      }

      // Ensure we have at least some default values if nothing is detected
      if (strengthAreas.length === 0) {
        strengthAreas.push(...defaultStrengths);
      }
      
      if (developmentAreas.length === 0) {
        developmentAreas.push(...defaultDevelopmentAreas);
      }

      return {
        strengthAreas,
        developmentAreas
      };
    } catch (error) {
      console.error('Error analyzing responses:', error);
      return {
        strengthAreas: defaultStrengths,
        developmentAreas: defaultDevelopmentAreas
      };
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'N/A';
      }
      
      return new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return 'N/A';
    }
  };

  // Get assessment type display name
  const getAssessmentTypeName = (assessmentId: string) => {
    if (assessmentId.includes('junior')) {
      return 'Class 8-10 Assessment';
    } else {
      return 'Class 11-12 Assessment';
    }
  };

  return (
    <Card className="border border-border/50 rounded-lg shadow-sm">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-xl">Assessment History</CardTitle>
        <CardDescription>
          View and download your past assessment reports
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : assessments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No assessment history</h3>
            <p className="text-muted-foreground mt-2">
              Complete an assessment to see your history here
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date Taken</TableHead>
                  <TableHead>Assessment Type</TableHead>
                  <TableHead>Last Generated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessments.map((assessment) => (
                  <TableRow key={assessment.id}>
                    <TableCell className="font-medium">
                      {formatDate(assessment.completed_at)}
                    </TableCell>
                    <TableCell>
                      {getAssessmentTypeName(assessment.assessment_id)}
                    </TableCell>
                    <TableCell>
                      {assessment.report_generated_at 
                        ? formatDate(assessment.report_generated_at) 
                        : 'Never'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadPDF(assessment)}
                        disabled={generatingPDF === assessment.id}
                        className="flex items-center gap-1"
                      >
                        <FileDown className="h-4 w-4" />
                        {generatingPDF === assessment.id ? 'Generating...' : 'Download PDF'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssessmentHistoryList;
