const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Enable cross-origin resource sharing so the frontend can talk to the backend
app.use(cors());

// Enable parsing of JSON data sent in request bodies
app.use(express.json());

// Hardcoded store inventory data for demonstration purposes
const products = [
  { 
    id: 1, 
    name: "Minimalist Watch", 
    price: 149, 
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" 
  },
  { 
    id: 2, 
    name: "Wireless Headphones", 
    price: 299, 
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" 
  },
  { 
    id: 3, 
    name: "Leather Backpack", 
    price: 89, 
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" 
  }
];

// Route to fetch all available store products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Route to handle checkout submission and return an order tracking number
app.post('/api/checkout', (req, res) => {
  const { cartItems } = req.body;
  
  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ success: false, message: "Cart cannot be empty" });
  }
  
  // Generate a random 6-digit order identification number
  const confirmationId = Math.floor(100000 + Math.random() * 900000);
  res.json({ success: true, orderId: confirmationId });
});

// Start the server listener
app.listen(PORT, () => {
  console.log(`Server is running smoothly on port ${PORT}`);
});