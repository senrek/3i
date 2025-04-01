import { jsPDF } from 'jspdf';

// Page dimensions for reference
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 20;
const CONTENT_WIDTH = PAGE_WIDTH - (2 * MARGIN);

/**
 * Add header with logo to the PDF
 */
export const addHeaderWithLogo = (doc: jsPDF) => {
  const headerHeight = 20;
  
  // Add logo placeholder
  doc.setFillColor(30, 64, 175); // Primary brand color
  doc.rect(MARGIN, MARGIN, 30, 10, 'F');
  
  // Add company name
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('CAREER ANALYSIS', MARGIN + 15, MARGIN + 6, { align: 'center' });
  
  // Add date
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  const date = new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
  doc.text(`Date: ${date}`, PAGE_WIDTH - MARGIN, MARGIN + 6, { align: 'right' });
  
  // Add horizontal line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(MARGIN, MARGIN + headerHeight - 5, PAGE_WIDTH - MARGIN, MARGIN + headerHeight - 5);
  
  return { lastY: MARGIN + headerHeight };
};

/**
 * Add report title section to the PDF
 */
export const addReportTitle = (doc: jsPDF) => {
  const startY = 35;
  
  // Add main title
  doc.setFontSize(24);
  doc.setTextColor(30, 64, 175);
  doc.setFont('helvetica', 'bold');
  doc.text('Career Assessment Report', PAGE_WIDTH / 2, startY, { align: 'center' });
  
  // Add subtitle
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('Personalized Analysis & Career Recommendations', PAGE_WIDTH / 2, startY + 8, { align: 'center' });
  
  return { lastY: startY + 20 };
};

/**
 * Add user information section to the PDF
 */
export const addUserInfo = (doc: jsPDF, userInfo: any) => {
  const startY = 55;
  
  // Add section title
  doc.setFontSize(14);
  doc.setTextColor(30, 64, 175);
  doc.setFont('helvetica', 'bold');
  doc.text('Report Prepared For', MARGIN, startY);
  
  // Draw box for user info
  doc.setFillColor(245, 247, 250);
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.5);
  doc.roundedRect(MARGIN, startY + 5, CONTENT_WIDTH, 40, 3, 3, 'FD');
  
  // Add user info content
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'bold');
  doc.text(userInfo.name || 'Student Name', MARGIN + 5, startY + 15);
  
  // User details
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  
  // Format user details in two columns
  const leftCol = startY + 25;
  const rightCol = startY + 25;
  const leftX = MARGIN + 5;
  const rightX = PAGE_WIDTH / 2 + 5;
  
  // Left column
  doc.text(`Email: ${userInfo.email || 'N/A'}`, leftX, leftCol);
  doc.text(`Age: ${userInfo.age || 'N/A'}`, leftX, leftCol + 8);
  
  // Right column
  doc.text(`Phone: ${userInfo.phone || 'N/A'}`, rightX, rightCol);
  doc.text(`Location: ${userInfo.location || 'N/A'}`, rightX, rightCol + 8);
  
  return startY + 50;
};

/**
 * Add disclaimer text to the PDF
 */
export const addDisclaimer = (doc: jsPDF, yPosition: number) => {
  // Add disclaimer box
  doc.setFillColor(252, 245, 235);
  doc.setDrawColor(237, 203, 131);
  doc.setLineWidth(0.5);
  doc.roundedRect(MARGIN, yPosition, CONTENT_WIDTH, 25, 2, 2, 'FD');
  
  // Add disclaimer text
  doc.setFontSize(8);
  doc.setTextColor(120, 100, 40);
  doc.setFont('helvetica', 'italic');
  
  const disclaimer = "This report is intended only for the use of the individual to which it is addressed and may contain information that is confidential. The assessment results represent a snapshot of your current preferences and should be considered alongside other factors when making career decisions. No part of this report may be reproduced in any form without prior written permission.";
  
  // Wrap text to fit in the box
  const textLines = doc.splitTextToSize(disclaimer, CONTENT_WIDTH - 10);
  doc.text(textLines, MARGIN + 5, yPosition + 8);
  
  return yPosition + 30;
};

/**
 * Add section title to the PDF
 */
export const addSectionTitle = (doc: jsPDF, yPosition: number, title: string) => {
  // Add title
  doc.setFontSize(16);
  doc.setTextColor(30, 64, 175);
  doc.setFont('helvetica', 'bold');
  doc.text(title, MARGIN, yPosition);
  
  // Add underline
  doc.setDrawColor(30, 64, 175);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, yPosition + 2, MARGIN + doc.getTextWidth(title), yPosition + 2);
  
  return yPosition + 12;
};

/**
 * Add profiling section to the PDF
 */
