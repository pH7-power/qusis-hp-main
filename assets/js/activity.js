document.addEventListener('DOMContentLoaded', () => {
  const activityData = {
    zero_one: {
      title: 'ゼロイチ',
      body: `【目的】新入部員向け事業創造プログラム<br>
【ステップ】①企画募集 → ②チーム編成 → ③実装・発表<br>
【内容】1ヶ月という短期間で、アイデア出しからプロトタイプ制作、ピッチまでを経験する、QUSIS独自の超実践型オンボーディングプログラムです。`
    },
    shura: {
      title: '修羅プログラム',
      body: `【目的】自己目標設定と検証<br>
【ステップ】①自己分析 → ②目標設定 → ③実践・レビュー<br>
【内容】自身の現状と理想のギャップを埋めるため、具体的なKPIを設定し、毎週の進捗報告とフィードバックを通じて、圧倒的なスピード感で事業やプロジェクトを前進させるプログラムです。`
    },
    club: {
      title: '部室活動日',
      body: `【目的】セレンディピティ創出<br>
【ステップ】①テーマ決定 → ②ワークショップ → ③成果共有<br>
【内容】週に一度、メンバーがリアルに集まる場。企業様からの課題解決ワークショップや、メンバー同士の壁打ち、最新技術の共有など、意図的な偶発性を生み出すコンテンツを実施しています。`
    },
    other: {
      title: 'その他の活動',
      body: `【概要】QUSISでは上記以外にも、多様な活動を展開しています。<br>
・外部起業家を招いた講演会<br>
・合宿型ビジネスコンテストへの参加<br>
・自治体や企業との共同プロジェクト<br>
・メンバー発信の勉強会や交流イベント<br>
【実績】これまで数多くの外部連携やコミュニティ活動を通じて、学生の枠を超えた価値創出に取り組んできました。`
    }
  };

  const modal = document.getElementById('activity-modal');
  const modalTitle = modal.querySelector('.modal-title');
  const modalText = modal.querySelector('.modal-text');
  const closeBtn = modal.querySelector('.close');

  // カードクリックでモーダル表示
  document.querySelectorAll('.poster-card').forEach(card => {
    card.addEventListener('click', () => {
      const key = card.dataset.key;
      const data = activityData[key];
      if (data) {
        modalTitle.textContent = data.title;
        modalText.innerHTML = data.body;
        modal.classList.add('show');
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // スクロール防止
      }
    });
  });

  // モーダル閉じる処理
  const closeModal = () => {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.classList.add('hidden');
    }, 300); // Transition時間に合わせる
    document.body.style.overflow = '';
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });
});
