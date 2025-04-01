
import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Button } from '@/components/ui/button';
import { FileDown, FileClock } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import * as pdfUtils from '@/utils/pdfFormatting';

interface UserInfo {
  name: string;
  email: string;
  phone: string;
  age: string;
  location: string;
  school?: string;
  class?: string;
}

interface ReportPDFGeneratorProps {
  reportId: string;
  userName: string;
  scores: any;
  responses: Record<string, any> | null;
  strengthAreas: string[];
  developmentAreas: string[];
  isJuniorAssessment?: boolean;
}

export const generatePDF = async (
  reportId: string,
  userInfo: UserInfo,
  scores: any,
  responses: Record<string, any> | null,
  strengthAreas: string[],
  developmentAreas: string[],
  isJuniorAssessment: boolean = false,
  enhancedContent: any = null
) => {
  try {
    // Create a new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set initial position
    let yPosition = 0;
    let pageNumber = 1;

    // Helper function to add a new page with header and footer
    const addNewPage = () => {
      doc.addPage();
      pageNumber++;
      pdfUtils.addHeaderWithLogo(doc);
      pdfUtils.addPageFooter(doc, userInfo.name, pageNumber);
      return 20; // Start y position after adding header
    };

    // Add report header and basic info on the first page
    pdfUtils.addHeaderWithLogo(doc);
    pdfUtils.addReportTitle(doc);

    // Add user info section
    const userInfoEndY = pdfUtils.addUserInfo(doc, userInfo);
    
    // Add disclaimer
    pdfUtils.addDisclaimer(doc, userInfoEndY);
    
    // Add page footer
    pdfUtils.addPageFooter(doc, userInfo.name, pageNumber);

    // Start a new page for the profiling section
    yPosition = addNewPage();

    // Add section title
    pdfUtils.addSectionTitle(doc, yPosition, "Profiling");
    yPosition += 10;

    // Add profiling section
    // Prepare profiling data based on scores
    const profilingStage = determineProfilingStage(scores);
    const profilingDescription = getProfilingDescription(profilingStage);
    
    const profilingData = {
      currentStage: profilingStage,
      description: profilingDescription,
      riskInvolved: "Career misalignment, career path misjudgment, wrong career path projections, unnecessary stress",
      actionPlan: "Explore career path > Align your abilities and interests with the best possible career path > Realistic Execution Plan > Timely Review of Action Plan"
    };
    
    const profilingEndY = pdfUtils.addProfilingSection(doc, yPosition, profilingData);

    // Check if we need to add a new page
    if (profilingEndY > doc.internal.pageSize.height - 40) {
      yPosition = addNewPage();
    } else {
      yPosition = profilingEndY + 10;
    }

    // Add section title for personality
    pdfUtils.addSectionTitle(doc, yPosition, "Career Personality");
    yPosition += 10;

    // Add personality type chart
    // Prepare personality data based on scores
    const personalityType = determinePersonalityType(scores);
    const personalityData = calculatePersonalityPercentages(scores);
    
    const personalityChartEndY = pdfUtils.addPersonalityTypeChart(doc, yPosition, personalityData, personalityType);

    // Check if we need to add a new page
    if (personalityChartEndY > doc.internal.pageSize.height - 40) {
      yPosition = addNewPage();
    } else {
      yPosition = personalityChartEndY + 10;
    }

    // Add personality analysis
    // Generate personality analysis based on calculated type
    const personalityAnalysisData = generatePersonalityAnalysis(personalityType);
    const personalityAnalysisEndY = pdfUtils.addPersonalityAnalysis(doc, yPosition, personalityAnalysisData);

    // Start a new page for interest section
    yPosition = addNewPage();

    // Add section title for interest
    pdfUtils.addSectionTitle(doc, yPosition, "Career Interest");
    yPosition += 10;

    // Add interest bar chart
    // Generate interest data based on scores
    const interestData = generateInterestData(scores);
    const interestChartEndY = pdfUtils.addInterestBarChart(doc, yPosition, interestData);

    // Check if we need to add a new page
    if (interestChartEndY > doc.internal.pageSize.height - 40) {
      yPosition = addNewPage();
    } else {
      yPosition = interestChartEndY + 10;
    }

    // Add interest analysis
    // Generate analysis based on top interests
    const interestAnalysisData = generateInterestAnalysis(interestData);
    const interestAnalysisEndY = pdfUtils.addInterestAnalysis(doc, yPosition, interestAnalysisData);

    // Start a new page for motivator section
    yPosition = addNewPage();

    // Add section title for motivator
    pdfUtils.addSectionTitle(doc, yPosition, "Career Motivator");
    yPosition += 10;

    // Add motivator chart
    // Generate motivator data based on scores and responses
    const motivatorData = generateMotivatorData(scores, responses);
    const motivatorChartEndY = pdfUtils.addCareerMotivatorChart(doc, yPosition, motivatorData);

    // Check if we need to add a new page
    if (motivatorChartEndY > doc.internal.pageSize.height - 40) {
      yPosition = addNewPage();
    } else {
      yPosition = motivatorChartEndY + 10;
    }

    // Add motivator analysis
    // Generate analysis based on top motivators
    const motivatorAnalysisData = generateMotivatorAnalysis(motivatorData);
    const motivatorAnalysisEndY = pdfUtils.addMotivatorAnalysis(doc, yPosition, motivatorAnalysisData);

    // Start a new page for learning style section
    yPosition = addNewPage();

    // Add section title for learning style
    pdfUtils.addSectionTitle(doc, yPosition, "Learning Style");
    yPosition += 10;

    // Add learning style chart
    // Generate learning style data based on scores
    const learningStyleData = generateLearningStyleData(scores);
    const learningStyleChartEndY = pdfUtils.addLearningStylePieChart(doc, yPosition, learningStyleData);

    // Check if we need to add a new page
    if (learningStyleChartEndY > doc.internal.pageSize.height - 40) {
      yPosition = addNewPage();
    } else {
      yPosition = learningStyleChartEndY + 10;
    }

    // Add learning style analysis
    // Generate analysis based on top learning style
    const learningStyleAnalysisData = generateLearningStyleAnalysis(learningStyleData);
    const learningStyleAnalysisEndY = pdfUtils.addLearningStyleAnalysis(doc, yPosition, learningStyleAnalysisData);

    // Start a new page for skills section
    yPosition = addNewPage();

    // Add section title for skills
    pdfUtils.addSectionTitle(doc, yPosition, "Skills and Abilities");
    yPosition += 10;

    // Add skills bar chart
    // Generate skills data based on scores
    const skillsData = generateSkillsData(scores);
    const skillsChartEndY = pdfUtils.addSkillBarChart(doc, yPosition, skillsData);

    // Start a new page for career clusters section
    yPosition = addNewPage();

    // Add section title for career clusters
    pdfUtils.addSectionTitle(doc, yPosition, "Career Clusters");
    yPosition += 10;

    // Add career clusters chart
    // Generate clusters data based on scores
    const clustersData = generateCareerClustersData(scores);
    const clustersChartEndY = pdfUtils.addCareerClusters(doc, yPosition, clustersData);

    // Check if we need to add a new page
    if (clustersChartEndY > doc.internal.pageSize.height - 40) {
      yPosition = addNewPage();
    } else {
      yPosition = clustersChartEndY + 10;
    }

    // Add selected career clusters
    // Extract top clusters for detailed analysis
    const selectedClustersData = generateSelectedClustersData(clustersData);
    const selectedClustersEndY = pdfUtils.addSelectedCareerClusters(doc, yPosition, selectedClustersData);

    // Start a new page for career paths section
    yPosition = addNewPage();

    // Add section title for career paths
    pdfUtils.addSectionTitle(doc, yPosition, "Career Paths");
    yPosition += 10;

    // Add career paths
    // Generate career paths based on scores and clusters
    const careerPathsData = generateCareerPathsData(scores, clustersData);
    const careerPathsEndY = pdfUtils.addCareerPaths(doc, yPosition, careerPathsData);

    // Check if we need to add a new page
    if (careerPathsEndY > doc.internal.pageSize.height - 40) {
      yPosition = addNewPage();
    } else {
      yPosition = careerPathsEndY + 10;
    }

    // Add summary sheet
    // Prepare summary data combining all previous sections
    const summaryData = {
      careerPersonality: personalityType,
      careerInterest: interestData.slice(0, 3).map(i => i.name).join(" + "),
      careerMotivator: motivatorData.slice(0, 3).map(m => m.name).join(" + "),
      learningStyle: learningStyleData[0].name,
      skillsAbilities: `Numerical Ability[${skillsData.find(s => s.name === 'numerical')?.value || 0}%] +` +
                      `Logical Ability[${skillsData.find(s => s.name === 'logical')?.value || 0}%] +` +
                      `Verbal Ability[${skillsData.find(s => s.name === 'verbal')?.value || 0}%]`,
      selectedClusters: selectedClustersData.map(c => c.name).join("+")
    };
    
    pdfUtils.addSummarySheet(doc, yPosition, summaryData);

    // Use AI-enhanced content if available
    if (enhancedContent?.content) {
      yPosition = addNewPage();
      pdfUtils.addSectionTitle(doc, yPosition, "AI-Enhanced Career Insights");
      yPosition += 10;
      
      // Split AI content into paragraphs
      const aiContent = enhancedContent.content;
      const paragraphs = aiContent.split('\n\n').filter(p => p.trim().length > 0);
      
      // Add each paragraph with proper spacing
      paragraphs.forEach(paragraph => {
        if (yPosition > doc.internal.pageSize.height - 30) {
          yPosition = addNewPage();
        }
        
        // Format the paragraph text
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        // Add text with word wrapping
        const textLines = doc.splitTextToSize(paragraph, 170);
        doc.text(textLines, 20, yPosition);
        yPosition += 6 * textLines.length;
      });
    }

    // Save the PDF with a custom name
    const currentDate = new Date().toISOString().slice(0, 10);
    const fileName = `career_report_${userInfo.name.replace(/\s+/g, '_')}_${currentDate}.pdf`;
    doc.save(fileName);
    
    return fileName;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Helper functions for data generation
const determineProfilingStage = (scores: any) => {
  const aptitude = scores?.aptitude || 0;
  const personality = scores?.personality || 0;
  const interest = scores?.interest || 0;
  
  const totalScore = aptitude + personality + interest;
  
  if (totalScore < 120) return "Ignorant";
  if (totalScore < 160) return "Confused";
  if (totalScore < 200) return "Diffused";
  if (totalScore < 240) return "Methodical";
  return "Optimized";
};

const getProfilingDescription = (stage: string) => {
  switch(stage) {
    case "Ignorant":
      return "Ignorant: You are at the ignorant stage in career planning. This means that you have very limited knowledge about career options and their alignment with your abilities, interests, and personality. This lack of awareness might lead to career decisions based only on external factors like salary or popularity. Improper career decisions at this stage can lead to prolonged stress, poor performance, and even career changes in the future.";
    case "Confused":
      return "Confused: You are at the confused stage in career planning. This means that you have awareness about various career options but are not able to decide the most suitable career for yourself. Lack of alignment between your abilities, interests, personality, and career choice can impact your motivation, job satisfaction and overall success in the long term.";
    case "Diffused":
      return "Diffused: You are at the diffused stage in career planning. We understand that you have a fair idea of your suitable career. At this stage, you have a better understanding of career options. However, you are looking for more information to understand the complete career path for yourself and an execution plan to achieve it. Lack of complete information and execution plan can adversely impact your career. Most career decisions are based on limited information.";
    case "Methodical":
      return "Methodical: You are at the methodical stage in career planning. You have clarity about your suitable career path. Your planning and execution are in the right direction. You need to continue with your plans and be consistent with the efforts. At this stage, a little more focus on execution can make all the difference.";
    case "Optimized":
      return "Optimized: You are at the optimized stage in career planning. You have complete clarity about the career options most suitable for you. Your career planning is in line with your abilities, interests, and personality. You are aware of your career plan and are ready to execute it. You are aware of the pathway to work towards your goals. You are in a perfect position to achieve your career goals. Just be consistent with your plans.";
    default:
      return "Diffused: You are at the diffused stage in career planning. We understand that you have a fair idea of your suitable career. At this stage, you have a better understanding of career options. However, you are looking for more information to understand the complete career path for yourself and an execution plan to achieve it. Lack of complete information and execution plan can adversely impact your career. Most career decisions are based on limited information";
  }
};

const determinePersonalityType = (scores: any) => {
  // Default personality type if scores are missing
  if (!scores) return "Introvert:Sensing:Thinking:Judging";
  
  const aptitude = scores.aptitude || 0;
  const personality = scores.personality || 0;
  const interest = scores.interest || 0;
  
  // Calculate each dimension
  let type = "";
  
  // Extrovert vs Introvert
  type += personality > 70 ? "Extrovert" : "Introvert";
  
  // Sensing vs Intuitive
  type += ":";
  type += aptitude > 65 ? "Sensing" : "iNtuitive";
  
  // Thinking vs Feeling
  type += ":";
  type += aptitude > interest ? "Thinking" : "Feeling";
  
  // Judging vs Perceiving
  type += ":";
  type += personality > 60 ? "Judging" : "Perceiving";
  
  return type;
};

const calculatePersonalityPercentages = (scores: any) => {
  // Default values if scores are missing
  if (!scores) {
    return {
      introvertExtrovert: { introvert: 86, extrovert: 14 },
      sensingIntuitive: { sensing: 86, intuitive: 14 },
      thinkingFeeling: { thinking: 71, feeling: 29 },
      judgingPerceiving: { judging: 57, perceiving: 43 }
    };
  }
  
  const aptitude = scores.aptitude || 0;
  const personality = scores.personality || 0;
  const interest = scores.interest || 0;
  
  // Calculate personalized strength percentages
  return {
    introvertExtrovert: {
      introvert: personality < 60 ? Math.round(100 - personality * 0.8) : 14,
      extrovert: personality > 60 ? Math.round(personality * 0.8) : 14
    },
    sensingIntuitive: {
      sensing: aptitude > 65 ? Math.round(aptitude * 0.9) : 14,
      intuitive: aptitude < 65 ? Math.round(100 - aptitude * 0.9) : 14
    },
    thinkingFeeling: {
      thinking: aptitude > interest ? Math.round(70 + Math.random() * 10) : 29,
      feeling: aptitude < interest ? Math.round(70 + Math.random() * 10) : 29
    },
    judgingPerceiving: {
      judging: personality > 60 ? Math.round(55 + Math.random() * 10) : 43,
      perceiving: personality < 60 ? Math.round(55 + Math.random() * 10) : 43
    }
  };
};

const generatePersonalityAnalysis = (personalityType: string) => {
  const traits = personalityType.split(":");
  const isIntrovert = traits[0] === "Introvert";
  const isSensing = traits[1] === "Sensing";
  const isThinking = traits[2] === "Thinking";
  const isJudging = traits[3] === "Judging";
  
  return {
    focusEnergy: isIntrovert ? [
      "You mostly get your energy from dealing with ideas, pictures, memories and reactions which are part of your imaginative world.",
      "You are quiet, reserved and like to spend your time alone.",
      "Your primary mode of living is focused internally.",
      "You are passionate but not usually aggressive.",
      "You are a good listener.",
      "You are more of an inside-out person."
    ] : [
      "You mostly get your energy from interacting with others and the world around you.",
      "You are outgoing, social, and prefer to be around people rather than alone.",
      "Your primary mode of living is focused externally.",
      "You are active, energetic, and communicate openly.",
      "You think out loud and express yourself freely.",
      "You learn by doing and engaging with the external environment."
    ],
    processInfo: isSensing ? [
      "You mostly collect and trust the information that is presented in a detailed and sequential manner.",
      "You think more about the present and learn from the past.",
      "You like to see the practical use of things and learn best from practice.",
      "You notice facts and remember details that are important to you.",
      "You solve problems by working through facts until you understand the problem.",
      "You create meaning from conscious thought and learn by observation."
    ] : [
      "You prefer to focus on the big picture rather than the details.",
      "You think about future possibilities and are imaginative.",
      "You look for patterns and connections between facts.",
      "You trust inspiration and inference, and are more interested in theories than concrete facts.",
      "You solve problems by looking at patterns and possibilities.",
      "You create meaning through perception and learn by imagining possibilities."
    ],
    makeDecisions: isThinking ? [
      "You seem to make decisions based on logic rather than the circumstances.",
      "You believe telling truth is more important than being tactful.",
      "You seem to look for logical explanations or solutions to almost everything.",
      "You can often be seen as very task-oriented, uncaring, or indifferent.",
      "You are ruled by your head instead of your heart.",
      "You are a critical thinker and oriented toward problem solving."
    ] : [
      "You make decisions based on your personal values and how your actions affect others.",
      "You strive for harmony and positive interactions.",
      "You appear warm and caring to others.",
      "You avoid conflict and take people's feelings into account.",
      "You are ruled by your heart rather than your head.",
      "You are empathetic and oriented toward helping others."
    ],
    planWork: isJudging ? [
      "You prefer a planned or orderly way of life.",
      "You like to have things well-organized.",
      "Your productivity increases when working with structure.",
      "You are self-disciplined and decisive.",
      "You like to have things decided and planned before doing any task.",
      "You seek closure and enjoy completing tasks.",
      "Mostly, you think sequentially."
    ] : [
      "You prefer to stay flexible and adaptable with your plans.",
      "You enjoy spontaneity and prefer to keep your options open.",
      "You see plans and structures as confining.",
      "You're curious and enjoy exploring options rather than making firm decisions.",
      "You're comfortable with ambiguity and changes in plans.",
      "You feel energized by last-minute pressures.",
      "Mostly, you think in a non-linear way."
    ],
    strengths: isIntrovert && isThinking && isJudging ? [
      "Strong-willed and dutiful",
      "Calm and practical",
      "Honest and direct",
      "Very responsible",
      "Create and enforce order"
    ] : isIntrovert && isThinking && !isJudging ? [
      "Independent thinker",
      "Analytical problem-solver",
      "Logical and rational",
      "Adaptable to change",
      "Values efficiency"
    ] : isIntrovert && !isThinking && isJudging ? [
      "Loyal and committed",
      "Values-oriented",
      "Empathetic listener",
      "Organized and structured",
      "Deeply caring"
    ] : isIntrovert && !isThinking && !isJudging ? [
      "Creative and imaginative",
      "Deeply passionate",
      "Highly empathetic",
      "Adaptable to others' needs",
      "Values authenticity"
    ] : !isIntrovert && isThinking && isJudging ? [
      "Natural leader",
      "Strategic planner",
      "Efficient and logical",
      "Results-oriented",
      "Decisive and direct"
    ] : !isIntrovert && isThinking && !isJudging ? [
      "Versatile problem-solver",
      "Resourceful innovator",
      "Quick-thinking",
      "Enthusiastic debater",
      "Adaptable strategist"
    ] : !isIntrovert && !isThinking && isJudging ? [
      "People-oriented organizer",
      "Reliable and supportive",
      "Natural harmonizer",
      "Values cooperation",
      "Responsible and dutiful"
    ] : [
      "Enthusiastic motivator",
      "Creative communicator",
      "Adaptable team player",
      "Spontaneous and fun-loving",
      "Empathetic connector"
    ]
  };
};

const generateInterestData = (scores: any) => {
  // Default values if scores are missing
  if (!scores) {
    return [
      { name: 'Investigative', value: 100 },
      { name: 'Conventional', value: 55 },
      { name: 'Realistic', value: 55 },
      { name: 'Enterprising', value: 33 },
      { name: 'Artistic', value: 21 },
      { name: 'Social', value: 12 }
    ];
  }
  
  const aptitude = scores.aptitude || 0;
  const personality = scores.personality || 0;
  const interest = scores.interest || 0;
  
  // Format career interest types
  return [
    { name: 'Investigative', value: Math.round(aptitude * 1.2) },
    { name: 'Conventional', value: Math.round(personality * 0.6) },
    { name: 'Realistic', value: Math.round(aptitude * 0.6) },
    { name: 'Enterprising', value: Math.round(personality * 0.4) },
    { name: 'Artistic', value: Math.round(interest * 0.3) },
    { name: 'Social', value: Math.round(personality * 0.15) }
  ].sort((a, b) => b.value - a.value);
};

const generateInterestAnalysis = (interestData: { name: string, value: number }[]) => {
  // Extract top interests
  const topInterests = interestData.slice(0, 3);
  
  const interestDescriptions: Record<string, string[]> = {
    'Investigative': [
      "You are analytical, intellectual, observant and enjoy research.",
      "You enjoy using logic and solving complex problems.",
      "You are interested in occupations that require observation, learning and investigation.",
      "You are introspective and focused on creative problem solving.",
      "You prefer working with ideas and using technology."
    ],
    'Conventional': [
      "You are efficient, careful, conforming, organized and conscientious.",
      "You are organized, detail-oriented and do well with manipulating data and numbers.",
      "You are persistent and reliable in carrying out tasks.",
      "You enjoy working with data, details and creating reports",
      "You prefer working in a structured environment.",
      "You like to work with data, and you have a numerical or clerical ability."
    ],
    'Realistic': [
      "You are active, stable and enjoy hands-on or manual activities.",
      "You prefer to work with things rather than ideas and people.",
      "You tend to communicate in a frank, direct manner and value material things.",
      "You may be uncomfortable or less adept with human relations.",
      "You value practical things that you can see and touch.",
      "You have good skills at handling tools, mechanical drawings, machines or animals."
    ],
    'Enterprising': [
      "You are energetic, ambitious, adventurous, and confident.",
      "You are skilled in leadership and speaking.",
      "You generally enjoy starting your own business, promoting ideas and managing people.",
      "You are effective at public speaking and are generally social.",
      "You like activities that requires to persuade others and leadership roles.",
      "You like the promotion of products, ideas, or services."
    ],
    'Artistic': [
      "You are creative, intuitive, sensitive, articulate and expressive.",
      "You tend to be original and independent.",
      "You rely on feelings, imagination and inspiration.",
      "You enjoy creative activities like art, drama, crafts, dance, music or creative writing.",
      "You value aesthetics and creativity.",
      "You prefer less structured environments where you can use your creativity."
    ],
    'Social': [
      "You are friendly, helpful, understanding, kind and cooperative.",
      "You excel at teaching, counseling, nursing and giving information.",
      "You are skilled with words and communicate well with others.",
      "You enjoy working with and helping others.",
      "You're concerned about social problems and human welfare.",
      "You thrive in cooperative, supportive environments."
    ]
  };
  
  // Create analysis data for top interests
  return topInterests.map(interest => {
    const level = interest.value > 70 ? "HIGH" : interest.value > 50 ? "MEDIUM" : "LOW";
    return {
      title: interest.name,
      level,
      points: interestDescriptions[interest.name] || ["No specific information available for this interest type."]
    };
  });
};

const generateMotivatorData = (scores: any, responses: Record<string, any> | null) => {
  // Default values if scores are missing
  if (!scores) {
    return [
      { name: 'Independence', value: 100 },
      { name: 'Continuous Learning', value: 100 },
      { name: 'Social Service', value: 100 },
      { name: 'Structured work environment', value: 40 },
      { name: 'Adventure', value: 40 }
    ];
  }
  
  const aptitude = scores.aptitude || 0;
  const personality = scores.personality || 0;
  const interest = scores.interest || 0;
  
  // Format motivator types
  return [
    { name: 'Independence', value: Math.min(100, Math.round((100 - personality) * 1.1)) },
    { name: 'Continuous Learning', value: Math.min(100, Math.round(aptitude * 1.1)) },
    { name: 'Social Service', value: Math.min(100, Math.round(personality * 1.1)) },
    { name: 'Structured work environment', value: Math.round(personality * 0.5) },
    { name: 'Adventure', value: Math.round(interest * 0.5) },
    { name: 'High Paced Environment', value: Math.round(aptitude * 0.3) },
    { name: 'Creativity', value: Math.round(interest * 0.25) }
  ].sort((a, b) => b.value - a.value);
};

const generateMotivatorAnalysis = (motivatorData: { name: string, value: number }[]) => {
  // Extract top motivators
  const topMotivators = motivatorData.slice(0, 3);
  
  const motivatorDescriptions: Record<string, string[]> = {
    'Independence': [
      "You enjoy working independently.",
      "You dislike too much supervision.",
      "You dislike group activities."
    ],
    'Continuous Learning': [
      "You like to have consistent professional growth in your field of work.",
      "You like to work in an environment where there is need to update your knowledge at regular intervals.",
      "You like it when your work achievements are evaluated at regular intervals."
    ],
    'Social Service': [
      "You like to do work which has some social responsibility.",
      "You like to do work which impacts the world.",
      "You like to receive social recognition for the work that you do."
    ],
    'Structured work environment': [
      "You prefer a well-organized and predictable work setting.",
      "You value clear guidelines and defined processes.",
      "You work best when roles and expectations are clearly defined."
    ],
    'Adventure': [
      "You enjoy taking risks and exploring new territories.",
      "You are comfortable with uncertainty and changing conditions.",
      "You enjoy variety and avoid routine whenever possible."
    ],
    'High Paced Environment': [
      "You thrive under pressure and tight deadlines.",
      "You enjoy fast-paced work environments with constant activity.",
      "You get energized by juggling multiple tasks simultaneously."
    ],
    'Creativity': [
      "You value opportunities to express your creativity and original ideas.",
      "You enjoy work that allows you to think outside the box.",
      "You prefer environments that encourage innovation and new approaches."
    ]
  };
  
  // Create analysis data for top motivators
  return topMotivators.map(motivator => {
    const level = motivator.value > 70 ? "HIGH" : motivator.value > 50 ? "MEDIUM" : "LOW";
    return {
      title: motivator.name,
      level,
      points: motivatorDescriptions[motivator.name] || ["No specific information available for this motivator."]
    };
  });
};

const generateLearningStyleData = (scores: any) => {
  // Default values if scores are missing
  if (!scores) {
    return [
      { name: 'Read & Write Learning', value: 38 },
      { name: 'Auditory learning', value: 25 },
      { name: 'Visual Learning', value: 25 },
      { name: 'Kinesthetic Learning', value: 13 }
    ];
  }
  
  const aptitude = scores.aptitude || 0;
  const personality = scores.personality || 0;
  const interest = scores.interest || 0;
  const learningStyle = scores.learningStyle || 0;
  
  // Format learning style types
  return [
    { name: 'Read & Write Learning', value: Math.round(aptitude * 0.5) },
    { name: 'Auditory learning', value: Math.round(personality * 0.3) },
    { name: 'Visual Learning', value: Math.round(interest * 0.3) },
    { name: 'Kinesthetic Learning', value: Math.round(learningStyle * 0.2) }
  ].sort((a, b) => b.value - a.value);
};

const generateLearningStyleAnalysis = (learningStyleData: { name: string, value: number }[]) => {
  // Get the dominant learning style
  const dominantStyle = learningStyleData[0];
  
  const styleDescriptions: Record<string, any> = {
    'Read & Write Learning': {
      description: [
        "Reading and writing learners prefer to take in the information displayed as words.",
        "These learners strongly prefer primarily text-based learning materials.",
        "Emphasis is based on text-based input and output, i.e. reading and writing in all its forms.",
        "People who prefer this modality love to work using PowerPoint, internet, lists, dictionaries and words."
      ],
      strategies: [
        "Re-write your notes after class.",
        "Use coloured pens and highlighters to focus on key ideas.",
        "Write notes to yourself in the margins.",
        "Write out key concepts and ideas.",
        "Compare your notes with others.",
        "Organize your notes/key concepts into a powerpoint presentation."
      ]
    },
    'Auditory learning': {
      description: [
        "Auditory learners prefer to learn by listening.",
        "You learn best when information is presented aurally.",
        "You prefer lectures, discussions, and listening to explanations.",
        "You remember information better when it's spoken aloud."
      ],
      strategies: [
        "Record lectures or educational content to listen to later.",
        "Participate in group discussions and study groups.",
        "Read your notes or textbook out loud.",
        "Explain concepts verbally to others or to yourself.",
        "Use mnemonic devices and rhymes to remember information."
      ]
    },
    'Visual Learning': {
      description: [
        "Visual learners prefer to learn through seeing information.",
        "You learn best when information is presented in charts, diagrams, and images.",
        "You have a good sense of direction and spatial awareness.",
        "You often think in pictures and remember visual details."
      ],
      strategies: [
        "Use maps, charts, and diagrams when studying.",
        "Color-code your notes and materials.",
        "Draw pictures and diagrams to represent concepts.",
        "Use flashcards with images.",
        "Watch educational videos or demonstrations."
      ]
    },
    'Kinesthetic Learning': {
      description: [
        "Kinesthetic learners prefer hands-on learning experiences.",
        "You learn best through physical activity and practical exercises.",
        "You prefer to touch, move, and interact with what you're learning.",
        "You may find it difficult to sit still for long periods."
      ],
      strategies: [
        "Take frequent breaks when studying.",
        "Use physical movements when memorizing information.",
        "Participate in role-plays and simulations.",
        "Create models or physical representations of concepts.",
        "Practice real-world applications of what you're learning."
      ]
    }
  };
  
  // Return data for the dominant style
  return {
    title: dominantStyle.name,
    description: styleDescriptions[dominantStyle.name]?.description || [],
    strategies: styleDescriptions[dominantStyle.name]?.strategies || []
  };
};

const generateSkillsData = (scores: any) => {
  // Default values if scores are missing
  if (!scores) {
    return [
      { name: 'overall', value: 70, level: 'Good', description: [] },
      { name: 'numerical', value: 80, level: 'Good', description: [
        "Your numerical skills are good.",
        "Numeracy involves an understanding of numerical data and numbers.",
        "Being competent and confident while working with numbers is a skill, that holds an advantage in a wide range of career options."
      ] },
      { name: 'logical', value: 60, level: 'Average', description: [
        "Your logical skills are average.",
        "Logical thinking is very important for analytical profiles.",
        "Being able to understand and analyze data in different formats is considered an essential skill in many career options."
      ] }
    ];
  }
  
  const aptitude = scores.aptitude || 0;
  const personality = scores.personality || 0;
  
  // Calculate skill levels
  const overallValue = Math.round(aptitude * 0.7);
  const numericalValue = Math.round(aptitude * 0.8);
  const logicalValue = Math.round(aptitude * 0.6);
  const verbalValue = Math.min(100, Math.round(personality * 1.2));
  const clericalValue = Math.round(personality * 0.5);
  const spatialValue = Math.round(aptitude * 0.8);
  const leadershipValue = Math.round(personality * 0.6);
  const socialValue = Math.round(personality * 0.8);
  const mechanicalValue = Math.round(aptitude * 0.5);
  
  // Helper function to determine skill level
  const getSkillLevel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 65) return "Good";
    if (score >= 50) return "Average";
    return "Below Average";
  };
  
  // Create skills data
  return [
    { 
      name: 'overall', 
      value: overallValue, 
      level: getSkillLevel(overallValue), 
      description: [] 
    },
    { 
      name: 'numerical', 
      value: numericalValue, 
      level: getSkillLevel(numericalValue), 
      description: [
        `Your numerical skills are ${getSkillLevel(numericalValue).toLowerCase()}.`,
        "Numeracy involves an understanding of numerical data and numbers.",
        "Being competent and confident while working with numbers is a skill, that holds an advantage in a wide range of career options."
      ]
    },
    { 
      name: 'logical', 
      value: logicalValue, 
      level: getSkillLevel(logicalValue), 
      description: [
        `Your logical skills are ${getSkillLevel(logicalValue).toLowerCase()}.`,
        "Logical thinking is very important for analytical profiles.",
        "Being able to understand and analyze data in different formats is considered an essential skill in many career options."
      ]
    },
    { 
      name: 'verbal', 
      value: verbalValue, 
      level: getSkillLevel(verbalValue), 
      description: [
        `Your communication skills are ${getSkillLevel(verbalValue).toLowerCase()}.`,
        "Excellent verbal and written communication helps you to communicate your message effectively."
      ]
    },
    { 
      name: 'clerical', 
      value: clericalValue, 
      level: getSkillLevel(clericalValue), 
      description: [
        `Your organizing & planning skills are ${getSkillLevel(clericalValue).toLowerCase()}.`,
        "It includes general organizing, planning, time management, scheduling, coordinating resources and meeting deadlines."
      ]
    },
    { 
      name: 'spatial', 
      value: spatialValue, 
      level: getSkillLevel(spatialValue), 
      description: [
        `Your visualization skills are ${getSkillLevel(spatialValue).toLowerCase()}.`,
        "This skill allows you to explore, analyze, and create visual solutions.",
        "It is important in many academic and professional career fields."
      ]
    },
    { 
      name: 'leadership', 
      value: leadershipValue, 
      level: getSkillLevel(leadershipValue), 
      description: [
        `Your leadership & decision-making skills are ${getSkillLevel(leadershipValue).toLowerCase()}.`,
        "It includes strategic thinking, planning, people management, change management, communication, and persuasion and influencing.",
        "These skills allow you to make decisions quickly, adapt to changing scenarios and respond to opportunities promptly."
      ]
    },
    { 
      name: 'social', 
      value: socialValue, 
      level: getSkillLevel(socialValue), 
      description: [
        `Your social and cooperation skills are ${getSkillLevel(socialValue).toLowerCase()}.`,
        "Social skills are important because they help you build, maintain and grow relationships with others.",
        "This skill is beneficial in the service industry and social causes."
      ]
    },
    { 
      name: 'mechanical', 
      value: mechanicalValue, 
      level: getSkillLevel(mechanicalValue), 
      description: [
        `The score indicates that your mechanical ability is ${getSkillLevel(mechanicalValue).toLowerCase()}.`,
        "This section evaluates your basic mechanical understanding and mechanical knowledge.",
        "This skill is required for many career options like engineering and mechanical services."
      ]
    }
  ];
};

