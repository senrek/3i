import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SkillsInstructionsProps {
  onContinue: () => void;
}

export function SkillsInstructions({ onContinue }: SkillsInstructionsProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="p-8">
          <h1 className="text-2xl font-bold text-blue-700 mb-6">
            Skills and Abilities Test
          </h1>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Instructions</h2>
              <ul className="list-disc pl-6 space-y-3">
                <li>This section contains 35 questions testing various skills including:
                  <ul className="list-circle pl-6 mt-2 space-y-1">
                    <li>Leadership & Decision-Making</li>
                    <li>Mechanical/Logical Reasoning</li>
                    <li>Numerical Ability</li>
                    <li>Spatial & Visualization</li>
                    <li>Verbal Ability</li>
                  </ul>
                </li>
                <li>Each question has a specific time limit.</li>
                <li>Click the 'Next' button at the bottom of each question to proceed.</li>
                <li>The test will be submitted automatically if the time expires.</li>
                <li>Do not refresh the page during the test.</li>
                <li>Your answers will contribute to your career assessment.</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Important Notes:</h3>
              <ul className="list-disc pl-6 space-y-2 text-blue-700">
                <li>Make sure you have a stable internet connection</li>
                <li>Find a quiet place to take the test</li>
                <li>Read each question carefully before answering</li>
                <li>Keep track of the timer for each question</li>
              </ul>
            </div>

            <div className="pt-6">
              <Button 
                onClick={onContinue}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
              >
                Continue Test
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 