// Products Data
const products = [
    {
        id: 1,
        name: "Tosca Glow Highlighter",
        price: 32.99,
        oldPrice: null,
        category: "face",
        image: "images/product3.JPG",
        badge: "Bestseller",
        rating: 4.5,
        description: "Achieve a stunning, natural-looking glow with our Tosca Glow Highlighter. Formulated with light-reflecting pigments and hydrating ingredients for a dewy finish that lasts all day.",
        colors: ["#FFE5CC", "#FFDAB9", "#F0E68C", "#E6E6FA"],
        ingredients: "Mica, Dimethicone, Ethylhexyl Palmitate, Synthetic Fluorphlogopite, Silica, Caprylic/Capric Triglyceride, Phenoxyethanol, Ethylhexylglycerin.",
        usage: "Apply to the high points of your face using a fan brush or fingertips for a natural glow."
    } 
];

// Cart Data
let cart = [
    
];

// DOM Elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const productsContainer = document.getElementById('productsContainer');
const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.getElementById('cartSidebar');
const closeCartBtn = document.querySelector('.close-cart');
const cartItemsContainer = document.getElementById('cartItems');
const cartOverlay = document.getElementById('cartOverlay');
const productModal = document.getElementById('productModal');
const modalBody = document.getElementById('modalBody');
const closeModalBtns = document.querySelectorAll('.close-modal');
const authModal = document.getElementById('authModal');
const userIcon = document.getElementById('userIcon');
const authTabs = document.querySelectorAll('.auth-tab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const contactModal = document.getElementById('contactModal');
const contactLink = document.getElementById('contactLink');
const searchIcon = document.querySelector('.search-icon');
const searchBar = document.getElementById('searchBar');
const closeSearchBtn = document.querySelector('.close-search');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const categoryCards = document.querySelectorAll('.category-card');
const testimonialPrev = document.querySelector('.testimonial-prev');
const testimonialNext = document.querySelector('.testimonial-next');
const testimonialSlider = document.querySelector('.testimonial-slider');
const toast = document.getElementById('toast');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartCount();
    renderCartItems();
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-links') && 
            !e.target.closest('.mobile-menu-btn') && 
            navLinks.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 767) {
                toggleMobileMenu();
            }
        });
    });
    
    // Cart functionality
    cartIcon.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
    document.querySelector('.continue-shopping').addEventListener('click', closeCart);
    
    // Close modals
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            closeAllModals();
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
    
    // Auth modal functionality
    userIcon.addEventListener('click', openAuthModal);
    
    // Auth tab switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            switchAuthTab(tabName);
        });
    });
    
    // Form submissions
    document.getElementById('loginFormElement')?.addEventListener('submit', handleLogin);
    document.getElementById('registerFormElement')?.addEventListener('submit', handleRegister);
    document.getElementById('contactForm')?.addEventListener('submit', handleContact);
    document.getElementById('newsletterForm')?.addEventListener('submit', handleNewsletter);
    
    // Search functionality
    searchIcon.addEventListener('click', toggleSearch);
    closeSearchBtn.addEventListener('click', toggleSearch);
    searchForm.addEventListener('submit', handleSearch);
    
    // Product filtering
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            filterProducts(filter);
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // Category cards
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            filterProducts(category);
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            document.querySelector(`.filter-btn[data-filter="${category}"]`).classList.add('active');
            
            // Scroll to products
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Testimonial slider
    testimonialPrev.addEventListener('click', () => {
        testimonialSlider.scrollBy({ left: -300, behavior: 'smooth' });
    });
    
    testimonialNext.addEventListener('click', () => {
        testimonialSlider.scrollBy({ left: 300, behavior: 'smooth' });
    });
    
    // Contact modal
    contactLink.addEventListener('click', (e) => {
        e.preventDefault();
        openContactModal();
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
});

// Functions
function toggleMobileMenu() {
    navLinks.classList.toggle('active');
    const isActive = navLinks.classList.contains('active');
    mobileMenuBtn.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    document.body.style.overflow = isActive ? 'hidden' : 'auto';
}

