/**
 * MulmoChat Quiz Plugin
 *
 * Default export uses the Vue implementation.
 * For framework-agnostic core, import from "@mulmochat-plugin/quiz/core"
 * For explicit Vue import, use "@mulmochat-plugin/quiz/vue"
 *
 * @example Default (Vue)
 * ```typescript
 * import QuizPlugin from "@mulmochat-plugin/quiz";
 * import "@mulmochat-plugin/quiz/style.css";
 * ```
 *
 * @example Core only (framework-agnostic)
 * ```typescript
 * import { pluginCore, TOOL_NAME } from "@mulmochat-plugin/quiz/core";
 * ```
 *
 * @example Vue explicit
 * ```typescript
 * import { plugin, View, Preview } from "@mulmochat-plugin/quiz/vue";
 * ```
 */

import "./style.css";

import { plugin } from "./vue";
import type { ToolPlugin } from "./vue/types";

// Default export for backward compatibility
export default { plugin: plugin as ToolPlugin };

// Named exports for convenience
export { plugin } from "./vue";
export type { ToolPlugin } from "./vue/types";

