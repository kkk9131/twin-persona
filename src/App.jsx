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
  // 16タイプ対応のタイトル生成
  const combinations = {
    ENFP: {
      // 印象的グループ
      'DOFC': "愛され系アナウンサー",
      'DOFT': "カリスマアイドル",
      'DOMC': "情熱的なリーダー",
      'DOMT': "癒し系クリエイター",
      // 残像的グループ
      'DIFC': "優雅な革新者",
      'NIMC': "天使のような夢想家",
      'DIMC': "初恋系アーティスト",
      'NIFC': "都会的インフルエンサー",
      // 立体的グループ
      'NOMC': "変幻自在のエンターテイナー",
      'DIMT': "ギャップ萌えクリエイター",
      'DIFT': "愛されヒーラー",
      'NOFC': "唯一無二の表現者",
      // 感覚的グループ
      'NIMT': "前衛的アーティスト",
      'NIFT': "自由奔放な革新者",
      'NOFT': "情熱的な反逆者",
      'NOMT': "魅惑のミューズ"
    },
    INTJ: {
      // 印象的グループ
      'DOFC': "信頼の戦略家",
      'DOFT': "カリスマ建築家",
      'DOMC': "組織のブレイン",
      'DOMT': "優しき賢者",
      // 残像的グループ
      'DIFC': "洗練された知性派",
      'NIMC': "純粋な理論家",
      'DIMC': "初恋系天才",
      'NIFC': "都会的ストラテジスト",
      // 立体的グループ
      'NOMC': "謎めいた策士",
      'DIMT': "ギャップ萌え天才",
      'DIFT': "可愛い哲学者",
      'NOFC': "孤高の革新者",
      // 感覚的グループ
      'NIMT': "前衛的思想家",
      'NIFT': "クールな理論家",
      'NOFT': "反骨の知識人",
      'NOMT': "魅惑の頭脳派"
    },
    // 他のMBTIタイプも同様に16タイプ対応（デフォルト値を用意）
    DEFAULT: {
      'DOFC': "模範的なアナウンサー",
      'DOFT': "アイドルのセンター",
      'DOMC': "しっかり者のリーダー",
      'DOMT': "春の陽だまりのような人",
      'DIFC': "上品で洗練された人",
      'NIMC': "天使のような純粋さ",
      'DIMC': "初恋のときめき",
      'NIFC': "都会的でカリスマ性",
      'NOMC': "ミステリアスなカメレオン",
      'DIMT': "多面的な逆転魅力",
      'DIFT': "可愛い安心できる人",
      'NOFC': "ユニークな主人公オーラ",
      'NIMT': "エッジの効いたアーティスト",
      'NIFT': "シックな自由人",
      'NOFT': "反骨精神のロマンチスト",
      'NOMT': "グラマラスなミューズ"
    }
  };
  
  // MBTIタイプの組み合わせが定義されていない場合はデフォルトを使用
  const mbtiCombinations = combinations[mbtiType] || combinations.DEFAULT;
  const title = mbtiCombinations[characterCode];
  
  // タイトルが見つからない場合のフォールバック
  if (!title) {
    const mbtiName = mbtiResults[mbtiType]?.name || mbtiType;
    const characterName = CHARACTER_CODE_16_TYPES[characterCode]?.name || characterCode;
    return `${mbtiName}×${characterName}`;
  }
  
  return title;
};;

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
};;

