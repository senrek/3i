
import { jsPDF } from 'jspdf';
import logo from '/placeholder.svg'; // Replace with your actual logo

// Helper to calculate text height based on font size and line count
const calculateTextHeight = (doc: jsPDF, text: string, fontSize: number, maxWidth: number): number => {
  doc.setFontSize(fontSize);
  const lines = doc.splitTextToSize(text, maxWidth);
  return lines.length * (fontSize * 0.352); // Approximation for line height
};

// Add header with logo to the PDF
export const addHeaderWithLogo = (doc: jsPDF, pageNumber: number = 1) => {
  // Reset transformation to avoid compounding effects
  doc.setTransform(1, 0, 0, 1, 0, 0);
  
  // Add logo to top left
  try {
    doc.addImage(logo, 'PNG', 20, 15, 40, 15);
  } catch (error) {
    console.error('Error adding logo to PDF:', error);
  }
  
  // Add page number to bottom right
  const pageText = `Page ${pageNumber}`;
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(pageText, doc.internal.pageSize.width - 25, doc.internal.pageSize.height - 15);
  
  return doc;
};

// Add report title
export const addReportTitle = (doc: jsPDF) => {
  // Add "Career Report" title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(50, 50, 50);
  const title = "Career Report";
  
  // Center the title
  const textWidth = doc.getTextWidth(title);
  const pageWidth = doc.internal.pageSize.width;
  doc.text(title, (pageWidth - textWidth) / 2, 40);
  
  // Add report date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const date = new Date().toLocaleDateString('en-IN', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
  
  doc.text(`Report Date: ${date}`, 20, 50);
  doc.text("Powered By:", pageWidth - 60, 50);
  
  return doc;
};

// Add user information section
export const addUserInfo = (doc: jsPDF, userName: string, email?: string, phone?: string, age?: string, location?: string) => {
  // Add "Report Prepared for" text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(50, 50, 50);
  doc.text("Report Prepared for", 20, 70);
  
  // Add user details with proper spacing
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  
  let yPosition = 80;
  const lineHeight = 10;
  
  doc.text(userName || "User", 20, yPosition);
  yPosition += lineHeight;
  
  if (phone) {
    doc.text(`Ph No ${phone}`, 20, yPosition);
    yPosition += lineHeight;
  }
  
  if (email) {
    doc.text(`Email ID ${email}`, 20, yPosition);
    yPosition += lineHeight;
  }
  
  if (age) {
    doc.text(`Age ${age}`, 20, yPosition);
    yPosition += lineHeight;
  }
  
  if (location) {
    doc.text(`Location ${location}`, 20, yPosition);
    yPosition += lineHeight;
  }
  
  return { doc, lastY: yPosition };
};

// Add disclaimer text
export const addDisclaimer = (doc: jsPDF, startY: number) => {
  const disclaimerText = "This report is intended only for the use of the individual or entity to which it is addressed and may contain " +
    "information that is non-public, proprietary, privileged, confidential, and exempt from disclosure under " +
    "applicable law or may constitute as attorney work product. No part of this report may be reproduced in " +
    "any form or manner without prior written permission from company.";
  
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  
  const textWidth = doc.internal.pageSize.width - 40; // 20px margin on each side
  const textLines = doc.splitTextToSize(disclaimerText, textWidth);
  
  doc.text(textLines, 20, startY + 10);
  
  // Add contact info footer
  doc.setFontSize(8);
  doc.text("Contact: 7048976060 | Email: 3iglobal25@gmail.com", 20, startY + 35);
  
  return doc;
};

// Add section titles with proper spacing
export const addSectionTitle = (doc: jsPDF, title: string, y: number, addLine: boolean = true) => {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(50, 50, 50);
  doc.text(title, 20, y);
  
  if (addLine) {
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y + 2, doc.internal.pageSize.width - 20, y + 2);
  }
  
  return { doc, titleEndY: y + 15 };
};

// Add profiling section with proper spacing
export const addProfilingSection = (doc: jsPDF, startY: number) => {
  // Add "Your Profiling" section
  const { doc: updatedDoc, titleEndY } = addSectionTitle(doc, "Your Profiling", startY);
  
  // Add description text with proper spacing
  const description = "Personal profiling is the first step in career planning. The purpose of profiling is to understand your " +
    "current career planning stage. It will help decide your career objective and roadmap. The ultimate aim of " +
    "the planning is to take you from the current stage of career planning to the optimized stage of career " +
    "planning. Personal profiling includes information about your current stage, the risk involved and action " +
    "plan for your career development.";
  
  updatedDoc.setFont('helvetica', 'normal');
  updatedDoc.setFontSize(10);
  updatedDoc.setTextColor(0, 0, 0);
  
  const textWidth = updatedDoc.internal.pageSize.width - 40; // 20px margin on each side
  const textLines = updatedDoc.splitTextToSize(description, textWidth);
  
  updatedDoc.text(textLines, 20, titleEndY + 10);
  
  // Calculate the height of the text
  const textHeight = textLines.length * 5; // Approximation: 5 units per line
  
  // Add "Current Stage of Planning" with proper spacing
  updatedDoc.setFont('helvetica', 'bold');
  updatedDoc.text("Current Stage of Planning", 20, titleEndY + 20 + textHeight);
  
  // Add planning stages diagram with proper spacing
  const stages = ["Ignorant", "Confused", "Diffused", "Methodical", "Optimized"];
  const stageWidth = (updatedDoc.internal.pageSize.width - 40) / stages.length;
  const diagramY = titleEndY + 30 + textHeight;
  
  // Draw the career planning stages
  updatedDoc.setDrawColor(200, 200, 200);
  updatedDoc.setFillColor(240, 240, 240);
  
  for (let i = 0; i < stages.length; i++) {
    const x = 20 + i * stageWidth;
    
    // Draw box
    updatedDoc.roundedRect(x, diagramY, stageWidth - 5, 20, 2, 2, i === 2 ? 'F' : 'S');
    
    // Add stage name
    updatedDoc.setFontSize(9);
    updatedDoc.setFont('helvetica', i === 2 ? 'bold' : 'normal');
    updatedDoc.setTextColor(i === 2 ? 0 : 100, i === 2 ? 0 : 100, i === 2 ? 0 : 100);
    
    const textWidth = updatedDoc.getTextWidth(stages[i]);
    updatedDoc.text(stages[i], x + (stageWidth - 5 - textWidth) / 2, diagramY + 13);
  }
  
  // Add "Diffused" text with proper spacing
  updatedDoc.setFont('helvetica', 'bold');
  updatedDoc.setFontSize(12);
  updatedDoc.setTextColor(0, 0, 0);
  updatedDoc.text("Diffused", 20, diagramY + 35);
  
  // Add diffused description with proper spacing
  const diffusedDesc = "Diffused: You are at the diffused stage in career planning. We understand that you have a fair idea " +
    "of your suitable career. At this stage, you have a better understanding of career options. However, " +
    "you are looking for more information to understand the complete career path for yourself and an " +
    "execution plan to achieve it. Lack of complete information and execution plan can adversely impact " +
    "your career. Most career decisions are based on limited information";
  
  updatedDoc.setFont('helvetica', 'normal');
  updatedDoc.setFontSize(10);
  const diffusedLines = updatedDoc.splitTextToSize(diffusedDesc, textWidth);
  updatedDoc.text(diffusedLines, 20, diagramY + 45);
  
  const diffusedHeight = diffusedLines.length * 5; // Approximation: 5 units per line
  
  // Add risk involved with proper spacing
  const riskY = diagramY + 50 + diffusedHeight;
  updatedDoc.setFont('helvetica', 'bold');
  updatedDoc.text("Risk Involved:", 20, riskY);
  
  updatedDoc.setFont('helvetica', 'normal');
  updatedDoc.text("Career misalignment, career path misjudgment, wrong career path projections, unnecessary stress", 100, riskY);
  
  // Add action plan with proper spacing
  updatedDoc.setFont('helvetica', 'bold');
  updatedDoc.text("Action Plan :", 20, riskY + 10);
  
  updatedDoc.setFont('helvetica', 'normal');
  updatedDoc.text("Explore career path > Align your abilities and interests with the best possible career path > Realistic Execution Plan > Timely Review of Action Plan", 100, riskY + 10);
  
  // Return the updated document and the Y position for the next section
  return { doc: updatedDoc, lastY: riskY + 30 };
};

