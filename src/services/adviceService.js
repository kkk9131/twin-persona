export class AdviceService {
  static async generateAdvice({ mbtiType, characterCode, gapAnalysis, accessToken }) {
    try {
      const response = await fetch('/api/generate-advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mbtiType,
          characterCode,
          gapAnalysis,
          accessToken
        })
      });

      const data = await response.json();
      console.log('Advice API Response:', data);
      
      if (!data.success && data.advice) {
        // フォールバックでも成功として扱う
        return {
          success: true,
          advice: data.advice,
          source: data.source || 'fallback',
          characterCode: data.characterCode || characterCode
        };
      }

      if (!data.success) {
        console.warn('AI advice generation failed:', data.error);
        return {
          success: false,
          error: data.error,
          advice: data.advice || this.generateFallbackAdvice(mbtiType, characterCode),
          source: 'fallback'
        };
      }

      return {
        success: true,
        advice: data.advice,
        source: data.source || 'gemini',
        characterCode: data.characterCode || characterCode
      };

    } catch (error) {
      console.error('Advice generation error:', error);
      return {
        success: false,
        error: error.message,
        advice: this.generateFallbackAdvice(mbtiType, characterCode),
        source: 'error'
      };
    }
  }

  // 16タイプ対応のフォールバック助言生成
  static generateFallbackAdvice(mbtiType, characterCode) {
    // 基本的な16タイプ情報
    const typeInfo = {
      'DOFC': '模範的なアナウンサー',
      'DOFT': 'アイドルのセンター', 
      'DOMC': 'しっかり者のリーダー',
      'DOMT': '春の陽だまりのような人',
      'DIFC': '上品で洗練された人',
      'NIMC': '天使のような純粋さ',
      'DIMC': '初恋のときめき',
      'NIFC': '都会的でカリスマ性',
      'NOMC': 'ミステリアスなカメレオン',
      'DIMT': '多面的な逆転魅力',
      'DIFT': '可愛い安心できる人',
      'NOFC': 'ユニークな主人公オーラ',
      'NIMT': 'エッジの効いたアーティスト',
      'NIFT': 'シックな自由人',
      'NOFT': '反骨精神のロマンチスト',
      'NOMT': 'グラマラスなミューズ'
    };

    const typeName = typeInfo[characterCode] || '特別な魅力を持つ人';

    return {
      career: [
        `${mbtiType}タイプの特性を活かしたキャリア開発を進めましょう`,
        `${typeName}の印象を職場で効果的に活用していきましょう`,
        `強みを最大限に活用できる環境を見つけることが大切です`
      ],
      relationships: [
        `相手の価値観を理解し、尊重する姿勢を大切にしましょう`,
        `${typeName}の魅力から深い信頼関係を築いていきましょう`,
        `聞き上手になることで、より深い関係を築けます`
      ],
      romance: [
        `${typeName}の印象を活かした自然な魅力を大切にしましょう`,
        `相手のペースを尊重しながら、徐々に距離を縮めていきましょう`,
        `共通の趣味や価値観を見つけて、絆を深めていきましょう`
      ],
      growth: [
        `${mbtiType}タイプの成長パターンに合った自己開発を進めましょう`,
        `失敗を恐れず、経験として捉える姿勢を身につけましょう`,
        `定期的な振り返りで自己理解を深めていきましょう`
      ],
      lifestyle: [
        `${mbtiType}×${typeName}に最適な生活リズムを作りましょう`,
        `趣味や好きなことに時間を作って、心の余裕を持ちましょう`,
        `健康的な食事と適度な運動で、心身のバランスを整えましょう`
      ],
      stress: [
        `ストレスを感じたら、深呼吸やストレッチで心を落ち着けましょう`,
        `信頼できる人に話を聞いてもらうことも大切です`,
        `好きな音楽を聴いたり、散歩をしたりしてリフレッシュしましょう`
      ]
    };
  }
}