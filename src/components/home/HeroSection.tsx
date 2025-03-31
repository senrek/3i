
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart2, BookOpen, Brain } from 'lucide-react';

const HeroSection = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative overflow-hidden pt-10 pb-16">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/10 dark:to-indigo-950/10" />
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
        <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-10 text-center">
        <div className="flex justify-center">
          <div className="inline-flex items-center rounded-full border border-border/40 bg-background/80 px-3 py-1 text-sm backdrop-blur">
            <span className="mx-1 inline-block rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
              New
            </span>
            <span className="text-muted-foreground">
              Introducing CareerPath Assessment Platform
            </span>
          </div>
        </div>

        <h1 className="mt-8 max-w-4xl mx-auto text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Discover your <span className="text-primary">ideal career path</span> with personalized assessments
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Take our comprehensive assessments to gain insights into your strengths, interests, and personality. 
          Let data-driven guidance shape your professional future.
        </p>
        
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button asChild className="rounded-xl px-8 py-6 text-base" size="lg">
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              {isAuthenticated ? "Go to Dashboard" : "Get Started"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl px-8 py-6 text-base" size="lg">
            <Link to="/about">Learn More</Link>
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: <Brain className="h-8 w-8" />,
              title: "Aptitude Assessment",
              description: "Identify your natural abilities and cognitive strengths to match with suitable careers."
            },
            {
              icon: <BookOpen className="h-8 w-8" />,
              title: "Personality Assessment",
              description: "Understand your work style, motivations, and workplace preferences for better job satisfaction."
            },
            {
              icon: <BarChart2 className="h-8 w-8" />,
              title: "Interest Assessment",
              description: "Discover areas of work that align with your interests and passions for long-term engagement."
            }
          ].map((feature, index) => (
            <div key={index} className="glass-card p-6 backdrop-blur-md animate-fade-in">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2 text-primary">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
