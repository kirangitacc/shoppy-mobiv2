# 🛍️ Shoppy

**Shoppy** is a modern full-stack e-commerce web application designed for seamless product discovery and secure transactions. With responsive design and a robust backend, Shoppy delivers a user-centric shopping experience across devices.

---

## 🔐 Demo Login

Use the following credentials to explore the app:

- **Username**: `john_doe`
- **Password**: `password123`

---

## 🌟 Features

- 🏠 **Home Page** – Showcases featured products and trending categories.
- 🛍️ **Product Listing** – Filter and sort items with real-time interactivity.
- 📄 **Product Details** – Full descriptions, pricing, and stock information.
- 🛒 **Cart Management** – Add, update, and remove items from your cart.
- 🔐 **Authentication** – Secure login/signup using JWT and bcrypt.
- 🧾 **Order Listing** – Browse and track past purchases.
- 📝 **Register** – Create new user accounts.
- 👤 **Profile** – View/edit personal details and order history.

---

## 🧱 Tech Stack

### Frontend
- **React** – Dynamic component-based UI
- **React Router** – SPA navigation
- **CSS** – Responsive custom styling

### Backend
- **Node.js** – Server-side runtime
- **Express.js** – REST API development
- **SQLite (shoppy.db)** – Lightweight relational database
- **JWT + bcrypt** – Secure authentication and password hashing

---

## 📂 Folder Structure

shoppy/
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Header/
│ │ │ ├── Footer/
│ │ │ ├── Home/
│ │ │ ├── Products/
│ │ │ ├── Register/
│ │ │ ├── Profile/
│ │ │ └── FiltersGroup/
│ │ ├── App.js
│ │ ├── index.js
│ │ └── styles/
│ ├── package.json
│ └── package-lock.json
├── backend/
│ ├── src/
│ │ ├── app.js
│ │ ├── app.http
│ │ └── shoppy.db
│ ├── .env
│ ├── package.json
│ └── package-lock.json
└── README.md


---

## 🛠 Installation

Follow these steps to run the app locally.

### 1️⃣ Clone the repository:

```bash
git clone https://github.com/kirangitacc/shoppy-mobiv2.git
cd shoppy-mobiv2
