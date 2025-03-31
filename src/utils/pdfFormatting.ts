
import { jsPDF } from 'jspdf';

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
    pdf.text(title, width / 2, 25 + gradHeight / 2, { align: 'center', baseline: 'middle' });
  } else {
    // Add title text without gradient
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.setTextColor(100, 149, 237); // Cornflower blue
    pdf.text(title, width / 2, 30, { align: 'center' });
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
    pdf.text(`${item.label}:`, centerX - 60, yPos);
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(item.value, centerX - 60, yPos + 10);
    pdf.setFont('helvetica', 'bold');
    
    yPos += 25;
  });
};

/**
 * Add a section title to the PDF
 */
export const addSectionTitle = (pdf: jsPDF, title: string, x: number, y: number) => {
  // Add section title with a line underneath
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.setTextColor(100, 149, 237); // Cornflower blue
  pdf.text(title, x, y);
  
  // Add underline
  pdf.setDrawColor(100, 149, 237);
  pdf.setLineWidth(0.5);
  pdf.line(x, y + 2, x + pdf.getTextWidth(title), y + 2);
};

/**
 * Add a skill bar chart to the PDF
 */
export const addSkillBarChart = (pdf: jsPDF, skills: { name: string, value: number }[], startY: number) => {
  const startX = 20;
  const barWidth = 150;
  const barHeight = 10;
  const spacing = 20;
  
  skills.forEach((skill, index) => {
    const y = startY + (index * spacing);
    
    // Skill name
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text(skill.name, startX, y);
    
    // Bar background
    pdf.setDrawColor(230, 230, 230);
    pdf.setFillColor(240, 240, 240);
    pdf.roundedRect(startX, y + 3, barWidth, barHeight, 2, 2, 'FD');
    
    // Bar filled portion
    const fillWidth = (skill.value / 100) * barWidth;
    
    // Determine color based on skill value
    if (skill.value >= 75) {
      pdf.setFillColor(76, 175, 80); // Green
    } else if (skill.value >= 60) {
      pdf.setFillColor(139, 195, 74); // Light green
    } else if (skill.value >= 45) {
      pdf.setFillColor(255, 193, 7); // Amber
    } else {
      pdf.setFillColor(244, 67, 54); // Red
    }
    
    pdf.roundedRect(startX, y + 3, fillWidth, barHeight, 2, 2, 'F');
    
    // Skill value
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(255, 255, 255);
    pdf.text(`${skill.value}%`, startX + 5, y + 9.5);
  });
};

/**
 * Add a personality type chart to the PDF
 */
export const addPersonalityTypeChart = (pdf: jsPDF, personalityData: {
  introvertExtrovert: { introvert: number, extrovert: number },
  sensingIntuitive: { sensing: number, intuitive: number },
  thinkingFeeling: { thinking: number, feeling: number },
  judgingPerceiving: { judging: number, perceiving: number }
}) => {
  // Starting position
  const startX = 20;
  const startY = 140;
  const barWidth = 170;
  const barHeight = 12;
  const spacing = 25;
  
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
};

/**
 * Add an interest bar chart to the PDF
 */
