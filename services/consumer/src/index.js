const amqp = require("amqplib");
const axios = require("axios");
const mongoose = require("mongoose");
require("dotenv").config();

const RABBITMQ_URI =
  process.env.RABBITMQ_URI || "amqp://guest:guest@rabbitmq:5672";
const PRODUCTS_API =
  process.env.PRODUCTS_API || "http://products-service:5002/products";
const ANALYTICS_URI = process.env.ANALYTICS_URI || "mongodb://mongo:27017/analytics";

// MongoDB Schema for Analytics
const orderAnalyticsSchema = new mongoose.Schema({
  productId: String,
  quantity: Number,
  createdAt: { type: Date, default: Date.now },
});
const OrderAnalytics = mongoose.model("OrderAnalytics", orderAnalyticsSchema);

let connection, channel;

async function connectMongo() {
  try {
    await mongoose.connect(ANALYTICS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB Analytics DB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

async function startConsumer() {
  try {
    connection = await amqp.connect(RABBITMQ_URI);
    channel = await connection.createChannel();

    // Declare queues
    await channel.assertQueue("orderQueue");
    await channel.assertQueue("emailQueue");
    await channel.assertQueue("analyticsQueue");

    console.log("✅ Consumer connected. Waiting for messages...");

    // Order Processing
    channel.consume("orderQueue", async (msg) => {
      if (!msg) return;
      try {
        const order = JSON.parse(msg.content.toString());
        console.log("📦 Processing order:", order);

        // Reduce stock
        await axios.patch(`${PRODUCTS_API}/${order.productId}/reduce`, {
          quantity: order.quantity,
        });

        // Forward order to email & analytics
        channel.sendToQueue("emailQueue", Buffer.from(JSON.stringify(order)));
        channel.sendToQueue("analyticsQueue", Buffer.from(JSON.stringify(order)));

        channel.ack(msg);
      } catch (err) {
        console.error("❌ Failed to process order:", err.message);
        channel.nack(msg, false, true); // requeue message
      }
    });

    // Email Notifications
    channel.consume("emailQueue", (msg) => {
      if (!msg) return;
      try {
        const order = JSON.parse(msg.content.toString());
        console.log(`📧 Sending email: "Order confirmed for ${order.productId}"`);
        channel.ack(msg);
      } catch (err) {
        console.error("❌ Email consumer error:", err.message);
        channel.nack(msg, false, true);
      }
    });

    // Analytics
    channel.consume("analyticsQueue", async (msg) => {
      if (!msg) return;
      try {
        const order = JSON.parse(msg.content.toString());
        await OrderAnalytics.create({
          productId: order.productId,
          quantity: order.quantity,
        });
        console.log(`📊 Analytics updated for product ${order.productId}`);
        channel.ack(msg);
      } catch (err) {
        console.error("❌ Analytics consumer error:", err.message);
        channel.nack(msg, false, true);
      }
    });
  } catch (err) {
    console.error("❌ Consumer failed to connect:", err.message);
    setTimeout(startConsumer, 5000); // retry
  }
}

(async () => {
  await connectMongo();
  await startConsumer();
})();
