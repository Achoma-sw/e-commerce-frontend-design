// ===== js/app.js =====
(function() {
    'use strict';

    // --- DOM refs ---
    const darkToggle = document.getElementById('darkToggle');
    const body = document.body;
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const backTop = document.getElementById('backTop');
    const navbar = document.getElementById('navbar');
    const toast = document.getElementById('toast');
    const newsletterBtn = document.getElementById('newsletterBtn');
    const newsletterEmail = document.getElementById('newsletterEmail');
    const slider = document.getElementById('testimonialSlider');

    // --- dark mode ---
    const currentTheme = localStorage.getItem('ph-theme') || 'light';
    if (currentTheme === 'dark') {
        body.classList.add('dark');
        darkToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    darkToggle.addEventListener('click', function() {
        body.classList.toggle('dark');
        const isDark = body.classList.contains('dark');
        darkToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('ph-theme', isDark ? 'dark' : 'light');
    });

    // --- mobile hamburger ---
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('open');
        this.innerHTML = navLinks.classList.contains('open') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // --- back to top ---
    window.addEventListener('scroll', function() {
        if (window.scrollY > 400) backTop.classList.add('visible');
        else backTop.classList.remove('visible');
        // sticky nav shadow
        navbar.style.boxShadow = window.scrollY > 20 ? '0 4px 20px rgba(0,0,0,0.08)' : 'none';
    });
    backTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- toast notification (global) ---
    window.showToast = function(message) {
        toast.textContent = message || '✨ Added to cart';
        toast.classList.add('show');
        clearTimeout(window.toastTimeout);
        window.toastTimeout = setTimeout(() => toast.classList.remove('show'), 2400);
    };

    // --- add-to-cart buttons ---
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            showToast('Added to cart');
        });
    });

    // --- testimonial slider auto-scroll ---
    let scrollInterval;
    function startSliderAutoScroll() {
        if (!slider) return;
        scrollInterval = setInterval(() => {
            const maxScroll = slider.scrollWidth - slider.clientWidth;
            if (slider.scrollLeft >= maxScroll - 2) slider.scrollLeft = 0;
            else slider.scrollLeft += 280;
        }, 3800);
    }
    function stopSliderAutoScroll() { clearInterval(scrollInterval); }
    if (slider) {
        startSliderAutoScroll();
        slider.addEventListener('mouseenter', stopSliderAutoScroll);
        slider.addEventListener('mouseleave', startSliderAutoScroll);
    }

    // --- newsletter validation ---
    newsletterBtn?.addEventListener('click', function(e) {
        const email = newsletterEmail.value.trim();
        if (!email.includes('@') || !email.includes('.')) {
            e.preventDefault();
            alert('Please enter a valid email address.');
        } else {
            showToast('Subscribed!');
            newsletterEmail.value = '';
        }
    });

    // --- close mobile nav on link click (optional) ---
    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    console.log('PoultryHub frontend ready.');
})();