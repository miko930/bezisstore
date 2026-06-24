import { prisma } from '@/lib/prisma';
import ProductCatalog from '@/components/customer/ProductCatalog';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Send, 
  Zap, 
  ArrowDown, 
  Truck, 
  Wallet, 
  PhoneCall, 
  ShieldCheck,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const dynamic = 'force-dynamic'; // Don't pre-render at build time

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  const channelLink = process.env.TELEGRAM_CHANNEL_LINK || 'https://t.me/bezisstore';

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col font-sans transition-colors duration-300">
      {/* Decorative Radial Background Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[120px] dark:bg-indigo-600/5" />
        <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-pink-500/10 blur-[120px] dark:bg-pink-600/5" />
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <img 
              src="/logo.png" 
              alt="Bezi's Store Logo" 
              className="h-14 w-auto object-contain dark:invert transition-transform group-hover:scale-102"
            />
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href={channelLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>ቻናል</span>
            </Link>
            <Link
              href="/admin/dashboard"
              className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-sm active:scale-[0.98]"
            >
              አስተዳዳሪ
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32 px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center space-y-8">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 -z-10">
          <img 
            src="https://i.pinimg.com/736x/93/17/7e/93177ee7faa08eedfeac091de8f57dfc.jpg" 
            alt="Bezi's Store Banner" 
            className="w-full h-full object-cover object-center scale-105 filter brightness-[0.4] dark:brightness-[0.25] blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 via-zinc-50/20 to-transparent dark:from-zinc-950 dark:via-zinc-950/20" />
        </div>

        {/* Glow Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 text-indigo-200 border border-white/15 backdrop-blur-md shadow-sm">
          <Zap className="w-3.5 h-3.5 fill-indigo-400 text-indigo-300" />
          <span>በቴሌግራም የሚሰራ ፈጣን ግብይት</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white max-w-4xl">
          ፈጣን እና አስተማማኝ ግብይት{' '}
          <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">
            በአዲስ አበባ
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-200 leading-relaxed font-medium">
          ከፍተኛ ጥራት ያላቸውን ምርቶች ይመልከቱ። በአንድ ጠቅታ ያዝዙ፣ ዝርዝሮችዎን ያረጋግጡ፣ ከዚያም ወደ በርዎ ይደርሳል።
        </p>

        {/* Hero Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full max-w-md sm:max-w-none">
          <a
            href="#catalog"
            className="w-full sm:w-auto bg-white hover:bg-zinc-100 text-zinc-950 font-bold px-8 py-4 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>ምርቶችን ይመልከቱ</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </a>
          <Link
            href={channelLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-white/10 border border-white/20 text-white hover:bg-white/20 font-bold px-8 py-4 rounded-2xl shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
          >
            <Send className="w-4 h-4 text-sky-400 fill-sky-400/10" />
            <span>ቻናላችንን ይቀላቀሉ</span>
          </Link>
        </div>
      </section>

      {/* Main Content Area */}
      <main id="catalog" className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
        {/* Catalog Header */}
        <div className="flex flex-col gap-2 mb-8 border-l-4 border-indigo-600 dark:border-indigo-500 pl-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">የምርት ማውጫ</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            ለማዘዝ የሚፈልጉትን ምርት ከታች ይምረጡ።
          </p>
        </div>

        {/* Product Catalog */}
        <ProductCatalog initialProducts={products} />

        {/* Features / FAQ Section */}
        <section className="mt-28 grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 border-t border-zinc-150 dark:border-zinc-905">
          {/* Card 1 */}
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800/80 space-y-4 hover:shadow-xl hover:shadow-zinc-100/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shadow-sm">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg tracking-tight">ፈጣን ማድረስ</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
              በአዲስ አበባ ውስጥ ባሉ ዋና ዋና ቦታዎች ትዕዛዞችን በፍጥነት እናስተላልፋለን። የማድረስ ጊዜ ከ24 እስከ 48 ሰዓታት ነው።
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800/80 space-y-4 hover:shadow-xl hover:shadow-zinc-100/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center shadow-sm">
              <Wallet className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg tracking-tight">ደህንነቱ የተጠበቀ ክፍያ</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
              ትዕዛዝዎን ለማረጋገጥ 10% ቅድመ ክፍያ በቴሌብር ወይም CBE ይፈጽሙ። ቀሪውን 90% ምርቱ ሲደርስዎ ይከፍላሉ።
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800/80 space-y-4 hover:shadow-xl hover:shadow-zinc-100/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 rounded-2xl flex items-center justify-center shadow-sm">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg tracking-tight">የትዕዛዝ ማረጋገጫ</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
              ትዕዛዝ ካስገቡ በኋላ፣ የአስተዳደር ቡድናችን ዝርዝሮችን ለማረጋገጥ እና ለማደራጀት በስልክ ያገኝዎታል።
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 py-10 px-4 sm:px-6 lg:px-8 mt-20 text-center text-xs text-zinc-550 dark:text-zinc-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="font-medium">© {new Date().getFullYear()} Bezi's Store. መብቱ በህግ የተጠበቀ ነው።</p>
          <div className="flex gap-4 font-bold">
            <Link href="/admin/login" className="hover:underline transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
              አስተዳዳሪ መግቢያ
            </Link>
            <span className="text-zinc-300 dark:text-zinc-800">·</span>
            <Link 
              href={channelLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:underline transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1"
            >
              <Send className="w-3 h-3 text-sky-500" />
              <span>ቴሌግራም ቻናል</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
