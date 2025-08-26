import React from 'react';
import { ArrowLeft } from 'lucide-react';

const TokuteiPage = ({ onClose }) => {
  return (
    <div className="min-h-screen bg-rich-gradient font-sans">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="glass-strong rounded-2xl shadow-rich p-8 mb-8">
          {/* ヘッダー */}
          <div className="flex items-center mb-6">
            <button 
              onClick={onClose}
              className="mr-4 p-2 rounded-lg bg-dark-700/50 hover:bg-dark-600/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-dark-300" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gradient">
              特定商取引法に基づく表記
            </h1>
          </div>
          
          {/* 表記内容 */}
          <div className="text-dark-200 space-y-6">
            <table className="w-full border-collapse">
              <tbody className="space-y-4">
                <tr className="border-b border-dark-600/30">
                  <td className="font-semibold py-3 pr-6 text-dark-100 w-1/3">販売事業者名</td>
                  <td className="py-3 text-dark-300">TwinPersona</td>
                </tr>
                <tr className="border-b border-dark-600/30">
                  <td className="font-semibold py-3 pr-6 text-dark-100">代表者氏名</td>
                  <td className="py-3 text-dark-300">岡本和人</td>
                </tr>
                <tr className="border-b border-dark-600/30">
                  <td className="font-semibold py-3 pr-6 text-dark-100">所在地</td>
                  <td className="py-3 text-dark-300">大阪府</td>
                </tr>
                <tr className="border-b border-dark-600/30">
                  <td className="font-semibold py-3 pr-6 text-dark-100">電話番号</td>
                  <td className="py-3 text-dark-300">お問い合わせはメールでお願いいたします</td>
                </tr>
                <tr className="border-b border-dark-600/30">
                  <td className="font-semibold py-3 pr-6 text-dark-100">メールアドレス</td>
                  <td className="py-3 text-dark-300">kz.m29@icloud.com</td>
                </tr>
                <tr className="border-b border-dark-600/30">
                  <td className="font-semibold py-3 pr-6 text-dark-100">販売価格</td>
                  <td className="py-3 text-dark-300">プレミアム診断：500円（税込）</td>
                </tr>
                <tr className="border-b border-dark-600/30">
                  <td className="font-semibold py-3 pr-6 text-dark-100">支払方法</td>
                  <td className="py-3 text-dark-300">クレジットカード決済（Stripe経由）</td>
                </tr>
                <tr className="border-b border-dark-600/30">
                  <td className="font-semibold py-3 pr-6 text-dark-100">支払時期</td>
                  <td className="py-3 text-dark-300">注文確定時</td>
                </tr>
                <tr className="border-b border-dark-600/30">
                  <td className="font-semibold py-3 pr-6 text-dark-100">商品の引渡し時期</td>
                  <td className="py-3 text-dark-300">決済完了後、即時提供</td>
                </tr>
                <tr className="border-b border-dark-600/30">
                  <td className="font-semibold py-3 pr-6 text-dark-100">返品・交換について</td>
                  <td className="py-3 text-dark-300">
                    デジタルコンテンツの性質上、返品・交換は原則として承っておりません。<br />
                    ただし、キャンペーン期間中は所定の条件を満たした場合に全額返金いたします。
                  </td>
                </tr>
                <tr className="border-b border-dark-600/30">
                  <td className="font-semibold py-3 pr-6 text-dark-100">キャンペーン返金条件</td>
                  <td className="py-3 text-dark-300">
                    • プレミアム診断をご購入後<br />
                    • 診断結果をSNSでシェア、またはフィードバックを送信<br />
                    • 先着100名様限定<br />
                    • 条件達成後、自動的に全額返金処理を行います
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold py-3 pr-6 text-dark-100">提供サービス</td>
                  <td className="py-3 text-dark-300">
                    パーソナリティ診断サービス（MBTI + Character Code）<br />
                    • 基本診断：無料<br />
                    • プレミアム診断：AI生成画像、詳細分析、PDF出力
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* プライバシーポリシー概要 */}
          <div className="mt-8 pt-6 border-t border-dark-600/30">
            <h2 className="text-xl font-bold text-dark-100 mb-4">プライバシーポリシー概要</h2>
            <div className="text-dark-300 space-y-3">
              <p>当サービスでは、以下の情報を収集・利用します：</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>診断回答データ（分析目的、セッション終了時に削除）</li>
                <li>決済情報（Stripe社により安全に処理）</li>
                <li>アクセス解析（Google Analytics、匿名化済み）</li>
              </ul>
              <p>個人情報は適切に保護し、第三者への提供は行いません。</p>
            </div>
          </div>

          {/* フッター */}
          <div className="mt-8 pt-6 border-t border-dark-600/30 text-center text-sm text-dark-400">
            <p>&copy; 2024 TwinPersona. All rights reserved.</p>
            <p className="mt-2">最終更新日: 2024年8月26日</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokuteiPage;