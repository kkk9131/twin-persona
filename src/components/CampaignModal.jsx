import React, { useState, useEffect } from 'react';
import { X, Star, Share2, MessageCircle, Gift } from 'lucide-react';

const CampaignModal = ({ isOpen, onClose, onSuccess, diagnosisResult }) => {
  const [campaignStatus, setCampaignStatus] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // フィードバック用状態
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  
  // キャンペーン状況を取得
  useEffect(() => {
    if (isOpen) {
      fetchCampaignStatus();
    }
  }, [isOpen]);

  const fetchCampaignStatus = async () => {
    try {
      const response = await fetch('/api/check-free-campaign');
      const data = await response.json();
      setCampaignStatus(data);
    } catch (error) {
      console.error('Campaign status fetch error:', error);
    }
  };

  const handleShare = async () => {
    setIsSubmitting(true);
    try {
      // Web Share API を使用
      if (navigator.share) {
        await navigator.share({
          title: `ツインパーソナ診断結果 - ${diagnosisResult.personalizedTitle}`,
          text: diagnosisResult.shareText,
          url: window.location.href
        });
      } else {
        // フォールバック: クリップボードにコピー
        await navigator.clipboard.writeText(
          `${diagnosisResult.shareText}\n${window.location.href}\n#TwinPersona #ツインパーソナ`
        );
        alert('共有テキストをクリップボードにコピーしました！SNSに投稿してください。');
      }
      
      // 共有完了をサーバーに通知
      await claimFreeAccess('share', { platform: 'web-share' });
      
    } catch (error) {
      console.error('Share error:', error);
      setIsSubmitting(false);
    }
  };

  const handleFeedback = async () => {
    if (rating === 0) {
      alert('評価を選択してください');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await claimFreeAccess('feedback', { rating, comment });
    } catch (error) {
      console.error('Feedback error:', error);
      setIsSubmitting(false);
    }
  };

  const claimFreeAccess = async (action, data) => {
    try {
      const response = await fetch('/api/claim-free-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, data })
      });
      
      const result = await response.json();
      
      if (result.success) {
        onSuccess(result.couponCode);
        onClose();
      } else {
        alert(result.message || 'エラーが発生しました');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Claim free access error:', error);
      alert('エラーが発生しました。しばらく後に再試行してください。');
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !campaignStatus) return null;

  // キャンペーン終了 or 既に使用済み
  if (!campaignStatus.campaignActive || !campaignStatus.userEligible) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">キャンペーン情報</h3>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
              <X size={24} />
            </button>
          </div>
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">
              {!campaignStatus.campaignActive 
                ? '無料キャンペーンは終了しました' 
                : '既にキャンペーンをご利用いただいています'}
            </p>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-100">
              <p className="font-semibold text-gray-800">プレミアム診断 ¥500</p>
              <p className="text-sm text-gray-600 mt-2">AI画像生成・詳細分析をお楽しみください</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">🎉 無料キャンペーン</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>

        {/* キャンペーン状況表示 */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-green-800">先着100名様限定！</h4>
              <p className="text-sm text-green-700">拡散にご協力いただいた方のみ</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-800">{campaignStatus.remainingSlots}</div>
              <div className="text-xs text-green-600">名様残り</div>
            </div>
          </div>
        </div>

        {!selectedAction ? (
          /* 選択肢表示 */
          <div className="space-y-4">
            <p className="text-center text-gray-600 mb-6">
              以下のいずれかでプレミアム診断が<strong>無料</strong>になります
            </p>
            
            <button
              onClick={() => setSelectedAction('share')}
              className="w-full p-4 border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
            >
              <div className="flex items-center justify-center space-x-3">
                <Share2 className="text-blue-600" size={24} />
                <div className="text-left">
                  <div className="font-semibold text-blue-800">SNSで共有する</div>
                  <div className="text-sm text-blue-600">診断結果をSNSでシェア</div>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => setSelectedAction('feedback')}
              className="w-full p-4 border-2 border-purple-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-200"
            >
              <div className="flex items-center justify-center space-x-3">
                <MessageCircle className="text-purple-600" size={24} />
                <div className="text-left">
                  <div className="font-semibold text-purple-800">フィードバックする</div>
                  <div className="text-sm text-purple-600">感想・評価を教えてください</div>
                </div>
              </div>
            </button>
          </div>
        ) : selectedAction === 'share' ? (
          /* SNS共有画面 */
          <div className="space-y-4">
            <div className="text-center">
              <Share2 className="mx-auto text-blue-600 mb-4" size={48} />
              <h4 className="font-bold text-gray-800 mb-2">SNSで共有してください</h4>
              <p className="text-sm text-gray-600 mb-4">
                診断結果をSNSでシェアして、無料クーポンを取得！
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-sm text-gray-600 mb-2">共有内容プレビュー:</p>
              <p className="text-sm break-words">{diagnosisResult.shareText}</p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleShare}
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {isSubmitting ? '処理中...' : 'SNSで共有する'}
              </button>
              
              <button
                onClick={() => setSelectedAction(null)}
                className="w-full text-gray-600 py-2 hover:text-gray-800 transition-colors"
              >
                戻る
              </button>
            </div>
          </div>
        ) : (
          /* フィードバック画面 */
          <div className="space-y-4">
            <div className="text-center">
              <MessageCircle className="mx-auto text-purple-600 mb-4" size={48} />
              <h4 className="font-bold text-gray-800 mb-2">フィードバックをお聞かせください</h4>
              <p className="text-sm text-gray-600 mb-4">
                あなたの感想で、より良いサービスを作ります
              </p>
            </div>
            
            {/* 評価（5段階） */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                診断の満足度をお聞かせください
              </label>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    onClick={() => setRating(num)}
                    className={`p-2 transition-colors ${
                      rating >= num ? 'text-yellow-500' : 'text-gray-300'
                    }`}
                  >
                    <Star size={24} fill={rating >= num ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>
            
            {/* コメント */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                感想・改善要望（任意）
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="診断の感想や改善してほしい点があれば教えてください..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none h-20 text-sm"
                maxLength="500"
              />
              <div className="text-xs text-gray-500 text-right mt-1">
                {comment.length}/500
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleFeedback}
                disabled={isSubmitting || rating === 0}
                className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {isSubmitting ? '処理中...' : 'フィードバックを送信'}
              </button>
              
              <button
                onClick={() => setSelectedAction(null)}
                className="w-full text-gray-600 py-2 hover:text-gray-800 transition-colors"
              >
                戻る
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignModal;