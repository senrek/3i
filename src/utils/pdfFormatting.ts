
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

// New functions for Career Report based on the provided image
export const createGradientHeader = (text: string) => {
  return {
    stack: [
      {
        canvas: [
          {
            type: 'rect',
            x: 0,
            y: 0,
            w: 515,
            h: 30,
            r: 3,
            color: '#1e88e5',
            linearGradient: ['#1e88e5', '#64b5f6']
          }
        ]
      },
      {
        text: text,
        absolutePosition: { x: 20, y: 8 },
        color: 'white',
        fontSize: 14,
        bold: true
      }
    ],
    margin: [0, 10, 0, 5]
  };
};

export const createProfileBlock = (name: string, email: string, phone: string, age: string, location: string, date: string) => {
  return {
    stack: [
      createGradientHeader('Report Prepared for'),
      {
        margin: [20, 10, 20, 10],
        columns: [
          {
            width: '50%',
            stack: [
              { text: name, fontSize: 16, bold: true, margin: [0, 0, 0, 5] },
              { 
                columns: [
                  { width: 80, text: 'Ph No', bold: true },
                  { width: '*', text: phone }
                ],
                margin: [0, 2, 0, 2]
              },
              { 
                columns: [
                  { width: 80, text: 'Email ID', bold: true },
                  { width: '*', text: email }
                ],
                margin: [0, 2, 0, 2]
              }
            ]
          },
          {
            width: '50%',
            stack: [
              { 
                columns: [
                  { width: 80, text: 'Age', bold: true },
                  { width: '*', text: age }
                ],
                margin: [0, 2, 0, 2]
              },
              { 
                columns: [
                  { width: 80, text: 'Location', bold: true },
                  { width: '*', text: location }
                ],
                margin: [0, 2, 0, 2]
              },
              { 
                columns: [
                  { width: 80, text: 'Date', bold: true },
                  { width: '*', text: date }
                ],
                margin: [0, 2, 0, 2]
              }
            ]
          }
        ]
      }
    ]
  };
};

export const createPlanningStageVisual = (stage: string) => {
  const stages = ['Ignorant', 'Confused', 'Diffused', 'Methodical', 'Optimized'];
  const currentIndex = stages.indexOf(stage);
  
  if (currentIndex === -1) return null;
  
  return {
    stack: [
      {
        margin: [0, 10, 0, 5],
        canvas: [
          // Background line
          {
            type: 'line',
            x1: 0, y1: 10,
            x2: 515, y2: 10,
            lineWidth: 5,
            lineColor: '#e0e0e0'
          },
          // Highlight current stage
          {
            type: 'line',
            x1: 0, y1: 10,
            x2: ((currentIndex + 1) / stages.length) * 515, y2: 10,
            lineWidth: 5,
            lineColor: '#3498db'
          }
        ]
      },
      {
        columns: stages.map((s, i) => ({
          width: '*',
          stack: [
            {
              canvas: [
                {
                  type: 'ellipse',
                  x: 10, y: 10,
                  r1: 10, r2: 10,
                  color: i <= currentIndex ? '#3498db' : '#e0e0e0'
                }
              ],
              alignment: 'center'
            },
            {
              text: s,
              fontSize: 9,
              alignment: 'center',
              margin: [0, 5, 0, 0],
              color: i <= currentIndex ? '#3498db' : '#9e9e9e',
              bold: i === currentIndex
            }
          ]
        }))
      }
    ]
  };
};

export const createPersonalityChart = (personalityType: string, strengths: { name: string, value: number }[]) => {
  if (!personalityType) return null;
  
  const parts = personalityType.split(':');
  if (parts.length !== 4) return null;
  
  // Calculate percentages for each dimension
  const dimensions = [
    { name: 'Introvert', value: parseFloat(strengths.find(s => s.name === 'introvert')?.value.toString() || '70') },
    { name: 'Extrovert', value: parseFloat(strengths.find(s => s.name === 'extrovert')?.value.toString() || '30') },
    { name: 'Sensing', value: parseFloat(strengths.find(s => s.name === 'sensing')?.value.toString() || '65') },
    { name: 'iNtuitive', value: parseFloat(strengths.find(s => s.name === 'intuitive')?.value.toString() || '35') },
    { name: 'Thinking', value: parseFloat(strengths.find(s => s.name === 'thinking')?.value.toString() || '60') },
    { name: 'Feeling', value: parseFloat(strengths.find(s => s.name === 'feeling')?.value.toString() || '40') },
    { name: 'Judging', value: parseFloat(strengths.find(s => s.name === 'judging')?.value.toString() || '55') },
    { name: 'Perceiving', value: parseFloat(strengths.find(s => s.name === 'perceiving')?.value.toString() || '45') }
  ];
  
  return {
    stack: [
      createGradientHeader('Personality Type: ' + personalityType),
      {
        margin: [20, 10, 20, 10],
        stack: [
          // Dimension 1: Introvert vs Extrovert
          {
            columns: [
              { width: '30%', text: dimensions[0].name + '-[' + dimensions[0].value + '%]', alignment: 'left', bold: true },
              { 
                width: '40%', 
                stack: [
                  {
                    canvas: [
                      {
                        type: 'rect',
                        x: 0, y: 0,
                        w: 200, h: 15,
                        r: 0,
                        color: '#f5f5f5',
                        lineColor: '#e0e0e0'
                      },
                      {
                        type: 'rect',
                        x: 0, y: 0,
                        w: dimensions[0].value * 2, h: 15,
                        r: 0,
                        color: '#3498db'
                      }
                    ]
                  }
                ]
              },
              { width: '30%', text: dimensions[1].name + '-[' + dimensions[1].value + '%]', alignment: 'right', bold: true }
            ],
            margin: [0, 5, 0, 10]
          },
          // Dimension 2: Sensing vs iNtuitive
          {
            columns: [
              { width: '30%', text: dimensions[2].name + '-[' + dimensions[2].value + '%]', alignment: 'left', bold: true },
              { 
                width: '40%', 
                stack: [
                  {
                    canvas: [
                      {
                        type: 'rect',
                        x: 0, y: 0,
                        w: 200, h: 15,
                        r: 0,
                        color: '#f5f5f5',
                        lineColor: '#e0e0e0'
                      },
                      {
                        type: 'rect',
                        x: 0, y: 0,
                        w: dimensions[2].value * 2, h: 15,
                        r: 0,
                        color: '#3498db'
                      }
                    ]
                  }
                ]
              },
              { width: '30%', text: dimensions[3].name + '-[' + dimensions[3].value + '%]', alignment: 'right', bold: true }
            ],
            margin: [0, 5, 0, 10]
          },
          // Dimension 3: Thinking vs Feeling
          {
            columns: [
              { width: '30%', text: dimensions[4].name + '-[' + dimensions[4].value + '%]', alignment: 'left', bold: true },
              { 
                width: '40%', 
                stack: [
                  {
                    canvas: [
                      {
                        type: 'rect',
                        x: 0, y: 0,
                        w: 200, h: 15,
                        r: 0,
                        color: '#f5f5f5',
                        lineColor: '#e0e0e0'
                      },
                      {
                        type: 'rect',
                        x: 0, y: 0,
                        w: dimensions[4].value * 2, h: 15,
                        r: 0,
                        color: '#3498db'
                      }
                    ]
                  }
                ]
              },
              { width: '30%', text: dimensions[5].name + '-[' + dimensions[5].value + '%]', alignment: 'right', bold: true }
            ],
            margin: [0, 5, 0, 10]
          },
          // Dimension 4: Judging vs Perceiving
          {
            columns: [
              { width: '30%', text: dimensions[6].name + '-[' + dimensions[6].value + '%]', alignment: 'left', bold: true },
              { 
                width: '40%', 
                stack: [
                  {
                    canvas: [
                      {
                        type: 'rect',
                        x: 0, y: 0,
                        w: 200, h: 15,
                        r: 0,
                        color: '#f5f5f5',
                        lineColor: '#e0e0e0'
                      },
                      {
                        type: 'rect',
                        x: 0, y: 0,
                        w: dimensions[6].value * 2, h: 15,
                        r: 0,
                        color: '#3498db'
                      }
                    ]
                  }
                ]
              },
              { width: '30%', text: dimensions[7].name + '-[' + dimensions[7].value + '%]', alignment: 'right', bold: true }
            ],
            margin: [0, 5, 0, 10]
          }
        ]
      }
    ]
  };
};

