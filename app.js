// ===== app.js =====
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
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loginLink = document.getElementById('loginLink');
    const closeModal = document.getElementById('closeModal');
    const closeRegisterModal = document.getElementById('closeRegisterModal');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const cartLink = document.getElementById('cartLink');
    const cartSection = document.getElementById('cartSection');
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    const cartTotal = document.getElementById('cartTotal');
    const continueShopping = document.getElementById('continueShopping');
    const continueShopping2 = document.getElementById('continueShopping2');
    const cartCount = document.getElementById('cartCount');

    // --- Cart functionality ---
    let cart = JSON.parse(localStorage.getItem('ph-cart')) || [];

    function updateCartDisplay() {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = count;
        
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart" style="font-size:4rem;color:var(--ph-light-gray);"></i>
                    <h3>Your cart is empty</h3>
                    <p>Start shopping to add items to your cart</p>
                    <button class="btn" id="continueShopping">Continue Shopping</button>
                </div>
            `;
            cartSummary.style.display = 'none';
            document.getElementById('continueShopping')?.addEventListener('click', function() {
                cartSection.style.display = 'none';
                document.querySelector('#featured-products').scrollIntoView({ behavior: 'smooth' });
            });
        } else {
            let html = '';
            let total = 0;
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                html += `
                    <div class="cart-item">
                        <img src="C:\\Users\\DELL\\Pictures\\Screenshots\\${item.image || 'broiler.png'}" alt="${item.name}" />
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <div class="price">₦${item.price.toLocaleString()}</div>
                        </div>
                        <div class="cart-item-actions">
                            <button class="qty-btn" data-index="${index}" data-action="decrease">-</button>
                            <span style="font-weight:600;min-width:30px;text-align:center;">${item.quantity}</span>
                            <button class="qty-btn" data-index="${index}" data-action="increase">+</button>
                            <button class="remove-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                `;
            });
            cartItems.innerHTML = html;
            cartSummary.style.display = 'block';
            
            // Cart total
            cartTotal.innerHTML = `
                <div class="cart-total-row"><span>Subtotal</span><span>₦${total.toLocaleString()}</span></div>
                <div class="cart-total-row"><span>Delivery</span><span>₦1,000</span></div>
                <div class="cart-total-row total"><span>Total</span><span>₦${(total + 1000).toLocaleString()}</span></div>
            `;
            
            // Event listeners for cart actions
            document.querySelectorAll('.qty-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = parseInt(this.dataset.index);
                    const action = this.dataset.action;
                    if (action === 'increase') {
                        cart[index].quantity += 1;
                    } else if (action === 'decrease' && cart[index].quantity > 1) {
                        cart[index].quantity -= 1;
                    }
                    localStorage.setItem('ph-cart', JSON.stringify(cart));
                    updateCartDisplay();
                    showToast('Cart updated');
                });
            });
            
            document.querySelectorAll('.remove-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = parseInt(this.dataset.index);
                    cart.splice(index, 1);
                    localStorage.setItem('ph-cart', JSON.stringify(cart));
                    updateCartDisplay();
                    showToast('Item removed from cart');
                });
            });
            
            document.getElementById('continueShopping2')?.addEventListener('click', function() {
                cartSection.style.display = 'none';
                document.querySelector('#featured-products').scrollIntoView({ behavior: 'smooth' });
            });
        }
        localStorage.setItem('ph-cart', JSON.stringify(cart));
    }

    // --- Add to cart ---
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const name = this.dataset.name;
            const price = parseInt(this.dataset.price);
            const existing = cart.find(item => item.name === name);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ 
                    name: name, 
                    price: price, 
                    quantity: 1,
                    image: name.includes('Broiler') ? 'broiler.png' : 
                           name.includes('eggs') ? 'eggs.png' : 'turkey.png'
                });
            }
            localStorage.setItem('ph-cart', JSON.stringify(cart));
            updateCartDisplay();
            showToast(`${name} added to cart!`);
        });
    });

    // --- Navigation scrolling ---
    const sections = {
        home: document.getElementById('home'),
        shop: document.getElementById('shop'),
        blog: document.getElementById('blog'),
        about: document.getElementById('about'),
        contact: document.getElementById('contact')
    };

    function scrollToSection(sectionId) {
        const section = sections[sectionId];
        if (section) {
            // Hide cart if visible
            cartSection.style.display = 'none';
            const offset = 80;
            const position = section.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: position, behavior: 'smooth' });
            // Close mobile nav
            navLinks.classList.remove('open');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }

    // Navigation clicks
    document.querySelectorAll('[data-section]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.dataset.section;
            if (sectionId === 'home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                scrollToSection(sectionId);
            }
        });
    });

    // Explore button
    document.getElementById('exploreBtn')?.addEventListener('click', function(e) {
        e.preventDefault();
        scrollToSection('shop');
    });

    // --- Cart link ---
    cartLink?.addEventListener('click', function(e) {
        e.preventDefault();
        updateCartDisplay();
        cartSection.style.display = cartSection.style.display === 'none' ? 'block' : 'none';
        if (cartSection.style.display === 'block') {
            cartSection.scrollIntoView({ behavior: 'smooth' });
            // Hide cart if it was showing
        } else {
            // If hiding, go back to home
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // Continue shopping buttons (for empty cart)
    document.addEventListener('click', function(e) {
        if (e.target.id === 'continueShopping') {
            cartSection.style.display = 'none';
            document.querySelector('#featured-products').scrollIntoView({ behavior: 'smooth' });
        }
    });

    // --- Login Modal ---
    loginLink?.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeModal?.addEventListener('click', function() {
        loginModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    showRegister?.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.classList.remove('active');
        registerModal.classList.add('active');
    });

    showLogin?.addEventListener('click', function(e) {
        e.preventDefault();
        registerModal.classList.remove('active');
        loginModal.classList.add('active');
    });

    closeRegisterModal?.addEventListener('click', function() {
        registerModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });

    // --- Login form ---
    document.getElementById('loginForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        if (email && password) {
            showToast('Welcome back!');
            loginModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            this.reset();
        } else {
            alert('Please fill in all fields');
        }
    });

    // --- Register form ---
    document.getElementById('registerForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        if (name && email && password) {
            showToast('Account created! Welcome to PoultryHub');
            registerModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            this.reset();
        } else {
            alert('Please fill in all fields');
        }
    });

    // --- Dark mode ---
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

    // --- Mobile hamburger ---
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('open');
        this.innerHTML = navLinks.classList.contains('open') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // --- Back to top ---
    window.addEventListener('scroll', function() {
        if (window.scrollY > 400) backTop.classList.add('visible');
        else backTop.classList.remove('visible');
        navbar.style.boxShadow = window.scrollY > 20 ? '0 4px 20px rgba(0,0,0,0.08)' : 'none';
    });
    backTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- Toast notification ---
    window.showToast = function(message) {
        toast.textContent = message || '✨ Added to cart';
        toast.classList.add('show');
        clearTimeout(window.toastTimeout);
        window.toastTimeout = setTimeout(() => toast.classList.remove('show'), 2400);
    };

    // --- Testimonial slider ---
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

    // --- Newsletter ---
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

    // --- Close mobile nav on link click ---
    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    // --- Initialize cart count ---
    updateCartDisplay();

    console.log('PoultryHub frontend ready.');
})();
