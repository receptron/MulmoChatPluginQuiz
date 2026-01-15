# MulmoChat Plugin Quiz

A quiz plugin for MulmoChat. Presents multiple choice quizzes to users.

## Overview

This plugin is a reference implementation of the MulmoChat plugin system. Its simple structure with no server communication makes it an ideal template for creating new plugins.

- **Tailwind CSS 4** for styling
- **TypeScript** for type-safe implementation
- **ESLint** for static analysis

## Installation

### Adding to MulmoChat

1. Build the plugin:
```bash
cd MulmoChatPluginQuiz
yarn install
yarn build
yarn pack
```

2. Add dependency to MulmoChat's `package.json`:
```json
{
  "dependencies": {
    "@mulmochat-plugin/quiz": "file:../MulmoChatPluginQuiz/mulmochat-plugin-quiz-v0.1.1.tgz"
  }
}
```

3. Import in MulmoChat's `src/tools/index.ts`:
```typescript
import type { ToolPlugin } from "./types";

// Quiz plugin from npm package
import { QuizPlugin as QuizPluginImport } from "@mulmochat-plugin/quiz";
import "@mulmochat-plugin/quiz/style.css"; // Tailwind CSS styles
const QuizPlugin = QuizPluginImport as { plugin: ToolPlugin };

// Add to pluginList
const pluginList = [
  // ... other plugins
  QuizPlugin,
];
```

4. Reinstall dependencies in MulmoChat:
```bash
cd MulmoChat
yarn install --force
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
│   ├── plugin.ts         # Plugin implementation (includes samples)
│   ├── types.ts          # Type definitions
│   ├── style.css         # Tailwind CSS entry
│   ├── views/
│   │   └── QuizView.vue  # Main view component
│   └── previews/
│       └── QuizPreview.vue  # Sidebar preview
├── demo/                 # Development demo page
├── package.json
├── vite.config.ts
├── tsconfig.json
└── eslint.config.js      # ESLint configuration
```

## Creating a New Plugin

Steps to create a new plugin based on this repository:

1. Copy the repository:
```bash
cp -r MulmoChatPluginQuiz MulmoChatPluginYourPlugin
cd MulmoChatPluginYourPlugin
rm -rf .git node_modules dist *.tgz
git init
```

2. Edit `package.json`:
   - `name`: `mulmochat-plugin-yourplugin`
   - `description`: Your plugin description

3. Edit `src/plugin.ts`:
   - `TOOL_DEFINITION`: Define tool name, description, and parameters
   - `execute`: Implement tool execution logic
   - Add type definitions as needed

4. Create `src/views/YourView.vue`:
   - Main display component
   - Props: `selectedResult`, `sendTextMessage`
   - Emit: `updateResult`

5. Create `src/previews/YourPreview.vue`:
   - Sidebar preview component
   - Props: `result`

6. Update exports in `src/index.ts`

7. Update `demo/App.vue` for your plugin

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
