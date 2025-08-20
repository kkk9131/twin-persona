/**
 * アドバイス生成サービス
 * Vercel Edge Functionsを使用してGEMINI APIからパーソナライズされたアドバイスを取得
 */

export class AdviceService {
  static async generateAdvice(diagnosisResult) {
    try {
      const response = await fetch('/api/generate-advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mbtiType: diagnosisResult.mbtiType,
          characterType: diagnosisResult.characterType,
          gapAnalysis: diagnosisResult.gapLevel || 'medium'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: アドバイス生成に失敗しました`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'アドバイス生成に失敗しました');
      }

      // アドバイスデータの妥当性チェック
      const advice = data.advice;
      if (!this.validateAdviceStructure(advice)) {
        throw new Error('アドバイスデータの形式が正しくありません');
      }

      return advice;

    } catch (error) {
      console.error('Advice generation error:', error);
      
      // フォールバック: デフォルトアドバイスを返す
      return this.getDefaultAdvice(diagnosisResult);
    }
  }

  /**
   * アドバイス構造の妥当性チェック
   */
  static validateAdviceStructure(advice) {
    if (!advice || typeof advice !== 'object') return false;
    
    const requiredCategories = ['career', 'relationships', 'romance', 'growth', 'lifestyle', 'stress'];
    
    return requiredCategories.every(category => {
      return advice[category] && 
             Array.isArray(advice[category]) && 
             advice[category].length > 0;
    });
  }

  /**
   * デフォルトアドバイス（API失敗時のフォールバック）
   */
  static getDefaultAdvice(diagnosisResult) {
    const { mbtiType, characterType } = diagnosisResult;
    
    return {
      career: [
        `${mbtiType}タイプの特性を活かせる職場環境を探しましょう`,
        "自分の強みを整理して、それを活用できる機会を見つけることが大切です",
        "定期的なスキルアップで市場価値を高めていきましょう"
      ],
      relationships: [
        "相手の価値観を理解し、尊重する姿勢を大切にしましょう",
        "自分の気持ちを素直に伝える練習をしてみてください",
        "聞き上手になることで、より深い関係を築けます"
      ],
      romance: [
        `${characterType}の印象を活かした自然な魅力を大切にしましょう`,
        "相手のペースを尊重しながら、徐々に距離を縮めていきましょう",
        "共通の趣味や価値観を見つけて、絆を深めていきましょう"
      ],
      growth: [
        "新しいことに挑戦する際は、小さな目標から始めましょう",
        "失敗を恐れず、経験として捉える mindset を身につけましょう",
        "定期的な振り返りで自己理解を深めていきましょう"
      ],
      lifestyle: [
        "自分のペースを大切にした生活リズムを作りましょう",
        "趣味や好きなことに時間を作って、心の余裕を持ちましょう",
        "健康的な食事と適度な運動で、心身のバランスを整えましょう"
      ],
      stress: [
        "ストレスを感じたら、深呼吸やストレッチで心を落ち着けましょう",
        "信頼できる人に話を聞いてもらうことも大切です",
        "好きな音楽を聴いたり、散歩をしたりしてリフレッシュしましょう"
      ]
    };
  }

  /**
   * アドバイスカテゴリのタイトルを取得
   */
  static getCategoryTitle(category) {
    const titles = {
      career: '💼 仕事・キャリア',
      relationships: '🤝 人間関係', 
      romance: '💕 恋愛・パートナーシップ',
      growth: '🌱 自己成長',
      lifestyle: '🎨 ライフスタイル',
      stress: '🧘 ストレス管理'
    };
    return titles[category] || category;
  }

  /**
   * アドバイスの品質評価（将来の機能拡張用）
   */
  static evaluateAdviceQuality(advice) {
    if (!advice) return 0;
    
    let score = 0;
    const categories = Object.keys(advice);
    
    categories.forEach(category => {
      const items = advice[category];
      if (Array.isArray(items)) {
        items.forEach(item => {
          if (typeof item === 'string' && item.length > 10 && item.length < 100) {
            score += 1;
          }
        });
      }
    });
    
    return Math.min(score / 18, 1); // 18 = 6 categories * 3 items max
  }
}