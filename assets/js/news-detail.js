document.addEventListener('DOMContentLoaded', () => {
    const escapeHTML = (str) => {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

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
        if (isNaN(date.getTime())) return escapeHTML(dateStr);
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}.${m}.${d}`;
    };

    const optimizeDriveUrl = (url, width = 1200) => {
        if (!url || !url.includes('drive.google.com')) return url;
        const match = url.match(/(?:\/d\/|id=)([\w-]+)/);
        if (match && match[1]) {
            return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w${width}`;
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
        document.title = `${escapeHTML(article.title)} | QUSIS`;

        // Data Cleansing and Header Conversion
        const cleanContent = article.content.trim().replace(/^\ufeff/g, '');
        const safeContent = escapeHTML(cleanContent);
        
        // 1. Convert 【 】 to headers
        // 2. Convert **bold** to <strong>
        // 3. Convert Google Drive links to <img> tags
        const formattedContent = safeContent
            .replace(/【(.*?)】/g, '<h3>【$1】</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/(https?:\/\/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([\w-]+)[^\s<]*)/g, (match, url, id) => {
                const imgUrl = `https://drive.google.com/thumbnail?id=${id}&sz=w1200`;
                return `<img src="${imgUrl}" alt="本文画像" class="content-drive-img">`;
            });

        detailContainer.innerHTML = `
            <article class="news-article fade-in">
                <header class="news-detail-header">
                    <span class="detail-category">${escapeHTML(article.category)}</span>
                    <h1 class="detail-title">${escapeHTML(article.title)}</h1>
                    <span class="detail-subtitle">${escapeHTML(article.subtitle)}</span>
                    
                    <div class="detail-meta">
                        <span class="detail-date">${formatDate(article.date)}</span>
                        <div class="detail-share-icons">
                            <a href="${escapeHTML(article.X || 'https://x.com/QUSIS_')}" target="_blank" rel="noopener noreferrer" title="X (Twitter)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </a>
                            <a href="${escapeHTML(article.instagram || 'https://www.instagram.com/qusis2025_/')}" target="_blank" rel="noopener noreferrer" title="Instagram">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                            </a>
                            <a href="#" id="copy-link" title="Copy Link">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                            </a>
                        </div>
                    </div>
                </header>

                <div class="detail-main-visual">
                    <img src="${escapeHTML(optimizeDriveUrl(article.image_url))}" alt="${escapeHTML(article.title)}" loading="lazy">
                </div>

                <div class="detail-content">
                    ${formattedContent}
                </div>
                
                <div style="text-align: center; margin-top: 80px;">
                    <a href="news.html" class="btn-primary">NEWS一覧へ戻る</a>
                </div>
            </article>
        `;

        // Add Copy Link logic
        const copyBtn = document.getElementById('copy-link');
        if (copyBtn) {
            copyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                navigator.clipboard.writeText(window.location.href).then(() => {
                    alert('リンクをコピーしました！');
                });
            });
        }
    };

    init();
});
