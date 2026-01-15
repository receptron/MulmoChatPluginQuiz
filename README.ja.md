# MulmoChat Plugin Quiz

MulmoChat用のクイズプラグイン。複数選択式のクイズをユーザーに提示します。

## 概要

このプラグインは、MulmoChatのプラグインシステムのリファレンス実装です。サーバー通信不要なシンプルな構造のため、新しいプラグインを作成する際のテンプレートとして使用できます。

- **Tailwind CSS 4** を使用したスタイリング
- **TypeScript** による型安全な実装
- **ESLint** による静的解析

## インストール

### MulmoChatへの追加

1. プラグインをインストール:
```bash
cd MulmoChat
yarn add @mulmochat-plugin/quiz
```

2. MulmoChatの`src/tools/index.ts`でインポート:
```typescript
import type { ToolPlugin } from "./types";

// Quiz plugin from npm package
import { QuizPlugin as QuizPluginImport } from "@mulmochat-plugin/quiz";
import "@mulmochat-plugin/quiz/style.css"; // Tailwind CSSスタイル
const QuizPlugin = QuizPluginImport as { plugin: ToolPlugin };

// pluginListに追加
const pluginList = [
  // ... other plugins
  QuizPlugin,
];
```

## 開発

### セットアップ

```bash
yarn install
```

### 開発サーバー

```bash
yarn dev
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
│   ├── index.ts          # エクスポート定義
│   ├── plugin.ts         # クイズ固有のプラグイン実装
│   ├── types.ts          # 共通型の再エクスポート（後方互換）
│   ├── style.css         # Tailwind CSSエントリー
│   ├── common/           # プラグイン非依存の共通コード
│   │   ├── index.ts      # 共通エクスポート
│   │   └── types.ts      # ToolPlugin, ToolResult など
│   ├── views/
│   │   └── QuizView.vue  # クイズ固有のビューコンポーネント
│   └── previews/
│       └── QuizPreview.vue  # クイズ固有のプレビュー
├── demo/                 # 汎用プラグインデモ（どのプラグインでも動作）
│   ├── App.vue           # 動的コンポーネント描画
│   └── main.ts
├── package.json
├── vite.config.ts
├── tsconfig.json
└── eslint.config.js
```

### ディレクトリの役割

- **src/common/**: プラグイン非依存の型とユーティリティ。新しいプラグインにコピーするか、このパッケージからインポート。
- **src/plugin.ts**: クイズ固有の実装。独自のプラグインロジックに置き換える。
- **src/views/**, **src/previews/**: クイズ固有のVueコンポーネント。独自のものを作成。
- **demo/**: 任意のToolPluginで動作する汎用デモ。インポートを変更するだけで使用可能。

## 新しいプラグインの作成

このリポジトリをベースに新しいプラグインを作成する手順:

1. リポジトリをコピー:
```bash
cp -r MulmoChatPluginQuiz MulmoChatPluginYourPlugin
cd MulmoChatPluginYourPlugin
rm -rf .git node_modules dist *.tgz
git init
```

2. `package.json`を編集:
   - `name`: `mulmochat-plugin-yourplugin`
   - `description`: プラグインの説明

3. `src/plugin.ts`を編集:
   - `TOOL_DEFINITION`: ツール名、説明、パラメータを定義
   - `execute`: ツール実行ロジックを実装
   - 必要に応じて型定義を追加

4. `src/views/YourView.vue`を作成:
   - メイン表示コンポーネント
   - Props: `selectedResult`, `sendTextMessage`
   - Emit: `updateResult`

5. `src/previews/YourPreview.vue`を作成:
   - サイドバー用のプレビューコンポーネント
   - Props: `result`

6. `src/index.ts`でエクスポートを更新

7. `demo/App.vue`をプラグインに合わせて更新

## ToolPlugin インターフェース

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
  samples?: ToolSample[];  // テスト用サンプルデータ
}
```

## ライセンス

MIT
