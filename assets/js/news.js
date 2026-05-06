document.addEventListener('DOMContentLoaded', () => {
    // API URL (User needs to replace this after deploying GAS)
    const GAS_API_URL = ''; 

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

    // --- Mock Data (for testing) ---
    const mockNews = [
        { id: 1, date: '2026.05.01', category: 'お知らせ', title: 'QUSIS公式サイトをリニューアルしました', subtitle: '最新情報を定期的にお届けします', image_url: 'images/HP使用画像/7.png', pickup_flag: true, content: '本文テキストがここに入ります。' },
        { id: 2, date: '2026.04.28', category: 'イベント', title: '春のピッチイベント開催決定！', subtitle: '若手起業家たちが集結', image_url: 'images/HP使用画像/8.png', pickup_flag: false, content: '詳細な内容...' },
        { id: 3, date: '2026.04.20', category: 'メディア情報', title: '代表・中西がテレビ番組に出演します', subtitle: '次世代のリーダー特集', image_url: 'images/HP使用画像/9.png', pickup_flag: false, content: '出演情報...' },
        // ... more items for pagination testing
    ];
    for(let i=4; i<=25; i++) {
        mockNews.push({
            id: i,
            date: `2026.04.${30-i}`,
            category: i % 2 === 0 ? 'お知らせ' : 'イベント',
            title: `ニュース記事のサンプルタイトル #${i}`,
            subtitle: 'サブラインテキストサンプル',
            image_url: `images/HP使用画像/${(i % 7) + 7}.png`,
            pickup_flag: false,
            content: 'サンプルコンテンツ'
        });
    }

    // --- Initialization ---
    const init = async () => {
        if (GAS_API_URL) {
            try {
                const response = await fetch(GAS_API_URL);
                allNews = await response.json();
            } catch (err) {
                console.error('Failed to fetch news:', err);
                allNews = mockNews;
            }
        } else {
            allNews = mockNews;
        }

        renderAll();
    };

    // --- Render Functions ---

    const renderAll = () => {
        renderPickup();
        renderFilteredList();
    };

    const renderPickup = () => {
        const pickupItem = allNews.find(n => n.pickup_flag === true || String(n.pickup_flag).toUpperCase() === 'TRUE') || allNews[0];
        if (!pickupItem) return;

        pickupSection.innerHTML = `
            <a href="news-detail.html?id=${pickupItem.id}" class="pickup-item">
                <div class="pickup-bg" style="background-image: url('${pickupItem.image_url}')"></div>
                <div class="pickup-overlay"></div>
                <div class="pickup-content">
                    <span class="pickup-label">PICKUP</span>
                    <h2 class="pickup-title">${pickupItem.title}</h2>
                    <p class="fade-text">MORE DETAIL →</p>
                </div>
            </a>
        `;
    };

    const renderFilteredList = () => {
        const filtered = allNews.filter(n => currentCategory === 'すべて' || n.category === currentCategory);
        
        // Pagination logic
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

        newsContainer.innerHTML = items.map(item => `
            <a href="news-detail.html?id=${item.id}" class="news-list-item">
                <span class="news-date">${item.date}</span>
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

        // Add events
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
            currentPage = 1; // Reset to page 1
            renderFilteredList();
        });
    });

    init();
});
