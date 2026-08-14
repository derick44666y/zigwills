import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'How do I order Zigwills table water?',
    answer:
      'You can order in 3 easy ways: (1) Fill the order form on this website, (2) Click the green WhatsApp button and send us a message, or (3) Call us directly on 09011236098. We respond within minutes!',
  },
  {
    question: 'Do you deliver to my area in Owerri?',
    answer:
      'Yes! We deliver across Owerri and surrounding areas including Umuguma, Nkwo Orji, Port Harcourt Road, Aladinma, New Owerri, Works Layout, and more. Call us to confirm delivery to your exact location.',
  },
  {
    question: 'What is the price of your table water?',
    answer:
      'Our sachet water starts from ₦100 per bag (20 sachets). Bottled water (75cl) starts from ₦1,500 per carton (12 bottles). We offer wholesale and bulk pricing for large orders — call us for custom quotes.',
  },
  {
    question: 'Is your water NAFDAC approved?',
    answer:
      'Yes! Zigwills Table Water is NAFDAC approved and produced under strict hygienic conditions. Every batch is purified and sealed to ensure clean, safe drinking water for your family.',
  },
  {
    question: 'Do you supply water for events and weddings?',
    answer:
      'Absolutely! We supply bulk table water for weddings, parties, church events, corporate events, and large gatherings across Owerri and Imo State. Contact us early for event orders to ensure availability.',
  },
  {
    question: 'Can I become a distributor or dealer for Zigwills?',
    answer:
      'Yes! We welcome serious distributors and dealers in Owerri and Imo State. Call us on 09011236098 to discuss our dealership packages and direct factory pricing for resellers.',
  },
  {
    question: 'What is the minimum order quantity?',
    answer:
      'For sachet water, the minimum order is 1 bag (20 sachets). For bottled water, the minimum is 1 carton (12 bottles). Bulk orders of 10+ bags or 10+ cartons qualify for special pricing.',
  },
  {
    question: 'How quickly do you deliver?',
    answer:
      'We offer same-day delivery within Owerri for orders placed before 3pm. Deliveries are made Monday to Saturday, 7am – 7pm. For urgent orders, call us directly and we will do our best.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="faq" className="py-20 bg-slate-50">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block bg-brand-50 text-brand-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            FAQ
          </span>
          <h2 className="font-display font-bold text-slate-900 text-4xl md:text-5xl mb-4 leading-tight">
            Frequently Asked <span className="text-brand-600">Questions</span>
          </h2>
          <p className="text-slate-500 text-lg">
            Everything you need to know about ordering Zigwills Table Water in Owerri.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                aria-expanded={openIndex === i}
              >
                <span className="font-semibold text-slate-800 text-base leading-snug">
                  {faq.question}
                </span>
                {openIndex === i ? (
                  <ChevronUp className="w-5 h-5 text-brand-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
              </button>

              {openIndex === i && (
                <div className="px-6 pb-5">
                  <div className="h-px bg-slate-100 mb-4" />
                  <p className="text-slate-500 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center p-6 bg-brand-50 rounded-2xl border border-brand-100">
          <p className="text-slate-700 font-semibold mb-2">Still have questions?</p>
          <p className="text-slate-500 text-sm mb-4">
            Call or WhatsApp us and we'll answer right away.
          </p>
          <a
            href="tel:09011236098"
            className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 py-3 rounded-full transition-all hover:shadow-lg text-sm mr-3"
          >
            Call 09011236098
          </a>
          <a
            href="https://wa.me/2349011236098?text=Hello%20Zigwills!%20I%20have%20a%20question."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#25D366] hover:bg-[#20b857] text-white font-bold px-6 py-3 rounded-full transition-all hover:shadow-lg text-sm"
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}
