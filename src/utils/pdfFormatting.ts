
// PDF formatting utility functions

export const formatPersonalityType = (personalityType: string) => {
  if (!personalityType) return 'Not determined';
  
  const parts = personalityType.split(':');
  if (parts.length !== 4) return personalityType;
  
  // Format the personality type as per the example PDF
  return `${parts[0]}:${parts[1]}:${parts[2]}:${parts[3]}`;
};

export const formatLearningStyle = (styles: { name: string; value: number }[]) => {
  if (!styles || !styles.length) return 'Not determined';
  
  // Return the highest value learning style
  return styles.sort((a, b) => b.value - a.value)[0].name;
};

export const formatSkillLevel = (score: number): string => {
  if (score >= 80) return "Excellent";
  if (score >= 65) return "Good";
  if (score >= 50) return "Average";
  return "Below Average";
};

export const formatCurrentStage = (aptitude: number, personality: number): string => {
  const combined = (aptitude + personality) / 2;
  
  if (combined < 40) return "Ignorant";
  if (combined < 55) return "Confused";
  if (combined < 70) return "Diffused";
  if (combined < 85) return "Methodical";
  return "Optimized";
};

export const formatCareerClusters = (
  aptitude: number, 
  personality: number, 
  interest: number
): { name: string; value: number }[] => {
  return [
    { name: 'Information Technology', value: Math.round(aptitude * 1.15) },
    { name: 'Science, Maths and Engineering', value: Math.round(aptitude * 1.15) },
    { name: 'Manufacturing', value: Math.round(aptitude * 0.9) },
    { name: 'Accounts and Finance', value: Math.round(aptitude * 0.85) },
    { name: 'Logistics and Transportation', value: Math.round(aptitude * 0.85) },
    { name: 'Bio Science and Research', value: Math.round(aptitude * 0.8) },
    { name: 'Agriculture', value: Math.round(aptitude * 0.78) },
    { name: 'Health Science', value: Math.round(aptitude * 0.77) },
    { name: 'Government Services', value: Math.round(personality * 0.75) },
    { name: 'Public Safety and Security', value: Math.round(personality * 0.65) },
    { name: 'Architecture and Construction', value: Math.round(aptitude * 0.6) },
    { name: 'Business Management', value: Math.round(personality * 0.6) },
    { name: 'Legal Services', value: Math.round(personality * 0.55) },
    { name: 'Education and Training', value: Math.round(personality * 0.5) },
    { name: 'Hospitality and Tourism', value: Math.round(interest * 0.4) },
    { name: 'Marketing & Advertising', value: Math.round(personality * 0.3) },
    { name: 'Sports & Physical Activities', value: Math.round(interest * 0.3) },
    { name: 'Arts & Language Arts', value: Math.round(interest * 0.25) },
    { name: 'Human Service', value: Math.round(personality * 0.1) },
    { name: 'Media and Communication', value: Math.min(10, Math.round(personality * 0.05)) }
  ].sort((a, b) => b.value - a.value);
};

export const formatSubjectRecommendations = (
  aptitude: number,
  personality: number,
  interest: number
) => {
  const scienceMathScore = Math.round(aptitude * 1.15);
  const commerceScore = Math.round((aptitude * 0.6) + (personality * 0.3));
  const scienceBioScore = Math.round(aptitude * 0.9);
  const humanitiesScore = Math.round((personality * 0.2) + (interest * 0.2));
  
  return {
    scienceMath: {
      score: scienceMathScore,
      mandatory: ['Maths', 'Physics', 'Chemistry'],
      optional: [
        { name: 'Computer science', value: 50 },
        { name: 'Bio technology', value: 50 },
        { name: 'Biology', value: 40 },
        { name: 'Economics', value: 40 },
        { name: 'Engineering drawing', value: 25 },
        { name: 'Physical education', value: 15 }
      ]
    },
    commerce: {
      score: commerceScore,
      mandatory: ['Accountancy', 'Economics', 'Business Studies'],
      optional: [
        { name: 'Computer science', value: 50 },
        { name: 'Business Maths', value: 40 },
        { name: 'Entreprenuership', value: 30 },
        { name: 'Physical education', value: 15 },
        { name: 'Legal Studies', value: 10 }
      ]
    },
    scienceBio: {
      score: scienceBioScore,
      mandatory: ['Biology', 'Physics', 'Chemistry'],
      optional: [
        { name: 'Computer science', value: 50 },
        { name: 'Agriculture', value: 45 },
        { name: 'Maths', value: 40 },
        { name: 'Economics', value: 40 },
        { name: 'Physical education', value: 15 }
      ]
    },
    humanities: {
      score: humanitiesScore,
      mandatory: ['Language Arts', 'History'],
      optional: [
        { name: 'Economics', value: 40 },
        { name: 'Maths', value: 40 },
        { name: 'Graphical design', value: 15 },
        { name: 'Physical education', value: 15 },
        { name: 'Legal studies', value: 10 }
      ]
    }
  };
};

export const generatePdfDate = () => {
  const today = new Date();
  return today.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
