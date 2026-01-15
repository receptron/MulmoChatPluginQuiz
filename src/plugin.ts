/**
 * MulmoChat Quiz Plugin
 *
 * A plugin for presenting multiple choice quizzes to users.
 *
 * @example Basic usage
 * ```typescript
 * import { plugin } from "@mulmochat-plugin/quiz";
 * import "@mulmochat-plugin/quiz/style.css";
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

const SAMPLES = [
  {
    name: "Geography Quiz",
    args: {
      title: "World Geography",
      questions: [
        {
          question: "What is the capital of France?",
          choices: ["London", "Berlin", "Paris", "Madrid"],
          correctAnswer: 2,
        },
        {
          question: "Which is the largest ocean?",
          choices: ["Atlantic", "Indian", "Arctic", "Pacific"],
          correctAnswer: 3,
        },
        {
          question: "Mount Everest is located in which mountain range?",
          choices: ["Alps", "Andes", "Himalayas", "Rockies"],
          correctAnswer: 2,
        },
      ],
    },
  },
  {
    name: "Science Quiz",
    args: {
      title: "Science Basics",
      questions: [
        {
          question: "Which planet is known as the Red Planet?",
          choices: ["Venus", "Mars", "Jupiter", "Saturn"],
          correctAnswer: 1,
        },
        {
          question: "What is the chemical symbol for water?",
          choices: ["O2", "CO2", "H2O", "NaCl"],
          correctAnswer: 2,
        },
        {
          question: "How many bones are in the adult human body?",
          choices: ["186", "206", "226", "246"],
          correctAnswer: 1,
        },
        {
          question: "What is the speed of light?",
          choices: [
            "300,000 km/s",
            "150,000 km/s",
            "500,000 km/s",
            "1,000,000 km/s",
          ],
          correctAnswer: 0,
        },
      ],
    },
  },
  {
    name: "Math Quiz",
    args: {
      title: "Math Challenge",
      questions: [
        {
          question: "What is 15 x 15?",
          choices: ["200", "215", "225", "250"],
          correctAnswer: 2,
        },
        {
          question: "What is the square root of 144?",
          choices: ["10", "11", "12", "13"],
          correctAnswer: 2,
        },
      ],
    },
  },
  {
    name: "No Correct Answer",
    args: {
      title: "Opinion Poll",
      questions: [
        {
          question: "What is your favorite color?",
          choices: ["Red", "Blue", "Green", "Yellow"],
        },
        {
          question: "Which season do you prefer?",
          choices: ["Spring", "Summer", "Autumn", "Winter"],
        },
      ],
    },
  },
  {
    name: "Single Question",
    args: {
      title: "Quick Question",
      questions: [
        {
          question: "Is this quiz plugin working correctly?",
          choices: ["Yes", "No"],
          correctAnswer: 0,
        },
      ],
    },
  },
];

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
  samples: SAMPLES,
};
