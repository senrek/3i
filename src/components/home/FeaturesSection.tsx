
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { PieChart, FileText, Target, Lightbulb, Briefcase, BookOpen } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "Comprehensive Assessments",
      description: "Take detailed assessments covering aptitude, personality, and interests to build a comprehensive profile."
    },
    {
      icon: <PieChart className="h-8 w-8" />,
      title: "Data-Driven Results",
      description: "Receive personalized career recommendations based on sophisticated matching algorithms."
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Detailed PDF Reports",
      description: "Download comprehensive reports with career pathways, skill analysis, and educational recommendations."
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Career Insights",
      description: "Explore detailed information about recommended careers including requirements, typical tasks, and salary expectations."
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: "Gap Analysis",
      description: "Identify skills and qualifications needed to pursue your ideal career path with actionable guidance."
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Educational Pathways",
      description: "Get clear educational route recommendations tailored to your career goals and current situation."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 sm:text-4xl">Powerful Features for Your Career Journey</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Our platform combines scientifically validated assessments with intelligent analytics to guide your career decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="hover-scale subtle-shadow border border-border/50 rounded-2xl overflow-hidden h-full"
            >
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2 text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-20 max-w-6xl mx-auto">
          <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-4">Interactive Career Exploration</h3>
                <p className="text-muted-foreground mb-6">
                  Navigate through potential career paths with our interactive tools and visualizations. 
                  Explore how your unique combination of skills and interests matches with different professions.
                </p>
                <ul className="space-y-3">
                  {[
                    "Personalized career matching scores",
                    "Detailed skill gap analysis",
                    "Educational pathway mapping",
                    "Industry demand forecasts",
                    "Salary and growth potential insights"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-muted p-4 flex items-center justify-center">
                <div className="w-full max-w-md h-[400px] rounded-xl border border-border/50 bg-card overflow-hidden shadow-md">
                  <div className="p-4 border-b border-border/50 bg-background/50">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Career Match Results</h4>
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-rose-500" />
                        <div className="h-2 w-2 rounded-full bg-amber-500" />
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      </div>
                    </div>
                  </div>
                  <ScrollArea className="h-[346px] p-4">
                    <div className="space-y-4">
                      {[
                        { career: "Software Developer", match: 92 },
                        { career: "Data Scientist", match: 88 },
                        { career: "UX Designer", match: 83 },
                        { career: "Product Manager", match: 79 },
                        { career: "Digital Marketing Specialist", match: 75 },
                        { career: "Business Analyst", match: 73 },
                        { career: "IT Project Manager", match: 70 },
                        { career: "Cybersecurity Analyst", match: 65 },
                      ].map((item, index) => (
                        <div key={index} className="border border-border/50 rounded-lg p-3 bg-background/50 hover:bg-background/80 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{item.career}</span>
                            <span className="text-sm text-primary font-semibold">{item.match}% Match</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary" 
                              style={{ width: `${item.match}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
