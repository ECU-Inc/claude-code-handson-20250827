# チケット #001: プロジェクトセットアップと初期設定

## 概要
Next.js 14+ (App Router) を使用したカンバンアプリケーションの初期プロジェクトセットアップ

## 受入条件
- [ ] Next.js 14+ プロジェクトが作成されている
- [ ] TypeScriptが設定されている
- [ ] Tailwind CSSが設定されている
- [ ] 基本的なプロジェクト構造が作成されている
- [ ] 開発サーバーが正常に起動する

## タスク詳細

### 1. Next.jsプロジェクトの作成
- [ ] `npx create-next-app@latest` コマンドでプロジェクトを初期化
- [ ] App Routerを選択
- [ ] TypeScriptを有効化
- [ ] Tailwind CSSを有効化
- [ ] ESLintを有効化

### 2. プロジェクト構造の作成
- [ ] 以下のディレクトリ構造を作成
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
- [ ] ドラッグ&ドロップライブラリ（@dnd-kit/sortable）のインストール
- [ ] 必要に応じてその他のユーティリティライブラリをインストール

### 4. 基本設定ファイルの更新
- [ ] `tsconfig.json` の設定確認と必要に応じた調整
- [ ] `tailwind.config.ts` の設定確認
- [ ] `.eslintrc.json` の設定確認

### 5. 開発環境の動作確認
- [ ] `npm run dev` で開発サーバーが起動することを確認
- [ ] http://localhost:3000 でアプリケーションが表示されることを確認
- [ ] TypeScriptの型チェックが正常に動作することを確認
- [ ] Tailwind CSSのスタイルが適用されることを確認

## 技術仕様
- **Framework**: Next.js 14+
- **Router**: App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Package Manager**: npm

## 備考
- プロジェクト名: kanban-app
- Node.js version: 18以上推奨