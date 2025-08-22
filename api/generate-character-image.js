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
    const { mbtiType, characterType, scores = {}, gender = 'neutral' } = req.body;
    
    // OpenAI API key validation
    if (!process.env.OPENAI_API_KEY) {
      console.log('OPENAI_API_KEY is not set');
      return res.status(200).json({ 
        success: false,
        error: 'OpenAI API key not configured',
        fallback: true,
        alternativeUrl: generateFallbackSVG(mbtiType, characterType)
      });
    }
    
    // デバッグ用ログ
    console.log('API Key exists:', !!process.env.OPENAI_API_KEY);
    console.log('API Key starts with:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 10) + '...' : 'NONE');

    // プロンプト生成
    const prompt = generateImagePrompt(mbtiType, characterType, scores, gender);
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
        alternativeUrl: generateFallbackSVG(mbtiType, characterType)
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
      source: 'dall-e-3'
    });

  } catch (error) {
    console.error('Character image generation error:', error);
    
    return res.status(200).json({ 
      success: false,
      error: error.message,
      fallback: true,
      alternativeUrl: generateFallbackSVG(req.body.mbtiType || 'ENTP', req.body.characterType || 'dynamic'),
      source: 'fallback'
    });
  }
}

function generateImagePrompt(mbtiType, characterType, scores, gender) {
  // MBTIタイプの特性マッピング
  const mbtiTraits = {
    'ENTP': 'energetic, adventurous, bold debater',
    'INTJ': 'strategic, determined, visionary architect',
    'ENFP': 'enthusiastic, creative, inspiring campaigner',
    'INFJ': 'insightful, principled, passionate advocate',
    'ESTP': 'bold, practical, perceptive entrepreneur',
    'ISTP': 'practical, versatile, hands-on virtuoso',
    'ESFJ': 'caring, social, dutiful consul',
    'ISFJ': 'warm, responsible, loyal protector',
    // 他のタイプも追加...
  };

  // Character Codeの印象マッピング
  const characterStyles = {
    'gentle': 'soft, approachable, warm presence',
    'natural': 'authentic, relaxed, effortless charm',
    'dynamic': 'energetic, bold, vibrant personality',
    'cool': 'sophisticated, composed, mysterious aura'
  };

  const mbtiTrait = mbtiTraits[mbtiType] || 'unique personality';
  const characterStyle = characterStyles[characterType] || 'distinctive style';

  // スコアに基づく特性の強調
  const charismaLevel = scores?.charisma > 80 ? 'very high' : scores?.charisma > 60 ? 'high' : 'balanced';
  const gapLevel = scores?.gap > 80 ? 'very high' : scores?.gap > 60 ? 'high' : 'balanced';

  return `Create a low-poly 3D character illustration designed as a social media share card.

Character:
- Gender: ${gender}
- MBTI type: ${mbtiType} – ${mbtiTrait}
- Character impression: ${characterType} style with ${characterStyle}
- Style: low-poly 3D, polygonal surfaces, geometric faceted design, 150-200 polygons
- Pose: ${characterType === 'dynamic' ? 'energetic and lively' : characterType === 'gentle' ? 'soft and welcoming' : characterType === 'cool' ? 'composed and confident' : 'natural and relaxed'}
- Outfit: modern stylish clothing matching the ${characterType} impression

Entertainment Score Visualization:
- ${charismaLevel} Charisma: ${charismaLevel === 'very high' ? 'glowing aura, radiant atmosphere' : 'subtle glow'}
- ${gapLevel} Gap factor: ${gapLevel === 'very high' ? 'intriguing contrast in styling' : 'harmonious balance'}
- Overall vibe: ${mbtiType} personality with ${characterType} visual impression

Card Design:
- Format: 1:1 square, optimized for Instagram/Twitter sharing
- Background: abstract polygonal shapes with gradient matching personality type
- Lighting: soft ambient with directional highlight
- Color scheme: vibrant but harmonious, reflecting both MBTI and Character Code
- Text overlay (must be clearly visible):
   • Top: "MBTI: ${mbtiType}"
   • Bottom: "Character: ${characterType}"
- Style: Clean, modern, shareable social media aesthetic`;
}

function generateFallbackSVG(mbtiType, characterType) {
  // フォールバック用のSVGキャラクター生成
  // 既存のSVG生成ロジックを活用
  return `data:image/svg+xml;base64,${btoa(generateCharacterSVG(mbtiType, characterType))}`;
}

function generateCharacterSVG(mbtiType, characterType) {
  // 簡単なSVGキャラクター（既存のロジックを活用）
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" fill="#f0f0f0"/>
    <circle cx="100" cy="100" r="50" fill="#8B5CF6"/>
    <text x="100" y="180" text-anchor="middle" font-family="Arial" font-size="12">${mbtiType}</text>
  </svg>`;
}