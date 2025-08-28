import { addValidToken } from './verify-token.js';
import { createStripeClient } from './_stripe-util.js';

let stripe = null;
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Initialize Stripe via shared util (includes key sanitization)
  if (!stripe) {
    try {
      stripe = await createStripeClient();
    } catch (e) {
      console.error('Failed to initialize Stripe client', { message: e?.message, code: e?.code, maskedKey: e?.maskedKey });
      return res.status(500).json({ error: 'Configuration error' });
    }
  }

  const sig = req.headers['stripe-signature'];

  let event;

  try {
    // Vercelの場合、req.bodyは既にパースされている可能性があるため、
    // 生のボディを取得する必要がある
    const rawBody = JSON.stringify(req.body);
    
    if (endpointSecret) {
      // 本番環境：署名検証を行う
      event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } else {
      // 開発環境：署名検証をスキップ
      event = req.body;
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!', paymentIntent.id);
      
      // トークンを生成して保存
      const token = `premium_${paymentIntent.id}_${Date.now()}`;
      const email = paymentIntent.receipt_email || paymentIntent.metadata?.email;
      
      // トークンを有効化（実際にはデータベースに保存すべき）
      addValidToken(token, email, paymentIntent.id);
      
      // 成功をログ
      console.log('Token created for payment:', {
        token,
        email,
        paymentIntentId: paymentIntent.id
      });
      
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('PaymentIntent failed:', failedPayment.id);
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
}

export default handler;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
