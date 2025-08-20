// Character Code 16タイプシステム
// N/O (Neutral/Open), I/R (Intense/Relaxed), F/M (Formal/Mild), C/T (Clear/Tender)

export const CHARACTER_CODE_16_TYPES = {
  // N軸 (Neutral) グループ
  NIMT: {
    name: "エッジの効いたアーティスト",
    code: "NIMT",
    description: "クールで芸術性があり、独自の感性を持つ",
    characteristics: ["アーティスティック", "ユニーク", "知的", "ミステリアス", "独立心"],
    firstImpression: "洗練された芸術的センスと独特の魅力を持つ人として映ります。近寄りがたいオーラがありながらも、その独創性に惹かれる人が多いでしょう。",
    situations: {
      work: "クリエイティブな分野で才能を発揮し、独自のアイデアで注目を集める",
      social: "少数精鋭の深い関係を築き、芸術や文化を愛する仲間と繋がる",
      romance: "知的で芸術的な魅力に惹かれる相手から深く愛される"
    },
    percentage: 4.2,
    axes: { n_o: "N", i_r: "I", f_m: "M", c_t: "T" }
  },
  
  NIFT: {
    name: "シックな自由人",
    code: "NIFT", 
    description: "自由で予測不能、おしゃれな雰囲気を持つ",
    characteristics: ["自由奔放", "おしゃれ", "予測不能", "魅力的", "個性的"],
    firstImpression: "自由で洗練された雰囲気を持ち、型にはまらない魅力的な人として映ります。流行に敏感でスタイリッシュな印象を与えます。",
    situations: {
      work: "型破りなアイデアと自由な発想でチームに新しい風を吹き込む",
      social: "トレンドセッターとして注目され、多様な人脈を築く",
      romance: "自由で魅力的な雰囲気に惹かれる相手から愛される"
    },
    percentage: 6.8,
    axes: { n_o: "N", i_r: "I", f_m: "F", c_t: "T" }
  },

  NOMT: {
    name: "華やかなミューズ",
    code: "NOMT",
    description: "華やかで誠実、インスピレーションを与える存在",
    characteristics: ["華やか", "誠実", "インスピレーション", "上品", "魅力的"],
    firstImpression: "華やかさと誠実さを兼ね備えた、人々にインスピレーションを与える存在として映ります。自然と注目を集める魅力があります。",
    situations: {
      work: "チームのモチベーションを高め、プロジェクトに華やかさと活力をもたらす",
      social: "社交的な場面で中心的な役割を果たし、多くの人を魅了する",
      romance: "華やかで誠実な魅力に多くの人が惹かれる人気者"
    },
    percentage: 5.1,
    axes: { n_o: "N", i_r: "O", f_m: "M", c_t: "T" }
  },

  NOFT: {
    name: "反抗的なロマンチスト", 
    code: "NOFT",
    description: "自由奔放で型破り、情熱的な魅力を持つ",
    characteristics: ["情熱的", "型破り", "ロマンチック", "自由", "魅力的"],
    firstImpression: "自由で情熱的な魅力を持ち、既存の枠にとらわれない独特の存在として映ります。ロマンチックでドラマチックな印象を与えます。",
    situations: {
      work: "情熱的なアプローチで新しい可能性を切り開き、チームに刺激を与える",
      social: "自由で魅力的な雰囲気で多くの人を惹きつける",
      romance: "情熱的でロマンチックな魅力で深い愛情を育む"
    },
    percentage: 7.3,
    axes: { n_o: "N", i_r: "O", f_m: "F", c_t: "T" }
  },

  // D軸 (Deep) グループ  
  DIMT: {
    name: "多面的な逆転魅力",
    code: "DIMT",
    description: "ギャップがあり、多面性を持つ変化に富んだ魅力",
    characteristics: ["ギャップ", "多面性", "変化", "深み", "意外性"],
    firstImpression: "一見クールに見えるが、実は温かい一面を持つなど、多面的な魅力を持つ人として映ります。そのギャップが強い印象を残します。",
    situations: {
      work: "状況に応じて異なる能力を発揮し、多角的なアプローチで成果を上げる",
      social: "様々な顔を見せることで、多くの人との深い関係を築く",
      romance: "意外性とギャップの魅力で、相手を夢中にさせる"
    },
    percentage: 8.9,
    axes: { n_o: "D", i_r: "I", f_m: "M", c_t: "T" }
  },

  DIFT: {
    name: "かわいい安らぎの場所",
    code: "DIFT", 
    description: "癒しと明るさを与える、守りたくなる存在",
    characteristics: ["癒し", "明るさ", "愛らしい", "安らぎ", "守りたい"],
    firstImpression: "可愛らしく親しみやすい雰囲気で、一緒にいると安らぎを感じる人として映ります。自然と周りの人を笑顔にする魅力があります。",
    situations: {
      work: "チームの癒し系として、職場の雰囲気を明るくし、ストレス軽減に貢献",
      social: "グループのムードメーカーとして愛され、みんなの憩いの場となる",
      romance: "守ってあげたい可愛らしさと、癒しの魅力で深く愛される"
    },
    percentage: 12.4,
    axes: { n_o: "D", i_r: "I", f_m: "F", c_t: "T" }
  },

  DOMT: {
    name: "落ち着いた大人の魅力",
    code: "DOMT",
    description: "落ち着きがあり、大人の魅力と包容力を持つ",
    characteristics: ["落ち着き", "大人の魅力", "包容力", "信頼感", "安定感"],
    firstImpression: "落ち着いた大人の魅力を持ち、頼りがいのある人として映ります。包容力があり、周りに安心感を与える存在です。",
    situations: {
      work: "リーダーシップを発揮し、チームの安定と成長を支える",
      social: "グループの相談役として信頼され、みんなから頼られる存在",
      romance: "大人の魅力と包容力で、長期的な関係を築くのが得意"
    },
    percentage: 9.7,
    axes: { n_o: "D", i_r: "O", f_m: "M", c_t: "T" }
  },

  DOFT: {
    name: "温かい太陽のような存在",
    code: "DOFT",
    description: "温かく明るい、太陽のような存在感を持つ",
    characteristics: ["温かさ", "明るさ", "太陽的", "ポジティブ", "包容力"],
    firstImpression: "温かく明るい太陽のような存在として映ります。その場にいるだけで雰囲気が明るくなり、多くの人に愛される魅力があります。",
    situations: {
      work: "チームの太陽として、職場全体のモチベーションを向上させる",
      social: "自然と人が集まってくる、グループの中心的存在",
      romance: "温かい愛情で相手を包み込み、幸せな関係を築く"
    },
    percentage: 11.2,
    axes: { n_o: "D", i_r: "O", f_m: "F", c_t: "T" }
  },

  // その他の8タイプ（NIMC, NIFC, NOMC, NOFC, DIMC, DIFC, DOMC, DOFC）
  NIMC: {
    name: "クールな知性派",
    code: "NIMC",
    description: "知的でクール、論理的思考を持つ",
    characteristics: ["知的", "クール", "論理的", "分析的", "洗練"],
    firstImpression: "知的でクールな雰囲気を持ち、論理的で分析力の高い人として映ります。洗練された知性が魅力的です。",
    situations: {
      work: "分析力と論理的思考で複雑な問題を解決し、チームの頭脳として活躍",
      social: "知的な会話を好み、質の高い人間関係を築く",
      romance: "知的な魅力で相手を惹きつけ、深い精神的な絆を築く"
    },
    percentage: 6.5,
    axes: { n_o: "N", i_r: "I", f_m: "M", c_t: "C" }
  },

  NIFC: {
    name: "ミステリアスな魅力",
    code: "NIFC", 
    description: "ミステリアスで魅力的、独特の存在感を持つ",
    characteristics: ["ミステリアス", "魅力的", "独特", "神秘的", "魅惑的"],
    firstImpression: "ミステリアスで独特の魅力を持つ人として映ります。その神秘的な雰囲気に多くの人が惹かれるでしょう。",
    situations: {
      work: "独特の視点と魅力でチームに新しい可能性をもたらす",
      social: "ミステリアスな魅力で多くの人の興味を引く",
      romance: "神秘的な魅力で相手を夢中にさせる"
    },
    percentage: 5.8,
    axes: { n_o: "N", i_r: "I", f_m: "F", c_t: "C" }
  },

  NOMC: {
    name: "エレガントな存在",
    code: "NOMC",
    description: "エレガントで上品、洗練された魅力を持つ",
    characteristics: ["エレガント", "上品", "洗練", "優雅", "気品"],
    firstImpression: "エレガントで上品な雰囲気を持つ人として映ります。洗練された魅力と気品で、周りの人に良い印象を与えます。",
    situations: {
      work: "エレガントな立ち振る舞いで取引先からの信頼を獲得",
      social: "上品で洗練された魅力で、質の高い社交関係を築く",
      romance: "エレガントな魅力で、上質な恋愛関係を育む"
    },
    percentage: 7.1,
    axes: { n_o: "N", i_r: "O", f_m: "M", c_t: "C" }
  },

  NOFC: {
    name: "自然体の魅力",
    code: "NOFC",
    description: "自然体で親しみやすい、等身大の魅力を持つ",
    characteristics: ["自然体", "親しみやすい", "等身大", "リラックス", "素朴"],
    firstImpression: "自然体で親しみやすい人として映ります。飾らない等身大の魅力で、多くの人に愛されるでしょう。",
    situations: {
      work: "自然体でチームに溶け込み、リラックスした雰囲気を作る",
      social: "親しみやすさで多くの友人を持つ人気者",
      romance: "自然体の魅力で、居心地の良い関係を築く"
    },
    percentage: 13.6,
    axes: { n_o: "N", i_r: "O", f_m: "F", c_t: "C" }
  },

  DIMC: {
    name: "静かな強さ",
    code: "DIMC",
    description: "静かながら強い意志を持つ、芯の強い存在",
    characteristics: ["静かな強さ", "意志力", "芯の強さ", "安定感", "信頼"],
    firstImpression: "静かながらも強い意志を持つ人として映ります。その芯の強さと安定感で、周りから信頼される存在です。",
    situations: {
      work: "静かなリーダーシップで長期的な成功を導く",
      social: "信頼できる相談相手として多くの人に慕われる",
      romance: "静かな強さと安定感で、長続きする関係を築く"
    },
    percentage: 8.3,
    axes: { n_o: "D", i_r: "I", f_m: "M", c_t: "C" }
  },

  DIFC: {
    name: "優しい内なる光",
    code: "DIFC",
    description: "優しく温かい、内側から光る魅力を持つ",
    characteristics: ["優しさ", "温かさ", "内なる光", "慈愛", "包容力"],
    firstImpression: "優しく温かい人として映ります。内側から光るような魅力で、周りの人を癒し、愛される存在です。",
    situations: {
      work: "優しさでチームの結束を高め、働きやすい環境を作る",
      social: "慈愛深い性格で、多くの人から愛され信頼される",
      romance: "優しい愛情で相手を包み込み、深い絆を育む"
    },
    percentage: 10.9,
    axes: { n_o: "D", i_r: "I", f_m: "F", c_t: "C" }
  },

  DOMC: {
    name: "堂々とした風格",
    code: "DOMC", 
    description: "堂々とした風格を持つ、頼りがいのある存在",
    characteristics: ["風格", "堂々", "頼りがい", "貫禄", "リーダーシップ"],
    firstImpression: "堂々とした風格を持つ人として映ります。その貫禄と頼りがいで、自然とリーダーシップを期待される存在です。",
    situations: {
      work: "堂々とした風格でチームを牽引し、大きな成果を上げる",
      social: "グループのリーダー的存在として尊敬を集める",
      romance: "頼りがいのある魅力で、安心感のある関係を築く"
    },
    percentage: 6.9,
    axes: { n_o: "D", i_r: "O", f_m: "M", c_t: "C" }
  },

  DOFC: {
    name: "みんなの憧れ",
    code: "DOFC",
    description: "親しみやすく魅力的、みんなの憧れの存在",
    characteristics: ["憧れ", "親しみやすさ", "魅力", "人気", "バランス"],
    firstImpression: "親しみやすく魅力的で、みんなの憧れの存在として映ります。そのバランスの取れた魅力で、多くの人に愛されるでしょう。",
    situations: {
      work: "チームの人気者として、みんなのモチベーションを高める",
      social: "多くの人の憧れの存在として、大きな影響力を持つ",
      romance: "理想的なパートナーとして、多くの人から愛される"
    },
    percentage: 9.4,
    axes: { n_o: "D", i_r: "O", f_m: "F", c_t: "C" }
  }
};

