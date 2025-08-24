import React, { useState, useRef, useCallback } from 'react';
import { Download, Share2, Camera, ChevronRight, Sparkles, ChevronLeft, RefreshCw } from 'lucide-react';
import PaymentModal from './components/PaymentModal';
import { CHARACTER_CODE_16_TYPES, CHARACTER_CODE_GROUPS, CHARACTER_CODE_16_QUESTIONS, calculateCharacterCode16Type } from './data/characterCode16Types';
import { AdviceService } from './services/adviceService';
import { ImageService } from './services/imageService';

// MBTIグループ別統一カラーパレット
const unifiedColorPalette = {
  // 分析家グループ（NT）- 紫系
  analysts: {
    primary: "#8B5CF6",    // バイオレット
    secondary: "#A78BFA",  // ライトバイオレット
    accent: "#6D28D9"      // ダークバイオレット
  },
  // 外交官グループ（NF）- 青緑系  
  diplomats: {
    primary: "#06B6D4",    // シアン
    secondary: "#67E8F9",  // ライトシアン
    accent: "#0891B2"      // ダークシアン
  },
  // 番人グループ（SJ）- 緑系
  sentinels: {
    primary: "#10B981",    // エメラルド
    secondary: "#6EE7B7",  // ライトエメラルド
    accent: "#059669"      // ダークエメラルド
  },
  // 探検家グループ（SP）- 黄系
  explorers: {
    primary: "#F59E0B",    // アンバー
    secondary: "#FCD34D",  // ライトアンバー
    accent: "#D97706"      // ダークアンバー
  }
};

// MBTIタイプからグループを判定
const getMBTIGroup = (mbtiType) => {
  if (['INTJ', 'INTP', 'ENTJ', 'ENTP'].includes(mbtiType)) return 'analysts';
  if (['INFJ', 'INFP', 'ENFJ', 'ENFP'].includes(mbtiType)) return 'diplomats';
  if (['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'].includes(mbtiType)) return 'sentinels';
  if (['ISTP', 'ISFP', 'ESTP', 'ESFP'].includes(mbtiType)) return 'explorers';
  return 'diplomats'; // デフォルト
};

// 印象タイプ別の形状・パターン定義（カラーは統一、形状で差別化）
const impressionStyles = {
  gentle: {
    pattern: "soft geometric circles pattern",
    polygonStyle: "soft rounded polygons",
    expression: "gentle smile",
    decoration: "circular"
  },
  natural: {
    pattern: "organic leaf pattern background",
    polygonStyle: "organic flowing polygons", 
    expression: "natural smile",
    decoration: "organic"
  },
  dynamic: {
    pattern: "sharp triangle pattern background",
    polygonStyle: "sharp angular polygons",
    expression: "confident smile", 
    decoration: "angular"
  },
  cool: {
    pattern: "hexagonal grid pattern background",
    polygonStyle: "geometric structured polygons",
    expression: "subtle expression",
    decoration: "geometric"
  }
};

// 統一されたAI画像生成プロンプト作成
const createUnifiedAIPrompt = (mbtiType, characterType) => {
  const group = getMBTIGroup(mbtiType);
  const colors = unifiedColorPalette[group];
  const style = impressionStyles[characterType];
  
  // MBTI特性マッピング
  const personalityTraits = {
    INTJ: "strategic intellectual architect",
    ENFP: "creative enthusiastic campaigner", 
    ENTJ: "commanding natural leader",
    INFJ: "insightful mysterious advocate",
    ENTP: "innovative witty debater",
    INFP: "artistic idealistic mediator",
    ENFJ: "charismatic inspiring protagonist",
    ESFP: "spontaneous entertaining performer",
    ESFJ: "caring harmonious consul",
    ESTP: "bold pragmatic entrepreneur",
    ESTJ: "efficient organized executive",
    ISFP: "gentle artistic adventurer",
    ISFJ: "nurturing protective defender",
    ISTP: "practical analytical virtuoso",
    ISTJ: "reliable methodical logistician",
    INTP: "curious logical thinker"
  };
  
  const impressionAdjectives = {
    gentle: "gentle approachable warm",
    natural: "natural authentic relaxed",
    dynamic: "dynamic charismatic energetic",
    cool: "cool sophisticated mysterious"
  };
  
  return `Low poly 3D character design, ${personalityTraits[mbtiType]} personality, 
${impressionAdjectives[characterType]} impression, exactly 3-head-body proportion,
unified color palette: ${colors.primary} primary ${colors.secondary} secondary ${colors.accent} accent colors,
${style.pattern}, ${style.polygonStyle}, center positioned character,
isometric 3/4 view angle, 150-200 polygons maximum,
soft ambient lighting with single directional light source,
matte finish no reflections, clean minimalist design,
1024x1024 square format, social media optimized,
geometric faceted style, smooth edge flow, ${style.expression}`;
};

// 外部APIからMBTI情報を取得（将来実装）
const fetchMBTIData = async (mbtiType) => {
  try {
    // 将来的なAPI統合用（現在はコメントアウト）
    // 実際のMBTI APIエンドポイント（例）
    // const response = await fetch(`https://api.16personalities.com/types/${mbtiType}`);
    // const data = await response.json();
    // return data;
    
    console.log(`Fetching MBTI data for ${mbtiType}...`);
    
    // ローカルのMBTIデータを取得
    const mbtiInfo = mbtiResults[mbtiType];
    
    if (!mbtiInfo) {
      console.warn(`MBTI type ${mbtiType} not found in local data`);
      // フォールバック：基本情報を返す
      return {
        type: mbtiType,
        name: mbtiType,
        description: `${mbtiType}タイプの特徴`,
        group: 'その他'
      };
    }
    
    // MBTIグループ情報を追加（16タイプシステムとの連携）
    const mbtiGroups = {
      'INTJ': 'analysts', 'INTP': 'analysts', 'ENTJ': 'analysts', 'ENTP': 'analysts',
      'INFJ': 'diplomats', 'INFP': 'diplomats', 'ENFJ': 'diplomats', 'ENFP': 'diplomats',
      'ISTJ': 'sentinels', 'ISFJ': 'sentinels', 'ESTJ': 'sentinels', 'ESFJ': 'sentinels',
      'ISTP': 'explorers', 'ISFP': 'explorers', 'ESTP': 'explorers', 'ESFP': 'explorers'
    };
    
    // 完全なMBTI情報を返す（16タイプシステムとの連携用）
    return {
      ...mbtiInfo,
      type: mbtiType,
      mbtiGroup: mbtiGroups[mbtiType] || 'other',
      // 16タイプシステムとの連携用データ
      compatibility: {
        withCharacterCode: true, // 16タイプCharacterCodeとの互換性
        axes: {
          EI: mbtiType[0], // E or I
          SN: mbtiType[1], // S or N  
          TF: mbtiType[2], // T or F
          JP: mbtiType[3]  // J or P
        }
      }
    };
  } catch (error) {
    console.error('Failed to fetch MBTI data:', error);
    // エラー時のフォールバック
    const fallbackData = mbtiResults[mbtiType] || {
      type: mbtiType,
      name: mbtiType,
      description: `${mbtiType}タイプ`
    };
    return fallbackData;
  }
};;

// Character Code情報を分析APIで取得（将来実装）
const analyzeCharacterCode = async (answers) => {
  try {
    // 将来的なAPI統合用（現在はコメントアウト）
    // const response = await fetch('/api/analyze-character', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ answers })
    // });
    // const data = await response.json();
    // return data;
    
    // 16タイプシステムでローカル計算
    console.log('Analyzing character code (16 types system)...', answers);
    const characterCode = calculateCharacterCode16Type(answers);
    
    // CHARACTER_CODE_16_TYPESから詳細情報を取得
    const characterInfo = CHARACTER_CODE_16_TYPES[characterCode];
    
    if (!characterInfo) {
      console.warn(`Character code ${characterCode} not found in 16 types data`);
      // フォールバック：基本情報を返す
      return {
        code: characterCode,
        name: characterCode,
        group: '特別'
      };
    }
    
    // 16タイプの完全な情報を返す
    return {
      code: characterInfo.code,
      name: characterInfo.name,
      group: characterInfo.group,
      description: characterInfo.description || '',
      traits: characterInfo.traits || '',
      // 追加の分析データ（将来の拡張用）
      axes: {
        DN: characterCode[0], // D or N
        IO: characterCode[1], // I or O
        FM: characterCode[2], // F or M
        CT: characterCode[3]  // C or T
      }
    };
  } catch (error) {
    console.error('Failed to analyze character code:', error);
    // フォールバック：デフォルトタイプを返す
    const defaultType = CHARACTER_CODE_16_TYPES.DIFT || {
      code: 'DIFT',
      name: '可愛い安心できる人',
      group: '立体的'
    };
    return defaultType;
  }
};;

// AI画像生成API（将来実装）
const generateAICharacterImage = async (mbtiType, characterType) => {
  const prompt = createUnifiedAIPrompt(mbtiType, characterType);
  
  try {
    // 実際のAI画像生成API（例：OpenAI DALL-E、Midjourney API等）
    // const response = await fetch('/api/generate-image', {
    //   method: 'POST',
    //   headers: { 
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer YOUR_API_KEY'
    //   },
    //   body: JSON.stringify({ 
    //     prompt,
    //     style: 'low-poly-3d',
    //     size: '1024x1024'
    //   })
    // });
    // const data = await response.json();
    // return data.imageUrl;
    
    // 現在はSVGを返す（将来的にAI生成画像URLを返す）
    console.log('AI Image Generation Prompt:', prompt);
    return generateEnhancedCharacterSVG(mbtiType, characterType);
  } catch (error) {
    console.error('Failed to generate AI image:', error);
    return generateEnhancedCharacterSVG(mbtiType, characterType); // フォールバック
  }
};

// MBTIグループ統一カラーを適用したSVG生成
const generateEnhancedCharacterSVG = (mbtiType, characterType) => {
  const group = getMBTIGroup(mbtiType);
  const colors = unifiedColorPalette[group];
  const style = impressionStyles[characterType];
  
  return `
    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-${group}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
          <stop offset="50%" style="stop-color:${colors.secondary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.accent};stop-opacity:1" />
        </linearGradient>
        <pattern id="bg-pattern-${characterType}" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          ${generateBackgroundPattern(characterType, colors)}
        </pattern>
      </defs>
      
      <!-- 背景パターン -->
      <rect width="200" height="200" fill="url(#bg-pattern-${characterType})" opacity="0.1"/>
      
      <!-- メインキャラクター円 -->
      <circle cx="100" cy="100" r="70" fill="url(#grad-${group})" stroke="${colors.accent}" stroke-width="3"/>
      
      <!-- 顔の特徴 -->
      <circle cx="85" cy="85" r="6" fill="${colors.accent}"/>
      <circle cx="115" cy="85" r="6" fill="${colors.accent}"/>
      
      <!-- 表情（Character Typeに応じて変化） -->
      ${generateFacialExpression(characterType, colors.accent)}
      
      <!-- MBTIラベル -->
      <rect x="60" y="160" width="80" height="25" rx="12" fill="${colors.primary}" opacity="0.9"/>
      <text x="100" y="177" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="white">${mbtiType}</text>
      
      <!-- 装飾要素 -->
      ${generateDecorationElements(characterType, colors)}
    </svg>
  `;
};

// 背景パターン生成（印象タイプ別の形状、MBTIグループの統一カラー）
const generateBackgroundPattern = (characterType, colors) => {
  switch(characterType) {
    case 'gentle':
      return `<circle cx="10" cy="10" r="3" fill="${colors.accent}" opacity="0.3"/>`;
    case 'natural':
      return `<path d="M5 10 Q10 5 15 10 Q10 15 5 10" fill="${colors.accent}" opacity="0.3"/>`;
    case 'dynamic':
      return `<polygon points="10,2 18,16 2,16" fill="${colors.accent}" opacity="0.3"/>`;
    case 'cool':
      return `<polygon points="10,0 20,5 20,15 10,20 0,15 0,5" fill="${colors.accent}" opacity="0.3"/>`;
    default:
      return `<circle cx="10" cy="10" r="2" fill="${colors.accent}" opacity="0.3"/>`;
  }
};

// 表情生成（印象タイプ別）
const generateFacialExpression = (characterType, accentColor) => {
  switch(characterType) {
    case 'gentle':
      return `<path d="M 80 110 Q 100 125 120 110" stroke="${accentColor}" stroke-width="3" fill="none"/>`;
    case 'natural':
      return `<path d="M 80 115 Q 100 125 120 115" stroke="${accentColor}" stroke-width="3" fill="none"/>`;
    case 'dynamic':
      return `<path d="M 75 110 Q 100 130 125 110" stroke="${accentColor}" stroke-width="4" fill="none"/>`;
    case 'cool':
      return `<line x1="85" y1="115" x2="115" y2="115" stroke="${accentColor}" stroke-width="3"/>`;
    default:
      return `<path d="M 80 115 Q 100 125 120 115" stroke="${accentColor}" stroke-width="3" fill="none"/>`;
  }
};

// 装飾要素生成（印象タイプ別の形状、MBTIグループの統一カラー）
const generateDecorationElements = (characterType, colors) => {
  switch(characterType) {
    case 'gentle':
      return `
        <circle cx="60" cy="60" r="4" fill="${colors.accent}" opacity="0.6"/>
        <circle cx="140" cy="140" r="4" fill="${colors.accent}" opacity="0.6"/>
      `;
    case 'natural':
      return `
        <path d="M50 50 Q55 45 60 50 Q55 55 50 50" fill="${colors.accent}" opacity="0.6"/>
        <path d="M140 150 Q145 145 150 150 Q145 155 140 150" fill="${colors.accent}" opacity="0.6"/>
      `;
    case 'dynamic':
      return `
        <polygon points="50,40 60,60 40,60" fill="${colors.accent}" opacity="0.7"/>
        <polygon points="150,140 160,160 140,160" fill="${colors.accent}" opacity="0.7"/>
      `;
    case 'cool':
      return `
        <polygon points="50,50 60,45 60,55 50,60 40,55 40,45" fill="${colors.accent}" opacity="0.6"/>
        <polygon points="150,150 160,145 160,155 150,160 140,155 140,145" fill="${colors.accent}" opacity="0.6"/>
      `;
    default:
      return '';
  }
};

