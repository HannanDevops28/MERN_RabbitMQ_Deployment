const mongoose = require('mongoose');


const OrderSchema = new mongoose.Schema({
userId: { type: String, required: true },
productId: { type: String, required: true },
quantity: { type: Number, default: 1 },
status: { type: String, default: 'created' }
}, { timestamps: true });


module.exports = mongoose.model('Order', OrderSchema);