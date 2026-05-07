document.addEventListener('DOMContentLoaded', () => {
    const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbyU06AKU3Pq4v7tqEQzCkDv1-FgZGMW0eewWvWRVwHjCnwlD2GhotLgWROS2qjsgIU45g/exec';
    const CACHE_KEY = 'qusis_news_cache';
    const topNewsList = document.getElementById('top-news-list');

    if (!topNewsList) return;

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}.${m}.${d}`;
    };

    const renderTopNews = (newsItems) => {
        const top3 = newsItems.slice(0, 3);
        topNewsList.innerHTML = top3.map(item => `
            <li>
                <a href="news-detail.html?id=${item.id}">
                    <span class="date">${formatDate(item.date)}</span>
                    <span class="title">${item.title}</span>
                </a>
            </li>
        `).join('');
    };

    const init = async () => {
        // 1. Load from Cache first
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
            const allNews = JSON.parse(cachedData);
            renderTopNews(allNews);
        } else {
            topNewsList.innerHTML = '<li>読み込み中...</li>';
        }

        // 2. Fetch fresh data
        try {
            const urlWithCacheBust = `${GAS_API_URL}?t=${new Date().getTime()}`;
            const response = await fetch(urlWithCacheBust);
            const freshData = await response.json();
            
            // Sort by date descending
            freshData.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Update UI and Cache
            localStorage.setItem(CACHE_KEY, JSON.stringify(freshData));
            renderTopNews(freshData);
        } catch (err) {
            console.error('Failed to fetch top news:', err);
            if (!cachedData) {
                topNewsList.innerHTML = '<li>ニュースの取得に失敗しました。</li>';
            }
        }
    };

    init();
});
