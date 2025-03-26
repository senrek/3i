
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AssessmentCard from '@/components/dashboard/AssessmentCard';
import { assessments } from '@/data/assessments';

const AssessmentsPage = () => {
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

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
        <p className="text-muted-foreground">
          Complete all three assessments to get the most accurate career recommendations.
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="not_started">Not Started</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
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
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          {isLoading ? (
            <div className="h-64 rounded-xl bg-muted animate-pulse" />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {assessments
                .filter((assessment) => assessmentProgress[assessment.id]?.status === 'completed')
                .map((assessment) => (
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
        </TabsContent>
        
        <TabsContent value="in_progress" className="mt-6">
          {isLoading ? (
            <div className="h-64 rounded-xl bg-muted animate-pulse" />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {assessments
                .filter((assessment) => assessmentProgress[assessment.id]?.status === 'in_progress')
                .map((assessment) => (
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
        </TabsContent>
        
        <TabsContent value="not_started" className="mt-6">
          {isLoading ? (
            <div className="h-64 rounded-xl bg-muted animate-pulse" />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {assessments
                .filter((assessment) => !assessmentProgress[assessment.id] || assessmentProgress[assessment.id]?.status === 'not_started')
                .map((assessment) => (
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
        </TabsContent>
      </Tabs>
      
      <div className="bg-muted rounded-xl p-6 mt-8">
        <h3 className="text-lg font-semibold mb-2">Assessment Tips</h3>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Answer honestly for the most accurate results.</li>
          <li>Complete all three assessments for comprehensive career recommendations.</li>
          <li>You can pause and resume assessments at any time.</li>
          <li>Each assessment takes approximately 10-15 minutes to complete.</li>
          <li>Your responses are confidential and used only for generating your career recommendations.</li>
        </ul>
      </div>
    </div>
  );
};

export default AssessmentsPage;
