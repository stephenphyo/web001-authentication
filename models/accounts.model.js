const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
    {
        firstName: { type: String },
        lastName: { type: String },
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        dob: { type: Date },
        avatar: { type: String, default: '' },
        lastLoginAt: { type: Date }
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

module.exports = mongoose.model('Account', accountSchema);