
/**
 * Calculate scores for a specific category of questions
 */
export const calculateCategoryScore = (
  categoryQuestions: any[], 
  answers: Record<string, string>
): number => {
  let score = 0;
  let totalPossibleScore = 0;
  
  categoryQuestions.forEach(question => {
    const answer = answers[question.id];
    if (!answer) return;
    
    // This is a simplified scoring system - in a real application, 
    // you would implement a more sophisticated scoring algorithm
    if (answer === 'A') score += 3;
    else if (answer === 'B') score += 2;
    else if (answer === 'C') score += 1;
    else if (answer === 'D') score += 0;
    
    totalPossibleScore += 3;
  });
  
  return totalPossibleScore > 0 ? Math.round((score / totalPossibleScore) * 100) : 0;
};

/**
 * Map category scores to career recommendations
 */
export const mapScoresToCareers = (
  aptitudeScore: number,
  personalityScore: number,
  interestScore: number,
  learningStyleScore: number
): {
  careerTitle: string;
  suitabilityPercentage: number;
  careerDescription: string;
  educationPathways: string[];
  keySkills: string[];
  workNature: string[];
  gapAnalysis: string[];
}[] => {
  // This is a simplified mapping function - in a real application,
  // you would implement a more sophisticated algorithm based on detailed assessment data
  
  const weightedScore = (aptitudeScore * 0.4) + (personalityScore * 0.25) + (interestScore * 0.25) + (learningStyleScore * 0.1);
  
  // Base career matches on the weighted score
  const careers = [
    {
      careerTitle: "Software Engineer",
      threshold: 80,
      suitabilityFactor: 1.1,
      careerDescription: "Develops software applications and systems using programming languages and tools.",
      educationPathways: [
        "B.Tech/B.E. in Computer Science or IT",
        "BCA followed by MCA",
        "B.Sc in Computer Science followed by M.Sc"
      ],
      keySkills: ["Problem Solving", "Logical Thinking", "Programming", "Teamwork", "Communication"],
      workNature: [
        "Designing and implementing software solutions",
        "Testing and fixing bugs",
        "Collaborating with cross-functional teams"
      ],
      gapAnalysis: ["Enhance technical skills", "Develop communication abilities", "Build project portfolio"]
    },
    {
      careerTitle: "Data Scientist",
      threshold: 75,
      suitabilityFactor: 1.05,
      careerDescription: "Analyzes and interprets complex data to help organizations make better decisions.",
      educationPathways: [
        "B.Tech/B.E. in Computer Science with Data Science specialization",
        "B.Sc in Statistics followed by M.Sc in Data Science",
        "Engineering degree followed by specialized certification in Data Science"
      ],
      keySkills: ["Statistical Analysis", "Machine Learning", "Programming", "Data Visualization", "Critical Thinking"],
      workNature: [
        "Collecting and analyzing large datasets",
        "Building predictive models",
        "Presenting insights to stakeholders"
      ],
      gapAnalysis: ["Strengthen mathematical foundation", "Learn additional programming languages", "Develop domain expertise"]
    },
    {
      careerTitle: "Medical Doctor",
      threshold: 70,
      suitabilityFactor: 1.0,
      careerDescription: "Diagnoses and treats illnesses, injuries, and other health conditions.",
      educationPathways: [
        "MBBS followed by MD/MS specialization",
        "MBBS followed by DNB",
        "MBBS with international certifications"
      ],
      keySkills: ["Critical Thinking", "Empathy", "Communication", "Attention to Detail", "Decision Making"],
      workNature: [
        "Examining patients and diagnosing conditions",
        "Prescribing treatments and medications",
        "Managing patient care and follow-up"
      ],
      gapAnalysis: ["Improve stress management", "Enhance communication with patients", "Develop leadership skills"]
    },
    {
      careerTitle: "Business Analyst",
      threshold: 65,
      suitabilityFactor: 0.95,
      careerDescription: "Analyzes business processes and recommends solutions to improve efficiency and performance.",
      educationPathways: [
        "BBA/B.Com followed by MBA",
        "Engineering degree with MBA",
        "Economics or Statistics degree with business certification"
      ],
      keySkills: ["Analytical Thinking", "Communication", "Problem Solving", "Technical Knowledge", "Business Acumen"],
      workNature: [
        "Gathering and documenting business requirements",
        "Analyzing data and processes",
        "Recommending solutions for business improvement"
      ],
      gapAnalysis: ["Develop stronger technical skills", "Enhance data analysis capabilities", "Improve presentation skills"]
    },
    {
      careerTitle: "Graphic Designer",
      threshold: 60,
      suitabilityFactor: 0.9,
      careerDescription: "Creates visual content to communicate ideas and messages effectively.",
      educationPathways: [
        "Bachelor's in Design or Fine Arts",
        "Diploma in Graphic Design",
        "Self-learning with a strong portfolio"
      ],
      keySkills: ["Creativity", "Visual Thinking", "Software Proficiency", "Time Management", "Communication"],
      workNature: [
        "Designing logos, illustrations, and layouts",
        "Creating visual elements for digital and print media",
        "Collaborating with clients and team members"
      ],
      gapAnalysis: ["Master additional design software", "Develop UI/UX skills", "Improve client communication"]
    }
  ];
  
  const results = careers.map(career => {
    const suitabilityScore = Math.min(
      100, 
      Math.round(
        (weightedScore / career.threshold) * 100 * career.suitabilityFactor
      )
    );
    
    return {
      careerTitle: career.careerTitle,
      suitabilityPercentage: suitabilityScore,
      careerDescription: career.careerDescription,
      educationPathways: career.educationPathways,
      keySkills: career.keySkills,
      workNature: career.workNature,
      gapAnalysis: career.gapAnalysis
    };
  });
  
  // Sort by suitability percentage (highest first)
  return results.sort((a, b) => b.suitabilityPercentage - a.suitabilityPercentage);
};
