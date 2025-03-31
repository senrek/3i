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

export const skillsQuestions: Question[] = [
  // Leadership & Decision-Making (7 questions)
  {
    id: "lead_1",
    text: "How do you make crucial decisions?",
    options: [
      { value: "A", label: "My decision goes along with the majority" },
      { value: "B", label: "I always make crucial decisions on my own" },
      { value: "C", label: "I prefer to take advice from others before making decisions" },
      { value: "D", label: "I usually follow the decisions of others" }
    ],
    category: 'leadership',
    timeLimit: 60
  },
  {
    id: "lead_2",
    text: "If a team member struggles, what would you do?",
    options: [
      { value: "A", label: "Take over their tasks" },
      { value: "B", label: "Assign easier tasks" },
      { value: "C", label: "Offer help and support" },
      { value: "D", label: "Ignore and focus on your work" }
    ],
    category: 'leadership',
    timeLimit: 45
  },
  {
    id: "lead_3",
    text: "How do you handle conflicts in a team?",
    options: [
      { value: "A", label: "Mediate between parties" },
      { value: "B", label: "Let them resolve it themselves" },
      { value: "C", label: "Escalate to higher authority" },
      { value: "D", label: "Avoid getting involved" }
    ],
    category: 'leadership',
    timeLimit: 45
  },
  {
    id: "lead_4",
    text: "When leading a project, how do you ensure deadlines are met?",
    options: [
      { value: "A", label: "Set strict timelines and monitor closely" },
      { value: "B", label: "Allow team members to set their own pace" },
      { value: "C", label: "Regular check-ins and adjustments" },
      { value: "D", label: "Focus only on the final deadline" }
    ],
    category: 'leadership',
    timeLimit: 45
  },
  {
    id: "lead_5",
    text: "How do you motivate team members?",
    options: [
      { value: "A", label: "Provide monetary incentives" },
      { value: "B", label: "Give recognition and praise" },
      { value: "C", label: "Set challenging goals" },
      { value: "D", label: "Lead by example" }
    ],
    category: 'leadership',
    timeLimit: 45
  },
  {
    id: "lead_6",
    text: "What's your approach to delegation?",
    options: [
      { value: "A", label: "Delegate based on skills and experience" },
      { value: "B", label: "Assign tasks randomly" },
      { value: "C", label: "Keep important tasks for yourself" },
      { value: "D", label: "Let team members choose their tasks" }
    ],
    category: 'leadership',
    timeLimit: 45
  },
  {
    id: "lead_7",
    text: "How do you handle team feedback?",
    options: [
      { value: "A", label: "Regular structured feedback sessions" },
      { value: "B", label: "Only when problems arise" },
      { value: "C", label: "Anonymous feedback system" },
      { value: "D", label: "Informal casual conversations" }
    ],
    category: 'leadership',
    timeLimit: 45
  },
  // Mechanical/Logical Reasoning (7 questions)
  {
    id: "mech_1",
    text: "Two pendulums with different lengths but same weights are shown. Which swings faster?",
    options: [
      { value: "A", label: "Pendulum A (shorter)" },
      { value: "B", label: "Pendulum B (longer)" },
      { value: "C", label: "Both swing at the same pace" },
      { value: "D", label: "Cannot be determined" }
    ],
    category: 'mechanical',
    imageUrl: "https://i.imgur.com/8XZB6Qw.png",
    timeLimit: 45
  },
  {
    id: "mech_2",
    text: "Which gear will rotate in the same direction as Gear A?",
    options: [
      { value: "A", label: "Gear 1" },
      { value: "B", label: "Gear 2" },
      { value: "C", label: "Gear 3" },
      { value: "D", label: "Gear 4" }
    ],
    category: 'mechanical',
    imageUrl: "https://i.imgur.com/YqW3e5p.png",
    timeLimit: 60
  },
  {
    id: "mech_3",
    text: "If the pulley system shown is in equilibrium, what is the relationship between weights W1 and W2?",
    options: [
      { value: "A", label: "W1 = W2" },
      { value: "B", label: "W1 = 2W2" },
      { value: "C", label: "W1 = W2/2" },
      { value: "D", label: "W1 = 4W2" }
    ],
    category: 'mechanical',
    imageUrl: "https://i.imgur.com/L2K4f9n.png",
    timeLimit: 60
  },
  {
    id: "mech_4",
    text: "In the circuit shown, if switch S is closed, which bulbs will light up?",
    options: [
      { value: "A", label: "Only Bulb 1" },
      { value: "B", label: "Only Bulb 2" },
      { value: "C", label: "Both Bulbs" },
      { value: "D", label: "Neither Bulb" }
    ],
    category: 'mechanical',
    imageUrl: "https://i.imgur.com/pQK4Nxd.png",
    timeLimit: 60
  },
  {
    id: "mech_5",
    text: "Which lever arrangement requires the least force to lift the weight?",
    options: [
      { value: "A", label: "Arrangement A" },
      { value: "B", label: "Arrangement B" },
      { value: "C", label: "Arrangement C" },
      { value: "D", label: "All require the same force" }
    ],
    category: 'mechanical',
    imageUrl: "https://i.imgur.com/RmK9Vxp.png",
    timeLimit: 60
  },
  {
    id: "mech_6",
    text: "If all gears are identical, how many rotations will the last gear make for one rotation of the first gear?",
    options: [
      { value: "A", label: "Same direction, same speed" },
      { value: "B", label: "Opposite direction, same speed" },
      { value: "C", label: "Same direction, half speed" },
      { value: "D", label: "Opposite direction, half speed" }
    ],
    category: 'mechanical',
    imageUrl: "https://i.imgur.com/wXK8Dpt.png",
    timeLimit: 60
  },
  {
    id: "mech_7",
    text: "Which ball will reach the bottom first?",
    options: [
      { value: "A", label: "Ball on Path A" },
      { value: "B", label: "Ball on Path B" },
      { value: "C", label: "Ball on Path C" },
      { value: "D", label: "They will reach at the same time" }
    ],
    category: 'mechanical',
    imageUrl: "https://i.imgur.com/3QZfPGK.png",
    timeLimit: 60
  },
  // Numerical Ability (7 questions)
  {
    id: "num_1",
    text: "If 7 spiders spin 7 webs in 7 days, how many days will it take one spider to spin one web?",
    options: [
      { value: "A", label: "7 days" },
      { value: "B", label: "1 day" },
      { value: "C", label: "49 days" },
      { value: "D", label: "14 days" }
    ],
    category: 'numerical',
    timeLimit: 60
  },
  {
    id: "num_2",
    text: "What comes next in the sequence: 2, 6, 12, 20, ?",
    options: [
      { value: "A", label: "30" },
      { value: "B", label: "28" },
      { value: "C", label: "32" },
      { value: "D", label: "26" }
    ],
    category: 'numerical',
    timeLimit: 45
  },
  {
    id: "num_3",
    text: "If a shirt costs $45 after a 25% discount, what was its original price?",
    options: [
      { value: "A", label: "$60" },
      { value: "B", label: "$55" },
      { value: "C", label: "$50" },
      { value: "D", label: "$65" }
    ],
    category: 'numerical',
    timeLimit: 60
  },
  {
    id: "num_4",
    text: "If 3 workers can build a wall in 6 hours, how many workers are needed to build it in 2 hours?",
    options: [
      { value: "A", label: "6 workers" },
      { value: "B", label: "9 workers" },
      { value: "C", label: "12 workers" },
      { value: "D", label: "15 workers" }
    ],
    category: 'numerical',
    timeLimit: 60
  },
  {
    id: "num_5",
    text: "What percentage of the figure is shaded?",
    options: [
      { value: "A", label: "25%" },
      { value: "B", label: "33%" },
      { value: "C", label: "40%" },
      { value: "D", label: "50%" }
    ],
    category: 'numerical',
    imageUrl: "https://i.imgur.com/qL8Kj9P.png",
    timeLimit: 45
  },
  {
    id: "num_6",
    text: "If a car travels 120 km in 2 hours, what's its speed in meters per second?",
    options: [
      { value: "A", label: "16.67 m/s" },
      { value: "B", label: "20 m/s" },
      { value: "C", label: "33.33 m/s" },
      { value: "D", label: "60 m/s" }
    ],
    category: 'numerical',
    timeLimit: 60
  },
  {
    id: "num_7",
    text: "What is the area of the shaded region?",
    options: [
      { value: "A", label: "12 sq units" },
      { value: "B", label: "16 sq units" },
      { value: "C", label: "20 sq units" },
      { value: "D", label: "24 sq units" }
    ],
    category: 'numerical',
    imageUrl: "https://i.imgur.com/Zt4Xb8K.png",
    timeLimit: 60
  },
  // Spatial & Visualization (7 questions)
  {
    id: "spatial_1",
    text: "When the pattern is folded into a cube, which face will be opposite to the face marked X?",
    options: [
      { value: "A", label: "Face A" },
      { value: "B", label: "Face B" },
      { value: "C", label: "Face C" },
      { value: "D", label: "Face D" }
    ],
    category: 'spatial',
    imageUrl: "https://i.imgur.com/JKz6mXp.png",
    timeLimit: 60
  },
  {
    id: "spatial_2",
    text: "Which of these shapes is the odd one out?",
    options: [
      { value: "A", label: "Shape A" },
      { value: "B", label: "Shape B" },
      { value: "C", label: "Shape C" },
      { value: "D", label: "Shape D" }
    ],
    category: 'spatial',
    imageUrl: "https://i.imgur.com/mN7B5Re.png",
    timeLimit: 45
  },
  {
    id: "spatial_3",
    text: "Which is the correct mirror image of the given figure?",
    options: [
      { value: "A", label: "Image A" },
      { value: "B", label: "Image B" },
      { value: "C", label: "Image C" },
      { value: "D", label: "Image D" }
    ],
    category: 'spatial',
    imageUrl: "https://i.imgur.com/9KZnhGp.png",
    timeLimit: 45
  },
  {
    id: "spatial_4",
    text: "What will the shape look like when rotated 90° clockwise?",
    options: [
      { value: "A", label: "Option A" },
      { value: "B", label: "Option B" },
      { value: "C", label: "Option C" },
      { value: "D", label: "Option D" }
    ],
    category: 'spatial',
    imageUrl: "https://i.imgur.com/vQK4Nxd.png",
    timeLimit: 45
  },
  {
    id: "spatial_5",
    text: "Which 3D shape can be made from this net?",
    options: [
      { value: "A", label: "Cube" },
      { value: "B", label: "Pyramid" },
      { value: "C", label: "Prism" },
      { value: "D", label: "Cylinder" }
    ],
    category: 'spatial',
    imageUrl: "https://i.imgur.com/rK9Vxp.png",
    timeLimit: 60
  },
  {
    id: "spatial_6",
    text: "Which piece completes the pattern?",
    options: [
      { value: "A", label: "Piece A" },
      { value: "B", label: "Piece B" },
      { value: "C", label: "Piece C" },
      { value: "D", label: "Piece D" }
    ],
    category: 'spatial',
    imageUrl: "https://i.imgur.com/wK8Dpt.png",
    timeLimit: 45
  },
  {
    id: "spatial_7",
    text: "How many cubes are needed to complete this structure?",
    options: [
      { value: "A", label: "3 cubes" },
      { value: "B", label: "4 cubes" },
      { value: "C", label: "5 cubes" },
      { value: "D", label: "6 cubes" }
    ],
    category: 'spatial',
    imageUrl: "https://i.imgur.com/3ZfPGK.png",
    timeLimit: 45
  },
  // Verbal Ability (7 questions)
  {
    id: "verbal_1",
    text: "Choose the word that best completes the analogy: Book is to Reader as Movie is to _____",
    options: [
      { value: "A", label: "Viewer" },
      { value: "B", label: "Director" },
      { value: "C", label: "Actor" },
      { value: "D", label: "Screen" }
    ],
    category: 'verbal',
    timeLimit: 45
  },
  {
    id: "verbal_2",
    text: "Which word is closest in meaning to 'Ambiguous'?",
    options: [
      { value: "A", label: "Unclear" },
      { value: "B", label: "Definite" },
      { value: "C", label: "Simple" },
      { value: "D", label: "Direct" }
    ],
    category: 'verbal',
    timeLimit: 45
  },
  {
    id: "verbal_3",
    text: "Complete the sentence: Despite the _____ weather, they decided to go ahead with the outdoor event.",
    options: [
      { value: "A", label: "Inclement" },
      { value: "B", label: "Auspicious" },
      { value: "C", label: "Favorable" },
      { value: "D", label: "Mild" }
    ],
    category: 'verbal',
    timeLimit: 45
  },
  {
    id: "verbal_4",
    text: "Choose the sentence with correct grammar:",
    options: [
      { value: "A", label: "Neither of the options are correct." },
      { value: "B", label: "Neither of the options is correct." },
      { value: "C", label: "None of the options are correct." },
      { value: "D", label: "None of the option is correct." }
    ],
    category: 'verbal',
    timeLimit: 45
  },
  {
    id: "verbal_5",
    text: "Which word pair shows the same relationship as 'Candid : Frank'?",
    options: [
      { value: "A", label: "Bold : Timid" },
      { value: "B", label: "Honest : Truthful" },
      { value: "C", label: "Dark : Light" },
      { value: "D", label: "Happy : Sad" }
    ],
    category: 'verbal',
    timeLimit: 45
  },
  {
    id: "verbal_6",
    text: "Choose the word that does NOT belong in the group:",
    options: [
      { value: "A", label: "Ecstatic" },
      { value: "B", label: "Elated" },
      { value: "C", label: "Jubilant" },
      { value: "D", label: "Melancholy" }
    ],
    category: 'verbal',
    timeLimit: 45
  },
  {
    id: "verbal_7",
    text: "If 'FRIEND' is coded as 'HUMJSI', how is 'CANDLE' coded?",
    options: [
      { value: "A", label: "DEQJPI" },
      { value: "B", label: "EDRFOH" },
      { value: "C", label: "FYRHPI" },
      { value: "D", label: "DCQHPI" }
    ],
    category: 'verbal',
    timeLimit: 60
  }
];

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
  {
    id: "apt_2",
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
    id: "apt_3",
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
    id: "apt_4",
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
    id: "apt_5",
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
    id: "apt_6",
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
    id: "apt_7",
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
    id: "apt_8",
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
    id: "apt_9",
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
    id: "apt_10",
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
    id: "apt_30",
    text: "Do you enjoy analyzing complex problems and finding solutions?",
    options: [
      { value: "A", label: "Yes, I love solving complex problems" },
      { value: "B", label: "Sometimes, if the problem interests me" },
      { value: "C", label: "Rarely, I prefer simpler tasks" },
      { value: "D", label: "No, I avoid complex problems" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_11",
    text: "Do you enjoy working with data and statistics?",
    options: [
      { value: "A", label: "Yes, I love analyzing data" },
      { value: "B", label: "Sometimes, if it's interesting" },
      { value: "C", label: "Rarely, only when necessary" },
      { value: "D", label: "No, I avoid data analysis" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_12",
    text: "Are you good at understanding and explaining complex concepts?",
    options: [
      { value: "A", label: "Yes, I excel at explaining complex ideas" },
      { value: "B", label: "Sometimes, depending on the topic" },
      { value: "C", label: "Only with familiar concepts" },
      { value: "D", label: "No, I prefer simple explanations" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_13",
    text: "Do you enjoy working with your hands and creating physical objects?",
    options: [
      { value: "A", label: "Yes, I love hands-on work" },
      { value: "B", label: "Sometimes, if it's interesting" },
      { value: "C", label: "Rarely, but I can do it" },
      { value: "D", label: "No, I prefer mental work" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_14",
    text: "Are you comfortable with public speaking and presentations?",
    options: [
      { value: "A", label: "Yes, I enjoy public speaking" },
      { value: "B", label: "Sometimes, if prepared" },
      { value: "C", label: "Only in small groups" },
      { value: "D", label: "No, I avoid public speaking" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_15",
    text: "Do you enjoy helping others solve their problems?",
    options: [
      { value: "A", label: "Yes, I love helping others" },
      { value: "B", label: "Sometimes, if I can help" },
      { value: "C", label: "Only with close friends" },
      { value: "D", label: "No, I prefer to focus on my own issues" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_16",
    text: "Are you good at organizing and planning events?",
    options: [
      { value: "A", label: "Yes, I excel at organization" },
      { value: "B", label: "Sometimes, for important events" },
      { value: "C", label: "Only for simple tasks" },
      { value: "D", label: "No, I prefer to go with the flow" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_17",
    text: "Do you enjoy working with computers and technology?",
    options: [
      { value: "A", label: "Yes, I love technology" },
      { value: "B", label: "Sometimes, for specific tasks" },
      { value: "C", label: "Only basic usage" },
      { value: "D", label: "No, I prefer non-technical work" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_18",
    text: "Are you good at understanding and interpreting written information?",
    options: [
      { value: "A", label: "Yes, I excel at reading comprehension" },
      { value: "B", label: "Sometimes, depending on the material" },
      { value: "C", label: "Only with familiar topics" },
      { value: "D", label: "No, I prefer visual information" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_19",
    text: "Do you enjoy working with numbers and calculations?",
    options: [
      { value: "A", label: "Yes, I love working with numbers" },
      { value: "B", label: "Sometimes, for practical purposes" },
      { value: "C", label: "Only basic calculations" },
      { value: "D", label: "No, I avoid numbers" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_20",
    text: "Are you good at remembering details and facts?",
    options: [
      { value: "A", label: "Yes, I have excellent memory" },
      { value: "B", label: "Sometimes, for important things" },
      { value: "C", label: "Only for recent events" },
      { value: "D", label: "No, I often forget details" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_21",
    text: "Do you enjoy working with artistic materials and creating designs?",
    options: [
      { value: "A", label: "Yes, I love artistic work" },
      { value: "B", label: "Sometimes, for fun" },
      { value: "C", label: "Only basic art" },
      { value: "D", label: "No, I prefer non-artistic work" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_22",
    text: "Are you good at understanding and following instructions?",
    options: [
      { value: "A", label: "Yes, I follow instructions well" },
      { value: "B", label: "Sometimes, if clear" },
      { value: "C", label: "Only simple instructions" },
      { value: "D", label: "No, I prefer to figure things out myself" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_23",
    text: "Do you enjoy working with animals or plants?",
    options: [
      { value: "A", label: "Yes, I love working with nature" },
      { value: "B", label: "Sometimes, if interesting" },
      { value: "C", label: "Only basic care" },
      { value: "D", label: "No, I prefer other work" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_24",
    text: "Are you good at understanding and using maps and directions?",
    options: [
      { value: "A", label: "Yes, I excel at navigation" },
      { value: "B", label: "Sometimes, with help" },
      { value: "C", label: "Only familiar areas" },
      { value: "D", label: "No, I get lost easily" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_25",
    text: "Do you enjoy working with mechanical objects and tools?",
    options: [
      { value: "A", label: "Yes, I love mechanical work" },
      { value: "B", label: "Sometimes, if needed" },
      { value: "C", label: "Only basic repairs" },
      { value: "D", label: "No, I avoid mechanical work" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_26",
    text: "Are you good at understanding and using technology?",
    options: [
      { value: "A", label: "Yes, I excel with technology" },
      { value: "B", label: "Sometimes, for common tasks" },
      { value: "C", label: "Only basic usage" },
      { value: "D", label: "No, I prefer non-technical work" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_27",
    text: "Do you enjoy working with people and helping them?",
    options: [
      { value: "A", label: "Yes, I love helping people" },
      { value: "B", label: "Sometimes, if I can help" },
      { value: "C", label: "Only with close friends" },
      { value: "D", label: "No, I prefer to work alone" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_28",
    text: "Are you good at understanding and using written language?",
    options: [
      { value: "A", label: "Yes, I excel at writing" },
      { value: "B", label: "Sometimes, for specific tasks" },
      { value: "C", label: "Only basic writing" },
      { value: "D", label: "No, I prefer speaking" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_29",
    text: "Do you enjoy working with scientific concepts and experiments?",
    options: [
      { value: "A", label: "Yes, I love science" },
      { value: "B", label: "Sometimes, if interesting" },
      { value: "C", label: "Only basic science" },
      { value: "D", label: "No, I prefer other subjects" }
    ],
    category: 'aptitude'
  },
  
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
  {
    id: "per_2",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I talk more than I listen" },
      { value: "B", label: "I listen more than I talk" }
    ],
    category: 'personality'
  },
  {
    id: "per_3",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "It is easy for me to approach other individuals and make new friends" },
      { value: "B", label: "I am more likely to be the reserved type and I approach new relationships carefully" }
    ],
    category: 'personality'
  },
  {
    id: "per_4",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I usually act first before I think" },
      { value: "B", label: "I usually think first before I act" }
    ],
    category: 'personality'
  },
  {
    id: "per_5",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I develop new ideas through discussion" },
      { value: "B", label: "I develop new ideas when I focus within myself" }
    ],
    category: 'personality'
  },
  {
    id: "per_6",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I find it easy to introduce myself and interact with many people" },
      { value: "B", label: "I find it difficult to introduce myself and interact with many people" }
    ],
    category: 'personality'
  },
  {
    id: "per_7",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I can easily be distracted while doing a task" },
      { value: "B", label: "I can focus on a task for a longer duration without being distracted easily" }
    ],
    category: 'personality'
  },
  {
    id: "per_8",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I like to learn new things through observation and practical activities" },
      { value: "B", label: "I like to learn new things through intensive thinking and imagination" }
    ],
    category: 'personality'
  },
  {
    id: "per_9",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I like to do things in proven ways" },
      { value: "B", label: "I like to do things in new ways" }
    ],
    category: 'personality'
  },
  {
    id: "per_10",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I usually begin with facts and then build a bigger idea" },
      { value: "B", label: "I usually build a bigger idea and then find out facts" }
    ],
    category: 'personality'
  },
  {
    id: "per_30",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I prefer to work independently" },
      { value: "B", label: "I prefer to work in a team" }
    ],
    category: 'personality'
  },
  {
    id: "per_11",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I prefer to work in a structured environment" },
      { value: "B", label: "I prefer to work in a flexible environment" }
    ],
    category: 'personality'
  },
  {
    id: "per_12",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I like to plan ahead" },
      { value: "B", label: "I prefer to be spontaneous" }
    ],
    category: 'personality'
  },
  {
    id: "per_13",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I enjoy being the center of attention" },
      { value: "B", label: "I prefer to stay in the background" }
    ],
    category: 'personality'
  },
  {
    id: "per_14",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I like to take risks" },
      { value: "B", label: "I prefer to play it safe" }
    ],
    category: 'personality'
  },
  {
    id: "per_15",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I enjoy working under pressure" },
      { value: "B", label: "I prefer a relaxed pace" }
    ],
    category: 'personality'
  },
  {
    id: "per_16",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I like to be in control" },
      { value: "B", label: "I prefer to go with the flow" }
    ],
    category: 'personality'
  },
  {
    id: "per_17",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I enjoy being around people" },
      { value: "B", label: "I prefer solitude" }
    ],
    category: 'personality'
  },
  {
    id: "per_18",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I like to be organized" },
      { value: "B", label: "I prefer to be flexible" }
    ],
    category: 'personality'
  },
  {
    id: "per_19",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I enjoy being creative" },
      { value: "B", label: "I prefer to follow rules" }
    ],
    category: 'personality'
  },
  {
    id: "per_20",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I like to be the leader" },
      { value: "B", label: "I prefer to be a follower" }
    ],
    category: 'personality'
  },
  {
    id: "per_21",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I enjoy being competitive" },
      { value: "B", label: "I prefer to be cooperative" }
    ],
    category: 'personality'
  },
  {
    id: "per_22",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I like to be independent" },
      { value: "B", label: "I prefer to be part of a team" }
    ],
    category: 'personality'
  },
  {
    id: "per_23",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I enjoy being analytical" },
      { value: "B", label: "I prefer to be intuitive" }
    ],
    category: 'personality'
  },
  {
    id: "per_24",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I like to be practical" },
      { value: "B", label: "I prefer to be theoretical" }
    ],
    category: 'personality'
  },
  {
    id: "per_25",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I enjoy being detail-oriented" },
      { value: "B", label: "I prefer to see the big picture" }
    ],
    category: 'personality'
  },
  {
    id: "per_26",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I like to be traditional" },
      { value: "B", label: "I prefer to be innovative" }
    ],
    category: 'personality'
  },
  {
    id: "per_27",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I enjoy being patient" },
      { value: "B", label: "I prefer to be quick" }
    ],
    category: 'personality'
  },
  {
    id: "per_28",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I like to be diplomatic" },
      { value: "B", label: "I prefer to be direct" }
    ],
    category: 'personality'
  },
  {
    id: "per_29",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I enjoy being adaptable" },
      { value: "B", label: "I prefer to be consistent" }
    ],
    category: 'personality'
  },
  
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
  {
    id: "int_2",
    text: "Do you like to participate in stage shows, events, or art competitions?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_3",
    text: "Do you enjoy participating in debates, speeches, or presentations?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_4",
    text: "Do you like to work with a variety of colors and designs?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_5",
    text: "Can you imagine different pictures, colors, and designs when you close your eyes and visualize how things would look from different angles?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_6",
    text: "Can you convince people to do things your way?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_7",
    text: "Do you like to participate in social events, community service, and volunteering?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_8",
    text: "Do you like to learn more about new technologies and how things work?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_9",
    text: "Do you enjoy repairing or fixing gadgets, home appliances, etc.?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_10",
    text: "Which activity would you like the most?",
    options: [
      { value: "A", label: "Lead People" },
      { value: "B", label: "Help People" },
      { value: "C", label: "Organize Data or Things" },
      { value: "D", label: "Analyze Problems" },
      { value: "E", label: "Build or Fix Objects" },
      { value: "F", label: "Design or Decorate Objects" }
    ],
    category: 'interest'
  },
  {
    id: "int_30",
    text: "Do you enjoy working with computers and technology?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_11",
    text: "Do you enjoy working with computers and software?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_12",
    text: "Do you like to work with numbers and calculations?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_13",
    text: "Do you enjoy working with people and helping them?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_14",
    text: "Do you like to work with artistic materials and designs?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_15",
    text: "Do you enjoy working with scientific concepts and experiments?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_16",
    text: "Do you like to work with mechanical objects and tools?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_17",
    text: "Do you enjoy working with written language and communication?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_18",
    text: "Do you like to work with maps and directions?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_19",
    text: "Do you enjoy working with animals or plants?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_20",
    text: "Do you like to work with data and statistics?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_21",
    text: "Do you enjoy working with music and sound?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_22",
    text: "Do you like to work with sports and physical activities?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_23",
    text: "Do you enjoy working with history and culture?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_24",
    text: "Do you like to work with food and cooking?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_25",
    text: "Do you enjoy working with fashion and clothing?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_26",
    text: "Do you like to work with photography and images?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_27",
    text: "Do you enjoy working with law and justice?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_28",
    text: "Do you like to work with medicine and health?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_29",
    text: "Do you enjoy working with education and teaching?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },

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
  {
    id: "lrn_2",
    text: "What's your preferred way of solving problems?",
    options: [
      { value: "A", label: "Breaking them down into smaller parts" },
      { value: "B", label: "Discussing with others" },
      { value: "C", label: "Using past experiences" },
      { value: "D", label: "Finding creative solutions" }
    ],
    category: 'learning-style'
  },
  {
    id: "lrn_3",
    text: "How do you learn best in a group setting?",
    options: [
      { value: "A", label: "I learn best by listening and observing" },
      { value: "B", label: "I learn best by doing hands-on activities" },
      { value: "C", label: "I learn best by discussing and sharing ideas" },
      { value: "D", label: "I learn best by reading and taking notes" }
    ],
    category: 'learning-style'
  },
  {
    id: "lrn_4",
    text: "What's your preferred learning environment?",
    options: [
      { value: "A", label: "A quiet, individual setting" },
      { value: "B", label: "A busy, social setting" },
      { value: "C", label: "A structured, organized setting" },
      { value: "D", label: "A flexible, adaptable setting" }
    ],
    category: 'learning-style'
  },
  {
    id: "lrn_5",
    text: "How do you remember information?",
    options: [
      { value: "A", label: "I remember best by seeing and visualizing" },
      { value: "B", label: "I remember best by hearing and listening" },
      { value: "C", label: "I remember best by doing and practicing" },
      { value: "D", label: "I remember best by discussing and explaining" }
    ],
    category: 'learning-style'
  },
  {
    id: "lrn_6",
    text: "What's your preferred learning pace?",
    options: [
      { value: "A", label: "Slow and steady" },
      { value: "B", label: "Fast and intense" },
      { value: "C", label: "Balanced and consistent" },
      { value: "D", label: "Adaptable and flexible" }
    ],
    category: 'learning-style'
  },
  {
    id: "lrn_7",
    text: "How do you handle mistakes and failures?",
    options: [
      { value: "A", label: "I learn from them and move on" },
      { value: "B", label: "I dwell on them and feel discouraged" },
      { value: "C", label: "I seek advice and guidance" },
      { value: "D", label: "I avoid mistakes and take risks" }
    ],
    category: 'learning-style'
  },
  {
    id: "lrn_8",
    text: "What's your preferred method of studying?",
    options: [
      { value: "A", label: "Reading and taking notes" },
      { value: "B", label: "Listening and discussing" },
      { value: "C", label: "Doing hands-on activities" },
      { value: "D", label: "Visualizing and creating" }
    ],
    category: 'learning-style'
  },
  {
    id: "lrn_9",
    text: "How do you apply what you've learned?",
    options: [
      { value: "A", label: "I apply it immediately" },
      { value: "B", label: "I apply it gradually over time" },
      { value: "C", label: "I apply it selectively" },
      { value: "D", label: "I apply it rarely" }
    ],
    category: 'learning-style'
  },
  {
    id: "lrn_10",
    text: "What's your preferred learning style?",
    options: [
      { value: "A", label: "Visual" },
      { value: "B", label: "Auditory" },
      { value: "C", label: "Kinesthetic" },
      { value: "D", label: "Reading" }
    ],
    category: 'learning-style'
  },
  {
    id: "lrn_11",
    text: "How do you learn best in a team setting?",
    options: [
      { value: "A", label: "I learn best by listening and observing" },
      { value: "B", label: "I learn best by doing hands-on activities" },
      { value: "C", label: "I learn best by discussing and sharing ideas" },
      { value: "D", label: "I learn best by reading and taking notes" }
    ],
    category: 'learning-style'
  },
  {
    id: "lrn_12",
    text: "What's your preferred learning environment?",
    options: [
      { value: "A", label: "A quiet, individual setting" },
      { value: "B", label: "A busy, social setting" },
      { value: "C", label: "A structured, organized setting" },
      { value: "D", label: "A flexible, adaptable setting" }
    ],
    category: 'learning-style'
  },
  {
    id: "lrn_13",
    text: "How do you remember information?",
    options: [
      { value: "A", label: "I remember best by seeing and visualizing" },
      { value: "B", label: "I remember best by hearing and listening" },
      { value: "C", label: "I remember best by doing and practicing" },
      { value: "D", label: "I remember best by discussing and explaining" }
    ],
    category: 'learning-style'
  },
  {
    id: "lrn_14",
    text: "What's your preferred learning pace?",
    options: [
      { value: "A", label: "Slow and steady" },
      { value: "B", label: "Fast and intense" },
      { value: "C", label: "Balanced and consistent" },
      { value: "D", label: "Adaptable and flexible" }
    ],
    category: 'learning-style'
  },
  {
    id: "lrn_15",
    text: "How do you handle mistakes and failures?",
    options: [
      { value: "A", label: "I learn from them and move on" },
      { value: "B", label: "I dwell on them and feel discouraged" },
      { value: "C", label: "I seek advice and guidance" },
      { value: "D", label: "I avoid mistakes and take risks" }
    ],
    category: 'learning-style'
  },
  {
    id: "lrn_16",
    text: "What's your preferred method of studying?",
    options: [
      { value: "A", label: "Reading and taking notes" },
      { value: "B", label: "Listening and discussing" },
      { value: "C", label: "Doing hands-on activities" },
      { value: "D", label: "Visualizing and creating" }
    ],
    category: 'learning-style'
  },
  {
    id: "lrn_17",
    text: "How do you apply what you've learned?",
    options: [
      { value: "A", label: "I apply it immediately" },
      { value: "B", label: "I apply it gradually over time" },
      { value: "C", label: "I apply it selectively" },
      { value: "D", label: "I apply it rarely" }
    ],
    category: 'learning-style'
  },
  {
    id: "lrn_18",
    text: "What's your preferred learning style?",
    options: [
      { value: "A", label: "Visual" },
      { value: "B", label: "Auditory" },
      { value: "C", label: "Kinesthetic" },
      { value: "D", label: "Reading" }
    ],
    category: 'learning-style'
  },
  {
    id: "lrn_19",
    text: "How do you learn best in a team setting?",
    options: [
      { value: "A", label: "I learn best by listening and observing" },
      { value: "B", label: "I learn best by doing hands-on activities" },
      { value: "C", label: "I learn best by discussing and sharing ideas" },
      { value: "D", label: "I learn best by reading and taking notes" }
    ],
    category: 'learning-style'
  },
  {
    id: "lrn_20",
    text: "How do you prefer to review and practice what you've learned?",
    options: [
      { value: "A", label: "Creating mind maps or diagrams" },
      { value: "B", label: "Discussing with others" },
      { value: "C", label: "Doing practice exercises" },
      { value: "D", label: "Reading and summarizing" }
    ],
    category: 'learning-style'
  },

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