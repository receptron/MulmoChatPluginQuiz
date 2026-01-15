# MulmoChat Plugin Quiz

> **📦 テンプレートリポジトリ**
> これは [MulmoChat](https://github.com/receptron/MulmoChat) プラグインのリファレンス実装です。
> このリポジトリをテンプレートとして使用し、独自のプラグインを作成できます。
> 詳細は [TEMPLATE.md](./TEMPLATE.md) を参照してください。

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
- そのままコピーできるファイル
- 変更が必要なファイル（`package.json` のみ）
- プラグイン固有の実装要件
- 重要なパターン（View.vue のリアクティビティ）

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
