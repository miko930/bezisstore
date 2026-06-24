interface Stats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  deliveredOrders: number;
}

export default function StatsCards({ stats }: { stats: Stats }) {
  const cards = [
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: '📦',
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Pending',
      value: stats.pendingOrders,
      icon: '⏳',
      gradient: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50',
    },
    {
      label: 'Delivered',
      value: stats.deliveredOrders,
      icon: '✅',
      gradient: 'from-green-500 to-emerald-500',
      bg: 'bg-green-50',
    },
    {
      label: 'Total Revenue',
      value: `${stats.totalRevenue.toLocaleString()} ETB`,
      icon: '💰',
      gradient: 'from-purple-500 to-violet-500',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md group"
        >
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-3 shadow-sm group-hover:scale-110`}>
            <span className="text-xl">{card.icon}</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{card.value}</div>
          <div className="text-sm font-medium mt-1 text-gray-400">{card.label}</div>
        </div>
      ))}
    </div>
  );
}
