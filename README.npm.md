# MulmoChat Plugin

A plugin for [MulmoChat](https://github.com/receptron/MulmoChat) - a multi-modal voice chat application with OpenAI's GPT-4 Realtime API.

## What this plugin does

{plugin-description}

## Installation

```bash
yarn add @mulmochat-plugin/{plugin-name}
```

## Usage

### Vue Implementation (for MulmoChat)

```typescript
// In src/tools/index.ts
import Plugin from "@mulmochat-plugin/{plugin-name}/vue";

const pluginList = [
  // ... other plugins
  Plugin,
];

// In src/main.ts
import "@mulmochat-plugin/{plugin-name}/style.css";
```

### Core Only (Framework-agnostic)

```typescript
import { pluginCore, TOOL_NAME } from "@mulmochat-plugin/{plugin-name}";
// or
import pluginCore from "@mulmochat-plugin/{plugin-name}";
```

## Package Exports

| Export | Description |
|--------|-------------|
| `@mulmochat-plugin/{plugin-name}` | Core (framework-agnostic) |
| `@mulmochat-plugin/{plugin-name}/vue` | Vue implementation with UI components |
| `@mulmochat-plugin/{plugin-name}/style.css` | Tailwind CSS styles |

## Development

```bash
# Install dependencies
yarn install

# Start dev server (http://localhost:5173/)
yarn dev

# Build
yarn build

# Type check
yarn typecheck

# Lint
yarn lint
```

## License

MIT