// Character Code診断の質問（20問に拡張）
export const CHARACTER_CODE_QUESTIONS = [
  {
    question: "初対面の人と話す時、どう感じることが多いですか？",
    options: [
      { text: "相手のペースに合わせて、自然体で接する", axes: { n_o: "N", i_r: "O", f_m: "F", c_t: "C" } },
      { text: "少し緊張するが、丁寧に対応しようとする", axes: { n_o: "D", i_r: "I", f_m: "M", c_t: "C" } },
      { text: "積極的に会話をリードしていく", axes: { n_o: "N", i_r: "I", f_m: "M", c_t: "T" } },
      { text: "相手を観察しながら、様子を見る", axes: { n_o: "D", i_r: "O", f_m: "M", c_t: "T" } }
    ]
  },
  {
    question: "写真を撮られる時、どんな表情になりやすいですか？",
    options: [
      { text: "自然でリラックスした表情", axes: { f_m: "F", c_t: "C" } },
      { text: "少し緊張した真面目な表情", axes: { f_m: "M", c_t: "C" } },
      { text: "印象的でユニークなポーズ", axes: { f_m: "F", c_t: "T" } },
      { text: "クールで洗練された表情", axes: { f_m: "M", c_t: "T" } }
    ]
  },
  {
    question: "グループの中での自分の立ち位置は？",
    options: [
      { text: "みんなの相談役として支える", axes: { n_o: "D", i_r: "O", f_m: "F", c_t: "C" } },
      { text: "自分のペースでマイペースに参加", axes: { n_o: "N", i_r: "I", f_m: "F", c_t: "T" } },
      { text: "場を盛り上げるムードメーカー", axes: { n_o: "N", i_r: "O", f_m: "F", c_t: "T" } },
      { text: "一歩引いて全体を見る観察者", axes: { n_o: "D", i_r: "I", f_m: "M", c_t: "T" } }
    ]
  },
  {
    question: "ファッションで重視するのは？",
    options: [
      { text: "自分らしさを表現できるスタイル", axes: { f_m: "F", c_t: "T" } },
      { text: "TPOに適した上品なスタイル", axes: { f_m: "M", c_t: "C" } },
      { text: "着心地が良く機能的なスタイル", axes: { f_m: "F", c_t: "C" } },
      { text: "洗練されたこだわりのスタイル", axes: { f_m: "M", c_t: "T" } }
    ]
  },
  {
    question: "人から話しかけられた時の反応は？",
    options: [
      { text: "相手の話に共感して温かく応答", axes: { n_o: "D", i_r: "O", f_m: "F", c_t: "C" } },
      { text: "相手に興味を持って質問する", axes: { n_o: "N", i_r: "O", f_m: "F", c_t: "T" } },
      { text: "落ち着いて丁寧に対応する", axes: { n_o: "D", i_r: "I", f_m: "M", c_t: "C" } },
      { text: "エネルギッシュに会話を楽しむ", axes: { n_o: "N", i_r: "I", f_m: "F", c_t: "T" } }
    ]
  },
  {
    question: "困っている人を見かけた時は？",
    options: [
      { text: "すぐに駆け寄って積極的に助ける", axes: { i_r: "I", c_t: "T" } },
      { text: "さりげなく自然に手を差し伸べる", axes: { i_r: "O", c_t: "C" } },
      { text: "状況を見極めてから適切に対応", axes: { i_r: "I", f_m: "M" } },
      { text: "温かく寄り添ってサポートする", axes: { i_r: "O", f_m: "F" } }
    ]
  },
  {
    question: "自分の意見を伝える時は？",
    options: [
      { text: "情熱的で説得力のある話し方", axes: { i_r: "I", c_t: "T" } },
      { text: "相手を配慮した優しい伝え方", axes: { f_m: "F", c_t: "C" } },
      { text: "論理的で明確な説明", axes: { f_m: "M", c_t: "T" } },
      { text: "自然で率直な表現", axes: { i_r: "O", f_m: "F" } }
    ]
  },
  {
    question: "失敗した時の対応は？",
    options: [
      { text: "前向きに次への挑戦として捉える", axes: { n_o: "N", i_r: "I", f_m: "F", c_t: "T" } },
      { text: "周りへの影響を考えて謝罪する", axes: { n_o: "D", i_r: "O", f_m: "F", c_t: "C" } },
      { text: "冷静に原因を分析して改善する", axes: { n_o: "N", i_r: "I", f_m: "M", c_t: "T" } },
      { text: "素直に失敗を認めて学ぼうとする", axes: { n_o: "D", i_r: "O", f_m: "F", c_t: "C" } }
    ]
  },
  {
    question: "パーティーなどの社交場では？",
    options: [
      { text: "積極的に多くの人と交流する", axes: { n_o: "N", i_r: "I", f_m: "F", c_t: "T" } },
      { text: "気の合う人とじっくり話す", axes: { n_o: "D", i_r: "O", f_m: "F", c_t: "C" } },
      { text: "場の雰囲気を読んで行動する", axes: { n_o: "D", i_r: "O", f_m: "M", c_t: "C" } },
      { text: "自分らしく自然に振る舞う", axes: { n_o: "N", i_r: "I", f_m: "F", c_t: "T" } }
    ]
  },
  {
    question: "ストレスを感じている時の外見の変化は？",
    options: [
      { text: "いつもより表情が硬くなる", axes: { f_m: "M", c_t: "T" } },
      { text: "周りに気を遣って疲れが見える", axes: { n_o: "D", i_r: "O", f_m: "F", c_t: "C" } },
      { text: "テンションが不安定になる", axes: { i_r: "I", f_m: "F" } },
      { text: "いつもより静かになる", axes: { i_r: "O", f_m: "M" } }
    ]
  },
  {
    question: "好きなことについて話す時は？",
    options: [
      { text: "熱く語って相手を巻き込む", axes: { i_r: "I", c_t: "T" } },
      { text: "相手の興味も考慮しながら話す", axes: { n_o: "D", i_r: "O", f_m: "F", c_t: "C" } },
      { text: "知的で深い内容を伝える", axes: { f_m: "M", c_t: "T" } },
      { text: "楽しさが自然に伝わるように話す", axes: { f_m: "F", c_t: "C" } }
    ]
  },
  {
    question: "チームワークが必要な場面では？",
    options: [
      { text: "リーダーシップを発揮する", axes: { n_o: "N", i_r: "I", f_m: "M", c_t: "T" } },
      { text: "調整役としてチームを支える", axes: { n_o: "D", i_r: "O", f_m: "F", c_t: "C" } },
      { text: "専門性を活かして貢献する", axes: { n_o: "N", i_r: "I", f_m: "M", c_t: "T" } },
      { text: "みんなが働きやすい雰囲気を作る", axes: { n_o: "D", i_r: "O", f_m: "F", c_t: "C" } }
    ]
  },
  {
    question: "新しい環境に入る時は？",
    options: [
      { text: "積極的に馴染もうとする", axes: { n_o: "N", i_r: "O", f_m: "F", c_t: "T" } },
      { text: "慎重に様子を見てから行動", axes: { n_o: "D", i_r: "I", f_m: "M", c_t: "C" } },
      { text: "自分のスタイルを貫く", axes: { n_o: "N", i_r: "I", f_m: "M", c_t: "T" } },
      { text: "自然体で徐々に慣れていく", axes: { n_o: "D", i_r: "O", f_m: "F", c_t: "C" } }
    ]
  },
  {
    question: "プレゼンテーションをする時は？",
    options: [
      { text: "情熱的で印象に残る発表", axes: { n_o: "N", i_r: "I", f_m: "F", c_t: "T" } },
      { text: "聞き手に配慮した丁寧な発表", axes: { n_o: "D", i_r: "O", f_m: "M", c_t: "C" } },
      { text: "論理的で構造化された発表", axes: { f_m: "M", c_t: "T" } },
      { text: "親しみやすく分かりやすい発表", axes: { f_m: "F", c_t: "C" } }
    ]
  },
  {
    question: "友人との関係では？",
    options: [
      { text: "多くの友人と広く浅く付き合う", axes: { n_o: "N", i_r: "O", f_m: "F", c_t: "T" } },
      { text: "少数の友人と深く付き合う", axes: { n_o: "D", i_r: "I", f_m: "F", c_t: "C" } },
      { text: "知的な話題で繋がる関係", axes: { n_o: "N", i_r: "I", f_m: "M", c_t: "T" } },
      { text: "感情的な絆を大切にする関係", axes: { n_o: "D", i_r: "O", f_m: "F", c_t: "C" } }
    ]
  },
  {
    question: "コンフリクト（対立）が起きた時は？",
    options: [
      { text: "積極的に解決に向けて行動", axes: { n_o: "N", i_r: "I", f_m: "M", c_t: "T" } },
      { text: "みんなの気持ちを和らげようとする", axes: { n_o: "D", i_r: "O", f_m: "F", c_t: "C" } },
      { text: "冷静に問題を分析する", axes: { n_o: "N", i_r: "I", f_m: "M", c_t: "T" } },
      { text: "穏やかに仲裁しようとする", axes: { n_o: "D", i_r: "O", f_m: "F", c_t: "C" } }
    ]
  },
  {
    question: "自分の長所をアピールする時は？",
    options: [
      { text: "自信を持って堂々とアピール", axes: { n_o: "N", i_r: "I", f_m: "M", c_t: "T" } },
      { text: "謙虚にさりげなくアピール", axes: { n_o: "D", i_r: "O", f_m: "F", c_t: "C" } },
      { text: "具体的な成果で証明する", axes: { n_o: "N", i_r: "I", f_m: "M", c_t: "T" } },
      { text: "自然な魅力で印象を残す", axes: { n_o: "D", i_r: "O", f_m: "F", c_t: "C" } }
    ]
  },
  {
    question: "日常的な決断をする時は？",
    options: [
      { text: "直感的に素早く決める", axes: { n_o: "N", i_r: "I", f_m: "F", c_t: "T" } },
      { text: "周りの意見も聞いて決める", axes: { n_o: "D", i_r: "O", f_m: "F", c_t: "C" } },
      { text: "論理的に分析してから決める", axes: { n_o: "N", i_r: "I", f_m: "M", c_t: "T" } },
      { text: "感情や気持ちを重視して決める", axes: { n_o: "D", i_r: "O", f_m: "F", c_t: "C" } }
    ]
  },
  {
    question: "理想の休日の過ごし方は？",
    options: [
      { text: "アクティブに外出して刺激を求める", axes: { n_o: "N", i_r: "I", f_m: "F", c_t: "T" } },
      { text: "家族や親しい人とゆっくり過ごす", axes: { n_o: "D", i_r: "O", f_m: "F", c_t: "C" } },
      { text: "趣味や学習に集中する", axes: { n_o: "N", i_r: "I", f_m: "M", c_t: "T" } },
      { text: "自然体でリラックスして過ごす", axes: { n_o: "D", i_r: "O", f_m: "F", c_t: "C" } }
    ]
  },
  {
    question: "人生で大切にしていることは？",
    options: [
      { text: "自分らしさを表現すること", axes: { n_o: "N", i_r: "I", f_m: "F", c_t: "T" } },
      { text: "大切な人との絆を深めること", axes: { n_o: "D", i_r: "O", f_m: "F", c_t: "C" } },
      { text: "目標を達成すること", axes: { n_o: "N", i_r: "I", f_m: "M", c_t: "T" } },
      { text: "心の平安と調和を保つこと", axes: { n_o: "D", i_r: "O", f_m: "F", c_t: "C" } }
    ]
  }
];

