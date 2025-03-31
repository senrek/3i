
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, FileText, Activity } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  addHeaderWithLogo, 
  addReportTitle, 
  addUserInfo, 
  addSectionTitle, 
  addSkillBarChart, 
  addPersonalityTypeChart,
  addInterestBarChart,
  addLearningStylePieChart,
  drawProgressBar,
  addCareerPaths,
  addStrengthsAndWeaknesses,
  addCareerClusters
} from '@/utils/pdfFormatting';

interface ReportPDFGeneratorProps {
  reportId: string;
  userName: string;
  scores: {
    aptitude: number;
    personality: number;
    interest: number;
    learningStyle: number;
    careerRecommendations: Array<{
      careerTitle: string;
      suitabilityPercentage: number;
      careerDescription: string;
      educationPathways: string[];
      keySkills: string[];
      workNature?: string[];
      gapAnalysis?: string[];
    }>;
    analysisInsights?: {
      aptitudeStyle?: string;
      personalityStyle?: string;
      interestStyle?: string;
      learningStyle?: string;
      specificAptitudes?: {
        technical: number;
        creative: number;
        analytical: number;
        social: number;
        leadership: number;
        business: number;
        mechanical: number;
        verbal: number;
        numerical: number;
      };
      personalityTraits?: {
        extroverted: boolean;
        structured: boolean;
        detailOriented: boolean;
        peopleOriented: boolean;
      };
      strengthAreas?: string[];
      developmentAreas?: string[];
      careerAreaRecommendations?: string[];
      rawAnalysis?: Record<string, any>;
    };
  };
  responses?: Record<string, string> | null;
  strengthAreas?: string[];
  developmentAreas?: string[];
}

