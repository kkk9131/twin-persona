import React, { useState } from 'react';
import { Share2, Download, Heart, Star, Users, Zap, Eye, Gift } from 'lucide-react';
import all256Titles from '../titles-256.js';

// 全256通りのMBTI×CharacterCodeタイトル定義
const all256TitleCombinations = {
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
    'NOMT': "洞察力でインスピレーション人"
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
    'NOMT': "好奇心でインスピレーション人"
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
    'NOMT': "決断力で魅力的人"
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
    'NOMT': "適応性で魅力的人"
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
    'NOMT': "思いやりでインスピレーション人"
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
    'NOMT': "理想主義でインスピレーション人"
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
    'NOMT': "組織的で魅力的人"
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
    'NOMT': "社交的で魅力的人"
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
    'NOMT': "組織的でインスピレーション人"
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
    'NOMT': "実用的でインスピレーション人"
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
    'NOMT': "決断力で魅力的人"
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
    'NOMT': "責任感で魅力的人"
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
    'NOMT': "独立的でインスピレーション人"
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
    'NOMT': "思いやりでインスピレーション人"
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
    'NOMT': "適応性で魅力的人"
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
    'NOMT': "柔軟性で魅力的人"
  }
};

// MBTI グループ定義
const getMBTIGroup = (mbtiType) => {
  const analysts = ['INTJ', 'INTP', 'ENTJ', 'ENTP'];
  const diplomats = ['INFJ', 'INFP', 'ENFJ', 'ENFP'];
  const sentinels = ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'];
  const explorers = ['ISTP', 'ISFP', 'ESTP', 'ESFP'];

  if (analysts.includes(mbtiType)) return 'Analyst';
  if (diplomats.includes(mbtiType)) return 'Diplomat';
  if (sentinels.includes(mbtiType)) return 'Sentinel';
  if (explorers.includes(mbtiType)) return 'Explorer';
  return 'Unknown';
};

// 統一カラーパレット
const unifiedColorPalette = {
  Analyst: {
    primary: '#8B5CF6', // purple-500
    secondary: '#A78BFA', // purple-400
    accent: '#6D28D9' // purple-700
  },
  Diplomat: {
    primary: '#06B6D4', // cyan-500
    secondary: '#67E8F9', // cyan-300  
    accent: '#0891B2' // cyan-600
  },
  Sentinel: {
    primary: '#10B981', // emerald-500
    secondary: '#6EE7B7', // emerald-300
    accent: '#059669' // emerald-600
  },
  Explorer: {
    primary: '#F59E0B', // amber-500
    secondary: '#FCD34D', // amber-300
    accent: '#D97706' // amber-600
  }
};

// MBTIデータ
const mbtiResults = {
  INTJ: {
    name: "建築家",
    description: "想像力豊かな戦略家で、あらゆる事柄に計画を立てます。",
    traits: ["戦略的", "独立的", "洞察力", "革新的", "完璧主義"]
  },
  INTP: {
    name: "論理学者",
    description: "貪欲な知識欲を持つ革新的な発明家です。",
    traits: ["論理的", "創造的", "好奇心", "客観的", "柔軟性"]
  },
  ENTJ: {
    name: "指揮官",
    description: "大胆で想像力豊かな強い意志を持つ指導者です。",
    traits: ["指導力", "効率的", "決断力", "組織的", "野心的"]
  },
  ENTP: {
    name: "討論者",
    description: "賢くて好奇心旺盛な思考家で、知的挑戦を断ることはできません。",
    traits: ["革新的", "機知", "適応性", "エネルギッシュ", "創造的"]
  },
  INFJ: {
    name: "提唱者",
    description: "静かで神秘的ですが、人々にとても深いインスピレーションを与える理想主義者です。",
    traits: ["理想主義", "洞察力", "思いやり", "直感的", "献身的"]
  },
  INFP: {
    name: "仲介者",
    description: "詩人気質で親切な利他主義者で、いつでも理想のために、素晴らしいことをする準備ができています。",
    traits: ["創造的", "共感的", "理想主義", "柔軟性", "価値観"]
  },
  ENFJ: {
    name: "主人公",
    description: "カリスマ性があり、人々を励ますリーダーで、聞く人々を魅了します。",
    traits: ["カリスマ的", "共感的", "組織的", "励まし", "責任感"]
  },
  ENFP: {
    name: "運動家",
    description: "情熱的で独創性があり社交的な自由人で、常に笑顔になる理由を見つけることができます。",
    traits: ["熱狂的", "創造的", "社交的", "直感的", "柔軟性"]
  },
  ISTJ: {
    name: "管理者",
    description: "実用的で事実に基づく信頼できるタイプで、その信頼性は当てにされます。",
    traits: ["責任感", "実用的", "組織的", "伝統的", "信頼性"]
  },
  ISFJ: {
    name: "擁護者",
    description: "とても献身的で温かい擁護者で、いつでも愛する人たちを守る準備ができています。",
    traits: ["思いやり", "責任感", "実用的", "協調的", "献身的"]
  },
  ESTJ: {
    name: "幹部",
    description: "優秀な管理者で、物事や人々を管理することに長けている、生まれながらのリーダーです。",
    traits: ["組織的", "実用的", "決断力", "責任感", "効率的"]
  },
  ESFJ: {
    name: "領事",
    description: "非常に思いやりがあり社交的で人気者の、いつでも人助けをする準備ができています。",
    traits: ["協調的", "思いやり", "責任感", "社交的", "伝統的"]
  },
  ISTP: {
    name: "巨匠",
    description: "大胆で実践的な実験者で、あらゆる種類の道具を使いこなします。",
    traits: ["実用的", "適応性", "独立的", "論理的", "冷静"]
  },
  ISFP: {
    name: "冒険家",
    description: "柔軟性があり魅力的な芸術家で、常に新しい可能性を模索しています。",
    traits: ["芸術的", "柔軟性", "思いやり", "価値観", "控えめ"]
  },
  ESTP: {
    name: "起業家",
    description: "賢くてエネルギッシュで、とても優れた知覚力を持った、真に人生を楽しむ人です。",
    traits: ["活動的", "現実的", "適応性", "社交的", "実用的"]
  },
  ESFP: {
    name: "エンターテイナー",
    description: "自発的でエネルギッシュで熱狂的な人で、周りの人々と一緒にいる時間を心から楽しみます。",
    traits: ["社交的", "楽観的", "柔軟性", "共感的", "エネルギッシュ"]
  }
};

