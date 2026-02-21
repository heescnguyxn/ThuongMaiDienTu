const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/300'
    },
    category: {
        type: String,
        default: 'General'
    },
    stock: {
        type: Number,
        default: 100
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for searching
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
