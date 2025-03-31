
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import HowItWorks from '@/components/home/HowItWorks';
import CallToAction from '@/components/home/CallToAction';
import Footer from '@/components/home/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="relative flex min-h-screen flex-col">
      <HeroSection />
      
      <section className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Career Analysis for Class 11-12</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive career assessment combines aptitude, personality, and interest 
            evaluations to provide you with personalized career guidance.
          </p>
        </div>
        
        <Card className="mx-auto max-w-3xl border border-border/50 rounded-2xl overflow-hidden shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-primary/10 w-16 h-16 flex items-center justify-center rounded-full mb-4">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Career Analysis Assessment</CardTitle>
            <CardDescription>
              Complete our unified assessment to discover career paths aligned with your abilities
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm text-center">
                <div className="rounded-lg bg-muted p-3">
                  <p className="font-medium">105 Questions</p>
                  <p className="text-muted-foreground">Comprehensive evaluation</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="font-medium">45 Minutes</p>
                  <p className="text-muted-foreground">Average completion time</p>
                </div>
              </div>
              
              <div className="rounded-lg bg-primary/5 p-4 border border-primary/10">
                <h3 className="font-medium mb-2">What You'll Discover:</h3>
                <ul className="space-y-1.5 text-sm ml-5 list-disc">
                  <li>Top career matches based on your unique profile</li>
                  <li>Detailed breakdown of your aptitudes and abilities</li>
                  <li>Personalized educational pathway recommendations</li>
                  <li>Insights into your working style and preferences</li>
                  <li>Comprehensive PDF report for future reference</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 p-6 flex justify-center">
            <Button asChild size="lg" className="rounded-xl">
              <Link to="/assessments/career-analysis">
                Start Career Assessment
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
      
      <FeaturesSection />
      <HowItWorks />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default HomePage;
