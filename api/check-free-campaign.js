const { Redis } = require('@upstash/redis');

const redis = Redis.fromEnv();

const FREE_CAMPAIGN_LIMIT = 100;

// ブラウザフィンガープリント生成
function generateFingerprint(request) {
  const ip = request.headers['x-forwarded-for'] || request.headers['x-real-ip'] || 'unknown';
  const userAgent = request.headers['user-agent'] || 'unknown';
  const acceptLanguage = request.headers['accept-language'] || 'unknown';
  
  // 簡易フィンガープリント（IPとUser-Agentの組み合わせ）
  const fingerprint = Buffer.from(`${ip}-${userAgent}-${acceptLanguage}`).toString('base64').slice(0, 16);
  return fingerprint;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 現在の使用数を取得
    const currentCount = await redis.get('campaign:count') || 0;
    const remainingSlots = Math.max(0, FREE_CAMPAIGN_LIMIT - parseInt(currentCount));
    
    // ブラウザフィンガープリント生成
    const fingerprint = generateFingerprint(req);
    
    // このユーザーが既に使用済みかチェック
    const hasUsed = await redis.get(`campaign:used:${fingerprint}`);
    
    // レスポンス
    res.status(200).json({
      campaignActive: remainingSlots > 0,
      remainingSlots,
      totalLimit: FREE_CAMPAIGN_LIMIT,
      userEligible: !hasUsed,
      fingerprint: fingerprint // デバッグ用（本番では削除）
    });

  } catch (error) {
    console.error('Free campaign check error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      campaignActive: false,
      userEligible: false
    });
  }
}