/**
 * Quiz Plugin Vue Types
 *
 * Re-exports ToolPlugin from gui-chat-protocol/vue and Quiz-specific types.
 */

// Vue plugin type from gui-chat-protocol
export type { ToolPlugin, ToolPluginConfig } from "gui-chat-protocol/vue";

// Quiz-specific types
export type { QuizQuestion, QuizData, QuizArgs } from "../core/types";
