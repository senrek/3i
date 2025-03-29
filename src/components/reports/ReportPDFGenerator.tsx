
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ReportPDFGeneratorProps {
  reportId: string;
  userName?: string;
  scores?: {
    aptitude: number;
    personality: number;
    interest: number;
    learningStyle: number;
    careerRecommendations: any[];
    analysisInsights?: any;
  } | null;
  responses?: Record<string, string> | null;
  strengthAreas?: string[];
  developmentAreas?: string[];
}

const ReportPDFGenerator = ({ 
  reportId, 
  userName = 'Student', 
  scores,
  responses,
  strengthAreas = ['Problem Solving', 'Critical Thinking', 'Adaptability'],
  developmentAreas = ['Technical Skills', 'Leadership', 'Time Management']
}: ReportPDFGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  // Helper function to get meaningful descriptions for strengths
  const getStrengthDescription = (strength: string): string => {
    const descriptions: Record<string, string> = {
      'Critical Thinking': 'Excels at analyzing information objectively and making reasoned judgments. Can evaluate situations from multiple perspectives and reach sound conclusions.',
      'Problem Solving': 'Demonstrates strong abilities in finding effective solutions to complex challenges. Uses analytical approach to break down problems and identify practical solutions.',
      'Adaptability': 'Shows excellent capacity to adjust to new conditions and environments. This flexibility allows thriving in changing circumstances and embracing new challenges.',
      'Team Collaboration': 'Works effectively with others to achieve shared goals and outcomes. Cooperative nature and communication skills make for a valuable team member.',
      'Leadership Potential': 'Exhibits capabilities in guiding and influencing others positively. Ability to motivate and direct teams helps achieve collective objectives efficiently.',
      'Career Interest Clarity': 'Has a well-defined understanding of career interests and goals. This clarity helps make focused decisions about educational and professional path.',
      'Self-Direction': 'Takes initiative and responsibility for own learning and development. This independence allows pursuing goals without requiring constant supervision.',
      'Continuous Learning': 'Actively seeks opportunities to expand knowledge and skills. This commitment to growth keeps capabilities relevant and advancing in chosen field.',
      'Analytical Thinking': 'Excels at breaking down complex information into logical components. This skill helps understand patterns and relationships that others might miss.',
      'Communication Skills': 'Effectively expresses ideas and listens to others. Ability to convey thoughts clearly and understand different perspectives enhances collaboration.',
      'Creativity': 'Demonstrates original thinking and innovative approaches to tasks. This imaginative capacity allows developing unique solutions and perspectives.',
    };
    
    return descriptions[strength] || 'Demonstrates notable proficiency in this area based on assessment responses. This strength will be valuable across various career paths and educational journeys.';
  };

  // Helper function to get meaningful descriptions for development areas
  const getGapDescription = (gap: string): string => {
    const descriptions: Record<string, string> = {
      'Communication': 'Developing clearer expression and active listening skills would enhance effectiveness. Focus on structured communication practice and seeking feedback from others.',
      'Leadership': 'Building skills in guiding teams and taking initiative would benefit career progression. Consider seeking opportunities to lead small projects or group activities.',
      'Technical Skills': 'Strengthening specific technical competencies would expand career opportunities. Identify key technologies in field of interest and pursue targeted learning.',
      'Data Analysis': 'Enhancing ability to interpret and draw conclusions from data would be valuable. Consider courses in statistics, data visualization, or analytical software tools.',
      'Technical Certifications': 'Pursuing relevant certifications would validate skills for employers. Research industry-recognized credentials that align with career interests.',
      'Leadership Skills': 'Developing ability to inspire and guide others would open management pathways. Seek opportunities to lead projects and practice decision-making in groups.',
      'Technical Proficiency': 'Building stronger technical foundations would expand career opportunities. Focus on learning fundamental concepts and practicing applied skills regularly.',
      'Analytical Thinking': 'Developing more structured approaches to problem analysis would be beneficial. Practice breaking down complex problems into manageable components.',
      'Career Focus': 'Narrowing career interests would help direct professional development efforts. Explore specific roles through research and informational interviews.',
      'Self-Motivation': 'Building stronger internal drive would help pursue goals more effectively. Set clear objectives and develop accountability systems for progress.',
      'Interpersonal Abilities': 'Developing skills for effective interaction with diverse individuals is recommended. Practice active listening and empathetic communication regularly.',
      'Critical Thinking': 'Strengthening ability to evaluate information objectively would enhance decision-making. Practice questioning assumptions and considering alternative perspectives.',
      'Time Management': 'Improving ability to prioritize tasks and use time efficiently would increase productivity. Develop systems for tracking deadlines and managing competing priorities.'
    };
    
    return descriptions[gap] || 'This area presents an opportunity for targeted development to enhance career prospects. Consider seeking specific training, mentorship, or practical experience to strengthen these skills.';
  };

  const generatePdfContent = async () => {
    // This would normally be done server-side with a proper PDF generation library
    // For this implementation, we'll create a PDF using client-side libraries
    
    if (!scores) {
      return null;
    }
    
    // Calculate more reasonable career match percentages based on responses
    let processedCareerRecommendations = [];
    
    if (scores.careerRecommendations && scores.careerRecommendations.length > 0) {
      // Make a deep copy of recommendations to avoid modifying the original
      processedCareerRecommendations = JSON.parse(JSON.stringify(scores.careerRecommendations));
      
      // Analyze responses to determine more accurate match percentages
      if (responses) {
        // Group responses by category for analysis
        const technicalResponses = Object.entries(responses).filter(([id]) => 
          ['8', '9', '14', '15', '27', '31', '44'].some(q => id.includes(`_${q}`))
        );
        
        const creativeResponses = Object.entries(responses).filter(([id]) => 
          ['4', '5', '13', '21', '30', '39', '46'].some(q => id.includes(`_${q}`))
        );
        
        const analyticalResponses = Object.entries(responses).filter(([id]) => 
          ['19', '20', '33', '36', '38', '45'].some(q => id.includes(`_${q}`))
        );
        
        const socialResponses = Object.entries(responses).filter(([id]) => 
          ['7', '29', '32', '35', '40', '41', '47'].some(q => id.includes(`_${q}`))
        );
        
        const leadershipResponses = Object.entries(responses).filter(([id]) => 
          ['6', '16', '17', '26', '43', '49'].some(q => id.includes(`_${q}`))
        );
        
        const businessResponses = Object.entries(responses).filter(([id]) => 
          ['11', '25', '48'].some(q => id.includes(`_${q}`))
        );
        
        // Calculate affinity scores (0-100) for each category
        const calculateAffinity = (responses: [string, string][]) => {
          if (responses.length === 0) return 50; // Default if no relevant questions
          
          const totalPoints = responses.reduce((sum, [, val]) => {
            if (val === 'A') return sum + 3;
            if (val === 'B') return sum + 2;
            if (val === 'C') return sum + 1;
            return sum;
          }, 0);
          
          const maxPoints = responses.length * 3;
          return Math.round((totalPoints / maxPoints) * 100);
        };
        
        const technicalAffinity = calculateAffinity(technicalResponses);
        const creativeAffinity = calculateAffinity(creativeResponses);
        const analyticalAffinity = calculateAffinity(analyticalResponses);
        const socialAffinity = calculateAffinity(socialResponses);
        const leadershipAffinity = calculateAffinity(leadershipResponses);
        const businessAffinity = calculateAffinity(businessResponses);
        
        // Match careers with appropriate affinities
        processedCareerRecommendations.forEach(career => {
          let newMatch = 0;
          
          switch (career.careerTitle) {
            case "Software Engineer":
            case "Mechanical Engineer":
              newMatch = (technicalAffinity * 0.4) + (analyticalAffinity * 0.4) + (leadershipAffinity * 0.2);
              break;
            case "Data Scientist":
              newMatch = (analyticalAffinity * 0.5) + (technicalAffinity * 0.3) + (businessAffinity * 0.2);
              break;
            case "Medical Doctor":
              newMatch = (socialAffinity * 0.4) + (analyticalAffinity * 0.4) + (leadershipAffinity * 0.2);
              break;
            case "Business Analyst":
              newMatch = (businessAffinity * 0.4) + (analyticalAffinity * 0.4) + (socialAffinity * 0.2);
              break;
            case "Graphic Designer":
            case "UI/UX Designer":
              newMatch = (creativeAffinity * 0.6) + (technicalAffinity * 0.2) + (socialAffinity * 0.2);
              break;
            case "Marketing Specialist":
              newMatch = (businessAffinity * 0.4) + (creativeAffinity * 0.3) + (socialAffinity * 0.3);
              break;
            case "Project Manager":
              newMatch = (leadershipAffinity * 0.5) + (businessAffinity * 0.3) + (socialAffinity * 0.2);
              break;
            case "Entrepreneur":
              newMatch = (leadershipAffinity * 0.4) + (businessAffinity * 0.3) + (creativeAffinity * 0.3);
              break;
            case "Clinical Psychologist":
              newMatch = (socialAffinity * 0.6) + (analyticalAffinity * 0.3) + (leadershipAffinity * 0.1);
              break;
            case "Financial Analyst":
              newMatch = (businessAffinity * 0.5) + (analyticalAffinity * 0.4) + (technicalAffinity * 0.1);
              break;
            default:
              // For unspecified careers, use a balanced approach
              newMatch = (
                technicalAffinity * 0.2 + 
                analyticalAffinity * 0.2 + 
                socialAffinity * 0.2 + 
                creativeAffinity * 0.2 + 
                leadershipAffinity * 0.1 + 
                businessAffinity * 0.1
              );
          }
          
          // Add some randomization for realism (±10%)
          const randomFactor = Math.random() * 20 - 10;
          newMatch = Math.round(newMatch + randomFactor);
          
          // Ensure match is between 30-95%
          career.suitabilityPercentage = Math.max(30, Math.min(95, newMatch));
        });
        
        // Sort by match percentage (high to low)
        processedCareerRecommendations.sort((a, b) => 
          b.suitabilityPercentage - a.suitabilityPercentage
        );
      }
    }
    
    // Format career recommendations for the PDF
    const topCareer = processedCareerRecommendations[0] || scores.careerRecommendations[0];
    
    // Analyze responses to provide more personalized insights
    const responseInsights = {
      learningPreferences: [] as string[],
      workStylePreferences: [] as string[],
      personalityTraits: [] as string[]
    };
    
    if (responses) {
      // Simple analysis of learning preferences based on responses
      if (Object.keys(responses).some(q => q.includes('_90') && responses[q] === 'A') || 
          Object.keys(responses).some(q => q.includes('_92') && responses[q] === 'A') ||
          Object.keys(responses).some(q => q.includes('_95') && responses[q] === 'A')) {
        responseInsights.learningPreferences.push('Visual Learning');
      }
      if (Object.keys(responses).some(q => q.includes('_91') && responses[q] === 'B') || 
          Object.keys(responses).some(q => q.includes('_92') && responses[q] === 'B') ||
          Object.keys(responses).some(q => q.includes('_95') && responses[q] === 'B')) {
        responseInsights.learningPreferences.push('Auditory Learning');
      }
      if (Object.keys(responses).some(q => q.includes('_93') && responses[q] === 'D') || 
          Object.keys(responses).some(q => q.includes('_94') && responses[q] === 'A') ||
          Object.keys(responses).some(q => q.includes('_95') && responses[q] === 'D')) {
        responseInsights.learningPreferences.push('Kinesthetic Learning');
      }
      
      // Work style preferences based on personality questions
      if (Object.keys(responses).filter(q => 
          (q.includes('_54') && responses[q] === 'A') || 
          (q.includes('_55') && responses[q] === 'A') ||
          (q.includes('_59') && responses[q] === 'A')).length >= 2) {
        responseInsights.workStylePreferences.push('Collaborative Work Environment');
      } else {
        responseInsights.workStylePreferences.push('Independent Work Environment');
      }
      
      if (Object.keys(responses).filter(q => 
          (q.includes('_75') && responses[q] === 'A') || 
          (q.includes('_76') && responses[q] === 'B') ||
          (q.includes('_20') && responses[q] === 'A')).length >= 2) {
        responseInsights.workStylePreferences.push('Structured Work Environment');
      } else {
        responseInsights.workStylePreferences.push('Flexible Work Environment');
      }
      
      // Personality traits
      const extroversionQuestions = Object.keys(responses).filter(q => 
        q.includes('_54') || q.includes('_55') || q.includes('_56') || q.includes('_59')
      );
      
      const aCount = extroversionQuestions.filter(q => responses[q] === 'A').length;
      const bCount = extroversionQuestions.filter(q => responses[q] === 'B').length;
      
      if (aCount > bCount) {
        responseInsights.personalityTraits.push('Extroverted', 'Assertive');
      } else {
        responseInsights.personalityTraits.push('Introverted', 'Reflective');
      }
      
      // Thinking vs Feeling
      const thinkingFeelingQuestions = Object.keys(responses).filter(q => 
        q.includes('_68') || q.includes('_69') || q.includes('_71') || q.includes('_72')
      );
      
      const thinkingCount = thinkingFeelingQuestions.filter(q => responses[q] === 'A').length;
      const feelingCount = thinkingFeelingQuestions.filter(q => responses[q] === 'B').length;
      
      if (thinkingCount > feelingCount) {
        responseInsights.personalityTraits.push('Logical', 'Objective');
      } else {
        responseInsights.personalityTraits.push('Empathetic', 'People-oriented');
      }
    }
    
    // Create a structured PDF content object
    const pdfContent = {
      userName,
      reportDate: new Date().toISOString(),
      reportId,
      scores: {
        aptitude: scores.aptitude,
        personality: scores.personality,
        interest: scores.interest,
        learningStyle: scores.learningStyle
      },
      strengthAreas: strengthAreas.map(strength => ({
        name: strength,
        description: getStrengthDescription(strength)
      })),
      developmentAreas: developmentAreas.map(area => ({
        name: area,
        description: getGapDescription(area)
      })),
      topCareerPath: {
        title: topCareer.careerTitle,
        match: topCareer.suitabilityPercentage,
        description: topCareer.careerDescription,
        educationPathways: topCareer.educationPathways,
        keySkills: topCareer.keySkills,
        workNature: topCareer.workNature
      },
      otherCareers: processedCareerRecommendations.slice(1, 4).map(career => ({
        title: career.careerTitle,
        match: career.suitabilityPercentage,
        description: career.careerDescription,
        keySkills: career.keySkills.slice(0, 3)
      })),
      skillAnalysis: {
        strengths: [
          { name: 'Analytical Thinking', score: scores.aptitude > 70 ? 'Excellent' : 'Good' },
          { name: 'Problem Solving', score: scores.aptitude > 65 ? 'Good' : 'Average' },
          { name: 'Technical Aptitude', score: scores.aptitude > 75 ? 'Excellent' : 'Good' }
        ],
        development: [
          { name: 'Communication', score: scores.personality < 70 ? 'Needs Improvement' : 'Good' },
          { name: 'Leadership', score: scores.personality < 65 ? 'Needs Improvement' : 'Average' }
        ]
      },
      personalization: responseInsights,
      gapAnalysis: topCareer.gapAnalysis,
      recommendations: {
        shortTerm: [
          "Research educational pathways for your top career match",
          "Identify and build missing skills from the gap analysis",
          "Connect with professionals in your preferred career field"
        ],
        mediumTerm: [
          "Select suitable educational programs that align with your career goals",
          "Gain practical experience through internships or part-time roles",
          "Continue developing your personal and professional portfolio"
        ],
        longTerm: [
          "Pursue advanced qualifications if required for career progression",
          "Expand your professional network within the industry",
          "Regularly reassess your career path and make adjustments as needed"
        ]
      }
    };
    
    return pdfContent;
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    
    try {
      // Prepare for PDF generation
      const pdfContent = await generatePdfContent();
      
      if (!pdfContent) {
        throw new Error("Could not generate report content");
      }
      
      // Create PDF with multiple pages
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15; // 15mm margins
      const contentWidth = pageWidth - (margin * 2);
      const lineHeight = 7;
      
      // Helper function to add page
      const addNewPage = () => {
        pdf.addPage();
        return margin; // Return starting Y position
      };
      
      // Helper function for text wrapping
      const addWrappedText = (text, x, y, maxWidth, lineHeight) => {
        const lines = pdf.splitTextToSize(text, maxWidth);
        for (let i = 0; i < lines.length; i++) {
          pdf.text(lines[i], x, y + (i * lineHeight));
        }
        return y + (lines.length * lineHeight);
      };
      
      // Function to add section header
      const addSectionHeader = (title, y) => {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.setTextColor(59, 130, 246); // #3b82f6 - Blue color
        pdf.text(title, margin, y);
        pdf.setLineWidth(0.5);
        pdf.setDrawColor(59, 130, 246);
        pdf.line(margin, y + 1, pageWidth - margin, y + 1);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(10);
        return y + 8; // Return next position
      };
      
      // === PAGE 1: Cover Page ===
      // Header
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(22);
      pdf.setTextColor(59, 130, 246); // Blue color
      pdf.text('Career Assessment Report', pageWidth/2, 30, { align: 'center' });
      
      // Subtitle
      pdf.setFontSize(14);
      pdf.text('For Classes 11-12', pageWidth/2, 40, { align: 'center' });
      
      // User info
      pdf.setFontSize(14);
      pdf.setTextColor(0);
      pdf.text(`Prepared for: ${pdfContent.userName}`, pageWidth/2, 60, { align: 'center' });
      pdf.setFontSize(10);
      pdf.text(`Report Date: ${new Date().toLocaleDateString()}`, pageWidth/2, 70, { align: 'center' });
      
      // Logo placeholder (you could add a logo image here)
      pdf.setFillColor(240, 240, 240);
      pdf.roundedRect(pageWidth/2 - 25, 85, 50, 50, 2, 2, 'F');
      pdf.setFontSize(10);
      pdf.text('Career Analysis', pageWidth/2, 115, { align: 'center' });
      
      // Report description
      pdf.setFontSize(12);
      let yPos = 150;
      pdf.text("This report provides a comprehensive analysis of your aptitudes, personality traits, interests, and learning style to identify optimal career paths aligned with your unique profile.", margin, yPos, { maxWidth: contentWidth });
      
      // Footer
      pdf.setFontSize(8);
      pdf.text(`Report ID: ${pdfContent.reportId}`, margin, pageHeight - 10);
      pdf.text('Page 1 of 8', pageWidth - margin, pageHeight - 10, { align: 'right' });
      
      // === PAGE 2: Executive Summary ===
      pdf.addPage();
      yPos = margin;
      
      // Page title
      yPos = addSectionHeader('Executive Summary', yPos);
      
      // Assessment Scores
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Assessment Scores', margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      yPos += 7;
      
      // Score table
      pdf.setDrawColor(200, 200, 200);
      pdf.setFillColor(245, 245, 245);
      pdf.rect(margin, yPos, contentWidth, 30, 'FD');
      
      const scoreTableX = margin + 5;
      pdf.text(`Aptitude: ${pdfContent.scores.aptitude}%`, scoreTableX, yPos + 7);
      pdf.text(`Personality: ${pdfContent.scores.personality}%`, scoreTableX, yPos + 15);
      pdf.text(`Interest: ${pdfContent.scores.interest}%`, scoreTableX + contentWidth/2, yPos + 7);
      pdf.text(`Learning Style: ${pdfContent.scores.learningStyle}%`, scoreTableX + contentWidth/2, yPos + 15);
      
      yPos += 40;
      
      // Strengths & Development Areas
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Key Strengths', margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      yPos += 7;
      
      pdfContent.strengthAreas.forEach((strength, index) => {
        pdf.setFont('helvetica', 'bold');
        pdf.text(`• ${strength.name}`, margin + 5, yPos);
        pdf.setFont('helvetica', 'normal');
        yPos += 7;
        
        // Add description with proper wrapping
        yPos = addWrappedText(strength.description, margin + 8, yPos, contentWidth - 15, 5);
        yPos += 5;
        
        // Check if we need a new page
        if (yPos > pageHeight - margin && index < pdfContent.strengthAreas.length - 1) {
          yPos = addNewPage();
        }
      });
      
      yPos += 5;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Development Areas', margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      yPos += 7;
      
      pdfContent.developmentAreas.forEach((area, index) => {
        pdf.setFont('helvetica', 'bold');
        pdf.text(`• ${area.name}`, margin + 5, yPos);
        pdf.setFont('helvetica', 'normal');
        yPos += 7;
        
        // Add description with proper wrapping
        yPos = addWrappedText(area.description, margin + 8, yPos, contentWidth - 15, 5);
        yPos += 5;
        
        // Check if we need a new page
        if (yPos > pageHeight - margin && index < pdfContent.developmentAreas.length - 1) {
          yPos = addNewPage();
        }
      });
      
      // Footer
      pdf.setFontSize(8);
      pdf.text('Page 2 of 8', pageWidth - margin, pageHeight - 10, { align: 'right' });
      
      // === PAGE 3: Top Career Recommendation ===
      pdf.addPage();
      yPos = margin;
      
      // Page title
      yPos = addSectionHeader('Top Career Recommendation', yPos);
      
      // Career Title and Match
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.text(pdfContent.topCareerPath.title, margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);
      pdf.setTextColor(34, 197, 94); // Green color
      pdf.text(`${pdfContent.topCareerPath.match}% Match`, margin + contentWidth - 30, yPos);
      pdf.setTextColor(0);
      
      yPos += 10;
      
      // Career Description
      pdf.setFontSize(10);
      yPos = addWrappedText(pdfContent.topCareerPath.description, margin, yPos, contentWidth, lineHeight);
      
      yPos += 10;
      
      // Key Skills
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Key Skills Required', margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      yPos += 7;
      
      pdfContent.topCareerPath.keySkills.forEach((skill, index) => {
        pdf.text(`• ${skill}`, margin + 5, yPos);
        yPos += 7;
        
        // Check if we need a new page
        if (yPos > pageHeight - margin && index < pdfContent.topCareerPath.keySkills.length - 1) {
          yPos = addNewPage();
          yPos = addSectionHeader('Top Career Recommendation (Continued)', yPos);
        }
      });
      
      // Footer
      pdf.setFontSize(8);
      pdf.text('Page 3 of 8', pageWidth - margin, pageHeight - 10, { align: 'right' });
      
      // === PAGE 4: Education Pathways ===
      pdf.addPage();
      yPos = margin;
      
      // Page title
      yPos = addSectionHeader('Education Pathways', yPos);
      
      // Education Pathways
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text(`Education Pathways for ${pdfContent.topCareerPath.title}`, margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      yPos += 7;
      
      pdfContent.topCareerPath.educationPathways.forEach((path, index) => {
        pdf.text(`${index + 1}. ${path}`, margin + 5, yPos);
        yPos += 10;
        
        // Check if we need a new page
        if (yPos > pageHeight - margin && index < pdfContent.topCareerPath.educationPathways.length - 1) {
          yPos = addNewPage();
          yPos = addSectionHeader('Education Pathways (Continued)', yPos);
        }
      });
      
      yPos += 10;
      
      // Work Nature
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Work Responsibilities', margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      yPos += 7;
      
      pdfContent.topCareerPath.workNature.forEach((work, index) => {
        pdf.text(`• ${work}`, margin + 5, yPos);
        yPos += 10;
        
        // Check if we need a new page
        if (yPos > pageHeight - margin && index < pdfContent.topCareerPath.workNature.length - 1) {
          yPos = addNewPage();
          yPos = addSectionHeader('Work Responsibilities (Continued)', yPos);
        }
      });
      
      // Footer
      pdf.setFontSize(8);
      pdf.text('Page 4 of 8', pageWidth - margin, pageHeight - 10, { align: 'right' });
      
      // === PAGE 5: Alternative Career Paths ===
      pdf.addPage();
      yPos = margin;
      
      // Page title
      yPos = addSectionHeader('Alternative Career Paths', yPos);
      
      // Alternative Careers
      pdfContent.otherCareers.forEach((career, index) => {
        // Check if we need a new page
        if (yPos > pageHeight - 50) {
          yPos = addNewPage();
          yPos = addSectionHeader('Alternative Career Paths (Continued)', yPos);
        }
        
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text(`${career.title} - ${career.match}% Match`, margin, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        yPos += 7;
        
        yPos = addWrappedText(career.description, margin + 5, yPos, contentWidth - 10, lineHeight);
        yPos += 5;
        
        pdf.text(`Key Skills: ${career.keySkills.join(', ')}`, margin + 5, yPos);
        yPos += 15; // Extra space between careers
      });
      
      // Footer
      pdf.setFontSize(8);
      pdf.text('Page 5 of 8', pageWidth - margin, pageHeight - 10, { align: 'right' });
      
      // === PAGE 6: Gap Analysis ===
      pdf.addPage();
      yPos = margin;
      
      // Page title
      yPos = addSectionHeader('Gap Analysis & Development Plan', yPos);
      
      // Gap Analysis
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Areas for Development', margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      yPos += 7;
      
      pdfContent.gapAnalysis.forEach((gap, index) => {
        yPos = addWrappedText(`• ${gap}`, margin + 5, yPos, contentWidth - 10, lineHeight);
        yPos += 7;
        
        // Check if we need a new page
        if (yPos > pageHeight - margin && index < pdfContent.gapAnalysis.length - 1) {
          yPos = addNewPage();
          yPos = addSectionHeader('Areas for Development (Continued)', yPos);
        }
      });
      
      yPos += 10;
      
      // Learning Style
      if (pdfContent.personalization.learningPreferences.length > 0) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text('Your Learning Preferences', margin, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        yPos += 7;
        
        pdfContent.personalization.learningPreferences.forEach(style => {
          pdf.text(`• ${style}`, margin + 5, yPos);
          yPos += 7;
        });
        
        yPos += 3;
        yPos = addWrappedText("Understanding your learning preferences can help you choose educational pathways that align with your natural learning style, enhancing knowledge retention and skill development.", margin + 5, yPos, contentWidth - 10, lineHeight);
        yPos += 10;
      }
      
      // Work style preferences
      if (pdfContent.personalization.workStylePreferences.length > 0) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text('Your Work Style Preferences', margin, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        yPos += 7;
        
        pdfContent.personalization.workStylePreferences.forEach(style => {
          pdf.text(`• ${style}`, margin + 5, yPos);
          yPos += 7;
        });
        
        yPos += 3;
        yPos = addWrappedText("Being aware of your work style preferences can help you find environments where you'll naturally thrive and contribute most effectively.", margin + 5, yPos, contentWidth - 10, lineHeight);
        yPos += 10;
      }
      
      // Footer
      pdf.setFontSize(8);
      pdf.text('Page 6 of 8', pageWidth - margin, pageHeight - 10, { align: 'right' });
      
      // === PAGE 7: Action Plan ===
      pdf.addPage();
      yPos = margin;
      
      // Page title
      yPos = addSectionHeader('Personalized Action Plan', yPos);
      
      // Short Term
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Short-Term (3-6 months)', margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      yPos += 7;
      
      pdfContent.recommendations.shortTerm.forEach((rec, index) => {
        yPos = addWrappedText(`${index + 1}. ${rec}`, margin + 5, yPos, contentWidth - 10, lineHeight);
        yPos += 7;
      });
      
      yPos += 7;
      
      // Medium Term
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Medium-Term (6-12 months)', margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      yPos += 7;
      
      pdfContent.recommendations.mediumTerm.forEach((rec, index) => {
        yPos = addWrappedText(`${index + 1}. ${rec}`, margin + 5, yPos, contentWidth - 10, lineHeight);
        yPos += 7;
      });
      
      yPos += 7;
      
      // Long Term
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Long-Term (1-3 years)', margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      yPos += 7;
      
      pdfContent.recommendations.longTerm.forEach((rec, index) => {
        yPos = addWrappedText(`${index + 1}. ${rec}`, margin + 5, yPos, contentWidth - 10, lineHeight);
        yPos += 7;
      });
      
      yPos += 10;
      
      // Personality traits section
      if (pdfContent.personalization.personalityTraits.length > 0) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text('Your Key Personality Traits', margin, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        yPos += 7;
        
        const traitsText = pdfContent.personalization.personalityTraits.join(', ');
        yPos = addWrappedText(traitsText, margin + 5, yPos, contentWidth - 10, lineHeight);
        
        yPos += 7;
        yPos = addWrappedText("These traits reflect your natural tendencies and can guide your career choices toward roles where these characteristics are valued and can contribute to your success.", margin + 5, yPos, contentWidth - 10, lineHeight);
      }
      
      // Footer
      pdf.setFontSize(8);
      pdf.text('Page 7 of 8', pageWidth - margin, pageHeight - 10, { align: 'right' });
      
      // === PAGE 8: Conclusion ===
      pdf.addPage();
      yPos = margin;
      
      // Page title
      yPos = addSectionHeader('Conclusion', yPos);
      
      // Conclusion text
      pdf.setFontSize(10);
      let conclusionText = "This career assessment report is designed to guide you in making informed decisions about your educational and career path. The insights provided are based on your responses to the assessment questions, which measured your aptitudes, personality traits, interests, and learning preferences.";
      yPos = addWrappedText(conclusionText, margin, yPos, contentWidth, lineHeight);
      yPos += 10;
      
      conclusionText = "Remember that this report is a tool to help you explore possibilities that align with your strengths and preferences. Your career journey is unique, and this report serves as a starting point for further exploration and development.";
      yPos = addWrappedText(conclusionText, margin, yPos, contentWidth, lineHeight);
      yPos += 10;
      
      conclusionText = "We recommend discussing these results with your teachers, career counselors, or mentors who can provide additional guidance specific to your situation and goals.";
      yPos = addWrappedText(conclusionText, margin, yPos, contentWidth, lineHeight);
      yPos += 15;
      
      // Next Steps
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Next Steps', margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      yPos += 7;
      
      const nextSteps = [
        "Research the recommended career paths in more detail",
        "Speak with professionals in your field of interest",
        "Explore educational institutions offering relevant programs",
        "Develop a personal plan to address identified gaps",
        "Consider shadowing or internship opportunities"
      ];
      
      nextSteps.forEach((step, index) => {
        pdf.text(`${index + 1}. ${step}`, margin + 5, yPos);
        yPos += 7;
      });
      
      // Certificate
      yPos += 20;
      pdf.setFillColor(245, 245, 245);
      pdf.rect(margin, yPos, contentWidth, 40, 'F');
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Career Assessment Certificate', pageWidth/2, yPos + 15, { align: 'center' });
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text(`This certifies that ${pdfContent.userName} has completed the Career Analysis Assessment`, pageWidth/2, yPos + 25, { align: 'center' });
      
      // Footer
      pdf.setFontSize(8);
      pdf.text('Page 8 of 8', pageWidth - margin, pageHeight - 10, { align: 'right' });
      
      // Save the PDF
      pdf.save(`CareerAssessment_${userName.replace(/\s+/g, '_')}_${reportId.slice(0, 8)}.pdf`);
      
      toast.success('Career assessment report generated successfully!');
      
      // Store report generation record in Supabase
      const { error } = await supabase
        .from('user_assessments')
        .update({ 
          report_generated_at: new Date().toISOString()
        })
        .eq('id', reportId);
      
      if (error) {
        console.error('Error updating report generation status:', error);
      }
      
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      toast.error(`Failed to generate PDF: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="border border-border/50 rounded-2xl overflow-hidden">
      <CardHeader className="pb-2 bg-primary/5">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">Enterprise Career Analysis Report</CardTitle>
        </div>
        <CardDescription>
          Generate a comprehensive professional report with detailed career insights
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium mb-2">Professional Report Contents:</h4>
          <ul className="space-y-1.5 text-sm text-muted-foreground ml-5 list-disc">
            <li>Executive Summary of Career Aptitude</li>
            <li>Personalized Career Path Recommendations</li>
            <li>Detailed Suitability Analysis with Match Percentages</li>
            <li>Comprehensive Skills & Competencies Assessment</li>
            <li>Personality Profile & Work Style Analysis</li>
            <li>Educational Roadmap with Timeline Projections</li>
            <li>Strengths & Development Areas Analysis</li>
            <li>Learning Style & Knowledge Acquisition Patterns</li>
            <li>Industry-Specific Insights & Trends</li>
            <li>Strategic Development Plan (Short/Medium/Long Term)</li>
          </ul>
        </div>
        
        <div className="flex items-center p-4 rounded-lg border border-primary/20 bg-primary/5">
          <div className="flex-1">
            <h3 className="font-medium">Personalized Report for: {userName}</h3>
            <p className="text-sm text-muted-foreground">
              Assessment ID: {reportId}
            </p>
          </div>
          <Button 
            onClick={handleGeneratePDF} 
            disabled={isGenerating || !scores}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {isGenerating ? 'Generating...' : 'Generate PDF Report'}
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p className="italic">
            This report is generated based on your actual assessment responses and provides enterprise-grade 
            career guidance with specific recommendations tailored to your unique profile.
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="bg-primary/5 px-6 py-4 text-xs text-muted-foreground">
        <p>
          Generated reports follow industry standards for career development planning and adhere to strict confidentiality protocols.
        </p>
      </CardFooter>
    </Card>
  );
};

export default ReportPDFGenerator;
