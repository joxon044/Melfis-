import React, { useState } from 'react';
import { Phone, Send, MessageCircle, X } from 'lucide-react';
import { SHOP_INFO } from '../data/flowers';

export default function QuickContactFloating() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-30 flex flex-col items-end gap-2">
      {/* Expanded Quick Options */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-3 space-y-2 mb-2 animate-fadeIn min-w-[200px]">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider px-2 pb-1 border-b border-stone-100">
            24/7 Tezkor Bog'lanish
          </div>

          <a
            href={SHOP_INFO.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-sky-50 text-sky-700 text-xs font-semibold transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center">
              <Send size={15} />
            </div>
            <div>
              <div>Telegram orqali</div>
              <div className="text-[10px] text-stone-400">@{SHOP_INFO.telegramUsername}</div>
            </div>
          </a>

          <a
            href={`tel:${SHOP_INFO.phone}`}
            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50 text-emerald-800 text-xs font-semibold transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
              <Phone size={15} />
            </div>
            <div>
              <div>Qo'ng'iroq qilish</div>
              <div className="text-[10px] text-stone-400">{SHOP_INFO.phoneDisplay}</div>
            </div>
          </a>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#1C3F3A] hover:bg-[#15302C] text-white flex items-center justify-center shadow-luxury hover:scale-105 active:scale-95 transition-all relative group"
        aria-label="Tezkor aloqa"
      >
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        {isOpen ? <X size={24} /> : <MessageCircle size={26} />}
      </button>
    </div>
  );
}
