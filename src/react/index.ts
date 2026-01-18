/**
 * MulmoChat Quiz Plugin - React Implementation
 *
 * Full React plugin with UI components.
 * Import from "@mulmochat-plugin/quiz/react"
 */

// Import styles for React components
import "../style.css";

import type { ToolPlugin, QuizData, QuizArgs } from "./types";
import { pluginCore } from "../core/plugin";
import { View } from "./View";
import { Preview } from "./Preview";

// ============================================================================
// React Plugin (with components)
// ============================================================================

/**
 * Quiz plugin instance with React components
 */
export const plugin: ToolPlugin<never, QuizData, QuizArgs> = {
  ...pluginCore,
  viewComponent: View,
  previewComponent: Preview,
};

// Re-export types
export type { ToolPlugin } from "./types";

// Re-export core types for convenience
export type {
  BackendType,
  ToolContextApp,
  ToolContext,
  ToolResult,
  ToolResultComplete,
  JsonSchemaProperty,
  ToolDefinition,
  StartApiResponse,
  ToolSample,
  InputHandler,
  FileUploadConfig,
  ConfigValue,
  ConfigFieldSchema,
  PluginConfigSchema,
  ViewComponentProps,
  PreviewComponentProps,
  ToolPluginCore,
  QuizQuestion,
  QuizData,
  QuizArgs,
} from "./types";

// Re-export core plugin utilities
export { TOOL_NAME, TOOL_DEFINITION, SAMPLES, executeQuiz, pluginCore } from "../core/plugin";

// Export components for direct use
export { View, Preview };

// Default export for compatibility: { plugin }
export default { plugin };
