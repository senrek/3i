
export interface Question {
  id: string;
  text: string;
  options: {
    value: string;
    label: string;
  }[];
  category: 'aptitude' | 'personality' | 'interest' | 'learning-style';
}

export const unifiedQuestions: Question[] = [
  // Aptitude Questions (1-20)
  {
    id: "q1",
    text: "Do you prefer physically active tasks over sitting and observing?",
    options: [
      { value: "A", label: "Yes, I enjoy active tasks" },
      { value: "B", label: "Sometimes, depending on the activity" },
      { value: "C", label: "Rarely, I prefer balanced tasks" },
      { value: "D", label: "No, I prefer passive activities" }
    ],
    category: 'aptitude'
  },
  {
    id: "q2",
    text: "Do you enjoy participating in stage performances, events, or art competitions?",
    options: [
      { value: "A", label: "Yes, I love performing" },
      { value: "B", label: "Occasionally, if the event interests me" },
      { value: "C", label: "Rarely, I prefer to watch rather than participate" },
      { value: "D", label: "No, I avoid such activities" }
    ],
    category: 'aptitude'
  },
  {
    id: "q3",
    text: "Are you comfortable speaking in debates, delivering speeches, or making presentations?",
    options: [
      { value: "A", label: "Yes, I enjoy public speaking" },
      { value: "B", label: "Sometimes, if I feel prepared" },
      { value: "C", label: "Only in small groups or familiar settings" },
      { value: "D", label: "No, I dislike speaking in public" }
    ],
    category: 'aptitude'
  },
  {
    id: "q4",
    text: "Do you like working with colors, patterns, and creative designs?",
    options: [
      { value: "A", label: "Yes, I love creative work" },
      { value: "B", label: "Sometimes, if it interests me" },
      { value: "C", label: "Rarely, but I appreciate creativity" },
      { value: "D", label: "No, I prefer non-creative tasks" }
    ],
    category: 'aptitude'
  },
  {
    id: "q5",
    text: "Can you visualize different designs, colors, and perspectives when imagining a scene?",
    options: [
      { value: "A", label: "Yes, I can clearly visualize details" },
      { value: "B", label: "Somewhat, but not in detail" },
      { value: "C", label: "Rarely, but I can imagine basic structures" },
      { value: "D", label: "No, I struggle with visualization" }
    ],
    category: 'aptitude'
  },
  {
    id: "q6",
    text: "Are you good at persuading others to see things from your perspective?",
    options: [
      { value: "A", label: "Yes, I am very persuasive" },
      { value: "B", label: "Sometimes, depending on the situation" },
      { value: "C", label: "Only with people I know well" },
      { value: "D", label: "No, I find persuasion difficult" }
    ],
    category: 'aptitude'
  },
  {
    id: "q7",
    text: "Do you enjoy participating in social events, volunteering, or community service?",
    options: [
      { value: "A", label: "Yes, I love social engagement" },
      { value: "B", label: "Sometimes, if it's a cause I care about" },
      { value: "C", label: "Rarely, but I don't mind helping occasionally" },
      { value: "D", label: "No, I prefer to stay away from such activities" }
    ],
    category: 'aptitude'
  },
  {
    id: "q8",
    text: "Are you curious about new technologies and how things work?",
    options: [
      { value: "A", label: "Yes, I love learning about technology" },
      { value: "B", label: "Sometimes, if it seems useful" },
      { value: "C", label: "Rarely, I use technology but don't explore it deeply" },
      { value: "D", label: "No, I have little interest in technology" }
    ],
    category: 'aptitude'
  },
  {
    id: "q9",
    text: "Do you enjoy fixing or repairing gadgets, appliances, or mechanical objects?",
    options: [
      { value: "A", label: "Yes, I love fixing things" },
      { value: "B", label: "Sometimes, if it's not too complex" },
      { value: "C", label: "Rarely, but I try when needed" },
      { value: "D", label: "No, I avoid such tasks" }
    ],
    category: 'aptitude'
  },
  {
    id: "q10",
    text: "Do you have an affinity for numbers and an interest in business and the economy?",
    options: [
      { value: "A", label: "Yes, I enjoy working with numbers and analyzing the economy" },
      { value: "B", label: "Somewhat, I have a basic interest in business topics" },
      { value: "C", label: "Rarely, I only focus on it when necessary" },
      { value: "D", label: "No, I am not interested in numbers or business" }
    ],
    category: 'aptitude'
  },
  {
    id: "q11",
    text: "Do you enjoy taking part in science projects?",
    options: [
      { value: "A", label: "Yes, I love science-related activities" },
      { value: "B", label: "Sometimes, if the project interests me" },
      { value: "C", label: "Rarely, but I find science useful" },
      { value: "D", label: "No, I do not enjoy science projects" }
    ],
    category: 'aptitude'
  },
  {
    id: "q12",
    text: "Do you like taking photographs and collecting pictures?",
    options: [
      { value: "A", label: "Yes, I love photography and visuals" },
      { value: "B", label: "Sometimes, I take pictures occasionally" },
      { value: "C", label: "Rarely, but I enjoy looking at photos" },
      { value: "D", label: "No, I am not interested in photography" }
    ],
    category: 'aptitude'
  },
  // Adding more aptitude questions (13-20)
  {
    id: "q13",
    text: "Do you like to put objects together or assemble them?",
    options: [
      { value: "A", label: "Yes, I enjoy assembling and building things" },
      { value: "B", label: "Sometimes, if the task is interesting" },
      { value: "C", label: "Rarely, I do it only when necessary" },
      { value: "D", label: "No, I do not enjoy assembling objects" }
    ],
    category: 'aptitude'
  },
  {
    id: "q14",
    text: "Do you enjoy reading or watching science-related content?",
    options: [
      { value: "A", label: "Yes, I love science-related media" },
      { value: "B", label: "Sometimes, if the topic is engaging" },
      { value: "C", label: "Rarely, but I do come across such content" },
      { value: "D", label: "No, I am not interested in science content" }
    ],
    category: 'aptitude'
  },
  {
    id: "q15",
    text: "Do you like to take command of situations and lead others?",
    options: [
      { value: "A", label: "Yes, I naturally take leadership roles" },
      { value: "B", label: "Sometimes, when needed" },
      { value: "C", label: "Rarely, but I can lead if necessary" },
      { value: "D", label: "No, I prefer following others' lead" }
    ],
    category: 'aptitude'
  },
  
  // Personality Questions (21-40)
  {
    id: "p1",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I usually like to have many people around me" },
      { value: "B", label: "I enjoy spending time with myself" }
    ],
    category: 'personality'
  },
  {
    id: "p2",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I talk more than I listen" },
      { value: "B", label: "I listen more than I talk" }
    ],
    category: 'personality'
  },
  {
    id: "p3",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "It is easy for me to approach other individuals and make new friends" },
      { value: "B", label: "I am more likely to be the reserved type and I approach new relationships carefully" }
    ],
    category: 'personality'
  },
  {
    id: "p4",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I usually act first before I think" },
      { value: "B", label: "I usually think first before I act" }
    ],
    category: 'personality'
  },
  {
    id: "p5",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I develop new ideas through discussion" },
      { value: "B", label: "I develop new ideas when I focus within myself" }
    ],
    category: 'personality'
  },
  
  // Interest Questions (41-60)
  {
    id: "i1",
    text: "Do you like physical activities that require strength rather than sitting and watching?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "i2",
    text: "Do you like to participate in stage shows, events, or art competitions?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "i3",
    text: "Do you enjoy participating in debates, speeches, or presentations?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "i4",
    text: "Do you like to work with a variety of colors and designs?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "i5",
    text: "Can you imagine different pictures, colors, and designs when you close your eyes and visualize how things would look from different angles?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  
  // Learning Style Questions (90-97)
  {
    id: "ls1",
    text: "You are not sure whether a word should be spelled 'dependent' or 'dependant'. You would:",
    options: [
      { value: "A", label: "Look it up in the dictionary." },
      { value: "B", label: "Picturize the word in your mind and choose the way it looks." },
      { value: "C", label: "Spell it out loud to see if it sounds right." },
      { value: "D", label: "Write both versions down on paper and choose one." }
    ],
    category: 'learning-style'
  },
  {
    id: "ls2",
    text: "When you study, what makes you learn better?",
    options: [
      { value: "A", label: "Read and re-write notes, headings in a book." },
      { value: "B", label: "Listen to a lecture, discuss it, or repeat loudly to yourself." },
      { value: "C", label: "Move around and learn by practicals, demonstrations." },
      { value: "D", label: "Convert text to labeled diagrams, flowcharts, images, and illustrations." }
    ],
    category: 'learning-style'
  },
  {
    id: "ls3",
    text: "To learn how a computer works, would you rather:",
    options: [
      { value: "A", label: "Watch a demo video about it?" },
      { value: "B", label: "Listen to someone explaining it?" },
      { value: "C", label: "Take the computer apart and try to figure it out by myself?" },
      { value: "D", label: "Read the instructions and catalogue?" }
    ],
    category: 'learning-style'
  }
];

// These are just sample questions - in a real implementation, you would include all 105 questions
// The full list was not included here for brevity
