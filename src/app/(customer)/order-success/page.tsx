import Link from 'next/link';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="text-7xl mb-4 animate-bounce">🎉</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">ትዕዛዝዎ ተመዝግቧል!</h1>
        <p className="text-gray-500 mb-2">
          ለትዕዛዝዎ እናመሰግናለን። ቡድናችን ለማረጋገጥ በቅርቡ ያገኝዎታል።
        </p>
        <p className="text-gray-400 text-sm mb-8">
          📞 በሰጡት ስልክ ቁጥር ጥሪ ይደረግልዎታል።
        </p>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-left mb-6">
          <p className="text-green-800 text-sm font-medium">✅ ቀጣይ ደረጃዎች ምንድን ናቸው?</p>
          <ul className="text-green-700 text-sm mt-2 space-y-1">
            <li>1. አስተዳዳሪ ትዕዛዝዎን ያረጋግጣል</li>
            <li>2. የመላኪያ ዝርዝሮችን ለማረጋገጥ ስልክ እንደውላለን</li>
            <li>3. ትዕዛዝዎ ወደ አድራሻዎ ይላካል</li>
          </ul>
        </div>
        <Link
          href="https://t.me/bezisstore"
          className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-200 active:scale-[0.98]"
        >
          📢 ወደ ቴሌግራም ቻናል ተመለስ
        </Link>
      </div>
    </div>
  );
}