const generateCareerClustersData = (scores: any) => {
  // Default values if scores are missing
  if (!scores) {
    return [
      { name: 'Information Technology', score: 98 },
      { name: 'Science, Maths and Engineering', score: 98 },
      { name: 'Manufacturing', score: 84 },
      { name: 'Accounts and Finance', score: 82 }
    ];
  }
  
  const aptitude = scores.aptitude || 0;
  const personality = scores.personality || 0;
  const interest = scores.interest || 0;
  
  // Define cluster scores based on assessment scores
  const clusters = [
    { name: 'Information Technology', score: Math.min(100, Math.round(aptitude * 1.1 + interest * 0.2)) },
    { name: 'Science, Maths and Engineering', score: Math.min(100, Math.round(aptitude * 1.1 + interest * 0.1)) },
    { name: 'Manufacturing', score: Math.min(100, Math.round(aptitude * 0.9 + interest * 0.1)) },
    { name: 'Accounts and Finance', score: Math.min(100, Math.round(aptitude * 0.8 + personality * 0.2)) },
    { name: 'Logistics and Transportation', score: Math.min(100, Math.round(aptitude * 0.8 + personality * 0.1)) },
    { name: 'Bio Science and Research', score: Math.min(100, Math.round(aptitude * 0.7 + interest * 0.3)) },
    { name: 'Agriculture', score: Math.min(100, Math.round(aptitude * 0.6 + interest * 0.3)) },
    { name: 'Health Science', score: Math.min(100, Math.round(aptitude * 0.6 + personality * 0.2)) },
    { name: 'Government Services', score: Math.min(100, Math.round(aptitude * 0.5 + personality * 0.3)) },
    { name: 'Public Safety and Security', score: Math.min(100, Math.round(aptitude * 0.5 + personality * 0.2)) },
    { name: 'Architecture and Construction', score: Math.min(100, Math.round(aptitude * 0.5 + interest * 0.1)) },
    { name: 'Business Management', score: Math.min(100, Math.round(personality * 0.5 + aptitude * 0.1)) },
    { name: 'Legal Services', score: Math.min(100, Math.round(personality * 0.5 + aptitude * 0.1)) },
    { name: 'Education and Training', score: Math.min(100, Math.round(personality * 0.5)) },
    { name: 'Hospitality and Tourism', score: Math.min(100, Math.round(personality * 0.3 + interest * 0.1)) },
    { name: 'Marketing & Advertising', score: Math.min(100, Math.round(personality * 0.3 + interest * 0.1)) },
    { name: 'Sports & Physical Activities', score: Math.min(100, Math.round(aptitude * 0.2 + interest * 0.1)) },
    { name: 'Arts & Language Arts', score: Math.min(100, Math.round(interest * 0.2 + personality * 0.1)) },
    { name: 'Human Service', score: Math.min(100, Math.round(personality * 0.1 + interest * 0.1)) },
    { name: 'Media and Communication', score: Math.min(100, Math.round(personality * 0.1)) }
  ];
  
  // Sort by score
  return clusters.sort((a, b) => b.score - a.score);
};

