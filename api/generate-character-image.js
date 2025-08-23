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
    const { mbtiType, characterCode, characterType, scores = {}, gender = 'neutral', occupation = null, accessToken } = req.body;

    // 課金チェック（開発中は一時的にスキップ）
    if (!accessToken) {
      console.warn('アクセストークンがありません - 開発中のため続行');
      // 開発中は警告のみで続行
      // return res.status(401).json({
      //   success: false,
      //   error: 'Access token required',
      //   message: 'プレミアム機能のアクセスにはトークンが必要です'
      // });
    }

    // トークン検証（開発中は一時的にスキップ）
    if (accessToken) {
      try {
        const tokenResponse = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/verify-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: accessToken })
        });
        
        const tokenData = await tokenResponse.json();
        if (!tokenData.valid) {
          console.warn('トークン検証失敗 - 開発中のため続行');
          // return res.status(401).json({
          //   success: false,
          //   error: 'Invalid or expired token',
          //   message: 'アクセストークンが無効または期限切れです'
          // });
        }
      } catch (tokenError) {
        console.error('Token verification error:', tokenError);
        console.warn('トークン検証エラー - 開発中のため続行');
        // return res.status(500).json({
        //   success: false,
        //   error: 'Token verification failed',
        //   message: 'トークン検証に失敗しました'
        // });
      }
    }
    
    // 後方互換性のためcharacterTypeもサポート
    const finalCharacterCode = characterCode || characterType;
    
    // OpenAI API key validation
    if (!process.env.OPENAI_API_KEY) {
      console.log('OPENAI_API_KEY is not set');
      return res.status(200).json({ 
        success: false,
        error: 'OpenAI API key not configured',
        fallback: true,
        alternativeUrl: generateFallbackSVG(mbtiType, finalCharacterCode)
      });
    }
    
    // デバッグ用ログ
    console.log('API Key exists:', !!process.env.OPENAI_API_KEY);
    console.log('API Key starts with:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 10) + '...' : 'NONE');
    console.log('Character Code:', finalCharacterCode);

    // プロンプト生成（16タイプ対応）
    const prompt = generateImagePrompt(mbtiType, finalCharacterCode, scores, gender, occupation);
    console.log('Generated prompt:', prompt.substring(0, 100) + '...');
    
    // OpenAI DALL-E 3 APIを呼び出し
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "vivid"
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('DALL-E API error:', response.status, errorData);
      
      return res.status(200).json({ 
        success: false,
        fallback: true,
        error: `DALL-E API error: ${response.status}`,
        message: 'Image generation is currently unavailable. Using fallback SVG.',
        alternativeUrl: generateFallbackSVG(mbtiType, finalCharacterCode)
      });
    }

    const data = await response.json();
    const imageUrl = data.data?.[0]?.url || '';

    if (!imageUrl) {
      throw new Error('No image URL returned from DALL-E');
    }

    return res.status(200).json({ 
      success: true,
      imageUrl: imageUrl,
      prompt: prompt,
      source: 'dall-e-3',
      characterCode: finalCharacterCode
    });

  } catch (error) {
    console.error('Character image generation error:', error);
    
    const fallbackCode = req.body.characterCode || req.body.characterType || 'DOFC';
    return res.status(200).json({ 
      success: false,
      error: error.message,
      fallback: true,
      alternativeUrl: generateFallbackSVG(req.body.mbtiType || 'ENTP', fallbackCode),
      source: 'fallback'
    });
  }
}

