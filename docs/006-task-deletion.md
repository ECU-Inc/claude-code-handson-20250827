# チケット #006: タスク削除機能の実装

## 概要
タスクカードを削除する機能を実装する

## 受入条件
- [ ] タスクカードに削除ボタン/アイコンが表示される
- [ ] 削除確認ダイアログが表示される
- [ ] 確認後、タスクが削除される
- [ ] 削除後、UIが即座に更新される
- [ ] 誤操作防止の仕組みがある

## タスク詳細

### 1. 削除UIの実装
- [ ] タスクカードに削除ボタン/アイコンを追加
- [ ] ホバー時のみ表示（オプション）
- [ ] 削除ボタンの視覚的な警告色（赤系）
- [ ] 適切なツールチップ表示

### 2. 削除確認ダイアログの実装
- [ ] 確認モーダル/ダイアログコンポーネントの作成
- [ ] タスクタイトルを含む確認メッセージ
- [ ] 「削除」と「キャンセル」ボタン
- [ ] ESCキーでキャンセル可能

### 3. 削除処理の実装
- [ ] タスクを配列から削除する関数
- [ ] 削除後の状態更新
- [ ] 削除成功のフィードバック（オプション）

### 4. 誤操作防止
- [ ] 削除ボタンの誤クリック防止（位置調整）
- [ ] ダブルクリック防止
- [ ] 削除中の重複操作防止

### 5. アニメーションの実装（オプション）
- [ ] 削除時のフェードアウト効果
- [ ] リストからの滑らかな削除
- [ ] 削除後の他カードの位置調整

### 6. 削除の取り消し機能（オプション）
- [ ] 削除後の「元に戻す」オプション
- [ ] 一時的な削除履歴保持
- [ ] トースト通知での取り消しオプション

## 技術仕様

### 削除確認ダイアログ
```tsx
// components/ConfirmDialog.tsx
interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'danger' | 'warning' | 'info'
}
```

### 削除処理
```typescript
// 削除関数
const deleteTask = (taskId: string) => {
  setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
}

// 削除確認付き削除
const handleDeleteTask = (task: Task) => {
  setDeleteTarget(task)
  setShowConfirmDialog(true)
}

const confirmDelete = () => {
  if (deleteTarget) {
    deleteTask(deleteTarget.id)
    setShowConfirmDialog(false)
    setDeleteTarget(null)
    // オプション: 削除通知表示
  }
}
```

### 削除の取り消し（オプション）
```typescript
interface DeletedTask {
  task: Task
  deletedAt: Date
  position: number
}

const [deletedTasks, setDeletedTasks] = useState<DeletedTask[]>([])

const undoDelete = (deletedTask: DeletedTask) => {
  // タスクを元の位置に復元
  setTasks(prevTasks => {
    const newTasks = [...prevTasks]
    newTasks.splice(deletedTask.position, 0, deletedTask.task)
    return newTasks
  })
}
```

## 依存関係
- 前提: チケット#001, #002, #003が完了していること

## 備考
- アクセシビリティ: 削除ボタンにaria-label設定
- パフォーマンス: 大量タスク削除時の最適化
- UX: 削除は破壊的操作なので慎重に設計