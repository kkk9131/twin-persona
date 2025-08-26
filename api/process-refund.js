const Stripe = require('stripe');
const { Redis } = require('@upstash/redis');

let stripe = null;
const redis = Redis.fromEnv();

const FREE_CAMPAIGN_LIMIT = 100;

// ブラウザフィンガープリント生成（他のAPIと同じロジック）
function generateFingerprint(request) {
  const ip = request.headers['x-forwarded-for'] || request.headers['x-real-ip'] || 'unknown';
  const userAgent = request.headers['user-agent'] || 'unknown';
  const acceptLanguage = request.headers['accept-language'] || 'unknown';
  
  const fingerprint = Buffer.from(`${ip}-${userAgent}-${acceptLanguage}`).toString('base64').slice(0, 16);
  return fingerprint;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { paymentIntentId, action, data } = req.body;
  
  // 必須パラメータのチェック
  if (!paymentIntentId || !action || !['share', 'feedback'].includes(action)) {
    return res.status(400).json({ error: 'Invalid request parameters' });
  }

  try {
    // Stripeインスタンスを初期化
    if (!stripe) {
      const apiKey = process.env.STRIPE_SECRET_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: 'Configuration error',
          message: 'Payment service is not properly configured'
        });
      }
      stripe = new Stripe(apiKey);
    }
    
    const fingerprint = generateFingerprint(req);
    
    // 既に返金済みかチェック
    const hasRefunded = await redis.get(`refund:used:${fingerprint}`);
    if (hasRefunded) {
      return res.status(400).json({ 
        error: 'Already refunded',
        message: '既に返金を受けています'
      });
    }

    // キャンペーン枠数チェック
    const currentCount = await redis.get('campaign:count') || 0;
    if (parseInt(currentCount) >= FREE_CAMPAIGN_LIMIT) {
      return res.status(400).json({ 
        error: 'Campaign ended',
        message: 'キャンペーン期間は終了しました'
      });
    }

    // Stripe PaymentIntentの取得と検証
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ 
        error: 'Payment not completed',
        message: '決済が完了していません'
      });
    }

    if (paymentIntent.amount !== 500) { // ¥500 = 500円
      return res.status(400).json({ 
        error: 'Invalid payment amount',
        message: '決済金額が正しくありません'
      });
    }

    // 返金処理
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: 'requested_by_customer',
      metadata: {
        campaign: 'free_100_users',
        action: action,
        fingerprint: fingerprint,
        timestamp: Date.now().toString()
      }
    });

    if (refund.status !== 'succeeded') {
      return res.status(500).json({ 
        error: 'Refund failed',
        message: '返金処理に失敗しました'
      });
    }

    // Redis にデータを保存（原子的操作）
    const pipeline = redis.pipeline();
    pipeline.incr('campaign:count');
    pipeline.set(`refund:used:${fingerprint}`, Date.now());
    
    // アクション別データ保存
    if (action === 'feedback' && data) {
      pipeline.set(`feedback:${Date.now()}:${fingerprint}`, JSON.stringify({
        rating: data.rating,
        comment: data.comment,
        timestamp: Date.now(),
        fingerprint,
        paymentIntentId,
        refundId: refund.id
      }));
    } else if (action === 'share') {
      pipeline.set(`share:${Date.now()}:${fingerprint}`, JSON.stringify({
        platform: data.platform || 'unknown',
        timestamp: Date.now(),
        fingerprint,
        paymentIntentId,
        refundId: refund.id
      }));
    }

    await pipeline.exec();

    // 残り枠数を計算
    const newCount = parseInt(currentCount) + 1;
    const remainingSlots = Math.max(0, FREE_CAMPAIGN_LIMIT - newCount);

    res.status(200).json({
      success: true,
      refundId: refund.id,
      amount: refund.amount,
      message: 'ご協力ありがとうございます！¥500を返金いたしました。',
      remainingSlots,
      action
    });

  } catch (error) {
    console.error('Process refund error:', error);
    
    // Stripe エラーの詳細処理
    if (error.type === 'StripeCardError') {
      return res.status(400).json({ 
        error: 'Card error',
        message: 'カード処理でエラーが発生しました'
      });
    }
    
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'エラーが発生しました。しばらく後に再試行してください。'
    });
  }
}