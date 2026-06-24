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
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50/30 dark:bg-gradient-to-b dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col font-sans transition-colors duration-300">
      {/* Decorative Radial Background Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[120px] dark:bg-emerald-600/5" />
        <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-[120px] dark:bg-teal-600/5" />
      </div>

      {/* Navigation Header */}
      <div className="sticky top-4 z-50 px-4 w-full max-w-6xl mx-auto">
        <header className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-emerald-100/30 dark:border-zinc-900/30 transition-all shadow-xl shadow-emerald-950/5 rounded-3xl">
          <div className="px-6 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <img 
                src="/logo.png" 
                alt="Bezi's Store Logo" 
                className="h-12 w-auto object-contain dark:invert transition-transform group-hover:scale-105 duration-300"
              />
            </Link>

            <nav className="flex items-center">
              <Link
                href={channelLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-accent/10 hover:bg-emerald-accent text-emerald-accent-dark hover:text-white dark:bg-emerald-glow/10 dark:hover:bg-emerald-glow dark:text-emerald-glow dark:hover:text-zinc-950 font-bold px-4 py-2 rounded-full text-xs sm:text-sm flex items-center gap-2 transition-all duration-300 border border-emerald-250/20 hover:border-transparent hover:scale-103 active:scale-97 hover:shadow-lg hover:shadow-emerald-500/10"
              >
                <Send className="w-3.5 h-3.5" />
                <span>ቴሌግራም ቻናል</span>
              </Link>
            </nav>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden -mt-24 pt-36 pb-24 lg:pt-40 lg:pb-32 px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://i.pinimg.com/736x/93/17/7e/93177ee7faa08eedfeac091de8f57dfc.jpg" 
            alt="Bezi's Store Banner" 
            className="w-full h-full object-cover object-center scale-105 filter brightness-[0.35] dark:brightness-[0.2] blur-[0.5px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-50 via-transparent to-transparent dark:from-zinc-950 dark:via-transparent" />
          <div className="absolute inset-0 bg-emerald-900/30 mix-blend-multiply" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center space-y-8 max-w-4xl w-full">
          {/* Glow Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-400/20 backdrop-blur-md shadow-sm">
            <Zap className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
            <span>በቴሌግራም የሚሰራ ፈጣን ግብይት</span>
          </div>

          {/* Hero Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white max-w-4xl">
            ፈጣን እና አስተማማኝ ግብይት{' '}
            <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
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
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-400/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>ምርቶችን ይመልከቱ</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </a>
            <Link
              href={channelLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-emerald-400/40 font-bold px-8 py-4 rounded-2xl shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <Send className="w-4 h-4 text-emerald-400 fill-emerald-400/10" />
              <span>ቻናላችንን ይቀላቀሉ</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main id="catalog" className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
        {/* Catalog Header */}
        <div className="flex flex-col gap-2 mb-8 border-l-4 border-emerald-accent dark:border-emerald-glow pl-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">የምርት ማውጫ</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            ለማዘዝ የሚፈልጉትን ምርት ከታች ይምረጡ።
          </p>
        </div>

        {/* Product Catalog */}
        <ProductCatalog initialProducts={products} />

        {/* Features / FAQ Section */}
        <section className="mt-28 grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 border-t border-emerald-100 dark:border-zinc-800">
          {/* Card 1 */}
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-emerald-100/80 dark:border-zinc-800/80 space-y-4 hover:shadow-xl hover:shadow-emerald-100/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-emerald-accent-light dark:bg-emerald-accent/15 text-emerald-accent-dark dark:text-emerald-glow rounded-2xl flex items-center justify-center shadow-sm">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg tracking-tight">ፈጣን ማድረስ</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
              በአዲስ አበባ ውስጥ ባሉ ዋና ዋና ቦታዎች ትዕዛዞችን በፍጥነት እናስተላልፋለን። የማድረስ ጊዜ ከ24 እስከ 48 ሰዓታት ነው።
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-emerald-100/80 dark:border-zinc-800/80 space-y-4 hover:shadow-xl hover:shadow-emerald-100/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-emerald-accent-light dark:bg-emerald-accent/15 text-emerald-accent-dark dark:text-emerald-glow rounded-2xl flex items-center justify-center shadow-sm">
              <Wallet className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg tracking-tight">ደህንነቱ የተጠበቀ ክፍያ</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
              ትዕዛዝዎን ለማረጋገጥ 10% ቅድመ ክፍያ በቴሌብር ወይም CBE ይፈጽሙ። ቀሪውን 90% ምርቱ ሲደርስዎ ይከፍላሉ።
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-emerald-100/80 dark:border-zinc-800/80 space-y-4 hover:shadow-xl hover:shadow-emerald-100/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-emerald-accent-light dark:bg-emerald-accent/15 text-emerald-accent-dark dark:text-emerald-glow rounded-2xl flex items-center justify-center shadow-sm">
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
      <footer className="bg-emerald-deep dark:bg-zinc-950 border-t border-emerald-900/30 dark:border-zinc-900 py-10 px-4 sm:px-6 lg:px-8 mt-20 text-center text-xs text-emerald-200/70 dark:text-zinc-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="font-medium">© {new Date().getFullYear()} Bezi's Store. መብቱ በህግ የተጠበቀ ነው።</p>
          <div className="flex gap-4 font-bold">
            <Link 
              href={channelLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:underline transition-colors hover:text-emerald-300 dark:hover:text-emerald-glow flex items-center gap-1"
            >
              <Send className="w-3 h-3 text-emerald-400" />
              <span>ቴሌግራም ቻናል</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
