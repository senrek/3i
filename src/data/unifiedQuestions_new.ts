export interface Question {
  id: string;
  text: string;
  options: {
    value: string;
    label: string;
  }[];
  category: 'aptitude' | 'personality' | 'interest' | 'learning-style' | 'leadership' | 'mechanical' | 'numerical' | 'spatial' | 'verbal' | 'analytical';
  imageUrl?: string;
  timeLimit?: number;
}

// Import the skills questions
import { skillsQuestions } from './skillsQuestions';

export const unifiedQuestions: Question[] = [
  // Aptitude Questions (1-30)
  {
    id: "apt_1",
    text: "Do you prefer physically active tasks over sitting and observing?",
    options: [
      { value: "A", label: "Yes, I enjoy active tasks" },
      { value: "B", label: "Sometimes, depending on the activity" },
      { value: "C", label: "Rarely, I prefer balanced tasks" },
      { value: "D", label: "No, I prefer passive activities" }
    ],
    category: 'aptitude'
  },
  // ... Add all aptitude questions (apt_1 to apt_30)

  // Personality Questions (31-60)
  {
    id: "per_1",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I usually like to have many people around me" },
      { value: "B", label: "I enjoy spending time with myself" }
    ],
    category: 'personality'
  },
  // ... Add all personality questions (per_1 to per_30)

  // Interest Questions (61-90)
  {
    id: "int_1",
    text: "Do you like physical activities that require strength rather than sitting and watching?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  // ... Add all interest questions (int_1 to int_30)

  // Learning Style Questions (91-110)
  {
    id: "lrn_1",
    text: "How do you best learn new information?",
    options: [
      { value: "A", label: "Through visual aids and diagrams" },
      { value: "B", label: "By listening and discussing" },
      { value: "C", label: "Through hands-on practice" },
      { value: "D", label: "By reading and taking notes" }
    ],
    category: 'learning-style'
  },
  // ... Add all learning style questions (lrn_1 to lrn_20)

  // Skills Assessment Instructions (Question 111)
  {
    id: "skills_instructions",
    text: "Skills and Abilities Test\n\nInstructions:\n1. Click the 'Next' button at the bottom of the test page to submit your answers.\n2. Test will be submitted automatically if the time expires.\n3. Don't refresh the page.\n4. The following section contains 35 questions testing various skills.\n5. Each question has a specific time limit.\n6. Your answers will contribute to your career assessment.\n\nClick 'Continue Test' to begin the Skills Assessment.",
    options: [
      { value: "continue", label: "Continue Test" }
    ],
    category: 'aptitude'
  },

  // Add all skills assessment questions (Questions 112-146)
  ...skillsQuestions
]; 