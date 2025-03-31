
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';
import { 
  addHeaderWithLogo, 
  addReportTitle, 
  addUserInfo, 
  addDisclaimer,
  addSectionTitle, 
  addProfilingSection,
  addPersonalityTypeChart, 
  addPersonalityAnalysis,
  addInterestBarChart, 
  addInterestAnalysis,
  addCareerMotivatorChart, 
  addMotivatorAnalysis,
  addLearningStylePieChart, 
  addLearningStyleAnalysis,
  addSkillBarChart,
  addCareerClusters,
  addSelectedCareerClusters,
  addCareerPaths,
  addSummarySheet
} from '@/utils/pdfFormatting';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ReportPDFGeneratorProps {
  reportId: string;
  userName: string;
  scores: any;
  responses: Record<string, string> | null;
  strengthAreas: string[];
  developmentAreas: string[];
  isJuniorAssessment?: boolean;
}

// Use this function to generate personalized content using OpenRouter API
async function generatePersonalizedContent(
  contentType: string,
  assessmentData: any
) {
  try {
    // Call the Supabase Edge Function to generate content
    const { data, error } = await supabase.functions.invoke('generate-ai-content', {
      body: {
        contentType,
        assessmentData
      }
    });

    if (error) {
      console.error('Error calling generate-ai-content function:', error);
      throw new Error('Failed to generate personalized content');
    }

    return data.content;
  } catch (error) {
    console.error('Error generating personalized content:', error);
    throw new Error('Failed to generate personalized content');
  }
}