// 肩書き生成ロジック（全16タイプ対応）
const generateTitle = (mbtiType, characterCode) => {
  // 256通り完全定義のMBTI×CharacterCode組み合わせタイトル
  const all256Titles = {
    INTJ: {
      'DOFC': "信頼できる戦略家",
      'DOFT': "華やかな建築家", 
      'DOMC': "統率力のある革新者",
      'DOMT': "温かい完璧主義者",
      'DIFC': "上品な洞察家",
      'NIMC': "純粋な理想家",
      'DIMC': "初々しい天才",
      'NIFC': "都会的な戦略家",
      'NOMC': "神秘的な建築家",
      'DIMT': "意外性のある革新者", 
      'DIFT': "可愛い理論家",
      'NOFC': "個性的な完璧主義者",
      'NIMT': "芸術的な戦略家",
      'NIFT': "自由な建築家",
      'NOFT': "情熱的な革新者",
      'NOMT': "華やかな理論家"
    },
    INTP: {
      'DOFC': "信頼できる論理学者",
      'DOFT': "華やかな創造家",
      'DOMC': "統率力のある思考家", 
      'DOMT': "温かい好奇心家",
      'DIFC': "上品な論理家",
      'NIMC': "純粋な探求者",
      'DIMC': "初々しい天才肌",
      'NIFC': "都会的な思考家",
      'NOMC': "神秘的な論理学者",
      'DIMT': "意外性のある創造家",
      'DIFT': "可愛い理論家",
      'NOFC': "個性的な探求者",
      'NIMT': "芸術的な論理家",
      'NIFT': "自由な思考家", 
      'NOFT': "情熱的な創造家",
      'NOMT': "華やかな探求者"
    },
    ENTJ: {
      'DOFC': "信頼できる指揮官",
      'DOFT': "華やかなリーダー",
      'DOMC': "統率力のある幹部",
      'DOMT': "温かい指導者",
      'DIFC': "上品な経営者", 
      'NIMC': "純粋な理想家",
      'DIMC': "初々しいリーダー",
      'NIFC': "都会的な指揮官",
      'NOMC': "神秘的な経営者",
      'DIMT': "意外性のあるリーダー",
      'DIFT': "可愛い指導者",
      'NOFC': "個性的な指揮官",
      'NIMT': "芸術的な経営者",
      'NIFT': "自由なリーダー",
      'NOFT': "情熱的な指導者", 
      'NOMT': "華やかな指揮官"
    },
    ENTP: {
      'DOFC': "信頼できる討論者",
      'DOFT': "華やかな革新者",
      'DOMC': "統率力のある発明家",
      'DOMT': "温かいアイデアマン",
      'DIFC': "上品な創造家",
      'NIMC': "純粋な夢想家",
      'DIMC': "初々しい革新者", 
      'NIFC': "都会的な討論者",
      'NOMC': "神秘的な創造家",
      'DIMT': "意外性のある発明家",
      'DIFT': "可愛いアイデアマン",
      'NOFC': "個性的な討論者",
      'NIMT': "芸術的な創造家",
      'NIFT': "自由な革新者",
      'NOFT': "情熱的な発明家",
      'NOMT': "華やかなアイデアマン"
    },
    INFJ: {
      'DOFC': "信頼できる提唱者",
      'DOFT': "華やかな理想家",
      'DOMC': "統率力のある洞察家",
      'DOMT': "温かい献身家",
      'DIFC': "上品な理想主義者",
      'NIMC': "純粋な夢見人",
      'DIMC': "初々しい提唱者",
      'NIFC': "都会的な洞察家", 
      'NOMC': "神秘的な理想家",
      'DIMT': "意外性のある献身家",
      'DIFT': "可愛い癒し手",
      'NOFC': "個性的な提唱者",
      'NIMT': "芸術的な理想主義者",
      'NIFT': "自由な夢見人",
      'NOFT': "情熱的な洞察家",
      'NOMT': "華やかな献身家"
    },
    INFP: {
      'DOFC': "信頼できる仲介者",
      'DOFT': "華やかな芸術家",
      'DOMC': "統率力のある理想家",
      'DOMT': "温かい創造家",
      'DIFC': "上品な芸術家",
      'NIMC': "純粋な詩人",
      'DIMC': "初々しい仲介者",
      'NIFC': "都会的な創造家",
      'NOMC': "神秘的な芸術家", 
      'DIMT': "意外性のある理想家",
      'DIFT': "可愛い詩人",
      'NOFC': "個性的な仲介者",
      'NIMT': "芸術的な創造家",
      'NIFT': "自由な詩人",
      'NOFT': "情熱的な芸術家",
      'NOMT': "華やかな理想家"
    },
    ENFJ: {
      'DOFC': "信頼できる主人公",
      'DOFT': "華やかな指導者",
      'DOMC': "統率力のある教育者",
      'DOMT': "温かいカウンセラー",
      'DIFC': "上品なメンター",
      'NIMC': "純粋な理想家",
      'DIMC': "初々しい主人公",
      'NIFC': "都会的な指導者",
      'NOMC': "神秘的なメンター",
      'DIMT': "意外性のある教育者",
      'DIFT': "可愛いカウンセラー",
      'NOFC': "個性的な主人公", 
      'NIMT': "芸術的なメンター",
      'NIFT': "自由な指導者",
      'NOFT': "情熱的な教育者",
      'NOMT': "華やかなカウンセラー"
    },
    ENFP: {
      'DOFC': "信頼できる運動家",
      'DOFT': "華やかなエンターテイナー",
      'DOMC': "統率力のある活動家",
      'DOMT': "温かいムードメーカー",
      'DIFC': "上品なクリエイター",
      'NIMC': "純粋な夢追い人",
      'DIMC': "初々しい運動家", 
      'NIFC': "都会的なエンターテイナー",
      'NOMC': "神秘的なクリエイター",
      'DIMT': "意外性のある活動家",
      'DIFT': "可愛いムードメーカー",
      'NOFC': "個性的な運動家",
      'NIMT': "芸術的なクリエイター",
      'NIFT': "自由な夢追い人",
      'NOFT': "情熱的なエンターテイナー",
      'NOMT': "華やかな活動家"
    },
    ISTJ: {
      'DOFC': "信頼できる管理者",
      'DOFT': "華やかな責任者",
      'DOMC': "統率力のある実務家",
      'DOMT': "温かい世話役",
      'DIFC': "上品な管理者",
      'NIMC': "純粋な職人",
      'DIMC': "初々しい責任者",
      'NIFC': "都会的な実務家",
      'NOMC': "神秘的な管理者",
      'DIMT': "意外性のある責任者",
      'DIFT': "可愛い世話役",
      'NOFC': "個性的な職人",
      'NIMT': "芸術的な管理者", 
      'NIFT': "自由な責任者",
      'NOFT': "情熱的な実務家",
      'NOMT': "華やかな世話役"
    },
    ISFJ: {
      'DOFC': "信頼できる擁護者",
      'DOFT': "華やかな世話役",
      'DOMC': "統率力のあるサポーター",
      'DOMT': "温かい癒し手",
      'DIFC': "上品な世話役",
      'NIMC': "純粋な守護者",
      'DIMC': "初々しい擁護者",
      'NIFC': "都会的なサポーター",
      'NOMC': "神秘的な世話役",
      'DIMT': "意外性のある守護者",
      'DIFT': "可愛い癒し手",
      'NOFC': "個性的な擁護者",
      'NIMT': "芸術的な世話役",
      'NIFT': "自由なサポーター",
      'NOFT': "情熱的な守護者",
      'NOMT': "華やかな癒し手"
    },
    ESTJ: {
      'DOFC': "信頼できる幹部",
      'DOFT': "華やかな管理職",
      'DOMC': "統率力のある責任者",
      'DOMT': "温かいリーダー",
      'DIFC': "上品な幹部",
      'NIMC': "純粋な指導者",
      'DIMC': "初々しい管理職",
      'NIFC': "都会的な責任者",
      'NOMC': "神秘的な幹部",
      'DIMT': "意外性のある指導者", 
      'DIFT': "可愛いリーダー",
      'NOFC': "個性的な管理職",
      'NIMT': "芸術的な幹部",
      'NIFT': "自由な責任者",
      'NOFT': "情熱的な指導者",
      'NOMT': "華やかなリーダー"
    },
    ESFJ: {
      'DOFC': "信頼できる領事",
      'DOFT': "華やかなホスト",
      'DOMC': "統率力のあるお世話係",
      'DOMT': "温かい仲裁者",
      'DIFC': "上品なホスト",
      'NIMC': "純粋な世話好き", 
      'DIMC': "初々しい領事",
      'NIFC': "都会的なお世話係",
      'NOMC': "神秘的なホスト",
      'DIMT': "意外性のある世話好き",
      'DIFT': "可愛い仲裁者",
      'NOFC': "個性的な領事",
      'NIMT': "芸術的なホスト",
      'NIFT': "自由なお世話係",
      'NOFT': "情熱的な世話好き",
      'NOMT': "華やかな仲裁者"
    },
    ISTP: {
      'DOFC': "信頼できる巨匠",
      'DOFT': "華やかな職人",
      'DOMC': "統率力のある実務家",
      'DOMT': "温かい技術者",
      'DIFC': "上品な職人",
      'NIMC': "純粋な巨匠",
      'DIMC': "初々しい実務家",
      'NIFC': "都会的な技術者",
      'NOMC': "神秘的な巨匠",
      'DIMT': "意外性のある職人",
      'DIFT': "可愛い技術者",
      'NOFC': "個性的な実務家", 
      'NIMT': "芸術的な巨匠",
      'NIFT': "自由な職人",
      'NOFT': "情熱的な技術者",
      'NOMT': "華やかな実務家"
    },
    ISFP: {
      'DOFC': "信頼できる冒険家",
      'DOFT': "華やかなアーティスト",
      'DOMC': "統率力のある自由人",
      'DOMT': "温かい芸術家",
      'DIFC': "上品なアーティスト",
      'NIMC': "純粋な芸術家",
      'DIMC': "初々しい冒険家",
      'NIFC': "都会的な自由人",
      'NOMC': "神秘的なアーティスト",
      'DIMT': "意外性のある芸術家",
      'DIFT': "可愛い自由人",
      'NOFC': "個性的な冒険家",
      'NIMT': "芸術的な創造家",
      'NIFT': "自由な芸術家", 
      'NOFT': "情熱的なアーティスト",
      'NOMT': "華やかな冒険家"
    },
    ESTP: {
      'DOFC': "信頼できる起業家",
      'DOFT': "華やかなエンターテイナー",
      'DOMC': "統率力のある行動家",
      'DOMT': "温かいムードメーカー",
      'DIFC': "上品なエンターテイナー",
      'NIMC': "純粋な自由人",
      'DIMC': "初々しい起業家",
      'NIFC': "都会的な行動家",
      'NOMC': "神秘的なエンターテイナー",
      'DIMT': "意外性のある自由人",
      'DIFT': "可愛いムードメーカー",
      'NOFC': "個性的な起業家",
      'NIMT': "芸術的なエンターテイナー",
      'NIFT': "自由な行動家",
      'NOFT': "情熱的な自由人",
      'NOMT': "華やかなムードメーカー"
    },
    ESFP: {
      'DOFC': "信頼できるエンターテイナー",
      'DOFT': "華やかなパフォーマー",
      'DOMC': "統率力のある盛り上げ役",
      'DOMT': "温かい楽しい人",
      'DIFC': "上品なパフォーマー",
      'NIMC': "純粋な自由人",
      'DIMC': "初々しいエンターテイナー", 
      'NIFC': "都会的な盛り上げ役",
      'NOMC': "神秘的なパフォーマー",
      'DIMT': "意外性のある自由人",
      'DIFT': "可愛い楽しい人",
      'NOFC': "個性的なエンターテイナー",
      'NIMT': "芸術的なパフォーマー",
      'NIFT': "自由な盛り上げ役",
      'NOFT': "情熱的な自由人",
      'NOMT': "華やかな楽しい人"
    }
  };
  
  // 256通り完全対応
  const title = all256Titles[mbtiType]?.[characterCode];
  
  // フォールバック（念のため）
  if (!title) {
    const mbtiName = mbtiResults[mbtiType]?.name || mbtiType;
    const characterName = CHARACTER_CODE_16_TYPES[characterCode]?.name || characterCode;
    return `${mbtiName}×${characterName}`;
  }
  
  return title;
};;;

// MBTI診断の質問データ（28問 - 各軸7問）
const mbtiQuestions = [
  // E/I軸（外向/内向）
  {
    question: "パーティーで疲れた時、どちらを選びますか？",
    options: [
      { text: "一人になって静かに過ごす", type: "I" },
      { text: "友達ともっと話して元気になる", type: "E" }
    ]
  },
  {
    question: "新しい環境に入った時、あなたは？",
    options: [
      { text: "積極的に多くの人と話しかける", type: "E" },
      { text: "まずは様子を見て、少数の人と深く話す", type: "I" }
    ]
  },
  {
    question: "アイデアを思いついた時、どうしますか？",
    options: [
      { text: "すぐに人に話して意見を聞く", type: "E" },
      { text: "まず一人でじっくり考えてから話す", type: "I" }
    ]
  },
  {
    question: "休日の理想的な過ごし方は？",
    options: [
      { text: "友人たちと外出して活動的に過ごす", type: "E" },
      { text: "家で読書や趣味など静かに過ごす", type: "I" }
    ]
  },
  {
    question: "会議で発言する時は？",
    options: [
      { text: "思いついたらすぐに発言する", type: "E" },
      { text: "考えをまとめてから慎重に発言する", type: "I" }
    ]
  },
  {
    question: "電話とメール、どちらが好きですか？",
    options: [
      { text: "直接話せる電話の方が良い", type: "E" },
      { text: "じっくり考えて書けるメールが良い", type: "I" }
    ]
  },
  {
    question: "ストレス解消法として選ぶのは？",
    options: [
      { text: "友人と話したり外に出かける", type: "E" },
      { text: "一人の時間を作ってリラックスする", type: "I" }
    ]
  },

  // S/N軸（感覚/直観）
  {
    question: "新しいことを学ぶ時、どちらが好きですか？",
    options: [
      { text: "具体的な事実やデータから学ぶ", type: "S" },
      { text: "可能性やアイデアから学ぶ", type: "N" }
    ]
  },
  {
    question: "本を読む時、どちらに惹かれますか？",
    options: [
      { text: "実用的で役立つハウツー本", type: "S" },
      { text: "想像力を刺激するファンタジー小説", type: "N" }
    ]
  },
  {
    question: "旅行の計画を立てる時は？",
    options: [
      { text: "詳細なスケジュールと具体的な場所を決める", type: "S" },
      { text: "大まかな方向性だけ決めて冒険を楽しむ", type: "N" }
    ]
  },
  {
    question: "仕事で重視するのは？",
    options: [
      { text: "確実で実績のある方法", type: "S" },
      { text: "革新的で創造的なアプローチ", type: "N" }
    ]
  },
  {
    question: "話をする時、どちらが多いですか？",
    options: [
      { text: "具体的な出来事や事実について", type: "S" },
      { text: "アイデアや可能性について", type: "N" }
    ]
  },
  {
    question: "問題解決のアプローチは？",
    options: [
      { text: "過去の経験や実例を参考にする", type: "S" },
      { text: "新しい視点や斬新な方法を考える", type: "N" }
    ]
  },
  {
    question: "芸術作品を見る時、注目するのは？",
    options: [
      { text: "技法や細部の精密さ", type: "S" },
      { text: "作品全体の意味やメッセージ", type: "N" }
    ]
  },

  // T/F軸（思考/感情）
  {
    question: "重要な決断をする時、何を重視しますか？",
    options: [
      { text: "論理的な分析と客観的事実", type: "T" },
      { text: "人への影響と価値観", type: "F" }
    ]
  },
  {
    question: "友人が悩みを相談してきた時は？",
    options: [
      { text: "客観的な解決策やアドバイスを提供", type: "T" },
      { text: "まず気持ちに寄り添い共感する", type: "F" }
    ]
  },
  {
    question: "批判を受けた時の反応は？",
    options: [
      { text: "内容が正しいかどうかを論理的に検証", type: "T" },
      { text: "相手の気持ちや背景を理解しようとする", type: "F" }
    ]
  },
  {
    question: "チームでの役割として得意なのは？",
    options: [
      { text: "効率的なシステムや手順を作る", type: "T" },
      { text: "メンバー間の調和を保つ", type: "F" }
    ]
  },
  {
    question: "映画を選ぶ基準は？",
    options: [
      { text: "脚本の論理性やストーリー構成", type: "T" },
      { text: "感動的なストーリーやキャラクターの魅力", type: "F" }
    ]
  },
  {
    question: "議論になった時、あなたは？",
    options: [
      { text: "論点を整理し客観的な判断を求める", type: "T" },
      { text: "全員が納得できる妥協点を探す", type: "F" }
    ]
  },
  {
    question: "職場で最も大切だと思うのは？",
    options: [
      { text: "能力主義と公正な評価", type: "T" },
      { text: "人間関係と働きやすい雰囲気", type: "F" }
    ]
  },

  // J/P軸（判断/知覚）
  {
    question: "日常生活では、どちらが好きですか？",
    options: [
      { text: "計画を立てて決まったスケジュール", type: "J" },
      { text: "柔軟性があり自由な状況", type: "P" }
    ]
  },
  {
    question: "プロジェクトの進め方は？",
    options: [
      { text: "期限前に余裕を持って完成させる", type: "J" },
      { text: "期限ギリギリまで改善し続ける", type: "P" }
    ]
  },
  {
    question: "買い物に行く時は？",
    options: [
      { text: "事前にリストを作って計画的に", type: "J" },
      { text: "その場の気分で必要なものを選ぶ", type: "P" }
    ]
  },
  {
    question: "変更や予定変更に対しては？",
    options: [
      { text: "できるだけ避けたい、計画通りが良い", type: "J" },
      { text: "柔軟に対応、変化を楽しむ", type: "P" }
    ]
  },
  {
    question: "部屋の状態は？",
    options: [
      { text: "いつも整理整頓されている", type: "J" },
      { text: "多少散らかっていても気にならない", type: "P" }
    ]
  },
  {
    question: "新しい情報を得た時は？",
    options: [
      { text: "すぐに結論を出して行動に移す", type: "J" },
      { text: "さらに情報を集めて選択肢を広げる", type: "P" }
    ]
  },
  {
    question: "締切がある作業では？",
    options: [
      { text: "早めに取りかかってコツコツ進める", type: "J" },
      { text: "締切が近づいてから集中的に取り組む", type: "P" }
    ]
  }
];

// 旧Character Code診断の質問（現在は新16タイプシステムを使用）
// 以下のコードは16タイプシステム移行のため削除予定
const legacyCharacterQuestions = [
  {
    question: "初対面の人と話す時、どう感じることが多いですか？",
    options: [
      { text: "緊張するが、相手に合わせようとする", type: "gentle" },
      { text: "自然体で、ありのままでいる", type: "natural" },
      { text: "相手を引っ張って話をリードする", type: "dynamic" },
      { text: "クールに距離を保ちながら様子を見る", type: "cool" }
    ]
  },
  {
    question: "写真を撮られる時、どんな表情になりやすいですか？",
    options: [
      { text: "自然な笑顔", type: "gentle" },
      { text: "リラックスした表情", type: "natural" },
      { text: "印象的なポーズ", type: "dynamic" },
      { text: "クールで落ち着いた表情", type: "cool" }
    ]
  },
  {
    question: "グループの中での自分の立ち位置は？",
    options: [
      { text: "みんなを支えるサポート役", type: "gentle" },
      { text: "自然体でマイペース", type: "natural" },
      { text: "場を盛り上げるムードメーカー", type: "dynamic" },
      { text: "一歩引いて全体を見る観察者", type: "cool" }
    ]
  },
  {
    question: "ファッションで重視するのは？",
    options: [
      { text: "着心地が良く、相手に不快感を与えない", type: "gentle" },
      { text: "自分らしく、無理のないスタイル", type: "natural" },
      { text: "印象的で、人の目を引くアイテム", type: "dynamic" },
      { text: "洗練されていて、上品な印象", type: "cool" }
    ]
  },
  {
    question: "人から話しかけられた時の反応は？",
    options: [
      { text: "相手の気持ちを汲み取って優しく応答", type: "gentle" },
      { text: "素直に自分の気持ちを表現", type: "natural" },
      { text: "エネルギッシュに会話を広げる", type: "dynamic" },
      { text: "落ち着いて知的な会話を心がける", type: "cool" }
    ]
  },
  {
    question: "困っている人を見かけた時は？",
    options: [
      { text: "そっと寄り添ってサポートする", type: "gentle" },
      { text: "自然な流れで手助けする", type: "natural" },
      { text: "積極的に声をかけて助ける", type: "dynamic" },
      { text: "状況を分析してから適切に対応", type: "cool" }
    ]
  },
  {
    question: "自分の意見を伝える時は？",
    options: [
      { text: "相手を傷つけないよう配慮して", type: "gentle" },
      { text: "ありのままの気持ちを素直に", type: "natural" },
      { text: "情熱的で説得力のある話し方で", type: "dynamic" },
      { text: "論理的で冷静な説明で", type: "cool" }
    ]
  },
  {
    question: "失敗した時の対応は？",
    options: [
      { text: "周りに迷惑をかけたことを謝る", type: "gentle" },
      { text: "素直に失敗を認めて学ぼうとする", type: "natural" },
      { text: "前向きに次への挑戦として捉える", type: "dynamic" },
      { text: "冷静に原因を分析して改善策を考える", type: "cool" }
    ]
  },
  {
    question: "パーティーなどの社交場では？",
    options: [
      { text: "一人一人と深く話そうとする", type: "gentle" },
      { text: "気の合う人とリラックスして過ごす", type: "natural" },
      { text: "積極的に多くの人と交流する", type: "dynamic" },
      { text: "少数の興味深い人と質の高い会話をする", type: "cool" }
    ]
  },
  {
    question: "ストレスを感じている時の外見の変化は？",
    options: [
      { text: "表情が不安そうになり、周りに気を遣う", type: "gentle" },
      { text: "いつもより静かになるが、態度は変わらない", type: "natural" },
      { text: "いつもよりテンションが上がったり下がったり", type: "dynamic" },
      { text: "表情に出さず、より冷静になろうとする", type: "cool" }
    ]
  },
  {
    question: "好きなことについて話す時は？",
    options: [
      { text: "相手が興味を持ってくれるか気にしながら", type: "gentle" },
      { text: "自然に楽しさが伝わるように", type: "natural" },
      { text: "熱く語って相手を巻き込む", type: "dynamic" },
      { text: "知的で深い内容を落ち着いて伝える", type: "cool" }
    ]
  },
  {
    question: "第一印象で与えたい印象は？",
    options: [
      { text: "親しみやすく、安心できる人", type: "gentle" },
      { text: "自然体で、等身大の自分", type: "natural" },
      { text: "エネルギッシュで、魅力的な人", type: "dynamic" },
      { text: "知的で、洗練された人", type: "cool" }
    ]
  }
];

