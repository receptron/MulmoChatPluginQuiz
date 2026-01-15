# MulmoChat Plugin

A plugin for MulmoChat.

## Installation

```bash
yarn add @mulmochat-plugin/{plugin-name}
```

## Usage

```typescript
import Plugin from "@mulmochat-plugin/{plugin-name}";
import "@mulmochat-plugin/{plugin-name}/style.css";

// Add to pluginList
const pluginList = [
  // ... other plugins
  Plugin,
];
```

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
