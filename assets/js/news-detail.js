document.addEventListener('DOMContentLoaded', () => {
    const GAS_API_URL = ''; // Same URL as news.js
    const detailContainer = document.getElementById('news-detail-container');

    // Get ID from URL
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('id');

    if (!articleId) {
        detailContainer.innerHTML = '<p>記事が見つかりません。</p>';
        return;
    }

    // --- Mock Data (for fallback) ---
    const mockNews = []; // ... same as news.js or similar
    for(let i=1; i<=25; i++) {
        mockNews.push({
            id: i,
            date: '2026.05.01',
            category: i === 1 ? 'お知らせ' : (i % 2 === 0 ? 'イベント' : 'メディア情報'),
            title: i === 1 ? 'QUSIS公式サイトをリニューアルしました' : `ニュース記事のサンプルタイトル #${i}`,
            subtitle: '次世代のリーダーたちと共に、新たな価値を創出する',
            image_url: `images/HP使用画像/${(i % 7) + 7}.png`,
            pickup_flag: i === 1,
            content: `
                <p>QUSISはこの度、公式サイトを全面的にリニューアルいたしました。今回のリニューアルでは、ユーザーの皆様がより使いやすく、活動内容を直感的に理解できるデザインを目指しました。</p>
                <p>今後は、本ニュースページを通じて、イベント情報や活動報告、メディア掲載情報などを積極的に発信してまいります。</p>
                <p>引き続き、QUSISをよろしくお願い申し上げます。</p>
                <p>【お問い合わせ先】<br>QUSIS運営事務局<br>Email: contact@qusis.com</p>
            `
        });
    }

    const init = async () => {
        let article = null;

        if (GAS_API_URL) {
            try {
                const response = await fetch(GAS_API_URL);
                const allNews = await response.json();
                article = allNews.find(n => String(n.id) === String(articleId));
            } catch (err) {
                console.error('Failed to fetch article:', err);
                article = mockNews.find(n => String(n.id) === String(articleId));
            }
        } else {
            article = mockNews.find(n => String(n.id) === String(articleId));
        }

        if (article) {
            renderDetail(article);
        } else {
            detailContainer.innerHTML = '<p>記事が見つかりませんでした。</p>';
        }
    };

    const renderDetail = (article) => {
        document.title = `${article.title} | QUSIS`;

        detailContainer.innerHTML = `
            <article class="news-article">
                <header class="news-detail-header">
                    <span class="detail-category">${article.category}</span>
                    <h1 class="detail-title">${article.title}</h1>
                    <span class="detail-subtitle">${article.subtitle}</span>
                    
                    <div class="detail-meta">
                        <span class="detail-org">QUSIS</span>
                        <span class="detail-date">${article.date}</span>
                        <div class="detail-share-icons">
                            <a href="#" title="X (Twitter)">𝕏</a>
                            <a href="#" title="Facebook">f</a>
                            <a href="#" title="Copy Link">🔗</a>
                        </div>
                    </div>
                </header>

                <div class="detail-main-visual">
                    <img src="${article.image_url}" alt="${article.title}">
                </div>

                <div class="detail-content">
                    ${article.content}
                </div>
                
                <div style="text-align: center; margin-top: 80px;">
                    <a href="news.html" class="btn-primary">NEWS一覧へ戻る</a>
                </div>
            </article>
        `;
    };

    init();
});
