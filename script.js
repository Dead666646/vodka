/**
 * Альянс — Ликёро-водочный завод
 * Основной файл скриптов
 * Версия: 1.0.0
 */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. AGE GATE (Проверка возраста)
    // ==========================================
    const ageGate = document.getElementById('ageGate');
    const ageYes = document.getElementById('ageYes');
    const ageNo = document.getElementById('ageNo');

    if (sessionStorage.getItem('ageConfirmed') === 'true') {
        ageGate?.classList.add('hidden');
    }

    ageYes?.addEventListener('click', () => {
        ageGate?.classList.add('hidden');
        sessionStorage.setItem('ageConfirmed', 'true');
    });

    ageNo?.addEventListener('click', () => {
        window.location.href = 'https://www.google.com';
    });

    // ==========================================
    // 2. PRELOADER
    // ==========================================
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => preloader?.classList.add('hidden'), 1200);
    });

    // ==========================================
    // 3. HEADER SCROLL EFFECT
    // ==========================================
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header?.classList.toggle('scrolled', window.scrollY > 100);
    }, { passive: true });

    // ==========================================
    // 4. MOBILE NAVIGATION
    // ==========================================
    const burger = document.getElementById('burger');
    const mobileNav = document.getElementById('mobileNav');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const toggleMobileNav = () => {
        const isOpen = mobileNav?.classList.toggle('open');
        mobileOverlay?.classList.toggle('open');
        burger?.classList.toggle('active');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    const closeMobileNav = () => {
        mobileNav?.classList.remove('open');
        mobileOverlay?.classList.remove('open');
        burger?.classList.remove('active');
        document.body.style.overflow = '';
    };

    burger?.addEventListener('click', toggleMobileNav);
    mobileOverlay?.addEventListener('click', closeMobileNav);
    mobileLinks.forEach(link => link.addEventListener('click', closeMobileNav));

    // ==========================================
    // 5. SCROLL REVEAL ANIMATIONS
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target); // Анимация только один раз
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // 6. PRODUCT FILTERS
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    const filterReset = document.getElementById('filterReset');
    const productsCount = document.getElementById('productsCount');

    const activeFilters = {
        strength: 'all',
        volume: 'all',
        price: 'all'
    };

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.filter;
            const value = btn.dataset.value;
            activeFilters[type] = value;

            // Обновляем активные кнопки в группе
            document.querySelectorAll(`[data-filter="${type}"]`).forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            applyFilters();
        });
    });

    filterReset?.addEventListener('click', () => {
        Object.keys(activeFilters).forEach(key => activeFilters[key] = 'all');
        filterButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('[data-value="all"]').forEach(btn => btn.classList.add('active'));
        applyFilters();
    });

    function applyFilters() {
        let visibleCount = 0;

        productCards.forEach(card => {
            const strength = parseFloat(card.dataset.strength);
            const volume = parseFloat(card.dataset.volume);
            const price = parseFloat(card.dataset.price);

            // Проверка крепости
            const sMatch = activeFilters.strength === 'all' ||
                (activeFilters.strength === '20-30' && strength >= 20 && strength <= 30) ||
                (activeFilters.strength === '35-40' && strength >= 35 && strength <= 40) ||
                (activeFilters.strength === '45' && strength >= 45);

            // Проверка объёма
            const vMatch = activeFilters.volume === 'all' || volume === parseFloat(activeFilters.volume);

            // Проверка цены
            const pMatch = activeFilters.price === 'all' ||
                (activeFilters.price === '0-500' && price > 0 && price <= 500) ||
                (activeFilters.price === '500-1000' && price > 500 && price <= 1000) ||
                (activeFilters.price === '1000+' && price > 1000);

            if (sMatch && vMatch && pMatch) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        if (productsCount) {
            productsCount.textContent = `Показано: ${visibleCount} товаров`;
        }
    }

    // ==========================================
    // 7. PRODUCT MODAL
    // ==========================================
    const productModal = document.getElementById('productModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const detailBtns = document.querySelectorAll('.product-details-btn');

    const modalEls = {
        img: document.getElementById('modalProductImage'),
        cat: document.getElementById('modalCategory'),
        title: document.getElementById('modalTitle'),
        price: document.getElementById('modalPrice'),
        desc: document.getElementById('modalDescription'),
        str: document.getElementById('modalStrength'),
        vol: document.getElementById('modalVolume'),
        box: document.getElementById('modalBox'),
        ing: document.getElementById('modalIngredients'),
        food: document.getElementById('modalFood')
    };

    function openModal(btn) {
        modalEls.img.src = btn.dataset.image;
        modalEls.img.alt = btn.dataset.name;
        modalEls.cat.textContent = btn.dataset.category;
        modalEls.title.textContent = btn.dataset.name;
        modalEls.price.textContent = btn.dataset.price;
        modalEls.desc.textContent = btn.dataset.description;
        modalEls.str.textContent = btn.dataset.strength;
        modalEls.vol.textContent = btn.dataset.volume;
        modalEls.box.textContent = btn.dataset.box;
        modalEls.ing.textContent = btn.dataset.ingredients;
        modalEls.food.textContent = btn.dataset.food;

        productModal?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        productModal?.classList.remove('active');
        document.body.style.overflow = '';
    }

    detailBtns.forEach(btn => btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(btn);
    }));

    modalClose?.addEventListener('click', closeModal);
    modalOverlay?.addEventListener('click', closeModal);

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && productModal?.classList.contains('active')) {
            closeModal();
        }
    });

    // Делаем функции доступными для inline onclick в HTML
    window.closeModal = closeModal;
    window.downloadSpecs = () => {
        const name = modalEls.title?.textContent || 'товар';
        alert(`Спецификация на "${name}" будет отправлена на вашу почту.\nВ реальном проекте здесь скачается PDF.`);
    };

    // ==========================================
    // 8. CONTACT FORM HANDLING
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    contactForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.form-submit');
        const originalText = btn.textContent;

        btn.textContent = '✓ Заявка отправлена!';
        btn.style.background = '#2D5A3D';
        btn.style.color = '#fff';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.color = '';
            btn.disabled = false;
            contactForm.reset();
        }, 3000);
    });

    // ==========================================
    // 9. SMOOTH SCROLL FOR ANCHOR LINKS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});