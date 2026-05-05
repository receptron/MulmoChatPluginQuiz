/**
 * Quiz Plugin Types
 *
 * Quiz-specific type definitions only.
 * Common types should be imported directly from gui-chat-protocol.
 */

// ============================================================================
// Quiz-specific Types
// ============================================================================

/** Single quiz question */
export interface QuizQuestion {
  question: string;
  choices: string[];
  correctAnswer?: number;
}

/** Quiz data — set on both `result.data` (the view binds it; the
 *  protocol's render-eligibility signal) and `result.jsonData` (the
 *  LLM reads it back when the user answers). Same payload, two
 *  audiences. */
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
