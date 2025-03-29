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
    
    // Enhanced scoring system for different question categories
    if (question.category === 'aptitude') {
      if (answer === 'A') score += 3;
      else if (answer === 'B') score += 2;
      else if (answer === 'C') score += 1;
      else if (answer === 'D') score += 0;
      totalPossibleScore += 3;
    } 
    else if (question.category === 'personality') {
      // For personality, score based on different patterns
      // For some personality questions, A might indicate one trait, B another
      // We'll use a weighted approach where each answer contributes to the total score
      if (question.id.startsWith('per_')) {
        if (['per_1', 'per_3', 'per_6'].includes(question.id)) {
          // Questions about extraversion/introversion
          score += (answer === 'A') ? 3 : 1;
        } else if (['per_4', 'per_5', 'per_7'].includes(question.id)) {
          // Questions about thinking/feeling
          score += (answer === 'B') ? 3 : 1;
        } else {
          // Other personality questions
          score += (answer === 'A') ? 2 : 2; // Equal weight for either choice
        }
        totalPossibleScore += 3;
      }
    }
    else if (question.category === 'interest') {
      // For interest questions, C (Yes) is most positive
      if (answer === 'C') score += 3;
      else if (answer === 'B') score += 1.5;
      else if (answer === 'A') score += 0;
      totalPossibleScore += 3;
    }
    else if (question.category === 'learning-style') {
      // For learning style, all answers contribute to understanding the style
      // All answers are valid, but we'll score for consistency
      score += 2; // All responses are valid and contribute equally
      totalPossibleScore += 2;
    }
    else {
      // Default scoring for any other category
      if (answer === 'A') score += 3;
      else if (answer === 'B') score += 2;
      else if (answer === 'C') score += 1;
      else if (answer === 'D') score += 0;
      totalPossibleScore += 3;
    }
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
  
  // Enhanced career database with more appropriate education pathways
  const careers = [
    {
      careerTitle: "Software Engineer",
      threshold: 80,
      suitabilityFactor: 1.1,
      careerDescription: "Develops software applications and systems using programming languages and tools.",
      educationPathways: [
        "B.Tech/B.E. in Computer Science or IT",
        "BCA followed by MCA",
        "B.Sc in Computer Science followed by M.Sc",
        "Coding bootcamps plus self-learning and certifications",
        "Online computer science degree programs"
      ],
      keySkills: ["Problem Solving", "Logical Thinking", "Programming", "Teamwork", "Communication", "Continuous Learning"],
      workNature: [
        "Designing and implementing software solutions",
        "Testing and fixing bugs",
        "Collaborating with cross-functional teams",
        "Writing and maintaining code",
        "Developing applications for web, mobile, and desktop platforms",
        "Implementing security and data protection measures"
      ],
      gapAnalysis: ["Enhance technical skills", "Develop communication abilities", "Build project portfolio", "Learn version control systems", "Understand software development lifecycle"],
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
        "Engineering degree followed by specialized certification in Data Science",
        "Mathematics or Statistics degree with programming skills",
        "Online data science and machine learning bootcamps"
      ],
      keySkills: ["Statistical Analysis", "Machine Learning", "Programming", "Data Visualization", "Critical Thinking", "Domain Knowledge"],
      workNature: [
        "Collecting and analyzing large datasets",
        "Building predictive models",
        "Presenting insights to stakeholders",
        "Implementing machine learning algorithms",
        "Cleaning and preprocessing data",
        "Creating data visualization dashboards"
      ],
      gapAnalysis: ["Strengthen mathematical foundation", "Learn additional programming languages", "Develop domain expertise", "Build data visualization skills", "Gain experience with big data technologies"],
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
        "MBBS with international certifications",
        "Medical college with integrated programs for specific specializations",
        "Pre-medical courses followed by medical school"
      ],
      keySkills: ["Critical Thinking", "Empathy", "Communication", "Attention to Detail", "Decision Making", "Continuous Learning"],
      workNature: [
        "Examining patients and diagnosing conditions",
        "Prescribing treatments and medications",
        "Managing patient care and follow-up",
        "Performing medical procedures and surgeries",
        "Collaborating with healthcare teams",
        "Keeping up with medical research and advancements"
      ],
      gapAnalysis: ["Improve stress management", "Enhance communication with patients", "Develop leadership skills", "Build research capabilities", "Strengthen specialized medical knowledge"],
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
        "Economics or Statistics degree with business certification",
        "Business Analytics specialized degrees",
        "Data Science programs with business focus"
      ],
      keySkills: ["Analytical Thinking", "Communication", "Problem Solving", "Technical Knowledge", "Business Acumen", "Project Management"],
      workNature: [
        "Gathering and documenting business requirements",
        "Analyzing data and processes",
        "Recommending solutions for business improvement",
        "Creating reports and dashboards",
        "Facilitating meetings and workshops",
        "Managing stakeholder relationships"
      ],
      gapAnalysis: ["Develop stronger technical skills", "Enhance data analysis capabilities", "Improve presentation skills", "Build domain knowledge", "Learn project management methodologies"],
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
        "Self-learning with a strong portfolio",
        "Design bootcamps and specialized courses",
        "Animation and multimedia design programs"
      ],
      keySkills: ["Creativity", "Visual Thinking", "Software Proficiency", "Time Management", "Communication", "Attention to Detail"],
      workNature: [
        "Designing logos, illustrations, and layouts",
        "Creating visual elements for digital and print media",
        "Collaborating with clients and team members",
        "Developing branding and identity materials",
        "Creating user interface designs",
        "Working with typography and color theory"
      ],
      gapAnalysis: ["Master additional design software", "Develop UI/UX skills", "Improve client communication", "Build a diverse portfolio", "Learn animation and video editing"],
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
        "Digital marketing certifications and hands-on experience",
        "MBA with marketing specialization",
        "Advertising and public relations programs"
      ],
      keySkills: ["Strategic Thinking", "Creativity", "Communication", "Market Research", "Social Media", "Data Analysis"],
      workNature: [
        "Developing marketing strategies and campaigns",
        "Managing brand identity across platforms",
        "Analyzing campaign performance metrics",
        "Creating content for various marketing channels",
        "Conducting market research and competitor analysis",
        "Managing advertising budgets and ROI"
      ],
      gapAnalysis: ["Enhance data analytics skills", "Develop deeper industry knowledge", "Build content creation expertise", "Learn SEO and SEM techniques", "Understand consumer psychology"],
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
        "Industry-specific degree with project management experience",
        "MBA with project management focus",
        "Technical degree with management training"
      ],
      keySkills: ["Leadership", "Organization", "Communication", "Problem Solving", "Risk Management", "Negotiation"],
      workNature: [
        "Planning and defining project scope",
        "Coordinating team members and resources",
        "Tracking milestones and delivering reports",
        "Managing project risks and constraints",
        "Facilitating communication between stakeholders",
        "Ensuring projects meet quality standards"
      ],
      gapAnalysis: ["Strengthen technical knowledge", "Develop conflict resolution skills", "Build stakeholder management expertise", "Learn project management software tools", "Gain experience with different methodologies"],
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
        "Self-learning and practical experience through ventures",
        "Entrepreneurship bootcamps and incubators",
        "MBA with entrepreneurship focus"
      ],
      keySkills: ["Risk-Taking", "Decision Making", "Leadership", "Innovation", "Persistence", "Sales"],
      workNature: [
        "Identifying and pursuing business opportunities",
        "Building and managing teams",
        "Securing funding and resources",
        "Developing business plans and strategies",
        "Managing finances and operations",
        "Marketing and selling products or services"
      ],
      gapAnalysis: ["Develop financial management skills", "Build industry network", "Enhance marketing knowledge", "Learn risk assessment techniques", "Improve leadership capabilities"],
      aptitudeBoost: 0.1,
      personalityBoost: 0.1,
      interestBoost: 0.2,
      styleFit: ["creative", "practical"]
    },
    {
      careerTitle: "Clinical Psychologist",
      threshold: 72,
      suitabilityFactor: 0.95,
      careerDescription: "Diagnoses and treats mental, emotional, and behavioral disorders through observation, assessment, and therapy.",
      educationPathways: [
        "Bachelor's in Psychology followed by M.Phil in Clinical Psychology",
        "MA/M.Sc in Psychology with clinical specialization",
        "Doctorate in Clinical Psychology (Ph.D. or Psy.D)",
        "RCI registered course in Clinical Psychology",
        "Specialized training in therapeutic approaches"
      ],
      keySkills: ["Empathy", "Active Listening", "Critical Thinking", "Assessment", "Communication", "Emotional Intelligence"],
      workNature: [
        "Conducting psychological assessments and evaluations",
        "Providing therapy and counseling to individuals and groups",
        "Developing treatment plans for clients",
        "Collaborating with healthcare professionals",
        "Maintaining detailed client records",
        "Conducting research in clinical psychology"
      ],
      gapAnalysis: ["Develop deeper understanding of therapeutic approaches", "Build experience with diverse populations", "Strengthen assessment techniques", "Enhance research methodology knowledge", "Cultivate self-care practices"],
      aptitudeBoost: 0.05,
      personalityBoost: 0.25,
      interestBoost: 0.15,
      styleFit: ["reflective", "analytical"]
    },
    {
      careerTitle: "Financial Analyst",
      threshold: 70,
      suitabilityFactor: 0.92,
      careerDescription: "Evaluates financial data and market trends to help businesses and individuals make investment decisions.",
      educationPathways: [
        "B.Com/BBA with finance specialization",
        "MBA in Finance",
        "Chartered Financial Analyst (CFA) certification",
        "Master's in Financial Management",
        "Economics degree with finance courses"
      ],
      keySkills: ["Analytical Thinking", "Financial Modeling", "Attention to Detail", "Communication", "Problem Solving", "Technical Proficiency"],
      workNature: [
        "Analyzing financial statements and data",
        "Creating financial models and forecasts",
        "Evaluating investment opportunities",
        "Preparing reports and presentations",
        "Monitoring market trends and economic indicators",
        "Making recommendations to management or clients"
      ],
      gapAnalysis: ["Develop advanced Excel skills", "Learn financial software platforms", "Enhance presentation capabilities", "Build industry-specific knowledge", "Understand global economic factors"],
      aptitudeBoost: 0.2,
      personalityBoost: 0.05,
      interestBoost: 0.1,
      styleFit: ["analytical", "reflective"]
    },
    {
      careerTitle: "Mechanical Engineer",
      threshold: 68,
      suitabilityFactor: 0.9,
      careerDescription: "Designs, develops, builds, and tests mechanical devices, including tools, engines, and machines.",
      educationPathways: [
        "B.Tech/B.E. in Mechanical Engineering",
        "Diploma in Mechanical Engineering followed by B.Tech",
        "M.Tech with specialization in specific fields",
        "Mechanical Engineering with certifications in CAD/CAM",
        "Engineering degree with additional robotics training"
      ],
      keySkills: ["Technical Knowledge", "Problem Solving", "Creativity", "Analytical Thinking", "Attention to Detail", "Project Management"],
      workNature: [
        "Designing mechanical components and systems",
        "Creating and analyzing mechanical drawings and specifications",
        "Testing and evaluating mechanical devices",
        "Troubleshooting and solving mechanical issues",
        "Collaborating with cross-functional engineering teams",
        "Improving existing mechanical designs and systems"
      ],
      gapAnalysis: ["Strengthen CAD/CAM skills", "Develop knowledge of new materials", "Learn about manufacturing processes", "Build project management capabilities", "Enhance understanding of automation and robotics"],
      aptitudeBoost: 0.2,
      personalityBoost: 0,
      interestBoost: 0.15,
      styleFit: ["practical", "analytical"]
    },
    {
      careerTitle: "UI/UX Designer",
      threshold: 65,
      suitabilityFactor: 0.9,
      careerDescription: "Creates user-friendly and visually appealing interfaces for websites, apps, and digital products.",
      educationPathways: [
        "Degree in Design, Human-Computer Interaction, or related field",
        "UI/UX design bootcamps and certification programs",
        "Self-learning with a strong portfolio",
        "Graphic design background with UI/UX specialization",
        "Computer Science degree with design courses"
      ],
      keySkills: ["User Empathy", "Visual Design", "Prototyping", "Usability Testing", "Information Architecture", "Collaboration"],
      workNature: [
        "Conducting user research and creating user personas",
        "Designing wireframes, mockups, and prototypes",
        "Creating user flows and sitemaps",
        "Collaborating with developers and stakeholders",
        "Conducting usability testing and gathering feedback",
        "Iterating designs based on user feedback and data"
      ],
      gapAnalysis: ["Learn industry-standard design tools", "Develop user research methodologies", "Build coding knowledge (HTML/CSS)", "Understand accessibility guidelines", "Enhance prototyping skills"],
      aptitudeBoost: 0.05,
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
    
    // Add variation to make results more realistic (not everyone gets 100%)
    // Apply normalization factor to keep scores in a reasonable range
    const normalizationFactor = 0.8;  // Reduce all scores to create more variance
    suitabilityScore = suitabilityScore * normalizationFactor;
    
    // Add small random factor for variation (±7%)
    const randomVariation = (Math.random() * 14) - 7;
    suitabilityScore += randomVariation;
    
    // Ensure score is within 30-97% range (not giving 100% matches)
    suitabilityScore = Math.max(30, Math.min(97, Math.round(suitabilityScore)));
    
    // Generate personalized gap analysis based on scores
    const customGapAnalysis = [...career.gapAnalysis];
    
    // Add score-specific gap analysis items
    if (aptitudeScore < 70 && ["Software Engineer", "Data Scientist", "Mechanical Engineer"].includes(career.careerTitle)) {
      customGapAnalysis.push("Focus on building technical and analytical skills through structured learning and practice problems");
    }
    
    if (personalityScore < 70 && ["Medical Doctor", "Clinical Psychologist", "Marketing Specialist"].includes(career.careerTitle)) {
      customGapAnalysis.push("Develop stronger communication and interpersonal skills through group activities and public speaking practice");
    }
    
    if (interestScore < 70 && ["Graphic Designer", "UI/UX Designer", "Entrepreneur"].includes(career.careerTitle)) {
      customGapAnalysis.push("Explore creative projects and hands-on experiences to build portfolio and clarify interests");
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
