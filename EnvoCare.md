# **📌 System Design Documentation**

## **1️⃣ Overview**

This document outlines the system design for a **Laravel-based Content Management System (CMS)** with a **React frontend**. The system allows admins to manage website content dynamically from a backend panel (Filament), and the frontend fetches this data via REST APIs.

## **2️⃣ Architecture**

- **Frontend:** React (Vite)
- **Backend:** Laravel (PHP 8.2)
- **Database:** MySQL
- **Authentication:** Laravel Sanctum (Token-based authentication)
- **Admin Panel:** Filament (Laravel Admin UI)
- **Hosting:** Shared hosting (Hostinger)
- **State Management:** Zustand
- **Cookies for Authentication:** Yes

## **3️⃣ High-Level Flow**

1. Admin logs into the Filament dashboard.
2. Admin updates website sections (e.g., Navbar, Footer, Homepage, Services, etc.).
3. The updated data is stored in the MySQL database.
4. React frontend fetches content dynamically via Laravel API.
5. Users view the dynamically updated website in real-time.

## **4️⃣ Backend Folder Structure**

```
my-cms/
├── app/
│   ├── Http/
│   │   ├── Controllers/        # API Controllers
│   │   ├── Middleware/         # Security Middleware
│   ├── Models/                 # Laravel Eloquent Models
│   ├── Providers/
│
├── database/
│   ├── migrations/              # Database schema changes
│   ├── seeders/                 # Dummy data
│
├── routes/
│   ├── web.php                  # Web routes (Filament Admin Panel)
│   ├── api.php                  # API routes (React Frontend)
│
├── public/                       # Public assets
├── resources/                    # Blade templates (For Filament)
├── .env                          # Environment variables
└── storage/                      # File uploads
```

## **5️⃣ React Frontend Folder Structure**

```
cms-frontend/
├── public/                  # Static assets (favicon, images, etc.)
├── src/
│   ├── assets/              # Static assets (icons, images, styles)
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx       # Navigation bar
│   │   ├── Footer.jsx       # Footer section
│   │   ├── Loader.jsx       # Loading spinner
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Homepage
│   │   ├── About.jsx        # About us page
│   │   ├── Services.jsx     # Services page
│   │   ├── Projects.jsx     # Projects page
│   │   ├── Contact.jsx      # Contact page
│   │   ├── Blog.jsx         # Blog listing page
│   │   ├── BlogDetail.jsx   # Blog details page
│   ├── services/            # API service functions
│   │   ├── api.js           # API configuration and fetch logic
│   ├── store/               # Zustand store for state management
│   │   ├── useContentStore.js
│   ├── layouts/             # Layout components (Reusable templates)
│   │   ├── MainLayout.jsx   # Main Layout with Navbar/Footer
│   ├── router/              # React Router configuration
│   │   ├── routes.jsx
│   ├── styles/              # Global styles (CSS/SCSS)
│   ├── App.jsx              # Main App component
│   ├── main.jsx             # Entry point
├── .env                     # Environment variables
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
└── README.md                # Documentation
```

## **6️⃣ Database Schema**

### **📌 `contents` Table**

Stores dynamic content for website sections.

```sql
CREATE TABLE contents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    section_name VARCHAR(255) UNIQUE NOT NULL,
    content JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **📌 `users` Table (Admins Only)**

Stores admin login details.

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## **7️⃣ API Endpoints**

| HTTP Method | Endpoint                 | Description                              |
| ----------- | ------------------------ | ---------------------------------------- |
| `POST`      | `/api/login`             | Admin login using Sanctum authentication |
| `POST`      | `/api/logout`            | Admin logout                             |
| `GET`       | `/api/content/{section}` | Get content for a specific section       |
| `PUT`       | `/api/content/{section}` | Update content (Auth required)           |

## **8️⃣ Deployment Steps**

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Run Local Development Server**

   ```bash
   npm run dev
   ```

3. **Build for Production**

   ```bash
   npm run build
   ```

4. **Upload Build Folder to Hostinger**
   - Upload `dist/` folder to your shared hosting server.
   - Configure `.htaccess` to serve `index.html`.

## **9️⃣ Estimated Expenses (INR)**

| Service                                      | Cost (Approx.)            |
| -------------------------------------------- | ------------------------- |
| **Hostinger Shared Hosting** (Business Plan) | ₹330/month (~₹3,960/year) |
| **Domain Name**                              | ₹800 - ₹1,200/year        |
| **SSL Certificate** (Free with Hosting Plan) | ₹0                        |
| **MySQL Database** (Included in Hosting)     | ₹0                        |
| **Total Annual Cost**                        | ~₹4,800 - ₹5,200          |

---

## **✅ Summary**

- **Admin Panel:** Manage website sections dynamically.
- **API:** Fetch and update content in JSON format.
- **React Frontend:** Displays content dynamically using API.
- **Authentication:** Laravel Sanctum (Token-based security) with Cookies.
- **State Management:** Zustand for global state handling.
- **Hosting:** Deployed on Hostinger (Shared Hosting).
- **Estimated Cost:** ~₹4,800 - ₹5,200 per year.
