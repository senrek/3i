
/**
 * Calculate scores for a specific category of questions
 */
export const calculateCategoryScore = (
  categoryQuestions: any[], 
  answers: Record<string, string>
): number => {
  let score = 0;
  let totalPossibleScore = 0;
  let answeredQuestions = 0;
  
  categoryQuestions.forEach(question => {
    const answer = answers[question.id];
    if (!answer) return;
    
    answeredQuestions++;
    
    // This is a simplified scoring system - in a real application, 
    // you would implement a more sophisticated scoring algorithm
    if (answer === 'A') score += 3;
    else if (answer === 'B') score += 2;
    else if (answer === 'C') score += 1;
    else if (answer === 'D') score += 0;
    
    totalPossibleScore += 3;
  });
  
  // Ensure we don't divide by zero, and normalize to 0-100 scale
  if (answeredQuestions === 0 || totalPossibleScore === 0) return 0;
  
  // Calculate the percentage score (0-100)
  return Math.round((score / totalPossibleScore) * 100);
};

/**
 * Map category scores to career recommendations with enhanced insights
 */
export const mapScoresToCareers = (
  aptitudeScore: number,
  personalityScore: number,
  interestScore: number,
  learningStyleScore: number,
  analysisInsights?: any
): {
  careerTitle: string;
  suitabilityPercentage: number;
  careerDescription: string;
  educationPathways: string[];
  keySkills: string[];
  workNature: string[];
  gapAnalysis: string[];
}[] => {
  // Create a weighted score incorporating all elements
  const weightedScore = (aptitudeScore * 0.4) + (personalityScore * 0.25) + (interestScore * 0.25) + (learningStyleScore * 0.1);
  
  // Base career data
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
      gapAnalysis: ["Enhance technical skills", "Develop communication abilities", "Build project portfolio"],
      aptitudeBoost: 0.2,  // Boost factors for different career types based on assessment areas
      personalityBoost: 0,
      interestBoost: 0.1,
      styleFit: ["analytical", "practical"]
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
      gapAnalysis: ["Strengthen mathematical foundation", "Learn additional programming languages", "Develop domain expertise"],
      aptitudeBoost: 0.25,
      personalityBoost: 0,
      interestBoost: 0.05,
      styleFit: ["analytical", "reflective"]
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
      gapAnalysis: ["Improve stress management", "Enhance communication with patients", "Develop leadership skills"],
      aptitudeBoost: 0.15,
      personalityBoost: 0.2,
      interestBoost: 0.05,
      styleFit: ["analytical", "practical"]
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
      gapAnalysis: ["Develop stronger technical skills", "Enhance data analysis capabilities", "Improve presentation skills"],
      aptitudeBoost: 0.1,
      personalityBoost: 0.15,
      interestBoost: 0.05,
      styleFit: ["analytical", "practical"]
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
      gapAnalysis: ["Master additional design software", "Develop UI/UX skills", "Improve client communication"],
      aptitudeBoost: 0,
      personalityBoost: 0.05,
      interestBoost: 0.25,
      styleFit: ["creative", "practical"]
    },
    {
      careerTitle: "Marketing Specialist",
      threshold: 62,
      suitabilityFactor: 0.92,
      careerDescription: "Plans and executes marketing campaigns to promote products, services, or brands.",
      educationPathways: [
        "Bachelor's in Marketing or Business",
        "Communications degree with marketing certification",
        "Digital marketing certifications and hands-on experience"
      ],
      keySkills: ["Strategic Thinking", "Creativity", "Communication", "Market Research", "Social Media"],
      workNature: [
        "Developing marketing strategies and campaigns",
        "Managing brand identity across platforms",
        "Analyzing campaign performance metrics"
      ],
      gapAnalysis: ["Enhance data analytics skills", "Develop deeper industry knowledge", "Build content creation expertise"],
      aptitudeBoost: 0.05,
      personalityBoost: 0.15,
      interestBoost: 0.15,
      styleFit: ["creative", "practical"]
    },
    {
      careerTitle: "Project Manager",
      threshold: 68,
      suitabilityFactor: 0.98,
      careerDescription: "Oversees projects from initiation to completion, ensuring they are completed on time and within budget.",
      educationPathways: [
        "Bachelor's in Business or related field",
        "PMP or other project management certification",
        "Industry-specific degree with project management experience"
      ],
      keySkills: ["Leadership", "Organization", "Communication", "Problem Solving", "Risk Management"],
      workNature: [
        "Planning and defining project scope",
        "Coordinating team members and resources",
        "Tracking milestones and delivering reports"
      ],
      gapAnalysis: ["Strengthen technical knowledge", "Develop conflict resolution skills", "Build stakeholder management expertise"],
      aptitudeBoost: 0.1,
      personalityBoost: 0.2,
      interestBoost: 0.05,
      styleFit: ["practical", "analytical"]
    },
    {
      careerTitle: "Entrepreneur",
      threshold: 70,
      suitabilityFactor: 1.0,
      careerDescription: "Starts and runs businesses, taking on financial risks in the hope of profit.",
      educationPathways: [
        "Business degree or entrepreneurship program",
        "Industry-specific experience and knowledge",
        "Self-learning and practical experience through ventures"
      ],
      keySkills: ["Risk-Taking", "Decision Making", "Leadership", "Innovation", "Persistence"],
      workNature: [
        "Identifying and pursuing business opportunities",
        "Building and managing teams",
        "Securing funding and resources"
      ],
      gapAnalysis: ["Develop financial management skills", "Build industry network", "Enhance marketing knowledge"],
      aptitudeBoost: 0.1,
      personalityBoost: 0.1,
      interestBoost: 0.2,
      styleFit: ["creative", "practical"]
    }
  ];
  
  // Process results with enhanced logic using the response analysis
  const results = careers.map(career => {
    // Start with base suitability calculation
    let suitabilityScore = (weightedScore / career.threshold) * 100 * career.suitabilityFactor;
    
    // Apply category-specific boosts
    suitabilityScore += (aptitudeScore * career.aptitudeBoost);
    suitabilityScore += (personalityScore * career.personalityBoost);
    suitabilityScore += (interestScore * career.interestBoost);
    
    // Apply learning style fit if the information is available
    if (analysisInsights) {
      const aptitudeStyle = analysisInsights.aptitudeStyle || '';
      const interestStyle = analysisInsights.interestStyle || '';
      
      // Add bonus for style matches
      if (career.styleFit.includes(aptitudeStyle)) {
        suitabilityScore += 5;
      }
      if (career.styleFit.includes(interestStyle)) {
        suitabilityScore += 5;
      }
    }
    
    // Ensure score is within 0-100 range
    suitabilityScore = Math.max(0, Math.min(100, Math.round(suitabilityScore)));
    
    // Generate personalized gap analysis based on scores
    const customGapAnalysis = [...career.gapAnalysis];
    
    // Add score-specific gap analysis items
    if (aptitudeScore < 70 && ["Software Engineer", "Data Scientist"].includes(career.careerTitle)) {
      customGapAnalysis.push("Focus on building technical and analytical skills");
    }
    
    if (personalityScore < 70 && ["Medical Doctor", "Marketing Specialist"].includes(career.careerTitle)) {
      customGapAnalysis.push("Develop stronger communication and interpersonal skills");
    }
    
    if (interestScore < 70 && ["Graphic Designer", "Entrepreneur"].includes(career.careerTitle)) {
      customGapAnalysis.push("Explore creative projects to build portfolio and clarify interests");
    }
    
    return {
      careerTitle: career.careerTitle,
      suitabilityPercentage: suitabilityScore,
      careerDescription: career.careerDescription,
      educationPathways: career.educationPathways,
      keySkills: career.keySkills,
      workNature: career.workNature,
      gapAnalysis: customGapAnalysis
    };
  });
  
  // Sort by suitability percentage (highest first)
  return results.sort((a, b) => b.suitabilityPercentage - a.suitabilityPercentage);
};
