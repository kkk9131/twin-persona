import React, { useState, useEffect } from 'react';
import { X, Star, Share2, MessageCircle, Gift } from 'lucide-react';

const CampaignModal = ({ isOpen, onClose, onSuccess, diagnosisResult }) => {
  const [campaignStatus, setCampaignStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // キャンペーン状況を取得
  useEffect(() => {
    if (isOpen) {
      fetchCampaignStatus();
    }
  }, [isOpen]);

  const fetchCampaignStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/check-free-campaign');
      const data = await response.json();
      setCampaignStatus(data);
    } catch (error) {
      console.error('Campaign status fetch error:', error);
      setCampaignStatus({ campaignActive: false, remainingSlots: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">🎉 期間限定キャンペーン</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">読み込み中...</p>
          </div>
        ) : (
          <>
            {/* キャンペーン状況表示 */}
            {campaignStatus?.campaignActive && campaignStatus?.remainingSlots > 0 ? (
              <>
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-green-800">先着100名様限定！</h4>
                      <p className="text-sm text-green-700">全額返金キャンペーン実施中</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-800">{campaignStatus.remainingSlots}</div>
                      <div className="text-xs text-green-600">名様残り</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">💰 全額返金の条件</h4>
                    <ul className="text-sm text-blue-700 space-y-2">
                      <li className="flex items-start">
                        <span className="mr-2">1.</span>
                        <span>プレミアム診断（¥500）をご購入</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">2.</span>
                        <span>AI生成画像付き診断結果をSNSでシェア</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">3.</span>
                        <span>または、フィードバックを送信</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <p className="text-sm text-amber-800">
                      <span className="font-semibold">📢 つまり...</span><br />
                      SNS共有かフィードバックで<strong>実質無料</strong>でプレミアム機能が使えます！
                    </p>
                  </div>
                </div>

                <div className="text-center space-y-3">
                  <button
                    onClick={() => {
                      onClose();
                      // 決済モーダルを開く
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg"
                  >
                    了解！プレミアム診断を始める
                  </button>
                  
                  <button
                    onClick={onClose}
                    className="w-full text-gray-600 py-2 hover:text-gray-800 transition-colors text-sm"
                  >
                    あとで考える
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center py-4">
                  <div className="bg-gray-50 p-6 rounded-lg mb-4">
                    <Gift className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-semibold mb-2">
                      キャンペーンは終了しました
                    </p>
                    <p className="text-sm text-gray-500">
                      通常料金（¥500）でプレミアム診断をご利用いただけます
                    </p>
                  </div>
                  
                  <button
                    onClick={() => {
                      onClose();
                      // 決済モーダルを開く
                    }}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                  >
                    プレミアム診断を購入する（¥500）
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CampaignModal;