# MulmoChat Plugin Quiz

> **📦 Template Repository**
> This is the reference implementation for [MulmoChat](https://github.com/receptron/MulmoChat) plugins.
> Use this repository as a template to create your own plugins.
> See [TEMPLATE.md](./TEMPLATE.md) for detailed instructions.

A quiz plugin for MulmoChat. Presents multiple choice quizzes to users.

## Overview

This plugin demonstrates the **framework-agnostic core/vue architecture**:
- **Core**: Framework-agnostic plugin logic (can be used with any UI framework)
- **Vue**: Vue-specific UI components

### Features

- **Tailwind CSS 4** for styling
- **TypeScript** for type-safe implementation
- **ESLint** for static analysis
- **Framework-agnostic core** for portability

## Installation

### Adding to MulmoChat

1. Install the plugin:
```bash
cd MulmoChat
yarn add @mulmochat-plugin/quiz
```

2. Import in MulmoChat's `src/tools/index.ts`:
```typescript
import QuizPlugin from "@mulmochat-plugin/quiz/vue";

// Add to pluginList
const pluginList = [
  // ... other plugins
  QuizPlugin,
];
```

3. Import styles in `src/main.ts`:
```typescript
import "@mulmochat-plugin/quiz/style.css";
```

## Package Exports

```typescript
// Default: Core (framework-agnostic)
import { pluginCore, TOOL_NAME, QuizData } from "@mulmochat-plugin/quiz";

// Vue implementation (for apps with UI)
import QuizPlugin from "@mulmochat-plugin/quiz/vue";
import "@mulmochat-plugin/quiz/style.css";

// Named Vue exports
import { plugin, View, Preview } from "@mulmochat-plugin/quiz/vue";
```

## Development

### Setup

```bash
yarn install
```

### Development Server

```bash
yarn dev
```

Demo page will be available at http://localhost:5173/

### Build

```bash
yarn build
```

### Type Check

```bash
yarn typecheck
```

### Lint

```bash
yarn lint
```

## Plugin Structure

```
MulmoChatPluginQuiz/
├── src/
│   ├── index.ts          # Default export (core)
│   ├── style.css         # Tailwind CSS entry
│   ├── core/             # Framework-agnostic (no Vue/React dependencies)
│   │   ├── index.ts      # Core exports
│   │   ├── types.ts      # ToolPluginCore, ToolResult, QuizData, etc.
│   │   └── plugin.ts     # Execute function, tool definition, samples
│   └── vue/              # Vue-specific implementation
│       ├── index.ts      # Vue plugin (combines core + components)
│       ├── types.ts      # ToolPlugin (extends ToolPluginCore)
│       ├── View.vue      # Main view component
│       └── Preview.vue   # Sidebar preview component
├── demo/                 # Generic plugin demo
│   ├── App.vue           # Dynamic component rendering
│   └── main.ts
├── package.json
├── vite.config.ts
├── tsconfig.json
└── eslint.config.js
```

### Directory Purpose

- **src/core/**: Framework-agnostic types and plugin logic. No Vue/React dependencies.
- **src/vue/**: Vue-specific UI components and the full Vue plugin export.
- **demo/**: Generic demo that works with any ToolPlugin.

## Creating a New Plugin

Use the automated script or follow the detailed template guide:

### Quick Start (Recommended)

```bash
# Generate a new plugin
./scripts/create-plugin.sh my-plugin "My Plugin" "Description of my plugin"

# Move to generated directory and install
cd ../MulmoChatPluginMyPlugin
yarn install
yarn dev
```

### Manual Setup

See [TEMPLATE.md](./TEMPLATE.md) for detailed instructions on:
- Core/Vue architecture
- Files that can be copied as-is
- Plugin-specific implementation requirements
- Important patterns (View.vue reactivity)

## Core Types

### ToolPluginCore (Framework-agnostic)

```typescript
interface ToolPluginCore<T, J, A> {
  toolDefinition: ToolDefinition;
  execute: (context: ToolContext, args: A) => Promise<ToolResult<T, J>>;
  generatingMessage: string;
  isEnabled: (startResponse?: StartApiResponse | null) => boolean;
  // Optional
  systemPrompt?: string;
  inputHandlers?: InputHandler[];
  configSchema?: PluginConfigSchema;
  samples?: ToolSample[];
  backends?: BackendType[];
}
```

### ToolPlugin (Vue-specific, extends ToolPluginCore)

```typescript
interface ToolPlugin<T, J, A> extends ToolPluginCore<T, J, A> {
  viewComponent?: Component;
  previewComponent?: Component;
  config?: ToolPluginConfig;  // Legacy Vue component-based config
}
```

## License

MIT
