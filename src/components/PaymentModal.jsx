import React from 'react';
import { X } from 'lucide-react';

const PAYMENT_LINK_URL = import.meta.env.VITE_STRIPE_PAYMENT_LINK_URL || 'https://buy.stripe.com/7sY9ATdIO8tl6mH2pe3Nm02';

const PaymentModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleRedirectToPaymentLink = () => {
    window.location.href = PAYMENT_LINK_URL;
  };

  return (
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
            <div className="text-right">
              <span className="block text-2xl font-bold text-gray-800">¥500</span>
              <span className="block text-xs text-gray-500">先着100名限定プロモコード入力で無料！！</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleRedirectToPaymentLink}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
        >
          購入ページへ進む
        </button>

      </div>
    </div>
  );
};

export default PaymentModal;