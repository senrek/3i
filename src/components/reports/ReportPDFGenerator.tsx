
import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDown } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import * as pdfUtils from '@/utils/pdfFormatting';

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
    
    // Helper function to add a new page
    const addNewPage = () => {
      doc.addPage();
      currentPage++;
      
      // Add header and footer to new page
      const headerEndY = pdfUtils.addHeaderWithLogo(doc);
      pdfUtils.addPageFooter(doc, userInfo.name, currentPage);
      
      // Return starting Y position for content
      return headerEndY.lastY;
    };
    
    // Start building the report
    // Add header
    let yPosition = pdfUtils.addHeaderWithLogo(doc).lastY;
    
    // Add report title
    yPosition = pdfUtils.addReportTitle(doc).lastY;
    
    // Add user info
    yPosition = pdfUtils.addUserInfo(doc, userInfo);
    
    // Add disclaimer
    yPosition = pdfUtils.addDisclaimer(doc, yPosition);
    
    // Add page footer
    pdfUtils.addPageFooter(doc, userInfo.name, currentPage);
    
    // Add section title for profiling
    yPosition = pdfUtils.addSectionTitle(doc, yPosition, 'Career Planning Profiling');
    
    // Prepare profiling data based on enhancedContent
    const profilingData = {
      currentStage: 'Diffused',
      description: 'You are at the diffused stage in career planning. We understand that you have a fair idea of your suitable career. At this stage, you have a better understanding of career options. However, you are looking for more information to understand the complete career path for yourself and an execution plan to achieve it.',
      riskInvolved: 'Career misalignment, career path misjudgment, wrong career path projections, unnecessary stress',
      actionPlan: 'Explore career path > Align your abilities and interests with the best possible career path > Realistic Execution Plan > Timely Review of Action Plan'
    };
    
    // If we have AI-enhanced content, use it
    if (enhancedContent && enhancedContent.metadata) {
      if (enhancedContent.metadata.careerPlanningStage) {
        profilingData.currentStage = enhancedContent.metadata.careerPlanningStage;
      }
      if (enhancedContent.metadata.careerRisks) {
        profilingData.riskInvolved = enhancedContent.metadata.careerRisks;
      }
      if (enhancedContent.metadata.careerActionPlan) {
        profilingData.actionPlan = enhancedContent.metadata.careerActionPlan;
      }
    }
    
    const profilingEndY = pdfUtils.addProfilingSection(doc, yPosition, profilingData);
    
    // Check if we need to add a new page
    if (profilingEndY.lastY > doc.internal.pageSize.height - 40) {
      yPosition = addNewPage();
    } else {
      yPosition = profilingEndY.lastY + 10;
    }
    
    // Add section title for personality
    yPosition = pdfUtils.addSectionTitle(doc, yPosition, 'Career Personality');
    
    // Prepare personality data
    const personalityType = enhancedContent?.metadata?.personalityType || 
      'Introvert:Sensing:Thinking:Judging'; // Default if not provided
      
    const personalityData = {
      introvertExtrovert: { introvert: 86, extrovert: 14 },
      sensingIntuitive: { sensing: 86, intuitive: 14 },
      thinkingFeeling: { thinking: 71, feeling: 29 },
      judgingPerceiving: { judging: 57, perceiving: 43 }
    };
    
    const personalityChartEndY = pdfUtils.addPersonalityTypeChart(doc, yPosition, personalityData, personalityType);
    
    // Check if we need to add a new page
    if (personalityChartEndY.lastY > doc.internal.pageSize.height - 40) {
      yPosition = addNewPage();
    } else {
      yPosition = personalityChartEndY.lastY + 10;
    }
    
    // Add personality analysis
    const personalityAnalysisData = {
      focusEnergy: [
        'You mostly get your energy from dealing with ideas, pictures, memories and reactions which are part of your imaginative world.',
        'You are quiet, reserved and like to spend your time alone.'
      ],
      processInfo: [
        'You mostly collect and trust the information that is presented in a detailed and sequential manner.',
        'You think more about the present and learn from the past.'
      ],
      makeDecisions: [
        'You seem to make decisions based on logic rather than the circumstances.',
        'You believe telling truth is more important than being tactful.'
      ],
      planWork: [
        'You prefer a planned or orderly way of life.',
        'You like to have things well-organized.'
      ],
      strengths: [
        'Strong-willed and dutiful',
        'Calm and practical',
        'Honest and direct'
      ]
    };
    
    const personalityAnalysisEndY = pdfUtils.addPersonalityAnalysis(doc, yPosition, personalityAnalysisData);
    
    // Add new page for Interest section
    yPosition = addNewPage();
    
    // Add section title for interest
    yPosition = pdfUtils.addSectionTitle(doc, yPosition, 'Career Interest');
    
    // Prepare interest data
    const interestData = [
      { name: 'Investigative', value: 100 },
      { name: 'Conventional', value: 55 },
      { name: 'Realistic', value: 55 },
      { name: 'Enterprising', value: 33 },
      { name: 'Artistic', value: 21 },
      { name: 'Social', value: 12 }
    ];
    
    const interestChartEndY = pdfUtils.addInterestBarChart(doc, yPosition, interestData);
    
    // Check if we need to add a new page
    if (interestChartEndY.lastY > doc.internal.pageSize.height - 40) {
      yPosition = addNewPage();
    } else {
      yPosition = interestChartEndY.lastY + 10;
    }
    
    // Add interest analysis
    const interestAnalysisData = [
      {
        title: 'Investigative',
        level: 'HIGH',
        points: [
          'You are analytical, intellectual, observant and enjoy research.',
          'You enjoy using logic and solving complex problems.'
        ]
      },
      {
        title: 'Conventional',
        level: 'HIGH',
        points: [
          'You are efficient, careful, conforming, organized and conscientious.',
          'You are organized, detail-oriented and do well with manipulating data and numbers.'
        ]
      }
    ];
    
    const interestAnalysisEndY = pdfUtils.addInterestAnalysis(doc, yPosition, interestAnalysisData);
    
    // Add new page for Career Motivator section
    yPosition = addNewPage();
    
    // Add section title for motivator
    yPosition = pdfUtils.addSectionTitle(doc, yPosition, 'Career Motivator');
    
    // Prepare motivator data
    const motivatorData = [
      { name: 'Independence', value: 100 },
      { name: 'Continuous Learning', value: 100 },
      { name: 'Social Service', value: 100 },
      { name: 'Structured work environment', value: 40 },
      { name: 'Adventure', value: 40 },
      { name: 'High Paced Environment', value: 20 },
      { name: 'Creativity', value: 20 }
    ];
    
    const motivatorChartEndY = pdfUtils.addCareerMotivatorChart(doc, yPosition, motivatorData);
    
    // Check if we need to add a new page
    if (motivatorChartEndY.lastY > doc.internal.pageSize.height - 40) {
      yPosition = addNewPage();
    } else {
      yPosition = motivatorChartEndY.lastY + 10;
    }
    
    // Add motivator analysis
    const motivatorAnalysisData = [
      {
        title: 'Social Service',
        level: 'HIGH',
        points: [
          'You like to do work which has some social responsibility.',
          'You like to do work which impacts the world.'
        ]
      },
      {
        title: 'Independence',
        level: 'HIGH',
        points: [
          'You enjoy working independently.',
          'You dislike too much supervision.'
        ]
      }
    ];
    
    const motivatorAnalysisEndY = pdfUtils.addMotivatorAnalysis(doc, yPosition, motivatorAnalysisData);
    
    // Add new page for Learning Style section
    yPosition = addNewPage();
    
    // Add section title for learning style
    yPosition = pdfUtils.addSectionTitle(doc, yPosition, 'Learning Style');
    
    // Prepare learning style data
    const learningStyleData = [
      { name: 'Read & Write Learning', value: 38 },
      { name: 'Auditory learning', value: 25 },
      { name: 'Visual Learning', value: 25 },
      { name: 'Kinesthetic Learning', value: 13 }
    ];
    
    const learningStyleChartEndY = pdfUtils.addLearningStylePieChart(doc, yPosition, learningStyleData);
    
    // Check if we need to add a new page
    if (learningStyleChartEndY.lastY > doc.internal.pageSize.height - 40) {
      yPosition = addNewPage();
    } else {
      yPosition = learningStyleChartEndY.lastY + 10;
    }
    
    // Add learning style analysis
    const learningStyleAnalysisData = {
      title: 'Read/Write learning style',
      description: [
        'Reading and writing learners prefer to take in the information displayed as words.',
        'These learners strongly prefer primarily text-based learning materials.'
      ],
      strategies: [
        'Re-write your notes after class.',
        'Use coloured pens and highlighters to focus on key ideas.',
        'Write notes to yourself in the margins.'
      ]
    };
    
    const learningStyleAnalysisEndY = pdfUtils.addLearningStyleAnalysis(doc, yPosition, learningStyleAnalysisData);
    
    // Add new page for Skills section
    yPosition = addNewPage();
    
    // Add section title for skills
    yPosition = pdfUtils.addSectionTitle(doc, yPosition, 'Skills and Abilities');
    
    // Prepare skills data
    const skillsData = [
      {
        name: 'overall',
        value: 70,
        level: 'Good',
        description: []
      },
      {
        name: 'numerical',
        value: 80,
        level: 'Good',
        description: [
          'Your numerical skills are good.',
          'Numeracy involves an understanding of numerical data and numbers.'
        ]
      },
      {
        name: 'logical',
        value: 60,
        level: 'Average',
        description: [
          'Your logical skills are average.',
          'Logical thinking is very important for analytical profiles.'
        ]
      },
      {
        name: 'verbal',
        value: 100,
        level: 'Excellent',
        description: [
          'Your communication skills are excellent.',
          'Excellent verbal and written communication helps you to communicate your message effectively.'
        ]
      }
    ];
    
    const skillsEndY = pdfUtils.addSkillBarChart(doc, yPosition, skillsData);
    
    // Add new page for Career Clusters section
    yPosition = addNewPage();
    
    // Add section title for career clusters
    yPosition = pdfUtils.addSectionTitle(doc, yPosition, 'Career Clusters');
    
    // Prepare clusters data
    const clustersData = [
      { name: 'Information Technology', score: 98 },
      { name: 'Science, Maths and Engineering', score: 98 },
      { name: 'Manufacturing', score: 84 },
      { name: 'Accounts and Finance', score: 82 },
      { name: 'Logistics and Transportation', score: 81 },
      { name: 'Bio Science and Research', score: 78 },
      { name: 'Agriculture', score: 74 },
      { name: 'Health Science', score: 74 }
    ];
    
    const clustersChartEndY = pdfUtils.addCareerClusters(doc, yPosition, clustersData);
    
    // Check if we need to add a new page
    if (clustersChartEndY.lastY > doc.internal.pageSize.height - 40) {
      yPosition = addNewPage();
    } else {
      yPosition = clustersChartEndY.lastY + 10;
    }
    
    // Add selected career clusters
    const selectedClustersData = [
      {
        rank: 1,
        name: 'Information Technology',
        description: [
          'Information technology professionals work with Computer hardware, software or network systems.',
          'You might design new computer equipment or work on a new computer game.',
          'Some professionals provide support and manage software or hardware.'
        ]
      },
      {
        rank: 2,
        name: 'Science, Maths and Engineering',
        description: [
          'Science, math and engineering, professionals do scientific research in laboratories or the field.',
          'You will plan or design products and systems.',
          'You will do research and read blueprints.'
        ]
      }
    ];
    
    const selectedClustersEndY = pdfUtils.addSelectedCareerClusters(doc, yPosition, selectedClustersData);
    
    // Add new page for Career Paths section
    yPosition = addNewPage();
    
    // Add section title for career paths
    yPosition = pdfUtils.addSectionTitle(doc, yPosition, 'Career Paths');
    
    // Prepare career paths data
    const careerPathsData = [
      {
        careerTitle: 'Biochemistry',
        category: 'Bio Science and Research',
        description: 'Biochemist, Bio technologist, Clinical Scientist',
        psychAnalysis: { score: 100, label: 'Very High' },
        skillAbilities: { score: 70, label: 'High' },
        comment: 'Top Choice'
      },
      {
        careerTitle: 'Genetics',
        category: 'Bio Science and Research',
        description: 'Genetics Professor, Genetic Research Associate',
        psychAnalysis: { score: 100, label: 'Very High' },
        skillAbilities: { score: 73, label: 'High' },
        comment: 'Top Choice'
      }
    ];
    
    const careerPathsEndY = pdfUtils.addCareerPaths(doc, yPosition, careerPathsData);
    
    // Check if we need to add a new page
    if (careerPathsEndY.lastY > doc.internal.pageSize.height - 40) {
      yPosition = addNewPage();
    } else {
      yPosition = careerPathsEndY.lastY + 10;
    }
    
    // Add summary sheet
    const summaryData = {
      careerPersonality: 'Introvert + Sensing + Thinking + Judging',
      careerInterest: 'Investigative + Realistic + Conventional',
      careerMotivator: 'Independence + Social Service + Continuous Learning',
      learningStyle: 'Read & Write Learning',
      skillsAbilities: 'Numerical Ability[80%] + Logical Ability[60%] + Verbal Ability[100%]',
      selectedClusters: 'Accounts and Finance + Information Technology + Science, Maths and Engineering'
    };
    
    const summaryEndY = pdfUtils.addSummarySheet(doc, yPosition, summaryData);
    
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
      const isJuniorAssessment = responses?.assessmentType === 'career-analysis-junior' || 
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
          Generate a comprehensive PDF report with your assessment results
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-center text-muted-foreground max-w-lg">
            This report includes your personality profile, career interests, skill analysis, 
            and personalized recommendations based on your assessment results.
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
