// 256通りのMBTI×CharacterCodeタイトル生成スクリプト

// MBTIタイプの特性定義
const mbtiTraits = {
  INTJ: { core: "建築家", traits: ["戦略的", "独立的", "洞察力", "革新的", "完璧主義"] },
  INTP: { core: "論理学者", traits: ["論理的", "創造的", "好奇心", "客観的", "柔軟性"] },
  ENTJ: { core: "指揮官", traits: ["指導力", "効率的", "決断力", "組織的", "野心的"] },
  ENTP: { core: "討論者", traits: ["革新的", "機知", "適応性", "エネルギッシュ", "創造的"] },
  INFJ: { core: "提唱者", traits: ["理想主義", "洞察力", "思いやり", "直感的", "献身的"] },
  INFP: { core: "仲介者", traits: ["創造的", "共感的", "理想主義", "柔軟性", "価値観"] },
  ENFJ: { core: "主人公", traits: ["カリスマ的", "共感的", "組織的", "励まし", "責任感"] },
  ENFP: { core: "運動家", traits: ["熱狂的", "創造的", "社交的", "直感的", "柔軟性"] },
  ISTJ: { core: "管理者", traits: ["責任感", "実用的", "組織的", "伝統的", "信頼性"] },
  ISFJ: { core: "擁護者", traits: ["思いやり", "責任感", "実用的", "協調的", "献身的"] },
  ESTJ: { core: "幹部", traits: ["組織的", "実用的", "決断力", "責任感", "効率的"] },
  ESFJ: { core: "領事", traits: ["協調的", "思いやり", "責任感", "社交的", "伝統的"] },
  ISTP: { core: "巨匠", traits: ["実用的", "適応性", "独立的", "論理的", "冷静"] },
  ISFP: { core: "冒険家", traits: ["芸術的", "柔軟性", "思いやり", "価値観", "控えめ"] },
  ESTP: { core: "起業家", traits: ["活動的", "現実的", "適応性", "社交的", "実用的"] },
  ESFP: { core: "エンターテイナー", traits: ["社交的", "楽観的", "柔軟性", "共感的", "エネルギッシュ"] }
};

// CharacterCodeタイプの特性定義
const characterTraits = {
  // 印象的グループ
  DOFC: { core: "模範的なアナウンサー", traits: ["信頼できる", "親しみやすい", "正統派", "安心感", "品格"] },
  DOFT: { core: "元気なアイドルセンター", traits: ["華やか", "エネルギッシュ", "魅力的", "輝く", "人気"] },
  DOMC: { core: "整理されたリーダー", traits: ["統率力", "整然", "実直", "責任感", "頼れる"] },
  DOMT: { core: "優しい春の陽光", traits: ["温かい", "癒し系", "穏やか", "優しい", "安らぎ"] },
  
  // 残像的グループ
  DIFC: { core: "穏やかな洗練美", traits: ["上品", "洗練", "エレガント", "知的", "品のある"] },
  NIMC: { core: "夢幻的な清楚美", traits: ["清楚", "純粋", "夢見がち", "透明感", "神秘的"] },
  DIMC: { core: "ドキドキの初恋", traits: ["初々しい", "可愛らしい", "純情", "心躍る", "甘い"] },
  NIFC: { core: "都会的なカリスマ", traits: ["洗練", "カリスマ性", "都会的", "クール", "魅力的"] },
  
  // 立体的グループ
  NOMC: { core: "神秘的なカメレオン", traits: ["変幻自在", "ミステリアス", "多面的", "神秘的", "不思議"] },
  DIMT: { core: "多面的な逆転魅力", traits: ["ギャップ", "意外性", "多面的", "驚き", "魅力的"] },
  DIFT: { core: "かわいい安らぎの場所", traits: ["可愛い", "安らぎ", "居心地良い", "癒し", "温かい"] },
  NOFC: { core: "独特な主人公", traits: ["個性的", "ユニーク", "主人公", "特別", "印象的"] },
  
  // 感覚的グループ
  NIMT: { core: "エッジの効いたアーティスト", traits: ["アーティスティック", "エッジ", "創造的", "感性的", "独創的"] },
  NIFT: { core: "シックな自由人", traits: ["自由", "シック", "個性的", "洗練", "独立的"] },
  NOFT: { core: "反抗的なロマンチスト", traits: ["ロマンチック", "反抗的", "情熱的", "自由", "魅力的"] },
  NOMT: { core: "華やかなミューズ", traits: ["華やか", "インスピレーション", "魅力的", "芸術的", "輝く"] }
};

// タイトル生成ロジック
function generateCombinationTitle(mbtiType, characterCode) {
  const mbti = mbtiTraits[mbtiType];
  const character = characterTraits[characterCode];
  
  if (!mbti || !character) return `${mbtiType}×${characterCode}`;
  
  // MBTI特性とCharacter特性の組み合わせロジック
  const mbtiTrait = mbti.traits[Math.abs(characterCode.charCodeAt(0) + characterCode.charCodeAt(1)) % mbti.traits.length];
  const characterTrait = character.traits[Math.abs(mbtiType.charCodeAt(0) + mbtiType.charCodeAt(1)) % character.traits.length];
  
  // 組み合わせパターン
  const patterns = [
    `${characterTrait}${mbti.core}`,
    `${mbtiTrait}な${character.core.replace(/的な|な/, '')}`,
    `${characterTrait}${character.core.split('な')[1] || character.core}`,
    `${mbtiTrait}で${characterTrait}人`,
    `${characterTrait}${mbti.core}`
  ];
  
  // パターン選択（組み合わせに基づいて一意に決定）
  const patternIndex = Math.abs(mbtiType.length + characterCode.length) % patterns.length;
  return patterns[patternIndex];
}

// 全256通り生成
const allMbtiTypes = Object.keys(mbtiTraits);
const allCharacterCodes = Object.keys(characterTraits);

const all256Combinations = {};

allMbtiTypes.forEach(mbtiType => {
  all256Combinations[mbtiType] = {};
  allCharacterCodes.forEach(characterCode => {
    all256Combinations[mbtiType][characterCode] = generateCombinationTitle(mbtiType, characterCode);
  });
});

// 出力
console.log('// 256通りのMBTI×CharacterCode組み合わせタイトル');
console.log('const all256Titles = {');
Object.entries(all256Combinations).forEach(([mbti, combinations]) => {
  console.log(`  ${mbti}: {`);
  Object.entries(combinations).forEach(([code, title]) => {
    console.log(`    '${code}': "${title}",`);
  });
  console.log('  },');
});
console.log('};');

console.log('\n// exportモジュール');
console.log('export default all256Titles;');