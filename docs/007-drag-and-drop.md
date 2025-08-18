# チケット #007: ドラッグ&ドロップ機能の実装

## 概要
タスクカードをドラッグ&ドロップで異なる列（ステータス）間で移動できる機能を実装する

## 受入条件
- [x] タスクカードがドラッグ可能である
- [x] ドラッグ中の視覚的フィードバックがある
- [x] 異なる列にドロップできる
- [x] 同じ列内での並び替えができる
- [x] ドロップ後、ステータスが更新される
- [x] スムーズなアニメーションで移動する

## タスク詳細

### 1. ドラッグ&ドロップライブラリの設定
- [x] @dnd-kit/sortableのインストール
- [x] 必要なプロバイダーの設定
- [x] ドラッグコンテキストの実装

### 2. ドラッグ可能なタスクカードの実装
- [x] TaskCardをドラッグ可能にする
- [x] ドラッグハンドルの追加（オプション）
- [x] ドラッグ中のカーソル変更
- [x] タッチデバイス対応

### 3. ドロップゾーンの実装
- [x] 各列をドロップゾーンとして設定
- [x] ドロップ可能エリアの視覚的表示
- [x] 空の列へのドロップ対応
- [x] ドロップ位置のインジケーター表示

### 4. ドラッグ中の視覚効果
- [x] ドラッグ中のカードの半透明化
- [x] ドラッグ中のゴースト要素
- [x] ドロップ可能エリアのハイライト
- [x] 無効なドロップエリアの表示

### 5. ドロップ処理の実装
- [x] ドロップ時のステータス更新
- [x] 列間の移動処理
- [x] 同一列内の並び替え処理
- [x] 状態の即座の更新

### 6. アニメーションの実装
- [x] スムーズな移動アニメーション
- [x] スプリング効果（オプション）
- [x] 失敗時の元位置への戻りアニメーション

## 技術仕様

### DnD設定
```tsx
// @dnd-kit/sortable の使用
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

// センサー設定
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8, // 8px移動してからドラッグ開始
    },
  }),
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })
)
```

### ドラッグ&ドロップハンドラー
```typescript
const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event

  if (!over) return

  const activeTask = findTask(active.id)
  const overColumn = findColumn(over.id)

  if (activeTask && overColumn) {
    // ステータス更新
    updateTask(activeTask.id, { 
      status: overColumn.status,
      updatedAt: new Date()
    })

    // 並び替え処理（同一列内の場合）
    if (active.id !== over.id) {
      // arrayMove を使用した並び替え
    }
  }
}
```

### ドラッグ可能なカード
```tsx
// components/DraggableTaskCard.tsx
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function DraggableTaskCard({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} isDragging={isDragging} />
    </div>
  )
}
```

## 依存関係
- 前提: チケット#001, #002, #003が完了していること
- @dnd-kit/sortable ライブラリ

## 備考
- アクセシビリティ: キーボードでのドラッグ&ドロップ対応
- パフォーマンス: 大量カードでの最適化（仮想スクロール検討）
- モバイル: タッチジェスチャー対応
- UX: ドラッグ開始の閾値設定（誤操作防止）