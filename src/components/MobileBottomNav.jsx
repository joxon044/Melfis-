import React from 'react';
import { Home, Flower2, Sparkles, Heart, ShoppingBag } from 'lucide-react';

export default function MobileBottomNav({
  activeTab,
  setActiveTab,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
}) {
  const scrollTo = (id, tabName) => {
    setActiveTab(tabName);
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -70;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="2xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 py-1.5 px-3 shadow-float safe-area-bottom">
      <div className="flex items-center justify-around">
        
        {/* Asosiy */}
        <button
          onClick={() => scrollTo('top', 'home')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'home' ? 'text-rose-600 font-bold' : 'text-stone-500'
          }`}
        >
          <Home size={20} />
          <span className="text-[10px] mt-1">Asosiy</span>
        </button>

        {/* Katalog */}
        <button
          onClick={() => scrollTo('catalog', 'catalog')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'catalog' ? 'text-rose-600 font-bold' : 'text-stone-500'
          }`}
        >
          <Flower2 size={20} />
          <span className="text-[10px] mt-1">Katalog</span>
        </button>

        {/* Konstruktor */}
        <button
          onClick={() => scrollTo('builder', 'builder')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'builder' ? 'text-rose-600 font-bold' : 'text-stone-500'
          }`}
        >
          <div className="relative">
            <Sparkles size={20} className="text-amber-500 animate-pulse-slow" />
          </div>
          <span className="text-[10px] mt-1">Yig'uvchi</span>
        </button>

        {/* Sevimlilar */}
        <button
          onClick={onOpenWishlist}
          className="flex flex-col items-center py-1 px-2 rounded-xl text-stone-500 relative transition-all"
        >
          <div className="relative">
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1">Sevimlilar</span>
        </button>

        {/* Savat */}
        <button
          onClick={onOpenCart}
          className="flex flex-col items-center py-1 px-2 rounded-xl text-stone-500 relative transition-all"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-[#1C3F3A] text-white flex items-center justify-center -mt-2 shadow-md">
              <ShoppingBag size={16} />
            </div>
            {cartCount > 0 && (
              <span className="absolute -top-3 -right-1 bg-rose-500 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-medium">Savatcha</span>
        </button>

      </div>
    </div>
  );
}
