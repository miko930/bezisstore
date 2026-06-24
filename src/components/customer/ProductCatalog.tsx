'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, ShoppingBag, AlertCircle } from 'lucide-react';
import ProductImage from '@/components/customer/ProductImage';

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
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-emerald-100/80 dark:border-zinc-800/80 shadow-sm">
        {/* Search Input */}
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            placeholder="ምርቶችን ይፈልጉ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-emerald-50/50 dark:bg-zinc-800/50 border border-emerald-200/60 dark:border-zinc-700/80 rounded-2xl px-4 py-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-accent focus:border-transparent transition-all dark:text-zinc-100"
          />
          <Search className="absolute left-3.5 top-3.5 text-emerald-400 dark:text-zinc-400 w-4 h-4" />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-emerald-50/50 dark:bg-zinc-800 p-1.5 rounded-2xl w-full md:w-auto justify-center border border-emerald-100 dark:border-zinc-800">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex-1 md:flex-initial cursor-pointer ${
              filter === 'all'
                ? 'bg-emerald-accent text-white shadow-sm font-extrabold'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-350'
            }`}
          >
            ሁሉም ምርቶች
          </button>
          <button
            onClick={() => setFilter('instock')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex-1 md:flex-initial cursor-pointer ${
              filter === 'instock'
                ? 'bg-emerald-accent text-white shadow-sm font-extrabold'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-350'
            }`}
          >
            አሉ
          </button>
        </div>
      </div>

      {/* Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-emerald-100/60 dark:border-zinc-800/80 hover:shadow-2xl hover:shadow-emerald-100/60 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Product Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-emerald-50/50 dark:bg-zinc-850 flex items-center justify-center">
                <ProductImage src={product.imageUrl} name={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                <div className="absolute top-3 right-3">
                  <span
                    className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-md ${
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
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-extrabold text-zinc-900 dark:text-white text-lg group-hover:text-emerald-accent-dark transition-colors line-clamp-1">
                  {product.name}
                </h3>
                
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2 line-clamp-2 flex-grow font-medium">
                  {product.description || 'መግለጫ የለም።'}
                </p>

                <div className="mt-5 pt-4 border-t border-emerald-50 dark:border-zinc-800/50 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-555 uppercase font-bold tracking-wider">
                      ዋጋ
                    </span>
                    <span className="text-xl font-black text-emerald-accent-dark dark:text-emerald-glow">
                      {product.price.toLocaleString()} <span className="text-xs font-bold text-emerald-accent dark:text-emerald-accent-light">ብር</span>
                    </span>
                  </div>

                  {product.inStock ? (
                    <Link
                      href={`/order/${product.id}`}
                      className="bg-gradient-to-r from-emerald-accent to-emerald-accent-dark hover:from-emerald-accent-dark hover:to-emerald-deep text-white font-bold px-5 py-3 rounded-2xl text-xs shadow-md shadow-emerald-200/50 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-1.5"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>አሁን እዘዝ</span>
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="bg-zinc-100 text-zinc-450 dark:bg-zinc-800 dark:text-zinc-500 font-bold px-5 py-3 rounded-2xl text-xs border border-zinc-200/30 cursor-not-allowed flex items-center gap-1.5"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>አልቀረ</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-emerald-50/50 dark:bg-zinc-900/40 rounded-3xl border border-dashed border-emerald-200 dark:border-zinc-800 max-w-lg mx-auto">
          <ShoppingBag className="w-12 h-12 text-emerald-300 dark:text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
            ምርት አልተገኘም
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1.5 font-medium">
            የፈለጉትን ቁልፍ ቀይረው ዳግም ይሞክሩ።
          </p>
        </div>
      )}
    </div>
  );
}
