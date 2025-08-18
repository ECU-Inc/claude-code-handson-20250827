# チケット #001: プロジェクトセットアップと初期設定

## 概要
Next.js 14+ (App Router) を使用したカンバンアプリケーションの初期プロジェクトセットアップ

## 受入条件
- [x] Next.js 14+ プロジェクトが作成されている
- [x] TypeScriptが設定されている
- [x] Tailwind CSSが設定されている
- [x] 基本的なプロジェクト構造が作成されている
- [x] 開発サーバーが正常に起動する

## タスク詳細

### 1. Next.jsプロジェクトの作成
- [x] `npx create-next-app@latest` コマンドでプロジェクトを初期化
- [x] App Routerを選択
- [x] TypeScriptを有効化
- [x] Tailwind CSSを有効化
- [x] ESLintを有効化

### 2. プロジェクト構造の作成
- [x] 以下のディレクトリ構造を作成
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
├── types/
├── hooks/
└── utils/
```

### 3. 必要な依存関係のインストール
- [x] ドラッグ&ドロップライブラリ（@dnd-kit/sortable）のインストール
- [x] 必要に応じてその他のユーティリティライブラリをインストール

### 4. 基本設定ファイルの更新
- [x] `tsconfig.json` の設定確認と必要に応じた調整
- [x] `tailwind.config.ts` の設定確認
- [x] `.eslintrc.json` の設定確認

### 5. 開発環境の動作確認
- [x] `npm run dev` で開発サーバーが起動することを確認
- [x] http://localhost:3000 でアプリケーションが表示されることを確認
- [x] TypeScriptの型チェックが正常に動作することを確認
- [x] Tailwind CSSのスタイルが適用されることを確認

## 技術仕様
- **Framework**: Next.js 14+
- **Router**: App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Package Manager**: npm

## 備考
- プロジェクト名: kanban-app
- Node.js version: 18以上推奨