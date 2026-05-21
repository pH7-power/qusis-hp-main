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
        if (isNaN(date.getTime())) return escapeHTML(dateStr); 
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}.${m}.${d}`;
    };

    const optimizeDriveUrl = (url, width = 600) => {
        if (!url || !url.includes('drive.google.com')) return url;
        const match = url.match(/(?:\/d\/|id=)([\w-]+)/);
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
            console.error("News Load Error:", err);
            if (!cachedData) {
                newsContainer.innerHTML = '';
                const p = document.createElement('p');
                p.style.textAlign = 'center';
                p.style.padding = '40px';
                p.textContent = 'ニュースの読み込みに失敗しました。';
                newsContainer.appendChild(p);
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
        pickupSection.innerHTML = ''; // Clear safely

        pickupItems.forEach(item => {
            const a = document.createElement('a');
            a.href = `news-detail.html?id=${encodeURIComponent(item.id)}`;
            a.className = 'pickup-item fade-in';

            const imgBg = document.createElement('img');
            imgBg.className = 'pickup-bg';
            imgBg.style.objectFit = 'cover';
            imgBg.src = optimizeDriveUrl(item.image_url, 1000);
            imgBg.alt = item.title || '';

            const divOverlay = document.createElement('div');
            divOverlay.className = 'pickup-overlay';

            const divContent = document.createElement('div');
            divContent.className = 'pickup-content';

            const spanLabel = document.createElement('span');
            spanLabel.className = 'pickup-label';
            spanLabel.textContent = 'PICKUP';

            const h2Title = document.createElement('h2');
            h2Title.className = 'pickup-title';
            h2Title.textContent = item.title || '';

            const pDetail = document.createElement('p');
            pDetail.textContent = 'MORE DETAIL →';

            divContent.appendChild(spanLabel);
            divContent.appendChild(h2Title);
            divContent.appendChild(pDetail);

            a.appendChild(imgBg);
            a.appendChild(divOverlay);
            a.appendChild(divContent);

            pickupSection.appendChild(a);
        });
    };

    const renderFilteredList = () => {
        const filtered = allNews.filter(n => currentCategory === 'すべて' || n.category === currentCategory);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const pageItems = filtered.slice(startIndex, startIndex + itemsPerPage);

        renderList(pageItems);
        renderPagination(filtered.length);
    };

    const renderList = (items) => {
        newsContainer.innerHTML = ''; // Clear safely

        if (items.length === 0) {
            const p = document.createElement('p');
            p.style.textAlign = 'center';
            p.style.padding = '40px';
            p.textContent = '該当するニュースはありません。';
            newsContainer.appendChild(p);
            return;
        }

        items.forEach((item, index) => {
            const a = document.createElement('a');
            a.href = `news-detail.html?id=${encodeURIComponent(item.id)}`;
            a.className = 'news-list-item fade-in';
            a.style.animationDelay = `${index * 0.05}s`;

            const spanDate = document.createElement('span');
            spanDate.className = 'news-date';
            spanDate.textContent = formatDate(item.date);

            const spanCategory = document.createElement('span');
            spanCategory.className = 'news-category-tag';
            spanCategory.textContent = item.category || '';

            const spanTitle = document.createElement('span');
            spanTitle.className = 'news-list-title';
            spanTitle.textContent = item.title || '';

            a.appendChild(spanDate);
            a.appendChild(spanCategory);
            a.appendChild(spanTitle);

            newsContainer.appendChild(a);
        });
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