// Add page footer with contact information
export const addPageFooter = (doc: jsPDF, userName: string, pageNumber: number) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  
  // Add company info
  doc.text("3i Global", 20, pageHeight - 15);
  doc.text("7048976060", pageWidth / 2 - 20, pageHeight - 15);
  doc.text("3iglobal25@gmail.com", pageWidth - 65, pageHeight - 15);
  
  // Add user name
  doc.text(userName, 20, pageHeight - 25);
  doc.text(`Page ${pageNumber}`, pageWidth - 30, pageHeight - 25);
  
  return doc;
};

// Add personality type chart with proper spacing
export const addPersonalityTypeChart = (doc: jsPDF, startY: number, strengthPercentages: any) => {
  const { doc: updatedDoc, titleEndY } = addSectionTitle(doc, "Result of the Career Personality", startY);
  
  // Add description text with proper spacing
  const description = "Personality Assessment will help you understand yourself as a person. It will help you expand your " +
    "career options in alignment with your personality. Self-understanding and awareness can lead you to " +
    "more appropriate and rewarding career choices. The Personality Type Model identifies four dimensions " +
    "of personality. Each dimension will give you a clear description of your personality. The combination of " +
    "your most dominant preferences is used to create your individual personality type. Four dimensions of " +
    "your personality are mentioned in this chart. The graph below provides information about the personality " +
    "type you belong to, based on the scoring of your responses. Each of the four preferences are based on " +
    "your answers and are indicated by a bar chart.";
  
  updatedDoc.setFont('helvetica', 'normal');
  updatedDoc.setFontSize(10);
  updatedDoc.setTextColor(0, 0, 0);
  
  const textWidth = updatedDoc.internal.pageSize.width - 40; // 20px margin on each side
  const textLines = updatedDoc.splitTextToSize(description, textWidth);
  
  updatedDoc.text(textLines, 20, titleEndY);
  
  // Calculate the height of the text
  const textHeight = textLines.length * 5; // Approximation: 5 units per line
  
  // Add personality type with proper spacing
  updatedDoc.setFont('helvetica', 'bold');
  updatedDoc.setFontSize(12);
  const personalityType = "Personality Type: Introvert:Sensing:Thinking:Judging";
  updatedDoc.text(personalityType, 20, titleEndY + textHeight + 10);
  
  // Draw the personality chart with proper spacing
  const chartY = titleEndY + textHeight + 20;
  const chartWidth = updatedDoc.internal.pageSize.width - 40;
  const rowHeight = 15;
  
  // Helper function for drawing the personality dimension rows
  const drawPersonalityRow = (leftLabel: string, leftPercentage: number, rightLabel: string, rightPercentage: number, y: number) => {
    // Left label
    updatedDoc.setFont('helvetica', 'bold');
    updatedDoc.setFontSize(10);
    updatedDoc.text(leftLabel, 20, y + 10);
    
    // Left percentage
    updatedDoc.text(`[${leftPercentage}%]`, 80, y + 10);
    
    // Right label
    updatedDoc.text(rightLabel, 150, y + 10);
    
    // Right percentage
    updatedDoc.text(`[${rightPercentage}%]`, 210, y + 10);
    
    // Draw the progress bar
    const barY = y + 4;
    updatedDoc.setDrawColor(200, 200, 200);
    updatedDoc.setFillColor(220, 220, 220);
    updatedDoc.roundedRect(20, barY, chartWidth, 3, 1, 1, 'F');
    
    // Fill in the percentage
    updatedDoc.setFillColor(100, 100, 255);
    updatedDoc.roundedRect(20, barY, (chartWidth * leftPercentage) / 100, 3, 1, 1, 'F');
  };
  
  // Draw each personality dimension row with proper spacing
  drawPersonalityRow("Introvert", strengthPercentages?.introvert || 86, "Extrovert", strengthPercentages?.extrovert || 14, chartY);
  drawPersonalityRow("Sensing", strengthPercentages?.sensing || 86, "iNtuitive", strengthPercentages?.intuitive || 14, chartY + rowHeight);
  drawPersonalityRow("Thinking", strengthPercentages?.thinking || 71, "Feeling", strengthPercentages?.feeling || 29, chartY + rowHeight * 2);
  drawPersonalityRow("Judging", strengthPercentages?.judging || 57, "Perceiving", strengthPercentages?.perceiving || 43, chartY + rowHeight * 3);
  
  // Add "(Observant)" and "(Futuristic)" labels
  updatedDoc.setFont('helvetica', 'italic');
  updatedDoc.setFontSize(8);
  updatedDoc.text("(Observant)", 60, chartY + rowHeight + 3);
  updatedDoc.text("(Futuristic)", 190, chartY + rowHeight + 3);
  
  // Add "(Organized)" and "(Spontaneous)" labels
  updatedDoc.text("(Organized)", 60, chartY + rowHeight * 3 + 3);
  updatedDoc.text("(Spontaneous)", 190, chartY + rowHeight * 3 + 3);
  
  // Return the updated document and the Y position for the next section
  return { doc: updatedDoc, lastY: chartY + rowHeight * 4 + 10 };
};

// Add personality analysis section with proper spacing
export const addPersonalityAnalysis = (doc: jsPDF, startY: number) => {
  const { doc: updatedDoc, titleEndY } = addSectionTitle(doc, "Analysis of Career Personality", startY);
  
  // Add "Your Career Personality Analysis" subtitle with proper spacing
  updatedDoc.setFont('helvetica', 'bold');
  updatedDoc.setFontSize(14);
  updatedDoc.text("Your Career Personality Analysis", 20, titleEndY);
  
  // Starting Y position for the first personality dimension
  let currentY = titleEndY + 15;
  const columnWidth = updatedDoc.internal.pageSize.width / 2;
  
  // Helper function to add a personality dimension section with proper spacing
  const addPersonalityDimension = (title: string, traits: string[], y: number, leftColumn: boolean = true) => {
    const xPos = leftColumn ? 20 : columnWidth + 10;
    
    // Add the dimension title with proper spacing
    updatedDoc.setFont('helvetica', 'bold');
    updatedDoc.setFontSize(11);
    updatedDoc.text(title, xPos, y);
    
    // Add the dimension traits with proper spacing
    updatedDoc.setFont('helvetica', 'normal');
    updatedDoc.setFontSize(10);
    
    let traitY = y + 10;
    const traitWidth = leftColumn ? columnWidth - 30 : columnWidth - 20;
    
    for (const trait of traits) {
      const traitLines = updatedDoc.splitTextToSize(`• ${trait}`, traitWidth);
      updatedDoc.text(traitLines, xPos, traitY);
      traitY += traitLines.length * 5; // Approximation: 5 units per line
    }
    
    return traitY;
  };
  
  // Add each personality dimension with proper spacing
  const introvertTraits = [
    "You mostly get your energy from dealing with ideas, pictures, memories and reactions which are part of your imaginative world.",
    "You are quiet, reserved and like to spend your time alone.",
    "Your primary mode of living is focused internally.",
    "You are passionate but not usually aggressive.",
    "You are a good listener.",
    "You are more of an inside-out person."
  ];
  
  // Calculate max height needed
  const maxHeight1 = addPersonalityDimension("Where do you prefer to focus your energy and attention?", introvertTraits, currentY, true) - currentY;
  
  const sensingTraits = [
    "You mostly collect and trust the information that is presented in a detailed and sequential manner.",
    "You think more about the present and learn from the past.",
    "You like to see the practical use of things and learn best from practice.",
    "You notice facts and remember details that are important to you.",
    "You solve problems by working through facts until you understand the problem.",
    "You create meaning from conscious thought and learn by observation."
  ];
  
  // Calculate max height needed for first row
  const maxHeight2 = addPersonalityDimension("How do you grasp and process the information?", sensingTraits, currentY, false) - currentY;
  const rowHeight = Math.max(maxHeight1, maxHeight2);
  
  // Update Y position for the next row with proper spacing
  currentY += rowHeight + 10;
  
  const thinkingTraits = [
    "You seem to make decisions based on logic rather than the circumstances.",
    "You believe telling truth is more important than being tactful.",
    "You seem to look for logical explanations or solutions to almost everything.",
    "You can often be seen as very task-oriented, uncaring, or indifferent.",
    "You are ruled by your head instead of your heart.",
    "You are a critical thinker and oriented toward problem solving."
  ];
  
  // Calculate max height needed
  const maxHeight3 = addPersonalityDimension("How do you make decisions?", thinkingTraits, currentY, true) - currentY;
  
  const judgingTraits = [
    "You prefer a planned or orderly way of life.",
    "You like to have things well-organized.",
    "Your productivity increases when working with structure.",
    "You are self-disciplined and decisive.",
    "You like to have things decided and planned before doing any task.",
    "You seek closure and enjoy completing tasks.",
    "Mostly, you think sequentially."
  ];
  
  // Calculate max height needed for second row
  const maxHeight4 = addPersonalityDimension("How do you prefer toplan your work ?", judgingTraits, currentY, false) - currentY;
  const row2Height = Math.max(maxHeight3, maxHeight4);
  
  // Update Y position for the strengths section with proper spacing
  currentY += row2Height + 15;
  
  // Add strengths with proper spacing
  updatedDoc.setFont('helvetica', 'bold');
  updatedDoc.setFontSize(12);
  updatedDoc.text("Your strengths", 20, currentY);
  
  const strengths = [
    "Strong-willed and dutiful",
    "Calm and practical",
    "Honest and direct",
    "Very responsible",
    "Create and enforce order"
  ];
  
  // Add strength bullets with proper spacing
  updatedDoc.setFont('helvetica', 'normal');
  updatedDoc.setFontSize(10);
  
  let strengthY = currentY + 10;
  
  for (const strength of strengths) {
    updatedDoc.text(`• ${strength}`, 20, strengthY);
    strengthY += 6;
  }
  
  // Return the updated document and the Y position for the next section
  return { doc: updatedDoc, lastY: strengthY + 10 };
};

