import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { X, CreditCard, Mail } from 'lucide-react';

const stripePromise = loadStripe('pk_test_51RzJ5jQl0WdwXwrDcFQYIqu7rSJ0CvXbv9FqSZQEouZVv3dzPRQ2ZPhKic9hzVG2pH5xjP9azWSL0rzCR9O4NcWR00KXTqxLb6');

// カード入力フォームコンポーネント
const CheckoutForm = ({ email, setEmail, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!email.trim()) {
      setError('メールアドレスを入力してください');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('カード情報が入力されていません');
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

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '決済の準備に失敗しました');
      }

      const { clientSecret, paymentIntentId } = data;

      // Stripe Elementsで決済確認
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: email,
          },
        },
        receipt_email: email,
      });

      if (error) {
        setError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        // 決済成功
        onSuccess(paymentIntentId);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">
          <CreditCard size={16} className="inline mr-1 text-gray-600" />
          カード情報
        </label>
        <div className="p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500">
          <CardElement
            options={{
              hidePostalCode: true,
              style: {
                base: {
                  fontSize: '16px',
                  color: '#374151',
                  '::placeholder': {
                    color: '#9CA3AF',
                  },
                },
                invalid: {
                  color: '#EF4444',
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
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
            ¥500 で決済して診断を開始
          </>
        )}
      </button>

      <p className="text-xs text-gray-600 text-center">
        🔒 安全な決済システムStripeを使用しています
      </p>
    </form>
  );
};

// メインのPaymentModalコンポーネント
const PaymentModal = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  return (
    <Elements stripe={stripePromise}>
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">プレミアム診断アンロック</h3>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 transition-colors"
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

          <CheckoutForm 
            email={email}
            setEmail={setEmail}
            onSuccess={onSuccess}
            onClose={onClose}
          />
        </div>
      </div>
    </Elements>
  );
};

export default PaymentModal;