# BillEase - Online Billing System

A complete billing system with product management, shopping cart, and invoice generation.

## Features

- **User Authentication**
  - Register new users
  - Secure sign-in
  - User-specific data storage

- **Product Management**
  - Upload products with images
  - Edit product images
  - Delete products
  - Store products with prices

- **Shopping & Billing**
  - Browse products in store
  - Add products to cart
  - Manage quantities
  - Generate invoices with GST calculation
  - Save invoice history

## Setup Instructions

### Backend Setup

1. **Install Node.js** (if not already installed)
   - Download from https://nodejs.org/

2. **Install Dependencies**
   ```bash
   cd "D:\github\Billing system\index.html"
   npm install
   ```

3. **Start the Backend Server**
   ```bash
   npm start
   ```
   
   You should see:
   ```
   BillEase Backend Server running on http://localhost:5000
   Default admin credentials:
   Username: admin
   Password: admin
   ```

### Frontend Setup

1. **Open billing.html**
   - Open the file in your web browser
   - The frontend will automatically connect to the backend

## Default Login Credentials

```
Username: admin
Password: admin
```

Or register a new account!

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/signin` - Sign in user

### Products
- `GET /api/products/:userId` - Get user's products
- `POST /api/products` - Add new product
- `PUT /api/products/:productId` - Update product
- `DELETE /api/products/:productId` - Delete product

### Invoices
- `GET /api/invoices/:userId` - Get user's invoices
- `POST /api/invoices` - Save invoice

## File Structure

```
billing system/
├── index.html          # Frontend application
├── server.js            # Backend server
├── package.json         # Node dependencies
├── users.json          # User data (auto-created)
├── products.json       # Products data (auto-created)
└── invoices.json       # Invoices data (auto-created)
```

## How to Use

1. **Register/Login**
   - Click "Register" to create a new account
   - Or use admin/admin credentials

2. **Add Products**
   - Go to "Manage Products"
   - Upload product name, price, and image
   - Click "Add Product"

3. **Browse Store**
   - Go to "Store Products"
   - Browse all available products
   - Click "Add to Cart" to purchase

4. **Generate Invoice**
   - View cart from store
   - Enter customer name
   - Click "Generate Invoice"
   - Save for records

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: JSON files (localStorage for frontend data)
- **API**: RESTful API

## Notes

- Each user has their own products, cart, and invoices
- Data is persisted in JSON files on the server
- Images are stored as base64 in the database
- Maximum image size: 50MB

Enjoy using BillEase!
