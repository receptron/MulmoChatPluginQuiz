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
5. Implement your plugin in `src/plugin/`

---

## File Structure Classification

### 📁 Copy As-Is (No Changes Needed)

| File | Description |
|------|-------------|
| `eslint.config.js` | ESLint configuration |
| `vite.config.ts` | Vite build configuration |
| `.github/workflows/pull_request.yaml` | GitHub Actions CI |
| `tsconfig.json` | TypeScript configuration |
| `tsconfig.build.json` | TypeScript build configuration |
| `index.html` | Demo HTML entry |
| `.gitignore` | Git ignore patterns |
| `src/shims-vue.d.ts` | Vue type definitions |
| `src/common/types.ts` | Common types (ToolPlugin, etc.) |
| `src/common/index.ts` | Common exports |
| `src/style.css` | Base styles |
| `demo/main.ts` | Demo entry point |
| `demo/App.vue` | Demo test UI (generic, loads plugin dynamically) |
| `src/index.ts` | Plugin entry point |

### 📝 Copy and Modify

| File | Copy As | What to Modify |
|------|---------|----------------|
| `package.json` | `package.json` | Package name, description |
| `README.npm.md` | `README.md` | Replace `{plugin-name}` and `{plugin-description}` |

### 🔧 Plugin-Specific Implementation Required

| File | What to Implement |
|------|-------------------|
| `src/plugin/types.ts` | Data types, argument types |
| `src/plugin/tools.ts` | Tool name, tool definition (TOOL_NAME, TOOL_DEFINITION) |
| `src/plugin/index.ts` | Plugin logic |
| `src/plugin/View.vue` | Main view component |
| `src/plugin/Preview.vue` | Sidebar preview |

> **Note**: `demo/App.vue` is generic and works with any plugin. Customize only if you need plugin-specific testing features (e.g., file upload testing, API mocking).

---

## Detailed Steps

### Step 1: Create Project Structure

```bash
# Create new directory
mkdir -p ../MulmoChatPlugin{YourName}/src/{common,plugin}
mkdir -p ../MulmoChatPlugin{YourName}/demo
```

### Step 2: Copy Files As-Is

```bash
DEST="../MulmoChatPlugin{YourName}"

# Common files (no changes needed)
cp eslint.config.js "$DEST/"
cp vite.config.ts "$DEST/"
cp index.html "$DEST/"
mkdir -p "$DEST/.github/workflows"
cp .github/workflows/pull_request.yaml "$DEST/.github/workflows/"
cp src/shims-vue.d.ts "$DEST/src/"
cp src/common/types.ts "$DEST/src/common/"
cp src/common/index.ts "$DEST/src/common/"
cp src/style.css "$DEST/src/"
cp src/index.ts "$DEST/src/"
cp demo/main.ts "$DEST/demo/"
cp demo/App.vue "$DEST/demo/"
cp tsconfig.json "$DEST/"
cp tsconfig.build.json "$DEST/"
cp .gitignore "$DEST/"
```

### Step 3: Files Requiring Replacement

#### package.json

Replace:
```json
{
  "name": "@mulmochat-plugin/{your-plugin-name}",  // ← Change
  "description": "{Your plugin description}"       // ← Change
}
```

#### README.md

Copy `README.npm.md` as `README.md` and replace placeholders:
```bash
sed -e 's/{plugin-name}/your-plugin-name/g' \
    -e 's/{plugin-description}/Your plugin description/g' \
    README.npm.md > "$DEST/README.md"
```

### Step 4: Plugin-Specific Implementation

#### src/plugin/types.ts

```typescript
/**
 * {YourPlugin} Types
 */

/** Data type (stored in result.data) */
export interface {YourPlugin}ToolData {
  // Plugin-specific data
}

/** Arguments type (passed from LLM) */
export interface {YourPlugin}Args {
  // Arguments for tool invocation
}

/** JSON output type (stored in result.jsonData, optional) */
export interface {YourPlugin}JsonData {
  // JSON returned to LLM (if needed)
}
```

