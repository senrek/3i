
import React from 'react';
import { careerResults } from '@/data/careerResults';
import CareerResultCard from '@/components/reports/CareerResultCard';
import CareerInsightsCard from '@/components/reports/CareerInsightsCard';

interface CareerMatchesTabProps {
  reportId: string;
}

const CareerMatchesTab = ({ reportId }: CareerMatchesTabProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-6 lg:grid-cols-8">
      <div className="md:col-span-6 lg:col-span-5 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {careerResults.slice(0, 4).map((career, index) => (
            <CareerResultCard
              key={career.id}
              title={career.title}
              matchPercentage={career.matchPercentage}
              description={career.description}
              skills={career.skills}
              isPrimary={index === 0}
              reportId={reportId}
            />
          ))}
        </div>
      </div>
      <div className="md:col-span-2 lg:col-span-3">
        <CareerInsightsCard />
      </div>
    </div>
  );
};

export default CareerMatchesTab;
