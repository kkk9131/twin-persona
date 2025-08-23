import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // PaymentIntentを作成
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 500, // 500円 (Stripeは最小単位で処理)
      currency: 'jpy',
      payment_method_types: ['card'],
      metadata: {
        service: 'twin-persona',
        type: 'premium-unlock'
      },
      receipt_email: req.body.email || null, // 領収書メール（オプション）
      description: 'ツインパーソナ プレミアム機能アンロック'
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('PaymentIntent作成エラー:', error);
    res.status(500).json({ 
      error: 'Payment intent creation failed',
      details: error.message 
    });
  }
}