#### src/plugin/tools.ts

```typescript
/**
 * {YourPlugin} Tool Definition
 */

export const TOOL_NAME = "{toolName}";

export const TOOL_DEFINITION = {
  type: "function" as const,
  name: TOOL_NAME,
  description: "{Tool description}",
  parameters: {
    type: "object" as const,
    properties: {
      // Parameter definitions
    },
    required: ["..."],
  },
};
```

#### src/plugin/index.ts

```typescript
import type { ToolPlugin, ToolContext, ToolResult } from "../common";
import { TOOL_DEFINITION } from "./tools";
import type { {YourPlugin}ToolData, {YourPlugin}Args } from "./types";
import View from "./View.vue";
import Preview from "./Preview.vue";

// Plugin execution function
const execute{YourPlugin} = async (
  context: ToolContext,
  args: {YourPlugin}Args,
): Promise<ToolResult<{YourPlugin}ToolData>> => {
  // Implementation
  return {
    message: "Success",
    data: { /* ... */ },
    instructions: "...",
  };
};

// Plugin export
export const plugin: ToolPlugin<{YourPlugin}ToolData, unknown, {YourPlugin}Args> = {
  toolDefinition: TOOL_DEFINITION,
  execute: execute{YourPlugin},
  generatingMessage: "Processing...",
  isEnabled: () => true,
  viewComponent: View,
  previewComponent: Preview,
  // samples: [...],  // Sample data for demo (optional)
};
```

#### src/plugin/View.vue (Important Pattern)

```vue
<template>
  <div class="w-full h-full">
    <!-- Implement UI -->
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { ToolResult } from "../common";
import type { {YourPlugin}ToolData } from "./types";
import { TOOL_NAME } from "./tools";

const props = defineProps<{
  selectedResult: ToolResult<{YourPlugin}ToolData>;
  sendTextMessage: (text?: string) => void;
}>();

const emit = defineEmits<{
  updateResult: [result: ToolResult];
}>();

// ⚠️ IMPORTANT: Use ref + watch pattern (computed doesn't work properly)
const data = ref<{YourPlugin}ToolData | null>(null);

watch(
  () => props.selectedResult,
  (newResult) => {
    if (newResult?.toolName === TOOL_NAME && newResult.data) {
      data.value = newResult.data as {YourPlugin}ToolData;
    }
  },
  { immediate: true, deep: true },  // ← immediate and deep are required
);
</script>
```

#### src/plugin/Preview.vue

```vue
<template>
  <div class="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
    <!-- Preview UI -->
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ToolResult } from "../common";
import type { {YourPlugin}ToolData } from "./types";

const props = defineProps<{
  result: ToolResult<{YourPlugin}ToolData>;
}>();

const data = computed(() => props.result.data);
</script>
```

#### demo/App.vue

Reference Quiz's `demo/App.vue` to implement test UI for your plugin.
Use Quiz pattern for `jsonData`, PDF pattern for `data`.

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
□ Implemented src/plugin/types.ts
□ Implemented src/plugin/tools.ts
□ Implemented src/plugin/index.ts
□ Implemented src/plugin/View.vue (using ref + watch pattern)
□ Implemented src/plugin/Preview.vue
□ Implemented demo/App.vue
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
| Quiz | Uses `jsonData`, has sample data |
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
5. `src/plugin/` にプラグインを実装

---

## ファイル構成と分類

### 📁 そのままコピー（変更不要）