export const createPersonalityAnalysisSection = (title: string, bulletPoints: string[]) => {
  return {
    stack: [
      {
        text: title,
        fontSize: 13,
        bold: true,
        color: '#3498db',
        margin: [0, 10, 0, 5]
      },
      {
        columns: [
          {
            width: 20,
            stack: [
              {
                canvas: [
                  {
                    type: 'ellipse',
                    x: 5, y: 5,
                    r1: 5, r2: 5,
                    color: '#3498db'
                  }
                ]
              }
            ]
          },
          {
            width: '*',
            stack: bulletPoints.map(point => ({
              text: point,
              fontSize: 11,
              margin: [0, 0, 0, 5]
            }))
          }
        ]
      }
    ],
    margin: [0, 0, 0, 10]
  };
};

export const createInterestTypesChart = (types: { name: string, value: number }[]) => {
  const sortedTypes = [...types].sort((a, b) => b.value - a.value);
  
  return {
    stack: [
      createGradientHeader('Your Career Interest Types'),
      {
        margin: [20, 10, 20, 20],
        stack: sortedTypes.map(type => ({
          columns: [
            {
              width: '40%',
              text: type.name,
              fontSize: 11,
              bold: true
            },
            {
              width: '60%',
              stack: [
                {
                  canvas: [
                    {
                      type: 'rect',
                      x: 0, y: 0,
                      w: 200, h: 15,
                      r: 0,
                      color: '#f5f5f5',
                      lineColor: '#e0e0e0'
                    },
                    {
                      type: 'rect',
                      x: 0, y: 0,
                      w: type.value * 2, h: 15,
                      r: 0,
                      color: getProgressBarColors(type.value)
                    }
                  ]
                },
                {
                  text: type.value.toString(),
                  fontSize: 10,
                  alignment: 'right',
                  margin: [0, 2, 10, 0]
                }
              ]
            }
          ],
          margin: [0, 5, 0, 5]
        }))
      }
    ]
  };
};

export const createMotivatorTypesChart = (types: { name: string, value: number }[]) => {
  const sortedTypes = [...types].sort((a, b) => b.value - a.value);
  
  return {
    stack: [
      createGradientHeader('Your Career Motivator Types'),
      {
        margin: [20, 10, 20, 20],
        stack: sortedTypes.map(type => ({
          columns: [
            {
              width: '40%',
              text: type.name,
              fontSize: 11,
              bold: true
            },
            {
              width: '60%',
              stack: [
                {
                  canvas: [
                    {
                      type: 'rect',
                      x: 0, y: 0,
                      w: 200, h: 15,
                      r: 0,
                      color: '#f5f5f5',
                      lineColor: '#e0e0e0'
                    },
                    {
                      type: 'rect',
                      x: 0, y: 0,
                      w: type.value * 2, h: 15,
                      r: 0,
                      color: getProgressBarColors(type.value)
                    }
                  ]
                },
                {
                  text: type.value.toString(),
                  fontSize: 10,
                  alignment: 'right',
                  margin: [0, 2, 10, 0]
                }
              ]
            }
          ],
          margin: [0, 5, 0, 5]
        }))
      }
    ]
  };
};

export const createLearningStylesChart = (styles: { name: string, value: number }[]) => {
  const sortedStyles = [...styles].sort((a, b) => b.value - a.value);
  
  return {
    stack: [
      createGradientHeader('Your Learning Style Types'),
      {
        margin: [20, 10, 20, 20],
        stack: sortedStyles.map(style => ({
          columns: [
            {
              width: '40%',
              text: style.name,
              fontSize: 11,
              bold: true
            },
            {
              width: '60%',
              stack: [
                {
                  canvas: [
                    {
                      type: 'rect',
                      x: 0, y: 0,
                      w: 200, h: 15,
                      r: 0,
                      color: '#f5f5f5',
                      lineColor: '#e0e0e0'
                    },
                    {
                      type: 'rect',
                      x: 0, y: 0,
                      w: style.value * 2, h: 15,
                      r: 0,
                      color: getProgressBarColors(style.value)
                    }
                  ]
                },
                {
                  text: style.value.toString(),
                  fontSize: 10,
                  alignment: 'right',
                  margin: [0, 2, 10, 0]
                }
              ]
            }
          ],
          margin: [0, 5, 0, 5]
        }))
      }
    ]
  };
};

