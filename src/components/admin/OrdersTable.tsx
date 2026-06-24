'use client';

import { useState } from 'react';
import StatusBadge from './StatusBadge';

const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'PROCESSING', 'DELIVERED', 'CANCELLED'];

interface OrderWithProduct {
  id: string;
  customerName: string;
  customerPhone: string;
  quantity: number;
  totalPrice: number;
  status: string;
  product: { name: string };
}

export default function OrdersTable({ orders }: { orders: OrderWithProduct[] }) {
  const [orderList, setOrderList] = useState(orders);

  async function updateStatus(orderId: string, status: string) {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      setOrderList((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-gray-400">
            <th className="text-left py-3 pr-4 font-medium">Customer</th>
            <th className="text-left py-3 pr-4 font-medium">Product</th>
            <th className="text-left py-3 pr-4 font-medium">Qty</th>
            <th className="text-left py-3 pr-4 font-medium">Total</th>
            <th className="text-left py-3 pr-4 font-medium">Status</th>
            <th className="text-left py-3 font-medium">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {orderList.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50/50">
              <td className="py-3.5 pr-4">
                <div className="font-medium text-gray-900">{order.customerName}</div>
                <div className="text-gray-400 text-xs">{order.customerPhone}</div>
              </td>
              <td className="py-3.5 pr-4 text-gray-700">{order.product.name}</td>
              <td className="py-3.5 pr-4 text-gray-700">{order.quantity}</td>
              <td className="py-3.5 pr-4 font-semibold text-gray-900">
                {order.totalPrice.toLocaleString()} ETB
              </td>
              <td className="py-3.5 pr-4">
                <StatusBadge status={order.status} />
              </td>
              <td className="py-3.5">
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {orderList.length === 0 && (
        <div className="text-center py-16 text-gray-300">
          <div className="text-4xl mb-3">📦</div>
          <p className="font-medium">No orders yet</p>
        </div>
      )}
    </div>
  );
}