// Add interest bar chart with proper spacing
export const addInterestBarChart = (doc: jsPDF, startY: number, interestTypes: any) => {
  const { doc: updatedDoc, titleEndY } = addSectionTitle(doc, "Result of the Career Interest", startY);
  
  // Add "Your Career Interest Types" subtitle with proper spacing
  updatedDoc.setFont('helvetica', 'bold');
  updatedDoc.setFontSize(14);
  updatedDoc.text("Your Career Interest Types", 20, titleEndY);
  
  // Add description text with proper spacing
  const description = "The Career Interest Assessment will help you understand which careers might be the best fit for you. It is " +
    "meant to help you find careers that you might enjoy. Understanding your Top career interest will help you " +
    "identify a career focus and begin your career planning and career exploration process.\n\n" +
    "The Career Interest Assessment (CIA) measures six broad interest patterns that can be used to " +
    "describe your career interest. Most people's interests are reflected by two or three themes, combined to " +
    "form a cluster of interests. This career interest is directly linked to your occupational interest.";
  
  updatedDoc.setFont('helvetica', 'normal');
  updatedDoc.setFontSize(10);
  const textWidth = updatedDoc.internal.pageSize.width - 40; // 20px margin on each side
  const textLines = updatedDoc.splitTextToSize(description, textWidth);
  
  updatedDoc.text(textLines, 20, titleEndY + 10);
  
  // Calculate the height of the text
  const textHeight = textLines.length * 5; // Approximation: 5 units per line
  
  // Draw the interest chart with proper spacing
  const chartY = titleEndY + textHeight + 25;
  const chartWidth = updatedDoc.internal.pageSize.width - 140;
  const barHeight = 15;
  const labelWidth = 80;
  const maxValue = 110; // Maximum value for the chart scale
  
  // Sort interest types by value if available
  const interestData = interestTypes || [
    { name: 'Investigative', value: 100 },
    { name: 'Conventional', value: 55 },
    { name: 'Realistic', value: 55 },
    { name: 'Enterprising', value: 33 },
    { name: 'Artistic', value: 21 },
    { name: 'Social', value: 12 }
  ];
  
  // Draw each interest bar with proper spacing
  interestData.forEach((interest, index) => {
    const y = chartY + index * (barHeight + 5);
    
    // Draw background bar
    updatedDoc.setDrawColor(220, 220, 220);
    updatedDoc.setFillColor(240, 240, 240);
    updatedDoc.roundedRect(labelWidth + 20, y, chartWidth, barHeight, 1, 1, 'F');
    
    // Draw value bar
    const valueWidth = (interest.value / maxValue) * chartWidth;
    updatedDoc.setFillColor(100, 100, 255);
    updatedDoc.roundedRect(labelWidth + 20, y, valueWidth, barHeight, 1, 1, 'F');
    
    // Add interest name
    updatedDoc.setFont('helvetica', 'normal');
    updatedDoc.setFontSize(10);
    updatedDoc.setTextColor(0, 0, 0);
    updatedDoc.text(interest.name, 20, y + barHeight / 2 + 3);
    
    // Add interest value
    updatedDoc.setFont('helvetica', 'bold');
    updatedDoc.text(interest.value.toString(), labelWidth + 25 + valueWidth, y + barHeight / 2 + 3);
  });
  
  // Draw the chart scale with proper spacing
  updatedDoc.setDrawColor(200, 200, 200);
  updatedDoc.setFontSize(8);
  
  for (let i = 0; i <= 10; i++) {
    const x = labelWidth + 20 + (i * chartWidth / 10);
    const scaleValue = i * maxValue / 10;
    
    // Draw scale line
    updatedDoc.line(x, chartY - 5, x, chartY + interestData.length * (barHeight + 5));
    
    // Add scale value
    updatedDoc.text(scaleValue.toString(), x - 3, chartY - 8);
  }
  
  // Return the updated document and the Y position for the next section
  return { doc: updatedDoc, lastY: chartY + interestData.length * (barHeight + 5) + 15 };
};

// Add interest analysis with proper spacing
export const addInterestAnalysis = (doc: jsPDF, startY: number) => {
  const { doc: updatedDoc, titleEndY } = addSectionTitle(doc, "Analysis of Career Interest", startY);
  
  // Add "Your Career Interest Analysis" subtitle with proper spacing
  updatedDoc.setFont('helvetica', 'bold');
  updatedDoc.setFontSize(14);
  updatedDoc.text("Your Career Interest Analysis", 20, titleEndY);
  
  // Current Y position for the first interest analysis
  let currentY = titleEndY + 15;
  
  // Helper function to add an interest analysis section with proper spacing
  const addInterestSection = (title: string, traits: string[], y: number) => {
    // Add the interest title with proper spacing
    updatedDoc.setFont('helvetica', 'bold');
    updatedDoc.setFontSize(12);
    updatedDoc.text(`${title}-HIGH`, 20, y);
    
    // Add the interest traits with proper spacing
    updatedDoc.setFont('helvetica', 'normal');
    updatedDoc.setFontSize(10);
    
    let traitY = y + 10;
    const textWidth = updatedDoc.internal.pageSize.width - 40; // 20px margin on each side
    
    for (const trait of traits) {
      const traitLines = updatedDoc.splitTextToSize(`• ${trait}`, textWidth);
      updatedDoc.text(traitLines, 20, traitY);
      traitY += traitLines.length * 5; // Approximation: 5 units per line
    }
    
    return traitY + 10; // Return the next Y position with padding
  };
  
  // Add each interest analysis with proper spacing
  const investigativeTraits = [
    "You are analytical, intellectual, observant and enjoy research.",
    "You enjoy using logic and solving complex problems.",
    "You are interested in occupations that require observation, learning and investigation.",
    "You are introspective and focused on creative problem solving.",
    "You prefer working with ideas and using technology."
  ];
  
  currentY = addInterestSection("Investigative", investigativeTraits, currentY);
  
  const conventionalTraits = [
    "You are efficient, careful, conforming, organized and conscientious.",
    "You are organized, detail-oriented and do well with manipulating data and numbers.",
    "You are persistent and reliable in carrying out tasks.",
    "You enjoy working with data, details and creating reports",
    "You prefer working in a structured environment.",
    "You like to work with data, and you have a numerical or clerical ability."
  ];
  
  currentY = addInterestSection("Conventional", conventionalTraits, currentY);
  
  const realisticTraits = [
    "You are active, stable and enjoy hands-on or manual activities.",
    "You prefer to work with things rather than ideas and people.",
    "You tend to communicate in a frank, direct manner and value material things.",
    "You may be uncomfortable or less adept with human relations.",
    "You value practical things that you can see and touch.",
    "You have good skills at handling tools, mechanical drawings, machines or animals."
  ];
  
  currentY = addInterestSection("Realistic", realisticTraits, currentY);
  
  const enterprisingTraits = [
    "You are energetic, ambitious, adventurous, and confident.",
    "You are skilled in leadership and speaking.",
    "You generally enjoy starting your own business, promoting ideas and managing people.",
    "You are effective at public speaking and are generally social.",
    "You like activities that requires to persuade others and leadership roles.",
    "You like the promotion of products, ideas, or services."
  ];
  
  currentY = addInterestSection("Enterprising", enterprisingTraits, currentY);
  
  // Return the updated document and the Y position for the next section
  return { doc: updatedDoc, lastY: currentY };
};

