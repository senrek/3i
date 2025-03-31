
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ReportSummaryCardProps {
  reportData: {
    id: string;
    completedAt?: string; // Changed from completedDate to completedAt and made optional
    assessmentCompleted: boolean;
  } | null;
  formatDate: (dateString: string) => string;
}

const ReportSummaryCard = ({ reportData, formatDate }: ReportSummaryCardProps) => {
  // Safe date formatting function that handles invalid dates
  const safeFormatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    try {
      return formatDate(dateString);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  return (
    <Card className="border border-border/50 rounded-2xl overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5 text-primary" />
              <span>Career Analysis Summary</span>
            </CardTitle>
            <CardDescription>
              Last updated on {reportData && reportData.completedAt ? safeFormatDate(reportData.completedAt) : 'N/A'}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
              <span>{reportData?.assessmentCompleted ? 'Assessment Completed' : 'Not Completed'}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Assessment Progress</span>
            <span className="text-sm font-medium">
              {reportData?.assessmentCompleted ? '100%' : '0%'}
            </span>
          </div>
          <Progress 
            value={reportData?.assessmentCompleted ? 100 : 0} 
            className="h-2"
          />
        </div>
        
        <div className="rounded-lg border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-medium">Career Analysis for Class 11-12</h3>
              <p className="text-sm text-muted-foreground">Comprehensive assessment of aptitude, personality, and interests</p>
            </div>
            <Badge 
              variant={reportData?.assessmentCompleted ? 'default' : 'outline'}
              className={reportData?.assessmentCompleted ? 'bg-green-500 text-white hover:bg-green-600' : ''}
            >
              {reportData?.assessmentCompleted ? 'Completed' : 'Not Started'}
            </Badge>
          </div>
          <Button 
            asChild 
            variant={reportData?.assessmentCompleted ? 'outline' : 'default'} 
            className="w-full mt-2 text-sm h-9 rounded-lg"
          >
            <Link to={reportData?.assessmentCompleted 
              ? '/reports' 
              : '/assessments/career-analysis'
            }>
              {reportData?.assessmentCompleted ? 'View Detailed Results' : 'Take Assessment'}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportSummaryCard;
