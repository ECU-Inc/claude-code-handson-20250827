# チケット #004: タスク作成機能の実装

## 概要
新規タスクカードを追加する機能を実装する（モーダルまたはフォーム形式）

## 受入条件
- [ ] 新規タスク追加ボタンが表示される
- [ ] タスク作成フォーム/モーダルが開く
- [ ] 必要な情報を入力してタスクを作成できる
- [ ] 作成されたタスクがTODO列に追加される
- [ ] バリデーションが適切に機能する

## タスク詳細

### 1. タスク追加ボタンの実装
- [ ] ヘッダーまたは各列に「+」ボタンを配置
- [ ] ボタンクリックでフォーム/モーダルを開く
- [ ] 適切なアイコンとツールチップを表示

### 2. TaskModalコンポーネントの作成
- [ ] `components/TaskModal.tsx` を作成
- [ ] モーダルのオーバーレイ実装
- [ ] ESCキーやオーバーレイクリックで閉じる機能
- [ ] フォーカストラップの実装

### 3. タスク作成フォームの実装
- [ ] 入力フィールドの実装
  - [ ] タイトル（必須、テキスト入力）
  - [ ] 説明（任意、テキストエリア）
  - [ ] 期限（任意、日付ピッカー）
  - [ ] 担当者（任意、テキスト入力）
  - [ ] ステータス（デフォルト: TODO）
- [ ] 送信ボタンとキャンセルボタン

### 4. バリデーションの実装
- [ ] タイトルの必須チェック
- [ ] タイトルの最大文字数制限（100文字）
- [ ] 説明の最大文字数制限（500文字）
- [ ] 期限の日付形式チェック
- [ ] エラーメッセージの表示

### 5. 状態管理の実装
- [ ] タスクリストの状態管理（useState）
- [ ] 新規タスクの追加処理
- [ ] IDの自動生成
- [ ] 作成日時の自動設定
- [ ] TODO列への自動追加

### 6. フォームのリセット
- [ ] 送信後のフォームクリア
- [ ] キャンセル時のフォームクリア
- [ ] モーダルを閉じる処理

## 技術仕様

### コンポーネント構造
```tsx
// components/TaskModal.tsx
interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  initialValues?: Partial<Task>
  mode: 'create' | 'edit'
}

// フォームの状態
interface TaskFormData {
  title: string
  description: string
  dueDate: string
  assignee: string
  status: TaskStatus
}
```

### バリデーションルール
```typescript
const validationRules = {
  title: {
    required: true,
    maxLength: 100,
    minLength: 1
  },
  description: {
    maxLength: 500
  },
  assignee: {
    maxLength: 50
  }
}
```

## 依存関係
- 前提: チケット#001, #002, #003が完了していること

## 備考
- アクセシビリティ: ARIA属性、キーボードナビゲーション対応
- UX: オートフォーカス、エンターキーでの送信対応
- 将来的な拡張: ファイル添付、タグ機能への対応準備