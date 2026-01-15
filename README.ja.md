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
import QuizPlugin from "@mulmochat-plugin/quiz";
import "@mulmochat-plugin/quiz/style.css";

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
│   ├── style.css         # Tailwind CSSエントリー
│   ├── common/           # プラグイン非依存の共通コード
│   │   ├── index.ts      # 共通エクスポート
│   │   └── types.ts      # ToolPlugin, ToolResult など
│   └── plugin/           # クイズ固有の実装
│       ├── index.ts      # プラグインインスタンスと実行ロジック
│       ├── types.ts      # クイズの型とTOOL_DEFINITION
│       ├── samples.ts    # テスト用サンプルデータ
│       ├── View.vue      # メインビューコンポーネント
│       └── Preview.vue   # サイドバープレビューコンポーネント
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
- **src/plugin/**: クイズ固有の実装。独自のプラグインロジックに置き換える。
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

3. `src/plugin/types.ts`を編集:
   - 型を定義
   - `TOOL_DEFINITION`: ツール名、説明、パラメータを定義

4. `src/plugin/samples.ts`を編集:
   - テスト用サンプルデータを追加

5. `src/plugin/index.ts`を編集:
   - ツール実行ロジックを実装

6. `src/plugin/View.vue`を編集:
   - メイン表示コンポーネント
   - Props: `selectedResult`, `sendTextMessage`
   - Emit: `updateResult`

7. `src/plugin/Preview.vue`を編集:
   - サイドバー用プレビューコンポーネント
   - Props: `result`

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
