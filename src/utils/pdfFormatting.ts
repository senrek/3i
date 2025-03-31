
import { jsPDF } from 'jspdf';

// Helper function to safely render text (avoid null/undefined issues)
const safeText = (text: any): string => {
  if (text === null || text === undefined) return '';
  return String(text);
};

/**
 * Add a header with logo to the PDF
 */
export const addHeaderWithLogo = (pdf: jsPDF) => {
  // Add gradient header
  const width = pdf.internal.pageSize.getWidth();
  
  // Create gradient background for header
  pdf.setFillColor(100, 149, 237); // Cornflower blue
  pdf.rect(0, 0, width, 20, 'F');
  
  // Add title text to header
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.setTextColor(255, 255, 255);
  pdf.text('Career Assessment Report', 20, 13);
  
  // Add date to the right
  const today = new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
  pdf.setFontSize(10);
  pdf.text(today, width - 20, 13, { align: 'right' });
};

/**
 * Add a report title to the PDF
 */
export const addReportTitle = (pdf: jsPDF, title: string, withGradient = true) => {
  const width = pdf.internal.pageSize.getWidth();
  
  if (withGradient) {
    // Create gradient background for title
    const gradHeight = 15;
    pdf.setFillColor(100, 149, 237); // Cornflower blue
    pdf.rect(0, 25, width, gradHeight, 'F');
    
    // Add title text
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(255, 255, 255);
    const titleText = safeText(title);
    pdf.text(titleText, width / 2, 25 + gradHeight / 2, { align: 'center' });
  } else {
    // Add title text without gradient
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.setTextColor(100, 149, 237); // Cornflower blue
    const titleText = safeText(title);
    pdf.text(titleText, width / 2, 30, { align: 'center' });
  }
};

/**
 * Add user information to the PDF
 */
export const addUserInfo = (pdf: jsPDF, userInfo: { label: string, value: string }[]) => {
  const width = pdf.internal.pageSize.getWidth();
  const centerX = width / 2;
  
  // Create user info box
  pdf.setDrawColor(230, 230, 230);
  pdf.setFillColor(250, 250, 250);
  pdf.roundedRect(centerX - 70, 45, 140, 140, 3, 3, 'FD');
  
  // Add user info
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(70, 70, 70);
  
  let yPos = 65;
  
  userInfo.forEach(item => {
    const labelText = safeText(item.label);
    const valueText = safeText(item.value);
    
    pdf.text(`${labelText}:`, centerX - 60, yPos);
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(valueText, centerX - 60, yPos + 10);
    pdf.setFont('helvetica', 'bold');
    
    yPos += 25;
  });
};

/**
 * Add disclaimer text
 */
export const addDisclaimer = (pdf: jsPDF) => {
  const width = pdf.internal.pageSize.getWidth();
  
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  
  const disclaimer = "This report is intended only for the use of the individual or entity to which it is addressed and may contain information that is non-public, proprietary, privileged, confidential, and exempt from disclosure under applicable law or may constitute as attorney work product. No part of this report may be reproduced in any form or manner without prior written permission from company.";
  
  const textLines = pdf.splitTextToSize(disclaimer, width - 40);
  pdf.text(textLines, 20, 190);
  
  pdf.setFont('helvetica', 'normal');
  pdf.text("3i Global", 20, 200);
  pdf.text("7048976060", 70, 200);
  pdf.text("3iglobal25@gmail.com", 120, 200);
};

/**
 * Add a section title to the PDF
 */
export const addSectionTitle = (pdf: jsPDF, title: string, x: number, y: number) => {
  // Add section title with a line underneath
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.setTextColor(100, 149, 237); // Cornflower blue
  const titleText = safeText(title);
  pdf.text(titleText, x, y);
  
  // Add underline
  pdf.setDrawColor(100, 149, 237);
  pdf.setLineWidth(0.5);
  pdf.line(x, y + 2, x + pdf.getTextWidth(titleText), y + 2);
};

/**
 * Add profiling section
 */
