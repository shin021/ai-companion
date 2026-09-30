# 莉音 - スマホ向けAIコンパニオン

スマホのブラウザで使うことを前提にしたAIコンパニオンです。

## 中身
- `index.html`：チャット画面
- `style.css`：スマホ向けUI
- `script.js`：チャットと端末側の会話履歴
- `functions/api/chat.js`：Cloudflare Pages FunctionsのAI処理
- `manifest.webmanifest`：ホーム画面追加用

## スマホから公開する流れ
1. GitHubで新しいリポジトリを作り、このフォルダ内のファイルをアップロード。
2. Cloudflare Dashboard → Workers & Pages → Pages でGitHubリポジトリを接続。
3. デプロイ。
4. Pagesプロジェクトの Settings → Functions → Bindings から Workers AI を追加し、変数名を `AI` にする。
5. 再デプロイ。
6. 発行されたURLをスマホで開き、必要なら「ホーム画面に追加」。

## 無料枠について
2026年9月時点のCloudflare公式資料では、Workers AIはFree/Paidプランで利用でき、Freeには1日10,000 Neuronsの無料枠があります。無料枠を超えるとFreeプランでは追加利用できません。

## キャラ変更
`functions/api/chat.js` の `SYSTEM_PROMPT` を編集すると、名前・性格・口調などを変更できます。