// MBTI結果データ（詳細版）
const mbtiResults = {
  ENFP: { 
    name: "広報運動家", 
    description: "情熱的で創造的、社交的でオープンマインド",
    traits: ["エネルギッシュ", "創造的", "社交的", "楽観的", "柔軟性"],
    strengths: ["人とのつながりを作るのが得意", "新しいアイデアを生み出す", "他者を励ます"],
    challenges: ["計画の実行が苦手", "ルーティンワークが嫌い", "批判に敏感"],
    axes: {
      e_i: 'E',
      s_n: 'N',
      t_f: 'F',
      j_p: 'P'
    },
    characteristics: ["情熱的", "創造的", "社交的", "楽観的", "自由奔放"],
    firstImpression: "エネルギッシュで創造的な雰囲気を持ち、新しいアイデアと可能性に満ちた魅力的な人として映ります。",
    situations: {
      work: "革新的なアイデアと熱意でチームを活性化させ、創造的なプロジェクトで力を発揮する",
      social: "社交的でオープンな性格により、多様な人脈を築き、パーティーの中心人物になる",
      romance: "情熱的で創造的な恋愛を好み、パートナーと新しい体験を共有することを楽しむ"
    },
    percentage: 8.1
  },
  ENFJ: { 
    name: "主人公", 
    description: "カリスマ性があり、人を鼓舞する天性のリーダー",
    traits: ["協調性", "洞察力", "責任感", "情熱的", "説得力"],
    strengths: ["他者の成長を支援", "組織をまとめる", "将来のビジョンを示す"],
    challenges: ["自分を犠牲にしがち", "批判されると落ち込む", "完璧主義"],
    axes: {
      e_i: 'E',
      s_n: 'N',
      t_f: 'F',
      j_p: 'J'
    },
    characteristics: ["カリスマ的", "洞察力", "責任感", "情熱的", "リーダー"],
    firstImpression: "カリスマ性と温かさを兼ね備え、人々を自然に導く生まれながらのリーダーとして映ります。",
    situations: {
      work: "チームをまとめ、メンバーの成長を支援しながら、組織の目標達成に貢献する",
      social: "人々の感情を理解し、グループの調和を保ちながら、みんなを励まし支える存在",
      romance: "パートナーの成長と幸せを最優先に考え、深い感情的なつながりを大切にする"
    },
    percentage: 2.5
  },
  ENTP: { 
    name: "討論者", 
    description: "賢くて好奇心旺盛、新しいアイデアを愛する",
    traits: ["論理的", "革新的", "機知に富む", "独立的", "知的"],
    strengths: ["問題解決が得意", "新しい視点を提供", "議論を楽しむ"],
    challenges: ["詳細に注意を払うのが苦手", "感情より論理を重視", "計画の実行が苦手"],
    axes: {
      e_i: 'E',
      s_n: 'N',
      t_f: 'T',
      j_p: 'P'
    },
    characteristics: ["論理的", "革新的", "機知に富む", "独立的", "挑戦的"],
    firstImpression: "知的で機知に富み、新しいアイデアや視点で人々を刺激する革新的な思考家として映ります。",
    situations: {
      work: "複雑な問題を独創的な方法で解決し、チームに新しい視点と革新的なアイデアを提供する",
      social: "知的な議論を楽しみ、ユーモアと洞察力で人々を魅了し、刺激的な会話を生み出す",
      romance: "知的で刺激的な関係を求め、パートナーと深い議論や新しい体験を共有することを楽しむ"
    },
    percentage: 3.2
  },
  ENTJ: { 
    name: "指揮官", 
    description: "大胆で想像力豊か、強い意志を持つ指導者",
    traits: ["決断力", "組織力", "戦略的", "効率的", "自信"],
    strengths: ["長期計画を立てる", "組織を効率化", "目標達成への推進力"],
    challenges: ["感情を軽視しがち", "せっかち", "批判に対して厳しい"],
    axes: {
      e_i: 'E',
      s_n: 'N',
      t_f: 'T',
      j_p: 'J'
    },
    characteristics: ["決断力", "戦略的", "効率的", "自信", "指導力"],
    firstImpression: "強い意志と決断力を持ち、目標達成に向けて組織を導く生まれながらの指導者として映ります。",
    situations: {
      work: "戦略的思考で組織を効率化し、明確なビジョンを持って目標達成へとチームを導く",
      social: "自信と決断力で人々を引きつけ、リーダーシップを発揮して集団を導く存在",
      romance: "パートナーシップにおいても明確な目標を持ち、関係を効率的に深めていく"
    },
    percentage: 1.8
  },
  ESFP: { 
    name: "エンターテイナー", 
    description: "自発的でエネルギッシュ、熱心で友好的",
    traits: ["社交的", "陽気", "実用的", "協調的", "現実的"],
    strengths: ["人を元気づける", "チームワークを重視", "現在を楽しむ"],
    challenges: ["長期計画が苦手", "批判に敏感", "集中力の維持が困難"],
    axes: {
      e_i: 'E',
      s_n: 'S',
      t_f: 'F',
      j_p: 'P'
    },
    characteristics: ["陽気", "社交的", "現実的", "楽観的", "エンターテイナー"],
    firstImpression: "明るく陽気な雰囲気で、周りの人々を自然に楽しませる生まれながらのエンターテイナーとして映ります。",
    situations: {
      work: "明るい雰囲気でチームを活気づけ、実践的なアプローチで問題を解決する",
      social: "パーティーの中心となり、その場の雰囲気を盛り上げ、みんなを楽しませる存在",
      romance: "楽しく情熱的な恋愛を好み、パートナーと今この瞬間を最大限に楽しむ"
    },
    percentage: 8.5
  },
  ESFJ: { 
    name: "領事", 
    description: "非常に思いやりがあり、社交的で人気者",
    traits: ["思いやり", "責任感", "協調性", "実用的", "献身的"],
    strengths: ["他者のニーズを理解", "調和を重視", "サポートに長ける"],
    challenges: ["批判に敏感", "変化を嫌う", "自分の意見を言うのが苦手"],
    axes: {
      e_i: 'E',
      s_n: 'S',
      t_f: 'F',
      j_p: 'J'
    },
    characteristics: ["思いやり", "責任感", "協調的", "実用的", "献身的"],
    firstImpression: "温かく思いやりがあり、人々のニーズを察して支援する頼りになる存在として映ります。",
    situations: {
      work: "チームの調和を保ちながら、メンバーをサポートし、組織の安定に貢献する",
      social: "思いやりと気配りで人々を支え、グループの結束を強める中心的存在",
      romance: "パートナーのニーズを最優先に考え、安定した温かい関係を築くことを大切にする"
    },
    percentage: 12.3
  },
  ESTP: { 
    name: "起業家", 
    description: "賢くてエネルギッシュ、非常に知覚力がある",
    traits: ["行動力", "現実的", "適応力", "社交的", "楽観的"],
    strengths: ["臨機応変に対応", "危機管理能力", "人との関係構築"],
    challenges: ["長期計画が苦手", "詳細への注意不足", "感情より行動を重視"],
    axes: {
      e_i: 'E',
      s_n: 'S',
      t_f: 'T',
      j_p: 'P'
    },
    characteristics: ["行動的", "現実的", "適応力", "社交的", "冒険的"],
    firstImpression: "行動力とエネルギーに満ち、どんな状況でも素早く対応できる実践的な問題解決者として映ります。",
    situations: {
      work: "素早い判断と実行力で問題を解決し、危機的状況でも冷静に対処する",
      social: "活動的で冒険的な性格により、エキサイティングな体験を共有できる仲間として人気",
      romance: "刺激的で冒険的な恋愛を好み、パートナーとアクティブな体験を楽しむ"
    },
    percentage: 4.3
  },
  ESTJ: { 
    name: "幹部", 
    description: "優秀な管理者、物事を管理することに長けている",
    traits: ["責任感", "組織力", "実用的", "決断力", "伝統的"],
    strengths: ["効率的な管理", "計画の実行", "秩序の維持"],
    challenges: ["変化への抵抗", "感情を軽視しがち", "柔軟性に欠ける"],
    axes: {
      e_i: 'E',
      s_n: 'S',
      t_f: 'T',
      j_p: 'J'
    },
    characteristics: ["責任感", "組織的", "実用的", "決断力", "効率的"],
    firstImpression: "責任感と組織力を持ち、物事を効率的に管理する信頼できるリーダーとして映ります。",
    situations: {
      work: "明確な計画と効率的な管理で組織を運営し、目標達成に向けて着実に前進させる",
      social: "リーダーシップと責任感で集団をまとめ、秩序ある環境を作り出す",
      romance: "安定した関係を築き、パートナーとの約束や責任を重視する誠実な姿勢を示す"
    },
    percentage: 8.7
  },
  INFP: { 
    name: "仲介者", 
    description: "詩人肌で親切、利他的で常に大義を支援",
    traits: ["理想主義", "創造的", "独立的", "適応力", "価値観重視"],
    strengths: ["深い共感力", "創造的思考", "個人の価値を尊重"],
    challenges: ["批判に敏感", "現実逃避しがち", "決断を先延ばし"],
    axes: {
      e_i: 'I',
      s_n: 'N',
      t_f: 'F',
      j_p: 'P'
    },
    characteristics: ["理想主義", "創造的", "共感的", "独立的", "詩的"],
    firstImpression: "静かながら深い感受性を持ち、独自の価値観と創造性を大切にする芸術家のような人として映ります。",
    situations: {
      work: "創造的なプロジェクトや意義ある仕事に情熱を注ぎ、独自の視点で貢献する",
      social: "深い一対一の関係を好み、価値観を共有できる少数の親しい友人を大切にする",
      romance: "深い精神的なつながりを求め、理想的で意味のある恋愛関係を築くことを重視する"
    },
    percentage: 4.4
  },
  INFJ: { 
    name: "提唱者", 
    description: "創造的で洞察力があり、原則と誠実さに動機づけられる",
    traits: ["洞察力", "理想主義", "決断力", "独立的", "完璧主義"],
    strengths: ["他者を深く理解", "長期ビジョン", "強い価値観"],
    challenges: ["完璧主義すぎる", "批判に敏感", "燃え尽きやすい"],
    axes: {
      e_i: 'I',
      s_n: 'N',
      t_f: 'F',
      j_p: 'J'
    },
    characteristics: ["洞察力", "理想主義", "神秘的", "決断力", "ビジョナリー"],
    firstImpression: "静かながら強い意志を持ち、深い洞察力と理想を追求する神秘的な存在として映ります。",
    situations: {
      work: "長期的なビジョンと深い洞察力で、意義ある変化をもたらすプロジェクトに取り組む",
      social: "少数の深い関係を大切にし、意味のある会話と精神的なつながりを求める",
      romance: "深い精神的・感情的なつながりを重視し、パートナーと意義ある関係を築く"
    },
    percentage: 1.5
  },
  INTP: { 
    name: "論理学者", 
    description: "革新的な発明家、知識への飽くなき探求心",
    traits: ["論理的", "分析的", "独立的", "客観的", "知的好奇心"],
    strengths: ["論理的思考", "問題解決", "新しい理論を構築"],
    challenges: ["感情の理解が苦手", "実行力不足", "社交性に欠ける"],
    axes: {
      e_i: 'I',
      s_n: 'N',
      t_f: 'T',
      j_p: 'P'
    },
    characteristics: ["論理的", "分析的", "独立的", "知的", "理論的"],
    firstImpression: "静かながら鋭い知性を持ち、複雑な問題を論理的に分析する思考家として映ります。",
    situations: {
      work: "複雑な理論や問題を分析し、革新的な解決策を見出す研究者的な役割で力を発揮",
      social: "知的な議論を好み、同じく深い思考を楽しむ少数の仲間との交流を重視",
      romance: "知的な刺激と独立性を重視し、パートナーと深い思考を共有することを楽しむ"
    },
    percentage: 3.3
  },
  INTJ: { 
    name: "建築家", 
    description: "想像力豊かで戦略的、すべてに計画を立てる",
    traits: ["戦略的", "独立的", "決断力", "論理的", "ビジョン"],
    strengths: ["長期戦略", "システム思考", "効率性の追求"],
    challenges: ["感情を軽視しがち", "批判に厳しい", "社交性に欠ける"],
    axes: {
      e_i: 'I',
      s_n: 'N',
      t_f: 'T',
      j_p: 'J'
    },
    characteristics: ["戦略的", "独立的", "決断力", "ビジョナリー", "効率的"],
    firstImpression: "冷静で戦略的な思考を持ち、長期的なビジョンを実現する能力を持つ知的なリーダーとして映ります。",
    situations: {
      work: "戦略的思考と長期計画で複雑なプロジェクトを成功に導く、独立した専門家として活躍",
      social: "少数の知的な仲間との深い交流を好み、表面的な社交は避ける傾向がある",
      romance: "知的で独立したパートナーシップを求め、効率的で意味のある関係を築く"
    },
    percentage: 2.1
  },
  ISFP: { 
    name: "冒険家", 
    description: "柔軟でチャーミング、常に新しい可能性を探求",
    traits: ["芸術的", "柔軟性", "思いやり", "現実的", "価値観重視"],
    strengths: ["創造的表現", "他者への共感", "美的センス"],
    challenges: ["計画性に欠ける", "批判に敏感", "競争を嫌う"],
    axes: {
      e_i: 'I',
      s_n: 'S',
      t_f: 'F',
      j_p: 'P'
    },
    characteristics: ["芸術的", "柔軟", "思いやり", "控えめ", "感性豊か"],
    firstImpression: "静かで控えめながら、豊かな感性と芸術的なセンスを持つ優しい人として映ります。",
    situations: {
      work: "創造的で実践的な仕事を好み、自分の価値観に合った環境で静かに貢献する",
      social: "親しい友人との小さな集まりを好み、深い感情的なつながりを大切にする",
      romance: "優しく思いやりのある関係を築き、パートナーとの静かで深い愛情を育む"
    },
    percentage: 8.8
  },
  ISFJ: { 
    name: "擁護者", 
    description: "非常に献身的で温かい、常に愛する人を守る準備ができている",
    traits: ["献身的", "責任感", "思いやり", "実用的", "協調性"],
    strengths: ["他者のサポート", "詳細への注意", "調和の維持"],
    challenges: ["自己主張が苦手", "変化を嫌う", "過度に自分を犠牲にする"],
    axes: {
      e_i: 'I',
      s_n: 'S',
      t_f: 'F',
      j_p: 'J'
    },
    characteristics: ["献身的", "責任感", "思いやり", "実用的", "保護的"],
    firstImpression: "静かで控えめながら、強い責任感と思いやりを持つ信頼できる支援者として映ります。",
    situations: {
      work: "細部への注意と献身的な姿勢で、チームを陰から支える縁の下の力持ち",
      social: "親しい人々のケアに専念し、グループの調和と安定を保つ役割を果たす",
      romance: "パートナーを深く愛し支え、安定した温かい家庭を築くことを重視する"
    },
    percentage: 13.8
  },
  ISTP: { 
    name: "巨匠", 
    description: "大胆で実用的、あらゆる種類の道具を使いこなす",
    traits: ["実用的", "論理的", "適応力", "独立的", "客観的"],
    strengths: ["問題解決", "手作業の技術", "危機対応"],
    challenges: ["感情表現が苦手", "長期計画が苦手", "ルールを嫌う"],
    axes: {
      e_i: 'I',
      s_n: 'S',
      t_f: 'T',
      j_p: 'P'
    },
    characteristics: ["実用的", "論理的", "独立的", "冷静", "技術的"],
    firstImpression: "静かで冷静、実践的な問題解決能力を持つ、頼れる技術者として映ります。",
    situations: {
      work: "実践的な問題解決と技術的なスキルで、具体的な成果を生み出す専門家",
      social: "少人数での活動を好み、共通の趣味や興味を持つ仲間との実践的な交流を楽しむ",
      romance: "独立性を保ちながら、パートナーとの実践的で安定した関係を築く"
    },
    percentage: 5.4
  },
  ISTJ: { 
    name: "管理者", 
    description: "実用的で事実に基づく、信頼性の中核となる人",
    traits: ["責任感", "実用的", "組織的", "忠実", "慎重"],
    strengths: ["責任感の強さ", "計画の実行", "信頼性"],
    challenges: ["変化への抵抗", "柔軟性に欠ける", "感情表現が苦手"],
    axes: {
      e_i: 'I',
      s_n: 'S',
      t_f: 'T',
      j_p: 'J'
    },
    characteristics: ["責任感", "実用的", "組織的", "忠実", "信頼性"],
    firstImpression: "静かで真面目、強い責任感と信頼性を持つ、組織の柱となる存在として映ります。",
    situations: {
      work: "計画的で組織的なアプローチで、着実に仕事を遂行する信頼できる実行者",
      social: "伝統と秩序を重んじ、長期的で安定した人間関係を大切にする",
      romance: "誠実で安定した関係を築き、パートナーとの約束と責任を真摯に果たす"
    },
    percentage: 11.6
  }
};