function generateImagePrompt(mbtiType, characterCode, scores, gender, occupation = null) {
  // MBTI特性マッピング
  const mbtiTraits = {
    'ENTP': 'energetic, adventurous, bold debater',
    'INTJ': 'strategic, determined, visionary architect', 
    'ENFP': 'enthusiastic, creative, inspiring campaigner',
    'INFJ': 'insightful, principled, passionate advocate',
    'ESTP': 'bold, practical, perceptive entrepreneur',
    'ISTP': 'practical, versatile, hands-on virtuoso',
    'ESFJ': 'caring, social, dutiful consul',
    'ISFJ': 'warm, responsible, loyal protector',
    'ENTJ': 'natural leader, decisive, strategic',
    'INTP': 'innovative thinker, curious, independent',
    'ENFJ': 'charismatic teacher, empathetic, inspiring',
    'INFP': 'idealistic mediator, creative, passionate',
    'ESTJ': 'organized executive, practical, traditional',
    'ISTJ': 'reliable logistician, systematic, dutiful',
    'ESFP': 'spontaneous entertainer, enthusiastic, social',
    'ISFP': 'gentle artist, sensitive, flexible'
  };

  // 16タイプCharacterCode印象マッピング
  const characterStyles = {
    // 印象的グループ
    'DOFC': 'trustworthy broadcaster vibe, reliable and approachable with professional warmth',
    'DOFT': 'energetic idol center charm, bright and captivating with natural magnetism',
    'DOMC': 'organized leader presence, structured and responsible with commanding authority',
    'DOMT': 'gentle spring sunshine warmth, nurturing and comforting with healing presence',
    
    // 残像的グループ  
    'DIFC': 'serene refined beauty, elegant sophistication with understated grace',
    'NIMC': 'dreamy ethereal charm, mystical and pure with otherworldly beauty',
    'DIMC': 'heart-fluttering first love, innocent sweetness with charming purity',
    'NIFC': 'urban charismatic presence, sophisticated allure with magnetic appeal',
    
    // 立体的グループ
    'NOMC': 'mysterious chameleon nature, adaptable charm with enigmatic depth',
    'DIMT': 'multifaceted reverse appeal, surprising depth with intriguing contrasts',
    'DIFT': 'cute comfort zone, adorable healing presence with gentle reassurance',
    'NOFC': 'unique protagonist aura, distinctive individuality with captivating personality',
    
    // 感覚的グループ
    'NIMT': 'edgy artistic flair, creative intensity with avant-garde sensibility',
    'NIFT': 'chic free spirit, stylish independence with effortless cool',
    'NOFT': 'rebellious romantic, passionate defiance with artistic soul',
    'NOMT': 'glamorous muse inspiration, creative catalyst with artistic magnetism'
  };

  // グループ別ビジュアルスタイル
  const groupStyles = {
    '印象的': 'bright, approachable, warm colors, clear lighting, friendly atmosphere',
    '残像的': 'memorable, sophisticated, cool tones, dramatic lighting, mysterious elegance', 
    '立体的': 'multi-dimensional, varied angles, complex composition, dynamic perspective',
    '感覚的': 'artistic, creative, vibrant colors, expressive lighting, imaginative atmosphere'
  };

  // タイプからグループを判定
  const getGroup = (code) => {
    if (['DOFC', 'DOFT', 'DOMC', 'DOMT'].includes(code)) return '印象的';
    if (['DIFC', 'NIMC', 'DIMC', 'NIFC'].includes(code)) return '残像的';
    if (['NOMC', 'DIMT', 'DIFT', 'NOFC'].includes(code)) return '立体的';
    if (['NIMT', 'NIFT', 'NOFT', 'NOMT'].includes(code)) return '感覚的';
    return '印象的'; // デフォルト
  };

  // 職業別衣装マッピング
  const occupationOutfits = {
    'ビジネス': 'professional business suit, formal attire',
    'クリエイティブ': 'stylish casual creative wear, artistic clothing',
    'テック': 'modern tech casual, smart casual with tech accessories',
    '医療': 'medical professional attire, clean healthcare clothing',
    '教育': 'professional educator clothing, approachable formal wear',
    'サービス': 'friendly service industry uniform, welcoming attire',
    '学生': 'casual student clothing, youthful modern wear',
    'アーティスト': 'creative artistic clothing, expressive fashion',
    'スポーツ': 'athletic wear, sports-inspired casual clothing',
    'その他': 'modern stylish clothing'
  };

  const mbtiTrait = mbtiTraits[mbtiType] || 'unique personality';
  const characterStyle = characterStyles[characterCode] || 'distinctive style';
  const group = getGroup(characterCode);
  const groupStyle = groupStyles[group];
  const outfitStyle = occupation ? occupationOutfits[occupation] || 'modern stylish clothing' : `modern stylish clothing matching the ${characterCode} impression`;

  // スコアに基づく特性の強調
  const charismaLevel = scores?.charisma > 80 ? 'very high' : scores?.charisma > 60 ? 'high' : 'balanced';
  const gapLevel = scores?.gap > 80 ? 'very high' : scores?.gap > 60 ? 'high' : 'balanced';

  return `Create a low-poly 3D character illustration designed as a social media share card.

Character:
- Gender: ${gender}
- MBTI type: ${mbtiType} – ${mbtiTrait}
- Character impression: ${characterCode} with ${characterStyle}
- Group style: ${group}グループ (${groupStyle})
- Style: low-poly 3D, polygonal surfaces, geometric faceted design, 150-200 polygons
- Body: FULL BODY CHARACTER showing head to feet completely, standing upright
- Framing: Wide shot ensuring entire figure fits within image boundaries with margin
- Pose: Reflecting ${characterCode} personality with ${characterStyle}
- Outfit: ${outfitStyle}

Entertainment Score Visualization:
- ${charismaLevel} Charisma: ${charismaLevel === 'very high' ? 'glowing aura, radiant atmosphere' : 'subtle glow'}
- ${gapLevel} Gap factor: ${gapLevel === 'very high' ? 'intriguing contrast in styling' : 'harmonious balance'}
- Overall vibe: ${mbtiType} personality with ${characterCode} visual impression from ${group}グループ

Card Design:
- Format: 1:1 square, optimized for Instagram/Twitter sharing
- Background: abstract polygonal shapes with gradient matching personality type and ${group}グループ
- Lighting: ${groupStyle.includes('dramatic') ? 'dramatic directional lighting' : 'soft ambient with directional highlight'}
- Color scheme: ${group === '印象的' ? 'warm, bright, approachable colors' : 
                  group === '残像的' ? 'cool, sophisticated, memorable tones' :
                  group === '立体的' ? 'complex, multi-layered color palette' :
                  'vibrant, creative, artistic colors'}
- Text overlay: "${mbtiType} × ${characterCode}" positioned in top-left corner with sufficient margin
- Text styling: Bold, readable font with high contrast outline/shadow for visibility
- Text size: Large enough to read clearly but not overwhelming
- Text placement: Ensure text stays within image boundaries and is not cropped
- Style: Clean, modern, shareable social media aesthetic reflecting ${group}グループ characteristics`;
}

