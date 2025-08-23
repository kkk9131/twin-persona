// Character Code 16タイプシステム - 正式版
// 4軸システム: D/N軸, O/I軸, F/M軸, C/T軸

export const CHARACTER_CODE_16_TYPES = {
  // 印象的グループ（Impressive）
  DOFC: {
    code: "DOFC",
    name: "模範的なアナウンサー",
    group: "印象的",
    description: "信頼感があり、誠実で親しみやすい魅力を持つ",
    characteristics: ["信頼感", "誠実", "親しみやすさ", "模範的", "安定感"],
    firstImpression: "模範的で信頼できる人として映ります。アナウンサーのように誠実で親しみやすく、多くの人に好印象を与える存在です。",
    situations: {
      work: "チームの模範として周りから信頼され、安定した成果を上げる",
      social: "グループの中心的存在として、みんなから頼りにされる",
      romance: "誠実で信頼できる魅力で、長期的な関係を築くのが得意"
    },
    percentage: 8.2,
    axes: { d_n: "D", o_i: "O", f_m: "F", c_t: "C" }
  },

  DOFT: {
    code: "DOFT", 
    name: "元気なアイドルセンター",
    group: "印象的",
    description: "エネルギッシュで明るく、みんなを元気にする存在",
    characteristics: ["エネルギッシュ", "明るさ", "センター性", "魅力的", "人気"],
    firstImpression: "アイドルのように明るく魅力的で、その場にいるだけで雰囲気を盛り上げる存在として映ります。自然と注目を集める華やかさがあります。",
    situations: {
      work: "チームのエネルギー源として、職場全体を活気づける",
      social: "パーティーの中心として、みんなを楽しませる人気者",
      romance: "明るい魅力で多くの人を惹きつける、モテるタイプ"
    },
    percentage: 6.9,
    axes: { d_n: "D", o_i: "O", f_m: "F", c_t: "T" }
  },

  DOMC: {
    code: "DOMC",
    name: "整理されたリーダー", 
    group: "印象的",
    description: "統率力があり、きちんとした印象を与えるリーダータイプ",
    characteristics: ["統率力", "整理能力", "リーダーシップ", "責任感", "信頼"],
    firstImpression: "きちんと整理されたリーダーとして映ります。責任感が強く統率力があり、周りから頼りにされる存在です。",
    situations: {
      work: "プロジェクトリーダーとして、チームを効率的にまとめる",
      social: "グループの司令塔として、イベントや活動を仕切る",
      romance: "頼りがいのあるリーダー的魅力で、パートナーを支える"
    },
    percentage: 7.4,
    axes: { d_n: "D", o_i: "O", f_m: "M", c_t: "C" }
  },

  DOMT: {
    code: "DOMT",
    name: "優しい春の陽光",
    group: "印象的", 
    description: "温かく優しい、春の陽光のような包容力を持つ",
    characteristics: ["温かさ", "優しさ", "包容力", "安らぎ", "癒し"],
    firstImpression: "春の陽光のように温かく優しい人として映ります。包容力があり、一緒にいると心が安らぐ癒しの存在です。",
    situations: {
      work: "職場の癒し系として、ストレスを和らげ働きやすい環境を作る",
      social: "みんなの心の支えとなる、優しい相談役",
      romance: "温かい愛情で相手を包み込み、安らぎを与える関係"
    },
    percentage: 9.1,
    axes: { d_n: "D", o_i: "O", f_m: "M", c_t: "T" }
  },

  // 残像的グループ（Afterimage）
  DIFC: {
    code: "DIFC",
    name: "穏やかな洗練美",
    group: "残像的",
    description: "上品で洗練された、穏やかな美しさを持つ",
    characteristics: ["上品", "洗練", "穏やか", "美しさ", "エレガント"],
    firstImpression: "穏やかで洗練された美しさを持つ人として映ります。上品なエレガンスがあり、印象に深く残る魅力的な存在です。",
    situations: {
      work: "洗練された対応で、取引先やクライアントから信頼を得る", 
      social: "上品な魅力で、質の高い人間関係を築く",
      romance: "洗練された美しさで、深い印象を残す理想的なパートナー"
    },
    percentage: 5.8,
    axes: { d_n: "D", o_i: "I", f_m: "F", c_t: "C" }
  },

  NIMC: {
    code: "NIMC", 
    name: "夢幻的な清楚美",
    group: "残像的",
    description: "清楚で夢幻的な、幻想的な美しさを持つ",
    characteristics: ["清楚", "夢幻的", "幻想的", "神秘的", "美しさ"],
    firstImpression: "夢の中から現れたような清楚で幻想的な美しさを持つ人として映ります。神秘的な魅力で強く印象に残る存在です。",
    situations: {
      work: "独特の美しさで、創作やアートの分野で才能を発揮",
      social: "神秘的な魅力で多くの人を惹きつける、憧れの存在",
      romance: "清楚で夢幻的な魅力で、理想的な恋人として愛される"
    },
    percentage: 4.3,
    axes: { d_n: "N", o_i: "I", f_m: "M", c_t: "C" }
  },

  DIMC: {
    code: "DIMC",
    name: "ドキドキの初恋",
    group: "残像的",
    description: "初恋のようなドキドキ感を与える、純粋な魅力を持つ",
    characteristics: ["初恋感", "純粋", "ドキドキ", "可憐", "初々しさ"],
    firstImpression: "初恋のようなドキドキ感を与える純粋な魅力を持つ人として映ります。その初々しさと可憐さが強く心に残ります。",
    situations: {
      work: "純粋で一生懸命な姿勢が、周りの人の心を動かす",
      social: "初々しい魅力でみんなを微笑ませ、愛される存在",
      romance: "初恋のような純粋な愛で、相手をドキドキさせる"
    },
    percentage: 6.7,
    axes: { d_n: "D", o_i: "I", f_m: "M", c_t: "C" }
  },

  NIFC: {
    code: "NIFC",
    name: "都会的なカリスマ",
    group: "残像的",
    description: "洗練された都会的なカリスマ性を持つ",
    characteristics: ["カリスマ", "都会的", "洗練", "魅力", "オーラ"],
    firstImpression: "都会的で洗練されたカリスマ性を持つ人として映ります。独特のオーラがあり、一度会ったら忘れられない強い印象を残します。",
    situations: {
      work: "カリスマ性を活かして、チームやプロジェクトを牽引する",
      social: "都会的な魅力で注目を集め、影響力のある存在",
      romance: "カリスマ的な魅力で相手を虜にする、魅惑的な関係"
    },
    percentage: 3.9,
    axes: { d_n: "N", o_i: "I", f_m: "F", c_t: "C" }
  },

  // 立体的グループ（Three-dimensional）
  NOMC: {
    code: "NOMC",
    name: "神秘的なカメレオン",
    group: "立体的",
    description: "多面的で神秘的、状況に応じて魅力を変化させる",
    characteristics: ["神秘的", "多面性", "変化", "カメレオン", "適応力"],
    firstImpression: "神秘的で多面的な魅力を持つ人として映ります。状況に応じて異なる顔を見せるカメレオンのような不思議な魅力があります。",
    situations: {
      work: "様々な状況に適応し、多角的なアプローチで成果を上げる",
      social: "相手や場面に応じて魅力を変化させ、多くの人と繋がる",
      romance: "神秘的で変化に富む魅力で、相手を飽きさせない関係"
    },
    percentage: 5.2,
    axes: { d_n: "N", o_i: "O", f_m: "M", c_t: "C" }
  },

  DIMT: {
    code: "DIMT",
    name: "多面的な逆転魅力",
    group: "立体的",
    description: "意外性とギャップに満ちた、多面的な魅力を持つ",
    characteristics: ["多面性", "ギャップ", "逆転", "意外性", "深み"],
    firstImpression: "多面的で意外性に満ちた魅力を持つ人として映ります。表面とは違う一面を持つギャップが、強い印象と興味を引きます。",
    situations: {
      work: "予想外の能力や視点で、チームに新しい価値をもたらす",
      social: "意外な一面を見せることで、深い人間関係を築く",
      romance: "ギャップと多面性で相手を惹きつけ続ける、魅力的な関係"
    },
    percentage: 7.8,
    axes: { d_n: "D", o_i: "I", f_m: "M", c_t: "T" }
  },

  DIFT: {
    code: "DIFT",
    name: "かわいい安らぎの場所",
    group: "立体的",
    description: "可愛らしくて癒しを与える、安らぎの場所のような存在",
    characteristics: ["可愛らしさ", "癒し", "安らぎ", "居心地の良さ", "優しさ"],
    firstImpression: "可愛らしくて癒しを与える人として映ります。一緒にいると心が安らぐ、居心地の良い場所のような存在です。",
    situations: {
      work: "職場の憩いの場として、みんなのストレスを和らげる",
      social: "グループの癒し系として、みんなに愛される存在",
      romance: "可愛らしさと癒しの魅力で、守ってあげたくなる関係"
    },
    percentage: 11.6,
    axes: { d_n: "D", o_i: "I", f_m: "F", c_t: "T" }
  },

  NOFC: {
    code: "NOFC",
    name: "独特な主人公",
    group: "立体的",
    description: "独特の個性を持つ、物語の主人公のような存在",
    characteristics: ["独特", "個性", "主人公", "ユニーク", "存在感"],
    firstImpression: "独特の個性を持つ魅力的な人として映ります。まるで物語の主人公のような特別な存在感があり、周りを惹きつけます。",
    situations: {
      work: "独自の発想と個性で、プロジェクトに特別な価値を加える",
      social: "ユニークな魅力で注目を集め、話題の中心となる",
      romance: "独特の個性と魅力で、特別で印象深い関係を築く"
    },
    percentage: 8.4,
    axes: { d_n: "N", o_i: "O", f_m: "F", c_t: "C" }
  },

  // 感覚的グループ（Sensory）
  NIMT: {
    code: "NIMT",
    name: "エッジの効いたアーティスト",
    group: "感覚的",
    description: "芸術的センスがあり、エッジの効いた独創性を持つ",
    characteristics: ["芸術的", "エッジ", "独創性", "センス", "クリエイティブ"],
    firstImpression: "エッジの効いた芸術的センスを持つ人として映ります。独創的で洗練された感性があり、アーティスティックな魅力を放ちます。",
    situations: {
      work: "創造性と独自の視点で、イノベーティブなアイデアを生み出す",
      social: "アーティスティックな魅力で、クリエイティブな仲間と繋がる",
      romance: "芸術的感性を共有できる、深く知的な関係を築く"
    },
    percentage: 4.7,
    axes: { d_n: "N", o_i: "I", f_m: "M", c_t: "T" }
  },

  NIFT: {
    code: "NIFT", 
    name: "シックな自由人",
    group: "感覚的",
    description: "自由でスタイリッシュな、洗練された個性を持つ",
    characteristics: ["自由", "シック", "スタイリッシュ", "個性", "センス"],
    firstImpression: "シックで自由なスタイルを持つ人として映ります。型にはまらない洗練された個性があり、独特のセンスで注目を集めます。",
    situations: {
      work: "自由な発想とスタイルで、新しいトレンドを作り出す",
      social: "シックな魅力でファッションリーダー的存在となる",
      romance: "自由でスタイリッシュな魅力で、刺激的な関係を楽しむ"
    },
    percentage: 6.3,
    axes: { d_n: "N", o_i: "I", f_m: "F", c_t: "T" }
  },

  NOFT: {
    code: "NOFT",
    name: "反抗的なロマンチスト", 
    group: "感覚的",
    description: "情熱的で反抗的な、ロマンチックな魅力を持つ",
    characteristics: ["反抗的", "ロマンチック", "情熱的", "自由", "魅力"],
    firstImpression: "反抗的でロマンチックな魅力を持つ人として映ります。既存の枠にとらわれない情熱的な姿勢が、強く印象に残ります。",
    situations: {
      work: "既存の枠を破る情熱的なアプローチで、革新的な成果を上げる",
      social: "反抗的な魅力で注目を集め、自由な生き方に憧れを抱かせる",
      romance: "情熱的でロマンチックな愛で、ドラマチックな関係を築く"
    },
    percentage: 5.9,
    axes: { d_n: "N", o_i: "O", f_m: "F", c_t: "T" }
  },

  NOMT: {
    code: "NOMT",
    name: "華やかなミューズ",
    group: "感覚的", 
    description: "華やかでインスピレーションを与える、ミューズのような存在",
    characteristics: ["華やか", "ミューズ", "インスピレーション", "魅力", "創造性"],
    firstImpression: "華やかでミューズのような魅力を持つ人として映ります。周りの人にインスピレーションを与え、創造性を刺激する特別な存在です。",
    situations: {
      work: "華やかな存在感で、チームのモチベーションとクリエイティビティを高める",
      social: "ミューズのような魅力で、芸術的な才能を持つ人々を惹きつける",
      romance: "華やかで創造的な魅力で、お互いを高め合う関係を築く"
    },
    percentage: 7.2,
    axes: { d_n: "N", o_i: "O", f_m: "M", c_t: "T" }
  }
};

