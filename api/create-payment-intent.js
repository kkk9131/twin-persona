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
      
      console.log('Initializing Stripe with key:', apiKey ? `${apiKey.substring(0, 12)}...` : 'undefined');
      stripe = new Stripe(apiKey, {
        apiVersion: '2023-10-16',
        timeout: 20000, // 20秒タイムアウト
        maxNetworkRetries: 3
      });
    }
    
    const { email } = req.body;

    // PaymentIntentを作成（500円）
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(process.env.PREMIUM_PRICE || '500'), // デフォルト500円
      currency: 'jpy',
      payment_method_types: ['card'], // カード決済を明示的に指定
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
    console.error('Payment intent creation error:', {
      type: error.type,
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      requestId: error.requestId
    });
    
    // Stripeエラーの詳細な処理
    if (error.type === 'StripeAuthenticationError') {
      return res.status(401).json({ 
        error: 'Authentication failed',
        message: 'Stripe API key is invalid or missing',
        details: error.message
      });
    }
    
    if (error.type === 'StripeConnectionError') {
      return res.status(503).json({ 
        error: 'Connection error',
        message: 'Unable to connect to Stripe. Please try again in a moment.',
        retryable: true
      });
    }
    
    if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ 
        error: 'Invalid request',
        message: error.message
      });
    }
    
    if (error.type === 'StripeAPIError') {
      return res.status(502).json({ 
        error: 'Stripe API error',
        message: 'Stripe API temporarily unavailable. Please try again.',
        retryable: true
      });
    }
    
    return res.status(500).json({ 
      error: 'Payment intent creation failed',
      message: error.message || 'Unknown error occurred',
      type: error.type,
      retryable: error.type === 'StripeConnectionError'
    });
  }
}

export default handler;