import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Clock, 
  MapPin, 
  Search, 
  Heart, 
  ShoppingBag, 
  Menu, 
  X, 
  Send, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { SHOP_INFO } from '../data/flowers';

export default function Navbar({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  searchQuery,
  setSearchQuery,
  onSubmitSearch,
  activeSection,
  setActiveSection,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    requestAnimationFrame(() => {
      const element = document.getElementById(id);
      if (!element) return;

      const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 0;
      const top = element.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSubmitSearch(searchQuery.trim());
    setSearchOpen(false);
    scrollTo('catalog');
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Notification Bar */}
      <div className="bg-[#1C3F3A] text-white text-xs sm:text-sm py-2 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center">
            <span className="flex items-center gap-1.5 font-medium text-rose-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="sm:hidden">24/7 Ochiq</span>
              <span className="hidden sm:inline">24/7 Ochiq</span>
            </span>
          </div>
          <a
            href={`tel:${SHOP_INFO.phone}`}
            className="relative right-8 flex shrink-0 items-center gap-1.5 whitespace-nowrap text-stone-200 transition-colors hover:text-white sm:right-0"
            aria-label={`Qo'ng'iroq qilish: ${SHOP_INFO.phoneDisplay}`}
          >
            <Phone size={13} className="text-emerald-400" />
            <span className="text-xs font-medium sm:text-sm">{SHOP_INFO.phoneDisplay}</span>
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5' 
          : 'bg-[#FAF7F2]/95 backdrop-blur-sm border-b border-stone-200/60 py-3.5'
      }`}>
        <div className="max-w-7xl mx-auto pl-3 pr-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <div 
              onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center gap-3 cursor-pointer select-none group"
            >
              <img 
                src="/images/navbar-logo.png" 
                alt="MELFIS FLOWER SHOP" 
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105 sm:h-12"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden 2xl:flex items-center space-x-7">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-stone-700 hover:text-rose-600 font-medium text-sm transition-colors"
              >
                Bosh sahifa
              </button>
              <button 
                onClick={() => scrollTo('catalog')}
                className="text-stone-700 hover:text-rose-600 font-medium text-sm transition-colors"
              >
                Gullar katalogi
              </button>
              <button 
                onClick={() => scrollTo('builder')}
                className="flex items-center gap-1.5 text-stone-700 hover:text-rose-600 font-medium text-sm transition-colors bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-1.5 rounded-full border border-rose-200"
              >
                <Sparkles size={14} className="text-rose-500" />
                O'z guldastangiz
              </button>
              <button 
                onClick={() => scrollTo('reviews')}
                className="text-stone-700 hover:text-rose-600 font-medium text-sm transition-colors"
              >
                Mijozlar fikrlari
              </button>
              <button 
                onClick={() => scrollTo('contact')}
                className="text-stone-700 hover:text-rose-600 font-medium text-sm transition-colors"
              >
                Do'kon manzili
              </button>
            </div>

            {/* Actions: Search, Wishlist, Cart */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              {/* Search input on desktop */}
              <form onSubmit={handleSearchSubmit} className="hidden 2xl:flex items-center relative">
                <input
                  type="text"
                  placeholder="Gullarni qidirish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Gullarni qidirish"
                  className="w-44 lg:w-56 pl-9 pr-3 py-1.5 text-sm rounded-full bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                />
                <Search size={16} className="absolute left-3 text-stone-400" />
                {searchQuery && (
                  <button 
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-stone-400 hover:text-stone-600 text-xs"
                  >
                    ✕
                  </button>
                )}
              </form>

              {/* Mobile Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="2xl:hidden p-1.5 text-stone-700 hover:text-rose-600 rounded-full hover:bg-stone-100 transition-colors"
                aria-label="Qidiruv"
              >
                <Search size={20} />
              </button>

              {/* Wishlist Button */}
              <button
                onClick={onOpenWishlist}
                className="relative p-1.5 sm:p-2 text-stone-700 hover:text-rose-600 rounded-full hover:bg-stone-100 transition-colors"
                aria-label="Sevimlilar"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-scale">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <div className="flex h-10 shrink-0 items-center gap-1">
                {/* Cart Button */}
                <button
                  onClick={onOpenCart}
                  className="relative flex h-10 items-center gap-2 rounded-full bg-[#1C3F3A] px-2.5 py-2 text-white shadow-sm transition-all hover:bg-[#15302C] active:scale-95 sm:px-3.5"
                  aria-label="Savatcha"
                >
                  <div className="relative">
                    <ShoppingBag size={18} />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <span className="hidden 2xl:inline text-xs font-semibold tracking-wide uppercase">
                    Savatcha
                  </span>
                </button>
              </div>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="2xl:hidden p-1.5 text-stone-700 hover:text-rose-600 rounded-lg hover:bg-stone-100 transition-colors"
                aria-label="Menyu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile search bar dropdown */}
          {searchOpen && (
            <div className="2xl:hidden pt-3 pb-1">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Atirgul, pion, guldastalar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  aria-label="Gullarni qidirish"
                  className="w-full pl-9 pr-8 py-2 text-sm rounded-xl bg-white border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
                <Search size={18} className="absolute left-3 top-2.5 text-stone-400" />
                {searchQuery && (
                  <button 
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 text-sm"
                  >
                    ✕
                  </button>
                )}
              </form>
            </div>
          )}
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="2xl:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 shadow-xl animate-fadeIn">
            <div className="flex flex-col space-y-3">
              <button 
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileMenuOpen(false); }}
                className="flex items-center justify-between text-left py-2 px-3 rounded-lg text-stone-800 font-medium hover:bg-stone-50"
              >
                <span>Bosh sahifa</span>
                <ChevronRight size={16} className="text-stone-400" />
              </button>
              <button 
                onClick={() => scrollTo('catalog')}
                className="flex items-center justify-between text-left py-2 px-3 rounded-lg text-stone-800 font-medium hover:bg-stone-50"
              >
                <span>Gullar katalogi</span>
                <ChevronRight size={16} className="text-stone-400" />
              </button>
              <button 
                onClick={() => scrollTo('builder')}
                className="flex items-center justify-between text-left py-2 px-3 rounded-lg bg-rose-50 text-rose-700 font-semibold"
              >
                <span className="flex items-center gap-2">
                  <Sparkles size={16} className="text-rose-500" />
                  O'z guldastangizni yarating
                </span>
                <ChevronRight size={16} className="text-rose-400" />
              </button>
              <button 
                onClick={() => scrollTo('reviews')}
                className="flex items-center justify-between text-left py-2 px-3 rounded-lg text-stone-800 font-medium hover:bg-stone-50"
              >
                <span>Mijozlar fikrlari</span>
                <ChevronRight size={16} className="text-stone-400" />
              </button>
              <button 
                onClick={() => scrollTo('contact')}
                className="flex items-center justify-between text-left py-2 px-3 rounded-lg text-stone-800 font-medium hover:bg-stone-50"
              >
                <span>Do'kon manzili (Pavarot)</span>
                <ChevronRight size={16} className="text-stone-400" />
              </button>

              <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
                <a 
                  href={`tel:${SHOP_INFO.phone}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-stone-900 text-white font-medium text-sm"
                >
                  <Phone size={16} className="text-emerald-400" />
                  Qo'ng'iroq qilish ({SHOP_INFO.phoneDisplay})
                </a>
                <a 
                  href={SHOP_INFO.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-500 text-white font-medium text-sm"
                >
                  <Send size={16} />
                  Telegram orqali buyurtma berish
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
