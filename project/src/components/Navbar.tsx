import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const links = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Products', href: '#products' },
  { label: 'Order', href: '#order' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg shadow-blue-100/60' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <a href="#home" className="flex items-center">
          <div className={`rounded-xl overflow-hidden transition-all duration-300 ${
            scrolled ? 'bg-white shadow-sm' : 'bg-white/95'
          }`}>
            <img
              src="/images/zigwills-logo.png"
              alt="Zigwills Table Water"
              className="h-10 w-auto object-contain"
            />
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors duration-200 ${
                scrolled
                  ? 'text-slate-600 hover:text-brand-600'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#order"
            className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-5 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-brand-300/50"
          >
            Order Now
          </a>
        </nav>

        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? (
            <X className={`w-6 h-6 ${scrolled ? 'text-brand-800' : 'text-white'}`} />
          ) : (
            <Menu className={`w-6 h-6 ${scrolled ? 'text-brand-800' : 'text-white'}`} />
          )}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white shadow-xl border-t border-blue-50">
          <nav className="flex flex-col px-6 py-4 gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-slate-700 font-medium hover:text-brand-600 transition-colors"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#order"
              onClick={() => setOpen(false)}
              className="bg-brand-500 text-white text-center font-semibold py-3 rounded-full transition-all hover:bg-brand-600"
            >
              Order Now
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
