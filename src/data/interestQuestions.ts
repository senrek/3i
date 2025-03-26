
export interface Question {
  id: string;
  text: string;
  options: {
    value: string;
    label: string;
  }[];
}

export const interestQuestions: Question[] = [
  {
    id: "i1",
    text: "Do you like physical activities that require strength rather than sitting and watching?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ]
  },
  {
    id: "i2",
    text: "Do you like to participate in stage shows, events, or art competitions?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ]
  },
  {
    id: "i3",
    text: "Do you enjoy participating in debates, speeches, or presentations?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ]
  },
  {
    id: "i4",
    text: "Do you like to work with a variety of colors and designs?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ]
  },
  {
    id: "i5",
    text: "Can you imagine different pictures, colors, and designs when you close your eyes and visualize how things would look from different angles?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ]
  },
  {
    id: "i6",
    text: "Can you convince people to do things your way?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ]
  },
  {
    id: "i7",
    text: "Do you like to participate in social events, community service, and volunteering?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ]
  },
  {
    id: "i8",
    text: "Do you like to learn more about new technologies and how things work?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ]
  },
  {
    id: "i9",
    text: "Do you enjoy repairing or fixing gadgets, home appliances, etc.?",
    options: [
      { value: "A", label: "No" },
      { value: "B", label: "Not sure" },
      { value: "C", label: "Yes" }
    ]
  },
  {
    id: "i10",
    text: "Which activity would you like the most?",
    options: [
      { value: "A", label: "Lead People" },
      { value: "B", label: "Help People" },
      { value: "C", label: "Organize Data or Things" },
      { value: "D", label: "Analyze Problems" },
      { value: "E", label: "Build or Fix Objects" },
      { value: "F", label: "Design or Decorate Objects" }
    ]
  }
];
