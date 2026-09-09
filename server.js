const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/products', (req, res) => {
    const { category, search } = req.query;
    let query = `
        SELECT p.*, c.name as category_name, c.slug as category_slug 
        FROM products p 
        JOIN categories c ON p.category_id = c.id
    `;
    const params = [];
    const conditions = [];

    if (category && category !== 'all') {
        conditions.push("c.slug = ?");
        params.push(category);
    }

    if (search) {
        conditions.push("(p.name LIKE ? OR p.description LIKE ? OR p.origin LIKE ?)");
        const term = `%${search}%`;
        params.push(term, term, term);
    }

    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY p.id DESC";

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.get('/api/products/:id', (req, res) => {
    const query = `
        SELECT p.*, c.name as category_name 
        FROM products p 
        JOIN categories c ON p.category_id = c.id 
        WHERE p.id = ?
    `;
    db.get(query, [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(row);
    });
});

app.post('/api/products', (req, res) => {
    const { name, category_id, price, unit, stock, origin, description, image_url } = req.body;
    if (!name || !category_id || !price || !unit || !stock) {
        return res.status(400).json({ error: "Missing required product fields" });
    }
    const query = `
        INSERT INTO products (name, category_id, price, unit, stock, origin, description, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const image = image_url || "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80";
    db.run(query, [name, category_id, price, unit, stock, origin || "Sri Lanka", description || "", image], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, message: "Product created successfully" });
    });
});

app.put('/api/products/:id', (req, res) => {
    const { name, category_id, price, unit, stock, origin, description, image_url } = req.body;
    const query = `
        UPDATE products 
        SET name = ?, category_id = ?, price = ?, unit = ?, stock = ?, origin = ?, description = ?, image_url = ?
        WHERE id = ?
    `;
    db.run(query, [name, category_id, price, unit, stock, origin, description, image_url, req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json({ message: "Product updated successfully" });
    });
});

app.delete('/api/products/:id', (req, res) => {
    const query = "DELETE FROM products WHERE id = ?";
    db.run(query, [req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json({ message: "Product deleted successfully" });
    });
});

app.get('/api/categories', (req, res) => {
    db.all("SELECT * FROM categories ORDER BY name ASC", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.get('/api/inquiries', (req, res) => {
    db.all("SELECT * FROM inquiries ORDER BY id DESC", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.post('/api/inquiries', (req, res) => {
    const { full_name, email, phone, subject, message } = req.body;
    if (!full_name || !email || !subject || !message) {
        return res.status(400).json({ error: "Missing required contact fields" });
    }
    const query = `
        INSERT INTO inquiries (full_name, email, phone, subject, message)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.run(query, [full_name, email, phone || "", subject, message], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, message: "Inquiry submitted successfully" });
    });
});

app.put('/api/inquiries/:id', (req, res) => {
    const { status } = req.body;
    db.run("UPDATE inquiries SET status = ? WHERE id = ?", [status, req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Inquiry status updated" });
    });
});

app.delete('/api/inquiries/:id', (req, res) => {
    db.run("DELETE FROM inquiries WHERE id = ?", [req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Inquiry deleted" });
    });
});

app.get('/api/stats', (req, res) => {
    const stats = {};
    db.get("SELECT COUNT(*) as total FROM products", (err, r1) => {
        stats.totalProducts = r1 ? r1.total : 0;
        db.get("SELECT COUNT(*) as total FROM inquiries", (err, r2) => {
            stats.totalInquiries = r2 ? r2.total : 0;
            db.get("SELECT COUNT(*) as total FROM categories", (err, r3) => {
                stats.totalCategories = r3 ? r3.total : 0;
                db.get("SELECT SUM(stock) as totalStock FROM products", (err, r4) => {
                    stats.totalStock = r4 ? r4.totalStock : 0;
                    res.json(stats);
                });
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Ceylon Harvest Organics server running on http://localhost:${PORT}`);
});
