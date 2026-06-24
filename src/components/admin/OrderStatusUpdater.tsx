'use client';

import { useState } from 'react';

const STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'DELIVERED', 'CANCELLED'];

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:    { label: '⏳ Pending',    color: 'bg-amber-100 text-amber-800 border-amber-300' },
  CONFIRMED:  { label: '✅ Confirmed',  color: 'bg-blue-100 text-blue-800 border-blue-300' },
  PROCESSING: { label: '⚙️ Processing', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  DELIVERED:  { label: '🎉 Delivered',  color: 'bg-green-100 text-green-800 border-green-300' },
  CANCELLED:  { label: '❌ Cancelled',  color: 'bg-red-100 text-red-800 border-red-300' },
};

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleUpdate() {
    setLoading(true);
    await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => {
          const { label, color } = STATUS_LABELS[s];
          return (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border-2 active:scale-95 ${
                status === s ? color : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-300'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleUpdate}
        disabled={loading || status === currentStatus}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl shadow-sm active:scale-[0.98]"
      >
        {loading ? 'Saving...' : saved ? '✅ Saved!' : 'Update Status'}
      </button>
    </div>
  );
}