// Add career motivator chart with proper spacing
export const addCareerMotivatorChart = (doc: jsPDF, startY: number, motivatorTypes: any) => {
  const { doc: updatedDoc, titleEndY } = addSectionTitle(doc, "Result of the Career Motivator", startY);
  
  // Add "Your Career Motivator Types" subtitle with proper spacing
  updatedDoc.setFont('helvetica', 'bold');
  updatedDoc.setFontSize(14);
  updatedDoc.text("Your Career Motivator Types", 20, titleEndY);
  
  // Add description text with proper spacing
  const description = "Values are the things that are most important to us in our lives and careers. Our values are formed in a " +
    "variety of ways through our life experiences, our feelings and our families. In the context of Career " +
    "Planning, values generally refer to the things we value in a career. Being aware of what we value in our " +
    "lives is important because a career choice that is in-line with our core beliefs and values is more likely to " +
    "be a lasting and positive choice";
  
  updatedDoc.setFont('helvetica', 'normal');
  updatedDoc.setFontSize(10);
  const textWidth = updatedDoc.internal.pageSize.width - 40; // 20px margin on each side
  const textLines = updatedDoc.splitTextToSize(description, textWidth);
  
  updatedDoc.text(textLines, 20, titleEndY + 10);
  
  // Calculate the height of the text
  const textHeight = textLines.length * 5; // Approximation: 5 units per line
  
  // Draw the motivator chart with proper spacing
  const chartY = titleEndY + textHeight + 25;
  const chartWidth = updatedDoc.internal.pageSize.width - 140;
  const barHeight = 15;
  const labelWidth = 100;
  const maxValue = 120; // Maximum value for the chart scale
  
  // Sort motivator types by value if available
  const motivatorData = motivatorTypes || [
    { name: 'Independence', value: 100 },
    { name: 'Continuous Learning', value: 100 },
    { name: 'Social Service', value: 100 },
    { name: 'Structured work environment', value: 40 },
    { name: 'Adventure', value: 40 },
    { name: 'High Paced Environment', value: 20 },
    { name: 'Creativity', value: 20 }
  ];
  
  // Draw each motivator bar with proper spacing
  motivatorData.forEach((motivator, index) => {
    const y = chartY + index * (barHeight + 5);
    
    // Draw background bar
    updatedDoc.setDrawColor(220, 220, 220);
    updatedDoc.setFillColor(240, 240, 240);
    updatedDoc.roundedRect(labelWidth + 20, y, chartWidth, barHeight, 1, 1, 'F');
    
    // Draw value bar
    const valueWidth = (motivator.value / maxValue) * chartWidth;
    updatedDoc.setFillColor(100, 100, 255);
    updatedDoc.roundedRect(labelWidth + 20, y, valueWidth, barHeight, 1, 1, 'F');
    
    // Add motivator name
    updatedDoc.setFont('helvetica', 'normal');
    updatedDoc.setFontSize(10);
    updatedDoc.setTextColor(0, 0, 0);
    updatedDoc.text(motivator.name, 20, y + barHeight / 2 + 3);
    
    // Add motivator value
    updatedDoc.setFont('helvetica', 'bold');
    updatedDoc.text(motivator.value.toString(), labelWidth + 25 + valueWidth, y + barHeight / 2 + 3);
  });
  
  // Draw the chart scale with proper spacing
  updatedDoc.setDrawColor(200, 200, 200);
  updatedDoc.setFontSize(8);
  
  for (let i = 0; i <= 10; i++) {
    const x = labelWidth + 20 + (i * chartWidth / 10);
    const scaleValue = i * maxValue / 10;
    
    // Draw scale line
    updatedDoc.line(x, chartY - 5, x, chartY + motivatorData.length * (barHeight + 5));
    
    // Add scale value
    updatedDoc.text(scaleValue.toString(), x - 3, chartY - 8);
  }
  
  // Return the updated document and the Y position for the next section
  return { doc: updatedDoc, lastY: chartY + motivatorData.length * (barHeight + 5) + 15 };
};

// Add motivator analysis with proper spacing
export const addMotivatorAnalysis = (doc: jsPDF, startY: number) => {
  const { doc: updatedDoc, titleEndY } = addSectionTitle(doc, "Analysis of Career Motivator", startY);
  
  // Add "Your Career Motivator Analysis" subtitle with proper spacing
  updatedDoc.setFont('helvetica', 'bold');
  updatedDoc.setFontSize(14);
  updatedDoc.text("Your Career Motivator Analysis", 20, titleEndY);
  
  // Current Y position for the first motivator analysis
  let currentY = titleEndY + 15;
  
  // Helper function to add a motivator analysis section with proper spacing
  const addMotivatorSection = (title: string, traits: string[], y: number) => {
    // Add the motivator title with proper spacing
    updatedDoc.setFont('helvetica', 'bold');
    updatedDoc.setFontSize(12);
    updatedDoc.text(`${title}-HIGH`, 20, y);
    
    // Add the motivator traits with proper spacing
    updatedDoc.setFont('helvetica', 'normal');
    updatedDoc.setFontSize(10);
    
    let traitY = y + 10;
    const textWidth = updatedDoc.internal.pageSize.width - 40; // 20px margin on each side
    
    for (const trait of traits) {
      const traitLines = updatedDoc.splitTextToSize(`• ${trait}`, textWidth);
      updatedDoc.text(traitLines, 20, traitY);
      traitY += traitLines.length * 5; // Approximation: 5 units per line
    }
    
    return traitY + 10; // Return the next Y position with padding
  };
  
  // Add each motivator analysis with proper spacing
  const socialServiceTraits = [
    "You like to do work which has some social responsibility.",
    "You like to do work which impacts the world.",
    "You like to receive social recognition for the work that you do."
  ];
  
  currentY = addMotivatorSection("Social Service", socialServiceTraits, currentY);
  
  const independenceTraits = [
    "You enjoy working independently.",
    "You dislike too much supervision.",
    "You dislike group activities."
  ];
  
  currentY = addMotivatorSection("Independence", independenceTraits, currentY);
  
  const continuousLearningTraits = [
    "You like to have consistent professional growth in your field of work.",
    "You like to work in an environment where there is need to update your knowledge at regular intervals.",
    "You like it when your work achievements are evaluated at regular intervals."
  ];
  
  currentY = addMotivatorSection("Continuous learning", continuousLearningTraits, currentY);
  
  // Return the updated document and the Y position for the next section
  return { doc: updatedDoc, lastY: currentY };
};

