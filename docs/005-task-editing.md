# チケット #005: タスク編集機能の実装

## 概要
既存のタスクカードを編集する機能を実装する

## 受入条件
- [x] タスクカードをクリックで編集モードに入れる
- [x] 編集フォーム/モーダルが開く
- [x] 既存の情報がフォームに表示される
- [x] 変更を保存できる
- [x] 変更をキャンセルできる

## タスク詳細

### 1. 編集トリガーの実装
- [x] タスクカードのクリックイベントハンドラー
- [x] 編集アイコン/ボタンの追加（オプション）
- [x] ダブルクリックでの編集開始（オプション）

### 2. 編集モーダルの実装
- [x] TaskModalコンポーネントの再利用
- [x] 編集モードの判定（create/edit）
- [x] 既存データの読み込みと表示
- [x] タイトルを「タスクを編集」に変更

### 3. フォームの初期値設定
- [x] 選択されたタスクのデータをフォームに反映
- [x] 日付のフォーマット変換
- [x] ステータスの選択状態を設定

### 4. 更新処理の実装
- [ ] タスクの更新関数を作成
- [ ] IDを保持したまま他のフィールドを更新
- [ ] updatedAtの自動更新
- [ ] 状態の即座の反映

### 5. ステータス変更の処理
- [ ] ステータスドロップダウンの実装
- [ ] ステータス変更時の列移動処理
- [ ] 変更前後の確認（オプション）

### 6. 変更の検証
- [ ] 変更があったかどうかの判定
- [ ] 変更がない場合の保存ボタン無効化（オプション）
- [ ] 未保存の変更がある場合の警告

## 技術仕様

### 編集処理のフロー
```typescript
// タスク更新関数
const updateTask = (taskId: string, updates: Partial<Task>) => {
  setTasks(prevTasks =>
    prevTasks.map(task =>
      task.id === taskId
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    )
  )
}

// 編集モーダルの呼び出し
const handleEditTask = (task: Task) => {
  setSelectedTask(task)
  setModalMode('edit')
  setIsModalOpen(true)
}
```

### フォームの差分検出
```typescript
const hasChanges = (original: Task, current: TaskFormData): boolean => {
  return (
    original.title !== current.title ||
    original.description !== current.description ||
    original.dueDate?.toISOString() !== current.dueDate ||
    original.assignee !== current.assignee ||
    original.status !== current.status
  )
}
```

## 依存関係
- 前提: チケット#001, #002, #003, #004が完了していること
- TaskModalコンポーネントが編集モードに対応していること

## 備考
- UX: 編集中は他の操作をブロック
- 編集の競合防止（楽観的更新）
- キーボードショートカット: Cmd/Ctrl+Sで保存