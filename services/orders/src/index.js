const express = require("express");
const mongoose = require("mongoose");
const amqp = require("amqplib");
const dotenv = require("dotenv");
const Order = require("./models/order");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

const PORT = process.env.PORT || 5003;
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/orders";
const RABBITMQ_URI =
  process.env.RABBITMQ_URI || "amqp://guest:guest@rabbitmq:5672";

let channel, connection;

// RabbitMQ connect
async function connectRabbitMQ() {
  try {
    connection = await amqp.connect(RABBITMQ_URI);
    channel = await connection.createChannel();
    await channel.assertQueue("orderQueue");
    console.log("✅ Connected to RabbitMQ (orderQueue ready)");
  } catch (error) {
    console.error("❌ RabbitMQ connection failed:", error);
    setTimeout(connectRabbitMQ, 5000);
  }
}

// Publish order
async function publishOrder(order) {
  if (!channel) return;
  channel.sendToQueue("orderQueue", Buffer.from(JSON.stringify(order)));
  console.log("📤 Order published:", order._id);
}

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Orders Service is running 🚀" });
});

app.post("/orders", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId || !quantity) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const newOrder = new Order({ userId, productId, quantity });
    await newOrder.save();
    await publishOrder(newOrder);

    res.status(201).json(newOrder);
  } catch (err) {
    console.error("❌ Error creating order:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/orders", async (req, res) => {
  try {
const orders = await Order.find()
  .populate("productId", "name price category") // populate product details
  .sort({ createdAt: -1 });

res.json(
  orders.map(order => ({
    orderId: order._id,
    product: order.productId, // populated
    quantity: order.quantity,
    status: order.status,
    createdAt: order.createdAt
  }))
);
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB (Orders DB)");
    app.listen(PORT, () =>
      console.log(`🚀 Orders Service running on port ${PORT}`)
    );
    connectRabbitMQ();
  })
  .catch((err) => console.error("❌ MongoDB connection failed:", err));
