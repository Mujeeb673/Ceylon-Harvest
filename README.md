# Ceylon Harvest Organics - Web Based Application Development

**Module**: SE102.3 Web Based Application Development  
**Institution**: NSBM Green University, Sri Lanka  
**Module Leader**: Mr. S. Naji  
**Developer**: Mujeeb673  
**Repository**: [Ceylon-Harvest](https://github.com/Mujeeb673/Ceylon-Harvest.git)

---

## 1. Project Overview

**Ceylon Harvest Organics (Pvt) Ltd** is an e-commerce and administrative web application tailored for a Sri Lankan organic spice and tea enterprise based in Colombo 03, with processing facilities in Kandy.

The platform provides direct consumer shopping, catalog search and filtering, contact inquiry processing, and a dedicated back-office Admin Portal executing full Data Manipulation Language (DML) operations on a relational SQLite database.

---

## 2. Key Features

- **Public E-Commerce Portal (4 Main Pages)**:
  - `index.html`: Home page featuring hero showcase, brand values, and dynamic featured products.
  - `products.html`: Catalog page with live search, category filters (Ceylon Spices, Pure Ceylon Teas, Oils & Extracts), and LKR (`Rs.`) pricing.
  - `about.html`: Sri Lankan company heritage, organic farm provenance, and executive leadership profiles (Kasun Perera, Dilani Silva, Nimali Wickramasinghe).
  - `contact.html`: Corporate contact details and an interactive inquiry submission form connected directly to the database.

- **Admin Management Portal**:
  - `admin.html`: Back-office control center showing real-time inventory statistics, product catalog management, and customer inquiry processing.

- **Database DML Operations**:
  - **CREATE / INSERT**: Adding new products via Admin modal and logging customer inquiries.
  - **READ / SELECT**: Multi-keyword catalog searching, category filtering, and dashboard metrics calculation.
  - **UPDATE**: Updating product prices, stock levels, packaging units, and changing customer inquiry statuses (`Pending`, `Replied`, `Resolved`).
  - **DELETE**: Deleting product entries or purging inquiries from the database.

---

## 3. Technology Stack

- **Frontend**: HTML5, Vanilla CSS3 (Dark Emerald Slate design system), Vanilla JavaScript (ES6+ Fetch API)
- **Backend**: Node.js (v24+), Express.js REST API
- **Database**: SQLite3 (`db/database.db`), SQL DDL (`db/schema.sql`), Seed dataset (`db/seed.js`)
- **Automation**: Single-click Windows Batch Launcher (`run_project.bat`)

---

## 4. Color Palette & Design System

The application utilizes a cohesive **Dark Emerald Slate** color system:
- **Primary Background**: `#0b1412` (Deep Forest Slate)
- **Card Surfaces**: `#13221f` (Rich Dark Teal-Slate)
- **Primary Accent**: `#10b981` (Vibrant Ceylon Emerald)
- **Secondary Accent**: `#f59e0b` (Warm Ceylon Gold)
- **Primary Text**: `#f8fafc` (Crisp Off-White)

---

## 5. Directory Structure

```text
SE102.3 Web/
├── db/
│   ├── database.js          # SQLite3 database connection module & PRAGMA setup
│   ├── schema.sql           # DDL schema definitions (categories, products, inquiries)
│   └── seed.js              # Initial database seeder populated with Sri Lankan organic datasets
├── public/
│   ├── css/
│   │   └── style.css        # Dark Emerald Slate design system stylesheet
│   ├── js/
│   │   ├── main.js          # Client-side catalog fetching, search & contact logic
│   │   └── admin.js         # Administrative DML operations & modal management
│   ├── index.html           # Public Home Page view
│   ├── products.html        # Public Products Catalog view
│   ├── about.html           # Public About Us view
│   ├── contact.html         # Public Contact Us view
│   └── admin.html           # Back-Office Administrative Portal
├── package.json             # Node.js project manifest & start scripts
├── server.js                # Express.js REST API server
├── run_project.bat          # Single-click batch launcher
├── PROJECT_REPORT_DETAILS.md# Technical specification & system reference documentation
└── README.md                # Repository overview & setup guide
```

---

## 6. Quick Start & Execution Instructions

### Single-Click Execution (Windows)
Double-click `run_project.bat` in the root directory. The script will automatically:
1. Verify and install Node.js dependencies (`npm install`).
2. Initialize and seed the SQLite database (`db/database.db`).
3. Open `http://localhost:3000` in your web browser.
4. Launch the web server.

### Manual Command Line Execution
```bash
npm install
node db/seed.js
npm start
```
Open `http://localhost:3000` in any modern web browser.

---

## 7. Phased Development Git Commit History

In accordance with Section 6.2 of the project report, the codebase was developed across eight (8) structured commits:

1. `feat: initialize project structure and package.json configuration`
2. `feat(db): design SQLite schema and seed script for Sri Lankan products`
3. `feat(api): implement Express REST endpoints for complete DML operations`
4. `style: implement dark emerald slate UI design system and variables`
5. `feat(ui): build 4 main public pages (home, products, about, contact)`
6. `feat(admin): build admin management portal with full DML actions`
7. `feat(client): implement dynamic search, category filter & contact AJAX`
8. `docs: add single-click batch launcher and comprehensive report docs`

---

## 8. License & Coursework Metadata

- **Coursework Type**: Repeat / Referral Assessment
- **Module**: SE102.3 Web Based Application Development
- **Institution**: NSBM Green University, Sri Lanka
- **Module Leader**: Mr. S. Naji
- **Developer**: Mujeeb673
