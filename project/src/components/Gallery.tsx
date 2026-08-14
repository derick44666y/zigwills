import { useState, useEffect } from 'react';
import { Image as ImageIcon, Users, Truck, Factory, Calendar, Sparkles } from 'lucide-react';

interface GalleryItem {
  id: number;
  title: string;
  category: 'factory' | 'workers' | 'delivery' | 'events';
  image_url: string;
  caption?: string;
  created_at?: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All Photos', icon: ImageIcon },
  { id: 'factory', label: 'Factory & Process', icon: Factory },
  { id: 'workers', label: 'Our Team', icon: Users },
  { id: 'delivery', label: 'Delivery & Cars', icon: Truck },
  { id: 'events', label: 'Events & Hydration', icon: Calendar },
];

const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 1,
    title: 'Hygienic Production Facility',
    category: 'factory',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    caption: 'Automated purification and bottle filling line in Owerri.',
  },
  {
    id: 2,
    title: 'Dedicated Delivery Team',
    category: 'workers',
    image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800',
    caption: 'Our trained staff ensuring quality control and safe packaging.',
  },
  {
    id: 3,
    title: 'Fleet Ready for Dispatch',
    category: 'delivery',
    image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
    caption: 'Fast delivery trucks supplying businesses and residences across Imo State.',
  },
  {
    id: 4,
    title: 'Community Event Hydration',
    category: 'events',
    image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
    caption: 'Official water sponsor for local athletic and cultural gatherings in Owerri.',
  },
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [items, setItems] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGallery = async () => {
      const apiUrl = import.meta.env.VITE_API_URL as string | undefined;
      const baseUrl = apiUrl
        ? apiUrl.replace(/\/$/, '')
        : window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3001'
        : '';
      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}/api/gallery`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setItems(data);
          }
        }
      } catch {
        // Use default gallery on network error
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter((item) => item.category === activeCategory);

  return (
    <section id="gallery" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Inside Zigwills
          </span>
          <h2 className="font-display font-bold text-3xl md:text-5xl mb-4 leading-tight">
            Company Photo <span className="text-brand-400">Gallery</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Take a look behind the scenes — from our clean production facility and hard-working team to our delivery fleet across Owerri.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30 font-semibold scale-105'
                    : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading gallery photos...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative bg-slate-800/60 rounded-2xl overflow-hidden border border-slate-700/60 hover:border-brand-500/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand-500/20"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-950 relative">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-brand-300 text-xs px-2.5 py-1 rounded-md border border-slate-700 font-medium capitalize">
                    {item.category}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-display font-semibold text-lg text-white mb-1.5 group-hover:text-brand-300 transition-colors">
                    {item.title}
                  </h3>
                  {item.caption && (
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                      {item.caption}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
