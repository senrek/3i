import { supabase } from '@/integrations/supabase/client';

interface CareerCluster {
  name: string;
  value: number;
  occupations: string[];
  description: string;
  skills: string[];
  educationPaths: string[];
}

export async function generateCareerClusters(responses: Record<string, string>): Promise<CareerCluster[]> {
  try {
    // Convert responses to a meaningful prompt
    const userResponseSummary = Object.entries(responses)
      .map(([question, answer]) => `${question}: ${answer}`)
      .join('\n');

    // Call Supabase Edge Function for AI processing
    const { data, error } = await supabase.functions.invoke('generate-career-clusters', {
      body: {
        responses: userResponseSummary,
        context: `
          Consider the following aspects for Indian job market:
          - Current industry trends in India
          - Growing sectors in Indian economy
          - Local job market demands
          - Required qualifications in Indian context
          - Salary ranges in Indian market
          - Career growth opportunities
          - Required skills and certifications
          - Education pathways available in India
        `
      }
    });

    if (error) {
      throw error;
    }

    return data.clusters;
  } catch (error) {
    console.error('Error generating career clusters:', error);
    return [];
  }
} 