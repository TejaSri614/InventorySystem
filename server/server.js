const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // <-- load .env variables here

const app = express();

app.use(
  cors({
    origin: 'inventory-system-black-six.vercel.app', // React app
    credentials: true,
  })
);
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
});

app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });

  let existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ email, password });
  res.json(user);
});

// ----------------- Product Routes -----------------
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post('/api/products', async (req, res) => {
  const { productId, name, category, description, stockAvailable, image, price } = req.body;
  try {
    const product = await Product.create({
      productId,
      name,
      category,
      description,
      stockAvailable,
      image,
      price,
    });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post('/api/products/:productId/restock', async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  // Using your custom productId:
  const product = await Product.findOne({ productId });
  if (!product) return res.status(404).json({ message: 'Product not found' });

  product.stockAvailable += Number(quantity);
  await product.save();

  res.json(product);
});

// ----------------- MongoDB Connection -----------------
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));
