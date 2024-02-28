const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    Item_Name: {
        type: String,
        required: true
    },
    Brand_Name: {
        type: String,
        required: true
    },
    Category: {
        type: String,
        required: true
    },
    MRP: {
        type: Number,
        required: true
    },
    // Image: {
    //     type: String, // Assuming you'll store image URLs in the database
    //     required: false,
    // },
    Stock: {
        type: Number,
        required: true
    },
    Shop: {
        type: String,
        required: true
    }
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
