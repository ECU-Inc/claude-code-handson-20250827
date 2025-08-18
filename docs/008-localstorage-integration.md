# チケット #008: LocalStorage統合

## 概要
ブラウザのLocalStorageを使用してタスクデータを永続化し、ページリロード後もデータを保持する機能を実装する

## 受入条件
- [x] タスクデータがLocalStorageに保存される
- [x] ページリロード後もタスクが復元される
- [x] データの自動保存が機能する
- [x] LocalStorageのエラーハンドリングがある
- [x] データの整合性が保たれる

## タスク詳細

### 1. LocalStorageフックの作成
- [x] `hooks/useLocalStorage.ts` を作成
- [x] 汎用的なuseLocalStorageフックの実装
- [x] 型安全な読み書き処理
- [x] エラーハンドリング

### 2. ストレージユーティリティの作成
- [x] `utils/storage.ts` を作成
- [x] データのシリアライズ/デシリアライズ
- [x] ストレージキーの定数化
- [x] ストレージ容量チェック

### 3. タスクデータの永続化
- [x] タスク作成時の自動保存
- [x] タスク更新時の自動保存
- [x] タスク削除時の自動保存
- [x] ドラッグ&ドロップ後の自動保存

### 4. データの復元処理
- [x] アプリ起動時のデータ読み込み
- [x] 日付型の適切な復元
- [x] データ検証とサニタイゼーション
- [x] 破損データの処理

### 5. 自動保存の実装
- [x] デバウンス処理の実装
- [x] 変更検知と差分保存
- [x] 保存状態のインジケーター（オプション）
- [x] 保存失敗時のリトライ

### 6. データ管理機能
- [x] データのエクスポート機能（オプション）
- [x] データのインポート機能（オプション）
- [x] データのクリア機能
- [x] ストレージ使用量の表示（オプション）

## 技術仕様

### useLocalStorageフック
```typescript
// hooks/useLocalStorage.ts
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // 初期値の読み込み
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error)
      return initialValue
    }
  })

  // 値の更新と保存
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error)
    }
  }

  return [storedValue, setValue]
}
```

### ストレージユーティリティ
```typescript
// utils/storage.ts
const STORAGE_KEY = 'kanban_tasks'
const STORAGE_VERSION = '1.0.0'

interface StorageData {
  version: string
  tasks: Task[]
  lastUpdated: string
}

export const storage = {
  save: (tasks: Task[]): void => {
    const data: StorageData = {
      version: STORAGE_VERSION,
      tasks,
      lastUpdated: new Date().toISOString()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  },

  load: (): Task[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return []
      
      const data: StorageData = JSON.parse(stored)
      
      // バージョンチェック
      if (data.version !== STORAGE_VERSION) {
        // マイグレーション処理
      }
      
      // 日付の復元
      return data.tasks.map(task => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined
      }))
    } catch (error) {
      console.error('Failed to load tasks:', error)
      return []
    }
  },

  clear: (): void => {
    localStorage.removeItem(STORAGE_KEY)
  },

  getStorageSize: (): number => {
    const stored = localStorage.getItem(STORAGE_KEY) || ''
    return new Blob([stored]).size
  }
}
```

### 自動保存の実装
```typescript
// デバウンス処理
const useDebouncedSave = (tasks: Task[], delay: number = 500) => {
  useEffect(() => {
    const handler = setTimeout(() => {
      storage.save(tasks)
    }, delay)

    return () => clearTimeout(handler)
  }, [tasks, delay])
}
```

## 依存関係
- 前提: チケット#003（タスクデータ構造）が完了していること

## 備考
- LocalStorageの容量制限: 通常5-10MB
- プライバシーモード対応: try-catchでエラーハンドリング
- 将来的な拡張: IndexedDB への移行準備
- セキュリティ: 機密情報は保存しない