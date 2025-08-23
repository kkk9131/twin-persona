import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { X, CreditCard, Mail } from 'lucide-react';

const stripePromise = loadStripe('pk_test_51RzJ5jQl0WdwXwrDcFQYIqu7rSJ0CvXbv9FqSZQEouZVv3dzPRQ2ZPhKic9hzVG2pH5xjP9azWSL0rzCR9O4NcWR00KXTqxLb6');

const PaymentModal = ({ isOpen, onClose, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handlePayment = async () => {
    if (!email.trim()) {
      setError('メールアドレスを入力してください');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // PaymentIntentを作成
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const { clientSecret, paymentIntentId } = await response.json();

      if (!response.ok) {
        throw new Error('決済の準備に失敗しました');
      }

      const stripe = await stripePromise;

      // Stripe Checkoutにリダイレクト
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            // Stripe Elements使用時に実装
          },
        },
        receipt_email: email,
      });

      if (error) {
        setError(error.message);
      } else {
        // 決済成功時の処理
        // WebhookでトークンがMAPに保存される
        // フロントエンドでは成功を通知
        onSuccess(paymentIntentId);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Stripe Checkoutを使用したシンプルな実装
  const handleStripeCheckout = async () => {
    if (!email.trim()) {
      setError('メールアドレスを入力してください');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const { clientSecret, paymentIntentId } = await response.json();

      if (!response.ok) {
        throw new Error('決済の準備に失敗しました');
      }

      // 簡易的にpaymentIntentIdをlocalStorageに保存（実際のトークンは後でWebhookで管理）
      localStorage.setItem('pendingPayment', paymentIntentId);
      
      // Stripe Checkoutのホスト型決済ページにリダイレクト
      // この例では簡易的にconfirmCardPaymentを使用
      const stripe = await stripePromise;
      
      // テスト用の決済確認（実際の本番環境では適切なUI実装が必要）
      alert('テスト環境：Stripe決済をシミュレーションします');
      
      // 本番では適切なStripe Elementsを使用
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            number: '4242424242424242',
            exp_month: 12,
            exp_year: 2025,
            cvc: '123',
          },
        },
        receipt_email: email,
      });

      if (error) {
        setError(error.message);
        localStorage.removeItem('pendingPayment');
      } else if (paymentIntent.status === 'succeeded') {
        // 決済成功
        onSuccess(paymentIntentId);
      }

    } catch (err) {
      setError(err.message);
      localStorage.removeItem('pendingPayment');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">プレミアム診断アンロック</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition-colors"
            disabled={isProcessing}
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-100">
            <h4 className="font-semibold mb-2 text-gray-800">🎯 プレミアム機能</h4>
            <ul className="text-sm space-y-2 text-gray-700">
              <li className="flex items-center"><span className="mr-2">✨</span> AI画像生成（キャラクター作成）</li>
              <li className="flex items-center"><span className="mr-2">🔍</span> 顔画像分析（印象診断）</li>
              <li className="flex items-center"><span className="mr-2">💡</span> 詳細アドバイス（個別提案）</li>
            </ul>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <span className="font-medium text-gray-700">料金</span>
            <span className="text-2xl font-bold text-gray-800">¥500</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              <Mail size={16} className="inline mr-1 text-gray-600" />
              メールアドレス（領収書送信用）
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800 placeholder-gray-400"
              placeholder="your@email.com"
              disabled={isProcessing}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleStripeCheckout}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg transition-all duration-200"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                処理中...
              </>
            ) : (
              <>
                <CreditCard size={20} className="mr-2" />
                決済して診断を開始
              </>
            )}
          </button>

          <p className="text-xs text-gray-600 text-center">
            🔒 安全な決済システムStripeを使用しています
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;