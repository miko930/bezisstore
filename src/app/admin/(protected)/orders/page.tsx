import { prisma } from '@/lib/prisma';
import OrdersTable from '@/components/admin/OrdersTable';

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { product: { select: { name: true } } },
  });

  // Serialize dates for client component
  const serializedOrders = orders.map((order) => ({
    ...order,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All Orders</h1>
        <p className="text-gray-400 text-sm mt-1">{orders.length} orders total</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <OrdersTable orders={serializedOrders} />
      </div>
    </div>
  );
}
