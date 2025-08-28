// 共通のStripeユーティリティ
// - 環境変数のキーに混入しがちな引用符・改行・空白を除去
// - フォーマット検証とマスク出力

export function sanitizeStripeKey(rawKey) {
  if (!rawKey || typeof rawKey !== 'string') return '';
  // 前後空白を除去
  let key = rawKey.trim();
  // 先頭末尾の引用符を除去
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }
  // 改行やタブなど全ての空白文字を除去
  key = key.replace(/\s+/g, '');
  return key;
}

export function isStripeKeyFormatValid(key) {
  return /^(sk|rk)_(live|test)_[A-Za-z0-9]+$/.test(key);
}

export function maskKey(key) {
  if (!key) return '';
  if (key.length <= 12) return key;
  return `${key.slice(0, 8)}...${key.slice(-4)}`;
}

export async function createStripeClient() {
  const rawKey = process.env.STRIPE_SECRET_KEY;
  if (!rawKey) {
    const error = new Error('Stripe API key not found');
    error.code = 'CONFIG_MISSING_STRIPE_SECRET_KEY';
    throw error;
  }

  const sanitized = sanitizeStripeKey(rawKey);
  if (!isStripeKeyFormatValid(sanitized)) {
    const error = new Error('Stripe API key format invalid');
    error.code = 'CONFIG_INVALID_STRIPE_SECRET_KEY';
    error.maskedKey = maskKey(sanitized);
    throw error;
  }

  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(sanitized, {
    apiVersion: '2023-10-16',
    // 再試行回数を制御（接続不安定時のリトライ）
    maxNetworkRetries: 2,
    // appInfo を付与してトラブルシュート容易に
    appInfo: { name: 'twin-persona', version: '1.0.0' }
  });
  return stripe;
}