// Character Codeデータ
const characterResults = {
  DOFC: {
    name: "模範的なアナウンサー",
    description: "信頼できて親しみやすい、誰からも愛される正統派の魅力",
    traits: ["信頼できる", "親しみやすい", "正統派", "安心感", "品格"]
  },
  DOFT: {
    name: "元気なアイドルセンター",
    description: "華やかでエネルギッシュ、みんなを明るくする魅力的な存在",
    traits: ["華やか", "エネルギッシュ", "魅力的", "輝く", "人気"]
  },
  DOMC: {
    name: "整理されたリーダー",
    description: "統率力があり整然としている、頼れる実直なリーダータイプ",
    traits: ["統率力", "整然", "実直", "責任感", "頼れる"]
  },
  DOMT: {
    name: "優しい春の陽光",
    description: "温かくて癒し系、穏やかで優しい安らぎを与える存在",
    traits: ["温かい", "癒し系", "穏やか", "優しい", "安らぎ"]
  },
  DIFC: {
    name: "穏やかな洗練美",
    description: "上品で洗練された、エレガントで知的な美しさ",
    traits: ["上品", "洗練", "エレガント", "知的", "品のある"]
  },
  NIMC: {
    name: "夢幻的な清楚美",
    description: "清楚で純粋な、夢見がちで透明感のある神秘的な魅力",
    traits: ["清楚", "純粋", "夢見がち", "透明感", "神秘的"]
  },
  DIMC: {
    name: "ドキドキの初恋",
    description: "初々しくて可愛らしい、純情で心躍る甘い魅力",
    traits: ["初々しい", "可愛らしい", "純情", "心躍る", "甘い"]
  },
  NIFC: {
    name: "都会的なカリスマ",
    description: "洗練されたカリスマ性、都会的でクールな魅力",
    traits: ["洗練", "カリスマ性", "都会的", "クール", "魅力的"]
  },
  NOMC: {
    name: "神秘的なカメレオン",
    description: "変幻自在でミステリアス、多面的で神秘的な不思議な魅力",
    traits: ["変幻自在", "ミステリアス", "多面的", "神秘的", "不思議"]
  },
  DIMT: {
    name: "多面的な逆転魅力",
    description: "ギャップのある意外性、多面的で驚きの魅力",
    traits: ["ギャップ", "意外性", "多面的", "驚き", "魅力的"]
  },
  DIFT: {
    name: "かわいい安らぎの場所",
    description: "可愛くて安らぎを与える、居心地良い癒しの存在",
    traits: ["可愛い", "安らぎ", "居心地良い", "癒し", "温かい"]
  },
  NOFC: {
    name: "独特な主人公",
    description: "個性的でユニークな、主人公のような特別で印象的な存在",
    traits: ["個性的", "ユニーク", "主人公", "特別", "印象的"]
  },
  NIMT: {
    name: "エッジの効いたアーティスト",
    description: "アーティスティックでエッジの効いた、創造的で感性的な独創性",
    traits: ["アーティスティック", "エッジ", "創造的", "感性的", "独創的"]
  },
  NIFT: {
    name: "シックな自由人",
    description: "自由でシックな、個性的で洗練された独立的な魅力",
    traits: ["自由", "シック", "個性的", "洗練", "独立的"]
  },
  NOFT: {
    name: "反抗的なロマンチスト",
    description: "ロマンチックで反抗的な、情熱的で自由な魅力",
    traits: ["ロマンチック", "反抗的", "情熱的", "自由", "魅力的"]
  },
  NOMT: {
    name: "華やかなミューズ",
    description: "華やかでインスピレーションを与える、芸術的で輝く存在",
    traits: ["華やか", "インスピレーション", "魅力的", "芸術的", "輝く"]
  }
};

