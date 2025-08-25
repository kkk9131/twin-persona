import React, { useState } from 'react';
import { X, Star, MessageCircle } from 'lucide-react';

const FeedbackModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('評価を選択してください');
      return;
    }
    onSubmit({ rating, comment });
  };

  const resetForm = () => {
    setRating(0);
    setComment('');
    setHoveredRating(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <MessageCircle className="mr-2" size={24} />
            フィードバック
          </h3>
          <button 
            onClick={() => {
              onClose();
              resetForm();
            }} 
            className="text-gray-600 hover:text-gray-800"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 評価 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              診断はいかがでしたか？ *
            </label>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="transition-all duration-200"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  disabled={isLoading}
                >
                  <Star
                    size={32}
                    className={`${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    } hover:scale-110 transition-transform`}
                  />
                </button>
              ))}
            </div>
            <div className="text-center mt-2">
              <span className="text-sm text-gray-600">
                {rating > 0 && (
                  <>
                    {rating === 1 && '😞 改善が必要'}
                    {rating === 2 && '😐 まあまあ'}
                    {rating === 3 && '😊 良い'}
                    {rating === 4 && '😄 とても良い'}
                    {rating === 5 && '🤩 最高！'}
                  </>
                )}
              </span>
            </div>
          </div>

          {/* コメント */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ご意見・ご感想（任意）
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="4"
              placeholder="診断の感想や改善点があればお聞かせください..."
              disabled={isLoading}
            />
          </div>

          {/* 送信ボタン */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={rating === 0 || isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  返金処理中...
                </>
              ) : (
                <>
                  <MessageCircle size={20} className="mr-2" />
                  フィードバックを送信して¥500返金
                </>
              )}
            </button>

            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <p className="text-sm text-green-800 text-center">
                💰 フィードバック送信後、¥500を即座に返金いたします
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="w-full text-gray-600 py-2 hover:text-gray-800 transition-colors text-sm"
              disabled={isLoading}
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;