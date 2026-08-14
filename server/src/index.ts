import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import pool from './db.js';
import { sendOrderNotificationEmail } from './email.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'zigwills2026';
const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || 'zigwills_secret_admin_token_2026';

// Security headers
app.use(helmet());

// CORS — allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, true); // Dev flexible fallback
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

const initDbTables = async () => {
  try {
    const fs = await import('fs');
    const path = await import('path');
    const schemaPath = path.join(process.cwd(), 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(sql);
      console.log('✅ Neon Postgres database schema & seed data initialized successfully.');
    }
  } catch (err) {
    console.error('Database auto-initialization check:', err);
  }
};

initDbTables();

// Rate limiting for order creation
const orderLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: { error: 'Too many orders submitted. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for admin login attempts (Security Protection)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 login attempts per 15 mins
  message: { error: 'Too many failed admin login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware for Admin Auth Check
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Admin login required.' });
  }
  const token = authHeader.split(' ')[1];
  if (token !== ADMIN_TOKEN_SECRET) {
    return res.status(403).json({ error: 'Invalid or expired admin token.' });
  }
  next();
}

// ----------------------------------------------------
// Public Endpoints
// ----------------------------------------------------

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'Zigwills API' });
});

// Public: Get Products Catalogue
app.get('/api/products', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at ASC');
    if (result.rows.length === 0) {
      // Fallback default products if table is newly created
      return res.json([
        {
          id: 'sachet',
          name: 'Table Water Sachet',
          volume: '500ml',
          description: 'Perfect for on-the-go hydration. Our sealed sachets are produced under hygienic conditions.',
          price: '₦100',
          unit: 'per bag (20 sachets)',
          min_order: 'Minimum order: 1 bag',
          badge: 'Most Popular',
          in_stock: true,
          image_url: '/images/sachet-water.jpg'
        },
        {
          id: 'bottle',
          name: 'Table Water Bottle',
          volume: '75cl / 1.5L',
          description: 'Our premium bottled water, ideal for families, restaurants, and businesses.',
          price: '₦1,500',
          unit: 'per carton (12 bottles)',
          min_order: 'Minimum order: 1 carton',
          badge: 'Premium',
          in_stock: true,
          image_url: '/images/bottle-water.jpg'
        }
      ]);
    }
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products catalogue.' });
  }
});

// Public: Get Gallery Items
app.get('/api/gallery', async (req: Request, res: Response) => {
  const category = req.query.category as string | undefined;
  try {
    let query = 'SELECT * FROM gallery';
    const params: any[] = [];
    if (category && category !== 'all') {
      query += ' WHERE category = $1';
      params.push(category);
    }
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching gallery:', err);
    res.status(500).json({ error: 'Failed to fetch gallery images.' });
  }
});

