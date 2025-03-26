
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, BarChart, CheckCircle2, Award, BookOpen } from "lucide-react";
import ProgressSummary from '@/components/dashboard/ProgressSummary';
import AssessmentCard from '@/components/dashboard/AssessmentCard';
import { assessments } from '@/data/assessments';

const DashboardPage = () => {
  return (
    <div className="container mx-auto max-w-screen-xl">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your career guidance dashboard. Track your progress and discover your potential.
          </p>
        </div>
        <Button asChild>
          <Link to="/assessments">View All Assessments</Link>
        </Button>
      </div>
      
      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="space-y-8 md:col-span-2">
          {/* Progress Summary */}
          <ProgressSummary />
          
          {/* Assessments Grid */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">
              Continue Your Assessment Journey
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assessments.map((assessment) => (
                <AssessmentCard 
                  key={assessment.id}
                  id={assessment.id}
                  title={assessment.title}
                  description={assessment.description}
                  icon={assessment.icon}
                  progress={0}
                  questionCount={assessment.questionCount}
                  duration={assessment.duration}
                />
              ))}
            </div>
          </div>
          
          {/* Resources */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">
              Learning Resources
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Career Exploration</CardTitle>
                  <CardDescription>
                    Learn about different career paths
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <BookOpen size={20} className="text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Explore detailed information about various professions and their requirements.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Access Resource
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Skill Building</CardTitle>
                  <CardDescription>
                    Courses to develop crucial skills
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Award size={20} className="text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Access courses and materials to build skills relevant to your career interests.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Browse Courses
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-8">
          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Progress</CardTitle>
              <CardDescription>
                Weekly assessment completion stats
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <LineChart size={20} className="text-primary" />
              </div>
              <div className="h-[200px] flex items-center justify-center border rounded-md bg-muted/50">
                <p className="text-sm text-muted-foreground">Complete assessments to see your progress data</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </CardFooter>
          </Card>
          
          {/* Completion Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Completion Overview</CardTitle>
              <CardDescription>
                Your assessment completion status
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BarChart size={20} className="text-primary" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Career Analysis</span>
                  <span className="text-sm text-muted-foreground">0%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: '0%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Career Plan</span>
                  <span className="text-sm text-muted-foreground">0%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: '0%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Skills Assessment</span>
                  <span className="text-sm text-muted-foreground">0%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full flex items-center justify-center p-2 bg-muted/50 rounded-md">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Complete all assessments for a detailed report
                  </span>
                </div>
              </div>
            </CardFooter>
          </Card>
          
          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/assessments" 
                    className="text-sm text-primary hover:underline"
                  >
                    All Assessments
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/reports" 
                    className="text-sm text-primary hover:underline"
                  >
                    Your Reports
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/assessments/career-analysis" 
                    className="text-sm text-primary hover:underline"
                  >
                    Start Career Analysis
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
