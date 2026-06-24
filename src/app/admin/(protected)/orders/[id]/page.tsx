import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import StatusBadge from '@/components/admin/StatusBadge';
import OrderStatusUpdater from '@/components/admin/OrderStatusUpdater';
import Link from 'next/link';

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { product: true },
  });

  if (!order) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/dashboard"
          className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
        >
          ←
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Order Details</h1>
          <p className="text-gray-400 text-sm font-mono mt-1">{order.id}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Product Info */}
      <div className="bg-white rounded-2xl shadow-sm p-6 flex gap-4 border border-gray-100">
        <img
          src={order.product.imageUrl}
          alt={order.product.name}
          className="w-20 h-20 rounded-xl object-cover"
        />
        <div>
          <h2 className="font-semibold text-lg">{order.product.name}</h2>
          <p className="text-gray-500 text-sm">{order.product.description}</p>
          <p className="text-green-600 font-bold mt-1">
            {order.product.price.toLocaleString()} ETB × {order.quantity} ={' '}
            <span className="text-lg">{order.totalPrice.toLocaleString()} ETB</span>
          </p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h3 className="font-semibold mb-4">Customer Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Name</p>
            <p className="font-medium">{order.customerName}</p>
          </div>
          <div>
            <p className="text-gray-400">Phone</p>
            <p className="font-medium">{order.customerPhone}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-400">Address</p>
            <p className="font-medium">{order.customerAddress}</p>
          </div>
          {order.note && (
            <div className="col-span-2">
              <p className="text-gray-400">Note</p>
              <p className="font-medium">{order.note}</p>
            </div>
          )}
          <div>
            <p className="text-gray-400">Ordered At</p>
            <p className="font-medium">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Status Updater */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h3 className="font-semibold mb-4">Update Status</h3>
        <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
      </div>
    </div>
  );
}
