import { useState, useEffect } from 'react';
import { Droplets, Package, CheckCircle2 } from 'lucide-react';

interface ProductData {
  id: string;
  name: string;
  volume: string;
  description: string;
  price?: string | null;
  unit: string;
  min_order: string;
  badge?: string;
  in_stock: boolean;
  features?: string[];
}

const DEFAULT_PRODUCTS: ProductData[] = [
  {
    id: 'sachet',
    name: 'Table Water Sachet',
    volume: '500ml',
    description:
      'Perfect for on-the-go hydration. Our sealed sachets are produced under hygienic conditions and great for homes, offices, and events.',
    price: '₦100',
    unit: 'per bag (20 sachets)',
    min_order: 'Minimum order: 1 bag',
    badge: 'Most Popular',
    in_stock: true,
    features: ['Sealed & hygienic', 'Portable size', 'Great for events', 'Bulk orders available'],
  },
  {
    id: 'bottle',
    name: 'Table Water Bottle',
    volume: '75cl / 1.5L',
    description:
      'Our premium bottled water, ideal for families, restaurants, and businesses that want clean water in a convenient bottle.',
    price: '₦1,500',
    unit: 'per carton (12 bottles)',
    min_order: 'Minimum order: 1 carton',
    badge: 'Premium',
    in_stock: true,
    features: ['Resealable cap', 'Crystal clear', 'Family size', 'Restaurant quality'],
  },
];

export default function Products() {
  const [productList, setProductList] = useState<ProductData[]>(DEFAULT_PRODUCTS);

  useEffect(() => {
    const fetchProducts = async () => {
      const apiUrl = import.meta.env.VITE_API_URL as string | undefined;
      if (!apiUrl) return;

      try {
        const res = await fetch(`${apiUrl.replace(/\/$/, '')}/api/products`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setProductList(
              data.map((item) => ({
                ...item,
                features: item.features || [
                  '100% Purified Water',
                  'NALFDAC Approved',
                  'Hygiene Guaranteed',
                  'Fast Delivery in Owerri',
                ],
              }))
            );
          }
        }
      } catch {
        // Fallback to defaults on error
      }
    };

    fetchProducts();
  }, []);

  return (
    <section id="products" className="py-24 bg-gradient-to-b from-brand-50/30 to-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block bg-brand-50 text-brand-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Our Product Catalogue
          </span>
          <h2 className="font-display font-bold text-slate-900 text-4xl md:text-5xl mb-4 leading-tight">
            Choose Your <span className="text-brand-600">Water</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Whether you need sachets for everyday use or bottles for your household, we have exactly what you need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {productList.map((p, idx) => {
            const isBottle = p.id.includes('bottle');
            const icon = isBottle ? Package : Droplets;
            const IconComponent = icon;
            const gradient = isBottle ? 'from-sky-500 to-brand-600' : 'from-brand-500 to-brand-700';

            return (
              <div
                key={p.id || idx}
                className="relative bg-white rounded-3xl overflow-hidden shadow-xl shadow-blue-100/40 border border-slate-100 hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className={`bg-gradient-to-br ${gradient} p-8 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-8 translate-x-8" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/10 translate-y-6 -translate-x-4" />

                  <div className="flex items-center justify-between mb-4">
                    {p.badge && (
                      <span className="relative inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                        {p.badge}
                      </span>
                    )}
                    <span
                      className={`relative inline-block text-xs font-bold px-3 py-1 rounded-full ${
                        p.in_stock ? 'bg-emerald-500/80 text-white' : 'bg-red-500/80 text-white'
                      }`}
                    >
                      {p.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  <div className="relative flex items-center gap-3 mb-2">
                    <IconComponent className="w-8 h-8" />
                    <h3 className="font-display font-bold text-2xl">{p.name}</h3>
                  </div>
                  <p className="relative text-white/80 text-sm">{p.volume}</p>
                </div>

                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">{p.description}</p>

                    {p.price && (
                      <div className="mb-6 p-4 rounded-xl bg-brand-50 border border-brand-100">
                        <p className="text-2xl font-display font-bold text-brand-700">{p.price}</p>
                        <p className="text-xs text-slate-500 mt-1">{p.unit}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{p.min_order}</p>
                      </div>
                    )}

                    <ul className="space-y-2 mb-8">
                      {p.features?.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-700 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href="#order"
                    className={`block w-full text-center bg-gradient-to-r ${gradient} text-white font-bold py-3.5 rounded-xl transition-all duration-200 hover:opacity-90 hover:shadow-lg`}
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
            Bulk orders welcome for events, offices & businesses across Owerri.{' '}
            <a href="tel:09011236098" className="text-brand-600 font-semibold hover:underline">
              Call us to discuss custom pricing.
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}