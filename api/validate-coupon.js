import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { couponCode } = req.body;
  
  if (!couponCode) {
    return res.status(400).json({ error: 'Coupon code required' });
  }

  try {
    // クーポンコードの存在確認
    const couponData = await redis.get(`coupon:${couponCode}`);
    
    if (!couponData) {
      return res.status(400).json({ 
        valid: false,
        error: 'Invalid coupon',
        message: '無効なクーポンコードです'
      });
    }

    const coupon = JSON.parse(couponData);
    
    // 既に使用済みかチェック
    if (coupon.used) {
      return res.status(400).json({ 
        valid: false,
        error: 'Coupon already used',
        message: 'このクーポンは既に使用済みです'
      });
    }

    // 有効期限チェック（24時間）
    const expirationTime = coupon.createdAt + (24 * 60 * 60 * 1000);
    if (Date.now() > expirationTime) {
      return res.status(400).json({ 
        valid: false,
        error: 'Coupon expired',
        message: 'クーポンの有効期限が切れています'
      });
    }

    // クーポンを使用済みにマーク
    coupon.used = true;
    coupon.usedAt = Date.now();
    await redis.set(`coupon:${couponCode}`, JSON.stringify(coupon));

    res.status(200).json({
      valid: true,
      message: 'クーポンが正常に適用されました！',
      couponCode
    });

  } catch (error) {
    console.error('Coupon validation error:', error);
    res.status(500).json({ 
      valid: false,
      error: 'Internal server error',
      message: 'エラーが発生しました。しばらく後に再試行してください。'
    });
  }
}

export default handler;