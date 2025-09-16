const amqp = require('amqplib');


async function startConsumer(rabbitUrl, handler) {
if (!rabbitUrl) throw new Error('RABBITMQ_URL not set');
const conn = await amqp.connect(rabbitUrl);
const ch = await conn.createChannel();
const q = 'order_created';
await ch.assertQueue(q, { durable: true });
console.log('[products] Waiting for messages in', q);


ch.consume(q, async (msg) => {
if (!msg) return;
try {
const payload = JSON.parse(msg.content.toString());
await handler(payload);
ch.ack(msg);
} catch (err) {
console.error('[products] failed to process message', err);
}
}, { noAck: false });
}


module.exports = { startConsumer };