const generateSelectedClustersData = (clustersData: { name: string, score: number }[]) => {
  // Extract top 4 clusters
  const topClusters = clustersData.slice(0, 4);
  
  const clusterDescriptions: Record<string, string[]> = {
    'Information Technology': [
      "Information technology professionals work with Computer hardware, software or network systems.",
      "You might design new computer equipment or work on a new computer game.",
      "Some professionals provide support and manage software or hardware.",
      "You might Write, update, and maintain computer programs or software packages"
    ],
    'Science, Maths and Engineering': [
      "Science, math and engineering, professionals do scientific research in laboratories or the field.",
      "You will plan or design products and systems.",
      "You will do research and read blueprints.",
      "You might support scientists, mathematicians, or engineers in their work."
    ],
    'Manufacturing': [
      "Manufacturing professionals work with products and equipment.",
      "You might design a new product, decide how the product will be made, or make the product.",
      "You might work on cars, computers, appliances, airplanes, or electronic devices.",
      "Other manufacturing workers install or repair products."
    ],
    'Accounts and Finance': [
      "Finance and Accounts professionals keep track of money.",
      "You might work in financial planning, banking, or insurance.",
      "You could maintain financial records or give advice to business executives on how to operate their business."
    ],
    'Logistics and Transportation': [
      "Logistics and transportation professionals move people and products.",
      "You might drive or pilot different vehicles.",
      "You could plan shipping and receiving, or manage transportation services.",
      "You might repair and maintain vehicles, or manage a warehouse of products."
    ],
    'Bio Science and Research': [
      "Bioscience researchers study living organisms and life processes.",
      "You might conduct research in laboratories or in the field.",
      "You could develop new medicines, treatments, or biotechnology applications.",
      "You might analyze biological data and write scientific papers."
    ],
    'Agriculture': [
      "Agriculture professionals work with plants, animals, and natural resources.",
      "You might manage farms, ranches, or agricultural businesses.",
      "You could develop new farming techniques or products.",
      "You might work in food production, processing, or distribution."
    ],
    'Health Science': [
      "Health science professionals work in the healthcare industry.",
      "You might diagnose and treat patients with different conditions.",
      "You could research diseases and develop treatments.",
      "You might work in hospitals, clinics, laboratories, or other healthcare settings."
    ]
  };
  
  // Create data for top clusters with descriptions
  return topClusters.map((cluster, index) => ({
    rank: index + 1,
    name: cluster.name,
    description: clusterDescriptions[cluster.name] || ["No specific description available for this career cluster."]
  }));
};

