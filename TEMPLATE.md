# MulmoChat Plugin Template Guide

This guide explains how to create a new plugin using MulmoChatPluginQuiz as a template.

---

## Overview

```
3 steps to create a new plugin:
1. Generate project with script
2. Implement plugin-specific code
3. Run yarn install && yarn dev to verify
```

## New Architecture: Core/Vue/React Structure

The plugin is now organized with a **framework-agnostic core** and **framework-specific UI layers**:

```
src/
├── core/           # Framework-agnostic (no Vue/React dependencies)
│   ├── types.ts    # Core types (ToolPluginCore, ToolResult, etc.)
│   ├── definition.ts # Tool definition (schema)
│   ├── samples.ts  # Sample data (optional)
│   ├── plugin.ts   # Plugin logic (execute function)
│   └── index.ts    # Core exports
├── vue/            # Vue-specific implementation
│   ├── types.ts    # Vue types (ToolPlugin extends ToolPluginCore)
│   ├── View.vue    # Main view component
│   ├── Preview.vue # Sidebar preview component
│   └── index.ts    # Vue plugin (combines core + components)
├── react/          # React-specific implementation
│   ├── types.ts    # React types (ToolPlugin extends ToolPluginCore)
│   ├── View.tsx    # Main view component
│   ├── Preview.tsx # Sidebar preview component
│   └── index.ts    # React plugin (combines core + components)
├── index.ts        # Default export (core, framework-agnostic)
└── style.css       # Styles
```

### Package Exports

```typescript
// Default (Core - framework-agnostic)
import { pluginCore, TOOL_NAME, QuizData } from "@mulmochat-plugin/quiz";

// Vue implementation (for apps with UI)
import QuizPlugin from "@mulmochat-plugin/quiz/vue";
import "@mulmochat-plugin/quiz/style.css";

// Named Vue exports
import { plugin, View, Preview } from "@mulmochat-plugin/quiz/vue";

// React implementation (for React apps)
import QuizPlugin from "@mulmochat-plugin/quiz/react";
import "@mulmochat-plugin/quiz/style.css";

// Named React exports
import { plugin, View, Preview } from "@mulmochat-plugin/quiz/react";
```

---

## Quick Start

### Option A: Use Script (Local)

```bash
# 1. Generate new project with script
./scripts/create-plugin.sh my-plugin "My Plugin" "Description of my plugin"

# 2. Move to generated directory
cd ../MulmoChatPluginMyPlugin

# 3. Install dependencies
yarn install

# 4. Start dev server
yarn dev
```

### Option B: Use GitHub Template

> This repository is configured as a GitHub template.

1. Click **"Use this template"** → **"Create a new repository"** on GitHub
2. Clone your new repository
3. Update `package.json` (name, description)
4. Update `README.md` (replace `{plugin-name}` and `{plugin-description}`)
5. Implement your plugin in `src/core/` and `src/vue/`

---

## File Structure Classification

### 📁 Copy As-Is (No Changes Needed)

| File | Description |
|------|-------------|
| `eslint.config.js` | ESLint configuration |
| `vite.config.ts` | Vite build configuration (multi-entry) |
| `.github/workflows/pull_request.yaml` | GitHub Actions CI |
| `tsconfig.json` | TypeScript configuration |
| `tsconfig.build.json` | TypeScript build configuration |
| `index.html` | Demo HTML entry |
| `.gitignore` | Git ignore patterns |
| `src/shims-vue.d.ts` | Vue type definitions |
| `src/style.css` | Base styles |
| `demo/main.ts` | Demo entry point |
| `demo/App.vue` | Demo test UI (generic) |
| `src/index.ts` | Plugin entry point |

### 📝 Copy and Modify

| File | Copy As | What to Modify |
|------|---------|----------------|
| `package.json` | `package.json` | Package name, description |
| `README.npm.md` | `README.md` | Replace `{plugin-name}` and `{plugin-description}` |

### 🔧 Plugin-Specific Implementation Required

