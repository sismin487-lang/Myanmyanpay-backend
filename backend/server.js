require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
console.log("MMPay SDK OK - TEST MODE CONNECTED");
app.get('/', (req, res) => {
  res.json({
    status: "MyanMyanPay Backend Running!",
    mmpay: "connected",
    time: new Date().toISOString()
  });
});
app.get('/health', (req, res) => {
  res.json({ ok: true });
});
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
