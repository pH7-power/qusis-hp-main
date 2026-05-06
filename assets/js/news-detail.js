document.addEventListener('DOMContentLoaded', () => {
    const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbyU06AKU3Pq4v7tqEQzCkDv1-FgZGMW0eewWvWRVwHjCnwlD2GhotLgWROS2qjsgIU45g/exec';
    const CACHE_KEY = 'qusis_news_cache';
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

    const optimizeDriveUrl = (url) => {
        if (!url || !url.includes('drive.google.com')) return url;
        const match = url.match(/\/d\/([^\/]+)/);
        if (match && match[1]) {
            return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1200`;
        }
        return url;
    };

    const init = async () => {
        // 1. Check Cache first
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
            const allNews = JSON.parse(cachedData);
            const article = allNews.find(n => String(n.id) === String(articleId));
            if (article) renderDetail(article);
        } else {
            renderSkeleton();
        }

        // 2. Fetch fresh data
        try {
            const urlWithCacheBust = `${GAS_API_URL}?t=${new Date().getTime()}`;
            const response = await fetch(urlWithCacheBust);
            const allNews = await response.json();
            
            // Update Cache
            localStorage.setItem(CACHE_KEY, JSON.stringify(allNews));

            const article = allNews.find(n => String(n.id) === String(articleId));
            if (article) {
                renderDetail(article);
            } else if (!cachedData) {
                detailContainer.innerHTML = '<p style="text-align:center; padding:100px;">記事が見つかりませんでした。</p>';
            }
        } catch (err) {
            console.error('Failed to fetch article:', err);
            if (!cachedData) {
                detailContainer.innerHTML = '<p style="text-align:center; padding:100px;">ニュースの読み込みに失敗しました。</p>';
            }
        }
    };

    const renderSkeleton = () => {
        detailContainer.innerHTML = `
            <div class="news-article">
                <header class="news-detail-header">
                    <div class="skeleton" style="width: 80px; height: 20px; margin: 0 auto 20px;"></div>
                    <div class="skeleton" style="width: 80%; height: 40px; margin: 0 auto 20px;"></div>
                    <div class="skeleton" style="width: 60%; height: 25px; margin: 0 auto 30px;"></div>
                    <div class="skeleton" style="width: 40%; height: 20px; margin: 0 auto;"></div>
                </header>
                <div class="skeleton" style="width: 100%; aspect-ratio: 16/9; border-radius: 8px; margin-bottom: 60px;"></div>
                <div class="skeleton" style="width: 100%; height: 200px;"></div>
            </div>
        `;
    };

    const renderDetail = (article) => {
        document.title = `${article.title} | QUSIS`;

        // Data Cleansing and Header Conversion
        const cleanContent = article.content.trim().replace(/^\ufeff/g, '');
        const formattedContent = cleanContent.replace(/【(.*?)】/g, '<h3>【$1】</h3>');

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
                    <img src="${optimizeDriveUrl(article.image_url)}" alt="${article.title}" loading="lazy">
                </div>

                <div class="detail-content">
                    ${formattedContent}
                </div>
                
                <div style="text-align: center; margin-top: 80px;">
                    <a href="news.html" class="btn-primary">NEWS一覧へ戻る</a>
                </div>
            </article>
        `;
    };

    init();
});
