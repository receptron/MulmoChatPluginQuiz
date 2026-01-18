/**
 * MulmoChat Plugin Core Exports
 *
 * Framework-agnostic types and plugin logic.
 * Import from "@mulmochat-plugin/quiz/core"
 */

// Core types
export type {
  // Framework-agnostic types
  BackendType,
  ToolContextApp,
  ToolContext,
  ToolResult,
  ToolResultComplete,
  JsonSchemaProperty,
  ToolDefinition,
  StartApiResponse,
  ToolSample,
  // Input handlers
  InputHandler,
  FileInputHandler,
  ClipboardImageInputHandler,
  UrlInputHandler,
  TextInputHandler,
  FileUploadConfig,
  // Config schema
  ConfigValue,
  ConfigFieldSchema,
  StringFieldSchema,
  NumberFieldSchema,
  BooleanFieldSchema,
  SelectFieldSchema,
  MultiSelectFieldSchema,
  SelectOption,
  PluginConfigSchema,
  // Component props
  ViewComponentProps,
  PreviewComponentProps,
  // Core plugin interface
  ToolPluginCore,
  // Quiz-specific types
  QuizQuestion,
  QuizData,
  QuizArgs,
} from "./types";

// Core plugin
export { pluginCore, TOOL_NAME, TOOL_DEFINITION, SAMPLES, executeQuiz } from "./plugin";
