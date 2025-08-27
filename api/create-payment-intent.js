// Vercel Edge Runtime対応のシンプルな実装
export default async function handler(req, res) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email } = req.body;
    
    // 環境変数の存在確認
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Configuration error',
        message: 'Stripe API key not found'
      });
    }
    
    // 動的インポートでStripeを読み込む（Vercel対応）
    const Stripe = (await import('stripe')).default;
    
    // Stripeクライアント作成
    const stripe = new Stripe(apiKey, {
      apiVersion: '2023-10-16'
    });
    
    // PaymentIntent作成
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 500,
      currency: 'jpy',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      },
      metadata: {
        email: email || '',
        product: 'twin_persona_premium'
      }
    });
    
    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
    
  } catch (error) {
    console.error('Payment error:', {
      message: error.message,
      type: error.type,
      code: error.code
    });
    
    // ユーザー向けエラーメッセージ
    return res.status(500).json({ 
      error: 'Payment processing failed',
      message: '決済処理に失敗しました。しばらくしてから再度お試しください。',
      retryable: true
    });
  }
}