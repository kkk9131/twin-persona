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
    // 16タイプ対応：characterTypeからcharacterCodeに変更
    const { mbtiType, characterCode, characterType, gapAnalysis, accessToken } = req.body;

    // 課金チェック
    if (!accessToken) {
      return res.status(401).json({
        success: false,
        error: 'Access token required',
        message: 'プレミアム機能のアクセスにはトークンが必要です'
      });
    }

    // トークン検証
    try {
      const tokenResponse = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/verify-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: accessToken })
      });
      
      const tokenData = await tokenResponse.json();
      if (!tokenData.valid) {
        return res.status(401).json({
          success: false,
          error: 'Invalid or expired token',
          message: 'アクセストークンが無効または期限切れです'
        });
      }
    } catch (tokenError) {
      console.error('Token verification error:', tokenError);
      return res.status(500).json({
        success: false,
        error: 'Token verification failed',
        message: 'トークン検証に失敗しました'
      });
    }
    
    // 後方互換性のためcharacterTypeもサポート
    const finalCharacterCode = characterCode || characterType;
    
    // GEMINI API key validation
    if (!process.env.GEMINI_API_KEY) {
      console.log('GEMINI_API_KEY is not set');
      // APIキーがない場合でもフォールバックレスポンスを返す（16タイプ対応）
      return res.status(200).json({ 
        advice: generateFallbackAdvice(mbtiType, finalCharacterCode),
        success: true,
        source: 'fallback'
      });
    }

    // 16タイプ対応のプロンプト生成
    const prompt = generate16TypePrompt(mbtiType, finalCharacterCode, gapAnalysis);
    
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
      // フォールバック（16タイプ対応）
      parsedAdvice = generateFallbackAdvice(mbtiType, finalCharacterCode);
    }

    return res.status(200).json({ 
      advice: parsedAdvice,
      success: true,
      source: 'gemini',
      characterCode: finalCharacterCode
    });

  } catch (error) {
    console.error('Advice generation error:', error);
    
    // エラー時でもフォールバックレスポンスを返す（16タイプ対応）
    const fallbackCode = req.body.characterCode || req.body.characterType || 'DOFC';
    return res.status(200).json({ 
      advice: generateFallbackAdvice(req.body.mbtiType || 'ENTP', fallbackCode),
      success: true,
      source: 'fallback',
      error: error.message
    });
  }
}