| File | What to Implement |
|------|-------------------|
| `src/core/types.ts` | Core types + plugin-specific data types |
| `src/core/definition.ts` | Tool name and definition (schema) |
| `src/core/samples.ts` | Sample data (optional) |
| `src/core/plugin.ts` | Execute function |
| `src/core/index.ts` | Core exports |
| `src/vue/types.ts` | Vue-specific types |
| `src/vue/View.vue` | Main view component (Vue) |
| `src/vue/Preview.vue` | Sidebar preview (Vue) |
| `src/vue/index.ts` | Vue plugin assembly |
| `src/react/types.ts` | React-specific types (optional) |
| `src/react/View.tsx` | Main view component (React, optional) |
| `src/react/Preview.tsx` | Sidebar preview (React, optional) |
| `src/react/index.ts` | React plugin assembly (optional) |

---

## Detailed Implementation

### src/core/types.ts

Contains framework-agnostic types:

```typescript
/**
 * Core Types (Framework-agnostic)
 */

// Re-export base types (copy from Quiz plugin)
export type BackendType = "textLLM" | "imageGen" | "audio" | "search" | "browse" | "map" | "mulmocast";

export interface ToolContext {
  currentResult?: ToolResult<unknown> | null;
  app?: ToolContextApp;
}

export interface ToolResult<T = unknown, J = unknown> {
  toolName?: string;
  uuid?: string;
  message: string;
  title?: string;
  jsonData?: J;
  instructions?: string;
  instructionsRequired?: boolean;
  updating?: boolean;
  cancelled?: boolean;
  data?: T;
  viewState?: Record<string, unknown>;
}

// ... other core types (ToolDefinition, JsonSchemaProperty, etc.)

export interface ToolPluginCore<T = unknown, J = unknown, A extends object = object> {
  toolDefinition: ToolDefinition;
  execute: (context: ToolContext, args: A) => Promise<ToolResult<T, J>>;
  generatingMessage: string;
  isEnabled: (startResponse?: StartApiResponse | null) => boolean;
  // ... other properties
}

// ============================================================================
// Plugin-specific Types (add your types here)
// ============================================================================

/** Your plugin data type */
export interface YourPluginData {
  // Plugin-specific data
}

/** Arguments passed to the tool */
export interface YourPluginArgs {
  // Tool arguments
}
```

### src/core/definition.ts

Contains the tool definition (schema):

```typescript
import type { ToolDefinition } from "./types";

export const TOOL_NAME = "yourToolName";

export const TOOL_DEFINITION: ToolDefinition = {
  type: "function",
  name: TOOL_NAME,
  description: "Your tool description",
  parameters: {
    type: "object",
    properties: {
      // Parameter definitions
    },
    required: ["..."],
  },
};
```

### src/core/samples.ts (Optional)

Contains sample data for demo/testing:

```typescript
import type { ToolSample } from "./types";

export const SAMPLES: ToolSample[] = [
  {
    name: "Sample 1",
    args: { /* sample arguments */ },
  },
];
```

### src/core/plugin.ts

Contains the plugin logic:

```typescript
import type {
  ToolPluginCore,
  ToolContext,
  ToolResult,
  YourPluginData,
  YourPluginArgs,
} from "./types";
import { TOOL_DEFINITION } from "./definition";
import { SAMPLES } from "./samples";

// Re-export for convenience
export { TOOL_NAME, TOOL_DEFINITION } from "./definition";
export { SAMPLES } from "./samples";

// ============================================================================
// Execute Function
// ============================================================================

export const executeYourPlugin = async (
  _context: ToolContext,
  args: YourPluginArgs,
): Promise<ToolResult<YourPluginData>> => {
  // Implementation
  return {
    message: "Success",
    data: { /* ... */ },
    instructions: "...",
  };
};

// ============================================================================
// Core Plugin (without UI components)
// ============================================================================

export const pluginCore: ToolPluginCore<YourPluginData, unknown, YourPluginArgs> = {
  toolDefinition: TOOL_DEFINITION,
  execute: executeYourPlugin,
  generatingMessage: "Processing...",
  isEnabled: () => true,
  samples: SAMPLES,
};
```

### src/core/index.ts

