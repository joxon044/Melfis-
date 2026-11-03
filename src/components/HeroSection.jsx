import React from 'react';
import { 
  Sparkles, 
  Truck, 
  Clock, 
  ShieldCheck, 
  Camera, 
  PhoneCall, 
  Send, 
  Heart,
  ArrowRight,
  Star
} from 'lucide-react';
import { SHOP_INFO } from '../data/flowers';

export default function HeroSection({ onExploreClick, onBuilderClick }) {
  return (
    <section className="relative overflow-hidden pt-4 pb-12 sm:pb-16 lg:pb-20">
      {/* Decorative gradient blobs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-rose-200/40 via-amber-100/30 to-pink-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-100/40 rounded-full blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/80 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium">
              <Sparkles size={15} className="text-rose-600 animate-spin-slow" />
              <span>Samarqanddagi №1 nafis va premium gullar uyi</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#1A1818] tracking-tight leading-[1.15]">
              Nafis va Premium <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-700 via-rose-600 to-amber-700 italic">
                Gullar Dunyosi
              </span>
            </h1>

            {/* Description */}
            <p className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Yaqinlaringizga unutilmas tabassum ulashing. Yangi uzilgan pionlar, hashamatli Golland atirgullari va mualliflik guldastalari — Samarqand bo'ylab <strong>24/7 tezkor yetkazib berish</strong> xizmati bilan.
            </p>

            {/* CTA Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:flex items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="w-full 2xl:w-auto px-4 sm:px-7 md:px-3 2xl:px-7 py-3.5 rounded-full bg-[#1C3F3A] hover:bg-[#15302C] text-white font-medium text-sm sm:text-base md:text-sm 2xl:text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-95 group"
              >
                <span>Gullarni tanlash</span>
                <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onBuilderClick}
                className="w-full 2xl:w-auto px-4 sm:px-6 md:px-3 2xl:px-6 py-3.5 rounded-full bg-white hover:bg-rose-50 text-rose-800 font-medium text-sm sm:text-base md:text-sm 2xl:text-base border border-rose-200 transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
              >
                <Sparkles size={16} className="text-rose-600" />
                <span>O'z guldastangizni yarating</span>
              </button>

              <a
                href={SHOP_INFO.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full 2xl:w-auto sm:col-span-2 sm:justify-self-center md:col-span-1 md:justify-self-stretch 2xl:col-span-1 2xl:justify-self-auto px-4 sm:px-5 md:px-2 2xl:px-5 py-3.5 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-700 font-medium text-sm sm:text-base md:text-sm 2xl:text-base border border-sky-200 transition-all flex items-center justify-center gap-2"
              >
                <Send size={16} />
                <span>Telegram 24/7</span>
              </a>
            </div>

            {/* Quick Stats / Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-stone-200/80 max-w-lg mx-auto lg:mx-0 text-left md:hidden 2xl:grid">
              <div className="bg-white/70 backdrop-blur-sm p-3 rounded-2xl border border-stone-200/60 shadow-xs">
                <div className="font-serif font-bold text-xl sm:text-2xl text-stone-900">24/7</div>
                <div className="text-xs text-stone-500 font-medium">Tun-u kun xizmat</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm p-3 rounded-2xl border border-stone-200/60 shadow-xs">
                <div className="font-serif font-bold text-xl sm:text-2xl text-rose-700">3 000+</div>
                <div className="text-xs text-stone-500 font-medium">Baxtli mijozlar</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm p-3 rounded-2xl border border-stone-200/60 shadow-xs">
                <div className="font-serif font-bold text-xl sm:text-2xl text-emerald-800">30 daq</div>
                <div className="text-xs text-stone-500 font-medium">Tezkor yetkazish</div>
              </div>
            </div>

          </div>

          {/* Right Visual Image Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Card with Flower Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group">
                <img 
                  src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1000&q=85" 
                  alt="Melfis Peonies Luxury Bouquet" 
                  className="w-full h-[380px] sm:h-[460px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                {/* Floating Top Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 text-xs font-semibold text-stone-800">
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  <span>Hafta xiti: Pushti Pionlar</span>
                </div>

                {/* Bottom Card Content */}
                <div className="absolute bottom-4 left-4 right-4 text-white p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold">Melfis Royal Peony Dream</h3>
                      <p className="text-xs text-stone-200">19 ta saralangan Gollandiya pioni</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-amber-300">680 000 so'm</div>
                      <div className="text-[10px] text-stone-300 line-through">750 000 so'm</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Testimonial Pill */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white rounded-2xl p-3.5 shadow-xl border border-stone-100 flex items-center gap-3 animate-float max-w-xs">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0">
                  ✨
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {"★".repeat(5)}
                  </div>
                  <p className="text-xs font-medium text-stone-800">"Samarqandda eng yangi gullar!"</p>
                  <p className="text-[10px] text-stone-400">Pavarot choraxasi • 24/7</p>
                </div>
              </div>

              {/* Floating Instagram Follower Badge */}
              <div className="absolute -top-4 -right-2 sm:-right-4 bg-white rounded-2xl p-3 shadow-xl border border-stone-100 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-stone-200">
                  <img src="/images/logo.png" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">@samarqand.melfisflowers</p>
                  <p className="text-[10px] text-rose-600 font-medium">3,082 obunachi</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Feature Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-12 sm:mt-16">
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-3 hover:border-rose-200 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Clock size={22} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-800">24/7 Yetkazib berish</h4>
              <p className="text-[11px] sm:text-xs text-stone-500">Kechasi ham ochiq</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-3 hover:border-emerald-200 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-800">100% Yangi gullar</h4>
              <p className="text-[11px] sm:text-xs text-stone-500">Gollandiya & Ekvador</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-3 hover:border-amber-200 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Camera size={22} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-800">Foto hisobot</h4>
              <p className="text-[11px] sm:text-xs text-stone-500">Yetkazishdan oldin rasm</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-3 hover:border-sky-200 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <Truck size={22} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-800">Bepul tabriknoma</h4>
              <p className="text-[11px] sm:text-xs text-stone-500">Har bir guldastaga sovg'a</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
