const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/product");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

const PORT = process.env.PORT || 5002;
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/products";

app.get("/", (req, res) => {
  res.json({ message: "Products Service is running 🚀" });
});

app.post("/products", async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: "Missing fields" });
    }
    const product = new Product({ name, price });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("❌ Error creating product:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.patch("/products/:id/reduce", async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ error: "Product not found" });

    if (product.stock < quantity) {
      return res.status(400).json({ error: "Not enough stock" });
    }

    product.stock -= quantity;
    await product.save();

    res.json({ message: "Stock reduced", product });
  } catch (error) {
    console.error("❌ Error reducing stock:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB (Products DB)");
    app.listen(PORT, () =>
      console.log(`🚀 Products Service running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection failed:", err));
