/**
 * MulmoChat Quiz Plugin
 *
 * @example
 * ```typescript
 * import QuizPlugin from "@mulmochat-plugin/quiz";
 * import "@mulmochat-plugin/quiz/style.css";
 * ```
 */

import "./style.css";

import { plugin } from "./plugin";
import type { ToolPlugin } from "./common";

export default { plugin: plugin as ToolPlugin };
