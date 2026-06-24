import Link from 'next/link';
import { CheckCircle2, Send, ShoppingBag } from 'lucide-react';

export default function OrderSuccessPage() {
  const channelLink = process.env.TELEGRAM_CHANNEL_LINK || 'https://t.me/bezisstore';

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100/40 flex items-center justify-center px-4 font-sans">
      <div className="text-center max-w-sm w-full bg-white rounded-3xl p-8 shadow-xl shadow-emerald-900/5 border border-emerald-100/60 relative overflow-hidden">
        {/* Top glow decoration */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500" />
        
        {/* Animated Check Circle Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl mb-6 shadow-inner">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-black text-zinc-900 mb-2">ትዕዛዝዎ ተመዝግቧል!</h1>
        <p className="text-zinc-650 text-sm mb-2 font-medium">
          ለትዕዛዝዎ እናመሰግናለን። ቡድናችን ለማረጋገጥ በቅርቡ ያገኝዎታል።
        </p>
        <p className="text-emerald-600 text-xs font-bold mb-8">
          📞 በሰጡት ስልክ ቁጥር ጥሪ ይደረግልዎታል።
        </p>

        <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-5 text-left mb-8 space-y-3">
          <p className="text-emerald-800 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            ቀጣይ ደረጃዎች ምንድን ናቸው?
          </p>
          <ul className="text-emerald-700 text-xs font-medium space-y-2.5">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">1.</span>
              <span>አስተዳዳሪ ትዕዛዝዎን ያረጋግጣል</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">2.</span>
              <span>የመላኪያ ዝርዝሮችን ለማረጋገጥ ስልክ እንደውላለን</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">3.</span>
              <span>ትዕዛዝዎ ወደ አድራሻዎ ይላካል</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href={channelLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-emerald-accent to-emerald-accent-dark hover:from-emerald-accent-dark hover:to-emerald-deep text-white font-bold py-3.5 rounded-2xl shadow-md shadow-emerald-200/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Send className="w-4 h-4 fill-white/10" />
            <span>ወደ ቴሌግራም ቻናል ተመለስ</span>
          </Link>
          
          <Link
            href="/"
            className="w-full bg-zinc-50 border border-zinc-200/80 hover:bg-zinc-100 text-zinc-700 font-bold py-3.5 rounded-2xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm"
          >
            <ShoppingBag className="w-4 h-4 text-zinc-500" />
            <span>ወደ መደብሩ ተመለስ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
