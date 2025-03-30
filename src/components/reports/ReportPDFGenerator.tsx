
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { supabase } from '@/integrations/supabase/client';
import { 
  formatPersonalityType, 
  formatLearningStyle, 
  formatCurrentStage,
  formatCareerClusters,
  getProgressBarColors,
  createGradientHeader,
  createProfileBlock,
  createPlanningStageVisual,
  createPersonalityChart,
  createPersonalityAnalysisSection,
  createInterestTypesChart,
  createMotivatorTypesChart,
  createLearningStylesChart,
  createSkillsAndAbilitiesSection,
  createCareerClustersSection,
  createSelectedClustersSection,
  createCareerPathSection,
  createSummarySheetSection,
  generatePdfDate,
  generateCareerReportContent,
} from '@/utils/pdfFormatting';
import { generateLearningImprovement } from "@/utils/pdfFormatting";

interface ReportPDFGeneratorProps {
  reportId: string;
  userName: string;
  scores: any;
  responses: Record<string, string> | null;
  strengthAreas: string[];
  developmentAreas: string[];
}

const ReportPDFGenerator: React.FC<ReportPDFGeneratorProps> = ({ 
  reportId, 
  userName, 
  scores, 
  responses,
  strengthAreas,
  developmentAreas
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generatePdf = async () => {
    if (!scores) {
      toast.error("Cannot generate PDF: No assessment data available");
      return;
    }
    
    try {
      setIsGenerating(true);
      toast.info("Generating your PDF report...", { duration: 5000 });
      
      // Get the current date in DD-MM-YYYY format for the report
      const reportDate = generatePdfDate();
      
      // Generate the report content
      const reportContent = await generateCareerReportContent({
        scores,
        userName,
        completedAt: new Date().toISOString(),
        strengthAreas,
        developmentAreas
      }, userName);
      
      // Create a new PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Define common colors and styles
      const primaryColor = '#2980b9';
      const accentColor = '#27ae60';
      
      // Add cover page
      pdf.setFillColor(41, 128, 185); // A nice blue color
      pdf.rect(0, 0, 210, 297, 'F');
      
      // Add gradient overlay for visual appeal
      const canvas = document.createElement('canvas');
      canvas.width = 210;
      canvas.height = 297;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 297);
        gradient.addColorStop(0, 'rgba(41, 128, 185, 1)');
        gradient.addColorStop(1, 'rgba(52, 152, 219, 0.8)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 210, 297);
        
        // Add some decorative elements
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for (let i = 0; i < 20; i++) {
          const size = Math.random() * 50 + 10;
          const x = Math.random() * 210;
          const y = Math.random() * 297;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
      }
      
      // Add title to cover page
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Career Report', 105, 100, { align: 'center' });
      
      // Add subtitle
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Class 10 Student Assessment', 105, 115, { align: 'center' });
      
      // Add user name
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text(userName || 'Student Name', 105, 140, { align: 'center' });
      
      // Add date
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      pdf.text(reportDate, 105, 155, { align: 'center' });
      
      // Add company logo placeholder
      pdf.setFontSize(12);
      pdf.text('Powered By:', 105, 240, { align: 'center' });
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('3i Global', 105, 250, { align: 'center' });
      
      // Add page number to cover
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Page 1', 105, 285, { align: 'center' });
      
      // Start new page for content
      pdf.addPage();
      
      // Add header to each page with page number
      const addHeader = (pageNum: number) => {
        pdf.setFillColor(41, 128, 185);
        pdf.rect(0, 0, 210, 15, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text('3i Global', 20, 10);
        pdf.text('7048976060', 105, 10, { align: 'center' });
        pdf.text('3iglobal25@gmail.com', 190, 10, { align: 'right' });
        
        pdf.setDrawColor(200, 200, 200);
        pdf.line(10, 20, 200, 20);
        
        // Add footer
        pdf.line(10, 280, 200, 280);
        pdf.text(userName, 20, 286);
        pdf.text(`Page ${pageNum}`, 190, 286, { align: 'right' });
      };
      
      // Add header to page 2
      addHeader(2);
      
      // Add profile information
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Career Report', 105, 35, { align: 'center' });
      
      // Add profiling section
      pdf.setFontSize(16);
      pdf.text('Profiling', 105, 50, { align: 'center' });
      
      // Create content for profiling section
      const profilingContent = pdf.splitTextToSize(
        'Your Profiling\n\n' +
        'Personal profiling is the first step in career planning. The purpose of profiling is to understand your ' +
        'current career planning stage. It will help decide your career objective and roadmap. The ultimate aim of ' +
        'the planning is to take you from the current stage of career planning to the optimized stage of career ' +
        'planning. Personal profiling includes information about your current stage, the risk involved and action ' +
        'plan for your career development.',
        180
      );
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(profilingContent, 15, 60);
      
      // Add Current Stage of Planning
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Current Stage of Planning', 15, 90);
      
      // Add planning stage visualization
      const currentStage = reportContent.currentStage || 'Diffused';
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.setTextColor(41, 128, 185);
      pdf.text(currentStage, 15, 105);
      
      // Create stage progression visual
      const stages = ['Ignorant', 'Confused', 'Diffused', 'Methodical', 'Optimized'];
      const currentIndex = stages.indexOf(currentStage);
      
      // Draw the progression bar
      pdf.setDrawColor(220, 220, 220);
      pdf.setLineWidth(0.5);
      
      // Draw the background bar
      pdf.setFillColor(240, 240, 240);
      pdf.roundedRect(15, 115, 180, 10, 5, 5, 'F');
      
      // Draw the progress bar
      const progressWidth = ((currentIndex + 1) / stages.length) * 180;
      pdf.setFillColor(41, 128, 185);
      pdf.roundedRect(15, 115, progressWidth, 10, 5, 5, 'F');
      
      // Add stage labels
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      const stageWidth = 180 / stages.length;
      stages.forEach((stage, index) => {
        const x = 15 + (index * stageWidth) + (stageWidth / 2);
        pdf.circle(x, 120, 3, index <= currentIndex ? 'F' : 'S');
        
        // Highlight current stage
        if (index === currentIndex) {
          pdf.setTextColor(41, 128, 185);
          pdf.setFont('helvetica', 'bold');
        } else {
          pdf.setTextColor(100, 100, 100);
          pdf.setFont('helvetica', 'normal');
        }
        
        pdf.text(stage, x, 130, { align: 'center' });
      });
      
      // Add stage description
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      let stageDescription = '';
      
      if (currentStage === 'Ignorant') {
        stageDescription = 'Ignorant: You are at the ignorant stage in career planning. We understand that you have minimal information about suitable careers. At this stage, you are just beginning to identify your career path. You need to understand your abilities and interests to align them with the most suitable career path.';
      } else if (currentStage === 'Confused') {
        stageDescription = 'Confused: You are at the confused stage in career planning. We understand that you have some information about suitable careers but you are still confused. At this stage, you are unable to decide between various career options. You need guidance to align your abilities and interests with the most suitable career path.';
      } else if (currentStage === 'Diffused') {
        stageDescription = 'Diffused: You are at the diffused stage in career planning. We understand that you have a fair idea of your suitable career. At this stage, you have a better understanding of career options. However, you are looking for more information to understand the complete career path for yourself and an execution plan to achieve it. Lack of complete information and execution plan can adversely impact your career.';
      } else if (currentStage === 'Methodical') {
        stageDescription = 'Methodical: You are at the methodical stage in career planning. We understand that you have a good idea of your suitable career. At this stage, you have a thorough understanding of your career options and path. You are now focused on developing a detailed execution plan. You are on the right track but need to fine-tune your approach.';
      } else {
        stageDescription = 'Optimized: You are at the optimized stage in career planning. We understand that you have an excellent understanding of your suitable career. At this stage, you have a clear vision of your career path and a detailed execution plan. You are fully prepared to pursue your chosen career with confidence and clarity.';
      }
      
      const stageDescriptionWrapped = pdf.splitTextToSize(stageDescription, 180);
      pdf.text(stageDescriptionWrapped, 15, 140);
      
      // Add Risk Involved
      pdf.setFontSize(11);
      pdf.text('Risk Involved: Career misalignment, career path misjudgment, wrong career path projections, unnecessary stress', 15, 170);
      
      // Add Action Plan
      pdf.text('Action Plan: Explore career path > Align your abilities and interests with the best possible career path > Realistic Execution Plan > Timely Review of Action Plan', 15, 180);
      
      // Add new page for personality section
      pdf.addPage();
      addHeader(3);
      
      // Add personality section header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Career Personality', 105, 35, { align: 'center' });
      
      // Add personality result
      pdf.setFontSize(16);
      pdf.text('Result of the Career Personality', 105, 50, { align: 'center' });
      
      // Add personality description
      const personalityDescription = pdf.splitTextToSize(
        'Personality Assessment will help you understand yourself as a person. It will help you expand your ' +
        'career options in alignment with your personality. Self-understanding and awareness can lead you to ' +
        'more appropriate and rewarding career choices. The Personality Type Model identifies four dimensions ' +
        'of personality. Each dimension will give you a clear description of your personality. The combination of ' +
        'your most dominant preferences is used to create your individual personality type. Four dimensions of ' +
        'your personality are mentioned in this chart. The graph below provides information about the personality ' +
        'type you belong to, based on the scoring of your responses. Each of the four preferences are based on ' +
        'your answers and are indicated by a bar chart.',
        180
      );
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(personalityDescription, 15, 60);
      
      // Add personality type
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Personality Type: ${reportContent.personalityType}`, 15, 90);
      
      // Create dimensions charts
      // Dimension 1: Introvert vs Extrovert
      const dim1Width = 150;
      const dim1Height = 8;
      const dim1Y = 100;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Introvert-[${reportContent.personalityDimensions.introvert}%]`, 15, dim1Y - 3);
      pdf.text(`Extrovert-[${reportContent.personalityDimensions.extrovert}%]`, 195, dim1Y - 3, { align: 'right' });
      
      // Background bar
      pdf.setFillColor(240, 240, 240);
      pdf.rect(30, dim1Y, dim1Width, dim1Height, 'F');
      
      // Progress bar
      pdf.setFillColor(41, 128, 185);
      pdf.rect(30, dim1Y, (reportContent.personalityDimensions.introvert / 100) * dim1Width, dim1Height, 'F');
      
      // Dimension 2: Sensing vs Intuitive
      const dim2Y = dim1Y + 20;
      pdf.setFontSize(10);
      pdf.text(`Sensing-[${reportContent.personalityDimensions.sensing}%]`, 15, dim2Y - 3);
      pdf.text(`(Observant)`, 15, dim2Y + 5);
      pdf.text(`iNtuitive-[${reportContent.personalityDimensions.intuitive}%]`, 195, dim2Y - 3, { align: 'right' });
      pdf.text(`(Futuristic)`, 195, dim2Y + 5, { align: 'right' });
      
      // Background bar
      pdf.setFillColor(240, 240, 240);
      pdf.rect(30, dim2Y, dim1Width, dim1Height, 'F');
      
      // Progress bar
      pdf.setFillColor(41, 128, 185);
      pdf.rect(30, dim2Y, (reportContent.personalityDimensions.sensing / 100) * dim1Width, dim1Height, 'F');
      
      // Dimension 3: Thinking vs Feeling
      const dim3Y = dim2Y + 20;
      pdf.setFontSize(10);
      pdf.text(`Thinking-[${reportContent.personalityDimensions.thinking}%]`, 15, dim3Y - 3);
      pdf.text(`Feeling-[${reportContent.personalityDimensions.feeling}%]`, 195, dim3Y - 3, { align: 'right' });
      
      // Background bar
      pdf.setFillColor(240, 240, 240);
      pdf.rect(30, dim3Y, dim1Width, dim1Height, 'F');
      
      // Progress bar
      pdf.setFillColor(41, 128, 185);
      pdf.rect(30, dim3Y, (reportContent.personalityDimensions.thinking / 100) * dim1Width, dim1Height, 'F');
      
      // Dimension 4: Judging vs Perceiving
      const dim4Y = dim3Y + 20;
      pdf.setFontSize(10);
      pdf.text(`Judging-[${reportContent.personalityDimensions.judging}%]`, 15, dim4Y - 3);
      pdf.text(`(Organized)`, 15, dim4Y + 5);
      pdf.text(`Perceiving-[${reportContent.personalityDimensions.perceiving}%]`, 195, dim4Y - 3, { align: 'right' });
      pdf.text(`(Spontaneous)`, 195, dim4Y + 5, { align: 'right' });
      
      // Background bar
      pdf.setFillColor(240, 240, 240);
      pdf.rect(30, dim4Y, dim1Width, dim1Height, 'F');
      
      // Progress bar
      pdf.setFillColor(41, 128, 185);
      pdf.rect(30, dim4Y, (reportContent.personalityDimensions.judging / 100) * dim1Width, dim1Height, 'F');
      
      // Add new page for personality analysis
      pdf.addPage();
      addHeader(4);
      
      // Add personality analysis header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Career Report', 105, 35, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.text('Analysis of Career Personality', 105, 50, { align: 'center' });
      
      // Your Career Personality Analysis
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Your Career Personality Analysis', 15, 65);
      
      // Where do you prefer to focus your energy and attention?
      pdf.setFillColor(41, 128, 185); // Blue header background
      pdf.rect(15, 70, 180, 10, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.text('Where do you prefer to focus your energy and attention?', 20, 77);
      
      // Reset text color
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      
      // Get the first 6 personality traits (or fewer if there aren't 6)
      const energyTraits = reportContent.personalityTraits.slice(0, 6);
      let yPos = 85;
      
      // Add bullet points for energy traits
      energyTraits.forEach(trait => {
        pdf.circle(20, yPos - 1, 1, 'F');
        const lines = pdf.splitTextToSize(trait, 170);
        pdf.text(lines, 25, yPos);
        yPos += 7 * lines.length;
      });
      
      // How do you grasp and process the information?
      yPos += 5;
      pdf.setFillColor(41, 128, 185);
      pdf.rect(15, yPos, 180, 10, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('How do you grasp and process the information?', 20, yPos + 7);
      
      // Reset text color
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      
      // Get the next 6 personality traits
      const infoTraits = reportContent.personalityTraits.slice(6, 12);
      yPos += 15;
      
      // Add bullet points for information processing traits
      infoTraits.forEach(trait => {
        pdf.circle(20, yPos - 1, 1, 'F');
        const lines = pdf.splitTextToSize(trait, 170);
        pdf.text(lines, 25, yPos);
        yPos += 7 * lines.length;
      });
      
      // How do you make decisions?
      yPos += 5;
      pdf.setFillColor(41, 128, 185);
      pdf.rect(15, yPos, 180, 10, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('How do you make decisions?', 20, yPos + 7);
      
      // If we're getting close to the bottom of the page, add a new page
      if (yPos > 230) {
        pdf.addPage();
        addHeader(5);
        yPos = 35;
      } else {
        yPos += 15;
      }
      
      // Reset text color
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      
      // Get the next 6 personality traits
      const decisionTraits = reportContent.personalityTraits.slice(12, 18);
      
      // Add bullet points for decision making traits
      decisionTraits.forEach(trait => {
        pdf.circle(20, yPos - 1, 1, 'F');
        const lines = pdf.splitTextToSize(trait, 170);
        pdf.text(lines, 25, yPos);
        yPos += 7 * lines.length;
      });
      
      // If we need a new page for the next section
      if (yPos > 230) {
        pdf.addPage();
        addHeader(pdf.getNumberOfPages());
        yPos = 35;
      } else {
        yPos += 10;
      }
      
      // How do you prefer to plan your work?
      pdf.setFillColor(41, 128, 185);
      pdf.rect(15, yPos, 180, 10, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('How do you prefer to plan your work?', 20, yPos + 7);
      
      // Reset text color
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      
      // Get the remaining personality traits
      const planningTraits = reportContent.personalityTraits.slice(18);
      yPos += 15;
      
      // Add bullet points for planning traits
      planningTraits.forEach(trait => {
        pdf.circle(20, yPos - 1, 1, 'F');
        const lines = pdf.splitTextToSize(trait, 170);
        pdf.text(lines, 25, yPos);
        yPos += 7 * lines.length;
      });
      
      // Your strengths
      yPos += 10;
      pdf.setFillColor(41, 128, 185);
      pdf.rect(15, yPos, 180, 10, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Your strengths', 20, yPos + 7);
      
      // Reset text color
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      
      // Add strengths
      yPos += 15;
      reportContent.strengths.forEach(strength => {
        pdf.circle(20, yPos - 1, 1, 'F');
        const lines = pdf.splitTextToSize(strength, 170);
        pdf.text(lines, 25, yPos);
        yPos += 7 * lines.length;
      });
      
      // Add new page for career interest
      pdf.addPage();
      addHeader(pdf.getNumberOfPages());
      
      // Add career interest section header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Career Report', 105, 35, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.text('Result of the Career Interest', 105, 50, { align: 'center' });
      
      // Add career interest title
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Your Career Interest Types', 15, 65);
      
      // Add career interest description
     const interestDescription = pdf.splitTextToSize(
  'The Career Interest Assessment will help you understand which careers might be the best fit for you. It is ' +
  'meant to help you find careers that you might enjoy. Understanding your Top career interest will help you ' +
  'identify a career focus and begin your career planning and career exploration process.\n\n' +
  'The Career Interest Assessment (CIA) measures six broad interest patterns that can be used to ' +
  'describe your career interest. Most people\'s interests are reflected by two or three themes, combined to ' +
  'form a cluster of interests. This career interest is directly linked to your occupational interest.',
  180
);
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(interestDescription, 15, 75);
      
      // Draw the interest types chart
      const interestY = 120;
      const chartWidth = 180;
      const barHeight = 12;
      const spacing = 5;
      
      // Sort interest types by value
      const sortedInterestTypes = [...reportContent.interestTypes].sort((a, b) => b.value - a.value);
      
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      
      sortedInterestTypes.forEach((type, index) => {
        const y = interestY + (index * (barHeight + spacing));
        
        // Label
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(type.name, 15, y + 8);
        
        // Background bar
        pdf.setFillColor(240, 240, 240);
        pdf.rect(70, y, chartWidth - 55, barHeight, 'F');
        
        // Progress bar
        const barColor = getProgressBarColors(type.value);
        pdf.setFillColor(parseInt(barColor.slice(1, 3), 16), parseInt(barColor.slice(3, 5), 16), parseInt(barColor.slice(5, 7), 16));
        pdf.rect(70, y, ((type.value / 100) * (chartWidth - 55)), barHeight, 'F');
        
        // Value label
        pdf.setFontSize(10);
        pdf.text(type.value.toString(), 70 + ((type.value / 100) * (chartWidth - 55)) + 5, y + 8);
      });
      
      // Add new page for career interest analysis
      pdf.addPage();
      addHeader(pdf.getNumberOfPages());
      
      // Add career interest analysis header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Career Report', 105, 35, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.text('Analysis of Career Interest', 105, 50, { align: 'center' });
      
      // Add career interest analysis title
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Your Career Interest Analysis', 15, 65);
      
      // Add interest type analysis for top 3 types
      let interestAnalysisY = 75;
      const topInterestTypes = sortedInterestTypes.slice(0, 3);
      
      topInterestTypes.forEach((type, index) => {
        // Intensity label (HIGH, MEDIUM, LOW)
        const intensity = type.value >= 80 ? 'HIGH' : type.value >= 50 ? 'MEDIUM' : 'LOW';
        
        // Interest type header
        pdf.setFillColor(41, 128, 185);
        pdf.rect(15, interestAnalysisY, 180, 10, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${type.name}-${intensity}`, 20, interestAnalysisY + 7);
        
        interestAnalysisY += 15;
        
        // Reset text color
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        
        // Generate bullet points for this interest type (for demonstration)
        const interestTypeBullets = getInterestTypeBullets(type.name);
        
        // Add bullet points
        interestTypeBullets.forEach(bullet => {
          pdf.circle(20, interestAnalysisY - 1, 1, 'F');
          const lines = pdf.splitTextToSize(bullet, 170);
          pdf.text(lines, 25, interestAnalysisY);
          interestAnalysisY += 7 * lines.length;
        });
        
        interestAnalysisY += 10;
        
        // If we need a new page for the next interest type
        if (interestAnalysisY > 250 && index < topInterestTypes.length - 1) {
          pdf.addPage();
          addHeader(pdf.getNumberOfPages());
          interestAnalysisY = 35;
        }
      });
      
      // Add new page for career motivator
      pdf.addPage();
      addHeader(pdf.getNumberOfPages());
      
      // Add career motivator section header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Career Report', 105, 35, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.text('Result of the Career Motivator', 105, 50, { align: 'center' });
      
      // Add career motivator title
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Your Career Motivator Types', 15, 65);
      
      // Add career motivator description
      const motivatorDescription = pdf.splitTextToSize(
        'Values are the things that are most important to us in our lives and careers. Our values are formed in a ' +
        'variety of ways through our life experiences, our feelings and our families. In the context of Career ' +
        'Planning, values generally refer to the things we value in a career. Being aware of what we value in our ' +
        'lives is important because a career choice that is in-line with our core beliefs and values is more likely to ' +
        'be a lasting and positive choice.',
        180
      );
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(motivatorDescription, 15, 75);
      
      // Draw the motivator types chart
      const motivatorY = 120;
      
      // Sort motivator types by value
      const sortedMotivatorTypes = [...reportContent.motivatorTypes].sort((a, b) => b.value - a.value);
      
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      
      sortedMotivatorTypes.forEach((type, index) => {
        const y = motivatorY + (index * (barHeight + spacing));
        
        // Label
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(type.name, 15, y + 8);
        
        // Background bar
        pdf.setFillColor(240, 240, 240);
        pdf.rect(70, y, chartWidth - 55, barHeight, 'F');
        
        // Progress bar
        const barColor = getProgressBarColors(type.value);
        pdf.setFillColor(parseInt(barColor.slice(1, 3), 16), parseInt(barColor.slice(3, 5), 16), parseInt(barColor.slice(5, 7), 16));
        pdf.rect(70, y, ((type.value / 100) * (chartWidth - 55)), barHeight, 'F');
        
        // Value label
        pdf.setFontSize(10);
        pdf.text(type.value.toString(), 70 + ((type.value / 100) * (chartWidth - 55)) + 5, y + 8);
      });
      
      // Add new page for career motivator analysis
      pdf.addPage();
      addHeader(pdf.getNumberOfPages());
      
      // Add career motivator analysis header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Career Report', 105, 35, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.text('Analysis of Career Motivator', 105, 50, { align: 'center' });
      
      // Add career motivator analysis title
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Your Career Motivator Analysis', 15, 65);
      
      // Add motivator type analysis for top 3 types
      let motivatorAnalysisY = 75;
      const topMotivatorTypes = sortedMotivatorTypes.slice(0, 3);
      
      topMotivatorTypes.forEach((type, index) => {
        // Intensity label (HIGH, MEDIUM, LOW)
        const intensity = type.value >= 80 ? 'HIGH' : type.value >= 50 ? 'MEDIUM' : 'LOW';
        
        // Motivator type header
        pdf.setFillColor(41, 128, 185);
        pdf.rect(15, motivatorAnalysisY, 180, 10, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${type.name}-${intensity}`, 20, motivatorAnalysisY + 7);
        
        motivatorAnalysisY += 15;
        
        // Reset text color
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        
        // Generate bullet points for this motivator type
        const motivatorTypeBullets = getMotivatorTypeBullets(type.name);
        
        // Add bullet points
        motivatorTypeBullets.forEach(bullet => {
          pdf.circle(20, motivatorAnalysisY - 1, 1, 'F');
          const lines = pdf.splitTextToSize(bullet, 170);
          pdf.text(lines, 25, motivatorAnalysisY);
          motivatorAnalysisY += 7 * lines.length;
        });
        
        motivatorAnalysisY += 10;
        
        // If we need a new page for the next motivator type
        if (motivatorAnalysisY > 250 && index < topMotivatorTypes.length - 1) {
          pdf.addPage();
          addHeader(pdf.getNumberOfPages());
          motivatorAnalysisY = 35;
        }
      });
      
      // Add new page for learning style
      pdf.addPage();
      addHeader(pdf.getNumberOfPages());
      
      // Add learning style section header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Career Report', 105, 35, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.text('Result of the Learning Style', 105, 50, { align: 'center' });
      
      // Add learning style title
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Your Learning Style Types', 15, 65);
      
      // Draw the learning style chart
      const learningStyleY = 75;
      
      // Sort learning styles by value
      const sortedLearningStyles = [...reportContent.learningStyles].sort((a, b) => b.value - a.value);
      
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      
      sortedLearningStyles.forEach((style, index) => {
        const y = learningStyleY + (index * (barHeight + spacing));
        
        // Label
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(style.name, 15, y + 8);
        
        // Background bar
        pdf.setFillColor(240, 240, 240);
        pdf.rect(70, y, chartWidth - 55, barHeight, 'F');
        
        // Progress bar
        const barColor = getProgressBarColors(style.value);
        pdf.setFillColor(parseInt(barColor.slice(1, 3), 16), parseInt(barColor.slice(3, 5), 16), parseInt(barColor.slice(5, 7), 16));
        pdf.rect(70, y, ((style.value / 100) * (chartWidth - 55)), barHeight, 'F');
        
        // Value label
        pdf.setFontSize(10);
        pdf.text(style.value.toString(), 70 + ((style.value / 100) * (chartWidth - 55)) + 5, y + 8);
      });
      
      // Add new page for learning style analysis
      pdf.addPage();
      addHeader(pdf.getNumberOfPages());
      
      // Add learning style analysis header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Career Report', 105, 35, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.text('Analysis of Learning Style', 105, 50, { align: 'center' });
      
      // Add learning style analysis for dominant style
      const dominantStyle = sortedLearningStyles[0].name;
      
      // Learning style header
      pdf.setFillColor(41, 128, 185);
      pdf.rect(15, 65, 180, 10, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(dominantStyle, 20, 72);
      
      // Reset text color
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      
      // Generate description for this learning style
      const learningStyleDescription = reportContent.learningStyleAnalysis;
      
      // Add description
      let learningStyleY = 85;
      learningStyleDescription.forEach(line => {
        const lineText = pdf.splitTextToSize(line, 170);
        pdf.text(lineText, 25, learningStyleY);
        learningStyleY += 7 * lineText.length;
      });
      
      // Learning improvement strategies
      learningStyleY += 15;
      pdf.setFillColor(41, 128, 185);
      pdf.rect(15, learningStyleY, 180, 10, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Learning improvement strategies', 20, learningStyleY + 7);
      
      // Reset text color
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      
      // Get learning improvement strategies
      const learningImprovement = reportContent.learningStyleStrategies;
      
      // Add strategies as bullet points
      learningStyleY += 20;
      learningImprovement.forEach(strategy => {
        pdf.circle(20, learningStyleY - 1, 1, 'F');
        const lines = pdf.splitTextToSize(strategy, 170);
        pdf.text(lines, 25, learningStyleY);
        learningStyleY += 7 * lines.length;
        
        // If we run out of space, add a new page
        if (learningStyleY > 270) {
          pdf.addPage();
          addHeader(pdf.getNumberOfPages());
          learningStyleY = 35;
        }
      });
      
      // Add new page for skills and abilities
      pdf.addPage();
      addHeader(pdf.getNumberOfPages());
      
      // Add skills and abilities section header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Career Report', 105, 35, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.text('Skills and Abilities', 105, 50, { align: 'center' });
      
      // Add skills and abilities title
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Your Skills and Abilities', 15, 65);
      
      // Add skills description
      const skillsDescription = pdf.splitTextToSize(
        'The skills & abilities scores will help us to explore and identify different ways to reshape your career ' +
        'direction. This simple graph shows how you have scored on each of these skills and abilities. The graph ' +
        'on the top will show the average score of your overall skills and abilities.',
        180
      );
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(skillsDescription, 15, 75);
      
      // Draw overall skills gauge
      const overallSkills = reportContent.skillsAndAbilities.overall;
      const overallY = 100;
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Overall Skills and Abilities', 105, overallY, { align: 'center' });
      
      // Create a gauge-like visualization for overall skills
      const gaugeWidth = 120;
      const gaugeHeight = 20;
      const gaugeX = (210 - gaugeWidth) / 2; // Center on the page
      
      // Background gauge
      pdf.setFillColor(240, 240, 240);
      pdf.roundedRect(gaugeX, overallY + 5, gaugeWidth, gaugeHeight, 5, 5, 'F');
      
      // Filled gauge (value)
      const gaugeColor = getProgressBarColors(overallSkills);
      pdf.setFillColor(parseInt(gaugeColor.slice(1, 3), 16), parseInt(gaugeColor.slice(3, 5), 16), parseInt(gaugeColor.slice(5, 7), 16));
      pdf.roundedRect(gaugeX, overallY + 5, (overallSkills / 100) * gaugeWidth, gaugeHeight, 5, 5, 'F');
      
      // Add value text
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.text(`${overallSkills}% - ${formatSkillLevel(overallSkills)}`, 105, overallY + 35, { align: 'center' });
      
      // Draw individual skills
      const skillsToDraw = [
        { name: 'Numerical Ability', value: reportContent.skillsAndAbilities.numerical },
        { name: 'Logical Ability', value: reportContent.skillsAndAbilities.logical },
        { name: 'Verbal Ability', value: reportContent.skillsAndAbilities.verbal },
        { name: 'Clerical and Organizing Skills', value: reportContent.skillsAndAbilities.clerical },
        { name: 'Spatial & Visualization Ability', value: reportContent.skillsAndAbilities.spatial },
        { name: 'Leadership & Decision making skills', value: reportContent.skillsAndAbilities.leadership },
        { name: 'Social & Co-operation Skills', value: reportContent.skillsAndAbilities.social },
        { name: 'Mechanical Abilities', value: reportContent.skillsAndAbilities.mechanical }
      ];
      
      // Two columns of skills
      const leftSkills = skillsToDraw.slice(0, 4);
      const rightSkills = skillsToDraw.slice(4);
      
      // Start positions for columns
      const leftColumnX = 15;
      const rightColumnX = 110;
      let skillY = overallY + 50;
      
      // Draw left column of skills
      leftSkills.forEach(skill => {
        // Skill name
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(skill.name, leftColumnX, skillY);
        
        // Skill gauge background
        pdf.setFillColor(240, 240, 240);
        pdf.roundedRect(leftColumnX, skillY + 5, 80, 10, 3, 3, 'F');
        
        // Skill gauge fill
        const skillColor = getProgressBarColors(skill.value);
        pdf.setFillColor(parseInt(skillColor.slice(1, 3), 16), parseInt(skillColor.slice(3, 5), 16), parseInt(skillColor.slice(5, 7), 16));
        pdf.roundedRect(leftColumnX, skillY + 5, (skill.value / 100) * 80, 10, 3, 3, 'F');
        
        // Skill value
        pdf.setFontSize(10);
        pdf.text(`${skill.value}%`, leftColumnX + (skill.value / 100) * 80 + 5, skillY + 12);
        
        // Skill level
        pdf.setTextColor(skillColor);
        pdf.text(formatSkillLevel(skill.value), leftColumnX + 60, skillY + 25);
        pdf.setTextColor(0, 0, 0);
        
        skillY += 35;
      });
      
      // Reset Y position for right column
      skillY = overallY + 50;
      
      // Draw right column of skills
      rightSkills.forEach(skill => {
        // Skill name
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(skill.name, rightColumnX, skillY);
        
        // Skill gauge background
        pdf.setFillColor(240, 240, 240);
        pdf.roundedRect(rightColumnX, skillY + 5, 80, 10, 3, 3, 'F');
        
        // Skill gauge fill
        const skillColor = getProgressBarColors(skill.value);
        pdf.setFillColor(parseInt(skillColor.slice(1, 3), 16), parseInt(skillColor.slice(3, 5), 16), parseInt(skillColor.slice(5, 7), 16));
        pdf.roundedRect(rightColumnX, skillY + 5, (skill.value / 100) * 80, 10, 3, 3, 'F');
        
        // Skill value
        pdf.setFontSize(10);
        pdf.text(`${skill.value}%`, rightColumnX + (skill.value / 100) * 80 + 5, skillY + 12);
        
        // Skill level
        pdf.setTextColor(skillColor);
        pdf.text(formatSkillLevel(skill.value), rightColumnX + 60, skillY + 25);
        pdf.setTextColor(0, 0, 0);
        
        skillY += 35;
      });
      
      // Add new page for career clusters
      pdf.addPage();
      addHeader(pdf.getNumberOfPages());
      
      // Add career clusters section header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Career Report', 105, 35, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.text('Career Clusters', 105, 50, { align: 'center' });
      
      // Add career clusters title
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Your Career Clusters', 15, 65);
      
      // Add career clusters description
      const clustersDescription = pdf.splitTextToSize(
        'Career Clusters are groups of similar occupations and industries that require similar skills. It provides a ' +
        'career road map for pursuing further education and career opportunities. They help you connect your ' +
        'Education with your Career Planning. Career Cluster helps you narrow down your occupation choices ' +
        'based on your assessment responses. Results show which Career Clusters would be best to explore. A ' +
        'simple graph report shows how you have scored on each of the Career Clusters.',
        180
      );
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(clustersDescription, 15, 75);
      
      // Draw career clusters chart
      const clustersY = 110;
      
      // Get top 12 clusters for display
      const topClusters = reportContent.careerClusters.slice(0, 12);
      
      // Draw bars for each cluster
      let currentY = clustersY;
      
      topClusters.forEach(cluster => {
        // Cluster name
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(cluster.name, 15, currentY + 8);
        
        // Background bar
        pdf.setFillColor(240, 240, 240);
        pdf.rect(80, currentY, 100, barHeight, 'F');
        
        // Progress bar
        const barColor = getProgressBarColors(cluster.value);
        pdf.setFillColor(parseInt(barColor.slice(1, 3), 16), parseInt(barColor.slice(3, 5), 16), parseInt(barColor.slice(5, 7), 16));
        pdf.rect(80, currentY, cluster.value, barHeight, 'F');
        
        // Value label
        pdf.setFontSize(10);
        pdf.text(cluster.value.toString(), 80 + cluster.value + 5, currentY + 8);
        
        currentY += barHeight + spacing;
        
        // If we run out of space, continue to next page
        if (currentY > 270) {
          pdf.addPage();
          addHeader(pdf.getNumberOfPages());
          currentY = 35;
        }
      });
      
      // Add new page for selected career clusters
      pdf.addPage();
      addHeader(pdf.getNumberOfPages());
      
      // Add selected career clusters section header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Career Report', 105, 35, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.text('Selected Career Clusters', 105, 50, { align: 'center' });
      
      // Add selected career clusters title
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Your Selected 4 Career Clusters', 15, 65);
      
      // Draw selected career clusters
      let selectedY = 75;
      
      // Get top 4 clusters for detailed display
      const selectedClusters = topClusters.slice(0, 4);
      
      selectedClusters.forEach((cluster, index) => {
        // Cluster number and name
        pdf.setFillColor(41, 128, 185);
        pdf.circle(25, selectedY + 5, 10, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text((index + 1).toString(), 25, selectedY + 8, { align: 'center' });
        
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(14);
        pdf.text(cluster.name, 40, selectedY + 7);
        
        selectedY += 20;
        
        // Cluster description (generated based on cluster name)
        const clusterInfo = reportContent.clusterDescriptions[cluster.name.toLowerCase()] || [];
        
        // Add bullet points for cluster info
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        
        clusterInfo.forEach(point => {
          pdf.circle(40, selectedY - 1, 1, 'F');
          const lines = pdf.splitTextToSize(point, 150);
          pdf.text(lines, 45, selectedY);
          selectedY += 7 * lines.length;
        });
        
        selectedY += 15;
        
        // If we need a new page for the next cluster
        if (selectedY > 240 && index < selectedClusters.length - 1) {
          pdf.addPage();
          addHeader(pdf.getNumberOfPages());
          selectedY = 35;
        }
      });
      
      // Add new page for career paths
      pdf.addPage();
      addHeader(pdf.getNumberOfPages());
      
      // Add career paths section header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Career Report', 105, 35, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.text('Career Path', 105, 50, { align: 'center' });
      
      // Add career paths title
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Your Career Paths', 15, 65);
      
      // Add career paths recommendations title
      pdf.setFontSize(12);
      pdf.text('Recommendations for you', 15, 80);
      
      // Create table for career paths
      const careerPaths = reportContent.careerPaths.slice(0, 10); // Just show top 10 to avoid a huge PDF
      
      // Table headers
      pdf.setFillColor(240, 240, 240);
      pdf.rect(15, 85, 45, 10, 'F');
      pdf.rect(60, 85, 55, 10, 'F');
      pdf.rect(115, 85, 35, 10, 'F');
      pdf.rect(150, 85, 45, 10, 'F');
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Career Paths', 17, 92);
      pdf.text('Psy. Analysis', 62, 92);
      pdf.text('Skill and Abilities', 117, 92);
      pdf.text('Comment', 152, 92);
      
      // Table rows with alternating colors
      let careerY = 95;
      
      careerPaths.forEach((path, index) => {
        // Row background
        if (index % 2 === 0) {
          pdf.setFillColor(248, 249, 250);
          pdf.rect(15, careerY, 45, 30, 'F');
          pdf.rect(60, careerY, 55, 30, 'F');
          pdf.rect(115, careerY, 35, 30, 'F');
          pdf.rect(150, careerY, 45, 30, 'F');
        }
        
        // Row content
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.text((index + 1).toString(), 17, careerY + 5);
        pdf.text(path.title, 17, careerY + 12);
        
        pdf.setFont('helvetica', 'normal');
        pdf.text(path.subtitle, 17, careerY + 20);
        
        pdf.setFont('helvetica', 'normal');
        pdf.text(path.psyAnalysis, 62, careerY + 12);
        pdf.text(path.skillAbilities, 117, careerY + 12);
        pdf.text(path.comment, 152, careerY + 12);
        
        // Row border
        pdf.setDrawColor(220, 220, 220);
        pdf.setLineWidth(0.2);
        pdf.line(15, careerY + 30, 195, careerY + 30);
        
        careerY += 30;
        
        // If we run out of space, continue to next page
        if (careerY > 250 && index < careerPaths.length - 1) {
          pdf.addPage();
          addHeader(pdf.getNumberOfPages());
          careerY = 35;
          
          // Add table headers on new page
          pdf.setFillColor(240, 240, 240);
          pdf.rect(15, careerY, 45, 10, 'F');
          pdf.rect(60, careerY, 55, 10, 'F');
          pdf.rect(115, careerY, 35, 10, 'F');
          pdf.rect(150, careerY, 45, 10, 'F');
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Career Paths', 17, careerY + 7);
          pdf.text('Psy. Analysis', 62, careerY + 7);
          pdf.text('Skill and Abilities', 117, careerY + 7);
          pdf.text('Comment', 152, careerY + 7);
          
          careerY += 10;
        }
      });
      
      // Add new page for summary sheet
      pdf.addPage();
      addHeader(pdf.getNumberOfPages());
      
      // Add summary sheet section header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Career Report', 105, 35, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.text('Summary Sheet', 105, 50, { align: 'center' });
      
      // Add summary note
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'italic');
      pdf.text('Our career assessment is based on the concept of correlation theory and various psychometric and statistical models.', 15, 65);
      
      // Create summary table
      const summaryItems = [
        { label: 'Career Personality', value: reportContent.personalityType },
        { label: 'Career Interest', value: reportContent.summarySheetData.careerInterest },
        { label: 'Career Motivator', value: reportContent.summarySheetData.careerMotivator },
        { label: 'Learning Style', value: reportContent.summarySheetData.learningStyle },
        { label: 'Skills & Abilities', value: reportContent.summarySheetData.skillsAbilities },
        { label: 'Selected Clusters', value: reportContent.summarySheetData.selectedClusters }
      ];
      
      let summaryY = 80;
      
      summaryItems.forEach((item, index) => {
        // Row background
        pdf.setFillColor(index % 2 === 0 ? 240 : 248, index % 2 === 0 ? 240 : 248, index % 2 === 0 ? 240 : 248);
        pdf.rect(15, summaryY, 60, 15, 'F');
        pdf.rect(75, summaryY, 120, 15, 'F');
        
        // Row content
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(item.label, 17, summaryY + 10);
        
        pdf.setFont('helvetica', 'normal');
        pdf.text(item.value, 77, summaryY + 10);
        
        // Row border
        pdf.setDrawColor(220, 220, 220);
        pdf.setLineWidth(0.2);
        pdf.line(15, summaryY, 195, summaryY);
        pdf.line(15, summaryY + 15, 195, summaryY + 15);
        pdf.line(15, summaryY, 15, summaryY + 15);
        pdf.line(75, summaryY, 75, summaryY + 15);
        pdf.line(195, summaryY, 195, summaryY + 15);
        
        summaryY += 15;
      });
      
      // Final closing text
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'italic');
      pdf.text('This report is intended only for the use of the individual or entity to which it is addressed.', 15, 250);
      pdf.text('No part of this report may be reproduced in any form or manner without prior written permission.', 15, 255);
      
      // PoweredBy footer
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Powered By: 3i Global', 105, 265, { align: 'center' });
      
      // Mark the assessment as having generated a report
      try {
        await supabase
          .from('user_assessments')
          .update({ report_generated_at: new Date().toISOString() })
          .eq('id', reportId);
        
        console.log("Updated assessment record with report generation timestamp");
      } catch (err) {
        console.error("Error updating assessment record:", err);
      }
      
      // Save the PDF
      pdf.save(`career_report_${userName.replace(/\s+/g, '_')}.pdf`);
      
      toast.success("PDF report generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Error generating PDF report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Helper function to get interest type bullet points
  const getInterestTypeBullets = (interestType: string): string[] => {
    const bullets: Record<string, string[]> = {
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
        'You are creative, original, independent, chaotic, and innovative.',
        'You like to work with creative ideas and self-expression.',
        'You appreciate art, drama, music, or creative writing.',
        'You value aesthetics and creativity.',
        'You prefer unstructured situations and use your imagination.',
        'You create original work using your talents and imagination.'
      ],
      'Social': [
        'You are friendly, helpful, outgoing, understanding and cooperative.',
        'You enjoy working with others to assist them with personal development.',
        'You prefer to find solutions through talking with others and creating rapport.',
        'You like working through problems by talking through issues with others.',
        'You like to engage in social interactions and relationship building.',
        'You have an interest in helping, teaching, counseling, or serving others.'
      ]
    };
    
    return bullets[interestType] || [
      'You have a strong interest in this particular field.',
      'You exhibit natural talents and inclinations related to this interest area.',
      'Your assessment responses indicate a good fit for careers in this domain.',
      'This interest type aligns well with your personality and aptitude.',
      'Consider exploring career options that leverage this interest area.'
    ];
  };
  
  // Helper function to get motivator type bullet points
  const getMotivatorTypeBullets = (motivatorType: string): string[] => {
    const bullets: Record<string, string[]> = {
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
    
    return bullets[motivatorType] || [
      'This motivator significantly influences your career satisfaction.',
      'Your assessment responses indicate a strong preference for this value.',
      'Consider career options that align with this motivational factor.',
      'Work environments that support this value will likely increase your job satisfaction.',
      'This motivator should be a key consideration in your career planning.'
    ];
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-white border rounded-lg shadow-sm p-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Download Detailed PDF Report</h3>
          <p className="text-sm text-muted-foreground">
            Get a comprehensive PDF report with detailed analysis of your assessment results
          </p>
        </div>
        <Button 
          onClick={generatePdf} 
          disabled={isGenerating}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          {isGenerating ? "Generating PDF..." : "Generate PDF Report"}
        </Button>
      </div>
    </div>
  );
};

export default ReportPDFGenerator;