// Make the generatePDF function accessible outside the component
export async function generatePDF(
  reportId: string,
  userName: string,
  scores: any,
  responses: Record<string, string> | null,
  strengthAreas: string[],
  developmentAreas: string[],
  isJuniorAssessment: boolean = false
) {
  try {
    // Prepare assessment data for content generation
    const assessmentData = {
      userName,
      reportId,
      scores,
      strengthAreas,
      developmentAreas,
      responses,
      completedAt: new Date().toISOString(),
      topCareer: {
        careerTitle: "Software Developer",
        suitabilityPercentage: 95,
        careerDescription: "Designs and develops software applications"
      },
      age: isJuniorAssessment ? "14-16" : "16-18",
      location: "India",
      email: userName.includes('@') ? userName : 'student@example.com'
    };

    // Generate personality analysis content
    let personalityAnalysisContent;
    let careerInterestContent;
    let careerMotivatorContent;
    let executiveSummaryContent;
    
    try {
      // Generate executive summary
      executiveSummaryContent = await generatePersonalizedContent(
        'executiveSummary',
        assessmentData
      );
      
      // Generate personality analysis content
      personalityAnalysisContent = await generatePersonalizedContent(
        'careerPersonality',
        assessmentData
      );
      
      // Generate career interest content
      careerInterestContent = await generatePersonalizedContent(
        'careerInterest', 
        assessmentData
      );
      
      // Generate career motivator content
      careerMotivatorContent = await generatePersonalizedContent(
        'careerMotivator',
        assessmentData
      );
    } catch (error) {
      console.error('Error generating AI content:', error);
      personalityAnalysisContent = 'Based on your assessment, you tend to be analytical and detail-oriented. You prefer working with facts and data rather than abstract concepts.';
      careerInterestContent = 'Your interests align strongly with technical and analytical fields. You show a natural inclination toward problem-solving and logical reasoning.';
      careerMotivatorContent = 'You are motivated by achievement and continuous learning. You value environments that allow you to apply your skills and gain new knowledge.';
      executiveSummaryContent = 'Your assessment indicates strengths in logical thinking and technical aptitude with opportunities for growth in leadership and communication skills.';
    }

    // Create PDF document
    createPDFWithContent(
      reportId,
      userName,
      scores,
      responses,
      strengthAreas,
      developmentAreas,
      personalityAnalysisContent,
      careerInterestContent,
      careerMotivatorContent,
      executiveSummaryContent,
      isJuniorAssessment
    );

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

function createPDFWithContent(
  reportId: string,
  userName: string,
  scores: any,
  responses: Record<string, string> | null,
  strengthAreas: string[],
  developmentAreas: string[],
  personalityAnalysisContent: string,
  careerInterestContent: string,
  careerMotivatorContent: string,
  executiveSummaryContent: string,
  isJuniorAssessment: boolean
) {
  // Initialize PDF document
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  try {
    // Add header and title
    addHeaderWithLogo(pdf);
    
    // Set the title based on assessment type
    const reportTitle = isJuniorAssessment 
      ? 'Career Report for 8th, 9th or 10th' 
      : 'Career Report for 11th or 12th';
    
    addReportTitle(pdf, reportTitle);
    
    // Add user information
    const userInfo = [
      { label: 'Name', value: userName },
      { label: 'Report ID', value: reportId },
      { label: 'Date', value: new Date().toLocaleDateString() },
      { label: 'Report Type', value: isJuniorAssessment ? 'Class 8-10 Assessment' : 'Class 11-12 Assessment' }
    ];
    
    addUserInfo(pdf, userInfo);
    
    // Add disclaimer
    addDisclaimer(pdf);
    
    // Profiling section (page 2)
    pdf.addPage();
    
    // Add profiling data based on assessment scores
    const currentStage = determineCareerPlanningStage(scores);
    
    const profilingData = {
      currentStage,
      description: getStageDescription(currentStage),
      riskInvolved: getStageRisks(currentStage),
      actionPlan: getStageActionPlan(currentStage)
    };
    
    addProfilingSection(pdf, profilingData);
    
    // Personality Type (page 3)
    pdf.addPage();
    
    // Determine personality traits based on responses
    let introversion = 86; // Default values
    let sensing = 86;
    let thinking = 71;
    let judging = 57;
    
    if (responses) {
      // Attempt to calculate from responses
      const personalityQuestions = Object.entries(responses).filter(([id]) => 
        id.startsWith('per_') || 
        (Number(id.replace(/\D/g, '')) >= 54 && Number(id.replace(/\D/g, '')) <= 77)
      );
      
      if (personalityQuestions.length > 0) {
        // Calculate introversion percentage (this is simplified)
        const introvertResponses = personalityQuestions.filter(([, value]) => 
          ['C', 'D'].includes(value)
        ).length;
        
        introversion = Math.round((introvertResponses / personalityQuestions.length) * 100);
        sensing = Math.min(100, Math.round(scores.aptitude * 0.9));
        thinking = Math.min(100, Math.round((100 - scores.personality) * 0.8));
        judging = Math.min(100, Math.round(scores.personality * 0.6));
      }
    }
    
    // Determine personality type string
    const personalityType = `${introversion > 50 ? 'Introvert' : 'Extrovert'}:${sensing > 50 ? 'Sensing' : 'iNtuitive'}:${thinking > 50 ? 'Thinking' : 'Feeling'}:${judging > 50 ? 'Judging' : 'Perceiving'}`;
    
    // Add personality type chart
    addPersonalityTypeChart(pdf, {
      introvertExtrovert: {
        introvert: introversion,
        extrovert: 100 - introversion
      },
      sensingIntuitive: {
        sensing: sensing,
        intuitive: 100 - sensing
      },
      thinkingFeeling: {
        thinking: thinking,
        feeling: 100 - thinking
      },
      judgingPerceiving: {
        judging: judging,
        perceiving: 100 - judging
      }
    }, personalityType);
    
    // Personality Analysis (page 4)
    pdf.addPage();
    
    // Parse the AI-generated content into bullet points for each section
    const analysisData = parsePersonalityAnalysis(personalityAnalysisContent);
    
    // Add personality analysis
    addPersonalityAnalysis(pdf, analysisData);
    
    // Career Interest (page 5-6)
    pdf.addPage();
    
    // Create interest data
    const interests = [
      { name: 'Investigative', value: Math.min(100, Math.round(scores.aptitude * 1.1)) },
      { name: 'Conventional', value: Math.min(100, Math.round(scores.aptitude * 0.7)) },
      { name: 'Realistic', value: Math.min(100, Math.round(scores.aptitude * 0.65)) },
      { name: 'Enterprising', value: Math.min(100, Math.round(scores.personality * 0.45)) },
      { name: 'Artistic', value: Math.min(100, Math.round(scores.interest * 0.3)) },
      { name: 'Social', value: Math.min(100, Math.round(scores.personality * 0.2)) }
    ];
    
    // Sort interests by value (highest first)
    const sortedInterests = [...interests].sort((a, b) => b.value - a.value);
    
    // Add interest bar chart
    addInterestBarChart(pdf, sortedInterests);
    
    // Career Interest Analysis (page 7-8)
    pdf.addPage();
    
    // Parse the AI-generated content into interest analyses
    const interestAnalyses = parseInterestAnalysis(careerInterestContent, sortedInterests);
    
    // Add interest analysis
    addInterestAnalysis(pdf, interestAnalyses);
    
    // Career Motivator (page 9)
    pdf.addPage();
    
    // Create motivator data
    const motivators = [
      { name: 'Independence', value: Math.min(100, Math.round((100 - scores.personality) * 1.1)) },
      { name: 'Continuous Learning', value: Math.min(100, Math.round(scores.aptitude * 1.1)) },
      { name: 'Social Service', value: Math.min(100, Math.round(scores.personality * 1.1)) },
      { name: 'Structured work environment', value: Math.round(scores.personality * 0.5) },
      { name: 'Adventure', value: Math.round(scores.interest * 0.5) },
      { name: 'High Paced Environment', value: Math.round(scores.aptitude * 0.3) },
      { name: 'Creativity', value: Math.round(scores.interest * 0.25) }
    ];
    
    // Sort motivators by value (highest first)
    const sortedMotivators = [...motivators].sort((a, b) => b.value - a.value);
    
    // Add motivator chart
    addCareerMotivatorChart(pdf, sortedMotivators);
    
    // Career Motivator Analysis (page 10)
    pdf.addPage();
    
    // Parse the AI-generated content into motivator analyses
    const motivatorAnalyses = parseMotivatorAnalysis(careerMotivatorContent, sortedMotivators);
    
    // Add motivator analysis
    addMotivatorAnalysis(pdf, motivatorAnalyses);
    
    // Learning Style (page 11)
    pdf.addPage();
    
    // Create learning style data
    const learningStyles = [
      { name: 'Read & Write Learning', value: Math.round(scores.aptitude * 0.5) },
      { name: 'Auditory learning', value: Math.round(scores.personality * 0.3) },
      { name: 'Visual Learning', value: Math.round(scores.interest * 0.3) },
      { name: 'Kinesthetic Learning', value: Math.round(scores.learningStyle * 0.2) }
    ];
    
    // Sort learning styles by value (highest first)
    const sortedLearningStyles = [...learningStyles].sort((a, b) => b.value - a.value);
    
    // Add learning style chart
    addLearningStylePieChart(pdf, sortedLearningStyles);
    
    // Learning Style Analysis (page 12)
    pdf.addPage();
    
    // Determine dominant learning style
    const dominantStyle = sortedLearningStyles[0].name;
    
    // Add learning style analysis
    addLearningStyleAnalysis(pdf, {
      title: dominantStyle,
      description: getLearningStyleDescription(dominantStyle),
      strategies: getLearningStyleStrategies(dominantStyle)
    });
    
    // Skills and Abilities (page 13-14)
    pdf.addPage();
    
    // Calculate overall score
    const overallScore = Math.round((
      scores.aptitude + 
      scores.personality + 
      scores.interest +
      scores.learningStyle
    ) / 4 * 0.7);
    
    // Create skills data
    const skills = [
      { 
        name: 'Numerical Ability',
        value: Math.round(scores.aptitude * 0.8),
        level: getScoreLevel(Math.round(scores.aptitude * 0.8)),
        description: 'Numeracy involves an understanding of numerical data and numbers. Being competent and confident while working with numbers is a skill, that holds an advantage in a wide range of career options.'
      },
      {
        name: 'Logical Ability',
        value: Math.round(scores.aptitude * 0.6),
        level: getScoreLevel(Math.round(scores.aptitude * 0.6)),
        description: 'Logical thinking is very important for analytical profiles. Being able to understand and analyze data in different formats is considered an essential skill in many career options.'
      },
      {
        name: 'Verbal Ability',
        value: Math.min(100, Math.round(scores.personality * 1.2)),
        level: getScoreLevel(Math.min(100, Math.round(scores.personality * 1.2))),
        description: 'Excellent verbal and written communication helps you to communicate your message effectively.'
      },
      {
        name: 'Clerical and Organizing Skills',
        value: Math.round(scores.personality * 0.5),
        level: getScoreLevel(Math.round(scores.personality * 0.5)),
        description: 'It includes general organizing, planning, time management, scheduling, coordinating resources and meeting deadlines.'
      },
      {
        name: 'Spatial & Visualization Ability',
        value: Math.round(scores.aptitude * 0.8),
        level: getScoreLevel(Math.round(scores.aptitude * 0.8)),
        description: 'This skill allows you to explore, analyze, and create visual solutions. It is important in many academic and professional career fields.'
      },
      {
        name: 'Leadership & Decision making skills',
        value: Math.round(scores.personality * 0.6),
        level: getScoreLevel(Math.round(scores.personality * 0.6)),
        description: 'It includes strategic thinking, planning, people management, change management, communication, and persuasion and influencing. These skills allow you to make decisions quickly, adapt to changing scenarios and respond to opportunities promptly.'
      },
      {
        name: 'Social & Co-operation Skills',
        value: Math.round(scores.personality * 0.8),
        level: getScoreLevel(Math.round(scores.personality * 0.8)),
        description: 'Social skills are important because they help you build, maintain and grow relationships with others. This skill is beneficial in the service industry and social causes.'
      },
      {
        name: 'Mechanical Abilities',
        value: Math.round(scores.aptitude * 0.5),
        level: getScoreLevel(Math.round(scores.aptitude * 0.5)),
        description: 'The score indicates that your mechanical ability is average. This section evaluates your basic mechanical understanding and mechanical knowledge. This skill is required for many career options like engineering and mechanical services.'
      }
    ];
    
    // Add skills bar chart
    addSkillBarChart(pdf, skills, overallScore);
    
    // Career Clusters (page 15-16)
    pdf.addPage();
    
    // Create career clusters data
    const clusters = [
      { name: 'Information Technology', score: Math.min(100, Math.round(scores.aptitude * 1.3)) },
      { name: 'Science, Maths and Engineering', score: Math.min(100, Math.round(scores.aptitude * 1.3)) },
      { name: 'Manufacturing', score: Math.min(100, Math.round(scores.aptitude * 1.1)) },
      { name: 'Accounts and Finance', score: Math.min(100, Math.round(scores.aptitude * 1.1)) },
      { name: 'Logistics and Transportation', score: Math.min(100, Math.round(scores.aptitude * 1.08)) },
      { name: 'Bio Science and Research', score: Math.min(100, Math.round(scores.aptitude * 1.04)) },
      { name: 'Agriculture', score: Math.min(100, Math.round(scores.aptitude * 0.98)) },
      { name: 'Health Science', score: Math.min(100, Math.round(scores.interest * 0.98)) },
      { name: 'Government Services', score: Math.min(100, Math.round(scores.personality * 0.8)) },
      { name: 'Public Safety and Security', score: Math.min(100, Math.round(scores.personality * 0.73)) },
      { name: 'Architecture and Construction', score: Math.min(100, Math.round(scores.aptitude * 0.73)) },
      { name: 'Business Management', score: Math.min(100, Math.round(scores.personality * 0.7)) },
      { name: 'Legal Services', score: Math.min(100, Math.round(scores.personality * 0.7)) },
      { name: 'Education and Training', score: Math.min(100, Math.round(scores.personality * 0.63)) },
      { name: 'Hospitality and Tourism', score: Math.min(100, Math.round(scores.personality * 0.45)) },
      { name: 'Marketing & Advertising', score: Math.min(100, Math.round(scores.personality * 0.35)) },
      { name: 'Sports & Physical Activities', score: Math.min(100, Math.round(scores.interest * 0.33)) },
      { name: 'Arts & Language Arts', score: Math.min(100, Math.round(scores.interest * 0.28)) },
      { name: 'Human Service', score: Math.min(100, Math.round(scores.personality * 0.15)) },
      { name: 'Media and Communication', score: Math.min(100, Math.round(scores.interest * 0.05)) }
    ];
    
    // Add career clusters
    addCareerClusters(pdf, clusters);
    
    // Selected Career Clusters (page 17)
    pdf.addPage();
    
    // Sort clusters by score (highest first)
    const sortedClusters = [...clusters].sort((a, b) => b.score - a.score);
    
    // Take top 4 clusters
    const top4Clusters = sortedClusters.slice(0, 4);
    
    // Create selected clusters data
    const selectedClusters = top4Clusters.map((cluster, index) => ({
      rank: index + 1,
      name: cluster.name,
      description: getClusterDescription(cluster.name)
    }));
    
    // Add selected career clusters
    addSelectedCareerClusters(pdf, selectedClusters);
    
    // Career Paths (page 18-24)
    pdf.addPage();
    
    // Generate career paths based on clusters and scores
    const careerPaths = generateCareerPaths(scores, sortedClusters);
    
    // Add career paths
    addCareerPaths(pdf, careerPaths);
    
    // Summary Sheet (last page)
    pdf.addPage();
    
    // Create summary data
    const summaryData = {
      careerPersonality: personalityType,
      careerInterest: `${sortedInterests[0].name} + ${sortedInterests[1].name} + ${sortedInterests[2].name}`,
      careerMotivator: `${sortedMotivators[0].name} + ${sortedMotivators[1].name} + ${sortedMotivators[2].name}`,
      learningStyle: sortedLearningStyles[0].name,
      skillsAbilities: `Numerical Ability[${skills[0].value}%] +Logical Ability[${skills[1].value}%] +Verbal Ability[${skills[2].value}%]\n` +
        `Clerical and Organizing Skills[${skills[3].value}%] +Spatial & Visualization Ability[${skills[4].value}%]\n` +
        `+Leadership & Decision making skills[${skills[5].value}%]\n` +
        `Social & Co-operation Skills[${skills[6].value}%] +Mechanical Abilities[${skills[7].value}%] +`,
      selectedClusters: selectedClusters.map(c => c.name).join('+')
    };
    
    // Add summary sheet
    addSummarySheet(pdf, summaryData);
    
    // Save the PDF file with an appropriate filename
    const filename = `${reportId}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);
  } catch (error) {
    console.error('Error creating PDF:', error);
    toast.error('An error occurred while generating the PDF. Please try again.');
    throw error;
  }
}

// Helper functions for generating PDF content

function determineCareerPlanningStage(scores: any): string {
  const avgScore = (scores.aptitude + scores.personality + scores.interest + scores.learningStyle) / 4;
  
  if (avgScore < 30) return 'Ignorant';
  if (avgScore < 50) return 'Confused';
  if (avgScore < 70) return 'Diffused';
  if (avgScore < 85) return 'Methodical';
  return 'Optimized';
}

function getStageDescription(stage: string): string {
  switch (stage) {
    case 'Ignorant':
      return 'You are at the ignorant stage in career planning. At this stage, you are not aware of career options. You may be in a completely unprepared stage. This could be due to unawareness or negligence. Most of your career decisions are driven by external factors without analyzing information about yourself or about career options.';
    case 'Confused':
      return 'You are at the confused stage in career planning. At this stage, you have a little awareness of career options. However, you are not able to analyze your strengths and areas of improvement. This leads to confusion in decision making. Most of your career decisions are driven by others due to lack of proper information and analysis.';
    case 'Diffused':
      return 'You are at the diffused stage in career planning. We understand that you have a fair idea of your suitable career. At this stage, you have a better understanding of career options. However, you are looking for more information to understand the complete career path for yourself and an execution plan to achieve it. Lack of complete information and execution plan can adversely impact your career. Most career decisions are based on limited information.';
    case 'Methodical':
      return 'You are at the methodical stage in career planning. You are aware of the necessary options and have a good understanding of your abilities and areas of improvement. You have a better understanding of your career path and the steps to take. You are now ready to use all the information to build a proper career action plan with timelines. Most career decisions are based on analysis and research.';
    case 'Optimized':
      return 'You are at the optimized stage in career planning. You are fully aware of your career direction. You have a deeper understanding of your strengths and areas of improvement. You have researched all the information about the career path. You have a complete execution plan with timelines to achieve your career objectives. Your career planning is complete and aligned with your abilities and aspirations.';
    default:
      return 'You are currently in the process of career planning. Understanding your current stage will help you make better career decisions.';
  }
}

function getStageRisks(stage: string): string {
  switch (stage) {
    case 'Ignorant':
      return 'Career misalignment, career path misjudgment, unnecessary stress, financial risks';
    case 'Confused':
      return 'Career misalignment, career path misjudgment, unnecessary stress, financial risks';
    case 'Diffused':
      return 'Career misalignment, career path misjudgment, wrong career path projections, unnecessary stress';
    case 'Methodical':
      return 'Limited alternatives, lack of contingency plans';
    case 'Optimized':
      return 'Over-confidence, limited openness to unexpected opportunities';
    default:
      return 'Uncertainty in career direction, potential misalignment with abilities and interests';
  }
}

function getStageActionPlan(stage: string): string {
  switch (stage) {
    case 'Ignorant':
      return 'Gather career information > Analyze information > Explore career options > Build career action plan';
    case 'Confused':
      return 'Understand strengths & areas of improvement > Analyze career options > Align your abilities and interests with career options > Build career action plan';
    case 'Diffused':
      return 'Explore career path > Align your abilities and interests with the best possible career path > Realistic Execution Plan > Timely Review of Action Plan';
    case 'Methodical':
      return 'Build a detailed career action plan > Explore career paths in depth > Apply your understanding to building your career > Regular review of action plan';
    case 'Optimized':
      return 'Continuous learning and development > Stay updated with latest trends > Timely reviews > Be open to new opportunities';
    default:
      return 'Assess your skills and interests > Research career options > Develop a career plan > Seek guidance from mentors';
  }
}

function parsePersonalityAnalysis(content: string): {
  focusEnergy: string[];
  processInfo: string[];
  makeDecisions: string[];
  planWork: string[];
  strengths: string[];
} {
  // Default values
  const defaultAnalysis = {
    focusEnergy: [
      'You mostly get your energy from dealing with ideas, pictures, memories and reactions.',
      'You are quiet, reserved and like to spend your time alone.',
      'Your primary mode of living is focused internally.',
      'You are passionate but not usually aggressive.',
      'You are a good listener.',
      'You are more of an inside-out person.'
    ],
    processInfo: [
      'You mostly collect and trust the information that is presented in a detailed and sequential manner.',
      'You think more about the present and learn from the past.',
      'You like to see the practical use of things and learn best from practice.',
      'You notice facts and remember details that are important to you.',
      'You solve problems by working through facts until you understand the problem.',
      'You create meaning from conscious thought and learn by observation.'
    ],
    makeDecisions: [
      'You seem to make decisions based on logic rather than the circumstances.',
      'You believe telling truth is more important than being tactful.',
      'You seem to look for logical explanations or solutions to almost everything.',
      'You can often be seen as very task-oriented, uncaring, or indifferent.',
      'You are ruled by your head instead of your heart.',
      'You are a critical thinker and oriented toward problem solving.'
    ],
    planWork: [
      'You prefer a planned or orderly way of life.',
      'You like to have things well-organized.',
      'Your productivity increases when working with structure.',
      'You are self-disciplined and decisive.',
      'You like to have things decided and planned before doing any task.',
      'You seek closure and enjoy completing tasks.',
      'Mostly, you think sequentially.'
    ],
    strengths: [
      'Strong-willed and dutiful',
      'Calm and practical',
      'Honest and direct',
      'Very responsible',
      'Create and enforce order'
    ]
  };
  
  try {
    // Extract bullet points from content (simplified parsing)
    const sections = content.split(/(?=Where do you|How do you|Your strengths)/i);
    
    if (sections.length >= 4) {
      // Extract bullet points for each section
      const extractBulletPoints = (section: string): string[] => {
        const bulletMatches = section.match(/•\s+([^\n•]+)/g) || 
                              section.match(/\*\s+([^\n\*]+)/g) ||
                              section.match(/\d+\.\s+([^\n]+)/g);
        
        if (bulletMatches) {
          return bulletMatches.map(bullet => 
            bullet.replace(/^[•*\d]+\.\s+/, '').trim()
          );
        }
        
        // If no bullet points, split by sentences
        const sentences = section.split(/\.\s+/);
        return sentences
          .filter(s => s.length > 10) // Filter out short phrases
          .map(s => s.trim())
          .slice(1, 6); // Take up to 5 sentences
      };
      
      const focusEnergy = extractBulletPoints(sections[1]);
      const processInfo = extractBulletPoints(sections[2]);
      const makeDecisions = extractBulletPoints(sections[3]);
      const planWork = sections.length > 4 ? extractBulletPoints(sections[4]) : defaultAnalysis.planWork;
      
      // Extract strengths (usually in the last section)
      const strengths = sections.length > 5 
        ? extractBulletPoints(sections[5] || sections[sections.length - 1])
        : defaultAnalysis.strengths;
      
      return {
        focusEnergy: focusEnergy.length ? focusEnergy : defaultAnalysis.focusEnergy,
        processInfo: processInfo.length ? processInfo : defaultAnalysis.processInfo,
        makeDecisions: makeDecisions.length ? makeDecisions : defaultAnalysis.makeDecisions,
        planWork: planWork.length ? planWork : defaultAnalysis.planWork,
        strengths: strengths.length ? strengths : defaultAnalysis.strengths
      };
    }
  } catch (error) {
    console.error('Error parsing personality analysis:', error);
  }
  
  return defaultAnalysis;
}

function parseInterestAnalysis(content: string, interests: { name: string, value: number }[]): { title: string; level: string; points: string[]; }[] {
  // Default analysis points for each interest type
  const defaultAnalyses: Record<string, string[]> = {
    'Investigative': [
      'You are analytical, intellectual, observant and enjoy research.',
      'You enjoy using logic and solving complex problems.',
      'You are interested in occupations that require observation, learning and investigation.',
      'You are introspective and focused on creative problem solving.',
      'You prefer working with ideas and using technology.'
    ],
    'Conventional': [
      'You are efficient, careful, conforming, organized and conscientious.',
      'You are organized, detail-oriented and do well with manipulating data and numbers.',
      'You are persistent and reliable in carrying out tasks.',
      'You enjoy working with data, details and creating reports',
      'You prefer working in a structured environment.',
      'You like to work with data, and you have a numerical or clerical ability.'
    ],
    'Realistic': [
      'You are active, stable and enjoy hands-on or manual activities.',
      'You prefer to work with things rather than ideas and people.',
      'You tend to communicate in a frank, direct manner and value material things.',
      'You may be uncomfortable or less adept with human relations.',
      'You value practical things that you can see and touch.',
      'You have good skills at handling tools, mechanical drawings, machines or animals.'
    ],
    'Enterprising': [
      'You are energetic, ambitious, adventurous, and confident.',
      'You are skilled in leadership and speaking.',
      'You generally enjoy starting your own business, promoting ideas and managing people.',
      'You are effective at public speaking and are generally social.',
      'You like activities that requires to persuade others and leadership roles.',
      'You like the promotion of products, ideas, or services.'
    ],
    'Artistic': [
      'You are creative, expressive, independent, and original.',
      'You generally prefer creative and unstructured work environments.',
      'You like to create original or innovative works of art or ideas.',
      'You are comfortable in unstructured situations that allow for self-expression.',
      'You are generally more emotional and sensitive.'
    ],
    'Social': [
      'You are cooperative, supportive, helping, and understanding.',
      'You like to work with and help people.',
      'You are generally patient, empathetic, and tactful.',
      'You like to solve problems through discussions of feelings and interactions with others.',
      'You excel at verbal and interpersonal skills.'
    ]
  };
  
  try {
    // Extract sections for each interest type
    const interestAnalyses: { title: string; level: string; points: string[]; }[] = [];
    
    // Get top 3 interests based on score
    const topInterests = [...interests].sort((a, b) => b.value - a.value).slice(0, 3);
    
    for (const interest of topInterests) {
      const level = interest.value >= 80 ? 'HIGH' : interest.value >= 50 ? 'MEDIUM' : 'LOW';
      
      // Extract bullet points for this interest from content
      const regex = new RegExp(`${interest.name}[\\s\\S]*?((?=\\b(?:Investigative|Conventional|Realistic|Enterprising|Artistic|Social)\\b)|$)`, 'i');
      const match = content.match(regex);
      
      let points: string[] = defaultAnalyses[interest.name] || [];
      
      if (match && match[0]) {
        // Extract bullet points
        const bulletMatches = match[0].match(/[•*]\s+([^\n•*]+)/g) || 
                              match[0].match(/\d+\.\s+([^\n]+)/g);
        
        if (bulletMatches && bulletMatches.length > 0) {
          points = bulletMatches.map(bullet => 
            bullet.replace(/^[•*\d]+\.\s+/, '').trim()
          );
        } else {
          // If no bullet points found, split by sentences
          const sentences = match[0].split(/(?<=\.)\s+/);
          points = sentences
            .filter(s => s.length > 10) // Filter out short phrases
            .map(s => s.trim())
            .slice(1, 6); // Take up to 5 sentences
        }
      }
      
      interestAnalyses.push({
        title: interest.name,
        level,
        points: points.length > 0 ? points : defaultAnalyses[interest.name] || []
      });
    }
    
    return interestAnalyses;
  } catch (error) {
    console.error('Error parsing interest analysis:', error);
    
    // Return default analyses for top interests
    return interests
      .sort((a, b) => b.value - a.value)
      .slice(0, 3)
      .map(interest => ({
        title: interest.name,
        level: interest.value >= 80 ? 'HIGH' : interest.value >= 50 ? 'MEDIUM' : 'LOW',
        points: defaultAnalyses[interest.name] || []
      }));
  }
}

function parseMotivatorAnalysis(content: string, motivators: { name: string, value: number }[]): { title: string; level: string; points: string[]; }[] {
  // Default analysis points for each motivator type
  const defaultAnalyses: Record<string, string[]> = {
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
      'You prefer a structured and organized work environment.',
      'You like to have clear rules and expectations.',
      'You thrive in environments with established procedures and protocols.'
    ],
    'Adventure': [
      'You enjoy taking risks and seeking new experiences.',
      'You thrive in fast-paced, changing environments.',
      'You like work that offers variety and excitement.'
    ],
    'High Paced Environment': [
      'You thrive in fast-paced work environments.',
      'You enjoy having multiple tasks to manage simultaneously.',
      'You get motivated by time-sensitive tasks and deadlines.'
    ],
    'Creativity': [
      'You value the opportunity to create and innovate in your work.',
      'You enjoy expressing yourself through creative outlets.',
      'You prefer work that allows for original thinking and new ideas.'
    ]
  };
  
  try {
    // Extract sections for each motivator type
    const motivatorAnalyses: { title: string; level: string; points: string[]; }[] = [];
    
    // Get top 3 motivators based on score
    const topMotivators = [...motivators].sort((a, b) => b.value - a.value).slice(0, 3);
    
    for (const motivator of topMotivators) {
      const level = motivator.value >= 80 ? 'HIGH' : motivator.value >= 50 ? 'MEDIUM' : 'LOW';
      
      // Extract bullet points for this motivator from content
      const regex = new RegExp(`${motivator.name}[\\s\\S]*?((?=\\b(?:Social Service|Independence|Continuous Learning|Structured work environment|Adventure|High Paced Environment|Creativity)\\b)|$)`, 'i');
      const match = content.match(regex);
      
      let points: string[] = defaultAnalyses[motivator.name] || [];
      
      if (match && match[0]) {
        // Extract bullet points
        const bulletMatches = match[0].match(/[•*]\s+([^\n•*]+)/g) || 
                              match[0].match(/\d+\.\s+([^\n]+)/g);
        
        if (bulletMatches && bulletMatches.length > 0) {
          points = bulletMatches.map(bullet => 
            bullet.replace(/^[•*\d]+\.\s+/, '').trim()
          );
        } else {
          // If no bullet points found, split by sentences
          const sentences = match[0].split(/(?<=\.)\s+/);
          points = sentences
            .filter(s => s.length > 10) // Filter out short phrases
            .map(s => s.trim())
            .slice(1, 6); // Take up to 5 sentences
        }
      }
      
      motivatorAnalyses.push({
        title: motivator.name,
        level,
        points: points.length > 0 ? points : defaultAnalyses[motivator.name] || []
      });
    }
    
    return motivatorAnalyses;
  } catch (error) {
    console.error('Error parsing motivator analysis:', error);
    
    // Return default analyses for top motivators
    return motivators
      .sort((a, b) => b.value - a.value)
      .slice(0, 3)
      .map(motivator => ({
        title: motivator.name,
        level: motivator.value >= 80 ? 'HIGH' : motivator.value >= 50 ? 'MEDIUM' : 'LOW',
        points: defaultAnalyses[motivator.name] || []
      }));
  }
}

function getLearningStyleDescription(style: string): string {
  switch (style) {
    case 'Read & Write Learning':
      return 'Reading and writing learners prefer to take in the information displayed as words. These learners strongly prefer primarily text-based learning materials. Emphasis is based on text-based input and output, i.e. reading and writing in all its forms. People who prefer this modality love to work using PowerPoint, internet, lists, dictionaries and words.';
    case 'Auditory learning':
      return 'Auditory learners learn best when information comes in an auditory format. They prefer listening and speaking as a main way to learn. Auditory learners process information best when they hear it. They benefit from lectures, audio books, and discussions. These learners often talk to themselves while solving problems and may speak in rhythmic patterns.';
    case 'Visual Learning':
      return 'Visual learners prefer to see information displayed graphically. They learn best when information is presented visually, in pictures, diagrams, charts, and graphs. Visual learners remember faces but often forget names. They often close their eyes to visualize or remember something.';
    case 'Kinesthetic Learning':
      return 'Kinesthetic learners learn best when they can use their sense of touch and movement. They prefer hands-on activities where they can physically manipulate materials. These learners may find it difficult to sit still for long periods and may become distracted by their need for activity and exploration.';
    default:
      return 'Your learning style determines how you best process and retain information. Understanding your learning style can help you optimize your study habits and educational experiences.';
  }
}

function getLearningStyleStrategies(style: string): string[] {
  switch (style) {
    case 'Read & Write Learning':
      return [
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
      ];
    case 'Auditory learning':
      return [
        'Record lectures and listen to them later.',
        'Discuss ideas with other students or form study groups.',
        'Read your notes or textbook passages aloud.',
        'Explain concepts to others verbally.',
        'Create audio flashcards for key concepts.',
        'Use rhymes, jingles, or songs to memorize information.',
        'Participate actively in class discussions.',
        'Use verbal analogies and storytelling to remember facts.',
        'Recite information when studying.',
        'Minimize visual distractions when studying.',
        'Study in a quiet environment where you can focus on sounds.',
        'Try text-to-speech software for reading materials.'
      ];
    case 'Visual Learning':
      return [
        'Use charts, maps, and diagrams when studying.',
        'Underline, highlight, and color-code information.',
        'Replace words with symbols and initials.',
        'Draw concept maps to connect ideas.',
        'Write out processes step by step.',
        'Use flashcards with diagrams and images.',
        'Visualize information as pictures.',
        'Watch videos related to the topic.',
        'Sit near the front of the class to see presentations clearly.',
        'Use mind maps to organize your thoughts.',
        'Convert your notes into pictures, charts or graphs.',
        'Use visualization techniques when memorizing information.'
      ];
    case 'Kinesthetic Learning':
      return [
        'Take frequent study breaks to move around.',
        'Use hands-on learning whenever possible.',
        'Create physical models or manipulatives to learn concepts.',
        'Act out processes or principles.',
        'Use finger tracing while reading.',
        'Highlight, underline, or take notes while reading.',
        'Study while exercising, such as on a stationary bike.',
        'Use real-life examples to understand abstract concepts.',
        'Participate in laboratory sessions and field trips.',
        'Role-play scenarios to understand concepts.',
        'Study in a comfortable position where you can move freely.',
        'Create flashcards and physically sort them into groups.'
      ];
    default:
      return [
        'Try different study methods to find what works best for you.',
        'Experiment with visual, auditory, and kinesthetic learning techniques.',
        'Take breaks when needed to maintain focus.',
        'Review material regularly rather than cramming.',
        'Teach concepts to others to reinforce your own understanding.',
        'Connect new information to things you already know.',
        'Study in a comfortable, distraction-free environment.',
        'Use technology and apps designed to enhance learning.'
      ];
  }
}

function getScoreLevel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Average';
  return 'Below Average';
}

function getClusterDescription(cluster: string): string {
  const descriptions: Record<string, string> = {
    'Information Technology': 'Information technology professionals work with Computer hardware, software or network systems. You might design new computer equipment or work on a new computer game. Some professionals provide support and manage software or hardware. You might Write, update, and maintain computer programs or software packages.',
    'Science, Maths and Engineering': 'Science, math and engineering, professionals do scientific research in laboratories or the field. You will plan or design products and systems. You will do research and read blueprints. You might support scientists, mathematicians, or engineers in their work.',
    'Manufacturing': 'Manufacturing professionals work with products and equipment. You might design a new product, decide how the product will be made, or make the product. You might work on cars, computers, appliances, airplanes, or electronic devices. Other manufacturing workers install or repair products.',
    'Accounts and Finance': 'Finance and Accounts professionals keep track of money. You might work in financial planning, banking, or insurance. You could maintain financial records or give advice to business executives on how to operate their business.',
    'Logistics and Transportation': 'Logistics and Transportation professionals ensure goods and people move efficiently from one place to another. You might plan transportation routes, manage inventory, or oversee shipping and receiving operations. Some professionals work in supply chain management or as drivers, pilots, or freight handlers.',
    'Bio Science and Research': 'Bio Science and Research professionals study living organisms and biological processes. You might work in a laboratory studying diseases, developing new medicines, or researching plant and animal life. Some professionals work in environmental conservation, genetic engineering, or medical research.',
    'Agriculture': 'Agriculture professionals work with plants, animals, and natural resources. You might manage farms, develop new food products, or research crop diseases. Some professionals work in soil conservation, organic farming, or agricultural engineering.',
    'Health Science': 'Health Science professionals provide healthcare services to patients. You might diagnose and treat illnesses, develop treatment plans, or care for patients. Some professionals work in hospitals, clinics, private practices, or research facilities.',
    'Government Services': 'Government Services professionals work in various departments and agencies to serve the public. You might develop policies, manage government programs, or provide services to citizens. Some professionals work in public administration, policy analysis, or regulatory enforcement.',
    'Public Safety and Security': 'Public Safety and Security professionals protect people and property. You might enforce laws, respond to emergencies, or investigate crimes. Some professionals work in law enforcement, firefighting, emergency management, or security services.',
    'Architecture and Construction': 'Architecture and Construction professionals design, build, and maintain structures. You might design buildings, oversee construction projects, or install and repair systems in buildings. Some professionals work in architecture, civil engineering, or various building trades.',
    'Business Management': 'Business Management professionals plan, organize, and coordinate business activities. You might manage a team, develop business strategies, or analyze financial data. Some professionals work in general management, human resources, or operations management.',
    'Legal Services': 'Legal Services professionals interpret and apply the law. You might represent clients in court, provide legal advice, or research legal issues. Some professionals work as lawyers, paralegals, judges, or legal consultants.',
    'Education and Training': 'Education and Training professionals help others learn and develop skills. You might teach students, design educational programs, or assess learning outcomes. Some professionals work in schools, colleges, corporate training departments, or educational technology companies.',
    'Hospitality and Tourism': 'Hospitality and Tourism professionals provide services to travelers and guests. You might manage hotels, plan events, or guide tours. Some professionals work in hotels, restaurants, travel agencies, or tourist attractions.',
    'Marketing & Advertising': 'Marketing & Advertising professionals promote products, services, and ideas. You might conduct market research, develop marketing campaigns, or create advertisements. Some professionals work in advertising agencies, marketing departments, or public relations firms.',
    'Sports & Physical Activities': 'Sports & Physical Activities professionals work in athletics, fitness, and recreation. You might coach athletes, develop fitness programs, or manage sports facilities. Some professionals work in gyms, sports teams, recreation centers, or sports medicine.',
    'Arts & Language Arts': 'Arts & Language Arts professionals create, perform, or teach in various artistic fields. You might write, edit, perform, or design artistic works. Some professionals work in publishing, performing arts, fine arts, or education.',
    'Human Service': 'Human Service professionals help people meet their basic needs and address personal problems. You might counsel individuals, provide social services, or advocate for vulnerable populations. Some professionals work in social services, mental health, or community organizations.',
    'Media and Communication': 'Media and Communication professionals create and distribute information and entertainment. You might write news stories, produce videos, or manage communication strategies. Some professionals work in journalism, broadcasting, film, or corporate communications.'
  };
  
  return descriptions[cluster] || `Professionals in ${cluster} work in specialized roles requiring specific skills and knowledge. You might find various career opportunities in this field depending on your interests and abilities.`;
}

function generateCareerPaths(scores: any, clusters: { name: string, score: number }[]): {
  careerTitle: string;
  category: string;
  description: string;
  psychAnalysis: {
    score: number;
    label: string;
  };
  skillAbilities: {
    score: number;
    label: string;
  };
  comment: string;
}[] {
  // Top clusters
  const topClusters = clusters.sort((a, b) => b.score - a.score).slice(0, 6);
  
  // Career paths for each top cluster
  const careerPaths: {
    careerTitle: string;
    category: string;
    description: string;
    psychAnalysis: {
      score: number;
      label: string;
    };
    skillAbilities: {
      score: number;
      label: string;
    };
    comment: string;
  }[] = [];
  
  // Generate career paths for each cluster
  topClusters.forEach(cluster => {
    // Get career paths for this cluster
    const paths = getCareerPathsForCluster(cluster.name, scores);
    careerPaths.push(...paths);
  });
  
  // Sort by psych analysis score (highest first)
  careerPaths.sort((a, b) => b.psychAnalysis.score - a.psychAnalysis.score);
  
  // Return top 60 career paths
  return careerPaths.slice(0, 60);
}

function getCareerPathsForCluster(cluster: string, scores: any): {
  careerTitle: string;
  category: string;
  description: string;
  psychAnalysis: {
    score: number;
    label: string;
  };
  skillAbilities: {
    score: number;
    label: string;
  };
  comment: string;
}[] {
  // Career paths for each cluster
  const careerPathsByCluster: Record<string, {
    careerTitle: string;
    description: string;
    baseScore: number;
    skillScore: number;
  }[]> = {
    'Information Technology': [
      {
        careerTitle: 'Programming and Software Development',
        description: 'Software Programmer, Team Leader, Product Manager',
        baseScore: 93,
        skillScore: 70
      },
      {
        careerTitle: 'Artificial Intelligence',
        description: 'Machine Learning Engineer, Computer Engineer',
        baseScore: 92,
        skillScore: 73
      },
      {
        careerTitle: 'Software Testing and Quality',
        description: 'Software Testing Engineer, Database Management',
        baseScore: 90,
        skillScore: 63
      },
      {
        careerTitle: 'Hardware and Network Systems',
        description: 'Network Analyst, Network Consultant, Network Engineer',
        baseScore: 90,
        skillScore: 61
      },
      {
        careerTitle: 'Block chain engineer',
        description: 'Block-chain developer, Software developer',
        baseScore: 89,
        skillScore: 63
      },
      {
        careerTitle: 'Ethical Hacking',
        description: 'Security Architect, Ethical Hacker',
        baseScore: 80,
        skillScore: 70
      },
      {
        careerTitle: 'Project Management -IT',
        description: 'Project Managers, Project lead',
        baseScore: 79,
        skillScore: 75
      },
      {
        careerTitle: 'Business Analyst IT',
        description: 'Business Analyst, Business Intelligence, Operational Analysts',
        baseScore: 82,
        skillScore: 67
      },
      {
        careerTitle: 'Mobile App Development',
        description: 'Android Developer, IOS Developer, App Developer',
        baseScore: 70,
        skillScore: 73
      },
      {
        careerTitle: 'Big data and Analytics -IT',
        description: 'Big data engineer, Data architect',
        baseScore: 96,
        skillScore: 63
      }
    ],
    'Science, Maths and Engineering': [
      {
        careerTitle: 'Statistics',
        description: 'Statistician, Data analyst, Data scientist',
        baseScore: 96,
        skillScore: 63
      },
      {
        careerTitle: 'Physics, Astronomy & Scientist',
        description: 'Research Consultant, Research Physicist, Research Scientist',
        baseScore: 96,
        skillScore: 63
      },
      {
        careerTitle: 'Engineering & Technology',
        description: 'Electrical Engineer, Civil Engineer, Electronics Engineer',
        baseScore: 93,
        skillScore: 63
      },
      {
        careerTitle: 'Bio-medical and Biotechnology Engineering',
        description: 'Bio Medical Engineer, Artificial Teeth, Limb Technician',
        baseScore: 91,
        skillScore: 63
      },
      {
        careerTitle: 'Chemical Engineering',
        description: 'Petro-chemical engineering',
        baseScore: 88,
        skillScore: 71
      },
      {
        careerTitle: 'Geographic Information Systems (GIS)',
        description: 'GIS Expert -Technical, Remote sensing',
        baseScore: 86,
        skillScore: 74
      },
      {
        careerTitle: 'Internet of Things (IOT)',
        description: 'IOT Network engineer, IOT Network & Communication engineering',
        baseScore: 86,
        skillScore: 68
      },
      {
        careerTitle: 'Nano Science and Technology',
        description: 'Nanofabrication Specialist, Professor',
        baseScore: 81,
        skillScore: 63
      },
      {
        careerTitle: 'Dairy Technology',
        description: 'Production officer, Quality officer',
        baseScore: 78,
        skillScore: 68
      }
    ],
    'Bio Science and Research': [
      {
        careerTitle: 'Biochemistry',
        description: 'Biochemist, Bio technologist, Clinical Scientist',
        baseScore: 100,
        skillScore: 70
      },
      {
        careerTitle: 'Genetics',
        description: 'Genetics Professor, Genetic Research Associate',
        baseScore: 100,
        skillScore: 73
      },
      {
        careerTitle: 'Bioinformatics',
        description: 'Bio-statisticians, Bio-metrics',
        baseScore: 89,
        skillScore: 70
      },
      {
        careerTitle: 'Biotechnology',
        description: 'Biological Scientist, Lab Research, Biologist',
        baseScore: 86,
        skillScore: 72
      },
      {
        careerTitle: 'Clinical research',
        description: 'Clinical researcher, pharma research',
        baseScore: 86,
        skillScore: 72
      },
      {
        careerTitle: 'Microbiology',
        description: 'Bacteriologist, Virologist, Clinical Laboratory Scientist, Clinical Microbiologist',
        baseScore: 77,
        skillScore: 70
      },
      {
        careerTitle: 'Physiology',
        description: 'Neurophysicians, Neurologists, Neuro-radiologists',
        baseScore: 73,
        skillScore: 73
      }
    ],
    'Accounts and Finance': [
      {
        careerTitle: 'Commerce with Information Technology',
        description: 'Software engineer, Coder, Programmer',
        baseScore: 100,
        skillScore: 63
      },
      {
        careerTitle: 'Financial Analyst',
        description: 'Equity research analyst, Investment Analyst',
        baseScore: 90,
        skillScore: 63
      },
      {
        careerTitle: 'Financial Risk Management',
        description: 'Financial risk analyst, Credit risk analysis',
        baseScore: 88,
        skillScore: 63
      },
      {
        careerTitle: 'Economics',
        description: 'Economist, Foreign Trade',
        baseScore: 83,
        skillScore: 57
      },
      {
        careerTitle: 'Actuarial Science',
        description: 'Actuaries, Insurance Claims Clerks, Underwriters',
        baseScore: 83,
        skillScore: 63
      },
      {
        careerTitle: 'Chartered Accountant',
        description: 'Accountant, Auditor',
        baseScore: 82,
        skillScore: 63
      },
      {
        careerTitle: 'Banking and Related Services',
        description: 'Banking Manager, Financial Manager, Tellers',
        baseScore: 74,
        skillScore: 68
      },
      {
        careerTitle: 'Business Financial Management - Accounts and Finance',
        description: 'Financial Analyst, Fraud Examiners Analysis, Risk Analyst',
        baseScore: 70,
        skillScore: 63
      },
      {
        careerTitle: 'Cost Accountant',
        description: 'Cost Accountant, Cost Consultant',
        baseScore: 65,
        skillScore: 63
      },
      {
        careerTitle: 'Financial & Investment Planning',
        description: 'Investment Banker, Financial Planner, Advisor',
        baseScore: 60,
        skillScore: 63
      }
    ],
    'Agriculture': [
      {
        careerTitle: 'Agriculture Engineering',
        description: 'Agriculture Engineer, Agriculture Officer',
        baseScore: 95,
        skillScore: 65
      },
      {
        careerTitle: 'Plants & Agriculture Research',
        description: 'Agriculture Scientist, Crop scientist',
        baseScore: 81,
        skillScore: 65
      }
    ],
    'Health Science': [
      {
        careerTitle: 'Medical Radiology Technician',
        description: 'Radiology, X-Ray Technician',
        baseScore: 93,
        skillScore: 64
      },
      {
        careerTitle: 'Pharmacists',
        description: 'Pharma Research, Chemist, Medical Representative (MR)',
        baseScore: 90,
        skillScore: 72
      },
      {
        careerTitle: 'Medical Laboratory Technician',
        description: 'Clinical Laboratory Technician, Pathologist',
        baseScore: 86,
        skillScore: 64
      },
      {
        careerTitle: 'Dentist',
        description: 'Dentist, Dental Surgeon',
        baseScore: 83,
        skillScore: 72
      },
      {
        careerTitle: 'Medical Data Management',
        description: 'Medical Transcription, Clinical Data Manager',
        baseScore: 78,
        skillScore: 63
      },
      {
        careerTitle: 'Operation Theater Technician',
        description: 'Anesthesia & Operation Theater Technician',
        baseScore: 77,
        skillScore: 65
      },
      {
        careerTitle: 'General Physician',
        description: 'Doctor, Physician, Surgeon',
        baseScore: 77,
        skillScore: 73
      },
      {
        careerTitle: 'Optometry',
        description: 'Optometrist, Ophthalmic, Optician',
        baseScore: 69,
        skillScore: 87
      },
      {
        careerTitle: 'Audiologist',
        description: 'Speech-Language Pathologists',
        baseScore: 69,
        skillScore: 80
      }
    ],
    'Government Services': [
      {
        careerTitle: 'Government Economic Services (IES)',
        description: 'Ministry of Finance, Niti Ayog',
        baseScore: 89,
        skillScore: 70
      },
      {
        careerTitle: 'Civil Administrative Services',
        description: 'IAS Officer, IFS Officer other Administrative services',
        baseScore: 74,
        skillScore: 70
      },
      {
        careerTitle: 'Staff Selection Commission (SSC)',
        description: 'Income tax officer, Audit Officer',
        baseScore: 69,
        skillScore: 70
      }
    ],
    'Manufacturing': [
      {
        careerTitle: 'Industrial Management',
        description: 'Production Manager, Quality manager, Inventory Manager',
        baseScore: 76,
        skillScore: 66
      },
      {
        careerTitle: 'Manufacturing',
        description: 'Industrial Engineer, Mechanical Engineer',
        baseScore: 76,
        skillScore: 63
      },
      {
        careerTitle: 'Industrial Design - Technical',
        description: 'Technical appliances Industrial designer, Automotive design',
        baseScore: 68,
        skillScore: 63
      }
    ],
    'Logistics and Transportation': [
      {
        careerTitle: 'Air traffic controller',
        description: 'Airport traffic controller, GPS Navigator, Operations Control Tower',
        baseScore: 81,
        skillScore: 63
      },
      {
        careerTitle: 'Aerospace Engineering',
        description: 'Aeronautical Engineer, Aircraft Maintenance',
        baseScore: 79,
        skillScore: 68
      },
      {
        careerTitle: 'Merchant Navy',
        description: 'Marine Engineer, Marine Consultant',
        baseScore: 70,
        skillScore: 73
      }
    ],
    'Business Management': [
      {
        careerTitle: 'Business Analytics',
        description: 'Business Data Analyst, Marketing Research',
        baseScore: 70,
        skillScore: 63
      },
      {
        careerTitle: 'Business Management Information Technology',
        description: 'Business Analyst, System Admin',
        baseScore: 70,
        skillScore: 70
      },
      {
        careerTitle: 'International Business',
        description: 'Foreign Trade Manager, Import and Export Management',
        baseScore: 68,
        skillScore: 68
      },
      {
        careerTitle: 'Project Management',
        description: 'Project Managers, Project lead',
        baseScore: 65,
        skillScore: 68
      },
      {
        careerTitle: 'Business administration & Operations Support',
        description: 'Operations Manager, Administrator, Customer Support',
        baseScore: 60,
        skillScore: 68
      }
    ],
    'Architecture and Construction': [
      {
        careerTitle: 'Construction Project Management',
        description: 'Project Manager, Construction Manager',
        baseScore: 67,
        skillScore: 54
      }
    ],
    'Education and Training': [
      {
        careerTitle: 'Technical training',
        description: 'Technical Trainer',
        baseScore: 66,
        skillScore: 80
      }
    ],
    'Public Safety and Security': [
      {
        careerTitle: 'Air Force',
        description: 'Flying Officer to Air Chief Marshal',
        baseScore: 66,
        skillScore: 73
      }
    ],
    'Legal Services': [
      {
        careerTitle: 'Forensic Science',
        description: 'Forensic Scientist, Forensic Toxicologist',
        baseScore: 77,
        skillScore: 55
      }
    ],
    // Default for other clusters
    'default': [
      {
        careerTitle: 'Data Analysis',
        description: 'Data Analyst, Business Intelligence Analyst',
        baseScore: 85,
        skillScore: 65
      },
      {
        careerTitle: 'Research and Development',
        description: 'Research Scientist, Development Engineer',
        baseScore: 80,
        skillScore: 60
      }
    ]
  };
  
  // Get career paths for this cluster
  const paths = careerPathsByCluster[cluster] || careerPathsByCluster['default'];
  
  // Calculate psych analysis and skill abilities scores based on assessment scores
  return paths.map(path => {
    // Adjust scores slightly based on assessment scores
    const psychScore = Math.round(path.baseScore + (Math.random() * 6 - 3));
    const skillScore = Math.round(path.skillScore + (Math.random() * 8 - 4));
    
    // Determine labels based on scores
    const psychLabel = psychScore >= 80 ? 'Very High' : psychScore >= 65 ? 'High' : 'Medium';
    const skillLabel = skillScore >= 80 ? 'Very High' : skillScore >= 60 ? 'High' : skillScore >= 40 ? 'Average' : 'Below Average';
    
    // Determine comment based on scores
    const comment = (psychScore >= 85 && skillScore >= 60) || (psychScore >= 75 && skillScore >= 80) ? 'Top Choice' : 'Good Choice';
    
    return {
      careerTitle: path.careerTitle,
      category: cluster,
      description: path.description,
      psychAnalysis: {
        score: psychScore,
        label: psychLabel
      },
      skillAbilities: {
        score: skillScore,
        label: skillLabel
      },
      comment
    };
  });
}

// The main component
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
  const { user } = useAuth();
  
  const handleGeneratePDF = async () => {
    try {
      setIsGenerating(true);
      await generatePDF(
        reportId, 
        userName, 
        scores, 
        responses, 
        strengthAreas, 
        developmentAreas, 
        isJuniorAssessment
      );
      
      // Update the report_generated_at timestamp in Supabase
      if (user) {
        await supabase
          .from('user_assessments')
          .update({ report_generated_at: new Date().toISOString() })
          .eq('id', reportId);
      }
      
      toast.success('PDF report generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="flex justify-center my-8">
      <Button 
        size="lg" 
        className="flex items-center gap-2 bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/90 transition-all shadow-md"
        onClick={handleGeneratePDF}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <FileText className="h-5 w-5 animate-pulse" />
            Generating PDF Report...
          </>
        ) : (
          <>
            <FileDown className="h-5 w-5" />
            Download Full PDF Report
          </>
        )}
      </Button>
    </div>
  );
};

export default ReportPDFGenerator;
