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
  {
    id: "apt_21",
    text: "Do you prefer working independently or as part of a team?",
    options: [
      { value: "A", label: "Independently" },
      { value: "B", label: "Both" },
      { value: "C", label: "Team" },
      { value: "D", label: "Neither" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_22",
    text: "Are you comfortable with taking risks to achieve a goal?",
    options: [
      { value: "A", label: "Very Comfortable" },
      { value: "B", label: "Somewhat Comfortable" },
      { value: "C", label: "Not so Comfortable" },
      { value: "D", label: "Not at all Comfortable" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_23",
    text: "Do you enjoy solving complex problems?",
    options: [
      { value: "A", label: "Yes, I love it" },
      { value: "B", label: "Sometimes" },
      { value: "C", label: "Rarely" },
      { value: "D", label: "No, I avoid it" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_24",
    text: "Are you good at managing your time effectively?",
    options: [
      { value: "A", label: "Yes, very good" },
      { value: "B", label: "Somewhat good" },
      { value: "C", label: "Not so good" },
      { value: "D", label: "Not at all good" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_25",
    text: "Do you have a strong attention to detail?",
    options: [
      { value: "A", label: "Yes, very strong" },
      { value: "B", label: "Somewhat strong" },
      { value: "C", label: "Not so strong" },
      { value: "D", label: "Not at all strong" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_26",
    text: "Are you able to think critically and analyze information?",
    options: [
      { value: "A", label: "Yes, very able" },
      { value: "B", label: "Somewhat able" },
      { value: "C", label: "Not so able" },
      { value: "D", label: "Not at all able" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_27",
    text: "Do you enjoy working with numbers and data?",
    options: [
      { value: "A", label: "Yes, I love it" },
      { value: "B", label: "Sometimes" },
      { value: "C", label: "Rarely" },
      { value: "D", label: "No, I avoid it" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_28",
    text: "Are you good at communicating your ideas effectively?",
    options: [
      { value: "A", label: "Yes, very good" },
      { value: "B", label: "Somewhat good" },
      { value: "C", label: "Not so good" },
      { value: "D", label: "Not at all good" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_29",
    text: "Do you have a strong sense of creativity and innovation?",
    options: [
      { value: "A", label: "Yes, very strong" },
      { value: "B", label: "Somewhat strong" },
      { value: "C", label: "Not so strong" },
      { value: "D", label: "Not at all strong" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_30",
    text: "Are you able to adapt to new situations and challenges?",
    options: [
      { value: "A", label: "Yes, very able" },
      { value: "B", label: "Somewhat able" },
      { value: "C", label: "Not so able" },
      { value: "D", label: "Not at all able" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_31",
    text: "Do you enjoy learning new things and expanding your knowledge?",
    options: [
      { value: "A", label: "Yes, I love it" },
      { value: "B", label: "Sometimes" },
      { value: "C", label: "Rarely" },
      { value: "D", label: "No, I avoid it" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_32",
    text: "Are you good at solving technical problems?",
    options: [
      { value: "A", label: "Yes, very good" },
      { value: "B", label: "Somewhat good" },
      { value: "C", label: "Not so good" },
      { value: "D", label: "Not at all good" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_33",
    text: "Do you have a strong sense of leadership?",
    options: [
      { value: "A", label: "Yes, very strong" },
      { value: "B", label: "Somewhat strong" },
      { value: "C", label: "Not so strong" },
      { value: "D", label: "Not at all strong" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_34",
    text: "Are you able to work under pressure and meet deadlines?",
    options: [
      { value: "A", label: "Yes, very able" },
      { value: "B", label: "Somewhat able" },
      { value: "C", label: "Not so able" },
      { value: "D", label: "Not at all able" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_35",
    text: "Do you enjoy working with people from diverse backgrounds?",
    options: [
      { value: "A", label: "Yes, I love it" },
      { value: "B", label: "Sometimes" },
      { value: "C", label: "Rarely" },
      { value: "D", label: "No, I avoid it" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_36",
    text: "Are you good at negotiating and resolving conflicts?",
    options: [
      { value: "A", label: "Yes, very good" },
      { value: "B", label: "Somewhat good" },
      { value: "C", label: "Not so good" },
      { value: "D", label: "Not at all good" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_37",
    text: "Do you have a strong work ethic and commitment to excellence?",
    options: [
      { value: "A", label: "Yes, very strong" },
      { value: "B", label: "Somewhat strong" },
      { value: "C", label: "Not so strong" },
      { value: "D", label: "Not at all strong" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_38",
    text: "Are you able to think strategically and plan for the future?",
    options: [
      { value: "A", label: "Yes, very able" },
      { value: "B", label: "Somewhat able" },
      { value: "C", label: "Not so able" },
      { value: "D", label: "Not at all able" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_39",
    text: "Do you enjoy taking on new challenges and responsibilities?",
    options: [
      { value: "A", label: "Yes, I love it" },
      { value: "B", label: "Sometimes" },
      { value: "C", label: "Rarely" },
      { value: "D", label: "No, I avoid it" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_40",
    text: "Are you good at making decisions under pressure?",
    options: [
      { value: "A", label: "Yes, very good" },
      { value: "B", label: "Somewhat good" },
      { value: "C", label: "Not so good" },
      { value: "D", label: "Not at all good" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_41",
    text: "Do you have a strong sense of empathy and compassion?",
    options: [
      { value: "A", label: "Yes, very strong" },
      { value: "B", label: "Somewhat strong" },
      { value: "C", label: "Not so strong" },
      { value: "D", label: "Not at all strong" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_42",
    text: "Are you able to maintain a positive attitude in the face of adversity?",
    options: [
      { value: "A", label: "Yes, very able" },
      { value: "B", label: "Somewhat able" },
      { value: "C", label: "Not so able" },
      { value: "D", label: "Not at all able" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_43",
    text: "Do you enjoy working in a fast-paced environment?",
    options: [
      { value: "A", label: "Yes, I love it" },
      { value: "B", label: "Sometimes" },
      { value: "C", label: "Rarely" },
      { value: "D", label: "No, I avoid it" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_44",
    text: "Are you good at multitasking and managing multiple projects simultaneously?",
    options: [
      { value: "A", label: "Yes, very good" },
      { value: "B", label: "Somewhat good" },
      { value: "C", label: "Not so good" },
      { value: "D", label: "Not at all good" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_45",
    text: "Do you have a strong sense of ethics and integrity?",
    options: [
      { value: "A", label: "Yes, very strong" },
      { value: "B", label: "Somewhat strong" },
      { value: "C", label: "Not so strong" },
      { value: "D", label: "Not at all strong" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_46",
    text: "Are you able to think outside the box and come up with innovative solutions?",
    options: [
      { value: "A", label: "Yes, very able" },
      { value: "B", label: "Somewhat able" },
      { value: "C", label: "Not so able" },
      { value: "D", label: "Not at all able" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_47",
    text: "Do you enjoy working with technology and learning about new advancements?",
    options: [
      { value: "A", label: "Yes, I love it" },
      { value: "B", label: "Sometimes" },
      { value: "C", label: "Rarely" },
      { value: "D", label: "No, I avoid it" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_48",
    text: "Are you good at organizing and managing resources effectively?",
    options: [
      { value: "A", label: "Yes, very good" },
      { value: "B", label: "Somewhat good" },
      { value: "C", label: "Not so good" },
      { value: "D", label: "Not at all good" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_49",
    text: "Do you have a strong sense of responsibility and accountability?",
    options: [
      { value: "A", label: "Yes, very strong" },
      { value: "B", label: "Somewhat strong" },
      { value: "C", label: "Not so strong" },
      { value: "D", label: "Not at all strong" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_50",
    text: "Are you able to adapt to changing priorities and deadlines?",
    options: [
      { value: "A", label: "Yes, very able" },
      { value: "B", label: "Somewhat able" },
      { value: "C", label: "Not so able" },
      { value: "D", label: "Not at all able" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_51",
    text: "Do you enjoy working in a collaborative environment?",
    options: [
      { value: "A", label: "Yes, I love it" },
      { value: "B", label: "Sometimes" },
      { value: "C", label: "Rarely" },
      { value: "D", label: "No, I avoid it" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_52",
    text: "Are you good at problem-solving and finding creative solutions?",
    options: [
      { value: "A", label: "Yes, very good" },
      { value: "B", label: "Somewhat good" },
      { value: "C", label: "Not so good" },
      { value: "D", label: "Not at all good" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_53",
    text: "Do you have a strong desire to make a positive impact on the world?",
    options: [
      { value: "A", label: "Yes, very strong" },
      { value: "B", label: "Somewhat strong" },
      { value: "C", label: "Not so strong" },
      { value: "D", label: "Not at all strong" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_54",
    text: "Are you able to think critically and evaluate different perspectives?",
    options: [
      { value: "A", label: "Yes, very able" },
      { value: "B", label: "Somewhat able" },
      { value: "C", label: "Not so able" },
      { value: "D", label: "Not at all able" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_55",
    text: "Do you enjoy working with your hands and creating tangible products?",
    options: [
      { value: "A", label: "Yes, I love it" },
      { value: "B", label: "Sometimes" },
      { value: "C", label: "Rarely" },
      { value: "D", label: "No, I avoid it" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_56",
    text: "Are you good at managing your finances and making sound investments?",
    options: [
      { value: "A", label: "Yes, very good" },
      { value: "B", label: "Somewhat good" },
      { value: "C", label: "Not so good" },
      { value: "D", label: "Not at all good" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_57",
    text: "Do you have a strong interest in science and technology?",
    options: [
      { value: "A", label: "Yes, very strong" },
      { value: "B", label: "Somewhat strong" },
      { value: "C", label: "Not so strong" },
      { value: "D", label: "Not at all strong" }
    ],
    category: 'aptitude'
  },
  {
    id: "apt_58",
    text: "Are you able to communicate effectively with people from different cultures?",
    options: [
      { value: "A", label: "Yes, very able" },
      { value: "B", label: "Somewhat able" },
      { value: "C", label: "Not so able" },
      { value: "D", label: "Not at all able" }
    ],
    category: 'aptitude'
  },
  
  // Personality questions (59-77)
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
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I prefer to trust my actual experience" },
      { value: "B", label: "I prefer to trust my gut instincts" }
    ],
    category: 'personality'
  },
  {
    id: "per_12",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I apply details and facts in my assignments" },
      { value: "B", label: "I apply new ideas in my assignments" }
    ],
    category: 'personality'
  },
  {
    id: "per_13",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I prefer practical solutions in solving issues" },
      { value: "B", label: "I prefer creative solutions in solving issues" }
    ],
    category: 'personality'
  },
  
  // Additional personality questions (14-19)
  {
    id: "per_14",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I prefer to learn step by step in a structured way" },
      { value: "B", label: "I prefer to learn in a non-orderly, random manner" }
    ],
    category: 'personality'
  },
  {
    id: "per_15",
    text: "How do you take decisions?",
    options: [
      { value: "A", label: "I usually take decisions with my head and focus on facts" },
      { value: "B", label: "I usually take decisions with my heart and consider others' feelings" }
    ],
    category: 'personality'
  },
  {
    id: "per_16",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "Usually, I am not sensitive to other people's opinions and comments about me" },
      { value: "B", label: "I am sensitive to other people's opinions and comments about me" }
    ],
    category: 'personality'
  },
  {
    id: "per_17",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I see myself as a precise, scientific, and intellectual person" },
      { value: "B", label: "I see myself as a helpful, friendly, and caring person" }
    ],
    category: 'personality'
  },
  {
    id: "per_18",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I am usually tough-minded" },
      { value: "B", label: "I am usually soft-hearted" }
    ],
    category: 'personality'
  },
  {
    id: "per_19",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I usually give direct and honest opinions to others" },
      { value: "B", label: "I am usually careful not to hurt others with my comments" }
    ],
    category: 'personality'
  },
  
  // More personality questions (20-25)
  {
    id: "per_20",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I am motivated by achievement" },
      { value: "B", label: "I am motivated by appreciation" }
    ],
    category: 'personality'
  },
  {
    id: "per_21",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I give more importance to facts, tasks, and logical considerations" },
      { value: "B", label: "I give more importance to the personal value system and social considerations" }
    ],
    category: 'personality'
  },
  {
    id: "per_22",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I like to make plans and schedules and try to stick with them" },
      { value: "B", label: "I like to be flexible and keep plans to a minimum" }
    ],
    category: 'personality'
  },
  {
    id: "per_23",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I usually take tasks without making a plan" },
      { value: "B", label: "I usually plan everything first in advance before moving into action" }
    ],
    category: 'personality'
  },
  {
    id: "per_24",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I often juggle multiple tasks at a time" },
      { value: "B", label: "I usually do one task at a time" }
    ],
    category: 'personality'
  },
  
  // Interest questions (1-7)
  {
    id: "int_1",
    text: "Given an option, how much would you like to choose the given value in your dream job? Adventurous and excitement involving physical risk.",
    options: [
      { value: "A", label: "Always" },
      { value: "B", label: "Most of the time" },
      { value: "C", label: "Not really" },
      { value: "D", label: "Definitely No" }
    ],
    category: 'interest'
  },
  {
    id: "int_2",
    text: "Given an option, how much would you like to choose the given value in your dream job? Freedom to work alone, make my own decisions, plan my own work.",
    options: [
      { value: "A", label: "Always, I like to work alone" },
      { value: "B", label: "Most of the time" },
      { value: "C", label: "Not really, mostly I like to work in groups" },
      { value: "D", label: "Definitely No, in fact, I enjoy working in groups" }
    ],
    category: 'interest'
  },
  {
    id: "int_3",
    text: "Given an option, how much would you like to choose the given value in your dream job? Work on the frontiers of knowledge that requires continuous learning.",
    options: [
      { value: "A", label: "Always, I would like to upgrade my skills" },
      { value: "B", label: "Most of the time" },
      { value: "C", label: "Not really" },
      { value: "D", label: "Definitely No" }
    ],
    category: 'interest'
  },
  {
    id: "int_4",
    text: "Given an option, how much would you like to choose the given value in your dream job? Work that has a high degree of competition, challenge, pace, and excitement.",
    options: [
      { value: "A", label: "Always, I would like to work in a high-paced, challenging work environment" },
      { value: "B", label: "Most of the time" },
      { value: "C", label: "Not really" },
      { value: "D", label: "Definitely No, the working environment should be pleasant and peaceful, requiring honesty" }
    ],
    category: 'interest'
  },
  {
    id: "int_5",
    text: "Given an option, how much would you like to choose the given value in your dream job? Structured work environment requiring a high level of accuracy, reliability, and set procedures in work.",
    options: [
      { value: "A", label: "Always" },
      { value: "B", label: "Most of the time" },
      { value: "C", label: "Not really" },
      { value: "D", label: "Definitely No, the work environment should be casual and flexible" }
    ],
    category: 'interest'
  },
  {
    id: "int_6",
    text: "Given an option, how much would you like to choose the given value in your dream job? Engage in creative work in any form of art.",
    options: [
      { value: "A", label: "Always" },
      { value: "B", label: "Most of the time" },
      { value: "C", label: "Not really" },
      { value: "D", label: "Definitely No" }
    ],
    category: 'interest'
  },
  {
    id: "int_7",
    text: "Given an option, how much would you like to choose the given value in your dream job? Work should involve social services, responsibility, and welfare of people and society.",
    options: [
      { value: "A", label: "Always" },
      { value: "B", label: "Most of the time" },
      { value: "C", label: "Not really" },
      { value: "D", label: "Definitely No" }
    ],
    category: 'interest'
  },
  
  // Learning style questions (1-8)
  {
    id: "lrn_1",
    text: "You are not sure whether a word should be spelled 'dependent' or 'dependant'. You would:",
    options: [
      { value: "A", label: "Look it up in the dictionary" },
      { value: "B", label: "Picturize the word in your mind and choose the way it looks" },
      { value: "C", label: "Spell it out loud to see if it sounds right" },
      { value: "D", label: "Write both versions down on paper and choose one" }
    ],
    category: 'learning-style'
  },
  {
    id: "lrn_2",
    text: "When you study, what makes you learn better?",
    options: [
      { value: "A", label: "Read and re-write notes, headings in a book" },
      { value: "B", label: "Listen to a lecture, discuss it, or repeat loudly to yourself" },
      { value: "C", label: "Move around and learn by practicals, demonstrations" },
      { value: "D", label: "Convert text to labeled diagrams, flowcharts, images, and illustrations" }
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
      { value: "A", label: "Make plenty of notes on what the teacher says" },
      { value: "B", label: "Listen carefully and make some notes" },
      { value: "C", label: "Draw pictures, illustrations while listening" },
      { value: "D", label: "Prefer more examples, demos, and real-time applications" }
    ],
    category: 'learning-style'
  },
  {
    id: "lrn_5",
    text: "You have to present your ideas to your class. You would:",
    options: [
      { value: "A", label: "Prefer creating a working model and demonstrating to others" },
      { value: "B", label: "Prefer creating diagrams, flowcharts, and graphs to explain ideas" },
      { value: "C", label: "Prefer to write and practice a few keywords by saying them over and over again" },
      { value: "D", label: "Prefer to write down and practice my speech by reading it over and over again" }
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
      { value: "A", label: "Trying or testing it" },
      { value: "B", label: "Reading the details or checking its features online" },
      { value: "C", label: "Modern design and sleek looks" },
      { value: "D", label: "The salesperson telling me about its features" }
    ],
    category: 'learning-style'
  },
  {
    id: "lrn_8",
    text: "Remember a time when you learned how to do something new. Avoid choosing a physical skill, e.g., Riding a bike. You learned best by:",
    options: [
      { value: "A", label: "Watching a demonstration" },
      { value: "B", label: "Listening to somebody explaining it and asking questions" },
      { value: "C", label: "Diagrams, maps, and charts - visual clues" },
      { value: "D", label: "Written instructions, e.g., a manual or book" }
    ],
    category: 'learning-style'
  },
  
  // Additional interest questions (8-15)
  {
    id: "int_8",
    text: "Do you like physical activities that require strength rather than sitting and watching?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_9",
    text: "Do you like to participate in stage shows, events, or art competitions?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_10",
    text: "Do you enjoy participating in debates, speeches, or presentations?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_11",
    text: "Do you like to work with a variety of colors and designs?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_12",
    text: "Can you imagine different pictures, colors, and designs when you close your eyes and visualize how things would look from different angles?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_13",
    text: "Can you convince people to do things your way?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_14",
    text: "Do you like to participate in social events, community service, and volunteering?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_15",
    text: "Do you like to learn more about new technologies and how things work?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  
  // More interest questions (16-17)
  {
    id: "int_16",
    text: "Do you enjoy repairing or fixing gadgets, home appliances, etc.?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  {
    id: "int_17",
    text: "Do you have an affinity for numbers and an interest in business and the economy?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ],
    category: 'interest'
  },
  
  // Leadership & Decision-Making Questions
  {
    id: "ldm_1",
    text: "How do you make crucial decisions?",
    options: [
      { value: "A", label: "My decision goes along with the majority." },
      { value: "B", label: "I make decisions on my own." },
      { value: "C", label: "I take advice before deciding." },
      { value: "D", label: "I follow others' decisions." },
      { value: "E", label: "Others decide for me." }
    ],
    category: 'aptitude'
  },
  {
    id: "ldm_2",
    text: "If a team member struggles, what would you do?",
    options: [
      { value: "A", label: "Take over their tasks." },
      { value: "B", label: "Assign easier tasks." },
      { value: "C", label: "Offer help and support." },
      { value: "D", label: "Ignore and focus on your work." }
    ],
    category: 'aptitude'
  },
  {
    id: "ldm_3",
    text: "I can determine the best solution to a problem.",
    options: [
      { value: "A", label: "Almost always" },
      { value: "B", label: "Quite often" },
      { value: "C", label: "Sometimes" },
      { value: "D", label: "Not very often" },
      { value: "E", label: "Never" }
    ],
    category: 'aptitude'
  },
  
  // Administrative & Organizational Skills
  {
    id: "aos_1",
    text: "Do you plan your work?",
    options: [
      { value: "A", label: "Plan at the last moment." },
      { value: "B", label: "Plan when time is minimal." },
      { value: "C", label: "Schedule before starting." },
      { value: "D", label: "No planning (waste of time)." },
      { value: "E", label: "Plan while working." }
    ],
    category: 'aptitude'
  },
  {
    id: "aos_2",
    text: "Find the exact copy of the code: ###HIFH257O388I.",
    options: [
      { value: "A", label: "###HIFH257O388I" },
      { value: "B", label: "###HIFE257O388I" },
      { value: "C", label: "###HIFH257O388I" },
      { value: "D", label: "###HIFH257O388I" },
      { value: "E", label: "###HIFH257O388I" }
    ],
    category: 'aptitude'
  },
  
  // Mechanical/Logical Reasoning
  {
    id: "mlr_1",
    text: "The bob on the two pendulums have the same weight. If both the pendulums are swung at the same time, which one will swing faster?",
    options: [
      { value: "A", label: "A" },
      { value: "B", label: "B" },
      { value: "C", label: "Both will swing at the same pace" },
      { value: "D", label: "Not Sure" }
    ],
    category: 'aptitude'
  },
  {
    id: "mlr_2",
    text: "If a car and a bowling ball went off a 100-metre cliff at the same time, which would hit the ground first? (Do not consider air friction)",
    options: [
      { value: "A", label: "Car" },
      { value: "B", label: "Bowling Ball" },
      { value: "C", label: "Both will hit the ground at same time" },
      { value: "D", label: "Not Sure" }
    ],
    category: 'aptitude'
  },
  {
    id: "mlr_3",
    text: "In which direction will the gear on the right turn?",
    options: [
      { value: "A", label: "Clockwise" },
      { value: "B", label: "Anti-Clockwise" },
      { value: "C", label: "It will be steady" },
      { value: "D", label: "Not sure" }
    ],
    category: 'aptitude'
  },
  {
    id: "mlr_4",
    text: "A sister weighs 100 Kg and her brother weighs 50 Kg. If the brother is sitting 6 meters from the pivot (midpoint), how many meters should the sister sit to balance the seesaw?",
    options: [
      { value: "A", label: "6 meters" },
      { value: "B", label: "5 meters" },
      { value: "C", label: "4 meters" },
      { value: "D", label: "3 meters" }
    ],
    category: 'aptitude'
  },
  {
    id: "mlr_5",
    text: "Two men are carrying a heavy box using a plank. Who is carrying most of the load?",
    options: [
      { value: "A", label: "A" },
      { value: "B", label: "B" },
      { value: "C", label: "Both are carrying equal amount." },
      { value: "D", label: "None of the above" }
    ],
    category: 'aptitude'
  },
  
  // Verbal Ability
  {
    id: "va_1",
    text: "Find the verb in the sentence: 'The goats crossed the stream.'",
    options: [
      { value: "A", label: "The" },
      { value: "B", label: "goats" },
      { value: "C", label: "crossed" },
      { value: "D", label: "the" },
      { value: "E", label: "stream" }
    ],
    category: 'aptitude'
  },
  {
    id: "va_2",
    text: "Find the word with the correct spelling.",
    options: [
      { value: "A", label: "Sacrifice" },
      { value: "B", label: "Occasion" },
      { value: "C", label: "Ocurrence" },
      { value: "D", label: "Intelligence" }
    ],
    category: 'aptitude'
  },
  {
    id: "va_3",
    text: "Spot the grammatical error in: '(A)/ The teacher was angry (B)/ when he found that (C)/ you are not there (D)/ in the class.'",
    options: [
      { value: "A", label: "Error in clause A" },
      { value: "B", label: "Error in clause B" },
      { value: "C", label: "Error in clause C" },
      { value: "D", label: "Error in clause D" }
    ],
    category: 'aptitude'
  },
  {
    id: "va_4",
    text: "Instruction: Fill in the blanks. 'I have ______ the presentation for you. I ______ it during my lunch break.'",
    options: [
      { value: "A", label: "wrote & done" },
      { value: "B", label: "prepared & did" },
      { value: "C", label: "write & did" },
      { value: "D", label: "prepared & done" },
      { value: "E", label: "None of the above" }
    ],
    category: 'aptitude'
  },
  
  // Numerical Ability
  {
    id: "na_1",
    text: "Which one is a prime number?",
    options: [
      { value: "A", label: "33" },
      { value: "B", label: "81" },
      { value: "C", label: "93" },
      { value: "D", label: "83" }
    ],
    category: 'aptitude'
  },
  {
    id: "na_2",
    text: "If 7 spiders spin 7 webs in 7 days, then how many days will a spider take to spin a web?",
    options: [
      { value: "A", label: "7" },
      { value: "B", label: "5" },
      { value: "C", label: "3" },
      { value: "D", label: "2" },
      { value: "E", label: "1" }
    ],
    category: 'aptitude'
  },
  {
    id: "na_3",
    text: "Find the series: 4, 8, 16, 32, ---?",
    options: [
      { value: "A", label: "48" },
      { value: "B", label: "64" },
      { value: "C", label: "40" },
      { value: "D", label: "50" }
    ],
    category: 'aptitude'
  },
  
  // Logical Reasoning
  {
    id: "lr_1",
    text: "Some greens are blue. No blues are white. Therefore:",
    options: [
      { value: "A", label: "Some greens are white" },
      { value: "B", label: "No whites are green" },
      { value: "C", label: "No greens are white" },
      { value: "D", label: "None of the above" }
    ],
    category: 'aptitude'
  },
  {
    id: "lr_2",
    text: "Pick the odd one out:",
    options: [
      { value: "A", label: "Index" },
      { value: "B", label: "Glossary" },
      { value: "C", label: "Chapter" },
      { value: "D", label: "Book" }
    ],
    category: 'aptitude'
  },
  {
    id: "lr_3",
    text: "Complete the following series: BD CEF DFGH ?",
    options: [
      { value: "A", label: "EGHIJ" },
      { value: "B", label: "EGHI" },
      { value: "C", label: "EHGIJ" },
      { value: "D", label: "EGHIJK" }
    ],
    category: 'aptitude'
  },
  {
    id: "lr_4",
    text: "Statement I - The government has imported large quantities of sugar as per trade agreement with other countries. Statement II - The prices of sugar in the domestic market have fallen sharply in the recent months.",
    options: [
      { value: "A", label: "Statement I is the cause and statement II is its effect." },
      { value: "B", label: "Statement II is the cause and statement I is its effect." },
      { value: "C", label: "Both the statements I and II are independent causes." },
      { value: "D", label: "Both the statements I and II are effects of another common cause." }
    ],
    category: 'aptitude'
  },
  
  // Spatial & Visualization Ability
  {
    id: "sva_1",
    text: "What will a figure look like after the extra piece is folded over?",
    options: [
      { value: "A", label: "A" },
      { value: "B", label: "B" },
      { value: "C", label: "C" },
      { value: "D", label: "D" },
      { value: "E", label: "E" }
    ],
    category: 'aptitude'
  },
  {
    id: "sva_2",
    text: "What do you see in this image?",
    options: [
      { value: "A", label: "21" },
      { value: "B", label: "75" },
      { value: "C", label: "95" },
      { value: "D", label: "94" },
      { value: "E", label: "74" }
    ],
    category: 'aptitude'
  },
  {
    id: "sva_3",
    text: "Which image can be made from the three shapes shown?",
    options: [
      { value: "A", label: "A" },
      { value: "B", label: "B" },
      { value: "C", label: "C" },
      { value: "D", label: "D" },
      { value: "E", label: "E" }
    ],
    category: 'aptitude'
  },
  {
    id: "sva_4",
    text: "Look at this picture. Identify the missing part.",
    options: [
      { value: "A", label: "A" },
      { value: "B", label: "B" },
      { value: "C", label: "C" },
      { value: "D", label: "D" },
      { value: "E", label: "E" }
    ],
    category: 'aptitude'
  },
  {
    id: "sva_5",
    text: "How does the image look after mixing two images?",
    options: [
      { value: "A", label: "A" },
      { value: "B", label: "B" },
      { value: "C", label: "C" },
      { value: "D", label: "D" },
      { value: "E", label: "E" }
    ],
    category: 'aptitude'
  },
  
  // Social & Cooperation Skills
  {
    id: "scs_1",
    text: "You find that your friend's performance in school is going down. What will you do?",
    options: [
      { value: "A", label: "Inform parents/teachers for help." },
      { value: "B", label: "Help improve their performance." },
      { value: "C", label: "Understand the reason behind the decline." },
      { value: "D", label: "Ask a common friend to help." },
      { value: "E", label: "Feel good about outperforming them." }
    ],
    category: 'personality'
  },
  
  // Career Preferences & Personality
  {
    id: "cpp_1",
    text: "What do you like most?",
    options: [
      { value: "A", label: "Social Activities" },
      { value: "B", label: "Managing tasks" },
      { value: "C", label: "Influencing People" },
      { value: "D", label: "Creativity" },
      { value: "E", label: "Research" },
      { value: "F", label: "Outdoor and Physical Activities" }
    ],
    category: 'interest'
  },
  {
    id: "cpp_2",
    text: "How do you see yourself?",
    options: [
      { value: "A", label: "Precise, Scientific, Intellectual" },
      { value: "B", label: "Expressive, Imaginative, Creative" },
      { value: "C", label: "Helpful, Friendly, Trustworthy" },
      { value: "D", label: "Energetic, Influential, Sociable" },
      { value: "E", label: "Planned, Organized, Accurate" },
      { value: "F", label: "Practical, Mechanical, Physically Active" }
    ],
    category: 'personality'
  },
  {
    id: "cpp_3",
    text: "Which motivates you?",
    options: [
      { value: "A", label: "Achievement" },
      { value: "B", label: "Appreciation" }
    ],
    category: 'personality'
  },
  {
    id: "cpp_4",
    text: "Prefer facts or values?",
    options: [
      { value: "A", label: "Facts & logic" },
      { value: "B", label: "Personal & social values" }
    ],
    category: 'personality'
  },
  
  // Learning Style
  {
    id: "ls_1",
    text: "To learn a computer, would you rather:",
    options: [
      { value: "A", label: "Watch a video" },
      { value: "B", label: "Listen" },
      { value: "C", label: "Disassemble" },
      { value: "D", label: "Read instructions" }
    ],
    category: 'learning-style'
  },
  {
    id: "ls_2",
    text: "When studying, you learn better by:",
    options: [
      { value: "A", label: "Rewriting notes" },
      { value: "B", label: "Listening & discussing" },
      { value: "C", label: "Practicums" },
      { value: "D", label: "Diagrams" }
    ],
    category: 'learning-style'
  },
  {
    id: "ls_3",
    text: "Preferred teacher style:",
    options: [
      { value: "A", label: "Diagrams" },
      { value: "B", label: "Q&A" },
      { value: "C", label: "Handouts" },
      { value: "D", label: "Demos" }
    ],
    category: 'learning-style'
  },
  
  // Job Value Preferences
  {
    id: "jvp_1",
    text: "How much would you want adventure and excitement involving physical risk in your dream job?",
    options: [
      { value: "A", label: "Very much" },
      { value: "B", label: "Somewhat" },
      { value: "C", label: "Not much" },
      { value: "D", label: "Not at all" }
    ],
    category: 'interest'
  },
  {
    id: "jvp_2",
    text: "How much would you want autonomy to work independently in your dream job?",
    options: [
      { value: "A", label: "Very much" },
      { value: "B", label: "Somewhat" },
      { value: "C", label: "Not much" },
      { value: "D", label: "Not at all" }
    ],
    category: 'interest'
  },
  {
    id: "jvp_3",
    text: "How much would you want continuous learning in your dream job?",
    options: [
      { value: "A", label: "Very much" },
      { value: "B", label: "Somewhat" },
      { value: "C", label: "Not much" },
      { value: "D", label: "Not at all" }
    ],
    category: 'interest'
  }
];
