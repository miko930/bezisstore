'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
  });
  const [postToTelegram, setPostToTelegram] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create product
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: parseFloat(form.price) }),
      });
      const product = await res.json();

      // 2. Optionally post to Telegram channel
      if (postToTelegram) {
        await fetch('/api/bot/post-product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id }),
        });
      }

      router.push('/admin/products');
    } catch {
      alert('Failed to create product');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border border-gray-100">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Product Name *</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Ethiopian Coffee Beans"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            placeholder="Describe your product..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Price (ETB) *</label>
          <input
            required
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="0.00"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Image URL *</label>
          <input
            required
            type="url"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="https://..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
          />
        </div>

        {form.imageUrl && (
          <div className="rounded-xl overflow-hidden border border-gray-200">
            <img
              src={form.imageUrl}
              alt="Preview"
              className="w-full h-44 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        <label className="flex items-center gap-3 cursor-pointer bg-blue-50 rounded-xl p-3 border border-blue-100">
          <input
            type="checkbox"
            checked={postToTelegram}
            onChange={(e) => setPostToTelegram(e.target.checked)}
            className="w-4 h-4 rounded accent-blue-600"
          />
          <div>
            <span className="text-sm font-medium text-blue-800">📢 Post to Telegram channel</span>
            <p className="text-xs text-blue-600 mt-0.5">Product will appear in your channel immediately</p>
          </div>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl shadow-lg active:scale-[0.98]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating...
            </span>
          ) : (
            '✅ Create Product'
          )}
        </button>
      </form>
    </div>
  );
}
