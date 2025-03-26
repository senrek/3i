
import React, { useState, useEffect } from 'react';
import { ArrowRight, Brain, BookOpen, Lightbulb, LayoutDashboard, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AssessmentCard from '@/components/dashboard/AssessmentCard';
import ProgressSummary from '@/components/dashboard/ProgressSummary';
import { assessments } from '@/data/assessments';

const DashboardPage = () => {
  const { user } = useAuth();
  const [assessmentProgress, setAssessmentProgress] = useState<{
    [key: string]: { progress: number; status: 'not_started' | 'in_progress' | 'completed' };
  }>({});
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching assessment progress from an API
  useEffect(() => {
    const fetchAssessmentProgress = async () => {
      // Simulating API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration
      const mockProgress = {
        aptitude: { progress: 100, status: 'completed' as const },
        personality: { progress: 60, status: 'in_progress' as const },
        interest: { progress: 0, status: 'not_started' as const }
      };
      
      setAssessmentProgress(mockProgress);
      setIsLoading(false);
    };
    
    fetchAssessmentProgress();
  }, []);

  // Calculate overall progress
  const totalProgress = Object.values(assessmentProgress).reduce(
    (sum, { progress }) => sum + progress, 0
  ) / (Object.keys(assessmentProgress).length || 1);
  
  const completedAssessments = Object.values(assessmentProgress).filter(
    ({ status }) => status === 'completed'
  ).length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name || 'Guest'}! Track your assessment progress and view your career recommendations.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-6">
        <Card className="md:col-span-4 border border-border/50 rounded-2xl overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Assessment Overview</CardTitle>
                <CardDescription>
                  Complete all three assessments for the most accurate career recommendations
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="gap-1">
                <Link to="/assessments">
                  <span>View All</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="h-64 rounded-xl bg-muted animate-pulse">
                    <div className="h-full" />
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {assessments.map((assessment) => (
                  <AssessmentCard
                    key={assessment.id}
                    id={assessment.id}
                    title={assessment.title}
                    description={assessment.description}
                    icon={<assessment.icon className="h-6 w-6" />}
                    duration={assessment.duration}
                    questionCount={assessment.questionCount}
                    progress={assessmentProgress[assessment.id]?.progress || 0}
                    status={assessmentProgress[assessment.id]?.status || 'not_started'}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <ProgressSummary
            totalProgress={totalProgress}
            assessmentsCompleted={completedAssessments}
            totalAssessments={assessments.length}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border border-border/50 rounded-2xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <span>Top Career Match</span>
            </CardTitle>
            <CardDescription>Based on your completed assessments</CardDescription>
          </CardHeader>
          <CardContent>
            {completedAssessments > 0 ? (
              <div className="rounded-lg border border-border p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">Software Developer</h3>
                  <span className="text-primary font-medium">89% Match</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Design, develop, and maintain software applications and systems for various platforms.
                </p>
                <Button asChild size="sm" className="w-full rounded-lg">
                  <Link to="/reports">View Details</Link>
                </Button>
              </div>
            ) : (
              <div className="rounded-lg border border-border border-dashed p-4 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Complete at least one assessment to get your career matches.
                </p>
                <Button asChild size="sm" variant="outline" className="rounded-lg">
                  <Link to="/assessments/aptitude">Start Aptitude Assessment</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-border/50 rounded-2xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-primary" />
              <span>Assessment Insights</span>
            </CardTitle>
            <CardDescription>Summary of your assessment results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Logical Thinking</p>
                <p className="font-medium">Excellent</p>
              </div>
              <div className="rounded-lg bg-muted p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Communication</p>
                <p className="font-medium">Good</p>
              </div>
              <div className="rounded-lg bg-muted p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Creativity</p>
                <p className="font-medium">Average</p>
              </div>
              <div className="rounded-lg bg-muted p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Leadership</p>
                <p className="font-medium">Good</p>
              </div>
            </div>
            
            <Button asChild variant="outline" size="sm" className="w-full rounded-lg">
              <Link to="/reports">View Full Report</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-border/50 rounded-2xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <span>Next Steps</span>
            </CardTitle>
            <CardDescription>Recommended actions for your journey</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                {
                  text: "Complete Personality Assessment",
                  link: "/assessments/personality",
                  completed: assessmentProgress.personality?.status === 'completed'
                },
                {
                  text: "Take Interest Assessment",
                  link: "/assessments/interest",
                  completed: assessmentProgress.interest?.status === 'completed'
                },
                {
                  text: "Review Career Recommendations",
                  link: "/reports",
                  completed: false
                },
                {
                  text: "Download Detailed PDF Report",
                  link: "/reports/download",
                  completed: false
                }
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className={`mt-0.5 h-5 w-5 rounded-full border flex items-center justify-center ${
                    item.completed ? "border-green-500 bg-green-500/10 text-green-500" : "border-primary bg-primary/10 text-primary"
                  }`}>
                    {item.completed ? (
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <Link 
                      to={item.link} 
                      className={`text-sm font-medium hover:text-primary ${
                        item.completed ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {item.text}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
