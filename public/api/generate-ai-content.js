
// Mock API endpoint for development
export default async function handler(req, res) {
  // This is a mock implementation - in production this calls the Supabase function
  try {
    if (req.method === 'POST') {
      const { contentType, assessmentData } = req.body;
      
      // Log the request for debugging
      console.log('Mock API called with content type:', contentType);
      
      // Generate sample content based on content type
      let generatedContent = '';
      
      switch (contentType) {
        case 'executiveSummary':
          generatedContent = `
# Your Personalized Career Assessment

Based on your assessment results, you show a strong alignment with careers in ${assessmentData?.scores?.careerRecommendations?.[0]?.careerTitle || 'Information Technology and Science'}.

Your profile indicates that you have significant strengths in ${assessmentData?.strengthAreas?.join(', ') || 'analytical thinking and problem solving'}. These strengths would serve you well in technically-oriented fields that require precision and attention to detail.

Areas you might want to develop include ${assessmentData?.developmentAreas?.join(', ') || 'interpersonal communication and leadership skills'}. Focusing on these areas will help round out your skill set and open more career opportunities.

The assessment shows that your learning style favors reading and writing, which means you absorb information best through text-based materials and written exercises. This learning preference is well-suited for academic pursuits and research-oriented fields.

Your personality profile indicates you tend toward a ${assessmentData?.scores?.personality > 70 ? 'outgoing and expressive' : 'thoughtful and reflective'} approach. This temperament can be leveraged effectively in careers that require ${assessmentData?.scores?.personality > 70 ? 'client interaction and team collaboration' : 'focused concentration and independent work'}.

Based on your overall profile, I would recommend exploring educational pathways in:
1. Computer Science or Information Technology
2. Engineering or Applied Sciences
3. Mathematics or Statistics
4. Research-oriented fields

Your next steps should include researching specific programs in these areas, connecting with professionals already working in these fields, and seeking opportunities for hands-on experience through internships or volunteer work.`;
          break;
          
        case 'developmentPlan':
          generatedContent = `
# Your Personal Development Plan

## Short-Term Goals (Next 6 Months)

Based on your assessment results, here are targeted actions to build on your strengths and address development areas:

1. **Technical Skill Enhancement**: Since you scored high in analytical thinking (${assessmentData?.scores?.aptitude || 85}%), enroll in an online course on programming or data analysis to formalize your natural abilities. Recommended courses: Introduction to Python or SQL for Beginners.

2. **Communication Practice**: To address your development area in interpersonal skills, join a public speaking club or communication workshop. Consider Toastmasters or similar organizations that provide structured speaking opportunities.

3. **Industry Knowledge**: Subscribe to 2-3 industry publications or podcasts related to ${assessmentData?.scores?.careerRecommendations?.[0]?.careerTitle || 'technology'} to build contextual understanding of your target field.

## Medium-Term Goals (6-18 Months)

1. **Certification Path**: Pursue a recognized certification in your field of interest. Based on your profile, consider ${assessmentData?.scores?.aptitude > 80 ? 'AWS Solutions Architect, CompTIA Network+, or PMP certification' : 'Google Analytics, Scrum Master, or Certified Associate in Project Management'}.

2. **Practical Application**: Complete at least one substantial project that demonstrates your skills. This could be a personal project, open source contribution, or volunteer opportunity.

3. **Networking Strategy**: Connect with at least 15 professionals in your target industry through LinkedIn, industry events, or informational interviews. Focus on building genuine relationships rather than immediate job opportunities.

## Long-Term Development (18+ Months)

1. **Advanced Education**: Consider whether an advanced degree or specialized training program would benefit your career trajectory. Based on your interests and aptitudes, ${assessmentData?.scores?.aptitude > 85 ? 'a Master\'s in Computer Science or Data Science' : 'specialized training in project management or business analytics'} could provide significant advantages.

2. **Leadership Development**: Begin taking on leadership roles in professional organizations or community projects to build the management experience that will become increasingly important as you advance.

3. **Personal Brand**: Develop your professional reputation through speaking engagements, publishing articles, or creating other content that establishes you as knowledgeable in your field.

Remember that this plan should be flexible and adapted as you gain experience and as your interests evolve. Regular reflection on your progress and goals is essential for continuing growth.`;
          break;
          
        default:
          generatedContent = 'No content generated for this type.';
      }
      
      // Return mock response
      return {
        content: generatedContent,
        metadata: {
          userName: assessmentData?.userName || 'Student',
          personalityType: 'Introvert:Sensing:Thinking:Judging',
          careerPlanningStage: 'Diffused',
          careerRisks: 'Career misalignment, career path misjudgment, wrong career path projections, unnecessary stress',
          careerActionPlan: 'Explore career path > Align your abilities and interests with the best possible career path > Realistic Execution Plan > Timely Review of Action Plan',
          strengthPercentages: {
            introvert: 86,
            extrovert: 14,
            sensing: 86,
            intuitive: 14,
            thinking: 71,
            feeling: 29,
            judging: 57,
            perceiving: 43
          }
        }
      };
    }
    
    throw new Error('Method not allowed');
  } catch (error) {
    console.error('Error in mock API:', error);
    return { error: error.message };
  }
}
