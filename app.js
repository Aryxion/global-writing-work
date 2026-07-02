/* ============================================================
   GLOBAL FREELANCER PVT LTD — App Controller v2
   Elite Interactions · Touch-Optimized · Performance Tuned
   ============================================================ */

(function () {
    'use strict';

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    const header        = $('#main-header');
    const mobileToggle  = $('#mobile-toggle');
    const mobileMenu    = $('#mobile-menu');
    const pagesSlider   = $('#pages-slider');
    const pagesVal      = $('#pages-val');
    const feedList      = $('#feed-list');
    const btnApply      = $('#btn-apply');
    const modalOverlay  = $('#modal-overlay');
    const modalClose    = $('#modal-close');
    const copyBtn       = $('#copy-btn');
    const copyLabel     = $('#copy-label');
    const copyCode      = $('#copy-code');
    const hwOutput      = $('#hw-output');
    const stickyCTA     = $('#mobile-sticky-cta');

    // =========================================================
    // CONFIG
    // =========================================================
    const RATE = 233;
    const TIERS = [
        { name: 'Starter Pack',   pages:  50, days:  5, deposit: 501, key: 'GFL-START-50P' },
        { name: 'Standard Track', pages:  90, days:  8, deposit: 501, key: 'GFL-STD-90P' },
        { name: 'Pro Writer',     pages: 120, days: 10, deposit: 501, key: 'GFL-PRO-120P' },
        { name: 'Elite Volume',   pages: 200, days: 15, deposit: 501, key: 'GFL-ELITE-200P' },
    ];

    const SRC_LINES = [
        'The digitization project requires',
        'writing legibly in standard notebooks',
        'with one-inch margins on both sides.',
        'Use blue or black gel pens only.',
        'Submit high-resolution photo scans.',
    ];

    const CITIES = ['Delhi','Mumbai','Bangalore','Pune','Kolkata','Hyderabad','Chennai','Jaipur','Ahmedabad','Lucknow','Bhopal','Indore','Nagpur','Patna','Chandigarh','Noida'];

    const fmt = n => '₹' + n.toLocaleString('en-IN');
    const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

    // =========================================================
    // 1. HEADER SCROLL + MOBILE STICKY CTA
    // =========================================================
    let heroBottom = 0;
    function measureHero() {
        const hero = $('.hero');
        if (hero) heroBottom = hero.offsetTop + hero.offsetHeight;
    }
    measureHero();
    window.addEventListener('resize', measureHero, { passive: true });

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        header.classList.toggle('scrolled', y > 40);

        // Show sticky CTA after scrolling past hero
        if (stickyCTA) {
            stickyCTA.classList.toggle('visible', y > heroBottom - 200);
        }
    }, { passive: true });

    // =========================================================
    // 2. MOBILE MENU
    // =========================================================
    mobileToggle.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        mobileToggle.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    $$('.mobile-link, .mobile-cta', mobileMenu).forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            mobileToggle.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Close on backdrop tap
    mobileMenu.addEventListener('click', e => {
        if (e.target === mobileMenu) {
            mobileMenu.classList.remove('open');
            mobileToggle.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    // =========================================================
    // 3. EARNINGS CALCULATOR
    // =========================================================
    function selectTier(dailyPages) {
        const total = dailyPages * 5;
        if (total <= 50)  return TIERS[0];
        if (total <= 90)  return TIERS[1];
        if (total <= 120) return TIERS[2];
        return TIERS[3];
    }

    function updateCalc() {
        const daily = parseInt(pagesSlider.value, 10);
        const tier = selectTier(daily);
        const dailyEarn  = daily * RATE;
        const weeklyEarn = daily * 7 * RATE;
        const monthlyEarn = daily * 30 * RATE;

        pagesVal.textContent = daily + (daily === 1 ? ' Page' : ' Pages');
        $('#tier-name').textContent = tier.name;
        $('#tier-pages').textContent = tier.pages + ' Pages';
        $('#tier-deadline').textContent = tier.days + ' Days';

        const maxMonthly = 25 * 30 * RATE;
        const dailyPct   = clamp((dailyEarn / maxMonthly) * 100, 5, 100);
        const weeklyPct  = clamp((weeklyEarn / maxMonthly) * 100, 5, 100);
        const monthlyPct = clamp((monthlyEarn / maxMonthly) * 100, 5, 100);

        $('#bar-daily').style.height   = dailyPct + '%';
        $('#bar-weekly').style.height  = weeklyPct + '%';
        $('#bar-monthly').style.height = monthlyPct + '%';

        $('#bar-daily-val').textContent   = fmt(dailyEarn);
        $('#bar-weekly-val').textContent  = fmt(weeklyEarn);
        $('#bar-monthly-val').textContent = fmt(monthlyEarn);

        $('#daily-calc').textContent   = fmt(dailyEarn);
        $('#weekly-calc').textContent  = fmt(weeklyEarn);
        $('#monthly-calc').textContent = fmt(monthlyEarn);

        // Capacity bar
        const cap = clamp(rand(15, 40 + daily * 2), 15, 92);
        $('#cap-fill').style.width = cap + '%';
        $('#cap-text').textContent = cap + '% slots filled';

        window.__selectedTier = tier;
    }

    pagesSlider.addEventListener('input', updateCalc);
    updateCalc();

    // =========================================================
    // 4. APPLICATION MODAL
    // =========================================================
    function openModal() {
        const tier = window.__selectedTier || TIERS[0];
        $('#modal-badge').textContent = tier.name;
        $('#modal-tier-name').textContent = tier.name;
        copyCode.textContent = tier.key;
        modalOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function closeModal() {
        modalOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    btnApply.addEventListener('click', openModal);
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', e => {
        if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeModal();
    });

    // Swipe-to-close on mobile modal
    let touchStartY = 0;
    const modalSheet = $('#modal-sheet');
    modalSheet.addEventListener('touchstart', e => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    modalSheet.addEventListener('touchmove', e => {
        const deltaY = e.touches[0].clientY - touchStartY;
        if (deltaY > 100) closeModal();
    }, { passive: true });

    // Copy key
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(copyCode.textContent).then(() => {
            copyLabel.textContent = 'Copied!';
            copyBtn.style.borderColor = '#10b981';
            setTimeout(() => {
                copyLabel.textContent = 'Copy';
                copyBtn.style.borderColor = '';
            }, 2000);
        }).catch(() => {
            const range = document.createRange();
            range.selectNodeContents(copyCode);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            document.execCommand('copy');
            sel.removeAllRanges();
            copyLabel.textContent = 'Copied!';
            setTimeout(() => { copyLabel.textContent = 'Copy'; }, 2000);
        });
    });

    // =========================================================
    // 5. FAQ ACCORDION
    // =========================================================
    $$('.faq-q').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const wasOpen = item.classList.contains('open');
            $$('.faq-item').forEach(it => it.classList.remove('open'));
            if (!wasOpen) item.classList.add('open');
        });
    });

    // =========================================================
    // 6. TYPING SIMULATOR
    // =========================================================
    let lineIdx = 0;
    let charIdx = 0;
    const srcLineEls = $$('.src-line');

    function highlightLine(idx) {
        srcLineEls.forEach((el, i) => el.classList.toggle('active', i === idx));
        const num = $('#current-line-num');
        if (num) num.textContent = idx + 1;
    }

    function buildFullText(currentLine, chars) {
        let txt = '';
        for (let i = 0; i < currentLine; i++) txt += SRC_LINES[i] + '\n';
        txt += SRC_LINES[currentLine].substring(0, chars);
        return txt;
    }

    function updateScore(pct) {
        const p = Math.min(Math.round(pct), 100);
        $('#score-fill').style.width = p + '%';
        $('#score-pct').textContent = p + '%';
    }

    function typeNext() {
        if (lineIdx >= SRC_LINES.length) {
            lineIdx = 0;
            charIdx = 0;
            hwOutput.textContent = '';
            updateScore(0);
            setTimeout(typeNext, 1500);
            return;
        }

        highlightLine(lineIdx);
        const line = SRC_LINES[lineIdx];

        if (charIdx < line.length) {
            charIdx++;
            hwOutput.textContent = buildFullText(lineIdx, charIdx);
            updateScore(((lineIdx * line.length + charIdx) / (SRC_LINES.length * 40)) * 100);
            setTimeout(typeNext, 35 + rand(10, 55));
        } else {
            lineIdx++;
            charIdx = 0;
            setTimeout(typeNext, 500);
        }
    }

    setTimeout(typeNext, 1800);

    // =========================================================
    // 7. LIVE FEED SIMULATION
    // =========================================================
    const STATUSES = [
        { text: 'Settled', cls: 'fi-settled', showAmt: true },
        { text: '✓ Approved', cls: 'fi-approved', showAmt: false },
        { text: 'Settled', cls: 'fi-settled', showAmt: true },
    ];
    const TIMES = ['Just now', '1m ago', '2m ago', '3m ago', '5m ago', '8m ago', '12m ago'];

    function generateFeedItem() {
        const tier = pick(TIERS);
        const status = pick(STATUSES);
        const id = 'GF-' + rand(1000, 9999);
        const amount = tier.pages * RATE;
        const city = pick(CITIES);

        const el = document.createElement('div');
        el.className = 'feed-item feed-enter';
        el.innerHTML = `
            <span class="fi-time">Just now</span>
            <span class="fi-id">#${id}</span>
            <span class="fi-desc">${tier.pages} Pages · ${tier.name} · ${city}</span>
            <span class="fi-status ${status.cls}">${status.showAmt ? fmt(amount) + ' Settled' : status.text}</span>
        `;
        return el;
    }

    function addFeedItem() {
        if (!feedList) return;
        const newItem = generateFeedItem();
        feedList.insertBefore(newItem, feedList.firstChild);

        const items = $$('.feed-item', feedList);
        items.forEach((item, i) => {
            const timeEl = item.querySelector('.fi-time');
            if (timeEl && i < TIMES.length) timeEl.textContent = TIMES[i];
        });

        while (items.length > 8) feedList.removeChild(feedList.lastChild);
        setTimeout(() => newItem.classList.remove('feed-enter'), 600);
    }

    setInterval(addFeedItem, rand(4000, 7000));

    // =========================================================
    // 8. TESTIMONIALS SLIDER (Touch Swipe)
    // =========================================================
    const slider = $('#testimonials-slider');
    const dots   = $$('.dot', $('#slider-dots'));
    let currentSlide = 0;
    let slideTouchX = 0;
    let totalSlides = 3;

    function getCardsPerView() {
        const w = window.innerWidth;
        if (w <= 640) return 1;
        if (w <= 860) return 2;
        return 3;
    }

    function goToSlide(idx) {
        const perView = getCardsPerView();
        const maxIdx = Math.max(0, totalSlides - perView);
        currentSlide = clamp(idx, 0, maxIdx);

        const card = slider.querySelector('.testimonial-card');
        if (!card) return;
        const cardWidth = card.offsetWidth + 20; // gap
        slider.style.transform = `translateX(-${currentSlide * cardWidth}px)`;

        dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    }

    dots.forEach(d => {
        d.addEventListener('click', () => goToSlide(parseInt(d.dataset.idx)));
    });

    // Touch swipe
    slider.addEventListener('touchstart', e => {
        slideTouchX = e.touches[0].clientX;
    }, { passive: true });

    slider.addEventListener('touchend', e => {
        const diff = slideTouchX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goToSlide(currentSlide + 1);
            else goToSlide(currentSlide - 1);
        }
    }, { passive: true });

    window.addEventListener('resize', () => goToSlide(currentSlide));

    // Auto-advance on mobile
    let autoSlide;
    function startAutoSlide() {
        clearInterval(autoSlide);
        if (getCardsPerView() < 3) {
            autoSlide = setInterval(() => {
                const perView = getCardsPerView();
                const maxIdx = Math.max(0, totalSlides - perView);
                goToSlide(currentSlide >= maxIdx ? 0 : currentSlide + 1);
            }, 5000);
        }
    }
    startAutoSlide();
    window.addEventListener('resize', startAutoSlide);

    // Pause auto on touch
    slider.addEventListener('touchstart', () => clearInterval(autoSlide), { passive: true });
    slider.addEventListener('touchend', () => {
        setTimeout(startAutoSlide, 3000);
    }, { passive: true });

    // =========================================================
    // 9. SCROLL REVEAL
    // =========================================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

    // Stagger delays
    $$('.process-card.reveal').forEach((c, i) => { c.style.transitionDelay = (i * 120) + 'ms'; });
    $$('.pillar-card.reveal').forEach((c, i) => { c.style.transitionDelay = (i * 120) + 'ms'; });
    $$('.stat-block.reveal').forEach((c, i) => { c.style.transitionDelay = (i * 100) + 'ms'; });

    $$('.reveal').forEach(el => observer.observe(el));

    // =========================================================
    // 10. SMOOTH ANCHOR SCROLLING
    // =========================================================
    $$('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const target = $(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const y = target.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    });

    // =========================================================
    // 11. ANIMATED STAT COUNTER
    // =========================================================
    const statNums = $$('.stat-num[data-target]');
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            let current = 0;
            const step = Math.ceil(target / 50);
            const interval = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(interval);
                }
                el.textContent = current.toLocaleString('en-IN') + '+';
            }, 25);
            countObserver.unobserve(el);
        });
    }, { threshold: 0.5 });

    statNums.forEach(el => countObserver.observe(el));

    // =========================================================
    // 12. PARALLAX ORBS (Desktop Only)
    // =========================================================
    if (window.matchMedia('(min-width: 860px)').matches) {
        const orbs = $$('.orb');
        let ticking = false;
        window.addEventListener('mousemove', e => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const x = (e.clientX / window.innerWidth - 0.5) * 20;
                const y = (e.clientY / window.innerHeight - 0.5) * 20;
                orbs.forEach((orb, i) => {
                    const factor = (i + 1) * 0.5;
                    orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
                });
                ticking = false;
            });
        }, { passive: true });
    }

})();