export const addProfilingSection = (doc: jsPDF, yPosition: number, data: any) => {
  // Add subtitle
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'bold');
  doc.text('Your Current Career Planning Stage', MARGIN, yPosition);
  
  // Draw stages progress bar
  const barY = yPosition + 15;
  const barWidth = CONTENT_WIDTH;
  const barHeight = 12;
  
  // Background bar
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(MARGIN, barY, barWidth, barHeight, 2, 2, 'F');
  
  // Stages labels
  const stages = ['Ignorant', 'Confused', 'Diffused', 'Methodical', 'Optimized'];
  const stageWidth = barWidth / stages.length;
  
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  
  stages.forEach((stage, index) => {
    const x = MARGIN + (stageWidth * index) + (stageWidth / 2);
    doc.text(stage, x, barY + barHeight + 8, { align: 'center' });
  });
  
  // Highlight current stage
  const currentStageIndex = stages.indexOf(data.currentStage);
  if (currentStageIndex >= 0) {
    // Calculate position
    const stageX = MARGIN + (stageWidth * currentStageIndex);
    const nextX = stageX + stageWidth;
    
    // Highlight stage
    doc.setFillColor(30, 64, 175);
    doc.roundedRect(stageX, barY, stageWidth, barHeight, 0, 0, 'F');
    
    // Add label to highlighted stage
    doc.setTextColor(255, 255, 255);
    doc.text(stages[currentStageIndex], stageX + (stageWidth / 2), barY + (barHeight / 2) + 3, { align: 'center' });
  }
  
  // Add description
  const descY = barY + barHeight + 20;
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'normal');
  
  // Wrap and add description text
  const description = data.description || "";
  const descriptionLines = doc.splitTextToSize(description, CONTENT_WIDTH);
  doc.text(descriptionLines, MARGIN, descY);
  
  // Calculate next position after description
  const descHeight = descriptionLines.length * 5;
  
  // Add risk involved
  let riskY = descY + descHeight + 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Risk Involved:', MARGIN, riskY);
  doc.setFont('helvetica', 'normal');
  const riskText = data.riskInvolved || "";
  const riskLines = doc.splitTextToSize(riskText, CONTENT_WIDTH);
  doc.text(riskLines, MARGIN, riskY + 5);
  
  // Calculate next position
  const riskHeight = riskLines.length * 5;
  
  // Add action plan
  let actionY = riskY + riskHeight + 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Action Plan:', MARGIN, actionY);
  doc.setFont('helvetica', 'normal');
  const actionText = data.actionPlan || "";
  const actionLines = doc.splitTextToSize(actionText, CONTENT_WIDTH);
  doc.text(actionLines, MARGIN, actionY + 5);
  
  // Calculate final position
  const actionHeight = actionLines.length * 5;
  
  return actionY + actionHeight + 10;
};

/**
 * Add page footer to the PDF
 */
export const addPageFooter = (doc: jsPDF, userName: string, pageNumber: number) => {
  const footerY = PAGE_HEIGHT - 15;
  
  // Add horizontal line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(MARGIN, footerY - 5, PAGE_WIDTH - MARGIN, footerY - 5);
  
  // Add user name on left
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(userName, MARGIN, footerY);
  
  // Add page number on right
  doc.text(`Page ${pageNumber}`, PAGE_WIDTH - MARGIN, footerY, { align: 'right' });
  
  return { lastY: footerY };
};

/**
 * Add personality type chart to the PDF
 */
export const addPersonalityTypeChart = (doc: jsPDF, yPosition: number, data: any, personalityType: string = '') => {
  // Add subtitle
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'bold');
  doc.text('Result of the Career Personality', MARGIN, yPosition);
  
  // Add personality type 
  const typeY = yPosition + 15;
  doc.setFontSize(10);
  doc.text('Personality Type:', MARGIN, typeY);
  doc.setFont('helvetica', 'bold');
  doc.text(personalityType, MARGIN + 35, typeY);
  
  // Draw personality dimension bars
  const barStartY = typeY + 10;
  const barHeight = 12;
  const barSpacing = 25;
  const barWidth = CONTENT_WIDTH - 60;
  
  // Helper function to draw a dimension bar
  const drawDimensionBar = (y: number, leftName: string, leftValue: number, rightName: string, rightValue: number) => {
    // Draw dimension labels
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    
    // Left label
    doc.text(`${leftName}-[${leftValue}%]`, MARGIN, y + (barHeight / 2) + 3);
    
    // Right label
    doc.text(`${rightName}-[${rightValue}%]`, PAGE_WIDTH - MARGIN, y + (barHeight / 2) + 3, { align: 'right' });
    
    // Draw background bar
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(MARGIN + 60, y, barWidth, barHeight, 2, 2, 'F');
    
    // Draw left portion in primary color
    doc.setFillColor(30, 64, 175);
    doc.roundedRect(MARGIN + 60, y, (barWidth * leftValue) / 100, barHeight, 2, 2, 'F');
    
    // Draw right portion in secondary color
    doc.setFillColor(220, 80, 50);
    const rightWidth = (barWidth * rightValue) / 100;
    doc.roundedRect(MARGIN + 60 + barWidth - rightWidth, y, rightWidth, barHeight, 2, 2, 'F');
  };
  
  // Draw each dimension
  if (data) {
    // Extract dimension data
    const { introvertExtrovert, sensingIntuitive, thinkingFeeling, judgingPerceiving } = data;
    
    // Draw each dimension
    if (introvertExtrovert) {
      drawDimensionBar(
        barStartY, 
        'Introvert', 
        introvertExtrovert.introvert, 
        'Extrovert', 
        introvertExtrovert.extrovert
      );
    }
    
    if (sensingIntuitive) {
      drawDimensionBar(
        barStartY + barSpacing, 
        'Sensing', 
        sensingIntuitive.sensing, 
        'iNtuitive', 
        sensingIntuitive.intuitive
      );
      
      // Add dimension descriptor
      doc.setFontSize(7);
      doc.setTextColor(100, 100, 100);
      doc.text('(Observant)', MARGIN + 5, barStartY + barSpacing + (barHeight / 2) + 7);
      doc.text('(Futuristic)', PAGE_WIDTH - MARGIN - 5, barStartY + barSpacing + (barHeight / 2) + 7, { align: 'right' });
    }
    
    if (thinkingFeeling) {
      drawDimensionBar(
        barStartY + barSpacing * 2, 
        'Thinking', 
        thinkingFeeling.thinking, 
        'Feeling', 
        thinkingFeeling.feeling
      );
    }
    
    if (judgingPerceiving) {
      drawDimensionBar(
        barStartY + barSpacing * 3, 
        'Judging', 
        judgingPerceiving.judging, 
        'Perceiving', 
        judgingPerceiving.perceiving
      );
      
      // Add dimension descriptor
      doc.setFontSize(7);
      doc.setTextColor(100, 100, 100);
      doc.text('(Organized)', MARGIN + 5, barStartY + barSpacing * 3 + (barHeight / 2) + 7);
      doc.text('(Spontaneous)', PAGE_WIDTH - MARGIN - 5, barStartY + barSpacing * 3 + (barHeight / 2) + 7, { align: 'right' });
    }
  }
  
  return { lastY: barStartY + barSpacing * 4 };
};

