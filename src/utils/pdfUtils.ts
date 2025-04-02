
import { jsPDF } from 'jspdf';

// Helper function to safely call roundedRect with proper validation
export const safeRoundedRect = (
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  style: string
) => {
  try {
    // Ensure all parameters are valid numbers and style is a string
    if (
      typeof x !== 'number' || isNaN(x) ||
      typeof y !== 'number' || isNaN(y) ||
      typeof width !== 'number' || isNaN(width) ||
      typeof height !== 'number' || isNaN(height) ||
      typeof radius !== 'number' || isNaN(radius)
    ) {
      console.warn('Invalid parameters passed to roundedRect', { x, y, width, height, radius, style });
      // Draw a regular rectangle instead as a fallback
      if (style === 'S') {
        doc.rect(x, y, width, height, 'S');
      } else {
        doc.rect(x, y, width, height, 'F');
      }
      return;
    }

    // Make sure style is either 'S' (stroke) or 'F' (fill)
    const validStyle = ['S', 'F'].includes(style) ? style : 'S';
    
    // Call the roundedRect function with validated parameters
    (doc as any).roundedRect(x, y, width, height, radius, radius, validStyle);
  } catch (error) {
    console.error('Error in roundedRect:', error);
    // Fallback to regular rectangle
    if (style === 'S') {
      doc.rect(x, y, width, height, 'S');
    } else {
      doc.rect(x, y, width, height, 'F');
    }
  }
};

// Helper function to get Y position from different return types
export const getYPosition = (position: number | { lastY: number }): number => {
  if (typeof position === 'number') {
    return position;
  } else if (position && typeof position === 'object' && 'lastY' in position) {
    return position.lastY;
  }
  return 0; // Default value if position is invalid
};

// Helper function to add a new page with proper Y position handling
export const addNewPage = (doc: jsPDF): number => {
  doc.addPage();
  return 20; // Return initial Y position for the new page
};

// Helper function to format career data based on student grade/class
export const getCareerRecommendationsForClass = (
  careers: any[],
  userClass: string | null | undefined
): any[] => {
  try {
    // If no careers data or invalid, return empty array
    if (!Array.isArray(careers) || careers.length === 0) {
      return [];
    }

    // For classes 8-10, simplify career descriptions and filter out complex careers
    if (userClass && ['8', '9', '10'].includes(userClass)) {
      return careers
        .filter(career => {
          // Filter out careers that might be too advanced for junior classes
          const advancedKeywords = ['research', 'engineering', 'analysis', 'statistical', 'management'];
          return !advancedKeywords.some(keyword => 
            (career.careerTitle || '').toLowerCase().includes(keyword) ||
            (career.careerDescription || '').toLowerCase().includes(keyword)
          );
        })
        .map(career => ({
          ...career,
          careerDescription: simplifyText(career.careerDescription || '', 8), // Simplify the text
          pathways: (career.pathways || []).slice(0, 2) // Limit to fewer pathways
        }))
        .slice(0, 5); // Limit to top 5 careers for junior students
    }
    
    return careers;
  } catch (error) {
    console.error('Error processing career recommendations:', error);
    return [];
  }
};

// Helper function to simplify text for younger students
export const simplifyText = (text: string, gradeLevel: number): string => {
  if (!text) return '';
  
  // Split into sentences
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  
  // For younger students, use fewer sentences
  const maxSentences = Math.min(2 + gradeLevel / 2, sentences.length);
  
  return sentences.slice(0, maxSentences).join('. ') + '.';
};