export const addProfilingSection = (pdf: jsPDF, profilingData: {
  currentStage: string;
  description: string;
  riskInvolved: string;
  actionPlan: string;
}) => {
  const startY = 210;
  
  // Add section title
  addSectionTitle(pdf, "Profiling", 20, startY);
  
  // Add subtitle
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Your Profiling", 20, startY + 20);
  
  // Add description
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  
  const description = "Personal profiling is the first step in career planning. The purpose of profiling is to understand your current career planning stage. It will help decide your career objective and roadmap. The ultimate aim of the planning is to take you from the current stage of career planning to the optimized stage of career planning. Personal profiling includes information about your current stage, the risk involved and action plan for your career development.";
  
  const descriptionLines = pdf.splitTextToSize(description, 170);
  pdf.text(descriptionLines, 20, startY + 30);
  
  // Add current stage
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text("Current Stage of Planning", 20, startY + 55);
  
  // Create stage box
  const stages = ["Ignorant", "Confused", "Diffused", "Methodical", "Optimized"];
  const boxWidth = 170;
  const boxHeight = 20;
  const singleWidth = boxWidth / stages.length;
  
  pdf.setDrawColor(200, 200, 200);
  pdf.setFillColor(240, 240, 240);
  pdf.rect(20, startY + 60, boxWidth, boxHeight, 'FD');
  
  // Draw stage separators
  for (let i = 1; i < stages.length; i++) {
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20 + (i * singleWidth), startY + 60, 20 + (i * singleWidth), startY + 60 + boxHeight);
  }
  
  // Add stage names
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(0, 0, 0);
  
  stages.forEach((stage, i) => {
    const stageX = 20 + (i * singleWidth) + (singleWidth / 2);
    pdf.text(stage, stageX, startY + 74, { align: 'center' });
  });
  
  // Highlight current stage
  const currentStageIndex = stages.indexOf(profilingData.currentStage);
  if (currentStageIndex >= 0) {
    pdf.setFillColor(100, 149, 237, 0.3); // Light blue with transparency
    pdf.rect(20 + (currentStageIndex * singleWidth), startY + 60, singleWidth, boxHeight, 'F');
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 100);
    pdf.text(stages[currentStageIndex], 20 + (currentStageIndex * singleWidth) + (singleWidth / 2), startY + 74, { align: 'center' });
  }
  
  // Add stage description
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(100, 149, 237);
  pdf.text(profilingData.currentStage + ":", 20, startY + 90);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  const stageDescLines = pdf.splitTextToSize(profilingData.description, 170);
  pdf.text(stageDescLines, 20, startY + 100);
  
  // Add risk involved
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(100, 149, 237);
  pdf.text("Risk Involved:", 20, startY + 120);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  const riskLines = pdf.splitTextToSize(profilingData.riskInvolved, 170);
  pdf.text(riskLines, 20, startY + 130);
  
  // Add action plan
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(100, 149, 237);
  pdf.text("Action Plan:", 20, startY + 145);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  const actionLines = pdf.splitTextToSize(profilingData.actionPlan, 170);
  pdf.text(actionLines, 20, startY + 155);
  
  // Add footer
  addPageFooter(pdf, 1);
};

/**
 * Add page footer
 */
export const addPageFooter = (pdf: jsPDF, pageNumber: number, userName: string = '') => {
  const width = pdf.internal.pageSize.getWidth();
  
  pdf.setFontSize(9);
  pdf.setTextColor(100, 100, 100);
  pdf.text("3i Global", 20, 285);
  
  if (userName) {
    pdf.text(userName, width / 2, 285, { align: 'center' });
  }
  
  pdf.text(`Page ${pageNumber}`, width - 20, 285, { align: 'right' });
};

/**
 * Add a personality type chart to the PDF
 */
export const addPersonalityTypeChart = (pdf: jsPDF, personalityData: {
  introvertExtrovert: { introvert: number, extrovert: number },
  sensingIntuitive: { sensing: number, intuitive: number },
  thinkingFeeling: { thinking: number, feeling: number },
  judgingPerceiving: { judging: number, perceiving: number }
}, personalityType: string = "") => {
  // Starting position
  const startX = 20;
  const startY = 70;
  const barWidth = 170;
  const barHeight = 12;
  const spacing = 25;
  
  // Add section title
  addSectionTitle(pdf, "Career Personality", 20, 30);
  
  // Add subtitle
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Result of the Career Personality", 20, 50);
  
  // Add description
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  
  const personalityDescription = "Personality Assessment will help you understand yourself as a person. It will help you expand your career options in alignment with your personality. Self-understanding and awareness can lead you to more appropriate and rewarding career choices. The Personality Type Model identifies four dimensions of personality. Each dimension will give you a clear description of your personality. The combination of your most dominant preferences is used to create your individual personality type. Four dimensions of your personality are mentioned in this chart. The graph below provides information about the personality type you belong to, based on the scoring of your responses. Each of the four preferences are based on your answers and are indicated by a bar chart.";
  
  const descriptionLines = pdf.splitTextToSize(personalityDescription, 170);
  pdf.text(descriptionLines, 20, 50);
  
  // Add Personality Type
  if (personalityType) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text(`Personality Type: ${personalityType}`, 20, 65);
  }
  
  // Introvert-Extrovert
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Introvert-[${personalityData.introvertExtrovert.introvert}%]`, startX, startY);
  pdf.text(`Extrovert-[${personalityData.introvertExtrovert.extrovert}%]`, startX + barWidth, startY, { align: 'right' });
  
  // Bar background
  pdf.setDrawColor(230, 230, 230);
  pdf.setFillColor(240, 240, 240);
  pdf.rect(startX, startY + 3, barWidth, barHeight, 'FD');
  
  // Introvert portion (left)
  const introvertWidth = (personalityData.introvertExtrovert.introvert / 100) * barWidth;
  pdf.setFillColor(100, 149, 237); // Blue
  pdf.rect(startX, startY + 3, introvertWidth, barHeight, 'F');
  
  // Sensing-Intuitive
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Sensing-[${personalityData.sensingIntuitive.sensing}%]`, startX, startY + spacing);
  pdf.text(`(Observant)`, startX, startY + spacing + 10);
  pdf.text(`iNtuitive-[${personalityData.sensingIntuitive.intuitive}%]`, startX + barWidth, startY + spacing, { align: 'right' });
  pdf.text(`(Futuristic)`, startX + barWidth, startY + spacing + 10, { align: 'right' });
  
  // Bar background
  pdf.setDrawColor(230, 230, 230);
  pdf.setFillColor(240, 240, 240);
  pdf.rect(startX, startY + spacing + 13, barWidth, barHeight, 'FD');
  
  // Sensing portion (left)
  const sensingWidth = (personalityData.sensingIntuitive.sensing / 100) * barWidth;
  pdf.setFillColor(76, 175, 80); // Green
  pdf.rect(startX, startY + spacing + 13, sensingWidth, barHeight, 'F');
  
  // Thinking-Feeling
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Thinking-[${personalityData.thinkingFeeling.thinking}%]`, startX, startY + (spacing * 2) + 10);
  pdf.text(`Feeling-[${personalityData.thinkingFeeling.feeling}%]`, startX + barWidth, startY + (spacing * 2) + 10, { align: 'right' });
  
  // Bar background
  pdf.setDrawColor(230, 230, 230);
  pdf.setFillColor(240, 240, 240);
  pdf.rect(startX, startY + (spacing * 2) + 13, barWidth, barHeight, 'FD');
  
  // Thinking portion (left)
  const thinkingWidth = (personalityData.thinkingFeeling.thinking / 100) * barWidth;
  pdf.setFillColor(255, 152, 0); // Orange
  pdf.rect(startX, startY + (spacing * 2) + 13, thinkingWidth, barHeight, 'F');
  
  // Judging-Perceiving
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Judging-[${personalityData.judgingPerceiving.judging}%]`, startX, startY + (spacing * 3) + 10);
  pdf.text(`(Organized)`, startX, startY + (spacing * 3) + 20);
  pdf.text(`Perceiving-[${personalityData.judgingPerceiving.perceiving}%]`, startX + barWidth, startY + (spacing * 3) + 10, { align: 'right' });
  pdf.text(`(Spontaneous)`, startX + barWidth, startY + (spacing * 3) + 20, { align: 'right' });
  
  // Bar background
  pdf.setDrawColor(230, 230, 230);
  pdf.setFillColor(240, 240, 240);
  pdf.rect(startX, startY + (spacing * 3) + 23, barWidth, barHeight, 'FD');
  
  // Judging portion (left)
  const judgingWidth = (personalityData.judgingPerceiving.judging / 100) * barWidth;
  pdf.setFillColor(156, 39, 176); // Purple
  pdf.rect(startX, startY + (spacing * 3) + 23, judgingWidth, barHeight, 'F');
  
  // Add footer
  addPageFooter(pdf, 3);
};

