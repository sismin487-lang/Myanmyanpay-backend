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
