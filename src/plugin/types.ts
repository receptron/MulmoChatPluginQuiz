/**
 * Quiz Types
 */

/** Single quiz question */
export interface QuizQuestion {
  question: string;
  choices: string[];
  correctAnswer?: number;
}

/** Quiz data stored in result.jsonData */
export interface QuizData {
  title?: string;
  questions: QuizQuestion[];
  userAnswers?: number[];
}

/** Arguments passed to the quiz tool */
export interface QuizArgs {
  title?: string;
  questions: QuizQuestion[];
}
