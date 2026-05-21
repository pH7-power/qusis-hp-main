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
            console.error("News Load Error:", err);
            if (!cachedData) {
                detailContainer.innerHTML = '';
                const p = document.createElement('p');
                p.style.textAlign = 'center';
                p.style.padding = '100px';
                p.textContent = 'ニュースの読み込みに失敗しました。';
                detailContainer.appendChild(p);
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
        // Document title is safe as it's assigned directly
        document.title = `${article.title} | QUSIS`;

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

        detailContainer.innerHTML = ''; // Clear safely

        const articleElem = document.createElement('article');
        articleElem.className = 'news-article fade-in';

        // Header
        const header = document.createElement('header');
        header.className = 'news-detail-header';

        const spanCategory = document.createElement('span');
        spanCategory.className = 'detail-category';
        spanCategory.textContent = article.category || '';

        const h1Title = document.createElement('h1');
        h1Title.className = 'detail-title';
        h1Title.textContent = article.title || '';

        const spanSubtitle = document.createElement('span');
        spanSubtitle.className = 'detail-subtitle';
        spanSubtitle.textContent = article.subtitle || '';

        // Meta (Date and Share Icons)
        const divMeta = document.createElement('div');
        divMeta.className = 'detail-meta';

        const spanDate = document.createElement('span');
        spanDate.className = 'detail-date';
        spanDate.textContent = formatDate(article.date);

        const divShare = document.createElement('div');
        divShare.className = 'detail-share-icons';

        const aX = document.createElement('a');
        aX.href = article.X || 'https://x.com/QUSIS_';
        aX.target = '_blank';
        aX.rel = 'noopener noreferrer';
        aX.title = 'X (Twitter)';
        aX.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;

        const aInstagram = document.createElement('a');
        aInstagram.href = article.instagram || 'https://www.instagram.com/qusis2025_/';
        aInstagram.target = '_blank';
        aInstagram.rel = 'noopener noreferrer';
        aInstagram.title = 'Instagram';
        aInstagram.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>`;

        const aCopy = document.createElement('a');
        aCopy.href = '#';
        aCopy.id = 'copy-link';
        aCopy.title = 'Copy Link';
        aCopy.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`;

        divShare.appendChild(aX);
        divShare.appendChild(aInstagram);
        divShare.appendChild(aCopy);

        divMeta.appendChild(spanDate);
        divMeta.appendChild(divShare);

        header.appendChild(spanCategory);
        header.appendChild(h1Title);
        header.appendChild(spanSubtitle);
        header.appendChild(divMeta);

        // Main Visual Image
        const divVisual = document.createElement('div');
        divVisual.className = 'detail-main-visual';
        const img = document.createElement('img');
        img.src = optimizeDriveUrl(article.image_url);
        img.alt = article.title || '';
        img.loading = 'lazy';
        divVisual.appendChild(img);

        // Content
        const divContent = document.createElement('div');
        divContent.className = 'detail-content';
        divContent.innerHTML = formattedContent;

        // Back Link
        const divBack = document.createElement('div');
        divBack.style.textAlign = 'center';
        divBack.style.marginTop = '80px';
        const aBack = document.createElement('a');
        aBack.href = 'news.html';
        aBack.className = 'btn-primary';
        aBack.textContent = 'NEWS一覧へ戻る';
        divBack.appendChild(aBack);

        // Append everything
        articleElem.appendChild(header);
        articleElem.appendChild(divVisual);
        articleElem.appendChild(divContent);
        articleElem.appendChild(divBack);
        detailContainer.appendChild(articleElem);

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