export const createSkillsAndAbilitiesSection = (skills: Record<string, number>) => {
  return {
    stack: [
      createGradientHeader('Your Skills and Abilities'),
      {
        margin: [20, 5, 20, 5],
        columns: [
          {
            width: '*',
            stack: [
              {
                text: 'Overall Skills and Abilities',
                fontSize: 14,
                bold: true,
                margin: [0, 5, 0, 5]
              },
              {
                columns: [
                  {
                    width: '80%',
                    stack: [
                      {
                        canvas: [
                          {
                            type: 'rect',
                            x: 0, y: 0,
                            w: 200, h: 20,
                            r: 3,
                            color: '#f5f5f5',
                            lineColor: '#e0e0e0'
                          },
                          {
                            type: 'rect',
                            x: 0, y: 0,
                            w: skills.overall * 2, h: 20,
                            r: 3,
                            color: getProgressBarColors(skills.overall)
                          }
                        ]
                      }
                    ]
                  },
                  {
                    width: '20%',
                    stack: [
                      {
                        text: skills.overall + '% - ' + formatSkillLevel(skills.overall),
                        fontSize: 10,
                        bold: true,
                        color: getProgressBarColors(skills.overall),
                        margin: [5, 5, 0, 0]
                      }
                    ]
                  }
                ],
                margin: [0, 5, 0, 20]
              }
            ]
          }
        ]
      },
      {
        margin: [20, 5, 20, 20],
        columns: [
          {
            width: '50%',
            stack: [
              // Numerical Ability
              {
                text: 'Numerical Ability',
                fontSize: 12,
                bold: true,
                margin: [0, 5, 0, 5]
              },
              {
                columns: [
                  {
                    width: '70%',
                    stack: [
                      {
                        canvas: [
                          {
                            type: 'rect',
                            x: 0, y: 0,
                            w: 160, h: 15,
                            r: 3,
                            color: '#f5f5f5',
                            lineColor: '#e0e0e0'
                          },
                          {
                            type: 'rect',
                            x: 0, y: 0,
                            w: skills.numerical * 1.6, h: 15,
                            r: 3,
                            color: getProgressBarColors(skills.numerical)
                          }
                        ]
                      }
                    ]
                  },
                  {
                    width: '30%',
                    stack: [
                      {
                        text: skills.numerical + '%',
                        fontSize: 10,
                        bold: true,
                        margin: [5, 2, 0, 0]
                      }
                    ]
                  }
                ],
                margin: [0, 0, 0, 5]
              },
              {
                text: formatSkillLevel(skills.numerical),
                fontSize: 9,
                bold: true,
                color: getProgressBarColors(skills.numerical),
                alignment: 'right',
                margin: [0, 0, 10, 10]
              },
              
              // Logical Ability
              {
                text: 'Logical Ability',
                fontSize: 12,
                bold: true,
                margin: [0, 5, 0, 5]
              },
              {
                columns: [
                  {
                    width: '70%',
                    stack: [
                      {
                        canvas: [
                          {
                            type: 'rect',
                            x: 0, y: 0,
                            w: 160, h: 15,
                            r: 3,
                            color: '#f5f5f5',
                            lineColor: '#e0e0e0'
                          },
                          {
                            type: 'rect',
                            x: 0, y: 0,
                            w: skills.logical * 1.6, h: 15,
                            r: 3,
                            color: getProgressBarColors(skills.logical)
                          }
                        ]
                      }
                    ]
                  },
                  {
                    width: '30%',
                    stack: [
                      {
                        text: skills.logical + '%',
                        fontSize: 10,
                        bold: true,
                        margin: [5, 2, 0, 0]
                      }
                    ]
                  }
                ],
                margin: [0, 0, 0, 5]
              },
              {
                text: formatSkillLevel(skills.logical),
                fontSize: 9,
                bold: true,
                color: getProgressBarColors(skills.logical),
                alignment: 'right',
                margin: [0, 0, 10, 10]
              },
              
              // Verbal Ability
              {
                text: 'Verbal Ability',
                fontSize: 12,
                bold: true,
                margin: [0, 5, 0, 5]
              },
              {
                columns: [
                  {
                    width: '70%',
                    stack: [
                      {
                        canvas: [
                          {
                            type: 'rect',
                            x: 0, y: 0,
                            w: 160, h: 15,
                            r: 3,
                            color: '#f5f5f5',
                            lineColor: '#e0e0e0'
                          },
                          {
                            type: 'rect',
                            x: 0, y: 0,
                            w: skills.verbal * 1.6, h: 15,
                            r: 3,
                            color: getProgressBarColors(skills.verbal)
                          }
                        ]
                      }
                    ]
                  },
                  {
                    width: '30%',
                    stack: [
                      {
                        text: skills.verbal + '%',
                        fontSize: 10,
                        bold: true,
                        margin: [5, 2, 0, 0]
                      }
                    ]
                  }
                ],
                margin: [0, 0, 0, 5]
              },
              {
                text: formatSkillLevel(skills.verbal),
                fontSize: 9,
                bold: true,
                color: getProgressBarColors(skills.verbal),
                alignment: 'right',
                margin: [0, 0, 10, 10]
              },
              
              // Clerical and Organizing Skills
              {
                text: 'Clerical and Organizing Skills',
                fontSize: 12,
                bold: true,
                margin: [0, 5, 0, 5]
              },
              {
                columns: [
                  {
                    width: '70%',
                    stack: [
                      {
                        canvas: [
                          {
                            type: 'rect',
                            x: 0, y: 0,
                            w: 160, h: 15,
                            r: 3,
                            color: '#f5f5f5',
                            lineColor: '#e0e0e0'
                          },
                          {
                            type: 'rect',
                            x: 0, y: 0,
                            w: skills.clerical * 1.6, h: 15,
                            r: 3,
                            color: getProgressBarColors(skills.clerical)
                          }
                        ]
                      }
                    ]
                  },
                  {
                    width: '30%',
                    stack: [
                      {
                        text: skills.clerical + '%',
                        fontSize: 10,
                        bold: true,
                        margin: [5, 2, 0, 0]
                      }
                    ]
                  }
                ],
                margin: [0, 0, 0, 5]
              },
              {
                text: formatSkillLevel(skills.clerical),
                fontSize: 9,
                bold: true,
                color: getProgressBarColors(skills.clerical),
                alignment: 'right',
                margin: [0, 0, 10, 10]
              }
            ]
          },
          {
            width: '50%',
            stack: [
              // Spatial & Visualization Ability
              {
                text: 'Spatial & Visualization Ability',
                fontSize: 12,
                bold: true,
                margin: [0, 5, 0, 5]
              },
              {
                columns: [
                  {
                    width: '70%',
                    stack: [
                      {
                        canvas: [
                          {
                            type: 'rect',
                            x: 0, y: 0,
                            w: 160, h: 15,
                            r: 3,
                            color: '#f5f5f5',
                            lineColor: '#e0e0e0'
                          },
                          {
                            type: 'rect',
                            x: 0, y: 0,
                            w: skills.spatial * 1.6, h: 15,
                            r: 3,
                            color: getProgressBarColors(skills.spatial)
                          }
                        ]
                      }
                    ]
                  },
                  {
                    width: '30%',
                    stack: [
                      {
                        text: skills.spatial + '%',
                        fontSize: 10,
                        bold: true,
                        margin: [5, 2, 0, 0]
                      }
                    ]
                  }
                ],
                margin: [0, 0, 0, 5]
              },
              {
                text: formatSkillLevel(skills.spatial),
                fontSize: 9,
                bold: true,
                color: getProgressBarColors(skills.spatial),
                alignment: 'right',
                margin: [0, 0, 10, 10]
              },
              
              // Leadership & Decision making skills
              {
                text: 'Leadership & Decision making skills',
                fontSize: 12,
                bold: true,
                margin: [0, 5, 0, 5]
              },
              {
                columns: [
                  {
                    width: '70%',
                    stack: [
                      {
                        canvas: [
                          {
                            type: 'rect',
                            x: 0, y: 0,
                            w: 160, h: 15,
                            r: 3,
                            color: '#f5f5f5',
                            lineColor: '#e0e0e0'
                          },
                          {
                            type: 'rect',
                            x: 0, y: 0,
                            w: skills.leadership * 1.6, h: 15,
                            r: 3,
                            color: getProgressBarColors(skills.leadership)
                          }
                        ]
                      }
                    ]
                  },
                  {
                    width: '30%',
                    stack: [
                      {
                        text: skills.leadership + '%',
                        fontSize: 10,
                        bold: true,
                        margin: [5, 2, 0, 0]
                      }
                    ]
                  }
                ],
                margin: [0, 0, 0, 5]
              },
              {
                text: formatSkillLevel(skills.leadership),
                fontSize: 9,
                bold: true,
                color: getProgressBarColors(skills.leadership),
                alignment: 'right',
                margin: [0, 0, 10, 10]
              },
              
              // Social & Co-operation Skills
              {
                text: 'Social & Co-operation Skills',
                fontSize: 12,
                bold: true,
                margin: [0, 5, 0, 5]
              },
              {
                columns: [
                  {
                    width: '70%',
                    stack: [
                      {
                        canvas: [
                          {
                            type: 'rect',
                            x: 0, y: 0,
                            w: 160, h: 15,
                            r: 3,
                            color: '#f5f5f5',
                            lineColor: '#e0e0e0'
                          },
                          {
                            type: 'rect',
                            x: 0, y: 0,
                            w: skills.social * 1.6, h: 15,
                            r: 3,
                            color: getProgressBarColors(skills.social)
                          }
                        ]
                      }
                    ]
                  },
                  {
                    width: '30%',
                    stack: [
                      {
                        text: skills.social + '%',
                        fontSize: 10,
                        bold: true,
                        margin: [5, 2, 0, 0]
                      }
                    ]
                  }
                ],
                margin: [0, 0, 0, 5]
              },
              {
                text: formatSkillLevel(skills.social),
                fontSize: 9,
                bold: true,
                color: getProgressBarColors(skills.social),
                alignment: 'right',
                margin: [0, 0, 10, 10]
              },
              
              // Mechanical Abilities
              {
                text: 'Mechanical Abilities',
                fontSize: 12,
                bold: true,
                margin: [0, 5, 0, 5]
              },
              {
                columns: [
                  {
                    width: '70%',
                    stack: [
                      {
                        canvas: [
                          {
                            type: 'rect',
                            x: 0, y: 0,
                            w: 160, h: 15,
                            r: 3,
                            color: '#f5f5f5',
                            lineColor: '#e0e0e0'
                          },
                          {
                            type: 'rect',
                            x: 0, y: 0,
                            w: skills.mechanical * 1.6, h: 15,
                            r: 3,
                            color: getProgressBarColors(skills.mechanical)
                          }
                        ]
                      }
                    ]
                  },
                  {
                    width: '30%',
                    stack: [
                      {
                        text: skills.mechanical + '%',
                        fontSize: 10,
                        bold: true,
                        margin: [5, 2, 0, 0]
                      }
                    ]
                  }
                ],
                margin: [0, 0, 0, 5]
              },
              {
                text: formatSkillLevel(skills.mechanical),
                fontSize: 9,
                bold: true,
                color: getProgressBarColors(skills.mechanical),
                alignment: 'right',
                margin: [0, 0, 10, 10]
              }
            ]
          }
        ]
      }
    ]
  };
};

