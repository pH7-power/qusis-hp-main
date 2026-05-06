document.addEventListener('DOMContentLoaded', () => {
    const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbyU06AKU3Pq4v7tqEQzCkDv1-FgZGMW0eewWvWRVwHjCnwlD2GhotLgWROS2qjsgIU45g/exec';
    const detailContainer = document.getElementById('news-detail-container');

    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('id');

    if (!articleId) {
        detailContainer.innerHTML = '<p style="text-align:center; padding:100px;">記事が見つかりません。</p>';
        return;
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}.${m}.${d}`;
    };

    const init = async () => {
        try {
            const response = await fetch(GAS_API_URL);
            const allNews = await response.json();
            const article = allNews.find(n => String(n.id) === String(articleId));

            if (article) {
                renderDetail(article);
            } else {
                detailContainer.innerHTML = '<p style="text-align:center; padding:100px;">記事が見つかりませんでした。</p>';
            }
        } catch (err) {
            console.error('Failed to fetch article:', err);
            detailContainer.innerHTML = '<p style="text-align:center; padding:100px;">ニュースの読み込みに失敗しました。</p>';
        }
    };

    const renderDetail = (article) => {
        document.title = `${article.title} | QUSIS`;

        detailContainer.innerHTML = `
            <article class="news-article fade-in">
                <header class="news-detail-header">
                    <span class="detail-category">${article.category}</span>
                    <h1 class="detail-title">${article.title}</h1>
                    <span class="detail-subtitle">${article.subtitle}</span>
                    
                    <div class="detail-meta">
                        <span class="detail-org">QUSIS</span>
                        <span class="detail-date">${formatDate(article.date)}</span>
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
