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
                  <td className="font-semibold py-3 pr-6 text-dark-100 w-1/3">法人名</td>
                  <td className="py-3 text-dark-300">ご請求があった場合には速やかに開示いたします</td>
                </tr>
                <tr className="border-b border-dark-600/30">
                  <td className="font-semibold py-3 pr-6 text-dark-100">住所</td>
                  <td className="py-3 text-dark-300">ご請求があった場合には速やかに開示いたします</td>
                </tr>
                <tr className="border-b border-dark-600/30">
                  <td className="font-semibold py-3 pr-6 text-dark-100">電話番号</td>
                  <td className="py-3 text-dark-300">
                    ご請求があった場合には速やかに開示いたします<br />
                    営業時間：10:00〜18:00（土日祝日を除く）
                  </td>
                </tr>
                <tr className="border-b border-dark-600/30">
                  <td className="font-semibold py-3 pr-6 text-dark-100">メールアドレス</td>
                  <td className="py-3 text-dark-300">kz.m29@icloud.com</td>
                </tr>
                <tr className="border-b border-dark-600/30">
                  <td className="font-semibold py-3 pr-6 text-dark-100">オペレーション責任者</td>
                  <td className="py-3 text-dark-300">岡本和人</td>
                </tr>
                <tr className="border-b border-dark-600/30">
                  <td className="font-semibold py-3 pr-6 text-dark-100">追加手数料</td>
                  <td className="py-3 text-dark-300">
                    なし<br />
                    ※サービス利用に必要なインターネット接続料金はお客様のご負担となります
                  </td>
                </tr>
                <tr className="border-b border-dark-600/30">
                  <td className="font-semibold py-3 pr-6 text-dark-100">交換および返品に関するポリシー</td>
                  <td className="py-3 text-dark-300">
                    <strong className="text-dark-100">＜お客様からの返品・交換＞</strong><br />
                    デジタルコンテンツの性質上、サービス提供開始後の返品・返金は原則として承っておりません。<br />
                    ご購入前に、無料の基本診断をお試しいただくことをお勧めします。<br /><br />
                    
                    <strong className="text-dark-100">＜不良品・サービスの返品・交換＞</strong><br />
                    以下の場合は全額返金いたします：<br />
                    ・システムの不具合により正常にサービスが利用できない場合<br />
                    ・決済エラーによる重複請求が発生した場合<br />
                    ・その他、当方の責に帰すべき事由がある場合<br />
                    お客様サポート（kz.m29@icloud.com）までご連絡ください。<br /><br />
                    
                    <strong className="text-dark-100">＜キャンペーン期間中の特別返金＞</strong><br />
                    期間限定で以下の条件を満たした場合、全額返金いたします：<br />
                    ・プレミアム診断購入後、診断結果をSNSでシェアまたはフィードバック送信<br />
                    ・先着100名様限定<br />
                    ・条件達成確認後、7営業日以内に返金処理
                  </td>
                </tr>
                <tr className="border-b border-dark-600/30">
                  <td className="font-semibold py-3 pr-6 text-dark-100">配達時間</td>
                  <td className="py-3 text-dark-300">
                    ご注文いただいた時点で商品はすぐにご利用いただけます<br />
                    ※デジタルコンテンツのため、物理的な配送はございません
                  </td>
                </tr>
                <tr className="border-b border-dark-600/30">
                  <td className="font-semibold py-3 pr-6 text-dark-100">受け付け可能な決済手段</td>
                  <td className="py-3 text-dark-300">
                    クレジットカード（Visa、Mastercard、American Express、JCB、Diners Club、Discover）<br />
                    ※決済処理はStripe社の安全なシステムを利用しています
                  </td>
                </tr>
                <tr className="border-b border-dark-600/30">
                  <td className="font-semibold py-3 pr-6 text-dark-100">決済期間</td>
                  <td className="py-3 text-dark-300">クレジットカード決済の場合はただちに処理されます</td>
                </tr>
                <tr className="border-b border-dark-600/30">
                  <td className="font-semibold py-3 pr-6 text-dark-100">価格</td>
                  <td className="py-3 text-dark-300">
                    各商品ページに記載の金額<br />
                    ・基本診断：無料<br />
                    ・プレミアム診断：500円（消費税込）
                  </td>
                </tr>
                <tr className="border-b border-dark-600/30">
                  <td className="font-semibold py-3 pr-6 text-dark-100">申し込み期間</td>
                  <td className="py-3 text-dark-300">
                    通年でお申し込みいただけます<br />
                    ※キャンペーンは予告なく終了する場合があります
                  </td>
                </tr>
                <tr className="border-b border-dark-600/30">
                  <td className="font-semibold py-3 pr-6 text-dark-100">注文可能な量</td>
                  <td className="py-3 text-dark-300">
                    制限はございません<br />
                    ※同一アカウントでの複数回診断も可能です
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold py-3 pr-6 text-dark-100">動作環境</td>
                  <td className="py-3 text-dark-300">
                    <strong className="text-dark-100">推奨ブラウザ：</strong><br />
                    • Chrome 90以降<br />
                    • Safari 14以降<br />
                    • Firefox 88以降<br />
                    • Edge 90以降<br /><br />
                    <strong className="text-dark-100">必要な環境：</strong><br />
                    • インターネット接続（ブロードバンド推奨）<br />
                    • JavaScript有効<br />
                    • Cookie有効<br />
                    • 画面解像度 1024×768以上推奨
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
            <p>&copy; 2025 TwinPersona. All rights reserved.</p>
            <p className="mt-2">最終更新日: 2025年8月27日</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokuteiPage;