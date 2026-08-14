import type { VercelRequest, VercelResponse } from '@vercel/node';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { Pool } from 'pg';

dotenv.config();

const app = express();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'zigwills2026';
const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || 'zigwills_secret_admin_token_2026';

// DB Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || '',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

// Security headers
app.use(helmet({ contentSecurityPolicy: false }));

// CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'https://zigwills.vercel.app'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
        return callback(null, true);
      }
      return callback(null, true); // Flexible for dev
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);
app.use(express.json());

// Init DB tables (idempotent)
async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        product TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        note TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS gallery (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'general',
        image_url TEXT NOT NULL,
        caption TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        volume TEXT NOT NULL,
        description TEXT NOT NULL,
        price TEXT,
        unit TEXT NOT NULL DEFAULT 'pack',
        min_order TEXT NOT NULL DEFAULT '1',
        badge TEXT,
        in_stock BOOLEAN NOT NULL DEFAULT TRUE,
        image_url TEXT,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
  } catch (err) {
    console.error('DB init error:', err);
  }
}
initDb();

// ─── HEALTH ───────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── AUTH ─────────────────────────────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ token: ADMIN_TOKEN_SECRET, success: true });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// ─── ORDERS ───────────────────────────────────────────────────────────────────
app.post(['/orders', '/api/orders'], async (req, res) => {
  const { customer_name, phone, address, product, quantity, note } = req.body;
  if (!customer_name || !phone || !address || !product) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO orders (customer_name, phone, address, product, quantity, note, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending') RETURNING *`,
      [customer_name.trim(), phone.trim(), address.trim(), product, quantity || 1, note || null]
    );
    return res.status(201).json({ success: true, order: result.rows[0] });
  } catch (err) {
    console.error('Order insert error:', err);
    return res.status(500).json({ error: 'Failed to save order' });
  }
});

app.get('/api/orders', async (req, res) => {
  const { status } = req.query;
  try {
    let q = `SELECT * FROM orders ORDER BY created_at DESC LIMIT 500`;
    let params: unknown[] = [];
    if (status && status !== 'all') {
      q = `SELECT * FROM orders WHERE status = $1 ORDER BY created_at DESC LIMIT 500`;
      params = [status];
    }
    const result = await pool.query(q, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.patch('/api/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const valid = ['pending', 'confirmed', 'delivered', 'cancelled'];
  if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  try {
    const result = await pool.query(
      `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// ─── CUSTOMERS ────────────────────────────────────────────────────────────────
app.get('/api/customers', async (req, res) => {
  const { search } = req.query;
  try {
    let q = `
      SELECT customer_name, phone, address,
        COUNT(*) AS total_orders,
        SUM(quantity) AS total_units_ordered,
        MAX(created_at) AS last_order_date
      FROM orders
      GROUP BY customer_name, phone, address
      ORDER BY last_order_date DESC
    `;
    if (search) {
      q = `
        SELECT customer_name, phone, address,
          COUNT(*) AS total_orders,
          SUM(quantity) AS total_units_ordered,
          MAX(created_at) AS last_order_date
        FROM orders
        WHERE LOWER(customer_name) LIKE LOWER($1) OR phone LIKE $1 OR LOWER(address) LIKE LOWER($1)
        GROUP BY customer_name, phone, address
        ORDER BY last_order_date DESC
      `;
      const result = await pool.query(q, [`%${search}%`]);
      return res.json(result.rows);
    }
    const result = await pool.query(q);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// ─── GALLERY ──────────────────────────────────────────────────────────────────
app.get('/api/gallery', async (_req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM gallery ORDER BY created_at DESC`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

app.post('/api/gallery', async (req, res) => {
  const { title, category, image_url, caption } = req.body;
  if (!title || !image_url) return res.status(400).json({ error: 'title and image_url required' });
  try {
    const result = await pool.query(
      `INSERT INTO gallery (title, category, image_url, caption) VALUES ($1,$2,$3,$4) RETURNING *`,
      [title.trim(), category || 'general', image_url.trim(), caption?.trim() || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save gallery item' });
  }
});

app.put('/api/gallery/:id', async (req, res) => {
  const { id } = req.params;
  const { title, category, image_url, caption } = req.body;
  try {
    const result = await pool.query(
      `UPDATE gallery SET title=$1, category=$2, image_url=$3, caption=$4 WHERE id=$5 RETURNING *`,
      [title, category, image_url, caption, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update gallery item' });
  }
});

app.delete('/api/gallery/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM gallery WHERE id=$1`, [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete gallery item' });
  }
});

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
app.get('/api/products', async (_req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM products ORDER BY id`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/products', async (req, res) => {
  const { id, name, volume, description, price, unit, min_order, badge, in_stock, image_url } = req.body;
  if (!id || !name || !volume || !description) {
    return res.status(400).json({ error: 'Missing required product fields' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO products (id, name, volume, description, price, unit, min_order, badge, in_stock, image_url, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW())
       ON CONFLICT (id) DO UPDATE SET
         name=EXCLUDED.name, volume=EXCLUDED.volume, description=EXCLUDED.description,
         price=EXCLUDED.price, unit=EXCLUDED.unit, min_order=EXCLUDED.min_order,
         badge=EXCLUDED.badge, in_stock=EXCLUDED.in_stock, image_url=EXCLUDED.image_url, updated_at=NOW()
       RETURNING *`,
      [id, name, volume, description, price || null, unit, min_order, badge || null,
       in_stock !== undefined ? Boolean(in_stock) : true, image_url || null]
    );
    res.json({ message: 'Product saved', product: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save product' });
  }
});

// ─── EXPORT ───────────────────────────────────────────────────────────────────
export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req as any, res as any);
}
