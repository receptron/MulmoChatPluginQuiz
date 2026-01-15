# MulmoChat Plugin Quiz

> **📦 Template Repository**
> This is the reference implementation for [MulmoChat](https://github.com/receptron/MulmoChat) plugins.
> Use this repository as a template to create your own plugins.
> See [TEMPLATE.md](./TEMPLATE.md) for detailed instructions.

A quiz plugin for MulmoChat. Presents multiple choice quizzes to users.

## Overview

This plugin is a reference implementation of the MulmoChat plugin system. Its simple structure with no server communication makes it an ideal template for creating new plugins.

- **Tailwind CSS 4** for styling
- **TypeScript** for type-safe implementation
- **ESLint** for static analysis

## Installation

### Adding to MulmoChat

1. Install the plugin:
```bash
cd MulmoChat
yarn add @mulmochat-plugin/quiz
```

2. Import in MulmoChat's `src/tools/index.ts`:
```typescript
import QuizPlugin from "@mulmochat-plugin/quiz";
import "@mulmochat-plugin/quiz/style.css";

// Add to pluginList
const pluginList = [
  // ... other plugins
  QuizPlugin,
];
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
│   ├── index.ts          # Export definitions
│   ├── style.css         # Tailwind CSS entry
│   ├── common/           # Plugin-agnostic shared code
│   │   ├── index.ts      # Common exports
│   │   └── types.ts      # ToolPlugin, ToolResult, etc.
│   └── plugin/           # Quiz-specific implementation
│       ├── index.ts      # Plugin instance and execute logic
│       ├── types.ts      # Quiz types and TOOL_DEFINITION
│       ├── samples.ts    # Sample data for testing
│       ├── View.vue      # Main view component
│       └── Preview.vue   # Sidebar preview component
├── demo/                 # Generic plugin demo (works with any plugin)
│   ├── App.vue           # Dynamic component rendering
│   └── main.ts
├── package.json
├── vite.config.ts
├── tsconfig.json
└── eslint.config.js
```

### Directory Purpose

- **src/common/**: Plugin-agnostic types and utilities. Copy this to your new plugin or import from this package.
- **src/plugin/**: Quiz-specific implementation. Replace with your plugin logic.
- **demo/**: Generic demo that works with any ToolPlugin. Just change the import.

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
- Files that can be copied as-is
- Files requiring modification (only `package.json`)
- Plugin-specific implementation requirements
- Important patterns (View.vue reactivity)

## ToolPlugin Interface

```typescript
interface ToolPlugin<T, J, A> {
  toolDefinition: {
    type: "function";
    name: string;
    description: string;
    parameters?: {
      type: "object";
      properties: Record<string, JsonSchemaProperty>;
      required: string[];
    };
  };
  execute: (context: ToolContext, args: A) => Promise<ToolResult<T, J>>;
  generatingMessage: string;
  isEnabled: (startResponse?: StartApiResponse | null) => boolean;
  viewComponent?: Component;
  previewComponent?: Component;
  // Optional
  systemPrompt?: string;
  fileUpload?: FileUploadConfig;
  config?: ToolPluginConfig;
  samples?: ToolSample[];  // Sample data for testing
}
```

## License

MIT
