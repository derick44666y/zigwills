import { useState } from 'react';
import { Droplets, Package, Check, Loader2, AlertCircle, MessageCircle } from 'lucide-react';

interface OrderFormData {
  customer_name: string;
  phone: string;
  address: string;
  product: string;
  quantity: number;
  note?: string;
}

const PRODUCTS = [
  { id: 'sachet', label: 'Table Water Sachet', size: '500ml', unit: 'bags', icon: Droplets },
  { id: 'bottle', label: 'Table Water Bottle', size: '75cl / 1.5L', unit: 'cartons', icon: Package },
];

const WHATSAPP_NUMBER = '2349011236098';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function OrderForm() {
  const [form, setForm] = useState<OrderFormData>({
    customer_name: '',
    phone: '',
    address: '',
    product: 'sachet',
    quantity: 1,
    note: '',
  });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const selectedProduct = PRODUCTS.find((p) => p.id === form.product) || PRODUCTS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    if (!form.customer_name.trim() || !form.phone.trim() || !form.address.trim()) {
      setStatus('error');
      setErrorMsg('Please fill in your name, phone number, and delivery address.');
      return;
    }
    if (form.quantity < 1) {
      setStatus('error');
      setErrorMsg('Quantity must be at least 1.');
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL as string | undefined;

    if (!apiUrl) {
      setStatus('error');
      setErrorMsg('Online ordering is being set up. Please call us to place your order.');
      return;
    }

    try {
      const response = await fetch(`${apiUrl.replace(/\/$/, '')}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.customer_name.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          product: form.product,
          quantity: form.quantity,
          note: form.note?.trim() || null,
        }),
      });

      if (!response.ok) throw new Error('Order request failed');
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong placing your order. Please try again or call us.');
      return;
    }

    setStatus('success');
    setForm({
      customer_name: '',
      phone: '',
      address: '',
      product: 'sachet',
      quantity: 1,
      note: '',
    });
  };

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(
      `Hello Zigwills! I would like to order:\n\n` +
      `Product: ${selectedProduct.label} (${selectedProduct.size})\n` +
      `Quantity: ${form.quantity} ${selectedProduct.unit}\n` +
      `Name: ${form.customer_name}\n` +
      `Phone: ${form.phone}\n` +
      `Address: ${form.address}\n` +
      (form.note ? `Note: ${form.note}\n` : '') +
      `\nPlease confirm my order. Thank you!`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  if (status === 'success') {
    return (
      <section id="order" className="py-24 bg-gradient-to-b from-white to-brand-50/40">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/40 border border-slate-100 p-10 text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="font-display font-bold text-slate-900 text-3xl mb-3">Order Received!</h3>
            <p className="text-slate-500 leading-relaxed mb-8 max-w-md mx-auto">
              Thank you for your order. Our team will call you shortly to confirm your delivery. For urgent orders, call us at{' '}
              <a href="tel:09011236098" className="text-brand-600 font-semibold">09011236098</a>.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-8 py-3.5 rounded-full transition-all hover:shadow-lg"
            >
              Place Another Order
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="order" className="py-24 bg-gradient-to-b from-white to-brand-50/40">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block bg-brand-50 text-brand-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Place Your Order
          </span>
          <h2 className="font-display font-bold text-slate-900 text-4xl md:text-5xl mb-4 leading-tight">
            Order <span className="text-brand-600">Zigwills Water</span> Today
          </h2>
          <p className="text-slate-500 text-lg">
            Fill in your details and we will deliver straight to your doorstep.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl shadow-blue-100/40 border border-slate-100 p-8 md:p-10"
        >
          {status === 'error' && (
            <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={form.customer_name}
                onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="e.g. 09011236098"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Delivery Address
              </label>
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Where should we deliver your water?"
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-slate-800 placeholder:text-slate-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Select Product
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRODUCTS.map((p) => {
                  const selected = form.product === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setForm({ ...form, product: p.id })}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                        selected
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-slate-200 hover:border-brand-300'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${selected ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <p.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{p.label}</p>
                        <p className="text-xs text-slate-400">{p.size}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, quantity: Math.max(1, form.quantity - 1) })}
                  className="w-11 h-11 rounded-xl border border-slate-200 text-slate-600 text-xl font-bold hover:bg-slate-50 transition-all"
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
                  className="w-20 text-center px-3 py-3 rounded-xl border border-slate-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-slate-800 font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, quantity: form.quantity + 1 })}
                  className="w-11 h-11 rounded-xl border border-slate-200 text-slate-600 text-xl font-bold hover:bg-slate-50 transition-all"
                >
                  +
                </button>
                <span className="text-sm text-slate-400 ml-2">{selectedProduct.unit}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Delivery Note <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="Any special instructions? e.g. landmark, delivery time"
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-slate-800 placeholder:text-slate-400 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-gradient-to-r from-brand-500 to-brand-700 text-white font-bold py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-blue-200/50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>

              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-emerald-200/50 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}