// Public: Submit Order (creates order + sends notification email)
app.post('/orders', orderLimiter, async (req: Request, res: Response) => {
  const { customer_name, phone, address, product, quantity, note } = req.body;

  if (!customer_name || typeof customer_name !== 'string' || customer_name.trim().length < 2) {
    return res.status(400).json({ error: 'Please provide a valid name.' });
  }
  if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
    return res.status(400).json({ error: 'Please provide a valid phone number.' });
  }
  if (!address || typeof address !== 'string' || address.trim().length < 5) {
    return res.status(400).json({ error: 'Please provide a valid delivery address.' });
  }
  if (!product || typeof product !== 'string') {
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
       RETURNING id, customer_name, phone, address, product, quantity, note, status, created_at`,
      [
        customer_name.trim(),
        phone.trim(),
        address.trim(),
        product.trim(),
        qty,
        note && typeof note === 'string' ? note.trim().slice(0, 500) : null,
      ]
    );

    const newOrder = result.rows[0];

    // Trigger email notification asynchronously
    sendOrderNotificationEmail(newOrder).catch((e) =>
      console.error('Background order email failed:', e)
    );

    res.status(201).json({
      message: 'Order received successfully!',
      order: newOrder,
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Something went wrong while placing your order. Please try again.' });
  }
});

// ----------------------------------------------------
// Admin Endpoints
// ----------------------------------------------------

// Admin Login (Protected against brute-force)
app.post('/api/auth/login', loginLimiter, (req: Request, res: Response) => {
  const { password } = req.body;
  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Incorrect admin password.' });
  }
  return res.json({
    message: 'Admin authentication successful',
    token: ADMIN_TOKEN_SECRET,
  });
});

// Admin: Get all orders (with optional search and status filters)
app.get('/api/orders', requireAdminAuth, async (req: Request, res: Response) => {
  const { status, search } = req.query;
  try {
    let query = 'SELECT * FROM orders WHERE 1=1';
    const params: any[] = [];

    if (status && status !== 'all') {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    if (search && typeof search === 'string') {
      params.push(`%${search.trim()}%`);
      query += ` AND (customer_name ILIKE $${params.length} OR phone ILIKE $${params.length} OR address ILIKE $${params.length})`;
    }

    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching admin orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

// Admin: Update order status
app.patch('/api/orders/:id/status', requireAdminAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['new', 'confirmed', 'delivered', 'cancelled'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  try {
    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    const updatedOrder = result.rows[0];

    // Trigger status update notification
    sendStatusUpdateNotification(updatedOrder, status).catch((e) =>
      console.error('Background status notification failed:', e)
    );

    res.json({ message: 'Order status updated', order: updatedOrder });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ error: 'Failed to update order status.' });
  }
});

// Admin: Get Aggregated Customer Database
app.get('/api/customers', requireAdminAuth, async (req: Request, res: Response) => {
  const { search } = req.query;
  try {
    let query = `
      SELECT 
        phone,
        MAX(customer_name) as customer_name,
        MAX(address) as address,
        COUNT(id)::int as total_orders,
        SUM(quantity)::int as total_units_ordered,
        MAX(created_at) as last_order_date
      FROM orders
    `;
    const params: any[] = [];

    if (search && typeof search === 'string') {
      params.push(`%${search.trim()}%`);
      query += ` WHERE (customer_name ILIKE $${params.length} OR phone ILIKE $${params.length} OR address ILIKE $${params.length})`;
    }

    query += ' GROUP BY phone ORDER BY last_order_date DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ error: 'Failed to fetch customer database.' });
  }
});

// Admin: Add Gallery Image
app.post('/api/gallery', requireAdminAuth, async (req: Request, res: Response) => {
  const { title, category, image_url, caption } = req.body;

  if (!title || !category || !image_url) {
    return res.status(400).json({ error: 'Title, category, and image URL are required.' });
  }

  const validCategories = ['factory', 'workers', 'delivery', 'events'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({ error: `Category must be one of: ${validCategories.join(', ')}` });
  }

  try {
    const result = await pool.query(
      `INSERT INTO gallery (title, category, image_url, caption)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title.trim(), category, image_url.trim(), caption ? caption.trim() : null]
    );

    res.status(201).json({ message: 'Gallery item added', item: result.rows[0] });
  } catch (err) {
    console.error('Error adding gallery item:', err);
    res.status(500).json({ error: 'Failed to add gallery item.' });
  }
});

// Admin: Edit/Update Gallery Image
app.put('/api/gallery/:id', requireAdminAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, category, image_url, caption } = req.body;

  if (!title || !category || !image_url) {
    return res.status(400).json({ error: 'Title, category, and image URL are required.' });
  }

  const validCategories = ['factory', 'workers', 'delivery', 'events'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({ error: `Category must be one of: ${validCategories.join(', ')}` });
  }

  try {
    const result = await pool.query(
      `UPDATE gallery 
       SET title = $1, category = $2, image_url = $3, caption = $4
       WHERE id = $5
       RETURNING *`,
      [title.trim(), category, image_url.trim(), caption ? caption.trim() : null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Gallery item not found.' });
    }

    res.json({ message: 'Gallery item updated', item: result.rows[0] });
  } catch (err) {
    console.error('Error updating gallery item:', err);
    res.status(500).json({ error: 'Failed to update gallery item.' });
  }
});

// Admin: Delete Gallery Image
app.delete('/api/gallery/:id', requireAdminAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM gallery WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Gallery item not found.' });
    }
    res.json({ message: 'Gallery item deleted', id });
  } catch (err) {
    console.error('Error deleting gallery item:', err);
    res.status(500).json({ error: 'Failed to delete gallery item.' });
  }
});

// Admin: Add/Update Product
app.post('/api/products', requireAdminAuth, async (req: Request, res: Response) => {
  const { id, name, volume, description, price, unit, min_order, badge, in_stock, image_url } = req.body;

  if (!id || !name || !volume || !description || !unit || !min_order) {
    return res.status(400).json({ error: 'Product ID, name, volume, description, unit, and minimum order are required.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO products (id, name, volume, description, price, unit, min_order, badge, in_stock, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         volume = EXCLUDED.volume,
         description = EXCLUDED.description,
         price = EXCLUDED.price,
         unit = EXCLUDED.unit,
         min_order = EXCLUDED.min_order,
         badge = EXCLUDED.badge,
         in_stock = EXCLUDED.in_stock,
         image_url = EXCLUDED.image_url
       RETURNING *`,
      [
        id.trim().toLowerCase(),
        name.trim(),
        volume.trim(),
        description.trim(),
        price ? price.trim() : null,
        unit.trim(),
        min_order.trim(),
        badge ? badge.trim() : null,
        in_stock !== undefined ? Boolean(in_stock) : true,
        image_url ? image_url.trim() : null,
      ]
    );

    res.status(200).json({ message: 'Product saved successfully', product: result.rows[0] });
  } catch (err) {
    console.error('Error saving product:', err);
    res.status(500).json({ error: 'Failed to save product.' });
  }
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Zigwills API running on port ${PORT}`);
  });
}

export default app;