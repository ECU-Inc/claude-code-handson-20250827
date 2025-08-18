#!/bin/bash
set -e

# デバッグモード
if [[ "${DEBUG:-}" == "1" ]]; then
    set -x
fi

# SSH-agent設定（環境別）
if [[ "$OSTYPE" == "linux-gnu"* ]] && [[ -n "${WSL_DISTRO_NAME:-}" ]]; then
    # WSL環境
    if [[ -f ~/.ssh/id_ed25519 ]]; then
        eval "$(ssh-agent -s)" > /dev/null 2>&1
        ssh-add ~/.ssh/id_ed25519 > /dev/null 2>&1 || true
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS環境 - キーチェーンにSSHキーを追加（必要に応じて）
    if [[ -f ~/.ssh/id_ed25519 ]] && ! ssh-add -l | grep -q "id_ed25519"; then
        ssh-add --apple-use-keychain ~/.ssh/id_ed25519 > /dev/null 2>&1 || true
    fi
fi

# 1. 現在のブランチ情報を取得
HEAD=$(git branch --show-current)
BASE="main"

# 2. 直近コミット & diff を取得
COMMITS=$(git log "$BASE..$HEAD" --pretty=format:"- %s (%an, %ad)" --date=short)
DIFF=$(git diff "$BASE..$HEAD" | head -1000)

# 3. PR テンプレがあれば読み込み
TPL_CONTENT=$(cat .github/PULL_REQUEST_TEMPLATE.md 2>/dev/null || echo "")

# 4. Claude 用プロンプトを生成
PROMPT=$(cat <<EOF
あなたは日本語でConventional Commits準拠のPRを作成するシニアエンジニアです。

以下の情報を元に、GitHub Pull RequestのタイトルとボディをJSON形式で生成してください：

コミット履歴：
$COMMITS

変更差分：
$DIFF

PRテンプレート：
$TPL_CONTENT

要件：
- タイトルはConventional Commits形式（feat:, fix:, refactor:など）
- ボディは日本語で、PRテンプレートの形式に従う
- 技術的な詳細を含める
- レビュー観点を明記する
- markdown記法を使用する（エスケープ文字不要）

**重要**: 必ず以下の厳密なJSON形式で出力してください。```json```ブロックや説明文は不要です。JSONのみを出力してください：

{"title": "PR タイトル", "body": "PR ボディ内容"}

このJSON形式を守らない場合、自動化処理が失敗します。必ずtitleとbodyの両方のフィールドを含めてください。
EOF
)

# 5. Claude CLI へ送信し JSON を取得
echo "🤖 Claude APIを使用してPR内容を生成中..."
CLAUDE_RESP=$(claude -p "$PROMPT" 2>/dev/null || echo '{}')

# 6. Claude応答からJSONを抽出
# Claude CLIの応答から実際のJSONデータを抽出
RESULT_JSON=""

# まず```jsonブロックを確認
JSON_BLOCK=$(echo "$CLAUDE_RESP" | sed -n '/```json/,/```/p' | sed '1d;$d')

if [[ -n "$JSON_BLOCK" ]]; then
    RESULT_JSON="$JSON_BLOCK"
else
    # JSONブロックがない場合、直接JSONが出力されているかチェック
    if echo "$CLAUDE_RESP" | grep -q '{"title":'; then
        # 直接JSONが出力されている場合
        RESULT_JSON="$CLAUDE_RESP"
    elif echo "$CLAUDE_RESP" | grep -q '"result"'; then
        # --output-format json 使用時のフォーマット
        if command -v jq >/dev/null 2>&1; then
            RESULT_TEXT=$(echo "$CLAUDE_RESP" | jq -r '.result // empty' 2>/dev/null)
            if [[ -n "$RESULT_TEXT" ]]; then
                # resultの中にJSONブロックがある場合
                RESULT_JSON=$(echo "$RESULT_TEXT" | sed -n '/```json/,/```/p' | sed '1d;$d')
                # JSONブロックがない場合、直接JSONかもしれない
                if [[ -z "$RESULT_JSON" ]] && echo "$RESULT_TEXT" | grep -q '{"title":'; then
                    RESULT_JSON="$RESULT_TEXT"
                fi
            fi
        fi
    fi
fi

# デバッグ出力（DEBUG=1の場合のみ）
if [[ "${DEBUG:-}" == "1" ]]; then
    echo "🔍 Claude Response:" >&2
    echo "$CLAUDE_RESP" >&2
    echo "🔍 Extracted JSON:" >&2
    echo "$RESULT_JSON" >&2
fi

# JSONを解析してtitleとbodyを抽出
if [[ -n "$RESULT_JSON" ]]; then
    if command -v jq >/dev/null 2>&1; then
        TITLE=$(echo "$RESULT_JSON" | jq -r '.title // empty' 2>/dev/null || echo "")
        BODY=$(echo "$RESULT_JSON" | jq -r '.body // empty' 2>/dev/null || echo "")
    else
        # jqが利用できない場合のフォールバック
        TITLE=$(echo "$RESULT_JSON" | python3 -c "
import json
import sys
try:
    data = json.loads(input())
    print(data.get('title', ''))
except:
    print('')
" 2>/dev/null)
        BODY=$(echo "$RESULT_JSON" | python3 -c "
import json
import sys
try:
    data = json.loads(input())
    print(data.get('body', ''))
except:
    print('')
" 2>/dev/null)
    fi
else
    TITLE=""
    BODY=""
fi

# titleとbodyが取得できているかチェック
if [[ -z "$TITLE" || -z "$BODY" ]]; then
    echo "❌ エラー: Claude APIからのレスポンスが不正です。" >&2
    echo "   titleまたはbodyが見つかりませんでした。" >&2
    echo "   以下を確認してください：" >&2
    echo "   1. Claude APIが正しいJSON形式で応答しているか" >&2
    echo "   2. 'title' と 'body' フィールドが含まれているか" >&2
    echo "" >&2
    echo "🔍 取得されたタイトル: '$TITLE'" >&2
    echo "🔍 取得されたボディ: '$BODY'" >&2
    echo "" >&2
    echo "💡 DEBUG=1 を設定してデバッグ情報を確認できます:" >&2
    echo "   DEBUG=1 $0" >&2
    exit 1
fi

# 7. GitHub へ push → Draft PR 作成
echo "📤 ブランチをプッシュ中..."
git push -u origin "$HEAD"

echo "📝 Draft PRを作成中..."
gh pr create --draft --title "$TITLE" --body "$BODY" --base "$BASE" --head "$HEAD"

echo "✅ Draft PR作成完了！"
