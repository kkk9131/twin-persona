import Stripe from 'stripe';
import { createAccessToken } from './verify-token.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const body = req.body;

  let event;

  try {
    // Webhook署名を検証
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook署名検証失敗:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 決済成功イベントを処理
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    try {
      // アクセストークンを生成
      const accessToken = createAccessToken(paymentIntent.id);
      
      console.log('決済成功:', {
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        accessToken: accessToken
      });

      // 必要に応じて追加の処理（メール送信等）
      if (paymentIntent.receipt_email) {
        console.log('領収書送信予定:', paymentIntent.receipt_email);
        // ここで領収書メール送信ロジックを実装
      }

    } catch (error) {
      console.error('決済後処理エラー:', error);
      return res.status(500).json({ error: 'Post-payment processing failed' });
    }
  }

  // Stripeにイベント受信完了を通知
  res.status(200).json({ received: true });
}

// Vercel用: raw bodyを取得するための設定
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}