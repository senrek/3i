/**
 * Utility functions for analyzing assessment responses to generate personalized insights
 */

interface PersonalityInsights {
  traits: string[];
  workStyle: string[];
  learningPreferences: string[];
  communicationStyle: string;
  decisionMakingStyle: string;
  careerValues: string[];
}

interface CareerRecommendation {
  title: string;
  match: number;
  description: string;
  keySkills: string[];
  educationPathways: string[];
  workEnvironment: string;
  growthOpportunities: string;
}

/**
 * Analyze responses to determine personality traits based on specific questions
 */
export const analyzePersonality = (responses: Record<string, string>): PersonalityInsights => {
  // Default values
  const insights: PersonalityInsights = {
    traits: [],
    workStyle: [],
    learningPreferences: [],
    communicationStyle: 'balanced',
    decisionMakingStyle: 'balanced',
    careerValues: []
  };
  
  // Analyze extroversion/introversion (questions 59, 60, 64)
  const extroversionScore = countResponses(['per_6', 'per_4', 'per_1', 'per_3'], 'A', responses);
  if (extroversionScore >= 3) {
    insights.traits.push('Extroverted', 'Outgoing');
    insights.communicationStyle = 'expressive';
  } else if (extroversionScore <= 1) {
    insights.traits.push('Introverted', 'Reflective');
    insights.communicationStyle = 'thoughtful';
  }
  
  // Analyze sensing/intuition (questions 61, 62, 63, 65, 66)
  const intuitionScore = countResponses(['per_8', 'per_9', 'per_10', 'per_12', 'per_13'], 'B', responses);
  if (intuitionScore >= 3) {
    insights.traits.push('Intuitive', 'Big-picture thinker', 'Innovative');
  } else {
    insights.traits.push('Practical', 'Detail-oriented', 'Pragmatic');
  }
  
  // Analyze thinking/feeling (questions 68, 69, 70, 71, 72, 73, 74)
  const feelingScore = countResponses(['per_10', 'per_11', 'per_12', 'per_13', 'per_14'], 'B', responses);
  if (feelingScore >= 4) {
    insights.traits.push('Compassionate', 'People-oriented');
    insights.decisionMakingStyle = 'empathetic';
  } else if (feelingScore <= 2) {
    insights.traits.push('Logical', 'Analytical');
    insights.decisionMakingStyle = 'rational';
  }
  
  // Analyze judging/perceiving (questions 75, 76, 77)
  const judgingScore = countResponses(['per_14', 'per_7'], 'A', responses);
  if (judgingScore >= 2) {
    insights.traits.push('Structured', 'Organized');
    insights.workStyle.push('Prefers planning and schedules');
  } else {
    insights.traits.push('Flexible', 'Adaptable');
    insights.workStyle.push('Prefers spontaneity and keeping options open');
  }
  
  // Analyze learning preferences (questions 90-97)
  if (responses['91'] === 'A' || responses['92'] === 'A' || responses['95'] === 'A') {
    insights.learningPreferences.push('Visual Learner');
  }
  if (responses['91'] === 'B' || responses['92'] === 'B' || responses['95'] === 'B') {
    insights.learningPreferences.push('Auditory Learner');
  }
  if (responses['91'] === 'C' || responses['92'] === 'C' || responses['95'] === 'D' || responses['94'] === 'A') {
    insights.learningPreferences.push('Kinesthetic Learner');
  }
  if (responses['91'] === 'D' || responses['93'] === 'A' || responses['95'] === 'C' || responses['97'] === 'D') {
    insights.learningPreferences.push('Reading/Writing Learner');
  }
  
  // Default if no clear preference
  if (insights.learningPreferences.length === 0) {
    insights.learningPreferences.push('Multimodal Learner');
  }
  
  // Analyze career values (questions 83-89)
  if (responses['83'] === 'A' || responses['83'] === 'B') {
    insights.careerValues.push('Adventure and Excitement');
  }
  if (responses['84'] === 'A' || responses['84'] === 'B') {
    insights.careerValues.push('Autonomy and Independence');
    insights.workStyle.push('Works well independently');
  } else {
    insights.workStyle.push('Thrives in collaborative environments');
  }
  if (responses['85'] === 'A' || responses['85'] === 'B') {
    insights.careerValues.push('Continuous Learning and Growth');
  }
  if (responses['86'] === 'A' || responses['86'] === 'B') {
    insights.careerValues.push('Challenge and Competition');
  }
  if (responses['87'] === 'A' || responses['87'] === 'B') {
    insights.careerValues.push('Structure and Precision');
  }
  if (responses['88'] === 'A' || responses['88'] === 'B') {
    insights.careerValues.push('Creativity and Artistic Expression');
  }
  if (responses['89'] === 'A' || responses['89'] === 'B') {
    insights.careerValues.push('Social Impact and Service');
  }
  
  // Ensure we have at least some basic career values
  if (insights.careerValues.length === 0) {
    insights.careerValues.push('Professional Growth', 'Stability', 'Work-Life Balance');
  }
  
  return insights;
};

