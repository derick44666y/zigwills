# Zigwills Table Water

Website + Order API for Zigwills Table Water.

## Stack

| Layer | Tech | Host |
|---|---|---|
| Frontend | Vite + React + Tailwind | Vercel |
| Backend | Node + Express | Render |
| Database | Neon Postgres | Neon |

## Project Structure

```
├── project/          # Vite + React frontend
│   ├── src/
│   │   ├── components/
│   │   └── App.tsx
│   └── public/images/
├── server/           # Express + Neon API
│   ├── src/
│   │   ├── index.ts  # API entry
│   │   └── db.ts     # Postgres pool
│   └── schema.sql    # Orders table schema
└── README.md
```

## Local Development

### Frontend

```bash
cd project
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
cp .env.example .env   # Add your DATABASE_URL
npm run dev
```

## Deployment

### 1. Neon Database

1. Create a project at [neon.tech](https://neon.tech)
2. Copy the connection string (pooled)
3. Open the **SQL Editor** and run `server/schema.sql`

### 2. Render (Backend API)

1. Go to [render.com](https://render.com) → **New** → **Web Service**
2. Connect your GitHub repo `derick44666y/zigwills`
3. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
4. Add environment variables:
   - `DATABASE_URL` = your Neon connection string
   - `ALLOWED_ORIGINS` = `http://localhost:5173,https://your-app.vercel.app`
5. Deploy → note your API URL (e.g. `https://zigwills-api.onrender.com`)

### 3. Vercel (Frontend Website)

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**
2. Import your GitHub repo `derick44666y/zigwills`
3. Settings:
   - **Root Directory:** `project`
   - **Framework Preset:** Vite (auto-detected)
4. Add environment variable:
   - `VITE_API_URL` = your Render API URL (e.g. `https://zigwills-api.onrender.com`)
5. Deploy

### 4. After Deployment

1. Update `project/index.html` — replace `/images/zigwills-logo.png` in `og:image` and `twitter:image` with the full live URL (e.g. `https://your-app.vercel.app/images/zigwills-logo.png`)
2. Update `server/.env` on Render — add your Vercel domain to `ALLOWED_ORIGINS`
3. Push changes → Vercel and Render auto-deploy

## Adding Prices

Edit `project/src/components/Products.tsx` → `PRICES` config:

```ts
const PRICES = {
  sachet: {
    price: '₦100',        // Set to null to hide
    unit: 'per bag (20 sachets)',
    minOrder: 'Minimum order: 1 bag',
  },
  bottle: {
    price: '₦1,500',
    unit: 'per carton (12 bottles)',
    minOrder: 'Minimum order: 1 carton',
  },
};
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/orders` | Create an order (rate-limited: 5 per 10 min per IP) |

## Security

- CORS restricted to allowed origins only
- Rate limiting on order submission
- Helmet security headers
- Input validation on all fields
- Parameterized SQL queries (no injection)