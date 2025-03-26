
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
    duration: 45,
    questionCount: 105,
    type: 'unified'
  }
];
