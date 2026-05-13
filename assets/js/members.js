const membersData = [
    {
        id: "nakanishi",
        nameJa: "中西 渓斗",
        nameEn: "Nakanishi Keito",
        roles: ["Co-Representatives", "Member Manager", "PR/ Media Manager", "Self Resource Manager"],
        faculty: "経済学部3年",
        image: "images/中西渓斗.webp",
        history: `2024/09 ビジネスコンテストKING出場
2024/09 CM参画
2025/01 株式会社ジコウ_インターン
2025/04 農業PJ始動
2025/07 農業PJ離脱
2025/07 株式会社ジコウ離脱
2025/10 QUSIS共同代表就任
2025/10 株式会社アルファドライブ_インターン
2026/02 株式会社MarchOn（アルファドライブの子会社）_インターン
2026/04 ゼロイチAWARD統括`
    },
    {
        id: "matsuo",
        nameJa: "松尾 響起",
        nameEn: "Matsuo Hibiki",
        roles: ["Co-Representatives"],
        faculty: "経済学部3年",
        image: "images/松尾響起.webp",
        history: `2024/09 CM参画
2025/04 QUSIS共同代表就任
2025/11 株式会社oxxx インターン`
    },
    {
        id: "sakai",
        nameJa: "坂井 洸太",
        nameEn: "Sakai Kota",
        roles: ["Member Manager", "PR/ Media Manager", "Self Resource Manager"],
        faculty: "理学部2年",
        image: "images/坂井洸太.webp",
        history: `2025/07 インキュベーションプログラム「ゼロイチ」優勝
2025/08 株式会社スチームシップ_インターン
2025/09 CM参画
2025/10 Giving Campaign 2025_QUSIS全体統括
2025/11 株式会社丸の内インベストメントグループ_インターン
2025/11 日本言語学オリンピック2026銅賞
2026/01 株式会社スチームシップ離脱
2026/01 基本情報技術者になる
2026/03 インキュベーションプログラム「ゼロイチ」全体統括
2026/03 株式会社丸の内インベストメントグループ離脱
2026/04 Fabeee株式会社_インターン
2026/04 AIコンサル事業始動
2026/04 部活動総合アプリ開発PJ始動`
    },
    {
        id: "kimoto",
        nameJa: "木元 優",
        nameEn: "Kimoto Yu",
        roles: ["Member Manager"],
        faculty: "経済学部2年",
        image: "images/木元優.webp",
        history: `2025/07 IVS NEXTスタッフ参加
2025/07 QUSISインキュベーションプログラム「ゼロイチ」_準優勝＆オーディエンス賞
2025/07 CM参画_部室活動日担当
2025/08-09 リクルート主催プログラム「WOW BASE」_美容師の離職率改善策アイデアの提案
2025/10 QUSIS部室活動日企画_「話し方講座」
2025/11 QSHOPチーム（ウクライナ料理「ボルシチ」を九大祭で出店）参画_最優秀賞獲得
2026/02 Q-dai Rainbow Link参画_広報担当
2026/03 特定非営利法人セルプセンター福岡_インターン`
    },
    {
        id: "hirayama",
        nameJa: "平山 紗楽",
        nameEn: "Hirayama Sara",
        roles: ["PR/ Media Manager", "Self Resource Manager"],
        faculty: "共創学部2年",
        image: "images/平山紗楽.webp",
        history: `2025/05 アイデア・バトル採択
2025/07 IVS NEXTスタッフ参加
2025/8 Thursday Gathering アンバサダー
2025/8 Fullasia 上海プログラム参加
2025/09 CM参画_渉外担当
2025/10 Giving Campaign 2025
2025/10 Colive Fukuoka ボランティアスタッフ
2025/10 F Venturesインターン
2026/01 TORYUMON KYUSHU 2026 焔_代表
2026/03 PARKS 韓国プログラム参加
2026/04 Takeoff Tokyo ボランティアスタッフ
2026/04 SusHi Tech 2026 ボランティアスタッフ`
    },
    {
        id: "sakoziri",
        nameJa: "迫尻 礼杜",
        nameEn: "Sakoziri Reito",
        roles: ["Space Manager"],
        faculty: "工学部2年",
        image: "images/迫尻礼杜.webp",
        history: `2025/04 QSHOP｢サンキュー！マッスル｣参画
2025/05 アイデア・バトル採択
2025/07 株式会社corte_インターン
2025/09 CM参画
2025/10 株式会社corte離脱
2026/03 サンキュー！マッスル解散
2026/04 先端医療デバイス研究室_研究生`
    },
    {
        id: "nakanome",
        nameJa: "中ノ目 ゆう",
        nameEn: "Nakanome Yuu",
        roles: ["Project Manager"],
        faculty: "共創学部2年",
        image: "images/中ノ目ゆう.webp",
        history: `2025/06 先生の探究学習プログラム「先タン」登壇
2025/07 インキュベーションプログラム「ゼロイチ」準優勝＆オーディエンス賞
2025/07 株式会社Playflow_インターン
2025/08 ラオスの教育ボランティア参加
2025/09 CM参画_修羅プロ担当
2025/09 株式会社へいせい_インターン
2025/12 昭和レトロ仮装イベントナガトレトロ_イベントMC
2026/04 ゼロイチAward_MC`
    },
    {
        id: "kuroiwa",
        nameJa: "黒岩 康佑",
        nameEn: "Kuroiwa Kosuke",
        roles: ["Project Manager"],
        faculty: "経済学部2年",
        image: "images/黒岩康佑.webp"
    },
    {
        id: "kinoshita",
        nameJa: "木下 茉莉花",
        nameEn: "Kinoshita Marika",
        roles: ["Project Manager"],
        faculty: "共創学部2年",
        image: "images/木下茉莉花.webp",
        history: `2025/05 アイデア・バトル採択（高校生の探究学習の大学生メンター）
2025/5 IQLab コンサルインターン
2025/7 QUSISインキュベーションプログラム「ゼロイチ」優勝
2025/9 CAPタイ短期留学
2025/9 QUSIS CM参画
2025/11  IQLab コンサルインターン離脱
2025/12 九大ギルド初期メンバー
2026/02 アイデアバトル採択(自炊塾)
2026/03 PARKS韓国プログラム参加`
    }
];

// Export if using modules, but for vanilla script tag inclusion, it's global
// window.membersData = membersData;
