/**
 * MulmoChat Quiz Plugin Core (Framework-agnostic)
 *
 * Contains the plugin logic without UI components.
 * Can be used by any framework (Vue, React, etc.)
 */

import type {
  ToolPluginCore,
  ToolContext,
  ToolResult,
  ToolDefinition,
  ToolSample,
  QuizData,
  QuizArgs,
} from "./types";

// ============================================================================
// Tool Definition
// ============================================================================

export const TOOL_NAME = "putQuestions";

export const TOOL_DEFINITION: ToolDefinition = {
  type: "function",
  name: TOOL_NAME,
  description:
    "Present a set of multiple choice questions to test the user's knowledge or abilities. Each question should have 2-6 answer choices.",
  parameters: {
    type: "object",
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
// Sample Data
// ============================================================================

export const SAMPLES: ToolSample[] = [
  {
    name: "JavaScript Quiz",
    args: {
      title: "JavaScript Basics",
      questions: [
        {
          question: "What does 'const' do in JavaScript?",
          choices: [
            "Declares a constant variable",
            "Declares a mutable variable",
            "Creates a function",
            "Imports a module",
          ],
          correctAnswer: 0,
        },
        {
          question: "Which method adds an element to the end of an array?",
          choices: ["pop()", "shift()", "push()", "unshift()"],
          correctAnswer: 2,
        },
        {
          question: "What is the output of: typeof null?",
          choices: ['"null"', '"undefined"', '"object"', '"boolean"'],
          correctAnswer: 2,
        },
      ],
    },
  },
  {
    name: "World Capitals",
    args: {
      title: "World Capitals Quiz",
      questions: [
        {
          question: "What is the capital of Japan?",
          choices: ["Osaka", "Kyoto", "Tokyo", "Hiroshima"],
          correctAnswer: 2,
        },
        {
          question: "What is the capital of Australia?",
          choices: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
          correctAnswer: 2,
        },
      ],
    },
  },
  {
    name: "Simple Yes/No",
    args: {
      questions: [
        {
          question: "Is the Earth round?",
          choices: ["Yes", "No"],
          correctAnswer: 0,
        },
      ],
    },
  },
];

// ============================================================================
// Execute Function
// ============================================================================

export const executeQuiz = async (
  _context: ToolContext,
  args: QuizArgs,
): Promise<ToolResult<never, QuizData>> => {
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
// Core Plugin (without UI components)
// ============================================================================

export const pluginCore: ToolPluginCore<never, QuizData, QuizArgs> = {
  toolDefinition: TOOL_DEFINITION,
  execute: executeQuiz,
  generatingMessage: "Preparing quiz...",
  isEnabled: () => true,
  samples: SAMPLES,
};
