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

// SCHEMA: Robust version for EliteWash
const OrderSchema = new mongoose.Schema({
    serviceType: { type: String, required: true }, 
    itemCount: { type: Number, default: 0 }, 
    items: { type: Array, default: [] }, // Stores the detailed list of clothes
    fullName: { type: String, required: true },    
    email: { type: String, required: true },       
    phone: { type: String, required: true },       
    stayType: { type: String, default: 'Not Specified' },    
    areaName: { type: String, default: 'Not Specified' },    
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
        console.log("📥 Incoming Order Data:", JSON.stringify(req.body, null, 2));

        // Create the order object and ensure items exists
        const orderData = {
            ...req.body,
            items: req.body.items || [],
            itemCount: req.body.itemCount || 0
        };

        const newOrder = new Order(orderData);
        await newOrder.save();
        
        console.log("✅ Order Saved Successfully! Ref:", req.body.paymentRef);
        res.status(200).json({ 
            success: true, 
            message: "Order Secured in Database!",
            orderId: newOrder._id 
        });

    } catch (error) {
        // This prints the EXACT reason for the 500 error in your Render logs
        console.error("❌ Save Error Logic:", error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message,
            tip: "Check if paymentRef is unique or if required fields are missing"
        });
    }
});

// Simple health check for Render
app.get('/', (req, res) => res.send('EliteWash API is Live 🚀'));

const PORT = process.env.PORT || 10000; // Render prefers 10000
app.listen(PORT, () => console.log(`🚀 EliteWash Server running on port ${PORT}`));