/**
 * Add personality analysis to the PDF
 */
export const addPersonalityAnalysis = (doc: jsPDF, yPosition: number, data: any) => {
  // Add subtitle
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'bold');
  doc.text('Analysis of Career Personality', MARGIN, yPosition);
  
  // Add "Your Career Personality Analysis" subheading
  doc.setFontSize(11);
  doc.setTextColor(30, 64, 175);
  doc.text('Your Career Personality Analysis', MARGIN, yPosition + 10);
  
  const sectionStartY = yPosition + 20;
  let currentY = sectionStartY;
  
  // Helper function to add a section with bullet points
  const addSection = (title: string, points: string[]) => {
    // Section title
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'bold');
    doc.text(title, MARGIN, currentY);
    
    // Draw colored box for section
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(MARGIN, currentY + 3, CONTENT_WIDTH, points.length * 8 + 4, 2, 2, 'F');
    
    // Add bullet points
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    
    points.forEach((point, index) => {
      const bulletY = currentY + 10 + (index * 8);
      
      // Ensure we're not going off the page
      if (bulletY < PAGE_HEIGHT - 20) {
        // Add bullet point
        doc.circle(MARGIN + 3, bulletY - 2, 1, 'F');
        
        // Add text
        const textLines = doc.splitTextToSize(point, CONTENT_WIDTH - 10);
        doc.text(textLines, MARGIN + 8, bulletY);
      }
    });
    
    // Update currentY for next section
    currentY += points.length * 8 + 20;
  };
  
  // Add each personality dimension section
  if (data) {
    // Add focus energy section
    if (data.focusEnergy) {
      addSection('Where do you prefer to focus your energy and attention?', data.focusEnergy);
    }
    
    // Add process info section
    if (data.processInfo) {
      addSection('How do you grasp and process the information?', data.processInfo);
    }
    
    // Add make decisions section
    if (data.makeDecisions) {
      addSection('How do you make decisions?', data.makeDecisions);
    }
    
    // Add plan work section
    if (data.planWork) {
      addSection('How do you prefer to plan your work?', data.planWork);
    }
    
    // Add strengths section
    if (data.strengths) {
      addSection('Your strengths', data.strengths);
    }
  }
  
  return { lastY: currentY };
};

/**
 * Add interest bar chart to the PDF
 */
export const addInterestBarChart = (doc: jsPDF, yPosition: number, data: any) => {
  // Add subtitle
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'bold');
  doc.text('Your Career Interest Types', MARGIN, yPosition);
  
  // Add description
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  const description = "The Career Interest Assessment helps you understand which careers might be the best fit for you. Understanding your top career interests will help you identify a career focus and begin your career planning process.";
  const descriptionLines = doc.splitTextToSize(description, CONTENT_WIDTH);
  doc.text(descriptionLines, MARGIN, yPosition + 10);
  
  // Calculate description height
  const descHeight = descriptionLines.length * 5;
  const chartY = yPosition + 10 + descHeight + 10;
  
  // Draw horizontal bar chart
  const barHeight = 15;
  const barSpacing = 5;
  const barWidth = CONTENT_WIDTH - 60;
  
  if (Array.isArray(data)) {
    // Sort data by value (descending)
    const sortedData = [...data].sort((a, b) => b.value - a.value);
    
    // Draw each bar
    sortedData.forEach((item, index) => {
      const barY = chartY + (index * (barHeight + barSpacing));
      
      // Draw bar label
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      doc.text(item.name, MARGIN, barY + (barHeight / 2) + 3);
      
      // Draw background bar
      doc.setFillColor(240, 240, 240);
      doc.roundedRect(MARGIN + 40, barY, barWidth, barHeight, 2, 2, 'F');
      
      // Calculate colored bar width based on value (max value is 100)
      const coloredWidth = (barWidth * Math.min(item.value, 100)) / 100;
      
      // Draw colored bar
      doc.setFillColor(30, 64, 175);
      doc.roundedRect(MARGIN + 40, barY, coloredWidth, barHeight, 2, 2, 'F');
      
      // Add value at the end of the bar
      doc.setTextColor(50, 50, 50);
      doc.text(item.value.toString(), MARGIN + 40 + coloredWidth + 5, barY + (barHeight / 2) + 3);
    });
    
    return { lastY: chartY + (sortedData.length * (barHeight + barSpacing)) };
  }
  
  return { lastY: chartY };
};