```typescript
// Core types
export type {
  BackendType,
  ToolContext,
  ToolResult,
  ToolPluginCore,
  // ... your plugin types
  YourPluginData,
  YourPluginArgs,
} from "./types";

// Core plugin
export { pluginCore, TOOL_NAME, TOOL_DEFINITION, SAMPLES, executeYourPlugin } from "./plugin";
```

### src/vue/types.ts

```typescript
import type { Component } from "vue";
import type { ToolPluginCore } from "../core/types";

type VueComponent = Component<any>;

export interface ToolPlugin<T = unknown, J = unknown, A extends object = object>
  extends ToolPluginCore<T, J, A> {
  viewComponent?: VueComponent;
  previewComponent?: VueComponent;
}

// Re-export core types
export type { ToolContext, ToolResult, ToolPluginCore, /* ... */ } from "../core/types";
```

### src/vue/View.vue (Important Pattern)

```vue
<template>
  <div class="w-full h-full">
    <!-- Implement UI -->
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { ToolResult, YourPluginData } from "../core/types";
import { TOOL_NAME } from "../core/plugin";

const props = defineProps<{
  selectedResult: ToolResult<YourPluginData>;
  sendTextMessage: (text?: string) => void;
}>();

const emit = defineEmits<{
  updateResult: [result: ToolResult];
}>();

// ⚠️ IMPORTANT: Use ref + watch pattern (computed doesn't work properly)
const data = ref<YourPluginData | null>(null);

watch(
  () => props.selectedResult,
  (newResult) => {
    if (newResult?.toolName === TOOL_NAME && newResult.data) {
      data.value = newResult.data as YourPluginData;
    }
  },
  { immediate: true, deep: true },  // ← immediate and deep are required
);
</script>
```

### src/vue/Preview.vue

```vue
<template>
  <div class="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
    <!-- Preview UI -->
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ToolResult, YourPluginData } from "../core/types";

const props = defineProps<{
  result: ToolResult<YourPluginData>;
}>();

const data = computed(() => props.result.data);
</script>
```

### src/vue/index.ts

```typescript
import type { ToolPlugin, YourPluginData, YourPluginArgs } from "./types";
import { pluginCore } from "../core/plugin";
import View from "./View.vue";
import Preview from "./Preview.vue";

export const plugin: ToolPlugin<YourPluginData, unknown, YourPluginArgs> = {
  ...pluginCore,
  viewComponent: View,
  previewComponent: Preview,
};

// Re-export types and core utilities
export type { ToolPlugin } from "./types";
export { TOOL_NAME, TOOL_DEFINITION, SAMPLES, pluginCore } from "../core/plugin";
export { View, Preview };
```

---

## Important Notes

### ⚠️ View.vue Reactivity

```typescript
// ❌ NG: computed doesn't work when used from external package
const data = computed(() => props.selectedResult.data);

// ✅ OK: Use ref + watch pattern
const data = ref<DataType | null>(null);
watch(
  () => props.selectedResult,
  (newResult) => {
    if (newResult?.toolName === TOOL_NAME && newResult.data) {
      data.value = newResult.data;
    }
  },
  { immediate: true, deep: true },
);
```

### ⚠️ External Library Bundling

Do NOT include external libraries in `external` in `vite.config.ts`:

```typescript
// ❌ NG: marked in external won't be found in host app
rollupOptions: {
  external: ["vue", "marked"],
}

// ✅ OK: Only vue in external (bundle others)
rollupOptions: {
  external: ["vue"],
}
```

### ⚠️ File Structure Verification

Required for `yarn dev` to work:
- `index.html` (in root)
- `demo/main.ts`
- `demo/App.vue`

---

## Checklist

```
□ Changed name, description in package.json
□ Implemented src/core/types.ts (with plugin-specific types)
□ Implemented src/core/plugin.ts (tool definition, execute, samples)
□ Implemented src/core/index.ts (exports)
□ Implemented src/vue/types.ts
□ Implemented src/vue/View.vue (using ref + watch pattern)
□ Implemented src/vue/Preview.vue
□ Implemented src/vue/index.ts
□ Ran yarn install
□ No errors in yarn typecheck
□ No errors in yarn lint
□ Verified in browser with yarn dev
□ yarn build succeeded
```

