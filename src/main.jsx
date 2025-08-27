import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Stripeキー種別のログ（ビルド時埋め込み）
(() => {
  try {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (key) {
      const mode = key.startsWith('pk_test_') ? 'test' : 'live';
      // 明確に分かるラベルで出力
      console.log('[Stripe] Using publishable key type:', mode);
    } else {
      console.warn('[Stripe] VITE_STRIPE_PUBLISHABLE_KEY is not set');
    }
  } catch (e) {
    console.warn('[Stripe] Failed to detect publishable key type');
  }
})();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)