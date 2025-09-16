const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5004;
const ANALYTICS_URI =
  process.env.ANALYTICS_URI;

app.use(cors({ origin: "*" }));
app.use(express.json());

const orderAnalyticsSchema = new mongoose.Schema({
  productId: String,
  quantity: Number,
  createdAt: { type: Date, default: Date.now },
});
const OrderAnalytics = mongoose.model("OrderAnalytics", orderAnalyticsSchema);

mongoose
  .connect(ANALYTICS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, 
    socketTimeoutMS: 45000,
  })
  .then(() => console.log("✅ Connected to Analytics DB"))
  .catch((err) => {
    console.error("❌ Analytics DB connection error:", err.message);
    process.exit(1);
  });

app.get("/", (req, res) => res.send("📊 Analytics Service Running"));

app.get("/analytics", async (req, res) => {
  try {
    const data = await OrderAnalytics.find().sort({ createdAt: -1 }).limit(50);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/analytics", async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const record = await OrderAnalytics.create({ productId, quantity });
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/analytics/summary", async (req, res) => {
  try {
    const summary = await OrderAnalytics.aggregate([
      { $group: { _id: "$productId", totalQuantity: { $sum: "$quantity" } } },
      { $sort: { totalQuantity: -1 } },
    ]);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 Analytics service running on port ${PORT}`)
);