---

## Reference Plugins

| Plugin | Features |
|--------|----------|
| Quiz | Uses `jsonData`, has sample data, core/vue structure |
| Form | Uses `jsonData`, has validation |
| SummarizePdf | Uses `data`, file upload, bundles external library (marked) |

---
---

# MulmoChat プラグイン テンプレートガイド（日本語）

このガイドは、MulmoChatPluginQuiz をテンプレートとして新しいプラグインを作成する手順を説明します。

---

## 概要

```
新規プラグイン作成の3ステップ:
1. スクリプトでプロジェクトを生成
2. プラグイン固有のコードを実装
3. yarn install && yarn dev で動作確認
```

## 新アーキテクチャ: Core/Vue/React 構造

プラグインは**フレームワーク非依存のcore**と**フレームワーク固有のUI層**で構成されます:

```
src/
├── core/           # フレームワーク非依存（Vue/React依存なし）
│   ├── types.ts    # コア型定義（ToolPluginCore, ToolResult等）
│   ├── definition.ts # ツール定義（スキーマ）
│   ├── samples.ts  # サンプルデータ（オプション）
│   ├── plugin.ts   # プラグインロジック（execute関数）
│   └── index.ts    # コアエクスポート
├── vue/            # Vue固有の実装
│   ├── types.ts    # Vue型定義（ToolPlugin extends ToolPluginCore）
│   ├── View.vue    # メインビューコンポーネント
│   ├── Preview.vue # サイドバープレビュー
│   └── index.ts    # Vueプラグイン（core + コンポーネント）
├── react/          # React固有の実装
│   ├── types.ts    # React型定義（ToolPlugin extends ToolPluginCore）
│   ├── View.tsx    # メインビューコンポーネント
│   ├── Preview.tsx # サイドバープレビュー
│   └── index.ts    # Reactプラグイン（core + コンポーネント）
├── index.ts        # デフォルトエクスポート（core、フレームワーク非依存）
└── style.css       # スタイル
```

### パッケージエクスポート

```typescript
// デフォルト（Core - フレームワーク非依存）
import { pluginCore, TOOL_NAME, QuizData } from "@mulmochat-plugin/quiz";

// Vue実装（UIを持つアプリ用）
import QuizPlugin from "@mulmochat-plugin/quiz/vue";
import "@mulmochat-plugin/quiz/style.css";

// Vue名前付きエクスポート
import { plugin, View, Preview } from "@mulmochat-plugin/quiz/vue";

// React実装（Reactアプリ用）
import QuizPlugin from "@mulmochat-plugin/quiz/react";
import "@mulmochat-plugin/quiz/style.css";

// React名前付きエクスポート
import { plugin, View, Preview } from "@mulmochat-plugin/quiz/react";
```

---

## クイックスタート

### 方法A: スクリプトを使用（ローカル）

```bash
# 1. スクリプトで新規プロジェクトを生成
./scripts/create-plugin.sh my-plugin "My Plugin" "プラグインの説明"

# 2. 生成されたディレクトリに移動
cd ../MulmoChatPluginMyPlugin

# 3. 依存関係をインストール
yarn install

# 4. 開発サーバーを起動
yarn dev
```

### 方法B: GitHub テンプレートを使用

> このリポジトリは GitHub テンプレートとして設定されています。

1. GitHub で **"Use this template"** → **"Create a new repository"** をクリック
2. 新しいリポジトリをクローン
3. `package.json` を更新（name, description）
4. `README.md` を更新（`{plugin-name}` と `{plugin-description}` を置換）
5. `src/core/` と `src/vue/` にプラグインを実装

---

## ファイル構成と分類

### 📁 そのままコピー（変更不要）

