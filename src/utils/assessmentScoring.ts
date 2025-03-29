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
        // Questions about extraversion/introversion
        if (['per_1', 'per_3', 'per_6'].includes(question.id)) {
          score += (answer === 'A') ? 3 : 1;
        } 
        // Questions about thinking/feeling
        else if (['per_20', 'per_21', 'per_23', 'per_24'].includes(question.id)) {
          score += (answer === 'B') ? 3 : 1;
        }
        // Questions about structure/flexibility
        else if (['per_27', 'per_28', 'per_29'].includes(question.id)) {
          score += (answer === 'A') ? 3 : 1;
        }
        // Other personality questions
        else {
          score += (answer === 'A') ? 2 : 2; // Equal weight for either choice
        }
        totalPossibleScore += 3;
      }
    }
    else if (question.category === 'interest') {
      // For standard interest questions (A-D format)
      if (question.options.length === 4 && 
          (question.id.startsWith('int_') && Number(question.id.replace(/\D/g, '')) <= 22)) {
        if (answer === 'A') score += 3;
        else if (answer === 'B') score += 2;
        else if (answer === 'C') score += 1;
        else if (answer === 'D') score += 0;
        totalPossibleScore += 3;
      }
      // For interest questions with Yes/Not sure/No format
      else if (question.options.length === 3) {
        if (answer === 'C') score += 3;      // Yes
        else if (answer === 'B') score += 1.5; // Not sure
        else if (answer === 'A') score += 0;   // No
        totalPossibleScore += 3;
      }
      else {
        // Default for other interest questions
        if (answer === 'A') score += 3;
        else if (answer === 'B') score += 2;
        else if (answer === 'C') score += 1;
        else if (answer === 'D') score += 0;
        totalPossibleScore += 3;
      }
    }
    else if (question.category === 'learning-style') {
      // Learning style questions help identify preferred learning methods
      // rather than scoring high or low
      // We'll weight answers to get a score that reflects engagement with learning
      if (answer === 'A' || answer === 'D') score += 2.5; // Visual or Reading/Writing
      else if (answer === 'B') score += 2;              // Auditory
      else if (answer === 'C') score += 3;              // Kinesthetic/hands-on
      totalPossibleScore += 3;
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
  const weightedScore = (aptitudeScore * 0.35) + (personalityScore * 0.25) + (interestScore * 0.30) + (learningStyleScore * 0.10);
  
  // Enhanced career database with more appropriate education pathways
  const careers = [
    {
      careerTitle: "Software Engineer",
      baseScore: 70,
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
      techFocus: 0.25,  // Aptitude weighting factors for different career types
      creativeNeeds: 0.05,
      analyticalNeeds: 0.20,
      socialNeeds: 0.05,
      leadershipNeeds: 0.05,
      personalityFit: ['structured', 'detail-oriented', 'problem-solver'],
      interestFit: ['technology', 'innovation', 'logic'],
      learningStylePreference: ['visual', 'reading/writing']
    },
    {
      careerTitle: "Data Scientist",
      baseScore: 65,
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
      techFocus: 0.15,
      creativeNeeds: 0.05,
      analyticalNeeds: 0.30,
      socialNeeds: 0.05,
      leadershipNeeds: 0.05,
      personalityFit: ['analytical', 'detail-oriented', 'problem-solver'],
      interestFit: ['data', 'research', 'mathematics'],
      learningStylePreference: ['visual', 'reading/writing']
    },
    {
      careerTitle: "Medical Doctor",
      baseScore: 65,
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
      techFocus: 0.10,
      creativeNeeds: 0.05,
      analyticalNeeds: 0.20,
      socialNeeds: 0.25,
      leadershipNeeds: 0.10,
      personalityFit: ['detail-oriented', 'empathetic', 'dedicated'],
      interestFit: ['healthcare', 'biology', 'helping others'],
      learningStylePreference: ['kinesthetic', 'visual']
    },
    {
      careerTitle: "Business Analyst",
      baseScore: 60,
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
      techFocus: 0.10,
      creativeNeeds: 0.05,
      analyticalNeeds: 0.25,
      socialNeeds: 0.10,
      leadershipNeeds: 0.10,
      personalityFit: ['analytical', 'communicative', 'detail-oriented'],
      interestFit: ['business', 'analysis', 'problem-solving'],
      learningStylePreference: ['visual', 'auditory']
    },
    {
      careerTitle: "Graphic Designer",
      baseScore: 60,
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
      techFocus: 0.05,
      creativeNeeds: 0.30,
      analyticalNeeds: 0.05,
      socialNeeds: 0.10,
      leadershipNeeds: 0.05,
      personalityFit: ['creative', 'detail-oriented', 'visual'],
      interestFit: ['design', 'art', 'digital media'],
      learningStylePreference: ['visual', 'kinesthetic']
    },
    {
      careerTitle: "Marketing Specialist",
      baseScore: 60,
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
      techFocus: 0.05,
      creativeNeeds: 0.15,
      analyticalNeeds: 0.10,
      socialNeeds: 0.20,
      leadershipNeeds: 0.10,
      personalityFit: ['creative', 'communicative', 'strategic'],
      interestFit: ['marketing', 'communication', 'social media'],
      learningStylePreference: ['visual', 'auditory']
    },
    {
      careerTitle: "Project Manager",
      baseScore: 65,
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
      techFocus: 0.05,
      creativeNeeds: 0.05,
      analyticalNeeds: 0.15,
      socialNeeds: 0.15,
      leadershipNeeds: 0.25,
      personalityFit: ['organized', 'communicative', 'leadership-oriented'],
      interestFit: ['management', 'coordination', 'planning'],
      learningStylePreference: ['auditory', 'reading/writing']
    },
    {
      careerTitle: "Entrepreneur",
      baseScore: 70,
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
      techFocus: 0.05,
      creativeNeeds: 0.15,
      analyticalNeeds: 0.10,
      socialNeeds: 0.15,
      leadershipNeeds: 0.25,
      personalityFit: ['risk-taker', 'innovative', 'self-motivated'],
      interestFit: ['business', 'innovation', 'independence'],
      learningStylePreference: ['kinesthetic', 'auditory']
    },
    {
      careerTitle: "Clinical Psychologist",
      baseScore: 65,
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
      techFocus: 0.05,
      creativeNeeds: 0.05,
      analyticalNeeds: 0.15,
      socialNeeds: 0.30,
      leadershipNeeds: 0.05,
      personalityFit: ['empathetic', 'patient', 'analytical'],
      interestFit: ['psychology', 'helping others', 'research'],
      learningStylePreference: ['auditory', 'reading/writing']
    },
    {
      careerTitle: "Financial Analyst",
      baseScore: 65,
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
      techFocus: 0.10,
      creativeNeeds: 0.05,
      analyticalNeeds: 0.30,
      socialNeeds: 0.05,
      leadershipNeeds: 0.10,
      personalityFit: ['detail-oriented', 'analytical', 'precise'],
      interestFit: ['finance', 'analysis', 'economics'],
      learningStylePreference: ['visual', 'reading/writing']
    },
    {
      careerTitle: "Mechanical Engineer",
      baseScore: 65,
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
      techFocus: 0.25,
      creativeNeeds: 0.10,
      analyticalNeeds: 0.15,
      socialNeeds: 0.05,
      leadershipNeeds: 0.05,
      personalityFit: ['detail-oriented', 'analytical', 'practical'],
      interestFit: ['engineering', 'mechanics', 'design'],
      learningStylePreference: ['kinesthetic', 'visual']
    },
    {
      careerTitle: "UI/UX Designer",
      baseScore: 60,
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
      techFocus: 0.10,
      creativeNeeds: 0.25,
      analyticalNeeds: 0.15,
      socialNeeds: 0.10,
      leadershipNeeds: 0.05,
      personalityFit: ['creative', 'empathetic', 'detail-oriented'],
      interestFit: ['design', 'user experience', 'technology'],
      learningStylePreference: ['visual', 'kinesthetic']
    }
  ];
  
  // Extract insights from response analysis if available
  const specificAptitudes = analysisInsights?.specificAptitudes || {};
  const personalityTraits = analysisInsights?.personalityTraits || {};
  const aptitudeStyle = analysisInsights?.aptitudeStyle || '';
  const learningStyle = analysisInsights?.learningStyle || '';
  
  // Calculate match percentage based on multiple factors
  const results = careers.map(career => {
    // Start with base score
    let suitabilityScore = career.baseScore;
    
    // Add aptitude component based on specific career requirements
    if (specificAptitudes) {
      suitabilityScore += (specificAptitudes.technical || 0) * career.techFocus;
      suitabilityScore += (specificAptitudes.creative || 0) * career.creativeNeeds;
      suitabilityScore += (specificAptitudes.analytical || 0) * career.analyticalNeeds;
      suitabilityScore += (specificAptitudes.social || 0) * career.socialNeeds;
      suitabilityScore += (specificAptitudes.leadership || 0) * career.leadershipNeeds;
    }
    
    // Add personality match factor
    if (personalityTraits) {
      // Match extrovert traits to social careers
      if (personalityTraits.extroverted && 
          ['Marketing Specialist', 'Clinical Psychologist', 'Project Manager', 'Entrepreneur'].includes(career.careerTitle)) {
        suitabilityScore += 5;
      }
      
      // Match structured personality to detail-oriented careers
      if (personalityTraits.structured && 
          ['Software Engineer', 'Data Scientist', 'Financial Analyst', 'Mechanical Engineer'].includes(career.careerTitle)) {
        suitabilityScore += 5;
      }
      
      // Match detail-oriented personality to precision careers
      if (personalityTraits.detailOriented && 
          ['Data Scientist', 'Medical Doctor', 'Financial Analyst', 'UI/UX Designer'].includes(career.careerTitle)) {
        suitabilityScore += 5;
      }
      
      // Match people-oriented personality to service careers
      if (personalityTraits.peopleOriented && 
          ['Medical Doctor', 'Clinical Psychologist', 'Marketing Specialist'].includes(career.careerTitle)) {
        suitabilityScore += 5;
      }
    }
    
    // Add learning style match factor
    if (learningStyle && career.learningStylePreference.includes(learningStyle)) {
      suitabilityScore += 3;
    }
    
    // Add aptitude style match factor
    if (aptitudeStyle === 'analytical' && 
        ['Data Scientist', 'Financial Analyst', 'Software Engineer'].includes(career.careerTitle)) {
      suitabilityScore += 5;
    } else if (aptitudeStyle === 'creative' && 
               ['Graphic Designer', 'UI/UX Designer', 'Entrepreneur'].includes(career.careerTitle)) {
      suitabilityScore += 5;
    } else if (aptitudeStyle === 'practical' && 
               ['Mechanical Engineer', 'Medical Doctor', 'Project Manager'].includes(career.careerTitle)) {
      suitabilityScore += 5;
    }
    
    // Add some variation to create a realistic spread of scores
    // Random factor between -5 and +5
    const variation = Math.floor(Math.random() * 10) - 5;
    suitabilityScore += variation;
    
    // Cap at 92% max to avoid unrealistic 100% matches
    suitabilityScore = Math.min(92, Math.max(40, suitabilityScore));
    
    // Custom gap analysis based on user's profile
    const customGapAnalysis = [...career.gapAnalysis];
    
    // Add personalized gap items based on career and aptitude scores
    if (specificAptitudes.technical < 60 && 
        ['Software Engineer', 'Data Scientist', 'Mechanical Engineer'].includes(career.careerTitle)) {
      customGapAnalysis.push("Develop stronger technical and STEM foundations through targeted courses and hands-on projects");
    }
    
    if (specificAptitudes.social < 60 && 
        ['Medical Doctor', 'Clinical Psychologist', 'Marketing Specialist'].includes(career.careerTitle)) {
      customGapAnalysis.push("Build better interpersonal and communication skills through group activities and public speaking practice");
    }
    
    if (specificAptitudes.leadership < 60 && 
        ['Project Manager', 'Entrepreneur', 'Business Analyst'].includes(career.careerTitle)) {
      customGapAnalysis.push("Develop leadership abilities by volunteering for team lead roles and studying effective management practices");
    }
    
    return {
      careerTitle: career.careerTitle,
      suitabilityPercentage: Math.round(suitabilityScore),
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
