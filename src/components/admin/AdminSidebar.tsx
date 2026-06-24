'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard',  icon: '📊' },
  { href: '/admin/orders',    label: 'Orders',     icon: '📦' },
  { href: '/admin/products',  label: 'Products',   icon: '🛍️' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-white shadow-sm min-h-screen p-5 flex flex-col border-r border-gray-100">
      <div className="mb-8 px-2">
        <Link href="/" className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="Bezi's Store Logo" 
            className="h-10 w-auto object-contain"
          />
        </Link>
      </div>

      <nav className="space-y-1 flex-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                active
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 pt-4">
        <Link
          href="/api/auth/signout"
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl font-medium"
        >
          <span className="text-lg">🚪</span>
          Sign Out
        </Link>
      </div>
    </aside>
  );
}
