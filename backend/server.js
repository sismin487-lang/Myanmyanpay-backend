require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MMPay SDK - safe init
let mmpay = null;
try {
  if (process.env.APP_ID && process.env.PUBLISHABLE_KEY && process.env.SECRET_KEY) {
    const { MMPaySDK } = require('mmpay-node-sdk');
    mmpay = new MMPaySDK({
      appId: process.env.APP_ID,
      publishableKey: process.env.PUBLISHABLE_KEY,
      secretKey: process.env.SECRET_KEY,
      baseUrl: process.env.API_BASE_URL || "https://ezapi.myanmyanpay.com"
    });
    console.log("MMPay SDK OK");
  } else {
    console.log("MMPay skip - testing mode");
  }
} catch(e) {
  console.log("MMPay init fail:", e.message);
}

let payouts = [];

app.get('/', (req, res) => {
  res.json({ 
    status: "MyanMyanPay Backend Running!", 
    mmpay: mmpay ? "connected" : "testing mode - no keys yet",
    time: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// Test payouts endpoint
app.get('/api/payouts', (req, res) => {
  res.json(payouts);
});

app.post('/api/payouts', (req, res) => {
  const payout = { id: Date.now(), ...req.body, createdAt: new Date() };
  payouts.push(payout);
  res.json(payout);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
