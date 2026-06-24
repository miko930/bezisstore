'use client';

import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';

interface ProductImageProps {
  src: string;
  name: string;
  className?: string;
}

export default function ProductImage({ src, name, className = "w-full h-full object-cover" }: ProductImageProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-zinc-400 w-full h-full bg-emerald-50/50 dark:bg-zinc-850">
        <ShoppingBag className="w-10 h-10 mb-2 stroke-[1.5] text-emerald-600/60" />
        <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500">ምስል የለም</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className={className}
      onError={() => setError(true)}
    />
  );
}
