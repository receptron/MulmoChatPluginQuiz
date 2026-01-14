/**
 * MulmoChat Quiz Plugin
 *
 * A plugin for presenting multiple choice quizzes to users.
 *
 * @packageDocumentation
 *
 * @example Basic usage
 * ```typescript
 * import { plugin } from "mulmochat-plugin-quiz";
 *
 * // Plugin is ready to use
 * const tools = [plugin.toolDefinition];
 * ```
 *
 * @example Using Vue components directly
 * ```typescript
 * import { QuizView, QuizPreview } from "mulmochat-plugin-quiz";
 * ```
 */

// ============================================================================
// Core Types
// ============================================================================

export type {
  ToolContext,
  ToolResult,
  ToolPlugin,
  ToolDefinition,
  JsonSchemaProperty,
  StartApiResponse,
  FileUploadConfig,
  ToolPluginConfig,
  ToolSample,
} from "./types";

// ============================================================================
// Plugin Types
// ============================================================================

export type { QuizQuestion, QuizData, QuizArgs, QuizResult } from "./plugin";

// ============================================================================
// Plugin Instance
// ============================================================================

export { plugin } from "./plugin";

// Default export for convenience
export { plugin as default } from "./plugin";

// ============================================================================
// Plugin Module (for MulmoChat integration)
// ============================================================================

import { plugin } from "./plugin";

/**
 * QuizPlugin module matching MulmoChat's expected plugin structure.
 * Use this for direct import: `import { QuizPlugin } from "mulmochat-plugin-quiz"`
 */
export const QuizPlugin = { plugin };

// ============================================================================
// Vue Components
// ============================================================================

export { default as QuizView } from "./views/QuizView.vue";
export { default as QuizPreview } from "./previews/QuizPreview.vue";
