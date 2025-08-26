// Stripe接続テスト用エンドポイント
import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!secretKey) {
      return res.status(500).json({
        success: false,
        error: 'STRIPE_SECRET_KEY not found in environment variables',
        hasKey: false
      });
    }
    
    // キーの種類を判定
    const isTestKey = secretKey.startsWith('sk_test_');
    const isLiveKey = secretKey.startsWith('sk_live_');
    
    // キーの長さを確認（正しいStripeキーは通常100文字以上）
    const keyLength = secretKey.length;
    const keyPreview = `${secretKey.substring(0, 14)}...${secretKey.slice(-4)}`;
    
    // Stripeインスタンスを作成
    const stripe = new Stripe(secretKey);
    
    // アカウント情報を取得してAPIキーの有効性を確認
    try {
      const account = await stripe.accounts.retrieve();
      
      return res.status(200).json({
        success: true,
        environment: isTestKey ? 'TEST' : (isLiveKey ? 'LIVE' : 'UNKNOWN'),
        keyInfo: {
          preview: keyPreview,
          length: keyLength,
          isValid: true
        },
        account: {
          id: account.id,
          country: account.country,
          charges_enabled: account.charges_enabled,
          payouts_enabled: account.payouts_enabled
        },
        message: 'Stripe connection successful'
      });
      
    } catch (stripeError) {
      return res.status(401).json({
        success: false,
        environment: isTestKey ? 'TEST' : (isLiveKey ? 'LIVE' : 'UNKNOWN'),
        keyInfo: {
          preview: keyPreview,
          length: keyLength,
          isValid: false
        },
        error: stripeError.type,
        message: stripeError.message,
        hint: 'API key exists but authentication failed'
      });
    }
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}