
import React, { useState, useEffect } from 'react';
import ReportHeader from '@/components/reports/ReportHeader';
import LoadingPlaceholder from '@/components/reports/LoadingPlaceholder';
import ReportSummaryCard from '@/components/reports/ReportSummaryCard';
import ReportPDFGenerator from '@/components/reports/ReportPDFGenerator';
import ReportTabs from '@/components/reports/ReportTabs';

const ReportsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<{
    id: string;
    completedDate: string;
    assessmentCompleted: boolean;
  } | null>(null);

  // Simulate fetching report data from an API
  useEffect(() => {
    const fetchReportData = async () => {
      // Simulating API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration
      const mockReportData = {
        id: 'report-1',
        completedDate: new Date().toISOString(),
        assessmentCompleted: true,
      };
      
      setReportData(mockReportData);
      setIsLoading(false);
    };
    
    fetchReportData();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  // Mock skill data for the radar chart
  const skillData = [
    { name: 'Analytical', value: 85, fullMark: 100 },
    { name: 'Communication', value: 65, fullMark: 100 },
    { name: 'Technical', value: 90, fullMark: 100 },
    { name: 'Creativity', value: 70, fullMark: 100 },
    { name: 'Leadership', value: 60, fullMark: 100 },
    { name: 'Problem Solving', value: 80, fullMark: 100 },
  ];

  return (
    <div className="space-y-8">
      <ReportHeader />

      {isLoading ? (
        <LoadingPlaceholder />
      ) : (
        <>
          <ReportSummaryCard 
            reportData={reportData} 
            formatDate={formatDate} 
          />

          {reportData?.assessmentCompleted && (
            <>
              <ReportPDFGenerator reportId={reportData.id} userName="John Doe" />
              <ReportTabs reportId={reportData.id} skillData={skillData} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ReportsPage;
