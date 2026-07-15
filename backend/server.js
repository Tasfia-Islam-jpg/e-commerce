const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Connect to the remote MongoDB Atlas cluster
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Database connection successful"))
  .catch((err) => console.error("Database connection failed:", err));

// Define what a Product document looks like in the database
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String
});
const Product = mongoose.model('Product', productSchema);

// Define what an Order document looks like in the database
const orderSchema = new mongoose.Schema({
  items: Array,
  orderDate: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

// Route to fetch all products directly from MongoDB
app.get('/api/products', async (req, res) => {
  try {
    const databaseProducts = await Product.find();
    res.json(databaseProducts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch inventory data" });
  }
});

// Route to process checkouts and save the order receipt into MongoDB
app.post('/api/checkout', async (req, res) => {
  const { cartItems } = req.body;
  
  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ success: false, message: "Cart cannot be empty" });
  }
  
  try {
    const newOrder = new Order({ items: cartItems });
    const savedOrder = await newOrder.save();
    // Use the auto-generated MongoDB document ID as our clean transaction receipt string
    res.json({ success: true, orderId: savedOrder._id });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to save order transaction" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running smoothly on port ${PORT}`);
});