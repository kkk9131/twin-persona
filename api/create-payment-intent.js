// Vercel環境に最適化されたStripeインポート
import Stripe from 'stripe';

export default async function handler(req, res) {
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
    
    console.log('API Handler called. Environment:', environment);
    console.log('Stripe key exists:', !!apiKey);
    console.log('Request method:', req.method);
    console.log('Request headers:', req.headers);
    
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
    
    // Stripe SDKを正しく初期化（Vercel環境に最適化）
    const stripe = Stripe(apiKey, {
      apiVersion: '2023-10-16',
      httpAgent: null, // デフォルトのHTTPエージェントを使用
      timeout: 20000, // 20秒のタイムアウト（Vercel関数の制限内）
      maxNetworkRetries: 2 // リトライ回数を控えめに設定
    });
    
    const { email } = req.body;

    console.log('Creating PaymentIntent with amount: 500 JPY');
    console.log('Using Stripe API key type:', isTestKey ? 'test' : 'live');
    
    // Stripe接続テストは一時的に無効化（accounts.retrieveはAPIキーの権限によってはエラーになる可能性があるため）
    // try {
    //   const stripeAccount = await stripe.accounts.retrieve();
    //   console.log('Stripe connection successful. Account ID:', stripeAccount.id);
    // } catch (connectionTest) {
    //   console.error('Stripe connection test failed:', connectionTest.message);
    // }

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
    // 詳細なエラーログ
    console.error('Payment intent creation error:', {
      type: error.type,
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      requestId: error.requestId,
      raw: error.raw,
      errno: error.errno,
      syscall: error.syscall,
      hostname: error.hostname
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
      // 詳細な接続エラー情報をログに出力
      console.error('StripeConnectionError - Detailed info:', {
        message: error.message,
        errno: error.errno,
        code: error.code,
        syscall: error.syscall,
        hostname: error.hostname,
        stack: error.stack?.split('\n').slice(0, 3).join('\n')
      });
      
      return res.status(503).json({ 
        error: 'Connection error',
        message: '決済サービスへの接続に問題が発生しています。しばらくしてから再度お試しください。',
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