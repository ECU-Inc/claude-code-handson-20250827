# カンバンアプリケーション要件定義書

## 1. プロジェクト概要

### 目的
タスク管理を効率的に行うためのカンバンボードアプリケーションをMVPレベルで作成する。

### スコープ
- 個人利用向けのシンプルなカンバンボード
- ローカル環境での動作
- 基本的なタスク管理機能の実装

## 2. 機能要件

### 2.1 カンバンボード

#### ステータス（列）
- **TODO**: 未着手のタスク
- **In Progress**: 作業中のタスク  
- **Review**: レビュー待ちのタスク
- **Done**: 完了したタスク

#### 基本機能
- 4列のカンバンボードレイアウト
- 各列にタスクカードを表示
- ドラッグ&ドロップによるカード移動

### 2.2 タスクカード

#### データ構造
各タスクカードは以下の情報を持つ：
- **タイトル**: タスクの名前（必須）
- **説明**: タスクの詳細説明（任意）
- **期限**: タスクの締切日（任意）
- **担当者**: タスクの責任者（任意）
- **ID**: 一意の識別子（自動生成）
- **ステータス**: 現在の状態（TODO/In Progress/Review/Done）
- **作成日時**: カード作成日時（自動設定）

### 2.3 タスク操作

#### CRUD機能
- **作成**: 新規タスクカードの追加
- **読取**: タスクカードの詳細表示
- **更新**: タスク情報の編集
- **削除**: タスクカードの削除

#### インタラクション
- ドラッグ&ドロップによるステータス変更
- カードクリックによる詳細表示/編集
- モーダルまたはインライン編集

### 2.4 データ永続化
- ローカルストレージを使用したデータ保存
- ページリロード時のデータ復元
- 自動保存機能

## 3. 非機能要件

### 3.1 ユーザビリティ
- 直感的で分かりやすい操作性
- レスポンシブデザイン（デスクトップ優先）
- スムーズなドラッグ&ドロップ体験

### 3.2 パフォーマンス
- 軽快な動作
- 即座のフィードバック
- ローカルストレージへの効率的な読み書き

### 3.3 デザイン
- モダンでクリーンなUI
- 視認性の高いカラースキーム
- 適切な余白とタイポグラフィ

## 4. 技術仕様