// Character Codeタイプ計算ロジック
export const calculateCharacterCode16Type = (answers) => {
  const scores = {
    n_o_n: 0, n_o_d: 0,
    i_r_i: 0, i_r_o: 0, 
    f_m_f: 0, f_m_m: 0,
    c_t_c: 0, c_t_t: 0
  };

  // 各回答を集計
  Object.values(answers).forEach(answer => {
    if (answer.axes.n_o === "N") scores.n_o_n++;
    if (answer.axes.n_o === "D") scores.n_o_d++;
    if (answer.axes.i_r === "I") scores.i_r_i++;
    if (answer.axes.i_r === "O") scores.i_r_o++;
    if (answer.axes.f_m === "F") scores.f_m_f++;
    if (answer.axes.f_m === "M") scores.f_m_m++;
    if (answer.axes.c_t === "C") scores.c_t_c++;
    if (answer.axes.c_t === "T") scores.c_t_t++;
  });

  // 各軸の決定
  const n_o = scores.n_o_n >= scores.n_o_d ? "N" : "D";
  const i_r = scores.i_r_i >= scores.i_r_o ? "I" : "O"; 
  const f_m = scores.f_m_f >= scores.f_m_m ? "F" : "M";
  const c_t = scores.c_t_c >= scores.c_t_t ? "C" : "T";

  // 16タイプコードの組み立て
  const characterCode = `${n_o}${i_r}${f_m}${c_t}`;
  
  return CHARACTER_CODE_16_TYPES[characterCode] || CHARACTER_CODE_16_TYPES.DIFT; // デフォルト
};