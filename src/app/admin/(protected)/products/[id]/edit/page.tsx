import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditProductForm from '@/components/admin/EditProductForm';
import Link from 'next/link';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-zinc-500 font-medium">
        <Link href="/admin/products" className="hover:text-blue-500 transition-colors">
          Products
        </Link>
        <span>/</span>
        <span className="text-gray-600 dark:text-zinc-300">Edit Product</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Product</h1>
          <p className="text-gray-500 text-sm mt-1">Modify product info or manage inventory status</p>
        </div>
      </div>

      <EditProductForm product={product} />
    </div>
  );
}