| ファイル | 説明 |
|---------|------|
| `eslint.config.js` | ESLint設定 |
| `vite.config.ts` | Viteビルド設定 |
| `.github/workflows/pull_request.yaml` | GitHub Actions CI |
| `tsconfig.json` | TypeScript設定 |
| `tsconfig.build.json` | TypeScriptビルド設定 |
| `index.html` | デモHTMLエントリ |
| `.gitignore` | Git除外パターン |
| `src/shims-vue.d.ts` | Vue型定義 |
| `src/common/types.ts` | 共通型定義（ToolPlugin等） |
| `src/common/index.ts` | 共通エクスポート |
| `src/style.css` | 基本スタイル |
| `demo/main.ts` | デモエントリポイント |
| `demo/App.vue` | デモ用テストUI（汎用、プラグインを動的に読み込み） |
| `src/index.ts` | プラグインエントリポイント |

### 📝 コピーして変更が必要

| ファイル | コピー先 | 変更内容 |
|---------|---------|---------|
| `package.json` | `package.json` | パッケージ名、説明 |
| `README.npm.md` | `README.md` | `{plugin-name}` と `{plugin-description}` を置換 |

### 🔧 プラグイン固有の実装が必要

| ファイル | 実装内容 |
|---------|---------|
| `src/plugin/types.ts` | データ型、引数型 |
| `src/plugin/tools.ts` | ツール名、ツール定義（TOOL_NAME, TOOL_DEFINITION） |
| `src/plugin/index.ts` | プラグインロジック |
| `src/plugin/View.vue` | メインビューコンポーネント |
| `src/plugin/Preview.vue` | サイドバープレビュー |

> **注意**: `demo/App.vue` は汎用で、どのプラグインでも動作します。プラグイン固有のテスト機能が必要な場合のみカスタマイズしてください（例：ファイルアップロードテスト、APIモック）。

---

## 詳細手順

### Step 1: プロジェクト構造の作成

```bash
# 新規ディレクトリ作成
mkdir -p ../MulmoChatPlugin{YourName}/src/{common,plugin}
mkdir -p ../MulmoChatPlugin{YourName}/demo
```

### Step 2: そのままコピーするファイル

```bash
DEST="../MulmoChatPlugin{YourName}"

# 共通ファイル（変更不要）
cp eslint.config.js "$DEST/"
cp vite.config.ts "$DEST/"
cp index.html "$DEST/"
mkdir -p "$DEST/.github/workflows"
cp .github/workflows/pull_request.yaml "$DEST/.github/workflows/"
cp src/shims-vue.d.ts "$DEST/src/"
cp src/common/types.ts "$DEST/src/common/"
cp src/common/index.ts "$DEST/src/common/"
cp src/style.css "$DEST/src/"
cp src/index.ts "$DEST/src/"
cp demo/main.ts "$DEST/demo/"
cp demo/App.vue "$DEST/demo/"
cp tsconfig.json "$DEST/"
cp tsconfig.build.json "$DEST/"
cp .gitignore "$DEST/"
```

### Step 3: 置換が必要なファイル

#### package.json

置換箇所:
```json
{
  "name": "@mulmochat-plugin/{your-plugin-name}",  // ← 変更
  "description": "{プラグインの説明}"              // ← 変更
}
```

#### README.md

`README.npm.md` を `README.md` としてコピーし、プレースホルダを置換:
```bash
sed -e 's/{plugin-name}/your-plugin-name/g' \
    -e 's/{plugin-description}/プラグインの説明/g' \
    README.npm.md > "$DEST/README.md"
```

### Step 4: プラグイン固有の実装

#### src/plugin/types.ts

```typescript
/**
 * {YourPlugin} Types
 */

/** データ型（result.data に格納） */
export interface {YourPlugin}ToolData {
  // プラグイン固有のデータ
}

/** 引数型（LLMから渡される） */
export interface {YourPlugin}Args {
  // ツール呼び出し時の引数
}

/** JSON出力型（result.jsonData に格納、オプション） */
export interface {YourPlugin}JsonData {
  // LLMに返すJSON（必要な場合）
}
```

#### src/plugin/tools.ts