/**
 * Add a personality analysis section to the PDF
 */
export const addPersonalityAnalysis = (pdf: jsPDF, analysisData: {
  focusEnergy: string[];
  processInfo: string[];
  makeDecisions: string[];
  planWork: string[];
  strengths: string[];
}) => {
  // Add section title
  addSectionTitle(pdf, "Analysis of Career Personality", 20, 30);
  
  // Add subtitle
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Your Career Personality Analysis", 20, 50);
  
  // Section 1: Where do you prefer to focus your energy and attention?
  const startY1 = 70;
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Where do you prefer to focus your energy and attention?", 20, startY1);
  
  // Create a colored box for section 1
  pdf.setDrawColor(100, 149, 237); // Blue
  pdf.setFillColor(240, 248, 255); // Light blue
  pdf.roundedRect(20, startY1 + 5, 80, 80, 3, 3, 'FD');
  
  // Add bullet points for section 1
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  
  let bulletY = startY1 + 15;
  analysisData.focusEnergy.forEach(point => {
    pdf.text(`• ${point}`, 25, bulletY);
    bulletY += 10;
  });
  
  // Section 2: How do you grasp and process the information?
  const startY2 = 70;
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(0, 0, 0);
  pdf.text("How do you grasp and process the information?", 110, startY2);
  
  // Create a colored box for section 2
  pdf.setDrawColor(76, 175, 80); // Green
  pdf.setFillColor(240, 255, 240); // Light green
  pdf.roundedRect(110, startY2 + 5, 80, 80, 3, 3, 'FD');
  
  // Add bullet points for section 2
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  
  bulletY = startY2 + 15;
  analysisData.processInfo.forEach(point => {
    pdf.text(`• ${point}`, 115, bulletY);
    bulletY += 10;
  });
  
  // Section 3: How do you make decisions?
  const startY3 = 160;
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(0, 0, 0);
  pdf.text("How do you make decisions?", 20, startY3);
  
  // Create a colored box for section 3
  pdf.setDrawColor(255, 152, 0); // Orange
  pdf.setFillColor(255, 248, 240); // Light orange
  pdf.roundedRect(20, startY3 + 5, 80, 80, 3, 3, 'FD');
  
  // Add bullet points for section 3
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  
  bulletY = startY3 + 15;
  analysisData.makeDecisions.forEach(point => {
    pdf.text(`• ${point}`, 25, bulletY);
    bulletY += 10;
  });
  
  // Section 4: How do you prefer to plan your work?
  const startY4 = 160;
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(0, 0, 0);
  pdf.text("How do you prefer to plan your work?", 110, startY4);
  
  // Create a colored box for section 4
  pdf.setDrawColor(156, 39, 176); // Purple
  pdf.setFillColor(248, 240, 255); // Light purple
  pdf.roundedRect(110, startY4 + 5, 80, 80, 3, 3, 'FD');
  
  // Add bullet points for section 4
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  
  bulletY = startY4 + 15;
  analysisData.planWork.forEach(point => {
    pdf.text(`• ${point}`, 115, bulletY);
    bulletY += 10;
  });
  
  // Section 5: Your strengths
  const startY5 = 250;
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Your strengths", 20, startY5);
  
  // Create a colored box for section 5
  pdf.setDrawColor(76, 175, 80); // Green
  pdf.setFillColor(240, 255, 240); // Light green
  pdf.roundedRect(20, startY5 + 5, 170, 15, 3, 3, 'FD');
  
  // Add bullet points for section 5
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  
  // Combine strengths with bullet points
  const strengthsText = analysisData.strengths.map(s => `• ${s}`).join('   ');
  pdf.text(strengthsText, 25, startY5 + 15);
  
  // Add footer
  addPageFooter(pdf, 4);
};

