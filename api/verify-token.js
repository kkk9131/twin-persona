// 簡易トークンストレージ (メモリベース)
// 本番環境ではRedisやDatabaseを使用推奨
const validTokens = new Map();

// トークン生成とストレージ
export function createAccessToken(paymentIntentId) {
  const token = `tp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24時間有効
  
  validTokens.set(token, {
    paymentIntentId,
    createdAt: Date.now(),
    expiresAt,
    used: false
  });
  
  return token;
}

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
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ 
        valid: false, 
        error: 'Token is required' 
      });
    }

    const tokenData = validTokens.get(token);

    if (!tokenData) {
      return res.status(401).json({ 
        valid: false, 
        error: 'Invalid token' 
      });
    }

    // トークンの有効期限チェック
    if (Date.now() > tokenData.expiresAt) {
      validTokens.delete(token);
      return res.status(401).json({ 
        valid: false, 
        error: 'Token expired' 
      });
    }

    res.status(200).json({
      valid: true,
      paymentIntentId: tokenData.paymentIntentId,
      createdAt: tokenData.createdAt,
      expiresAt: tokenData.expiresAt
    });

  } catch (error) {
    console.error('トークン検証エラー:', error);
    res.status(500).json({ 
      valid: false,
      error: 'Token verification failed',
      details: error.message 
    });
  }
}