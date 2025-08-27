// 最もシンプルなStripeテストエンドポイント
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // 環境変数チェック
    const hasKey = !!process.env.STRIPE_SECRET_KEY;
    const keyPrefix = process.env.STRIPE_SECRET_KEY?.substring(0, 7);
    
    // Stripe動的インポート
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16'
    });
    
    // 簡単なテスト - 残高取得
    const balance = await stripe.balance.retrieve();
    
    return res.status(200).json({
      success: true,
      hasKey,
      keyPrefix,
      balance: balance.available
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      type: error.type
    });
  }
}