export default async function handler(req, res) {
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
      console.log('GEMINI_API_KEY is not set');
      // APIキーがない場合でもフォールバックレスポンスを返す
      return res.status(200).json({ 
        advice: {
          career: [`${mbtiType}タイプの特性を活かしたキャリア開発を進めましょう`, "強みを最大限に活用できる環境を見つけることが大切です", "定期的なスキルアップで市場価値を高めていきましょう"],
          relationships: ["相手の価値観を理解し、尊重する姿勢を大切にしましょう", "自分の気持ちを素直に伝える練習をしてみてください", "聞き上手になることで、より深い関係を築けます"],
          romance: [`${characterType}の印象を活かした自然な魅力を大切にしましょう`, "相手のペースを尊重しながら、徐々に距離を縮めていきましょう", "共通の趣味や価値観を見つけて、絆を深めていきましょう"],
          growth: ["新しいことに挑戦する際は、小さな目標から始めましょう", "失敗を恐れず、経験として捉える姿勢を身につけましょう", "定期的な振り返りで自己理解を深めていきましょう"],
          lifestyle: ["自分のペースを大切にした生活リズムを作りましょう", "趣味や好きなことに時間を作って、心の余裕を持ちましょう", "健康的な食事と適度な運動で、心身のバランスを整えましょう"],
          stress: ["ストレスを感じたら、深呼吸やストレッチで心を落ち着けましょう", "信頼できる人に話を聞いてもらうことも大切です", "好きな音楽を聴いたり、散歩をしたりしてリフレッシュしましょう"]
        },
        success: true,
        source: 'fallback'
      });
    }

    const prompt = `あなたは経験豊富な心理カウンセラーです。以下の詳細な診断結果に基づいて、この人だけの超具体的でパーソナライズされたアドバイスを提供してください。

診断結果詳細:
- MBTIタイプ: ${mbtiType}
- キャラクターコード: ${characterType}
- ギャップレベル: ${gapAnalysis}

重要な考慮点:
1. ${mbtiType}の性格特性（内向/外向、直感/感覚、思考/感情、判断/知覚）を深く理解して反映
2. ${characterType}の印象特性（gentle/natural/dynamic/cool）の具体的な活用方法
3. 内面（${mbtiType}）と外見（${characterType}）のギャップを強みとして活用する方法
4. 日本の文化・職場環境・人間関係を考慮した実践的なアドバイス

以下の6つのカテゴリで、それぞれ3個の超具体的で実践しやすいアドバイスを日本語で提供してください。
各アドバイスは「${mbtiType}タイプで${characterType}印象の人」として書いてください。
必ずJSON形式で回答し、他の文字は含めないでください。

{
  "career": ["${mbtiType}タイプの特性を活かした具体的なキャリア戦略", "${characterType}印象を職場で効果的に使う方法", "内面と外見のギャップを仕事の武器にする具体的手法"],
  "relationships": ["${mbtiType}の本質を理解してもらう人間関係構築法", "${characterType}印象から深い関係に発展させる方法", "ギャップを魅力に変える対人関係のコツ"],
  "romance": ["${mbtiType}×${characterType}の恋愛における独特の魅力の活かし方", "理想的なパートナーとの出会い方・アプローチ法", "長期的な関係構築における注意点とコツ"],
  "growth": ["${mbtiType}タイプの成長パターンに合った自己開発法", "${characterType}印象の人が避けるべき成長の落とし穴", "内面と外見を統合した自己実現の方法"],
  "lifestyle": ["${mbtiType}×${characterType}に最適な生活リズム・環境設計", "エネルギー回復法とストレス発散方法", "趣味・余暇活動の選び方"],
  "stress": ["${mbtiType}特有のストレス要因とその対処法", "${characterType}印象を保ちながらストレスを軽減する方法", "周囲に負担をかけずに助けを求める方法"]
}

各アドバイスは30-60文字程度で、「〜しましょう」「〜してみてください」の形で、具体的な行動に落とし込める実践的な内容にしてください。`;
    
    // GEMINI APIを直接呼び出し
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
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
      const errorText = await response.text();
      console.error('GEMINI API error:', response.status, errorText);
      throw new Error(`GEMINI API error: ${response.status}`);
    }

    const data = await response.json();
    const advice = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse the JSON response from GEMINI
    let parsedAdvice;
    try {
      // JSONブロックを抽出
      const jsonMatch = advice.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedAdvice = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.log('Failed to parse GEMINI response:', advice);
      // フォールバック
      parsedAdvice = {
        career: [`${mbtiType}タイプの特性を活かしたキャリア開発を進めましょう`, "強みを最大限に活用できる環境を見つけることが大切です"],
        relationships: ["相手の価値観を理解し、尊重する姿勢を大切にしましょう", "自分の気持ちを素直に伝える練習をしてみてください"],
        romance: [`${characterType}の印象を活かした自然な魅力を大切にしましょう`, "相手のペースを尊重しながら、徐々に距離を縮めていきましょう"],
        growth: ["新しいことに挑戦する際は、小さな目標から始めましょう", "失敗を恐れず、経験として捉える姿勢を身につけましょう"],
        lifestyle: ["自分のペースを大切にした生活リズムを作りましょう", "趣味や好きなことに時間を作って、心の余裕を持ちましょう"],
        stress: ["ストレスを感じたら、深呼吸やストレッチで心を落ち着けましょう", "信頼できる人に話を聞いてもらうことも大切です"]
      };
    }

    return res.status(200).json({ 
      advice: parsedAdvice,
      success: true,
      source: 'gemini'
    });

  } catch (error) {
    console.error('Advice generation error:', error);
    
    // エラー時でもフォールバックレスポンスを返す
    return res.status(200).json({ 
      advice: {
        career: ["キャリア向上のため、継続的な学習を心がけましょう", "自分の強みを活かせる環境を探しましょう"],
        relationships: ["相手を理解し、誠実なコミュニケーションを大切にしましょう", "聞き上手になることで、より深い関係を築けます"],
        romance: ["自然体で、相手との共通点を見つけることが大切です", "お互いのペースを尊重しながら関係を築きましょう"],
        growth: ["小さな目標から始めて、着実に成長していきましょう", "失敗を恐れず、挑戦することが大切です"],
        lifestyle: ["自分らしい生活リズムを見つけて大切にしましょう", "趣味の時間を作って心の余裕を持ちましょう"],
        stress: ["適度な休息とリラックスを心がけましょう", "ストレスを感じたら深呼吸して落ち着きましょう"]
      },
      success: true,
      source: 'fallback',
      error: error.message
    });
  }
}