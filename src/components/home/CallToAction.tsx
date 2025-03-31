
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const CallToAction = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-20">
      <div className="container px-4 mx-auto">
        <div className="relative rounded-3xl border border-border/50 bg-gradient-to-b from-secondary/20 to-background overflow-hidden shadow-xl">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
          <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
          
          <div className="grid items-center py-12 px-6 md:grid-cols-2 md:py-16 md:px-12">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">
                Ready to discover your ideal career path?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Take the first step towards a fulfilling professional journey tailored to your unique abilities and preferences.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild className="rounded-xl px-8 py-6 text-base" size="lg">
                  <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                    {isAuthenticated ? "Go to Dashboard" : "Start Free Assessment"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                {!isAuthenticated && (
                  <Button asChild variant="outline" className="rounded-xl px-8 py-6 text-base" size="lg">
                    <Link to="/login">Sign In</Link>
                  </Button>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative ml-auto aspect-[4/3] max-w-sm overflow-hidden rounded-xl bg-foreground/5 p-2 backdrop-blur">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-background/10 opacity-20" />
                <div className="grid h-full grid-cols-2 gap-2">
                  {[
                    "Software Developer",
                    "Data Scientist",
                    "UX Designer",
                    "Marketing Specialist",
                    "Project Manager",
                    "Physician",
                    "Financial Analyst",
                    "HR Manager"
                  ].map((career, index) => (
                    <div 
                      key={index}
                      className="flex items-center rounded-lg border border-border/50 bg-card px-3 py-2 text-sm font-medium shadow-sm"
                    >
                      {career}
                      <div className="ml-auto rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-semibold text-primary">
                        {Math.round(70 + Math.random() * 25)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