function renderProducts(filter = 'all') {
    productsContainer.innerHTML = '';
    
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(product => product.category === filter);
    
    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try a different filter or search term</p>
            </div>
        `;
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-id', product.id);
        productCard.setAttribute('data-category', product.category);
        
        const badgeHtml = product.badge ? `<span class="product-badge">${product.badge}</span>` : '';
        const oldPriceHtml = product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : '';
        
        const ratingStars = getRatingStars(product.rating);
        
        productCard.innerHTML = `
            <div class="product-img" style="background-image: url('${product.image}');">
                ${badgeHtml}
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">${oldPriceHtml}$${product.price.toFixed(2)}</p>
                <div class="rating">
                    ${ratingStars}
                </div>
                <button class="add-to-cart" data-id="${product.id}">
                    <i class="fas fa-shopping-bag"></i> Add to Cart
                </button>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
        
        // Add event listeners
        const addToCartBtn = productCard.querySelector('.add-to-cart');
        addToCartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(product.id);
        });
        
        productCard.addEventListener('click', (e) => {
            if (!e.target.closest('.add-to-cart')) {
                openProductModal(product.id);
            }
        });
    });
}

function getRatingStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image
        });
    }
    
    updateCartCount();
    renderCartItems();
    showToast('Product added to cart!');
    
    // Visual feedback
    const addButton = document.querySelector(`.add-to-cart[data-id="${productId}"]`);
    if (addButton) {
        const originalText = addButton.innerHTML;
        addButton.innerHTML = '<i class="fas fa-check"></i> Added';
        addButton.style.backgroundColor = 'var(--soft-gold)';
        
        setTimeout(() => {
            addButton.innerHTML = originalText;
            addButton.style.backgroundColor = '';
        }, 2000);
    }
    
    // Open cart on mobile
    if (window.innerWidth <= 767) {
        openCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCartItems();
    showToast('Product removed from cart');
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
}