// 旧Character Code結果データ（16タイプシステム移行のため削除予定）
const legacyCharacterResults = {
  gentle: { 
    name: "やわらか系", 
    description: "親しみやすく、温かい印象を与える",
    characteristics: ["優しい雰囲気", "話しかけやすい", "包容力がある", "癒し系", "穏やか"],
    firstImpression: "温かく、安心感を与える人として映ります。初対面でも緊張させず、自然と心を開かせる魅力があります。",
    situations: {
      work: "チームの潤滑油として重宝され、相談しやすい存在として信頼を得やすい",
      social: "グループの中心ではないが、みんなから愛される存在になりやすい",
      romance: "守ってあげたい、一緒にいると安らぐという印象を与える"
    },
    percentage: 28.5
  },
  natural: { 
    name: "ナチュラル系", 
    description: "自然体で、リラックスした雰囲気",
    characteristics: ["等身大", "飾らない", "親近感", "リラックス", "気取らない"],
    firstImpression: "肩の力が抜けた、自然体な人として映ります。作為的でなく、ありのままの魅力で人を惹きつけます。",
    situations: {
      work: "チームに自然に溶け込み、リラックスした雰囲気を作り出すムードメーカー",
      social: "誰とでも気軽に話せる、親しみやすい存在として人気",
      romance: "一緒にいて楽で、自然体でいられる相手として好まれる"
    },
    percentage: 35.2
  },
  dynamic: { 
    name: "ダイナミック系", 
    description: "エネルギッシュで印象的な存在感",
    characteristics: ["華やか", "印象的", "エネルギッシュ", "存在感", "魅力的"],
    firstImpression: "強い印象を残し、一度会ったら忘れられない存在として映ります。エネルギーに満ちた魅力的な人物です。",
    situations: {
      work: "プレゼンテーションや営業で力を発揮し、リーダーシップを期待される",
      social: "パーティーや集まりの中心人物として注目を集める",
      romance: "魅力的で刺激的な相手として、多くの人に興味を持たれる"
    },
    percentage: 22.1
  },
  cool: { 
    name: "クール系", 
    description: "洗練されて知的な印象",
    characteristics: ["知的", "洗練", "上品", "冷静", "ミステリアス"],
    firstImpression: "知的で洗練された、少し距離感のある魅力的な人として映ります。近寄りがたい上品さを持っています。",
    situations: {
      work: "専門性を評価され、重要な判断を任される信頼できる存在",
      social: "一目置かれる存在として、質の高い人間関係を築く",
      romance: "知的で魅力的だが、少し手の届かない存在として憧れられる"
    },
    percentage: 14.2
  }
};

// 希少性データ（組み合わせごとの推定割合）
const rarityData = {
  // 最も希少なタイプ
  INFJ: { gentle: 0.8, natural: 0.9, dynamic: 0.7, cool: 0.6 },
  INTJ: { gentle: 1.1, natural: 1.3, dynamic: 0.9, cool: 0.8 },
  ENTJ: { gentle: 1.4, natural: 1.2, dynamic: 1.0, cool: 0.9 },
  ENTP: { gentle: 2.1, natural: 2.3, dynamic: 1.8, cool: 2.0 },
  
  // 中程度の希少性
  INTP: { gentle: 2.8, natural: 3.1, dynamic: 2.5, cool: 2.4 },
  ISFJ: { gentle: 4.2, natural: 4.8, dynamic: 3.9, cool: 4.1 },
  ISTJ: { gentle: 5.1, natural: 5.6, dynamic: 4.7, cool: 5.3 },
  ISFP: { gentle: 5.8, natural: 6.2, dynamic: 5.4, cool: 5.7 },
  ISTP: { gentle: 6.1, natural: 6.8, dynamic: 5.9, cool: 6.3 },
  ESTJ: { gentle: 6.9, natural: 7.2, dynamic: 6.6, cool: 7.1 },
  ESFJ: { gentle: 7.8, natural: 8.1, dynamic: 7.5, cool: 7.9 },
  ENFJ: { gentle: 8.2, natural: 8.6, dynamic: 7.9, cool: 8.4 },
  ESFP: { gentle: 9.1, natural: 9.5, dynamic: 8.8, cool: 9.2 },
  ESTP: { gentle: 9.8, natural: 10.2, dynamic: 9.5, cool: 9.9 },
  
  // 最も一般的なタイプ
  INFP: { gentle: 11.2, natural: 12.1, dynamic: 10.8, cool: 11.5 },
  ENFP: { gentle: 13.8, natural: 14.2, dynamic: 13.1, cool: 13.9 }
};

// MBTI相性データ（双対関係と相性の良い組み合わせ）
const compatibilityData = {
  ENFP: { best: ["ISTJ"], good: ["INFJ", "ENFJ", "INFP"], challenging: ["ESTJ", "ISTP"] },
  ENFJ: { best: ["ISTP"], good: ["INFP", "ENFP", "ISFJ"], challenging: ["ESTP", "INTJ"] },
  ENTP: { best: ["ISFJ"], good: ["INTJ", "ENTJ", "INTP"], challenging: ["ESFJ", "ISFP"] },
  ENTJ: { best: ["ISFP"], good: ["INTP", "ENTP", "INTJ"], challenging: ["ESFP", "INFJ"] },
  ESFP: { best: ["INTJ"], good: ["ISFP", "ESFJ", "ESTP"], challenging: ["ENTJ", "INFP"] },
  ESFJ: { best: ["INTP"], good: ["ISFJ", "ESFP", "ESTJ"], challenging: ["ENTP", "ISTP"] },
  ESTP: { best: ["INFJ"], good: ["ISTP", "ESTP", "ESFP"], challenging: ["ENFJ", "ISFJ"] },
  ESTJ: { best: ["INFP"], good: ["ISTJ", "ESTJ", "ESFJ"], challenging: ["ENFP", "ISFP"] },
  INFP: { best: ["ESTJ"], good: ["ENFP", "INFJ", "ISFP"], challenging: ["ENTJ", "ESTP"] },
  INFJ: { best: ["ESTP"], good: ["ENFP", "INFP", "INTJ"], challenging: ["ESFP", "ENTP"] },
  INTP: { best: ["ESFJ"], good: ["ENTP", "INTJ", "INTP"], challenging: ["ISFJ", "ESTJ"] },
  INTJ: { best: ["ESFP"], good: ["ENTP", "INFJ", "INTJ"], challenging: ["ESFJ", "ENFP"] },
  ISFP: { best: ["ENTJ"], good: ["INFP", "ISFJ", "ESFP"], challenging: ["ESTJ", "ENTP"] },
  ISFJ: { best: ["ENTP"], good: ["ESFJ", "ISFP", "INFJ"], challenging: ["ESTP", "INTP"] },
  ISTP: { best: ["ENFJ"], good: ["ESTP", "ISFP", "INTP"], challenging: ["ESFJ", "ENFP"] },
  ISTJ: { best: ["ENFP"], good: ["ESTJ", "ISFJ", "ISTJ"], challenging: ["ESFP", "ENTP"] }
};

// ギャップ分析
const generateGapAnalysis = (mbtiType, characterCode) => {
  // 16タイプ対応の希少性データ（仮の値、実際のデータに基づいて調整可能）
  const rarityData16 = {
    'INTJ': {
      'DOFC': 2.1, 'DOFT': 1.8, 'DOMC': 2.5, 'DOMT': 1.9,
      'DIFC': 1.5, 'NIMC': 1.2, 'DIMC': 1.3, 'NIFC': 1.7,
      'NOMC': 1.4, 'DIMT': 1.6, 'DIFT': 1.8, 'NOFC': 1.3,
      'NIMT': 1.1, 'NIFT': 1.2, 'NOFT': 1.0, 'NOMT': 1.3
    },
    'ENFP': {
      'DOFC': 3.5, 'DOFT': 4.2, 'DOMC': 3.1, 'DOMT': 3.8,
      'DIFC': 2.8, 'NIMC': 2.5, 'DIMC': 2.9, 'NIFC': 2.7,
      'NOMC': 2.6, 'DIMT': 2.4, 'DIFT': 3.2, 'NOFC': 2.3,
      'NIMT': 2.1, 'NIFT': 2.2, 'NOFT': 2.0, 'NOMT': 2.4
    }
    // 他のMBTIタイプはデフォルト値を使用
  };
  
  const rarity = rarityData16[mbtiType]?.[characterCode] || 1.5;
  
  // 16タイプ対応のギャップ説明
  const characterInfo = CHARACTER_CODE_16_TYPES[characterCode];
  const groupName = characterInfo?.group || '特別';
  
  // グループ別のギャップ特性
  const groupGapTraits = {
    '印象的': '親しみやすい外見と',
    '残像的': '洗練された印象と',
    '立体的': '多面的な魅力と',
    '感覚的': '個性的な雰囲気と'
  };
  
  const gapTrait = groupGapTraits[groupName] || '独特な印象と';
  
  // MBTIタイプ別の内面特性
  const mbtiInnerTraits = {
    'INTJ': '戦略的で独立心の強い内面',
    'ENFP': '情熱的で創造的な内面',
    'INFJ': '洞察力と理想主義的な内面',
    'ENTJ': 'リーダーシップと野心的な内面',
    'INTP': '論理的で探究心の強い内面',
    'ENTP': '革新的で挑戦的な内面',
    'INFP': '理想主義的で創造的な内面',
    'ENFJ': '共感的でカリスマ的な内面',
    'ISFJ': '献身的で思いやりのある内面',
    'ISTJ': '責任感と信頼性の高い内面',
    'ESFJ': '協調的で世話好きな内面',
    'ESTJ': '組織的で実行力のある内面',
    'ISFP': '芸術的で柔軟な内面',
    'ISTP': '実践的で分析的な内面',
    'ESFP': '社交的で楽観的な内面',
    'ESTP': '行動的で現実的な内面'
  };
  
  const innerTrait = mbtiInnerTraits[mbtiType] || '深い内面';
  
  // ギャップレベルの判定（4軸の差異から計算）
  let gapLevel = 'medium';
  
  // D/N軸とE/I軸の組み合わせでギャップを判定
  const firstAxis = characterCode[0]; // D or N
  const isExtroverted = mbtiType[0] === 'E';
  
  if ((firstAxis === 'D' && !isExtroverted) || (firstAxis === 'N' && isExtroverted)) {
    gapLevel = 'high';
  } else if ((firstAxis === 'D' && isExtroverted) || (firstAxis === 'N' && !isExtroverted)) {
    gapLevel = 'low';
  }
  
  const gapLevelText = {
    'high': '大きなギャップ',
    'medium': '程よいギャップ',
    'low': '自然な調和'
  };
  
  const description = `${characterInfo?.name || characterCode}の${gapTrait}${innerTrait}を持つ、${gapLevelText[gapLevel]}が魅力的なタイプ`;
  
  return {
    statement: `${description}で、全体の${rarity}%という希少な組み合わせ`,
    rarity_percentage: rarity,
    level: gapLevel,
    group: groupName
  };
};;

// 相性分析
const getCompatibility = (userMbtiType) => {
  const compatibility = compatibilityData[userMbtiType] || {
    best: ["未定義"],
    good: ["未定義"],
    challenging: ["未定義"]
  };
  
  return {
    最高の相性: compatibility.best,
    相性が良い: compatibility.good.slice(0, 2),
    注意が必要: compatibility.challenging.slice(0, 2)
  };
};

// 実用的アドバイス生成
const generateAdvice = (mbtiType, characterCode) => {
  // 16タイプ対応のローカル助言生成（AI APIが使えない場合のフォールバック）
  const characterInfo = CHARACTER_CODE_16_TYPES[characterCode];
  const mbtiInfo = mbtiResults[mbtiType];
  
  if (!characterInfo || !mbtiInfo) {
    // デフォルト助言
    return {
      仕事: "あなたの個性を活かした働き方を見つけましょう。",
      友達: "自然体で人と接することで、深い友情を築けます。",
      恋愛: "あなたらしさを大切にしながら、素敵な関係を築きましょう。"
    };
  }
  
  // グループ別の助言テンプレート
  const groupAdviceTemplates = {
    '印象的': {
      仕事: `${characterInfo.name}の親しみやすい印象を活かしながら、${mbtiInfo.name}の本質的な強みでチームに貢献できます。明るく前向きな雰囲気作りが得意でしょう。`,
      友達: `第一印象の良さで友人を作りやすく、${mbtiInfo.name}の深い洞察力で長続きする友情を築けます。グループの中心的存在になれるでしょう。`,
      恋愛: `${characterInfo.name}の温かい魅力で相手を安心させ、${mbtiInfo.name}の誠実さで信頼関係を深められます。`
    },
    '残像的': {
      仕事: `${characterInfo.name}の洗練された印象と、${mbtiInfo.name}の専門性を組み合わせることで、プロフェッショナルとして高く評価されるでしょう。`,
      友達: `記憶に残る特別な存在として、${mbtiInfo.name}の深い理解力で本物の友情を築けます。少数精鋭の深い関係を大切にしましょう。`,
      恋愛: `${characterInfo.name}の神秘的な魅力と、${mbtiInfo.name}の情熱的な愛情で、忘れられない関係を作れます。`
    },
    '立体的': {
      仕事: `${characterInfo.name}の多面的な魅力を状況に応じて使い分け、${mbtiInfo.name}の適応力で様々な場面で活躍できます。`,
      友達: `意外性のあるギャップで人を惹きつけ、${mbtiInfo.name}の理解力で多様な友人関係を築けるでしょう。`,
      恋愛: `${characterInfo.name}の複雑な魅力で相手を飽きさせず、${mbtiInfo.name}の深い愛情で長続きする関係を作れます。`
    },
    '感覚的': {
      仕事: `${characterInfo.name}の芸術的センスと、${mbtiInfo.name}の創造性を組み合わせて、独創的な成果を生み出せるでしょう。`,
      友達: `個性的な魅力で特別な存在となり、${mbtiInfo.name}の感性で深い共感を生む友情を築けます。`,
      恋愛: `${characterInfo.name}の独特な魅力と、${mbtiInfo.name}の情熱で、他にはない特別な関係を築けるでしょう。`
    }
  };
  
  // グループに基づいた助言を返す
  const groupAdvice = groupAdviceTemplates[characterInfo.group];
  
  if (groupAdvice) {
    return groupAdvice;
  }
  
  // フォールバック：汎用的な助言
  return {
    仕事: `${characterInfo.name}の印象を活かしながら、${mbtiInfo.name}の本質的な強みで成果を出す、バランスの取れた働き方ができます。`,
    友達: `第一印象は${characterInfo.name}でも、深く付き合うと${mbtiInfo.name}の真の魅力が伝わり、本物の友情を築けるでしょう。`,
    恋愛: `${characterInfo.name}の魅力で相手を惹きつけ、${mbtiInfo.name}の深い愛情で長続きする関係を作ることができます。`
  };
};;

// エンタメスコア生成
const generateScores = (mbtiType, characterCode) => {
  // 基本スコア計算ロジック
  const calculateScore = (base, modifier1, modifier2, min = 20, max = 98) => {
    const score = Math.max(min, Math.min(max, base + modifier1 + modifier2 + Math.floor(Math.random() * 10 - 5)));
    return score;
  };
  
  // MBTI別基本スコア
  const mbtiBaseScores = {
    ENTJ: { charisma: 90, friendly: 60, mysterious: 70, gap: 40, rarity: 95, attractive: 85 },
    ENFP: { charisma: 85, friendly: 95, mysterious: 30, gap: 60, rarity: 20, attractive: 90 },
    INTJ: { charisma: 75, friendly: 40, mysterious: 95, gap: 85, rarity: 92, attractive: 70 },
    INFJ: { charisma: 70, friendly: 80, mysterious: 90, gap: 80, rarity: 98, attractive: 85 },
    ENTP: { charisma: 80, friendly: 75, mysterious: 60, gap: 70, rarity: 75, attractive: 80 },
    ENFJ: { charisma: 88, friendly: 90, mysterious: 45, gap: 50, rarity: 60, attractive: 88 },
    INTP: { charisma: 65, friendly: 50, mysterious: 85, gap: 75, rarity: 80, attractive: 65 },
    ISFJ: { charisma: 55, friendly: 95, mysterious: 40, gap: 45, rarity: 45, attractive: 75 },
    ISTJ: { charisma: 60, friendly: 70, mysterious: 50, gap: 55, rarity: 50, attractive: 70 },
    ESFP: { charisma: 85, friendly: 95, mysterious: 25, gap: 35, rarity: 35, attractive: 90 },
    ESTP: { charisma: 80, friendly: 85, mysterious: 35, gap: 45, rarity: 40, attractive: 85 },
    ESFJ: { charisma: 70, friendly: 90, mysterious: 30, gap: 40, rarity: 30, attractive: 80 },
    ESTJ: { charisma: 75, friendly: 75, mysterious: 45, gap: 50, rarity: 45, attractive: 75 },
    ISFP: { charisma: 60, friendly: 80, mysterious: 70, gap: 60, rarity: 55, attractive: 80 },
    ISTP: { charisma: 65, friendly: 55, mysterious: 80, gap: 70, rarity: 55, attractive: 70 },
    INFP: { charisma: 70, friendly: 85, mysterious: 75, gap: 65, rarity: 25, attractive: 80 }
  };
  
  // 16タイプCharacterCode別修正値（グループ特性も考慮）
  const getCharacterModifiers = (code) => {
    // CHARACTER_CODE_16_TYPESから情報を取得
    const characterInfo = CHARACTER_CODE_16_TYPES[code];
    if (!characterInfo) {
      // フォールバック：コードから直接解析
      return getModifiersFromCode(code);
    }
    
    // グループ別の基本修正値
    const groupModifiers = {
      '印象的': { charisma: 10, friendly: 15, mysterious: 0, gap: 5, rarity: 0, attractive: 10 },
      '残像的': { charisma: 15, friendly: 5, mysterious: 10, gap: 10, rarity: 5, attractive: 15 },
      '立体的': { charisma: 5, friendly: 10, mysterious: 15, gap: 20, rarity: 10, attractive: 5 },
      '感覚的': { charisma: 20, friendly: 0, mysterious: 5, gap: 15, rarity: 15, attractive: 10 }
    };
    
    const baseModifiers = groupModifiers[characterInfo.group] || { charisma: 0, friendly: 0, mysterious: 0, gap: 0, rarity: 0, attractive: 0 };
    
    // 4軸による追加修正
    const axisModifiers = getModifiersFromCode(code);
    
    // 基本修正値と軸修正値を合成
    return {
      charisma: baseModifiers.charisma + axisModifiers.charisma,
      friendly: baseModifiers.friendly + axisModifiers.friendly,
      mysterious: baseModifiers.mysterious + axisModifiers.mysterious,
      gap: baseModifiers.gap + axisModifiers.gap,
      rarity: baseModifiers.rarity + axisModifiers.rarity,
      attractive: baseModifiers.attractive + axisModifiers.attractive
    };
  };
  
  // コードから直接修正値を計算（フォールバック用）
  const getModifiersFromCode = (code) => {
    const firstLetter = code[0]; // N or D
    const secondLetter = code[1]; // I or O
    const thirdLetter = code[2]; // F or M
    const fourthLetter = code[3]; // C or T
    
    let modifiers = { charisma: 0, friendly: 0, mysterious: 0, gap: 0, rarity: 0, attractive: 0 };
    
    // N/D軸による修正
    if (firstLetter === 'N') {
      modifiers.charisma += 5;
      modifiers.mysterious += 5;
    } else {
      modifiers.friendly += 10;
      modifiers.attractive += 5;
    }
    
    // I/O軸による修正
    if (secondLetter === 'I') {
      modifiers.charisma += 10;
      modifiers.gap += 15;
    } else {
      modifiers.friendly += 10;
    }
    
    // F/M軸による修正
    if (thirdLetter === 'F') {
      modifiers.friendly += 5;
      modifiers.attractive += 5;
    } else {
      modifiers.mysterious += 10;
      modifiers.rarity += 5;
    }
    
    // C/T軸による修正
    if (fourthLetter === 'T') {
      modifiers.charisma += 15;
      modifiers.gap += 10;
    } else {
      modifiers.friendly += 5;
      modifiers.attractive += 10;
    }
    
    return modifiers;
  };
  
  const baseScores = mbtiBaseScores[mbtiType] || mbtiBaseScores.INFP;
  const modifiers = getCharacterModifiers(characterCode);
  
  return {
    カリスマ度: calculateScore(baseScores.charisma, modifiers.charisma, 0),
    親しみやすさ: calculateScore(baseScores.friendly, modifiers.friendly, 0),
    ミステリアス度: calculateScore(baseScores.mysterious, modifiers.mysterious, 0),
    ギャップ度: calculateScore(baseScores.gap, modifiers.gap, 0),
    希少度: calculateScore(baseScores.rarity, modifiers.rarity, 0),
    モテ度: calculateScore(baseScores.attractive, modifiers.attractive, 0)
  };
};

