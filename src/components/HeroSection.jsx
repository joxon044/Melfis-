import React from 'react';
import { 
  Sparkles, 
  Truck, 
  Clock, 
  ShieldCheck, 
  Camera, 
  Send, 
  ArrowRight,
  Star
} from 'lucide-react';
import { SHOP_INFO } from '../data/flowers';

export default function HeroSection({ onExploreClick, onBuilderClick }) {
  return (
    <section className="relative overflow-hidden pt-2 pb-6 sm:pb-10 lg:pb-14">
      {/* Decorative gradient blobs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-rose-200/40 via-amber-100/30 to-pink-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-100/40 rounded-full blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-4 sm:space-y-5">
            
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/80 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium">
              <Sparkles size={14} className="text-rose-600 animate-spin-slow" />
              <span>Samarqanddagi №1 nafis va premium gullar uyi</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#1A1818] tracking-tight leading-[1.15]">
              Nafis va Premium <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-700 via-rose-600 to-amber-700 italic">
                Gullar Dunyosi
              </span>
            </h1>

            {/* 3. Bosh sahifadagi ixcham va tushunarli tavsif */}
            <p className="text-stone-600 text-sm sm:text-base lg:text-lg max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Yaqinlaringizga quvonch ulashing. Samarqand bo'ylab <strong>24/7 tezkor yetkazib berish</strong> xizmati bilan yangi uzilgan saralangan gullar.
            </p>

            {/* 4. Asosiy va ikkilamchi tugmalar iyerarxiyasi */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-2.5 sm:gap-3 pt-1">
              {/* Asosiy CTA (Eng e'tiborni tortadigan asosiy harakat) */}
              <button
                onClick={onExploreClick}
                className="px-7 py-3.5 rounded-full bg-[#1C3F3A] hover:bg-[#15302C] text-white font-semibold text-sm sm:text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-95 group cursor-pointer"
              >
                <span>Gullarni tanlash</span>
                <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Ikkilamchi ixcham tugmalar */}
              <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2.5">
                <button
                  onClick={onBuilderClick}
                  className="px-4 py-3 rounded-full bg-white hover:bg-rose-50 text-stone-800 hover:text-rose-700 font-medium text-xs sm:text-sm border border-stone-200 transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <Sparkles size={15} className="text-rose-500" />
                  <span className="truncate">Konstruktor</span>
                </button>

                <a
                  href={SHOP_INFO.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-full bg-sky-50/90 hover:bg-sky-100 text-sky-700 font-medium text-xs sm:text-sm border border-sky-200/80 transition-all flex items-center justify-center gap-1.5"
                >
                  <Send size={15} />
                  <span>Telegram 24/7</span>
                </a>
              </div>
            </div>

            {/* 6. Aniq va yaxshi o'qiladigan statistika kartochkalari */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 pt-3 border-t border-stone-200/80 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl border border-stone-200/80 shadow-xs">
                <div className="font-serif font-bold text-lg sm:text-2xl text-stone-900">24/7</div>
                <div className="text-xs text-stone-700 font-medium mt-0.5">Tun-u kun ochiq</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl border border-stone-200/80 shadow-xs">
                <div className="font-serif font-bold text-lg sm:text-2xl text-rose-700">3 000+</div>
                <div className="text-xs text-stone-700 font-medium mt-0.5">Mamnun mijozlar</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl border border-stone-200/80 shadow-xs">
                <div className="font-serif font-bold text-lg sm:text-2xl text-emerald-800">30 daq</div>
                <div className="text-xs text-stone-700 font-medium mt-0.5">Yetkazib berish</div>
              </div>
            </div>

          </div>

          {/* Right Visual Image Showcase (Instagram suzuvchi xalaqit beruvchi bildirishnoma olib tashlandi) */}
          <div className="lg:col-span-5 relative mt-2 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Card with Flower Image - 7. Ixcham balandlik, mahsulotlarni tezroq ko'rish uchun */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white group">
                <img 
                  src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1000&q=85" 
                  alt="Melfis Peonies Luxury Bouquet" 
                  className="w-full h-[280px] sm:h-[380px] lg:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                {/* Floating Top Badge */}
                <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 text-xs font-semibold text-stone-800">
                  <Star size={13} className="text-amber-500 fill-amber-500" />
                  <span>Hafta xiti: Pushti Pionlar</span>
                </div>

                {/* Bottom Card Content */}
                <div className="absolute bottom-3 left-3 right-3 text-white p-3.5 rounded-2xl bg-black/45 backdrop-blur-md border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-base sm:text-lg font-bold">Melfis Royal Peony Dream</h3>
                      <p className="text-[11px] sm:text-xs text-stone-200">19 ta saralangan Gollandiya pioni</p>
                    </div>
                    <div className="text-right">
                      <div className="text-base sm:text-lg font-bold text-amber-300">680 000 so'm</div>
                      <div className="text-[10px] text-stone-300 line-through">750 000 so'm</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Testimonial Pill (desktop / tablet da nozik ko'rinadi) */}
              <div className="hidden sm:flex absolute -bottom-4 -left-4 bg-white rounded-2xl p-3 shadow-lg border border-stone-100 items-center gap-2.5 max-w-xs">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs shrink-0">
                  ✨
                </div>
                <div>
                  <div className="flex items-center gap-0.5 text-amber-400 text-xs">
                    {"★".repeat(5)}
                  </div>
                  <p className="text-[11px] font-medium text-stone-800">"Samarqandda eng yangi gullar!"</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* 7. Ixcham Feature Badges Grid - birinchi ekranni to'sib qo'ymasligi uchun */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 mt-6 sm:mt-10">
          <div className="bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-2.5 sm:gap-3 hover:border-rose-200 transition-colors">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-800">24/7 Yetkazish</h4>
              <p className="text-[10px] sm:text-xs text-stone-500">Tun-u kun ochiq</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-2.5 sm:gap-3 hover:border-emerald-200 transition-colors">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-800">100% Yangi</h4>
              <p className="text-[10px] sm:text-xs text-stone-500">Gollandiya & Ekvador</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-2.5 sm:gap-3 hover:border-amber-200 transition-colors">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Camera size={20} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-800">Foto hisobot</h4>
              <p className="text-[10px] sm:text-xs text-stone-500">Yuborishdan oldin</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-2.5 sm:gap-3 hover:border-sky-200 transition-colors">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-800">Bepul tabriknoma</h4>
              <p className="text-[10px] sm:text-xs text-stone-500">Guldastaga sovg'a</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
