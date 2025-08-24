# Stripe決済システム設定ガイド

## 現在の状態（テスト環境）

現在はStripeのテストモードで動作しています。以下のテストカードが使用可能です：

### 成功するテストカード
- カード番号: `4242 4242 4242 4242`
- 有効期限: 任意の未来の日付（例：12/34）
- CVC: 任意の3桁（例：123）
- メール: 任意のメールアドレス

### 失敗するテストカード
- `4000 0000 0000 0002` - カード拒否
- `4000 0000 0000 9995` - 残高不足
- `4000 0000 0000 9987` - 紛失カード

## 本番環境への移行手順

### 1. Stripeダッシュボードで本番キーを取得
1. https://dashboard.stripe.com にログイン
2. 「本番環境」に切り替え
3. 「開発者」→「APIキー」から以下を取得：
   - 公開可能キー（pk_live_...）
   - シークレットキー（sk_live_...）

### 2. Webhook設定
1. Stripeダッシュボード → 「開発者」→「Webhook」
2. 「エンドポイントを追加」
3. エンドポイントURL: `https://twin-persona.vercel.app/api/payment-webhook`
4. イベントを選択: `payment_intent.succeeded`
5. エンドポイントシークレットをコピー

### 3. Vercel環境変数を更新
1. https://vercel.com のプロジェクト設定
2. Environment Variables で以下を更新：
   - `STRIPE_SECRET_KEY` → 本番のsk_live_...
   - `STRIPE_WEBHOOK_SECRET` → 本番のwhsec_...

### 4. フロントエンドのキーを更新
`src/components/PaymentModal.jsx` の6行目：
```javascript
// テスト用
const stripePromise = loadStripe('pk_test_...');
// ↓ 本番用に変更
const stripePromise = loadStripe('pk_live_...');
```

### 5. 価格設定の確認
現在は500円に設定されています。変更する場合：
- `/api/create-payment-intent.js` の23行目の `amount: 500` を変更

## セキュリティ注意事項

1. **シークレットキーは絶対にフロントエンドに含めない**
2. **環境変数は必ずVercelの設定画面から設定**
3. **コードにハードコードしない**
4. **定期的にキーをローテーション**

## テスト方法

### ローカルテスト
```bash
# 環境変数を設定
export STRIPE_SECRET_KEY=sk_test_...
export STRIPE_WEBHOOK_SECRET=whsec_...

# 開発サーバー起動
npm run dev
```

### 本番前チェックリスト
- [ ] 本番Stripeキーに切り替え済み
- [ ] Webhook設定完了
- [ ] 決済フロー全体をテスト
- [ ] エラーハンドリング確認
- [ ] 領収書メール送信確認
- [ ] 返金ポリシー設定
- [ ] 特定商取引法に基づく表記追加

## トラブルシューティング

### 「JSON parse error」が出る場合
- Stripe APIキーが正しく設定されているか確認
- Vercelの環境変数が設定されているか確認

### 決済が通らない場合
- Stripeダッシュボードでエラーログを確認
- ブラウザのコンソールエラーを確認
- APIエンドポイントのレスポンスを確認

### Webhookが動作しない場合
- Webhook署名の検証を確認
- エンドポイントURLが正しいか確認
- Stripeダッシュボードでwebhookログを確認