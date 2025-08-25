import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

const FREE_CAMPAIGN_LIMIT = 100;

// ブラウザフィンガープリント生成（check-free-campaign.jsと同じロジック）
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

  const { action, data } = req.body;
  
  // actionは 'share' または 'feedback'
  if (!action || !['share', 'feedback'].includes(action)) {
    return res.status(400).json({ error: 'Invalid action' });
  }

  try {
    const fingerprint = generateFingerprint(req);
    
    // 既に使用済みかチェック
    const hasUsed = await redis.get(`campaign:used:${fingerprint}`);
    if (hasUsed) {
      return res.status(400).json({ 
        error: 'Already used',
        message: '既に無料キャンペーンをご利用いただいています'
      });
    }

    // 現在のカウントを取得
    const currentCount = await redis.get('campaign:count') || 0;
    if (parseInt(currentCount) >= FREE_CAMPAIGN_LIMIT) {
      return res.status(400).json({ 
        error: 'Campaign ended',
        message: '無料キャンペーンは終了しました'
      });
    }

    // 原子的にカウンターを増やす
    const pipeline = redis.pipeline();
    pipeline.incr('campaign:count');
    pipeline.set(`campaign:used:${fingerprint}`, Date.now());
    
    // アクション別データ保存
    if (action === 'feedback' && data) {
      pipeline.set(`feedback:${Date.now()}:${fingerprint}`, JSON.stringify({
        rating: data.rating,
        comment: data.comment,
        timestamp: Date.now(),
        fingerprint
      }));
    } else if (action === 'share') {
      pipeline.set(`share:${Date.now()}:${fingerprint}`, JSON.stringify({
        platform: data.platform || 'unknown',
        timestamp: Date.now(),
        fingerprint
      }));
    }

    await pipeline.exec();

    // 無料クーポンコード生成（ランダム8文字）
    const couponCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    // クーポンコードを保存（24時間有効）
    await redis.setex(`coupon:${couponCode}`, 86400, JSON.stringify({
      fingerprint,
      createdAt: Date.now(),
      used: false
    }));

    // 残り枠数を計算
    const newCount = parseInt(currentCount) + 1;
    const remainingSlots = Math.max(0, FREE_CAMPAIGN_LIMIT - newCount);

    res.status(200).json({
      success: true,
      couponCode,
      message: 'ご協力ありがとうございます！無料クーポンを発行しました。',
      remainingSlots,
      action
    });

  } catch (error) {
    console.error('Claim free access error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'エラーが発生しました。しばらく後に再試行してください。'
    });
  }
}