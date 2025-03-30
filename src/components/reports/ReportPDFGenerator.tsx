
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
  formatSubjectRecommendations,
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
      pdf.setFontSize(11);
      
      yPosition = 30;
      
      // Add interest type header
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Your Career Interest Types', 20, yPosition);
      yPosition += 10;
      
      // Explanation text
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      const interestIntro = "The Career Interest Assessment will help you understand which careers might be the best fit for you. It is meant to help you find careers that you might enjoy. Understanding your Top career interest will help you identify a career focus and begin your career planning and career exploration process.";
      
      yPosition += addWrappedText(interestIntro, 20, yPosition, 170, 5) + 10;
      
      const interestExplanation = "The Career Interest Assessment (CIA) measures six broad interest patterns that can be used to describe your career interest. Most people's interests are reflected by two or three themes, combined to form a cluster of interests. This career interest is directly linked to your occupational interest.";
      
      yPosition += addWrappedText(interestExplanation, 20, yPosition, 170, 5) + 15;
      
      // Create interest type chart
      const interestTypes = personalityData?.interestTypes || [
        { name: 'Investigative', value: Math.round(scores.aptitude * 1.2) },
        { name: 'Conventional', value: Math.round(scores.personality * 0.6) },
        { name: 'Realistic', value: Math.round(scores.aptitude * 0.6) },
        { name: 'Enterprising', value: Math.round(scores.personality * 0.4) },
        { name: 'Artistic', value: Math.round(scores.interest * 0.3) },
        { name: 'Social', value: Math.round(scores.personality * 0.15) }
      ];
      
      // Sort from highest to lowest
      interestTypes.sort((a, b) => b.value - a.value);
      
      // Draw horizontal bar chart
      const barHeight = 10;
      const barSpacing = 7;
      const barWidth = 120;
      const labelWidth = 30;
      const valueWidth = 20;
      
      interestTypes.forEach((interest, index) => {
        const y = yPosition + (index * (barHeight + barSpacing));
        
        // Draw label
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.text(interest.name, 20, y + (barHeight/2) + 3);
        
        // Draw background bar
        pdf.setDrawColor(200, 200, 200);
        pdf.setFillColor(240, 240, 240);
        pdf.roundedRect(labelWidth + 20, y, barWidth, barHeight, 2, 2, 'FD');
        
        // Draw filled portion
        pdf.setFillColor(52, 152, 219);
        const fillWidth = (interest.value/100) * barWidth;
        pdf.roundedRect(labelWidth + 20, y, fillWidth, barHeight, 2, 2, 'F');
        
        // Draw value
        pdf.text(interest.value.toString(), labelWidth + barWidth + 25, y + (barHeight/2) + 3);
      });
      
      yPosition += (interestTypes.length * (barHeight + barSpacing)) + 20;
      
      // Add Career Interest Analysis on next page
      pdf.addPage();
      
      // Page header
      pdf.setFillColor(52, 152, 219);
      pdf.rect(0, 0, 210, 20, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Analysis of Career Interest', 105, 13, { align: 'center' });
      
      // Reset text style
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      yPosition = 30;
      
      // Add interest analysis header
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Your Career Interest Analysis', 20, yPosition);
      yPosition += 15;
      
      // Add detailed description for top 3 interest types
      const topInterests = interestTypes.slice(0, 3);
      
      topInterests.forEach((interest, index) => {
        // Interest type header
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text(`${interest.name}-${interest.value > 80 ? 'HIGH' : interest.value > 50 ? 'MEDIUM' : 'LOW'}`, 20, yPosition);
        yPosition += 10;
        
        // Interest description
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
        
        const traits = [];
        switch(interest.name) {
          case 'Investigative':
            traits.push("• You are analytical, intellectual, observant and enjoy research.");
            traits.push("• You enjoy using logic and solving complex problems.");
            traits.push("• You are interested in occupations that require observation, learning and investigation.");
            traits.push("• You are introspective and focused on creative problem solving.");
            traits.push("• You prefer working with ideas and using technology.");
            break;
          case 'Conventional':
            traits.push("• You are efficient, careful, conforming, organized and conscientious.");
            traits.push("• You are organized, detail-oriented and do well with manipulating data and numbers.");
            traits.push("• You are persistent and reliable in carrying out tasks.");
            traits.push("• You enjoy working with data, details and creating reports.");
            traits.push("• You prefer working in a structured environment.");
            traits.push("• You like to work with data, and you have a numerical or clerical ability.");
            break;
          case 'Realistic':
            traits.push("• You are active, stable and enjoy hands-on or manual activities.");
            traits.push("• You prefer to work with things rather than ideas and people.");
            traits.push("• You tend to communicate in a frank, direct manner and value material things.");
            traits.push("• You may be uncomfortable or less adept with human relations.");
            traits.push("• You value practical things that you can see and touch.");
            traits.push("• You have good skills at handling tools, mechanical drawings, machines or animals.");
            break;
          case 'Enterprising':
            traits.push("• You are energetic, ambitious, adventurous, and confident.");
            traits.push("• You are skilled in leadership and speaking.");
            traits.push("• You generally enjoy starting your own business, promoting ideas and managing people.");
            traits.push("• You are effective at public speaking and are generally social.");
            traits.push("• You like activities that requires to persuade others and leadership roles.");
            traits.push("• You like the promotion of products, ideas, or services.");
            break;
          case 'Artistic':
            traits.push("• You are creative, original, independent, chaotic, and innovative.");
            traits.push("• You are drawn to unstructured activities that allow creativity and self-expression.");
            traits.push("• You enjoy performing and visual arts, writing, and creative expression.");
            traits.push("• You value aesthetics and are sensitive to your environment.");
            traits.push("• You are often expressive, intuitive, and non-conforming.");
            break;
          case 'Social':
            traits.push("• You are friendly, helpful, idealistic, responsible, and cooperative.");
            traits.push("• You like working with and helping people.");
            traits.push("• You prefer solving problems through discussion and teamwork.");
            traits.push("• You enjoy teaching, providing guidance, and helping others with their problems.");
            traits.push("• You are drawn to activities involving informing, enlightening, helping, training, or curing others.");
            break;
        }
        
        traits.forEach(trait => {
          yPosition += addWrappedText(trait, 20, yPosition, 170, 5) + 5;
        });
        
        // Add space between interests
        yPosition += 15;
        
        // Check if we need to add a page
        if (yPosition > 240 && index < topInterests.length - 1) {
          pdf.addPage();
          
          // Page header
          pdf.setFillColor(52, 152, 219);
          pdf.rect(0, 0, 210, 20, 'F');
          pdf.setTextColor(255, 255, 255);
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(14);
          pdf.text('Analysis of Career Interest (continued)', 105, 13, { align: 'center' });
          
          // Reset text style
          pdf.setTextColor(0, 0, 0);
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(11);
          
          yPosition = 30;
        }
      });
      
      // Add Career Motivator Section
      pdf.addPage();
      
      // Page header
      pdf.setFillColor(52, 152, 219);
      pdf.rect(0, 0, 210, 20, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Career Motivator', 105, 13, { align: 'center' });
      
      // Reset text style
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      yPosition = 30;
      
      // Add motivator type header
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Your Career Motivator Types', 20, yPosition);
      yPosition += 10;
      
      // Explanation text
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      const motivatorIntro = "Values are the things that are most important to us in our lives and careers. Our values are formed in a variety of ways through our life experiences, our feelings and our families. In the context of Career Planning, values generally refer to the things we value in a career. Being aware of what we value in our lives is important because a career choice that is in-line with our core beliefs and values is more likely to be a lasting and positive choice";
      
      yPosition += addWrappedText(motivatorIntro, 20, yPosition, 170, 5) + 15;
      
      // Create motivator type chart
      const motivatorTypes = personalityData?.motivatorTypes || [
        { name: 'Independence', value: Math.min(100, Math.round((100 - scores.personality) * 1.1)) },
        { name: 'Continuous Learning', value: Math.min(100, Math.round(scores.aptitude * 1.1)) },
        { name: 'Social Service', value: Math.min(100, Math.round(scores.personality * 1.1)) },
        { name: 'Structured work environment', value: Math.round(scores.personality * 0.5) },
        { name: 'Adventure', value: Math.round(scores.interest * 0.5) },
        { name: 'High Paced Environment', value: Math.round(scores.aptitude * 0.3) },
        { name: 'Creativity', value: Math.round(scores.interest * 0.25) }
      ];
      
      // Sort from highest to lowest
      motivatorTypes.sort((a, b) => b.value - a.value);
      
      // Draw horizontal bar chart
      motivatorTypes.forEach((motivator, index) => {
        const y = yPosition + (index * (barHeight + barSpacing));
        
        // Draw label
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.text(motivator.name, 20, y + (barHeight/2) + 3);
        
        // Draw background bar
        pdf.setDrawColor(200, 200, 200);
        pdf.setFillColor(240, 240, 240);
        pdf.roundedRect(labelWidth + 70, y, barWidth, barHeight, 2, 2, 'FD');
        
        // Draw filled portion
        pdf.setFillColor(52, 152, 219);
        const fillWidth = (motivator.value/100) * barWidth;
        pdf.roundedRect(labelWidth + 70, y, fillWidth, barHeight, 2, 2, 'F');
        
        // Draw value
        pdf.text(motivator.value.toString(), labelWidth + barWidth + 75, y + (barHeight/2) + 3);
      });
      
      yPosition += (motivatorTypes.length * (barHeight + barSpacing)) + 20;
      
      // Add Career Motivator Analysis on next page if needed
      if (yPosition > 210) {
        pdf.addPage();
        
        // Page header
        pdf.setFillColor(52, 152, 219);
        pdf.rect(0, 0, 210, 20, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.text('Analysis of Career Motivator', 105, 13, { align: 'center' });
        
        // Reset text style
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
        
        yPosition = 30;
      }
      
      // Add motivator analysis header
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Your Career Motivator Analysis', 20, yPosition);
      yPosition += 15;
      
      // Add detailed description for top 3 motivator types
      const topMotivators = motivatorTypes.slice(0, 3);
      
      topMotivators.forEach((motivator, index) => {
        // Motivator type header
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text(`${motivator.name}-${motivator.value > 80 ? 'HIGH' : motivator.value > 50 ? 'MEDIUM' : 'LOW'}`, 20, yPosition);
        yPosition += 10;
        
        // Motivator description
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
        
        const traits = [];
        switch(motivator.name) {
          case 'Independence':
            traits.push("• You enjoy working independently.");
            traits.push("• You dislike too much supervision.");
            traits.push("• You dislike group activities.");
            break;
          case 'Continuous Learning':
            traits.push("• You like to have consistent professional growth in your field of work.");
            traits.push("• You like to work in an environment where there is need to update your knowledge at regular intervals.");
            traits.push("• You like it when your work achievements are evaluated at regular intervals.");
            break;
          case 'Social Service':
            traits.push("• You like to do work which has some social responsibility.");
            traits.push("• You like to do work which impacts the world.");
            traits.push("• You like to receive social recognition for the work that you do.");
            break;
          case 'Structured work environment':
            traits.push("• You prefer working in an organized, predictable environment.");
            traits.push("• You value clear guidelines, procedures, and expectations.");
            traits.push("• You appreciate having a defined hierarchy and processes.");
            break;
          case 'Adventure':
            traits.push("• You enjoy taking risks and exploring new possibilities.");
            traits.push("• You are drawn to challenging or exciting work environments.");
            traits.push("• You value variety and unpredictability in your work.");
            break;
          case 'High Paced Environment':
            traits.push("• You thrive in fast-paced, dynamic work settings.");
            traits.push("• You enjoy working under pressure and with tight deadlines.");
            traits.push("• You are energized by challenges and quick decision-making.");
            break;
          case 'Creativity':
            traits.push("• You value opportunities for creative expression and innovation.");
            traits.push("• You enjoy work that allows you to think outside the box.");
            traits.push("• You prefer environments that encourage new ideas and approaches.");
            break;
        }
        
        traits.forEach(trait => {
          yPosition += addWrappedText(trait, 20, yPosition, 170, 5) + 5;
        });
        
        // Add space between motivators
        yPosition += 10;
        
        // Check if we need to add a page
        if (yPosition > 240 && index < topMotivators.length - 1) {
          pdf.addPage();
          
          // Page header
          pdf.setFillColor(52, 152, 219);
          pdf.rect(0, 0, 210, 20, 'F');
          pdf.setTextColor(255, 255, 255);
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(14);
          pdf.text('Analysis of Career Motivator (continued)', 105, 13, { align: 'center' });
          
          // Reset text style
          pdf.setTextColor(0, 0, 0);
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(11);
          
          yPosition = 30;
        }
      });
      
      // Add Learning Style Section
      pdf.addPage();
      
      // Page header
      pdf.setFillColor(52, 152, 219);
      pdf.rect(0, 0, 210, 20, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Learning Style', 105, 13, { align: 'center' });
      
      // Reset text style
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      yPosition = 30;
      
      // Add learning style header
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Your Learning Style Types', 20, yPosition);
      yPosition += 15;
      
      // Create learning style chart
      const learningStyles = personalityData?.learningStyles || [
        { name: 'Read & Write Learning', value: Math.round(scores.aptitude * 0.5) },
        { name: 'Auditory learning', value: Math.round(scores.personality * 0.3) },
        { name: 'Visual Learning', value: Math.round(scores.interest * 0.3) },
        { name: 'Kinesthetic Learning', value: Math.round(scores.learningStyle * 0.2) }
      ];
      
      // Sort from highest to lowest
      learningStyles.sort((a, b) => b.value - a.value);
      
      // Draw horizontal bar chart
      learningStyles.forEach((style, index) => {
        const y = yPosition + (index * (barHeight + barSpacing));
        
        // Draw label
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.text(style.name, 20, y + (barHeight/2) + 3);
        
        // Draw background bar
        pdf.setDrawColor(200, 200, 200);
        pdf.setFillColor(240, 240, 240);
        pdf.roundedRect(labelWidth + 70, y, barWidth, barHeight, 2, 2, 'FD');
        
        // Draw filled portion
        pdf.setFillColor(52, 152, 219);
        const fillWidth = (style.value/100) * barWidth;
        pdf.roundedRect(labelWidth + 70, y, fillWidth, barHeight, 2, 2, 'F');
        
        // Draw value
        pdf.text(style.value.toString(), labelWidth + barWidth + 75, y + (barHeight/2) + 3);
      });
      
      yPosition += (learningStyles.length * (barHeight + barSpacing)) + 20;
      
      // Add Learning Style Analysis
      pdf.addPage();
      
      // Page header
      pdf.setFillColor(52, 152, 219);
      pdf.rect(0, 0, 210, 20, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Analysis of Learning Style', 105, 13, { align: 'center' });
      
      // Reset text style
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      yPosition = 30;
      
      // Add learning style analysis header
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Your Learning Style Analysis', 20, yPosition);
      yPosition += 15;
      
      // Add detailed description for top learning style
      const topLearningStyle = learningStyles[0];
      
      // Learning style header
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text(`${topLearningStyle.name} style`, 20, yPosition);
      yPosition += 10;
      
      // Learning style description
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      let styleDescription = "";
      let styleStrategies: string[] = [];
      
      switch(topLearningStyle.name) {
        case 'Read & Write Learning':
          styleDescription = "• Reading and writing learners prefer to take in the information displayed as words.\n• These learners strongly prefer primarily text-based learning materials.\n• Emphasis is based on text-based input and output, i.e. reading and writing in all its forms.\n• People who prefer this modality love to work using PowerPoint, internet, lists, dictionaries and words.";
          
          styleStrategies = [
            "• Re-write your notes after class.",
            "• Use coloured pens and highlighters to focus on key ideas.",
            "• Write notes to yourself in the margins.",
            "• Write out key concepts and ideas.",
            "• Compose short explanations for diagrams, charts and graphs.",
            "• Write out instructions for each step of a procedure or math problem.",
            "• Print out your notes for later review.",
            "• Post note cards/post-its in visible places.",
            "• Vocabulary mnemonics.",
            "• Organize your notes/key concepts into a powerpoint presentation.",
            "• Compare your notes with others.",
            "• Repetitive writing."
          ];
          break;
        case 'Auditory learning':
          styleDescription = "• Auditory learners prefer to learn by listening and speaking.\n• These learners learn best through verbal instructions, discussions, and talking things through.\n• They may struggle with reading and writing tasks but excel at verbal explaining and presenting.\n• People who prefer this modality love lectures, discussions, podcasts, and oral exams.";
          
          styleStrategies = [
            "• Record lectures and listen to them again.",
            "• Discuss topics with friends and teachers.",
            "• Read your notes aloud when studying.",
            "• Participate in group discussions.",
            "• Use verbal analogies and storytelling to memorize content.",
            "• Create rhymes and songs about the material.",
            "• Use audio books when available.",
            "• Explain concepts to others verbally.",
            "• Use mnemonic devices and verbal repetition.",
            "• Study in quiet environments to avoid auditory distractions."
          ];
          break;
        case 'Visual Learning':
          styleDescription = "• Visual learners prefer to see information and visualize the relationships between ideas.\n• These learners learn best through visual aids like diagrams, charts, pictures, and videos.\n• They have a good spatial sense and can easily understand maps and directions.\n• People who prefer this modality love using colors, diagrams, mind maps, and visual organizers.";
          
          styleStrategies = [
            "• Use colors, highlighters, and symbols in your notes.",
            "• Create mind maps and diagrams to connect ideas.",
            "• Watch videos and demonstrations.",
            "• Draw pictures and charts to represent information.",
            "• Use flashcards with pictures or symbols.",
            "• Sit near the front of the class to see presentations clearly.",
            "• Visualize concepts and ideas as pictures.",
            "• Convert text information into charts, graphs, or diagrams.",
            "• Use visual metaphors and analogies.",
            "• Study in a space free from visual distractions."
          ];
          break;
        case 'Kinesthetic Learning':
          styleDescription = "• Kinesthetic learners prefer hands-on learning and physical activities.\n• These learners learn best through touching, feeling, and experiencing what they're learning about.\n• They may struggle sitting still for long periods and prefer to be active while learning.\n• People who prefer this modality love practical exercises, field trips, lab work, and role-playing.";
          
          styleStrategies = [
            "• Take frequent study breaks to move around.",
            "• Use physical objects or manipulatives when possible.",
            "• Act out concepts or use role-play.",
            "• Create models or physical representations.",
            "• Study while standing or moving.",
            "• Trace words or concepts with your finger.",
            "• Use real-life examples and applications.",
            "• Participate in field trips and hands-on activities.",
            "• Use physical memory techniques (muscle memory).",
            "• Practice experiments and demonstrations."
          ];
          break;
      }
      
      yPosition += addWrappedText(styleDescription, 20, yPosition, 170, 5) + 15;
      
      // Add Learning improvement strategies
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Learning improvement strategies', 20, yPosition);
      yPosition += 10;
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      styleStrategies.forEach(strategy => {
        yPosition += addWrappedText(strategy, 20, yPosition, 170, 5) + 5;
      });
      
      // Add Skills and Abilities Section
      pdf.addPage();
      
      // Page header
      pdf.setFillColor(52, 152, 219);
      pdf.rect(0, 0, 210, 20, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Skills and Abilities', 105, 13, { align: 'center' });
      
      // Reset text style
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      yPosition = 30;
      
      // Add skills header
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Your Skills and Abilities', 20, yPosition);
      yPosition += 10;
      
      // Explanation text
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      const skillsIntro = "The skills & abilities scores will help us to explore and identify different ways to reshape your career direction. This simple graph shows how you have scored on each of these skills and abilities. The graph on the top will show the average score of your overall skills and abilities.";
      
      yPosition += addWrappedText(skillsIntro, 20, yPosition, 170, 5) + 15;
      
      // Format skills data
      const skillsData = personalityData?.skillsAndAbilities || {
        overall: Math.round(scores.aptitude * 0.7),
        numerical: Math.round(scores.aptitude * 0.8),
        logical: Math.round(scores.aptitude * 0.6),
        verbal: Math.round(scores.personality * 1.2 > 100 ? 100 : scores.personality * 1.2),
        clerical: Math.round(scores.personality * 0.5),
        spatial: Math.round(scores.aptitude * 0.8),
        leadership: Math.round(scores.personality * 0.6),
        social: Math.round(scores.personality * 0.8),
        mechanical: Math.round(scores.aptitude * 0.5)
      };
      
      // Draw overall skills gauge
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Overall Skills and Abilities', 20, yPosition);
      yPosition += 15;
      
      // Draw gauge background
      pdf.setDrawColor(200, 200, 200);
      pdf.setFillColor(240, 240, 240);
      pdf.roundedRect(60, yPosition, 120, 15, 2, 2, 'FD');
      
      // Draw filled portion
      if (skillsData.overall < 33) {
        pdf.setFillColor(231, 76, 60); // Red for low
      } else if (skillsData.overall < 66) {
        pdf.setFillColor(243, 156, 18); // Yellow for medium
      } else {
        pdf.setFillColor(46, 204, 113); // Green for high
      }
      
      const fillWidth = (skillsData.overall/100) * 120;
      pdf.roundedRect(60, yPosition, fillWidth, 15, 2, 2, 'F');
      
      // Add labels
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.text('0', 60, yPosition + 22);
      pdf.text('100', 180, yPosition + 22);
      
      // Add percentage
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text(`${skillsData.overall}%`, 120, yPosition + 10, { align: 'center' });
      
      // Add skill level
      pdf.setFont('helvetica', 'normal');
      const skillLevel = formatSkillLevel(skillsData.overall);
      pdf.text(skillLevel, 120, yPosition + 22, { align: 'center' });
      
      yPosition += 35;
      
      // Add detailed skills assessment
      
      // Numerical ability
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Numerical Ability', 20, yPosition);
      yPosition += 10;
      
      // Draw gauge background
      pdf.setDrawColor(200, 200, 200);
      pdf.setFillColor(240, 240, 240);
      pdf.roundedRect(20, yPosition, 50, 10, 2, 2, 'FD');
      
      // Draw filled portion
      if (skillsData.numerical < 33) {
        pdf.setFillColor(231, 76, 60); // Red for low
      } else if (skillsData.numerical < 66) {
        pdf.setFillColor(243, 156, 18); // Yellow for medium
      } else {
        pdf.setFillColor(46, 204, 113); // Green for high
      }
      
      const numFillWidth = (skillsData.numerical/100) * 50;
      pdf.roundedRect(20, yPosition, numFillWidth, 10, 2, 2, 'F');
      
      // Add labels
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.text('0', 20, yPosition + 15);
      pdf.text('100', 70, yPosition + 15);
      
      // Skill description
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.text(`• Your numerical skills are ${formatSkillLevel(skillsData.numerical).toLowerCase()}.`, 80, yPosition);
      yPosition += 8;
      pdf.text('• Numeracy involves an understanding of numerical data and numbers.', 80, yPosition);
      yPosition += 8;
      pdf.text('• Being competent and confident while working with numbers is a skill', 80, yPosition);
      yPosition += 8;
      pdf.text('  that holds an advantage in a wide range of career options.', 80, yPosition);
      
      yPosition += 20;
      
      // Check if we need a new page
      if (yPosition > 240) {
        pdf.addPage();
        
        // Page header
        pdf.setFillColor(52, 152, 219);
        pdf.rect(0, 0, 210, 20, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.text('Skills and Abilities (continued)', 105, 13, { align: 'center' });
        
        // Reset text style
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
        
        yPosition = 30;
      }
      
      // Add more skills - only 1-2 skills per page to avoid crowding
      
      // Logical ability
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Logical Ability', 20, yPosition);
      yPosition += 10;
      
      // Draw gauge background
      pdf.setDrawColor(200, 200, 200);
      pdf.setFillColor(240, 240, 240);
      pdf.roundedRect(20, yPosition, 50, 10, 2, 2, 'FD');
      
      // Draw filled portion
      if (skillsData.logical < 33) {
        pdf.setFillColor(231, 76, 60); // Red for low
      } else if (skillsData.logical < 66) {
        pdf.setFillColor(243, 156, 18); // Yellow for medium
      } else {
        pdf.setFillColor(46, 204, 113); // Green for high
      }
      
      const logicalFillWidth = (skillsData.logical/100) * 50;
      pdf.roundedRect(20, yPosition, logicalFillWidth, 10, 2, 2, 'F');
      
      // Add labels
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.text('0', 20, yPosition + 15);
      pdf.text('100', 70, yPosition + 15);
      
      // Skill description
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.text(`• Your logical skills are ${formatSkillLevel(skillsData.logical).toLowerCase()}.`, 80, yPosition);
      yPosition += 8;
      pdf.text('• Logical thinking is very important for analytical profiles.', 80, yPosition);
      yPosition += 8;
      pdf.text('• Being able to understand and analyze data in different formats', 80, yPosition);
      yPosition += 8;
      pdf.text('  is considered an essential skill in many career options.', 80, yPosition);
      
      yPosition += 20;
      
      // Check if we need a new page
      if (yPosition > 240) {
        pdf.addPage();
        
        // Page header
        pdf.setFillColor(52, 152, 219);
        pdf.rect(0, 0, 210, 20, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.text('Skills and Abilities (continued)', 105, 13, { align: 'center' });
        
        // Reset text style
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
        
        yPosition = 30;
      }
      
      // Complete the career recommendation sections - add AI-generated content
      // These sections will include additional pages with the AI-generated content from the OpenAI API
      
      // Add Career Clusters Section
      pdf.addPage();
      
      // Page header
      pdf.setFillColor(52, 152, 219);
      pdf.rect(0, 0, 210, 20, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Career Clusters', 105, 13, { align: 'center' });
      
      // Reset text style
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      yPosition = 30;
      
      // Add clusters header
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Your Career Clusters', 20, yPosition);
      yPosition += 10;
      
      // Explanation text
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      const clustersIntro = "Career Clusters are groups of similar occupations and industries that require similar skills. It provides a career road map for pursuing further education and career opportunities. They help you connect your Education with your Career Planning. Career Cluster helps you narrow down your occupation choices based on your assessment responses. Results show which Career Clusters would be best to explore. A simple graph report shows how you have scored on each of the Career Clusters.";
      
      yPosition += addWrappedText(clustersIntro, 20, yPosition, 170, 5) + 15;
      
      // Create career clusters chart
      const careerClusters = formatCareerClusters(scores.aptitude, scores.personality, scores.interest);
      
      // Draw horizontal bar chart - show top 10 clusters
      const topClusters = careerClusters.slice(0, 10);
      
      topClusters.forEach((cluster, index) => {
        const y = yPosition + (index * 7);
        
        // Draw label, truncate if too long
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        const clusterName = cluster.name.length > 30 ? cluster.name.substring(0, 27) + '...' : cluster.name;
        pdf.text(clusterName, 20, y + 3);
        
        // Draw background bar
        pdf.setDrawColor(200, 200, 200);
        pdf.setFillColor(240, 240, 240);
        pdf.roundedRect(85, y, 85, 5, 1, 1, 'FD');
        
        // Draw filled portion
        pdf.setFillColor(52, 152, 219);
        const fillWidth = (cluster.value/100) * 85;
        pdf.roundedRect(85, y, fillWidth, 5, 1, 1, 'F');
        
        // Draw value
        pdf.text(cluster.value.toString(), 175, y + 3);
      });
      
      yPosition += (topClusters.length * 7) + 20;
      
      // Add Select Career Clusters section
      pdf.addPage();
      
      // Page header
      pdf.setFillColor(52, 152, 219);
      pdf.rect(0, 0, 210, 20, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Selected Career Clusters', 105, 13, { align: 'center' });
      
      // Reset text style
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      yPosition = 30;
      
      // Add selected clusters header
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Your Selected 4 Career Clusters', 20, yPosition);
      yPosition += 15;
      
      // Display top 4 career clusters with descriptions
      const selectedClusters = careerClusters.slice(0, 4);
      
      selectedClusters.forEach((cluster, index) => {
        // Draw cluster box
        pdf.setDrawColor(200, 200, 200);
        pdf.setFillColor(250, 250, 250);
        pdf.roundedRect(20, yPosition, 170, 30, 3, 3, 'FD');
        
        // Draw number circle
        pdf.setFillColor(52, 152, 219);
        pdf.circle(30, yPosition + 15, 7, 'F');
        
        // Draw number
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text((index + 1).toString(), 30, yPosition + 15, { align: 'center' });
        
        // Reset text color
        pdf.setTextColor(0, 0, 0);
        
        // Draw cluster name
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text(cluster.name, 45, yPosition + 10);
        
        // Draw cluster description
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        
        let clusterDescription = "";
        switch(cluster.name) {
          case 'Information Technology':
            clusterDescription = "• Information technology professionals work with Computer hardware, software or network systems.\n• You might design new computer equipment or work on a new computer game.\n• Some professionals provide support and manage software or hardware.\n• You might Write, update, and maintain computer programs or software packages";
            break;
          case 'Science, Maths and Engineering':
            clusterDescription = "• Science, math and engineering, professionals do scientific research in laboratories or the field.\n• You will plan or design products and systems.\n• You will do research and read blueprints.\n• You might support scientists, mathematicians, or engineers in their work.";
            break;
          case 'Manufacturing':
            clusterDescription = "• Manufacturing professionals work with products and equipment.\n• You might design a new product, decide how the product will be made, or make the product.\n• You might work on cars, computers, appliances, airplanes, or electronic devices.\n• Other manufacturing workers install or repair products.";
            break;
          case 'Accounts and Finance':
            clusterDescription = "• Finance and Accounts professionals keep track of money.\n• You might work in financial planning, banking, or insurance.\n• You could maintain financial records or give advice to business executives on how to operate their business.";
            break;
          case 'Logistics and Transportation':
            clusterDescription = "• Logistics professionals plan and coordinate transportation of people or products.\n• You might manage airplane, truck, or ship transportation.\n• You could work as a pilot, driver, or captain of these transportation vehicles.";
            break;
          case 'Bio Science and Research':
            clusterDescription = "• These professionals work on researching and advancing knowledge in biology and related fields.\n• You might study living organisms, conduct experiments, or develop new medical treatments.\n• You could work in laboratories, universities, or pharmaceutical companies.";
            break;
          case 'Agriculture':
            clusterDescription = "• Agriculture professionals work with plants, animals, and natural resources.\n• You might manage farms, develop food products, or research agricultural methods.\n• You could work on crop production, animal breeding, or agricultural economics.";
            break;
          case 'Health Science':
            clusterDescription = "• Health science professionals help prevent, diagnose, and treat injuries and diseases.\n• You might work directly with patients or behind the scenes in a health care facility.\n• You could work as a doctor, nurse, therapist, or medical technician.";
            break;
          default:
            clusterDescription = "• Professionals in this field work on specialized tasks related to " + cluster.name + ".\n• You would apply specific skills and knowledge unique to this field.\n• Career opportunities vary widely within this cluster.";
        }
        
        addWrappedText(clusterDescription, 45, yPosition + 15, 145, 5);
        
        yPosition += 35;
        
        // Check if we need a new page
        if (yPosition > 240 && index < selectedClusters.length - 1) {
          pdf.addPage();
          
          // Page header
          pdf.setFillColor(52, 152, 219);
          pdf.rect(0, 0, 210, 20, 'F');
          pdf.setTextColor(255, 255, 255);
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(14);
          pdf.text('Selected Career Clusters (continued)', 105, 13, { align: 'center' });
          
          // Reset text style
          pdf.setTextColor(0, 0, 0);
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(11);
          
          yPosition = 30;
        }
      });
      
      // Add Subject Recommendations section
      pdf.addPage();
      
      // Page header
      pdf.setFillColor(52, 152, 219);
      pdf.rect(0, 0, 210, 20, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Subjects Recommendations', 105, 13, { align: 'center' });
      
      // Reset text style
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      yPosition = 30;
      
      // Add subjects header
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Top Subjects Recommendations for you', 20, yPosition);
      yPosition += 15;
      
      // Format subject recommendations
      const subjectRecommendations = formatSubjectRecommendations(
        scores.aptitude,
        scores.personality,
        scores.interest
      );
      
      // Draw the top 2 subject streams
      const streamKeys = Object.keys(subjectRecommendations);
      
      const drawSubjectStream = (streamName: string, streamData: any, startY: number) => {
        // Draw stream box
        pdf.setDrawColor(200, 200, 200);
        pdf.setFillColor(250, 250, 250);
        pdf.roundedRect(20, startY, 170, 90, 3, 3, 'FD');
        
        // Draw stream name and score
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        
        let streamDisplayName = "";
        switch(streamName) {
          case 'scienceMath': streamDisplayName = "Science-Maths"; break;
          case 'commerce': streamDisplayName = "Commerce"; break;
          case 'scienceBio': streamDisplayName = "Science-Bio"; break;
          case 'humanities': streamDisplayName = "Humanities"; break;
          default: streamDisplayName = streamName;
        }
        
        pdf.text(streamDisplayName, 25, startY + 10);
        
        // Draw score gauge
        pdf.setDrawColor(200, 200, 200);
        pdf.setFillColor(240, 240, 240);
        pdf.roundedRect(120, startY + 5, 50, 10, 2, 2, 'FD');
        
        // Draw filled portion
        if (streamData.score < 33) {
          pdf.setFillColor(231, 76, 60); // Red for low
        } else if (streamData.score < 66) {
          pdf.setFillColor(243, 156, 18); // Yellow for medium
        } else {
          pdf.setFillColor(46, 204, 113); // Green for high
        }
        
        const fillWidth = (streamData.score/100) * 50;
        pdf.roundedRect(120, startY + 5, fillWidth, 10, 2, 2, 'F');
        
        // Add score percentage
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.text(`${streamData.score}%`, 145, startY + 10, { align: 'center' });
        
        // Draw mandatory subjects box
        pdf.setDrawColor(200, 200, 200);
        pdf.setFillColor(240, 240, 240);
        pdf.roundedRect(25, startY + 20, 160, 25, 2, 2, 'FD');
        
        // Add mandatory subjects title
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.text('Mandatory Subjects', 80, startY + 25);
        
        // Add mandatory subjects
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        const mandatoryText = streamData.mandatory.join(', ');
        pdf.text(mandatoryText, 105, startY + 35, { align: 'center' });
        
        // Draw optional subjects title
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.text('Optional Subjects', 80, startY + 50);
        
        // Draw optional subjects as horizontal bars
        const sortedOptional = [...streamData.optional].sort((a, b) => b.value - a.value);
        
        sortedOptional.forEach((subject, index) => {
          const y = startY + 55 + (index * 6);
          
          // Draw subject name
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(8);
          pdf.text(subject.name, 30, y + 3);
          
          // Draw background bar
          pdf.setDrawColor(200, 200, 200);
          pdf.setFillColor(240, 240, 240);
          pdf.roundedRect(90, y, 80, 4, 1, 1, 'FD');
          
          // Draw filled portion
          pdf.setFillColor(52, 152, 219);
          const fillWidth = (subject.value/50) * 80; // Scale to maximum 50
          pdf.roundedRect(90, y, fillWidth, 4, 1, 1, 'F');
          
          // Draw value
          pdf.text(subject.value.toString(), 175, y + 3);
        });
        
        return startY + 95; // Return the new Y position
      };
      
      // Draw first 2 streams
      yPosition = drawSubjectStream('scienceMath', subjectRecommendations.scienceMath, yPosition);
      
      // Add new page for next 2 streams
      pdf.addPage();
      
      // Page header
      pdf.setFillColor(52, 152, 219);
      pdf.rect(0, 0, 210, 20, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Subjects Recommendations (continued)', 105, 13, { align: 'center' });
      
      // Reset text style
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      yPosition = 30;
      
      // Add subjects header
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Top Subjects Recommendations for you', 20, yPosition);
      yPosition += 15;
      
      // Draw next 2 streams
      yPosition = drawSubjectStream('commerce', subjectRecommendations.commerce, yPosition);
      
      // Add Career Recommendation Section from AI
      pdf.addPage();
      
      // Page header
      pdf.setFillColor(52, 152, 219);
      pdf.rect(0, 0, 210, 20, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Career Recommendation', 105, 13, { align: 'center' });
      
      // Reset text style
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      yPosition = 30;
      
      // Add AI-generated career recommendation content
      const careerContent = contentMap.careerRecommendation?.content || 
        "Based on your assessment results, we have identified several career paths that align well with your aptitudes, interests, and personality traits. Your strongest matches are in fields that combine analytical thinking with structured environments, particularly in areas requiring attention to detail and problem-solving skills.";
      
      yPosition += addWrappedText(careerContent, 20, yPosition, 170, 5);
      
      // Add page footer
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 270, 210, 27, 'F');
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, 270, 190, 270);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Career Assessment Report - ${fullName} - Page ${pdf.getNumberOfPages()}`, 105, 278, { align: 'center' });
      
      // Add Education Pathways Section from AI
      pdf.addPage();
      
      // Page header
      pdf.setFillColor(52, 152, 219);
      pdf.rect(0, 0, 210, 20, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Education Pathways', 105, 13, { align: 'center' });
      
      // Reset text style
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      yPosition = 30;
      
      // Add AI-generated education pathways content
      const educationContent = contentMap.educationPathways?.content || 
        "This section outlines the educational routes and qualifications needed to pursue your recommended career paths. It includes information about degrees, certifications, and training programs that will help you build the necessary skills for success.";
      
      yPosition += addWrappedText(educationContent, 20, yPosition, 170, 5);
      
      // Add page footer
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 270, 210, 27, 'F');
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, 270, 190, 270);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Career Assessment Report - ${fullName} - Page ${pdf.getNumberOfPages()}`, 105, 278, { align: 'center' });
      
      // Add Alternative Careers Section from AI
      pdf.addPage();
      
      // Page header
      pdf.setFillColor(52, 152, 219);
      pdf.rect(0, 0, 210, 20, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Alternative Career Paths', 105, 13, { align: 'center' });
      
      // Reset text style
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      yPosition = 30;
      
      // Add AI-generated alternative careers content
      const alternativesContent = contentMap.alternativeCareers?.content || 
        "While your primary career recommendations represent your strongest matches, these alternative career paths also align well with aspects of your profile. They provide additional options that leverage your strengths and interests in different ways.";
      
      yPosition += addWrappedText(alternativesContent, 20, yPosition, 170, 5);
      
      // Add page footer
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 270, 210, 27, 'F');
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, 270, 190, 270);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Career Assessment Report - ${fullName} - Page ${pdf.getNumberOfPages()}`, 105, 278, { align: 'center' });
      
      // Add Development Plan Section from AI
      pdf.addPage();
      
      // Page header
      pdf.setFillColor(52, 152, 219);
      pdf.rect(0, 0, 210, 20, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Gap Analysis & Development Plan', 105, 13, { align: 'center' });
      
      // Reset text style
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      yPosition = 30;
      
      // Add AI-generated development plan content
      const developmentContent = contentMap.developmentPlan?.content || 
        "This section outlines a strategic plan to bridge the gap between your current skills and those required for your recommended career paths. It includes actionable steps over short, medium, and long-term timeframes to help you develop professionally.";
      
      yPosition += addWrappedText(developmentContent, 20, yPosition, 170, 5);
      
      // Add page footer
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 270, 210, 27, 'F');
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, 270, 190, 270);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Career Assessment Report - ${fullName} - Page ${pdf.getNumberOfPages()}`, 105, 278, { align: 'center' });
      
      // Add Summary Sheet
      pdf.addPage();
      
      // Page header
      pdf.setFillColor(52, 152, 219);
      pdf.rect(0, 0, 210, 20, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Summary Sheet', 105, 13, { align: 'center' });
      
      // Reset text style
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      yPosition = 40;
      
      // Summary introduction
      pdf.setFont('helvetica', 'italic');
      pdf.text('Our career assessment is based on the concept of correlation theory and various psychometric and statistical models.', 20, yPosition);
      yPosition += 15;
      
      // Create summary table
      const summaryItems = [
        { label: 'Career Personality', value: personalityType },
        { label: 'Career Interest', value: `${interestTypes[0].name} + ${interestTypes[1].name} + ${interestTypes[2].name}` },
        { label: 'Career Motivator', value: `${motivatorTypes[0].name} + ${motivatorTypes[1].name} + ${motivatorTypes[2].name}` },
        { label: 'Learning Style', value: formatLearningStyle(learningStyles) },
        { label: 'Skills & Abilities', value: `Numerical Ability[${skillsData.numerical}%] + Logical Ability[${skillsData.logical}%] + Verbal Ability[${skillsData.verbal}%] + Clerical and Organizing Skills[${skillsData.clerical}%] + Spatial & Visualization Ability[${skillsData.spatial}%] + Leadership & Decision making skills[${skillsData.leadership}%] + Social & Co-operation Skills[${skillsData.social}%] + Mechanical Abilities[${skillsData.mechanical}%]` },
        { label: 'Selected Clusters', value: `${selectedClusters[0].name} + ${selectedClusters[1].name} + ${selectedClusters[2].name} + ${selectedClusters[3].name}` }
      ];
      
      // Draw summary table
      summaryItems.forEach((item, index) => {
        // Draw row background
        pdf.setFillColor(index % 2 === 0 ? 240 : 245, index % 2 === 0 ? 240 : 245, index % 2 === 0 ? 240 : 245);
        pdf.rect(20, yPosition, 170, 15, 'F');
        
        // Draw label
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.text(item.label, 25, yPosition + 10);
        
        // Draw value
        pdf.setFont('helvetica', 'normal');
        
        // Handle multi-line values
        if (item.value.length > 60) {
          const lines = pdf.splitTextToSize(item.value, 100);
          lines.forEach((line: string, lineIndex: number) => {
            pdf.text(line, 90, yPosition + 5 + (lineIndex * 4));
          });
        } else {
          pdf.text(item.value, 90, yPosition + 10);
        }
        
        yPosition += 15;
      });
      
      // Add final page footer with contact info
      pdf.setFillColor(52, 152, 219);
      pdf.rect(0, 270, 210, 27, 'F');
      
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.text('Powered by Career Counselor AI', 105, 280, { align: 'center' });
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text('Report Date: ' + creationDate, 105, 290, { align: 'center' });
      
      // Save the PDF
      const pdfName = `Career_Assessment_Report_${firstName}_${lastName}.pdf`;
      pdf.save(pdfName);
      
      // Update localStorage to track generated report
      try {
        localStorage.setItem(`report_${reportId}_generated`, 'true');
      } catch (err) {
        console.error('Could not update localStorage:', err);
      }
      
      // Store the generated content for future use
      setGeneratedContent(contentMap);
      
      // Show success message
      toast.success('Your comprehensive career report has been generated and downloaded!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('There was an error generating your report. Please try again.');
    } finally {
      setIsGenerating(false);
      toast.dismiss();
    }
  };
  
  return (
    <div className="w-full flex flex-col items-center space-y-4 my-8">
      <h3 className="text-xl font-medium text-center">Generate Your Comprehensive Career Assessment Report</h3>
      <p className="text-center text-muted-foreground">
        Download a detailed PDF report based on your assessment results.
      </p>
      <div className="flex justify-center w-full mt-4">
        <Button 
          size="lg"
          className="px-8"
          onClick={generatePDF}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating Report...' : 'Generate PDF Report'}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground text-center mt-2">
        The report contains detailed analysis of your career aptitude, personality, interests, and recommended career paths.
      </p>
    </div>
  );
};

export default ReportPDFGenerator;
