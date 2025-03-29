
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { analyzePersonality, analyzeSkills, generateCareerRecommendations, generateDevelopmentPlan } from '@/utils/responseAnalysis';

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
      'Technical Proficiency': 'Shows strong aptitude for technical concepts and applications. This allows you to quickly grasp and apply technical knowledge in practical situations.',
      'Attention to Detail': 'Notices fine details and maintains high accuracy in work. This precision helps ensure quality outcomes and prevents oversights.',
      'Organization': 'Excels at structuring tasks, information, and resources efficiently. This systematic approach enhances productivity and helps manage complex projects.',
      'Empathy': 'Understands and shares the feelings of others effectively. This emotional intelligence helps build strong relationships and work well in diverse teams.',
      'Business Acumen': 'Demonstrates good understanding of business principles and market dynamics. This knowledge helps make sound business decisions and identify opportunities.',
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
      'Creative Thinking': 'Developing more innovative approaches to problem-solving would be valuable. Engage in activities that encourage original thinking and unconventional solutions.',
      'Business Knowledge': 'Expanding understanding of business principles and practices would broaden career options. Consider courses in business fundamentals or industry-specific knowledge.',
      'Time Management': 'Improving ability to prioritize tasks and use time efficiently would increase productivity. Develop systems for tracking deadlines and managing competing priorities.',
      'Presentation Skills': 'Developing more effective public speaking and presentation abilities would strengthen professional presence. Practice delivering presentations and seek feedback.',
    };
    
    return descriptions[gap] || 'This area presents an opportunity for targeted development to enhance career prospects. Consider seeking specific training, mentorship, or practical experience to strengthen these skills.';
  };

  const generatePdfContent = async () => {
    // This would normally be done server-side with a proper PDF generation library
    // For this implementation, we'll create a PDF using client-side libraries
    
    if (!scores) {
      return null;
    }
    
    // Use our new analysis utilities for more personalized insights
    let personalityInsights = {
      traits: ['Analytical', 'Logical', 'Practical'],
      workStyle: ['Prefers structure and organization'],
      learningPreferences: ['Visual Learner'],
      communicationStyle: 'balanced',
      decisionMakingStyle: 'rational',
      careerValues: ['Professional Growth', 'Achievement', 'Independence']
    };
    
    let analyzedStrengths = strengthAreas;
    let analyzedDevelopmentAreas = developmentAreas;
    let careerRecommendations = scores.careerRecommendations;
    let developmentPlan = {
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
    };
    
    // Use enhanced analysis if responses are available
    if (responses) {
      try {
        // Generate personalized insights
        personalityInsights = analyzePersonality(responses);
        
        const skillAnalysis = analyzeSkills(responses);
        // Only override if we have valid data
        if (skillAnalysis.strengths.length > 0) {
          analyzedStrengths = skillAnalysis.strengths;
        }
        if (skillAnalysis.developmentAreas.length > 0) {
          analyzedDevelopmentAreas = skillAnalysis.developmentAreas;
        }
        
        // Generate personalized career recommendations
        const personalizedRecommendations = generateCareerRecommendations(responses, personalityInsights);
        if (personalizedRecommendations.length > 0) {
          careerRecommendations = personalizedRecommendations.map(rec => ({
            careerTitle: rec.title,
            suitabilityPercentage: rec.match,
            careerDescription: rec.description,
            keySkills: rec.keySkills,
            educationPathways: rec.educationPathways,
            workNature: [rec.workEnvironment, rec.growthOpportunities],
            gapAnalysis: analyzedDevelopmentAreas.map(area => 
              `Develop skills in ${area.toLowerCase()} to enhance your suitability for this career path.`
            )
          }));
        }
        
        // Generate personalized development plan
        developmentPlan = generateDevelopmentPlan(personalityInsights, analyzedDevelopmentAreas);
        
      } catch (error) {
        console.error('Error generating personalized insights:', error);
        // Continue with default values if analysis fails
      }
    }
    
    // Format career recommendations for the PDF
    const topCareer = careerRecommendations[0] || {
      careerTitle: "Career Path",
      suitabilityPercentage: 75,
      careerDescription: "Based on your assessment responses, this career path aligns well with your aptitudes and interests.",
      educationPathways: ["Bachelor's degree in relevant field", "Industry certifications", "Practical experience"],
      keySkills: ["Communication", "Problem Solving", "Technical Aptitude"],
      workNature: ["Professional environment with team collaboration", "Opportunities for advancement and specialization"],
      gapAnalysis: analyzedDevelopmentAreas.map(area => `Development in ${area} would enhance career prospects.`)
    };
    
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
      strengthAreas: analyzedStrengths.map(strength => ({
        name: strength,
        description: getStrengthDescription(strength)
      })),
      developmentAreas: analyzedDevelopmentAreas.map(area => ({
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
      otherCareers: careerRecommendations.slice(1, 4).map(career => ({
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
      personalization: personalityInsights,
      gapAnalysis: topCareer.gapAnalysis,
      recommendations: developmentPlan
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
      pdf.text("This comprehensive report analyzes your aptitudes, personality traits, interests, and learning preferences to identify optimal career paths uniquely aligned with your profile. It offers personalized insights to guide your educational and professional journey.", margin, yPos, { maxWidth: contentWidth });
      
      yPos += 30;
      pdf.setFontSize(11);
      pdf.text("Inside this report, you'll find:", margin, yPos);
      yPos += 10;
      
      const reportContents = [
        "• Detailed strengths and development areas analysis",
        "• Personalized career recommendations with match percentages",
        "• Educational pathway suggestions for career preparation",
        "• Customized action plan for skill development",
        "• Learning style insights to optimize your education"
      ];
      
      reportContents.forEach(item => {
        pdf.text(item, margin + 5, yPos);
        yPos += 8;
      });
      
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
      
      // Personality Fit Section
      yPos += 10;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Personality Fit Analysis', margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      yPos += 7;
      
      // Add personality traits relevant to career
      const relevantTraits = pdfContent.personalization.traits.slice(0, 3);
      yPos = addWrappedText(`Your personality profile (${relevantTraits.join(', ')}) aligns well with this career path. ${pdfContent.topCareerPath.title} professionals typically benefit from these traits in their day-to-day responsibilities and long-term career development.`, margin + 5, yPos, contentWidth - 10, lineHeight);
      
      // Add work preferences
      yPos += 10;
      const workPreferences = pdfContent.personalization.workStyle.slice(0, 2);
      yPos = addWrappedText(`Your work style (${workPreferences.join(', ')}) matches the typical work environment for this career, which often involves ${pdfContent.topCareerPath.workNature[0].toLowerCase()}`, margin + 5, yPos, contentWidth - 10, lineHeight);
      
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
      
      // Learning Style Recommendations
      yPos += 10;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Learning Style Recommendations', margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      yPos += 7;
      
      const learningPreferences = pdfContent.personalization.learningPreferences;
      
      if (learningPreferences.includes('Visual Learner')) {
        yPos = addWrappedText("Your assessment indicates you're a visual learner. For maximum effectiveness in your educational journey, prioritize learning materials with diagrams, charts, videos, and other visual aids. Take notes using mind maps and color-coding to help retain information.", margin + 5, yPos, contentWidth - 10, lineHeight);
      } else if (learningPreferences.includes('Auditory Learner')) {
        yPos = addWrappedText("Your assessment indicates you're an auditory learner. For maximum effectiveness in your educational journey, prioritize lectures, discussions, podcasts, and audio materials. Consider recording classes and reading your notes aloud when studying.", margin + 5, yPos, contentWidth - 10, lineHeight);
      } else if (learningPreferences.includes('Kinesthetic Learner')) {
        yPos = addWrappedText("Your assessment indicates you're a kinesthetic learner. For maximum effectiveness in your educational journey, prioritize hands-on activities, labs, role-playing, and experiential learning. Take breaks during study sessions to move around and consider using flashcards you can manipulate.", margin + 5, yPos, contentWidth - 10, lineHeight);
      } else if (learningPreferences.includes('Reading/Writing Learner')) {
        yPos = addWrappedText("Your assessment indicates you prefer learning through reading and writing. For maximum effectiveness in your educational journey, prioritize textbooks, articles, and written materials. Take detailed notes and rewrite information in your own words to enhance understanding and retention.", margin + 5, yPos, contentWidth - 10, lineHeight);
      } else {
        yPos = addWrappedText("Your assessment indicates you have a multimodal learning style. For maximum effectiveness in your educational journey, use a variety of learning approaches including visual aids, discussions, hands-on activities, and reading materials to reinforce understanding from multiple angles.", margin + 5, yPos, contentWidth - 10, lineHeight);
      }
      
      yPos += 10;
      
      // Work Responsibilities
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Work Responsibilities', margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      yPos += 7;
      
      pdfContent.topCareerPath.workNature.forEach((work, index) => {
        yPos = addWrappedText(`• ${work}`, margin + 5, yPos, contentWidth - 10, lineHeight);
        yPos += 7;
        
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
      
      // Introduction to alternative careers
      yPos = addWrappedText("While your top career recommendation represents your strongest match based on your assessment results, the following alternative careers also align well with your profile and may be worth exploring:", margin, yPos, contentWidth, lineHeight);
      yPos += 10;
      
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
        
        // Key Skills section
        pdf.setFont('helvetica', 'italic');
        pdf.text("Key Skills Required:", margin + 5, yPos);
        pdf.setFont('helvetica', 'normal');
        yPos += 5;
        
        pdf.text(`${career.keySkills.join(', ')}`, margin + 5, yPos);
        yPos += 15; // Extra space between careers
      });
      
      // Career Exploration Tips
      if (yPos < pageHeight - 60) {
        yPos += 5;
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text('Career Exploration Tips', margin, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        yPos += 7;
        
        const explorationTips = [
          "Research day-to-day responsibilities through informational interviews with professionals",
          "Explore job shadowing or internship opportunities to experience the work environment",
          "Connect with current students or recent graduates from relevant educational programs",
          "Join professional organizations or online communities in your fields of interest",
          "Attend career fairs and industry events to learn more about potential employers"
        ];
        
        explorationTips.forEach((tip, index) => {
          if (index < 3) { // Only show first 3 tips if space is limited
            yPos = addWrappedText(`• ${tip}`, margin + 5, yPos, contentWidth - 10, lineHeight);
            yPos += 5;
          }
        });
      }
      
      // Footer
      pdf.setFontSize(8);
      pdf.text('Page 5 of 8', pageWidth - margin, pageHeight - 10, { align: 'right' });
      
      // === PAGE 6: Gap Analysis ===
      pdf.addPage();
      yPos = margin;
      
      // Page title
      yPos = addSectionHeader('Gap Analysis & Development Plan', yPos);
      
      // Introduction to gap analysis
      yPos = addWrappedText("Based on your assessment results, we've identified specific areas for development that can enhance your readiness for your recommended career paths. Addressing these gaps strategically will strengthen your candidacy for your preferred careers.", margin, yPos, contentWidth, lineHeight);
      yPos += 10;
      
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
      
      // Personality analysis
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Personality Profile Insights', margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      yPos += 7;
      
      // Add traits summary
      const traitsSummary = `Your assessment reveals key traits including: ${pdfContent.personalization.traits.join(', ')}`;
      yPos = addWrappedText(traitsSummary, margin + 5, yPos, contentWidth - 10, lineHeight);
      yPos += 7;
      
      // Add decision-making style
      let decisionStyle = "";
      if (pdfContent.personalization.decisionMakingStyle === 'rational') {
        decisionStyle = "You tend to make decisions based on logical analysis and objective factors. This analytical approach helps you evaluate options systematically and reach sound conclusions.";
      } else if (pdfContent.personalization.decisionMakingStyle === 'empathetic') {
        decisionStyle = "You tend to make decisions by considering how they affect people and relationships. This people-centered approach helps you build rapport and maintain positive interactions.";
      } else {
        decisionStyle = "You show a balanced approach to decision-making, considering both objective factors and human elements when evaluating options.";
      }
      
      yPos = addWrappedText(decisionStyle, margin + 5, yPos, contentWidth - 10, lineHeight);
      yPos += 7;
      
      // Add work style
      const workStyleText = `Work Style: ${pdfContent.personalization.workStyle.join(', ')}`;
      yPos = addWrappedText(workStyleText, margin + 5, yPos, contentWidth - 10, lineHeight);
      yPos += 7;
      
      // Add career values
      const valuesText = `Career Values: Your responses indicate you value ${pdfContent.personalization.careerValues.join(', ')}`;
      yPos = addWrappedText(valuesText, margin + 5, yPos, contentWidth - 10, lineHeight);
      
      // Footer
      pdf.setFontSize(8);
      pdf.text('Page 6 of 8', pageWidth - margin, pageHeight - 10, { align: 'right' });
      
      // === PAGE 7: Action Plan ===
      pdf.addPage();
      yPos = margin;
      
      // Page title
      yPos = addSectionHeader('Personalized Action Plan', yPos);
      
      // Introduction to action plan
      yPos = addWrappedText("Based on your assessment results and identified development areas, we've created a customized action plan to help you prepare for your recommended career paths. This plan is divided into short-term, medium-term, and long-term goals to provide a structured approach to your career development.", margin, yPos, contentWidth, lineHeight);
      yPos += 10;
      
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
      
      // Tips for successful implementation
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Tips for Successful Implementation', margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      yPos += 7;
      
      const implementationTips = [
        "Break down larger goals into smaller, actionable steps with specific deadlines",
        "Track your progress regularly and adjust your approach as needed",
        "Seek feedback from mentors, teachers, or career counselors",
        "Celebrate small wins to maintain motivation throughout your journey",
        "Revisit this report periodically to stay aligned with your career goals"
      ];
      
      implementationTips.forEach((tip) => {
        if (yPos < pageHeight - 20) {
          yPos = addWrappedText(`• ${tip}`, margin + 5, yPos, contentWidth - 10, lineHeight);
          yPos += 5;
        }
      });
      
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
      let conclusionText = "This career assessment report provides personalized insights based on your unique profile of aptitudes, personality traits, interests, and learning preferences. The recommendations and action plans outlined here are designed to guide your educational and career planning process.";
      yPos = addWrappedText(conclusionText, margin, yPos, contentWidth, lineHeight);
      yPos += 10;
      
      conclusionText = "Remember that this report serves as a starting point for exploration rather than a definitive prescription. Your career journey is unique, and this analysis offers evidence-based guidance to help you make informed decisions about your future.";
      yPos = addWrappedText(conclusionText, margin, yPos, contentWidth, lineHeight);
      yPos += 10;
      
      conclusionText = "We recommend discussing these results with your teachers, parents, career counselors, or mentors who can provide additional context and guidance specific to your situation and goals.";
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
        "Research the recommended career paths in more detail through online resources and career guides",
        "Speak with professionals currently working in your fields of interest to gain first-hand insights",
        "Explore educational institutions offering programs aligned with your career goals",
        "Develop a personal action plan based on the recommendations in this report",
        "Consider job shadowing, internships, or volunteer opportunities to gain practical experience"
      ];
      
      nextSteps.forEach((step, index) => {
        pdf.text(`${index + 1}. ${step}`, margin + 5, yPos);
        yPos += 10;
      });
      
      // Certificate
      yPos += 10;
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
            This report is generated based on your assessment responses and provides enterprise-grade 
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
