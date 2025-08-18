# チケット #004: タスク作成機能の実装

## 概要
新規タスクカードを追加する機能を実装する（モーダルまたはフォーム形式）

## 受入条件
- [x] 新規タスク追加ボタンが表示される
- [x] タスク作成フォーム/モーダルが開く
- [x] 必要な情報を入力してタスクを作成できる
- [x] 作成されたタスクがTODO列に追加される
- [x] バリデーションが適切に機能する

## タスク詳細

### 1. タスク追加ボタンの実装
- [x] ヘッダーまたは各列に「+」ボタンを配置
- [x] ボタンクリックでフォーム/モーダルを開く
- [x] 適切なアイコンとツールチップを表示

### 2. TaskModalコンポーネントの作成
- [x] `components/TaskModal.tsx` を作成
- [x] モーダルのオーバーレイ実装
- [x] ESCキーやオーバーレイクリックで閉じる機能
- [x] フォーカストラップの実装

### 3. タスク作成フォームの実装
- [x] 入力フィールドの実装
  - [x] タイトル（必須、テキスト入力）
  - [x] 説明（任意、テキストエリア）
  - [x] 期限（任意、日付ピッカー）
  - [x] 担当者（任意、テキスト入力）
  - [x] ステータス（デフォルト: TODO）
- [x] 送信ボタンとキャンセルボタン

### 4. バリデーションの実装
- [x] タイトルの必須チェック
- [x] タイトルの最大文字数制限（100文字）
- [x] 説明の最大文字数制限（500文字）
- [x] 期限の日付形式チェック
- [x] エラーメッセージの表示

### 5. 状態管理の実装
- [x] タスクリストの状態管理（useState）
- [x] 新規タスクの追加処理
- [x] IDの自動生成
- [x] 作成日時の自動設定
- [x] TODO列への自動追加

### 6. フォームのリセット
- [x] 送信後のフォームクリア
- [x] キャンセル時のフォームクリア
- [x] モーダルを閉じる処理

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