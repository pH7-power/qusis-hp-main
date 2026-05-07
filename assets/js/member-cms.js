document.addEventListener('DOMContentLoaded', () => {
    // Check if data exists
    if (typeof membersData === 'undefined') {
        console.error('Members data not found. Make sure members.js is loaded.');
        return;
    }

    const filterContainer = document.getElementById('member-filter');
    const gridContainer = document.getElementById('member-grid');
    const modal = document.getElementById('member-modal');
    const modalImg = document.getElementById('modal-img');
    const modalNameJa = document.getElementById('modal-name-ja');
    const modalNameEn = document.getElementById('modal-name-en');
    const modalFaculty = document.getElementById('modal-faculty');
    const modalRoles = document.getElementById('modal-roles');
    const modalHistory = document.getElementById('modal-history');
    const modalHistoryContainer = document.getElementById('modal-history-container');
    const closeBtn = document.querySelector('.close');

    const allRoles = membersData.flatMap(m => m.roles);
    const preferredOrder = [
        "Co-Representatives",
        "Member Manager",
        "PR/ Media Manager",
        "Space Manager",
        "Project Manager",
        "Self Resource Manager"
    ];

    const uniqueParams = [...new Set(allRoles)];
    const sortedRoles = uniqueParams.sort((a, b) => {
        const indexA = preferredOrder.indexOf(a);
        const indexB = preferredOrder.indexOf(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });

    const roles = ['All', ...sortedRoles];
    let currentFilter = 'All';

    // --- Render Functions ---

    const renderFilter = () => {
        filterContainer.innerHTML = '';
        roles.forEach(role => {
            const li = document.createElement('li');
            li.textContent = role === 'All' ? 'ALL MEMBERS' : role.toUpperCase();
            li.dataset.filter = role;
            if (role === currentFilter) li.classList.add('active');

            li.addEventListener('click', () => {
                currentFilter = role;
                updateUI();
            });
            filterContainer.appendChild(li);
        });
    };

    const renderGrid = () => {
        const displayData = currentFilter === 'All'
            ? membersData
            : membersData.filter(m => m.roles.includes(currentFilter));

        if (!gridContainer) return;
        gridContainer.innerHTML = '';

        if (displayData.length === 0) {
            gridContainer.innerHTML = '<p style="color:white; text-align:center; grid-column: 1 / -1;">No members found.</p>';
            return;
        }

        displayData.forEach(member => {
            const card = document.createElement('div');
            card.className = 'poster-card';
            card.dataset.id = member.id;

            const rolesDisplay = member.roles.join(' / ');

            card.innerHTML = `
                <img src="${member.image}" alt="${member.nameJa}" onerror="this.src='assets/images/qusis-logo-color.png'; this.style.objectFit='contain';">
                <div class="poster-card-info">
                    <h3>${member.nameJa}<br><span style="font-size: 0.8rem; font-family: var(--font-en); font-weight: 400;">${member.nameEn}</span></h3>
                    <p style="font-size: 0.8rem; opacity: 0.9; margin-bottom: 2px;">${rolesDisplay}</p>
                    <p>${member.faculty}</p>
                </div>
            `;
            
            // Add click event for modal
            card.addEventListener('click', () => {
                openModal(member);
            });

            gridContainer.appendChild(card);
        });
    };

    const updateUI = () => {
        Array.from(filterContainer.children).forEach(li => {
            if (li.dataset.filter === currentFilter) li.classList.add('active');
            else li.classList.remove('active');
        });

        renderGrid();
    };

    // --- Modal Functions ---

    const openModal = (member) => {
        if (!modal) return;
        
        modalImg.src = member.image;
        modalNameJa.textContent = member.nameJa;
        modalNameEn.textContent = member.nameEn;
        modalFaculty.textContent = member.faculty;
        modalRoles.textContent = member.roles.join(' / ');
        
        if (member.history) {
            modalHistory.textContent = member.history;
            modalHistoryContainer.style.display = 'block';
        } else {
            modalHistoryContainer.style.display = 'none';
        }
        
        // Error handling for image in modal
        modalImg.onerror = () => {
            modalImg.src = 'assets/images/qusis-logo-color.png';
            modalImg.style.objectFit = 'contain';
        }; 
        modalImg.onload = () => {
            if(modalImg.src.includes('qusis-logo-color.png')) {
                modalImg.style.objectFit = 'contain';
            } else {
                modalImg.style.objectFit = 'cover';
            }
        };

        modal.classList.add('show');
        document.body.classList.add('modal-open');
    };

    const closeModal = () => {
        if (!modal) return;
        modal.classList.remove('show');
        document.body.classList.remove('modal-open');
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // --- Initialization ---
    renderFilter();
    updateUI();
});
