/**
 * MulmoChat Quiz Plugin - Vue Implementation
 *
 * Full Vue plugin with UI components.
 * Import from "@mulmochat-plugin/quiz/vue"
 */

import type { ToolPlugin, QuizData, QuizArgs } from "./types";
import { pluginCore } from "../core/plugin";
import View from "./View.vue";
import Preview from "./Preview.vue";

// ============================================================================
// Vue Plugin (with components)
// ============================================================================

/**
 * Quiz plugin instance with Vue components
 */
export const plugin: ToolPlugin<never, QuizData, QuizArgs> = {
  ...pluginCore,
  viewComponent: View,
  previewComponent: Preview,
};

// Re-export types
export type { ToolPlugin, ToolPluginConfig } from "./types";

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
