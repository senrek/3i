
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, PencilRuler, BookOpen, User } from "lucide-react";
import { assessments } from '@/data/assessments';

const AssessmentsPage = () => {
  return (
    <div className="container mx-auto max-w-screen-xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
        <p className="text-muted-foreground">
          Complete these assessments to discover your ideal career path and educational journey.
        </p>
      </div>
      
      {/* Main Assessments */}
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">
            Comprehensive Career Assessments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assessments.map((assessment) => (
              <Card key={assessment.id} className="overflow-hidden border-border/50">
                <CardHeader className="bg-muted/50 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Brain className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{assessment.title}</CardTitle>
                      <CardDescription>{assessment.type === 'unified' ? 'Unified Assessment' : 'Multiple Sections'}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    {assessment.description}
                  </p>
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="bg-muted/30 px-3 py-1 rounded-full text-xs">
                      {assessment.questionCount} questions
                    </div>
                    <div className="bg-muted/30 px-3 py-1 rounded-full text-xs">
                      {assessment.duration} minutes
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 pt-4">
                  <Button asChild className="w-full">
                    <Link to={`/assessments/${assessment.id}`}>
                      Start Assessment
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Additional Resources */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">
            Additional Self-Discovery Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <PencilRuler className="h-4 w-4 text-blue-600" />
                  </div>
                  <CardTitle className="text-base">Skills Assessment</CardTitle>
                </div>
                <CardDescription>
                  Identify your key strengths and competencies
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Discover your transferable skills and areas for development.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-green-600" />
                  </div>
                  <CardTitle className="text-base">Learning Style</CardTitle>
                </div>
                <CardDescription>
                  Discover how you learn most effectively
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Understand your preferred methods of learning and information processing.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-purple-600" />
                  </div>
                  <CardTitle className="text-base">Work Values</CardTitle>
                </div>
                <CardDescription>
                  Identify what matters most in your career
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Assess the workplace factors that will contribute to your job satisfaction.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentsPage;