// Add learning style pie chart with proper spacing
export const addLearningStylePieChart = (doc: jsPDF, startY: number, learningStyles: any) => {
  const { doc: updatedDoc, titleEndY } = addSectionTitle(doc, "Result of the Learning Style", startY);
  
  // Add "Your Learning Style Types" subtitle with proper spacing
  updatedDoc.setFont('helvetica', 'bold');
  updatedDoc.setFontSize(14);
  updatedDoc.text("Your Learning Style Types", 20, titleEndY);
  
  // Draw the learning style pie chart with proper spacing
  const chartY = titleEndY + 25;
  const centerX = doc.internal.pageSize.width / 2;
  const centerY = chartY + 60;
  const radius = 50;
  
  // Sort learning styles by value if available
  const styleData = learningStyles || [
    { name: 'Read & Write Learning', value: 38 },
    { name: 'Auditory learning', value: 25 },
    { name: 'Visual Learning', value: 25 },
    { name: 'Kinesthetic Learning', value: 13 }
  ];
  
  // Calculate total for percentages
  const total = styleData.reduce((sum, style) => sum + style.value, 0);
  
  // Define colors for the pie segments
  const colors = [
    [100, 100, 255],  // Blue
    [255, 100, 100],  // Red
    [100, 255, 100],  // Green
    [255, 200, 100]   // Yellow
  ];
  
  // Draw pie chart segments with proper spacing
  let startAngle = 0;
  const legendY = chartY + 130; // Y position for the legend
  const legendItemHeight = 20; // Height of each legend item
  
  styleData.forEach((style, index) => {
    const percentage = (style.value / total) * 100;
    const endAngle = startAngle + (percentage / 100) * (Math.PI * 2);
    
    // Draw pie segment
    updatedDoc.setFillColor(colors[index][0], colors[index][1], colors[index][2]);
    updatedDoc.setDrawColor(255, 255, 255);
    
    // Draw pie segment (simplified drawing)
    updatedDoc.circle(centerX, centerY, radius, 'F');
    
    // Draw legend item with proper spacing
    const legendItemY = legendY + index * legendItemHeight;
    
    // Draw legend color box
    updatedDoc.setFillColor(colors[index][0], colors[index][1], colors[index][2]);
    updatedDoc.rect(20, legendItemY - 6, 10, 10, 'F');
    
    // Add legend text
    updatedDoc.setFont('helvetica', 'normal');
    updatedDoc.setFontSize(10);
    updatedDoc.setTextColor(0, 0, 0);
    updatedDoc.text(`${style.name} (${style.value}%)`, 40, legendItemY);
    
    startAngle = endAngle;
  });
  
  // Draw the learning style chart with proper spacing
  const barChartY = legendY + styleData.length * legendItemHeight + 10;
  const chartWidth = updatedDoc.internal.pageSize.width - 140;
  const barHeight = 15;
  const labelWidth = 100;
  const maxValue = 40; // Maximum value for the chart scale
  
  // Draw each learning style bar with proper spacing
  styleData.forEach((style, index) => {
    const y = barChartY + index * (barHeight + 5);
    
    // Draw background bar
    updatedDoc.setDrawColor(220, 220, 220);
    updatedDoc.setFillColor(240, 240, 240);
    updatedDoc.roundedRect(labelWidth + 20, y, chartWidth, barHeight, 1, 1, 'F');
    
    // Draw value bar
    const valueWidth = (style.value / maxValue) * chartWidth;
    updatedDoc.setFillColor(colors[index][0], colors[index][1], colors[index][2]);
    updatedDoc.roundedRect(labelWidth + 20, y, valueWidth, barHeight, 1, 1, 'F');
    
    // Add style name
    updatedDoc.setFont('helvetica', 'normal');
    updatedDoc.setFontSize(10);
    updatedDoc.setTextColor(0, 0, 0);
    updatedDoc.text(style.name, 20, y + barHeight / 2 + 3);
    
    // Add style value
    updatedDoc.setFont('helvetica', 'bold');
    updatedDoc.text(style.value.toString(), labelWidth + 25 + valueWidth, y + barHeight / 2 + 3);
  });
  
  // Draw the chart scale with proper spacing
  updatedDoc.setDrawColor(200, 200, 200);
  updatedDoc.setFontSize(8);
  
  for (let i = 0; i <= 10; i++) {
    const x = labelWidth + 20 + (i * chartWidth / 10);
    const scaleValue = i * maxValue / 10;
    
    // Draw scale line
    updatedDoc.line(x, barChartY - 5, x, barChartY + styleData.length * (barHeight + 5));
    
    // Add scale value
    updatedDoc.text(scaleValue.toString(), x - 3, barChartY - 8);
  }
  
  // Return the updated document and the Y position for the next section
  return { doc: updatedDoc, lastY: barChartY + styleData.length * (barHeight + 5) + 15 };
};

// Add learning style analysis with proper spacing
export const addLearningStyleAnalysis = (doc: jsPDF, startY: number) => {
  const { doc: updatedDoc, titleEndY } = addSectionTitle(doc, "Analysis of Learning Style", startY);
  
  // Add "Your Learning Style Analysis" subtitle with proper spacing
  updatedDoc.setFont('helvetica', 'bold');
  updatedDoc.setFontSize(14);
  updatedDoc.text("Your Learning Style Analysis", 20, titleEndY);
  
  // Add read/write learning style analysis with proper spacing
  updatedDoc.setFont('helvetica', 'bold');
  updatedDoc.setFontSize(12);
  updatedDoc.text("Read/Write learning style", 20, titleEndY + 15);
  
  // Add learning style traits with proper spacing
  updatedDoc.setFont('helvetica', 'normal');
  updatedDoc.setFontSize(10);
  
  const traits = [
    "Reading and writing learners prefer to take in the information displayed as words.",
    "These learners strongly prefer primarily text-based learning materials.",
    "Emphasis is based on text-based input and output, i.e. reading and writing in all its forms.",
    "People who prefer this modality love to work using PowerPoint, internet, lists, dictionaries and words."
  ];
  
  let currentY = titleEndY + 25;
  const textWidth = updatedDoc.internal.pageSize.width - 40; // 20px margin on each side
  
  for (const trait of traits) {
    const traitLines = updatedDoc.splitTextToSize(`• ${trait}`, textWidth);
    updatedDoc.text(traitLines, 20, currentY);
    currentY += traitLines.length * 5; // Approximation: 5 units per line
  }
  
  // Add learning improvement strategies with proper spacing
  updatedDoc.setFont('helvetica', 'bold');
  updatedDoc.setFontSize(12);
  updatedDoc.text("Learning improvement strategies", 20, currentY + 15);
  
  // Add improvement strategies with proper spacing
  updatedDoc.setFont('helvetica', 'normal');
  updatedDoc.setFontSize(10);
  
  const strategies = [
    "Re-write your notes after class.",
    "Use coloured pens and highlighters to focus on key ideas.",
    "Write notes to yourself in the margins.",
    "Write out key concepts and ideas.",
    "Compose short explanations for diagrams, charts and graphs.",
    "Write out instructions for each step of a procedure or math problem.",
    "Print out your notes for later review.",
    "Post note cards/post-its in visible places. (when doing dishes, on the bottom of the remote etc).",
    "Vocabulary mnemonics.",
    "Organize your notes/key concepts into a powerpoint presentation.",
    "Compare your notes with others.",
    "Repetitive writing.",
    "Hangman game."
  ];
  
  currentY += 25;
  
  for (const strategy of strategies) {
    const strategyLines = updatedDoc.splitTextToSize(`• ${strategy}`, textWidth);
    updatedDoc.text(strategyLines, 20, currentY);
    currentY += strategyLines.length * 5; // Approximation: 5 units per line
  }
  
  // Return the updated document and the Y position for the next section
  return { doc: updatedDoc, lastY: currentY + 15 };
};

