import { createStripeClient } from './_stripe-util.js';

// Vercel Serverless Function
export default async function handler(req, res) {
  const DEPLOY_DEBUG_VERSION = 'dpi-20250827-2';
  // CORS設定（同一オリジン利用想定だが安全のため）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email } = req.body;

    // 共通ユーティリティでStripeクライアント生成（キーをサニタイズ）
    const stripe = await createStripeClient();

    // PaymentIntent作成（自動支払い手段 → 失敗時はcard固定にフォールバック）
    let paymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.create({
        amount: 500,
        currency: 'jpy',
        automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
        payment_method_options: { card: { request_three_d_secure: 'automatic' } },
        receipt_email: email || undefined,
        metadata: { email: email || '', product: 'twin_persona_premium' }
      });
    } catch (createErr) {
      console.warn('Automatic payment methods failed. Falling back to card-only.', {
        message: createErr?.message,
        type: createErr?.type,
        code: createErr?.code
      });
      paymentIntent = await stripe.paymentIntents.create({
        amount: 500,
        currency: 'jpy',
        payment_method_types: ['card'],
        payment_method_options: { card: { request_three_d_secure: 'automatic' } },
        receipt_email: email || undefined,
        metadata: { email: email || '', product: 'twin_persona_premium' }
      });
    }

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      version: DEPLOY_DEBUG_VERSION
    });
  } catch (error) {
    console.error('Payment error:', {
      message: error?.message,
      type: error?.type,
      code: error?.code,
      decline_code: error?.decline_code,
      param: error?.param,
      doc_url: error?.doc_url,
      requestId: error?.requestId,
      raw: error?.raw,
      code2: error?.code === undefined && error?.maskedKey ? 'CONFIG_INVALID_STRIPE_SECRET_KEY' : undefined,
      maskedKey: error?.maskedKey,
    });

    const debug = process.env.STRIPE_DEBUG_ERRORS === 'true';
    const debugInfo = debug ? {
      stripeError: {
        message: error?.message,
        type: error?.type,
        code: error?.code || error?.code2,
      },
      maskedKey: error?.maskedKey,
    } : {};

    return res.status(500).json({
      error: 'Payment processing failed',
      message: '決済処理に失敗しました。しばらくしてから再度お試しください。',
      retryable: true,
      version: DEPLOY_DEBUG_VERSION,
      ...debugInfo
    });
  }
}