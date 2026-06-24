'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string;
  inStock: boolean;
}

export default function EditProductForm({ product }: { product: Product }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: product.name,
    description: product.description || '',
    price: String(product.price),
    imageUrl: product.imageUrl,
    inStock: product.inStock,
  });
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          imageUrl: form.imageUrl,
          inStock: form.inStock,
        }),
      });

      if (!res.ok) throw new Error('Failed to update product');
      
      router.push('/admin/products');
      router.refresh();
    } catch {
      alert('Failed to update product');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete product');

      router.push('/admin/products');
      router.refresh();
    } catch {
      alert('Failed to delete product');
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-150 dark:border-zinc-800 overflow-hidden">
      <div className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-850 pb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Product Details</h2>
            <p className="text-gray-400 text-xs mt-1 font-mono">Product ID: {product.id}</p>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="text-xs bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:hover:bg-red-950/40 dark:text-red-400 font-semibold px-4 py-2 rounded-xl border border-red-100 dark:border-red-900/30 transition-all cursor-pointer"
          >
            {deleting ? 'Deleting...' : '🗑️ Delete Product'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-zinc-400 mb-1.5">
                  Product Name *
                </label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g. iPhone 15 Pro Max"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-zinc-400 mb-1.5">
                  Price (ETB) *
                </label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-zinc-400 mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Add product specifications, warranty info..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-zinc-400 mb-1.5">
                  Image URL *
                </label>
                <input
                  required
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-zinc-400 mb-1.5">
                  Preview Image
                </label>
                <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-800 flex items-center justify-center relative">
                  {form.imageUrl ? (
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60';
                      }}
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">Preview placeholder</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-zinc-850 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <label className="flex items-center gap-3 cursor-pointer self-start sm:self-center">
              <input
                type="checkbox"
                checked={form.inStock}
                onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                className="w-5 h-5 rounded-lg border-gray-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500 bg-gray-50 dark:bg-zinc-800 transition-all"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800 dark:text-zinc-200">Product In Stock</span>
                <span className="text-xs text-gray-450 dark:text-zinc-400">Enable this to allow users to order this product</span>
              </div>
            </label>

            <div className="flex w-full sm:w-auto gap-3">
              <Link
                href="/admin/products"
                className="flex-1 sm:flex-none text-center bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 font-semibold px-6 py-3 rounded-xl text-sm transition-all"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8 py-3 rounded-xl text-sm shadow-md shadow-blue-100 dark:shadow-none transition-all active:scale-[0.98]"
              >
                {loading ? 'Saving...' : '💾 Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
