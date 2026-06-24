'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  price: number;
}

export default function OrderForm({ product }: { product: Product }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    quantity: 1,
    note: '',
  });

  const total = product.price * form.quantity;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          ...form,
          totalPrice: total,
        }),
      });

      if (!res.ok) throw new Error('Order failed');

      router.push('/order-success');
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          required
          value={form.customerName}
          onChange={(e) => setForm({ ...form, customerName: e.target.value })}
          placeholder="Abebe Kebede"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number *
        </label>
        <input
          type="tel"
          required
          value={form.customerPhone}
          onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
          placeholder="+251 9XX XXX XXX"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Delivery Address *
        </label>
        <textarea
          required
          value={form.customerAddress}
          onChange={(e) => setForm({ ...form, customerAddress: e.target.value })}
          placeholder="Bole, Addis Ababa — near Edna Mall"
          rows={2}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quantity
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setForm({ ...form, quantity: Math.max(1, form.quantity - 1) })}
            className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 hover:border-green-500 hover:text-green-600 active:scale-95"
          >
            −
          </button>
          <span className="text-lg font-semibold w-8 text-center">{form.quantity}</span>
          <button
            type="button"
            onClick={() => setForm({ ...form, quantity: form.quantity + 1 })}
            className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 hover:border-green-500 hover:text-green-600 active:scale-95"
          >
            +
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Note (optional)
        </label>
        <input
          type="text"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          placeholder="Any special instructions..."
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
        />
      </div>

      {/* Total */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 flex justify-between items-center border border-green-100">
        <span className="text-gray-600 font-medium">Total</span>
        <span className="text-green-700 font-bold text-xl">
          {total.toLocaleString()} ETB
        </span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-green-200 active:scale-[0.98]"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Placing Order...
          </span>
        ) : (
          '🛒 Place Order'
        )}
      </button>
    </form>
  );
}
