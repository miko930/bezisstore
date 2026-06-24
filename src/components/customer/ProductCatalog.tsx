'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string;
  inStock: boolean;
}

export default function ProductCatalog({ initialProducts }: { initialProducts: Product[] }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'instock'>('all');

  const filteredProducts = initialProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      (product.description || '').toLowerCase().includes(search.toLowerCase());

    const matchesStock = filter === 'all' || product.inStock;

    return matchesSearch && matchesStock;
  });

  return (
    <div className="space-y-8">
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            placeholder="ምርቶችን ይፈልጉ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <span className="absolute left-3.5 top-3 text-gray-400 text-sm">🔍</span>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl w-full md:w-auto justify-center">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex-1 md:flex-initial ${
              filter === 'all'
                ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
            }`}
          >
            ሁሉም ምርቶች
          </button>
          <button
            onClick={() => setFilter('instock')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex-1 md:flex-initial ${
              filter === 'instock'
                ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
            }`}
          >
            አሉ
          </button>
        </div>
      </div>

      {/* Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white dark:bg-zinc-900 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-zinc-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Product Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-zinc-800">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm backdrop-blur-md ${
                      product.inStock
                        ? 'bg-emerald-500/90 text-white'
                        : 'bg-rose-500/90 text-white'
                    }`}
                  >
                    {product.inStock ? 'አለ' : 'አልቀረ'}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
                  {product.name}
                </h3>
                
                <p className="text-gray-500 dark:text-zinc-400 text-sm mt-1.5 line-clamp-2 flex-grow">
                  {product.description || 'መግለጫ የለም።'}
                </p>

                <div className="mt-4 pt-4 border-t border-gray-50 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 dark:text-zinc-500 uppercase font-semibold tracking-wider">
                      ዋጋ                    </span>
                    <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                      {product.price.toLocaleString()} <span className="text-xs font-bold">ብር</span>
                    </span>
                  </div>

                  {product.inStock ? (
                    <Link
                      href={`/order/${product.id}`}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow-md shadow-blue-100 dark:shadow-none hover:scale-[1.03] active:scale-[0.98] transition-all"
                    >
                      🛒 አሁን እዘዝ
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="bg-gray-150 text-gray-400 font-semibold px-4 py-2.5 rounded-xl text-sm border border-gray-200 cursor-not-allowed"
                    >
                      አልቀረ
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-800">
          <div className="text-5xl mb-4">🛍️</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            ምርት አልተገኘም
          </h3>
          <p className="text-gray-500 dark:text-zinc-400 text-sm mt-1">
            የፈለጉትን ቁልፍ ቀይረው ዳግም ይሞክሩ።
          </p>
        </div>
      )}
    </div>
  );
}
