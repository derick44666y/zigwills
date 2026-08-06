import { Shield, Droplets, Truck, Star } from 'lucide-react';

const values = [
  {
    icon: Droplets,
    title: 'Purified Water',
    description:
      'Every drop goes through a rigorous purification process, ensuring nothing but the cleanest water reaches you.',
    color: 'bg-brand-100 text-brand-600',
  },
  {
    icon: Shield,
    title: 'Safe & Certified',
    description:
      'Our water meets quality and safety standards so you drink with complete confidence and peace of mind.',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description:
      'Order today and we bring it straight to your door. Quick, reliable delivery across Nkwo Orji and surrounding areas.',
    color: 'bg-sky-100 text-sky-600',
  },
  {
    icon: Star,
    title: 'Trusted by Families',
    description:
      'Hundreds of households and businesses rely on Zigwills every day for their clean water needs.',
    color: 'bg-amber-100 text-amber-600',
  },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block bg-brand-50 text-brand-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            About Us
          </span>
          <h2 className="font-display font-bold text-slate-900 text-4xl md:text-5xl mb-4 leading-tight">
            Why Choose <span className="text-brand-600">Zigwills?</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            We are a local table water company committed to providing safe, affordable, and refreshing water to every household and business in our community.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <div
              key={v.title}
              className="group p-6 rounded-2xl border border-slate-100 hover:border-brand-200 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300 hover:-translate-y-1 bg-white"
            >
              <div className={`inline-flex p-3 rounded-xl ${v.color} mb-4`}>
                <v.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-slate-800 text-lg mb-2">{v.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>

        {/* Story strip */}
        <div className="mt-20 rounded-3xl overflow-hidden bg-gradient-to-r from-brand-700 to-brand-500 p-px">
          <div className="bg-white rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <h3 className="font-display font-bold text-slate-900 text-3xl md:text-4xl mb-4 leading-tight">
                Clean Water Is Not a Luxury —{' '}
                <span className="text-brand-600">It Is a Right.</span>
              </h3>
              <p className="text-slate-500 leading-relaxed mb-4">
                Zigwills Table Water was founded with a simple mission: make pure, safe drinking water accessible and affordable for every home and business. Located at km 1, Nkwo Orji Orie Mbieri Road, we serve our community with pride.
              </p>
              <p className="text-slate-500 leading-relaxed">
                Our sachets and bottles are produced under clean conditions, sealed for freshness, and delivered with a smile. When you choose Zigwills, you choose health for your family.
              </p>
            </div>
            <div className="flex-shrink-0 text-center">
              <div className="w-36 h-36 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex flex-col items-center justify-center shadow-lg">
                <span className="font-display font-black text-brand-700 text-4xl">100%</span>
                <span className="text-brand-500 text-sm font-semibold">Pure Water</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
