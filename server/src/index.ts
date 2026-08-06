import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security headers
app.use(helmet());

// CORS — restricted to the Vercel website
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, health checks)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST'],
  })
);

app.use(express.json());

// Rate limiting — anti-spam: max 5 orders per 10 minutes per IP
const orderLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { error: 'Too many orders. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Create order
app.post('/orders', orderLimiter, async (req, res) => {
  const { customer_name, phone, address, product, quantity, note } = req.body;

  // Validate required fields
  if (!customer_name || typeof customer_name !== 'string' || customer_name.trim().length < 2) {
    return res.status(400).json({ error: 'Please provide a valid name.' });
  }
  if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
    return res.status(400).json({ error: 'Please provide a valid phone number.' });
  }
  if (!address || typeof address !== 'string' || address.trim().length < 5) {
    return res.status(400).json({ error: 'Please provide a valid delivery address.' });
  }
  if (!['sachet', 'bottle'].includes(product)) {
    return res.status(400).json({ error: 'Please select a valid product.' });
  }
  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 1 || qty > 1000) {
    return res.status(400).json({ error: 'Quantity must be a whole number between 1 and 1000.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO orders (customer_name, phone, address, product, quantity, note)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, created_at`,
      [
        customer_name.trim(),
        phone.trim(),
        address.trim(),
        product,
        qty,
        note && typeof note === 'string' ? note.trim().slice(0, 500) : null,
      ]
    );

    res.status(201).json({
      message: 'Order received!',
      order: result.rows[0],
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`Zigwills API running on port ${PORT}`);
});