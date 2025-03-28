
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
    id: "apt_11",
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
    id: "apt_12",
    text: "Do you like taking photographs and collecting pictures?",
    options: [
      { value: "A", label: "Yes, I love photography and visuals" },
      { value: "B", label: "Sometimes, I take pictures occasionally" },
      { value: "C", label: "Rarely, but I enjoy looking at photos" },
      { value: "D", label: "No, I am not interested in photography" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_13",
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
    id: "apt_14",
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
    id: "apt_15",
    text: "Do you like to take command of situations and lead others?",
    options: [
      { value: "A", label: "Yes, I naturally take leadership roles" },
      { value: "B", label: "Sometimes, when needed" },
      { value: "C", label: "Rarely, but I can lead if necessary" },
      { value: "D", label: "No, I prefer following others' lead" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_16",
    text: "Are you good at influencing people?",
    options: [
      { value: "A", label: "Yes, I can persuade and convince others easily" },
      { value: "B", label: "Sometimes, if I feel strongly about something" },
      { value: "C", label: "Rarely, but I try to express my views" },
      { value: "D", label: "No, I do not like influencing others" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_17",
    text: "Do you often take part in outdoor sports, activities, or adventures?",
    options: [
      { value: "A", label: "Yes, I love outdoor activities" },
      { value: "B", label: "Sometimes, depending on the sport or adventure" },
      { value: "C", label: "Rarely, but I enjoy it occasionally" },
      { value: "D", label: "No, I prefer indoor activities" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_18",
    text: "Do you enjoy working with data, written records, and details?",
    options: [
      { value: "A", label: "Yes, I love analyzing and organizing data" },
      { value: "B", label: "Sometimes, if it's necessary for my work" },
      { value: "C", label: "Rarely, I prefer less detailed work" },
      { value: "D", label: "No, I do not like working with data" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_19",
    text: "Do you like to plan, organize, and prioritize activities?",
    options: [
      { value: "A", label: "Yes, I am highly organized and enjoy planning" },
      { value: "B", label: "Sometimes, when I need to manage tasks" },
      { value: "C", label: "Rarely, I prefer flexibility over planning" },
      { value: "D", label: "No, I do not like planning activities" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_20",
    text: "Are you very observant and notice creative things that others miss?",
    options: [
      { value: "A", label: "Yes, I often notice details others overlook" },
      { value: "B", label: "Sometimes, if it catches my interest" },
      { value: "C", label: "Rarely, but I do appreciate creativity" },
      { value: "D", label: "No, I don't usually notice such things" }
    ],
    category: 'aptitude'
  },
  
  // Personality Questions (21-40)
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
    id: "per_11",
    text: "How do you take decisions?",
    options: [
      { value: "A", label: "I usually take decisions with my head and focus on facts" },
      { value: "B", label: "I usually take decisions with my heart and consider others' feelings" }
    ],
    category: 'personality'
  },
  {
    id: "per_12",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I am usually tough-minded" },
      { value: "B", label: "I am usually soft-hearted" }
    ],
    category: 'personality'
  },
  {
    id: "per_13",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I usually give direct and honest opinions to others" },
      { value: "B", label: "I am usually careful not to hurt others with my comments" }
    ],
    category: 'personality'
  },
  {
    id: "per_14",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I am motivated by achievement" },
      { value: "B", label: "I am motivated by appreciation" }
    ],
    category: 'personality'
  },
  {
    id: "per_15",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I like to make plans and schedules and try to stick with them" },
      { value: "B", label: "I like to be flexible and keep plans to a minimum" }
    ],
    category: 'personality'
  },
  
  // Interest Questions (41-60)
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
    text: "Do you have an affinity for numbers and an interest in business and the economy?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_11",
    text: "Do you enjoy working indoors and doing paperwork?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_12",
    text: "Are you good at arguing your point of view?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_13",
    text: "Do you enjoy opening gadgets or toys to see their mechanism and how they work?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_14",
    text: "Do you find it easy to get involved in creative activities?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_15",
    text: "Do you often discuss social issues in society?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  
  // Learning Style Questions (90-97)
  {
    id: "lrn_1",
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
    id: "lrn_2",
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
    id: "lrn_3",
    text: "To learn how a computer works, would you rather:",
    options: [
      { value: "A", label: "Watch a demo video about it?" },
      { value: "B", label: "Listen to someone explaining it?" },
      { value: "C", label: "Take the computer apart and try to figure it out by myself?" },
      { value: "D", label: "Read the instructions and catalogue?" }
    ],
    category: 'learning-style'
  },
  {
    id: "lrn_4",
    text: "In a class or seminar, You usually:",
    options: [
      { value: "A", label: "Make plenty of notes on what the teacher says." },
      { value: "B", label: "Listen carefully and make some notes." },
      { value: "C", label: "Draw pictures, illustrations while listening." },
      { value: "D", label: "Prefer more examples, demos, and real-time applications." }
    ],
    category: 'learning-style'
  },
  {
    id: "lrn_5",
    text: "You have to present your ideas to your class. You would:",
    options: [
      { value: "A", label: "Prefer creating a working model and demonstrating to others." },
      { value: "B", label: "Prefer creating diagrams, flowcharts, and graphs to explain ideas." },
      { value: "C", label: "Prefer to write and practice a few keywords by saying them over and over again." },
      { value: "D", label: "Prefer to write down and practice my speech by reading it over and over again." }
    ],
    category: 'learning-style'
  },
  {
    id: "lrn_6",
    text: "Do you prefer a teacher or a presenter who uses:",
    options: [
      { value: "A", label: "Diagrams, charts, or graphs?" },
      { value: "B", label: "Question and answer, talk, group discussion, or guest speakers?" },
      { value: "C", label: "Handouts, books, or readings?" },
      { value: "D", label: "Demonstrations, models, or practical sessions?" }
    ],
    category: 'learning-style'
  },
  {
    id: "lrn_7",
    text: "You are about to purchase a digital camera or a mobile phone. Apart from the price, what would have the most influence on your decision?",
    options: [
      { value: "A", label: "Trying or testing it." },
      { value: "B", label: "Reading the details or checking its features online." },
      { value: "C", label: "Modern design and sleek looks." },
      { value: "D", label: "The salesperson telling me about its features." }
    ],
    category: 'learning-style'
  },
  {
    id: "lrn_8",
    text: "Remember a time when you learned how to do something new. You learned best by:",
    options: [
      { value: "A", label: "Watching a demonstration." },
      { value: "B", label: "Listening to somebody explaining it and asking questions." },
      { value: "C", label: "Diagrams, maps, and charts - visual clues." },
      { value: "D", label: "Written instructions, e.g., a manual or book." }
    ],
    category: 'learning-style'
  }
];
