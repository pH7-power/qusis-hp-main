document.addEventListener('DOMContentLoaded', () => {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded');
    }

    // --- Render Functions ---

    const renderFacts = () => {
        const container = document.getElementById('basic-facts-container');
        if (!container) return;

        container.innerHTML = aboutData.basicFacts.map(fact => `
            <div class="fact-card">
                <div class="fact-value font-en">${fact.value}<span class="fact-unit">${fact.unit}</span></div>
                <div class="fact-label">${fact.label}</div>
                <div class="fact-sub">${fact.sub}</div>
            </div>
        `).join('');
    };

    const renderCharts = () => {
        // Doughnut Charts (unchanged)
        const gradeCtx = document.getElementById('chart-grade');
        if (gradeCtx) {
            new Chart(gradeCtx, {
                type: 'doughnut',
                data: {
                    labels: aboutData.compositionData.grade.map(d => d.name),
                    datasets: [{
                        data: aboutData.compositionData.grade.map(d => d.value),
                        backgroundColor: ['#71dddc', '#20B2AA', '#48D1CC', '#AFEEEE', '#E0FFFF', '#5F9EA0', '#4682B4', '#B0C4DE'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'right', labels: { boxWidth: 12, font: { family: "'Montserrat', sans-serif" } } } },
                    cutout: '60%'
                }
            });
        }

        const facultyCtx = document.getElementById('chart-faculty');
        if (facultyCtx) {
            new Chart(facultyCtx, {
                type: 'doughnut',
                data: {
                    labels: aboutData.compositionData.faculty.map(d => d.name),
                    datasets: [{
                        data: aboutData.compositionData.faculty.map(d => d.value),
                        backgroundColor: ['#006666', '#71dddc', '#20B2AA', '#66CDAA', '#AFEEEE'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'right', labels: { boxWidth: 12 } } },
                    cutout: '60%'
                }
            });
        }

        // Country List
        const countryContainer = document.getElementById('country-list');
        if (countryContainer) {
            countryContainer.innerHTML = aboutData.compositionData.country.map(c => `
                <li class="country-item">
                    <span class="country-flag"><img src="https://flagcdn.com/24x18/${c.code.toLowerCase()}.png" alt="${c.name}"></span>
                    <span class="country-name font-en">${c.name}</span>
                </li>
            `).join('');
        }
    };

    const renderHistory = () => {
        const container = document.getElementById('history-container');
        if (!container) return;

        aboutData.historyData.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = 'history-row';
            row.dataset.year = item.year;
            row.innerHTML = `
                <div class="history-year-label font-en">${item.year}</div>
                <h3 class="history-title">${item.title}</h3>
                <p class="history-desc">${item.description}</p>
            `;
            container.appendChild(row);
        });
    };



    // --- Interaction ---
    const initInteractions = () => {
        // Sticky History Logic
        const fixedYear = document.getElementById('history-fixed-year');
        const historyRows = document.querySelectorAll('.history-row');

        if (fixedYear && historyRows.length > 0) {
            // Scroll interaction for history rows (Screen-based trigger)
            const historyObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Remove active from all rows
                        historyRows.forEach(r => r.classList.remove('active'));
                        // Set active on intersecting row
                        entry.target.classList.add('active');
                        // Update Fixed Year display with a subtle animation
                        if (entry.target.dataset.year && fixedYear.textContent !== entry.target.dataset.year) {
                            fixedYear.style.opacity = '0';
                            fixedYear.style.transform = 'translateY(-50%) scale(0.8)';
                            
                            setTimeout(() => {
                                fixedYear.textContent = entry.target.dataset.year;
                                fixedYear.style.opacity = '1';
                                fixedYear.style.transform = 'translateY(-50%) scale(1)';
                            }, 150);
                        }
                    }
                });
            }, {
                root: null,
                rootMargin: "-45% 0px -45% 0px", // Targeted middle area
                threshold: 0
            });

            historyRows.forEach(row => historyObserver.observe(row));
        }

        // Shared Value Scroll Experience
        const svElements = document.querySelectorAll('.sv-list-item, .sv-climax');
        if (svElements.length > 0) {
            const svObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    } else {
                        entry.target.classList.remove('is-visible');
                    }
                });
            }, {
                root: null,
                threshold: 0.3,
                rootMargin: "-10% 0px -10% 0px"
            });
            svElements.forEach(el => svObserver.observe(el));
        }

        // Story Fade-in (Mission/Vision/Concept)
        const storyFadeElements = document.querySelectorAll('.story-fade-in');
        if (storyFadeElements.length > 0) {
            const storyObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    }
                });
            }, {
                threshold: 0.2
            });
            storyFadeElements.forEach(el => storyObserver.observe(el));
        }
    };


    // --- Init ---
    renderFacts();
    renderCharts();
    renderHistory();
    initInteractions();

});
