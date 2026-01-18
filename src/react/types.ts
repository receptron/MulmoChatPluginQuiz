/**
 * MulmoChat Plugin React Types
 *
 * React-specific types that extend the core plugin interface.
 */

import type { ComponentType } from "react";
import type { ToolPluginCore } from "../core/types";

// ============================================================================
// React Component Types
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ReactComponent = ComponentType<any>;

/**
 * React plugin interface - extends core with React components
 */
export interface ToolPlugin<
  T = unknown,
  J = unknown,
  A extends object = object,
> extends ToolPluginCore<T, J, A> {
  /** React component for full view */
  viewComponent?: ReactComponent;
  /** React component for preview/thumbnail */
  previewComponent?: ReactComponent;
}

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
  FileInputHandler,
  ClipboardImageInputHandler,
  UrlInputHandler,
  TextInputHandler,
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
} from "../core/types";
