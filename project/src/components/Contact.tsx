import { Phone, MapPin, Clock, Droplets, MessageCircle, Navigation } from 'lucide-react';

const WHATSAPP_NUMBER = '2349011236098';
const GOOGLE_MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('km 1, Nkwo Orji Orie Mbieri Road, Imo State, Nigeria');

const items = [
  {
    icon: Phone,
    title: 'Call Us',
    value: '09011236098',
    href: 'tel:09011236098',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    value: '09011236098',
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    value: 'km 1, Nkwo Orji Orie Mbieri Road',
    href: GOOGLE_MAPS_URL,
  },
  {
    icon: Clock,
    title: 'Working Hours',
    value: 'Mon - Sat: 7am - 7pm',
  },
];

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-slate-900 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-brand-700/30 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-block bg-brand-500/20 text-brand-200 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Get In Touch
          </span>
          <h2 className="font-display font-bold text-white text-4xl md:text-5xl mb-4 leading-tight">
            We're Here to <span className="text-brand-300">Serve You</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Have questions or need a bulk order? Reach out — we respond quickly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {items.map((item) => (
            <div
              key={item.title}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-7 text-center hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="inline-flex p-3 rounded-xl bg-brand-500/20 text-brand-300 mb-4">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-white font-semibold mb-1">{item.title}</h3>
              {item.href ? (
                <a
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-slate-300 hover:text-brand-300 transition-colors text-sm inline-flex items-center gap-1"
                >
                  {item.value}
                  {item.title === 'Visit Us' && <Navigation className="w-3 h-3" />}
                </a>
              ) : (
                <p className="text-slate-300 text-sm">{item.value}</p>
              )}
            </div>
          ))}
        </div>

        {/* CTA banner */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-400 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <Droplets className="w-12 h-12 text-white flex-shrink-0" />
            <div>
              <h3 className="font-display font-bold text-white text-2xl md:text-3xl mb-1">
                Thirsty? Let's fix that.
              </h3>
              <p className="text-white/80">Order now and get fresh water delivered to your door.</p>
            </div>
          </div>
          <a
            href="tel:09011236098"
            className="bg-white text-brand-700 font-bold px-8 py-4 rounded-full whitespace-nowrap hover:bg-brand-50 transition-all hover:shadow-xl flex-shrink-0"
          >
            Call to Order
          </a>
        </div>
      </div>
    </section>
  );
}