/**
 * Add interest analysis to the PDF
 */
export const addInterestAnalysis = (doc: jsPDF, yPosition: number, data: any) => {
  // Add subtitle
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'bold');
  doc.text('Analysis of Career Interest', MARGIN, yPosition);
  
  // Add "Your Career Interest Analysis" subheading
  doc.setFontSize(11);
  doc.setTextColor(30, 64, 175);
  doc.text('Your Career Interest Analysis', MARGIN, yPosition + 10);
  
  const sectionStartY = yPosition + 20;
  let currentY = sectionStartY;
  
  // Helper function to add an interest analysis section
  const addInterestSection = (title: string, level: string, points: string[]) => {
    // Section title with level
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'bold');
    doc.text(`${title}-${level}`, MARGIN, currentY);
    
    // Draw colored box for section
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(MARGIN, currentY + 3, CONTENT_WIDTH, points.length * 8 + 4, 2, 2, 'F');
    
    // Add bullet points
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    
    points.forEach((point, index) => {
      const bulletY = currentY + 10 + (index * 8);
      
      // Ensure we're not going off the page
      if (bulletY < PAGE_HEIGHT - 20) {
        // Add bullet point
        doc.circle(MARGIN + 3, bulletY - 2, 1, 'F');
        
        // Add text
        const textLines = doc.splitTextToSize(point, CONTENT_WIDTH - 10);
        doc.text(textLines, MARGIN + 8, bulletY);
      }
    });
    
    // Update currentY for next section
    currentY += points.length * 8 + 20;
  };
  
  // Add each interest analysis section
  if (Array.isArray(data)) {
    data.forEach(item => {
      addInterestSection(item.title, item.level, item.points);
    });
  }
  
  return { lastY: currentY };
};

/**
 * Add career motivator chart to the PDF
 */
export const addCareerMotivatorChart = (doc: jsPDF, yPosition: number, data: any) => {
  // Add subtitle
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'bold');
  doc.text('Your Career Motivator Types', MARGIN, yPosition);
  
  // Add description
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  const description = "Values are the things that are most important to us in our lives and careers. Being aware of what we value in our lives is important because a career choice that is in-line with our core beliefs and values is more likely to be a lasting and positive choice.";
  const descriptionLines = doc.splitTextToSize(description, CONTENT_WIDTH);
  doc.text(descriptionLines, MARGIN, yPosition + 10);
  
  // Calculate description height
  const descHeight = descriptionLines.length * 5;
  const chartY = yPosition + 10 + descHeight + 10;
  
  // Draw horizontal bar chart
  const barHeight = 15;
  const barSpacing = 5;
  const barWidth = CONTENT_WIDTH - 60;
  
  if (Array.isArray(data)) {
    // Sort data by value (descending)
    const sortedData = [...data].sort((a, b) => b.value - a.value);
    
    // Draw each bar
    sortedData.forEach((item, index) => {
      const barY = chartY + (index * (barHeight + barSpacing));
      
      // Draw bar label
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      doc.text(item.name, MARGIN, barY + (barHeight / 2) + 3);
      
      // Draw background bar
      doc.setFillColor(240, 240, 240);
      doc.roundedRect(MARGIN + 70, barY, barWidth - 30, barHeight, 2, 2, 'F');
      
      // Calculate colored bar width based on value (max value is 100)
      const coloredWidth = ((barWidth - 30) * Math.min(item.value, 100)) / 100;
      
      // Draw colored bar with gradient-like appearance
      doc.setFillColor(30, 64, 175);
      doc.roundedRect(MARGIN + 70, barY, coloredWidth, barHeight, 2, 2, 'F');
      
      // Add value at the end of the bar
      doc.setTextColor(50, 50, 50);
      doc.text(item.value.toString(), MARGIN + 70 + coloredWidth + 5, barY + (barHeight / 2) + 3);
    });
    
    return { lastY: chartY + (sortedData.length * (barHeight + barSpacing)) };
  }
  
  return { lastY: chartY };
};

/**
 * Add motivator analysis to the PDF
 */
export const addMotivatorAnalysis = (doc: jsPDF, yPosition: number, data: any) => {
  // Add subtitle
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'bold');
  doc.text('Analysis of Career Motivator', MARGIN, yPosition);
  
  // Add "Your Career Motivator Analysis" subheading
  doc.setFontSize(11);
  doc.setTextColor(30, 64, 175);
  doc.text('Your Career Motivator Analysis', MARGIN, yPosition + 10);
  
  const sectionStartY = yPosition + 20;
  let currentY = sectionStartY;
  
  // Helper function to add a motivator analysis section
  const addMotivatorSection = (title: string, level: string, points: string[]) => {
    // Section title with level
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'bold');
    doc.text(`${title}-${level}`, MARGIN, currentY);
    
    // Draw colored box for section
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(MARGIN, currentY + 3, CONTENT_WIDTH, points.length * 8 + 4, 2, 2, 'F');
    
    // Add bullet points
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    
    points.forEach((point, index) => {
      const bulletY = currentY + 10 + (index * 8);
      
      // Ensure we're not going off the page
      if (bulletY < PAGE_HEIGHT - 20) {
        // Add bullet point
        doc.circle(MARGIN + 3, bulletY - 2, 1, 'F');
        
        // Add text
        const textLines = doc.splitTextToSize(point, CONTENT_WIDTH - 10);
        doc.text(textLines, MARGIN + 8, bulletY);
      }
    });
    
    // Update currentY for next section
    currentY += points.length * 8 + 20;
  };
  
  // Add each motivator analysis section
  if (Array.isArray(data)) {
    data.forEach(item => {
      addMotivatorSection(item.title, item.level, item.points);
    });
  }
  
  return { lastY: currentY };
};

