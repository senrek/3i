
/**
 * Calculate scores for a specific category of questions
 */
export const calculateCategoryScore = (
  categoryQuestions: any[], 
  answers: Record<string, string>
): number => {
  let score = 0;
  let totalPossibleScore = 0;
  
  categoryQuestions.forEach(question => {
    const answer = answers[question.id];
    if (!answer) return;
    
    // This is a simplified scoring system - in a real application, 
    // you would implement a more sophisticated scoring algorithm
    if (answer === 'A') score += 3;
    else if (answer === 'B') score += 2;
    else if (answer === 'C') score += 1;
    
    totalPossibleScore += 3;
  });
  
  return totalPossibleScore > 0 ? (score / totalPossibleScore) * 100 : 0;
};