const App = () => {
  const [step, setStep] = useState('start'); // start, gender, occupation, mbti, character, photo, generating, result
  const [selectedGender, setSelectedGender] = useState(null); // 男性, 女性, 非公開
  const [selectedOccupation, setSelectedOccupation] = useState(null); // 職業選択
  const [mbtiAnswers, setMbtiAnswers] = useState({});
  const [characterAnswers, setCharacterAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [results, setResults] = useState(null);
  const [isPremium, setIsPremium] = useState(false); // 課金状態管理
  const [showPaymentModal, setShowPaymentModal] = useState(false); // 決済モーダル表示
  const [accessToken, setAccessToken] = useState(null); // アクセストークン
  const [aiAdvice, setAiAdvice] = useState(null); // GEMINI APIからのアドバイス
  const [adviceLoading, setAdviceLoading] = useState(false); // アドバイス生成中
  const [adviceError, setAdviceError] = useState(null); // アドバイス生成エラー
  const [characterImage, setCharacterImage] = useState(null); // DALL-E 3 キャラクター画像
  const [imageLoading, setImageLoading] = useState(false); // 画像生成中
  const [imageError, setImageError] = useState(null); // 画像生成エラー
  const canvasRef = useRef(null);

  // MBTI結果計算
  const calculateMBTI = useCallback(() => {
    const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    Object.values(mbtiAnswers).forEach(answer => {
      scores[answer]++;
    });
    
    const result = 
      (scores.E >= scores.I ? 'E' : 'I') +
      (scores.S >= scores.N ? 'S' : 'N') +
      (scores.T >= scores.F ? 'T' : 'F') +
      (scores.J >= scores.P ? 'J' : 'P');
    
    return result;
  }, [mbtiAnswers]);

  // Character Code 16タイプ結果計算
  const calculateCharacterType = useCallback(() => {
    return calculateCharacterCode16Type(characterAnswers);
  }, [characterAnswers]);

  // 診断完了処理（API統合版）
  const completeDiagnosis = async () => {
    try {
      const mbtiType = calculateMBTI();
      const characterCode = calculateCharacterType(); // 16タイプコード
      
      // APIから詳細データを取得
      const [mbtiInfo, characterInfo] = await Promise.all([
        fetchMBTIData(mbtiType),
        analyzeCharacterCode(characterAnswers)
      ]);
      
      // 16タイプ対応の各種生成関数を呼び出し
      const title = generateTitle(mbtiType, characterCode);
      const gapAnalysis = generateGapAnalysis(mbtiType, characterCode);
      const compatibility = getCompatibility(mbtiType);
      const advice = generateAdvice(mbtiType, characterCode);
      const scores = generateScores(mbtiType, characterCode);
      
      // 結果データ構造を統一（16タイプ対応）
      setResults({
        mbti: mbtiType,
        character: characterCode, // 旧互換性のため
        characterCode: characterCode, // 16タイプコード
        title,
        mbtiInfo: mbtiInfo || mbtiResults[mbtiType], // フォールバック
        characterInfo: characterInfo || CHARACTER_CODE_16_TYPES[characterCode] || { 
          code: characterCode,
          name: CHARACTER_CODE_16_TYPES[characterCode]?.name || characterCode,
          group: CHARACTER_CODE_16_TYPES[characterCode]?.group || '特別'
        },
        gapAnalysis,
        compatibility,
        advice,
        scores
      });
      setStep('result');
    } catch (error) {
      console.error('診断処理中にエラーが発生しました:', error);
      // エラー時はローカルデータで処理続行
      const mbtiType = calculateMBTI();
      const characterCode = calculateCharacterType(); // 16タイプコード
      
      // 16タイプ対応の各種生成関数を呼び出し
      const title = generateTitle(mbtiType, characterCode);
      const gapAnalysis = generateGapAnalysis(mbtiType, characterCode);
      const compatibility = getCompatibility(mbtiType);
      const advice = generateAdvice(mbtiType, characterCode);
      const scores = generateScores(mbtiType, characterCode);
      
      // 結果データ構造を統一（16タイプ対応）
      setResults({
        mbti: mbtiType,
        character: characterCode, // 旧互換性のため
        characterCode: characterCode, // 16タイプコード
        title,
        mbtiInfo: mbtiResults[mbtiType],
        characterInfo: CHARACTER_CODE_16_TYPES[characterCode] || {
          code: characterCode,
          name: CHARACTER_CODE_16_TYPES[characterCode]?.name || characterCode,
          group: CHARACTER_CODE_16_TYPES[characterCode]?.group || '特別'
        },
        gapAnalysis,
        compatibility,
        advice,
        scores
      });
      setStep('result');
    }
  };;

  // GEMINI APIからアドバイス生成
  const generateAIAdvice = async () => {
    if (!results) return;
    
    setAdviceLoading(true);
    setAdviceError(null);
    
    try {
      // 16タイプ対応：characterCodeを使用
      const advice = await AdviceService.generateAdvice({
        mbtiType: results.mbti,
        characterCode: results.characterInfo.code, // 16タイプのcharacterCode
        gapAnalysis: results.gapAnalysis.level || 'medium',
        accessToken: accessToken // アクセストークンを追加
      });
      
      if (advice.success) {
        setAiAdvice(advice.advice);
      } else {
        setAdviceError(advice.error || 'アドバイス生成に失敗しました');
        // エラー時でもフォールバックアドバイスがある場合は表示
        if (advice.advice) {
          setAiAdvice(advice.advice);
        }
      }
    } catch (error) {
      console.error('AI advice generation failed:', error);
      setAdviceError(error.message || 'アドバイス生成に失敗しました');
    } finally {
      setAdviceLoading(false);
    }
  };;

  // DALL-E 3 キャラクター画像生成
  const generateCharacterImage = async () => {
    if (!results) return;
    
    setImageLoading(true);
    setImageError(null);
    
    try {
      const response = await ImageService.generateCharacterImage(
        results.mbti,
        results.characterInfo.code,
        results.scores,
        selectedGender === '男性' ? 'male' : selectedGender === '女性' ? 'female' : 'neutral',
        selectedOccupation,
        accessToken // アクセストークンを追加
      );
      
      setCharacterImage(response);
    } catch (error) {
      console.error('Character image generation failed:', error);
      setImageError(error.message || 'キャラクター画像生成に失敗しました');
    } finally {
      setImageLoading(false);
    }
  };

  // シェア画像生成
  const generateShareImage = useCallback(() => {
    if (!results || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // キャンバスサイズ設定
    canvas.width = 800;
    canvas.height = 800;
    
    // 背景
    const gradient = ctx.createLinearGradient(0, 0, 800, 800);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 800);
    
    // タイトル
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(results.title, 400, 150);
    
    // ギャップ分析
    ctx.font = '28px Arial';
    ctx.fillText(results.gapAnalysis.statement, 400, 220);
    
    // MBTI結果
    ctx.font = '32px Arial';
    ctx.fillText(`MBTI: ${results.mbti}`, 400, 300);
    ctx.fillText(`(${results.mbtiInfo.name})`, 400, 340);
    
    // Character Code結果（16タイプ）
    ctx.fillText(`印象: ${results.characterInfo.code} (${results.characterInfo.name})`, 400, 420);
    
    // グループ情報
    ctx.font = '24px Arial';
    ctx.fillText(`${CHARACTER_CODE_GROUPS[results.characterInfo.group]?.name}グループ`, 400, 460);
    
    // スコア表示
    const scores = Object.entries(results.scores);
    scores.forEach(([key, value], index) => {
      const y = 520 + index * 35;
      ctx.fillText(`${key}: ${value}%`, 400, y);
    });
    
    // フッター
    ctx.font = '20px Arial';
    ctx.fillText('TwinPersona診断', 400, 750);
  }, [results]);;

  // X（Twitter）シェア機能
  const handleShareX = () => {
    if (!results) return;
    
    const shareText = `私の診断結果は「${results.title}」でした！\n${results.mbti} × ${results.characterInfo.code}「${results.characterInfo.name}」\n${CHARACTER_CODE_GROUPS[results.characterInfo.group]?.name}グループ\n${results.gapAnalysis.statement}\n\n#TwinPersona #ツインパーソナ #MBTI #CharacterCode #${results.mbti} #${results.characterInfo.code}`;
    const shareUrl = window.location.href;
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    
    window.open(xUrl, '_blank', 'width=550,height=420');
  };;

  // LINEシェア機能
  const handleShareLine = () => {
    if (!results) return;
    
    const shareText = `私の診断結果は「${results.title}」でした！\n${results.mbti} × ${results.characterInfo.code}「${results.characterInfo.name}」\n${CHARACTER_CODE_GROUPS[results.characterInfo.group]?.name}グループ\n${results.gapAnalysis.statement}\n\n#TwinPersona #ツインパーソナ #MBTI #CharacterCode #${results.mbti} #${results.characterInfo.code}\n${window.location.href}`;
    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(shareText)}`;
    
    window.open(lineUrl, '_blank');
  };;

  // 汎用シェア機能（Web Share API）
  const handleShare = async () => {
    if (!results) return;

    const shareText = `私の診断結果は「${results.title}」でした！\n${results.mbti} × ${results.characterInfo.code}「${results.characterInfo.name}」\n${CHARACTER_CODE_GROUPS[results.characterInfo.group]?.name}グループ\n${results.gapAnalysis.statement}\n\n#TwinPersona #ツインパーソナ #MBTI #CharacterCode #${results.mbti} #${results.characterInfo.code}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TwinPersona診断結果',
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        // シェアがキャンセルされた場合など
        console.log('シェアがキャンセルされました');
      }
    } else {
      // Web Share APIが利用できない場合はクリップボードにコピー
      try {
        await navigator.clipboard.writeText(shareText + '\n' + window.location.href);
        alert('クリップボードにコピーしました！');
      } catch (err) {
        console.error('コピーに失敗しました:', err);
      }
    }
  };;

  // 画像ダウンロード
  const handleDownload = () => {
    generateShareImage();
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `twinpersona-${results.mbti}-${results.characterInfo.code}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };;

  // 写真アップロード処理
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

  // 前の質問に戻る処理
  const handlePreviousQuestion = () => {
    if (step === 'mbti') {
      if (currentQuestion > 0) {
        setCurrentQuestion(currentQuestion - 1);
        // 前の回答を削除
        setMbtiAnswers(prev => {
          const newAnswers = { ...prev };
          delete newAnswers[currentQuestion];
          return newAnswers;
        });
      } else {
        // 最初の質問の場合は職業選択画面に戻る
        setStep('occupation');
        setMbtiAnswers({});
        setCurrentQuestion(0);
      }
    } else if (step === 'character') {
      if (currentQuestion > 0) {
        setCurrentQuestion(currentQuestion - 1);
        // 前の回答を削除
        setCharacterAnswers(prev => {
          const newAnswers = { ...prev };
          delete newAnswers[currentQuestion];
          return newAnswers;
        });
      } else {
        // Character診断の最初の質問の場合はMBTI診断の最後に戻る
        setStep('mbti');
        setCurrentQuestion(mbtiQuestions.length - 1);
        setCharacterAnswers({});
      }
    } else if (step === 'photo') {
      // 写真アップロード画面からCharacter診断の最後に戻る
      setStep('character');
      setCurrentQuestion(CHARACTER_CODE_16_QUESTIONS.length - 1);
      setUploadedPhoto(null);
    }
  };

  // MBTI質問の回答処理
  const handleMbtiAnswer = (questionIndex, answerType) => {
    setMbtiAnswers(prev => ({ ...prev, [questionIndex]: answerType }));
    
    if (questionIndex < mbtiQuestions.length - 1) {
      setCurrentQuestion(questionIndex + 1);
    } else {
      setStep('character');
      setCurrentQuestion(0);
    }
  };

  // Character質問の回答処理（16タイプ対応）
  const handleCharacterAnswer = (questionIndex, answer) => {
    setCharacterAnswers(prev => ({ ...prev, [questionIndex]: answer }));
    
    if (questionIndex < CHARACTER_CODE_16_QUESTIONS.length - 1) {
      setCurrentQuestion(questionIndex + 1);
    } else {
      setStep('photo');
    }
  };;

  // 写真アップロード後の処理
  const handlePhotoNext = () => {
    setStep('generating');
    // 3秒後に結果表示（非同期処理対応）
    setTimeout(async () => {
      await completeDiagnosis();
    }, 3000);
  };

  // 最初からやり直し
  const handleRestart = () => {
    setStep('start');
    setSelectedGender(null);
    setSelectedOccupation(null);
    setMbtiAnswers({});
    setCharacterAnswers({});
    setCurrentQuestion(0);
    setUploadedPhoto(null);
    setResults(null);
    setCharacterImage(null);
    setAiAdvice(null);
  };

  // 決済成功時の処理
  const handlePaymentSuccess = async (paymentIntentId) => {
    try {
      // トークンを生成（実際のトークンはWebhookで生成されるため、paymentIntentIdを一時的に使用）
      const token = `payment_${paymentIntentId}`;
      setAccessToken(token);
      setIsPremium(true);
      setShowPaymentModal(false);
      
      console.log('決済成功！プレミアム機能がアンロックされました');
      
      // 診断開始
      setStep('gender');
    } catch (error) {
      console.error('決済後処理エラー:', error);
    }
  };

  // 診断開始処理
  const handleStartDiagnosis = () => {
    if (isPremium) {
      // プレミアム選択済みで決済完了済み → 直接診断開始
      setStep('gender');
    } else {
      // 無料プラン選択 → 直接診断開始
      setStep('gender');
    }
  };

  // プレミアム選択時の決済モーダル表示
  const handleSelectPremium = () => {
    setIsPremium(true);
    setShowPaymentModal(true);
  };

  // 性別選択処理
  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    setStep('occupation');
  };

  // 職業選択処理
  const handleOccupationSelect = (occupation) => {
    setSelectedOccupation(occupation);
    setStep('mbti');
    setCurrentQuestion(0);
  };

  // レンダリング
  return (
    <div className="min-h-screen bg-rich-gradient font-sans particle-bg">
      {/* 開始画面 */}
      {step === 'start' && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="animate-float mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gradient mb-4">
                TwinPersona
              </h1>
              <p className="text-base sm:text-lg text-dark-300 mb-2">
                あなたの内面と外見のギャップを発見
              </p>
              <p className="text-xs sm:text-sm text-dark-400">
                MBTI診断 × Character Code診断
              </p>
            </div>
            
            <div className="glass-strong rounded-2xl shadow-rich p-6 sm:p-8 mb-8 hover-lift">
              <h2 className="text-xl sm:text-2xl font-bold text-dark-100 mb-4">
                隠れた二面性を発見しよう
              </h2>
              <p className="text-sm sm:text-base text-dark-300 mb-6 leading-relaxed">
                28問のMBTI診断と20問のCharacter Code診断で、<br className="hidden sm:block" />
                <span className="sm:hidden">　</span>あなたの内面の性格と外見の印象のギャップを可視化します。
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 mb-6 text-xs sm:text-sm">
                <div className="bg-gradient-to-br from-analysts-primary/20 to-analysts-accent/10 p-5 rounded-xl border border-analysts-primary/30 backdrop-blur-sm">
                  <h3 className="font-semibold text-analysts-primary mb-2">🧠 内面分析</h3>
                  <p className="text-dark-300">MBTI理論による本質的な性格タイプを診断</p>
                </div>
                <div className="bg-gradient-to-br from-diplomats-primary/20 to-diplomats-accent/10 p-5 rounded-xl border border-diplomats-primary/30 backdrop-blur-sm">
                  <h3 className="font-semibold text-diplomats-primary mb-2">✨ 印象分析</h3>
                  <p className="text-dark-300">他者から見た第一印象のタイプを分析</p>
                </div>
              </div>
              
              {/* プラン選択 */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-dark-100 mb-4">診断プランを選択</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* 無料プラン */}
                  <div 
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      !isPremium 
                        ? 'border-sentinels-primary bg-sentinels-primary/10' 
                        : 'border-dark-500 bg-dark-700/30 hover:border-dark-400'
                    }`}
                    onClick={() => { setIsPremium(false); setAccessToken(null); }}
                  >
                    <div className="text-center">
                      <h4 className="font-bold text-dark-100 mb-2">無料プラン</h4>
                      <p className="text-2xl font-bold text-sentinels-primary mb-2">¥0</p>
                      <div className="text-xs text-dark-300 space-y-1">
                        <div>✅ MBTI診断結果</div>
                        <div>✅ Character Code診断</div>
                        <div>✅ エンタメスコア</div>
                        <div>✅ 相性分析</div>
                        <div className="text-dark-500">❌ AI詳細分析</div>
                        <div className="text-dark-500">❌ 実用的アドバイス</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* プレミアムプラン */}
                  <div 
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isPremium 
                        ? 'border-explorers-primary bg-explorers-primary/10' 
                        : 'border-dark-500 bg-dark-700/30 hover:border-dark-400'
                    }`}
                    onClick={handleSelectPremium}
                  >
                    <div className="text-center">
                      <h4 className="font-bold text-dark-100 mb-2">プレミアムプラン</h4>
                      <p className="text-2xl font-bold text-explorers-primary mb-2">¥500</p>
                      <div className="text-xs text-dark-300 space-y-1">
                        <div>✅ すべての無料機能</div>
                        <div className="text-explorers-primary">✨ AI詳細分析</div>
                        <div className="text-explorers-primary">✨ 実用的アドバイス</div>
                        <div className="text-explorers-primary">✨ 個人化された洞察</div>
                        <div className="text-explorers-primary">✨ 高品質な結果</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleStartDiagnosis}
                className="btn-primary text-lg px-8 py-4"
              >
                <Sparkles className="w-5 h-5 inline mr-2" />
                {isPremium ? 'プレミアム診断を始める' : '無料診断を始める'}
              </button>
            </div>
            
            <p className="text-xs text-dark-400">
              所要時間: 約8-15分 | データは保存されません
              {isPremium && <span className="text-explorers-primary ml-2">| プレミアム機能でより詳細な分析</span>}
            </p>
          </div>
        </div>
      )}

      {/* 性別選択画面 */}
      {step === 'gender' && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="max-w-xl mx-auto">
            <div className="bg-dark-800/80 backdrop-blur-md rounded-3xl p-8 border border-dark-700/50 shadow-2xl">
              {/* ヘッダー */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-analysts-primary to-diplomats-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  基本情報
                </h2>
                <p className="text-dark-300 text-sm">
                  より正確なキャラクター生成のため<br />
                  性別を教えてください
                </p>
              </div>

              {/* 性別選択 */}
              <div className="space-y-4 mb-8">
                {[
                  { value: '男性', icon: '♂', color: 'from-blue-500 to-blue-600' },
                  { value: '女性', icon: '♀', color: 'from-pink-500 to-pink-600' },
                  { value: '非公開', icon: '○', color: 'from-gray-500 to-gray-600' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleGenderSelect(option.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all hover:scale-105 ${
                      selectedGender === option.value
                        ? 'border-analysts-primary bg-analysts-primary/10'
                        : 'border-dark-600 bg-dark-700/50 hover:border-dark-500'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${option.color} rounded-xl flex items-center justify-center text-white text-xl font-bold`}>
                        {option.icon}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{option.value}</h3>
                        <p className="text-dark-400 text-sm">
                          {option.value === '男性' && 'Male character generation'}
                          {option.value === '女性' && 'Female character generation'} 
                          {option.value === '非公開' && 'Gender-neutral character'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* 戻るボタン */}
              <button
                onClick={() => setStep('start')}
                className="w-full bg-dark-700 text-white py-3 rounded-xl hover:bg-dark-600 transition-colors flex items-center justify-center space-x-2"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>戻る</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 職業選択画面 */}
      {step === 'occupation' && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="max-w-xl mx-auto">
            <div className="bg-dark-800/80 backdrop-blur-md rounded-3xl p-8 border border-dark-700/50 shadow-2xl">
              {/* ヘッダー */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-sentinels-primary to-explorers-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  職業・役割
                </h2>
                <p className="text-dark-300 text-sm">
                  キャラクターの衣装に反映される<br />
                  職業や役割を選択してください
                </p>
              </div>

              {/* 職業選択 */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { value: 'ビジネス', icon: '💼', desc: 'スーツ・フォーマル' },
                  { value: 'クリエイティブ', icon: '🎨', desc: 'アーティスト・デザイナー' },
                  { value: 'テック', icon: '💻', desc: 'IT・エンジニア' },
                  { value: '医療', icon: '🏥', desc: '医師・看護師' },
                  { value: '教育', icon: '📚', desc: '教師・講師' },
                  { value: 'サービス', icon: '🤝', desc: '接客・サービス業' },
                  { value: '学生', icon: '🎓', desc: '学生・制服' },
                  { value: 'アーティスト', icon: '🎭', desc: '芸術・表現者' },
                  { value: 'スポーツ', icon: '⚽', desc: 'アスリート・トレーナー' },
                  { value: 'その他', icon: '👤', desc: 'カジュアル・私服' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleOccupationSelect(option.value)}
                    className={`p-4 rounded-xl border-2 text-center transition-all hover:scale-105 ${
                      selectedOccupation === option.value
                        ? 'border-sentinels-primary bg-sentinels-primary/10'
                        : 'border-dark-600 bg-dark-700/50 hover:border-dark-500'
                    }`}
                  >
                    <div className="text-2xl mb-2">{option.icon}</div>
                    <h3 className="text-white font-semibold text-sm mb-1">{option.value}</h3>
                    <p className="text-dark-400 text-xs">{option.desc}</p>
                  </button>
                ))}
              </div>

              {/* 戻るボタン */}
              <button
                onClick={handleStartPremium}
                className="w-full bg-dark-700 text-white py-3 rounded-xl hover:bg-dark-600 transition-colors flex items-center justify-center space-x-2"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>戻る</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MBTI診断画面 */}
      {step === 'mbti' && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="max-w-2xl mx-auto">
            {/* プログレスバー */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-dark-300">MBTI診断</span>
                <span className="text-sm text-dark-300">
                  {currentQuestion + 1} / {mbtiQuestions.length}
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${((currentQuestion + 1) / mbtiQuestions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="question-card">
              <h2 className="text-xl font-bold text-dark-100 mb-6">
                {mbtiQuestions[currentQuestion].question}
              </h2>
              
              <div className="space-y-4">
                {mbtiQuestions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleMbtiAnswer(currentQuestion, option.type)}
                    className="option-button"
                  >
                    <span className="block text-dark-200">{option.text}</span>
                  </button>
                ))}
              </div>
              
              {/* 戻るボタン */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3 sm:gap-0">
                <button
                  onClick={handlePreviousQuestion}
                  className="btn-secondary flex items-center gap-2 w-full sm:w-auto"
                >
                  <ChevronLeft className="w-4 h-4" />
                  戻る
                </button>
                <span className="text-xs text-dark-400 text-center">
                  {currentQuestion === 0 ? 'スタート画面に戻ります' : '前の質問に戻ります'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Character Code診断画面 */}
      {step === 'character' && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="max-w-2xl mx-auto">
            {/* プログレスバー */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-dark-300">Character Code診断</span>
                <span className="text-sm text-dark-300">
                  {currentQuestion + 1} / {CHARACTER_CODE_16_QUESTIONS.length}
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${((currentQuestion + 1) / CHARACTER_CODE_16_QUESTIONS.length) * 100}%`,
                    background: 'linear-gradient(90deg, #4fd1c7, #81e6d9, #319795)'
                  }}
                ></div>
              </div>
            </div>

            <div className="question-card">
              <h2 className="text-xl font-bold text-dark-100 mb-6">
                {CHARACTER_CODE_16_QUESTIONS[currentQuestion].question}
              </h2>
              
              <div className="space-y-4">
                {CHARACTER_CODE_16_QUESTIONS[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleCharacterAnswer(currentQuestion, option)}
                    className="option-button"
                  >
                    <span className="block text-dark-200">{option.text}</span>
                  </button>
                ))}
              </div>
              
              {/* 戻るボタン */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3 sm:gap-0">
                <button
                  onClick={handlePreviousQuestion}
                  className="btn-secondary flex items-center gap-2 w-full sm:w-auto"
                >
                  <ChevronLeft className="w-4 h-4" />
                  戻る
                </button>
                <span className="text-xs text-dark-400 text-center">
                  {currentQuestion === 0 ? 'MBTI診断に戻ります' : '前の質問に戻ります'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 写真アップロード画面 */}
      {step === 'photo' && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="question-card">
              <h2 className="text-2xl font-bold text-dark-100 mb-4">
                顔写真のアップロード（任意）
              </h2>
              <p className="text-dark-300 mb-6 leading-relaxed">
                Character Code診断の精度向上のため、お顔の写真をアップロードできます。<br />
                <span className="text-sm text-explorers-primary">※AI分析により、より正確な印象診断が可能になります</span>
              </p>
              
              <div className="mb-6">
                <div className="border-2 border-dashed border-dark-500 rounded-xl p-8 mb-4 bg-dark-700/30 backdrop-blur-sm hover:border-dark-400 transition-all duration-300">
                  <Camera className="w-12 h-12 text-dark-400 mx-auto mb-4" />
                  {uploadedPhoto ? (
                    <div>
                      <img 
                        src={uploadedPhoto} 
                        alt="アップロード済み" 
                        className="w-32 h-32 object-cover rounded-xl mx-auto mb-4 border-2 border-sentinels-primary shadow-glow-green"
                      />
                      <p className="text-sentinels-primary font-medium">写真がアップロードされました</p>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label
                        htmlFor="photo-upload"
                        className="btn-secondary cursor-pointer inline-block"
                      >
                        写真を選択
                      </label>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                  onClick={handlePreviousQuestion}
                  className="btn-secondary flex items-center gap-2 w-full sm:w-auto order-2 sm:order-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  戻る
                </button>
                
                <button
                  onClick={handlePhotoNext}
                  className="btn-primary flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2"
                >
                  <ChevronRight className="w-5 h-5" />
                  診断結果を生成
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI生成待機画面 */}
      {step === 'generating' && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="question-card">
              <div className="animate-pulse-soft mb-6">
                <Sparkles className="w-16 h-16 text-analysts-primary mx-auto mb-4 drop-shadow-lg" style={{filter: 'drop-shadow(0 0 10px rgba(157, 116, 232, 0.5))'}} />
              </div>
              <h2 className="text-2xl font-bold text-dark-100 mb-4">
                あなたの二面性を分析中...
              </h2>
              <p className="text-dark-300 mb-6 leading-relaxed">
                AIがあなたの回答を分析して、<br />
                ユニークなキャラクターを生成しています
              </p>
              
              <div className="bg-gradient-to-r from-dark-700/50 to-dark-600/50 rounded-xl p-6 mb-6 border border-dark-500/50 backdrop-blur-sm">
                <div className="text-sm text-dark-300 space-y-3">
                  <p className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-analysts-primary rounded-full animate-pulse"></span>
                    🧠 性格タイプを解析中...
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-diplomats-primary rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></span>
                    ✨ 印象パターンを分析中...
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-sentinels-primary rounded-full animate-pulse" style={{animationDelay: '1s'}}></span>
                    🎨 専用キャラクターを生成中...
                  </p>
                </div>
              </div>
              
              <div className="progress-bar">
                <div className="progress-fill animate-pulse" style={{width: '100%', background: 'linear-gradient(90deg, #9d74e8, #4fd1c7, #48bb78, #ed8936)'}}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 結果表示画面 */}
      {step === 'result' && results && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="max-w-4xl mx-auto">
            {/* メインタイトル */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient mb-2">
                {results.title}
              </h1>
              <div className="text-lg sm:text-xl font-semibold text-dark-200 mb-2">
                <span className="text-analysts-primary">{results.mbti}</span> × <span className="text-diplomats-primary">{results.characterInfo.code}</span>
              </div>
              <p className="text-sm sm:text-base lg:text-lg text-dark-300">
                {results.gapAnalysis.statement}
              </p>
            </div>

            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* キャラクター表示 */}
              <div className="result-card text-center hover-lift relative">
                <h3 className="text-xl font-bold text-dark-100 mb-4">
                  あなたのキャラクター
                  {!isPremium && (
                    <span className="ml-2 text-xs bg-explorers-primary/20 text-explorers-primary px-2 py-1 rounded-full">
                      プレミアム
                    </span>
                  )}
                </h3>
                
                {characterImage?.imageUrl ? (
                  <div className="w-48 h-48 mx-auto mb-4 bg-gradient-to-br from-dark-700/50 to-dark-600/50 rounded-2xl border border-dark-500/50 shadow-glow overflow-hidden">
                    <img 
                      src={characterImage.imageUrl} 
                      alt={`${results.mbti} × ${results.characterInfo.code} キャラクター`}
                      className="w-full h-full object-cover rounded-2xl"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    {/* フォールバックSVG */}
                    <div 
                      style={{ display: 'none' }}
                      className="w-full h-full flex items-center justify-center"
                      dangerouslySetInnerHTML={{ 
                        __html: generateEnhancedCharacterSVG(results.mbti, results.characterInfo.code) 
                      }}
                    />
                  </div>
                ) : (
                  <div className="relative">
                    {/* デフォルトSVGキャラクター */}
                    <div 
                      className="w-48 h-48 mx-auto mb-4 p-4 bg-gradient-to-br from-dark-700/50 to-dark-600/50 rounded-2xl border border-dark-500/50 shadow-glow"
                      dangerouslySetInnerHTML={{ 
                        __html: generateEnhancedCharacterSVG(results.mbti, results.characterInfo.code) 
                      }}
                    />
                    
                    {/* AI生成オーバーレイ */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-4">
                        {imageLoading ? (
                          <>
                            <div className="w-12 h-12 bg-gradient-to-r from-explorers-primary to-explorers-accent rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                              <RefreshCw className="w-6 h-6 text-white animate-spin" />
                            </div>
                            <h4 className="text-sm font-bold text-white mb-1">AI生成中...</h4>
                            <p className="text-xs text-dark-300">
                              あなた専用の<br />
                              キャラクターを作成中
                            </p>
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-12 bg-gradient-to-r from-explorers-primary to-explorers-accent rounded-full flex items-center justify-center mx-auto mb-3">
                              <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-sm font-bold text-white mb-1">AIキャラクター</h4>
                            <p className="text-xs text-dark-300 mb-3">
                              あなた専用の<br />
                              キャラクターを生成
                            </p>
                            <button
                              onClick={generateCharacterImage}
                              disabled={imageLoading}
                              className="bg-gradient-to-r from-explorers-primary to-explorers-accent text-white px-4 py-2 rounded-lg text-xs font-semibold hover:from-explorers-accent hover:to-explorers-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              キャラクターを生成
                            </button>
                            {imageError && (
                              <p className="text-xs text-red-400 mt-2">
                                {imageError}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="text-sm text-dark-300 space-y-1">
                  <p><strong className="text-dark-200">MBTI:</strong> <span className="text-analysts-primary font-semibold">{results.mbti}</span> ({results.mbtiInfo.name})</p>
                  <p><strong className="text-dark-200">印象:</strong> <span className="text-diplomats-primary font-semibold">{results.characterInfo.code}</span> ({results.characterInfo.name})</p>
                  <p className="text-xs text-dark-400 mt-2">
                    全人口の約{results.mbtiInfo.percentage}%のMBTIタイプ
                  </p>
                </div>
              </div>

              {/* MBTI詳細分析 */}
              <div className="result-card hover-lift">
                <h3 className="text-xl font-bold text-dark-100 mb-4">
                  🧠 性格詳細分析 ({results.mbti})
                </h3>
                
                {/* MBTI 4軸分析 */}
                <div className="bg-dark-700/50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-dark-200 mb-2 text-sm">MBTI 4軸分析</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-analysts-primary font-medium">
                        {results.mbtiInfo.axes.e_i === 'E' ? 'E (Extrovert)' : 'I (Introvert)'}
                      </span>
                      <span className="text-dark-400 ml-1">
                        {results.mbtiInfo.axes.e_i === 'E' ? '外向的・社交的' : '内向的・思慮深い'}
                      </span>
                    </div>
                    <div>
                      <span className="text-analysts-primary font-medium">
                        {results.mbtiInfo.axes.s_n === 'S' ? 'S (Sensing)' : 'N (iNtuition)'}
                      </span>
                      <span className="text-dark-400 ml-1">
                        {results.mbtiInfo.axes.s_n === 'S' ? '現実的・実践的' : '直感的・理論的'}
                      </span>
                    </div>
                    <div>
                      <span className="text-analysts-primary font-medium">
                        {results.mbtiInfo.axes.t_f === 'T' ? 'T (Thinking)' : 'F (Feeling)'}
                      </span>
                      <span className="text-dark-400 ml-1">
                        {results.mbtiInfo.axes.t_f === 'T' ? '論理的・客観的' : '感情的・共感的'}
                      </span>
                    </div>
                    <div>
                      <span className="text-analysts-primary font-medium">
                        {results.mbtiInfo.axes.j_p === 'J' ? 'J (Judging)' : 'P (Perceiving)'}
                      </span>
                      <span className="text-dark-400 ml-1">
                        {results.mbtiInfo.axes.j_p === 'J' ? '計画的・組織的' : '柔軟・適応的'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-dark-200 mb-2">性格の特徴</h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(results.mbtiInfo.characteristics || []).map((char, index) => (
                        <span key={index} className="px-2 py-1 bg-analysts-primary/20 text-analysts-primary rounded-md text-xs">
                          {char}
                        </span>
                      ))}
                    </div>
                    <p className="text-dark-300 text-xs leading-relaxed">
                      {results.mbtiInfo.firstImpression}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-dark-200">シーン別の性格</h4>
                    
                    <div className="bg-dark-700/30 p-3 rounded-lg">
                      <h5 className="font-medium text-explorers-primary text-xs mb-1">💼 仕事場面</h5>
                      <p className="text-dark-300 text-xs">{results.mbtiInfo.situations?.work || 'データがありません'}</p>
                    </div>
                    
                    <div className="bg-dark-700/30 p-3 rounded-lg">
                      <h5 className="font-medium text-sentinels-primary text-xs mb-1">👥 社交場面</h5>
                      <p className="text-dark-300 text-xs">{results.mbtiInfo.situations?.social || 'データがありません'}</p>
                    </div>
                    
                    <div className="bg-dark-700/30 p-3 rounded-lg">
                      <h5 className="font-medium text-analysts-primary text-xs mb-1">💕 恋愛場面</h5>
                      <p className="text-dark-300 text-xs">{results.mbtiInfo.situations?.romance || 'データがありません'}</p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-dark-400 text-center">
                    このMBTIタイプは全体の約{results.mbtiInfo.percentage}%
                  </p>
                </div>
              </div>

              {/* Character Code詳細分析 */}
              <div className="result-card hover-lift">
                <h3 className="text-xl font-bold text-dark-100 mb-4">
                  ✨ 印象詳細分析 ({results.characterInfo.code})
                </h3>
                
                {/* 16タイプグループ情報 */}
                <div className="bg-gradient-to-r from-diplomats-primary/20 to-diplomats-accent/10 rounded-lg p-4 mb-4 border border-diplomats-primary/30">
                  <h4 className="font-semibold text-diplomats-primary mb-2 text-sm flex items-center gap-2">
                    🏷️ {CHARACTER_CODE_GROUPS[results.characterInfo.group]?.name}グループ
                  </h4>
                  <p className="text-dark-300 text-xs mb-3 leading-relaxed">
                    {CHARACTER_CODE_GROUPS[results.characterInfo.group]?.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {(CHARACTER_CODE_GROUPS[results.characterInfo.group]?.characteristics || []).map((char, index) => (
                      <span key={index} className="px-2 py-1 bg-diplomats-primary/20 text-diplomats-primary rounded-md text-xs">
                        {char}
                      </span>
                    ))}
                  </div>
                  
                  {/* 同じグループの他のタイプ */}
                  <div className="mt-3">
                    <h5 className="font-medium text-dark-200 text-xs mb-2">同じグループの他のタイプ</h5>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      {CHARACTER_CODE_GROUPS[results.characterInfo.group]?.types
                        .filter(typeCode => typeCode !== results.characterInfo.code)
                        ?.map((typeCode) => (
                          <div key={typeCode} className="bg-dark-700/30 rounded px-2 py-1">
                            <span className="text-diplomats-primary font-medium">{typeCode}</span>
                            <span className="text-dark-400 ml-1">
                              {CHARACTER_CODE_16_TYPES[typeCode]?.name}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Character Code軸の説明 */}
                <div className="bg-dark-700/50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-dark-200 mb-2 text-sm">Character Code 4軸分析</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-diplomats-primary font-medium">
                        {results.characterInfo.axes.d_n === 'N' ? 'N (Neutral)' : 'D (Deep)'}
                      </span>
                      <span className="text-dark-400 ml-1">
                        {results.characterInfo.axes.d_n === 'N' ? '中性的・洗練' : '深い・包容力'}
                      </span>
                    </div>
                    <div>
                      <span className="text-diplomats-primary font-medium">
                        {results.characterInfo.axes.o_i === 'I' ? 'I (Intense)' : 'O (Open)'}
                      </span>
                      <span className="text-dark-400 ml-1">
                        {results.characterInfo.axes.o_i === 'I' ? '強烈・印象的' : '開放的・親しみ'}
                      </span>
                    </div>
                    <div>
                      <span className="text-diplomats-primary font-medium">
                        {results.characterInfo.axes.f_m === 'F' ? 'F (Formal)' : 'M (Mild)'}
                      </span>
                      <span className="text-dark-400 ml-1">
                        {results.characterInfo.axes.f_m === 'F' ? '正式・上品' : '穏やか・自然'}
                      </span>
                    </div>
                    <div>
                      <span className="text-diplomats-primary font-medium">
                        {results.characterInfo.axes.c_t === 'C' ? 'C (Clear)' : 'T (Tender)'}
                      </span>
                      <span className="text-dark-400 ml-1">
                        {results.characterInfo.axes.c_t === 'C' ? '明確・親切' : '優しい・魅力的'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-dark-200 mb-2">第一印象の特徴</h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(results.characterInfo.characteristics || []).map((char, index) => (
                        <span key={index} className="px-2 py-1 bg-diplomats-primary/20 text-diplomats-primary rounded-md text-xs">
                          {char}
                        </span>
                      ))}
                    </div>
                    <p className="text-dark-300 text-xs leading-relaxed">
                      {results.characterInfo.firstImpression}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-dark-200">シーン別の印象</h4>
                    
                    <div className="bg-dark-700/30 p-3 rounded-lg">
                      <h5 className="font-medium text-explorers-primary text-xs mb-1">💼 仕事場面</h5>
                      <p className="text-dark-300 text-xs">{results.characterInfo.situations?.work || 'データがありません'}</p>
                    </div>
                    
                    <div className="bg-dark-700/30 p-3 rounded-lg">
                      <h5 className="font-medium text-sentinels-primary text-xs mb-1">👥 社交場面</h5>
                      <p className="text-dark-300 text-xs">{results.characterInfo.situations?.social || 'データがありません'}</p>
                    </div>
                    
                    <div className="bg-dark-700/30 p-3 rounded-lg">
                      <h5 className="font-medium text-analysts-primary text-xs mb-1">💕 恋愛場面</h5>
                      <p className="text-dark-300 text-xs">{results.characterInfo.situations?.romance || 'データがありません'}</p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-dark-400 text-center">
                    この印象タイプは全体の約{results.characterInfo.percentage}%
                  </p>
                </div>
              </div>

              {/* エンタメスコア */}
              <div className="result-card hover-lift">
                <h3 className="text-xl font-bold text-dark-100 mb-4">
                  エンタメスコア
                </h3>
                <div className="space-y-5">
                  {Object.entries(results.scores).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-dark-200">{key}</span>
                        <span className="text-sm font-bold text-dark-100 bg-dark-600 px-2 py-1 rounded-md">{value}%</span>
                      </div>
                      <div className="score-bar">
                        <div 
                          className="score-fill"
                          style={{ width: `${value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 相性分析 */}
              <div className="result-card hover-lift">
                <h3 className="text-xl font-bold text-dark-100 mb-4">
                  相性分析
                </h3>
                <div className="space-y-5">
                  {Object.entries(results.compatibility).map(([key, types]) => (
                    <div key={key}>
                      <h4 className="font-medium text-dark-200 mb-3">{key}</h4>
                      <div className="flex flex-wrap gap-2">
                        {(types || []).map((type, index) => (
                          <span 
                            key={index}
                            className="px-3 py-2 bg-gradient-to-r from-sentinels-primary/20 to-sentinels-accent/10 text-sentinels-primary border border-sentinels-primary/30 rounded-full text-sm font-medium backdrop-blur-sm"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* アドバイス */}
              <div className="result-card hover-lift relative">
                <h3 className="text-xl font-bold text-dark-100 mb-4">
                  実用的アドバイス
                  {!isPremium && (
                    <span className="ml-2 text-xs bg-explorers-primary/20 text-explorers-primary px-2 py-1 rounded-full">
                      プレミアム
                    </span>
                  )}
                </h3>
                
                {isPremium ? (
                  <div className="space-y-5">
                    {!aiAdvice && !adviceLoading ? (
                      <div className="text-center py-8">
                        <button
                          onClick={generateAIAdvice}
                          disabled={adviceLoading}
                          className="btn-primary"
                        >
                          <Sparkles className="w-5 h-5 inline mr-2" />
                          AIアドバイスを生成する
                        </button>
                      </div>
                    ) : adviceLoading ? (
                      <div className="text-center py-8">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-400 mb-3" />
                        <p className="text-dark-300">AIがあなた専用のアドバイスを生成中...</p>
                      </div>
                    ) : adviceError ? (
                      <div className="text-center py-8">
                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg mb-4">
                          <p className="text-red-400 text-sm mb-3">{adviceError}</p>
                          <button 
                            onClick={generateAIAdvice}
                            className="text-red-400 hover:text-red-300 text-sm underline"
                          >
                            もう一度試す
                          </button>
                        </div>
                      </div>
                    ) : aiAdvice ? (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-sm text-dark-300 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <span className="text-blue-400 font-semibold">{results.mbti}</span> × <span className="text-purple-400 font-semibold">{results.characterInfo.code}</span> 専用のAIアドバイス
                          </div>
                          <button
                            onClick={generateAIAdvice}
                            disabled={adviceLoading}
                            className="text-dark-400 hover:text-dark-200 transition-colors text-sm flex items-center"
                            title="新しいアドバイスを生成"
                          >
                            <RefreshCw className={`w-4 h-4 mr-1 ${adviceLoading ? 'animate-spin' : ''}`} />
                            更新
                          </button>
                        </div>
                        
                        {/* キャリア */}
                        <div className="p-4 bg-gradient-to-r from-dark-700/30 to-dark-600/30 rounded-xl border border-dark-500/30 backdrop-blur-sm">
                          <h4 className="font-medium text-dark-200 mb-3 flex items-center gap-2">
                            <span className="text-lg">💼</span>
                            <span className="text-explorers-primary">仕事・キャリア</span>
                          </h4>
                          <div className="space-y-2">
                            {(aiAdvice.career || []).map((tip, index) => (
                              <p key={index} className="text-sm text-dark-300 leading-relaxed">
                                • {tip}
                              </p>
                            ))}
                          </div>
                        </div>

                        {/* 人間関係 */}
                        <div className="p-4 bg-gradient-to-r from-dark-700/30 to-dark-600/30 rounded-xl border border-dark-500/30 backdrop-blur-sm">
                          <h4 className="font-medium text-dark-200 mb-3 flex items-center gap-2">
                            <span className="text-lg">🤝</span>
                            <span className="text-explorers-primary">人間関係</span>
                          </h4>
                          <div className="space-y-2">
                            {(aiAdvice.relationships || []).map((tip, index) => (
                              <p key={index} className="text-sm text-dark-300 leading-relaxed">
                                • {tip}
                              </p>
                            ))}
                          </div>
                        </div>

                        {/* 恋愛 */}
                        <div className="p-4 bg-gradient-to-r from-dark-700/30 to-dark-600/30 rounded-xl border border-dark-500/30 backdrop-blur-sm">
                          <h4 className="font-medium text-dark-200 mb-3 flex items-center gap-2">
                            <span className="text-lg">💕</span>
                            <span className="text-explorers-primary">恋愛・パートナーシップ</span>
                          </h4>
                          <div className="space-y-2">
                            {(aiAdvice.romance || []).map((tip, index) => (
                              <p key={index} className="text-sm text-dark-300 leading-relaxed">
                                • {tip}
                              </p>
                            ))}
                          </div>
                        </div>

                        {/* 自己成長 */}
                        <div className="p-4 bg-gradient-to-r from-dark-700/30 to-dark-600/30 rounded-xl border border-dark-500/30 backdrop-blur-sm">
                          <h4 className="font-medium text-dark-200 mb-3 flex items-center gap-2">
                            <span className="text-lg">🌱</span>
                            <span className="text-explorers-primary">自己成長</span>
                          </h4>
                          <div className="space-y-2">
                            {(aiAdvice.growth || []).map((tip, index) => (
                              <p key={index} className="text-sm text-dark-300 leading-relaxed">
                                • {tip}
                              </p>
                            ))}
                          </div>
                        </div>

                        {/* ライフスタイル */}
                        <div className="p-4 bg-gradient-to-r from-dark-700/30 to-dark-600/30 rounded-xl border border-dark-500/30 backdrop-blur-sm">
                          <h4 className="font-medium text-dark-200 mb-3 flex items-center gap-2">
                            <span className="text-lg">🎨</span>
                            <span className="text-explorers-primary">ライフスタイル</span>
                          </h4>
                          <div className="space-y-2">
                            {(aiAdvice.lifestyle || []).map((tip, index) => (
                              <p key={index} className="text-sm text-dark-300 leading-relaxed">
                                • {tip}
                              </p>
                            ))}
                          </div>
                        </div>

                        {/* ストレス管理 */}
                        <div className="p-4 bg-gradient-to-r from-dark-700/30 to-dark-600/30 rounded-xl border border-dark-500/30 backdrop-blur-sm">
                          <h4 className="font-medium text-dark-200 mb-3 flex items-center gap-2">
                            <span className="text-lg">🧘</span>
                            <span className="text-explorers-primary">ストレス管理</span>
                          </h4>
                          <div className="space-y-2">
                            {(aiAdvice.stress || []).map((tip, index) => (
                              <p key={index} className="text-sm text-dark-300 leading-relaxed">
                                • {tip}
                              </p>
                            ))}
                          </div>
                        </div>

                        <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg">
                          <p className="text-dark-300 text-xs text-center">
                            💡 このアドバイスは AI によって生成されており、参考情報として活用してください
                          </p>
                        </div>
                      </>
                    ) : null}
                  </div>
                ) : (
                  <div className="relative">
                    {/* ぼかしコンテンツ */}
                    <div className="space-y-5 blur-sm select-none pointer-events-none">
                      <div className="p-4 bg-gradient-to-r from-dark-700/30 to-dark-600/30 rounded-xl border border-dark-500/30 backdrop-blur-sm">
                        <h4 className="font-medium text-dark-200 mb-3 flex items-center gap-2">
                          <span className="text-lg">💼</span>
                          <span className="text-explorers-primary">仕事</span>
                        </h4>
                        <p className="text-sm text-dark-300 leading-relaxed">
                          あなたの特性を活かした仕事でのアプローチ方法や、同僚との効果的なコミュニケーションの取り方について、AIが詳細に分析したアドバイスをお届けします。
                        </p>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-dark-700/30 to-dark-600/30 rounded-xl border border-dark-500/30 backdrop-blur-sm">
                        <h4 className="font-medium text-dark-200 mb-3 flex items-center gap-2">
                          <span className="text-lg">👥</span>
                          <span className="text-explorers-primary">友達</span>
                        </h4>
                        <p className="text-sm text-dark-300 leading-relaxed">
                          あなたの性格と印象のギャップを理解した上で、より良い友人関係を築くための具体的なコミュニケーション戦略をAIが提案します。
                        </p>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-dark-700/30 to-dark-600/30 rounded-xl border border-dark-500/30 backdrop-blur-sm">
                        <h4 className="font-medium text-dark-200 mb-3 flex items-center gap-2">
                          <span className="text-lg">💕</span>
                          <span className="text-explorers-primary">恋愛</span>
                        </h4>
                        <p className="text-sm text-dark-300 leading-relaxed">
                          恋愛関係において、あなたの内面と外見のギャップを魅力として活用する方法や、理想的なパートナーシップを築くためのアドバイスを提供します。
                        </p>
                      </div>
                    </div>
                    
                    {/* アップグレードオーバーレイ */}
                    <div className="absolute inset-0 flex items-center justify-center bg-dark-900/80 backdrop-blur-sm rounded-xl">
                      <div className="text-center p-6">
                        <div className="mb-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-explorers-primary to-explorers-accent rounded-full flex items-center justify-center mx-auto mb-3">
                            <Sparkles className="w-8 h-8 text-white" />
                          </div>
                          <h4 className="text-lg font-bold text-white mb-2">AI詳細分析</h4>
                          <p className="text-sm text-dark-300 leading-relaxed">
                            あなただけのパーソナライズされた<br />
                            実用的アドバイスを表示
                          </p>
                        </div>
                        <button
                          onClick={() => setIsPremium(true)}
                          className="bg-gradient-to-r from-explorers-primary to-explorers-accent text-white px-6 py-3 rounded-xl font-semibold hover:from-explorers-accent hover:to-explorers-primary transition-all"
                        >
                          AIアドバイスを見る
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* アクションボタン */}
            <div className="mt-8">
              {/* シェアボタン群 */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 mb-4">
                <button
                  onClick={handleShareX}
                  className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Xでシェア
                </button>
                
                <button
                  onClick={handleShareLine}
                  className="bg-[#00B900] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#009900] transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                  </svg>
                  LINEでシェア
                </button>
                
                <button
                  onClick={handleShare}
                  className="btn-primary"
                >
                  <Share2 className="w-5 h-5 inline mr-2" />
                  その他でシェア
                </button>
              </div>
              
              {/* その他のアクション */}
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => {
                    generateShareImage();
                    setTimeout(handleDownload, 100);
                  }}
                  className="btn-secondary"
                >
                  <Download className="w-5 h-5 inline mr-2" />
                  画像をダウンロード
                </button>
                
                <button
                  onClick={handleRestart}
                  className="btn-secondary"
                >
                  もう一度診断
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 隠しキャンバス（画像生成用） */}
      <canvas ref={canvasRef} className="hidden" />

      {/* 決済モーダル */}
      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default App;
