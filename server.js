const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(cors()); 

// DATABASE CONNECTION
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://elitewash-DB:Elitewash2026@cluster0.wfpvesz.mongodb.net/Elitewash-DB?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Connected to EliteWash MongoDB"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// SCHEMA: Updated with 'items' array and support fields
const OrderSchema = new mongoose.Schema({
    serviceType: { type: String, required: true }, 
    itemCount: Number,                             
    items: { type: Array, default: [] }, // <--- Stores the list of clothes (names & quantities)
    fullName: { type: String, required: true },    
    email: { type: String, required: true },       
    phone: { type: String, required: true },       
    stayType: { type: String },    
    areaName: { type: String },    
    addressDetails: { type: String, required: true }, 
    amount: { type: Number, required: true },      
    paymentRef: { type: String, required: true, unique: true }, 
    orderStatus: { type: String, default: 'Paid' }, 
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

// API ROUTES
app.post('/api/save-order', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        console.log("📥 Full order manifest saved:", req.body.paymentRef);
        res.status(200).json({ success: true, message: "Order Secured in Database!" });
    } catch (error) {
        console.error("❌ Save Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Simple health check for Render
app.get('/', (req, res) => res.send('EliteWash API is Live 🚀'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 EliteWash Server running on port ${PORT}`));