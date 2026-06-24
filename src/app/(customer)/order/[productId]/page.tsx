import { ClipboardList } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import OrderForm from '@/components/customer/OrderForm';

export default async function OrderPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product || !product.inStock) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Product Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 border border-gray-100">
          <div className="relative">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-56 object-cover"
            />
            <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              አለ
            </div>
          </div>
          <div className="p-5">
            <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
            {product.description && (
              <p className="text-gray-500 text-sm mt-1">{product.description}</p>
            )}
            <p className="text-2xl font-bold text-green-600 mt-3">
              {product.price.toLocaleString()} ብር
            </p>
          </div>
        </div>

        {/* Order Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-indigo-50 text-indigo-650 rounded-xl flex items-center justify-center">
              <ClipboardList className="w-4 h-4" />
            </span>
            የእርስዎ መረጃ
          </h2>
          <OrderForm product={{ id: product.id, name: product.name, price: product.price }} />
        </div>
      </div>
    </main>
  );
}
