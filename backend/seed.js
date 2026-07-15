const mongoose = require('mongoose');
require('dotenv').config();

// Match the exact schema setup used in your main server
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String
});
const Product = mongoose.model('Product', productSchema);

const seedProducts = [
  { name: "Minimalist Watch", price: 149, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" },
  { name: "Wireless Headphones", price: 299, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" },
  { name: "Leather Backpack", price: 89, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" }
];

async function insertData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Wipe out any existing records to keep the inventory clean
    await Product.deleteMany({});
    
    // Insert our target catalog items
    await Product.insertMany(seedProducts);
    console.log("Database seeded successfully with target items.");
    
    process.exit(0);
  } catch (err) {
    console.error("Seeding operation failed:", err);
    process.exit(1);
  }
}

insertData();