import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { safeRoundedRect, getYPosition, addNewPage, getCareerRecommendationsForClass } from '@/utils/pdfUtils';

// Define types for user info and assessment data
interface UserInfo {
  name: string;
  email: string;
  phone: string;
  age: string;
  location: string;
  school: string;
  class: string;
}

// Main function to generate PDF report
export const generatePDF = async (
  assessmentId: string,
  userInfo: UserInfo,
  scores: any,
  responses: Record<string, any>,
  strengthAreas: string[],
  developmentAreas: string[],
  isJuniorAssessment: boolean = false,
  enhancedContent: any = null
) => {
  try {
    // Create new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Add fonts
    doc.setFont('helvetica', 'normal');

    // Define colors
    const primaryColor = '#4f46e5'; // indigo-600
    const secondaryColor = '#6366f1'; // indigo-500
    const textColor = '#1f2937'; // gray-800
    const lightGray = '#f3f4f6'; // gray-100

    // Add header
    let y = 20;
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, 210, 40, 'F');
    
    // Add logo or title
    doc.setTextColor('#ffffff');
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Career Assessment Report', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });

    // Add user information section
    y = 50;
    doc.setTextColor(textColor);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Student Information', 20, y);
    
    y += 10;
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
    
    y += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    // Create a table for user info
    const userInfoData = [
      ['Name', userInfo.name || 'N/A'],
      ['Email', userInfo.email || 'N/A'],
      ['Phone', userInfo.phone || 'N/A'],
      ['School', userInfo.school || 'N/A'],
      ['Class', userInfo.class || 'N/A'],
    ];
    
    (doc as any).autoTable({
      startY: y,
      head: [],
      body: userInfoData,
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: 4,
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 40 },
        1: { cellWidth: 130 },
      },
      margin: { left: 20 },
    });
    
    y = (doc as any).lastAutoTable.finalY + 10;

    // Add executive summary section
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Executive Summary', 20, y);
    
    y += 10;
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
    
    y += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Use AI-enhanced content if available, otherwise use default
    let summaryText = '';
    if (enhancedContent && enhancedContent.executiveSummary) {
      summaryText = enhancedContent.executiveSummary;
    } else {
      // Default summary text based on assessment type
      if (isJuniorAssessment) {
        summaryText = `This report provides an overview of ${userInfo.name}'s career assessment results for students in classes 8-10. The assessment evaluates various skills and interests to help identify potential career paths suitable for the student's age and educational level. The results should be used as a starting point for career exploration and academic planning.`;
      } else {
        summaryText = `This comprehensive report analyzes ${userInfo.name}'s aptitudes, interests, and personality traits to identify suitable career paths. The assessment evaluates cognitive abilities, work preferences, and personal characteristics to provide tailored recommendations for higher education and career planning.`;
      }
    }
    
    // Split text into lines to fit the page width
    const splitSummary = doc.splitTextToSize(summaryText, 170);
    doc.text(splitSummary, 20, y);
    
    y += splitSummary.length * 5 + 10;

    // Add assessment scores section
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Assessment Scores', 20, y);
    
    y += 10;
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
    
    y += 10;

    // Check if we need to add a new page
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    // Create score data for the table
    const scoreData = [];
    
    // Add appropriate scores based on assessment type
    if (isJuniorAssessment) {
      // Junior assessment scores (simplified for classes 8-10)
      scoreData.push(['Verbal Skills', scores?.verbal_score || 'N/A', getScoreDescription(scores?.verbal_score, true)]);
      scoreData.push(['Numerical Skills', scores?.numerical_score || 'N/A', getScoreDescription(scores?.numerical_score, true)]);
      scoreData.push(['Logical Reasoning', scores?.logical_score || 'N/A', getScoreDescription(scores?.logical_score, true)]);
      scoreData.push(['Creative Thinking', scores?.spatial_score || 'N/A', getScoreDescription(scores?.spatial_score, true)]);
      scoreData.push(['Social Skills', scores?.social_score || 'N/A', getScoreDescription(scores?.social_score, true)]);
    } else {
      // Senior assessment scores (comprehensive for classes 11-12)
      scoreData.push(['Verbal Aptitude', scores?.verbal_score || 'N/A', getScoreDescription(scores?.verbal_score)]);
      scoreData.push(['Numerical Aptitude', scores?.numerical_score || 'N/A', getScoreDescription(scores?.numerical_score)]);
      scoreData.push(['Logical Reasoning', scores?.logical_score || 'N/A', getScoreDescription(scores?.logical_score)]);
      scoreData.push(['Spatial Reasoning', scores?.spatial_score || 'N/A', getScoreDescription(scores?.spatial_score)]);
      scoreData.push(['Mechanical Reasoning', scores?.mechanical_score || 'N/A', getScoreDescription(scores?.mechanical_score)]);
      scoreData.push(['Clerical Speed & Accuracy', scores?.clerical_score || 'N/A', getScoreDescription(scores?.clerical_score)]);
      scoreData.push(['Leadership Potential', scores?.leadership_score || 'N/A', getScoreDescription(scores?.leadership_score)]);
      scoreData.push(['Social Intelligence', scores?.social_score || 'N/A', getScoreDescription(scores?.social_score)]);
      scoreData.push(['Overall Score', scores?.overall_score || 'N/A', getScoreDescription(scores?.overall_score)]);
    }
    
    // Add scores table
    (doc as any).autoTable({
      startY: y,
      head: [['Skill Area', 'Score', 'Description']],
      body: scoreData,
      theme: 'striped',
      headStyles: {
        fillColor: primaryColor,
        textColor: '#ffffff',
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 10,
        cellPadding: 4,
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 50 },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 100 },
      },
      margin: { left: 20 },
    });
    
    y = (doc as any).lastAutoTable.finalY + 10;

    // Add strengths and development areas
    if (y > 230) {
      doc.addPage();
      y = 20;
    }
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Strengths & Development Areas', 20, y);
    
    y += 10;
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
    
    y += 15;
    
    // Strengths section
    doc.setFillColor(secondaryColor);
    safeRoundedRect(doc, 20, y, 80, 10, 2, 'F');
    doc.setTextColor('#ffffff');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Key Strengths', 60, y + 6, { align: 'center' });
    
    y += 15;
    doc.setTextColor(textColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    strengthAreas.forEach((strength, index) => {
      doc.text(`• ${strength}`, 25, y + (index * 7));
    });
    
    // Development areas section (side by side with strengths)
    doc.setFillColor(secondaryColor);
    safeRoundedRect(doc, 110, y - 15, 80, 10, 2, 'F');
    doc.setTextColor('#ffffff');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Development Areas', 150, y - 9, { align: 'center' });
    
    doc.setTextColor(textColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    developmentAreas.forEach((area, index) => {
      doc.text(`• ${area}`, 115, y + (index * 7));
    });
    
    y += Math.max(strengthAreas.length, developmentAreas.length) * 7 + 15;

    // Add career recommendations section
    if (y > 230) {
      doc.addPage();
      y = 20;
    }
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor);
    doc.text('Career Recommendations', 20, y);
    
    y += 10;
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
    
    y += 15;
    
    // Get career recommendations based on class level
    const careerRecommendations = getCareerRecommendationsForClass(
      scores?.careerRecommendations || [],
      userInfo.class
    );
    
    if (careerRecommendations && careerRecommendations.length > 0) {
      // Display career recommendations
      careerRecommendations.slice(0, isJuniorAssessment ? 3 : 5).forEach((career, index) => {
        // Check if we need a new page
        if (y > 250) {
          doc.addPage();
          y = 20;
        }
        
        // Career title and match percentage
        doc.setFillColor(lightGray);
        safeRoundedRect(doc, 20, y, 170, 10, 2, 'F');
        
        doc.setTextColor(primaryColor);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${career.careerTitle || 'Career Option'}`, 25, y + 7);
        
        doc.setTextColor(secondaryColor);
        doc.text(`${career.suitabilityPercentage || '90'}% Match`, 170, y + 7, { align: 'right' });
        
        y += 15;
        
        // Career description
        doc.setTextColor(textColor);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        const description = career.careerDescription || 'No description available.';
        const splitDescription = doc.splitTextToSize(description, 170);
        doc.text(splitDescription, 25, y);
        
        y += splitDescription.length * 5 + 10;
        
        // Add education pathways for senior assessments
        if (!isJuniorAssessment && career.pathways && career.pathways.length > 0) {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.text('Education Pathways:', 25, y);
          
          y += 7;
          doc.setFont('helvetica', 'normal');
          
          career.pathways.forEach((pathway: string, i: number) => {
            doc.text(`• ${pathway}`, 30, y + (i * 5));
          });
          
          y += career.pathways.length * 5 + 10;
        }
        
        // Add space between careers
        y += 5;
      });
    } else {
      // No career recommendations available
      doc.setTextColor(textColor);
      doc.setFontSize(12);
      doc.text('No specific career recommendations available based on the assessment results.', 20, y);
      y += 10;
    }

    // Add next steps section
    if (y > 230) {
      doc.addPage();
      y = 20;
    }
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Next Steps', 20, y);
    
    y += 10;
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
    
    y += 15;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Different next steps based on assessment type
    let nextStepsText = '';
    if (isJuniorAssessment) {
      nextStepsText = `
1. Discuss these results with your parents and teachers.
2. Explore subjects related to your strengths in school.
3. Consider extracurricular activities that align with your interests.
4. Start learning about different career options that match your skills.
5. Focus on developing your weaker areas through practice and additional study.
      `;
    } else {
      nextStepsText = `
1. Research the recommended career paths in more detail.
2. Speak with a career counselor to discuss these results further.
3. Identify colleges and courses that align with your career interests.
4. Consider internships or volunteer opportunities in your areas of interest.
5. Develop a study plan that focuses on subjects relevant to your career goals.
6. Work on improving your development areas through targeted practice.
      `;
    }
    
    const splitNextSteps = doc.splitTextToSize(nextStepsText.trim(), 170);
    doc.text(splitNextSteps, 20, y);
    
    y += splitNextSteps.length * 5 + 15;

    // Add footer
    doc.setFontSize(8);
    doc.setTextColor('#6b7280'); // gray-500
    doc.text('This report is based on the assessment completed on ' + 
      new Date(responses?.completed_at || new Date()).toLocaleDateString(), 
      105, 285, { align: 'center' });
    doc.text('Assessment ID: ' + assessmentId, 105, 290, { align: 'center' });

    // Save the PDF
    doc.save(`Career_Assessment_Report_${userInfo.name.replace(/\s+/g, '_')}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Helper function to get score description based on score value
const getScoreDescription = (score: number, isJunior: boolean = false): string => {
  if (!score && score !== 0) return 'No data available';
  
  if (isJunior) {
    // Simplified descriptions for junior students
    if (score >= 80) return 'Excellent - This is a strong area for you';
    if (score >= 60) return 'Good - You have solid skills in this area';
    if (score >= 40) return 'Average - This is an area with room for growth';
    return 'Needs improvement - Focus on developing these skills';
  } else {
    // More detailed descriptions for senior students
    if (score >= 90) return 'Exceptional - You demonstrate outstanding ability in this area';
    if (score >= 80) return 'Excellent - This is a significant strength that can be leveraged in your career';
    if (score >= 70) return 'Very Good - You show strong competence in this area';
    if (score >= 60) return 'Good - You have solid skills that can be further developed';
    if (score >= 50) return 'Average - You demonstrate typical proficiency in this area';
    if (score >= 40) return 'Fair - This area has potential for improvement';
    if (score >= 30) return 'Below Average - Consider focusing on developing these skills';
    return 'Needs Significant Improvement - This is an area requiring dedicated attention';
  }
};
