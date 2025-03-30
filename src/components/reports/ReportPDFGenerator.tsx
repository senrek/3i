import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  formatPersonalityType, 
  formatLearningStyle,
  formatSkillLevel,
  formatCurrentStage,
  formatCareerClusters,
  generatePdfDate
} from '@/utils/pdfFormatting';

// Importing logo for PDF header
import { Database } from '@/integrations/supabase/types';

interface ReportPDFGeneratorProps {
  reportId: string;
  userName: string;
  scores: any;
  responses: Record<string, string> | null;
  strengthAreas: string[];
  developmentAreas: string[];
}

const ReportPDFGenerator = ({ 
  reportId, 
  userName, 
  scores, 
  responses,
  strengthAreas,
  developmentAreas
}: ReportPDFGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<Record<string, any>>({});
  
  const generatePDF = async () => {
    try {
      setIsGenerating(true);
      toast.loading('Generating your comprehensive report...');
      
      // Initialize PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Extract profile info
      const userNameParts = userName.split(' ');
      const firstName = userNameParts[0] || 'Student';
      const lastName = userNameParts.slice(1).join(' ') || '';
      const fullName = `${firstName} ${lastName}`.trim();
      
      // Format creation date
      const creationDate = generatePdfDate();
      
      // Pre-fetch all AI-generated content to include in the PDF
      const contentTypes = [
        'executiveSummary',
        'careerRecommendation',
        'educationPathways',
        'alternativeCareers',
        'developmentPlan'
      ];
      
      // Build assessment data
      const assessmentData = {
        userName: fullName,
        scores,
        strengthAreas,
        developmentAreas,
        responses,
        responseHighlights: {},
        topCareer: scores.careerRecommendations[0] || null
      };
      
      // Fetch AI content for each section
      const contentPromises = contentTypes.map(async (contentType) => {
        try {
          const { data, error } = await supabase.functions.invoke('generate-ai-content', {
            body: { contentType, assessmentData }
          });
          
          if (error) throw error;
          return { type: contentType, content: data.content, metadata: data.metadata };
        } catch (err) {
          console.error(`Error generating ${contentType}:`, err);
          return { 
            type: contentType, 
            content: `Unable to generate ${contentType} content. Please try again later.`,
            metadata: null
          };
        }
      });
      
      const results = await Promise.all(contentPromises);
      
      // Store generated content
      const contentMap: Record<string, any> = {};
      results.forEach(result => {
        contentMap[result.type] = {
          content: result.content,
          metadata: result.metadata
        };
      });
      
      setGeneratedContent(contentMap);
      
      // Set PDF metadata
      pdf.setProperties({
        title: `Career Assessment Report - ${fullName}`,
        subject: 'Career Assessment',
        author: 'Career Counselor AI',
        keywords: 'career, assessment, report',
        creator: 'Career Counselor AI'
      });
      
      // Helper function to add text with line breaking
      const addWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
        const textLines = pdf.splitTextToSize(text, maxWidth);
        pdf.text(textLines, x, y);
        return (textLines.length - 1) * lineHeight;
      };
      
      // Add cover page
      pdf.setFillColor(52, 152, 219); // Blue header
      pdf.rect(0, 0, 210, 40, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(24);
      pdf.text('Career Assessment Report', 105, 25, { align: 'center' });
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(16);
      pdf.text(`Report Prepared for:`, 105, 60, { align: 'center' });
      
      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      pdf.text(fullName, 105, 70, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Date: ${creationDate}`, 105, 80, { align: 'center' });
      
      pdf.setFontSize(10);
      const disclaimer = 'This report is intended only for the use of the individual to which it is addressed and may contain information that is confidential. No part of this report may be reproduced in any form or manner without prior written permission.';
      addWrappedText(disclaimer, 20, 100, 170, 5);
      
      pdf.setFillColor(52, 152, 219); // Blue footer
      pdf.rect(0, 270, 210, 27, 'F');
      
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.text('Powered by Career Counselor AI', 105, 285, { align: 'center' });
      
      // Executive Summary section
      pdf.addPage();
      
      // Page header
      pdf.setFillColor(52, 152, 219);
      pdf.rect(0, 0, 210, 20, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Executive Summary', 105, 13, { align: 'center' });
      
      // Reset text style
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      // Add executive summary from AI
      let yPosition = 30;
      const executiveSummaryContent = contentMap.executiveSummary?.content || 
        "The executive summary provides an overview of your assessment results, highlighting key findings about your personality, interests, skills, and recommended career paths based on your unique profile.";
      
      // Add personal profiling header
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Personal Profiling', 20, yPosition);
      yPosition += 10;
      
      // Calculate current planning stage
      const currentStage = formatCurrentStage(scores.aptitude, scores.personality);
      
      // Display current stage diagram
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.text('Current Stage of Planning', 20, yPosition);
      yPosition += 8;
      
      pdf.setFont('helvetica', 'bold');
      pdf.text(currentStage, 20, yPosition);
      yPosition += 8;
      
      // Draw stage progression bar
      const stages = ['Ignorant', 'Confused', 'Diffused', 'Methodical', 'Optimized'];
      const stageWidth = 34;
      
      pdf.setDrawColor(200, 200, 200);
      pdf.setFillColor(220, 220, 220);
      pdf.roundedRect(20, yPosition, 170, 10, 2, 2, 'FD');
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      
      stages.forEach((stage, index) => {
        const x = 20 + (index * stageWidth);
        
        // Highlight current stage
        if (stage === currentStage) {
          pdf.setFillColor(52, 152, 219);
          pdf.roundedRect(x, yPosition, stageWidth, 10, 2, 2, 'F');
          pdf.setTextColor(255, 255, 255);
        } else {
          pdf.setTextColor(100, 100, 100);
        }
        
        pdf.text(stage, x + (stageWidth/2), yPosition + 6, { align: 'center' });
        pdf.setTextColor(0, 0, 0);
      });
      
      yPosition += 15;
      
      // Add stage description
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.text(`${currentStage}:`, 20, yPosition);
      
      pdf.setFont('helvetica', 'normal');
      let stageDescription = "";
      
      switch(currentStage) {
        case "Ignorant":
          stageDescription = "You are at the ignorant stage in career planning. You need more information about career options and planning. Most career decisions are based on superficial information or influence of others.";
          break;
        case "Confused":
          stageDescription = "You are at the confused stage in career planning. You have some information but feel overwhelmed with choices. Most career decisions are based on limited understanding of options.";
          break;
        case "Diffused":
          stageDescription = "You are at the diffused stage in career planning. You have a fair idea of suitable careers but need more information to understand the complete career path and execution plan. Lack of complete information can adversely impact your career.";
          break;
        case "Methodical":
          stageDescription = "You are at the methodical stage in career planning. You have good understanding of career options and have begun systematic planning. Your decisions are methodical but may need refinement.";
          break;
        case "Optimized":
          stageDescription = "You are at the optimized stage in career planning. You have excellent understanding of career options and a clear execution plan. Your decisions are well-informed and aligned with your abilities.";
          break;
      }
      
      yPosition += addWrappedText(stageDescription, 20, yPosition + 5, 170, 5) + 10;
      
      // Add risks and action plan
      pdf.setFont('helvetica', 'bold');
      pdf.text("Risk Involved:", 20, yPosition);
      pdf.setFont('helvetica', 'normal');
      
      let riskDescription = "";
      switch(currentStage) {
        case "Ignorant":
          riskDescription = "Career misalignment, poor decisions, wasted time and resources, long-term career dissatisfaction";
          break;
        case "Confused":
          riskDescription = "Decision paralysis, career misalignment, anxiety, delaying important career decisions";
          break;
        case "Diffused":
          riskDescription = "Career misalignment, career path misjudgment, wrong career path projections, unnecessary stress";
          break;
        case "Methodical":
          riskDescription = "Overplanning, rigidity in approach, missing emerging opportunities";
          break;
        case "Optimized":
          riskDescription = "Minimal risk with current planning approach";
          break;
      }
      
      yPosition += addWrappedText(riskDescription, 20, yPosition + 5, 170, 5) + 10;
      
      pdf.setFont('helvetica', 'bold');
      pdf.text("Action Plan:", 20, yPosition);
      pdf.setFont('helvetica', 'normal');
      
      let actionPlan = "";
      switch(currentStage) {
        case "Ignorant":
          actionPlan = "Gather information about careers > Understand different career paths > Assess personal interests and abilities > Create basic career plan";
          break;
        case "Confused":
          actionPlan = "Narrow down options > Focus research on specific careers > Consider career counseling > Create structured comparison of options";
          break;
        case "Diffused":
          actionPlan = "Explore career path > Align your abilities and interests with the best possible career path > Create realistic execution plan > Schedule timely review of action plan";
          break;
        case "Methodical":
          actionPlan = "Fine-tune career plan > Add flexibility to approach > Continue building relevant skills > Network with professionals in chosen field";
          break;
        case "Optimized":
          actionPlan = "Continue executing career plan > Stay updated with industry trends > Regular skill enhancement > Build professional network";
          break;
      }
      
      yPosition += addWrappedText(actionPlan, 20, yPosition + 5, 170, 5) + 15;
      
      // Add the AI-generated content
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      
      const executiveSummaryLines = pdf.splitTextToSize(executiveSummaryContent, 170);
      if (yPosition + (executiveSummaryLines.length * 5) > 260) {
        pdf.addPage();
        
        // Page header
        pdf.setFillColor(52, 152, 219);
        pdf.rect(0, 0, 210, 20, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.text('Executive Summary (continued)', 105, 13, { align: 'center' });
        
        // Reset text style
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
        
        yPosition = 30;
      }
      
      // Add executive summary content
      pdf.setFont('helvetica', 'normal');
      yPosition += addWrappedText(executiveSummaryContent, 20, yPosition, 170, 5);
      
      // Add page footer
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 270, 210, 27, 'F');
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, 270, 190, 270);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Career Assessment Report - ${fullName} - Page ${pdf.getNumberOfPages()}`, 105, 278, { align: 'center' });
      
      // Career Personality Section
      pdf.addPage();
      
      // Page header
      pdf.setFillColor(52, 152, 219);
      pdf.rect(0, 0, 210, 20, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Career Personality', 105, 13, { align: 'center' });
      
      // Reset text style
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      yPosition = 30;
      
      // Add personality type header
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Result of the Career Personality', 20, yPosition);
      yPosition += 10;
      
      // Format the personality type
      const personalityData = contentMap.executiveSummary?.metadata || null;
      const personalityType = personalityData ? 
        formatPersonalityType(personalityData.personalityType) : 
        formatPersonalityType(`${scores.personality > 60 ? 'Extrovert' : 'Introvert'}:${scores.aptitude > 65 ? 'Sensing' : 'iNtuitive'}:${scores.aptitude > scores.interest ? 'Thinking' : 'Feeling'}:${scores.personality > 60 ? 'Judging' : 'Perceiving'}`);
      
      // Explanation of personality assessment
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      const personalityIntro = "Personality Assessment will help you understand yourself as a person. It will help you expand your career options in alignment with your personality. Self-understanding and awareness can lead you to more appropriate and rewarding career choices. The Personality Type Model identifies four dimensions of personality. Each dimension will give you a clear description of your personality. The combination of your most dominant preferences is used to create your individual personality type.";
      
      yPosition += addWrappedText(personalityIntro, 20, yPosition, 170, 5) + 10;
      
      // Display personality type
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Personality Type: ${personalityType}`, 20, yPosition);
      yPosition += 10;
      
      // Calculate percentages for personality dimensions
      const introvertPercentage = personalityData ? personalityData.strengthPercentages.introvert : (100 - Math.round(scores.personality * 0.8));
      const extrovertPercentage = personalityData ? personalityData.strengthPercentages.extrovert : Math.round(scores.personality * 0.8);
      
      const sensingPercentage = personalityData ? personalityData.strengthPercentages.sensing : (scores.aptitude > 65 ? Math.round(scores.aptitude * 0.9) : Math.round(100 - scores.aptitude * 0.9));
      const intuitivePercentage = personalityData ? personalityData.strengthPercentages.intuitive : (scores.aptitude <= 65 ? Math.round(scores.aptitude * 0.9) : Math.round(100 - scores.aptitude * 0.9));
      
      const thinkingPercentage = personalityData ? personalityData.strengthPercentages.thinking : (scores.aptitude > scores.interest ? 71 : 29);
      const feelingPercentage = personalityData ? personalityData.strengthPercentages.feeling : (scores.aptitude <= scores.interest ? 71 : 29);
      
      const judgingPercentage = personalityData ? personalityData.strengthPercentages.judging : (scores.personality > 60 ? 57 : 43);
      const perceivingPercentage = personalityData ? personalityData.strengthPercentages.perceiving : (scores.personality <= 60 ? 57 : 43);
      
      // Create personality dimension bars
      const drawPersonalityBar = (label1: string, percent1: number, label2: string, percent2: number, y: number) => {
        // Draw labels
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.text(`${label1}-[${percent1}%]`, 20, y);
        pdf.text(`${label2}-[${percent2}%]`, 120, y);
        
        // Draw background bar
        pdf.setDrawColor(200, 200, 200);
        pdf.setFillColor(240, 240, 240);
        pdf.roundedRect(20, y + 3, 170, 10, 2, 2, 'FD');
        
        // Draw filled portion
        pdf.setFillColor(52, 152, 219);
        pdf.roundedRect(20, y + 3, (percent1/100) * 170, 10, 2, 2, 'F');
        
        return y + 20;
      };
      
      yPosition = drawPersonalityBar("Introvert", introvertPercentage, "Extrovert", extrovertPercentage, yPosition);
      yPosition = drawPersonalityBar("Sensing", sensingPercentage, "iNtuitive", intuitivePercentage, yPosition);
      yPosition = drawPersonalityBar("Thinking", thinkingPercentage, "Feeling", feelingPercentage, yPosition);
      yPosition = drawPersonalityBar("Judging", judgingPercentage, "Perceiving", perceivingPercentage, yPosition);
      
      // Add personality analysis on next page
      pdf.addPage();
      
      // Page header
      pdf.setFillColor(52, 152, 219);
      pdf.rect(0, 0, 210, 20, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Analysis of Career Personality', 105, 13, { align: 'center' });
      
      // Reset text style
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      yPosition = 30;
      
      // Add personality analysis header
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Your Career Personality Analysis', 20, yPosition);
      yPosition += 15;
      
      // Energy focus section
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Where do you prefer to focus your energy and attention?', 20, yPosition);
      yPosition += 10;
      
      // Add energy traits based on introvert/extrovert
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      const energyTraits = [];
      if (introvertPercentage > extrovertPercentage) {
        energyTraits.push("• You mostly get your energy from dealing with ideas, pictures, memories and reactions which are part of your imaginative world.");
        energyTraits.push("• You are quiet, reserved and like to spend your time alone.");
        energyTraits.push("• Your primary mode of living is focused internally.");
        energyTraits.push("• You are passionate but not usually aggressive.");
        energyTraits.push("• You are a good listener.");
        energyTraits.push("• You are more of an inside-out person.");
      } else {
        energyTraits.push("• You get your energy from active involvement in events and having a lot of different activities.");
        energyTraits.push("• You are more outgoing and sociable than introverted.");
        energyTraits.push("• Your primary mode of living is focused externally.");
        energyTraits.push("• You enjoy being the center of attention.");
        energyTraits.push("• You think while you talk and process information externally.");
        energyTraits.push("• You are more of an outside-in person.");
      }
      
      energyTraits.forEach(trait => {
        yPosition += addWrappedText(trait, 20, yPosition, 170, 5) + 5;
      });
      
      yPosition += 5;
      
      // Information processing section
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('How do you grasp and process the information?', 20, yPosition);
      yPosition += 10;
      
      // Add information traits based on sensing/intuitive
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      const infoTraits = [];
      if (sensingPercentage > intuitivePercentage) {
        infoTraits.push("• You mostly collect and trust the information that is presented in a detailed and sequential manner.");
        infoTraits.push("• You think more about the present and learn from the past.");
        infoTraits.push("• You like to see the practical use of things and learn best from practice.");
        infoTraits.push("• You notice facts and remember details that are important to you.");
        infoTraits.push("• You solve problems by working through facts until you understand the problem.");
        infoTraits.push("• You create meaning from conscious thought and learn by observation.");
      } else {
        infoTraits.push("• You prefer to gather information by seeing the big picture and looking for patterns and possibilities.");
        infoTraits.push("• You are more interested in the future than the present or past.");
        infoTraits.push("• You like to think about the theoretical and abstract.");
        infoTraits.push("• You remember details when they relate to a pattern.");
        infoTraits.push("• You solve problems by leaping between different ideas and possibilities.");
        infoTraits.push("• You are imaginative and conceptual in your thinking.");
      }
      
      infoTraits.forEach(trait => {
        yPosition += addWrappedText(trait, 20, yPosition, 170, 5) + 5;
      });
      
      // Check if we need to add a page
      if (yPosition > 240) {
        pdf.addPage();
        
        // Page header
        pdf.setFillColor(52, 152, 219);
        pdf.rect(0, 0, 210, 20, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.text('Analysis of Career Personality (continued)', 105, 13, { align: 'center' });
        
        // Reset text style
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
        
        yPosition = 30;
      } else {
        yPosition += 5;
      }
      
      // Decision making section
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('How do you make decisions?', 20, yPosition);
      yPosition += 10;
      
      // Add decision traits based on thinking/feeling
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      const decisionTraits = [];
      if (thinkingPercentage > feelingPercentage) {
        decisionTraits.push("• You seem to make decisions based on logic rather than the circumstances.");
        decisionTraits.push("• You believe telling truth is more important than being tactful.");
        decisionTraits.push("• You seem to look for logical explanations or solutions to almost everything.");
        decisionTraits.push("• You can often be seen as very task-oriented, uncaring, or indifferent.");
        decisionTraits.push("• You are ruled by your head instead of your heart.");
        decisionTraits.push("• You are a critical thinker and oriented toward problem solving.");
      } else {
        decisionTraits.push("• You make decisions based on personal values and how your actions affect others.");
        decisionTraits.push("• You value harmony and empathy more than logical clarity.");
        decisionTraits.push("• You consider the impact of decisions on people and their feelings.");
        decisionTraits.push("• You often appear warm, empathetic, and personable to others.");
        decisionTraits.push("• You are ruled more by your heart than your head.");
        decisionTraits.push("• You seek consensus and appreciation in decisions.");
      }
      
      decisionTraits.forEach(trait => {
        yPosition += addWrappedText(trait, 20, yPosition, 170, 5) + 5;
      });
      
      // Check if we need to add a page
      if (yPosition > 240) {
        pdf.addPage();
        
        // Page header
        pdf.setFillColor(52, 152, 219);
        pdf.rect(0, 0, 210, 20, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.text('Analysis of Career Personality (continued)', 105, 13, { align: 'center' });
        
        // Reset text style
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
        
        yPosition = 30;
      } else {
        yPosition += 5;
      }
      
      // Work style section
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('How do you prefer to plan your work?', 20, yPosition);
      yPosition += 10;
      
      // Add work style traits based on judging/perceiving
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      const workTraits = [];
      if (judgingPercentage > perceivingPercentage) {
        workTraits.push("• You prefer a planned or orderly way of life.");
        workTraits.push("• You like to have things well-organized.");
        workTraits.push("• Your productivity increases when working with structure.");
        workTraits.push("• You are self-disciplined and decisive.");
        workTraits.push("• You like to have things decided and planned before doing any task.");
        workTraits.push("• You seek closure and enjoy completing tasks.");
        workTraits.push("• Mostly, you think sequentially.");
      } else {
        workTraits.push("• You prefer a flexible and adaptable approach to life.");
        workTraits.push("• You like to go with the flow and adapt to changing circumstances.");
        workTraits.push("• You work best when deadlines are flexible and processes can be adjusted.");
        workTraits.push("• You tend to be spontaneous and open to new information.");
        workTraits.push("• You prefer to stay open to new experiences and information.");
        workTraits.push("• You enjoy starting tasks more than completing them.");
        workTraits.push("• Mostly, you think in a non-linear fashion.");
      }
      
      workTraits.forEach(trait => {
        yPosition += addWrappedText(trait, 20, yPosition, 170, 5) + 5;
      });
      
      yPosition += 5;
      
      // Strengths section
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Your strengths', 20, yPosition);
      yPosition += 10;
      
      // Add strengths based on personality type
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      const personalityStrengths = [];
      if (personalityType.includes("Introvert:Sensing:Thinking:Judging")) {
        personalityStrengths.push("• Strong-willed and dutiful");
        personalityStrengths.push("• Calm and practical");
        personalityStrengths.push("• Honest and direct");
        personalityStrengths.push("• Very responsible");
        personalityStrengths.push("• Create and enforce order");
      } else if (personalityType.includes("Extrovert:Sensing:Thinking:Judging")) {
        personalityStrengths.push("• Practical and realistic");
        personalityStrengths.push("• Strong organizational skills");
        personalityStrengths.push("• Decisive and efficient");
        personalityStrengths.push("• Strategic leadership");
        personalityStrengths.push("• Results-oriented");
      } else if (personalityType.includes("Introvert:iNtuitive:Thinking:Judging")) {
        personalityStrengths.push("• Strategic thinking");
        personalityStrengths.push("• Independent and determined");
        personalityStrengths.push("• Highly analytical");
        personalityStrengths.push("• Original thinking");
        personalityStrengths.push("• Excellent problem solver");
      } else {
        // Generic strengths for other personality types
        personalityStrengths.push("• " + strengthAreas[0] || "Problem-solving ability");
        personalityStrengths.push("• " + strengthAreas[1] || "Analytical thinking");
        personalityStrengths.push("• " + strengthAreas[2] || "Attention to detail");
        personalityStrengths.push("• Self-discipline");
        personalityStrengths.push("• Practical approach to tasks");
      }
      
      personalityStrengths.forEach(strength => {
        yPosition += addWrappedText(strength, 20, yPosition, 170, 5) + 5;
      });
      
      // Add page footer
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 270, 210, 27, 'F');
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, 270, 190, 270);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Career Assessment Report - ${fullName} - Page ${pdf.getNumberOfPages()}`, 105, 278, { align: 'center' });
      
      // Add Career Interest Section
      pdf.addPage();
      
      // Page header
      pdf.setFillColor(52, 152, 219);
      pdf.rect(0, 0, 210, 20, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Career Interest', 105, 13, { align: 'center' });
      
      // Reset text style
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11
