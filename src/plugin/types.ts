/**
 * Quiz Tool Definition and Types
 */

// ============================================================================
// Types
// ============================================================================

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

// ============================================================================
// Tool Definition
// ============================================================================

export const TOOL_NAME = "putQuestions";

export const TOOL_DEFINITION = {
  type: "function" as const,
  name: TOOL_NAME,
  description:
    "Present a set of multiple choice questions to test the user's knowledge or abilities. Each question should have 2-6 answer choices.",
  parameters: {
    type: "object" as const,
    properties: {
      title: {
        type: "string",
        description:
          "Optional title for the quiz (e.g., 'JavaScript Basics Quiz')",
      },
      questions: {
        type: "array",
        description: "Array of multiple choice questions",
        items: {
          type: "object",
          properties: {
            question: {
              type: "string",
              description: "The question text",
            },
            choices: {
              type: "array",
              description: "Array of answer choices (2-6 choices)",
              items: {
                type: "string",
              },
              minItems: 2,
              maxItems: 6,
            },
            correctAnswer: {
              type: "number",
              description:
                "Optional: The index of the correct answer (0-based). Include this if you want to track correct answers.",
            },
          },
          required: ["question", "choices"],
        },
        minItems: 1,
      },
    },
    required: ["questions"],
  },
};
