import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Send, 
  Navigation, 
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';
import { SHOP_INFO } from '../data/flowers';

export default function LocationSection() {
  const [isLocationCardOpen, setIsLocationCardOpen] = useState(false);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=Samarkand+Pavarot`;
  const yandexMapsUrl = `https://yandex.com/maps/?text=Samarqand+Pavarot+choraxasi`;

  return (
    <section id="contact" className="py-14 sm:py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-200">
            <MapPin size={13} className="text-emerald-600" />
            <span>Do'konimiz Joylashuvi</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#1A1818] tracking-tight">
            Samarqand Pavarot Choraxasida Kutamiz
          </h2>
          <p className="mt-2 text-stone-600 text-sm sm:text-base">
            Do'konimizga tashrif buyurib, gullarni jonli tanlashingiz yoki 24/7 tezkor yetkazib berish xizmatidan foydalanishingiz mumkin.
          </p>
        </div>

        {/* Grid: Details on Left, Map illustration on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Details Card */}
          <div className="lg:col-span-5 bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-stone-200 flex flex-col justify-between space-y-6">
            
            <div className="space-y-6">
              {/* Address Item */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Manzilimiz
                  </h4>
                  <p className="font-serif font-bold text-base sm:text-lg text-stone-900 mt-0.5">
                    {SHOP_INFO.address}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    Samarqand shahri, Pavarot choraxasi (markaziy nuqtada joylashgan)
                  </p>
                </div>
              </div>

              {/* Working Hours Item */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Ish tartibi
                  </h4>
                  <p className="font-serif font-bold text-base sm:text-lg text-stone-900 mt-0.5">
                    24/7 — Tun-u kun dam olishsiz
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    Buyurtmalar tun-u kun qabul qilinadi va Samarqand bo'ylab yetkaziladi
                  </p>
                </div>
              </div>

              {/* Phone & Telegram */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Aloqa va Tezkor Buyurtma
                  </h4>
                  <a 
                    href={`tel:${SHOP_INFO.phone}`}
                    className="font-mono font-bold text-base sm:text-lg text-stone-900 hover:text-rose-600 block mt-0.5 transition-colors"
                  >
                    {SHOP_INFO.phoneDisplay}
                  </a>
                  <a
                    href={SHOP_INFO.telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-sky-600 font-medium hover:underline flex items-center gap-1 mt-1"
                  >
                    <Send size={12} /> Telegram: @{SHOP_INFO.telegramUsername}
                  </a>
                </div>
              </div>
            </div>

            {/* Direction Buttons */}
            <div className="pt-4 border-t border-stone-200/80 space-y-2.5">
              <span className="text-xs font-bold text-stone-700 block">
                Xaritadan yo'nalish olish:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={yandexMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold border border-red-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Navigation size={14} />
                  <span>Yandex Xarita</span>
                </a>

                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink size={14} />
                  <span>Google Xarita</span>
                </a>
              </div>
            </div>

          </div>

          {/* Interactive Map Visual Presentation */}
          <div className="lg:col-span-7 bg-stone-100 rounded-3xl border border-stone-200 overflow-hidden relative min-h-[380px] flex flex-col justify-between p-6 sm:p-8">
            
            {/* Background Graphic representing Samarkand Grid */}
            <div className="absolute inset-0 bg-[#e8ece9] opacity-80">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d5ddd7" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                {/* Simulated Roads */}
                <path d="M 0 160 Q 200 140 500 240 T 1000 200" fill="none" stroke="#ffffff" strokeWidth="12" />
                <path d="M 320 0 Q 340 200 330 500" fill="none" stroke="#ffffff" strokeWidth="10" />
                <path d="M 100 400 L 700 80" fill="none" stroke="#ffffff" strokeWidth="8" />
              </svg>
            </div>

            {/* Top Map Badges */}
            <div className="relative z-10 flex flex-wrap gap-2">
              <span className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-stone-800 shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Samarqand Pavarot choraxasi
              </span>
              <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-stone-600 shadow-sm">
                Markaziy do'kon
              </span>
            </div>

            {/* Interactive Map Pin and Location Card */}
            <div
              className={`relative z-10 my-auto mx-auto text-center backdrop-blur-md transition-all duration-500 ease-in-out ${
                isLocationCardOpen
                  ? 'w-full max-w-sm rounded-3xl border border-rose-200 bg-white/95 p-6 shadow-xl'
                  : 'h-16 w-16 rounded-full'
              }`}
            >
              <button
                type="button"
                onClick={() => setIsLocationCardOpen((isOpen) => !isOpen)}
                aria-label={isLocationCardOpen ? 'Joylashuv kartasini yopish' : 'Samarqand Pavarot choraxasi manzilini ko‘rish'}
                aria-expanded={isLocationCardOpen}
                className={`flex h-16 w-16 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg ring-4 ring-white transition-all duration-500 hover:bg-rose-700 ${
                  isLocationCardOpen
                    ? 'absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2'
                    : 'animate-bounce'
                }`}
              >
                <MapPin size={26} />
              </button>
              {isLocationCardOpen && (
                <div className="animate-fadeIn">
                  <h3 className="mt-3 font-serif text-lg font-bold text-stone-900">
                    MELFIS FLOWER SHOP
                  </h3>
                  <p className="mt-1 text-xs font-medium text-stone-600">
                    Pavarot choraxasi, Samarqand
                  </p>
                  <div className="mt-3 flex items-center justify-center gap-4 border-t border-stone-100 pt-3 text-xs text-stone-500">
                    <span className="flex items-center gap-1 font-semibold text-emerald-700">
                      <Check size={14} /> 24/7 Ochiq
                    </span>
                    <span>Yetkazish: 30-40 daq</span>
                  </div>
                </div>
              )}
            </div>

            {/* Landmark tags on map */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-4">
              <div className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-medium text-stone-600 shadow-xs">
                🏛 Registon (12 daqiqa)
              </div>
              <div className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-medium text-stone-600 shadow-xs">
                ✈️ Aeroport (18 daqiqa)
              </div>
              <div className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-medium text-stone-600 shadow-xs">
                🚂 Vokzal (15 daqiqa)
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