/**
 * Helper function to count specific responses to specific questions
 */
const countResponses = (questionIds: string[], answerValue: string, responses: Record<string, string>): number => {
  return questionIds.filter(id => responses[id] === answerValue).length;
};

/**
 * Analyze responses to generate skill strengths and development areas
 */
export const analyzeSkills = (responses: Record<string, string>): { strengths: string[], developmentAreas: string[] } => {
  const skillAreas = {
    analytical: 0,
    creative: 0, 
    technical: 0,
    social: 0,
    leadership: 0,
    business: 0,
    detail: 0,
    organization: 0
  };
  
  // Map questions to skill areas
  const skillMapping: Record<string, keyof typeof skillAreas> = {
    // Analytical thinking questions
    'apt_23': 'analytical',
    'apt_26': 'analytical',
    'apt_38': 'analytical',
    'apt_52': 'analytical',
    'apt_54': 'analytical',
    // Creative questions
    'apt_4': 'creative',
    'apt_5': 'creative',
    'apt_20': 'creative',
    'apt_29': 'creative',
    'apt_46': 'creative',
    'per_13': 'creative',
    // Technical questions
    'apt_8': 'technical',
    'apt_9': 'technical',
    'apt_32': 'technical',
    'apt_47': 'technical',
    'apt_57': 'technical',
    // Social questions
    'apt_7': 'social',
    'apt_28': 'social',
    'apt_35': 'social',
    'apt_36': 'social',
    'apt_41': 'social',
    'per_6': 'social',
    // Leadership questions
    'apt_6': 'leadership',
    'apt_15': 'leadership',
    'apt_16': 'leadership',
    'apt_33': 'leadership',
    'apt_43': 'leadership',
    // Business questions
    'apt_10': 'business',
    'apt_48': 'business',
    'apt_56': 'business',
    // Detail questions
    'apt_19': 'detail',
    'apt_25': 'detail',
    'per_7': 'detail',
    // Organization questions
    'apt_24': 'organization',
    'apt_44': 'organization',
    'per_14': 'organization'
  };
  
  // Calculate scores based on responses
  Object.entries(responses).forEach(([key, value]) => {
    const skillArea = skillMapping[key];
    if (skillArea) {
      if (value === 'A') skillAreas[skillArea] += 3;
      else if (value === 'B') skillAreas[skillArea] += 2;
      else if (value === 'C') skillAreas[skillArea] += 1;
    }
  });
  
  // Normalize scores by question count
  const normalizeScore = (area: keyof typeof skillAreas, responses: Record<string, string>): number => {
    const questions = Object.keys(skillMapping).filter(q => skillMapping[q] === area);
    const answeredCount = questions.filter(q => responses[q]).length;
    return answeredCount > 0 ? skillAreas[area] / (answeredCount * 3) * 100 : 0;
  };
  
  const normalizedScores = {
    analytical: normalizeScore('analytical', responses),
    creative: normalizeScore('creative', responses),
    technical: normalizeScore('technical', responses),
    social: normalizeScore('social', responses),
    leadership: normalizeScore('leadership', responses),
    business: normalizeScore('business', responses),
    detail: normalizeScore('detail', responses),
    organization: normalizeScore('organization', responses)
  };
  
  // Determine strengths and development areas based on scores
  const strengths: string[] = [];
  const developmentAreas: string[] = [];
  
  if (normalizedScores.analytical > 70) strengths.push('Analytical Thinking');
  else if (normalizedScores.analytical < 50) developmentAreas.push('Analytical Thinking');
  
  if (normalizedScores.creative > 70) strengths.push('Creativity');
  else if (normalizedScores.creative < 50) developmentAreas.push('Creative Thinking');
  
  if (normalizedScores.technical > 70) strengths.push('Technical Proficiency');
  else if (normalizedScores.technical < 50) developmentAreas.push('Technical Skills');
  
  if (normalizedScores.social > 70) strengths.push('Communication Skills');
  else if (normalizedScores.social < 50) developmentAreas.push('Interpersonal Abilities');
  
  if (normalizedScores.leadership > 70) strengths.push('Leadership Potential');
  else if (normalizedScores.leadership < 50) developmentAreas.push('Leadership Skills');
  
  if (normalizedScores.business > 70) strengths.push('Business Acumen');
  else if (normalizedScores.business < 50) developmentAreas.push('Business Knowledge');
  
  if (normalizedScores.detail > 70) strengths.push('Attention to Detail');
  else if (normalizedScores.detail < 50) developmentAreas.push('Focus and Precision');
  
  if (normalizedScores.organization > 70) strengths.push('Organization');
  else if (normalizedScores.organization < 50) developmentAreas.push('Time Management');
  
  // Add additional context-dependent strengths/gaps
  const isAdaptable = countResponses(['apt_30', 'apt_50'], 'A', responses) > 0;
  if (isAdaptable) strengths.push('Adaptability');
  
  const isProblemSolver = countResponses(['apt_23', 'apt_52'], 'A', responses) > 0;
  if (isProblemSolver) strengths.push('Problem Solving');
  
  const isContinuousLearner = countResponses(['apt_31', 'apt_85'], 'A', responses) > 0;
  if (isContinuousLearner) strengths.push('Continuous Learning');
  
  // Ensure minimum number of strengths and development areas
  const additionalStrengths = [
    'Critical Thinking', 
    'Adaptability', 
    'Self-Direction', 
    'Problem Solving', 
    'Team Collaboration'
  ];
  
  const additionalDevelopmentAreas = [
    'Data Analysis', 
    'Presentation Skills', 
    'Career Focus', 
    'Self-Motivation', 
    'Networking Skills'
  ];
  
  while (strengths.length < 3) {
    const strength = additionalStrengths.find(s => !strengths.includes(s));
    if (strength) strengths.push(strength);
    else break;
  }
  
  while (developmentAreas.length < 3) {
    const area = additionalDevelopmentAreas.find(a => !developmentAreas.includes(a));
    if (area) developmentAreas.push(area);
    else break;
  }
  
  return { strengths, developmentAreas };
};