export const addInterestBarChart = (pdf: jsPDF, interests: { name: string, value: number }[], startY: number) => {
  // Create horizontal bar chart for interests
  const startX = 20;
  const maxBarWidth = 170;
  const barHeight = 8;
  const spacing = 12;
  
  // Sort interests by value (highest first)
  const sortedInterests = [...interests].sort((a, b) => b.value - a.value);
  
  // Draw bars
  sortedInterests.forEach((interest, index) => {
    const y = startY + (index * spacing);
    
    // Interest name
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(70, 70, 70);
    pdf.text(interest.name, startX, y);
    
    // Bar background
    pdf.setDrawColor(230, 230, 230);
    pdf.setFillColor(240, 240, 240);
    pdf.rect(startX, y + 2, maxBarWidth, barHeight, 'FD');
    
    // Bar filled portion
    const fillWidth = (interest.value / 100) * maxBarWidth;
    
    // Determine color based on position
    const colors = [
      [100, 149, 237], // Blue
      [76, 175, 80],   // Green
      [255, 152, 0],   // Orange
      [156, 39, 176],  // Purple
      [244, 67, 54]    // Red
    ];
    
    const colorIndex = index % colors.length;
    pdf.setFillColor(colors[colorIndex][0], colors[colorIndex][1], colors[colorIndex][2]);
    pdf.rect(startX, y + 2, fillWidth, barHeight, 'F');
    
    // Interest value
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${interest.value}`, startX + maxBarWidth + 5, y + 7);
  });
};

/**
 * Add a learning style pie chart to the PDF
 */
export const addLearningStylePieChart = (pdf: jsPDF, learningStyles: { name: string, value: number }[], startY: number) => {
  // Create a simple representation of a pie chart with color blocks
  const centerX = pdf.internal.pageSize.getWidth() / 2;
  const spacing = 35;
  
  // Sort learning styles by value (highest first)
  const sortedStyles = [...learningStyles].sort((a, b) => b.value - a.value);
  
  // Colors for learning styles
  const colors = [
    [100, 149, 237], // Blue
    [76, 175, 80],   // Green
    [255, 152, 0],   // Orange
    [156, 39, 176]   // Purple
  ];
  
  // Draw color blocks with percentages
  sortedStyles.forEach((style, index) => {
    const y = startY + (index * spacing);
    
    // Color block
    pdf.setFillColor(colors[index][0], colors[index][1], colors[index][2]);
    pdf.rect(centerX - 80, y, 20, 20, 'F');
    
    // Style name and percentage
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(style.name, centerX - 50, y + 10);
    
    // Percentage
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.text(`${style.value}%`, centerX + 60, y + 10);
  });
};

/**
 * Draw a progress bar
 */
export const drawProgressBar = (pdf: jsPDF, x: number, y: number, width: number, height: number, progress: number) => {
  // Draw background
  pdf.setDrawColor(230, 230, 230);
  pdf.setFillColor(240, 240, 240);
  pdf.roundedRect(x, y, width, height, 2, 2, 'FD');
  
  // Draw progress
  const progressWidth = progress * width;
  
  // Determine color based on progress
  if (progress >= 0.75) {
    pdf.setFillColor(76, 175, 80); // Green
  } else if (progress >= 0.6) {
    pdf.setFillColor(139, 195, 74); // Light green
  } else if (progress >= 0.45) {
    pdf.setFillColor(255, 193, 7); // Amber
  } else {
    pdf.setFillColor(244, 67, 54); // Red
  }
  
  pdf.roundedRect(x, y, progressWidth, height, 2, 2, 'F');
  
  // Add progress labels at the sides
  pdf.setFontSize(7);
  pdf.setTextColor(100, 100, 100);
  pdf.text('0', x, y + height + 7);
  pdf.text('100', x + width, y + height + 7, { align: 'right' });
};

/**
 * Add strengths and weaknesses to the PDF
 */
export const addStrengthsAndWeaknesses = (pdf: jsPDF, strengths: string[], weaknesses: string[], startY: number) => {
  const width = pdf.internal.pageSize.getWidth();
  const halfWidth = width / 2 - 25;
  
  // Strengths section
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(76, 175, 80); // Green
  pdf.text('Strengths', 20, startY);
  
  // Strengths background
  pdf.setDrawColor(230, 230, 230);
  pdf.setFillColor(240, 255, 240); // Light green
  pdf.roundedRect(20, startY + 5, halfWidth, 80, 3, 3, 'FD');
  
  // Strengths list
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  
  strengths.forEach((strength, index) => {
    pdf.text(`• ${strength}`, 25, startY + 20 + (index * 12));
  });
  
  // Weaknesses section
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(244, 67, 54); // Red
  pdf.text('Development Areas', width / 2 + 5, startY);
  
  // Weaknesses background
  pdf.setDrawColor(230, 230, 230);
  pdf.setFillColor(255, 240, 240); // Light red
  pdf.roundedRect(width / 2 + 5, startY + 5, halfWidth, 80, 3, 3, 'FD');
  
  // Weaknesses list
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  
  weaknesses.forEach((weakness, index) => {
    pdf.text(`• ${weakness}`, width / 2 + 10, startY + 20 + (index * 12));
  });
};

/**
 * Add career clusters to the PDF
 */
export const addCareerClusters = (pdf: jsPDF, clusters: { name: string, score: number }[], startY: number) => {
  // Create horizontal bar chart for career clusters
  const startX = 20;
  const maxBarWidth = 120;
  const barHeight = 5;
  const spacing = 9;
  
  // Sort clusters by score (highest first)
  const sortedClusters = [...clusters].sort((a, b) => b.score - a.score);
  
  // Draw bars
  sortedClusters.forEach((cluster, index) => {
    if (index >= 20) return; // Limit to top 20 clusters
    
    const y = startY + (index * spacing);
    
    // Cluster name
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(70, 70, 70);
    pdf.text(cluster.name, startX, y);
    
    // Bar background
    pdf.setDrawColor(230, 230, 230);
    pdf.setFillColor(240, 240, 240);
    pdf.rect(startX + 60, y - 3, maxBarWidth, barHeight, 'FD');
    
    // Bar filled portion
    const fillWidth = (cluster.score / 100) * maxBarWidth;
    
    // Determine color based on score
    if (cluster.score >= 75) {
      pdf.setFillColor(76, 175, 80); // Green
    } else if (cluster.score >= 60) {
      pdf.setFillColor(139, 195, 74); // Light green
    } else if (cluster.score >= 45) {
      pdf.setFillColor(255, 193, 7); // Amber
    } else {
      pdf.setFillColor(244, 67, 54); // Red
    }
    
    pdf.rect(startX + 60, y - 3, fillWidth, barHeight, 'F');
    
    // Cluster score
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${cluster.score}`, startX + maxBarWidth + 65, y);
  });
};

