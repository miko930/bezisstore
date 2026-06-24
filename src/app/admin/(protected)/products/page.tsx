import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import PostToTelegramButton from '@/components/admin/PostToTelegramButton';

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-gray-400 text-sm mt-1">{products.length} products total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-sm active:scale-[0.98]"
        >
          + Add Product
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md group">
            <div className="relative overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-44 object-cover group-hover:scale-105"
              />
              <div className="absolute top-3 right-3">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold shadow-sm ${
                    product.inStock
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h2 className="font-semibold text-gray-900">{product.name}</h2>
              <p className="text-green-600 font-bold mt-1">
                {product.price.toLocaleString()} ETB
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-400">
                  {product._count.orders} orders
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="flex-1 text-center text-sm border border-gray-200 rounded-xl py-2 hover:bg-gray-50 font-medium text-gray-600"
                >
                  Edit
                </Link>
                <PostToTelegramButton
                  productId={product.id}
                  posted={!!product.telegramMessageId}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-20 text-gray-300">
          <div className="text-5xl mb-4">🛍️</div>
          <p className="font-medium text-lg">No products yet</p>
          <Link href="/admin/products/new" className="text-blue-600 underline text-sm mt-2 inline-block">
            Add your first product
          </Link>
        </div>
      )}
    </div>
  );
}
