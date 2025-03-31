import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openrouterApiKey = Deno.env.get('OPENROUTER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contentType, assessmentData } = await req.json();
    
    if (!contentType || !assessmentData) {
      throw new Error('Content type and assessment data are required');
    }
    
    // Set up prompts based on content type
    let prompt = '';
    let systemMessage = 'You are an Indian career counselor with Experience of 15 Years helping to generate personalized content for a career assessment report. Format your response as a comprehensive PDF section that could be included in a formal career assessment report. Use formal language and structure the information professionally.';
    
    // Get user profile information
    const userName = assessmentData.userName || 'Student';
    const userAge = assessmentData.age || '16-18'; // Default age range if not provided
    const userLocation = assessmentData.location || 'India'; // Default location if not provided
    const userEmail = assessmentData.email || 'Not provided';
    const userPhone = assessmentData.phone || 'Not provided';
    const completedDate = assessmentData.completedAt ? new Date(assessmentData.completedAt).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : (new Date()).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    
    const topCareerTitle = assessmentData.topCareer?.careerTitle || "Not specified";
    const topCareerMatch = assessmentData.topCareer?.suitabilityPercentage || 85;
    const topCareerDescription = assessmentData.topCareer?.careerDescription || "";
    
    // Calculate personality type based on scores
    const getPersonalityType = (personality, aptitude, interest) => {
      let type = "";
      
      // Extrovert vs Introvert
      type += personality > 70 ? "Extrovert" : "Introvert";
      
      // Sensing vs Intuitive
      type += aptitude > 65 ? ":Sensing" : ":iNtuitive";
      
      // Thinking vs Feeling
      type += aptitude > interest ? ":Thinking" : ":Feeling";
      
      // Judging vs Perceiving
      type += personality > 60 ? ":Judging" : ":Perceiving";
      
      return type;
    };
    
    // Prep assessment data for formatting
    const personalityType = getPersonalityType(
      assessmentData.scores.personality,
      assessmentData.scores.aptitude,
      assessmentData.scores.interest
    );
    
    // Calculate personalized strength percentages
    const strengthPercentages = {
      introvert: assessmentData.scores.personality < 60 ? Math.round(100 - assessmentData.scores.personality * 0.8) : 14,
      extrovert: assessmentData.scores.personality > 60 ? Math.round(assessmentData.scores.personality * 0.8) : 14,
      sensing: assessmentData.scores.aptitude > 65 ? Math.round(assessmentData.scores.aptitude * 0.9) : 14,
      intuitive: assessmentData.scores.aptitude < 65 ? Math.round(100 - assessmentData.scores.aptitude * 0.9) : 14,
      thinking: assessmentData.scores.aptitude > assessmentData.scores.interest ? Math.round(70 + Math.random() * 10) : 29,
      feeling: assessmentData.scores.aptitude < assessmentData.scores.interest ? Math.round(70 + Math.random() * 10) : 29,
      judging: assessmentData.scores.personality > 60 ? Math.round(55 + Math.random() * 10) : 43,
      perceiving: assessmentData.scores.personality < 60 ? Math.round(55 + Math.random() * 10) : 43
    };
    
    // Format career interest types
    const interestTypes = [
      { name: 'Investigative', value: Math.round(assessmentData.scores.aptitude * 1.2) },
      { name: 'Conventional', value: Math.round(assessmentData.scores.personality * 0.6) },
      { name: 'Realistic', value: Math.round(assessmentData.scores.aptitude * 0.6) },
      { name: 'Enterprising', value: Math.round(assessmentData.scores.personality * 0.4) },
      { name: 'Artistic', value: Math.round(assessmentData.scores.interest * 0.3) },
      { name: 'Social', value: Math.round(assessmentData.scores.personality * 0.15) }
    ].sort((a, b) => b.value - a.value);
    
    // Format motivator types
    const motivatorTypes = [
      { name: 'Independence', value: Math.min(100, Math.round((100 - assessmentData.scores.personality) * 1.1)) },
      { name: 'Continuous Learning', value: Math.min(100, Math.round(assessmentData.scores.aptitude * 1.1)) },
      { name: 'Social Service', value: Math.min(100, Math.round(assessmentData.scores.personality * 1.1)) },
      { name: 'Structured work environment', value: Math.round(assessmentData.scores.personality * 0.5) },
      { name: 'Adventure', value: Math.round(assessmentData.scores.interest * 0.5) },
      { name: 'High Paced Environment', value: Math.round(assessmentData.scores.aptitude * 0.3) },
      { name: 'Creativity', value: Math.round(assessmentData.scores.interest * 0.25) }
    ].sort((a, b) => b.value - a.value);
    
    // Format learning style types
    const learningStyles = [
      { name: 'Read & Write Learning', value: Math.round(assessmentData.scores.aptitude * 0.5) },
      { name: 'Auditory learning', value: Math.round(assessmentData.scores.personality * 0.3) },
      { name: 'Visual Learning', value: Math.round(assessmentData.scores.interest * 0.3) },
      { name: 'Kinesthetic Learning', value: Math.round(assessmentData.scores.learningStyle * 0.2) }
    ].sort((a, b) => b.value - a.value);
    
    // Format skills
    const skillsAndAbilities = {
      overall: Math.round(assessmentData.scores.aptitude * 0.7),
      numerical: Math.round(assessmentData.scores.aptitude * 0.8),
      logical: Math.round(assessmentData.scores.aptitude * 0.6),
      verbal: Math.round(assessmentData.scores.personality * 1.2 > 100 ? 100 : assessmentData.scores.personality * 1.2),
      clerical: Math.round(assessmentData.scores.personality * 0.5),
      spatial: Math.round(assessmentData.scores.aptitude * 0.8),
      leadership: Math.round(assessmentData.scores.personality * 0.6),
      social: Math.round(assessmentData.scores.personality * 0.8),
      mechanical: Math.round(assessmentData.scores.aptitude * 0.5)
    };

    // Calculate skill level labels
    const getSkillLevel = (score) => {
      if (score >= 80) return "Excellent";
      if (score >= 65) return "Good";
      if (score >= 50) return "Average";
      return "Below Average";
    };
    
    switch (contentType) {
      case 'skills':
        prompt = `Generate a detailed "Skills and Abilities" section for a career assessment report based on the following data:
        
        Student Info:
        - Name: ${userName}
        - Assessment Date: ${completedDate}
        
        Skills Assessment:
        - Overall Skills: ${skillsAndAbilities.overall}% (${getSkillLevel(skillsAndAbilities.overall)})
        - Numerical Ability: ${skillsAndAbilities.numerical}% (${getSkillLevel(skillsAndAbilities.numerical)})
        - Logical Ability: ${skillsAndAbilities.logical}% (${getSkillLevel(skillsAndAbilities.logical)})
        - Verbal Ability: ${skillsAndAbilities.verbal}% (${getSkillLevel(skillsAndAbilities.verbal)})
        - Organizing Skills: ${skillsAndAbilities.clerical}% (${getSkillLevel(skillsAndAbilities.clerical)})
        - Visualization Ability: ${skillsAndAbilities.spatial}% (${getSkillLevel(skillsAndAbilities.spatial)})
        - Leadership Skills: ${skillsAndAbilities.leadership}% (${getSkillLevel(skillsAndAbilities.leadership)})
        - Social Skills: ${skillsAndAbilities.social}% (${getSkillLevel(skillsAndAbilities.social)})
        - Mechanical Ability: ${skillsAndAbilities.mechanical}% (${getSkillLevel(skillsAndAbilities.mechanical)})
        
        Format this as a comprehensive analysis of the student's skills and abilities. Include:
        1. Overall skill level assessment
        2. Detailed analysis of each skill category
        3. Recommendations for skill development
        4. How these skills align with potential career paths
        
        Write in a professional, formal tone suitable for an official assessment document. Make it personalized and actionable.`;
        break;

      case 'careerClusters':
        prompt = `Generate a detailed "Career Clusters" analysis based on the following assessment data:
        
        Student Info:
        - Name: ${userName}
        - Assessment Date: ${completedDate}
        
        Assessment Results:
        - Aptitude Score: ${assessmentData.scores.aptitude}
        - Personality Score: ${assessmentData.scores.personality}
        - Interest Score: ${assessmentData.scores.interest}
        - Personality Type: ${personalityType}
        
        Career Interest Types:
        ${interestTypes.map(t => `- ${t.name}: ${t.value}`).join('\n')}
        
        Skills Assessment:
        ${Object.entries(skillsAndAbilities).map(([key, value]) => `- ${key}: ${value}% (${getSkillLevel(value)})`).join('\n')}
        
        Format this as a comprehensive analysis of suitable career clusters. Include:
        1. Top recommended career clusters based on assessment results
        2. Why these clusters are suitable (based on personality, interests, and skills)
        3. Specific roles within each cluster
        4. Required skills and qualifications for each cluster
        
        Make it detailed, specific, and actionable.`;
        break;

      case 'careerInterest':
        prompt = `Generate a detailed "Career Interest Types" analysis based on the following data:
        
        Student Info:
        - Name: ${userName}
        - Assessment Date: ${completedDate}
        
        Career Interest Types:
        ${interestTypes.map(t => `- ${t.name}: ${t.value}`).join('\n')}
        
        Personality Type: ${personalityType}
        
        Format this as a comprehensive analysis of the student's career interests. Include:
        1. Detailed analysis of top 3 interest types
        2. How these interests align with personality type
        3. Specific career paths that match these interests
        4. Recommendations for exploring these interests further
        
        Make it personalized and actionable, focusing on practical next steps.`;
        break;

      case 'careerMotivator':
        prompt = `Generate a detailed "Career Motivator Types" analysis based on the following data:
        
        Student Info:
        - Name: ${userName}
        - Assessment Date: ${completedDate}
        
        Career Motivator Types:
        ${motivatorTypes.map(t => `- ${t.name}: ${t.value}`).join('\n')}
        
        Personality Type: ${personalityType}
        
        Format this as a comprehensive analysis of what motivates the student in their career choices. Include:
        1. Analysis of top 3 motivator types
        2. How these motivators align with personality type
        3. Work environments and roles that match these motivators
        4. Recommendations for finding career paths that satisfy these motivators
        
        Make it personalized and actionable, with specific examples and recommendations.`;
        break;

      case 'careerRecommendation':
        prompt = `Generate a detailed career recommendation section for a career assessment report based on the following data:
        
        Student Info:
        - Name: ${userName}
        - Email: ${userEmail}
        - Age: ${userAge}
        - Location: ${userLocation}
        - Assessment Date: ${completedDate}
        
        Assessment Data:
        - Aptitude Score: ${assessmentData.scores.aptitude}
        - Personality Score: ${assessmentData.scores.personality}
        - Interest Score: ${assessmentData.scores.interest}
        - Learning Style Score: ${assessmentData.scores.learningStyle}
        - Personality Type: ${personalityType}
        - Strengths: ${assessmentData.strengthAreas.join(', ')}
        - Development Areas: ${assessmentData.developmentAreas.join(', ')}
        
        Career Interest Types:
        ${interestTypes.map(t => `- ${t.name}: ${t.value}`).join('\n')}
        
        Top Career Match: ${topCareerTitle} (${topCareerMatch}% match)
        
        Format your response in the style of a professional career assessment report with sections including:
        1. Career Path Overview
        2. Why This Career Path Suits You
        3. Key Skills Required
        4. Day-to-Day Responsibilities
        5. Growth Prospects
        
        The content should be highly personalized to the student based on their assessment results. Make it formal, detailed, and actionable with specific information, not generic advice. Write around 500-600 words.`;
        break;
      
      case 'educationPathways':
        prompt = `Generate a detailed education pathways section for a career assessment report based on the following data:
        
        Student Info:
        - Name: ${userName}
        - Email: ${userEmail}
        - Age: ${userAge}
        - Location: ${userLocation}
        - Assessment Date: ${completedDate}
        
        Assessment Data:
        - Aptitude Score: ${assessmentData.scores.aptitude}
        - Personality Score: ${assessmentData.scores.personality}
        - Interest Score: ${assessmentData.scores.interest}
        - Learning Style Score: ${assessmentData.scores.learningStyle}
        - Personality Type: ${personalityType}
        - Strengths: ${assessmentData.strengthAreas.join(', ')}
        - Development Areas: ${assessmentData.developmentAreas.join(', ')}
        
        Top Career Match: ${topCareerTitle} (${topCareerMatch}% match)
        
        Format your response as an "Educational Pathways" section of a formal career assessment report focusing on:
        1. Required Education and Qualifications (degrees, diplomas, certifications)
        2. Recommended Universities/Institutions in ${userLocation} or internationally
        3. Alternative Educational Routes (part-time, online, vocational)
        4. Recommended Subjects and Specializations
        5. Timeline for Educational Milestones (high school to career entry)
        
        Make the content highly specific to both the career field and the student's assessment results. Consider their learning style preferences when recommending educational approaches. Include specific institution names, course names, and estimated timelines. Write approximately 500-600 words.`;
        break;
      
      case 'alternativeCareers':
        prompt = `Generate an "Alternative Career Paths" section for a career assessment report based on the following data:
        
        Student Info:
        - Name: ${userName}
        - Email: ${userEmail}
        - Age: ${userAge}
        - Location: ${userLocation}
        - Assessment Date: ${completedDate}
        
        Assessment Data:
        - Aptitude Score: ${assessmentData.scores.aptitude}
        - Personality Score: ${assessmentData.scores.personality}
        - Interest Score: ${assessmentData.scores.interest}
        - Learning Style Score: ${assessmentData.scores.learningStyle}
        - Personality Type: ${personalityType}
        - Strengths: ${assessmentData.strengthAreas.join(', ')}
        - Development Areas: ${assessmentData.developmentAreas.join(', ')}
        
        Career Interest Types:
        ${interestTypes.map(t => `- ${t.name}: ${t.value}`).join('\n')}
        
        Top Career Match: ${topCareerTitle}
        
        Format your response as an "Alternative Career Paths" section for a formal career assessment report that recommends 3-4 alternative careers that match the student's profile but differ from their primary recommendation. For each alternative career:
        
        1. Name and brief description of the career
        2. Why it suits their personality type, interests and aptitudes
        3. Key skills they already possess that transfer to this field
        4. Additional skills they would need to develop
        5. Education/qualification requirements
        6. Estimated salary range in ${userLocation}
        
        Use formal language appropriate for a professional report. Make specific, data-driven recommendations based on their assessment results. Write approximately 500-600 words.`;
        break;
      
      case 'developmentPlan':
        prompt = `Generate a comprehensive "Development Plan" section for a career assessment report based on the following data:
        
        Student Info:
        - Name: ${userName}
        - Email: ${userEmail}
        - Age: ${userAge}
        - Location: ${userLocation}
        - Assessment Date: ${completedDate}
        
        Assessment Data:
        - Aptitude Score: ${assessmentData.scores.aptitude}
        - Personality Score: ${assessmentData.scores.personality}
        - Interest Score: ${assessmentData.scores.interest}
        - Learning Style Score: ${assessmentData.scores.learningStyle}
        - Personality Type: ${personalityType}
        - Strengths: ${assessmentData.strengthAreas.join(', ')}
        - Development Areas: ${assessmentData.developmentAreas.join(', ')}
        
        Skills Assessment:
        - Overall Skills: ${skillsAndAbilities.overall}% (${getSkillLevel(skillsAndAbilities.overall)})
        - Numerical Ability: ${skillsAndAbilities.numerical}% (${getSkillLevel(skillsAndAbilities.numerical)})
        - Logical Ability: ${skillsAndAbilities.logical}% (${getSkillLevel(skillsAndAbilities.logical)})
        - Verbal Ability: ${skillsAndAbilities.verbal}% (${getSkillLevel(skillsAndAbilities.verbal)})
        - Organizing Skills: ${skillsAndAbilities.clerical}% (${getSkillLevel(skillsAndAbilities.clerical)})
        - Visualization Ability: ${skillsAndAbilities.spatial}% (${getSkillLevel(skillsAndAbilities.spatial)})
        - Leadership Skills: ${skillsAndAbilities.leadership}% (${getSkillLevel(skillsAndAbilities.leadership)})
        - Social Skills: ${skillsAndAbilities.social}% (${getSkillLevel(skillsAndAbilities.social)})
        - Mechanical Ability: ${skillsAndAbilities.mechanical}% (${getSkillLevel(skillsAndAbilities.mechanical)})
        
        Top Career Match: ${topCareerTitle}
        
        Format your response as a "Gap Analysis & Development Plan" section for a formal career assessment report with these components:
        
        1. Skills Gap Analysis (current skills vs. required skills for their recommended career)
        2. Short-Term Development Actions (next 6 months)
           - Specific courses, workshops, books, projects
           - Resources with actual names and links
        3. Medium-Term Development Actions (1-2 years)
           - Further education, certifications, internships
           - Specific milestones to achieve
        4. Long-Term Development Actions (3-5 years)
           - Advanced qualifications, career progression steps
           - Networking and professional development
        5. Development Resources
           - Recommended websites, organizations, mentorship opportunities
        
        Make the plan highly actionable with specific resources, timelines, and measurable outcomes. Tailor all recommendations to their specific assessment results, addressing their development areas while leveraging their strengths. Write approximately 600-700 words.`;
        break;
      
      case 'executiveSummary':
        prompt = `Generate an "Executive Summary" section for a comprehensive career assessment report based on the following data:
        
        Student Info:
        - Name: ${userName}
        - Email: ${userEmail}
        - Age: ${userAge}
        - Location: ${userLocation}
        - Assessment Date: ${completedDate}
        
        Assessment Data:
        - Aptitude Score: ${assessmentData.scores.aptitude}
        - Personality Score: ${assessmentData.scores.personality}
        - Interest Score: ${assessmentData.scores.interest}
        - Learning Style Score: ${assessmentData.scores.learningStyle}
        - Personality Type: ${personalityType}
        
        Personality Breakdown:
        - Introvert: ${strengthPercentages.introvert}% / Extrovert: ${strengthPercentages.extrovert}%
        - Sensing: ${strengthPercentages.sensing}% / Intuitive: ${strengthPercentages.intuitive}%
        - Thinking: ${strengthPercentages.thinking}% / Feeling: ${strengthPercentages.feeling}%
        - Judging: ${strengthPercentages.judging}% / Perceiving: ${strengthPercentages.perceiving}%
        
        Career Interest Types:
        ${interestTypes.map(t => `- ${t.name}: ${t.value}`).join('\n')}
        
        Career Motivator Types:
        ${motivatorTypes.map(t => `- ${t.name}: ${t.value}`).join('\n')}
        
        Learning Style Types:
        ${learningStyles.map(t => `- ${t.name}: ${t.value}`).join('\n')}
        
        Skills Assessment:
        - Overall Skills: ${skillsAndAbilities.overall}% (${getSkillLevel(skillsAndAbilities.overall)})
        - Numerical Ability: ${skillsAndAbilities.numerical}% (${getSkillLevel(skillsAndAbilities.numerical)})
        - Logical Ability: ${skillsAndAbilities.logical}% (${getSkillLevel(skillsAndAbilities.logical)})
        - Verbal Ability: ${skillsAndAbilities.verbal}% (${getSkillLevel(skillsAndAbilities.verbal)})
        - Organizing Skills: ${skillsAndAbilities.clerical}% (${getSkillLevel(skillsAndAbilities.clerical)})
        - Visualization Ability: ${skillsAndAbilities.spatial}% (${getSkillLevel(skillsAndAbilities.spatial)})
        - Leadership Skills: ${skillsAndAbilities.leadership}% (${getSkillLevel(skillsAndAbilities.leadership)})
        - Social Skills: ${skillsAndAbilities.social}% (${getSkillLevel(skillsAndAbilities.social)})
        - Mechanical Ability: ${skillsAndAbilities.mechanical}% (${getSkillLevel(skillsAndAbilities.mechanical)})
        
        Strengths: ${assessmentData.strengthAreas.join(', ')}
        Development Areas: ${assessmentData.developmentAreas.join(', ')}
        
        Top Career Recommendation: ${topCareerTitle}
        Career Description: ${topCareerDescription}
        
        Format this as a comprehensive "Executive Summary" section that would appear at the beginning of a formal career assessment report. The summary should synthesize all assessment findings into a coherent overview, including:
        
        1. Current Career Planning Stage (Ignorant, Confused, Diffused, Methodical, or Optimized based on their scores)
        2. Key Personality Insights
        3. Dominant Interest Areas and Motivators
        4. Preferred Learning Style
        5. Notable Strengths and Development Areas
        6. Primary Career Recommendation with brief justification
        
        Write in a professional, formal tone suitable for an official assessment document. Ensure all insights are directly tied to their assessment results. Write approximately 400-500 words.`;
        break;
      
      default:
        throw new Error('Invalid content type requested');
    }

    // Call DeepSeek API using OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1:free', // Using DeepSeek model
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000, // Increased max tokens for more detailed content
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('DeepSeek API error:', errorData);
      throw new Error(`DeepSeek API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      content: generatedContent,
      metadata: {
        userName,
        personalityType,
        strengthPercentages,
        interestTypes,
        motivatorTypes,
        learningStyles,
        skillsAndAbilities
      } 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating content:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
