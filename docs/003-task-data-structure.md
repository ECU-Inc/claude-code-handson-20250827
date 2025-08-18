# チケット #003: タスクカードのデータ構造と型定義

## 概要
タスクカードのデータ構造をTypeScriptで定義し、タスクカードコンポーネントを実装する

## 受入条件
- [x] タスクの型定義が作成されている
- [x] タスクカードコンポーネントが実装されている
- [x] タスクカードに必要な情報が表示される
- [x] TypeScriptの型安全性が保証されている

## タスク詳細

### 1. タスク型定義の作成
- [x] `types/task.ts` を作成
- [x] Task インターフェースを定義
  - [x] id: string（一意の識別子）
  - [x] title: string（必須）
  - [x] description: string | undefined（任意）
  - [x] dueDate: Date | undefined（任意）
  - [x] assignee: string | undefined（任意）
  - [x] status: TaskStatus（列挙型）
  - [x] createdAt: Date（作成日時）
  - [x] updatedAt: Date（更新日時）

### 2. ステータス型の定義
- [x] TaskStatus 型を定義（'todo' | 'in-progress' | 'review' | 'done'）
- [x] ステータスの表示名をマッピングする定数を作成

### 3. TaskCardコンポーネントの実装
- [x] `components/TaskCard.tsx` を作成
- [x] Propsの型定義（Task型を使用）
- [x] カード内に以下の情報を表示
  - [x] タイトル（必須表示）
  - [x] 説明（存在する場合のみ表示、省略表示）
  - [x] 期限（存在する場合のみ表示、フォーマット済み）
  - [x] 担当者（存在する場合のみ表示）

### 4. カードのスタイリング
- [x] カード型のデザイン（影、角丸、パディング）
- [x] ホバー時のエフェクト
- [x] 期限が近い場合の視覚的フィードバック
- [x] ステータスに応じた色分け（オプション）

### 5. ユーティリティ関数の作成
- [x] `utils/task.ts` を作成
- [x] ID生成関数（UUID or timestamp-based）
- [x] 日付フォーマット関数
- [x] タスクの初期値を生成する関数

## 技術仕様

### 型定義
```typescript
// types/task.ts
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done'

export interface Task {
  id: string
  title: string
  description?: string
  dueDate?: Date
  assignee?: string
  status: TaskStatus
  createdAt: Date
  updatedAt: Date
}

export const TaskStatusLabels: Record<TaskStatus, string> = {
  'todo': 'TODO',
  'in-progress': 'In Progress',
  'review': 'Review',
  'done': 'Done'
}
```

### コンポーネントProps
```typescript
// components/TaskCard.tsx
interface TaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
  isDragging?: boolean
}
```

## 依存関係
- 前提: チケット#001が完了していること

## 備考
- 将来的なドラッグ&ドロップ対応のため、isDraggingプロパティを用意
- アクセシビリティ: role="article"、適切なaria-label
- パフォーマンス: React.memoの使用を検討