function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function renderCartItems() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
                <p>Your cart is empty</p>
                <a href="#products" class="btn">Start Shopping</a>
            </div>
        `;
        
        document.querySelector('.subtotal-price').textContent = '$0.00';
        document.querySelector('.total-price').textContent = '$0.00';
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <div class="cart-item-img" style="background-image: url('${item.image}');"></div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button class="decrease-quantity" data-id="${item.id}">-</button>
                    <input type="text" value="${item.quantity}" readonly data-id="${item.id}">
                    <button class="increase-quantity" data-id="${item.id}">+</button>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Update totals
    document.querySelector('.subtotal-price').textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector('.total-price').textContent = `$${subtotal.toFixed(2)}`;
    
    // Add event listeners to cart items
    document.querySelectorAll('.decrease-quantity').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            updateCartQuantity(productId, -1);
        });
    });
    
    document.querySelectorAll('.increase-quantity').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            updateCartQuantity(productId, 1);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.closest('.remove-item').getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
    
    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    checkoutBtn.addEventListener('click', () => {
        alert(`Proceeding to checkout...\n\nSubtotal: $${subtotal.toFixed(2)}\nTotal: $${subtotal.toFixed(2)}\n\nThank you for shopping with LuxeBeauty!`);
        cart = [];
        updateCartCount();
        renderCartItems();
        closeCart();
    });
}

function updateCartQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartCount();
        renderCartItems();
    }
}

function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const ratingStars = getRatingStars(product.rating);
    const oldPriceHtml = product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : '';
    
    let colorOptions = '';
    if (product.colors && product.colors.length > 0) {
        product.colors.forEach((color, index) => {
            colorOptions += `
                <div class="color ${index === 0 ? 'selected' : ''}" 
                     style="background-color: ${color};" 
                     data-color="${color}"></div>
            `;
        });
    }
    
    modalBody.innerHTML = `
        <div class="product-detail-img" style="background-image: url('${product.image}');"></div>
        <div class="product-detail-info">
            <h2>${product.name}</h2>
            <p class="product-detail-price">${oldPriceHtml}$${product.price.toFixed(2)}</p>
            <div class="rating">${ratingStars}</div>
            
            <div class="product-description">
                <p>${product.description}</p>
            </div>
            
            ${product.colors && product.colors.length > 0 ? `
            <div class="color-options">
                <h4>Available Colors</h4>
                <div class="colors">
                    ${colorOptions}
                </div>
            </div>
            ` : ''}
            
            <div class="quantity-selector">
                <button class="quantity-btn decrease">-</button>
                <input type="text" class="quantity-input" value="1" readonly>
                <button class="quantity-btn increase">+</button>
            </div>
            
            <button class="btn add-to-cart-modal" style="width: 100%; padding: 15px;">
                <i class="fas fa-shopping-bag"></i> Add to Cart - $${product.price.toFixed(2)}
            </button>
            
            <div class="product-details" style="margin-top: 30px;">
                <h4>Ingredients</h4>
                <p>${product.ingredients}</p>
                
                <h4 style="margin-top: 20px;">How to Use</h4>
                <p>${product.usage}</p>
            </div>
        </div>
    `;
    
    productModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Color selection
    modalBody.querySelectorAll('.color').forEach(color => {
        color.addEventListener('click', function() {
            modalBody.querySelectorAll('.color').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // Quantity adjustment
    const quantityInput = modalBody.querySelector('.quantity-input');
    const decreaseBtn = modalBody.querySelector('.quantity-btn.decrease');
    const increaseBtn = modalBody.querySelector('.quantity-btn.increase');
    
    decreaseBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    });
    
    increaseBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        quantityInput.value = value + 1;
    });
    
    // Add to cart from modal
    const addToCartModalBtn = modalBody.querySelector('.add-to-cart-modal');
    addToCartModalBtn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        
        for (let i = 0; i < quantity; i++) {
            addToCart(product.id);
        }
        
        setTimeout(() => {
            productModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 500);
    });
}

function openAuthModal() {
    closeAllModals();
    authModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    switchAuthTab('login');
}

function openContactModal() {
    closeAllModals();
    contactModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeAllModals() {
    productModal.style.display = 'none';
    authModal.style.display = 'none';
    contactModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function switchAuthTab(tabName) {
    authTabs.forEach(tab => {
        if (tab.getAttribute('data-tab') === tabName) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    if (tabName === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    } else {
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
    }
}

function toggleSearch() {
    searchBar.classList.toggle('active');
    searchInput.focus();
}

function filterProducts(filter) {
    renderProducts(filter);
}

function handleSearch(e) {
    e.preventDefault();
    const query = searchInput.value.toLowerCase().trim();
    
    if (query === '') {
        renderProducts();
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
    
    productsContainer.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>No products found for "${query}"</h3>
                <p>Try a different search term</p>
            </div>
        `;
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-id', product.id);
        
        const badgeHtml = product.badge ? `<span class="product-badge">${product.badge}</span>` : '';
        const oldPriceHtml = product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : '';
        
        const ratingStars = getRatingStars(product.rating);
        
        productCard.innerHTML = `
            <div class="product-img" style="background-image: url('${product.image}');">
                ${badgeHtml}
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">${oldPriceHtml}$${product.price.toFixed(2)}</p>
                <div class="rating">
                    ${ratingStars}
                </div>
                <button class="add-to-cart" data-id="${product.id}">
                    <i class="fas fa-shopping-bag"></i> Add to Cart
                </button>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
        
        // Add event listeners
        const addToCartBtn = productCard.querySelector('.add-to-cart');
        addToCartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(product.id);
        });
        
        productCard.addEventListener('click', (e) => {
            if (!e.target.closest('.add-to-cart')) {
                openProductModal(product.id);
            }
        });
    });
    
    // Close search bar on mobile
    if (window.innerWidth <= 767) {
        toggleSearch();
    }
}

function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Demo login - in real app, this would be an API call
    if (email && password) {
        showToast('Login successful! Welcome back.');
        authModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        userIcon.innerHTML = '<i class="fas fa-user-check"></i>';
        e.target.reset();
    }
}

function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters!');
        return;
    }
    
    // Demo registration
    showToast(`Account created successfully! Welcome ${name}.`);
    authModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    userIcon.innerHTML = '<i class="fas fa-user-check"></i>';
    e.target.reset();
}

function handleContact(e) {
    e.preventDefault();
    showToast('Thank you for your message! We\'ll get back to you soon.');
    contactModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    e.target.reset();
}

function handleNewsletter(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    showToast(`Thank you for subscribing with ${email}!`);
    e.target.reset();
}

function showToast(message) {
    toast.querySelector('.toast-message').textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Add CSS for no-products
const style = document.createElement('style');
style.textContent = `
    .no-products {
        text-align: center;
        padding: 60px 20px;
        grid-column: 1 / -1;
    }
    
    .no-products i {
        font-size: 60px;
        color: var(--gray-light);
        margin-bottom: 20px;
    }
    
    .no-products h3 {
        margin-bottom: 10px;
    }
    
    .no-products p {
        color: var(--gray);
    }
`;
document.head.appendChild(style);