// API設定ファイル
export const API_CONFIG = {
  // 開発環境とプロダクション環境の設定
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://api.twinpersona.com' 
    : 'http://localhost:3001',
  
  // APIエンドポイント
  ENDPOINTS: {
    MBTI_ANALYSIS: '/api/mbti/analyze',
    CHARACTER_CODE_16_ANALYSIS: '/api/character-code-16/analyze', 
    IMAGE_GENERATION: '/api/generate-image',
    COMPATIBILITY: '/api/compatibility',
    DETAILED_REPORT: '/api/report'
  },
  
  // APIキー（環境変数から取得）
  API_KEY: process.env.REACT_APP_API_KEY,
  
  // タイムアウト設定
  TIMEOUT: 10000,
  
  // リトライ設定
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};

// APIエラーハンドリング
export const handleAPIError = (error, fallbackData = null) => {
  console.error('API Error:', error);
  
  if (error.name === 'AbortError') {
    console.log('API request was aborted');
  } else if (error.response?.status === 429) {
    console.log('Rate limit exceeded, using fallback data');
  } else if (error.response?.status >= 500) {
    console.log('Server error, using fallback data');
  }
  
  return fallbackData;
};

// APIリクエストのヘルパー関数
export const apiRequest = async (endpoint, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
  
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': API_CONFIG.API_KEY ? `Bearer ${API_CONFIG.API_KEY}` : '',
        ...options.headers
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// 将来のAPI統合のためのモック設定
export const MOCK_API = {
  enabled: true, // 本番では false に設定
  delay: 1000 // モックAPIの遅延（ミリ秒）
};