
export interface CareerResult {
  id: string;
  title: string;
  matchPercentage: number;
  description: string;
  skills: string[];
  educationPathway: string[];
  workEnvironment: string;
  growthPotential: string;
  salary: {
    entry: string;
    mid: string;
    senior: string;
  };
}

export const careerResults: CareerResult[] = [
  {
    id: "software-developer",
    title: "Software Developer",
    matchPercentage: 89,
    description: "Design, develop, and maintain software applications and systems for various platforms.",
    skills: ["Programming", "Problem Solving", "Debugging", "Logical Thinking", "Communication"],
    educationPathway: [
      "Bachelor's degree in Computer Science or related field",
      "Coding bootcamps or self-learning for basic foundations",
      "Specialized certifications in specific technologies",
      "Advanced degrees for specialized roles"
    ],
    workEnvironment: "Flexible work environments including office-based, remote, or hybrid arrangements with collaborative team settings.",
    growthPotential: "High demand across industries with opportunities to advance to senior developer, architect, or management roles.",
    salary: {
      entry: "$60,000 - $80,000",
      mid: "$80,000 - $120,000",
      senior: "$120,000 - $180,000+"
    }
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    matchPercentage: 82,
    description: "Analyze complex data sets to identify patterns and insights that drive business decisions.",
    skills: ["Statistics", "Programming", "Data Visualization", "Machine Learning", "Critical Thinking"],
    educationPathway: [
      "Bachelor's degree in Statistics, Mathematics, Computer Science, or related field",
      "Master's or PhD for advanced positions",
      "Specialized certifications in data science tools and methodologies",
      "Continuous learning through online courses and workshops"
    ],
    workEnvironment: "Typically office-based or remote, working with cross-functional teams and stakeholders.",
    growthPotential: "Growing field with opportunities to specialize in machine learning, AI, or advance to leadership positions.",
    salary: {
      entry: "$70,000 - $90,000",
      mid: "$90,000 - $130,000",
      senior: "$130,000 - $175,000+"
    }
  },
  {
    id: "ux-designer",
    title: "UX Designer",
    matchPercentage: 75,
    description: "Create intuitive, accessible, and enjoyable digital experiences for users across various platforms.",
    skills: ["User Research", "Wireframing", "Prototyping", "Visual Design", "Empathy"],
    educationPathway: [
      "Bachelor's degree in Design, HCI, or related field",
      "UX design bootcamps or specialized courses",
      "Portfolio development through projects and internships",
      "Specialized certifications in design thinking and user research"
    ],
    workEnvironment: "Creative studios, tech companies, or design agencies with collaborative workflows.",
    growthPotential: "Growing field with opportunities to specialize in research, interaction design, or advance to leadership roles.",
    salary: {
      entry: "$55,000 - $75,000",
      mid: "$75,000 - $110,000",
      senior: "$110,000 - $160,000+"
    }
  },
  {
    id: "marketing-specialist",
    title: "Marketing Specialist",
    matchPercentage: 68,
    description: "Develop and implement marketing strategies to promote products, services, and brand awareness.",
    skills: ["Communication", "Creativity", "Analytics", "Strategic Thinking", "Social Media"],
    educationPathway: [
      "Bachelor's degree in Marketing, Business, Communications, or related field",
      "Digital marketing certifications and specialized courses",
      "Hands-on experience through internships or entry-level positions",
      "Advanced degrees for management roles"
    ],
    workEnvironment: "Various settings including agencies, in-house marketing departments, or remote arrangements.",
    growthPotential: "Diverse career paths into specialized areas like digital marketing, content strategy, or brand management.",
    salary: {
      entry: "$45,000 - $60,000",
      mid: "$60,000 - $90,000",
      senior: "$90,000 - $140,000+"
    }
  }
];