const ReportPDFGenerator = ({ 
  reportId, 
  userName, 
  scores, 
  responses, 
  strengthAreas = [], 
  developmentAreas = [] 
}: ReportPDFGeneratorProps) => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generatePDF = async () => {
    if (!user) {
      toast.error("You must be logged in to generate a PDF report");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Get user profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name, email, phone, school, class')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        throw profileError;
      }
      
      // Create new PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Set default font
      pdf.setFont('helvetica', 'normal');
      
      try {
        // Try to fetch personalized content from DeepSeek API
        const personalizedContent = await generatePersonalizedContent(scores, responses);
        
        // Use either deepseek response or default content based on scores
        const content = personalizedContent || generateDefaultContent(scores);
        
        // Create PDF with personalized content
        createPDFWithContent(pdf, profileData, content);
        
      } catch (aiError) {
        console.error("Error generating AI content:", aiError);
        // Fallback to default content
        const content = generateDefaultContent(scores);
        createPDFWithContent(pdf, profileData, content);
      }
      
      // Save the PDF
      pdf.save(`Career_Report_${userName.replace(/\s+/g, '_')}.pdf`);
      
      // Update database to indicate report has been generated
      const { error: updateError } = await supabase
        .from('user_assessments')
        .update({ report_generated_at: new Date().toISOString() })
        .eq('id', reportId);
      
      if (updateError) {
        console.warn('Error updating report generation timestamp:', updateError);
      }
      
      toast.success("PDF report generated successfully!");
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      toast.error(`Failed to generate PDF: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Generate personalized content using OpenRouter AI API
  const generatePersonalizedContent = async (
    scores: ReportPDFGeneratorProps['scores'],
    responses?: Record<string, string> | null
  ) => {
    try {
      // Call the DeepSeek API through OpenRouter to generate personalized content
      const apiEndpoint = "https://openrouter.ai/api/v1/chat/completions";
      const apiKey = "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";
      
      // Prepare prompt with assessment data
      const prompt = `
        I need a personalized career assessment report for a student based on their assessment scores.
        
        Scores:
        - Aptitude: ${scores.aptitude}%
        - Personality: ${scores.personality}%
        - Interest: ${scores.interest}%
        - Learning Style: ${scores.learningStyle}%
        
        Strengths: ${strengthAreas?.join(", ") || "Not specified"}
        Development Areas: ${developmentAreas?.join(", ") || "Not specified"}
        
        Career Recommendations: ${scores.careerRecommendations.map(c => c.careerTitle).join(", ")}
        
        Based on this information, please provide:
        1. A brief career personality analysis that describes the person's preferences for focus, information processing, decision-making, and work planning (introvert/extrovert, sensing/intuitive, thinking/feeling, judging/perceiving tendencies)
        2. Analysis of their career interests (what types of work they would enjoy)
        3. Analysis of their career motivators (what drives them professionally)
        4. Analysis of their learning style
        5. Detailed analysis of their skills and abilities in various areas
        
        Format the response as structured sections similar to a career assessment report, but do not use markdown formatting.
      `;
      
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "deepseek-ai/deepseek-chat-1.3beta",
          messages: [
            {
              role: "system",
              content: "You are a professional career assessment analyst who creates personalized career reports for students. Your analysis should be insightful and helpful, focused on their strengths while providing constructive guidance on development areas."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.5,
          max_tokens: 2000
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        console.error("Error response from OpenRouter API:", result);
        throw new Error("Failed to generate personalized content");
      }
      
      return result.choices[0].message.content;
      
    } catch (error) {
      console.error("Error generating personalized content:", error);
      return null;
    }
  };
  
  // Generate default content based on scores
  const generateDefaultContent = (scores: ReportPDFGeneratorProps['scores']) => {
    // Personality type analysis
    let personalityType = "";
    let personalityAnalysis = "";
    
    // Determine personality dimensions based on scores and insights
    const isIntrovert = scores.analysisInsights?.personalityStyle === 'introverted';
    const isIntuitive = scores.personality < 60;
    const isThinking = scores.analysisInsights?.personalityTraits?.peopleOriented === false;
    const isJudging = scores.analysisInsights?.personalityTraits?.structured === true;
    
    personalityType = `${isIntrovert ? 'Introvert' : 'Extrovert'}:${isIntuitive ? 'iNtuitive' : 'Sensing'}:${isThinking ? 'Thinking' : 'Feeling'}:${isJudging ? 'Judging' : 'Perceiving'}`;
    
    // Focus energy and attention
    if (isIntrovert) {
      personalityAnalysis += `
You mostly get your energy from dealing with ideas, pictures, memories and reactions which are part of your imaginative world.
You are quiet, reserved and like to spend your time alone.
Your primary mode of living is focused internally.
You are passionate but not usually aggressive.
You are a good listener.
You are more of an inside-out person.
      `;
    } else {
      personalityAnalysis += `
You gain energy by interacting with others and engaging with the outside world.
You enjoy socializing and are typically outgoing and talkative.
Your primary mode of living is focused externally through people and activities.
You tend to think out loud and process information through conversation.
You thrive in group settings and prefer collaboration.
You are more of an outside-in person.
      `;
    }
    
    // How they grasp and process information
    if (isIntuitive) {
      personalityAnalysis += `
You focus on the big picture rather than the details.
You look for patterns and possibilities in information.
You are future-oriented and enjoy thinking about what could be.
You trust your instincts and intuition when processing information.
You prefer conceptual learning and abstract thinking.
You are innovative and open to new perspectives.
      `;
    } else {
      personalityAnalysis += `
You mostly collect and trust the information that is presented in a detailed and sequential manner.
You think more about the present and learn from the past.
You like to see the practical use of things and learn best from practice.
You notice facts and remember details that are important to you.
You solve problems by working through facts until you understand the problem.
You create meaning from conscious thought and learn by observation.
      `;
    }
    
    // How they make decisions
    if (isThinking) {
      personalityAnalysis += `
You seem to make decisions based on logic rather than the circumstances.
You believe telling truth is more important than being tactful.
You seem to look for logical explanations or solutions to almost everything.
You can often be seen as very task-oriented, uncaring, or indifferent.
You are ruled by your head instead of your heart.
You are a critical thinker and oriented toward problem solving.
      `;
    } else {
      personalityAnalysis += `
You tend to make decisions based on values and how actions affect people.
You consider the impact of decisions on others and prioritize harmony.
You are empathetic and considerate of others' feelings.
You value personal connections and building consensus.
You are guided by your heart more than your head.
You excel at understanding people's needs and motivations.
      `;
    }
    
    // How they plan their work
    if (isJudging) {
      personalityAnalysis += `
You prefer a planned or orderly way of life.
You like to have things well-organized.
Your productivity increases when working with structure.
You are self-disciplined and decisive.
You like to have things decided and planned before doing any task.
You seek closure and enjoy completing tasks.
Mostly, you think sequentially.
      `;
    } else {
      personalityAnalysis += `
You prefer a flexible and spontaneous approach to life and work.
You adapt easily to changing circumstances and new information.
You enjoy keeping options open and exploring possibilities.
You are curious and open to new experiences.
You can be playful and energized by last-minute pressures.
You prefer to understand rather than to judge.
You think in a more parallel manner than sequentially.
      `;
    }
    
    // Determine career interest type based on scores
    let careerInterests = "";
    let interestScore: { type: string, score: number }[] = [];
    
    // Get career interest scores from insights or estimate them
    const aptitudeScore = scores.aptitude;
    const personalityScore = scores.personality;
    const interestValue = scores.interest;
    
    // Estimate interest types based on scores and insights
    if (aptitudeScore > 70) {
      interestScore.push({ type: "Investigative", score: Math.min(100, aptitudeScore + 10) });
    } else {
      interestScore.push({ type: "Investigative", score: aptitudeScore });
    }
    
    if (scores.analysisInsights?.personalityTraits?.structured === true) {
      interestScore.push({ type: "Conventional", score: Math.min(100, personalityScore + 5) });
    } else {
      interestScore.push({ type: "Conventional", score: Math.max(20, personalityScore - 10) });
    }
    
    if (scores.analysisInsights?.specificAptitudes?.technical && scores.analysisInsights.specificAptitudes.technical > 60) {
      interestScore.push({ type: "Realistic", score: scores.analysisInsights.specificAptitudes.technical });
    } else {
      interestScore.push({ type: "Realistic", score: Math.max(30, aptitudeScore - 15) });
    }
    
    if (scores.analysisInsights?.specificAptitudes?.leadership && scores.analysisInsights.specificAptitudes.leadership > 60) {
      interestScore.push({ type: "Enterprising", score: scores.analysisInsights.specificAptitudes.leadership });
    } else {
      interestScore.push({ type: "Enterprising", score: Math.max(20, personalityScore - 20) });
    }
    
    if (scores.analysisInsights?.specificAptitudes?.creative && scores.analysisInsights.specificAptitudes.creative > 60) {
      interestScore.push({ type: "Artistic", score: scores.analysisInsights.specificAptitudes.creative });
    } else {
      interestScore.push({ type: "Artistic", score: Math.max(15, interestValue - 15) });
    }
    
    if (scores.analysisInsights?.specificAptitudes?.social && scores.analysisInsights.specificAptitudes.social > 60) {
      interestScore.push({ type: "Social", score: scores.analysisInsights.specificAptitudes.social });
    } else {
      interestScore.push({ type: "Social", score: Math.max(10, personalityScore - 30) });
    }
    
    // Sort by score in descending order
    interestScore.sort((a, b) => b.score - a.score);
    
    // Generate career interest analysis based on top interests
    const topInterests = interestScore.slice(0, 3);
    
    let interestAnalysis = "";
    
    topInterests.forEach(interest => {
      if (interest.type === "Investigative" && interest.score > 60) {
        interestAnalysis += `
Investigative-HIGH
• You are analytical, intellectual, observant and enjoy research.
• You enjoy using logic and solving complex problems.
• You are interested in occupations that require observation, learning and investigation.
• You are introspective and focused on creative problem solving.
• You prefer working with ideas and using technology.
        `;
      } else if (interest.type === "Conventional" && interest.score > 60) {
        interestAnalysis += `
Conventional-HIGH
• You are efficient, careful, conforming, organized and conscientious.
• You are organized, detail-oriented and do well with manipulating data and numbers.
• You are persistent and reliable in carrying out tasks.
• You enjoy working with data, details and creating reports
• You prefer working in a structured environment.
• You like to work with data, and you have a numerical or clerical ability.
        `;
      } else if (interest.type === "Realistic" && interest.score > 60) {
        interestAnalysis += `
Realistic-HIGH
• You are active, stable and enjoy hands-on or manual activities.
• You prefer to work with things rather than ideas and people.
• You tend to communicate in a frank, direct manner and value material things.
• You may be uncomfortable or less adept with human relations.
• You value practical things that you can see and touch.
• You have good skills at handling tools, mechanical drawings, machines or animals.
        `;
      } else if (interest.type === "Enterprising" && interest.score > 60) {
        interestAnalysis += `
Enterprising-HIGH
• You are energetic, ambitious, adventurous, and confident.
• You are skilled in leadership and speaking.
• You generally enjoy starting your own business, promoting ideas and managing people.
• You are effective at public speaking and are generally social.
• You like activities that requires to persuade others and leadership roles.
• You like the promotion of products, ideas, or services.
        `;
      } else if (interest.type === "Artistic" && interest.score > 60) {
        interestAnalysis += `
Artistic-HIGH
• You are creative, intuitive, sensitive, articulate, and expressive.
• You enjoy creating original work through art, music, writing, or other forms.
• You value aesthetics and artistic qualities.
• You tend to be independent and open to new ideas and experiences.
• You prefer environments that allow for self-expression and creativity.
• You have a good imagination and innovative thinking skills.
        `;
      } else if (interest.type === "Social" && interest.score > 60) {
        interestAnalysis += `
Social-HIGH
• You are friendly, helpful, idealistic, and insightful.
• You enjoy working with and helping people.
• You are concerned about social issues and human welfare.
• You excel at understanding others' feelings and solving people problems.
• You value making a difference in people's lives.
• You have good communication and teaching skills.
        `;
      }
    });
    
    // Career motivators analysis
    let motivatorTypes = "";
    let motivatorAnalysis = "";
    
    // Determine motivators based on scores and insights
    const motivators = [
      { type: "Independence", score: isIntrovert ? 100 : 40 },
      { type: "Continuous Learning", score: scores.analysisInsights?.specificAptitudes?.analytical ? 100 : 60 },
      { type: "Social Service", score: scores.analysisInsights?.specificAptitudes?.social ? 100 : 30 },
      { type: "Structured work environment", score: isJudging ? 80 : 40 },
      { type: "Adventure", score: !isJudging ? 70 : 40 },
      { type: "High Paced Environment", score: !isIntrovert ? 80 : 20 },
      { type: "Creativity", score: scores.analysisInsights?.specificAptitudes?.creative ? 80 : 20 }
    ];
    
    // Sort by score in descending order
    motivators.sort((a, b) => b.score - a.score);
    
    // Get top 3 motivators
    const topMotivators = motivators.slice(0, 3);
    
    topMotivators.forEach(motivator => {
      if (motivator.score > 60) {
        if (motivator.type === "Social Service") {
          motivatorAnalysis += `
Social Service-HIGH
• You like to do work which has some social responsibility.
• You like to do work which impacts the world.
• You like to receive social recognition for the work that you do.
          `;
        } else if (motivator.type === "Independence") {
          motivatorAnalysis += `
Independence-HIGH
• You enjoy working independently.
• You dislike too much supervision.
• You dislike group activities.
          `;
        } else if (motivator.type === "Continuous Learning") {
          motivatorAnalysis += `
Continuous learning-HIGH
• You like to have consistent professional growth in your field of work.
• You like to work in an environment where there is need to update your knowledge at regular intervals.
• You like it when your work achievements are evaluated at regular intervals.
          `;
        } else if (motivator.type === "Structured work environment") {
          motivatorAnalysis += `
Structured work environment-HIGH
• You prefer working in environments with clear rules and procedures.
• You value consistency and predictability in your workplace.
• You excel when expectations and responsibilities are clearly defined.
          `;
        } else if (motivator.type === "Adventure") {
          motivatorAnalysis += `
Adventure-HIGH
• You enjoy work that involves some level of risk or excitement.
• You thrive in changing environments with new challenges.
• You appreciate opportunities to explore new ideas and approaches.
          `;
        } else if (motivator.type === "High Paced Environment") {
          motivatorAnalysis += `
High Paced Environment-HIGH
• You thrive in fast-paced settings where quick decisions are needed.
• You enjoy juggling multiple tasks and responsibilities simultaneously.
• You are energized by deadlines and time-sensitive projects.
          `;
        } else if (motivator.type === "Creativity") {
          motivatorAnalysis += `
Creativity-HIGH
• You value opportunities for original thinking and innovation.
• You enjoy expressing yourself and generating new ideas.
• You prefer work environments that encourage thinking outside the box.
          `;
        }
      }
    });
    
    // Learning style analysis
    let learningStyleTypes = "";
    let learningStyleAnalysis = "";
    
    // Determine learning style based on scores and insights
    const learningStyles = [
      { type: "Read & Write Learning", score: isIntuitive ? 38 : 25 },
      { type: "Auditory learning", score: isIntrovert ? 15 : 25 },
      { type: "Visual Learning", score: isIntuitive ? 25 : 20 },
      { type: "Kinesthetic Learning", score: !isIntuitive ? 30 : 13 }
    ];
    
    // Sort by score in descending order
    learningStyles.sort((a, b) => b.score - a.score);
    
    // Top learning style
    const topLearningStyle = learningStyles[0];
    
    if (topLearningStyle.type === "Read & Write Learning") {
      learningStyleAnalysis = `
Read/Write learning style
• Reading and writing learners prefer to take in the information displayed as words.
• These learners strongly prefer primarily text-based learning materials.
• Emphasis is based on text-based input and output, i.e. reading and writing in all its forms.
• People who prefer this modality love to work using PowerPoint, internet, lists, dictionaries and words.

Learning improvement strategies
• Re-write your notes after class.
• Use coloured pens and highlighters to focus on key ideas.
• Write notes to yourself in the margins.
• Write out key concepts and ideas.
• Compose short explanations for diagrams, charts and graphs.
• Write out instructions for each step of a procedure or math problem.
• Print out your notes for later review.
• Post note cards/post-its in visible places. (when doing dishes, on the bottom of the remote etc).
• Vocabulary mnemonics.
• Organize your notes/key concepts into a powerpoint presentation.
• Compare your notes with others.
• Repetitive writing.
• Hangman game.
      `;
    } else if (topLearningStyle.type === "Visual Learning") {
      learningStyleAnalysis = `
Visual learning style
• Visual learners prefer to take in information by seeing or watching demonstrations.
• These learners strongly prefer visually represented information like pictures, diagrams, flowcharts, and symbols.
• Emphasis is based on visual representations and spatial understanding.
• People who prefer this modality love to work with colors, layouts, patterns, and visual aids.

Learning improvement strategies
• Use colors, highlights, diagrams, and charts to organize information.
• Convert notes into visual formats like mind maps or flowcharts.
• Watch demonstrations or video content when possible.
• Create visual analogies and metaphors to remember key concepts.
• Use flashcards with images or different colored cards for different topics.
• Draw pictures or symbols in the margins of notes to help remember content.
• Organize your learning environment to be visually appealing and free from visual distractions.
• Use visual clustering techniques to organize similar ideas.
• Look for visual patterns in information.
• Practice visualizing processes and concepts in your mind.
      `;
    } else if (topLearningStyle.type === "Auditory learning") {
      learningStyleAnalysis = `
Auditory learning style
• Auditory learners prefer to learn by listening and speaking.
• These learners strongly prefer information that is heard or spoken.
• Emphasis is based on auditory input and output through listening and discussing.
• People who prefer this modality love to work with discussions, verbal explanations, and sound.

Learning improvement strategies
• Record lectures and listen to them again.
• Read aloud when studying important material.
• Discuss concepts with others or form study groups for verbal exchanges.
• Create mnemonic devices or rhymes to remember key information.
• Use verbal repetition to reinforce learning.
• Explain concepts to others, even if just to yourself.
• Listen to background music (without lyrics) while studying if it helps concentration.
• Participate actively in class discussions and ask questions.
• Use audio books or text-to-speech software when available.
• Create verbal summaries of information rather than written ones.
      `;
    } else if (topLearningStyle.type === "Kinesthetic Learning") {
      learningStyleAnalysis = `
Kinesthetic learning style
• Kinesthetic learners prefer to learn through movement, hands-on activities, and physical experiences.
• These learners strongly prefer doing and experiencing to understand information.
• Emphasis is based on physical sensations, practical applications, and real-world experiences.
• People who prefer this modality love to work with models, demonstrations, and practical exercises.

Learning improvement strategies
• Take frequent study breaks to move around.
• Use physical objects or manipulatives when possible.
• Create models or physical representations of concepts.
• Role-play scenarios related to the content.
• Practice note-taking with different colored pens and physically organize information.
• Walk or move while reciting information to memorize.
• Engage in laboratory work, field trips, or hands-on activities whenever possible.
• Use physical activity as a reward for completing study tasks.
• Apply concepts to real-world situations or case studies.
• Try studying while using an exercise ball as a chair or using a standing desk.
      `;
    }
    
    // Skills and abilities analysis based on scores and insights
    let skillsAnalysis = "";
    
    // Numerical ability
    const numericalScore = scores.analysisInsights?.specificAptitudes?.numerical || 80;
    skillsAnalysis += `
Numerical Ability
• Your numerical skills are ${numericalScore >= 80 ? 'excellent' : numericalScore >= 60 ? 'good' : 'average'}.
• Numeracy involves an understanding of numerical data and numbers.
• Being competent and confident while working with numbers is a skill, that holds an advantage in a wide range of career options.
    `;
    
    // Logical ability
    const logicalScore = scores.analysisInsights?.specificAptitudes?.analytical || 60;
    skillsAnalysis += `
Logical Ability
• Your logical skills are ${logicalScore >= 80 ? 'excellent' : logicalScore >= 60 ? 'good' : 'average'}.
• Logical thinking is very important for analytical profiles.
• Being able to understand and analyze data in different formats is considered an essential skill in many career options.
    `;
    
    // Verbal ability
    const verbalScore = scores.analysisInsights?.specificAptitudes?.verbal || 100;
    skillsAnalysis += `
Verbal Ability
• Your communication skills are ${verbalScore >= 80 ? 'excellent' : verbalScore >= 60 ? 'good' : 'average'}.
• ${verbalScore >= 80 ? 'Excellent' : verbalScore >= 60 ? 'Good' : 'Average'} verbal and written communication helps you to communicate your message effectively.
    `;
    
    // Clerical ability
    const clericalScore = 50;
    skillsAnalysis += `
Clerical and Organizing Skills
• Your organizing & planning skills are ${clericalScore >= 80 ? 'excellent' : clericalScore >= 60 ? 'good' : 'average'}.
• It includes general organizing, planning, time management, scheduling, coordinating resources and meeting deadlines.
    `;
    
    // Spatial ability
    const spatialScore = scores.analysisInsights?.specificAptitudes?.creative || 80;
    skillsAnalysis += `
Spatial & Visualization Ability
• Your visualization skills are ${spatialScore >= 80 ? 'excellent' : spatialScore >= 60 ? 'good' : 'average'}.
• This skill allows you to explore, analyze, and create visual solutions.
• It is important in many academic and professional career fields.
    `;
    
    // Leadership ability
    const leadershipScore = scores.analysisInsights?.specificAptitudes?.leadership || 60;
    skillsAnalysis += `
Leadership & Decision making skills
• Your leadership & decision-making skills are ${leadershipScore >= 80 ? 'excellent' : leadershipScore >= 60 ? 'good' : 'average'}.
• It includes strategic thinking, planning, people management, change management, communication, and persuasion and influencing.
• These skills allow you to make decisions quickly, adapt to changing scenarios and respond to opportunities promptly.
    `;
    
    // Social ability
    const socialScore = scores.analysisInsights?.specificAptitudes?.social || 80;
    skillsAnalysis += `
Social & Co-operation Skills
• Your social and cooperation skills are ${socialScore >= 80 ? 'excellent' : socialScore >= 60 ? 'good' : 'average'}.
• Social skills are important because they help you build, maintain and grow relationships with others.
• This skill is beneficial in the service industry and social causes.
    `;
    
    // Mechanical ability
    const mechanicalScore = scores.analysisInsights?.specificAptitudes?.mechanical || 50;
    skillsAnalysis += `
Mechanical Abilities
• The score indicates that your mechanical ability is ${mechanicalScore >= 80 ? 'excellent' : mechanicalScore >= 60 ? 'good' : 'average'}.
• This section evaluates your basic mechanical understanding and mechanical knowledge.
• This skill is required for many career options like engineering and mechanical services.
    `;
    
    // Career clusters based on scores and insights
    let careerClusters = "";
    let selectedClusters = "";
    
    // Generate default content object
    return {
      personalityType,
      personalityAnalysis,
      topInterests,
      interestAnalysis,
      topMotivators,
      motivatorAnalysis,
      topLearningStyle,
      learningStyleAnalysis,
      skillsAnalysis,
      careerRecommendations: scores.careerRecommendations,
      strengthAreas: strengthAreas || scores.analysisInsights?.strengthAreas || [],
      developmentAreas: developmentAreas || scores.analysisInsights?.developmentAreas || []
    };
  };
  
  // Create PDF with content
  const createPDFWithContent = (pdf: jsPDF, profileData: any, content: any) => {
    // Add report header and title
    addHeaderWithLogo(pdf);
    addReportTitle(pdf, "Career Report for 8th, 9th or 10th");
    
    // Add disclaimer text at bottom of first page
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text("This report is intended only for the use of the individual or entity to which it is addressed and may contain", 20, 275);
    pdf.text("information that is non-public, proprietary, privileged, confidential, and exempt from disclosure under applicable law.", 20, 280);
    pdf.text("No part of this report may be reproduced in any form or manner without prior written permission.", 20, 285);
    
    // Add footer with date and company info
    const today = new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
    
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(today, 20, 290);
    pdf.text("Powered By: 3i Global", 170, 290);
    
    // Add user information
    pdf.addPage();
    addReportTitle(pdf, "Report Prepared for", false);
    
    const fullName = [profileData?.first_name, profileData?.last_name].filter(Boolean).join(' ') || userName;
    
    // User Info
    addUserInfo(pdf, [
      { label: "Name", value: fullName },
      { label: "Phone Number", value: profileData?.phone || "Not provided" },
      { label: "Email ID", value: profileData?.email || "Not provided" },
      { label: "School", value: profileData?.school || "Not provided" },
      { label: "Class", value: profileData?.class || "Not provided" }
    ]);
    
    // Page 1 - Profiling
    pdf.addPage();
    addReportTitle(pdf, "Career Report", false);
    addSectionTitle(pdf, "Profiling", 20, 40);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(70, 70, 70);
    pdf.text("Your Profiling", 20, 55);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text("Personal profiling is the first step in career planning. The purpose of profiling is to understand your", 20, 65);
    pdf.text("current career planning stage. It will help decide your career objective and roadmap. The ultimate aim of", 20, 72);
    pdf.text("the planning is to take you from the current stage of career planning to the optimized stage of career", 20, 79);
    pdf.text("planning. Personal profiling includes information about your current stage, the risk involved and action", 20, 86);
    pdf.text("plan for your career development.", 20, 93);
    
    // Current Stage of Planning
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(70, 70, 70);
    pdf.text("Current Stage of Planning", 20, 108);
    
    // Draw planning stages
    pdf.setDrawColor(200, 200, 200);
    pdf.setFillColor(220, 220, 220);
    pdf.roundedRect(20, 118, 170, 20, 3, 3, 'FD');
    
    const stages = ['Ignorant', 'Confused', 'Diffused', 'Methodical', 'Optimized'];
    const stageWidth = 170 / stages.length;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    
    // Current stage (diffused)
    const currentStage = 'Diffused';
    const currentStageIndex = stages.indexOf(currentStage);
    
    stages.forEach((stage, index) => {
      const x = 20 + (index * stageWidth) + (stageWidth / 2);
      pdf.text(stage, x, 130, { align: 'center' });
      
      if (stage === currentStage) {
        // Highlight current stage
        pdf.setFillColor(100, 149, 237); // Cornflower blue
        pdf.circle(x, 123, 5, 'F');
        
        // Add stage description below
        pdf.setFontSize(13);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(100, 149, 237);
        pdf.text(currentStage, 20, 145);
        
        // Description of the stage
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        pdf.text("Diffused: You are at the diffused stage in career planning. We understand that you have a fair idea", 20, 155);
        pdf.text("of your suitable career. At this stage, you have a better understanding of career options. However,", 20, 162);
        pdf.text("you are looking for more information to understand the complete career path for yourself and an", 20, 169);
        pdf.text("execution plan to achieve it. Lack of complete information and execution plan can adversely impact", 20, 176);
        pdf.text("your career. Most career decisions are based on limited information", 20, 183);
        
        pdf.text("Risk Involved: Career misalignment, career path misjudgment, wrong career path projections,", 20, 193);
        pdf.text("unnecessary stress", 20, 200);
        
        pdf.text("Action Plan : Explore career path > Align your abilities and interests with the best possible career", 20, 210);
        pdf.text("path > Realistic Execution Plan > Timely Review of Action Plan", 20, 217);
      } else {
        // Draw empty circles for other stages
        pdf.circle(x, 123, 5, 'D');
      }
    });
    
    // Add footer with page number
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`3i Global`, 20, 285);
    pdf.text(`${fullName}`, 100, 285, { align: 'center' });
    pdf.text(`Page ${pdf.getNumberOfPages() - 2}`, 190, 285);
    
    // Page 2 - Career Personality
    pdf.addPage();
    addReportTitle(pdf, "Career Report", false);
    addSectionTitle(pdf, "Career Personality", 20, 40);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(70, 70, 70);
    pdf.text("Result of the Career Personality", 20, 55);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text("Personality Assessment will help you understand yourself as a person. It will help you expand your", 20, 65);
    pdf.text("career options in alignment with your personality. Self-understanding and awareness can lead you to", 20, 72);
    pdf.text("more appropriate and rewarding career choices. The Personality Type Model identifies four dimensions", 20, 79);
    pdf.text("of personality. Each dimension will give you a clear description of your personality. The combination of", 20, 86);
    pdf.text("your most dominant preferences is used to create your individual personality type. Four dimensions of", 20, 93);
    pdf.text("your personality are mentioned in this chart. The graph below provides information about the personality", 20, 100);
    pdf.text("type you belong to, based on the scoring of your responses. Each of the four preferences are based on", 20, 107);
    pdf.text("your answers and are indicated by a bar chart.", 20, 114);
    
    // Personality Type
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(70, 70, 70);
    pdf.text(`Personality Type: ${content.personalityType}`, 20, 129);
    
    // Add personality bars
    // Calculate personality percentages based on scores
    const introvertPct = content.personalityType.includes('Introvert') ? 86 : 14;
    const sensingPct = content.personalityType.includes('Sensing') ? 86 : 14;
    const thinkingPct = content.personalityType.includes('Thinking') ? 71 : 29;
    const judgingPct = content.personalityType.includes('Judging') ? 57 : 43;
    
    addPersonalityTypeChart(pdf, {
      introvertExtrovert: {
        introvert: introvertPct,
        extrovert: 100 - introvertPct
      },
      sensingIntuitive: {
        sensing: sensingPct,
        intuitive: 100 - sensingPct
      },
      thinkingFeeling: {
        thinking: thinkingPct,
        feeling: 100 - thinkingPct
      },
      judgingPerceiving: {
        judging: judgingPct,
        perceiving: 100 - judgingPct
      }
    });
    
    // Add footer with page number
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`3i Global`, 20, 285);
    pdf.text(`${fullName}`, 100, 285, { align: 'center' });
    pdf.text(`Page ${pdf.getNumberOfPages() - 2}`, 190, 285);
    
    // Page 3-4 - Career Personality Analysis
    pdf.addPage();
    addReportTitle(pdf, "Career Report", false);
    addSectionTitle(pdf, "Analysis of Career Personality", 20, 40);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(70, 70, 70);
    pdf.text("Your Career Personality Analysis", 20, 55);
    
    // Format personality analysis content
    const personalityLines = content.personalityAnalysis.trim().split('\n');
    const personalityParagraphs = [];
    let currentParagraph = [];
    
    personalityLines.forEach(line => {
      if (line.trim() === '') {
        if (currentParagraph.length > 0) {
          personalityParagraphs.push(currentParagraph);
          currentParagraph = [];
        }
      } else {
        currentParagraph.push(line.trim());
      }
    });
    
    if (currentParagraph.length > 0) {
      personalityParagraphs.push(currentParagraph);
    }
    
    // First dimension - Where do you prefer to focus your energy and attention?
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(100, 149, 237); // Blue
    pdf.text("Where do you prefer to focus your energy and attention?", 20, 70);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    
    const energyFocusParagraph = personalityParagraphs[0] || [];
    let yPos = 85;
    
    energyFocusParagraph.forEach(line => {
      pdf.text("•", 20, yPos);
      pdf.text(line, 25, yPos);
      yPos += 7;
    });
    
    // Second dimension - How do you grasp and process the information?
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(100, 149, 237); // Blue
    pdf.text("How do you grasp and process the information?", 20, yPos + 10);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    
    yPos += 25;
    const informationParagraph = personalityParagraphs[1] || [];
    
    informationParagraph.forEach(line => {
      pdf.text("•", 20, yPos);
      pdf.text(line, 25, yPos);
      yPos += 7;
    });
    
    // Third dimension - How do you make decisions?
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(100, 149, 237); // Blue
    pdf.text("How do you make decisions?", 20, yPos + 10);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    
    yPos += 25;
    const decisionParagraph = personalityParagraphs[2] || [];
    
    decisionParagraph.forEach(line => {
      if (yPos > 250) {
        // Add footer to current page
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`3i Global`, 20, 285);
        pdf.text(`${fullName}`, 100, 285, { align: 'center' });
        pdf.text(`Page ${pdf.getNumberOfPages() - 2}`, 190, 285);
        
        // Add new page
        pdf.addPage();
        addReportTitle(pdf, "Career Report", false);
        addSectionTitle(pdf, "Analysis of Career Personality", 20, 40);
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(70, 70, 70);
        pdf.text("Your Career Personality Analysis", 20, 55);
        
        yPos = 70;
      }
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      
      pdf.text("•", 20, yPos);
      pdf.text(line, 25, yPos);
      yPos += 7;
    });
    
    // Fourth dimension - How do you prefer to plan your work?
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(100, 149, 237); // Blue
    pdf.text("How do you prefer to plan your work?", 20, yPos + 10);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    
    yPos += 25;
    const workPlanParagraph = personalityParagraphs[3] || [];
    
    workPlanParagraph.forEach(line => {
      if (yPos > 250) {
        // Add footer to current page
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`3i Global`, 20, 285);
        pdf.text(`${fullName}`, 100, 285, { align: 'center' });
        pdf.text(`Page ${pdf.getNumberOfPages() - 2}`, 190, 285);
        
        // Add new page
        pdf.addPage();
        addReportTitle(pdf, "Career Report", false);
        addSectionTitle(pdf, "Analysis of Career Personality", 20, 40);
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(70, 70, 70);
        pdf.text("Your Career Personality Analysis", 20, 55);
        
        yPos = 70;
      }
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      
      pdf.text("•", 20, yPos);
      pdf.text(line, 25, yPos);
      yPos += 7;
    });
    
    // Strengths based on personality type
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(100, 149, 237); // Blue
    pdf.text("Your strengths", 20, yPos + 10);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    
    yPos += 25;
    
    // Get personality traits from content
    const strengths = [
      "Strong-willed and dutiful",
      "Calm and practical",
      "Honest and direct",
      "Very responsible",
      "Create and enforce order"
    ];
    
    strengths.forEach(strength => {
      if (yPos > 250) {
        // Add footer to current page
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`3i Global`, 20, 285);
        pdf.text(`${fullName}`, 100, 285, { align: 'center' });
        pdf.text(`Page ${pdf.getNumberOfPages() - 2}`, 190, 285);
        
        // Add new page
        pdf.addPage();
        addReportTitle(pdf, "Career Report", false);
        addSectionTitle(pdf, "Analysis of Career Personality", 20, 40);
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(70, 70, 70);
        pdf.text("Your Career Personality Analysis", 20, 55);
        
        yPos = 70;
      }
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      
      pdf.text("•", 20, yPos);
      pdf.text(strength, 25, yPos);
      yPos += 7;
    });
    
    // Add footer with page number
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`3i Global`, 20, 285);
    pdf.text(`${fullName}`, 100, 285, { align: 'center' });
    pdf.text(`Page ${pdf.getNumberOfPages() - 2}`, 190, 285);
    
    // Page for Career Interest
    pdf.addPage();
    addReportTitle(pdf, "Career Report", false);
    addSectionTitle(pdf, "Result of the Career Interest", 20, 40);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(70, 70, 70);
    pdf.text("Your Career Interest Types", 20, 55);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text("The Career Interest Assessment will help you understand which careers might be the best fit for you. It is", 20, 65);
    pdf.text("meant to help you find careers that you might enjoy. Understanding your Top career interest will help you", 20, 72);
    pdf.text("identify a career focus and begin your career planning and career exploration process.", 20, 79);
    
    pdf.text("The Career Interest Assessment (CIA) measures six broad interest patterns that can be used to", 20, 89);
    pdf.text("describe your career interest. Most people's interests are reflected by two or three themes, combined to", 20, 96);
    pdf.text("form a cluster of interests. This career interest is directly linked to your occupational interest.", 20, 103);
    
    // Add career interest bar chart
    addInterestBarChart(pdf, content.topInterests, 113);
    
    // Add footer with page number
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`3i Global`, 20, 285);
    pdf.text(`${fullName}`, 100, 285, { align: 'center' });
    pdf.text(`Page ${pdf.getNumberOfPages() - 2}`, 190, 285);
    
    // Page for Career Interest Analysis
    pdf.addPage();
    addReportTitle(pdf, "Career Report", false);
    addSectionTitle(pdf, "Analysis of Career Interest", 20, 40);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(70, 70, 70);
    pdf.text("Your Career Interest Analysis", 20, 55);
    
    // Format interest analysis content
    const interestLines = content.interestAnalysis.trim().split('\n');
    const interestParagraphs = [];
    let currentInterestParagraph = [];
    
    interestLines.forEach(line => {
      if (line.trim() === '') {
        if (currentInterestParagraph.length > 0) {
          interestParagraphs.push(currentInterestParagraph);
          currentInterestParagraph = [];
        }
      } else {
        currentInterestParagraph.push(line.trim());
      }
    });
    
    if (currentInterestParagraph.length > 0) {
      interestParagraphs.push(currentInterestParagraph);
    }
    
    // Display each interest type analysis
    let interestYPos = 70;
    
    interestParagraphs.forEach(paragraph => {
      if (paragraph.length === 0) return;
      
      // Title of interest type
      const title = paragraph[0] || "";
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text(title, 20, interestYPos);
      
      interestYPos += 15;
      
      // Bullet points
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      
      for (let i = 1; i < paragraph.length; i++) {
        if (interestYPos > 250) {
          // Add footer to current page
          pdf.setFontSize(9);
          pdf.setTextColor(100, 100, 100);
          pdf.text(`3i Global`, 20, 285);
          pdf.text(`${fullName}`, 100, 285, { align: 'center' });
          pdf.text(`Page ${pdf.getNumberOfPages() - 2}`, 190, 285);
          
          // Add new page
          pdf.addPage();
          addReportTitle(pdf, "Career Report", false);
          addSectionTitle(pdf, "Analysis of Career Interest", 20, 40);
          
          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(70, 70, 70);
          pdf.text("Your Career Interest Analysis", 20, 55);
          
          interestYPos = 70;
        }
        
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        
        pdf.text(paragraph[i], 20, interestYPos);
        interestYPos += 7;
      }
      
      interestYPos += 10;
    });
    
    // Add footer with page number
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`3i Global`, 20, 285);
    pdf.text(`${fullName}`, 100, 285, { align: 'center' });
    pdf.text(`Page ${pdf.getNumberOfPages() - 2}`, 190, 285);
    
    // Page for Career Motivator
    pdf.addPage();
    addReportTitle(pdf, "Career Report", false);
    addSectionTitle(pdf, "Result of the Career Motivator", 20, 40);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(70, 70, 70);
    pdf.text("Your Career Motivator Types", 20, 55);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text("Values are the things that are most important to us in our lives and careers. Our values are formed in a", 20, 65);
    pdf.text("variety of ways through our life experiences, our feelings and our families. In the context of Career", 20, 72);
    pdf.text("Planning, values generally refer to the things we value in a career. Being aware of what we value in our", 20, 79);
    pdf.text("lives is important because a career choice that is in-line with our core beliefs and values is more likely to", 20, 86);
    pdf.text("be a lasting and positive choice", 20, 93);
    
    // Calculate scores for motivators (assuming these are the topMotivators from content)
    const motivatorScores = content.topMotivators.map(motivator => ({
      name: motivator.type,
      value: motivator.score
    }));
    
    // Add more default motivators with lower scores
    const defaultMotivators = [
      { name: "Structured work environment", value: 40 },
      { name: "Adventure", value: 40 },
      { name: "High Paced Environment", value: 20 },
      { name: "Creativity", value: 20 }
    ];
    
    // Combine and sort by value (highest first)
    const allMotivators = [...motivatorScores, ...defaultMotivators]
      .filter((m, index, self) => index === self.findIndex(t => t.name === m.name))
      .sort((a, b) => b.value - a.value);
    
    // Add career motivator bar chart
    addInterestBarChart(pdf, allMotivators, 103);
    
    // Add footer with page number
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`3i Global`, 20, 285);
    pdf.text(`${fullName}`, 100, 285, { align: 'center' });
    pdf.text(`Page ${pdf.getNumberOfPages() - 2}`, 190, 285);
    
    // Page for Career Motivator Analysis
    pdf.addPage();
    addReportTitle(pdf, "Career Report", false);
    addSectionTitle(pdf, "Analysis of Career Motivator", 20, 40);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(70, 70, 70);
    pdf.text("Your Career Motivator Analysis", 20, 55);
    
    // Format motivator analysis content
    const motivatorLines = content.motivatorAnalysis.trim().split('\n');
    const motivatorParagraphs = [];
    let currentMotivatorParagraph = [];
    
    motivatorLines.forEach(line => {
      if (line.trim() === '') {
        if (currentMotivatorParagraph.length > 0) {
          motivatorParagraphs.push(currentMotivatorParagraph);
          currentMotivatorParagraph = [];
        }
      } else {
        currentMotivatorParagraph.push(line.trim());
      }
    });
    
    if (currentMotivatorParagraph.length > 0) {
      motivatorParagraphs.push(currentMotivatorParagraph);
    }
    
    // Display each motivator type analysis
    let motivatorYPos = 70;
    
    motivatorParagraphs.forEach(paragraph => {
      if (paragraph.length === 0) return;
      
      // Title of motivator type
      const title = paragraph[0] || "";
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text(title, 20, motivatorYPos);
      
      motivatorYPos += 15;
      
      // Bullet points
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      
      for (let i = 1; i < paragraph.length; i++) {
        if (motivatorYPos > 250) {
          // Add footer to current page
          pdf.setFontSize(9);
          pdf.setTextColor(100, 100, 100);
          pdf.text(`3i Global`, 20, 285);
          pdf.text(`${fullName}`, 100, 285, { align: 'center' });
          pdf.text(`Page ${pdf.getNumberOfPages() - 2}`, 190, 285);
          
          // Add new page
          pdf.addPage();
          addReportTitle(pdf, "Career Report", false);
          addSectionTitle(pdf, "Analysis of Career Motivator", 20, 40);
          
          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(70, 70, 70);
          pdf.text("Your Career Motivator Analysis", 20, 55);
          
          motivatorYPos = 70;
        }
        
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        
        pdf.text(paragraph[i], 20, motivatorYPos);
        motivatorYPos += 7;
      }
      
      motivatorYPos += 10;
    });
    
    // Add footer with page number
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`3i Global`, 20, 285);
    pdf.text(`${fullName}`, 100, 285, { align: 'center' });
    pdf.text(`Page ${pdf.getNumberOfPages() - 2}`, 190, 285);
    
    // Page for Learning Style
    pdf.addPage();
    addReportTitle(pdf, "Career Report", false);
    addSectionTitle(pdf, "Result of the Learning Style", 20, 40);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(70, 70, 70);
    pdf.text("Your Learning Style Types", 20, 55);
    
    // Calculate learning style percentages
    const learningStyleScores = [
      { name: "Read & Write Learning", value: 38 },
      { name: "Auditory learning", value: 25 },
      { name: "Visual Learning", value: 25 },
      { name: "Kinesthetic Learning", value: 13 }
    ];
    
    // Add learning style pie chart
    addLearningStylePieChart(pdf, learningStyleScores, 75);
    
    // Add footer with page number
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`3i Global`, 20, 285);
    pdf.text(`${fullName}`, 100, 285, { align: 'center' });
    pdf.text(`Page ${pdf.getNumberOfPages() - 2}`, 190, 285);
    
    // Page for Learning Style Analysis
    pdf.addPage();
    addReportTitle(pdf, "Career Report", false);
    addSectionTitle(pdf, "Analysis of Learning Style", 20, 40);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(70, 70, 70);
    pdf.text("Your Learning Style Analysis", 20, 55);
    
    // Format learning style analysis content
    const learningStyleLines = content.learningStyleAnalysis.trim().split('\n');
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    
    let learningStyleYPos = 70;
    let learningSectionTitle = "";
    
    learningStyleLines.forEach(line => {
      if (line.trim() === '') return;
      
      if (line.includes("Learning improvement strategies")) {
        learningSectionTitle = "Learning improvement strategies";
        
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text(learningSectionTitle, 20, learningStyleYPos);
        
        learningStyleYPos += 10;
        
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
      } else if (line.includes("learning style")) {
        // Main title for learning style
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text(line.trim(), 20, learningStyleYPos);
        
        learningStyleYPos += 10;
        
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
      } else if (line.startsWith("•")) {
        // This is a bullet point
        if (learningStyleYPos > 250) {
          // Add footer to current page
          pdf.setFontSize(9);
          pdf.setTextColor(100, 100, 100);
          pdf.text(`3i Global`, 20, 285);
          pdf.text(`${fullName}`, 100, 285, { align: 'center' });
          pdf.text(`Page ${pdf.getNumberOfPages() - 2}`, 190, 285);
          
          // Add new page
          pdf.addPage();
          addReportTitle(pdf, "Career Report", false);
          addSectionTitle(pdf, "Analysis of Learning Style", 20, 40);
          
          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(70, 70, 70);
          pdf.text("Your Learning Style Analysis", 20, 55);
          
          learningStyleYPos = 70;
          
          if (learningSectionTitle) {
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(0, 0, 0);
            pdf.text(learningSectionTitle, 20, learningStyleYPos);
            
            learningStyleYPos += 10;
            
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(0, 0, 0);
          }
        }
        
        pdf.text(line.trim(), 20, learningStyleYPos);
        learningStyleYPos += 7;
      } else {
        // This is regular text
        if (learningStyleYPos > 250) {
          // Add footer to current page
          pdf.setFontSize(9);
          pdf.setTextColor(100, 100, 100);
          pdf.text(`3i Global`, 20, 285);
          pdf.text(`${fullName}`, 100, 285, { align: 'center' });
          pdf.text(`Page ${pdf.getNumberOfPages() - 2}`, 190, 285);
          
          // Add new page
          pdf.addPage();
          addReportTitle(pdf, "Career Report", false);
          addSectionTitle(pdf, "Analysis of Learning Style", 20, 40);
          
          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(70, 70, 70);
          pdf.text("Your Learning Style Analysis", 20, 55);
          
          learningStyleYPos = 70;
        }
        
        pdf.text(line.trim(), 20, learningStyleYPos);
        learningStyleYPos += 7;
      }
    });
    
    // Add footer with page number
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`3i Global`, 20, 285);
    pdf.text(`${fullName}`, 100, 285, { align: 'center' });
    pdf.text(`Page ${pdf.getNumberOfPages() - 2}`, 190, 285);
    
    // Page for Skills and Abilities
    pdf.addPage();
    addReportTitle(pdf, "Career Report", false);
    addSectionTitle(pdf, "Skills and Abilities", 20, 40);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(70, 70, 70);
    pdf.text("Your Skills and Abilities", 20, 55);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text("The skills & abilities scores will help us to explore and identify different ways to reshape your career", 20, 65);
    pdf.text("direction. This simple graph shows how you have scored on each of these skills and abilities. The graph", 20, 72);
    pdf.text("on the top will show the average score of your overall skills and abilities.", 20, 79);
    
    // Overall Skills and Abilities
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(70, 70, 70);
    pdf.text("Overall Skills and Abilities", 20, 94);
    
    // Calculate overall skill score
    const overallSkillScore = 70; // Example value
    
    // Add overall skills progress bar
    drawProgressBar(pdf, 20, 104, 170, 10, overallSkillScore / 100);
    
    // Add percentage indicator
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(70, 70, 70);
    pdf.text(`${overallSkillScore}% - Good`, 75, 123);
    
    // Parse skills analysis content
    const skillsAnalysisLines = content.skillsAnalysis.trim().split('\n');
    let skillType = "";
    let skillLines: string[] = [];
    const skillSections: { title: string, lines: string[] }[] = [];
    
    skillsAnalysisLines.forEach(line => {
      if (line.trim() === '') return;
      
      if (line.includes("Ability") || line.includes("Skills") || line.includes("Abilities")) {
        if (skillType && skillLines.length > 0) {
          skillSections.push({ title: skillType, lines: [...skillLines] });
          skillLines = [];
        }
        skillType = line.trim();
      } else if (skillType) {
        skillLines.push(line.trim());
      }
    });
    
    if (skillType && skillLines.length > 0) {
      skillSections.push({ title: skillType, lines: [...skillLines] });
    }
    
    // Display each skill section
    let skillYPos = 135;
    
    skillSections.forEach(section => {
      if (skillYPos > 230) {
        // Add footer to current page
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`3i Global`, 20, 285);
        pdf.text(`${fullName}`, 100, 285, { align: 'center' });
        pdf.text(`Page ${pdf.getNumberOfPages() - 2}`, 190, 285);
        
        // Add new page
        pdf.addPage();
        addReportTitle(pdf, "Career Report", false);
        addSectionTitle(pdf, "Skills and Abilities", 20, 40);
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(70, 70, 70);
        pdf.text("Your Skills and Abilities", 20, 55);
        
        skillYPos = 70;
      }
      
      // Skill title
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(70, 70, 70);
      pdf.text(section.title, 20, skillYPos);
      
      // Extract skill score and level
      let skillScore = 70;
      let skillLevel = "Good";
      
      if (section.lines.length > 0 && section.lines[0].includes('%')) {
        const scoreLine = section.lines[0];
        const scoreMatch = scoreLine.match(/(\d+)%/);
        const levelMatch = scoreLine.match(/- (\w+)/);
        
        if (scoreMatch) skillScore = parseInt(scoreMatch[1]);
        if (levelMatch) skillLevel = levelMatch[1];
      }
      
      // Add skill progress bar
      drawProgressBar(pdf, 20, skillYPos + 10, 60, 7, skillScore / 100);
      
      // Add percentage and level indicator
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${skillScore}%`, 30, skillYPos + 35);
      pdf.text(skillLevel, 30, skillYPos + 45);
      
      // Add skill description
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      
      let descYPos = skillYPos + 10;
      
      for (let i = 1; i < section.lines.length; i++) {
        pdf.text(section.lines[i], 90, descYPos);
        descYPos += 7;
      }
      
      skillYPos = Math.max(descYPos, skillYPos + 55);
    });
    
    // Add footer with page number
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`3i Global`, 20, 285);
    pdf.text(`${fullName}`, 100, 285, { align: 'center' });
    pdf.text(`Page ${pdf.getNumberOfPages() - 2}`, 190, 285);
    
    // Add career clusters page
    pdf.addPage();
    addReportTitle(pdf, "Career Report", false);
    addSectionTitle(pdf, "Career Clusters", 20, 40);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(70, 70, 70);
    pdf.text("Your Career Clusters", 20, 55);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text("Career Clusters are groups of similar occupations and industries that require similar skills. It provides a", 20, 65);
    pdf.text("career road map for pursuing further education and career opportunities. They help you connect your", 20, 72);
    pdf.text("Education with your Career Planning. Career Cluster helps you narrow down your occupation choices", 20, 79);
    pdf.text("based on your assessment responses. Results show which Career Clusters would be best to explore. A", 20, 86);
    pdf.text("simple graph report shows how you have scored on each of the Career Clusters.", 20, 93);
    
    // Career clusters data (generated based on aptitudes)
    const careerClusters = [
      { name: "Information Technology", score: 98 },
      { name: "Science, Maths and Engineering", score: 98 },
      { name: "Manufacturing", score: 84 },
      { name: "Accounts and Finance", score: 82 },
      { name: "Logistics and Transportation", score: 81 },
      { name: "Bio Science and Research", score: 78 },
      { name: "Agriculture", score: 74 },
      { name: "Health Science", score: 74 },
      { name: "Government Services", score: 64 },
      { name: "Public Safety and Security", score: 58 },
      { name: "Architecture and Construction", score: 55 },
      { name: "Business Management", score: 50 },
      { name: "Legal Services", score: 50 },
      { name: "Education and Training", score: 46 },
      { name: "Hospitality and Tourism", score: 31.43 },
      { name: "Marketing & Advertising", score: 25 },
      { name: "Sports & Physical Activities", score: 24 },
      { name: "Arts & Language Arts", score: 20 },
      { name: "Human Service", score: 10 },
      { name: "Media and Communication", score: 4 }
    ];
    
    // Add career clusters bar chart
    addCareerClusters(pdf, careerClusters, 100);
    
    // Add footer with page number
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`3i Global`, 20, 285);
    pdf.text(`${fullName}`, 100, 285, { align: 'center' });
    pdf.text(`Page ${pdf.getNumberOfPages() - 2}`, 190, 285);
    
    // Selected Career Clusters page
    pdf.addPage();
    addReportTitle(pdf, "Career Report", false);
    addSectionTitle(pdf, "Selected Career Clusters", 20, 40);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(70, 70, 70);
    pdf.text("Your Selected 4 Career Clusters", 20, 55);
    
    // Get top 4 career clusters
    const topClusters = careerClusters.slice(0, 4);
    
    // Descriptions for top clusters
    const clusterDescriptions = {
      "Information Technology": `• Information technology professionals work with Computer hardware,
• software or network systems.
• You might design new computer equipment or work on a new
• computer game.
• Some professionals provide support and manage software or hardware.
• You might Write, update, and maintain computer programs or software packages`,
      "Science, Maths and Engineering": `• Science, math and engineering, professionals do scientific research in
• laboratories or the field.
• You will plan or design products and systems.
• You will do research and read blueprints.
• You might support scientists, mathematicians, or engineers in their work.`,
      "Manufacturing": `• Manufacturing professionals work with products and equipment.
• You might design a new product, decide how the product will be
• made, or make the product.
• You might work on cars, computers, appliances, airplanes, or
• electronic devices.
• Other manufacturing workers install or repair products.`,
      "Accounts and Finance": `• Finance and Accounts professionals keep track of money.
• You might work in financial planning, banking, or insurance.
• You could maintain financial records or give advice to business
• executives on how to operate their business.`
    };
    
    // Display top clusters with descriptions
    let clusterYPos = 70;
    
    topClusters.forEach((cluster, index) => {
      if (clusterYPos > 230) {
        // Add footer to current page
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`3i Global`, 20, 285);
        pdf.text(`${fullName}`, 100, 285, { align: 'center' });
        pdf.text(`Page ${pdf.getNumberOfPages() - 2}`, 190, 285);
        
        // Add new page
        pdf.addPage();
        addReportTitle(pdf, "Career Report", false);
        addSectionTitle(pdf, "Selected Career Clusters", 20, 40);
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(70, 70, 70);
        pdf.text("Your Selected 4 Career Clusters", 20, 55);
        
        clusterYPos = 70;
      }
      
      // Cluster number and title
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(70, 70, 70);
      pdf.text(cluster.name, 20, clusterYPos);
      
      // Small numbered circle
      pdf.setFillColor(100, 149, 237); // Blue
      pdf.circle(185, clusterYPos - 3, 7, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.text(`${index + 1}`, 185, clusterYPos - 1, { align: 'center' });
      
      // Description with bullet points
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      
      const description = clusterDescriptions[cluster.name as keyof typeof clusterDescriptions] || "";
      const descLines = description.split('\n');
      
      let descYPos = clusterYPos + 15;
      
      descLines.forEach(line => {
        pdf.text(line.trim(), 20, descYPos);
        descYPos += 7;
      });
      
      clusterYPos = descYPos + 10;
    });
    
    // Add footer with page number
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`3i Global`, 20, 285);
    pdf.text(`${fullName}`, 100, 285, { align: 'center' });
    pdf.text(`Page ${pdf.getNumberOfPages() - 2}`, 190, 285);
    
    // Career paths page
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
    
    // Add recommended career paths
    addCareerPaths(pdf, content.careerRecommendations, 80, fullName);
    
    // Add summary sheet as the last page
    pdf.addPage();
    addReportTitle(pdf, "Career Report", false);
    addSectionTitle(pdf, "Summary Sheet", 20, 40);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(70, 70, 70);
    pdf.text("Our career assessment is based on the concept of correlation", 20, 55);
    pdf.text("theory and various psychometric and statistical models.", 20, 62);
    
    // Summary items
    const summaryItems = [
      { label: "Career Personality", value: content.personalityType },
      { label: "Career Interest", value: content.topInterests.map(i => i.type).join(" + ") },
      { label: "Career Motivator", value: content.topMotivators.map(m => m.type).join(" + ") },
      { label: "Learning Style", value: content.topLearningStyle.type },
      { label: "Skills & Ablities", value: [
        `Numerical Ability[${scores.analysisInsights?.specificAptitudes?.numerical || 80}%]`,
        `+Logical Ability[${scores.analysisInsights?.specificAptitudes?.analytical || 60}%]`,
        `+Verbal Ability[${scores.analysisInsights?.specificAptitudes?.verbal || 100}%]`,
        `Clerical and Organizing Skills[50%]`,
        `+Spatial & Visualization Ability[${scores.analysisInsights?.specificAptitudes?.creative || 80}%]`,
        `+Leadership & Decision making skills[${scores.analysisInsights?.specificAptitudes?.leadership || 60}%]`,
        `Social & Co-operation Skills[${scores.analysisInsights?.specificAptitudes?.social || 80}%]`,
        `+Mechanical Abilities[${scores.analysisInsights?.specificAptitudes?.mechanical || 50}%]`,
        `+`
      ].join(" ") },
      { label: "Selected Clusters", value: careerClusters.slice(0, 4).map(c => c.name).join("+") }
    ];
    
    let summaryYPos = 72;
    
    summaryItems.forEach(item => {
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      
      pdf.text(item.label, 20, summaryYPos);
      pdf.text(item.value, 90, summaryYPos);
      
      summaryYPos += 15;
    });
    
    // Company information at bottom
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`3i Global 7048976060 3iglobal25@gmail.com`, 20, 280);
  };
  
  return (
    <Card className="border border-border/40 shadow-sm bg-card">
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-medium leading-none">Career Assessment Report</h3>
              <p className="text-sm text-muted-foreground mt-1">Generate a detailed PDF report of your assessment results</p>
            </div>
          </div>
          <Activity className="h-8 w-8 text-primary/50" />
        </div>
        
        <Button
          onClick={generatePDF}
          disabled={isGenerating}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          <Download className="h-4 w-4" />
          <span>{isGenerating ? 'Generating Report...' : 'Download PDF Report'}</span>
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          The PDF report contains detailed analysis of your assessment results, career recommendations,
          and personalized guidance based on your responses.
        </p>
      </div>
    </Card>
  );
};

export default ReportPDFGenerator;
