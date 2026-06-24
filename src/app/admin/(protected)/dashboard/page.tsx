import { prisma } from '@/lib/prisma';
import StatsCards from '@/components/admin/StatsCards';
import OrdersTable from '@/components/admin/OrdersTable';

export default async function DashboardPage() {
  const [totalOrders, pendingOrders, totalRevenue, recentOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.aggregate({
        _sum: { totalPrice: true },
        where: { status: { not: 'CANCELLED' } },
      }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { product: { select: { name: true } } },
      }),
    ]);

  const stats = {
    totalOrders,
    pendingOrders,
    totalRevenue: totalRevenue._sum.totalPrice ?? 0,
    deliveredOrders: await prisma.order.count({ where: { status: 'DELIVERED' } }),
  };

  // Serialize dates for client component
  const serializedOrders = recentOrders.map((order) => ({
    ...order,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Welcome back, Admin 👋</p>
      </div>

      <StatsCards stats={stats} />

      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <OrdersTable orders={serializedOrders} />
      </div>
    </div>
  );
}