// 16タイプ対応のプロンプト生成関数
function generate16TypePrompt(mbtiType, characterCode, gapAnalysis) {
  // 16タイプの詳細特性マッピング
  const characterDetails = {
    // 印象的グループ
    'DOFC': { name: '模範的なアナウンサー', group: '印象的', traits: '信頼感があり、話しやすく親しみやすい印象。プロフェッショナルな温かさ' },
    'DOFT': { name: 'アイドルのセンター', group: '印象的', traits: 'エネルギッシュで華やか、自然な人気者オーラ。魅力的で親近感のある存在' },
    'DOMC': { name: 'しっかり者のリーダー', group: '印象的', traits: '統率力があり責任感が強い。頼れる存在として周囲から信頼される' },
    'DOMT': { name: '春の陽だまりのような人', group: '印象的', traits: '穏やかで包容力があり、癒し系。自然と人が集まる温かい存在' },
    
    // 残像的グループ  
    'DIFC': { name: '上品で洗練された人', group: '残像的', traits: '上質で洗練された美しさ。控えめながらも印象に残る気品ある存在' },
    'NIMC': { name: '天使のような純粋さ', group: '残像的', traits: '透明感があり純粋で美しい。神秘的で特別な印象を与える' },
    'DIMC': { name: '初恋のときめき', group: '残像的', traits: '初々しく可愛らしい魅力。清純で心を動かす特別な存在感' },
    'NIFC': { name: '都会的でカリスマ性', group: '残像的', traits: '洗練された都会的魅力。カリスマ性があり影響力のある存在' },
    
    // 立体的グループ
    'NOMC': { name: 'ミステリアスなカメレオン', group: '立体的', traits: '多面的で謎めいた魅力。状況に応じて異なる面を見せる' },
    'DIMT': { name: '多面的な逆転魅力', group: '立体的', traits: '見た目と中身のギャップが大きく、多層的な魅力を持つ' },
    'DIFT': { name: '可愛い安心できる人', group: '立体的', traits: '親しみやすく癒される存在。安心感と可愛らしさを兼ね備える' },
    'NOFC': { name: 'ユニークな主人公オーラ', group: '立体的', traits: '個性的で特別な存在感。唯一無二の魅力を持つ主人公的存在' },
    
    // 感覚的グループ
    'NIMT': { name: 'エッジの効いたアーティスト', group: '感覚的', traits: '個性的でクリエイティブ。アート性と独創性を持つ' },
    'NIFT': { name: 'シックな自由人', group: '感覚的', traits: 'スタイリッシュで自由奔放。洗練された個性を持つ' },
    'NOFT': { name: '反骨精神のロマンチスト', group: '感覚的', traits: '情熱的で独立心が強い。ロマンチックな反骨精神を持つ' },
    'NOMT': { name: 'グラマラスなミューズ', group: '感覚的', traits: '華やかで芸術的インスピレーション。創造性を刺激する存在' }
  };

  // グループ別特性
  const groupCharacteristics = {
    '印象的': '明るく親しみやすく、人とのつながりを大切にする。温かみがあり信頼される',
    '残像的': '上品で記憶に残る印象を与える。洗練されていて特別感がある',
    '立体的': '多面的で複雑な魅力を持つ。状況によって異なる面を見せる',
    '感覚的': '個性的でクリエイティブ。芸術的センスと独創性を持つ'
  };

  const details = characterDetails[characterCode] || characterDetails['DOFC'];
  const groupTrait = groupCharacteristics[details.group] || '特別な魅力を持つ';

  return `あなたは経験豊富な心理カウンセラーです。以下の詳細な16タイプCharacterCode診断結果に基づいて、この人だけの超具体的でパーソナライズされたアドバイスを提供してください。

診断結果詳細:
- MBTI タイプ: ${mbtiType}
- CharacterCode: ${characterCode} (${details.name})
- グループ: ${details.group}グループ
- 印象特性: ${details.traits}
- グループ特性: ${groupTrait}
- ギャップレベル: ${gapAnalysis}

重要な考慮点:
1. ${mbtiType}の性格特性（内向/外向、直感/感覚、思考/感情、判断/知覚）を深く理解して反映
2. ${details.name}(${characterCode})の印象特性「${details.traits}」の具体的な活用方法
3. ${details.group}グループの特徴「${groupTrait}」を強みとして活かす方法
4. 内面（${mbtiType}）と外見（${details.name}）のギャップを強みとして活用する方法
5. 日本の文化・職場環境・人間関係を考慮した実践的なアドバイス

以下の6つのカテゴリで、それぞれ3個の超具体的で実践しやすいアドバイスを日本語で提供してください。
各アドバイスは「${mbtiType}タイプで${details.name}(${characterCode})印象の人」として書いてください。
必ずJSON形式で回答し、他の文字は含めないでください。

{
  "career": ["${mbtiType}タイプの特性を活かした具体的なキャリア戦略", "${details.name}印象を職場で効果的に使う方法", "内面と外見のギャップを仕事の武器にする具体的手法"],
  "relationships": ["${mbtiType}の本質を理解してもらう人間関係構築法", "${details.name}印象から深い関係に発展させる方法", "ギャップを魅力に変える対人関係のコツ"],
  "romance": ["${mbtiType}×${details.name}の恋愛における独特の魅力の活かし方", "理想的なパートナーとの出会い方・アプローチ法", "長期的な関係構築における注意点とコツ"],
  "growth": ["${mbtiType}タイプの成長パターンに合った自己開発法", "${details.name}印象の人が避けるべき成長の落とし穴", "内面と外見を統合した自己実現の方法"],
  "lifestyle": ["${mbtiType}×${details.name}に最適な生活リズム・環境設計", "エネルギー回復法とストレス発散方法", "趣味・余暇活動の選び方"],
  "stress": ["${mbtiType}特有のストレス要因とその対処法", "${details.name}印象を保ちながらストレスを軽減する方法", "周囲に負担をかけずに助けを求める方法"]
}

各アドバイスは30-60文字程度で、「〜しましょう」「〜してみてください」の形で、具体的な行動に落とし込める実践的な内容にしてください。`;
}

// 16タイプ対応のフォールバック助言生成関数
function generateFallbackAdvice(mbtiType, characterCode) {
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
