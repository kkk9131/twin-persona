# Stripe本番環境設定ガイド

## 🚀 本番環境移行手順

### 1. Stripeダッシュボードで本番環境を有効化

1. [Stripe Dashboard](https://dashboard.stripe.com/) にログイン
2. 左上の「テストデータを表示」トグルをOFFにして本番環境に切り替え
3. 本番用のAPIキーを取得

### 2. 環境変数の設定

#### Vercelの環境変数設定:
```bash
# サーバーサイド（Vercel環境変数）
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_LIVE_WEBHOOK_SECRET

# クライアントサイド（Vercel環境変数）
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY

# 価格設定（円）
PREMIUM_PRICE=500
```

### 3. Webhook設定

#### Stripeダッシュボードでの設定:
1. 開発者 > Webhooks に移動
2. 「エンドポイントを追加」をクリック
3. **エンドポイントURL**: `https://YOUR_DOMAIN.vercel.app/api/payment-webhook`
4. **監視するイベント**:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Webhook署名シークレットをコピーして`STRIPE_WEBHOOK_SECRET`に設定

### 4. 本番用価格・商品設定

#### Stripeダッシュボードで商品作成:
1. 商品 > 商品カタログ に移動
2. 「商品を追加」をクリック
3. **商品名**: TwinPersona プレミアム診断
4. **価格**: ¥500（または希望価格）
5. **通貨**: JPY
6. 必要に応じて`PREMIUM_PRICE`環境変数を更新

### 5. セキュリティ設定

#### 本番環境のセキュリティ強化:
- HTTPSの強制（Vercelは自動対応）
- WebhookのIP制限（オプション）
- CSPヘッダーの設定
- レート制限の実装

### 6. テスト手順

#### 本番環境デプロイ前のテスト:
1. テスト環境で決済フローを確認
2. Webhook受信のテスト
3. 決済成功/失敗時の動作確認
4. 領収書メールの送信テスト

### 7. 監視・ログ

#### 本番環境の監視設定:
- Stripeダッシュボードでの取引監視
- Vercelログでのエラー監視
- 決済失敗時のアラート設定

## 🔧 環境別設定

### 開発環境
- テストキー使用
- HTTP接続可能
- テスト用カード番号で決済テスト

### 本番環境
- ライブキー使用
- HTTPS必須
- 実際のカードで決済処理

## 📋 チェックリスト

- [ ] Stripe本番環境でAPIキー取得
- [ ] Vercel環境変数設定
- [ ] Webhook URL設定
- [ ] 商品・価格設定
- [ ] セキュリティ設定確認
- [ ] 決済フローのテスト
- [ ] 監視・アラート設定

## ⚠️ 注意事項

1. **API キーの管理**: 本番用シークレットキーは絶対に公開しない
2. **Webhookセキュリティ**: 署名検証を必ず実装
3. **エラーハンドリング**: 適切なエラー処理と復旧手順を用意
4. **コンプライアンス**: 決済データの取り扱いはPCI DSS準拠

## 🆘 トラブルシューティング

### よくある問題と解決方法

#### 決済が失敗する
- APIキーが正しく設定されているか確認
- 本番環境のStripe設定を確認
- ログでエラー内容を確認

#### Webhookが受信されない
- エンドポイントURLが正しいか確認
- 署名検証が正常に動作しているか確認
- Webhook設定でイベントが有効になっているか確認