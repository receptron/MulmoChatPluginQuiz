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

import type { ToolPlugin, ToolContext, ToolResult } from "../common";
import { TOOL_DEFINITION, type QuizData, type QuizArgs } from "./types";
import { SAMPLES } from "./samples";
import View from "./View.vue";
import Preview from "./Preview.vue";

// ============================================================================
// Plugin Implementation
// ============================================================================

const putQuestions = async (
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
  viewComponent: View,
  previewComponent: Preview,
  samples: SAMPLES,
};