export const createCareerClustersSection = (clusters: { name: string, value: number }[]) => {
  const sortedClusters = [...clusters].sort((a, b) => b.value - a.value);
  
  return {
    stack: [
      createGradientHeader('Your Career Clusters'),
      {
        margin: [20, 10, 20, 10],
        text: [
          {
            text: 'Career Clusters are groups of similar occupations and industries that require similar skills. It provides a ',
            fontSize: 11
          },
          {
            text: 'career road map for pursuing further education and career opportunities. ',
            fontSize: 11
          },
          {
            text: 'They help you connect your Education with your Career Planning. Career Cluster helps you narrow down your occupation choices based on your assessment responses. Results show which Career Clusters would be best to explore. A simple graph report shows how you have scored on each of the Career Clusters.',
            fontSize: 11
          }
        ]
      },
      {
        margin: [20, 10, 20, 20],
        stack: sortedClusters.map(cluster => ({
          columns: [
            {
              width: '60%',
              text: cluster.name,
              fontSize: 11,
              bold: true
            },
            {
              width: '40%',
              stack: [
                {
                  canvas: [
                    {
                      type: 'rect',
                      x: 0, y: 0,
                      w: 100, h: 15,
                      r: 0,
                      color: '#f5f5f5',
                      lineColor: '#e0e0e0'
                    },
                    {
                      type: 'rect',
                      x: 0, y: 0,
                      w: cluster.value, h: 15,
                      r: 0,
                      color: getProgressBarColors(cluster.value)
                    }
                  ]
                },
                {
                  text: cluster.value.toString(),
                  fontSize: 10,
                  alignment: 'right',
                  margin: [0, 2, 10, 0]
                }
              ]
            }
          ],
          margin: [0, 4, 0, 4]
        }))
      }
    ]
  };
};