/**
 * Add an interest bar chart to the PDF
 */
export const addInterestBarChart = (pdf: jsPDF, interests: { name: string, value: number }[]) => {
  // Add section title
  addSectionTitle(pdf, "Career Report", 20, 30);
  
  // Add subtitle
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Result of the Career Interest", 20, 50);
  
  // Add description
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Your Career Interest Types", 20, 65);
  
  // Add explanation
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  
  const interestDescription = "The Career Interest Assessment will help you understand which careers might be the best fit for you. It is meant to help you find careers that you might enjoy. Understanding your Top career interest will help you identify a career focus and begin your career planning and career exploration process. The Career Interest Assessment (CIA) measures six broad interest patterns that can be used to describe your career interest. Most people's interests are reflected by two or three themes, combined to form a cluster of interests. This career interest is directly linked to your occupational interest.";
  
  const descriptionLines = pdf.splitTextToSize(interestDescription, 170);
  pdf.text(descriptionLines, 20, 80);
  
  // Create horizontal bar chart for interests
  const startX = 20;
  const startY = 110;
  const maxBarWidth = 120;
  const barHeight = 12;
  const spacing = 16;
  
  // Sort interests by value (highest first)
  const sortedInterests = [...interests].sort((a, b) => b.value - a.value);
  
  // Draw bars
  sortedInterests.forEach((interest, index) => {
    const y = startY + (index * spacing);
    
    // Interest name
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(70, 70, 70);
    pdf.text(interest.name, startX, y);
    
    // Bar background
    pdf.setDrawColor(230, 230, 230);
    pdf.setFillColor(240, 240, 240);
    pdf.rect(startX + 80, y - 8, maxBarWidth, barHeight, 'FD');
    
    // Bar filled portion
    const fillWidth = (interest.value / 100) * maxBarWidth;
    
    // Determine color based on position
    const colors = [
      [100, 149, 237], // Blue
      [76, 175, 80],   // Green
      [255, 152, 0],   // Orange
      [156, 39, 176],  // Purple
      [244, 67, 54],   // Red
      [33, 150, 243]   // Blue
    ];
    
    const colorIndex = index % colors.length;
    pdf.setFillColor(colors[colorIndex][0], colors[colorIndex][1], colors[colorIndex][2]);
    pdf.rect(startX + 80, y - 8, fillWidth, barHeight, 'F');
    
    // Interest value
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text(String(interest.value), startX + 80 + maxBarWidth + 5, y - 2);
  });
  
  // Add footer
  addPageFooter(pdf, 6);
};

/**
 * Add interest analysis to the PDF
 */
export const addInterestAnalysis = (pdf: jsPDF, analyses: { 
  title: string, 
  level: string,
  points: string[] 
}[]) => {
  // Add section title
  addSectionTitle(pdf, "Analysis of Career Interest", 20, 30);
  
  // Add subtitle
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Your Career Interest Analysis", 20, 50);
  
  let startY = 70;
  const spacing = 10;
  
  // Loop through each analysis
  analyses.forEach((analysis, index) => {
    // Add title and level
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${analysis.title}-${analysis.level}`, 20, startY);
    
    // Add bullet points
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    
    let bulletY = startY + 10;
    analysis.points.forEach(point => {
      pdf.text(`• ${point}`, 25, bulletY);
      bulletY += spacing;
    });
    
    // Update startY for next section
    startY = bulletY + 5;
    
    // Check if we need to add a new page
    if (startY > 270 && index < analyses.length - 1) {
      // Add footer to current page
      addPageFooter(pdf, 7 + Math.floor(index / 3));
      
      // Add new page
      pdf.addPage();
      
      // Reset startY
      startY = 30;
      
      // Add section title to new page
      addSectionTitle(pdf, "Analysis of Career Interest (Continued)", 20, startY);
      
      // Update startY for next section
      startY = 50;
    }
  });
  
  // Add footer
  addPageFooter(pdf, 7 + Math.floor(analyses.length / 3));
};

/**
 * Add career motivators chart to the PDF
 */
export const addCareerMotivatorChart = (pdf: jsPDF, motivators: { name: string, value: number }[]) => {
  // Add section title
  addSectionTitle(pdf, "Career Report", 20, 30);
  
  // Add subtitle
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Result of the Career Motivator", 20, 50);
  
  // Add description
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Your Career Motivator Types", 20, 65);
  
  // Add explanation
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  
  const motivatorDescription = "Values are the things that are most important to us in our lives and careers. Our values are formed in a variety of ways through our life experiences, our feelings and our families. In the context of Career Planning, values generally refer to the things we value in a career. Being aware of what we value in our lives is important because a career choice that is in-line with our core beliefs and values is more likely to be a lasting and positive choice";
  
  const descriptionLines = pdf.splitTextToSize(motivatorDescription, 170);
  pdf.text(descriptionLines, 20, 80);
  
  // Create horizontal bar chart for motivators
  const startX = 20;
  const startY = 110;
  const maxBarWidth = 120;
  const barHeight = 12;
  const spacing = 16;
  
  // Sort motivators by value (highest first)
  const sortedMotivators = [...motivators].sort((a, b) => b.value - a.value);
  
  // Draw bars
  sortedMotivators.forEach((motivator, index) => {
    const y = startY + (index * spacing);
    
    // Motivator name
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(70, 70, 70);
    pdf.text(motivator.name, startX, y);
    
    // Bar background
    pdf.setDrawColor(230, 230, 230);
    pdf.setFillColor(240, 240, 240);
    pdf.rect(startX + 80, y - 8, maxBarWidth, barHeight, 'FD');
    
    // Bar filled portion
    const fillWidth = (motivator.value / 100) * maxBarWidth;
    
    // Determine color based on position
    const colors = [
      [100, 149, 237], // Blue
      [76, 175, 80],   // Green
      [255, 152, 0],   // Orange
      [156, 39, 176],  // Purple
      [244, 67, 54],   // Red
      [33, 150, 243],  // Blue
      [0, 150, 136]    // Teal
    ];
    
    const colorIndex = index % colors.length;
    pdf.setFillColor(colors[colorIndex][0], colors[colorIndex][1], colors[colorIndex][2]);
    pdf.rect(startX + 80, y - 8, fillWidth, barHeight, 'F');
    
    // Motivator value
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text(String(motivator.value), startX + 80 + maxBarWidth + 5, y - 2);
  });
  
  // Add footer
  addPageFooter(pdf, 9);
};

/**
 * Add motivator analysis to the PDF
 */
export const addMotivatorAnalysis = (pdf: jsPDF, analyses: { 
  title: string, 
  level: string,
  points: string[] 
}[]) => {
  // Add section title
  addSectionTitle(pdf, "Analysis of Career Motivator", 20, 30);
  
  // Add subtitle
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Your Career Motivator Analysis", 20, 50);
  
  let startY = 70;
  const spacing = 10;
  
  // Loop through each analysis
  analyses.forEach((analysis, index) => {
    // Add title and level
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${analysis.title}-${analysis.level}`, 20, startY);
    
    // Add bullet points
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    
    let bulletY = startY + 10;
    analysis.points.forEach(point => {
      pdf.text(`• ${point}`, 25, bulletY);
      bulletY += spacing;
    });
    
    // Update startY for next section
    startY = bulletY + 5;
    
    // Check if we need to add a new page
    if (startY > 270 && index < analyses.length - 1) {
      // Add footer to current page
      addPageFooter(pdf, 10);
      
      // Add new page
      pdf.addPage();
      
      // Reset startY
      startY = 30;
      
      // Add section title to new page
      addSectionTitle(pdf, "Analysis of Career Motivator (Continued)", 20, startY);
      
      // Update startY for next section
      startY = 50;
    }
  });
  
  // Add footer
  addPageFooter(pdf, 10);
};

