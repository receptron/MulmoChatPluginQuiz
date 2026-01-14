# MulmoChat Plugin Quiz

MulmoChat用のクイズプラグイン。複数選択式のクイズをユーザーに提示します。

## 概要

このプラグインは、MulmoChatのプラグインシステムのリファレンス実装です。外部依存がなく、サーバー通信も不要なシンプルな構造のため、新しいプラグインを作成する際のテンプレートとして使用できます。

## インストール

### MulmoChatへの追加

1. プラグインをビルド:
```bash
cd MulmoChatPluginQuiz
yarn install
yarn build
yarn pack
```

2. MulmoChatの`package.json`に依存関係を追加:
```json
{
  "dependencies": {
    "mulmochat-plugin-quiz": "file:../MulmoChatPluginQuiz/mulmochat-plugin-quiz-v0.1.0.tgz"
  }
}
```

3. MulmoChatの`src/tools/index.ts`でインポート:
```typescript
import type { ToolPlugin } from "./types";

// Quiz plugin from npm package
import { QuizPlugin as QuizPluginImport } from "mulmochat-plugin-quiz";
const QuizPlugin = QuizPluginImport as { plugin: ToolPlugin };

// pluginListに追加
const pluginList = [
  // ... other plugins
  QuizPlugin,
];
```

4. MulmoChatで依存関係を再インストール:
```bash
cd MulmoChat
yarn install --force
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

## プラグイン構造

```
MulmoChatPluginQuiz/
├── src/
│   ├── index.ts          # エクスポート定義
│   ├── plugin.ts         # プラグイン実装
│   ├── types.ts          # 型定義
│   ├── views/
│   │   └── QuizView.vue  # メインビューコンポーネント
│   └── previews/
│       └── QuizPreview.vue  # サイドバープレビュー
├── demo/                 # 開発用デモページ
├── package.json
├── vite.config.ts
└── tsconfig.json
```

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
}
```

## ライセンス

MIT
