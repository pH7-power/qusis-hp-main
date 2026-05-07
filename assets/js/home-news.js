document.addEventListener('DOMContentLoaded', () => {
    const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbyU06AKU3Pq4v7tqEQzCkDv1-FgZGMW0eewWvWRVwHjCnwlD2GhotLgWROS2qjsgIU45g/exec';
    const CACHE_KEY = 'qusis_news_cache';
    const homeNewsList = document.getElementById('home-news-list');

    if (!homeNewsList) return;

    // Helper to format date
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}.${m}.${d}`;
    };
    
    const optimizeDriveUrl = (url, width = 400) => {
        if (!url || !url.includes('drive.google.com')) return url;
        const match = url.match(/\/d\/([^\/]+)/);
        if (match && match[1]) {
            return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w${width}`;
        }
        return url;
    };

    const renderNews = (newsItems) => {
        const top3 = newsItems.slice(0, 3);
        
        homeNewsList.style.opacity = '0'; // For fade-in effect
        
        homeNewsList.innerHTML = top3.map(item => `
            <li>
                <a href="news-detail.html?id=${item.id}">
                    <span class="date">${formatDate(item.date)}</span>
                    <span class="category-tag">${item.category || 'お知らせ'}</span>
                    <span class="title">${item.title}</span>
                </a>
            </li>
        `).join('');

        // Fade in
        setTimeout(() => {
            homeNewsList.style.transition = 'opacity 0.8s ease';
            homeNewsList.style.opacity = '1';
        }, 50);
    };

    // Show skeletons while loading
    const showSkeletons = () => {
        homeNewsList.innerHTML = Array(3).fill(0).map(() => `
            <li class="skeleton-list-item" style="display: flex; align-items: center; padding: 20px 0; gap: 30px; border-bottom: 1px solid #eee;">
                <div class="skeleton-date" style="width: 80px; height: 16px; background: #f5f5f5; border-radius: 4px;"></div>
                <div class="skeleton-tag" style="width: 60px; height: 20px; background: #f5f5f5; border-radius: 4px;"></div>
                <div class="skeleton-title" style="flex: 1; height: 20px; background: #f5f5f5; border-radius: 4px;"></div>
            </li>
        `).join('');
    };

    const init = async () => {
        // 1. Try Cache
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            renderNews(JSON.parse(cached));
        } else {
            showSkeletons();
        }

        // 2. Fetch Fresh
        try {
            const url = `${GAS_API_URL}?t=${new Date().getTime()}`;
            const response = await fetch(url);
            const data = await response.json();
            
            // Sort by date desc
            data.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
            renderNews(data);
        } catch (err) {
            console.error('Home news fetch failed:', err);
            if (!cached) {
                homeNewsList.innerHTML = '<li>ニュースの取得に失敗しました。</li>';
            }
        }
    };

    init();
});