export default function App() {
  const [currentStep, setCurrentStep] = useState('start')
  const [mbtiAnswers, setMbtiAnswers] = useState({})
  const [characterAnswers, setCharacterAnswers] = useState({})
  const [results, setResults] = useState(null)
  const [selectedGender, setSelectedGender] = useState('')
  const [selectedOccupation, setSelectedOccupation] = useState('')
  const [uploadedPhoto, setUploadedPhoto] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)

  // カラーパレット（統一版）
  const unifiedColorPalette = {
    Analysts: {
      primary: '#8B5CF6',
      secondary: '#A78BFA',
      accent: '#6D28D9',
      light: '#DDD6FE',
      dark: '#581C87'
    },
    Diplomats: {
      primary: '#06B6D4',
      secondary: '#67E8F9',
      accent: '#0891B2',
      light: '#CFFAFE',
      dark: '#164E63'
    },
    Sentinels: {
      primary: '#10B981',
      secondary: '#6EE7B7',
      accent: '#059669',
      light: '#D1FAE5',
      dark: '#064E3B'
    },
    Explorers: {
      primary: '#F59E0B',
      secondary: '#FCD34D',
      accent: '#D97706',
      light: '#FEF3C7',
      dark: '#92400E'
    }
  };

  const mbtiGroups = {
    INTJ: 'Analysts', INTP: 'Analysts', ENTJ: 'Analysts', ENTP: 'Analysts',
    INFJ: 'Diplomats', INFP: 'Diplomats', ENFJ: 'Diplomats', ENFP: 'Diplomats',
    ISTJ: 'Sentinels', ISFJ: 'Sentinels', ESTJ: 'Sentinels', ESFJ: 'Sentinels',
    ISTP: 'Explorers', ISFP: 'Explorers', ESTP: 'Explorers', ESFP: 'Explorers'
  };

  // 256通りのMBTI×CharacterCode組み合わせタイトル
  const all256Titles = {
    INTJ: {
      'DOFC': "洞察力で親しみやすい人",
      'DOFT': "洞察力でエネルギッシュ人",
      'DOMC': "洞察力で整然人",
      'DOMT': "洞察力で癒し系人",
      'DIFC': "独立的で洗練人",
      'NIMC': "独立的で純粋人",
      'DIMC': "独立的で可愛らしい人",
      'NIFC': "独立的でカリスマ性人",
      'NOMC': "洞察力でミステリアス人",
      'DIMT': "独立的で意外性人",
      'DIFT': "独立的で安らぎ人",
      'NOFC': "洞察力でユニーク人",
      'NIMT': "独立的でエッジ人",
      'NIFT': "独立的でシック人",
      'NOFT': "洞察力で反抗的人",
      'NOMT': "洞察力でインスピレーション人",
    },
    INTP: {
      'DOFC': "好奇心で親しみやすい人",
      'DOFT': "好奇心でエネルギッシュ人",
      'DOMC': "好奇心で整然人",
      'DOMT': "好奇心で癒し系人",
      'DIFC': "創造的で洗練人",
      'NIMC': "創造的で純粋人",
      'DIMC': "創造的で可愛らしい人",
      'NIFC': "創造的でカリスマ性人",
      'NOMC': "好奇心でミステリアス人",
      'DIMT': "創造的で意外性人",
      'DIFT': "創造的で安らぎ人",
      'NOFC': "好奇心でユニーク人",
      'NIMT': "創造的でエッジ人",
      'NIFT': "創造的でシック人",
      'NOFT': "好奇心で反抗的人",
      'NOMT': "好奇心でインスピレーション人",
    },
    ENTJ: {
      'DOFC': "決断力で正統派人",
      'DOFT': "決断力で魅力的人",
      'DOMC': "決断力で実直人",
      'DOMT': "決断力で穏やか人",
      'DIFC': "効率的でエレガント人",
      'NIMC': "効率的で夢見がち人",
      'DIMC': "効率的で純情人",
      'NIFC': "効率的で都会的人",
      'NOMC': "決断力で多面的人",
      'DIMT': "効率的で多面的人",
      'DIFT': "効率的で居心地良い人",
      'NOFC': "決断力で主人公人",
      'NIMT': "効率的で創造的人",
      'NIFT': "効率的で個性的人",
      'NOFT': "決断力で情熱的人",
      'NOMT': "決断力で魅力的人",
    },
    ENTP: {
      'DOFC': "適応性で正統派人",
      'DOFT': "適応性で魅力的人",
      'DOMC': "適応性で実直人",
      'DOMT': "適応性で穏やか人",
      'DIFC': "機知でエレガント人",
      'NIMC': "機知で夢見がち人",
      'DIMC': "機知で純情人",
      'NIFC': "機知で都会的人",
      'NOMC': "適応性で多面的人",
      'DIMT': "機知で多面的人",
      'DIFT': "機知で居心地良い人",
      'NOFC': "適応性で主人公人",
      'NIMT': "機知で創造的人",
      'NIFT': "機知で個性的人",
      'NOFT': "適応性で情熱的人",
      'NOMT': "適応性で魅力的人",
    },
    INFJ: {
      'DOFC': "思いやりで親しみやすい人",
      'DOFT': "思いやりでエネルギッシュ人",
      'DOMC': "思いやりで整然人",
      'DOMT': "思いやりで癒し系人",
      'DIFC': "洞察力で洗練人",
      'NIMC': "洞察力で純粋人",
      'DIMC': "洞察力で可愛らしい人",
      'NIFC': "洞察力でカリスマ性人",
      'NOMC': "思いやりでミステリアス人",
      'DIMT': "洞察力で意外性人",
      'DIFT': "洞察力で安らぎ人",
      'NOFC': "思いやりでユニーク人",
      'NIMT': "洞察力でエッジ人",
      'NIFT': "洞察力でシック人",
      'NOFT': "思いやりで反抗的人",
      'NOMT': "思いやりでインスピレーション人",
    },
    INFP: {
      'DOFC': "理想主義で親しみやすい人",
      'DOFT': "理想主義でエネルギッシュ人",
      'DOMC': "理想主義で整然人",
      'DOMT': "理想主義で癒し系人",
      'DIFC': "共感的で洗練人",
      'NIMC': "共感的で純粋人",
      'DIMC': "共感的で可愛らしい人",
      'NIFC': "共感的でカリスマ性人",
      'NOMC': "理想主義でミステリアス人",
      'DIMT': "共感的で意外性人",
      'DIFT': "共感的で安らぎ人",
      'NOFC': "理想主義でユニーク人",
      'NIMT': "共感的でエッジ人",
      'NIFT': "共感的でシック人",
      'NOFT': "理想主義で反抗的人",
      'NOMT': "理想主義でインスピレーション人",
    },
    ENFJ: {
      'DOFC': "組織的で正統派人",
      'DOFT': "組織的で魅力的人",
      'DOMC': "組織的で実直人",
      'DOMT': "組織的で穏やか人",
      'DIFC': "共感的でエレガント人",
      'NIMC': "共感的で夢見がち人",
      'DIMC': "共感的で純情人",
      'NIFC': "共感的で都会的人",
      'NOMC': "組織的で多面的人",
      'DIMT': "共感的で多面的人",
      'DIFT': "共感的で居心地良い人",
      'NOFC': "組織的で主人公人",
      'NIMT': "共感的で創造的人",
      'NIFT': "共感的で個性的人",
      'NOFT': "組織的で情熱的人",
      'NOMT': "組織的で魅力的人",
    },
    ENFP: {
      'DOFC': "社交的で正統派人",
      'DOFT': "社交的で魅力的人",
      'DOMC': "社交的で実直人",
      'DOMT': "社交的で穏やか人",
      'DIFC': "創造的でエレガント人",
      'NIMC': "創造的で夢見がち人",
      'DIMC': "創造的で純情人",
      'NIFC': "創造的で都会的人",
      'NOMC': "社交的で多面的人",
      'DIMT': "創造的で多面的人",
      'DIFT': "創造的で居心地良い人",
      'NOFC': "社交的で主人公人",
      'NIMT': "創造的で創造的人",
      'NIFT': "創造的で個性的人",
      'NOFT': "社交的で情熱的人",
      'NOMT': "社交的で魅力的人",
    },
    ISTJ: {
      'DOFC': "組織的で親しみやすい人",
      'DOFT': "組織的でエネルギッシュ人",
      'DOMC': "組織的で整然人",
      'DOMT': "組織的で癒し系人",
      'DIFC': "実用的で洗練人",
      'NIMC': "実用的で純粋人",
      'DIMC': "実用的で可愛らしい人",
      'NIFC': "実用的でカリスマ性人",
      'NOMC': "組織的でミステリアス人",
      'DIMT': "実用的で意外性人",
      'DIFT': "実用的で安らぎ人",
      'NOFC': "組織的でユニーク人",
      'NIMT': "実用的でエッジ人",
      'NIFT': "実用的でシック人",
      'NOFT': "組織的で反抗的人",
      'NOMT': "組織的でインスピレーション人",
    },
    ISFJ: {
      'DOFC': "実用的で親しみやすい人",
      'DOFT': "実用的でエネルギッシュ人",
      'DOMC': "実用的で整然人",
      'DOMT': "実用的で癒し系人",
      'DIFC': "責任感で洗練人",
      'NIMC': "責任感で純粋人",
      'DIMC': "責任感で可愛らしい人",
      'NIFC': "責任感でカリスマ性人",
      'NOMC': "実用的でミステリアス人",
      'DIMT': "責任感で意外性人",
      'DIFT': "責任感で安らぎ人",
      'NOFC': "実用的でユニーク人",
      'NIMT': "責任感でエッジ人",
      'NIFT': "責任感でシック人",
      'NOFT': "実用的で反抗的人",
      'NOMT': "実用的でインスピレーション人",
    },
    ESTJ: {
      'DOFC': "決断力で正統派人",
      'DOFT': "決断力で魅力的人",
      'DOMC': "決断力で実直人",
      'DOMT': "決断力で穏やか人",
      'DIFC': "実用的でエレガント人",
      'NIMC': "実用的で夢見がち人",
      'DIMC': "実用的で純情人",
      'NIFC': "実用的で都会的人",
      'NOMC': "決断力で多面的人",
      'DIMT': "実用的で多面的人",
      'DIFT': "実用的で居心地良い人",
      'NOFC': "決断力で主人公人",
      'NIMT': "実用的で創造的人",
      'NIFT': "実用的で個性的人",
      'NOFT': "決断力で情熱的人",
      'NOMT': "決断力で魅力的人",
    },
    ESFJ: {
      'DOFC': "責任感で正統派人",
      'DOFT': "責任感で魅力的人",
      'DOMC': "責任感で実直人",
      'DOMT': "責任感で穏やか人",
      'DIFC': "思いやりでエレガント人",
      'NIMC': "思いやりで夢見がち人",
      'DIMC': "思いやりで純情人",
      'NIFC': "思いやりで都会的人",
      'NOMC': "責任感で多面的人",
      'DIMT': "思いやりで多面的人",
      'DIFT': "思いやりで居心地良い人",
      'NOFC': "責任感で主人公人",
      'NIMT': "思いやりで創造的人",
      'NIFT': "思いやりで個性的人",
      'NOFT': "責任感で情熱的人",
      'NOMT': "責任感で魅力的人",
    },
    ISTP: {
      'DOFC': "独立的で親しみやすい人",
      'DOFT': "独立的でエネルギッシュ人",
      'DOMC': "独立的で整然人",
      'DOMT': "独立的で癒し系人",
      'DIFC': "適応性で洗練人",
      'NIMC': "適応性で純粋人",
      'DIMC': "適応性で可愛らしい人",
      'NIFC': "適応性でカリスマ性人",
      'NOMC': "独立的でミステリアス人",
      'DIMT': "適応性で意外性人",
      'DIFT': "適応性で安らぎ人",
      'NOFC': "独立的でユニーク人",
      'NIMT': "適応性でエッジ人",
      'NIFT': "適応性でシック人",
      'NOFT': "独立的で反抗的人",
      'NOMT': "独立的でインスピレーション人",
    },
    ISFP: {
      'DOFC': "思いやりで親しみやすい人",
      'DOFT': "思いやりでエネルギッシュ人",
      'DOMC': "思いやりで整然人",
      'DOMT': "思いやりで癒し系人",
      'DIFC': "柔軟性で洗練人",
      'NIMC': "柔軟性で純粋人",
      'DIMC': "柔軟性で可愛らしい人",
      'NIFC': "柔軟性でカリスマ性人",
      'NOMC': "思いやりでミステリアス人",
      'DIMT': "柔軟性で意外性人",
      'DIFT': "柔軟性で安らぎ人",
      'NOFC': "思いやりでユニーク人",
      'NIMT': "柔軟性でエッジ人",
      'NIFT': "柔軟性でシック人",
      'NOFT': "思いやりで反抗的人",
      'NOMT': "思いやりでインスピレーション人",
    },
    ESTP: {
      'DOFC': "適応性で正統派人",
      'DOFT': "適応性で魅力的人",
      'DOMC': "適応性で実直人",
      'DOMT': "適応性で穏やか人",
      'DIFC': "現実的でエレガント人",
      'NIMC': "現実的で夢見がち人",
      'DIMC': "現実的で純情人",
      'NIFC': "現実的で都会的人",
      'NOMC': "適応性で多面的人",
      'DIMT': "現実的で多面的人",
      'DIFT': "現実的で居心地良い人",
      'NOFC': "適応性で主人公人",
      'NIMT': "現実的で創造的人",
      'NIFT': "現実的で個性的人",
      'NOFT': "適応性で情熱的人",
      'NOMT': "適応性で魅力的人",
    },
    ESFP: {
      'DOFC': "柔軟性で正統派人",
      'DOFT': "柔軟性で魅力的人",
      'DOMC': "柔軟性で実直人",
      'DOMT': "柔軟性で穏やか人",
      'DIFC': "楽観的でエレガント人",
      'NIMC': "楽観的で夢見がち人",
      'DIMC': "楽観的で純情人",
      'NIFC': "楽観的で都会的人",
      'NOMC': "柔軟性で多面的人",
      'DIMT': "楽観的で多面的人",
      'DIFT': "楽観的で居心地良い人",
      'NOFC': "柔軟性で主人公人",
      'NIMT': "楽観的で創造的人",
      'NIFT': "楽観的で個性的人",
      'NOFT': "柔軟性で情熱的人",
      'NOMT': "柔軟性で魅力的人",
    },
  };

  // generateTitle関数を新しい256通りタイトルに更新
  const generateTitle = (mbtiType, characterType) => {
    return all256Titles[mbtiType]?.[characterType] || `${mbtiType} × ${characterType}`;
  };

  const mbtiTypes = {
    INTJ: { name: '建築家', traits: ['戦略的', '独立的', '洞察力', '革新的', '完璧主義'] },
    INTP: { name: '論理学者', traits: ['論理的', '創造的', '好奇心', '客観的', '柔軟性'] },
    ENTJ: { name: '指揮官', traits: ['指導力', '効率的', '決断力', '組織的', '野心的'] },
    ENTP: { name: '討論者', traits: ['革新的', '機知', '適応性', 'エネルギッシュ', '創造的'] },
    INFJ: { name: '提唱者', traits: ['理想主義', '洞察力', '思いやり', '直感的', '献身的'] },
    INFP: { name: '仲介者', traits: ['創造的', '共感的', '理想主義', '柔軟性', '価値観'] },
    ENFJ: { name: '主人公', traits: ['カリスマ的', '共感的', '組織的', '励まし', '責任感'] },
    ENFP: { name: '運動家', traits: ['熱狂的', '創造的', '社交的', '直感的', '柔軟性'] },
    ISTJ: { name: '管理者', traits: ['責任感', '実用的', '組織的', '伝統的', '信頼性'] },
    ISFJ: { name: '擁護者', traits: ['思いやり', '責任感', '実用的', '協調的', '献身的'] },
    ESTJ: { name: '幹部', traits: ['組織的', '実用的', '決断力', '責任感', '効率的'] },
    ESFJ: { name: '領事', traits: ['協調的', '思いやり', '責任感', '社交的', '伝統的'] },
    ISTP: { name: '巨匠', traits: ['実用的', '適応性', '独立的', '論理的', '冷静'] },
    ISFP: { name: '冒険家', traits: ['芸術的', '柔軟性', '思いやり', '価値観', '控えめ'] },
    ESTP: { name: '起業家', traits: ['活動的', '現実的', '適応性', '社交的', '実用的'] },
    ESFP: { name: 'エンターテイナー', traits: ['社交的', '楽観的', '柔軟性', '共感的', 'エネルギッシュ'] }
  };

  const characterTypes = {
    // 印象的グループ
    DOFC: { name: '模範的なアナウンサー', traits: ['信頼できる', '親しみやすい', '正統派', '安心感', '品格'] },
    DOFT: { name: '元気なアイドルセンター', traits: ['華やか', 'エネルギッシュ', '魅力的', '輝く', '人気'] },
    DOMC: { name: '整理されたリーダー', traits: ['統率力', '整然', '実直', '責任感', '頼れる'] },
    DOMT: { name: '優しい春の陽光', traits: ['温かい', '癒し系', '穏やか', '優しい', '安らぎ'] },
    
    // 残像的グループ
    DIFC: { name: '穏やかな洗練美', traits: ['上品', '洗練', 'エレガント', '知的', '品のある'] },
    NIMC: { name: '夢幻的な清楚美', traits: ['清楚', '純粋', '夢見がち', '透明感', '神秘的'] },
    DIMC: { name: 'ドキドキの初恋', traits: ['初々しい', '可愛らしい', '純情', '心躍る', '甘い'] },
    NIFC: { name: '都会的なカリスマ', traits: ['洗練', 'カリスマ性', '都会的', 'クール', '魅力的'] },
    
    // 立体的グループ
    NOMC: { name: '神秘的なカメレオン', traits: ['変幻自在', 'ミステリアス', '多面的', '神秘的', '不思議'] },
    DIMT: { name: '多面的な逆転魅力', traits: ['ギャップ', '意外性', '多面的', '驚き', '魅力的'] },
    DIFT: { name: 'かわいい安らぎの場所', traits: ['可愛い', '安らぎ', '居心地良い', '癒し', '温かい'] },
    NOFC: { name: '独特な主人公', traits: ['個性的', 'ユニーク', '主人公', '特別', '印象的'] },
    
    // 感覚的グループ
    NIMT: { name: 'エッジの効いたアーティスト', traits: ['アーティスティック', 'エッジ', '創造的', '感性的', '独創的'] },
    NIFT: { name: 'シックな自由人', traits: ['自由', 'シック', '個性的', '洗練', '独立的'] },
    NOFT: { name: '反抗的なロマンチスト', traits: ['ロマンチック', '反抗的', '情熱的', '自由', '魅力的'] },
    NOMT: { name: '華やかなミューズ', traits: ['華やか', 'インスピレーション', '魅力的', '芸術的', '輝く'] }
  };

  const mbtiQuestions = [
    // E vs I (外向性 vs 内向性) - 7問
    {
      id: 'ei_1',
      question: '週末の過ごし方は？',
      options: [
        { text: '友人とアクティブに出かける', value: 'E' },
        { text: '家でリラックスして過ごす', value: 'I' }
      ]
    },
    {
      id: 'ei_2',
      question: 'エネルギーを得る時間は？',
      options: [
        { text: '人と話している時', value: 'E' },
        { text: '一人で考えている時', value: 'I' }
      ]
    },
    {
      id: 'ei_3',
      question: 'パーティーでのあなたは？',
      options: [
        { text: '積極的に多くの人と話す', value: 'E' },
        { text: '少数の人と深く話す', value: 'I' }
      ]
    },
    {
      id: 'ei_4',
      question: '新しい環境に対して',
      options: [
        { text: 'すぐに馴染める', value: 'E' },
        { text: '時間をかけて慣れる', value: 'I' }
      ]
    },
    {
      id: 'ei_5',
      question: '仕事の進め方は？',
      options: [
        { text: 'チームで協力しながら', value: 'E' },
        { text: '集中して個人で進める', value: 'I' }
      ]
    },
    {
      id: 'ei_6',
      question: '会話スタイルは？',
      options: [
        { text: '思ったことをすぐ話す', value: 'E' },
        { text: '考えてから話す', value: 'I' }
      ]
    },
    {
      id: 'ei_7',
      question: '友人関係は？',
      options: [
        { text: '広く浅く多くの友人', value: 'E' },
        { text: '狭く深く親しい友人', value: 'I' }
      ]
    },
    
    // S vs N (現実主義 vs 直感) - 7問
    {
      id: 'sn_1',
      question: '情報を得る時、重視するのは？',
      options: [
        { text: '具体的な事実やデータ', value: 'S' },
        { text: '可能性やアイデア', value: 'N' }
      ]
    },
    {
      id: 'sn_2',
      question: '学習スタイルは？',
      options: [
        { text: '段階的に着実に学ぶ', value: 'S' },
        { text: '全体像を理解してから詳細', value: 'N' }
      ]
    },
    {
      id: 'sn_3',
      question: '未来について',
      options: [
        { text: '現実的な計画を立てる', value: 'S' },
        { text: '理想やビジョンを描く', value: 'N' }
      ]
    },
    {
      id: 'sn_4',
      question: '仕事で大切にするのは？',
      options: [
        { text: '実用性と効率性', value: 'S' },
        { text: '創造性と革新性', value: 'N' }
      ]
    },
    {
      id: 'sn_5',
      question: '問題解決のアプローチ',
      options: [
        { text: '過去の経験を活用', value: 'S' },
        { text: '新しい方法を模索', value: 'N' }
      ]
    },
    {
      id: 'sn_6',
      question: '会話で興味を持つのは？',
      options: [
        { text: '具体的な体験や出来事', value: 'S' },
        { text: '抽象的な概念やアイデア', value: 'N' }
      ]
    },
    {
      id: 'sn_7',
      question: '変化に対して',
      options: [
        { text: '慎重に段階的に対応', value: 'S' },
        { text: '積極的に新しい可能性を探る', value: 'N' }
      ]
    },
    
    // T vs F (論理 vs 感情) - 7問
    {
      id: 'tf_1',
      question: '決断をする時の基準は？',
      options: [
        { text: '論理的な分析と客観性', value: 'T' },
        { text: '価値観と人への影響', value: 'F' }
      ]
    },
    {
      id: 'tf_2',
      question: '批判を受けた時',
      options: [
        { text: '内容を客観的に検討', value: 'T' },
        { text: '感情的に受け止めがち', value: 'F' }
      ]
    },
    {
      id: 'tf_3',
      question: '他人との関係で重視するのは？',
      options: [
        { text: '公平性と一貫性', value: 'T' },
        { text: '調和と思いやり', value: 'F' }
      ]
    },
    {
      id: 'tf_4',
      question: '仕事での評価軸は？',
      options: [
        { text: '効率性と成果', value: 'T' },
        { text: '協調性と貢献', value: 'F' }
      ]
    },
    {
      id: 'tf_5',
      question: '問題が起きた時',
      options: [
        { text: '原因を分析し解決策を考える', value: 'T' },
        { text: 'まず関係者の気持ちを考慮', value: 'F' }
      ]
    },
    {
      id: 'tf_6',
      question: '議論スタイルは？',
      options: [
        { text: '論点を整理し理論的に', value: 'T' },
        { text: '相手の立場を理解しながら', value: 'F' }
      ]
    },
    {
      id: 'tf_7',
      question: '成功の定義は？',
      options: [
        { text: '目標達成と能力向上', value: 'T' },
        { text: '人間関係と個人の成長', value: 'F' }
      ]
    },
    
    // J vs P (計画性 vs 柔軟性) - 7問
    {
      id: 'jp_1',
      question: '日常生活のスタイルは？',
      options: [
        { text: 'スケジュールに従って規則的', value: 'J' },
        { text: 'その時の状況に合わせて柔軟', value: 'P' }
      ]
    },
    {
      id: 'jp_2',
      question: '旅行の計画は？',
      options: [
        { text: '詳細に計画を立てる', value: 'J' },
        { text: '大まかに決めて現地で決める', value: 'P' }
      ]
    },
    {
      id: 'jp_3',
      question: '締切に対する態度',
      options: [
        { text: '早めに完了させる', value: 'J' },
        { text: 'ギリギリまで調整する', value: 'P' }
      ]
    },
    {
      id: 'jp_4',
      question: '部屋の状態は？',
      options: [
        { text: '整理整頓されている', value: 'J' },
        { text: '必要な時に片付ける', value: 'P' }
      ]
    },
    {
      id: 'jp_5',
      question: '意思決定について',
      options: [
        { text: 'できるだけ早く決めたい', value: 'J' },
        { text: '選択肢を残しておきたい', value: 'P' }
      ]
    },
    {
      id: 'jp_6',
      question: '変更や中断に対して',
      options: [
        { text: 'ストレスを感じる', value: 'J' },
        { text: '柔軟に対応できる', value: 'P' }
      ]
    },
    {
      id: 'jp_7',
      question: '目標達成のアプローチ',
      options: [
        { text: '段階的に着実に進める', value: 'J' },
        { text: '状況に応じて調整しながら', value: 'P' }
      ]
    }
  ];

  const characterQuestions = [
    {
      id: 'impression_1',
      question: '初対面の印象を決める要素は？',
      options: [
        { text: '清潔感と身だしなみ', value: 'D', type: 'approach' },
        { text: '独特な個性と魅力', value: 'N', type: 'approach' }
      ]
    },
    {
      id: 'impression_2',
      question: '人とのコミュニケーションスタイルは？',
      options: [
        { text: '相手に合わせて調和を重視', value: 'O', type: 'interaction' },
        { text: '自分らしさを大切に表現', value: 'I', type: 'interaction' }
      ]
    },
    {
      id: 'impression_3',
      question: '感情表現の仕方は？',
      options: [
        { text: 'ストレートに表現する', value: 'F', type: 'expression' },
        { text: '控えめで上品に表現', value: 'M', type: 'expression' }
      ]
    },
    {
      id: 'impression_4',
      question: '困難な状況での対応は？',
      options: [
        { text: '冷静で論理的に対処', value: 'C', type: 'response' },
        { text: '情熱的でエネルギッシュに対応', value: 'T', type: 'response' }
      ]
    },
    {
      id: 'impression_5',
      question: 'ファッションセンスの特徴は？',
      options: [
        { text: 'トレンドを取り入れた華やかさ', value: 'F', type: 'style' },
        { text: '上品で洗練されたスタイル', value: 'M', type: 'style' }
      ]
    },
    {
      id: 'impression_6',
      question: '会話での存在感は？',
      options: [
        { text: '中心となって場を盛り上げる', value: 'F', type: 'presence' },
        { text: '落ち着いて上品に参加', value: 'M', type: 'presence' }
      ]
    },
    {
      id: 'impression_7',
      question: '新しい環境での印象は？',
      options: [
        { text: '親しみやすく馴染みやすい', value: 'C', type: 'adaptation' },
        { text: '個性的で印象に残る', value: 'T', type: 'adaptation' }
      ]
    },
    {
      id: 'impression_8',
      question: '写真を撮られる時の表情は？',
      options: [
        { text: '自然で親しみやすい笑顔', value: 'C', type: 'expression' },
        { text: 'クールで洗練された表情', value: 'T', type: 'expression' }
      ]
    },
    {
      id: 'impression_9',
      question: '人からよく言われる言葉は？',
      options: [
        { text: '「優しそう」「親しみやすい」', value: 'C', type: 'perception' },
        { text: '「個性的」「印象的」', value: 'T', type: 'perception' }
      ]
    },
    {
      id: 'impression_10',
      question: '理想の印象は？',
      options: [
        { text: '安心感を与える存在', value: 'C', type: 'ideal' },
        { text: '刺激的で魅力的な存在', value: 'T', type: 'ideal' }
      ]
    },
    {
      id: 'impression_11',
      question: '色の好みは？',
      options: [
        { text: 'パステル調の優しい色合い', value: 'M', type: 'preference' },
        { text: 'ビビッドで鮮やかな色合い', value: 'F', type: 'preference' }
      ]
    },
    {
      id: 'impression_12',
      question: '音楽の好みは？',
      options: [
        { text: '穏やかで心地よいメロディ', value: 'M', type: 'taste' },
        { text: 'エネルギッシュでリズミカル', value: 'F', type: 'taste' }
      ]
    }
  ];

  const calculateMbtiType = (answers) => {
    const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    
    Object.values(answers).forEach(answer => {
      scores[answer]++;
    });
    
    const type = [
      scores.E >= scores.I ? 'E' : 'I',
      scores.S >= scores.N ? 'S' : 'N',
      scores.T >= scores.F ? 'T' : 'F',
      scores.J >= scores.P ? 'J' : 'P'
    ].join('');
    
    return type;
  };

  const calculateCharacterType = (answers) => {
    const scores = {
      DOFC: 0, DOFT: 0, DOMC: 0, DOMT: 0,
      DIFC: 0, DIFT: 0, DIMC: 0, DIMT: 0,
      NOFC: 0, NOFT: 0, NOMC: 0, NOMT: 0,
      NIFC: 0, NIFT: 0, NIMC: 0, NIMT: 0
    };

    Object.entries(answers).forEach(([questionId, answer]) => {
      if (questionId.includes('impression')) {
        const question = characterQuestions.find(q => q.id === questionId);
        if (question) {
          const selectedOption = question.options.find(opt => opt.value === answer);
          if (selectedOption) {
            switch(selectedOption.value) {
              case 'D':
                scores.DOFC += 1; scores.DOFT += 1; scores.DOMC += 1; scores.DOMT += 1;
                scores.DIFC += 1; scores.DIFT += 1; scores.DIMC += 1; scores.DIMT += 1;
                break;
              case 'N':
                scores.NOFC += 1; scores.NOFT += 1; scores.NOMC += 1; scores.NOMT += 1;
                scores.NIFC += 1; scores.NIFT += 1; scores.NIMC += 1; scores.NIMT += 1;
                break;
              case 'O':
                scores.DOFC += 1; scores.DOFT += 1; scores.DOMC += 1; scores.DOMT += 1;
                scores.NOFC += 1; scores.NOFT += 1; scores.NOMC += 1; scores.NOMT += 1;
                break;
              case 'I':
                scores.DIFC += 1; scores.DIFT += 1; scores.DIMC += 1; scores.DIMT += 1;
                scores.NIFC += 1; scores.NIFT += 1; scores.NIMC += 1; scores.NIMT += 1;
                break;
              case 'F':
                scores.DOFC += 1; scores.DOFT += 1; scores.DIFC += 1; scores.DIFT += 1;
                scores.NOFC += 1; scores.NOFT += 1; scores.NIFC += 1; scores.NIFT += 1;
                break;
              case 'M':
                scores.DOMC += 1; scores.DOMT += 1; scores.DIMC += 1; scores.DIMT += 1;
                scores.NOMC += 1; scores.NOMT += 1; scores.NIMC += 1; scores.NIMT += 1;
                break;
              case 'C':
                scores.DOFC += 1; scores.DOMC += 1; scores.DIFC += 1; scores.DIMC += 1;
                scores.NOFC += 1; scores.NOMC += 1; scores.NIFC += 1; scores.NIMC += 1;
                break;
              case 'T':
                scores.DOFT += 1; scores.DOMT += 1; scores.DIFT += 1; scores.DIMT += 1;
                scores.NOFT += 1; scores.NOMT += 1; scores.NIFT += 1; scores.NIMT += 1;
                break;
            }
          }
        }
      }
    });

    const maxScore = Math.max(...Object.values(scores));
    const topTypes = Object.entries(scores).filter(([_, score]) => score === maxScore);
    
    return topTypes[0][0];
  };

  const calculateCompatibility = (mbtiType) => {
    const compatibility = {
      INTJ: 'ENFP', INTP: 'ESFJ', ENTJ: 'INFP', ENTP: 'ISFJ',
      INFJ: 'ESTP', INFP: 'ESTJ', ENFJ: 'ISTP', ENFP: 'ISTJ',
      ISTJ: 'ENFP', ISFJ: 'ENTP', ESTJ: 'INFP', ESFJ: 'INTP',
      ISTP: 'ENFJ', ISFP: 'ENTJ', ESTP: 'INFJ', ESFP: 'INTJ'
    };
    return compatibility[mbtiType] || 'ENFP';
  };

  const calculateGapPercentage = (mbtiType, characterType) => {
    const mbtiGroup = mbtiGroups[mbtiType];
    
    const gapMatrix = {
      'Analysts-DOFC': 45, 'Analysts-DOFT': 65, 'Analysts-DOMC': 35, 'Analysts-DOMT': 75,
      'Analysts-DIFC': 25, 'Analysts-DIFT': 85, 'Analysts-DIMC': 80, 'Analysts-DIMT': 60,
      'Analysts-NOFC': 70, 'Analysts-NOFT': 90, 'Analysts-NOMC': 55, 'Analysts-NOMT': 85,
      'Analysts-NIFC': 40, 'Analysts-NIFT': 65, 'Analysts-NIMC': 85, 'Analysts-NIMT': 45,
      
      'Diplomats-DOFC': 60, 'Diplomats-DOFT': 40, 'Diplomats-DOMC': 70, 'Diplomats-DOMT': 35,
      'Diplomats-DIFC': 45, 'Diplomats-DIFT': 30, 'Diplomats-DIMC': 25, 'Diplomats-DIMT': 85,
      'Diplomats-NOFC': 55, 'Diplomats-NOFT': 75, 'Diplomats-NOMC': 40, 'Diplomats-NOMT': 60,
      'Diplomats-NIFC': 80, 'Diplomats-NIFT': 70, 'Diplomats-NIMC': 35, 'Diplomats-NIMT': 90,
      
      'Sentinels-DOFC': 25, 'Sentinels-DOFT': 70, 'Sentinels-DOMC': 30, 'Sentinels-DOMT': 45,
      'Sentinels-DIFC': 85, 'Sentinels-DIFT': 60, 'Sentinels-DIMC': 75, 'Sentinels-DIMT': 95,
      'Sentinels-NOFC': 90, 'Sentinels-NOFT': 95, 'Sentinels-NOMC': 80, 'Sentinels-NOMT': 85,
      'Sentinels-NIFC': 75, 'Sentinels-NIFT': 90, 'Sentinels-NIMC': 65, 'Sentinels-NIMT': 80,
      
      'Explorers-DOFC': 80, 'Explorers-DOFT': 35, 'Explorers-DOMC': 85, 'Explorers-DOMT': 60,
      'Explorers-DIFC': 70, 'Explorers-DIFT': 45, 'Explorers-DIMC': 55, 'Explorers-DIMT': 40,
      'Explorers-NOFC': 30, 'Explorers-NOFT': 25, 'Explorers-NOMC': 45, 'Explorers-NOMT': 35,
      'Explorers-NIFC': 50, 'Explorers-NIFT': 40, 'Explorers-NIMC': 75, 'Explorers-NIMT': 30
    };
    
    const key = `${mbtiGroup}-${characterType}`;
    return gapMatrix[key] || Math.floor(Math.random() * 40) + 30;
  };

  const calculateEntertainmentScores = (mbtiType, characterType, gapPercentage) => {
    const baseScores = {
      charisma: Math.floor(Math.random() * 30) + 70,
      friendliness: Math.floor(Math.random() * 25) + 75,  
      mystery: Math.floor(Math.random() * 40) + 60,
      gap: gapPercentage,
      rarity: Math.floor(Math.random() * 35) + 65,
      attractiveness: Math.floor(Math.random() * 25) + 75
    };

    if (mbtiType.startsWith('E')) {
      baseScores.charisma += 5;
      baseScores.friendliness += 5;
    }
    
    if (characterType.includes('N')) {
      baseScores.mystery += 10;
      baseScores.rarity += 5;
    }

    return baseScores;
  };

  const analyzeResults = () => {
    const mbtiType = calculateMbtiType(mbtiAnswers);
    const characterType = calculateCharacterType(characterAnswers);
    const compatibility = calculateCompatibility(mbtiType);
    const gapPercentage = calculateGapPercentage(mbtiType, characterType);
    const entertainmentScores = calculateEntertainmentScores(mbtiType, characterType, gapPercentage);
    const title = generateTitle(mbtiType, characterType);

    const results = {
      mbtiType,
      characterType,
      mbtiInfo: mbtiTypes[mbtiType],
      characterInfo: characterTypes[characterType],
      compatibility,
      gapPercentage,
      entertainmentScores,
      title,
      colors: unifiedColorPalette[mbtiGroups[mbtiType]]
    };

    setResults(results);
  };

  const handleMbtiAnswer = (questionId, answer) => {
    setMbtiAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleCharacterAnswer = (questionId, answer) => {
    setCharacterAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedPhoto(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAIImage = async () => {
    setIsGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsGenerating(false);
    setCurrentStep('results');
    analyzeResults();
  };

  // タイトルからビジュアル要素を抽出するヘルパー関数
  const extractVisualElements = (title, mbtiType, characterType) => {
    const titleAnalysis = {
      '洞察力で親しみやすい人': {
        description: 'A person who combines deep insight with approachable warmth',
        specificElements: 'Thoughtful eyes with a gentle smile, intellectual accessories with warm colors, books or analytical tools with friendly aura'
      },
      '洞察力でエネルギッシュ人': {
        description: 'An energetic person with analytical depth',
        specificElements: 'Dynamic pose with focused expression, bright colors with sharp geometric patterns, energy emanating from eyes'
      },
      '独立的で洗練人': {
        description: 'A refined person with strong independence',
        specificElements: 'Elegant posture with confident stance, sophisticated color palette, minimalist but high-quality accessories'
      },
      '創造的で洗練人': {
        description: 'An elegant person with creative flair',
        specificElements: 'Artistic tools or symbols, refined posture, creative yet sophisticated styling, palette of artistic colors'
      },
      '適応性で正統派人': {
        description: 'A traditional person with remarkable adaptability',
        specificElements: 'Classic styling with modern touches, flexible pose suggesting readiness to adapt, balanced traditional-modern elements'
      },
      '機知でエレガント人': {
        description: 'An elegant person with sharp wit',
        specificElements: 'Clever expression with refined styling, smart accessories, subtle smirk showing intelligence and sophistication'
      },
      '思いやりで親しみやすい人': {
        description: 'A caring person with natural approachability',
        specificElements: 'Warm, caring expression with open posture, soft colors, heart-warming aura, gentle gestures'
      },
      '理想主義で親しみやすい人': {
        description: 'An idealistic person with welcoming nature',
        specificElements: 'Dreamy yet warm expression, soft flowing elements, inspirational symbols, approachable stance'
      },
      '組織的で正統派人': {
        description: 'A traditional person with strong organizational skills',
        specificElements: 'Professional posture, structured accessories, leadership symbols, orderly background elements'
      },
      '社交的で正統派人': {
        description: 'A traditional person with strong social skills',
        specificElements: 'Friendly professional appearance, social symbols, welcoming gestures, community-oriented elements'
      },
      '組織的で親しみやすい人': {
        description: 'An organized person with natural warmth',
        specificElements: 'Structured but friendly appearance, organizational tools with warm colors, approachable leadership aura'
      },
      '実用的で親しみやすい人': {
        description: 'A practical person with genuine warmth',
        specificElements: 'Functional yet welcoming styling, practical tools with friendly design, reliable and warm aura'
      },
      '決断力で正統派人': {
        description: 'A traditional person with strong decision-making skills',
        specificElements: 'Confident stance with authoritative presence, decisive gestures, leadership symbols, traditional professional attire'
      },
      '責任感で正統派人': {
        description: 'A traditional person with strong sense of responsibility',
        specificElements: 'Reliable posture with caring expression, symbols of duty and care, protective aura, trustworthy appearance'
      },
      '独立的で親しみやすい人': {
        description: 'An independent person with natural friendliness',
        specificElements: 'Self-assured but welcoming stance, individual style with warm touches, confident yet approachable expression'
      }
    };

    return titleAnalysis[title] || {
      description: `A unique personality combining ${mbtiType} analytical depth with ${characterType} visual appeal`,
      specificElements: 'Balanced elements reflecting both personality and impression traits, unique combination of intellectual and aesthetic elements'
    };
  };

  // MBTIグループ別のスタイル特性
  const getMbtiGroupStyle = (mbtiGroup) => {
    const mbtiGroupStyles = {
      'Analysts': {
        pose: 'thoughtful, analytical pose with hand on chin or crossed arms',
        expression: 'intelligent, focused expression with slightly narrowed eyes',
        accessories: 'glasses, books, technological elements, or analytical tools',
        environment: 'modern, minimalist setting with geometric patterns'
      },
      'Diplomats': {
        pose: 'open, welcoming pose with arms slightly extended',
        expression: 'warm, empathetic expression with gentle smile',
        accessories: 'flowing elements, nature motifs, or artistic tools',
        environment: 'organic, harmonious setting with soft curves'
      },
      'Sentinels': {
        pose: 'confident, stable stance with shoulders back',
        expression: 'reliable, steady expression with direct gaze',
        accessories: 'structured elements, badges, or organizational tools',
        environment: 'orderly, professional setting with clear structures'
      },
      'Explorers': {
        pose: 'dynamic, action-ready pose with slight movement',
        expression: 'adventurous, energetic expression with bright eyes',
        accessories: 'sports equipment, tools, or adventure gear',
        environment: 'dynamic, vibrant setting with movement elements'
      }
    };
    return mbtiGroupStyles[mbtiGroup];
  };

  // CharacterCode別の印象要素
  const getCharacterVisualElements = (characterType) => {
    const characterVisualElements = {
      'DOFC': { style: 'trustworthy, approachable', clothing: 'professional, neat attire', aura: 'reliable, warm glow' },
      'DOFT': { style: 'energetic, charismatic', clothing: 'bright, trendy outfit', aura: 'vibrant, sparkling effect' },
      'DOMC': { style: 'organized, leadership', clothing: 'formal, structured wear', aura: 'authoritative, steady light' },
      'DOMT': { style: 'gentle, healing', clothing: 'soft, comfortable attire', aura: 'soothing, pastel glow' },
      'DIFC': { style: 'elegant, refined', clothing: 'sophisticated, tasteful outfit', aura: 'sophisticated, subtle shimmer' },
      'NIMC': { style: 'pure, dreamy', clothing: 'ethereal, flowing garments', aura: 'mystical, soft radiance' },
      'DIMC': { style: 'cute, innocent', clothing: 'adorable, youthful style', aura: 'sweet, heart-shaped sparkles' },
      'NIFC': { style: 'charismatic, urban', clothing: 'stylish, metropolitan fashion', aura: 'cool, crystal-like gleam' },
      'NOMC': { style: 'mysterious, multifaceted', clothing: 'enigmatic, layered outfit', aura: 'shifting, aurora-like colors' },
      'DIMT': { style: 'surprising, gap-moe', clothing: 'unexpected style combination', aura: 'dual-toned, contrasting light' },
      'DIFT': { style: 'comforting, cozy', clothing: 'warm, relaxing attire', aura: 'gentle, home-like warmth' },
      'NOFC': { style: 'unique, protagonist', clothing: 'distinctive, memorable outfit', aura: 'spotlight-like radiance' },
      'NIMT': { style: 'artistic, edgy', clothing: 'creative, avant-garde fashion', aura: 'artistic, paint-like swirls' },
      'NIFT': { style: 'chic, independent', clothing: 'stylish, individualistic wear', aura: 'sophisticated, monochrome glow' },
      'NOFT': { style: 'rebellious, romantic', clothing: 'bold, expressive outfit', aura: 'passionate, flame-like energy' },
      'NOMT': { style: 'glamorous, inspiring', clothing: 'dazzling, show-stopping attire', aura: 'brilliant, star-like sparkle' }
    };
    return characterVisualElements[characterType] || {
      style: 'balanced, appealing',
      clothing: 'well-fitted, stylish attire',
      aura: 'pleasant, harmonious glow'
    };
  };

  // AI画像生成プロンプト（改善版）
  const generateAIPrompt = (results) => {
    const { mbtiType, characterType, mbtiInfo, characterInfo, title, colors } = results;
    
    const visualElements = extractVisualElements(title, mbtiType, characterType);
    
    const mbtiGroup = mbtiGroups[mbtiType];
    const groupStyle = getMbtiGroupStyle(mbtiGroup);
    const characterVisual = getCharacterVisualElements(characterType);

    return `Create a stunning low-poly 3D character embodying "${title}":

CORE CONCEPT:
- Personality: ${mbtiType} ${mbtiInfo.name} (${mbtiInfo.traits.join(', ')})
- Visual Impression: ${characterType} ${characterInfo.name} (${characterInfo.traits.join(', ')})
- Title Essence: ${title} - ${visualElements.description}

CHARACTER DESIGN:
- Pose: ${groupStyle.pose}
- Expression: ${groupStyle.expression} 
- Style: ${characterVisual.style}
- Clothing: ${characterVisual.clothing}
- Aura/Effect: ${characterVisual.aura}
- Accessories: ${groupStyle.accessories}

VISUAL STYLE:
- Art Style: Modern low-poly 3D, clean geometric forms, professional mobile game quality
- Colors: Primary ${colors.primary}, Secondary ${colors.secondary}, Accent ${colors.accent}
- Lighting: Professional studio lighting with ${characterVisual.aura}
- Background: ${groupStyle.environment}, minimalist but thematic
- Quality: High-resolution render, smooth surfaces, vibrant but harmonious colors

SPECIFIC ELEMENTS:
${visualElements.specificElements}

MOOD & ATMOSPHERE:
The character should perfectly embody the gap between ${mbtiInfo.name} personality and ${characterInfo.name} impression, creating a compelling visual that represents "${title}".`;
  };

  // SVGキャラクター生成
  const generateSVGCharacter = (results) => {
    const { colors, characterType, mbtiType } = results;
    
    const shapePatterns = {
      DOFC: 'circle', DOFT: 'star', DOMC: 'square', DOMT: 'heart',
      DIFC: 'diamond', DIFT: 'flower', DIMC: 'butterfly', DIMT: 'wave',
      NIFC: 'crystal', NIFT: 'leaf', NIMC: 'cloud', NIMT: 'flame',
      NOFC: 'polygon', NOFT: 'spiral', NOMC: 'maze', NOMT: 'aurora',
    };
    
    const shape = shapePatterns[characterType] || 'circle';
    
    const svgElements = {
      circle: `<circle cx="200" cy="200" r="80" fill="${colors.primary}" opacity="0.8"/>`,
      star: `<path d="M200,140 L220,180 L260,180 L230,210 L240,250 L200,230 L160,250 L170,210 L140,180 L180,180 Z" fill="${colors.primary}" opacity="0.8"/>`,
      square: `<rect x="140" y="140" width="120" height="120" fill="${colors.primary}" opacity="0.8" rx="10"/>`,
      heart: `<path d="M200,250 C200,250 130,200 130,160 C130,140 150,120 170,120 C185,120 200,130 200,130 C200,130 215,120 230,120 C250,120 270,140 270,160 C270,200 200,250 200,250 Z" fill="${colors.primary}" opacity="0.8"/>`,
      diamond: `<path d="M200,140 L260,200 L200,260 L140,200 Z" fill="${colors.primary}" opacity="0.8"/>`,
      flower: `<g transform="translate(200,200)">
                 <circle r="15" fill="${colors.primary}"/>
                 <circle cx="0" cy="-30" r="20" fill="${colors.secondary}" opacity="0.8"/>
                 <circle cx="25" cy="15" r="20" fill="${colors.secondary}" opacity="0.8"/>
                 <circle cx="-25" cy="15" r="20" fill="${colors.secondary}" opacity="0.8"/>
               </g>`,
      polygon: `<polygon points="200,140 240,170 240,230 200,260 160,230 160,170" fill="${colors.primary}" opacity="0.8"/>`
    };
    
    return `
      <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${colors.light};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:0.3" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <rect width="400" height="400" fill="url(#bg-gradient)" rx="20"/>
        
        <g filter="url(#glow)">
          ${svgElements[shape] || svgElements.circle}
        </g>
        
        <circle cx="200" cy="200" r="100" fill="none" stroke="${colors.accent}" stroke-width="2" opacity="0.5"/>
        
        <text x="200" y="340" text-anchor="middle" fill="${colors.dark}" font-family="sans-serif" font-size="14" font-weight="bold">
          ${mbtiType} × ${characterType}
        </text>
      </svg>
    `;
  };

  // 共有機能
  const handleShare = async () => {
    const shareData = {
      title: 'TwinPersona診断結果',
      text: `${results.title}\nMBTI: ${results.mbtiType} ${results.mbtiInfo.name}\nCharacterCode: ${results.characterType} ${results.characterInfo.name}\nギャップ度 ${results.gapPercentage}%でした！相性のいいMBTIは${results.compatibility}です！！\n\n#TwinPersona #ツインパーソナ #MBTI #CharacterCode #${results.mbtiType} #${results.characterType}`,
      url: 'https://twin-persona.vercel.app'
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled or failed:', err);
        copyToClipboard(shareData.text);
      }
    } else {
      copyToClipboard(shareData.text);
    }
  };

  const handleShareX = () => {
    const text = `${results.title}\nMBTI: ${results.mbtiType} ${results.mbtiInfo.name}\nCharacterCode: ${results.characterType} ${results.characterInfo.name}\nギャップ度 ${results.gapPercentage}%でした！相性のいいMBTIは${results.compatibility}です！！\n\n#TwinPersona #ツインパーソナ #MBTI #CharacterCode #${results.mbtiType} #${results.characterType}`;
    
    const url = 'https://twin-persona.vercel.app';
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(xUrl, '_blank');
  };

  const handleShareToLine = () => {
    const text = `${results.title}\nMBTI: ${results.mbtiType} ${results.mbtiInfo.name}\nCharacterCode: ${results.characterType} ${results.characterInfo.name}\nギャップ度 ${results.gapPercentage}%でした！相性のいいMBTIは${results.compatibility}です！！\n\n#TwinPersona #ツインパーソナ #MBTI #CharacterCode #${results.mbtiType} #${results.characterType}`;
    
    const url = 'https://twin-persona.vercel.app';
    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(lineUrl, '_blank');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('結果をクリップボードにコピーしました！');
    });
  };

  const downloadImage = () => {
    const svgString = generateSVGCharacter(results);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 800;
      canvas.height = 800;
      ctx.drawImage(img, 0, 0, 800, 800);
      
      const link = document.createElement('a');
      link.download = `twin-persona-${results.mbtiType}-${results.characterType}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      URL.revokeObjectURL(svgUrl);
    };
    
    img.src = svgUrl;
  };

  const currentMbtiQuestion = mbtiQuestions.find((_, index) => 
    index === Object.keys(mbtiAnswers).length
  );
  
  const currentCharacterQuestion = characterQuestions.find((_, index) => 
    index === Object.keys(characterAnswers).length
  );

  const mbtiProgress = (Object.keys(mbtiAnswers).length / mbtiQuestions.length) * 100;
  const characterProgress = (Object.keys(characterAnswers).length / characterQuestions.length) * 100;

  if (currentStep === 'start') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white mb-2">
              Twin<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Persona</span>
            </h1>
            <p className="text-xl text-gray-300">ツインパーソナ診断</p>
            <div className="space-y-2">
              <p className="text-gray-400">あなたの内面と外見の</p>
              <p className="text-gray-400">ギャップを発見しよう</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl">🧠</span>
                <span className="text-white font-semibold">MBTI診断</span>
              </div>
              <p className="text-gray-300 text-sm">あなたの内面的な性格を分析</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl">✨</span>
                <span className="text-white font-semibold">印象診断</span>
              </div>
              <p className="text-gray-300 text-sm">他人から見たあなたの印象を分析</p>
            </div>
          </div>
          
          <button
            onClick={() => setCurrentStep('onboarding')}
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-cyan-700 transition duration-300 transform hover:scale-105"
          >
            診断を開始する
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 'onboarding') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-white">基本情報</h2>
            <p className="text-gray-300">より正確な診断のために教えてください</p>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="block text-white font-semibold">性別</label>
              <div className="grid grid-cols-2 gap-3">
                {['男性', '女性'].map((gender) => (
                  <button
                    key={gender}
                    onClick={() => setSelectedGender(gender)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedGender === gender
                        ? 'border-purple-400 bg-purple-400/20 text-white'
                        : 'border-gray-600 bg-white/10 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="block text-white font-semibold">職業・立場</label>
              <div className="grid grid-cols-2 gap-3">
                {['学生', '会社員', 'フリーランス', '公務員', '専業主婦/主夫', 'その他'].map((occupation) => (
                  <button
                    key={occupation}
                    onClick={() => setSelectedOccupation(occupation)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm ${
                      selectedOccupation === occupation
                        ? 'border-cyan-400 bg-cyan-400/20 text-white'
                        : 'border-gray-600 bg-white/10 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {occupation}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setCurrentStep('mbti')}
            disabled={!selectedGender || !selectedOccupation}
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-cyan-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            性格診断へ進む
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 'mbti') {
    if (Object.keys(mbtiAnswers).length < mbtiQuestions.length) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-3xl">🧠</span>
                <h2 className="text-3xl font-bold text-white">性格診断</h2>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-400 to-cyan-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${mbtiProgress}%` }}
                ></div>
              </div>
              <p className="text-gray-300">
                {Object.keys(mbtiAnswers).length + 1} / {mbtiQuestions.length}
              </p>
            </div>
            
            {currentMbtiQuestion && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 space-y-6">
                <h3 className="text-xl font-semibold text-white text-center">
                  {currentMbtiQuestion.question}
                </h3>
                
                <div className="space-y-4">
                  {currentMbtiQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleMbtiAnswer(currentMbtiQuestion.id, option.value)}
                      className="w-full p-4 text-left bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 hover:border-white/40 text-white transition-all duration-200 hover:transform hover:scale-105"
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-8">
            <div className="space-y-4">
              <div className="text-6xl">✅</div>
              <h2 className="text-3xl font-bold text-white">性格診断完了！</h2>
              <p className="text-gray-300">
                続いて、あなたの印象を分析します
              </p>
            </div>
            
            <button
              onClick={() => setCurrentStep('character')}
              className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:from-cyan-700 hover:to-purple-700 transition duration-300"
            >
              印象診断へ進む
            </button>
          </div>
        </div>
      );
    }
  }

  if (currentStep === 'character') {
    if (Object.keys(characterAnswers).length < characterQuestions.length) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-3xl">✨</span>
                <h2 className="text-3xl font-bold text-white">印象診断</h2>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${characterProgress}%` }}
                ></div>
              </div>
              <p className="text-gray-300">
                {Object.keys(characterAnswers).length + 1} / {characterQuestions.length}
              </p>
            </div>
            
            {currentCharacterQuestion && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 space-y-6">
                <h3 className="text-xl font-semibold text-white text-center">
                  {currentCharacterQuestion.question}
                </h3>
                
                <div className="space-y-4">
                  {currentCharacterQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleCharacterAnswer(currentCharacterQuestion.id, option.value)}
                      className="w-full p-4 text-left bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 hover:border-white/40 text-white transition-all duration-200 hover:transform hover:scale-105"
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-8">
            <div className="space-y-4">
              <div className="text-6xl">✅</div>
              <h2 className="text-3xl font-bold text-white">印象診断完了！</h2>
              <p className="text-gray-300">
                最後にお顔の写真をアップロードしてください（任意）
              </p>
            </div>
            
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="w-full bg-white/10 border-2 border-dashed border-white/30 text-white font-semibold py-8 px-6 rounded-lg hover:bg-white/20 hover:border-white/50 transition duration-300 cursor-pointer block"
              >
                {uploadedPhoto ? (
                  <div className="space-y-2">
                    <div className="text-2xl">📸</div>
                    <div>写真がアップロードされました</div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-2xl">📷</div>
                    <div>写真をアップロード</div>
                    <div className="text-sm text-gray-400">（スキップ可能）</div>
                  </div>
                )}
              </label>
            </div>
            
            <button
              onClick={() => setCurrentStep('generating')}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-cyan-700 transition duration-300"
            >
              結果を見る
            </button>
          </div>
        </div>
      );
    }
  }

  if (currentStep === 'generating') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-4">
            <div className="text-6xl animate-spin">⚡</div>
            <h2 className="text-3xl font-bold text-white">AI分析中...</h2>
            <p className="text-gray-300">
              あなたの診断結果を分析して<br />
              パーソナライズされたキャラクターを生成しています
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-white">性格分析 完了</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-white">印象分析 完了</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-white">キャラクター生成中...</span>
              </div>
            </div>
          </div>

          {setTimeout(() => {
            generateAIImage();
          }, 100)}
        </div>
      </div>
    );
  }

  if (currentStep === 'results' && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* ヘッダー */}
          <div className="text-center space-y-4 pt-4">
            <h1 className="text-4xl font-bold text-white">診断結果</h1>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">{results.title}</h2>
              <p className="text-lg text-gray-300">{results.mbtiType} × {results.characterType}</p>
            </div>
          </div>

          {/* メインコンテンツ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* キャラクター表示 */}
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 text-center">あなたのキャラクター</h3>
                <div 
                  className="w-full max-w-sm mx-auto"
                  dangerouslySetInnerHTML={{ __html: generateSVGCharacter(results) }}
                />
                <details className="mt-4 text-xs">
                  <summary className="text-gray-400 cursor-pointer">AI生成プロンプト（開発用）</summary>
                  <pre className="text-gray-500 mt-2 whitespace-pre-wrap text-xs bg-black/20 p-2 rounded">
                    {generateAIPrompt(results)}
                  </pre>
                </details>
              </div>

              {/* ギャップ分析 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">ギャップ分析</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">内面と外見のギャップ</span>
                    <span className="text-2xl font-bold" style={{ color: results.colors.primary }}>
                      {results.gapPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${results.gapPercentage}%`,
                        backgroundColor: results.colors.primary
                      }}
                    ></div>
                  </div>
                  <p className="text-gray-300 text-sm">
                    {results.gapPercentage >= 70 ? 'かなり大きなギャップがあります！意外性のある魅力的な人です。' :
                     results.gapPercentage >= 50 ? 'ほど良いギャップがあります。バランスの取れた印象です。' :
                     '内面と外見が一致しています。安定感のある印象を与えます。'}
                  </p>
                </div>
              </div>
            </div>

            {/* 詳細情報 */}
            <div className="space-y-4">
              {/* MBTI詳細 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">性格詳細 (MBTI)</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">{results.mbtiType}</span>
                    <span className="px-3 py-1 rounded-full text-sm font-semibold text-white" 
                          style={{ backgroundColor: results.colors.primary }}>
                      {results.mbtiInfo.name}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {results.mbtiInfo.traits.map((trait, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 rounded-full text-sm border text-white"
                        style={{ borderColor: results.colors.secondary }}
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 印象詳細 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">印象詳細 (CharacterCode)</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">{results.characterType}</span>
                    <span className="px-3 py-1 rounded-full text-sm font-semibold text-white" 
                          style={{ backgroundColor: results.colors.accent }}>
                      {results.characterInfo.name}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {results.characterInfo.traits.map((trait, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 rounded-full text-sm border text-white"
                        style={{ borderColor: results.colors.secondary }}
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 相性分析 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">相性分析</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white">相性の良いタイプ</span>
                    <span className="text-xl font-bold" style={{ color: results.colors.secondary }}>
                      {results.compatibility}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    {results.compatibility} タイプとの相性が特に良いです。お互いを補完し合える関係を築けます。
                  </p>
                </div>
              </div>

              {/* エンタメスコア */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">エンタメスコア</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: results.colors.primary }}>
                      {results.entertainmentScores.charisma}
                    </div>
                    <div className="text-gray-300 text-sm">カリスマ度</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: results.colors.secondary }}>
                      {results.entertainmentScores.friendliness}
                    </div>
                    <div className="text-gray-300 text-sm">親しみやすさ</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: results.colors.accent }}>
                      {results.entertainmentScores.mystery}
                    </div>
                    <div className="text-gray-300 text-sm">ミステリアス度</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: results.colors.primary }}>
                      {results.entertainmentScores.attractiveness}
                    </div>
                    <div className="text-gray-300 text-sm">魅力度</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* シェアボタン */}
          <div className="space-y-4">
            <div className="text-center">
              <button
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-4 px-8 rounded-lg hover:from-purple-700 hover:to-cyan-700 transition duration-300"
              >
                結果をシェアする
              </button>
            </div>

            {showShareOptions && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-semibold text-white text-center mb-4">シェア方法を選択</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    onClick={handleShareX}
                    className="bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>𝕏</span>
                    <span>Xでシェア</span>
                  </button>
                  
                  <button
                    onClick={handleShareToLine}
                    className="bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>📱</span>
                    <span>LINEでシェア</span>
                  </button>
                  
                  <button
                    onClick={downloadImage}
                    className="bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>💾</span>
                    <span>画像保存</span>
                  </button>
                </div>
                
                <button
                  onClick={handleShare}
                  className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition duration-300"
                >
                  その他の方法でシェア
                </button>
              </div>
            )}
          </div>

          {/* フッター */}
          <div className="text-center space-y-4 py-8">
            <button
              onClick={() => {
                setCurrentStep('start');
                setMbtiAnswers({});
                setCharacterAnswers({});
                setResults(null);
                setSelectedGender('');
                setSelectedOccupation('');
                setUploadedPhoto(null);
                setShowShareOptions(false);
              }}
              className="text-gray-400 hover:text-white transition duration-300"
            >
              もう一度診断する
            </button>
            <div className="text-gray-500 text-sm">
              <p>TwinPersona - ツインパーソナ診断</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

  if (currentStep === 'onboarding') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-white">基本情報</h2>
            <p className="text-gray-300">より正確な診断のために教えてください</p>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="block text-white font-semibold">性別</label>
              <div className="grid grid-cols-2 gap-3">
                {['男性', '女性'].map((gender) => (
                  <button
                    key={gender}
                    onClick={() => setSelectedGender(gender)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedGender === gender
                        ? 'border-purple-400 bg-purple-400/20 text-white'
                        : 'border-gray-600 bg-white/10 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="block text-white font-semibold">職業・立場</label>
              <div className="grid grid-cols-2 gap-3">
                {['学生', '会社員', 'フリーランス', '公務員', '専業主婦/主夫', 'その他'].map((occupation) => (
                  <button
                    key={occupation}
                    onClick={() => setSelectedOccupation(occupation)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm ${
                      selectedOccupation === occupation
                        ? 'border-cyan-400 bg-cyan-400/20 text-white'
                        : 'border-gray-600 bg-white/10 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {occupation}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setCurrentStep('mbti')}
            disabled={!selectedGender || !selectedOccupation}
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-cyan-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            性格診断へ進む
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 'mbti') {
    if (Object.keys(mbtiAnswers).length < mbtiQuestions.length) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-3xl">🧠</span>
                <h2 className="text-3xl font-bold text-white">性格診断</h2>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-400 to-cyan-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${mbtiProgress}%` }}
                ></div>
              </div>
              <p className="text-gray-300">
                {Object.keys(mbtiAnswers).length + 1} / {mbtiQuestions.length}
              </p>
            </div>
            
            {currentMbtiQuestion && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 space-y-6">
                <h3 className="text-xl font-semibold text-white text-center">
                  {currentMbtiQuestion.question}
                </h3>
                
                <div className="space-y-4">
                  {currentMbtiQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleMbtiAnswer(currentMbtiQuestion.id, option.value)}
                      className="w-full p-4 text-left bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 hover:border-white/40 text-white transition-all duration-200 hover:transform hover:scale-105"
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-8">
            <div className="space-y-4">
              <div className="text-6xl">✅</div>
              <h2 className="text-3xl font-bold text-white">性格診断完了！</h2>
              <p className="text-gray-300">
                続いて、あなたの印象を分析します
              </p>
            </div>
            
            <button
              onClick={() => setCurrentStep('character')}
              className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:from-cyan-700 hover:to-purple-700 transition duration-300"
            >
              印象診断へ進む
            </button>
          </div>
        </div>
      );
    }
  }

  if (currentStep === 'character') {
    if (Object.keys(characterAnswers).length < characterQuestions.length) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-3xl">✨</span>
                <h2 className="text-3xl font-bold text-white">印象診断</h2>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${characterProgress}%` }}
                ></div>
              </div>
              <p className="text-gray-300">
                {Object.keys(characterAnswers).length + 1} / {characterQuestions.length}
              </p>
            </div>
            
            {currentCharacterQuestion && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 space-y-6">
                <h3 className="text-xl font-semibold text-white text-center">
                  {currentCharacterQuestion.question}
                </h3>
                
                <div className="space-y-4">
                  {currentCharacterQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleCharacterAnswer(currentCharacterQuestion.id, option.value)}
                      className="w-full p-4 text-left bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 hover:border-white/40 text-white transition-all duration-200 hover:transform hover:scale-105"
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-8">
            <div className="space-y-4">
              <div className="text-6xl">✅</div>
              <h2 className="text-3xl font-bold text-white">印象診断完了！</h2>
              <p className="text-gray-300">
                最後にお顔の写真をアップロードしてください（任意）
              </p>
            </div>
            
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="w-full bg-white/10 border-2 border-dashed border-white/30 text-white font-semibold py-8 px-6 rounded-lg hover:bg-white/20 hover:border-white/50 transition duration-300 cursor-pointer block"
              >
                {uploadedPhoto ? (
                  <div className="space-y-2">
                    <div className="text-2xl">📸</div>
                    <div>写真がアップロードされました</div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-2xl">📷</div>
                    <div>写真をアップロード</div>
                    <div className="text-sm text-gray-400">（スキップ可能）</div>
                  </div>
                )}
              </label>
            </div>
            
            <button
              onClick={() => setCurrentStep('generating')}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-cyan-700 transition duration-300"
            >
              結果を見る
            </button>
          </div>
        </div>
      );
    }
  }

  if (currentStep === 'generating') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-4">
            <div className="text-6xl animate-spin">⚡</div>
            <h2 className="text-3xl font-bold text-white">AI分析中...</h2>
            <p className="text-gray-300">
              あなたの診断結果を分析して<br />
              パーソナライズされたキャラクターを生成しています
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-white">性格分析 完了</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-white">印象分析 完了</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-white">キャラクター生成中...</span>
              </div>
            </div>
          </div>

          {/* 自動で結果画面に遷移 */}
          <div className="hidden">
            {setTimeout(() => {
              generateAIImage();
            }, 100)}
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'results' && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* ヘッダー */}
          <div className="text-center space-y-4 pt-4">
            <h1 className="text-4xl font-bold text-white">診断結果</h1>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">{results.title}</h2>
              <p className="text-lg text-gray-300">{results.mbtiType} × {results.characterType}</p>
            </div>
          </div>

          {/* メインコンテンツ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* キャラクター表示 */}
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 text-center">あなたのキャラクター</h3>
                <div 
                  className="w-full max-w-sm mx-auto"
                  dangerouslySetInnerHTML={{ __html: generateSVGCharacter(results) }}
                />
                {/* AI生成プロンプト（開発用 - 本番では非表示） */}
                <details className="mt-4 text-xs">
                  <summary className="text-gray-400 cursor-pointer">AI生成プロンプト（開発用）</summary>
                  <pre className="text-gray-500 mt-2 whitespace-pre-wrap text-xs bg-black/20 p-2 rounded">
                    {generateAIPrompt(results)}
                  </pre>
                </details>
              </div>

              {/* ギャップ分析 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">ギャップ分析</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">内面と外見のギャップ</span>
                    <span className="text-2xl font-bold" style={{ color: results.colors.primary }}>
                      {results.gapPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${results.gapPercentage}%`,
                        backgroundColor: results.colors.primary
                      }}
                    ></div>
                  </div>
                  <p className="text-gray-300 text-sm">
                    {results.gapPercentage >= 70 ? 'かなり大きなギャップがあります！意外性のある魅力的な人です。' :
                     results.gapPercentage >= 50 ? 'ほど良いギャップがあります。バランスの取れた印象です。' :
                     '内面と外見が一致しています。安定感のある印象を与えます。'}
                  </p>
                </div>
              </div>
            </div>

            {/* 詳細情報 */}
            <div className="space-y-4">
              {/* MBTI詳細 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">性格詳細 (MBTI)</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">{results.mbtiType}</span>
                    <span className="px-3 py-1 rounded-full text-sm font-semibold text-white" 
                          style={{ backgroundColor: results.colors.primary }}>
                      {results.mbtiInfo.name}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {results.mbtiInfo.traits.map((trait, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 rounded-full text-sm border text-white"
                        style={{ borderColor: results.colors.secondary }}
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 印象詳細 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">印象詳細 (CharacterCode)</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">{results.characterType}</span>
                    <span className="px-3 py-1 rounded-full text-sm font-semibold text-white" 
                          style={{ backgroundColor: results.colors.accent }}>
                      {results.characterInfo.name}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {results.characterInfo.traits.map((trait, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 rounded-full text-sm border text-white"
                        style={{ borderColor: results.colors.secondary }}
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 相性分析 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">相性分析</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white">相性の良いタイプ</span>
                    <span className="text-xl font-bold" style={{ color: results.colors.secondary }}>
                      {results.compatibility}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    {results.compatibility} タイプとの相性が特に良いです。お互いを補完し合える関係を築けます。
                  </p>
                </div>
              </div>

              {/* エンタメスコア */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">エンタメスコア</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: results.colors.primary }}>
                      {results.entertainmentScores.charisma}
                    </div>
                    <div className="text-gray-300 text-sm">カリスマ度</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: results.colors.secondary }}>
                      {results.entertainmentScores.friendliness}
                    </div>
                    <div className="text-gray-300 text-sm">親しみやすさ</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: results.colors.accent }}>
                      {results.entertainmentScores.mystery}
                    </div>
                    <div className="text-gray-300 text-sm">ミステリアス度</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: results.colors.primary }}>
                      {results.entertainmentScores.attractiveness}
                    </div>
                    <div className="text-gray-300 text-sm">魅力度</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* シェアボタン */}
          <div className="space-y-4">
            <div className="text-center">
              <button
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-4 px-8 rounded-lg hover:from-purple-700 hover:to-cyan-700 transition duration-300"
              >
                結果をシェアする
              </button>
            </div>

            {showShareOptions && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-semibold text-white text-center mb-4">シェア方法を選択</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    onClick={handleShareX}
                    className="bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>𝕏</span>
                    <span>Xでシェア</span>
                  </button>
                  
                  <button
                    onClick={handleShareToLine}
                    className="bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>📱</span>
                    <span>LINEでシェア</span>
                  </button>
                  
                  <button
                    onClick={downloadImage}
                    className="bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>💾</span>
                    <span>画像保存</span>
                  </button>
                </div>
                
                <button
                  onClick={handleShare}
                  className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition duration-300"
                >
                  その他の方法でシェア
                </button>
              </div>
            )}
          </div>

          {/* シェアボタン */}
          <div className="space-y-4">
            <div className="text-center">
              <button
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-4 px-8 rounded-lg hover:from-purple-700 hover:to-cyan-700 transition duration-300"
              >
                結果をシェアする
              </button>
            </div>

            {showShareOptions && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-semibold text-white text-center mb-4">シェア方法を選択</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    onClick={handleShareX}
                    className="bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>𝕏</span>
                    <span>Xでシェア</span>
                  </button>
                  
                  <button
                    onClick={handleShareToLine}
                    className="bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>📱</span>
                    <span>LINEでシェア</span>
                  </button>
                  
                  <button
                    onClick={downloadImage}
                    className="bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>💾</span>
                    <span>画像保存</span>
                  </button>
                </div>
                
                <button
                  onClick={handleShare}
                  className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition duration-300"
                >
                  その他の方法でシェア
                </button>
              </div>
            )}
          </div>

          {/* フッター */}
          <div className="text-center space-y-4 py-8">
            <button
              onClick={() => {
                setCurrentStep('start');
                setMbtiAnswers({});
                setCharacterAnswers({});
                setResults(null);
                setSelectedGender('');
                setSelectedOccupation('');
                setUploadedPhoto(null);
                setShowShareOptions(false);
              }}
              className="text-gray-400 hover:text-white transition duration-300"
            >
              もう一度診断する
            </button>
            <div className="text-gray-500 text-sm">
              <p>TwinPersona - ツインパーソナ診断</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