/**
 * Determine relevant career recommendations based on responses
 */
export const generateCareerRecommendations = (
  responses: Record<string, string>,
  personalityInsights: PersonalityInsights
): CareerRecommendation[] => {
  const recommendations: CareerRecommendation[] = [];
  
  // Analyze technical vs creative vs social orientation
  const technicalScore = analyzeAptitudeArea('technical', responses);
  const creativeScore = analyzeAptitudeArea('creative', responses);
  const analyticalScore = analyzeAptitudeArea('analytical', responses);
  const socialScore = analyzeAptitudeArea('social', responses);
  const leadershipScore = analyzeAptitudeArea('leadership', responses);
  const businessScore = analyzeAptitudeArea('business', responses);
  
  // Add career recommendations based on scores
  if (technicalScore > 70 && analyticalScore > 60) {
    recommendations.push({
      title: "Software Engineer",
      match: calculateMatchPercentage(technicalScore, analyticalScore),
      description: "Design, develop, and maintain software systems and applications using programming languages and software engineering principles.",
      keySkills: ["Programming", "Problem-solving", "Logical thinking", "Software design", "Attention to detail"],
      educationPathways: [
        "Bachelor's degree in Computer Science, Software Engineering, or related field",
        "Coding bootcamps for practical skills",
        "Industry certifications in specific technologies",
        "Continuous learning through online courses and documentation"
      ],
      workEnvironment: "Collaborative team settings with flexible work arrangements including remote options. Project-based work with regular deadlines.",
      growthOpportunities: "Career progression to senior developer, technical lead, software architect, or engineering manager roles."
    });
  }
  
  if (analyticalScore > 75 && technicalScore > 60) {
    recommendations.push({
      title: "Data Scientist",
      match: calculateMatchPercentage(analyticalScore, technicalScore),
      description: "Analyze complex datasets to identify patterns, make predictions, and provide insights that drive business decisions and strategy.",
      keySkills: ["Statistical analysis", "Machine learning", "Programming", "Data visualization", "Critical thinking"],
      educationPathways: [
        "Bachelor's degree in Statistics, Mathematics, Computer Science, or related field",
        "Master's or PhD for advanced positions",
        "Specialized certifications in data science tools and methodologies",
        "Continuous learning through online courses and workshops"
      ],
      workEnvironment: "Collaborative work with cross-functional teams, often in office settings with remote options. Project-based work with flexible schedules.",
      growthOpportunities: "Advancement to senior data scientist, machine learning engineer, AI specialist, or data science manager."
    });
  }
  
  if (creativeScore > 70 && technicalScore > 50) {
    recommendations.push({
      title: "UX/UI Designer",
      match: calculateMatchPercentage(creativeScore, technicalScore),
      description: "Create intuitive, accessible, and engaging digital experiences for users through research, wireframing, prototyping, and visual design.",
      keySkills: ["User research", "Visual design", "Wireframing", "Prototyping", "Usability testing"],
      educationPathways: [
        "Bachelor's degree in Design, Human-Computer Interaction, or related field",
        "UX/UI design bootcamps or specialized courses",
        "Portfolio development through projects and internships",
        "Continuous learning through design community engagement"
      ],
      workEnvironment: "Collaborative work with product teams in creative studios, tech companies, or design agencies. Mix of independent and team-based work.",
      growthOpportunities: "Progression to senior designer, UX lead, design manager, or creative director roles."
    });
  }
  
  if (socialScore > 70 && leadershipScore > 60) {
    recommendations.push({
      title: "Marketing Specialist",
      match: calculateMatchPercentage(socialScore, leadershipScore),
      description: "Develop and implement strategies to promote products, services, and brands to target audiences through various marketing channels.",
      keySkills: ["Communication", "Strategic thinking", "Creativity", "Social media management", "Market research"],
      educationPathways: [
        "Bachelor's degree in Marketing, Communications, Business, or related field",
        "Digital marketing certifications from recognized platforms",
        "Specialized courses in specific marketing disciplines",
        "Continuous learning through industry events and workshops"
      ],
      workEnvironment: "Dynamic, creative environment with collaborative teams. Work settings include agencies, in-house marketing departments, or remote arrangements.",
      growthOpportunities: "Career paths into specialized areas like digital marketing, content strategy, brand management, or marketing leadership."
    });
  }
  
  if (businessScore > 70 && analyticalScore > 60) {
    recommendations.push({
      title: "Financial Analyst",
      match: calculateMatchPercentage(businessScore, analyticalScore),
      description: "Analyze financial data, prepare reports, and provide recommendations to help organizations make informed business and investment decisions.",
      keySkills: ["Financial modeling", "Data analysis", "Report preparation", "Forecasting", "Attention to detail"],
      educationPathways: [
        "Bachelor's degree in Finance, Accounting, Economics, or related field",
        "MBA or Master's in Finance for advanced positions",
        "Professional certifications like CFA, FRM, or CPA",
        "Continuous learning through industry updates and regulations"
      ],
      workEnvironment: "Professional settings in financial institutions, consulting firms, or corporate finance departments. Detail-oriented work with regular reporting cycles.",
      growthOpportunities: "Progression to senior financial analyst, finance manager, investment analyst, or financial controller roles."
    });
  }
  
  if (leadershipScore > 75 && businessScore > 60) {
    recommendations.push({
      title: "Project Manager",
      match: calculateMatchPercentage(leadershipScore, businessScore),
      description: "Plan, execute, and oversee projects from initiation to completion, ensuring they are delivered on time, within scope, and within budget.",
      keySkills: ["Leadership", "Organization", "Communication", "Problem-solving", "Risk management"],
      educationPathways: [
        "Bachelor's degree in Business, Management, or related field",
        "Project Management Professional (PMP) or similar certifications",
        "Specialized training in project management methodologies",
        "Continuous learning through industry best practices and tools"
      ],
      workEnvironment: "Collaborative work with cross-functional teams across various industries. Mix of office-based and field work depending on the project nature.",
      growthOpportunities: "Advancement to senior project manager, program manager, portfolio manager, or operations director roles."
    });
  }
  
  if (socialScore > 75 && creativeScore > 50) {
    recommendations.push({
      title: "Human Resources Specialist",
      match: calculateMatchPercentage(socialScore, creativeScore),
      description: "Recruit, screen, interview, and place workers while handling employee relations, compensation, benefits, and training within organizations.",
      keySkills: ["Communication", "Interpersonal skills", "Problem-solving", "Decision-making", "Empathy"],
      educationPathways: [
        "Bachelor's degree in Human Resources, Psychology, Business, or related field",
        "HR certifications like PHR, SHRM-CP, or HRCI",
        "Specialized training in HR management systems and practices",
        "Continuous learning through HR laws and regulations updates"
      ],
      workEnvironment: "Professional office settings or remote work with frequent interaction with employees at all levels. Collaborative work with management teams.",
      growthOpportunities: "Career progression to HR manager, HR director, talent acquisition manager, or employee relations specialist."
    });
  }
  
  // Sort by match percentage and ensure we have at least 3 recommendations
  recommendations.sort((a, b) => b.match - a.match);
  
  // If we have fewer than 3 recommendations, add more general ones
  const defaultRecommendations = [
    {
      title: "Business Analyst",
      match: 65,
      description: "Analyze business processes and systems to identify improvements and solutions that help organizations achieve their goals efficiently.",
      keySkills: ["Analytical thinking", "Communication", "Problem-solving", "Process modeling", "Requirements gathering"],
      educationPathways: [
        "Bachelor's degree in Business, Information Systems, or related field",
        "Business Analysis certifications like CBAP or CCBA",
        "Specialized training in business analysis methodologies and tools",
        "Continuous learning through industry best practices and standards"
      ],
      workEnvironment: "Collaborative work with stakeholders across various departments. Office-based or remote work with frequent meetings and workshops.",
      growthOpportunities: "Progression to senior business analyst, systems analyst, product owner, or business solutions manager roles."
    },
    {
      title: "Content Creator",
      match: 62,
      description: "Develop engaging content across various media formats to inform, educate, entertain, or persuade target audiences for brands or personal platforms.",
      keySkills: ["Writing", "Creativity", "Research", "Social media", "Visual communication"],
      educationPathways: [
        "Bachelor's degree in Communications, English, Journalism, or related field",
        "Specialized courses in content marketing, SEO, or multimedia production",
        "Portfolio development through personal projects and internships",
        "Continuous learning through industry trends and platform updates"
      ],
      workEnvironment: "Creative settings in marketing agencies, media companies, or freelance arrangements. Flexible work schedules with project-based deadlines.",
      growthOpportunities: "Career paths into content strategy, digital marketing, brand management, or creative direction."
    },
    {
      title: "Educator",
      match: 60,
      description: "Teach and facilitate learning experiences for students of various ages, developing curriculum and assessment methods to support educational objectives.",
      keySkills: ["Communication", "Patience", "Organization", "Creativity", "Adaptability"],
      educationPathways: [
        "Bachelor's degree in Education or subject-specific field",
        "Teaching certification or license as required by jurisdiction",
        "Master's degree for advanced positions or specialized teaching roles",
        "Continuous professional development through workshops and courses"
      ],
      workEnvironment: "Educational institutions with structured schedules and significant preparation time. Collaborative work with other educators and administrators.",
      growthOpportunities: "Advancement to lead teacher, department head, curriculum developer, or educational administrator roles."
    }
  ];
  
  while (recommendations.length < 3) {
    const nextDefault = defaultRecommendations.shift();
    if (nextDefault) recommendations.push(nextDefault);
    else break;
  }
  
  return recommendations;
};

