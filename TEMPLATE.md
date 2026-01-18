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

## gui-chat-protocol Package

This plugin uses the **[gui-chat-protocol](https://github.com/receptron/gui-chat-protocol)** package for type definitions.

```bash
yarn add gui-chat-protocol
```

The package provides framework-agnostic core types and framework-specific adapters:

```typescript
// Core types (framework-agnostic)
import type { ToolPluginCore, ToolResult, ToolContext, ToolDefinition } from "gui-chat-protocol";

// Vue-specific types
import type { ToolPlugin } from "gui-chat-protocol/vue";

// React-specific types
import type { ToolPluginReact } from "gui-chat-protocol/react";
```

## New Architecture: Core/Vue/React Structure

The plugin is organized with a **framework-agnostic core** and **framework-specific UI layers**:

```
src/
├── core/           # Framework-agnostic (no Vue/React dependencies)
│   ├── types.ts    # Plugin-specific types only (YourData, YourArgs)
│   ├── definition.ts # Tool definition (schema)
│   ├── samples.ts  # Sample data (optional)
│   ├── plugin.ts   # Plugin logic (execute function)
│   └── index.ts    # Core exports
├── vue/            # Vue-specific implementation
│   ├── View.vue    # Main view component
│   ├── Preview.vue # Sidebar preview component
│   └── index.ts    # Vue plugin (combines core + components)
├── react/          # React-specific implementation
│   ├── View.tsx    # Main view component
│   ├── Preview.tsx # Sidebar preview component
│   └── index.ts    # React plugin (combines core + components)
├── index.ts        # Default export (core, framework-agnostic)
└── style.css       # Styles
```

**Key Points**:
- Base types (`ToolPluginCore`, `ToolResult`, `ToolContext`, etc.) are imported from `gui-chat-protocol`
- Only plugin-specific types (e.g., `QuizData`, `QuizArgs`) are defined in `src/core/types.ts`
- Type parameters: `ToolPlugin<T, J, A>` where:
  - `T` = UI data (stored in `result.data`, not visible to LLM)
  - `J` = JSON data (stored in `result.jsonData`, visible to LLM)
  - `A` = Arguments from LLM function call

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
| `src/core/types.ts` | Plugin-specific data types only (e.g., YourData, YourArgs) |
| `src/core/definition.ts` | Tool name and definition (schema) |
| `src/core/samples.ts` | Sample data (optional) |
| `src/core/plugin.ts` | Execute function |
| `src/core/index.ts` | Core exports |
| `src/vue/View.vue` | Main view component (Vue) |
| `src/vue/Preview.vue` | Sidebar preview (Vue) |
| `src/vue/index.ts` | Vue plugin assembly |
| `src/react/View.tsx` | Main view component (React, optional) |
| `src/react/Preview.tsx` | Sidebar preview (React, optional) |
| `src/react/index.ts` | React plugin assembly (optional) |

---

## Detailed Implementation

### src/core/types.ts

Contains **only plugin-specific types**. Base types are imported from `gui-chat-protocol`:

```typescript
/**
 * Plugin-specific Types
 *
 * Base types (ToolPluginCore, ToolResult, ToolContext, etc.) are
 * imported from gui-chat-protocol, NOT defined here.
 */

/** Your plugin data type - stored in result.jsonData (visible to LLM) */
export interface YourPluginData {
  title: string;
  items: string[];
  // Plugin-specific data
}

/** Arguments passed from LLM to the tool */
export interface YourPluginArgs {
  title: string;
  items: string[];
  // Tool arguments matching the schema in definition.ts
}
```

### src/core/definition.ts

Contains the tool definition (schema):

```typescript
import type { ToolDefinition } from "gui-chat-protocol";

export const TOOL_NAME = "yourToolName";

export const TOOL_DEFINITION: ToolDefinition = {
  type: "function",
  name: TOOL_NAME,
  description: "Your tool description",
  parameters: {
    type: "object",
    properties: {
      title: { type: "string", description: "Title" },
      items: { type: "array", items: { type: "string" } },
    },
    required: ["title", "items"],
  },
};
```

### src/core/samples.ts (Optional)

Contains sample data for demo/testing:

```typescript
import type { ToolSample } from "gui-chat-protocol";

export const SAMPLES: ToolSample[] = [
  {
    name: "Sample 1",
    args: { title: "Test", items: ["Item 1", "Item 2"] },
  },
];
```

### src/core/plugin.ts

Contains the plugin logic:

```typescript
import type { ToolPluginCore, ToolContext, ToolResult } from "gui-chat-protocol";
import type { YourPluginData, YourPluginArgs } from "./types";
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
): Promise<ToolResult<never, YourPluginData>> => {
  return {
    message: "Success",
    jsonData: {
      title: args.title,
      items: args.items,
    },
    instructions: "Present the data to the user.",
  };
};

// ============================================================================
// Core Plugin (without UI components)
// ============================================================================

export const pluginCore: ToolPluginCore<never, YourPluginData, YourPluginArgs> = {
  toolDefinition: TOOL_DEFINITION,
  execute: executeYourPlugin,
  generatingMessage: "Processing...",
  isEnabled: () => true,
  samples: SAMPLES,
};
```

### src/core/index.ts

```typescript
// Plugin-specific types
export type { YourPluginData, YourPluginArgs } from "./types";

// Core plugin and utilities
export { pluginCore, TOOL_NAME, TOOL_DEFINITION, SAMPLES, executeYourPlugin } from "./plugin";
```

### src/vue/View.vue (Important Pattern)

```vue
<template>
  <div class="w-full h-full">
    <h1>{{ data?.title }}</h1>
    <ul>
      <li v-for="item in data?.items" :key="item">{{ item }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { ToolResult } from "gui-chat-protocol";
import type { YourPluginData } from "../core/types";
import { TOOL_NAME } from "../core/plugin";

const props = defineProps<{
  selectedResult: ToolResult;
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
    if (newResult?.toolName === TOOL_NAME && newResult.jsonData) {
      data.value = newResult.jsonData as YourPluginData;
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
    <span>{{ data?.title }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ToolResult } from "gui-chat-protocol";
import type { YourPluginData } from "../core/types";

const props = defineProps<{
  result: ToolResult;
}>();

const data = computed(() => props.result.jsonData as YourPluginData | null);
</script>
```

### src/vue/index.ts

```typescript
import type { ToolPlugin } from "gui-chat-protocol/vue";
import type { YourPluginData, YourPluginArgs } from "../core/types";
import { pluginCore } from "../core/plugin";
import View from "./View.vue";
import Preview from "./Preview.vue";

export const plugin: ToolPlugin<never, YourPluginData, YourPluginArgs> = {
  ...pluginCore,
  viewComponent: View,
  previewComponent: Preview,
};

// Re-export core utilities
export { TOOL_NAME, TOOL_DEFINITION, SAMPLES, pluginCore } from "../core/plugin";
export { View, Preview };

// Default export for MulmoChat compatibility
export default { plugin };
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
□ Added gui-chat-protocol dependency in package.json
□ Changed name, description in package.json
□ Implemented src/core/types.ts (plugin-specific types only)
□ Implemented src/core/definition.ts (tool name and schema)
□ Implemented src/core/samples.ts (optional)
□ Implemented src/core/plugin.ts (execute function)
□ Implemented src/core/index.ts (exports)
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
| Quiz | Uses `jsonData`, has sample data, gui-chat-protocol types |
| GenerateImage | Uses `data`, file upload, configSchema, gui-chat-protocol types |
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

## gui-chat-protocol パッケージ

このプラグインは型定義に **[gui-chat-protocol](https://github.com/receptron/gui-chat-protocol)** パッケージを使用します。

```bash
yarn add gui-chat-protocol
```

パッケージはフレームワーク非依存のコア型とフレームワーク固有のアダプターを提供します:

```typescript
// コア型（フレームワーク非依存）
import type { ToolPluginCore, ToolResult, ToolContext, ToolDefinition } from "gui-chat-protocol";

// Vue固有の型
import type { ToolPlugin } from "gui-chat-protocol/vue";

// React固有の型
import type { ToolPluginReact } from "gui-chat-protocol/react";
```

## 新アーキテクチャ: Core/Vue/React 構造

プラグインは**フレームワーク非依存のcore**と**フレームワーク固有のUI層**で構成されます:

```
src/
├── core/           # フレームワーク非依存（Vue/React依存なし）
│   ├── types.ts    # プラグイン固有の型のみ（YourData, YourArgs）
│   ├── definition.ts # ツール定義（スキーマ）
│   ├── samples.ts  # サンプルデータ（オプション）
│   ├── plugin.ts   # プラグインロジック（execute関数）
│   └── index.ts    # コアエクスポート
├── vue/            # Vue固有の実装
│   ├── View.vue    # メインビューコンポーネント
│   ├── Preview.vue # サイドバープレビュー
│   └── index.ts    # Vueプラグイン（core + コンポーネント）
├── react/          # React固有の実装
│   ├── View.tsx    # メインビューコンポーネント
│   ├── Preview.tsx # サイドバープレビュー
│   └── index.ts    # Reactプラグイン（core + コンポーネント）
├── index.ts        # デフォルトエクスポート（core、フレームワーク非依存）
└── style.css       # スタイル
```

**重要なポイント**:
- ベース型（`ToolPluginCore`, `ToolResult`, `ToolContext`等）は`gui-chat-protocol`からインポート
- プラグイン固有の型（例: `QuizData`, `QuizArgs`）のみ`src/core/types.ts`で定義
- 型パラメータ: `ToolPlugin<T, J, A>`
  - `T` = UI用データ（`result.data`に格納、LLMには非公開）
  - `J` = JSONデータ（`result.jsonData`に格納、LLMに公開）
  - `A` = LLMからの関数呼び出し引数

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
| `src/core/types.ts` | プラグイン固有のデータ型のみ（例: YourData, YourArgs） |
| `src/core/definition.ts` | ツール名と定義（スキーマ） |
| `src/core/samples.ts` | サンプルデータ（オプション） |
| `src/core/plugin.ts` | execute関数 |
| `src/core/index.ts` | コアエクスポート |
| `src/vue/View.vue` | メインビューコンポーネント（Vue） |
| `src/vue/Preview.vue` | サイドバープレビュー（Vue） |
| `src/vue/index.ts` | Vueプラグイン組み立て |
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
□ package.json に gui-chat-protocol 依存を追加
□ package.json の name, description を変更
□ src/core/types.ts を実装（プラグイン固有の型のみ）
□ src/core/definition.ts を実装（ツール名と定義）
□ src/core/samples.ts を実装（サンプルデータ、オプション）
□ src/core/plugin.ts を実装（execute関数）
□ src/core/index.ts を実装（エクスポート）
□ src/vue/View.vue を実装（ref + watch パターン使用）
□ src/vue/Preview.vue を実装
□ src/vue/index.ts を実装
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
| Quiz | `jsonData` 使用、サンプルデータあり、gui-chat-protocol型 |
| GenerateImage | `data` 使用、ファイルアップロード、configSchema、gui-chat-protocol型 |
| Form | `jsonData` 使用、バリデーションあり |
| SummarizePdf | `data` 使用、ファイルアップロード、外部ライブラリ(marked)バンドル |
