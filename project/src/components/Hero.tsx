import { ChevronDown, Phone, MapPin } from 'lucide-react';

export default function Hero() {
  return (
    <section
      id="home"
      className="hero-gradient relative overflow-hidden min-h-screen flex items-center"
    >
      {/* Water bubble decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-8 w-4 h-4 rounded-full bg-white/10 animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 left-24 w-6 h-6 rounded-full bg-white/10 animate-float" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-60 right-16 w-5 h-5 rounded-full bg-white/15 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-32 right-40 w-3 h-3 rounded-full bg-white/20 animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-40 left-16 w-8 h-8 rounded-full bg-white/10 animate-float" style={{ animationDelay: '0.8s' }} />
        <div className="absolute bottom-60 right-24 w-4 h-4 rounded-full bg-white/15 animate-float" style={{ animationDelay: '0.3s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-brand-400/20 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 flex flex-col md:flex-row items-center gap-12 w-full">
        {/* Text */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="font-display font-black text-white text-5xl md:text-6xl lg:text-7xl leading-tight mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Pure.<br />
            <span className="text-brand-200">Safe.</span><br />
            Refreshing.
          </h1>

          <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-8 max-w-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Zigwills Table Water brings clean, safe drinking water straight to your home or business. Quality you can taste in every drop.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <a
              href="#products"
              className="bg-white text-brand-700 font-bold px-8 py-4 rounded-full text-base shadow-xl hover:shadow-2xl hover:bg-brand-50 transition-all duration-300 hover:-translate-y-0.5"
            >
              See Products
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-10 text-white/70 text-sm justify-center md:justify-start animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <span className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-200" />
              09011236098
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-200" />
              km 1, Nkwo Orji Orie Mbieri Road
            </span>
          </div>
        </div>

        {/* Logo */}
        <div className="flex-1 flex justify-center items-center">
          <div className="relative animate-float" style={{ animationDuration: '5s' }}>
            <div className="absolute inset-0 rounded-full bg-white/20 blur-3xl scale-125" />
            <img
              src="/images/zigwills-logo.png"
              alt="Zigwills Table Water logo"
              className="relative w-56 md:w-72 max-w-full object-contain drop-shadow-water"
            />
          </div>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown className="w-7 h-7" />
      </a>
    </section>
  );
}
