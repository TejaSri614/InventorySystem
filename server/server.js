// ----------------- backend/index.js -----------------
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ----------------- CORS Setup -----------------
const allowedOrigins = [
  'http://localhost:3000', // local dev
  'https://inventorysystem-frontend.onrender.com' // deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow requests with no origin (Postman, mobile)
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true, // allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// app.use(cors({
//   origin: "https://inventorysystem-frontend.onrender.com",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// }));



// ----------------- Middleware -----------------
app.use(express.json());

// ----------------- Schemas -----------------
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  stockAvailable: { type: Number, default: 0 },
  image: { type: String, default: '' },
  price: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);

// ----------------- Auth Routes -----------------
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user || user.password !== password)
      return res.status(400).json({ message: 'Invalid credentials' });

    res.json({
      message: 'Login successful',
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ email, password });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ----------------- Product Routes -----------------
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { productId, name, category, description, stockAvailable, image, price } = req.body;
    const product = await Product.create({ productId, name, category, description, stockAvailable, image, price });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post('/api/products/:productId/restock', async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const product = await Product.findOne({ productId });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.stockAvailable += Number(quantity);
    await product.save();

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ----------------- MongoDB Connection -----------------
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
