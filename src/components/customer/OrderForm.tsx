'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  price: number;
}

export default function OrderForm({ product }: { product: Product }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'telebirr' | 'cbe'>('telebirr');
  const [txnId, setTxnId] = useState('');
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    quantity: 1,
    note: '',
  });

  const total = product.price * form.quantity;
  const deposit = total * 0.10;
  const remaining = total - deposit;

  // Customizable payment details (fallbacks if env vars are not set)
  const telebirrAccount = process.env.NEXT_PUBLIC_TELEBIRR_ACCOUNT || '0911215530';
  const telebirrName = process.env.NEXT_PUBLIC_TELEBIRR_NAME || "Bezi's Store";
  const cbeAccount = process.env.NEXT_PUBLIC_CBE_ACCOUNT || '1000123456789';
  const cbeName = process.env.NEXT_PUBLIC_CBE_NAME || "Bezi's Store";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Embed the payment transaction reference into the note field for DB and Telegram notifications
    const paymentInfo = [
      `💳 ክፍያ: ${paymentMethod === 'telebirr' ? 'Telebirr' : 'CBE'}`,
      `🔑 የግብይት መለያ (Txn ID): ${txnId}`,
      form.note ? `📝 ማስታወሻ: ${form.note}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          ...form,
          note: paymentInfo,
          totalPrice: total,
        }),
      });

      if (!res.ok) throw new Error('Order failed');

      router.push('/order-success');
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ሙሉ ስም *
        </label>
        <input
          type="text"
          required
          value={form.customerName}
          onChange={(e) => setForm({ ...form, customerName: e.target.value })}
          placeholder="Abebe Kebede"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ስልክ ቁጥር *
        </label>
        <input
          type="tel"
          required
          value={form.customerPhone}
          onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
          placeholder="+251 9XX XXX XXX"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          የመላኪያ አድራሻ *
        </label>
        <textarea
          required
          value={form.customerAddress}
          onChange={(e) => setForm({ ...form, customerAddress: e.target.value })}
          placeholder="Bole, Addis Ababa — near Edna Mall"
          rows={2}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ብዛት
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setForm({ ...form, quantity: Math.max(1, form.quantity - 1) })}
            className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 hover:border-green-500 hover:text-green-600 active:scale-95"
          >
            −
          </button>
          <span className="text-lg font-semibold w-8 text-center">{form.quantity}</span>
          <button
            type="button"
            onClick={() => setForm({ ...form, quantity: form.quantity + 1 })}
            className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 hover:border-green-500 hover:text-green-600 active:scale-95"
          >
            +
          </button>
        </div>
      </div>

      {/* Dynamic 10% Deposit Instruction Box */}
      <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 space-y-4">
        <div className="flex items-start gap-2.5">
          <span className="text-amber-600 text-xl">⚠️</span>
          <div>
            <h3 className="text-sm font-bold text-amber-800">ትዕዛዝዎን ለማረጋገጥ የ 10% ቅድመ ክፍያ መፈጸም ይኖርብዎታል</h3>
            <p className="text-xs text-amber-600 mt-1">ትዕዛዝዎ ከመላኩ በፊት እባክዎ ተገቢውን ክፍያ ይፈጽሙ።</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 border border-amber-200/60 divide-y divide-gray-100 text-xs">
          <div className="flex justify-between py-1.5 text-gray-600">
            <span>ጠቅላላ ዋጋ:</span>
            <span>{total.toLocaleString()} ብር</span>
          </div>
          <div className="flex justify-between py-1.5 font-bold text-amber-700">
            <span>ቅድመ ክፍያ (10%):</span>
            <span>{deposit.toLocaleString()} ብር</span>
          </div>
          <div className="flex justify-between py-1.5 text-gray-600">
            <span>ቀሪ ክፍያ (በእጅ ሲረከቡ):</span>
            <span>{remaining.toLocaleString()} ብር</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-700">ክፍያ የሚፈጽሙበትን መለያ ይምረጡ:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('telebirr')}
              className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                paymentMethod === 'telebirr'
                  ? 'border-green-600 bg-green-50 text-green-700 shadow-sm'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              📱 Telebirr
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('cbe')}
              className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                paymentMethod === 'cbe'
                  ? 'border-green-600 bg-green-50 text-green-700 shadow-sm'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              🏦 CBE Birr
            </button>
          </div>
        </div>

        {/* Selected Account Info */}
        <div className="bg-amber-100/50 rounded-xl p-3.5 border border-amber-200/30 text-xs space-y-1.5">
          {paymentMethod === 'telebirr' ? (
            <>
              <div className="flex justify-between">
                <span className="text-gray-500">የአካውንት ስም:</span>
                <span className="font-bold text-gray-800">{telebirrName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">የቴሌብር ስልክ ቁጥር:</span>
                <span className="font-bold text-green-700 text-sm select-all">{telebirrAccount}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <span className="text-gray-500">የአካውንት ስም:</span>
                <span className="font-bold text-gray-800">{cbeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">የሲቢኢ (CBE) አካውንት ቁጥር:</span>
                <span className="font-bold text-green-700 text-sm select-all">{cbeAccount}</span>
              </div>
            </>
          )}
        </div>

        {/* Transaction ID Input */}
        <div>
          <label className="block text-xs font-bold text-amber-900 mb-1">
            የክፍያ ማረጋገጫ ቁጥር (Txn ID / Ref Number) *
          </label>
          <input
            type="text"
            required
            value={txnId}
            onChange={(e) => setTxnId(e.target.value)}
            placeholder="e.g. TF24XXXXXXXX or 1000XXXXXXXX"
            className="w-full border border-amber-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ማስታወሻ (አማራጭ)
        </label>
        <input
          type="text"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          placeholder="ልዩ መመሪያ ካለ ይጻፉ..."
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
        />
      </div>

      {/* Total */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 flex justify-between items-center border border-green-100">
        <span className="text-gray-600 font-medium">ጠቅላላ</span>
        <span className="text-green-700 font-bold text-xl">
          {total.toLocaleString()} ብር
        </span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-green-200 active:scale-[0.98]"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Placing Order...
          </span>
        ) : (
          '🛒 ትዕዛዝ ያስገቡ'
        )}
      </button>
    </form>
  );
}
