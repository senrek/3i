interface Question {
  id: number;
  text: string;
  options: string[];
  stage: string;
}

export const questions: Question[] = [
  // Career Interest (20%)
  {
    id: 1,
    text: "Which activities do you enjoy most in your free time?",
    options: [
      "Creative activities (art, music, writing)",
      "Technical activities (coding, building things)",
      "Social activities (helping others, teaching)",
      "Analytical activities (solving puzzles, research)"
    ],
    stage: "CAREER INTEREST"
  },
  {
    id: 2,
    text: "What type of work environment appeals to you most?",
    options: [
      "Dynamic and fast-paced",
      "Structured and organized",
      "Collaborative and team-oriented",
      "Independent and flexible"
    ],
    stage: "CAREER INTEREST"
  },
  
  // Career Personality (40%)
  {
    id: 3,
    text: "How do you prefer to make decisions?",
    options: [
      "Based on facts and logic",
      "Based on feelings and values",
      "Considering both facts and feelings",
      "Following my intuition"
    ],
    stage: "CAREER PERSONALITY"
  },
  {
    id: 4,
    text: "How do you typically approach new projects?",
    options: [
      "Plan everything in detail first",
      "Jump in and figure it out as I go",
      "Discuss with others to get their input",
      "Research thoroughly before starting"
    ],
    stage: "CAREER PERSONALITY"
  },
  
  // Career Motivator (60%)
  {
    id: 5,
    text: "What motivates you most in a career?",
    options: [
      "Financial success and stability",
      "Making a positive impact on others",
      "Learning and personal growth",
      "Recognition and achievement"
    ],
    stage: "CAREER MOTIVATOR"
  },
  {
    id: 6,
    text: "What's most important to you in a job?",
    options: [
      "Work-life balance",
      "Career advancement opportunities",
      "Meaningful and purposeful work",
      "Innovation and creativity"
    ],
    stage: "CAREER MOTIVATOR"
  },
  
  // Learning Style (80%)
  {
    id: 7,
    text: "How do you best learn new information?",
    options: [
      "Through visual aids and diagrams",
      "By listening and discussing",
      "Through hands-on practice",
      "By reading and taking notes"
    ],
    stage: "LEARNING STYLE"
  },
  {
    id: 8,
    text: "What's your preferred way of solving problems?",
    options: [
      "Breaking them down into smaller parts",
      "Discussing with others",
      "Using past experiences",
      "Finding creative solutions"
    ],
    stage: "LEARNING STYLE"
  },
  
  // Scenarios (100%)
  {
    id: 9,
    text: "In a group project, what role do you naturally take?",
    options: [
      "Leader who organizes and delegates",
      "Creative who generates ideas",
      "Mediator who ensures harmony",
      "Implementer who gets things done"
    ],
    stage: "SCENARIOS"
  },
  {
    id: 10,
    text: "When facing a challenge at work, how do you typically respond?",
    options: [
      "Analyze the situation and create a plan",
      "Seek advice from others",
      "Trust my instincts and adapt",
      "Look for innovative solutions"
    ],
    stage: "SCENARIOS"
  }
];

export default questions; 