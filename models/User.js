const mongoose = require('mongoose');

const userScheme = new mongoose.Schema({
    username: String, email: { type: String, required: true, unique: true }, password: String
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('User', userScheme);