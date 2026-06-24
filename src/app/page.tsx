import { prisma } from '@/lib/prisma';
import ProductCatalog from '@/components/customer/ProductCatalog';
import Link from 'next/link';

export const dynamic = 'force-dynamic'; // Don't pre-render at build time

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  const channelLink = process.env.TELEGRAM_CHANNEL_LINK || 'https://t.me/bezisstore';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 text-gray-900 dark:text-zinc-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛍️</span>
            <span className="font-extrabold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Bezi's Store
            </span>
          </div>

          <nav className="flex items-center gap-4">
            <Link
              href={channelLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-gray-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1"
            >
              <span>📢 ቻናል</span>
            </Link>
            <Link
              href="/admin/dashboard"
              className="bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-800 dark:text-zinc-200 font-semibold px-4 py-2 rounded-xl text-xs transition-all"
            >
              አስተዳዳሪ
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        {/* Decorative Background Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
              ⚡ በቴሌግራም የሚሰራ ግብይት
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none">
              ፈጣን እና ተዓማኒ ግብይት{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                በአዲስ አበባ
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-500 dark:text-zinc-400 leading-relaxed">
              ከፍተኛ ጥራት ያላቸውን ምርቶች ይመልከቱ። በአንድ ጠቅታ ያዝዙ፣ ዝርዝሮችዎን ያረጋግጡ፣ ከዚያም ወደ በርዎ ይደርሳል።
            </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#catalog"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all text-center"
            >
              ምርቶችን ይመልከቱ ↓
            </a>
            <Link
              href={channelLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-200 font-bold px-8 py-3.5 rounded-2xl shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2"
            >
              <span>📢 ቻናላችንን ይቀላቀሉ</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main id="catalog" className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
        <div className="flex flex-col gap-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">ምርቶቻችን</h2>
          <p className="text-gray-400 dark:text-zinc-500 text-sm">
            ለማዘዝ ከታች ያለውን ምርት ይምረጡ።
          </p>
        </div>

        {/* Product Catalog */}
        <ProductCatalog initialProducts={products} />

        {/* Features / FAQ Section */}
        <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-gray-100 dark:border-zinc-800">
          <div className="bg-white/50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 space-y-3">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center text-xl shadow-sm">
              🚚
            </div>
            <h3 className="font-bold text-lg">ፈጣን ማድረስ</h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
              በአዲስ አበባ ውስጥ ባሉ ዋና ዋና ቦታዎች ትዕዛዞችን በፍጥነት እናስተላልፋለን። የማድረስ ጊዜ ከ24 እስከ 48 ሰዓታት ነው።
            </p>
          </div>

          <div className="bg-white/50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 space-y-3">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center text-xl shadow-sm">
              💵
            </div>
            <h3 className="font-bold text-lg">ደህንነቱ የተጠበቀ ክፍያ</h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
              ትዕዛዝዎን ለማረጋገጥ 10% ቅድመ ክፍያ በቴሌብር ወይም CBE ይፈጽሙ። ቀሪውን 90% ምርቱ ሲደርስዎ ይከፍላሉ።
            </p>
          </div>

          <div className="bg-white/50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 space-y-3">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center text-xl shadow-sm">
              📞
            </div>
            <h3 className="font-bold text-lg">የትዕዛዝ ማረጋገጫ</h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
              ትዕዛዝ ካስገቡ በኋላ፣ የአስተዳደር ቡድናችን ዝርዝሮችን ለማረጋገጥ እና ለማደራጀት በስልክ ያገኝዎታል።
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-850 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-center text-xs text-gray-400 dark:text-zinc-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Bezi's Store. መብቱ በህግ የተጠበቀ ነው።</p>
          <div className="flex gap-4">
            <Link href="/admin/login" className="hover:underline">
              አስተዳዳሪ መግቢያ
            </Link>
            <span>·</span>
            <Link href={channelLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
              ቴሌግራም ቻናል
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
