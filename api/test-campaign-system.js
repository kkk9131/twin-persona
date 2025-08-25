// テスト用API - 本番テスト後に削除
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Redis接続テスト
    const testValue = await redis.set('test-key', 'test-value', { ex: 60 });
    const retrievedValue = await redis.get('test-key');
    
    // 2. キャンペーン状況確認
    const currentCount = await redis.get('campaign:count') || 0;
    const remainingSlots = Math.max(0, 100 - parseInt(currentCount));
    
    // 3. 環境変数確認
    const envCheck = {
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      hasRedisUrl: !!process.env.KV_URL,
      hasRedisToken: !!process.env.KV_REST_API_TOKEN
    };

    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      tests: {
        redisConnection: testValue === 'OK' && retrievedValue === 'test-value',
        environmentVariables: envCheck,
        campaignStatus: {
          currentCount: parseInt(currentCount),
          remainingSlots,
          isActive: remainingSlots > 0
        }
      },
      message: 'Campaign system test completed'
    });

  } catch (error) {
    console.error('Campaign system test error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}