/**
 * Add learning style pie chart to the PDF
 */
export const addLearningStylePieChart = (doc: jsPDF, yPosition: number, data: any) => {
  // Add subtitle
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'bold');
  doc.text('Your Learning Style Types', MARGIN, yPosition);
  
  // Start drawing the chart
  const chartY = yPosition + 15;
  const chartRadius = 40;
  const centerX = MARGIN + chartRadius + 10;
  const centerY = chartY + chartRadius + 5;
  
  // Draw pie chart
  if (Array.isArray(data)) {
    // Calculate total value
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    // Draw legend
    const legendX = centerX + chartRadius + 30;
    const legendY = chartY + 15;
    
    // Colors for the pie slices
    const colors = [
      [30, 64, 175],   // Primary blue
      [220, 80, 50],   // Orange
      [50, 160, 100],  // Green
      [150, 80, 180]   // Purple
    ];
    
    // Draw each slice and legend item
    let startAngle = 0;
    
    data.forEach((item, index) => {
      // Calculate angles for the slice
      const percentage = item.value / total;
      const angle = percentage * 360;
      const endAngle = startAngle + angle;
      
      // Draw slice
      doc.setFillColor(colors[index][0], colors[index][1], colors[index][2]);
      drawPieSlice(doc, centerX, centerY, chartRadius, startAngle, endAngle);
      
      // Update angle for next slice
      startAngle = endAngle;
      
      // Draw legend item
      const legendItemY = legendY + (index * 15);
      
      // Draw legend color box
      doc.setFillColor(colors[index][0], colors[index][1], colors[index][2]);
      doc.rect(legendX, legendItemY - 5, 10, 10, 'F');
      
      // Draw legend text
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);
      doc.text(`${item.name} (${item.value}%)`, legendX + 15, legendItemY);
    });
    
    return { lastY: centerY + chartRadius + 20 };
  }
  
  return { lastY: chartY };
};

// Helper function to draw a pie slice
const drawPieSlice = (doc: jsPDF, x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
  // Convert angles to radians
  const startRad = (startAngle - 90) * Math.PI / 180;
  const endRad = (endAngle - 90) * Math.PI / 180;
  
  // Calcuate points
  const x1 = x + radius * Math.cos(startRad);
  const y1 = y + radius * Math.sin(startRad);
  const x2 = x + radius * Math.cos(endRad);
  const y2 = y + radius * Math.sin(endRad);
  
  // Draw the slice
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  
  // We need to use SVG paths for arcs since jsPDF doesn't have a direct method
  // But since we can't use SVG in jsPDF directly, we'll fake it with multiple lines
  
  // Draw lines from center to points on the circumference
  doc.line(x, y, x1, y1);
  
  // Approximate the arc with multiple lines
  const numSegments = Math.ceil((endAngle - startAngle) / 5); // 5 degree segments
  let lastX = x1;
  let lastY = y1;
  
  for (let i = 1; i <= numSegments; i++) {
    const angle = startRad + (i / numSegments) * (endRad - startRad);
    const newX = x + radius * Math.cos(angle);
    const newY = y + radius * Math.sin(angle);
    
    doc.line(lastX, lastY, newX, newY);
    
    lastX = newX;
    lastY = newY;
  }
  
  // Connect back to center
  doc.line(lastX, lastY, x, y);
};

/**
 * Add learning style analysis to the PDF
 */
export const addLearningStyleAnalysis = (doc: jsPDF, yPosition: number, data: any) => {
  // Add dominant learning style title
  doc.setFontSize(11);
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'bold');
  doc.text(data.title, MARGIN, yPosition);
  
  // Add description section
  if (data.description && data.description.length > 0) {
    // Draw colored box for description
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(MARGIN, yPosition + 5, CONTENT_WIDTH, data.description.length * 8 + 4, 2, 2, 'F');
    
    // Add description points
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    
    data.description.forEach((point: string, index: number) => {
      const pointY = yPosition + 12 + (index * 8);
      
      // Add bullet point
      doc.circle(MARGIN + 3, pointY - 2, 1, 'F');
      
      // Add text
      const textLines = doc.splitTextToSize(point, CONTENT_WIDTH - 10);
      doc.text(textLines, MARGIN + 8, pointY);
    });
  }
  
  // Calculate height of description section
  const descriptionHeight = data.description ? data.description.length * 8 + 10 : 0;
  
  // Add learning strategies section
  const strategiesY = yPosition + descriptionHeight + 15;
  
  if (data.strategies && data.strategies.length > 0) {
    // Add strategies title
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'bold');
    doc.text('Learning improvement strategies', MARGIN, strategiesY);
    
    // Draw colored box for strategies
    doc.setFillColor(250, 245, 245);
    doc.roundedRect(MARGIN, strategiesY + 5, CONTENT_WIDTH, data.strategies.length * 8 + 4, 2, 2, 'F');
    
    // Add strategy points
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    
    data.strategies.forEach((strategy: string, index: number) => {
      const strategyY = strategiesY + 12 + (index * 8);
      
      // Add bullet point
      doc.circle(MARGIN + 3, strategyY - 2, 1, 'F');
      
      // Add text
      const textLines = doc.splitTextToSize(strategy, CONTENT_WIDTH - 10);
      doc.text(textLines, MARGIN + 8, strategyY);
    });
  }
  
  // Calculate height of strategies section
  const strategiesHeight = data.strategies ? data.strategies.length * 8 + 20 : 0;
  
  return { lastY: strategiesY + strategiesHeight };
};

