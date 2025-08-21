const { GoogleGenerativeAI } = require('@google/generative-ai');

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

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = generateAdvicePrompt(mbtiType, characterType, gapAnalysis);
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const advice = response.text();

    // Parse the JSON response from GEMINI
    let parsedAdvice;
    try {
      parsedAdvice = JSON.parse(advice);
    } catch (parseError) {
      // If JSON parsing fails, return the raw text
      parsedAdvice = {
        career: [advice.slice(0, 100) + "..."],
        relationships: ["JSON解析エラーが発生しました"],
        romance: ["再度お試しください"],
        growth: [""],
        lifestyle: [""],
        stress: [""]
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