
import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDown } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import * as pdfUtils from '@/utils/pdfFormatting';
import { supabase } from '@/integrations/supabase/client';

interface ReportPDFGeneratorProps {
  reportId: string;
  userName: string;
  scores: any;
  responses: Record<string, string> | null;
  strengthAreas: string[];
  developmentAreas: string[];
}

export const generatePDF = async (
  reportId: string,
  userInfo: any,
  scores: any,
  responses: Record<string, any> | null,
  strengthAreas: string[],
  developmentAreas: string[],
  isJuniorAssessment: boolean = true,
  enhancedContent: any = null
) => {
  try {
    console.log('Generating PDF for report:', reportId);
    console.log('User info:', userInfo);
    console.log('Scores:', scores);
    
    // Create new PDF document
    const doc = new jsPDF();
    let currentPage = 1;
    
    // Store original page size
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Helper function to get the Y position from a result that might be a number or {lastY: number}
    const getYPosition = (result: any): number => {
      if (typeof result === 'number') {
        return result;
      }
      if (result && typeof result.lastY === 'number') {
        return result.lastY;
      }
      // Default value if result is unexpected
      console.warn('Unexpected Y position result:', result);
      return 20;
    };
    
    // Helper function to add a new page
    const addNewPage = () => {
      doc.addPage();
      currentPage++;
      
      // Add header and footer to new page
      const headerEndY = pdfUtils.addHeaderWithLogo(doc);
      pdfUtils.addPageFooter(doc, userInfo.name, currentPage);
      
      // Return starting Y position for content
      return getYPosition(headerEndY);
    };
    
    // Start building the report
    // Add header
    let yPosition = getYPosition(pdfUtils.addHeaderWithLogo(doc));
    
    // Add report title
    yPosition = getYPosition(pdfUtils.addReportTitle(doc));
    
    // Add user info
    yPosition = getYPosition(pdfUtils.addUserInfo(doc, userInfo));
    
    // Add disclaimer
    yPosition = getYPosition(pdfUtils.addDisclaimer(doc, yPosition));
    
    // Add page footer
    pdfUtils.addPageFooter(doc, userInfo.name, currentPage);
    
    // Extract data from scores to use for the report sections
    const analysisInsights = scores?.analysisInsights || {};
    const specificAptitudes = analysisInsights?.specificAptitudes || {};
    const personalityTraits = analysisInsights?.personalityTraits || {};
    const careerRecommendations = scores?.careerRecommendations || [];
    
    // Add section title for profiling
    yPosition = getYPosition(pdfUtils.addSectionTitle(doc, yPosition, 'Career Planning Profiling'));
    
    // Determine career planning stage based on scores
    let careerStage = 'Exploratory';
    if (specificAptitudes.leadership > 70 && specificAptitudes.analytical > 65) {
      careerStage = 'Focused';
    } else if (specificAptitudes.social > 70 || specificAptitudes.creative > 70) {
      careerStage = 'Growth-Oriented';
    } else if (specificAptitudes.technical > 70) {
      careerStage = 'Technical Specialist';
    }
    
    // Prepare profiling data based on user's scores
    const profilingData = {
      currentStage: careerStage,
      description: enhancedContent?.metadata?.careerDescription || 
        `Based on your assessment results, you are at the ${careerStage} stage in career planning. Your responses indicate specific strengths that can guide your career decisions.`,
      riskInvolved: enhancedContent?.metadata?.careerRisks || 
        'Potential career misalignment, uncertainty about path progression, skills-career mismatch',
      actionPlan: enhancedContent?.metadata?.careerActionPlan || 
        `Focus on developing your ${developmentAreas.join(', ')} while leveraging your strengths in ${strengthAreas.join(', ')}`
    };
    
    try {
      const profilingEndY = pdfUtils.addProfilingSection(doc, yPosition, profilingData);
      yPosition = getYPosition(profilingEndY) + 10;
    } catch (error) {
      console.error('Error adding profiling section:', error);
      // Continue with next section
      yPosition += 10;
    }
    
    // Check if we need to add a new page
    if (yPosition > pageHeight - 40) {
      yPosition = addNewPage();
    }
    
    // Add section title for personality
    yPosition = getYPosition(pdfUtils.addSectionTitle(doc, yPosition, 'Career Personality'));
    
    // Determine personality type based on scores
    const personalityType = enhancedContent?.metadata?.personalityType || 
      `${personalityTraits.extroverted ? 'Extrovert' : 'Introvert'}:${analysisInsights.aptitudeStyle === 'analytical' ? 'Sensing' : 'Intuitive'}:${personalityTraits.peopleOriented ? 'Feeling' : 'Thinking'}:${personalityTraits.structured ? 'Judging' : 'Perceiving'}`;
    
    // Prepare personality data with percentages based on user's scores
    const personalityData = {
      introvertExtrovert: { 
        introvert: personalityTraits.extroverted ? 30 : 70, 
        extrovert: personalityTraits.extroverted ? 70 : 30 
      },
      sensingIntuitive: { 
        sensing: analysisInsights.aptitudeStyle === 'analytical' ? 75 : 25, 
        intuitive: analysisInsights.aptitudeStyle === 'analytical' ? 25 : 75 
      },
      thinkingFeeling: { 
        thinking: personalityTraits.peopleOriented ? 40 : 60, 
        feeling: personalityTraits.peopleOriented ? 60 : 40 
      },
      judgingPerceiving: { 
        judging: personalityTraits.structured ? 65 : 35, 
        perceiving: personalityTraits.structured ? 35 : 65 
      }
    };
    
    try {
      const personalityChartEndY = pdfUtils.addPersonalityTypeChart(doc, yPosition, personalityData, personalityType);
      yPosition = getYPosition(personalityChartEndY) + 10;
    } catch (error) {
      console.error('Error adding personality chart:', error);
      // Continue with next section
      yPosition += 10;
    }
    
    // Check if we need to add a new page
    if (yPosition > pageHeight - 40) {
      yPosition = addNewPage();
    }
    
    // Customize personality analysis descriptions based on personality traits
    const personalityAnalysisData = {
      focusEnergy: personalityTraits.extroverted ? [
        'You thrive on external stimulation and interaction with others.',
        'You enjoy collaborative work and social environments.'
      ] : [
        'You get your energy from reflection and internal processing.',
        'You prefer quiet environments and deep concentration.'
      ],
      processInfo: analysisInsights.aptitudeStyle === 'analytical' ? [
        'You collect and trust information that is detailed and sequential.',
        'You focus on facts and practical applications.'
      ] : [
        'You see patterns and connections between concepts.',
        'You value innovation and theoretical possibilities.'
      ],
      makeDecisions: personalityTraits.peopleOriented ? [
        'You make decisions based on values and how they affect people.',
        'You consider the human element in complex situations.'
      ] : [
        'You make decisions based on logic and objective analysis.',
        'You value consistency and fairness in decision-making.'
      ],
      planWork: personalityTraits.structured ? [
        'You prefer a planned and organized approach to work.',
        'You value structure, schedules, and clear expectations.'
      ] : [
        'You adapt well to changing circumstances and remain flexible.',
        'You prefer to keep options open and adjust as needed.'
      ],
      strengths: [
        ...strengthAreas.slice(0, 3)
      ]
    };
    
    try {
      const personalityAnalysisEndY = pdfUtils.addPersonalityAnalysis(doc, yPosition, personalityAnalysisData);
      yPosition = getYPosition(personalityAnalysisEndY) + 10;
    } catch (error) {
      console.error('Error adding personality analysis:', error);
      // Continue with next section
      yPosition += 10;
    }
    
    // Add new page for Interest section
    yPosition = addNewPage();
    
    // Add section title for interest
    yPosition = getYPosition(pdfUtils.addSectionTitle(doc, yPosition, 'Career Interest'));
    
    // Generate interest data based on scores
    const calculateInterestScore = (category: string, baseScore: number) => {
      // Scale the score to be between 0-100
      return Math.min(100, Math.max(0, baseScore));
    };
    
    // Create interest profile based on assessment results
    const interestData = [
      { 
        name: 'Investigative', 
        value: calculateInterestScore('investigative', specificAptitudes.analytical || 50) 
      },
      { 
        name: 'Conventional', 
        value: calculateInterestScore('conventional', specificAptitudes.detail || 50) 
      },
      { 
        name: 'Realistic', 
        value: calculateInterestScore('realistic', specificAptitudes.technical || 50) 
      },
      { 
        name: 'Enterprising', 
        value: calculateInterestScore('enterprising', specificAptitudes.leadership || 50) 
      },
      { 
        name: 'Artistic', 
        value: calculateInterestScore('artistic', specificAptitudes.creative || 50) 
      },
      { 
        name: 'Social', 
        value: calculateInterestScore('social', specificAptitudes.social || 50) 
      }
    ];
    
    // Sort interest data by value in descending order
    interestData.sort((a, b) => b.value - a.value);
    
    try {
      const interestChartEndY = pdfUtils.addInterestBarChart(doc, yPosition, interestData);
      yPosition = getYPosition(interestChartEndY) + 10;
    } catch (error) {
      console.error('Error adding interest chart:', error);
      // Continue with next section
      yPosition += 10;
    }
    
    // Check if we need to add a new page
    if (yPosition > pageHeight - 40) {
      yPosition = addNewPage();
    }
    
    // Prepare interest analysis based on top interests
    const interestAnalysisData = interestData.slice(0, 2).map(interest => {
      let points: string[] = [];
      
      switch(interest.name) {
        case 'Investigative':
          points = [
            'You are analytical, intellectual, and enjoy scientific or mathematical activities.',
            'You excel in environments that require research and complex problem-solving.'
          ];
          break;
        case 'Conventional':
          points = [
            'You are detail-oriented, organized, and methodical in your approach.',
            'You thrive in structured environments with clear procedures and expectations.'
          ];
          break;
        case 'Realistic':
          points = [
            'You enjoy working with your hands and solving practical problems.',
            'You value concrete results and tangible outcomes from your work.'
          ];
          break;
        case 'Enterprising':
          points = [
            'You are persuasive, leadership-oriented, and enjoy influencing others.',
            'You thrive in competitive environments and enjoy taking initiative.'
          ];
          break;
        case 'Artistic':
          points = [
            'You are creative, expressive, and value originality in your work.',
            'You enjoy environments that allow for creative expression and innovation.'
          ];
          break;
        case 'Social':
          points = [
            'You enjoy working with and helping others through teaching, counseling, or service.',
            'You thrive in collaborative and supportive environments.'
          ];
          break;
      }
      
      return {
        title: interest.name,
        level: interest.value > 70 ? 'HIGH' : interest.value > 50 ? 'MEDIUM' : 'LOW',
        points
      };
    });
    
    try {
      const interestAnalysisEndY = pdfUtils.addInterestAnalysis(doc, yPosition, interestAnalysisData);
      yPosition = getYPosition(interestAnalysisEndY) + 10;
    } catch (error) {
      console.error('Error adding interest analysis:', error);
      // Continue with next section
      yPosition += 10;
    }
    
    // Add new page for Career Motivator section
    yPosition = addNewPage();
    
    // Add section title for motivator
    yPosition = getYPosition(pdfUtils.addSectionTitle(doc, yPosition, 'Career Motivator'));
    
    // Generate motivator data based on personality traits and interests
    const motivatorData = [
      { 
        name: 'Independence', 
        value: personalityTraits.extroverted ? 40 : 100 
      },
      { 
        name: 'Continuous Learning', 
        value: analysisInsights.interestStyle === 'curious' ? 100 : 60 
      },
      { 
        name: 'Social Service', 
        value: personalityTraits.peopleOriented ? 100 : 40 
      },
      { 
        name: 'Structured work environment', 
        value: personalityTraits.structured ? 80 : 40 
      },
      { 
        name: 'Adventure', 
        value: specificAptitudes.leadership > 70 ? 80 : 40 
      },
      { 
        name: 'High Paced Environment', 
        value: specificAptitudes.leadership > 70 ? 80 : 20 
      },
      { 
        name: 'Creativity', 
        value: specificAptitudes.creative > 70 ? 100 : 20 
      }
    ];
    
    // Sort motivator data by value in descending order
    motivatorData.sort((a, b) => b.value - a.value);
    
    try {
      const motivatorChartEndY = pdfUtils.addCareerMotivatorChart(doc, yPosition, motivatorData);
      yPosition = getYPosition(motivatorChartEndY) + 10;
    } catch (error) {
      console.error('Error adding motivator chart:', error);
      // Continue with next section
      yPosition += 10;
    }
    
    // Check if we need to add a new page
    if (yPosition > pageHeight - 40) {
      yPosition = addNewPage();
    }
    
    // Prepare motivator analysis based on top motivators
    const motivatorAnalysisData = motivatorData.slice(0, 2).map(motivator => {
      let points: string[] = [];
      
      switch(motivator.name) {
        case 'Social Service':
          points = [
            'You value work that contributes to the well-being of others and society.',
            'You find fulfillment in helping people and making a positive difference.'
          ];
          break;
        case 'Independence':
          points = [
            'You prefer work environments that allow for autonomy and self-direction.',
            'You value the freedom to make decisions and work at your own pace.'
          ];
          break;
        case 'Continuous Learning':
          points = [
            'You thrive in environments that offer ongoing growth and development.',
            'You value opportunities to expand your knowledge and skills.'
          ];
          break;
        case 'Structured work environment':
          points = [
            'You prefer clear expectations and well-defined processes.',
            'You value stability and predictability in your work environment.'
          ];
          break;
        case 'Adventure':
          points = [
            'You enjoy variety, new challenges, and dynamic work environments.',
            'You thrive when taking calculated risks and exploring new territories.'
          ];
          break;
        case 'Creativity':
          points = [
            'You value opportunities for creative expression and innovation.',
            'You thrive when able to think outside the box and implement original ideas.'
          ];
          break;
      }
      
      return {
        title: motivator.name,
        level: motivator.value > 70 ? 'HIGH' : motivator.value > 50 ? 'MEDIUM' : 'LOW',
        points
      };
    });
    
    try {
      const motivatorAnalysisEndY = pdfUtils.addMotivatorAnalysis(doc, yPosition, motivatorAnalysisData);
      yPosition = getYPosition(motivatorAnalysisEndY) + 10;
    } catch (error) {
      console.error('Error adding motivator analysis:', error);
      // Continue with next section
      yPosition += 10;
    }
    
    // Add new page for Learning Style section
    yPosition = addNewPage();
    
    // Add section title for learning style
    yPosition = getYPosition(pdfUtils.addSectionTitle(doc, yPosition, 'Learning Style'));
    
    // Determine learning style percentages based on assessment
    const learningStyleKey = analysisInsights.learningStyle || 'visual';
    const learningStyleData = [
      { 
        name: 'Read & Write Learning', 
        value: learningStyleKey === 'reading/writing' ? 38 : 15 
      },
      { 
        name: 'Auditory learning', 
        value: learningStyleKey === 'auditory' ? 38 : 15 
      },
      { 
        name: 'Visual Learning', 
        value: learningStyleKey === 'visual' ? 38 : 15 
      },
      { 
        name: 'Kinesthetic Learning', 
        value: learningStyleKey === 'kinesthetic' ? 38 : 15 
      }
    ];
    
    // Ensure values add up to 100%
    const totalValue = learningStyleData.reduce((sum, item) => sum + item.value, 0);
    learningStyleData.forEach(item => {
      item.value = Math.round((item.value / totalValue) * 100);
    });
    
    try {
      const learningStyleChartEndY = pdfUtils.addLearningStylePieChart(doc, yPosition, learningStyleData);
      yPosition = getYPosition(learningStyleChartEndY) + 10;
    } catch (error) {
      console.error('Error adding learning style chart:', error);
      // Continue with next section
      yPosition += 10;
    }
    
    // Check if we need to add a new page
    if (yPosition > pageHeight - 40) {
      yPosition = addNewPage();
    }
    
    // Prepare learning style analysis based on dominant style
    let learningStyleTitle, learningStyleDescription, learningStyleStrategies;
    
    switch(learningStyleKey) {
      case 'reading/writing':
        learningStyleTitle = 'Read/Write learning style';
        learningStyleDescription = [
          'You learn best through written information, taking notes, and reading texts.',
          'You excel when information is presented in a text-based format.'
        ];
        learningStyleStrategies = [
          'Take detailed notes during lectures and readings.',
          'Rewrite information in your own words to reinforce understanding.',
          'Use lists, dictionaries, and textbooks as primary learning resources.'
        ];
        break;
      case 'auditory':
        learningStyleTitle = 'Auditory learning style';
        learningStyleDescription = [
          'You learn best through listening, discussions, and verbal explanations.',
          'You excel when information is presented through spoken word and sound.'
        ];
        learningStyleStrategies = [
          'Record lectures and listen to them multiple times.',
          'Participate in group discussions to reinforce concepts.',
          'Explain ideas verbally to others to solidify understanding.'
        ];
        break;
      case 'visual':
        learningStyleTitle = 'Visual learning style';
        learningStyleDescription = [
          'You learn best through charts, diagrams, and visual representations.',
          'You excel when information is presented in a visual format.'
        ];
        learningStyleStrategies = [
          'Use color-coding, highlighting, and visual organizers in notes.',
          'Create diagrams or mind maps to connect concepts.',
          'Seek out videos and demonstrations when learning new skills.'
        ];
        break;
      case 'kinesthetic':
        learningStyleTitle = 'Kinesthetic learning style';
        learningStyleDescription = [
          'You learn best through hands-on activities and physical engagement.',
          'You excel when you can physically interact with the material.'
        ];
        learningStyleStrategies = [
          'Use physical movement or gestures when memorizing information.',
          'Take frequent breaks during study sessions to move around.',
          'Seek out practical applications and experiments for theoretical concepts.'
        ];
        break;
      default:
        learningStyleTitle = 'Multimodal learning style';
        learningStyleDescription = [
          'You adapt well to various learning formats and environments.',
          'You can process information effectively in multiple formats.'
        ];
        learningStyleStrategies = [
          'Use a combination of learning strategies based on the specific material.',
          'Vary your study methods to maintain engagement and interest.',
          'Identify which mode works best for different types of content.'
        ];
    }
    
    const learningStyleAnalysisData = {
      title: learningStyleTitle,
      description: learningStyleDescription,
      strategies: learningStyleStrategies
    };
    
    try {
      const learningStyleAnalysisEndY = pdfUtils.addLearningStyleAnalysis(doc, yPosition, learningStyleAnalysisData);
      yPosition = getYPosition(learningStyleAnalysisEndY) + 10;
    } catch (error) {
      console.error('Error adding learning style analysis:', error);
      // Continue with next section
      yPosition += 10;
    }
    
    // Add new page for Skills section
    yPosition = addNewPage();
    
    // Add section title for skills
    yPosition = getYPosition(pdfUtils.addSectionTitle(doc, yPosition, 'Skills and Abilities'));
    
    // Generate skills data based on assessment scores
    const getSkillLevel = (score: number) => {
      if (score >= 80) return 'Excellent';
      if (score >= 70) return 'Good';
      if (score >= 60) return 'Above Average';
      if (score >= 50) return 'Average';
      return 'Developing';
    };
    
    // Calculate overall score as average of all specific aptitudes
    const aptitudeScores = Object.values(specificAptitudes).filter(score => typeof score === 'number') as number[];
    const overallScore = aptitudeScores.length > 0 
      ? Math.round(aptitudeScores.reduce((sum, score) => sum + score, 0) / aptitudeScores.length)
      : 60;
    
    const skillsData = [
      {
        name: 'overall',
        value: overallScore,
        level: getSkillLevel(overallScore),
        description: []
      },
      {
        name: 'numerical',
        value: specificAptitudes.numerical || 60,
        level: getSkillLevel(specificAptitudes.numerical || 60),
        description: [
          `Your numerical ability is ${getSkillLevel(specificAptitudes.numerical || 60).toLowerCase()}.`,
          'This reflects your capacity to work with numbers and mathematical concepts.'
        ]
      },
      {
        name: 'logical',
        value: specificAptitudes.analytical || 60,
        level: getSkillLevel(specificAptitudes.analytical || 60),
        description: [
          `Your logical reasoning skills are ${getSkillLevel(specificAptitudes.analytical || 60).toLowerCase()}.`,
          'This reflects your ability to analyze problems and identify patterns.'
        ]
      },
      {
        name: 'verbal',
        value: specificAptitudes.verbal || 60,
        level: getSkillLevel(specificAptitudes.verbal || 60),
        description: [
          `Your verbal communication skills are ${getSkillLevel(specificAptitudes.verbal || 60).toLowerCase()}.`,
          'This reflects your ability to express ideas clearly and understand complex text.'
        ]
      }
    ];
    
    try {
      const skillsEndY = pdfUtils.addSkillBarChart(doc, yPosition, skillsData);
      yPosition = getYPosition(skillsEndY) + 10;
    } catch (error) {
      console.error('Error adding skills chart:', error);
      // Continue with next section
      yPosition += 10;
    }
    
    // Add new page for Career Clusters section
    yPosition = addNewPage();
    
    // Add section title for career clusters
    yPosition = getYPosition(pdfUtils.addSectionTitle(doc, yPosition, 'Career Clusters'));
    
    // Generate career clusters based on assessment results
    const generateClusterScore = (clusterName: string) => {
      switch(clusterName) {
        case 'Information Technology':
          return Math.round((specificAptitudes.technical || 50) * 0.4 + (specificAptitudes.analytical || 50) * 0.4 + (specificAptitudes.numerical || 50) * 0.2);
        case 'Science, Maths and Engineering':
          return Math.round((specificAptitudes.analytical || 50) * 0.5 + (specificAptitudes.numerical || 50) * 0.3 + (specificAptitudes.technical || 50) * 0.2);
        case 'Manufacturing':
          return Math.round((specificAptitudes.technical || 50) * 0.5 + (specificAptitudes.mechanical || 50) * 0.5);
        case 'Accounts and Finance':
          return Math.round((specificAptitudes.numerical || 50) * 0.5 + (specificAptitudes.analytical || 50) * 0.3 + (specificAptitudes.detail || 50) * 0.2);
        case 'Logistics and Transportation':
          return Math.round((specificAptitudes.mechanical || 50) * 0.4 + (specificAptitudes.technical || 50) * 0.3 + (specificAptitudes.detail || 50) * 0.3);
        case 'Bio Science and Research':
          return Math.round((specificAptitudes.analytical || 50) * 0.5 + (specificAptitudes.detail || 50) * 0.3 + (specificAptitudes.technical || 50) * 0.2);
        case 'Agriculture':
          return Math.round((specificAptitudes.mechanical || 50) * 0.4 + (specificAptitudes.technical || 50) * 0.3 + (specificAptitudes.analytical || 50) * 0.3);
        case 'Health Science':
          return Math.round((specificAptitudes.analytical || 50) * 0.4 + (specificAptitudes.social || 50) * 0.4 + (specificAptitudes.detail || 50) * 0.2);
        case 'Creative Arts':
          return Math.round((specificAptitudes.creative || 50) * 0.7 + (specificAptitudes.social || 50) * 0.3);
        case 'Education':
          return Math.round((specificAptitudes.social || 50) * 0.5 + (specificAptitudes.verbal || 50) * 0.3 + (specificAptitudes.leadership || 50) * 0.2);
        case 'Business Management':
          return Math.round((specificAptitudes.leadership || 50) * 0.5 + (specificAptitudes.social || 50) * 0.3 + (specificAptitudes.business || 50) * 0.2);
        case 'Media and Communication':
          return Math.round((specificAptitudes.verbal || 50) * 0.4 + (specificAptitudes.creative || 50) * 0.4 + (specificAptitudes.social || 50) * 0.2);
        default:
          return 50; // Default baseline score
      }
    };
    
    const careerClusterNames = [
      'Information Technology', 
      'Science, Maths and Engineering', 
      'Manufacturing', 
      'Accounts and Finance',
      'Logistics and Transportation', 
      'Bio Science and Research', 
      'Agriculture', 
      'Health Science',
      'Creative Arts',
      'Education',
      'Business Management',
      'Media and Communication'
    ];
    
    // Generate scores for all clusters and sort by score
    let clustersData = careerClusterNames.map(name => ({
      name,
      score: generateClusterScore(name)
    }));
    
    // Sort by score in descending order
    clustersData.sort((a, b) => b.score - a.score);
    
    // Take top 8 clusters
    clustersData = clustersData.slice(0, 8);
    
    try {
      const clustersChartEndY = pdfUtils.addCareerClusters(doc, yPosition, clustersData);
      yPosition = getYPosition(clustersChartEndY) + 10;
    } catch (error) {
      console.error('Error adding career clusters chart:', error);
      // Continue with next section
      yPosition += 10;
    }
    
    // Check if we need to add a new page
    if (yPosition > pageHeight - 40) {
      yPosition = addNewPage();
    }
    
    // Add selected career clusters (top 2)
    const selectedClustersData = clustersData.slice(0, 2).map((cluster, index) => {
      let description: string[] = [];
      
      switch(cluster.name) {
        case 'Information Technology':
          description = [
            'Information technology professionals design, develop, and manage computer systems and networks.',
            'Careers include software developer, cybersecurity analyst, database administrator, and IT consultant.',
            'This field offers high growth potential with evolving technologies.'
          ];
          break;
        case 'Science, Maths and Engineering':
          description = [
            'Science, math and engineering professionals apply technical knowledge to solve complex problems.',
            'Careers include research scientist, engineer, data analyst, and mathematician.',
            'These fields offer intellectually stimulating work with significant impact.'
          ];
          break;
        case 'Manufacturing':
          description = [
            'Manufacturing professionals oversee the production of goods through various processes.',
            'Careers include production manager, quality control specialist, and industrial engineer.',
            'This field combines technical expertise with practical application.'
          ];
          break;
        case 'Accounts and Finance':
          description = [
            'Finance professionals manage, analyze, and advise on financial matters for organizations.',
            'Careers include accountant, financial analyst, investment advisor, and financial planner.',
            'This field offers stability and opportunities across various industries.'
          ];
          break;
        case 'Creative Arts':
          description = [
            'Creative professionals use artistic talent to express ideas and create experiences.',
            'Careers include graphic designer, animator, photographer, and fine artist.',
            'This field allows for personal expression and innovative thinking.'
          ];
          break;
        case 'Education':
          description = [
            'Education professionals facilitate learning and development for students of all ages.',
            'Careers include teacher, educational administrator, curriculum developer, and counselor.',
            'This field offers the reward of making a significant impact on future generations.'
          ];
          break;
        default:
          description = [
            `Professionals in ${cluster.name} apply specialized knowledge to their field.`,
            'This career cluster offers various paths based on your specific interests and strengths.',
            'Consider researching specific roles that align with your personal values and goals.'
          ];
      }
      
      return {
        rank: index + 1,
        name: cluster.name,
        description
      };
    });
    
    try {
      const selectedClustersEndY = pdfUtils.addSelectedCareerClusters(doc, yPosition, selectedClustersData);
      yPosition = getYPosition(selectedClustersEndY) + 10;
    } catch (error) {
      console.error('Error adding selected career clusters:', error);
      // Continue with next section
      yPosition += 10;
    }
    
    // Add new page for Career Paths section
    yPosition = addNewPage();
    
    // Add section title for career paths
    yPosition = getYPosition(pdfUtils.addSectionTitle(doc, yPosition, 'Career Paths'));
    
    // Use career recommendations from assessment data if available, otherwise generate from clusters
    let careerPathsData = [];
    
    if (careerRecommendations && careerRecommendations.length > 0) {
      // Use actual career recommendations from assessment
      careerPathsData = careerRecommendations.slice(0, 2).map(career => ({
        careerTitle: career.careerTitle || career.title || "Career Path",
        category: selectedClustersData[0]?.name || "General", // Associate with top cluster
        description: career.keySkills?.join(', ') || 'Requires analytical and technical skills',
        psychAnalysis: { 
          score: career.suitabilityPercentage || career.match || 90, 
          label: 'Very High' 
        },
        skillAbilities: { 
          score: overallScore, 
          label: getSkillLevel(overallScore) 
        },
        comment: 'Top Choice'
      }));
    } else {
      // Generate generic career paths based on top clusters
      careerPathsData = selectedClustersData.map(cluster => {
        let careerTitle, description;
        
        switch(cluster.name) {
          case 'Information Technology':
            careerTitle = 'Software Developer';
            description = 'Software Engineer, Web Developer, Mobile App Developer';
            break;
          case 'Science, Maths and Engineering':
            careerTitle = 'Data Scientist';
            description = 'Data Analyst, Research Scientist, Statistician';
            break;
          case 'Accounts and Finance':
            careerTitle = 'Financial Analyst';
            description = 'Accountant, Investment Advisor, Financial Planner';
            break;
          case 'Creative Arts':
            careerTitle = 'UX/UI Designer';
            description = 'Graphic Designer, Digital Artist, Product Designer';
            break;
          case 'Education':
            careerTitle = 'Curriculum Developer';
            description = 'Teacher, Educational Consultant, Instructional Designer';
            break;
          default:
            careerTitle = `${cluster.name} Specialist`;
            description = `Professional in ${cluster.name} field with specialized expertise`;
        }
        
        return {
          careerTitle,
          category: cluster.name,
          description,
          psychAnalysis: { score: 90, label: 'Very High' },
          skillAbilities: { score: overallScore, label: getSkillLevel(overallScore) },
          comment: 'Top Choice'
        };
      });
    }
    
    try {
      const careerPathsEndY = pdfUtils.addCareerPaths(doc, yPosition, careerPathsData);
      yPosition = getYPosition(careerPathsEndY) + 10;
    } catch (error) {
      console.error('Error adding career paths:', error);
      // Continue with next section
      yPosition += 10;
    }
    
    // Check if we need to add a new page
    if (yPosition > pageHeight - 40) {
      yPosition = addNewPage();
    }
    
    // Add summary sheet
    const dominantPersonality = personalityType.split(':');
    const dominantInterests = interestData.slice(0, 2).map(i => i.name).join(' + ');
    const dominantMotivators = motivatorData.slice(0, 3).map(m => m.name).join(' + ');
    const dominantLearningStyle = learningStyleTitle;
    const dominantSkills = `Numerical Ability[${specificAptitudes.numerical || 60}%] + Logical Ability[${specificAptitudes.analytical || 60}%] + Verbal Ability[${specificAptitudes.verbal || 60}%]`;
    const selectedClusters = clustersData.slice(0, 3).map(c => c.name).join(' + ');
    
    const summaryData = {
      careerPersonality: dominantPersonality.join(' + '),
      careerInterest: dominantInterests,
      careerMotivator: dominantMotivators,
      learningStyle: dominantLearningStyle,
      skillsAbilities: dominantSkills,
      selectedClusters: selectedClusters
    };
    
    try {
      const summaryEndY = pdfUtils.addSummarySheet(doc, yPosition, summaryData);
      yPosition = getYPosition(summaryEndY) + 10;
    } catch (error) {
      console.error('Error adding summary sheet:', error);
      // Proceed to save the PDF anyway
    }
    
    // Save the PDF
    const reportName = `career_report_${reportId}.pdf`;
    doc.save(reportName);
    
    console.log('PDF generation completed successfully');
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

const ReportPDFGenerator: React.FC<ReportPDFGeneratorProps> = ({
  reportId,
  userName,
  scores,
  responses,
  strengthAreas,
  developmentAreas
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [assessmentType, setAssessmentType] = useState<string>('');
  
  useEffect(() => {
    // Fetch the assessment type if not provided in responses
    const fetchAssessmentType = async () => {
      if (responses?.assessmentType) {
        setAssessmentType(responses.assessmentType);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('user_assessments')
          .select('assessment_id')
          .eq('id', reportId)
          .single();
          
        if (data && !error) {
          setAssessmentType(data.assessment_id);
        }
      } catch (error) {
        console.error('Error fetching assessment type:', error);
      }
    };
    
    fetchAssessmentType();
  }, [reportId, responses]);
  
  const handleGeneratePDF = async () => {
    try {
      setIsGenerating(true);
      
      // Prepare user info for the PDF
      const userInfo = {
        name: userName,
        email: responses?.email || '',
        phone: responses?.phone || '',
        age: responses?.age || '',
        location: responses?.location || 'India',
        school: responses?.school || '',
        class: responses?.class || ''
      };
      
      // Determine if this is a junior assessment
      const isJuniorAssessment = assessmentType === 'career-analysis-junior' || 
                                reportId.includes('junior');
      
      // Fetch AI-enhanced content from our API
      let enhancedContent = null;
      try {
        const response = await fetch('/api/generate-ai-content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contentType: 'executiveSummary',
            assessmentData: {
              userName,
              ...userInfo,
              scores,
              completedAt: new Date().toISOString(),
              strengthAreas,
              developmentAreas
            }
          })
        });
        
        if (response.ok) {
          enhancedContent = await response.json();
          console.log("AI-enhanced content generated successfully");
        }
      } catch (aiError) {
        console.error("Could not generate AI content:", aiError);
        // Continue with standard content if AI enhancement fails
      }
      
      // Generate the PDF
      await generatePDF(
        reportId,
        userInfo,
        scores,
        responses,
        strengthAreas,
        developmentAreas,
        isJuniorAssessment,
        enhancedContent
      );
      
      // Update report_generated_at in the database
      try {
        await supabase
          .from('user_assessments')
          .update({ report_generated_at: new Date().toISOString() })
          .eq('id', reportId);
      } catch (dbError) {
        console.error('Error updating report generation time:', dbError);
        // Continue even if update fails
      }
      
      toast.success('PDF report generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF report');
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Card className="border border-border/50 rounded-lg shadow-sm mb-8">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-xl flex items-center gap-2">
          <FileDown className="h-5 w-5" />
          PDF Report Generation
        </CardTitle>
        <CardDescription>
          Generate a comprehensive PDF report with your personalized assessment results
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-center text-muted-foreground max-w-lg">
            This report includes your personality profile, career interests, skill analysis, 
            and personalized recommendations based on your unique assessment results.
          </p>
          <Button 
            onClick={handleGeneratePDF} 
            disabled={isGenerating} 
            className="w-fit"
            size="lg"
          >
            {isGenerating ? 'Generating...' : 'Generate PDF Report'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportPDFGenerator;