/**
 * Add skill bar chart to the PDF
 */
export const addSkillBarChart = (doc: jsPDF, yPosition: number, data: any) => {
  // Add subtitle
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'bold');
  doc.text('Your Skills and Abilities', MARGIN, yPosition);
  
  // Add description
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  const description = "The skills & abilities scores will help us to explore and identify different ways to reshape your career direction. This simple graph shows how you have scored on each of these skills and abilities.";
  const descriptionLines = doc.splitTextToSize(description, CONTENT_WIDTH);
  doc.text(descriptionLines, MARGIN, yPosition + 10);
  
  // Calculate description height
  const descHeight = descriptionLines.length * 5;
  let currentY = yPosition + 10 + descHeight + 10;
  
  if (Array.isArray(data)) {
    // Find overall score
    const overallData = data.find(item => item.name === 'overall');
    
    if (overallData) {
      // Add overall score
      currentY += 5;
      doc.setFontSize(12);
      doc.setTextColor(50, 50, 50);
      doc.setFont('helvetica', 'bold');
      doc.text('Overall Skills and Abilities', MARGIN, currentY);
      
      // Draw overall score gauge
      currentY += 10;
      const gaugeWidth = 150;
      const gaugeHeight = 20;
      const gaugeX = MARGIN;
      const gaugeY = currentY;
      
      // Draw background gauge
      doc.setFillColor(240, 240, 240);
      doc.roundedRect(gaugeX, gaugeY, gaugeWidth, gaugeHeight, 3, 3, 'F');
      
      // Draw filled portion
      const fillWidth = (gaugeWidth * Math.min(overallData.value, 100)) / 100;
      doc.setFillColor(30, 64, 175);
      doc.roundedRect(gaugeX, gaugeY, fillWidth, gaugeHeight, 3, 3, 'F');
      
      // Add value and level text
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text(`${overallData.value}% - ${overallData.level}`, gaugeX + fillWidth / 2, gaugeY + 13, { align: 'center' });
      
      // Add min/max labels
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('0', gaugeX, gaugeY + gaugeHeight + 10);
      doc.text('100', gaugeX + gaugeWidth, gaugeY + gaugeHeight + 10, { align: 'right' });
      
      currentY += 40;
    }
    
    // Draw skill sections
    const skillsToShow = data.filter(item => item.name !== 'overall' && item.description && item.description.length > 0);
    
    skillsToShow.forEach(skill => {
      // Add skill name and gauge
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.setFont('helvetica', 'bold');
      
      const skillTitle = skill.name.charAt(0).toUpperCase() + skill.name.slice(1);
      let title = '';
      
      // Format skill title
      switch (skill.name) {
        case 'numerical':
          title = 'Numerical Ability';
          break;
        case 'logical':
          title = 'Logical Ability';
          break;
        case 'verbal':
          title = 'Verbal Ability';
          break;
        case 'clerical':
          title = 'Clerical and Organizing Skills';
          break;
        case 'spatial':
          title = 'Spatial & Visualization Ability';
          break;
        case 'leadership':
          title = 'Leadership & Decision making skills';
          break;
        case 'social':
          title = 'Social & Co-operation Skills';
          break;
        case 'mechanical':
          title = 'Mechanical Abilities';
          break;
        default:
          title = skillTitle;
      }
      
      doc.text(title, MARGIN, currentY);
      
      // Draw skill gauge
      currentY += 10;
      const gaugeWidth = 150;
      const gaugeHeight = 15;
      const gaugeX = MARGIN;
      const gaugeY = currentY;
      
      // Draw background gauge
      doc.setFillColor(240, 240, 240);
      doc.roundedRect(gaugeX, gaugeY, gaugeWidth, gaugeHeight, 3, 3, 'F');
      
      // Draw filled portion
      const fillWidth = (gaugeWidth * Math.min(skill.value, 100)) / 100;
      
      // Color based on level
      if (skill.level === 'Excellent') {
        doc.setFillColor(50, 160, 100);
      } else if (skill.level === 'Good') {
        doc.setFillColor(30, 64, 175);
      } else if (skill.level === 'Average') {
        doc.setFillColor(220, 150, 50);
      } else {
        doc.setFillColor(220, 80, 50);
      }
      
      doc.roundedRect(gaugeX, gaugeY, fillWidth, gaugeHeight, 3, 3, 'F');
      
      // Add value and level text
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text(`${skill.value}%`, gaugeX + fillWidth / 2, gaugeY + 10, { align: 'center' });
      
      // Add min/max labels
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('0', gaugeX, gaugeY + gaugeHeight + 10);
      doc.text('100', gaugeX + gaugeWidth, gaugeY + gaugeHeight + 10, { align: 'right' });
      
      // Add level label on right
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.setFont('helvetica', 'bold');
      doc.text(skill.level, gaugeX + gaugeWidth + 20, gaugeY + 10);
      
      // Add description
      if (skill.description && skill.description.length > 0) {
        currentY += 20;
        
        // Draw colored box for description
        doc.setFillColor(245, 247, 250);
        doc.roundedRect(MARGIN, currentY, CONTENT_WIDTH, skill.description.length * 8 + 4, 2, 2, 'F');
        
        // Add description points
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);
        
        skill.description.forEach((point: string, index: number) => {
          const pointY = currentY + 7 + (index * 8);
          
          // Add bullet point
          doc.circle(MARGIN + 3, pointY - 2, 1, 'F');
          
          // Add text
          const textLines = doc.splitTextToSize(point, CONTENT_WIDTH - 10);
          doc.text(textLines, MARGIN + 8, pointY);
        });
        
        // Update position for next skill
        currentY += skill.description.length * 8 + 15;
      } else {
        currentY += 25;
      }
    });
  }
  
  return { lastY: currentY };
};

