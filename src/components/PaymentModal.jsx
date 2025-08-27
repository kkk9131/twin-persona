import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { X, CreditCard, Mail } from 'lucide-react';

// Stripe環境設定（本番/テスト自動判定）
const getStripeKey = () => {
  const viteKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  if (!viteKey) {
    console.error('VITE_STRIPE_PUBLISHABLE_KEY not found in environment');
    throw new Error('Stripe configuration missing');
  }
  
  console.log('Using Stripe key type:', viteKey.startsWith('pk_test_') ? 'test' : 'live');
  return viteKey;
};

const stripePromise = loadStripe(getStripeKey());

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
        onSuccess({
          paymentIntentId: paymentIntentId,
          email: email,
          amount: 500
        });
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
          placeholder="your-email@example.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">
          <CreditCard size={16} className="inline mr-1 text-gray-600" />
          カード情報
        </label>
        <div className="border border-gray-300 rounded-lg p-3 bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#1f2937',
                  '::placeholder': {
                    color: '#6b7280',
                  },
                  backgroundColor: '#ffffff',
                },
                invalid: {
                  color: '#ef4444',
                },
              },
              hidePostalCode: true,
            }}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm whitespace-pre-line">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isProcessing ? '処理中...' : '¥500 で購入'}
      </button>

      <div className="text-xs text-gray-500 text-center">
        <p>🔒 SSL暗号化通信で安全に処理されます</p>
      </div>
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