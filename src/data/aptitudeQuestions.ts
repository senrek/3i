
export interface Question {
  id: string;
  text: string;
  options: {
    value: string;
    label: string;
  }[];
}

export const aptitudeQuestions: Question[] = [
  {
    id: "q1",
    text: "Do you prefer physically active tasks over sitting and observing?",
    options: [
      { value: "A", label: "Yes, I enjoy active tasks" },
      { value: "B", label: "Sometimes, depending on the activity" },
      { value: "C", label: "Rarely, I prefer balanced tasks" },
      { value: "D", label: "No, I prefer passive activities" }
    ]
  },
  {
    id: "q2",
    text: "Do you enjoy participating in stage performances, events, or art competitions?",
    options: [
      { value: "A", label: "Yes, I love performing" },
      { value: "B", label: "Occasionally, if the event interests me" },
      { value: "C", label: "Rarely, I prefer to watch rather than participate" },
      { value: "D", label: "No, I avoid such activities" }
    ]
  },
  {
    id: "q3",
    text: "Are you comfortable speaking in debates, delivering speeches, or making presentations?",
    options: [
      { value: "A", label: "Yes, I enjoy public speaking" },
      { value: "B", label: "Sometimes, if I feel prepared" },
      { value: "C", label: "Only in small groups or familiar settings" },
      { value: "D", label: "No, I dislike speaking in public" }
    ]
  },
  {
    id: "q4",
    text: "Do you like working with colors, patterns, and creative designs?",
    options: [
      { value: "A", label: "Yes, I love creative work" },
      { value: "B", label: "Sometimes, if it interests me" },
      { value: "C", label: "Rarely, but I appreciate creativity" },
      { value: "D", label: "No, I prefer non-creative tasks" }
    ]
  },
  {
    id: "q5",
    text: "Can you visualize different designs, colors, and perspectives when imagining a scene?",
    options: [
      { value: "A", label: "Yes, I can clearly visualize details" },
      { value: "B", label: "Somewhat, but not in detail" },
      { value: "C", label: "Rarely, but I can imagine basic structures" },
      { value: "D", label: "No, I struggle with visualization" }
    ]
  },
  {
    id: "q6",
    text: "Are you good at persuading others to see things from your perspective?",
    options: [
      { value: "A", label: "Yes, I am very persuasive" },
      { value: "B", label: "Sometimes, depending on the situation" },
      { value: "C", label: "Only with people I know well" },
      { value: "D", label: "No, I find persuasion difficult" }
    ]
  },
  {
    id: "q7",
    text: "Do you enjoy participating in social events, volunteering, or community service?",
    options: [
      { value: "A", label: "Yes, I love social engagement" },
      { value: "B", label: "Sometimes, if it's a cause I care about" },
      { value: "C", label: "Rarely, but I don't mind helping occasionally" },
      { value: "D", label: "No, I prefer to stay away from such activities" }
    ]
  },
  {
    id: "q8",
    text: "Are you curious about new technologies and how things work?",
    options: [
      { value: "A", label: "Yes, I love learning about technology" },
      { value: "B", label: "Sometimes, if it seems useful" },
      { value: "C", label: "Rarely, I use technology but don't explore it deeply" },
      { value: "D", label: "No, I have little interest in technology" }
    ]
  },
  {
    id: "q9",
    text: "Do you enjoy fixing or repairing gadgets, appliances, or mechanical objects?",
    options: [
      { value: "A", label: "Yes, I love fixing things" },
      { value: "B", label: "Sometimes, if it's not too complex" },
      { value: "C", label: "Rarely, but I try when needed" },
      { value: "D", label: "No, I avoid such tasks" }
    ]
  },
  {
    id: "q10",
    text: "Do you have an affinity for numbers and an interest in business and the economy?",
    options: [
      { value: "A", label: "Yes, I enjoy working with numbers and analyzing the economy" },
      { value: "B", label: "Somewhat, I have a basic interest in business topics" },
      { value: "C", label: "Rarely, I only focus on it when necessary" },
      { value: "D", label: "No, I am not interested in numbers or business" }
    ]
  }
];