// MBTIテスト質問
const mbtiQuestions = [
  // E vs I
  { question: "パーティーで知らない人と話すのは", options: ["とても楽しい", "少し疲れる"], types: ["E", "I"] },
  { question: "休日の過ごし方として好むのは", options: ["友人と外出", "一人でゆっくり"], types: ["E", "I"] },
  { question: "新しい環境では", options: ["すぐに打ち解ける", "慣れるまで時間がかかる"], types: ["E", "I"] },
  { question: "チームで作業する時", options: ["アイデアをすぐ共有する", "よく考えてから発言する"], types: ["E", "I"] },
  { question: "ストレス発散方法は", options: ["人と話すこと", "一人の時間を作ること"], types: ["E", "I"] },
  { question: "会議やグループ活動で", options: ["積極的に参加する", "聞く方が多い"], types: ["E", "I"] },
  { question: "電話をかける時", options: ["思い立ったらすぐかける", "必要な時だけかける"], types: ["E", "I"] },

  // S vs N
  { question: "物事を理解する時", options: ["具体的な事実から", "全体的な概念から"], types: ["S", "N"] },
  { question: "新しいことを学ぶ時", options: ["実践を通して", "理論を理解してから"], types: ["S", "N"] },
  { question: "話をする時", options: ["具体例を多く使う", "抽象的な表現を使う"], types: ["S", "N"] },
  { question: "問題解決では", options: ["今までの経験を活かす", "新しい方法を考える"], types: ["S", "N"] },
  { question: "興味を持つのは", options: ["現実的で実用的なもの", "可能性や将来性のあるもの"], types: ["S", "N"] },
  { question: "詳細について", options: ["重要で見逃せない", "大枠が分かれば十分"], types: ["S", "N"] },
  { question: "伝統や慣習に対して", options: ["尊重し従う傾向", "疑問を持ち変えたい傾向"], types: ["S", "N"] },

  // T vs F
  { question: "決断を下す時", options: ["論理的分析を重視", "人への影響を重視"], types: ["T", "F"] },
  { question: "他人を評価する時", options: ["能力や実績を見る", "人柄や努力を見る"], types: ["T", "F"] },
  { question: "批判を受けた時", options: ["内容を客観的に検討", "まず感情的になる"], types: ["T", "F"] },
  { question: "チームで意見が分かれた時", options: ["最も合理的な案を支持", "皆が納得できる案を探す"], types: ["T", "F"] },
  { question: "人との関係では", options: ["公平性を重視する", "調和を重視する"], types: ["T", "F"] },
  { question: "仕事で大切にするのは", options: ["効率と成果", "人間関係と協力"], types: ["T", "F"] },
  { question: "友人が悩んでいる時", options: ["解決策を提案する", "気持ちに共感する"], types: ["T", "F"] },

  // J vs P
  { question: "計画について", options: ["詳細に立てて実行する", "大まかに決めて柔軟に対応"], types: ["J", "P"] },
  { question: "締切のある仕事は", options: ["早めに取りかかる", "直前になって本気を出す"], types: ["J", "P"] },
  { question: "旅行の準備は", options: ["事前に詳しく調べる", "現地で決めることも多い"], types: ["J", "P"] },
  { question: "予定が変更になると", options: ["少しストレスを感じる", "特に気にならない"], types: ["J", "P"] },
  { question: "机や部屋の状態は", options: ["いつも整理整頓", "多少散らかっていても平気"], types: ["J", "P"] },
  { question: "買い物をする時", options: ["リストを作って計画的に", "その場の気分で決める"], types: ["J", "P"] },
  { question: "新しい可能性が出てきた時", options: ["既存の計画を優先", "新しい選択肢を検討"], types: ["J", "P"] }
];

// Character Code質問
const characterQuestions = [
  // Dynamic vs Natural
  { question: "ファッションでは", options: ["流行を意識したスタイル", "自分らしさを大切にしたスタイル"], codes: ["D", "N"] },
  { question: "人との会話では", options: ["積極的にリードする", "相手に合わせて自然に"], codes: ["D", "N"] },
  { question: "新しい環境では", options: ["自分から場を盛り上げる", "周りの様子を見て溶け込む"], codes: ["D", "N"] },

  // Impressive vs Friendly  
  { question: "第一印象では", options: ["印象に残る個性を重視", "親しみやすさを重視"], codes: ["I", "F"] },
  { question: "グループでの立ち位置は", options: ["リーダーや中心的役割", "みんなと仲良くサポート役"], codes: ["I", "F"] },
  { question: "自分の魅力は", options: ["独特な個性や才能", "温かさや優しさ"], codes: ["I", "F"] },

  // Modern vs Traditional
  { question: "価値観について", options: ["新しい考え方を積極的に取り入れる", "伝統的な価値観も大切にする"], codes: ["M", "T"] },
  { question: "ライフスタイルは", options: ["常に変化を求める", "安定した日常を好む"], codes: ["M", "T"] },
  { question: "物事への取り組み方は", options: ["革新的なアプローチを好む", "確実で着実な方法を選ぶ"], codes: ["M", "T"] },

  // Cool vs Cute
  { question: "理想的な印象は", options: ["クールで洗練された印象", "可愛らしくて親しみやすい印象"], codes: ["C", "U"] },
  { question: "ファッションの好みは", options: ["シャープでスタイリッシュ", "柔らかくて温かみのある"], codes: ["C", "U"] },
  { question: "表現スタイルは", options: ["知的で落ち着いた雰囲気", "明るくて愛らしい雰囲気"], codes: ["C", "U"] }
];