### 4.1 技術スタック
- **フレームワーク**: Next.js 14+ (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **状態管理**: React Hooks (useState, useEffect)
- **データ保存**: LocalStorage API
- **ドラッグ&ドロップ**: @dnd-kit/sortable または react-beautiful-dnd

### 4.2 プロジェクト構造
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── KanbanBoard.tsx
│   ├── TaskCard.tsx
│   ├── TaskColumn.tsx
│   └── TaskModal.tsx
├── types/
│   └── task.ts
├── hooks/
│   └── useLocalStorage.ts
└── utils/
    └── storage.ts
```

## 5. 画面構成

### 5.1 メイン画面
- ヘッダー: アプリタイトル、新規タスク追加ボタン
- カンバンボード: 4列のタスクボード
- フッター: 必要に応じて統計情報等

### 5.2 タスク追加/編集モーダル
- タイトル入力フィールド
- 説明テキストエリア
- 期限日付ピッカー
- 担当者入力フィールド
- 保存/キャンセルボタン

## 6. MVP完了条件

以下の機能が実装され、正常に動作すること：

1. ✅ 4列のカンバンボードが表示される
2. ✅ タスクカードを追加できる
3. ✅ タスクカードをドラッグ&ドロップで移動できる
4. ✅ タスクカードを編集できる
5. ✅ タスクカードを削除できる
6. ✅ データがローカルストレージに保存される
7. ✅ ページリロード後もデータが保持される
8. ✅ モダンで見やすいUIデザイン

## 7. 今後の拡張可能性（MVP後）

- 複数ユーザー対応
- タスクのフィルタリング/検索機能
- タグ/ラベル機能
- 優先度設定
- 進捗率表示
- アーカイブ機能
- データのエクスポート/インポート
- ダークモード対応
- モバイル最適化

## 8. 制約事項

- 初期バージョンは個人利用のみ
- オフライン環境での動作を前提
- ブラウザのローカルストレージ容量制限あり（通常5-10MB）
- IE非対応（モダンブラウザのみサポート）

## 9. 開発コマンド

プロジェクトセットアップ後に以下のコマンドが使用可能：

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# プロダクションモードでの起動
npm start

# 型チェック
npm run type-check

# リント
npm run lint
```

## 10. リポジトリ情報

- **Repository**: ECU-Inc/claude-code-handson-20250827
- **Remote**: git@github.com:ECU-Inc/claude-code-handson-20250827.git

## 11. Next.js ベストプラクティス

### 11.1 App Router の活用

#### Server Components（デフォルト）
```tsx
// app/page.tsx - Server Component（デフォルト）
async function Page() {
  const data = await fetch('https://api.example.com/data')
  return <div>{data}</div>
}
```

#### Client Components（必要な場合のみ）
```tsx
// components/InteractiveComponent.tsx
'use client'  // ファイル冒頭に必ず記載

import { useState } from 'react'

export function InteractiveComponent() {
  const [state, setState] = useState()
  // インタラクティブな機能
}
```

### 11.2 データフェッチング

#### Server Components でのデータ取得
```tsx
// 推奨: Server Component での直接的なデータ取得
async function TaskList() {
  const tasks = await getTasks() // サーバーサイドで実行
  return <ul>{/* tasks rendering */}</ul>
}
```

#### クライアントサイドでのデータ取得
```tsx
// Client Component での SWR/TanStack Query 使用
'use client'
import useSWR from 'swr'

function ClientTaskList() {
  const { data, error, isLoading } = useSWR('/api/tasks', fetcher)
  // ...
}
```

### 11.3 パフォーマンス最適化

#### Image コンポーネントの使用
```tsx
import Image from 'next/image'

// ❌ 避ける
<img src="/image.jpg" alt="description" />

// ✅ 推奨
<Image 
  src="/image.jpg" 
  alt="description"
  width={500}
  height={300}
  priority={false}
/>
```

#### 動的インポート
```tsx
import dynamic from 'next/dynamic'

// 大きなコンポーネントの遅延読み込み
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false // 必要に応じて
})
```

### 11.4 TypeScript 活用

#### 型安全なルーティング
```tsx
// types/routes.ts
export const routes = {
  home: '/',
  tasks: '/tasks',
  taskDetail: (id: string) => `/tasks/${id}`
} as const
```

#### Props の型定義
```tsx
interface TaskCardProps {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'review' | 'done'
}

export function TaskCard({ id, title, description, status }: TaskCardProps) {
  // ...
}
```

### 11.5 コンポーネント設計

#### コンポーネントの責務分離
```
components/
├── ui/           # 汎用UIコンポーネント
│   ├── Button.tsx
│   ├── Card.tsx
│   └── Modal.tsx
├── features/     # 機能別コンポーネント
│   ├── task/
│   │   ├── TaskCard.tsx
│   │   ├── TaskList.tsx
│   │   └── TaskForm.tsx
│   └── kanban/
│       ├── KanbanBoard.tsx
│       └── KanbanColumn.tsx
└── layouts/      # レイアウトコンポーネント
    ├── Header.tsx
    └── Footer.tsx
```

### 11.6 状態管理

#### ローカル状態（useState）
```tsx
// 単一コンポーネント内の状態
const [isOpen, setIsOpen] = useState(false)
```

#### Context API（グローバル状態）
```tsx
// contexts/TaskContext.tsx
'use client'
import { createContext, useContext } from 'react'

const TaskContext = createContext<TaskContextType | null>(null)

export function TaskProvider({ children }) {
  // ...
}

export const useTasks = () => {
  const context = useContext(TaskContext)
  if (!context) throw new Error('useTasks must be used within TaskProvider')
  return context
}
```

### 11.7 エラーハンドリング

#### Error Boundary
```tsx
// app/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>エラーが発生しました</h2>
      <button onClick={reset}>再試行</button>
    </div>
  )
}
```

#### Loading UI
```tsx
// app/loading.tsx
export default function Loading() {
  return <div>読み込み中...</div>
}
```

### 11.8 セキュリティ

#### 環境変数の管理
```env
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com  # クライアント側で使用可能
SECRET_API_KEY=secret123                      # サーバー側のみ
```

#### データのバリデーション
```tsx
// zod を使用したバリデーション
import { z } from 'zod'

const TaskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'review', 'done'])
})

// 使用例
function validateTask(data: unknown) {
  return TaskSchema.parse(data)
}
```

### 11.9 Tailwind CSS ベストプラクティス

#### コンポーネントスタイルの整理
```tsx
// ❌ 避ける: 長いクラス名の羅列
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">

// ✅ 推奨: cn() ユーティリティ関数の使用
import { cn } from '@/lib/utils'

const cardStyles = cn(
  'flex items-center justify-between p-4',
  'bg-white rounded-lg shadow-md',
  'hover:shadow-lg transition-shadow duration-200'
)

<div className={cardStyles}>
```

#### 条件付きスタイリング
```tsx
<button
  className={cn(
    'px-4 py-2 rounded',
    {
      'bg-blue-500 text-white': variant === 'primary',
      'bg-gray-200 text-gray-800': variant === 'secondary',
      'opacity-50 cursor-not-allowed': disabled
    }
  )}
>
```

### 11.10 開発ワークフロー

#### コミット前のチェック
```json
// package.json
{
  "scripts": {
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "pre-commit": "npm run lint && npm run type-check"
  }
}
```

#### フォルダ構造の規約
```
src/
├── app/              # ルーティングとページ
├── components/       # 再利用可能なコンポーネント
├── lib/             # ユーティリティ関数
├── hooks/           # カスタムフック
├── types/           # TypeScript型定義
├── styles/          # グローバルスタイル
└── constants/       # 定数定義
```

### 11.11 テスト戦略

#### ユニットテスト構造
```tsx
// __tests__/components/TaskCard.test.tsx
import { render, screen } from '@testing-library/react'
import { TaskCard } from '@/components/TaskCard'

describe('TaskCard', () => {
  it('should render task title', () => {
    render(<TaskCard title="Test Task" />)
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })
})
```

### 11.12 パフォーマンス計測

#### Web Vitals の監視
```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## 12. チケット管理

### 12.1 チケット一覧
開発タスクは以下のチケットに分割されています：
- docs/001-project-setup.md: プロジェクトセットアップと初期設定
- docs/002-kanban-board-layout.md: カンバンボードレイアウトの実装
- docs/003-task-data-structure.md: タスクカードのデータ構造と型定義
- docs/004-task-creation.md: タスク作成機能の実装
- docs/005-task-editing.md: タスク編集機能の実装
- docs/006-task-deletion.md: タスク削除機能の実装
- docs/007-drag-and-drop.md: ドラッグ&ドロップ機能の実装
- docs/008-localstorage-integration.md: LocalStorage統合
- docs/009-ui-ux-design.md: UI/UXデザインとスタイリング
- docs/010-testing-qa.md: テストと品質保証

### 12.2 タスク完了管理
各チケット内のタスクは以下の形式で管理します：
- `- [ ]`: 未完了のタスク
- `- [x]`: 完了したタスク

タスクを完了した際は、該当するチケット内のチェックボックスを `- [ ]` から `- [x]` に更新してください。