const generateCareerPathsData = (scores: any, clustersData: { name: string, score: number }[]) => {
  // Default paths if scores are missing
  if (!scores) {
    return [
      {
        careerTitle: "Biochemistry - Bio Science and Research",
        category: "Biochemist, Bio technologist, Clinical Scientist",
        description: "",
        psychAnalysis: { score: 100, label: "Very High" },
        skillAbilities: { score: 70, label: "High" },
        comment: "Top Choice"
      },
      {
        careerTitle: "Genetics - Bio Science and Research",
        category: "Genetics Professor, Genetic Research Associate",
        description: "",
        psychAnalysis: { score: 100, label: "Very High" },
        skillAbilities: { score: 73, label: "High" },
        comment: "Top Choice"
      }
    ];
  }
  
  const aptitude = scores.aptitude || 0;
  const personality = scores.personality || 0;
  
  // Get top clusters to define career paths
  const topClusters = clustersData.slice(0, 4);
  
  // Define career paths based on top clusters
  const careerPaths: any[] = [];
  
  // Add IT paths if IT is in top clusters
  if (topClusters.find(c => c.name === 'Information Technology')) {
    careerPaths.push({
      careerTitle: "Programming and Software Development - Information Technology",
      category: "Software Programmer, Team Leader, Product Manager",
      description: "",
      psychAnalysis: { score: Math.min(100, Math.round(aptitude * 1.0)), label: "Very High" },
      skillAbilities: { score: Math.min(100, Math.round(aptitude * 0.8)), label: "High" },
      comment: "Top Choice"
    });
    
    careerPaths.push({
      careerTitle: "Artificial Intelligence - Information Technology",
      category: "Machine Learning Engineer, Computer Engineer",
      description: "",
      psychAnalysis: { score: Math.min(100, Math.round(aptitude * 0.98)), label: "Very High" },
      skillAbilities: { score: Math.min(100, Math.round(aptitude * 0.85)), label: "High" },
      comment: "Top Choice"
    });
    
    careerPaths.push({
      careerTitle: "Software Testing and Quality - Information Technology",
      category: "Software Testing Engineer, Database Management",
      description: "",
      psychAnalysis: { score: Math.min(100, Math.round(aptitude * 0.95)), label: "Very High" },
      skillAbilities: { score: Math.min(100, Math.round(aptitude * 0.75)), label: "High" },
      comment: "Top Choice"
    });
  }
  
  // Add Science paths if Science is in top clusters
  if (topClusters.find(c => c.name === 'Science, Maths and Engineering')) {
    careerPaths.push({
      careerTitle: "Statistics - Science, Maths and Engineering",
      category: "Statistician, Data analyst, Data scientist",
      description: "",
      psychAnalysis: { score: Math.min(100, Math.round(aptitude * 1.0)), label: "Very High" },
      skillAbilities: { score: Math.min(100, Math.round(aptitude * 0.8)), label: "High" },
      comment: "Top Choice"
    });
    
    careerPaths.push({
      careerTitle: "Physics, Astronomy & Scientist - Science, Maths and Engineering",
      category: "Research Consultant, Research Physicist, Research Scientist",
      description: "",
      psychAnalysis: { score: Math.min(100, Math.round(aptitude * 0.98)), label: "Very High" },
      skillAbilities: { score: Math.min(100, Math.round(aptitude * 0.75)), label: "High" },
      comment: "Top Choice"
    });
    
    careerPaths.push({
      careerTitle: "Engineering & Technology - Science, Maths and Engineering",
      category: "Electrical Engineer, Civil Engineer, Electronics Engineer",
      description: "",
      psychAnalysis: { score: Math.min(100, Math.round(aptitude * 0.95)), label: "Very High" },
      skillAbilities: { score: Math.min(100, Math.round(aptitude * 0.75)), label: "High" },
      comment: "Top Choice"
    });
  }
  
  // Add Bio Science paths
  careerPaths.push({
    careerTitle: "Biochemistry - Bio Science and Research",
    category: "Biochemist, Bio technologist, Clinical Scientist",
    description: "",
    psychAnalysis: { score: Math.min(100, Math.round(aptitude * 1.0)), label: "Very High" },
    skillAbilities: { score: Math.min(100, Math.round(aptitude * 0.8)), label: "High" },
    comment: "Top Choice"
  });
  
  careerPaths.push({
    careerTitle: "Genetics - Bio Science and Research",
    category: "Genetics Professor, Genetic Research Associate",
    description: "",
    psychAnalysis: { score: Math.min(100, Math.round(aptitude * 0.98)), label: "Very High" },
    skillAbilities: { score: Math.min(100, Math.round(aptitude * 0.85)), label: "High" },
    comment: "Top Choice"
  });
  
  // Add Finance paths if Finance is in top clusters
  if (topClusters.find(c => c.name === 'Accounts and Finance')) {
    careerPaths.push({
      careerTitle: "Financial Analyst - Accounts and Finance",
      category: "Equity research analyst, Investment Analyst",
      description: "",
      psychAnalysis: { score: Math.min(100, Math.round(aptitude * 0.95)), label: "Very High" },
      skillAbilities: { score: Math.min(100, Math.round(aptitude * 0.75)), label: "High" },
      comment: "Top Choice"
    });
    
    careerPaths.push({
      careerTitle: "Commerce with Information Technology - Accounts and Finance",
      category: "Software engineer, Coder, Programmer",
      description: "",
      psychAnalysis: { score: Math.min(100, Math.round(aptitude * 1.0)), label: "Very High" },
      skillAbilities: { score: Math.min(100, Math.round(aptitude * 0.75)), label: "High" },
      comment: "Top Choice"
    });
  }
  
  // Return a selection of paths (up to 10)
  return careerPaths.slice(0, 10);
};