// 相性データ
const compatibilityData = {
  INTJ: "ENFP",
  INTP: "ENFJ", 
  ENTJ: "INFP",
  ENTP: "INFJ",
  INFJ: "ENTP",
  INFP: "ENTJ",
  ENFJ: "INTP",
  ENFP: "INTJ",
  ISTJ: "ESFP",
  ISFJ: "ESTP",
  ESTJ: "ISFP", 
  ESFJ: "ISTP",
  ISTP: "ESFJ",
  ISFP: "ESTJ",
  ESTP: "ISFJ",
  ESFP: "ISTJ"
};

// レアリティデータ
const rarityData = {
  INTJ: 2.1, INTP: 3.3, ENTJ: 1.8, ENTP: 2.8,
  INFJ: 1.5, INFP: 4.4, ENFJ: 2.5, ENFP: 8.1,
  ISTJ: 11.6, ISFJ: 13.8, ESTJ: 8.7, ESFJ: 12.3,
  ISTP: 5.4, ISFP: 8.8, ESTP: 4.3, ESFP: 8.5
};

// タイトル生成関数
const generateTitle = (mbtiType, characterType) => {
  return all256TitleCombinations[mbtiType]?.[characterType] || `${mbtiType}×${characterType}`;
};

// 相性取得
const getCompatibility = (mbtiType) => {
  return compatibilityData[mbtiType] || 'ENFP';
};

// ギャップ分析生成
const generateGapAnalysis = (mbtiType, characterType) => {
  const mbtiGroup = getMBTIGroup(mbtiType);
  const mbtiRarity = rarityData[mbtiType];
  const characterRarity = Math.random() * 15 + 5; // 5-20%の範囲

  const gapPercentage = Math.round(Math.abs(mbtiRarity - characterRarity) * 3.5 + Math.random() * 20 + 20);

  let description, interpretation;

  if (gapPercentage >= 80) {
    description = "非常に大きなギャップ";
    interpretation = "内面と外見の印象に大きな違いがあり、初対面の人を驚かせることが多いかもしれません。この意外性が大きな魅力となっています。";
  } else if (gapPercentage >= 60) {
    description = "かなりのギャップ";
    interpretation = "第一印象と実際の性格にしっかりとしたギャップがあります。相手に新鮮な驚きを与える魅力的な特徴です。";
  } else if (gapPercentage >= 40) {
    description = "程よいギャップ";
    interpretation = "適度なギャップがあり、人間関係で良い意味でのサプライズを提供できます。バランスの良い魅力を持っています。";
  } else if (gapPercentage >= 20) {
    description = "少しのギャップ";
    interpretation = "内面と外見がほぼ一致していて、相手に安心感を与えます。一貫性のある魅力が持ち味です。";
  } else {
    description = "ほぼ一致";
    interpretation = "見た目と中身が非常によく一致していて、誠実で信頼できる印象を与えます。";
  }

  return {
    percentage: gapPercentage,
    description,
    interpretation
  };
};

// エンタメスコア生成
const generateScores = (mbtiType, characterType, gapPercentage) => {
  const mbtiGroup = getMBTIGroup(mbtiType);
  const baseScores = {
    charisma: Math.random() * 30 + 50,
    friendliness: Math.random() * 30 + 50,
    mystery: Math.random() * 30 + 50,
    gap: gapPercentage,
    rarity: (100 - rarityData[mbtiType] * 5),
    attractiveness: Math.random() * 30 + 50
  };

  // MBTIグループによる調整
  switch (mbtiGroup) {
    case 'Analyst':
      baseScores.mystery += 15;
      baseScores.charisma += 10;
      break;
    case 'Diplomat':
      baseScores.charisma += 15;
      baseScores.friendliness += 10;
      break;
    case 'Sentinel':
      baseScores.friendliness += 15;
      baseScores.attractiveness += 5;
      break;
    case 'Explorer':
      baseScores.attractiveness += 15;
      baseScores.gap += 5;
      break;
  }

  // Character Typeによる調整
  if (characterType.includes('F')) baseScores.friendliness += 10;
  if (characterType.includes('C')) baseScores.mystery += 10;
  if (characterType.includes('D')) baseScores.charisma += 10;
  if (characterType.includes('I')) baseScores.attractiveness += 5;

  // スコアを0-100の範囲に調整
  Object.keys(baseScores).forEach(key => {
    baseScores[key] = Math.max(0, Math.min(100, Math.round(baseScores[key])));
  });

  return baseScores;
};