| ファイル | 説明 |
|---------|------|
| `eslint.config.js` | ESLint設定 |
| `vite.config.ts` | Viteビルド設定（マルチエントリー） |
| `.github/workflows/pull_request.yaml` | GitHub Actions CI |
| `tsconfig.json` | TypeScript設定 |
| `tsconfig.build.json` | TypeScriptビルド設定 |
| `index.html` | デモHTMLエントリ |
| `.gitignore` | Git除外パターン |
| `src/shims-vue.d.ts` | Vue型定義 |
| `src/style.css` | 基本スタイル |
| `demo/main.ts` | デモエントリポイント |
| `demo/App.vue` | デモ用テストUI（汎用） |
| `src/index.ts` | プラグインエントリポイント |

### 📝 コピーして変更が必要

| ファイル | コピー先 | 変更内容 |
|---------|---------|---------|
| `package.json` | `package.json` | パッケージ名、説明 |
| `README.npm.md` | `README.md` | `{plugin-name}` と `{plugin-description}` を置換 |

### 🔧 プラグイン固有の実装が必要

| ファイル | 実装内容 |
|---------|---------|
| `src/core/types.ts` | コア型 + プラグイン固有のデータ型 |
| `src/core/definition.ts` | ツール名と定義（スキーマ） |
| `src/core/samples.ts` | サンプルデータ（オプション） |
| `src/core/plugin.ts` | execute関数 |
| `src/core/index.ts` | コアエクスポート |
| `src/vue/types.ts` | Vue固有の型 |
| `src/vue/View.vue` | メインビューコンポーネント（Vue） |
| `src/vue/Preview.vue` | サイドバープレビュー（Vue） |
| `src/vue/index.ts` | Vueプラグイン組み立て |
| `src/react/types.ts` | React固有の型（オプション） |
| `src/react/View.tsx` | メインビューコンポーネント（React、オプション） |
| `src/react/Preview.tsx` | サイドバープレビュー（React、オプション） |
| `src/react/index.ts` | Reactプラグイン組み立て（オプション） |

---

## 重要な注意点

### ⚠️ View.vue のリアクティビティ

```typescript
// ❌ NG: computed だと外部パッケージから使用時に反映されない
const data = computed(() => props.selectedResult.data);

// ✅ OK: ref + watch パターンを使用
const data = ref<DataType | null>(null);
watch(
  () => props.selectedResult,
  (newResult) => {
    if (newResult?.toolName === TOOL_NAME && newResult.data) {
      data.value = newResult.data;
    }
  },
  { immediate: true, deep: true },
);
```

### ⚠️ 外部ライブラリのバンドル

`vite.config.ts` で外部ライブラリを `external` に含めないこと:

```typescript
// ❌ NG: marked を external にするとホストアプリで見つからない
rollupOptions: {
  external: ["vue", "marked"],
}

// ✅ OK: vue のみ external（他はバンドルに含める）
rollupOptions: {
  external: ["vue"],
}
```

---

## チェックリスト

```
□ package.json の name, description を変更
□ src/core/types.ts を実装（プラグイン固有の型を含む）
□ src/core/definition.ts を実装（ツール名と定義）
□ src/core/samples.ts を実装（サンプルデータ、オプション）
□ src/core/plugin.ts を実装（execute関数）
□ src/core/index.ts を実装（エクスポート）
□ src/vue/types.ts を実装
□ src/vue/View.vue を実装（ref + watch パターン使用）
□ src/vue/Preview.vue を実装
□ src/vue/index.ts を実装
□ （オプション）src/react/types.ts を実装
□ （オプション）src/react/View.tsx を実装
□ （オプション）src/react/Preview.tsx を実装
□ （オプション）src/react/index.ts を実装
□ yarn install 実行
□ yarn typecheck でエラーなし
□ yarn lint でエラーなし
□ yarn dev でブラウザ確認（Vue）
□ yarn dev:react でブラウザ確認（React、オプション）
□ yarn build 成功
```

---

## 参考プラグイン

| プラグイン | 特徴 |
|-----------|------|
| Quiz | `jsonData` 使用、サンプルデータあり、core/vue構造 |
| Form | `jsonData` 使用、バリデーションあり |
| SummarizePdf | `data` 使用、ファイルアップロード、外部ライブラリ(marked)バンドル |
