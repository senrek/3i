
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
    let systemMessage = 'You are an Indian career counselor with Experience of 15 Years helping to generate personalized content for a career assessment report. the reponse should humanly';
    
    switch (contentType) {
      case 'careerRecommendation':
        prompt = `Based on the following career assessment data of an Indian student, provide a detailed career recommendation specific to India’s job market, industries, and education landscape. Include specific information about why this career path is suitable, what the day-to-day responsibilities involve, and what skills are required to excel in this field.
        
        Assessment Data:
        - Aptitude Score: ${assessmentData.scores.aptitude}
        - Personality Score: ${assessmentData.scores.personality}
        - Interest Score: ${assessmentData.scores.interest}
        - Learning Style Score: ${assessmentData.scores.learningStyle}
        - Strengths: ${assessmentData.strengthAreas.join(', ')}
        - Development Areas: ${assessmentData.developmentAreas.join(', ')}
        
        Format your response as a career counselor would explain a primary career recommendation to a high school student (Class 11-12). Keep your response under 250 words.`;
        break;
      
      case 'educationPathways':
        prompt = `Based on the student’s career assessment below, design detailed educational pathways tailored to India’s education system and job market. Focus on affordability, regional accessibility, and industry demand. Include specific degrees, certifications, and Skill-Based Training that would be beneficial. Also mention any alternative educational routes for those who may not want to pursue traditional education.
        
        Assessment Data:
        - Aptitude Score: ${assessmentData.scores.aptitude}
        - Personality Score: ${assessmentData.scores.personality}
        - Interest Score: ${assessmentData.scores.interest}
        - Learning Style Score: ${assessmentData.scores.learningStyle}
        - Strengths: ${assessmentData.strengthAreas.join(', ')}
        - Development Areas: ${assessmentData.developmentAreas.join(', ')}
        - Top Career Match: ${assessmentData.topCareer?.careerTitle || "Not specified"}
        
        Format your response as a comprehensive yet concise educational roadmap for a high school student (Class 11-12). Include at least 3-4 specific educational pathways. Keep your response under 250 words.`;
        break;
      
      case 'alternativeCareers':
        prompt = `Based on the following assessment data, suggest 3 alternative career paths that may also suit this student, besides their top career match. For each alternative career, explain why it might be a good fit based on their assessment results, and mention 1-2 key skills needed for success in that field.
        
        Assessment Data:
        - Aptitude Score: ${assessmentData.scores.aptitude}
        - Personality Score: ${assessmentData.scores.personality}
        - Interest Score: ${assessmentData.scores.interest}
        - Learning Style Score: ${assessmentData.scores.learningStyle}
        - Strengths: ${assessmentData.strengthAreas.join(', ')}
        - Development Areas: ${assessmentData.developmentAreas.join(', ')}
        - Top Career Match: ${assessmentData.topCareer?.careerTitle || "Not specified"}
        
        Format your response as a career counselor presenting alternative options to a high school student (Class 11-12). Keep each career description brief but informative. Keep your total response under 300 words.`;
        break;
      
      case 'developmentPlan':
        prompt = `Based on the following assessment data, create a personalized development plan for the student. The plan should address their identified development areas and build upon their strengths. Include specific, actionable steps for short-term (next 6 months), medium-term (1-2 years), and long-term (3-5 years) development.
        
        Assessment Data:
        - Aptitude Score: ${assessmentData.scores.aptitude}
        - Personality Score: ${assessmentData.scores.personality}
        - Interest Score: ${assessmentData.scores.interest}
        - Learning Style Score: ${assessmentData.scores.learningStyle}
        - Strengths: ${assessmentData.strengthAreas.join(', ')}
        - Development Areas: ${assessmentData.developmentAreas.join(', ')}
        - Top Career Match: ${assessmentData.topCareer?.careerTitle || "Not specified"}
        
        Format your response as a structured development plan with clear timeframes and actionable steps. Keep your response under 350 words.`;
        break;
      
      case 'executiveSummary':
        prompt = `Based on the following assessment data, create an executive summary of the student's career assessment results. Highlight key findings about their aptitudes, interests, personality traits, and learning style. Explain how these findings relate to potential career paths.
        
        Assessment Data:
        - Aptitude Score: ${assessmentData.scores.aptitude}
        - Personality Score: ${assessmentData.scores.personality}
        - Interest Score: ${assessmentData.scores.interest}
        - Learning Style Score: ${assessmentData.scores.learningStyle}
        - Strengths: ${assessmentData.strengthAreas.join(', ')}
        - Development Areas: ${assessmentData.developmentAreas.join(', ')}
        - Response highlights: ${JSON.stringify(assessmentData.responseHighlights || {})}
        
        Format your response as a professional executive summary for a career assessment report. Keep your response under 200 words.`;
        break;
      
      default:
        throw new Error('Invalid content type requested');
    }

  
    // Call OpenRouter API for DeepSeek R1 Free
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://your-domain.com', // Required by OpenRouter
        'X-Title': 'Career Counselor AI' // Your application name
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1:free', // Correct model identifier
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
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

    return new Response(JSON.stringify({ content: generatedContent }), {
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