/**
 * Add career clusters chart to the PDF
 */
export const addCareerClusters = (doc: jsPDF, yPosition: number, data: any) => {
  // Add subtitle
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'bold');
  doc.text('Your Career Clusters', MARGIN, yPosition);
  
  // Add description
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  const description = "Career Clusters are groups of similar occupations and industries that require similar skills. They help you connect your Education with your Career Planning and narrow down your occupation choices based on your assessment responses.";
  const descriptionLines = doc.splitTextToSize(description, CONTENT_WIDTH);
  doc.text(descriptionLines, MARGIN, yPosition + 10);
  
  // Calculate description height
  const descHeight = descriptionLines.length * 5;
  const chartY = yPosition + 10 + descHeight + 10;
  
  // Draw horizontal bar chart
  const barHeight = 10;
  const barSpacing = 3;
  const barWidth = CONTENT_WIDTH - 60;
  
  if (Array.isArray(data)) {
    // Sort data by score (descending)
    const sortedData = [...data].sort((a, b) => b.score - a.score);
    
    // Draw each bar (limit to the top 10 for space)
    const dataToShow = sortedData.slice(0, Math.min(sortedData.length, 15));
    
    dataToShow.forEach((item, index) => {
      const barY = chartY + (index * (barHeight + barSpacing));
      
      // Draw bar label
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      
      // Truncate name if too long
      let displayName = item.name;
      if (doc.getTextWidth(displayName) > 58) {
        displayName = displayName.substring(0, 12) + '...';
      }
      
      doc.text(displayName, MARGIN, barY + (barHeight / 2) + 2);
      
      // Draw background bar
      doc.setFillColor(240, 240, 240);
      doc.roundedRect(MARGIN + 60, barY, barWidth, barHeight, 1, 1, 'F');
      
      // Calculate colored bar width based on score (max score is 100)
      const coloredWidth = (barWidth * Math.min(item.score, 100)) / 100;
      
      // Draw colored bar with gradient-like appearance
      // For the top clusters, use primary color
      if (index < 4) {
        doc.setFillColor(30, 64, 175);
      } else {
        // Other clusters get a less prominent color
        doc.setFillColor(100, 130, 200);
      }
      doc.roundedRect(MARGIN + 60, barY, coloredWidth, barHeight, 1, 1, 'F');
      
      // Add score at the end of the bar
      doc.setTextColor(50, 50, 50);
      doc.text(item.score.toString(), MARGIN + 60 + coloredWidth + 3, barY + (barHeight / 2) + 2);
    });
    
    return { lastY: chartY + (dataToShow.length * (barHeight + barSpacing)) + 10 };
  }
  
  return { lastY: chartY };
};

/**
 * Add selected career clusters to the PDF
 */
export const addSelectedCareerClusters = (doc: jsPDF, yPosition: number, data: any) => {
  // Add subtitle
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'bold');
  doc.text('Your Selected Career Clusters', MARGIN, yPosition);
  
  const sectionStartY = yPosition + 15;
  let currentY = sectionStartY;
  
  if (Array.isArray(data) && data.length > 0) {
    // Draw each selected cluster
    data.forEach((cluster, index) => {
      // Add cluster rank and name
      doc.setFontSize(10);
      doc.setTextColor(30, 64, 175);
      doc.setFont('helvetica', 'bold');
      doc.text(`${cluster.rank}`, MARGIN, currentY);
      doc.text(cluster.name, MARGIN + 10, currentY);
      
      // Draw colored box for description
      doc.setFillColor(245, 247, 250);
      doc.roundedRect(MARGIN, currentY + 5, CONTENT_WIDTH, cluster.description.length * 8 + 4, 2, 2, 'F');
      
      // Add description points
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      
      cluster.description.forEach((point: string, pointIndex: number) => {
        const pointY = currentY + 12 + (pointIndex * 8);
        
        // Add bullet point
        doc.circle(MARGIN + 3, pointY - 2, 1, 'F');
        
        // Add text
        const textLines = doc.splitTextToSize(point, CONTENT_WIDTH - 10);
        doc.text(textLines, MARGIN + 8, pointY);
      });
      
      // Update position for next cluster
      currentY += cluster.description.length * 8 + 20;
    });
  }
  
  return { lastY: currentY };
};

