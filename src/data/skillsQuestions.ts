export interface SkillsQuestion {
  id: string;
  category: string;
  text: string;
  options: {
    value: string;
    label: string;
  }[];
  imageUrl?: string;
  timeLimit: number; // in seconds
}

export const skillsQuestions: SkillsQuestion[] = [
  // Leadership & Decision-Making
  {
    id: "lead_1",
    category: "Leadership & Decision-Making",
    text: "How do you make crucial decisions?",
    options: [
      { value: "A", label: "My decision goes along with the majority" },
      { value: "B", label: "I always make crucial decisions on my own" },
      { value: "C", label: "I prefer to take advice from others before making decisions" },
      { value: "D", label: "I usually follow the decisions of others" },
      { value: "E", label: "Other people decide for me" }
    ],
    timeLimit: 60
  },
  {
    id: "lead_2",
    category: "Leadership & Decision-Making",
    text: "If a team member struggles, what would you do?",
    options: [
      { value: "A", label: "Take over their tasks" },
      { value: "B", label: "Assign easier tasks" },
      { value: "C", label: "Offer help and support" },
      { value: "D", label: "Ignore and focus on your work" }
    ],
    timeLimit: 45
  },
  // Mechanical/Logical Reasoning
  {
    id: "mech_1",
    category: "Mechanical/Logical Reasoning",
    text: "Two pendulums with the same weight: Which swings faster?",
    imageUrl: "https://example.com/pendulum-image.png", // We'll update this with actual image
    options: [
      { value: "A", label: "Pendulum A" },
      { value: "B", label: "Pendulum B" },
      { value: "C", label: "Both swing at the same pace" },
      { value: "D", label: "Not Sure" }
    ],
    timeLimit: 45
  },
  // Add more questions following the same pattern...
  {
    id: "num_1",
    category: "Numerical Ability",
    text: "If 7 spiders spin 7 webs in 7 days, then how many days will a spider take to spin a web?",
    options: [
      { value: "A", label: "7" },
      { value: "B", label: "5" },
      { value: "C", label: "3" },
      { value: "D", label: "2" },
      { value: "E", label: "1" }
    ],
    timeLimit: 60
  },
  {
    id: "spatial_1",
    category: "Spatial & Visualization Ability",
    text: "What will a figure look like after the extra piece is folded over?",
    imageUrl: "https://example.com/spatial-test.png", // We'll update this with actual image
    options: [
      { value: "A", label: "Option A" },
      { value: "B", label: "Option B" },
      { value: "C", label: "Option C" },
      { value: "D", label: "Option D" },
      { value: "E", label: "Option E" }
    ],
    timeLimit: 45
  }
  // Continue adding all questions...
]; 