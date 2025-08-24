// シンプルなトークン管理（実際の本番環境ではDBを使用すべき）
const validTokens = new Map();

export default async function handler(req, res) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // CORS preflight handling
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ 
        valid: false,
        error: 'Token is required' 
      });
    }

    // トークンの検証（簡易版）
    // 本番環境では、データベースや外部認証サービスと連携すべき
    const tokenData = validTokens.get(token);
    
    if (tokenData && tokenData.expiresAt > Date.now()) {
      return res.status(200).json({ 
        valid: true,
        email: tokenData.email,
        paymentIntentId: tokenData.paymentIntentId
      });
    }

    // 開発環境用：premium_で始まるトークンは有効として扱う
    if (token.startsWith('premium_')) {
      return res.status(200).json({ 
        valid: true,
        development: true
      });
    }

    return res.status(200).json({ 
      valid: false,
      error: 'Invalid or expired token' 
    });
    
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(500).json({ 
      valid: false,
      error: 'Token verification failed',
      message: error.message 
    });
  }
}

// トークンを追加する関数（webhookから呼ばれる想定）
export function addValidToken(token, email, paymentIntentId) {
  validTokens.set(token, {
    email,
    paymentIntentId,
    createdAt: Date.now(),
    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24時間有効
  });
  
  // 古いトークンをクリーンアップ
  for (const [key, value] of validTokens.entries()) {
    if (value.expiresAt < Date.now()) {
      validTokens.delete(key);
    }
  }
}