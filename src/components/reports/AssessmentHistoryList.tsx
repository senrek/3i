
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDown, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { generatePDF } from './ReportPDFGenerator'; // Assuming this is the function to generate PDF
import { formatDistanceToNow } from 'date-fns';

interface AssessmentRecord {
  id: string;
  completed_at: string;
  assessment_id: string;
  scores: any;
  responses: any;
}

const AssessmentHistoryList = () => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchAssessmentHistory() {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('user_assessments')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching assessment history:', error);
          toast.error('Failed to load assessment history');
          return;
        }
        
        setAssessments(data || []);
      } catch (err) {
        console.error('Unexpected error:', err);
        toast.error('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchAssessmentHistory();
  }, [user]);

  const handleDownloadPDF = async (assessment: AssessmentRecord) => {
    try {
      setIsGenerating(prev => ({ ...prev, [assessment.id]: true }));
      
      // Fetch the user profile to get name
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user?.id)
        .single();
      
      const userName = profile?.first_name && profile?.last_name 
        ? `${profile.first_name} ${profile.last_name}`
        : user?.email || 'User';
      
      await generatePDF(
        assessment.id,
        userName,
        assessment.scores,
        assessment.responses,
        // Default strengths and weaknesses if not available
        assessment.scores?.strengthAreas || ['Problem Solving', 'Critical Thinking'],
        assessment.scores?.developmentAreas || ['Technical Skills', 'Time Management']
      );
      
      toast.success('PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setIsGenerating(prev => ({ ...prev, [assessment.id]: false }));
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getAssessmentType = (id: string) => {
    if (id === 'career-analysis') return 'Class 11-12 Assessment';
    if (id === 'career-analysis-junior') return 'Class 8-10 Assessment';
    return 'Career Assessment';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assessment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">
            Loading assessment history...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (assessments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assessment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">
            No assessment history found. Complete an assessment to see your history.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessment History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assessments.map((assessment) => (
            <div 
              key={assessment.id} 
              className="flex items-center justify-between p-4 rounded-lg border border-border/40 hover:bg-accent/10 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <Calendar className="h-10 w-10 text-primary/70" />
                <div>
                  <h4 className="font-medium">{getAssessmentType(assessment.assessment_id)}</h4>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>{formatDate(assessment.completed_at)}</span>
                    <span className="text-xs bg-primary/10 px-2 py-0.5 rounded-full">
                      {formatDistanceToNow(new Date(assessment.completed_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => handleDownloadPDF(assessment)}
                disabled={isGenerating[assessment.id]}
              >
                <FileDown className="h-4 w-4" />
                {isGenerating[assessment.id] ? 'Generating...' : 'Download PDF'}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentHistoryList;