/**
 * Add a learning style pie chart to the PDF
 */
export const addLearningStylePieChart = (pdf: jsPDF, learningStyles: { name: string, value: number }[]) => {
  // Add section title
  addSectionTitle(pdf, "Career Report", 20, 30);
  
  // Add subtitle
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Result of the Learning Style", 20, 50);
  
  // Add description
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Your Learning Style Types", 20, 65);
  
  // Create horizontal bar chart for learning styles
  const startX = 20;
  const startY = 90;
  const maxBarWidth = 120;
  const barHeight = 12;
  const spacing = 20;
  
  // Sort learning styles by value (highest first)
  const sortedStyles = [...learningStyles].sort((a, b) => b.value - a.value);
  
  // Draw bars
  sortedStyles.forEach((style, index) => {
    const y = startY + (index * spacing);
    
    // Learning style name
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(70, 70, 70);
    pdf.text(style.name, startX, y);
    
    // Bar background
    pdf.setDrawColor(230, 230, 230);
    pdf.setFillColor(240, 240, 240);
    pdf.rect(startX + 80, y - 8, maxBarWidth, barHeight, 'FD');
    
    // Bar filled portion
    const fillWidth = (style.value / 100) * maxBarWidth;
    
    // Determine color based on position
    const colors = [
      [100, 149, 237], // Blue
      [76, 175, 80],   // Green
      [255, 152, 0],   // Orange
      [156, 39, 176]   // Purple
    ];
    
    const colorIndex = index % colors.length;
    pdf.setFillColor(colors[colorIndex][0], colors[colorIndex][1], colors[colorIndex][2]);
    pdf.rect(startX + 80, y - 8, fillWidth, barHeight, 'F');
    
    // Learning style value
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text(String(style.value), startX + 80 + maxBarWidth + 5, y - 2);
  });
  
  // Add footer
  addPageFooter(pdf, 11);
};

/**
 * Add learning style analysis to the PDF
 */
export const addLearningStyleAnalysis = (pdf: jsPDF, style: {
  title: string;
  description: string;
  strategies: string[];
}) => {
  // Add section title
  addSectionTitle(pdf, "Analysis of Learning Style", 20, 30);
  
  // Add subtitle
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Your Learning Style Analysis", 20, 50);
  
  // Add learning style title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(0, 0, 0);
  pdf.text(style.title, 20, 70);
  
  // Add learning style description
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  
  const descriptionLines = pdf.splitTextToSize(style.description, 170);
  pdf.text(descriptionLines, 20, 80);
  
  // Add learning improvement strategies title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Learning improvement strategies", 20, 110);
  
  // Add bullet points for strategies
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  
  let bulletY = 120;
  const spacing = 10;
  
  style.strategies.forEach(strategy => {
    pdf.text(`• ${strategy}`, 25, bulletY);
    bulletY += spacing;
    
    // Check if we need to add a new page
    if (bulletY > 270 && style.strategies.indexOf(strategy) < style.strategies.length - 1) {
      // Add footer to current page
      addPageFooter(pdf, 12);
      
      // Add new page
      pdf.addPage();
      
      // Reset bulletY
      bulletY = 30;
      
      // Add section title to new page
      addSectionTitle(pdf, "Learning Improvement Strategies (Continued)", 20, bulletY);
      
      // Update bulletY for next bullet point
      bulletY = 50;
    }
  });
  
  // Add footer
  addPageFooter(pdf, 12);
};