/**
 * Helper function to analyze aptitude in specific areas
 */
export const analyzeAptitudeArea = (area: string, responses: Record<string, string>) => {
  let score = 0;
  let count = 0;

  // Helper function to check multiple selections
  const checkMultipleSelections = (selections: string[], keywords: string[]) => {
    let matched = 0;
    selections.forEach(selection => {
      if (keywords.some(keyword => selection.toLowerCase().includes(keyword))) {
        matched++;
      }
    });
    return matched;
  };

  Object.entries(responses).forEach(([id, answer]) => {
    // For multiple selection questions (100-103)
    if (id.startsWith('int_') && Number(id.replace(/\D/g, '')) >= 100) {
      const selections = answer.split(',');
      
      switch (area) {
        case 'technical':
          score += checkMultipleSelections(selections, ['computer', 'technology', 'mechanism', 'engineering']) * 25;
          count++;
          break;
        case 'creative':
          score += checkMultipleSelections(selections, ['design', 'art', 'fashion', 'perform', 'actor']) * 25;
          count++;
          break;
        case 'analytical':
          score += checkMultipleSelections(selections, ['chemicals', 'science', 'research', 'analysis']) * 25;
          count++;
          break;
        case 'social':
          score += checkMultipleSelections(selections, ['helping', 'emotional', 'guiding', 'public']) * 25;
          count++;
          break;
        case 'leadership':
          score += checkMultipleSelections(selections, ['managing', 'business', 'marketing']) * 25;
          count++;
          break;
        case 'business':
          score += checkMultipleSelections(selections, ['business', 'financial', 'marketing', 'managing']) * 25;
          count++;
          break;
      }
    }
    // For existing questions
    else {
      // ... existing scoring logic ...
    }
  });

  return count > 0 ? Math.min(100, Math.round(score / count)) : 0;
};