export const createSelectedClustersSection = (clusters: string[], descriptions: Record<string, string[]>) => {
  return {
    stack: [
      createGradientHeader('Your Selected 4 Career Clusters'),
      {
        margin: [20, 10, 20, 20],
        stack: clusters.slice(0, 4).map((cluster, index) => ({
          stack: [
            {
              columns: [
                {
                  width: 30,
                  stack: [
                    {
                      canvas: [
                        {
                          type: 'circle',
                          x: 15,
                          y: 15,
                          r: 15,
                          fillOpacity: 1,
                          color: '#3498db'
                        },
                        {
                          type: 'circle',
                          x: 15,
                          y: 15,
                          r: 12,
                          fillOpacity: 1,
                          color: 'white'
                        },
                        {
                          type: 'polyline',
                          lineWidth: 2,
                          closePath: true,
                          color: '#3498db',
                          points: [
                            { x: 10, y: 15 },
                            { x: 15, y: 20 },
                            { x: 22, y: 10 }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  width: '*',
                  text: cluster,
                  fontSize: 14,
                  bold: true,
                  margin: [0, 5, 0, 0]
                }
              ],
              margin: [0, 0, 0, 5]
            },
            {
              ul: descriptions[cluster.toLowerCase()] || [
                'Professionals in this cluster work with advanced tools and technology.',
                'You would analyze, research, and solve complex problems.',
                'This cluster requires strong analytical and technical skills.',
                'You would need to stay current with advancing technology and methods.'
              ],
              margin: [30, 0, 0, 15]
            }
          ],
          margin: [0, 10, 0, 10]
        }))
      }
    ]
  };
};

export const createCareerPathSection = (careers: any[]) => {
  return {
    stack: [
      createGradientHeader('Your Career Paths'),
      {
        text: 'Recommendations for you',
        fontSize: 13,
        bold: true,
        margin: [20, 10, 20, 5]
      },
      {
        margin: [20, 0, 20, 0],
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 'auto', 'auto'],
          body: [
            [
              { text: 'Career Paths', style: 'tableHeader', fillColor: '#ecf0f1' },
              { text: 'Psy. Analysis', style: 'tableHeader', fillColor: '#ecf0f1' },
              { text: 'Skill and Abilities', style: 'tableHeader', fillColor: '#ecf0f1' },
              { text: 'Comment', style: 'tableHeader', fillColor: '#ecf0f1' }
            ],
            ...careers.map((career, index) => [
              {
                stack: [
                  { text: index + 1, bold: true },
                  { text: career.title, bold: true },
                  { text: career.subtitle, italics: true }
                ]
              },
              { text: career.psyAnalysis },
              { text: career.skillAbilities },
              { text: career.comment }
            ])
          ]
        },
        layout: {
          fillColor: function(rowIndex) {
            return (rowIndex % 2 === 0) ? '#f8f9fa' : null;
          },
          hLineWidth: function(i, node) {
            return (i === 0 || i === node.table.body.length) ? 1 : 0.5;
          },
          vLineWidth: function(i, node) {
            return 0.5;
          },
          hLineColor: function(i, node) {
            return (i === 0 || i === node.table.body.length) ? '#bfbfbf' : '#e0e0e0';
          },
          vLineColor: function() {
            return '#e0e0e0';
          },
          paddingLeft: function(i) { return 5; },
          paddingRight: function(i) { return 5; },
          paddingTop: function(i) { return 5; },
          paddingBottom: function(i) { return 5; }
        }
      }
    ]
  };
};

export const createSummarySheetSection = (data: any) => {
  return {
    stack: [
      createGradientHeader('Summary Sheet'),
      {
        margin: [20, 10, 20, 10],
        text: 'Our career assessment is based on the concept of correlation theory and various psychometric and statistical models.',
        fontSize: 11,
        italics: true
      },
      {
        margin: [20, 10, 20, 20],
        table: {
          widths: ['40%', '60%'],
          body: [
            [
              { text: 'Career Personality', bold: true, fillColor: '#f5f5f5' },
              { text: data.personalityType || 'Not determined' }
            ],
            [
              { text: 'Career Interest', bold: true, fillColor: '#f5f5f5' },
              { text: data.careerInterest || 'Not determined' }
            ],
            [
              { text: 'Career Motivator', bold: true, fillColor: '#f5f5f5' },
              { text: data.careerMotivator || 'Not determined' }
            ],
            [
              { text: 'Learning Style', bold: true, fillColor: '#f5f5f5' },
              { text: data.learningStyle || 'Not determined' }
            ],
            [
              { text: 'Skills & Abilities', bold: true, fillColor: '#f5f5f5' },
              { text: data.skillsAbilities || 'Not determined' }
            ],
            [
              { text: 'Selected Clusters', bold: true, fillColor: '#f5f5f5' },
              { text: data.selectedClusters || 'Not determined' }
            ]
          ]
        },
        layout: {
          hLineWidth: function(i, node) {
            return 0.5;
          },
          vLineWidth: function(i, node) {
            return 0.5;
          },
          hLineColor: function() {
            return '#e0e0e0';
          },
          vLineColor: function() {
            return '#e0e0e0';
          },
          paddingLeft: function(i) { return 5; },
          paddingRight: function(i) { return 5; },
          paddingTop: function(i) { return 5; },
          paddingBottom: function(i) { return 5; }
        }
      }
    ]
  };
};

// Generate personality traits from the assessment data
export const generatePersonalityTraits = (
  introvertScore: number,
  extrovertScore: number,
  sensingScore: number,
  intuitiveScore: number,
  thinkingScore: number,
  feelingScore: number,
  judgingScore: number,
  perceivingScore: number
) => {
  const traits = [];
  
  // Dimension 1: Introvert vs Extrovert
  if (introvertScore > extrovertScore) {
    traits.push(
      'You mostly get your energy from dealing with ideas, pictures, memories and reactions which are part of your imaginative world.',
      'You are quiet, reserved and like to spend your time alone.',
      'Your primary mode of living is focused internally.',
      'You are passionate but not usually aggressive.',
      'You are a good listener.',
      'You are more of an inside-out person.'
    );
  } else {
    traits.push(
      'You get your energy from action and the external world.',
      'You enjoy having a lot of people around you.',
      'You think by talking and interacting with others.',
      'You are more practical than imaginative.',
      'You are expressive and vocal about your opinions.',
      'You are more of an outside-in person.'
    );
  }
  
  // Dimension 2: Sensing vs Intuitive
  if (sensingScore > intuitiveScore) {
    traits.push(
      'You mostly collect and trust the information that is presented in a detailed and sequential manner.',
      'You think more about the present and learn from the past.',
      'You like to see the practical use of things and learn best from practice.',
      'You notice facts and remember details that are important to you.',
      'You solve problems by working through facts until you understand the problem.',
      'You create meaning from conscious thought and learn by observation.'
    );
  } else {
    traits.push(
      'You collect information through impressions and focus on the big picture.',
      'You think more about the future and possibilities.',
      'You like theories and concepts, and learn best through exploration.',
      'You notice patterns and connections between facts.',
      'You solve problems by leaping between different ideas and possibilities.',
      'You create meaning through intuition and learn by conceptual insight.'
    );
  }
  
  // Dimension 3: Thinking vs Feeling
  if (thinkingScore > feelingScore) {
    traits.push(
      'You seem to make decisions based on logic rather than the circumstances.',
      'You believe telling truth is more important than being tactful.',
      'You seem to look for logical explanations or solutions to almost everything.',
      'You can often be seen as very task-oriented, uncaring, or indifferent.',
      'You are ruled by your head instead of your heart.',
      'You are a critical thinker and oriented toward problem solving.'
    );
  } else {
    traits.push(
      'You make decisions based on your values and how your actions affect others.',
      'You value harmony and forgiveness over truth and justice.',
      'You are empathetic and compassionate toward others.',
      'You can often be seen as too emotional or sensitive.',
      'You are ruled by your heart instead of your head.',
      'You are oriented toward people and relationships.'
    );
  }
  
  // Dimension 4: Judging vs Perceiving
  if (judgingScore > perceivingScore) {
    traits.push(
      'You prefer a planned or orderly way of life.',
      'You like to have things well-organized.',
      'Your productivity increases when working with structure.',
      'You are self-disciplined and decisive.',
      'You like to have things decided and planned before doing any task.',
      'You seek closure and enjoy completing tasks.',
      'Mostly, you think sequentially.'
    );
  } else {
    traits.push(
      'You prefer a flexible and spontaneous way of life.',
      'You prefer to keep your options open rather than having things firmly decided.',
      'Your productivity increases when approaching deadlines.',
      'You are curious and adaptable.',
      'You enjoy starting tasks but may have trouble finishing them.',
      'You resist closure to obtain more information.',
      'Mostly, you think in a non-linear fashion.'
    );
  }
  
  return traits;
};

export const generateCareerInfo = (career: string): string[] => {
  const careerInfo: Record<string, string[]> = {
    'information technology': [
      'Information technology professionals work with Computer hardware, software or network systems.',
      'You might design new computer equipment or work on a new computer game.',
      'Some professionals provide support and manage software or hardware.',
      'You might Write, update, and maintain computer programs or software packages'
    ],
    'science, maths and engineering': [
      'Science, math and engineering, professionals do scientific research in laboratories or the field.',
      'You will plan or design products and systems.',
      'You will do research and read blueprints.',
      'You might support scientists, mathematicians, or engineers in their work.'
    ],
    'manufacturing': [
      'Manufacturing professionals work with products and equipment.',
      'You might design a new product, decide how the product will be made, or make the product.',
      'You might work on cars, computers, appliances, airplanes, or electronic devices.',
      'Other manufacturing workers install or repair products.'
    ],
    'accounts and finance': [
      'Finance and Accounts professionals keep track of money.',
      'You might work in financial planning, banking, or insurance.',
      'You could maintain financial records or give advice to business executives on how to operate their business.'
    ],
    'logistics and transportation': [
      'Logistics professionals manage the flow of goods and services.',
      'You might coordinate transportation, inventory, purchasing, or warehousing.',
      'You could optimize operations and manage supply chains.',
      'Some professionals work in air traffic control, shipping, or freight management.'
    ],
    'bio science and research': [
      'Bio Science professionals conduct research on living organisms.',
      'You might study diseases, develop new medicines, or improve agricultural yields.',
      'You could work in laboratories, research institutions, or pharmaceutical companies.',
      'Some professionals work in environmental conservation or biotechnology.'
    ],
    'health science': [
      'Health Science professionals provide healthcare services to patients.',
      'You might diagnose and treat illnesses, perform medical procedures, or provide preventive care.',
      'You could work in hospitals, clinics, or private practices.',
      'Some professionals work in medical research, education, or administration.'
    ]
  };
  
  const lowerCaseCareer = career.toLowerCase();
  return careerInfo[lowerCaseCareer] || [
    `${career} professionals work with specialized tools and techniques in their field.`,
    'You might apply your analytical and technical skills to solve complex problems.',
    'You could work in various settings such as offices, laboratories, or in the field.',
    'This career path offers opportunities for specialization and continuous learning.'
  ];
};

export const generateStrengthsBasedOnPersonality = (
  introvertScore: number,
  extrovertScore: number,
  sensingScore: number,
  intuitiveScore: number,
  thinkingScore: number,
  feelingScore: number,
  judgingScore: number,
  perceivingScore: number
): string[] => {
  const strengths = [];
  
  // Add strengths based on personality dimensions
  if (introvertScore > extrovertScore) {
    strengths.push('Strong-willed and dutiful');
  } else {
    strengths.push('Energetic and outgoing');
  }
  
  if (sensingScore > intuitiveScore) {
    strengths.push('Calm and practical');
  } else {
    strengths.push('Imaginative and insightful');
  }
  
  if (thinkingScore > feelingScore) {
    strengths.push('Honest and direct');
  } else {
    strengths.push('Empathetic and compassionate');
  }
  
  if (judgingScore > perceivingScore) {
    strengths.push('Very responsible');
    strengths.push('Create and enforce order');
  } else {
    strengths.push('Flexible and adaptable');
    strengths.push('Open to new experiences');
  }
  
  return strengths;
};

export const generateMotivatorAnalysis = (motivators: { name: string; value: number }[]): Record<string, string[]> => {
  const motivatorDescriptions: Record<string, string[]> = {
    'Social Service': [
      'You like to do work which has some social responsibility.',
      'You like to do work which impacts the world.',
      'You like to receive social recognition for the work that you do.'
    ],
    'Independence': [
      'You enjoy working independently.',
      'You dislike too much supervision.',
      'You dislike group activities.'
    ],
    'Continuous Learning': [
      'You like to have consistent professional growth in your field of work.',
      'You like to work in an environment where there is need to update your knowledge at regular intervals.',
      'You like it when your work achievements are evaluated at regular intervals.'
    ],
    'Structured work environment': [
      'You prefer working in organized and predictable environments.',
      'You like having clear guidelines and procedures.',
      'You appreciate stability and consistency in your work.'
    ],
    'Adventure': [
      'You enjoy taking risks and facing challenges.',
      'You prefer dynamic and changing work environments.',
      'You are energized by new experiences and opportunities.'
    ],
    'High Paced Environment': [
      'You thrive in fast-paced work settings.',
      'You enjoy meeting tight deadlines and managing pressure.',
      'You are motivated by constant activity and quick decision-making.'
    ],
    'Creativity': [
      'You value expressing your original ideas.',
      'You enjoy work that allows for innovation and imagination.',
      'You are motivated by opportunities to create something new.'
    ]
  };
  
  const result: Record<string, string[]> = {};
  
  motivators.forEach(motivator => {
    if (motivator.value >= 80) {
      result[motivator.name + '-HIGH'] = motivatorDescriptions[motivator.name] || [
        'You are highly motivated by this value in your work environment.',
        'This is a critical factor in your career satisfaction.',
        'You actively seek opportunities that align with this value.'
      ];
    } else if (motivator.value >= 50) {
      result[motivator.name + '-MEDIUM'] = motivatorDescriptions[motivator.name] || [
        'You are moderately motivated by this value in your work environment.',
        'This is an important but not essential factor in your career satisfaction.',
        'You appreciate when this value is present in your work.'
      ];
    } else {
      result[motivator.name + '-LOW'] = motivatorDescriptions[motivator.name] || [
        'This value has minimal influence on your work motivation.',
        'You can work effectively in environments where this value is not emphasized.',
        'Other factors are more important for your career satisfaction.'
      ];
    }
  });
  
  return result;
};

export const generateLearningStyleAnalysis = (style: string): string[] => {
  const styleDescriptions: Record<string, string[]> = {
    'Read & Write Learning': [
      'Reading and writing learners prefer to take in the information displayed as words.',
      'These learners strongly prefer primarily text-based learning materials.',
      'Emphasis is based on text-based input and output, i.e. reading and writing in all its forms.',
      'People who prefer this modality love to work using PowerPoint, internet, lists, dictionaries and words.'
    ],
    'Auditory learning': [
      'Auditory learners learn best through listening and speaking.',
      'They benefit from lectures, discussions, and verbal explanations.',
      'They often talk through their ideas and use their voice to understand concepts.',
      'These learners prefer to have things explained to them verbally rather than reading written instructions.'
    ],
    'Visual Learning': [
      'Visual learners learn best by seeing information presented visually.',
      'They benefit from charts, graphs, maps, diagrams, and illustrations.',
      'They typically have strong spatial awareness and visual memory.',
      'These learners often use color, highlight text, and create visual representations of information.'
    ],
    'Kinesthetic Learning': [
      'Kinesthetic learners learn best through hands-on activities and physical movement.',
      'They benefit from experiments, practical exercises, and role-playing.',
      'They typically have good coordination and learn by doing rather than observing.',
      'These learners often struggle with sitting still for long periods and prefer to be actively engaged.'
    ]
  };
  
  return styleDescriptions[style] || [
    'You have a unique learning style that combines multiple approaches.',
    'You are adaptable in how you process and retain information.',
    'You benefit from diverse teaching methods and learning environments.',
    'Your flexible learning approach allows you to succeed in various educational settings.'
  ];
};

export const generateLearningStyleStrategies = (style: string): string[] => {
  const strategyDescriptions: Record<string, string[]> = {
    'Read & Write Learning': [
      'Re-write your notes after class.',
      'Use coloured pens and highlighters to focus on key ideas.',
      'Write notes to yourself in the margins.',
      'Write out key concepts and ideas.',
      'Compose short explanations for diagrams, charts and graphs.',
      'Write out instructions for each step of a procedure or math problem.',
      'Print out your notes for later review.',
      'Post note cards/post-its in visible places. (when doing dishes, on the bottom of the remote etc).',
      'Vocabulary mnemonics.',
      'Organize your notes/key concepts into a powerpoint presentation.',
      'Compare your notes with others.',
      'Repetitive writing.',
      'Hangman game.'
    ],
    'Auditory learning': [
      'Record lectures and listen to them again.',
      'Discuss topics with friends or in study groups.',
      'Explain concepts out loud to yourself or others.',
      'Use rhymes, songs, or mnemonics to remember information.',
      'Read your notes out loud when studying.',
      'Participate in class discussions and ask questions.',
      'Use audiobooks or text-to-speech software.',
      'Create verbal analogies to remember concepts.',
      'Study in quiet environments to avoid auditory distractions.'
    ],
    'Visual Learning': [
      'Use color-coding and highlighting in your notes.',
      'Create mind maps, diagrams, and flowcharts.',
      'Watch videos or demonstrations of concepts.',
      'Visualize information in your mind.',
      'Use flashcards with images or symbols.',
      'Sit near the front of the class to see presentations clearly.',
      'Convert text information into charts or graphs.',
      'Use visual metaphors and analogies.',
      'Take notes using different colors for different types of information.'
    ],
    'Kinesthetic Learning': [
      'Take frequent breaks while studying to move around.',
      'Use role-playing to understand concepts.',
      'Create models or physical representations of ideas.',
      'Study while walking or moving.',
      'Use gestures to remember information.',
      'Participate in labs, field trips, and hands-on activities.',
      'Rewrite notes or draw diagrams while standing.',
      'Use physical objects as learning aids when possible.',
      'Apply concepts to real-world situations through practical exercises.'
    ]
  };
  
  return strategyDescriptions[style] || [
    'Use a variety of study methods to engage different learning channels.',
    'Experiment with different techniques to find what works best for you.',
    'Combine visual, auditory, reading/writing, and kinesthetic approaches when studying.',
    'Adapt your learning strategies based on the specific subject or material.',
    'Create multi-sensory learning experiences to enhance understanding and retention.'
  ];
};

// New function specific for the ReportPDFGenerator component
export const generateCareerReportContent = async (reportData: any, userName: string) => {
  try {
    // First, check if we can fetch enhanced content from the AI function
    let enhancedContent = null;
    
    // Try to fetch enhanced content from our Supabase function if we have all the necessary data
    if (reportData.scores && reportData.userName) {
      try {
        const { data, error } = await supabase.functions.invoke('generate-ai-content', {
          body: {
            contentType: 'executiveSummary',
            assessmentData: {
              userName: reportData.userName,
              completedAt: reportData.completedAt,
              scores: reportData.scores,
              strengthAreas: reportData.strengthAreas || [],
              developmentAreas: reportData.developmentAreas || [],
              topCareer: reportData.scores.careerRecommendations?.[0] || null
            }
          }
        });
        
        if (error) {
          console.error('Error fetching AI content:', error);
        } else {
          enhancedContent = data;
          console.log('Successfully fetched AI content:', data);
        }
      } catch (err) {
        console.error('Failed to fetch AI content:', err);
      }
    }
    
    // Calculate personality dimensions based on scores
    const personalityScore = reportData.scores.personality || 0;
    const aptitudeScore = reportData.scores.aptitude || 0;
    const interestScore = reportData.scores.interest || 0;
    
    // Generate values for personality dimensions
    const introvertScore = personalityScore < 60 ? Math.round(100 - personalityScore * 0.8) : 14;
    const extrovertScore = personalityScore > 60 ? Math.round(personalityScore * 0.8) : 14;
    const sensingScore = aptitudeScore > 65 ? Math.round(aptitudeScore * 0.9) : 14;
    const intuitiveScore = aptitudeScore < 65 ? Math.round(100 - aptitudeScore * 0.9) : 14;
    const thinkingScore = aptitudeScore > interestScore ? Math.round(70 + Math.random() * 10) : 29;
    const feelingScore = aptitudeScore < interestScore ? Math.round(70 + Math.random() * 10) : 29;
    const judgingScore = personalityScore > 60 ? Math.round(55 + Math.random() * 10) : 43;
    const perceivingScore = personalityScore < 60 ? Math.round(55 + Math.random() * 10) : 43;
    
    // Generate personality type
    const personalityType = 
      (introvertScore > extrovertScore ? "Introvert" : "Extrovert") + ":" +
      (sensingScore > intuitiveScore ? "Sensing" : "iNtuitive") + ":" +
      (thinkingScore > feelingScore ? "Thinking" : "Feeling") + ":" +
      (judgingScore > perceivingScore ? "Judging" : "Perceiving");
    
    // Generate career interest types
    const interestTypes = [
      { name: 'Investigative', value: Math.round(aptitudeScore * 1.2) },
      { name: 'Conventional', value: Math.round(personalityScore * 0.6) },
      { name: 'Realistic', value: Math.round(aptitudeScore * 0.6) },
      { name: 'Enterprising', value: Math.round(personalityScore * 0.4) },
      { name: 'Artistic', value: Math.round(interestScore * 0.3) },
      { name: 'Social', value: Math.round(personalityScore * 0.15) }
    ].sort((a, b) => b.value - a.value);
    
    // Generate career motivator types
    const motivatorTypes = [
      { name: 'Independence', value: Math.min(100, Math.round((100 - personalityScore) * 1.1)) },
      { name: 'Continuous Learning', value: Math.min(100, Math.round(aptitudeScore * 1.1)) },
      { name: 'Social Service', value: Math.min(100, Math.round(personalityScore * 1.1)) },
      { name: 'Structured work environment', value: Math.round(personalityScore * 0.5) },
      { name: 'Adventure', value: Math.round(interestScore * 0.5) },
      { name: 'High Paced Environment', value: Math.round(aptitudeScore * 0.3) },
      { name: 'Creativity', value: Math.round(interestScore * 0.25) }
    ].sort((a, b) => b.value - a.value);
    
    // Generate learning style types
    const learningStyles = [
      { name: 'Read & Write Learning', value: Math.round(aptitudeScore * 0.5) },
      { name: 'Auditory learning', value: Math.round(personalityScore * 0.3) },
      { name: 'Visual Learning', value: Math.round(interestScore * 0.3) },
      { name: 'Kinesthetic Learning', value: Math.round(reportData.scores.learningStyle * 0.2) }
    ].sort((a, b) => b.value - a.value);
    
    // Generate skills and abilities
    const skillsAndAbilities = {
      overall: Math.round(aptitudeScore * 0.7),
      numerical: Math.round(aptitudeScore * 0.8),
      logical: Math.round(aptitudeScore * 0.6),
      verbal: Math.round(personalityScore * 1.2 > 100 ? 100 : personalityScore * 1.2),
      clerical: Math.round(personalityScore * 0.5),
      spatial: Math.round(aptitudeScore * 0.8),
      leadership: Math.round(personalityScore * 0.6),
      social: Math.round(personalityScore * 0.8),
      mechanical: Math.round(aptitudeScore * 0.5)
    };
    
    // Generate career clusters
    const careerClusters = formatCareerClusters(aptitudeScore, personalityScore, interestScore);
    
    // Generate the top 4 career clusters with their information
    const topClusters = careerClusters.slice(0, 4).map(cluster => cluster.name);
    
    // Generate career paths from career recommendations
    const careerPaths = reportData.scores.careerRecommendations?.map((career: any, index: number) => ({
      title: career.careerTitle,
      subtitle: career.keySkills.join(', '),
      psyAnalysis: Math.random() > 0.5 ? 'Very High:' + Math.round(80 + Math.random() * 20) : 'High:' + Math.round(60 + Math.random() * 20),
      skillAbilities: Math.random() > 0.3 ? 'High:' + Math.round(60 + Math.random() * 15) : 'Average:' + Math.round(50 + Math.random() * 10),
      comment: index < 10 ? 'Top Choice' : 'Good Choice'
    })) || [];
    
    // Ensure we have at least some career paths
    if (careerPaths.length === 0) {
      careerPaths.push(
        {
          title: 'Information Technology',
          subtitle: 'Software Developer, System Analyst, Network Engineer',
          psyAnalysis: 'Very High:95',
          skillAbilities: 'High:75',
          comment: 'Top Choice'
        },
        {
          title: 'Data Science & Analytics',
          subtitle: 'Data Scientist, Business Analyst, Research Analyst',
          psyAnalysis: 'Very High:92',
          skillAbilities: 'High:72',
          comment: 'Top Choice'
        },
        {
          title: 'Engineering',
          subtitle: 'Mechanical Engineer, Civil Engineer, Electrical Engineer',
          psyAnalysis: 'High:85',
          skillAbilities: 'High:70',
          comment: 'Good Choice'
        }
      );
    }
    
    // Generate personality traits
    const personalityTraits = generatePersonalityTraits(
      introvertScore, extrovertScore,
      sensingScore, intuitiveScore,
      thinkingScore, feelingScore,
      judgingScore, perceivingScore
    );
    
    // Generate strengths
    const strengths = generateStrengthsBasedOnPersonality(
      introvertScore, extrovertScore,
      sensingScore, intuitiveScore,
      thinkingScore, feelingScore,
      judgingScore, perceivingScore
    );
    
    // Generate motivator analysis
    const motivatorAnalysis = generateMotivatorAnalysis(motivatorTypes);
    
    // Generate learning style analysis and strategies
    const learningStyleAnalysis = generateLearningStyleAnalysis(learningStyles[0].name);
    const learningStyleStrategies = generateLearningStyleStrategies(learningStyles[0].name);
    
    // Generate career cluster descriptions
    const clusterDescriptions: Record<string, string[]> = {};
    topClusters.forEach(cluster => {
      clusterDescriptions[cluster.toLowerCase()] = generateCareerInfo(cluster);
    });
    
    // Generate summary sheet data
    const summarySheetData = {
      personalityType,
      careerInterest: interestTypes.slice(0, 3).map(t => t.name).join(' + '),
      careerMotivator: motivatorTypes.slice(0, 3).map(t => t.name).join(' + '),
      learningStyle: learningStyles[0].name,
      skillsAbilities: `Numerical Ability[${skillsAndAbilities.numerical}%] +Logical Ability[${skillsAndAbilities.logical}%] +Verbal Ability[${skillsAndAbilities.verbal}%] Clerical and Organizing Skills[${skillsAndAbilities.clerical}%] +Spatial & Visualization Ability[${skillsAndAbilities.spatial}%] +Leadership & Decision making skills[${skillsAndAbilities.leadership}%] Social & Co-operation Skills[${skillsAndAbilities.social}%] +Mechanical Abilities[${skillsAndAbilities.mechanical}%] +`,
      selectedClusters: topClusters.join('+')
    };
    
    // Calculate current stage of planning
    const currentStage = formatCurrentStage(aptitudeScore, personalityScore);
    
    // Prepare an object with all the data for the report
    return {
      enhancedContent,
      userName,
      personalityType,
      personalityDimensions: {
        introvert: introvertScore,
        extrovert: extrovertScore,
        sensing: sensingScore,
        intuitive: intuitiveScore,
        thinking: thinkingScore,
        feeling: feelingScore,
        judging: judgingScore,
        perceiving: perceivingScore
      },
      personalityTraits,
      strengths,
      interestTypes,
      motivatorTypes,
      motivatorAnalysis,
      learningStyles,
      learningStyleAnalysis,
      learningStyleStrategies,
      skillsAndAbilities,
      careerClusters,
      topClusters,
      clusterDescriptions,
      careerPaths,
      summarySheetData,
      currentStage
    };
  } catch (error) {
    console.error('Error generating career report content:', error);
    throw new Error('Failed to generate career report content');
  }
};

// Function to format the subject recommendations based on career clusters
export const formatLearningImprovement = (style: string): string[] => {
  const strategies: Record<string, string[]> = {
    'Read & Write Learning': [
      'Re-write your notes after class.',
      'Use coloured pens and highlighters to focus on key ideas.',
      'Write notes to yourself in the margins.',
      'Write out key concepts and ideas.',
      'Compose short explanations for diagrams, charts and graphs.',
      'Write out instructions for each step of a procedure or math problem.',
      'Print out your notes for later review.',
      'Post note cards/post-its in visible places.',
      'Vocabulary mnemonics.',
      'Organize your notes/key concepts into a powerpoint presentation.',
      'Compare your notes with others.',
      'Repetitive writing.',
      'Hangman game.'
    ],
    'Auditory learning': [
      'Record lectures and listen to them again.',
      'Discuss topics with friends or in study groups.',
      'Explain concepts out loud to yourself.',
      'Use rhymes or songs to remember information.',
      'Read your notes aloud when studying.',
      'Participate actively in class discussions.',
      'Listen to educational podcasts related to your subjects.',
      'Create verbal analogies to explain complex concepts.',
      'Join study groups where you can discuss material with others.'
    ],
    'Visual Learning': [
      'Use charts, maps, diagrams, and videos to visualize information.',
      'Highlight text in different colors to organize information.',
      'Replace words with symbols and initials where possible.',
      'Draw mind maps to connect concepts and ideas.',
      'Use flashcards with drawings and diagrams.',
      'Watch videos related to the topics youre studying.',
      'Create visual timelines for historical events or processes.',
      'Use graphic organizers to arrange information visually.',
      'Sketch out concepts rather than writing them in words.'
    ],
    'Kinesthetic Learning': [
      'Take frequent breaks to move around while studying.',
      'Use physical objects or props to explain concepts.',
      'Role-play scenarios to understand complex ideas.',
      'Create models or physical representations of what youre learning.',
      'Take notes while standing or pacing.',
      'Use finger tracing when reading or looking at diagrams.',
      'Engage in laboratory experiments and hands-on activities.',
      'Go on field trips related to your subjects.',
      'Create games that involve physical movement to reinforce learning.'
    ]
  };
  
  return strategies[style] || [
    'Explore multiple learning methods to find what works best for you.',
    'Combine different approaches to reinforce your understanding.',
    'Take regular breaks to maintain focus and attention.',
    'Create connections between new information and existing knowledge.',
    'Teach concepts to others to solidify your understanding.',
    'Practice active recall rather than passive re-reading.',
    'Use spaced repetition to improve long-term retention.',
    'Set specific learning goals for each study session.',
    'Review material regularly rather than cramming before tests.'
  ];
};

