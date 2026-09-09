document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    const featuredContainer = document.getElementById('featuredProductsGrid');
    if (featuredContainer) {
        fetchFeaturedProducts();
    }

    const catalogContainer = document.getElementById('catalogProductsGrid');
    if (catalogContainer) {
        initCatalog();
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        initContactForm(contactForm);
    }
});

async function fetchFeaturedProducts() {
    const container = document.getElementById('featuredProductsGrid');
    try {
        const res = await fetch('/api/products');
        const products = await res.json();
        const featured = products.slice(0, 4);
        renderProducts(container, featured);
    } catch (err) {
        container.innerHTML = '<p class="section-desc">Unable to load featured products.</p>';
    }
}

function initCatalog() {
    const container = document.getElementById('catalogProductsGrid');
    const searchInput = document.getElementById('searchInput');
    const categoryBtns = document.querySelectorAll('.cat-btn');

    let currentCategory = 'all';
    let currentSearch = '';

    loadCatalogProducts(container, currentCategory, currentSearch);

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            loadCatalogProducts(container, currentCategory, currentSearch);
        });
    });

    if (searchInput) {
        let timer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                currentSearch = e.target.value.trim();
                loadCatalogProducts(container, currentCategory, currentSearch);
            }, 300);
        });
    }
}

async function loadCatalogProducts(container, category, search) {
    try {
        let url = `/api/products?category=${encodeURIComponent(category)}&search=${encodeURIComponent(search)}`;
        const res = await fetch(url);
        const products = await res.json();
        if (products.length === 0) {
            container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">No products match your filter criteria.</div>';
            return;
        }
        renderProducts(container, products);
    } catch (err) {
        container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--danger);">Failed to load products database.</div>';
    }
}

function renderProducts(container, products) {
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-img-wrapper">
                <img src="${product.image_url}" alt="${product.name}" loading="lazy" />
                <span class="origin-tag">${product.origin}</span>
            </div>
            <div class="product-body">
                <span class="product-category">${product.category_name}</span>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-footer">
                    <div class="price-unit">
                        <span class="price-amount">LKR ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        <span class="price-unit-text">Per ${product.unit}</span>
                    </div>
                    <button class="cart-btn" onclick="addToCart('${product.name}', ${product.price})">Add to Order</button>
                </div>
            </div>
        </div>
    `).join('');
}

function addToCart(name, price) {
    alert(`Added ${name} (LKR ${price.toLocaleString()}) to your order list.`);
}

function initContactForm(form) {
    const alertBox = document.getElementById('formAlert');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            full_name: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
        };

        try {
            const res = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alertBox.className = 'alert-box alert-success';
                alertBox.textContent = 'Thank you! Your inquiry has been logged into our database. Our Sri Lankan team will contact you shortly.';
                alertBox.style.display = 'block';
                form.reset();
            } else {
                throw new Error('Failed to submit');
            }
        } catch (err) {
            alertBox.className = 'alert-box alert-error';
            alertBox.textContent = 'Submission error. Please check backend connection.';
            alertBox.style.display = 'block';
        }
    });
}
