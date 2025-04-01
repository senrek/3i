
import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Button } from '@/components/ui/button';
import { FileDown, FileClock } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import {
  addHeaderWithLogo,
  addReportTitle,
  addUserInfo,
  addDisclaimer,
  addProfilingSection,
  addPageFooter,
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
  userName: string,
  scores: any,
  responses: Record<string, any> | null,
  strengthAreas: string[],
  developmentAreas: string[],
  isJuniorAssessment: boolean = false
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
      addHeaderWithLogo(doc, pageNumber);
      addPageFooter(doc, userName, pageNumber);
      return 20; // Start y position after adding header
    };

    // Add report header and basic info on the first page
    addHeaderWithLogo(doc, pageNumber);
    addReportTitle(doc);

    // Get user info if available in responses
    const userEmail = responses?.email || '';
    const userPhone = responses?.phone || '';
    const userAge = responses?.age || '';
    const userLocation = responses?.location || '';

    // Add user info section
    const { lastY: userInfoEndY } = addUserInfo(doc, userName, userEmail, userPhone, userAge, userLocation);
    
    // Add disclaimer
    addDisclaimer(doc, userInfoEndY);
    
    // Add page footer
    addPageFooter(doc, userName, pageNumber);

    // Start a new page for the profiling section
    yPosition = addNewPage();

    // Add profiling section
    // Prepare profiling data
    const profilingData = {
      currentStage: "Diffused",
      description: "Diffused: You are at the diffused stage in career planning. We understand that you have a fair idea of your suitable career. At this stage, you have a better understanding of career options. However, you are looking for more information to understand the complete career path for yourself and an execution plan to achieve it. Lack of complete information and execution plan can adversely impact your career. Most career decisions are based on limited information",
      riskInvolved: "Career misalignment, career path misjudgment, wrong career path projections, unnecessary stress",
      actionPlan: "Explore career path > Align your abilities and interests with the best possible career path > Realistic Execution Plan > Timely Review of Action Plan"
    };
    
    const { lastY: profilingEndY } = addProfilingSection(doc, yPosition, profilingData);

    // Check if we need to add a new page
    if (profilingEndY > doc.internal.pageSize.height - 40) {
      yPosition = addNewPage();
    } else {
      yPosition = profilingEndY + 20;
    }

    // Add personality type chart
    // Prepare personality data
    const personalityData = {
      introvertExtrovert: { introvert: 86, extrovert: 14 },
      sensingIntuitive: { sensing: 86, intuitive: 14 },
      thinkingFeeling: { thinking: 71, feeling: 29 },
      judgingPerceiving: { judging: 57, perceiving: 43 }
    };
    
    const { lastY: personalityChartEndY } = addPersonalityTypeChart(doc, yPosition, personalityData);

    // Check if we need to add a new page
    if (personalityChartEndY > doc.internal.pageSize.height - 40) {
      yPosition = addNewPage();
    } else {
      yPosition = personalityChartEndY + 20;
    }

    // Add personality analysis
    // Prepare personality analysis data
    const personalityAnalysisData = {
      focusEnergy: [
        "You mostly get your energy from dealing with ideas, pictures, memories and reactions which are part of your imaginative world.",
        "You are quiet, reserved and like to spend your time alone.",
        "Your primary mode of living is focused internally.",
        "You are passionate but not usually aggressive.",
        "You are a good listener.",
        "You are more of an inside-out person."
      ],
      processInfo: [
        "You mostly collect and trust the information that is presented in a detailed and sequential manner.",
        "You think more about the present and learn from the past.",
        "You like to see the practical use of things and learn best from practice.",
        "You notice facts and remember details that are important to you.",
        "You solve problems by working through facts until you understand the problem.",
        "You create meaning from conscious thought and learn by observation."
      ],
      makeDecisions: [
        "You seem to make decisions based on logic rather than the circumstances.",
        "You believe telling truth is more important than being tactful.",
        "You seem to look for logical explanations or solutions to almost everything.",
        "You can often be seen as very task-oriented, uncaring, or indifferent.",
        "You are ruled by your head instead of your heart.",
        "You are a critical thinker and oriented toward problem solving."
      ],
      planWork: [
        "You prefer a planned or orderly way of life.",
        "You like to have things well-organized.",
        "Your productivity increases when working with structure.",
        "You are self-disciplined and decisive.",
        "You like to have things decided and planned before doing any task.",
        "You seek closure and enjoy completing tasks.",
        "Mostly, you think sequentially."
      ],
      strengths: [
        "Strong-willed and dutiful",
        "Calm and practical",
        "Honest and direct",
        "Very responsible",
        "Create and enforce order"
      ]
    };
    
    const { lastY: personalityAnalysisEndY } = addPersonalityAnalysis(doc, yPosition, personalityAnalysisData);

    // Start a new page for interest section
    yPosition = addNewPage();

    // Add interest bar chart
    // Prepare interest data
    const interestData = [
      { name: 'Investigative', value: 100 },
      { name: 'Conventional', value: 55 },
      { name: 'Realistic', value: 55 },
      { name: 'Enterprising', value: 33 },
      { name: 'Artistic', value: 21 },
      { name: 'Social', value: 12 }
    ];
    
    const { lastY: interestChartEndY } = addInterestBarChart(doc, yPosition, interestData);

    // Check if we need to add a new page
    if (interestChartEndY > doc.internal.pageSize.height - 40) {
      yPosition = addNewPage();
    } else {
      yPosition = interestChartEndY + 20;
    }

    // Add interest analysis
    // Prepare interest analysis data
    const interestAnalysisData = [
      { 
        title: "Investigative", 
        level: "HIGH", 
        points: [
          "You are analytical, intellectual, observant and enjoy research.",
          "You enjoy using logic and solving complex problems.",
          "You are interested in occupations that require observation, learning and investigation.",
          "You are introspective and focused on creative problem solving.",
          "You prefer working with ideas and using technology."
        ]
      },
      { 
        title: "Conventional", 
        level: "HIGH", 
        points: [
          "You are efficient, careful, conforming, organized and conscientious.",
          "You are organized, detail-oriented and do well with manipulating data and numbers.",
          "You are persistent and reliable in carrying out tasks.",
          "You enjoy working with data, details and creating reports",
          "You prefer working in a structured environment.",
          "You like to work with data, and you have a numerical or clerical ability."
        ]
      }
    ];
    
    const { lastY: interestAnalysisEndY } = addInterestAnalysis(doc, yPosition, interestAnalysisData);

    // Start a new page for motivator section
    yPosition = addNewPage();

    // Add motivator chart
    // Prepare motivator data
    const motivatorData = [
      { name: 'Independence', value: 100 },
      { name: 'Continuous Learning', value: 100 },
      { name: 'Social Service', value: 100 },
      { name: 'Structured work environment', value: 40 },
      { name: 'Adventure', value: 40 }
    ];
    
    const { lastY: motivatorChartEndY } = addCareerMotivatorChart(doc, yPosition, motivatorData);

    // Check if we need to add a new page
    if (motivatorChartEndY > doc.internal.pageSize.height - 40) {
      yPosition = addNewPage();
    } else {
      yPosition = motivatorChartEndY + 20;
    }

    // Add motivator analysis
    // Prepare motivator analysis data
    const motivatorAnalysisData = [
      { 
        title: "Social Service", 
        level: "HIGH", 
        points: [
          "You like to do work which has some social responsibility.",
          "You like to do work which impacts the world.",
          "You like to receive social recognition for the work that you do."
        ]
      },
      { 
        title: "Independence", 
        level: "HIGH", 
        points: [
          "You enjoy working independently.",
          "You dislike too much supervision.",
          "You dislike group activities."
        ]
      }
    ];
    
    const { lastY: motivatorAnalysisEndY } = addMotivatorAnalysis(doc, yPosition, motivatorAnalysisData);

    // Start a new page for learning style section
    yPosition = addNewPage();

    // Add learning style chart
    // Prepare learning style data
    const learningStyleData = [
      { name: 'Read & Write Learning', value: 38 },
      { name: 'Auditory learning', value: 25 },
      { name: 'Visual Learning', value: 25 },
      { name: 'Kinesthetic Learning', value: 13 }
    ];
    
    const { lastY: learningStyleChartEndY } = addLearningStylePieChart(doc, yPosition, learningStyleData);

    // Check if we need to add a new page
    if (learningStyleChartEndY > doc.internal.pageSize.height - 40) {
      yPosition = addNewPage();
    } else {
      yPosition = learningStyleChartEndY + 20;
    }

    // Add learning style analysis
    // Prepare learning style analysis data
    const learningStyleAnalysisData = {
      title: "Read/Write learning style",
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
        "Write out key concepts and ideas."
      ]
    };
    
    const { lastY: learningStyleAnalysisEndY } = addLearningStyleAnalysis(doc, yPosition, learningStyleAnalysisData);

    // Start a new page for skills section
    yPosition = addNewPage();

    // Add skills bar chart
    // Prepare skills data
    const skillsData = [
      { name: 'overall', value: 70, level: 'Good', description: [] },
      { name: 'numerical', value: 80, level: 'Good', description: [
        "Your numerical skills are good.",
        "Numeracy involves an understanding of numerical data and numbers.",
        "Being competent and confident while working with numbers is a skill, that holds an advantage in a wide range of career options."
      ]},
      { name: 'logical', value: 60, level: 'Average', description: [
        "Your logical skills are average.",
        "Logical thinking is very important for analytical profiles.",
        "Being able to understand and analyze data in different formats is considered an essential skill in many career options."
      ]}
    ];
    
    const { lastY: skillsChartEndY } = addSkillBarChart(doc, yPosition, skillsData);

    // Start a new page for career clusters section
    yPosition = addNewPage();

    // Add career clusters chart
    // Prepare career clusters data
    const clustersData = [
      { name: 'Information Technology', score: 98 },
      { name: 'Science, Maths and Engineering', score: 98 },
      { name: 'Manufacturing', score: 84 },
      { name: 'Accounts and Finance', score: 82 }
    ];
    
    const { lastY: clustersChartEndY } = addCareerClusters(doc, yPosition, clustersData);

    // Check if we need to add a new page
    if (clustersChartEndY > doc.internal.pageSize.height - 40) {
      yPosition = addNewPage();
    } else {
      yPosition = clustersChartEndY + 20;
    }

    // Add selected career clusters
    // Prepare selected clusters data
    const selectedClustersData = [
      {
        rank: 1,
        name: "Information Technology",
        description: [
          "Information technology professionals work with Computer hardware, software or network systems.",
          "You might design new computer equipment or work on a new computer game.",
          "Some professionals provide support and manage software or hardware."
        ]
      },
      {
        rank: 2,
        name: "Science, Maths and Engineering",
        description: [
          "Science, math and engineering, professionals do scientific research in laboratories or the field.",
          "You will plan or design products and systems."
        ]
      }
    ];
    
    const { lastY: selectedClustersEndY } = addSelectedCareerClusters(doc, yPosition, selectedClustersData);

    // Start a new page for career paths section
    yPosition = addNewPage();

    // Add career paths
    // Prepare career paths data
    const careerPathsData = [
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
    
    const { lastY: careerPathsEndY } = addCareerPaths(doc, yPosition, careerPathsData);

    // Check if we need to add a new page
    if (careerPathsEndY > doc.internal.pageSize.height - 40) {
      yPosition = addNewPage();
    } else {
      yPosition = careerPathsEndY + 20;
    }

    // Add summary sheet
    // Prepare summary data
    const summaryData = {
      careerPersonality: "Introvert + Sensing + Thinking + Judging",
      careerInterest: "Investigative + Realistic + Conventional",
      careerMotivator: "Independence + Social Service + Continuous Learning",
      learningStyle: "Read & Write Learning",
      skillsAbilities: "Numerical Ability[80%] +Logical Ability[60%] +Verbal Ability[100%]",
      selectedClusters: "Accounts and Finance+Information Technology+Science, Maths and Engineering+Manufacturing"
    };
    
    addSummarySheet(doc, yPosition, summaryData);

    // Save the PDF with a custom name
    const fileName = `career_report_${reportId}_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
    
    return fileName;
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
  developmentAreas,
  isJuniorAssessment = false
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePDF = async () => {
    try {
      setIsGenerating(true);
      toast.loading('Generating PDF report...');
      
      await generatePDF(reportId, userName, scores, responses, strengthAreas, developmentAreas, isJuniorAssessment);
      
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
