const db = require('./database');

db.serialize(() => {
    db.run("DELETE FROM products;");
    db.run("DELETE FROM categories;");
    db.run("DELETE FROM inquiries;");

    const insertCategory = db.prepare("INSERT INTO categories (name, slug) VALUES (?, ?)");
    insertCategory.run("Ceylon Spices", "spices");
    insertCategory.run("Pure Ceylon Teas", "teas");
    insertCategory.run("Organic Extracts & Oils", "extracts");
    insertCategory.run("Plantation Products", "plantation");
    insertCategory.finalize();

    const insertProduct = db.prepare(`
        INSERT INTO products (name, category_id, price, unit, stock, origin, description, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertProduct.run("Pure Ceylon Cinnamon Sticks (Alba Grade)", 1, 1850.00, "250g Pack", 150, "Galle, Sri Lanka", "Authentic Alba grade Ceylon cinnamon sticks sourced directly from southern coastal plantations.", "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80");
    insertProduct.run("Premium Ceylon Black Pepper (Whole)", 1, 1200.00, "500g Pack", 200, "Matale, Sri Lanka", "High-piperine organic black pepper harvested from central hills of Matale.", "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80");
    insertProduct.run("Nuwara Eliya High Grown Black Tea (FBOP)", 2, 2400.00, "500g Tin", 90, "Nuwara Eliya, Sri Lanka", "Single-origin loose leaf black tea harvested at 6,000ft altitude with golden liquor.", "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80");
    insertProduct.run("Ceylon Organic Green Tea with Jasmine", 2, 1950.00, "250g Pack", 120, "Kandy, Sri Lanka", "Hand-plucked green tea leaves infused with natural night-blooming jasmine flowers.", "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=600&q=80");
    insertProduct.run("Organic Ceylon Green Cardamom (LG)", 1, 4200.00, "100g Pack", 75, "Kandy, Sri Lanka", "Aromatic large green cardamom pods sun-dried naturally in Kandy spice gardens.", "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80");
    insertProduct.run("Handpicked Ceylon Cloves", 1, 2100.00, "200g Pack", 110, "Kegalle, Sri Lanka", "Rich essential oil content whole aromatic cloves hand selected from Kegalle.", "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80");
    insertProduct.run("Cold-Pressed Extra Virgin Coconut Oil", 3, 1450.00, "1 Liter Bottle", 180, "Kurunegala, Sri Lanka", "Unrefined 100% pure organic virgin coconut oil pressed in Coconut Triangle.", "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?auto=format&fit=crop&w=600&q=80");
    insertProduct.run("Roasted Traditional Jaffna Curry Powder", 1, 950.00, "250g Pack", 250, "Jaffna, Sri Lanka", "Authentic northern Sri Lankan spice blend roasted to perfection with curry leaves.", "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80");

    insertProduct.finalize();

    const insertInquiry = db.prepare(`
        INSERT INTO inquiries (full_name, email, phone, subject, message, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertInquiry.run("Kasun Perera", "kasun.p@gmail.com", "+94 77 123 4567", "Wholesale Tea Export Inquiry", "We would like to request bulk pricing and export documentation for Nuwara Eliya Black Tea.", "Pending");
    insertInquiry.run("Dilshan Jayawardena", "dilshan.j@yahoo.com", "+94 71 888 9911", "Organic Certification", "Please share the EU and USDA organic certificates for your Alba Cinnamon batch.", "Replied");
    insertInquiry.run("Ruwani Fernando", "ruwani.f@hotmail.com", "+94 76 555 4321", "Store Pick-up in Kandy", "Is it possible to collect a pre-packed spice box directly from your Kandy showroom?", "Pending");

    insertInquiry.finalize((err) => {
        if (!err) {
            console.log("Database seeded successfully.");
        }
    });
});
