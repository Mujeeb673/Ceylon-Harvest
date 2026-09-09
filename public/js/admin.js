document.addEventListener('DOMContentLoaded', () => {
    loadDashboardStats();
    loadAdminProducts();
    loadAdminInquiries();
    loadCategoriesDropdown();

    const addBtn = document.getElementById('openAddProductBtn');
    const modal = document.getElementById('productModal');
    const closeModal = document.getElementById('closeModalBtn');
    const productForm = document.getElementById('productForm');

    if (addBtn && modal) {
        addBtn.addEventListener('click', () => {
            resetProductForm();
            document.getElementById('modalTitle').textContent = 'Add New Sri Lankan Product';
            modal.classList.add('active');
        });
    }

    if (closeModal && modal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    if (productForm) {
        productForm.addEventListener('submit', handleProductFormSubmit);
    }
});

async function loadDashboardStats() {
    try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        document.getElementById('statTotalProducts').textContent = data.totalProducts || 0;
        document.getElementById('statTotalInquiries').textContent = data.totalInquiries || 0;
        document.getElementById('statTotalStock').textContent = data.totalStock || 0;
        document.getElementById('statTotalCategories').textContent = data.totalCategories || 0;
    } catch (err) {
        console.error(err);
    }
}

async function loadCategoriesDropdown() {
    const select = document.getElementById('prodCategory');
    if (!select) return;
    try {
        const res = await fetch('/api/categories');
        const categories = await res.json();
        select.innerHTML = categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    } catch (err) {
        console.error(err);
    }
}

async function loadAdminProducts() {
    const tableBody = document.getElementById('adminProductsTable');
    if (!tableBody) return;
    try {
        const res = await fetch('/api/products');
        const products = await res.json();

        if (products.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">No products available.</td></tr>';
            return;
        }

        tableBody.innerHTML = products.map(p => `
            <tr>
                <td>#${p.id}</td>
                <td><strong>${p.name}</strong></td>
                <td><span style="color: var(--accent-emerald); font-weight:700;">${p.category_name}</span></td>
                <td>LKR ${p.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td>${p.stock} units</td>
                <td>${p.origin}</td>
                <td>
                    <button class="table-btn btn-edit" onclick="editProduct(${p.id})">Edit</button>
                    <button class="table-btn btn-delete" onclick="deleteProduct(${p.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--danger);">Failed to load products.</td></tr>';
    }
}

async function loadAdminInquiries() {
    const tableBody = document.getElementById('adminInquiriesTable');
    if (!tableBody) return;
    try {
        const res = await fetch('/api/inquiries');
        const inquiries = await res.json();

        if (inquiries.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No inquiries recorded.</td></tr>';
            return;
        }

        tableBody.innerHTML = inquiries.map(i => `
            <tr>
                <td>#${i.id}</td>
                <td><strong>${i.full_name}</strong><br/><small style="color: var(--text-secondary);">${i.email} | ${i.phone}</small></td>
                <td>${i.subject}</td>
                <td>${i.message}</td>
                <td>
                    <select onchange="updateInquiryStatus(${i.id}, this.value)" style="background: var(--bg-input); color: var(--text-primary); border: 1px solid var(--border-color); padding: 0.3rem 0.5rem; border-radius: 4px;">
                        <option value="Pending" ${i.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Replied" ${i.status === 'Replied' ? 'selected' : ''}>Replied</option>
                        <option value="Resolved" ${i.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                    </select>
                </td>
                <td>
                    <button class="table-btn btn-delete" onclick="deleteInquiry(${i.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--danger);">Failed to load inquiries.</td></tr>';
    }
}

function resetProductForm() {
    document.getElementById('productId').value = '';
    document.getElementById('productForm').reset();
}

async function handleProductFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('productId').value;
    const payload = {
        name: document.getElementById('prodName').value.trim(),
        category_id: parseInt(document.getElementById('prodCategory').value),
        price: parseFloat(document.getElementById('prodPrice').value),
        unit: document.getElementById('prodUnit').value.trim(),
        stock: parseInt(document.getElementById('prodStock').value),
        origin: document.getElementById('prodOrigin').value.trim(),
        description: document.getElementById('prodDesc').value.trim(),
        image_url: document.getElementById('prodImg').value.trim() || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80'
    };

    const url = id ? `/api/products/${id}` : '/api/products';
    const method = id ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            document.getElementById('productModal').classList.remove('active');
            loadAdminProducts();
            loadDashboardStats();
        } else {
            alert('Failed to save product in database.');
        }
    } catch (err) {
        alert('Server communication error.');
    }
}

async function editProduct(id) {
    try {
        const res = await fetch(`/api/products/${id}`);
        const p = await res.json();

        document.getElementById('productId').value = p.id;
        document.getElementById('prodName').value = p.name;
        document.getElementById('prodCategory').value = p.category_id;
        document.getElementById('prodPrice').value = p.price;
        document.getElementById('prodUnit').value = p.unit;
        document.getElementById('prodStock').value = p.stock;
        document.getElementById('prodOrigin').value = p.origin;
        document.getElementById('prodDesc').value = p.description;
        document.getElementById('prodImg').value = p.image_url;

        document.getElementById('modalTitle').textContent = `Edit Product #${p.id}`;
        document.getElementById('productModal').classList.add('active');
    } catch (err) {
        alert('Error fetching product record.');
    }
}

async function deleteProduct(id) {
    if (!confirm(`Confirm DML DELETE query for Product #${id}?`)) return;
    try {
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        if (res.ok) {
            loadAdminProducts();
            loadDashboardStats();
        }
    } catch (err) {
        alert('Error deleting product.');
    }
}

async function updateInquiryStatus(id, newStatus) {
    try {
        await fetch(`/api/inquiries/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
    } catch (err) {
        alert('Failed to update status.');
    }
}

async function deleteInquiry(id) {
    if (!confirm(`Confirm DML DELETE query for Inquiry #${id}?`)) return;
    try {
        const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
        if (res.ok) {
            loadAdminInquiries();
            loadDashboardStats();
        }
    } catch (err) {
        alert('Error deleting inquiry.');
    }
}