// Add skills and abilities bar chart with proper spacing
export const addSkillBarChart = (doc: jsPDF, startY: number, skillsAndAbilities: any) => {
  const { doc: updatedDoc, titleEndY } = addSectionTitle(doc, "Skills and Abilities", startY);
  
  // Add "Your Skills and Abilities" subtitle with proper spacing
  updatedDoc.setFont('helvetica', 'bold');
  updatedDoc.setFontSize(14);
  updatedDoc.text("Your Skills and Abilities", 20, titleEndY);
  
  // Add description text with proper spacing
  const description = "The skills & abilities scores will help us to explore and identify different ways to reshape your career " +
    "direction. This simple graph shows how you have scored on each of these skills and abilities. The graph " +
    "on the top will show the average score of your overall skills and abilities.";
  
  updatedDoc.setFont('helvetica', 'normal');
  updatedDoc.setFontSize(10);
  const textWidth = updatedDoc.internal.pageSize.width - 40; // 20px margin on each side
  const textLines = updatedDoc.splitTextToSize(description, textWidth);
  
  updatedDoc.text(textLines, 20, titleEndY + 10);
  
  // Calculate the height of the text
  const textHeight = textLines.length * 5; // Approximation: 5 units per line
  
  // Get skills data from parameter or use default values
  const skills = skillsAndAbilities || {
    overall: 70,
    numerical: 80,
    logical: 60,
    verbal: 100,
    clerical: 50,
    spatial: 80,
    leadership: 60,
    social: 80,
    mechanical: 50
  };
  
  // Helper function to get skill level label with proper spacing
  const getSkillLevel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 65) return "Good";
    if (score >= 50) return "Average";
    return "Below Average";
  };
  
  // Draw overall skills with proper spacing
  let currentY = titleEndY + textHeight + 20;
  
  updatedDoc.setFont('helvetica', 'bold');
  updatedDoc.setFontSize(12);
  updatedDoc.text("Overall Skills and Abilities", 20, currentY);
  
  // Draw overall skills progress bar with proper spacing
  const barWidth = 150;
  const barHeight = 15;
  const barY = currentY + 10;
  
  // Draw background bar
  updatedDoc.setDrawColor(220, 220, 220);
  updatedDoc.setFillColor(240, 240, 240);
  updatedDoc.roundedRect(20, barY, barWidth, barHeight, 1, 1, 'F');
  
  // Draw value bar
  updatedDoc.setFillColor(100, 100, 255);
  updatedDoc.roundedRect(20, barY, (skills.overall / 100) * barWidth, barHeight, 1, 1, 'F');
  
  // Add "0" and "100" labels with proper spacing
  updatedDoc.setFontSize(8);
  updatedDoc.text("0", 20, barY + barHeight + 10);
  updatedDoc.text("100", 20 + barWidth, barY + barHeight + 10);
  
  // Add overall score and rating with proper spacing
  updatedDoc.setFontSize(14);
  updatedDoc.setTextColor(0, 0, 0);
  updatedDoc.text(`${skills.overall}%`, 190, barY + 10);
  
  updatedDoc.setFontSize(12);
  updatedDoc.text(getSkillLevel(skills.overall), 220, barY + 10);
  
  // Helper function to add a skill section with proper spacing
  const addSkillSection = (title: string, score: number, description: string[], y: number) => {
    // Add skill title with proper spacing
    updatedDoc.setFont('helvetica', 'bold');
    updatedDoc.setFontSize(12);
    updatedDoc.text(title, 20, y);
    
    // Draw skill progress bar with proper spacing
    const skillBarY = y + 10;
    
    // Draw background bar
    updatedDoc.setDrawColor(220, 220, 220);
    updatedDoc.setFillColor(240, 240, 240);
    updatedDoc.roundedRect(20, skillBarY, barWidth, barHeight, 1, 1, 'F');
    
    // Draw value bar
    updatedDoc.setFillColor(100, 100, 255);
    updatedDoc.roundedRect(20, skillBarY, (score / 100) * barWidth, barHeight, 1, 1, 'F');
    
    // Add "0" and "100" labels with proper spacing
    updatedDoc.setFontSize(8);
    updatedDoc.text("0", 20, skillBarY + barHeight + 10);
    updatedDoc.text("100", 20 + barWidth, skillBarY + barHeight + 10);
    
    // Add skill score and rating with proper spacing
    updatedDoc.setFontSize(14);
    updatedDoc.setTextColor(0, 0, 0);
    updatedDoc.text(`${score}%`, 190, skillBarY + 10);
    
    updatedDoc.setFontSize(12);
    updatedDoc.text(getSkillLevel(score), 220, skillBarY + 10);
    
    // Add skill description with proper spacing
    updatedDoc.setFont('helvetica', 'normal');
    updatedDoc.setFontSize(10);
    
    let descY = skillBarY + barHeight + 20;
    
    for (const line of description) {
      const descLines = updatedDoc.splitTextToSize(`• ${line}`, textWidth);
      updatedDoc.text(descLines, 20, descY);
      descY += descLines.length * 5; // Approximation: 5 units per line
    }
    
    return descY + 10; // Return the next Y position with padding
  };
  
  // Add each skill section with proper spacing
  currentY = barY + barHeight + 25;
  
  // Numerical Ability
  const numericalDesc = [
    "Your numerical skills are good.",
    "Numeracy involves an understanding of numerical data and numbers.",
    "Being competent and confident while working with numbers is a skill, that holds an advantage in a wide range of career options."
  ];
  
  currentY = addSkillSection("Numerical Ability", skills.numerical, numericalDesc, currentY);
  
  // Logical Ability
  const logicalDesc = [
    "Your logical skills are average.",
    "Logical thinking is very important for analytical profiles.",
    "Being able to understand and analyze data in different formats is considered an essential skill in many career options."
  ];
  
  currentY = addSkillSection("Logical Ability", skills.logical, logicalDesc, currentY);
  
  // Verbal Ability
  const verbalDesc = [
    "Your communication skills are excellent.",
    "Excellent verbal and written communication helps you to communicate your message effectively."
  ];
  
  currentY = addSkillSection("Verbal Ability", skills.verbal, verbalDesc, currentY);
  
  // Clerical and Organizing Skills
  const clericalDesc = [
    "Your organizing & planning skills are average.",
    "It includes general organizing, planning, time management, scheduling, coordinating resources and meeting deadlines."
  ];
  
  currentY = addSkillSection("Clerical and Organizing Skills", skills.clerical, clericalDesc, currentY);
  
  // Spatial & Visualization Ability
  const spatialDesc = [
    "Your visualization skills are good.",
    "This skill allows you to explore, analyze, and create visual solutions.",
    "It is important in many academic and professional career fields."
  ];
  
  currentY = addSkillSection("Spatial & Visualization Ability", skills.spatial, spatialDesc, currentY);
  
  // Leadership & Decision making skills
  const leadershipDesc = [
    "Your leadership & decision-making skills are average.",
    "It includes strategic thinking, planning, people management, change management, communication, and persuasion and influencing.",
    "These skills allow you to make decisions quickly, adapt to changing scenarios and respond to opportunities promptly."
  ];
  
  currentY = addSkillSection("Leadership & Decision making skills", skills.leadership, leadershipDesc, currentY);
  
  // Social & Co-operation Skills
  const socialDesc = [
    "Your social and cooperation skills are good.",
    "Social skills are important because they help you build, maintain and grow relationships with others.",
    "This skill is beneficial in the service industry and social causes."
  ];
  
  currentY = addSkillSection("Social & Co-operation Skills", skills.social, socialDesc, currentY);
  
  // Mechanical Abilities
  const mechanicalDesc = [
    "The score indicates that your mechanical ability is average.",
    "This section evaluates your basic mechanical understanding and mechanical knowledge.",
    "This skill is required for many career options like engineering and mechanical services."
  ];
  
  currentY = addSkillSection("Mechanical Abilities", skills.mechanical, mechanicalDesc, currentY);
  
  // Return the updated document and the Y position for the next section
  return { doc: updatedDoc, lastY: currentY };
};

