
import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import HowItWorks from '@/components/home/HowItWorks';
import CallToAction from '@/components/home/CallToAction';
import Footer from '@/components/home/Footer';

const HomePage = () => {
  return (
    <div className="relative flex min-h-screen flex-col">
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default HomePage;
