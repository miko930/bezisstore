'use client';

import { useState } from 'react';

export default function PostToTelegramButton({
  productId,
  posted,
}: {
  productId: string;
  posted: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(posted);

  async function handlePost() {
    setLoading(true);
    await fetch('/api/bot/post-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    setDone(true);
    setLoading(false);
  }

  return (
    <button
      onClick={handlePost}
      disabled={loading || done}
      className="flex-1 text-sm bg-blue-50 text-blue-700 rounded-xl py-2 hover:bg-blue-100 disabled:opacity-50 font-medium active:scale-[0.98]"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-1">
          <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Posting...
        </span>
      ) : done ? (
        '📢 Posted'
      ) : (
        '📢 Post to Telegram'
      )}
    </button>
  );
}