// Add career clusters chart with proper spacing
export const addCareerClusters = (doc: jsPDF, startY: number) => {
  const { doc: updatedDoc, titleEndY } = addSectionTitle(doc, "Career Clusters", startY);
  
  // Add "Your Career Clusters" subtitle with proper spacing
  updatedDoc.setFont('helvetica', 'bold');
  updatedDoc.setFontSize(14);
  updatedDoc.text("Your Career Clusters", 20, titleEndY);
  
  // Add description text with proper spacing
  const description = "Career Clusters are groups of similar occupations and industries that require similar skills. It provides a " +
    "career road map for pursuing further education and career opportunities. They help you connect your " +
    "Education with your Career Planning. Career Cluster helps you narrow down your occupation choices " +
    "based on your assessment responses. Results show which Career Clusters would be best to explore. A " +
    "simple graph report shows how you have scored on each of the Career Clusters.";
  
  updatedDoc.setFont('helvetica', 'normal');
  updatedDoc.setFontSize(10);
  const textWidth = updatedDoc.internal.pageSize.width - 40; // 20px margin on each side
  const textLines = updatedDoc.splitTextToSize(description, textWidth);
  
  updatedDoc.text(textLines, 20, titleEndY + 10);
  
  // Calculate the height of the text
  const textHeight = textLines.length * 5; // Approximation: 5 units per line
  
  // Draw the career clusters chart with proper spacing
  const chartY = titleEndY + textHeight + 25;
  const chartWidth = updatedDoc.internal.pageSize.width - 140;
  const barHeight = 10;
  const labelWidth = 120;
  const maxValue = 120; // Maximum value for the chart scale
  
  // Career clusters data
  const clustersData = [
    { name: 'Information Technology', value: 98 },
    { name: 'Science, Maths and Engineering', value: 98 },
    { name: 'Manufacturing', value: 84 },
    { name: 'Accounts and Finance', value: 82 },
    { name: 'Logistics and Transportation', value: 81 },
    { name: 'Bio Science and Research', value: 78 },
    { name: 'Agriculture', value: 74 },
    { name: 'Health Science', value: 74 },
    { name: 'Government Services', value: 64 },
    { name: 'Public Safety and Security', value: 58 },
    { name: 'Architecture and Construction', value: 55 },
    { name: 'Business Management', value: 50 },
    { name: 'Legal Services', value: 50 },
    { name: 'Education and Training', value: 46 },
    { name: 'Hospitality and Tourism', value: 31.43 },
    { name: 'Marketing & Advertising', value: 25 },
    { name: 'Sports & Physical Activities', value: 24 },
    { name: 'Arts & Language Arts', value: 20 },
    { name: 'Human Service', value: 10 },
    { name: 'Media and Communication', value: 4 }
  ];
  
  // Draw each cluster bar with proper spacing
  clustersData.forEach((cluster, index) => {
    const y = chartY + index * (barHeight + 5);
    
    // Draw background bar
    updatedDoc.setDrawColor(220, 220, 220);
    updatedDoc.setFillColor(240, 240, 240);
    updatedDoc.roundedRect(labelWidth + 20, y, chartWidth, barHeight, 1, 1, 'F');
    
    // Draw value bar
    const valueWidth = (cluster.value / maxValue) * chartWidth;
    updatedDoc.setFillColor(100, 100, 255);
    updatedDoc.roundedRect(labelWidth + 20, y, valueWidth, barHeight, 1, 1, 'F');
    
    // Add cluster name
    updatedDoc.setFont('helvetica', 'normal');
    updatedDoc.setFontSize(8);
    updatedDoc.setTextColor(0, 0, 0);
    updatedDoc.text(cluster.name, 20, y + barHeight / 2 + 2);
    
    // Add cluster value
    updatedDoc.setFont('helvetica', 'bold');
    updatedDoc.setFontSize(8);
    updatedDoc.text(cluster.value.toString(), labelWidth + 25 + valueWidth, y + barHeight / 2 + 2);
  });
  
  // Draw the chart scale with proper spacing
  updatedDoc.setDrawColor(200, 200, 200);
  updatedDoc.setFontSize(8);
  
  for (let i = 0; i <= 10; i++) {
    const x = labelWidth + 20 + (i * chartWidth / 10);
    const scaleValue = i * maxValue / 10;
    
    // Draw scale line
    updatedDoc.line(x, chartY - 5, x, chartY + clustersData.length * (barHeight + 5));
    
    // Add scale value
    updatedDoc.text(scaleValue.toString(), x - 3, chartY - 8);
  }
  
  // Return the updated document and the Y position for the next section
  return { doc: updatedDoc, lastY: chartY + clustersData.length * (barHeight + 5) + 15 };
};

// Add selected career clusters with proper spacing
export const addSelectedCareerClusters = (doc: jsPDF, startY: number) => {
  const { doc: updatedDoc, titleEndY } = addSectionTitle(doc, "Selected Career Clusters", startY);
  
  // Add "Your Selected 4 Career Clusters" subtitle with proper spacing
  updatedDoc.setFont('helvetica', 'bold');
  updatedDoc.setFontSize(14);
  updatedDoc.text("Your Selected 4 Career Clusters", 20, titleEndY);
  
  // Define selected clusters with proper spacing
  const selectedClusters = [
    {
      name: "Information Technology",
      number: 1,
      description: [
        "Information technology professionals work with Computer hardware, software or network systems.",
        "You might design new computer equipment or work on a new computer game.",
        "Some professionals provide support and manage software or hardware.",
        "You might Write, update, and maintain computer programs or software packages"
      ]
    },
    {
      name: "Science, Maths and Engineering",
      number: 2,
      description: [
        "Science, math and engineering, professionals do scientific research in laboratories or the field.",
        "You will plan or design products and systems.",
        "You will do research and read blueprints.",
        "You might support scientists, mathematicians, or engineers in their work."
      ]
    },
    {
      name: "Manufacturing",
      number: 3,
      description: [
        "Manufacturing professionals work with products and equipment.",
        "You might design a new product, decide how the product will be made, or make the product.",
        "You might work on cars, computers, appliances, airplanes, or electronic devices.",
        "Other manufacturing workers install or repair products."
      ]
    },
    {
      name: "Accounts and Finance",
      number: 4,
      description: [
        "Finance and Accounts professionals keep track of money.",
        "You might work in financial planning, banking, or insurance.",
        "You could maintain financial records or give advice to business executives on how to operate their business."
      ]
    }
  ];
  
  // Current Y position for the first selected cluster
  let currentY = titleEndY + 15;
  
  // Helper function to add a selected cluster with proper spacing
  const addSelectedCluster = (cluster: any, y: number) => {
    // Add cluster number with proper spacing
    updatedDoc.setFont('helvetica', 'bold');
    updatedDoc.setFontSize(12);
    updatedDoc.text(cluster.name, 20, y);
    
    // Add number in a circle with proper spacing
    const circleX = updatedDoc.internal.pageSize.width - 30;
    const circleY = y - 5;
    const circleRadius = 8;
    
    updatedDoc.setFillColor(100, 100, 255);
    updatedDoc.circle(circleX, circleY, circleRadius, 'F');
    
    updatedDoc.setFont('helvetica', 'bold');
    updatedDoc.setFontSize(10);
    updatedDoc.setTextColor(255, 255, 255);
    updatedDoc.text(cluster.number.toString(), circleX - 2, circleY + 3);
    
    // Add cluster description with proper spacing
    updatedDoc.setFont('helvetica', 'normal');
    updatedDoc.setFontSize(10);
    updatedDoc.setTextColor(0, 0, 0);
    
    let descY = y + 10;
    const textWidth = updatedDoc.internal.pageSize.width - 40; // 20px margin on each side
    
    for (const line of cluster.description) {
      const descLines = updatedDoc.splitTextToSize(`• ${line}`, textWidth);
      updatedDoc.text(descLines, 20, descY);
      descY += descLines.length * 5; // Approximation: 5 units per line
    }
    
    return descY + 10; // Return the next Y position with padding
  };
  
  // Add each selected cluster with proper spacing
  for (const cluster of selectedClusters) {
    currentY = addSelectedCluster(cluster, currentY);
  }
  
  // Return the updated document and the Y position for the next section
  return { doc: updatedDoc, lastY: currentY };
};