/**
 * Helper function to calculate match percentage based on primary and secondary scores
 */
const calculateMatchPercentage = (primaryScore: number, secondaryScore: number): number => {
  // Calculate weighted average (70% primary, 30% secondary) and add small random factor
  const baseScore = (primaryScore * 0.7) + (secondaryScore * 0.3);
  const randomFactor = Math.floor(Math.random() * 10) - 5; // -5 to +5 random adjustment
  
  // Ensure final score is between 55 and 95
  return Math.min(95, Math.max(55, Math.round(baseScore + randomFactor)));
};

/**
 * Generate development plan based on personality insights and skill gaps
 */
export const generateDevelopmentPlan = (
  personalityInsights: PersonalityInsights, 
  developmentAreas: string[]
): { shortTerm: string[], mediumTerm: string[], longTerm: string[] } => {
  // Default plans
  const plan = {
    shortTerm: [] as string[],
    mediumTerm: [] as string[],
    longTerm: [] as string[]
  };
  
  // Add development areas based recommendations
  developmentAreas.forEach(area => {
    switch (area) {
      case 'Technical Skills':
        plan.shortTerm.push("Identify specific technical skills most relevant to your career interests");
        plan.mediumTerm.push("Complete at least one certification or course in a key technical skill");
        break;
      case 'Leadership Skills':
        plan.shortTerm.push("Volunteer to lead small projects or group activities to build leadership experience");
        plan.longTerm.push("Seek mentorship from experienced leaders in your field of interest");
        break;
      case 'Communication':
        plan.shortTerm.push("Practice structured communication through presentations or group discussions");
        plan.mediumTerm.push("Join a public speaking group or take a communications course");
        break;
      case 'Analytical Thinking':
        plan.shortTerm.push("Practice breaking down complex problems into manageable components");
        plan.mediumTerm.push("Take an online course in critical thinking or logical reasoning");
        break;
      case 'Career Focus':
        plan.shortTerm.push("Research at least three career paths aligned with your top interests");
        plan.mediumTerm.push("Conduct informational interviews with professionals in your target careers");
        break;
      case 'Creative Thinking':
        plan.shortTerm.push("Set aside regular time for brainstorming and idea generation");
        plan.mediumTerm.push("Participate in creative workshops or design thinking exercises");
        break;
      case 'Business Knowledge':
        plan.shortTerm.push("Follow industry news and trends related to your career interests");
        plan.mediumTerm.push("Take a foundational business course or read key business texts");
        break;
      case 'Interpersonal Abilities':
        plan.shortTerm.push("Practice active listening techniques in your daily interactions");
        plan.mediumTerm.push("Seek opportunities to work in diverse teams and group settings");
        break;
      case 'Time Management':
        plan.shortTerm.push("Experiment with different productivity systems and tools");
        plan.mediumTerm.push("Develop a personalized time management strategy based on your work style");
        break;
      default:
        plan.shortTerm.push(`Research best practices for developing skills in ${area}`);
        plan.mediumTerm.push(`Set specific, measurable goals for improvement in ${area}`);
        break;
    }
  });
  
  // Add learning style-based recommendations
  if (personalityInsights.learningPreferences.includes('Visual Learner')) {
    plan.shortTerm.push("Use visual aids like mind maps and diagrams in your learning");
  } else if (personalityInsights.learningPreferences.includes('Auditory Learner')) {
    plan.shortTerm.push("Utilize audiobooks and podcasts related to your field of interest");
  } else if (personalityInsights.learningPreferences.includes('Kinesthetic Learner')) {
    plan.shortTerm.push("Incorporate hands-on practice and experiential learning approaches");
  }
  
  // Add personality-based recommendations
  if (personalityInsights.traits.includes('Introverted')) {
    plan.mediumTerm.push("Build a network strategically through one-on-one connections and small group events");
  } else if (personalityInsights.traits.includes('Extroverted')) {
    plan.mediumTerm.push("Leverage your natural networking abilities to build professional relationships");
  }
  
  // Add long-term career recommendations
  plan.longTerm.push("Develop a five-year career plan with specific milestones and advancement goals");
  plan.longTerm.push("Build a professional portfolio showcasing your key skills and accomplishments");
  plan.longTerm.push("Establish yourself as a specialist in your chosen field through continuous learning");
  
  // Ensure we have at least 3 recommendations for each timeframe
  const defaultShortTerm = [
    "Connect with professionals in your field of interest through networking platforms",
    "Identify and begin addressing your most critical skill gaps through self-study",
    "Create a personal development plan with specific, measurable goals"
  ];
  
  const defaultMediumTerm = [
    "Complete relevant courses or certifications to build your credentials",
    "Gain practical experience through internships, volunteering, or personal projects",
    "Develop your personal brand and online professional presence"
  ];
  
  const defaultLongTerm = [
    "Pursue advanced qualifications if required for career progression",
    "Expand your professional network within your chosen industry",
    "Regularly reassess your career path and make adjustments as needed"
  ];
  
  // Add default recommendations if needed
  while (plan.shortTerm.length < 3) {
    const next = defaultShortTerm.find(item => !plan.shortTerm.includes(item));
    if (next) plan.shortTerm.push(next);
    else break;
  }
  
  while (plan.mediumTerm.length < 3) {
    const next = defaultMediumTerm.find(item => !plan.mediumTerm.includes(item));
    if (next) plan.mediumTerm.push(next);
    else break;
  }
  
  while (plan.longTerm.length < 3) {
    const next = defaultLongTerm.find(item => !plan.longTerm.includes(item));
    if (next) plan.longTerm.push(next);
    else break;
  }
  
  return plan;
};