/**
 * Add career paths to the PDF
 */
export const addCareerPaths = (pdf: jsPDF, careerRecommendations: any[], startY: number, userName: string) => {
  const startX = 20;
  const width = pdf.internal.pageSize.getWidth() - 40;
  
  // Headers
  pdf.setFillColor(240, 240, 240);
  pdf.rect(startX, startY, width, 15, 'F');
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(70, 70, 70);
  
  pdf.text("Career Paths", startX + 5, startY + 10);
  pdf.text("Psy. Analysis", startX + width - 150, startY + 10);
  pdf.text("Skill and Abilities", startX + width - 80, startY + 10);
  pdf.text("Comment", startX + width - 20, startY + 10);
  
  // Top careers
  let itemsPerPage = 9;
  let currentPath = 1;
  let currentY = startY + 20;
  
  // Get the first 30 career recommendations from the provided list
  const topCareers = careerRecommendations.slice(0, 30);
  
  // Generate data for each career path
  topCareers.forEach((career, index) => {
    if (currentY > 250) {
      // Add footer to current page
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`3i Global`, 20, 285);
      pdf.text(`${userName}`, 100, 285, { align: 'center' });
      pdf.text(`Page ${pdf.getNumberOfPages() - 2}`, 190, 285);
      
      // Add new page
      pdf.addPage();
      addReportTitle(pdf, "Career Report", false);
      addSectionTitle(pdf, "Career Path", 20, 40);
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(70, 70, 70);
      pdf.text("Your Career Paths", 20, 55);
      
      // Subtitle
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(70, 70, 70);
      pdf.text("Recommendations for you", 20, 70);
      
      // Headers on new page
      pdf.setFillColor(240, 240, 240);
      pdf.rect(startX, 80, width, 15, 'F');
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(70, 70, 70);
      
      pdf.text("Career Paths", startX + 5, 90);
      pdf.text("Psy. Analysis", startX + width - 150, 90);
      pdf.text("Skill and Abilities", startX + width - 80, 90);
      pdf.text("Comment", startX + width - 20, 90);
      
      currentY = 105;
    }
    
    // Alternate row background
    if (index % 2 === 0) {
      pdf.setFillColor(250, 250, 250);
      pdf.rect(startX, currentY - 5, width, 15, 'F');
    }
    
    // Career data
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);
    
    // Career number and title
    pdf.text(`${currentPath}`, startX + 5, currentY);
    
    // Career title and description
    const careerTitle = career.careerTitle || 'Career Path';
    pdf.setFont('helvetica', 'bold');
    pdf.text(careerTitle, startX + 15, currentY);
    
    // If there are related jobs, add them
    if (career.keySkills && career.keySkills.length > 0) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.text(career.keySkills.slice(0, 3).join(", "), startX + 15, currentY + 5);
    }
    
    // Psychological analysis score - generate a high score
    const psychScore = career.suitabilityPercentage || 95;
    
    if (psychScore >= 90) {
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Very High:${psychScore}`, startX + width - 150, currentY);
    } else if (psychScore >= 75) {
      pdf.setFont('helvetica', 'bold');
      pdf.text(`High:${psychScore}`, startX + width - 150, currentY);
    } else {
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Medium:${psychScore}`, startX + width - 150, currentY);
    }
    
    // Skills and abilities score - slightly lower than psych score
    const skillScore = Math.max(60, psychScore - 10);
    
    if (skillScore >= 90) {
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Very High:${skillScore}`, startX + width - 80, currentY);
    } else if (skillScore >= 75) {
      pdf.setFont('helvetica', 'bold');
      pdf.text(`High:${skillScore}`, startX + width - 80, currentY);
    } else {
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Medium:${skillScore}`, startX + width - 80, currentY);
    }
    
    // Comment based on scores
    if (psychScore >= 85 && skillScore >= 60) {
      pdf.setFont('helvetica', 'bold');
      pdf.text("Top Choice", startX + width - 20, currentY);
    } else if (psychScore >= 70 || skillScore >= 70) {
      pdf.setFont('helvetica', 'normal');
      pdf.text("Good Choice", startX + width - 20, currentY);
    } else {
      pdf.setFont('helvetica', 'normal');
      pdf.text("Option", startX + width - 20, currentY);
    }
    
    currentY += 15;
    currentPath++;
  });
};
