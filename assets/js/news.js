document.addEventListener('DOMContentLoaded', () => {
    // API URL
    const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbyU06AKU3Pq4v7tqEQzCkDv1-FgZGMW0eewWvWRVwHjCnwlD2GhotLgWROS2qjsgIU45g/exec'; 
    const CACHE_KEY = 'qusis_news_cache';

    // Elements
    const pickupSection = document.getElementById('news-pickup');
    const newsContainer = document.getElementById('news-list-container');
    const paginationContainer = document.getElementById('pagination');
    const filterTabs = document.querySelectorAll('.filter-tab');

    // State
    let allNews = [];
    let currentCategory = 'すべて';
    let currentPage = 1;
    const itemsPerPage = 10;

    // --- Helpers ---
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

    // --- Initialization (SWR Pattern) ---
    const init = async () => {
        // 1. Load from Cache first
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
            allNews = JSON.parse(cachedData);
            renderAll();
        } else {
            renderSkeleton();
        }

        // 2. Fetch fresh data from API
        try {
            const urlWithCacheBust = `${GAS_API_URL}?t=${new Date().getTime()}`;
            const response = await fetch(urlWithCacheBust);
            const freshData = await response.json();
            
            // Sort by date descending
            freshData.sort((a, b) => new Date(b.date) - new Date(a.date));

            // 3. If data changed, update UI and Cache
            if (JSON.stringify(freshData) !== cachedData) {
                allNews = freshData;
                localStorage.setItem(CACHE_KEY, JSON.stringify(freshData));
                renderAll();
            }
        } catch (err) {
            console.error('Failed to fetch news:', err);
            if (!cachedData) {
                newsContainer.innerHTML = '<p style="text-align:center; padding: 40px;">ニュースの読み込みに失敗しました。</p>';
            }
        }
    };

    // --- Render Functions ---

    const renderSkeleton = () => {
        pickupSection.innerHTML = `<div class="skeleton skeleton-pickup"></div>`;
        newsContainer.innerHTML = Array(5).fill(0).map(() => `
            <div class="skeleton-list-item">
                <div class="skeleton skeleton-date"></div>
                <div class="skeleton skeleton-tag"></div>
                <div class="skeleton skeleton-title"></div>
            </div>
        `).join('');
    };

    const renderAll = () => {
        renderPickup();
        renderFilteredList();
    };

    const renderPickup = () => {
        const pickupItems = allNews.filter(n => n.pickup === true || String(n.pickup).toUpperCase() === 'TRUE');
        
        if (pickupItems.length === 0 && allNews.length > 0) {
            pickupItems.push(allNews[0]); // Fallback to latest
        }

        if (pickupItems.length === 0) {
            pickupSection.style.display = 'none';
            return;
        }

        pickupSection.style.display = 'grid';
        pickupSection.innerHTML = pickupItems.map(item => `
            <a href="news-detail.html?id=${item.id}" class="pickup-item fade-in">
                <div class="pickup-bg" style="background-image: url('${optimizeDriveUrl(item.image_url, 1000)}')"></div>
                <div class="pickup-overlay"></div>
                <div class="pickup-content">
                    <span class="pickup-label">PICKUP</span>
                    <h2 class="pickup-title">${item.title}</h2>
                    <p>MORE DETAIL →</p>
                </div>
            </a>
        `).join('');
    };

    const renderFilteredList = () => {
        const filtered = allNews.filter(n => currentCategory === 'すべて' || n.category === currentCategory);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const pageItems = filtered.slice(startIndex, startIndex + itemsPerPage);

        renderList(pageItems);
        renderPagination(filtered.length);
    };

    const renderList = (items) => {
        if (items.length === 0) {
            newsContainer.innerHTML = '<p style="text-align:center; padding: 40px;">該当するニュースはありません。</p>';
            return;
        }

        newsContainer.innerHTML = items.map((item, index) => `
            <a href="news-detail.html?id=${item.id}" class="news-list-item fade-in" style="animation-delay: ${index * 0.05}s">
                <span class="news-date">${formatDate(item.date)}</span>
                <span class="news-category-tag">${item.category}</span>
                <span class="news-list-title">${item.title}</span>
            </a>
        `).join('');
    };

    const renderPagination = (totalItems) => {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let html = '';
        for (let i = 1; i <= totalPages; i++) {
            html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        paginationContainer.innerHTML = html;

        paginationContainer.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentPage = parseInt(btn.dataset.page);
                renderFilteredList();
                window.scrollTo({ top: newsContainer.offsetTop - 150, behavior: 'smooth' });
            });
        });
    };

    // --- Filter Events ---
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCategory = tab.dataset.category;
            currentPage = 1;
            renderFilteredList();
        });
    });

    init();
});
