
import React from 'react';
import { FileCheck, FileText, Sparkles, Target } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "Take Assessments",
      description: "Complete our three comprehensive assessments covering aptitude, personality, and interests."
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Get Matched",
      description: "Our algorithm analyzes your responses to identify career paths that align with your profile."
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Explore Results",
      description: "View detailed career recommendations with match scores and skill analyses."
    },
    {
      icon: <FileCheck className="h-8 w-8" />,
      title: "Download Report",
      description: "Get a comprehensive PDF report with actionable insights for your career development."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-secondary/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 sm:text-4xl">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Four simple steps to discover your ideal career path with our scientifically validated assessment process.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-12 h-[calc(100%-5rem)] w-px -translate-x-1/2 bg-border md:left-[8.5rem] md:top-1/2 md:h-px md:w-[calc(100%-17rem)]" />

          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center text-center md:items-start md:text-left">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary relative z-10">
                  {step.icon}
                  <div className="absolute -inset-1 rounded-full border border-primary/20" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
