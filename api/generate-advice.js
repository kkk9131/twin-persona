module.exports = async function handler(req, res) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // CORS preflight handling
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { mbtiType, characterType, gapAnalysis } = req.body;
    
    // GEMINI API key validation
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI API key not configured');
    }

    const prompt = generateAdvicePrompt(mbtiType, characterType, gapAnalysis);
    
    // GEMINI APIを直接呼び出し
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`GEMINI API error: ${response.status}`);
    }

    const data = await response.json();
    const advice = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse the JSON response from GEMINI
    let parsedAdvice;
    try {
      parsedAdvice = JSON.parse(advice);
    } catch (parseError) {
      console.log('Failed to parse GEMINI response:', advice);
      // If JSON parsing fails, create structured response from raw text
      const lines = advice.split('\n').filter(line => line.trim());
      parsedAdvice = {
        career: lines.slice(0, 3) || ["キャリア向上のため、継続的な学習を心がけましょう"],
        relationships: lines.slice(3, 6) || ["相手を理解し、誠実なコミュニケーションを大切にしましょう"],
        romance: lines.slice(6, 9) || ["自然体で、相手との共通点を見つけることが大切です"],
        growth: lines.slice(9, 12) || ["小さな目標から始めて、着実に成長していきましょう"],
        lifestyle: lines.slice(12, 15) || ["自分らしい生活リズムを見つけて大切にしましょう"],
        stress: lines.slice(15, 18) || ["適度な休息とリラックスを心がけましょう"]
      };
    }

    return res.status(200).json({ 
      advice: parsedAdvice,
      success: true 
    });

  } catch (error) {
    console.error('Advice generation error:', error);
    
    return res.status(500).json({ 
      error: 'アドバイス生成に失敗しました',
      details: error.message,
      success: false
    });
  }
};

function generateAdvicePrompt(mbtiType, characterType, gapAnalysis) {
  return `あなたは経験豊富な心理カウンセラーです。以下の診断結果に基づいて、実用的で具体的なアドバイスを提供してください。

診断結果:
- MBTIタイプ: ${mbtiType}
- キャラクターコード: ${characterType}
- ギャップレベル: ${gapAnalysis}

以下の6つのカテゴリで、それぞれ2-3個の具体的で実践しやすいアドバイスを日本語で提供してください。
必ずJSON形式で回答し、他の文字は含めないでください。

レスポンス形式（この形式を必ず守ってください）:
{
  "career": ["具体的なキャリアアドバイス1", "具体的なキャリアアドバイス2", "具体的なキャリアアドバイス3"],
  "relationships": ["人間関係のアドバイス1", "人間関係のアドバイス2", "人間関係のアドバイス3"],
  "romance": ["恋愛のアドバイス1", "恋愛のアドバイス2", "恋愛のアドバイス3"],
  "growth": ["成長のアドバイス1", "成長のアドバイス2", "成長のアドバイス3"],
  "lifestyle": ["ライフスタイルのアドバイス1", "ライフスタイルのアドバイス2", "ライフスタイルのアドバイス3"],
  "stress": ["ストレス管理のアドバイス1", "ストレス管理のアドバイス2", "ストレス管理のアドバイス3"]
}

各アドバイスは20-50文字程度で、具体的な行動に落とし込める形で、親しみやすい口調で書いてください。
MBTIタイプ「${mbtiType}」とキャラクターコード「${characterType}」の特性を考慮し、ギャップレベル「${gapAnalysis}」に応じたアドバイスにしてください。`;
}