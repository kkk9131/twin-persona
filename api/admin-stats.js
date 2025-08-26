// 簡易管理統計API（Basic認証付き）
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

// Basic認証チェック
function checkBasicAuth(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Basic ')) {
    return false;
  }
  
  const credentials = Buffer.from(auth.split(' ')[1], 'base64').toString();
  const [user, pass] = credentials.split(':');
  
  // 環境変数から認証情報を取得
  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPass = process.env.ADMIN_PASS;
  
  if (!adminPass) return false;
  
  return user === adminUser && pass === adminPass;
}

export default async function handler(req, res) {
  // Basic認証
  if (!checkBasicAuth(req)) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // IPアドレス制限（オプション）
  const allowedIPs = (process.env.ALLOWED_IPS || '').split(',').filter(Boolean);
  if (allowedIPs.length > 0) {
    const clientIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'];
    if (!allowedIPs.includes(clientIP)) {
      return res.status(403).json({ error: 'Forbidden: IP not allowed' });
    }
  }
  
  try {
    // キャンペーン統計を取得
    const campaignCount = await redis.get('campaign:count') || 0;
    const remainingSlots = Math.max(0, 100 - parseInt(campaignCount));
    
    // 返金済みユーザー数をカウント
    const refundKeys = await redis.keys('refund:used:*');
    const refundCount = refundKeys.length;
    
    // フィードバック件数をカウント
    const feedbackKeys = await redis.keys('feedback:*');
    const feedbackCount = feedbackKeys.length;
    
    // シェア件数をカウント
    const shareKeys = await redis.keys('share:*');
    const shareCount = shareKeys.length;
    
    return res.status(200).json({
      success: true,
      stats: {
        campaign: {
          used: parseInt(campaignCount),
          remaining: remainingSlots,
          total: 100
        },
        refunds: {
          total: refundCount,
          amount: refundCount * 500
        },
        engagement: {
          feedbacks: feedbackCount,
          shares: shareCount
        }
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Admin stats error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}