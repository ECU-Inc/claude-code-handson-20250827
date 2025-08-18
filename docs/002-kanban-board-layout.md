# チケット #002: カンバンボードレイアウトの実装

## 概要
4列（TODO, In Progress, Review, Done）のカンバンボードレイアウトを実装する

## 受入条件
- [x] 4列のカンバンボードが表示される
- [x] 各列にヘッダーが表示される（TODO, In Progress, Review, Done）
- [x] レスポンシブデザインが適用されている（デスクトップ優先）
- [x] 各列が視覚的に区別できる

## タスク詳細

### 1. KanbanBoardコンポーネントの作成
- [x] `components/KanbanBoard.tsx` を作成
- [x] 4列のグリッドレイアウトを実装
- [x] 各列の幅が均等になるように設定

### 2. TaskColumnコンポーネントの作成
- [x] `components/TaskColumn.tsx` を作成
- [x] 列のヘッダー（ステータス名）を表示
- [x] タスクカードを配置するためのコンテナを用意
- [x] 各列に適切な背景色またはボーダーを設定

### 3. メインページへの統合
- [x] `app/page.tsx` にKanbanBoardコンポーネントを配置
- [x] ヘッダーとフッターのレイアウトを設定

### 4. スタイリングの実装
- [x] Tailwind CSSを使用したレスポンシブデザイン
- [x] モバイル: 縦スクロール可能な1列表示
- [x] タブレット: 2列表示
- [x] デスクトップ: 4列表示
- [x] 適切な余白とパディングの設定

### 5. 列の状態管理準備
- [x] 各列のステータスを定義（TODO, In Progress, Review, Done）
- [x] 列の状態を管理するための基本構造を準備

## 技術仕様

### コンポーネント構造
```tsx
// KanbanBoard.tsx
interface KanbanBoardProps {
  // 将来的にタスクデータを受け取る
}

// TaskColumn.tsx
interface TaskColumnProps {
  title: string
  status: 'todo' | 'in-progress' | 'review' | 'done'
  // 将来的にタスクリストを受け取る
}
```

### スタイリング要件
- グリッドレイアウト（desktop: grid-cols-4）
- 各列の最小高さ: 500px
- 列間のギャップ: 1rem
- 列の背景: 薄いグレーまたは白
- 列のボーダー: 1px solid gray-200

## 依存関係
- 前提: チケット#001が完了していること

## 備考
- ドラッグ&ドロップ機能の実装準備として、各列にIDやデータ属性を設定しておく
- アクセシビリティを考慮し、適切なARIA属性を設定する