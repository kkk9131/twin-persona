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
    // 環境変数を明示的に確認
    const apiKey = process.env.STRIPE_SECRET_KEY;
    const environment = process.env.NODE_ENV || 'development';
    
    if (!apiKey) {
      console.error('STRIPE_SECRET_KEY is not set in environment:', environment);
      return res.status(500).json({ 
        error: 'Configuration error',
        message: 'Payment service is not properly configured',
        environment
      });
    }
    
    // キーの種類を確認
    const isTestKey = apiKey.startsWith('sk_test_');
    const isLiveKey = apiKey.startsWith('sk_live_');
    
    if (!isTestKey && !isLiveKey) {
      console.error('Invalid Stripe key format:', apiKey.substring(0, 7));
      return res.status(500).json({ 
        error: 'Configuration error',
        message: 'Invalid API key format'
      });
    }
    
    console.log('Stripe key type:', isTestKey ? 'test' : 'live');
    
    // Stripeインスタンスを毎回新規作成（キャッシュ問題を回避）
    const stripe = new Stripe(apiKey, {
      apiVersion: '2023-10-16',
      timeout: 30000, // 30秒に延長
      maxNetworkRetries: 5, // リトライ回数増加
      telemetry: false // テレメトリ無効化で接続問題を回避
    });
    
    const { email } = req.body;

    console.log('Creating PaymentIntent with amount: 500 JPY');

    // PaymentIntentを作成（500円）
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 500, // 固定値で確実性を向上
      currency: 'jpy',
      payment_method_types: ['card'], // カード決済を明示的に指定
      metadata: {
        email: email || '',
        product: 'twin_persona_premium',
        timestamp: new Date().toISOString(),
        environment
      },
      receipt_email: email || undefined,
      description: 'TwinPersona プレミアム診断'
    });

    console.log('PaymentIntent created successfully:', paymentIntent.id);

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