```typescript
/**
 * {YourPlugin} Tool Definition
 */

export const TOOL_NAME = "{toolName}";

export const TOOL_DEFINITION = {
  type: "function" as const,
  name: TOOL_NAME,
  description: "{ツールの説明}",
  parameters: {
    type: "object" as const,
    properties: {
      // パラメータ定義
    },
    required: ["..."],
  },
};
```

#### src/plugin/index.ts

```typescript
import type { ToolPlugin, ToolContext, ToolResult } from "../common";
import { TOOL_DEFINITION } from "./tools";
import type { {YourPlugin}ToolData, {YourPlugin}Args } from "./types";
import View from "./View.vue";
import Preview from "./Preview.vue";

// プラグイン実行関数
const execute{YourPlugin} = async (
  context: ToolContext,
  args: {YourPlugin}Args,
): Promise<ToolResult<{YourPlugin}ToolData>> => {
  // 実装
  return {
    message: "Success",
    data: { /* ... */ },
    instructions: "...",
  };
};

// プラグインエクスポート
export const plugin: ToolPlugin<{YourPlugin}ToolData, unknown, {YourPlugin}Args> = {
  toolDefinition: TOOL_DEFINITION,
  execute: execute{YourPlugin},
  generatingMessage: "Processing...",
  isEnabled: () => true,
  viewComponent: View,
  previewComponent: Preview,
  // samples: [...],  // デモ用サンプルデータ（オプション）
};
```

#### src/plugin/View.vue（重要パターン）

```vue
<template>
  <div class="w-full h-full">
    <!-- UIを実装 -->
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { ToolResult } from "../common";
import type { {YourPlugin}ToolData } from "./types";
import { TOOL_NAME } from "./tools";

const props = defineProps<{
  selectedResult: ToolResult<{YourPlugin}ToolData>;
  sendTextMessage: (text?: string) => void;
}>();

const emit = defineEmits<{
  updateResult: [result: ToolResult];
}>();

// ⚠️ 重要: ref + watch パターンを使用（computed だと反映されない）
const data = ref<{YourPlugin}ToolData | null>(null);

watch(
  () => props.selectedResult,
  (newResult) => {
    if (newResult?.toolName === TOOL_NAME && newResult.data) {
      data.value = newResult.data as {YourPlugin}ToolData;
    }
  },
  { immediate: true, deep: true },  // ← immediate と deep 必須
);
</script>
```

#### src/plugin/Preview.vue

```vue
<template>
  <div class="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
    <!-- プレビューUI -->
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ToolResult } from "../common";
import type { {YourPlugin}ToolData } from "./types";

const props = defineProps<{
  result: ToolResult<{YourPlugin}ToolData>;
}>();

const data = computed(() => props.result.data);
</script>
```

#### demo/App.vue

Quiz の `demo/App.vue` を参考に、プラグインのテストUIを実装します。
`jsonData` を使う場合は Quiz パターン、`data` を使う場合は PDF パターンを参照。

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

### ⚠️ ファイル構成の確認

`yarn dev` で動作確認するには以下が必須:
- `index.html` （ルートに配置）
- `demo/main.ts`
- `demo/App.vue`

---

## チェックリスト

```
□ package.json の name, description を変更
□ src/plugin/types.ts を実装
□ src/plugin/tools.ts を実装
□ src/plugin/index.ts を実装
□ src/plugin/View.vue を実装（ref + watch パターン使用）
□ src/plugin/Preview.vue を実装
□ demo/App.vue を実装
□ yarn install 実行
□ yarn typecheck でエラーなし
□ yarn lint でエラーなし
□ yarn dev でブラウザ確認
□ yarn build 成功
```

---

## 参考プラグイン

| プラグイン | 特徴 |
|-----------|------|
| Quiz | `jsonData` 使用、サンプルデータあり |
| Form | `jsonData` 使用、バリデーションあり |
| SummarizePdf | `data` 使用、ファイルアップロード、外部ライブラリ(marked)バンドル |
