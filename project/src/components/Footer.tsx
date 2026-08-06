import { Droplets } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-brand-600">
              <Droplets className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-white">Zigwills</span>
            <span className="text-sm text-slate-500 ml-1">Table Water</span>
          </div>
          <p className="text-sm text-center">
            © {new Date().getFullYear()} Zigwills Table Water. Pure. Safe. Refreshing.
          </p>
          <div className="flex gap-4 text-sm">
            <a href="#home" className="hover:text-white transition-colors">Home</a>
            <a href="#products" className="hover:text-white transition-colors">Products</a>
            <a href="#order" className="hover:text-white transition-colors">Order</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
