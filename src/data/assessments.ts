
import { Brain, BookOpen, Lightbulb } from 'lucide-react';

export interface Assessment {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  duration: number; // in minutes
  questionCount: number;
  type: 'aptitude' | 'personality' | 'interest';
}

export const assessments: Assessment[] = [
  {
    id: "aptitude",
    title: "Aptitude Assessment",
    description: "Discover your natural abilities and cognitive strengths.",
    icon: Brain,
    duration: 15,
    questionCount: 10,
    type: 'aptitude'
  },
  {
    id: "personality",
    title: "Personality Assessment",
    description: "Understand your work style and workplace preferences.",
    icon: BookOpen,
    duration: 10,
    questionCount: 10,
    type: 'personality'
  },
  {
    id: "interest",
    title: "Interest Assessment",
    description: "Identify areas of work that align with your passions.",
    icon: Lightbulb,
    duration: 12,
    questionCount: 10,
    type: 'interest'
  }
];
