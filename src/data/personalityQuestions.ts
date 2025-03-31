
export interface Question {
  id: string;
  text: string;
  options: {
    value: string;
    label: string;
  }[];
}

export const personalityQuestions: Question[] = [
  {
    id: "p1",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I usually like to have many people around me" },
      { value: "B", label: "I enjoy spending time with myself" }
    ]
  },
  {
    id: "p2",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I talk more than I listen" },
      { value: "B", label: "I listen more than I talk" }
    ]
  },
  {
    id: "p3",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "It is easy for me to approach other individuals and make new friends" },
      { value: "B", label: "I am more likely to be the reserved type and I approach new relationships carefully" }
    ]
  },
  {
    id: "p4",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I usually act first before I think" },
      { value: "B", label: "I usually think first before I act" }
    ]
  },
  {
    id: "p5",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I develop new ideas through discussion" },
      { value: "B", label: "I develop new ideas when I focus within myself" }
    ]
  },
  {
    id: "p6",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I find it easy to introduce myself and interact with many people" },
      { value: "B", label: "I find it difficult to introduce myself and interact with many people" }
    ]
  },
  {
    id: "p7",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I can easily be distracted while doing a task" },
      { value: "B", label: "I can focus on a task for a longer duration without being distracted easily" }
    ]
  },
  {
    id: "p8",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I like to learn new things through observation and practical activities" },
      { value: "B", label: "I like to learn new things through intensive thinking and imagination" }
    ]
  },
  {
    id: "p9",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I like to do things in proven ways" },
      { value: "B", label: "I like to do things in new ways" }
    ]
  },
  {
    id: "p10",
    text: "Which option describes you best?",
    options: [
      { value: "A", label: "I usually begin with facts and then build a bigger idea" },
      { value: "B", label: "I usually build a bigger idea and then find out facts" }
    ]
  }
];
