document.addEventListener('DOMContentLoaded', () => {
    // Shared elements
    // --- Navigation (Hamburger Menu) ---
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.querySelector('.nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('is-open');
            document.body.classList.toggle('menu-open'); // Prevent scroll
        });

        // Close menu on link click
        const navLinks = document.querySelectorAll('.nav-item a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('is-open');
                document.body.classList.remove('menu-open');
            });
        });
    }

    const header = document.querySelector('.header');

    // Intro Logic
    const intro = document.getElementById('intro');
    const introLogo = document.querySelector('.intro-logo');
    const body = document.body;

    // Check if on Top page and Intro exists
    if (intro) {
        // Check reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            intro.style.display = 'none';
            body.classList.remove('intro-active');
            body.classList.add('intro-done');
            return;
        }

        const startIntro = () => {
            // Wait a bit then start animation
            setTimeout(() => {
                // Determine animation end
                intro.addEventListener('click', skipIntro);

                // Animation Sequence
                // 1. Logo fades in (handled by CSS transition usually, but let's ensure it)

                // 2. Curtain opens after some time
                setTimeout(() => {
                    finishIntro();
                }, 3400); // 3.4s as per spec

            }, 100);
        };

        const finishIntro = () => {
            // Add class to trigger CSS transforms
            body.classList.add('intro-done');
            body.classList.remove('intro-active');

            // Custom Event
            const event = new CustomEvent('qusis:introDone');
            window.dispatchEvent(event);

            // Cleanup listener
            intro.removeEventListener('click', skipIntro);
        };

        const skipIntro = () => {
            finishIntro();
        };

        startIntro();
    }

    // Parallax Logic
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
                heroSlider.style.transform = `translateY(${scrollY * 0.5}px)`;
            }
        });

        // Slideshow Logic
        const slides = document.querySelectorAll('.hero-slide');
        let currentSlide = 0;

        if (slides.length > 0) {
            setInterval(() => {
                // Remove active from current
                slides[currentSlide].classList.remove('active');

                // Next slide
                currentSlide = (currentSlide + 1) % slides.length;

                // Add active to next
                slides[currentSlide].classList.add('active');
            }, 5000); // 5 seconds per slide
        }
    }

    // Header Scroll Logic
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add('hide');
        } else {
            header.classList.remove('hide');
        }
        lastScroll = currentScroll;
    });

    // --- Enhanced Scroll & Transition Logic ---

    // Section Transition & Background Blending
    const initSectionObserver = () => {
        const sections = document.querySelectorAll('main section');
        const body = document.body;
        if (sections.length === 0) return;

        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5 // Trigger earlier for background change
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Activate Section
                    entry.target.classList.add('is-active');
                    entry.target.classList.add('is-visible');
                    // Stop observing once visible if we want it to persist?
                    // The user said "completely outside until leaves" 
                    // or "maintain state". Let's keep it visible once seen.
                } else if (entry.boundingClientRect.top > 0) {
                    // Only remove if it's below the viewport (scrolling up)
                    // But usually for "persistent" we just don't remove it.
                    // entry.target.classList.remove('is-active');
                    // entry.target.classList.remove('is-visible');
                }
            });
        }, options);

        sections.forEach(section => {
            observer.observe(section);
        });
    };

    // Enhanced Scroll Control (Trackpad Optimized: Accumulated Delta)
    const initScrollControl = () => {
        // Only run on Top Page
        if (!document.body.classList.contains('top-page')) return;

        const sections = Array.from(document.querySelectorAll('main section'));
        if (sections.length === 0) return;

        // Variables
        let isLocked = false;
        let accumulated = 0;
        let currentSectionIndex = 0;

        // Handle Wheel Event
        window.addEventListener('wheel', (e) => {
            // Always prevent default to hijack scroll
            if (!isLocked) {
                e.preventDefault();
            } else {
                e.preventDefault();
                return;
            }

            accumulated += e.deltaY;

            // Ignore small jitters (Threshold 160)
            if (Math.abs(accumulated) < 160) {
                return;
            }

            // Determine direction
            const direction = accumulated > 0 ? 1 : -1;

            // Calculate next index
            let nextIndex = currentSectionIndex + direction;

            // Clamp index
            if (nextIndex < 0) nextIndex = 0;
            if (nextIndex >= sections.length) nextIndex = sections.length - 1;

            if (nextIndex !== currentSectionIndex) {
                // Update state
                currentSectionIndex = nextIndex;

                // Scroll to section
                sections[nextIndex].scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Reset accumulated
                accumulated = 0;

                // Strong Lock (1300ms)
                isLocked = true;
                setTimeout(() => {
                    isLocked = false;
                }, 1300);
            } else {
                // Boundary reached, reset accumulated
                accumulated = 0;
            }
        }, { passive: false });

        // Handle Keys
        window.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) {
                e.preventDefault();
                if (isLocked) return;

                const direction = (e.code === 'ArrowDown' || e.code === 'Space') ? 1 : -1;
                let nextIndex = currentSectionIndex + direction;

                if (nextIndex < 0) nextIndex = 0;
                if (nextIndex >= sections.length) nextIndex = sections.length - 1;

                if (nextIndex !== currentSectionIndex) {
                    isLocked = true;
                    currentSectionIndex = nextIndex;
                    sections[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setTimeout(() => { isLocked = false; }, 1300);
                }
            }
        });
    };

    // Check Reduced Motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Trigger Logic
    const startApp = () => {
        initSectionObserver();

        // if (!prefersReducedMotion) {
        //     initScrollControl();
        // } else {
        //     // Restore scroll if reduced motion
        //     document.documentElement.style.overflow = 'auto';
        //     document.body.style.overflow = 'auto';
        // }

        // Force hero active
        const hero = document.getElementById('hero');
        if (hero) {
            hero.classList.add('is-active');
        }
    };

    // Listen for custom event
    window.addEventListener('qusis:introDone', startApp);

    // Initial check (if intro already done or hidden)
    // Also handling if intro element is missing (subpages)
    if (!intro || intro.style.display === 'none' || document.body.classList.contains('intro-done')) {
        startApp();
    }

    // --- Contact Form Logic (Formspree) ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const form = e.target;
            const button = document.getElementById('submit-btn');
            const status = document.getElementById('form-status');

            // Button Loading State
            const originalText = button.innerText;
            button.disabled = true;
            button.innerText = "送信中...";

            const data = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    status.style.display = "block";
                    status.className = "status-success"; // Add class for color
                    status.innerText = "送信が完了しました。ありがとうございます。";
                    form.reset();
                } else {
                    const jsonData = await response.json();
                    status.style.display = "block";
                    status.className = "status-error";

                    // Specific error handling if needed, or generic
                    if (jsonData.errors) {
                        status.innerText = jsonData.errors.map(error => error.message).join(", ");
                    } else {
                        status.innerText = "送信に失敗しました。再度お試しください。";
                    }
                }

            } catch (error) {
                status.style.display = "block";
                status.className = "status-error";
                status.innerText = "エラーが発生しました。時間を置いて再度お試しください。";
                console.error('Fetch error:', error);
            }

            // Restore Button
            button.disabled = false;
            button.innerText = originalText; // Or "送信"
        });
    }
});
