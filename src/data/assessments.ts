import { Brain } from 'lucide-react';

export interface Assessment {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  duration: number; // in minutes
  questionCount: number;
  type: 'unified';
}

export const assessments: Assessment[] = [
  {
    id: "career-analysis",
    title: "Career Analysis for Class 11-12 Assessment",
    description: "Comprehensive assessment to discover your aptitude, personality traits, and interests for targeted career recommendations.",
    icon: Brain,
    duration: 60,
    questionCount: 146, // 110 original questions + 1 instruction + 35 skills questions
    type: 'unified'
  }
];
