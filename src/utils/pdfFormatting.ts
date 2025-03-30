
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

export const generatePdfDate = () => {
  const today = new Date();
  return today.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// New PDF styling helpers for improved visuals

export const getHeaderStyles = (color: string = '#2980b9') => ({
  fontSize: 18,
  bold: true,
  color: 'white',
  fillColor: color,
  alignment: 'center',
  margin: [0, 10, 0, 10],
  padding: [15, 10, 15, 10]
});

export const getSectionHeaderStyles = (color: string = '#3498db') => ({
  fontSize: 16,
  bold: true,
  color: 'white',
  fillColor: color,
  margin: [0, 5, 0, 5],
  padding: [10, 7, 10, 7],
  borderRadius: 3
});

export const getSubHeaderStyles = (color: string = '#3498db') => ({
  fontSize: 14,
  bold: true,
  color: 'white',
  fillColor: color,
  margin: [0, 3, 0, 3],
  padding: [7, 5, 7, 5],
  borderRadius: 3
});

export const getProgressBarColors = (value: number) => {
  if (value >= 80) return '#2ecc71'; // Green for excellent
  if (value >= 65) return '#27ae60'; // Darker green for good
  if (value >= 50) return '#f39c12'; // Amber for average
  return '#e74c3c'; // Red for below average
};

export const createMotivatorBlock = (name: string, value: number, descriptions: string[]) => {
  const intensity = value >= 80 ? 'HIGH' : value >= 50 ? 'MEDIUM' : 'LOW';
  
  return {
    margin: [0, 5, 0, 15],
    stack: [
      {
        fillColor: '#2980b9',
        color: 'white',
        text: `${name}-${intensity}`,
        fontSize: 14,
        bold: true,
        padding: [10, 5, 10, 5],
        margin: [0, 0, 0, 0],
        borderRadius: 3
      },
      {
        columns: [
          {
            width: '25%',
            stack: [
              {
                margin: [5, 10, 5, 10],
                fillColor: '#27ae60',
                color: 'white',
                text: name,
                alignment: 'center',
                fontSize: 14,
                bold: true,
                padding: [5, 30, 5, 30],
                borderRadius: 3
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
        borderColor: ['#2980b9', '#2980b9', '#2980b9', '#2980b9'],
        borderRadius: [0, 0, 3, 3]
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
                    r: 4,
                    fillOpacity: 0.5,
                    color: '#ecf0f1'
                  },
                  // Value colored bar
                  {
                    type: 'rect',
                    x: 0,
                    y: 0,
                    w: width * (value / 100),
                    h: 15,
                    r: 4,
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
            margin: [5, 0, 0, 0],
            bold: true
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
        margin: [0, 2, 0, 2],
        bold: true
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
                r: 3,
                fillOpacity: 0.3,
                color: '#ecf0f1'
              },
              {
                type: 'rect',
                x: 0,
                y: 0,
                w: cluster.value,
                h: 12,
                r: 3,
                color: getProgressBarColors(cluster.value)
              }
            ]
          },
          {
            text: `${cluster.value}%`,
            fontSize: 8,
            bold: true,
            alignment: 'right',
            margin: [0, 1, 5, 0],
            color: getProgressBarColors(cluster.value)
          }
        ]
      }
    ],
    margin: [0, 4, 0, 4]
  }));
};

// New helper functions for enhanced PDF visuals
export const createColoredSection = (title: string, content: string) => {
  return {
    stack: [
      {
        fillColor: '#3498db',
        color: 'white',
        text: title,
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 0],
        padding: [7, 5, 7, 5],
        borderRadius: [3, 3, 0, 0]
      },
      {
        text: content,
        fontSize: 11,
        margin: [0, 0, 0, 0],
        padding: [10, 10, 10, 10],
        border: [1, 0, 1, 1],
        borderColor: ['#3498db', '#3498db', '#3498db', '#3498db'],
        borderRadius: [0, 0, 3, 3]
      }
    ],
    margin: [0, 10, 0, 10]
  };
};

export const createBulletList = (items: string[]) => {
  return {
    ul: items.map(item => ({
      text: item.replace(/•\s*/, ''),
      fontSize: 11,
      margin: [0, 2, 0, 2]
    })),
    margin: [0, 5, 0, 10]
  };
};

export const createStrengthsSection = (strengths: string[]) => {
  return {
    stack: [
      {
        fillColor: '#27ae60',
        color: 'white',
        text: 'Your Strengths',
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 0],
        padding: [7, 5, 7, 5],
        borderRadius: [3, 3, 0, 0]
      },
      {
        stack: strengths.map(strength => ({
          columns: [
            {
              width: 20,
              stack: [
                {
                  canvas: [
                    {
                      type: 'rect',
                      x: 5,
                      y: 5,
                      w: 10,
                      h: 10,
                      r: 5,
                      color: '#27ae60'
                    }
                  ]
                }
              ]
            },
            {
              width: '*',
              text: strength.replace(/•\s*/, ''),
              fontSize: 11,
              margin: [0, 3, 0, 3]
            }
          ],
          margin: [0, 2, 0, 2]
        })),
        padding: [10, 10, 10, 10],
        border: [1, 0, 1, 1],
        borderColor: ['#27ae60', '#27ae60', '#27ae60', '#27ae60'],
        borderRadius: [0, 0, 3, 3]
      }
    ],
    margin: [0, 10, 0, 10]
  };
};

export const createPersonalityDimension = (
  dimension: string, 
  description: string,
  traits: string[]
) => {
  return {
    stack: [
      {
        fillColor: '#3498db',
        color: 'white',
        text: dimension,
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 0],
        padding: [7, 5, 7, 5],
        borderRadius: [3, 3, 0, 0]
      },
      {
        stack: [
          {
            text: description,
            fontSize: 11,
            margin: [0, 5, 0, 10]
          },
          {
            ul: traits.map(trait => ({
              text: trait.replace(/•\s*/, ''),
              fontSize: 11,
              margin: [0, 2, 0, 2]
            }))
          }
        ],
        padding: [10, 10, 10, 10],
        border: [1, 0, 1, 1],
        borderColor: ['#3498db', '#3498db', '#3498db', '#3498db'],
        borderRadius: [0, 0, 3, 3]
      }
    ],
    margin: [0, 10, 0, 10]
  };
};

export const createImprovedProgressBar = (label: string, value: number, color?: string) => {
  const barColor = color || getProgressBarColors(value);
  
  return {
    stack: [
      {
        columns: [
          {
            width: '*',
            text: label,
            fontSize: 11,
            bold: true
          },
          {
            width: 'auto',
            text: `${value}%`,
            fontSize: 11,
            bold: true,
            color: barColor
          }
        ],
        margin: [0, 0, 0, 3]
      },
      {
        canvas: [
          // Background gray bar
          {
            type: 'rect',
            x: 0,
            y: 0,
            w: 170,
            h: 10,
            r: 5,
            fillOpacity: 0.5,
            color: '#ecf0f1'
          },
          // Value colored bar
          {
            type: 'rect',
            x: 0,
            y: 0,
            w: 170 * (value / 100),
            h: 10,
            r: 5,
            color: barColor
          }
        ],
        margin: [0, 0, 0, 5]
      }
    ],
    margin: [0, 5, 0, 5]
  };
};