// グループ情報
export const CHARACTER_CODE_GROUPS = {
  "印象的": {
    name: "印象的",
    description: "外向的で親しみやすく、良い第一印象を与えるタイプ",
    characteristics: ["親しみやすい", "信頼感", "エネルギッシュ", "模範的"],
    types: ["DOFC", "DOFT", "DOMC", "DOMT"]
  },
  "残像的": {
    name: "残像的", 
    description: "印象に残る独特の魅力を持ち、記憶に深く刻まれるタイプ",
    characteristics: ["神秘的", "洗練", "カリスマ", "印象的"],
    types: ["DIFC", "NIMC", "DIMC", "NIFC"]
  },
  "立体的": {
    name: "立体的",
    description: "多面性と深みを持ち、様々な角度から魅力を感じられるタイプ",
    characteristics: ["多面性", "ギャップ", "癒し", "ユニーク"],
    types: ["NOMC", "DIMT", "DIFT", "NOFC"]
  },
  "感覚的": {
    name: "感覚的",
    description: "アーティスティックで感性的な印象を与え、創造性を刺激するタイプ",
    characteristics: ["芸術的", "自由", "創造的", "個性的"],
    types: ["NIMT", "NIFT", "NOFT", "NOMT"]
  }
};

// 16タイプ診断の質問
export const CHARACTER_CODE_16_QUESTIONS = [
  {
    id: 1,
    question: "初対面の人と話すとき、どのような印象を与えやすいですか？",
    options: [
      { 
        text: "親しみやすく、すぐに打ち解けられる雰囲気", 
        axes: { d_n: "D", o_i: "O", f_m: "F", c_t: "C" }
      },
      { 
        text: "少し距離感はあるが、上品で洗練された印象", 
        axes: { d_n: "N", o_i: "I", f_m: "M", c_t: "C" }
      },
      { 
        text: "エネルギッシュで明るく、場を盛り上げる", 
        axes: { d_n: "D", o_i: "O", f_m: "F", c_t: "T" }
      },
      { 
        text: "独特の魅力があり、印象に残りやすい", 
        axes: { d_n: "N", o_i: "I", f_m: "F", c_t: "T" }
      }
    ]
  },
  {
    id: 2,
    question: "写真を撮られるとき、自然に出てしまう表情は？",
    options: [
      { 
        text: "自然で親しみやすい笑顔", 
        axes: { f_m: "F", c_t: "C" }
      },
      { 
        text: "きちんとした、上品な表情", 
        axes: { f_m: "M", c_t: "C" }
      },
      { 
        text: "明るく華やかな表情", 
        axes: { f_m: "F", c_t: "T" }
      },
      { 
        text: "独特で印象的な表情", 
        axes: { f_m: "M", c_t: "T" }
      }
    ]
  },
  {
    id: 3,
    question: "グループの中での自分の立ち位置は？",
    options: [
      { 
        text: "みんなの調整役として、場の雰囲気を和らげる", 
        axes: { d_n: "D", o_i: "O", f_m: "F" }
      },
      { 
        text: "一歩引いて全体を見守る、観察者的な立ち位置", 
        axes: { d_n: "N", o_i: "I", f_m: "M" }
      },
      { 
        text: "積極的に発言し、グループを盛り上げる", 
        axes: { d_n: "D", o_i: "O", c_t: "T" }
      },
      { 
        text: "独自の視点で、ユニークなアイデアを提供", 
        axes: { d_n: "N", o_i: "I", c_t: "T" }
      }
    ]
  },
  {
    id: 4,
    question: "ファッションで重視することは？",
    options: [
      { 
        text: "TPOを考えた、適切で上品なスタイル", 
        axes: { f_m: "M", c_t: "C" }
      },
      { 
        text: "自分らしさを表現する、個性的なスタイル", 
        axes: { f_m: "F", c_t: "T" }
      },
      { 
        text: "親しみやすく、清潔感のあるスタイル", 
        axes: { f_m: "F", c_t: "C" }
      },
      { 
        text: "洗練されて、こだわりの感じられるスタイル", 
        axes: { f_m: "M", c_t: "T" }
      }
    ]
  },
  {
    id: 5,
    question: "人から話しかけられたときの反応は？",
    options: [
      { 
        text: "温かく歓迎して、積極的に会話を楽しむ", 
        axes: { d_n: "D", o_i: "O" }
      },
      { 
        text: "相手をよく観察してから、慎重に反応する", 
        axes: { d_n: "N", o_i: "I" }
      },
      { 
        text: "エネルギッシュに応答して、会話を盛り上げる", 
        axes: { o_i: "O", c_t: "T" }
      },
      { 
        text: "丁寧に対応しつつ、適度な距離感を保つ", 
        axes: { o_i: "I", c_t: "C" }
      }
    ]
  },
  {
    id: 6,
    question: "困っている人を見かけたとき、どう行動しますか？",
    options: [
      { 
        text: "すぐに駆け寄って、積極的に助ける", 
        axes: { d_n: "D", o_i: "O", c_t: "T" }
      },
      { 
        text: "状況を見極めてから、適切にサポートする", 
        axes: { d_n: "N", o_i: "I", f_m: "M" }
      },
      { 
        text: "さりげなく自然に手を差し伸べる", 
        axes: { d_n: "D", f_m: "F", c_t: "C" }
      },
      { 
        text: "独自の方法で、創造的な解決策を提案", 
        axes: { d_n: "N", f_m: "F", c_t: "T" }
      }
    ]
  },
  {
    id: 7,
    question: "自分の意見を伝えるとき、どのような話し方をしますか？",
    options: [
      { 
        text: "相手の気持ちを配慮した、優しい伝え方", 
        axes: { d_n: "D", f_m: "F", c_t: "C" }
      },
      { 
        text: "論理的で明確な、構造化された説明", 
        axes: { d_n: "N", f_m: "M", c_t: "C" }
      },
      { 
        text: "情熱的で説得力のある、エネルギッシュな話し方", 
        axes: { d_n: "D", o_i: "O", c_t: "T" }
      },
      { 
        text: "独特の視点から、創造的で印象的な表現", 
        axes: { d_n: "N", o_i: "I", c_t: "T" }
      }
    ]
  },
  {
    id: 8,
    question: "失敗したとき、どのように対応しますか？",
    options: [
      { 
        text: "素直に謝罪し、関係修復に努める", 
        axes: { d_n: "D", f_m: "F", c_t: "C" }
      },
      { 
        text: "冷静に分析して、改善策を考える", 
        axes: { d_n: "N", f_m: "M", c_t: "C" }
      },
      { 
        text: "前向きに捉えて、次への挑戦として活かす", 
        axes: { d_n: "D", o_i: "O", c_t: "T" }
      },
      { 
        text: "独自の学びとして、創造的に転換する", 
        axes: { d_n: "N", f_m: "F", c_t: "T" }
      }
    ]
  },
  {
    id: 9,
    question: "パーティーなどの社交の場では？",
    options: [
      { 
        text: "多くの人と積極的に交流を楽しむ", 
        axes: { d_n: "D", o_i: "O", f_m: "F" }
      },
      { 
        text: "少数の興味深い人と深い話をする", 
        axes: { d_n: "N", o_i: "I", f_m: "M" }
      },
      { 
        text: "場の雰囲気を盛り上げる中心的存在", 
        axes: { o_i: "O", f_m: "F", c_t: "T" }
      },
      { 
        text: "独特の魅力で注目を集める存在", 
        axes: { o_i: "I", f_m: "M", c_t: "T" }
      }
    ]
  },
  {
    id: 10,
    question: "ストレスを感じているとき、外見に表れやすいのは？",
    options: [
      { 
        text: "いつもより表情が暗くなる", 
        axes: { d_n: "D", f_m: "F", c_t: "C" }
      },
      { 
        text: "より内向的になり、静かになる", 
        axes: { d_n: "N", o_i: "I", c_t: "C" }
      },
      { 
        text: "いつもより表情が硬くなる", 
        axes: { f_m: "M", c_t: "T" }
      },
      { 
        text: "不安定で予測しにくい表情になる", 
        axes: { o_i: "I", f_m: "F", c_t: "T" }
      }
    ]
  },
  {
    id: 11,
    question: "好きなことについて話すとき、どんな様子になりますか？",
    options: [
      { 
        text: "相手も楽しめるように、分かりやすく話す", 
        axes: { d_n: "D", o_i: "O", f_m: "F", c_t: "C" }
      },
      { 
        text: "知識や深い内容を、論理的に伝える", 
        axes: { d_n: "N", o_i: "I", f_m: "M", c_t: "C" }
      },
      { 
        text: "情熱的に語り、相手を巻き込む", 
        axes: { d_n: "D", o_i: "O", f_m: "F", c_t: "T" }
      },
      { 
        text: "独特の視点から、創造的に表現する", 
        axes: { d_n: "N", o_i: "I", f_m: "M", c_t: "T" }
      }
    ]
  },
  {
    id: 12,
    question: "チームワークが必要な場面では？",
    options: [
      { 
        text: "みんなの意見をまとめる調整役", 
        axes: { d_n: "D", o_i: "O", f_m: "F", c_t: "C" }
      },
      { 
        text: "戦略的な視点から、効率的な方法を提案", 
        axes: { d_n: "N", o_i: "I", f_m: "M", c_t: "C" }
      },
      { 
        text: "エネルギッシュにチームを引っ張る", 
        axes: { d_n: "D", o_i: "O", f_m: "M", c_t: "T" }
      },
      { 
        text: "独創的なアイデアで、新しい可能性を提示", 
        axes: { d_n: "N", o_i: "I", f_m: "F", c_t: "T" }
      }
    ]
  },
  {
    id: 13,
    question: "新しい環境に入るとき、どう振る舞いますか？",
    options: [
      { 
        text: "積極的に周りの人と関係を築く", 
        axes: { d_n: "D", o_i: "O", f_m: "F" }
      },
      { 
        text: "慎重に状況を観察してから行動する", 
        axes: { d_n: "N", o_i: "I", f_m: "M" }
      },
      { 
        text: "自分らしさを保ちながら適応する", 
        axes: { f_m: "F", c_t: "T" }
      },
      { 
        text: "礼儀正しく、きちんとした態度で臨む", 
        axes: { f_m: "M", c_t: "C" }
      }
    ]
  },
  {
    id: 14,
    question: "プレゼンテーションをするとき、どんなスタイルですか？",
    options: [
      { 
        text: "聴衆に配慮した、親しみやすい発表", 
        axes: { d_n: "D", o_i: "O", f_m: "F", c_t: "C" }
      },
      { 
        text: "論理的で構造化された、専門的な発表", 
        axes: { d_n: "N", o_i: "I", f_m: "M", c_t: "C" }
      },
      { 
        text: "情熱的で印象に残る、エネルギッシュな発表", 
        axes: { d_n: "D", o_i: "O", f_m: "F", c_t: "T" }
      },
      { 
        text: "独創的で印象的な、アーティスティックな発表", 
        axes: { d_n: "N", o_i: "I", f_m: "M", c_t: "T" }
      }
    ]
  },
  {
    id: 15,
    question: "友人との関係で大切にしていることは？",
    options: [
      { 
        text: "お互いを支え合う、温かい絆", 
        axes: { d_n: "D", f_m: "F", c_t: "C" }
      },
      { 
        text: "共通の興味や価値観を共有する関係", 
        axes: { d_n: "N", f_m: "M", c_t: "C" }
      },
      { 
        text: "一緒にいて楽しい、エネルギッシュな関係", 
        axes: { d_n: "D", o_i: "O", c_t: "T" }
      },
      { 
        text: "お互いの個性を尊重し合う、クリエイティブな関係", 
        axes: { d_n: "N", f_m: "F", c_t: "T" }
      }
    ]
  },
  {
    id: 16,
    question: "対立や衝突が起きたとき、どう対応しますか？",
    options: [
      { 
        text: "みんなの気持ちを和らげ、仲裁する", 
        axes: { d_n: "D", o_i: "O", f_m: "F", c_t: "C" }
      },
      { 
        text: "冷静に状況を分析し、合理的な解決策を探る", 
        axes: { d_n: "N", o_i: "I", f_m: "M", c_t: "C" }
      },
      { 
        text: "積極的に問題解決に向けて行動する", 
        axes: { d_n: "D", o_i: "O", f_m: "M", c_t: "T" }
      },
      { 
        text: "独自の視点から、創造的な解決策を提案", 
        axes: { d_n: "N", o_i: "I", f_m: "F", c_t: "T" }
      }
    ]
  }
];

