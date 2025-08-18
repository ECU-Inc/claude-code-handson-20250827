# チケット #003: タスクカードのデータ構造と型定義

## 概要
タスクカードのデータ構造をTypeScriptで定義し、タスクカードコンポーネントを実装する

## 受入条件
- [ ] タスクの型定義が作成されている
- [ ] タスクカードコンポーネントが実装されている
- [ ] タスクカードに必要な情報が表示される
- [ ] TypeScriptの型安全性が保証されている

## タスク詳細

### 1. タスク型定義の作成
- [ ] `types/task.ts` を作成
- [ ] Task インターフェースを定義
  - [ ] id: string（一意の識別子）
  - [ ] title: string（必須）
  - [ ] description: string | undefined（任意）
  - [ ] dueDate: Date | undefined（任意）
  - [ ] assignee: string | undefined（任意）
  - [ ] status: TaskStatus（列挙型）
  - [ ] createdAt: Date（作成日時）
  - [ ] updatedAt: Date（更新日時）

### 2. ステータス型の定義
- [ ] TaskStatus 型を定義（'todo' | 'in-progress' | 'review' | 'done'）
- [ ] ステータスの表示名をマッピングする定数を作成

### 3. TaskCardコンポーネントの実装
- [ ] `components/TaskCard.tsx` を作成
- [ ] Propsの型定義（Task型を使用）
- [ ] カード内に以下の情報を表示
  - [ ] タイトル（必須表示）
  - [ ] 説明（存在する場合のみ表示、省略表示）
  - [ ] 期限（存在する場合のみ表示、フォーマット済み）
  - [ ] 担当者（存在する場合のみ表示）

### 4. カードのスタイリング
- [ ] カード型のデザイン（影、角丸、パディング）
- [ ] ホバー時のエフェクト
- [ ] 期限が近い場合の視覚的フィードバック
- [ ] ステータスに応じた色分け（オプション）

### 5. ユーティリティ関数の作成
- [ ] `utils/task.ts` を作成
- [ ] ID生成関数（UUID or timestamp-based）
- [ ] 日付フォーマット関数
- [ ] タスクの初期値を生成する関数

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