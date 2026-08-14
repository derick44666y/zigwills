-- Zigwills Table Water — Database Schema

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  product TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity >= 1),
  note TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'delivered', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders (phone);

-- Admin Users table
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  volume TEXT NOT NULL,
  description TEXT NOT NULL,
  price TEXT,
  unit TEXT NOT NULL,
  min_order TEXT NOT NULL,
  badge TEXT,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('factory', 'workers', 'delivery', 'events')),
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Initial seed data for default products
INSERT INTO products (id, name, volume, description, price, unit, min_order, badge, in_stock, image_url)
VALUES 
  ('sachet', 'Table Water Sachet', '500ml', 'Perfect for on-the-go hydration. Our sealed sachets are produced under hygienic conditions.', '₦100', 'per bag (20 sachets)', 'Minimum order: 1 bag', 'Most Popular', true, '/images/sachet-water.jpg'),
  ('bottle', 'Table Water Bottle', '75cl / 1.5L', 'Our premium bottled water, ideal for families, restaurants, and businesses.', '₦1,500', 'per carton (12 bottles)', 'Minimum order: 1 carton', 'Premium', true, '/images/bottle-water.jpg')
ON CONFLICT (id) DO NOTHING;

-- Initial seed data for gallery
INSERT INTO gallery (title, category, image_url, caption)
VALUES
  ('Hygienic Production Facility', 'factory', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800', 'Automated purification and bottle filling line in Owerri.'),
  ('Dedicated Delivery Team', 'workers', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800', 'Our trained staff ensuring quality control and safe packaging.'),
  ('Fleet Ready for Dispatch', 'delivery', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800', 'Fast delivery trucks supplying businesses and residences across Imo State.'),
  ('Community Event Hydration', 'events', 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800', 'Official water sponsor for local athletic and cultural gatherings in Owerri.')
ON CONFLICT DO NOTHING;