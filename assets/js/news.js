document.addEventListener('DOMContentLoaded', () => {
    // API URL
    const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbyU06AKU3Pq4v7tqEQzCkDv1-FgZGMW0eewWvWRVwHjCnwlD2GhotLgWROS2qjsgIU45g/exec'; 

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

    // --- Date Formatter ---
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr; 
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}.${m}.${d}`;
    };

    // --- Initialization ---
    const init = async () => {
        try {
            const response = await fetch(GAS_API_URL);
            allNews = await response.json();
            
            // Sort by date descending
            allNews.sort((a, b) => new Date(b.date) - new Date(a.date));

            renderAll();
        } catch (err) {
            console.error('Failed to fetch news:', err);
            newsContainer.innerHTML = '<p style="text-align:center; padding: 40px;">ニュースの読み込みに失敗しました。後ほど再度お試しください。</p>';
        }
    };

    // --- Render Functions ---

    const renderAll = () => {
        renderPickup();
        renderFilteredList();
    };

    const renderPickup = () => {
        // Find latest pickup item (pickup header is used)
        const pickupItem = allNews.find(n => n.pickup === true || String(n.pickup).toUpperCase() === 'TRUE') || allNews[0];
        if (!pickupItem) return;

        pickupSection.innerHTML = `
            <a href="news-detail.html?id=${pickupItem.id}" class="pickup-item fade-in">
                <div class="pickup-bg" style="background-image: url('${pickupItem.image_url}')"></div>
                <div class="pickup-overlay"></div>
                <div class="pickup-content">
                    <span class="pickup-label">PICKUP</span>
                    <h2 class="pickup-title">${pickupItem.title}</h2>
                    <p>MORE DETAIL →</p>
                </div>
            </a>
        `;
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
