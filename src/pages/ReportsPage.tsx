
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import CareerResultCard from '@/components/reports/CareerResultCard';
import SkillRadarChart from '@/components/reports/SkillRadarChart';
import ReportPDFGenerator from '@/components/reports/ReportPDFGenerator';
import { careerResults } from '@/data/careerResults';

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
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Assessment Reports</h1>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>All Reports</DropdownMenuItem>
                <DropdownMenuItem>Completed Reports</DropdownMenuItem>
                <DropdownMenuItem>Incomplete Reports</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button asChild size="sm" variant="outline" className="gap-1">
              <Link to="/reports/download">
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Link>
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">
          View your assessment results and career recommendations
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-6 lg:grid-cols-8">
          <div className="md:col-span-6 lg:col-span-5 space-y-6">
            <div className="h-32 bg-muted rounded-xl animate-pulse" />
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="h-64 bg-muted rounded-xl animate-pulse" />
              <div className="h-64 bg-muted rounded-xl animate-pulse" />
            </div>
          </div>
          <div className="md:col-span-2 lg:col-span-3 space-y-6">
            <div className="h-96 bg-muted rounded-xl animate-pulse" />
          </div>
        </div>
      ) : (
        <>
          <Card className="border border-border/50 rounded-2xl overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <FileText className="h-5 w-5 text-primary" />
                    <span>Career Analysis Summary</span>
                  </CardTitle>
                  <CardDescription>
                    Last updated on {reportData ? formatDate(reportData.completedDate) : 'N/A'}
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

          {reportData?.assessmentCompleted && (
            <>
              <ReportPDFGenerator reportId={reportData.id} userName="John Doe" />

              <Tabs defaultValue="careers" className="space-y-6">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="careers">Career Matches</TabsTrigger>
                  <TabsTrigger value="skills">Skill Analysis</TabsTrigger>
                </TabsList>
                
                <TabsContent value="careers" className="mt-0 space-y-6">
                  <div className="grid gap-6 md:grid-cols-6 lg:grid-cols-8">
                    <div className="md:col-span-6 lg:col-span-5 space-y-6">
                      <div className="grid gap-6 sm:grid-cols-2">
                        {careerResults.slice(0, 4).map((career, index) => (
                          <CareerResultCard
                            key={career.id}
                            title={career.title}
                            matchPercentage={career.matchPercentage}
                            description={career.description}
                            skills={career.skills}
                            isPrimary={index === 0}
                            reportId={reportData?.id || 'report-1'}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                      <Card className="border border-border/50 rounded-2xl overflow-hidden h-full">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xl">Career Insights</CardTitle>
                          <CardDescription>
                            Based on your assessment
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="space-y-4">
                            <h3 className="text-sm font-medium">Career Focus Areas</h3>
                            <div className="space-y-2">
                              {[
                                { label: 'Technology', percentage: 85 },
                                { label: 'Business', percentage: 70 },
                                { label: 'Creative', percentage: 65 },
                                { label: 'Science', percentage: 60 },
                                { label: 'Social', percentage: 45 },
                              ].map((area, index) => (
                                <div key={index} className="space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{area.label}</span>
                                    <span className="font-medium">{area.percentage}%</span>
                                  </div>
                                  <Progress value={area.percentage} className="h-1.5" />
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <h3 className="text-sm font-medium">Education Pathways</h3>
                            <ul className="space-y-2 text-sm">
                              {[
                                "Bachelor's degree in Computer Science or related field",
                                "Coding bootcamps for technical foundations",
                                "Specialized certifications in technologies",
                                "Advanced degrees for specialized roles",
                              ].map((path, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                                  <span className="text-muted-foreground">{path}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="skills" className="mt-0 space-y-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                      <SkillRadarChart 
                        skills={skillData} 
                        title="Your Skill Profile"
                        description="Visual representation of your strengths and areas for development"
                      />
                    </div>
                    <div>
                      <Card className="border border-border/50 rounded-2xl overflow-hidden h-full">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xl">Skill Gaps</CardTitle>
                          <CardDescription>
                            Areas for improvement based on your target careers
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="space-y-4">
                            {[
                              { skill: 'Leadership', level: 'Develop', description: 'Consider taking on team lead roles or management training courses.' },
                              { skill: 'Communication', level: 'Enhance', description: 'Practice public speaking and presenting technical concepts to non-technical audiences.' },
                              { skill: 'Creativity', level: 'Enhance', description: 'Engage in projects requiring innovative problem-solving and divergent thinking.' },
                            ].map((gap, index) => (
                              <div key={index} className="rounded-lg border border-border p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium">{gap.skill}</span>
                                  <Badge 
                                    variant="outline" 
                                    className={gap.level === 'Develop' 
                                      ? 'border-amber-500 bg-amber-500/10 text-amber-700' 
                                      : 'border-blue-500 bg-blue-500/10 text-blue-700'}
                                  >
                                    {gap.level}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {gap.description}
                                </p>
                              </div>
                            ))}
                          </div>
                          
                          <Button asChild variant="outline" className="w-full rounded-xl">
                            <Link to="/reports/skills">
                              View Full Skill Analysis
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ReportsPage;
