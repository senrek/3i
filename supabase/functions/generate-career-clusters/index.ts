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
    const { responses, context } = await req.json();

    const prompt = `
      As an experienced Indian career counselor, analyze the following assessment responses and recommend career clusters 
      suitable for the Indian job market. Consider current trends, growth sectors, and local opportunities.
      
      Assessment Responses:
      ${responses}
      
      Context to consider:
      ${context}
      
      For each career cluster, provide:
      1. Cluster name
      2. Relevance score (0-100)
      3. List of specific occupations within this cluster that are in demand in India
      4. Brief description of the cluster
      5. Required skills and qualifications in Indian context
      6. Education pathways available in India
      
      Focus on practical, achievable careers in the Indian market, considering:
      - Current job market demands
      - Industry growth trends
      - Required qualifications
      - Typical salary ranges
      - Career growth potential
      - Local skill requirements
      
      Format the response as a JSON array of career clusters.
    `;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: [
          {
            role: "system",
            content: "You are an experienced Indian career counselor with deep knowledge of the Indian job market."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    const aiResponse = await response.json();
    
    // Parse and structure the AI response
    const clusters = JSON.parse(aiResponse.choices[0].message.content);

    return new Response(
      JSON.stringify({ clusters }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
}); 