require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MMPaySDK } = require('mmpay-node-sdk');

const app = express();
app.use(cors());
app.use(express.json());

// MMPay SDK Init - ENV ကနေ Keys တွေယူမယ်
const mmpay = new MMPaySDK({
  appId: process.env.APP_ID,
  publishableKey: process.env.PUBLISHABLE_KEY,
  secretKey: process.env.SECRET_KEY,
  baseUrl: process.env.API_BASE_URL || 'https://ezapi.myanmyanpay.com'
});

// In-memory payouts - Render Free tier မှာ restart တိုင်း reset ဖြစ်မယ်
let payouts = [];

app.get('/', (req, res) => {
  res.json({ 
    status: 'MyanMyanPay Backend Running ', 
    version: '1.0.0',
    endpoints: ['/api/create-payment', '/api/payouts', '/api/approve']
  });
});

// Create Payment - Frontend ကနေ ခေါ်မယ့် API
app.post('/api/create-payment', async (req, res) => {
  try {
    const { amount, orderId, description } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: 'amount is required' });
    }

    const payment = await mmpay.payments.create({
      amount: Number(amount),
      currency: 'MMK',
      order_id: orderId || `ORDER_${Date.now()}`,
      description: description || 'MyanMyanPay Payment'
    });

    res.json({ success: true, data: payment });
  } catch (err) {
    console.error('Create Payment Error:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Payment creation failed' 
    });
  }
});

// Get All Payouts
app.get('/api/payouts', (req, res) => {
  res.json({ success: true, data: payouts });
});

// Create Payout (for testing / webhook)
app.post('/api/payouts', (req, res) => {
  const newPayout = {
    id: `PAYOUT_${Date.now()}`,
    amount: req.body.amount || 0,
    status: 'pending',
    user: req.body.user || 'user@example.com',
    createdAt: new Date().toISOString(),
    ...req.body
  };
  payouts.push(newPayout);
  res.json({ success: true, data: newPayout });
});

// Approve Payout
app.post('/api/approve', (req, res) => {
  const { id } = req.body;
  
  if (!id) {
    return res.status(400).json({ error: 'Payout ID is required' });
  }

  const payout = payouts.find(p => p.id === id);
  if (!payout) {
    return res.status(404).json({ error: 'Payout not found' });
  }
  
  payout.status = 'approved';
  payout.approvedAt = new Date().toISOString();
  
  res.json({ success: true, data: payout });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
