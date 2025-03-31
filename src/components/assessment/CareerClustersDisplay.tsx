import React from 'react';
import { Card } from '@/components/ui/card';

interface CareerCluster {
  name: string;
  value: number;
  occupations: string[];
  description: string;
  skills: string[];
  educationPaths: string[];
}

interface CareerClustersDisplayProps {
  careerClusters: CareerCluster[];
  selectedClusters: string[];
}

const CareerClustersDisplay: React.FC<CareerClustersDisplayProps> = ({
  careerClusters,
  selectedClusters
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Your Career Clusters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {careerClusters.map((cluster, index) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-lg">{cluster.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{cluster.description}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    {Math.round(cluster.value)}%
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <h5 className="text-sm font-medium">Key Occupations:</h5>
                <ul className="text-sm text-gray-600 mt-1 list-disc list-inside">
                  {cluster.occupations.slice(0, 3).map((occupation, i) => (
                    <li key={i}>{occupation}</li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Your Selected Career Clusters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedClusters.map((clusterName, index) => {
            const cluster = careerClusters.find(c => c.name === clusterName);
            if (!cluster) return null;
            
            return (
              <Card key={index} className="p-4 border-2 border-blue-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-lg">{cluster.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{cluster.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 bg-blue-500 text-white rounded">
                      Selected
                    </span>
                  </div>
                </div>
                <div className="mt-3">
                  <h5 className="text-sm font-medium">Required Skills:</h5>
                  <ul className="text-sm text-gray-600 mt-1 list-disc list-inside">
                    {cluster.skills.slice(0, 3).map((skill, i) => (
                      <li key={i}>{skill}</li>
                    ))}
                  </ul>
                  <h5 className="text-sm font-medium mt-2">Education Paths:</h5>
                  <ul className="text-sm text-gray-600 mt-1 list-disc list-inside">
                    {cluster.educationPaths.slice(0, 2).map((path, i) => (
                      <li key={i}>{path}</li>
                    ))}
                  </ul>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CareerClustersDisplay; 