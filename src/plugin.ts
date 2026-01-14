/**
 * MulmoChat Quiz Plugin
 *
 * A plugin for presenting multiple choice quizzes to users.
 *
 * @example Basic usage
 * ```typescript
 * import { plugin } from "mulmochat-plugin-quiz";
 * // Use plugin directly
 * ```
 */

import type { ToolPlugin, ToolContext, ToolResult } from "./types";
import QuizView from "./views/QuizView.vue";
import QuizPreview from "./previews/QuizPreview.vue";

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

/** Quiz tool result type */
export type QuizResult = ToolResult<never, QuizData>;

// ============================================================================
// Constants
// ============================================================================

const TOOL_NAME = "putQuestions";

const TOOL_DEFINITION = {
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

// ============================================================================
// Plugin Implementation
// ============================================================================

const putQuestions = async (
  _context: ToolContext,
  args: QuizArgs,
): Promise<QuizResult> => {
  try {
    const { title, questions } = args;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      throw new Error("At least one question is required");
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question || typeof q.question !== "string") {
        throw new Error(`Question ${i + 1} must have a question text`);
      }
      if (!Array.isArray(q.choices) || q.choices.length < 2) {
        throw new Error(`Question ${i + 1} must have at least 2 choices`);
      }
      if (q.choices.length > 6) {
        throw new Error(`Question ${i + 1} cannot have more than 6 choices`);
      }
    }

    const quizData: QuizData = {
      title,
      questions,
    };

    return {
      message: `Quiz presented with ${questions.length} question${questions.length > 1 ? "s" : ""}`,
      jsonData: quizData,
      instructions:
        "The quiz has been presented to the user. Wait for the user to submit their answers. They will tell you their answers in text format.",
    };
  } catch (error) {
    console.error("Quiz creation error", error);
    return {
      message: `Quiz error: ${error instanceof Error ? error.message : "Unknown error"}`,
      instructions:
        "Acknowledge that there was an error creating the quiz and suggest trying again.",
    };
  }
};

// ============================================================================
// Export
// ============================================================================

/**
 * Quiz plugin instance
 */
export const plugin: ToolPlugin<never, QuizData, QuizArgs> = {
  toolDefinition: TOOL_DEFINITION,
  execute: putQuestions,
  generatingMessage: "Preparing quiz...",
  isEnabled: () => true,
  viewComponent: QuizView,
  previewComponent: QuizPreview,
};
