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
): Record<string, any> => {
  // This function is not needed for 10th grade as mentioned by the user
  // We'll return an empty object or simplified data to avoid errors
  return {
    scienceMath: {
      score: Math.round(aptitude * 1.2),
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
      score: Math.round(aptitude * 0.9),
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
      score: Math.round(aptitude * 0.85),
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
      score: Math.round(interest * 0.9),
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

// New PDF styling helpers for improved visuals

export const getHeaderStyles = (color: string = '#1a237e') => ({
  fontSize: 18,
  bold: true,
  color: 'white',
  fillColor: color,
  alignment: 'center',
  margin: [0, 10, 0, 10],
  padding: [15, 10, 15, 10]
});

export const getSectionHeaderStyles = (color: string = '#3949ab') => ({
  fontSize: 16,
  bold: true,
  color: 'white',
  fillColor: color,
  margin: [0, 5, 0, 5],
  padding: [10, 7, 10, 7]
});

export const getSubHeaderStyles = (color: string = '#3f51b5') => ({
  fontSize: 14,
  bold: true,
  color: 'white',
  fillColor: color,
  margin: [0, 3, 0, 3],
  padding: [7, 5, 7, 5],
  borderRadius: 5
});

export const getProgressBarColors = (value: number) => {
  if (value >= 80) return '#4caf50'; // Green for excellent
  if (value >= 65) return '#8bc34a'; // Light green for good
  if (value >= 50) return '#ffc107'; // Amber for average
  return '#f44336'; // Red for below average
};

export const createMotivatorBlock = (name: string, value: number, descriptions: string[]) => {
  const intensity = value >= 80 ? 'HIGH' : value >= 50 ? 'MEDIUM' : 'LOW';
  
  return {
    margin: [0, 5, 0, 15],
    stack: [
      {
        fillColor: '#1a237e',
        color: 'white',
        text: `${name}-${intensity}`,
        fontSize: 14,
        bold: true,
        padding: [10, 5, 10, 5],
        margin: [0, 0, 0, 0]
      },
      {
        columns: [
          {
            width: '25%',
            stack: [
              {
                margin: [5, 10, 5, 10],
                fillColor: '#2e7d32',
                color: 'white',
                text: name,
                alignment: 'center',
                fontSize: 14,
                bold: true,
                padding: [5, 30, 5, 30]
              }
            ]
          },
          {
            width: '75%',
            margin: [10, 10, 0, 0],
            ul: descriptions.map(desc => ({
              text: desc,
              fontSize: 11,
              margin: [0, 3, 0, 3]
            }))
          }
        ],
        margin: [0, 0, 0, 0],
        border: [1, 0, 1, 1],
        borderColor: ['#1a237e', '#1a237e', '#1a237e', '#1a237e']
      }
    ]
  };
};

export const createProgressBar = (label: string, value: number, width: number = 100) => {
  const barColor = getProgressBarColors(value);
  const valueLabel = `${value}%`;
  const levelLabel = formatSkillLevel(value);
  
  return {
    margin: [0, 5, 0, 15],
    stack: [
      { text: label, bold: true, margin: [0, 0, 0, 3] },
      {
        columns: [
          {
            width: '85%',
            stack: [
              {
                canvas: [
                  // Background gray bar
                  {
                    type: 'rect',
                    x: 0,
                    y: 0,
                    w: width,
                    h: 15,
                    r: 3,
                    fillOpacity: 0.5,
                    color: '#e0e0e0'
                  },
                  // Value colored bar
                  {
                    type: 'rect',
                    x: 0,
                    y: 0,
                    w: width * (value / 100),
                    h: 15,
                    r: 3,
                    color: barColor
                  }
                ]
              }
            ]
          },
          {
            width: '15%',
            text: valueLabel,
            alignment: 'left',
            margin: [5, 0, 0, 0]
          }
        ]
      },
      {
        columns: [
          { width: '*', text: '' },
          {
            width: 'auto',
            text: levelLabel,
            fontSize: 10,
            color: barColor,
            bold: true,
            alignment: 'right'
          }
        ],
        margin: [0, 2, 0, 0]
      }
    ]
  };
};

export const createCareerClusterChart = (clusters: { name: string; value: number }[]) => {
  // Only show top clusters to avoid too much clutter
  const topClusters = clusters.slice(0, 12);
  
  return topClusters.map(cluster => ({
    columns: [
      {
        width: '60%',
        text: cluster.name,
        margin: [0, 2, 0, 2]
      },
      {
        width: '40%',
        stack: [
          {
            canvas: [
              {
                type: 'rect',
                x: 0,
                y: 0,
                w: 100,
                h: 12,
                r: 2,
                fillOpacity: 0.3,
                color: '#e0e0e0'
              },
              {
                type: 'rect',
                x: 0,
                y: 0,
                w: cluster.value,
                h: 12,
                r: 2,
                color: getProgressBarColors(cluster.value)
              }
            ]
          }
        ]
      }
    ],
    margin: [0, 3, 0, 3]
  }));
};
