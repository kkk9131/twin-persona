import Stripe from 'stripe';

// Stripe初期化を関数内に移動して、環境変数の読み込みを確実にする
let stripe = null;

async function handler(req, res) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // CORS preflight handling
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Stripeインスタンスを初期化
    if (!stripe) {
      const apiKey = process.env.STRIPE_SECRET_KEY;
      if (!apiKey) {
        console.error('STRIPE_SECRET_KEY is not set');
        return res.status(500).json({ 
          error: 'Configuration error',
          message: 'Payment service is not properly configured'
        });
      }
      stripe = new Stripe(apiKey);
    }
    
    const { email } = req.body;

    // PaymentIntentを作成（500円）
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(process.env.PREMIUM_PRICE || '500'), // デフォルト500円
      currency: 'jpy',
      metadata: {
        email: email || '',
        product: 'twin_persona_premium',
        timestamp: new Date().toISOString()
      },
      receipt_email: email || undefined,
      description: 'TwinPersona プレミアム診断'
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
    
  } catch (error) {
    console.error('Payment intent creation error:', error);
    
    // Stripeエラーの詳細な処理
    if (error.type === 'StripeAuthenticationError') {
      return res.status(401).json({ 
        error: 'Authentication failed',
        message: 'Stripe API key is invalid or missing',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ 
        error: 'Invalid request',
        message: error.message
      });
    }
    
    return res.status(500).json({ 
      error: 'Payment intent creation failed',
      message: error.message,
      type: error.type,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

export default handler;