# TwinPersona 運用ガイド

## 🚀 本番環境構成

### サービス概要
- **サービス名**: TwinPersona（ツインパーソナ）
- **URL**: https://twin-persona.com
- **サービス内容**: MBTI×Character Code診断アプリ
- **料金**: ¥500（税込み）※初期100名無料

### インフラ構成
- **ホスティング**: Vercel
- **ドメイン**: Cloudflare DNS
- **決済**: Stripe（本番環境）
- **分析**: Google Analytics 4 (G-3JBPRJ2E8V)
- **SEO**: Google Search Console
- **データベース**: Vercel KV (Redis) - カウンター管理用

## 📊 監視・分析

### Google Analytics 4
- **測定ID**: G-3JBPRJ2E8V
- **主要指標**: 
  - ページビュー
  - 診断完了率
  - 決済コンバージョン率
  - プレミアム利用率

### Google Search Console
- **プロパティ**: https://twin-persona.com
- **サイトマップ**: https://twin-persona.com/sitemap.xml
- **監視項目**: 検索パフォーマンス、インデックス状況

### Stripe監視
- **ダッシュボード**: https://dashboard.stripe.com
- **監視項目**:
  - 決済成功率
  - 失敗理由分析
  - 月間売上
  - 無料キャンペーン効果

## 💰 収益管理

### 料金設定
- **基本料金**: ¥500（税込み）
- **無料キャンペーン**: 先着100名限定
- **決済手数料**: Stripe手数料 3.6%

### 収益予測
```
月間想定ユーザー: 1,000人
有料転換率: 20% = 200人
月間売上: ¥100,000
Stripe手数料: ¥3,600
純売上: ¥96,400
```

### 無料キャンペーン分析
- **総枠**: 100名
- **効果測定**: 
  - バイラル効果（SNS拡散）
  - リピート利用率
  - 口コミ効果

## 🔧 技術仕様

### 環境変数（Vercel Production）
```
STRIPE_SECRET_KEY=sk_live_***
STRIPE_WEBHOOK_SECRET=whsec_***
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_***
PREMIUM_PRICE=500
KV_REST_API_URL=*** (無料キャンペーン用)
KV_REST_API_TOKEN=*** (無料キャンペーン用)
FREE_CAMPAIGN_LIMIT=100
```

### API エンドポイント
- **決済**: `/api/create-payment-intent`
- **Webhook**: `/api/payment-webhook`
- **無料チェック**: `/api/check-free-quota`
- **使用回数更新**: `/api/increment-usage`
- **OGP画像**: `/api/og-image`

### 無料キャンペーン技術仕様
- **カウンター管理**: Vercel KV (Redis)
- **ブラウザ識別**: フィンガープリント + localStorage
- **重複防止**: 複合キー（IP + フィンガープリント）
- **有効期限**: キャンペーン終了まで

## 📈 マーケティング戦略

### ローンチ戦略
1. **Phase 1**: 無料キャンペーン（先着100名）
2. **Phase 2**: 口コミ・SNS拡散
3. **Phase 3**: 有料転換（¥500）
4. **Phase 4**: 機能拡張・新機能追加

### SNS展開
- **Twitter**: #TwinPersona #ツインパーソナ
- **Instagram**: ビジュアル結果の拡散
- **TikTok**: 診断過程の動画化
- **YouTube**: 詳細解説動画

### バイラル要素
- **ギャップ度表示**: 85%などの数値で関心喚起
- **相性診断**: 他者との相性で話題作り
- **256パターン**: 希少性アピール
- **AI画像**: 独自キャラクター生成

## 🛠️ 運用タスク

### 日次タスク
- [ ] Google Analytics チェック（アクセス数、コンバージョン）
- [ ] Stripe決済状況確認
- [ ] 無料キャンペーン残り枠確認
- [ ] エラーログ確認（Vercel Dashboard）

### 週次タスク
- [ ] Google Search Console パフォーマンス確認
- [ ] SNS反応・拡散状況分析
- [ ] ユーザーフィードバック収集
- [ ] 競合サービス調査

### 月次タスク
- [ ] 収益分析・レポート作成
- [ ] 機能改善計画策定
- [ ] SEOパフォーマンス分析
- [ ] サーバー・セキュリティ監査

## 🚨 緊急時対応

### 障害発生時
1. **Vercel Status確認**: https://vercel.com/status
2. **Cloudflare Status確認**: https://cloudflarestatus.com
3. **Stripe Status確認**: https://status.stripe.com
4. **ロールバック**: 前バージョンに即座復旧

### セキュリティインシデント
1. **即座対応**: 該当機能の無効化
2. **影響範囲調査**: ログ分析・被害確認
3. **修正・テスト**: セキュア環境での修正
4. **段階的復旧**: 機能別段階復旧

### 決済問題
1. **Stripe Dashboard確認**: エラー詳細確認
2. **Webhook ログ確認**: 通信状況確認
3. **ユーザー対応**: 返金・再試行案内
4. **根本原因分析**: 再発防止策実施

## 📞 サポート・連絡先

### 技術サポート
- **Vercel**: https://vercel.com/support
- **Stripe**: https://support.stripe.com
- **Cloudflare**: https://support.cloudflare.com
- **Google**: https://support.google.com/analytics

### 開発・保守
- **リポジトリ**: https://github.com/kkk9131/twin-persona
- **ブランチ戦略**: main（本番）/ release/（リリース準備）
- **デプロイ**: 自動（main pushで即座反映）

## 🎯 KPI・目標設定

### 短期目標（1ヶ月）
- **無料ユーザー**: 100名達成
- **SNS拡散**: 1,000インプレッション
- **リピート率**: 30%以上

### 中期目標（3ヶ月）
- **月間アクティブユーザー**: 3,000人
- **有料転換率**: 15%以上
- **月間売上**: ¥200,000以上

### 長期目標（6ヶ月）
- **累計ユーザー**: 50,000人
- **月間売上**: ¥500,000以上
- **App Store展開**: モバイルアプリ化

## 💡 機能拡張計画

### Phase 2（有料転換後）
- AI画像生成API統合
- 詳細分析レポート
- 相性診断機能強化
- SNS投稿最適化

### Phase 3（スケール時）
- モバイルアプリ化
- 多言語対応（英語・中国語）
- 企業向けチーム診断
- サブスクリプション料金体系

### Phase 4（事業拡大）
- キャリア相談サービス
- マッチングサービス
- 企業研修パッケージ
- ライセンス事業

## 📋 品質保証

### テスト項目
- [ ] 決済フロー（成功・失敗）
- [ ] 無料キャンペーン動作
- [ ] 診断結果生成
- [ ] SNS共有機能
- [ ] レスポンシブデザイン
- [ ] 多ブラウザ対応

### 性能目標
- **ページ読み込み**: 3秒以内
- **診断完了時間**: 5分以内
- **決済処理**: 30秒以内
- **可用性**: 99.9%以上

## 🔒 セキュリティ・コンプライアンス

### データ保護
- **個人情報**: 診断結果は保存しない
- **決済データ**: Stripe PCI-DSS準拠
- **分析データ**: Google Analytics匿名化
- **GDPR対応**: EU圏からのアクセス時

### セキュリティ監視
- **Webhook署名**: 全リクエスト検証
- **HTTPS強制**: 全通信暗号化
- **CSP設定**: XSS攻撃防止
- **レート制限**: DDoS攻撃防止

---

**このガイドは随時更新し、サービス成長に合わせて拡張してください。**