/**
 * Add career paths to the PDF
 */
export const addCareerPaths = (doc: jsPDF, yPosition: number, data: any) => {
  // Add subtitle
  doc.setFontSize(14);
  doc.setTextColor(30, 64, 175);
  doc.setFont('helvetica', 'bold');
  doc.text('Your Career Paths', MARGIN, yPosition);
  
  // Add "Recommendations for you" subtitle
  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'normal');
  doc.text('Recommendations for you', MARGIN, yPosition + 10);
  
  // Draw table header
  const tableY = yPosition + 20;
  const colWidths = [100, 30, 30, 30];
  const rowHeight = 12;
  let currentY = tableY;
  
  // Draw header row
  doc.setFillColor(240, 240, 240);
  doc.rect(MARGIN, currentY, CONTENT_WIDTH, rowHeight, 'F');
  
  // Add header text
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'bold');
  
  let currentX = MARGIN + 2;
  doc.text('Career Paths', currentX, currentY + 8);
  
  currentX += colWidths[0];
  doc.text('Psy. Analysis', currentX, currentY + 8);
  
  currentX += colWidths[1];
  doc.text('Skill and Abilities', currentX, currentY + 8);
  
  currentX += colWidths[2];
  doc.text('Comment', currentX, currentY + 8);
  
  currentY += rowHeight;
  
  // Draw data rows
  if (Array.isArray(data)) {
    // Limit to top paths to fit on page
    const pathsToShow = data.slice(0, Math.min(10, data.length));
    
    pathsToShow.forEach((path, index) => {
      // Alternate row background
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(MARGIN, currentY, CONTENT_WIDTH, rowHeight * 2, 'F');
      }
      
      // Add career title and category
      doc.setFontSize(8);
      doc.setTextColor(50, 50, 50);
      doc.setFont('helvetica', 'bold');
      
      const titleLines = doc.splitTextToSize(path.careerTitle, colWidths[0] - 5);
      doc.text(titleLines, MARGIN + 2, currentY + 5);
      
      doc.setFont('helvetica', 'normal');
      const categoryLines = doc.splitTextToSize(path.category, colWidths[0] - 5);
      doc.text(categoryLines, MARGIN + 2, currentY + 14);
      
      // Add psych analysis
      currentX = MARGIN + colWidths[0] + 2;
      if (path.psychAnalysis) {
        doc.setFont('helvetica', 'bold');
        doc.text(`${path.psychAnalysis.label}:${path.psychAnalysis.score}`, currentX, currentY + 10);
      }
      
      // Add skill and abilities
      currentX += colWidths[1];
      if (path.skillAbilities) {
        doc.setFont('helvetica', 'bold');
        doc.text(`${path.skillAbilities.label}:${path.skillAbilities.score}`, currentX, currentY + 10);
      }
      
      // Add comment
      currentX += colWidths[2];
      if (path.comment) {
        doc.setFont('helvetica', 'normal');
        doc.text(path.comment, currentX, currentY + 10);
      }
      
      // Update Y position for next row
      currentY += rowHeight * 2;
      
      // Add separator line
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.2);
      doc.line(MARGIN, currentY, MARGIN + CONTENT_WIDTH, currentY);
    });
  }
  
  return { lastY: currentY + 10 };
};

/**
 * Add summary sheet to the PDF
 */
export const addSummarySheet = (doc: jsPDF, yPosition: number, data: any) => {
  // Add title
  doc.setFontSize(14);
  doc.setTextColor(30, 64, 175);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary Sheet', MARGIN, yPosition);
  
  // Draw full width background box
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(MARGIN, yPosition + 10, CONTENT_WIDTH, 120, 3, 3, 'F');
  
  // Add introduction text
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'italic');
  const introText = "Our career assessment is based on the concept of correlation theory and various psychometric and statistical models.";
  doc.text(introText, MARGIN + 5, yPosition + 20);
  
  // Add summary items
  const itemStartY = yPosition + 30;
  const itemSpacing = 15;
  let currentY = itemStartY;
  
  // Helper function to add a summary item
  const addSummaryItem = (label: string, value: string) => {
    // Add label
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'bold');
    doc.text(label, MARGIN + 5, currentY);
    
    // Add value
    doc.setFont('helvetica', 'normal');
    
    // Wrap value text if needed
    const valueLines = doc.splitTextToSize(value, CONTENT_WIDTH - 100);
    doc.text(valueLines, MARGIN + 50, currentY);
    
    // Update position for next item
    currentY += valueLines.length * 5 + 5;
  };
  
  // Add each summary item
  if (data) {
    addSummaryItem('Career Personality', data.careerPersonality || 'Not available');
    addSummaryItem('Career Interest', data.careerInterest || 'Not available');
    addSummaryItem('Career Motivator', data.careerMotivator || 'Not available');
    addSummaryItem('Learning Style', data.learningStyle || 'Not available');
    addSummaryItem('Skills & Abilities', data.skillsAbilities || 'Not available');
    addSummaryItem('Selected Clusters', data.selectedClusters || 'Not available');
  }
  
  return { lastY: yPosition + 140 };
};