/**
 * Add a skill bar chart to the PDF
 */
export const addSkillBarChart = (pdf: jsPDF, skills: { 
  name: string, 
  value: number,
  level: string,
  description: string 
}[], overallScore: number) => {
  // Add section title
  addSectionTitle(pdf, "Skills and Abilities", 20, 30);
  
  // Add subtitle
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Your Skills and Abilities", 20, 50);
  
  // Add description
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  
  const description = "The skills & abilities scores will help us to explore and identify different ways to reshape your career direction. This simple graph shows how you have scored on each of these skills and abilities. The graph on the top will show the average score of your overall skills and abilities.";
  
  const descriptionLines = pdf.splitTextToSize(description, 170);
  pdf.text(descriptionLines, 20, 70);
  
  // Add overall skills bar
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Overall Skills and Abilities", 20, 90);
  
  // Overall skills bar
  const barWidth = 100;
  const barHeight = 15;
  
  pdf.setDrawColor(230, 230, 230);
  pdf.setFillColor(240, 240, 240);
  pdf.rect(20, 95, barWidth, barHeight, 'FD');
  
  // Bar filled portion based on overall score
  const fillWidth = (overallScore / 100) * barWidth;
  
  // Determine color based on score
  if (overallScore >= 80) {
    pdf.setFillColor(76, 175, 80); // Green
  } else if (overallScore >= 60) {
    pdf.setFillColor(255, 193, 7); // Amber
  } else {
    pdf.setFillColor(244, 67, 54); // Red
  }
  
  pdf.rect(20, 95, fillWidth, barHeight, 'F');
  
  // Add score text
  pdf.setFontSize(10);
  pdf.setTextColor(255, 255, 255);
  pdf.text(`${overallScore}%`, 25, 105);
  
  // Add level text
  let levelText = "";
  if (overallScore >= 80) {
    levelText = "Excellent";
  } else if (overallScore >= 60) {
    levelText = "Good";
  } else if (overallScore >= 40) {
    levelText = "Average";
  } else {
    levelText = "Below Average";
  }
  
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`${levelText}`, 75, 105);
  
  // Add "0" and "100" text below the bar
  pdf.setFontSize(8);
  pdf.text("0", 20, 115);
  pdf.text("100", 120, 115);
  
  // Add individual skills
  let startY = 130;
  
  skills.forEach((skill, index) => {
    // If we're running out of space, add a new page
    if (startY > 250) {
      // Add footer to current page
      addPageFooter(pdf, 13);
      
      // Add new page
      pdf.addPage();
      
      // Reset startY
      startY = 30;
      
      // Add title to new page
      addSectionTitle(pdf, "Skills and Abilities (Continued)", 20, startY);
      
      // Adjust startY for content
      startY = 50;
    }
    
    // Add skill name
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    pdf.text(skill.name, 20, startY);
    
    // Add skill description
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    
    const skillDescLines = pdf.splitTextToSize(skill.description, 170);
    pdf.text(skillDescLines, 25, startY + 15);
    
    // Add skill bar
    const barWidth = 100;
    const barHeight = 15;
    
    pdf.setDrawColor(230, 230, 230);
    pdf.setFillColor(240, 240, 240);
    pdf.rect(20, startY + 30, barWidth, barHeight, 'FD');
    
    // Bar filled portion based on skill score
    const fillWidth = (skill.value / 100) * barWidth;
    
    // Determine color based on score
    if (skill.value >= 80) {
      pdf.setFillColor(76, 175, 80); // Green
    } else if (skill.value >= 60) {
      pdf.setFillColor(255, 193, 7); // Amber
    } else {
      pdf.setFillColor(244, 67, 54); // Red
    }
    
    pdf.rect(20, startY + 30, fillWidth, barHeight, 'F');
    
    // Add score text
    pdf.setFontSize(10);
    pdf.setTextColor(255, 255, 255);
    pdf.text(`${skill.value}%`, 25, startY + 40);
    
    // Add level text
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${skill.level}`, 75, startY + 40);
    
    // Add "0" and "100" text below the bar
    pdf.setFontSize(8);
    pdf.text("0", 20, startY + 50);
    pdf.text("100", 120, startY + 50);
    
    // Update startY for next skill
    startY += 55;
  });
  
  // Add footer
  addPageFooter(pdf, skills.length <= 4 ? 14 : 15);
};

/**
 * Add career clusters chart to the PDF
 */
export const addCareerClusters = (pdf: jsPDF, clusters: { name: string, score: number }[]) => {
  // Add section title
  addSectionTitle(pdf, "Career Clusters", 20, 30);
  
  // Add subtitle
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Your Career Clusters", 20, 50);
  
  // Add description
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  
  const description = "Career Clusters are groups of similar occupations and industries that require similar skills. It provides a career road map for pursuing further education and career opportunities. They help you connect your Education with your Career Planning. Career Cluster helps you narrow down your occupation choices based on your assessment responses. Results show which Career Clusters would be best to explore. A simple graph report shows how you have scored on each of the Career Clusters.";
  
  const descriptionLines = pdf.splitTextToSize(description, 170);
  pdf.text(descriptionLines, 20, 70);
  
  // Create horizontal bar chart for clusters
  const startX = 20;
  const startY = 100;
  const maxBarWidth = 100;
  const barHeight = 7;
  const spacing = 10;
  
  // Sort clusters by score (highest first)
  const sortedClusters = [...clusters].sort((a, b) => b.score - a.score);
  
  // Determine how many clusters can fit on the first page
  const firstPageCount = Math.min(17, sortedClusters.length);
  
  // Draw bars for the first page
  for (let i = 0; i < firstPageCount; i++) {
    const cluster = sortedClusters[i];
    const y = startY + (i * spacing);
    
    // Cluster name
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(70, 70, 70);
    pdf.text(cluster.name, startX, y);
    
    // Bar background
    pdf.setDrawColor(230, 230, 230);
    pdf.setFillColor(240, 240, 240);
    pdf.rect(startX + 80, y - 5, maxBarWidth, barHeight, 'FD');
    
    // Bar filled portion
    const fillWidth = (cluster.score / 100) * maxBarWidth;
    
    // Determine color based on score
    if (cluster.score >= 90) {
      pdf.setFillColor(76, 175, 80); // Green
    } else if (cluster.score >= 75) {
      pdf.setFillColor(139, 195, 74); // Light green
    } else if (cluster.score >= 60) {
      pdf.setFillColor(255, 193, 7); // Amber
    } else if (cluster.score >= 45) {
      pdf.setFillColor(255, 152, 0); // Orange
    } else {
      pdf.setFillColor(244, 67, 54); // Red
    }
    
    pdf.rect(startX + 80, y - 5, fillWidth, barHeight, 'F');
    
    // Cluster score
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(0, 0, 0);
    pdf.text(String(cluster.score), startX + 80 + maxBarWidth + 5, y);
  }
  
  // Add footer
  addPageFooter(pdf, 16);
  
  // If there are more clusters, add them to the next page
  if (sortedClusters.length > firstPageCount) {
    // Add new page
    pdf.addPage();
    
    // Add title to new page
    addSectionTitle(pdf, "Career Clusters (Continued)", 20, 30);
    
    // Draw bars for the remaining clusters
    for (let i = firstPageCount; i < sortedClusters.length; i++) {
      const cluster = sortedClusters[i];
      const y = 50 + ((i - firstPageCount) * spacing);
      
      // Cluster name
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(70, 70, 70);
      pdf.text(cluster.name, startX, y);
      
      // Bar background
      pdf.setDrawColor(230, 230, 230);
      pdf.setFillColor(240, 240, 240);
      pdf.rect(startX + 80, y - 5, maxBarWidth, barHeight, 'FD');
      
      // Bar filled portion
      const fillWidth = (cluster.score / 100) * maxBarWidth;
      
      // Determine color based on score
      if (cluster.score >= 90) {
        pdf.setFillColor(76, 175, 80); // Green
      } else if (cluster.score >= 75) {
        pdf.setFillColor(139, 195, 74); // Light green
      } else if (cluster.score >= 60) {
        pdf.setFillColor(255, 193, 7); // Amber
      } else if (cluster.score >= 45) {
        pdf.setFillColor(255, 152, 0); // Orange
      } else {
        pdf.setFillColor(244, 67, 54); // Red
      }
      
      pdf.rect(startX + 80, y - 5, fillWidth, barHeight, 'F');
      
      // Cluster score
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(0, 0, 0);
      pdf.text(String(cluster.score), startX + 80 + maxBarWidth + 5, y);
    }
    
    // Add footer
    addPageFooter(pdf, 17);
  }
};

/**
 * Add selected career clusters to the PDF
 */
export const addSelectedCareerClusters = (pdf: jsPDF, selectedClusters: {
  rank: number;
  name: string;
  description: string;
}[]) => {
  // Add section title
  addSectionTitle(pdf, "Selected Career Clusters", 20, 30);
  
  // Add subtitle
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Your Selected 4 Career Clusters", 20, 50);
  
  let startY = 70;
  
  selectedClusters.forEach((cluster, index) => {
    // If we're running out of space, add a new page
    if (startY > 220) {
      // Add footer to current page
      addPageFooter(pdf, 18);
      
      // Add new page
      pdf.addPage();
      
      // Reset startY
      startY = 30;
      
      // Add title to new page
      addSectionTitle(pdf, "Selected Career Clusters (Continued)", 20, startY);
      
      // Adjust startY for content
      startY = 50;
    }
    
    // Add bullet for rank
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(100, 149, 237); // Blue
    pdf.text(`${cluster.rank}`, 20, startY);
    
    // Add cluster name
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    pdf.text(cluster.name, 30, startY);
    
    // Add cluster description
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    
    const clusterDescLines = pdf.splitTextToSize(cluster.description, 160);
    pdf.text(clusterDescLines, 30, startY + 10);
    
    // Update startY for next cluster
    startY += 10 + (clusterDescLines.length * 5) + 20;
  });
  
  // Add footer
  addPageFooter(pdf, 18);
};

/**
 * Add career paths to the PDF
 */
export const addCareerPaths = (pdf: jsPDF, careerRecommendations: {
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
}[]) => {
  // Add section title
  addSectionTitle(pdf, "Career Path", 20, 30);
  
  // Add subtitle
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Your Career Paths", 20, 50);
  
  // Add recommendations text
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Recommendations for you", 20, 70);
  
  // Create headers
  const startX = 20;
  const startY = 80;
  const width = 170;
  const headerHeight = 15;
  
  // Table headers background
  pdf.setFillColor(240, 240, 240);
  pdf.rect(startX, startY, width, headerHeight, 'F');
  
  // Table headers text
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(70, 70, 70);
  
  pdf.text("Career Paths", startX + 5, startY + 10);
  pdf.text("Psy. Analysis", startX + width - 85, startY + 10);
  pdf.text("Skill and Abilities", startX + width - 45, startY + 10);
  pdf.text("Comment", startX + width - 15, startY + 10);
  
  // Determine how many careers to show on the first page (about 25)
  const itemsPerPage = 25;
  const totalPages = Math.ceil(careerRecommendations.length / itemsPerPage);
  
  // Loop through pages
  for (let page = 0; page < totalPages; page++) {
    // If not the first page, add a new page
    if (page > 0) {
      // Add footer to the previous page
      addPageFooter(pdf, 19 + page - 1);
      
      // Add new page
      pdf.addPage();
      
      // Add title to new page
      addSectionTitle(pdf, "Career Paths (Continued)", 20, 30);
      
      // Add subtitle
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Your Career Paths", 20, 50);
      
      // Add recommendations text
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Recommendations for you", 20, 70);
      
      // Create headers for the new page
      // Table headers background
      pdf.setFillColor(240, 240, 240);
      pdf.rect(startX, 80, width, headerHeight, 'F');
      
      // Table headers text
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(70, 70, 70);
      
      pdf.text("Career Paths", startX + 5, 90);
      pdf.text("Psy. Analysis", startX + width - 85, 90);
      pdf.text("Skill and Abilities", startX + width - 45, 90);
      pdf.text("Comment", startX + width - 15, 90);
    }
    
    // Calculate start and end indices for this page
    const startIndex = page * itemsPerPage;
    const endIndex = Math.min((page + 1) * itemsPerPage, careerRecommendations.length);
    
    // Draw rows for this page
    for (let i = startIndex; i < endIndex; i++) {
      const career = careerRecommendations[i];
      const rowY = (page === 0 ? startY : 80) + headerHeight + ((i - startIndex) * 15);
      
      // Alternate row background
      if ((i - startIndex) % 2 === 0) {
        pdf.setFillColor(250, 250, 250);
        pdf.rect(startX, rowY, width, 15, 'F');
      }
      
      // Career number
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`${i + 1}`, startX + 5, rowY + 10);
      
      // Career title and category
      const careerText = `${career.careerTitle} - ${career.category}`;
      const descriptionText = career.description;
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.text(careerText, startX + 15, rowY + 5);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.text(descriptionText, startX + 15, rowY + 12);
      
      // Psychological analysis
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.text(`${career.psychAnalysis.label}:${career.psychAnalysis.score}`, startX + width - 85, rowY + 10);
      
      // Skills and abilities
      pdf.setFont('helvetica', career.skillAbilities.label === 'Very High' ? 'bold' : 'normal');
      pdf.setFontSize(9);
      pdf.text(`${career.skillAbilities.label}:${career.skillAbilities.score}`, startX + width - 45, rowY + 10);
      
      // Comment
      pdf.setFont('helvetica', career.comment === 'Top Choice' ? 'bold' : 'normal');
      pdf.setFontSize(9);
      pdf.text(career.comment, startX + width - 15, rowY + 10);
    }
    
    // Add footer to the page
    addPageFooter(pdf, 19 + page);
  }
};

/**
 * Add summary sheet to the PDF
 */
export const addSummarySheet = (pdf: jsPDF, summaryData: {
  careerPersonality: string;
  careerInterest: string;
  careerMotivator: string;
  learningStyle: string;
  skillsAbilities: string;
  selectedClusters: string;
}) => {
  // Add section title
  addSectionTitle(pdf, "Summary Sheet", 20, 30);
  
  // Add description
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Our career assessment is based on the concept of correlation theory and various psychometric and statistical models.", 20, 50);
  
  // Create a table
  const startX = 20;
  const startY = 70;
  const tableWidth = 170;
  const rowHeight = 25;
  
  // Table headers
  const categories = [
    { label: "Career Personality", value: summaryData.careerPersonality },
    { label: "Career Interest", value: summaryData.careerInterest },
    { label: "Career Motivator", value: summaryData.careerMotivator },
    { label: "Learning Style", value: summaryData.learningStyle },
    { label: "Skills & Abilities", value: summaryData.skillsAbilities },
    { label: "Selected Clusters", value: summaryData.selectedClusters }
  ];
  
  // Draw rows
  categories.forEach((category, index) => {
    const rowY = startY + (index * rowHeight);
    
    // Alternate row background
    if (index % 2 === 0) {
      pdf.setFillColor(240, 248, 255); // Light blue
      pdf.rect(startX, rowY, tableWidth, rowHeight, 'F');
    }
    
    // Add border
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(startX, rowY, tableWidth, rowHeight, 'S');
    
    // Category label
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text(category.label, startX + 5, rowY + 15);
    
    // Category value
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    
    const valueLines = pdf.splitTextToSize(category.value, 100);
    pdf.text(valueLines, startX + 65, rowY + 15);
  });
  
  // Add footer
  addPageFooter(pdf, pdf.getNumberOfPages());
};

// Export functions
export {
  addHeaderWithLogo,
  addReportTitle,
  addUserInfo,
  addDisclaimer,
  addSectionTitle,
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
};
