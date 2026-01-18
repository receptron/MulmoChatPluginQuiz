/**
 * Quiz Plugin React Types
 *
 * Re-exports ToolPluginReact from gui-chat-protocol/react and Quiz-specific types.
 */

// React plugin type from gui-chat-protocol
export type { ToolPluginReact as ToolPlugin } from "gui-chat-protocol/react";

// Quiz-specific types
export type { QuizQuestion, QuizData, QuizArgs } from "../core/types";