const ReportPDFGenerator: React.FC<ReportPDFGeneratorProps> = ({ 
  reportId, 
  userName, 
  scores, 
  responses,
  strengthAreas,
  developmentAreas,
  isJuniorAssessment = false
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePDF = async () => {
    try {
      setIsGenerating(true);
      toast.loading('Generating PDF report...');
      
      // Get profile info for the user from context
      const userInfo = {
        name: userName,
        email: responses?.email || '',
        phone: responses?.phone || '',
        age: responses?.age || '',
        location: responses?.location || 'India',
      };
      
      // Try to get AI-enhanced content
      let enhancedContent = null;
      try {
        const enhancedContentResponse = await fetch('/api/generate-ai-content', {
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
              developmentAreas,
              topCareer: scores?.careerRecommendations?.[0] || null,
            }
          })
        });
        
        if (enhancedContentResponse.ok) {
          enhancedContent = await enhancedContentResponse.json();
          console.log("AI-enhanced content generated successfully");
        }
      } catch (aiError) {
        console.warn("Could not generate AI content:", aiError);
      }
      
      await generatePDF(reportId, userInfo, scores, responses, strengthAreas, developmentAreas, isJuniorAssessment, enhancedContent);
      
      toast.dismiss();
      toast.success('PDF report generated successfully!');
    } catch (error) {
      toast.dismiss();
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF report');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex justify-center my-6">
      <Button
        size="lg"
        onClick={handleGeneratePDF}
        disabled={isGenerating}
        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md"
      >
        {isGenerating ? (
          <>
            <FileClock className="mr-2 h-5 w-5 animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <FileDown className="mr-2 h-5 w-5" />
            Download Career Report PDF
          </>
        )}
      </Button>
    </div>
  );
};

export default ReportPDFGenerator;