// 16タイプ計算ロジック  
export const calculateCharacterCode16Type = (answers) => {
  const scores = {
    d_n_d: 0, d_n_n: 0,
    o_i_o: 0, o_i_i: 0,
    f_m_f: 0, f_m_m: 0,
    c_t_c: 0, c_t_t: 0
  };

  // 各回答を集計
  Object.values(answers).forEach(answer => {
    if (answer.axes.d_n === "D") scores.d_n_d++;
    if (answer.axes.d_n === "N") scores.d_n_n++;
    if (answer.axes.o_i === "O") scores.o_i_o++;
    if (answer.axes.o_i === "I") scores.o_i_i++;
    if (answer.axes.f_m === "F") scores.f_m_f++;
    if (answer.axes.f_m === "M") scores.f_m_m++;
    if (answer.axes.c_t === "C") scores.c_t_c++;
    if (answer.axes.c_t === "T") scores.c_t_t++;
  });

  // 各軸の決定
  const d_n = scores.d_n_d >= scores.d_n_n ? "D" : "N";
  const o_i = scores.o_i_o >= scores.o_i_i ? "O" : "I"; 
  const f_m = scores.f_m_f >= scores.f_m_m ? "F" : "M";
  const c_t = scores.c_t_c >= scores.c_t_t ? "C" : "T";

  // 16タイプコードの組み立て
  const characterCode = `${d_n}${o_i}${f_m}${c_t}`;
  
  // タイプコード文字列を返す（CHARACTER_CODE_16_TYPESにキーが存在するか確認）
  return CHARACTER_CODE_16_TYPES[characterCode] ? characterCode : 'DOFC'; // デフォルト
};