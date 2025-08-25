import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Redis接続テスト
    console.log('Testing Redis connection...');
    
    // 1. 簡単な書き込みテスト
    await redis.set('test:connection', 'OK');
    
    // 2. 読み込みテスト
    const testValue = await redis.get('test:connection');
    
    // 3. キャンペーンカウンター確認
    const campaignCount = await redis.get('campaign:count') || 0;
    
    // 4. フィードバック数確認
    const feedbackKeys = await redis.keys('feedback:*');
    const shareKeys = await redis.keys('share:*');
    
    // 5. テストデータ削除
    await redis.del('test:connection');
    
    res.status(200).json({
      success: true,
      connection: 'OK',
      testValue,
      campaignData: {
        currentCount: parseInt(campaignCount),
        remainingSlots: 100 - parseInt(campaignCount),
        feedbackCount: feedbackKeys.length,
        shareCount: shareKeys.length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Redis test error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      connectionStatus: 'FAILED'
    });
  }
}