import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;
const GAS_URL = 'https://script.google.com/macros/s/AKfycbwtjXiwx9bLxUrFdGhqxqQ8PVuw7kWL5dj3nvXVRjROr8fVGFe5Qz3HLscJd97w3AUqiQ/exec';

app.use(cors());
app.use(express.json());

// GET handler (proxy ke GAS)
app.get('/api', async (req, res) => {
  const url = `${GAS_URL}?${new URLSearchParams(req.query).toString()}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal fetch dari GAS', error: error.message });
  }
});

// POST handler (proxy ke GAS)
app.post('/api', async (req, res) => {
  try {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal POST ke GAS', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Middleware server ready at http://localhost:${PORT}`);
});
