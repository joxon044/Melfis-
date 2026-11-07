import React, { useState } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflineScreen({ onRetry }) {
  const [checking, setChecking] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const handleRetry = async () => {
    setChecking(true);
    setShowErrorToast(false);

    try {
      // Try to ping or check online status
      if (navigator.onLine) {
        // Quick fetch test
        await fetch('/favicon.ico', { method: 'HEAD', cache: 'no-store' });
        if (onRetry) onRetry();
      } else {
        throw new Error('Offline');
      }
    } catch {
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    } finally {
      setTimeout(() => setChecking(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF7F2] px-6 text-center select-none">
      {/* Decorative floral circles */}
      <div className="relative mb-6 flex items-center justify-center">
        <div className="absolute h-36 w-36 rounded-full bg-rose-100/60 animate-pulse" />
        <div className="absolute h-28 w-28 rounded-full bg-rose-200/50" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg border border-rose-100">
          <WifiOff className="h-10 w-10 text-rose-500" strokeWidth={2.2} />
        </div>
      </div>

      {/* Title & Message */}
      <h2 className="text-2xl font-serif font-bold text-[#1C3F3A] mb-2 tracking-tight">
        Internet bilan aloqa yo‘q
      </h2>
      <p className="max-w-sm text-sm text-[#1C3F3A]/70 leading-relaxed mb-8">
        Melfis ilovasi to‘liq ishlashi uchun internet kerak. Iltimos, Wi-Fi yoki mobil internetingizni tekshirib qayta urining.
      </p>

      {/* Retry Button */}
      <button
        onClick={handleRetry}
        disabled={checking}
        className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#1C3F3A] px-8 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#142e2a] active:scale-95 disabled:opacity-70 cursor-pointer"
      >
        <RefreshCw className={`h-4 w-4 ${checking ? 'animate-spin' : ''}`} />
        <span>{checking ? 'Tekshirilmoqda...' : 'Qayta urinish'}</span>
      </button>

      {/* Toast message if still offline */}
      {showErrorToast && (
        <div className="mt-5 rounded-xl bg-rose-50 border border-rose-200 px-4 py-2.5 text-xs font-medium text-rose-700 shadow-sm transition-all animate-bounce">
          Internet hali ham ulanmadi. Aloqani tekshiring!
        </div>
      )}

      {/* Brand Watermark */}
      <div className="absolute bottom-8 flex items-center gap-2 text-xs tracking-wider uppercase text-[#1C3F3A]/40 font-medium">
        <span>Melfis Flower Shop</span>
      </div>
    </div>
  );
}

