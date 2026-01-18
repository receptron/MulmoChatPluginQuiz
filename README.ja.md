# MulmoChat Plugin Quiz

> **📦 テンプレートリポジトリ**
> これは [MulmoChat](https://github.com/receptron/MulmoChat) プラグインのリファレンス実装です。
> このリポジトリをテンプレートとして使用し、独自のプラグインを作成できます。
> 詳細は [TEMPLATE.md](./TEMPLATE.md) を参照してください。

MulmoChat用のクイズプラグイン。複数選択式のクイズをユーザーに提示します。

## 概要

このプラグインは、MulmoChatのプラグインシステムのリファレンス実装です。サーバー通信不要なシンプルな構造のため、新しいプラグインを作成する際のテンプレートとして使用できます。

**フレームワーク非依存のcoreアーキテクチャ**と**VueおよびReact実装**を実現しています:
- **Core**: フレームワーク非依存のプラグインロジック（任意のUIフレームワークで使用可能）
- **Vue**: Vue専用のUIコンポーネント
- **React**: React専用のUIコンポーネント

### 特徴

- **Tailwind CSS 4** を使用したスタイリング
- **TypeScript** による型安全な実装
- **ESLint** による静的解析
- **フレームワーク非依存のcore** による移植性
- **マルチフレームワーク対応**（VueとReact）

## インストール

### MulmoChatへの追加

1. プラグインをインストール:
```bash
cd MulmoChat
yarn add @mulmochat-plugin/quiz
```

2. MulmoChatの`src/tools/index.ts`でインポート:
```typescript
import QuizPlugin from "@mulmochat-plugin/quiz/vue";

// pluginListに追加
const pluginList = [
  // ... other plugins
  QuizPlugin,
];
```

3. `src/main.ts`でスタイルをインポート:
```typescript
import "@mulmochat-plugin/quiz/style.css";
```

## パッケージエクスポート

```typescript
// デフォルト: Core（フレームワーク非依存）
import { pluginCore, TOOL_NAME, QuizData } from "@mulmochat-plugin/quiz";

// Vue実装
import QuizPlugin from "@mulmochat-plugin/quiz/vue";
import "@mulmochat-plugin/quiz/style.css";

// Vue名前付きエクスポート
import { plugin, View, Preview } from "@mulmochat-plugin/quiz/vue";

// React実装
import QuizPlugin from "@mulmochat-plugin/quiz/react";
import "@mulmochat-plugin/quiz/style.css";

// React名前付きエクスポート
import { plugin, View, Preview } from "@mulmochat-plugin/quiz/react";
```

## 開発

### セットアップ

```bash
yarn install
```

### 開発サーバー

```bash
# Vueデモ
yarn dev

# Reactデモ
yarn dev:react
```

http://localhost:5173/ でデモページが表示されます。

### ビルド

```bash
yarn build
```

### 型チェック

```bash
yarn typecheck
```

### Lint

```bash
yarn lint
```

## プラグイン構造

```
MulmoChatPluginQuiz/
├── src/
│   ├── index.ts          # デフォルトエクスポート（core）
│   ├── style.css         # Tailwind CSSエントリー
│   ├── core/             # フレームワーク非依存（Vue/React依存なし）
│   │   ├── index.ts      # Coreエクスポート
│   │   ├── types.ts      # ToolPluginCore, ToolResult, QuizData等
│   │   └── plugin.ts     # Execute関数、ツール定義、サンプル
│   ├── vue/              # Vue固有の実装
│   │   ├── index.ts      # Vueプラグイン（core + コンポーネント）
│   │   ├── types.ts      # ToolPlugin（ToolPluginCoreを拡張）
│   │   ├── View.vue      # メインビューコンポーネント
│   │   └── Preview.vue   # サイドバープレビュー
│   └── react/            # React固有の実装
│       ├── index.ts      # Reactプラグイン（core + コンポーネント）
│       ├── types.ts      # ToolPlugin（ToolPluginCoreを拡張）
│       ├── View.tsx      # メインビューコンポーネント
│       └── Preview.tsx   # サイドバープレビュー
├── demo/                 # Vueデモ
│   ├── App.vue
│   └── main.ts
├── demo-react/           # Reactデモ
│   ├── App.tsx
│   ├── main.tsx
│   ├── style.css
│   ├── index.html
│   └── vite.config.ts
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.react.json   # React用TypeScript設定
└── eslint.config.js
```

### ディレクトリの役割

- **src/core/**: フレームワーク非依存の型とプラグインロジック。Vue/React依存なし。
- **src/vue/**: Vue専用UIコンポーネントとVueプラグインエクスポート。
- **src/react/**: React専用UIコンポーネントとReactプラグインエクスポート。
- **demo/**: Vueデモ。
- **demo-react/**: Reactデモ。

## 新しいプラグインの作成

自動生成スクリプトを使用するか、詳細なテンプレートガイドを参照してください:

### クイックスタート（推奨）

```bash
# 新規プラグインを生成
./scripts/create-plugin.sh my-plugin "My Plugin" "プラグインの説明"

# 生成されたディレクトリに移動してインストール
cd ../MulmoChatPluginMyPlugin
yarn install
yarn dev
```

### 手動セットアップ

詳細な手順は [TEMPLATE.md](./TEMPLATE.md) を参照:
- Core/Vue/Reactアーキテクチャ
- そのままコピーできるファイル
- プラグイン固有の実装要件
- 重要なパターン（View.vueのリアクティビティ）

## Core型定義

### ToolPluginCore（フレームワーク非依存）

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

### ToolPlugin（Vue固有、ToolPluginCoreを拡張）

```typescript
interface ToolPlugin<T, J, A> extends ToolPluginCore<T, J, A> {
  viewComponent?: Component;      // Vue Component
  previewComponent?: Component;   // Vue Component
  config?: ToolPluginConfig;      // レガシーVueコンポーネントベースの設定
}
```

### ToolPlugin（React固有、ToolPluginCoreを拡張）

```typescript
interface ToolPlugin<T, J, A> extends ToolPluginCore<T, J, A> {
  viewComponent?: ComponentType;    // React ComponentType
  previewComponent?: ComponentType; // React ComponentType
}
```

## ライセンス

MIT
