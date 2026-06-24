import Link from 'next/link';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="text-7xl mb-4 animate-bounce">🎉</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h1>
        <p className="text-gray-500 mb-2">
          Thank you for your order. Our team will contact you soon to confirm delivery.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          📞 You will receive a call on the phone number you provided.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-left mb-6">
          <p className="text-green-800 text-sm font-medium">✅ What happens next?</p>
          <ul className="text-green-700 text-sm mt-2 space-y-1">
            <li>1. Admin confirms your order</li>
            <li>2. We call you to confirm delivery details</li>
            <li>3. Your order is delivered to your address</li>
          </ul>
        </div>
        <Link
          href="https://t.me/your_channel_username"
          className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-200 active:scale-[0.98]"
        >
          📢 Back to Telegram Channel
        </Link>
      </div>
    </div>
  );
}