// スコアラベル
const getScoreLabel = (scoreKey) => {
  const labels = {
    charisma: "カリスマ度",
    friendliness: "親しみやすさ",  
    mystery: "ミステリアス度",
    gap: "ギャップ度",
    rarity: "レアリティ", 
    attractiveness: "魅力度"
  };
  return labels[scoreKey] || scoreKey;
};

// キャラクターSVG生成
const generateEnhancedCharacterSVG = (mbtiType, characterType) => {
  const group = getMBTIGroup(mbtiType);
  const colors = unifiedColorPalette[group];

  return (
    <svg width="150" height="150" viewBox="0 0 150 150" className="text-white">
      <defs>
        <linearGradient id={`grad-${mbtiType}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} />
          <stop offset="100%" stopColor={colors.accent} />
        </linearGradient>
      </defs>
      
      {/* キャラクター基本形 */}
      <circle cx="75" cy="75" r="60" fill={`url(#grad-${mbtiType})`} opacity="0.9"/>
      
      {/* 顔の特徴 */}
      <circle cx="65" cy="65" r="3" fill="white" opacity="0.9"/>
      <circle cx="85" cy="65" r="3" fill="white" opacity="0.9"/>
      <path d="M 65 85 Q 75 95 85 85" stroke="white" strokeWidth="2" fill="none" opacity="0.9"/>
      
      {/* Character Typeに基づく装飾 */}
      {characterType.includes('F') && (
        <circle cx="75" cy="45" r="8" fill={colors.secondary} opacity="0.7"/>
      )}
      {characterType.includes('C') && (
        <rect x="70" y="40" width="10" height="10" fill={colors.secondary} opacity="0.7"/>
      )}
      {characterType.includes('D') && (
        <polygon points="75,35 80,45 70,45" fill={colors.secondary} opacity="0.7"/>
      )}
      
      {/* MBTIグループに基づくパターン */}
      {group === 'Analyst' && (
        <circle cx="75" cy="75" r="40" fill="none" stroke={colors.secondary} strokeWidth="2" opacity="0.5"/>
      )}
      {group === 'Diplomat' && (
        <path d="M 45 75 Q 75 45 105 75 Q 75 105 45 75" fill={colors.secondary} opacity="0.3"/>
      )}
    </svg>
  );
};

// 結果計算関数
const calculateResults = (mbtiAnswers, characterAnswers, onboardingData) => {
  // MBTI計算
  let E = 0, I = 0, S = 0, N = 0, T = 0, F = 0, J = 0, P = 0;

  Object.values(mbtiAnswers).forEach((answer, index) => {
    const question = mbtiQuestions[index];
    const selectedType = question.types[answer];
    
    switch(selectedType) {
      case 'E': E++; break;
      case 'I': I++; break;
      case 'S': S++; break;
      case 'N': N++; break;
      case 'T': T++; break;
      case 'F': F++; break;
      case 'J': J++; break;
      case 'P': P++; break;
    }
  });

  const mbtiType = `${E >= I ? 'E' : 'I'}${S >= N ? 'S' : 'N'}${T >= F ? 'T' : 'F'}${J >= P ? 'J' : 'P'}`;

  // Character Code計算
  let D = 0, N_char = 0, I_char = 0, F_char = 0, M = 0, T_char = 0, C = 0, U = 0;

  Object.values(characterAnswers).forEach((answer, index) => {
    const question = characterQuestions[index];
    const selectedCode = question.codes[answer];
    
    switch(selectedCode) {
      case 'D': D++; break;
      case 'N': N_char++; break;
      case 'I': I_char++; break;
      case 'F': F_char++; break;
      case 'M': M++; break;
      case 'T': T_char++; break;
      case 'C': C++; break;
      case 'U': U++; break;
    }
  });

  const characterType = `${D >= N_char ? 'D' : 'N'}${I_char >= F_char ? 'I' : 'O'}${M >= T_char ? 'M' : 'F'}${C >= U ? 'C' : 'T'}`;

  // 結果データ生成
  const title = generateTitle(mbtiType, characterType);
  const gapAnalysis = generateGapAnalysis(mbtiType, characterType);
  const entertainmentScores = generateScores(mbtiType, characterType, gapAnalysis.percentage);
  const compatibility = getCompatibility(mbtiType);

  return {
    mbtiType,
    characterType,
    title,
    mbtiInfo: mbtiResults[mbtiType],
    characterInfo: characterResults[characterType],
    gapPercentage: gapAnalysis.percentage,
    gapAnalysis,
    entertainmentScores,
    compatibility,
    characterSvg: generateEnhancedCharacterSVG(mbtiType, characterType)
  };
};

// 改善されたAIプロンプト生成
const createUnifiedAIPrompt = (mbtiType, characterType, onboardingData) => {
  const group = getMBTIGroup(mbtiType);
  const mbtiInfo = mbtiResults[mbtiType];
  const characterInfo = characterResults[characterType];
  const title = generateTitle(mbtiType, characterType);

  // 視覚的要素を抽出する関数
  const extractVisualElements = (title) => {
    const visualKeywords = {
      '洗練': 'elegant posture, refined features',
      '純粋': 'innocent eyes, gentle expression',
      'カリスマ': 'confident stance, magnetic presence',
      '癒し': 'warm smile, soft features',
      '都会的': 'modern styling, sophisticated look',
      'エレガント': 'graceful pose, refined beauty',
      'ミステリアス': 'enigmatic expression, captivating eyes',
      '個性的': 'unique features, distinctive style',
      'アーティスト': 'creative expression, artistic pose',
      '自由': 'relaxed pose, natural expression'
    };

    let elements = [];
    Object.keys(visualKeywords).forEach(keyword => {
      if (title.includes(keyword)) {
        elements.push(visualKeywords[keyword]);
      }
    });

    return elements.length > 0 ? elements.join(', ') : 'natural expression, friendly demeanor';
  };

  // MBTIグループスタイルを取得する関数
  const getMbtiGroupStyle = (group) => {
    const groupStyles = {
      'Analyst': 'intellectual atmosphere, strategic pose, thoughtful expression',
      'Diplomat': 'warm and inspiring presence, empathetic eyes, harmonious pose',
      'Sentinel': 'reliable and steady appearance, trustworthy demeanor, grounded pose',
      'Explorer': 'dynamic and adaptable look, energetic expression, flexible stance'
    };
    return groupStyles[group] || 'balanced and natural appearance';
  };

  // Character Code視覚要素を取得する関数  
  const getCharacterVisualElements = (characterType) => {
    const typeElements = {
      'D': 'dynamic pose, vibrant energy',
      'N': 'natural stance, organic flow',
      'I': 'impressive presence, memorable features',
      'O': 'approachable demeanor, friendly aura',
      'M': 'modern styling, contemporary look',
      'F': 'timeless elegance, classic features',
      'C': 'cool and composed, sharp lines',
      'T': 'warm and gentle, soft curves'
    };

    return Array.from(characterType).map(char => typeElements[char] || '').filter(Boolean).join(', ');
  };

  const gender = onboardingData.gender === '男性' ? 'male' : 'female';
  const visualElements = extractVisualElements(title);
  const groupStyle = getMbtiGroupStyle(group);
  const characterVisuals = getCharacterVisualElements(characterType);

  const prompt = `Create a stunning low-poly 3D character portrait that embodies "${title}" - a ${mbtiInfo.name} (${mbtiType}) with ${characterInfo.name} impression (${characterType}).

Character Details:
- Gender: ${gender}
- Personality: ${mbtiInfo.description}
- Impression: ${characterInfo.description}
- Key traits: ${mbtiInfo.traits.join(', ')}
- Visual qualities: ${characterInfo.traits.join(', ')}

Visual Style:
- Low-poly 3D art style with clean geometric forms
- ${visualElements}
- ${groupStyle}
- ${characterVisuals}
- Vibrant colors with subtle gradients
- Professional studio lighting
- Clean composition, centered subject
- Full body or portrait view
- Modern and appealing aesthetic

The character should perfectly blend the ${mbtiType} personality depth with ${characterType} visual impression, creating a unique and memorable 3D low-poly representation.`;

  return prompt;
};

// コンポーネント定義
const StartScreen = ({ onStart }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
    <div className="text-center text-white max-w-md mx-auto">
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
        TwinPersona
      </h1>
      <p className="text-lg mb-2 text-gray-300">ツインパーソナ診断</p>
      <p className="text-sm mb-8 text-gray-400">
        あなたの内面と外見のギャップを発見しよう
      </p>
      <button
        onClick={onStart}
        className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 px-8 py-4 rounded-full text-white font-semibold transition duration-300 transform hover:scale-105"
      >
        診断を始める
      </button>
    </div>
  </div>
);

const OnboardingScreen = ({ onComplete }) => {
  const [gender, setGender] = useState('');
  const [occupation, setOccupation] = useState('');

  const genders = ['男性', '女性'];
  const occupations = ['学生', '会社員', 'フリーランス', '公務員', '専業主婦/主夫', 'その他'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">基本情報</h2>
        
        <div className="mb-6">
          <label className="block text-white mb-3 font-semibold">性別</label>
          <div className="grid grid-cols-2 gap-3">
            {genders.map((option) => (
              <button
                key={option}
                onClick={() => setGender(option)}
                className={`p-3 rounded-xl font-medium transition duration-300 ${
                  gender === option
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white'
                    : 'bg-white/20 text-gray-300 hover:bg-white/30'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-white mb-3 font-semibold">職業</label>
          <div className="grid grid-cols-2 gap-3">
            {occupations.map((option) => (
              <button
                key={option}
                onClick={() => setOccupation(option)}
                className={`p-3 rounded-xl font-medium transition duration-300 text-sm ${
                  occupation === option
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white'
                    : 'bg-white/20 text-gray-300 hover:bg-white/30'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onComplete({ gender, occupation })}
          disabled={!gender || !occupation}
          className={`w-full py-4 rounded-full font-semibold transition duration-300 ${
            gender && occupation
              ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          次へ進む
        </button>
      </div>
    </div>
  );
};

const MBTIScreen = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleAnswer = (answerIndex) => {
    const newAnswers = { ...answers, [currentQuestion]: answerIndex };
    setAnswers(newAnswers);

    if (currentQuestion < mbtiQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  const currentMbtiQuestion = mbtiQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full border border-white/20">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-purple-300 font-semibold">MBTI診断</span>
            <span className="text-gray-400 text-sm">
              {currentQuestion + 1} / {mbtiQuestions.length}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-cyan-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / mbtiQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-6 text-center leading-relaxed">
            {currentMbtiQuestion.question}
          </h3>
          <div className="space-y-4">
            {currentMbtiQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="w-full p-4 bg-white/20 hover:bg-white/30 rounded-xl text-white font-medium transition duration-300 transform hover:scale-105"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CharacterScreen = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleAnswer = (answerIndex) => {
    const newAnswers = { ...answers, [currentQuestion]: answerIndex };
    setAnswers(newAnswers);

    if (currentQuestion < characterQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  const currentCharacterQuestion = characterQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full border border-white/20">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-cyan-300 font-semibold">印象分析</span>
            <span className="text-gray-400 text-sm">
              {currentQuestion + 1} / {characterQuestions.length}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-cyan-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / characterQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-6 text-center leading-relaxed">
            {currentCharacterQuestion.question}
          </h3>
          <div className="space-y-4">
            {currentCharacterQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="w-full p-4 bg-white/20 hover:bg-white/30 rounded-xl text-white font-medium transition duration-300 transform hover:scale-105"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const GeneratingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
    <div className="text-center text-white">
      <div className="mb-8">
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-500 border-t-transparent mx-auto"></div>
      </div>
      <h2 className="text-2xl font-bold mb-4">AIが分析中...</h2>
      <p className="text-gray-400">あなたの結果を生成しています</p>
    </div>
  </div>
);

function App() {
  const [currentScreen, setCurrentScreen] = useState('start');
  const [onboardingData, setOnboardingData] = useState({});
  const [mbtiAnswers, setMbtiAnswers] = useState({});
  const [characterAnswers, setCharacterAnswers] = useState({});
  const [results, setResults] = useState(null);

  const resetApp = () => {
    setCurrentScreen('start');
    setOnboardingData({});
    setMbtiAnswers({});
    setCharacterAnswers({});
    setResults(null);
  };

  // シェア用のテキスト生成
  const generateShareText = (results) => {
    return `${results.title}\nMBTI: ${results.mbtiType} ${results.mbtiInfo.name}\nCharacterCode: ${results.characterType} ${results.characterInfo.name}\nギャップ度 ${results.gapPercentage}%でした！相性のいいMBTIは${results.compatibility}です！！\n#TwinPersona #ツインパーソナ #MBTI #CharacterCode #${results.mbtiType} #${results.characterType}`;
  };

  // X（Twitter）でのシェア
  const handleShareX = () => {
    const shareText = generateShareText(results);
    const ogImageUrl = `${window.location.origin}/api/og-image?mbti=${results.mbtiType}&mbtiName=${encodeURIComponent(results.mbtiInfo.name)}&characterCode=${results.characterType}&characterName=${encodeURIComponent(results.characterInfo.name)}&topScore=${encodeURIComponent(getScoreLabel(Object.keys(results.entertainmentScores).reduce((a, b) => results.entertainmentScores[a] > results.entertainmentScores[b] ? a : b)))}&topScoreValue=${Math.max(...Object.values(results.entertainmentScores))}&compatibility=${results.compatibility}`;
    
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(ogImageUrl)}`;
    window.open(tweetUrl, '_blank');
  };

  // LINEでのシェア
  const handleShareToLine = () => {
    const shareText = generateShareText(results);
    const shareUrl = window.location.href;
    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(lineUrl, '_blank');
  };

  // その他のシェア
  const handleShare = async () => {
    const shareText = generateShareText(results);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TwinPersona診断結果',
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // フォールバック: クリップボードにコピー
      try {
        await navigator.clipboard.writeText(shareText);
        alert('診断結果をクリップボードにコピーしました！');
      } catch (error) {
        console.error('Copy failed:', error);
        alert('コピーに失敗しました。手動でコピーしてください。');
      }
    }
  };

  if (currentScreen === 'start') {
    return <StartScreen onStart={() => setCurrentScreen('onboarding')} />;
  }

  if (currentScreen === 'onboarding') {
    return (
      <OnboardingScreen
        onComplete={(data) => {
          setOnboardingData(data);
          setCurrentScreen('mbti');
        }}
      />
    );
  }

  if (currentScreen === 'mbti') {
    return (
      <MBTIScreen
        onComplete={(answers) => {
          setMbtiAnswers(answers);
          setCurrentScreen('character');
        }}
      />
    );
  }

  if (currentScreen === 'character') {
    return (
      <CharacterScreen
        onComplete={(answers) => {
          setCharacterAnswers(answers);
          setCurrentScreen('generating');
          
          // Calculate results after a short delay
          setTimeout(() => {
            const calculatedResults = calculateResults(mbtiAnswers, characterAnswers, onboardingData);
            setResults(calculatedResults);
            setCurrentScreen('results');
          }, 3000);
        }}
      />
    );
  }

  if (currentScreen === 'generating') {
    return <GeneratingScreen />;
  }

  if (currentScreen === 'results' && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              診断結果
            </h1>
            <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
              <h2 className="text-2xl font-bold mb-2 text-white">
                {results.title}
              </h2>
              <p className="text-lg text-gray-300">
                {results.mbtiType} × {results.characterType}
              </p>
            </div>
          </div>

          {/* Character Visualization */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
              <h3 className="text-xl font-bold mb-4 text-center text-white">あなたのキャラクター</h3>
              <div className="flex justify-center mb-4">
                <div className="w-48 h-48 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-full flex items-center justify-center border-4 border-white/20">
                  {results.characterSvg}
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-300 mb-2">このキャラクターがあなたの印象です</p>
              </div>
            </div>
          </div>

          {/* MBTI Analysis */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl p-6 backdrop-blur-sm border border-purple-300/20">
              <h3 className="text-xl font-bold mb-4 text-purple-200">性格分析 (MBTI)</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">タイプ:</span>
                  <span className="font-bold text-purple-300">{results.mbtiType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">名称:</span>
                  <span className="font-bold text-purple-300">{results.mbtiInfo.name}</span>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-400">{results.mbtiInfo.description}</p>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold text-purple-200 mb-2">特徴:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {results.mbtiInfo.traits.map((trait, index) => (
                      <div key={index} className="bg-purple-400/20 rounded-lg px-3 py-2 text-center">
                        <span className="text-sm text-purple-200">{trait}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-2xl p-6 backdrop-blur-sm border border-cyan-300/20">
              <h3 className="text-xl font-bold mb-4 text-cyan-200">印象分析 (Character Code)</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">タイプ:</span>
                  <span className="font-bold text-cyan-300">{results.characterType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">印象:</span>
                  <span className="font-bold text-cyan-300">{results.characterInfo.name}</span>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-400">{results.characterInfo.description}</p>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold text-cyan-200 mb-2">特徴:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {results.characterInfo.traits.map((trait, index) => (
                      <div key={index} className="bg-cyan-400/20 rounded-lg px-3 py-2 text-center">
                        <span className="text-sm text-cyan-200">{trait}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gap Analysis */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl p-6 backdrop-blur-sm border border-amber-300/20">
              <h3 className="text-xl font-bold mb-4 text-amber-200">ギャップ分析</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-300 mb-2">
                  {results.gapPercentage}%
                </div>
                <p className="text-amber-200 mb-4">{results.gapAnalysis.description}</p>
                <div className="bg-amber-400/10 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-200 mb-2">分析結果:</h4>
                  <p className="text-sm text-gray-300">{results.gapAnalysis.interpretation}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Entertainment Scores */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-2xl p-6 backdrop-blur-sm border border-pink-300/20">
              <h3 className="text-xl font-bold mb-4 text-pink-200">エンタメ要素</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(results.entertainmentScores).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-2xl font-bold text-pink-300">{value}%</div>
                    <div className="text-sm text-gray-300">{getScoreLabel(key)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Compatibility */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-6 backdrop-blur-sm border border-green-300/20">
              <h3 className="text-xl font-bold mb-4 text-green-200">相性分析</h3>
              <div className="text-center">
                <p className="text-gray-300 mb-2">あなたと相性が良いのは</p>
                <div className="text-2xl font-bold text-green-300 mb-2">
                  {results.compatibility}
                </div>
                <p className="text-sm text-gray-400">
                  このタイプの人との関係性では、お互いの違いが良い刺激となり、
                  成長し合える関係を築くことができるでしょう。
                </p>
              </div>
            </div>
          </div>

          {/* Share Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl p-6 backdrop-blur-sm border border-indigo-300/20">
              <h3 className="text-xl font-bold mb-4 text-indigo-200 text-center">結果をシェアしよう！</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleShareX}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-6 py-3 rounded-full font-semibold transition duration-300 transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  X（旧Twitter）でシェア
                </button>
                <button
                  onClick={handleShareToLine}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-6 py-3 rounded-full font-semibold transition duration-300 transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.032-.2.032-.183 0-.365-.094-.465-.243l-1.49-2.137v2.282c0 .345-.282.63-.631.63-.345 0-.627-.285-.627-.63V8.108c0-.27.173-.51.43-.595.063-.022.136-.033.202-.033.185 0 .366.094.466.243l1.489 2.137V8.108c0-.345.282-.63.63-.63.349 0 .628.285.628.63v4.771zm-5.741 0c0 .345-.282.63-.631.63-.345 0-.627-.285-.627-.63V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                  </svg>
                  LINEでシェア
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-3 rounded-full font-semibold transition duration-300 transform hover:scale-105"
                >
                  <Share2 className="w-5 h-5" />
                  その他でシェア
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <button
              onClick={resetApp}
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

export default App;