function generateFallbackSVG(mbtiType, characterCode) {
  // フォールバック用のSVGキャラクター生成（16タイプ対応）
  // 既存のSVG生成ロジックを活用
  return `data:image/svg+xml;base64,${btoa(generateCharacterSVG(mbtiType, characterCode))}`;
}

function generateCharacterSVG(mbtiType, characterCode) {
  // 16タイプ対応のシンプルなSVGキャラクター
  
  // グループ別カラーマッピング
  const groupColors = {
    // 印象的グループ - 暖色系
    'DOFC': '#F59E0B', 'DOFT': '#F59E0B', 'DOMC': '#F59E0B', 'DOMT': '#F59E0B',
    // 残像的グループ - 寒色系  
    'DIFC': '#06B6D4', 'NIMC': '#06B6D4', 'DIMC': '#06B6D4', 'NIFC': '#06B6D4',
    // 立体的グループ - 緑系
    'NOMC': '#10B981', 'DIMT': '#10B981', 'DIFT': '#10B981', 'NOFC': '#10B981',
    // 感覚的グループ - 紫系
    'NIMT': '#8B5CF6', 'NIFT': '#8B5CF6', 'NOFT': '#8B5CF6', 'NOMT': '#8B5CF6'
  };
  
  // デフォルトカラー
  const characterColor = groupColors[characterCode] || '#8B5CF6';
  
  // グループ名取得
  const getGroupName = (code) => {
    if (['DOFC', 'DOFT', 'DOMC', 'DOMT'].includes(code)) return '印象的';
    if (['DIFC', 'NIMC', 'DIMC', 'NIFC'].includes(code)) return '残像的';
    if (['NOMC', 'DIMT', 'DIFT', 'NOFC'].includes(code)) return '立体的';
    if (['NIMT', 'NIFT', 'NOFT', 'NOMT'].includes(code)) return '感覚的';
    return '印象的';
  };
  
  const groupName = getGroupName(characterCode);
  
  return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${characterColor}" stop-opacity="0.1"/>
        <stop offset="100%" stop-color="${characterColor}" stop-opacity="0.3"/>
      </linearGradient>
    </defs>
    <rect width="300" height="300" fill="url(#bgGradient)"/>
    <circle cx="150" cy="120" r="60" fill="${characterColor}" opacity="0.8"/>
    <circle cx="150" cy="120" r="40" fill="white" opacity="0.3"/>
    <text x="150" y="210" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="${characterColor}">${mbtiType}</text>
    <text x="150" y="235" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="${characterColor}">${characterCode}</text>
    <text x="150" y="255" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="${characterColor}" opacity="0.7">${groupName}グループ</text>
  </svg>`;
}