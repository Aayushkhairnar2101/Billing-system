const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Database file paths
const usersFile = path.join(__dirname, 'users.json');
const productsFile = path.join(__dirname, 'products.json');

// Helper functions to read/write JSON files
function readJSON(filePath, defaultValue = []) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (error) {
    console.error('Error reading file:', error);
  }
  return defaultValue;
}

function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing file:', error);
    return false;
  }
}

// Initialize default admin user
function initializeAdmin() {
  let users = readJSON(usersFile, []);
  if (!users.find(u => u.username === 'admin')) {
    users.push({
      id: Date.now(),
      username: 'admin',
      email: 'admin@billease.com',
      password: 'admin',
      createdAt: new Date()
    });
    writeJSON(usersFile, users);
  }
}

initializeAdmin();

// AUTHENTICATION ROUTES

// Register
app.post('/api/register', (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // Validation
  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ success: false, message: 'All fields required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match' });
  }

  if (password.length < 4) {
    return res.status(400).json({ success: false, message: 'Password must be at least 4 characters' });
  }

  let users = readJSON(usersFile, []);

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ success: false, message: 'Username already exists' });
  }

  // Create new user
  const newUser = {
    id: Date.now(),
    username,
    email,
    password,
    createdAt: new Date()
  };

  users.push(newUser);
  writeJSON(usersFile, users);

  res.json({
    success: true,
    message: 'Registration successful',
    user: { username: newUser.username, email: newUser.email }
  });
});

// Sign In
app.post('/api/signin', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required' });
  }

  let users = readJSON(usersFile, []);
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  res.json({
    success: true,
    message: 'Sign in successful',
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  });
});

// PRODUCT ROUTES

// Get all products for a user
app.get('/api/products/:userId', (req, res) => {
  const { userId } = req.params;
  let products = readJSON(productsFile, []);
  let userProducts = products.filter(p => p.userId == userId);
  res.json(userProducts);
});

// Add product
app.post('/api/products', (req, res) => {
  const { userId, name, price, image } = req.body;

  if (!userId || !name || !price) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  let products = readJSON(productsFile, []);

  const newProduct = {
    id: Date.now(),
    userId: parseInt(userId),
    name,
    price: parseFloat(price),
    image: image || null,
    createdAt: new Date()
  };

  products.push(newProduct);
  writeJSON(productsFile, products);

  res.json({ success: true, message: 'Product added', product: newProduct });
});

// Update product
app.put('/api/products/:productId', (req, res) => {
  const { productId } = req.params;
  const { name, price, image } = req.body;

  let products = readJSON(productsFile, []);
  const product = products.find(p => p.id == productId);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  if (name) product.name = name;
  if (price) product.price = parseFloat(price);
  if (image) product.image = image;

  writeJSON(productsFile, products);
  res.json({ success: true, message: 'Product updated', product });
});

// Delete product
app.delete('/api/products/:productId', (req, res) => {
  const { productId } = req.params;

  let products = readJSON(productsFile, []);
  products = products.filter(p => p.id != productId);

  writeJSON(productsFile, products);
  res.json({ success: true, message: 'Product deleted' });
});

// INVOICE ROUTES (Store invoices per user)
const invoicesFile = path.join(__dirname, 'invoices.json');

// Get user invoices
app.get('/api/invoices/:userId', (req, res) => {
  const { userId } = req.params;
  let invoices = readJSON(invoicesFile, []);
  let userInvoices = invoices.filter(inv => inv.userId == userId);
  res.json(userInvoices);
});

// Save invoice
app.post('/api/invoices', (req, res) => {
  const { userId, customerName, items, subtotal, gst, total } = req.body;

  if (!userId || !customerName || !items) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  let invoices = readJSON(invoicesFile, []);

  const newInvoice = {
    id: Date.now(),
    userId: parseInt(userId),
    customerName,
    items,
    subtotal,
    gst,
    total,
    createdAt: new Date()
  };

  invoices.push(newInvoice);
  writeJSON(invoicesFile, invoices);

  res.json({ success: true, message: 'Invoice saved', invoice: newInvoice });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', port: PORT });
});

// Start server
app.listen(PORT, () => {
  console.log(`BillEase Backend Server running on http://localhost:${PORT}`);
  console.log('Default admin credentials:');
  console.log('Username: admin');
  console.log('Password: admin');
});
