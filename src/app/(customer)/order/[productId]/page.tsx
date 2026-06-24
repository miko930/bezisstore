import { ClipboardList, ShoppingBag } from 'lucide-react';
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
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 border border-emerald-100">
          <div className="relative aspect-[4/3] bg-emerald-55 flex items-center justify-center">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const fallback = parent.querySelector('.image-fallback');
                    if (fallback) fallback.classList.remove('hidden');
                  }
                }}
              />
            ) : null}
            <div className={`image-fallback flex flex-col items-center justify-center p-6 text-zinc-400 w-full h-full ${product.imageUrl ? 'hidden absolute inset-0' : ''}`}>
              <ShoppingBag className="w-12 h-12 mb-2 stroke-[1.5] text-emerald-600" />
              <span className="text-xs font-bold text-zinc-400">ምስል የለም</span>
            </div>
            <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
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
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-zinc-800">
            <span className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <ClipboardList className="w-4 h-4" />
            </span>
            የእርስዎ መፈላጊ (መረጃ)
          </h2>
          <OrderForm product={{ id: product.id, name: product.name, price: product.price }} />
        </div>
      </div>
    </main>
  );
}