// Add career paths with proper spacing
export const addCareerPaths = (doc: jsPDF, startY: number) => {
  const { doc: updatedDoc, titleEndY } = addSectionTitle(doc, "Career Path", startY);
  
  // Add "Your Career Paths" subtitle with proper spacing
  updatedDoc.setFont('helvetica', 'bold');
  updatedDoc.setFontSize(14);
  updatedDoc.text("Your Career Paths", 20, titleEndY);
  
  // Add "Recommendations for you" subtitle with proper spacing
  updatedDoc.setFont('helvetica', 'bold');
  updatedDoc.setFontSize(12);
  updatedDoc.text("Recommendations for you", 20, titleEndY + 15);
  
  // Define table headers with proper spacing
  const tableHeaders = ["Career Paths", "Psy. Analysis", "Skill and Abilities", "Comment"];
  const columnWidths = [0.40, 0.20, 0.20, 0.20]; // Proportion of page width
  const pageWidth = updatedDoc.internal.pageSize.width - 40; // 20px margin on each side
  const tableX = 20;
  let tableY = titleEndY + 30;
  const rowHeight = 15;
  
  // Calculate actual column widths with proper spacing
  const actualColumnWidths = columnWidths.map(width => width * pageWidth);
  
  // Draw table header with proper spacing
  updatedDoc.setFillColor(240, 240, 240);
  updatedDoc.rect(tableX, tableY, pageWidth, rowHeight, 'F');
  
  updatedDoc.setFont('helvetica', 'bold');
  updatedDoc.setFontSize(10);
  updatedDoc.setTextColor(0, 0, 0);
  
  let headerX = tableX + 5;
  
  for (let i = 0; i < tableHeaders.length; i++) {
    updatedDoc.text(tableHeaders[i], headerX, tableY + rowHeight - 4);
    headerX += actualColumnWidths[i];
  }
  
  // Draw table rows with proper spacing (sample data)
  const careerPaths = [
    {
      path: "Biochemistry - Bio Science and Research\nBiochemist, Bio technologist, Clinical Scientist",
      psyAnalysis: "Very High:100",
      skillAbilities: "High:70",
      comment: "Top Choice"
    },
    {
      path: "Genetics - Bio Science and Research\nGenetics Professor, Genetic Research Associate",
      psyAnalysis: "Very High:100",
      skillAbilities: "High:73",
      comment: "Top Choice"
    },
    {
      path: "Commerce with Information Technology - Accounts and Finance\nSoftware engineer,Coder, Programmer",
      psyAnalysis: "Very High:100",
      skillAbilities: "High:63",
      comment: "Top Choice"
    },
    // ... more career paths as needed
  ];
  
  // Draw each table row with proper spacing
  updatedDoc.setFont('helvetica', 'normal');
  tableY += rowHeight;
  
  careerPaths.forEach((career, index) => {
    // Draw row background with alternating colors
    if (index % 2 === 0) {
      updatedDoc.setFillColor(250, 250, 250);
      updatedDoc.rect(tableX, tableY, pageWidth, rowHeight * 2, 'F');
    }
    
    // Draw row border
    updatedDoc.setDrawColor(220, 220, 220);
    updatedDoc.rect(tableX, tableY, pageWidth, rowHeight * 2);
    
    // Draw column borders
    let colX = tableX;
    for (let i = 0; i < columnWidths.length - 1; i++) {
      colX += actualColumnWidths[i];
      updatedDoc.line(colX, tableY, colX, tableY + rowHeight * 2);
    }
    
    // Add career path with proper spacing
    let cellX = tableX + 5;
    const pathLines = updatedDoc.splitTextToSize(career.path, actualColumnWidths[0] - 10);
    updatedDoc.text(pathLines, cellX, tableY + 6);
    
    // Add psychology analysis with proper spacing
    cellX += actualColumnWidths[0];
    updatedDoc.text(career.psyAnalysis, cellX, tableY + rowHeight);
    
    // Add skill abilities with proper spacing
    cellX += actualColumnWidths[1];
    updatedDoc.text(career.skillAbilities, cellX, tableY + rowHeight);
    
    // Add comment with proper spacing
    cellX += actualColumnWidths[2];
    
    updatedDoc.setFont('helvetica', 'bold');
    updatedDoc.text(career.comment, cellX, tableY + rowHeight);
    updatedDoc.setFont('helvetica', 'normal');
    
    // Update Y position for the next row
    tableY += rowHeight * 2;
    
    // Add row number with proper spacing
    updatedDoc.setFont('helvetica', 'bold');
    updatedDoc.text((index + 1).toString(), tableX - 15, tableY - rowHeight);
    updatedDoc.setFont('helvetica', 'normal');
  });
  
  // Return the updated document and the Y position for the next section
  return { doc: updatedDoc, lastY: tableY + 15 };
};

// Add summary sheet with proper spacing
export const addSummarySheet = (doc: jsPDF, startY: number) => {
  const { doc: updatedDoc, titleEndY } = addSectionTitle(doc, "Summary Sheet", startY);
  
  // Add summary text with proper spacing
  updatedDoc.setFont('helvetica', 'normal');
  updatedDoc.setFontSize(10);
  updatedDoc.text("Our career assessment is based on the concept of correlation theory and various psychometric and statistical models.", 20, titleEndY + 10);
  
  // Define summary items with proper spacing
  const summaryItems = [
    {
      label: "Career Personality",
      value: "Introvert + Sensing + Thinking + Judging"
    },
    {
      label: "Career Interest",
      value: "Investigative + Realistic + Conventional"
    },
    {
      label: "Career Motivator",
      value: "Independence + Social Service + Continuous Learning"
    },
    {
      label: "Learning Style",
      value: "Read & Write Learning"
    },
    {
      label: "Skills & Ablities",
      value: "Numerical Ability[80%] +Logical Ability[60%] +Verbal Ability[100%]\n" +
        "Clerical and Organizing Skills[50%] +Spatial & Visualization Ability[80%]\n" +
        "+Leadership & Decision making skills[60%]\n" +
        "Social & Co-operation Skills[80%] +Mechanical Abilities[50%] +"
    },
    {
      label: "Selected Clusters",
      value: "Accounts and Finance+Information Technology+Science, Maths and Engineering+Manufacturing"
    }
  ];
  
  // Draw summary table with proper spacing
  const tableX = 20;
  let tableY = titleEndY + 25;
  const rowHeight = 20;
  const pageWidth = updatedDoc.internal.pageSize.width - 40; // 20px margin on each side
  const labelWidth = 120;
  
  // Draw each summary item with proper spacing
  updatedDoc.setDrawColor(220, 220, 220);
  
  summaryItems.forEach((item, index) => {
    // Draw row background with alternating colors
    if (index % 2 === 0) {
      updatedDoc.setFillColor(250, 250, 250);
    } else {
      updatedDoc.setFillColor(240, 240, 240);
    }
    
    // Adjust row height based on content
    const valueLines = updatedDoc.splitTextToSize(item.value, pageWidth - labelWidth - 10);
    const itemRowHeight = Math.max(rowHeight, valueLines.length * 12); // Approximate line height
    
    // Draw row rectangle
    updatedDoc.rect(tableX, tableY, pageWidth, itemRowHeight, 'F');
    updatedDoc.rect(tableX, tableY, pageWidth, itemRowHeight);
    
    // Draw column divider
    updatedDoc.line(tableX + labelWidth, tableY, tableX + labelWidth, tableY + itemRowHeight);
    
    // Add label with proper spacing
    updatedDoc.setFont('helvetica', 'bold');
    updatedDoc.setFontSize(10);
    updatedDoc.text(item.label, tableX + 5, tableY + itemRowHeight / 2 + 3);
    
    // Add value with proper spacing
    updatedDoc.setFont('helvetica', 'normal');
    updatedDoc.text(valueLines, tableX + labelWidth + 5, tableY + 10);
    
    // Update Y position for the next row
    tableY += itemRowHeight;
  });
  
  // Return the updated document and the Y position for the next section
  return { doc: updatedDoc, lastY: tableY + 15 };
};

// Export all functions
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
