import { Droplets, Package } from 'lucide-react';

// ============================================================
// PRICES CONFIG — Update these when real prices are confirmed.
// Set price to null to hide the price display.
// ============================================================
const PRICES: Record<string, { price: string | null; unit: string; minOrder: string }> = {
  sachet: {
    price: null, // e.g. "₦100"
    unit: 'per bag (20 sachets)',
    minOrder: 'Minimum order: 1 bag',
  },
  bottle: {
    price: null, // e.g. "₦1,500"
    unit: 'per carton (12 bottles)',
    minOrder: 'Minimum order: 1 carton',
  },
};

const products = [
  {
    id: 'sachet',
    name: 'Table Water Sachet',
    volume: '500ml',
    description:
      'Perfect for on-the-go hydration. Our sealed sachets are produced under hygienic conditions and great for homes, offices, and events.',
    features: ['Sealed & hygienic', 'Portable size', 'Great for events', 'Bulk orders available'],
    icon: Droplets,
    gradient: 'from-brand-500 to-brand-700',
    badge: 'Most Popular',
  },
  {
    id: 'bottle',
    name: 'Table Water Bottle',
    volume: '75cl / 1.5L',
    description:
      'Our premium bottled water, ideal for families, restaurants, and businesses that want clean water in a convenient bottle.',
    features: ['Resealable cap', 'Crystal clear', 'Family size', 'Restaurant quality'],
    icon: Package,
    gradient: 'from-sky-500 to-brand-600',
    badge: 'Premium',
  },
];

export default function Products() {
  return (
    <section id="products" className="py-24 bg-gradient-to-b from-brand-50/30 to-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block bg-brand-50 text-brand-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Our Products
          </span>
          <h2 className="font-display font-bold text-slate-900 text-4xl md:text-5xl mb-4 leading-tight">
            Choose Your <span className="text-brand-600">Water</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Whether you need sachets for everyday use or bottles for your household, we have exactly what you need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {products.map((p) => {
            const priceInfo = PRICES[p.id];
            return (
              <div
                key={p.id}
                className="relative bg-white rounded-3xl overflow-hidden shadow-xl shadow-blue-100/40 border border-slate-100 hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`bg-gradient-to-br ${p.gradient} p-8 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-8 translate-x-8" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/10 translate-y-6 -translate-x-4" />
                  <span className="relative inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                    {p.badge}
                  </span>
                  <div className="relative flex items-center gap-3 mb-2">
                    <p.icon className="w-8 h-8" />
                    <h3 className="font-display font-bold text-2xl">{p.name}</h3>
                  </div>
                  <p className="relative text-white/80 text-sm">{p.volume}</p>
                </div>

                <div className="p-8">
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">{p.description}</p>

                  {priceInfo.price && (
                    <div className="mb-6 p-4 rounded-xl bg-brand-50 border border-brand-100">
                      <p className="text-2xl font-display font-bold text-brand-700">{priceInfo.price}</p>
                      <p className="text-xs text-slate-500 mt-1">{priceInfo.unit}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{priceInfo.minOrder}</p>
                    </div>
                  )}

                  <ul className="space-y-2 mb-8">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-slate-700 text-sm">
                        <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          ✓
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#order"
                    className={`block w-full text-center bg-gradient-to-r ${p.gradient} text-white font-bold py-3.5 rounded-xl transition-all duration-200 hover:opacity-90 hover:shadow-lg`}
                  >
                    Order {p.name}
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <p className="text-slate-400 text-sm">
            Bulk orders welcome for events, offices & businesses.{' '}
            <a href="tel:09011236098" className="text-brand-600 font-semibold hover:underline">
              Call us to discuss pricing.
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}