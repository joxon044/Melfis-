import React from 'react';
import { 
  Sparkles, 
  Flower2, 
  Heart, 
  Palette, 
  Gift, 
  Sun, 
  Crown, 
  Package,
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';
import { CATEGORIES, OCCASIONS } from '../data/flowers';

const iconMap = {
  Sparkles: Sparkles,
  Flower2: Flower2,
  Heart: Heart,
  Palette: Palette,
  Gift: Gift,
  Sun: Sun,
  Crown: Crown,
  Package: Package,
};

export default function CategoriesFilter({
  selectedCategory,
  setSelectedCategory,
  selectedOccasion,
  setSelectedOccasion,
  sortBy,
  setSortBy,
  priceRange,
  setPriceRange,
  resultsCount,
}) {
  return (
    <div className="space-y-6">
      
      {/* Category Pills (Horizontal scroll on mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {CATEGORIES.map((cat) => {
          const Icon = iconMap[cat.icon] || Sparkles;
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
                isActive
                  ? 'bg-[#1C3F3A] text-white shadow-md scale-[1.02]'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200/80 shadow-xs'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-rose-300' : 'text-stone-400'} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Occasion & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col 2xl:flex-row items-stretch 2xl:items-center justify-between gap-4">
        
        {/* Occasions Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 2xl:pb-0 scrollbar-none text-xs">
          <span className="text-stone-400 font-medium shrink-0 mr-1 hidden sm:inline">Mavzular:</span>
          {OCCASIONS.map((occ) => {
            const isSelected = selectedOccasion === occ;
            return (
              <button
                key={occ}
                onClick={() => setSelectedOccasion(occ)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors font-medium shrink-0 ${
                  isSelected
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {occ}
              </button>
            );
          })}
        </div>

        {/* Sorting Dropdown & Results Count */}
        <div className="flex items-center justify-between 2xl:justify-end gap-3 pt-2 2xl:pt-0 border-t 2xl:border-t-0 border-stone-100 text-xs sm:text-sm">
          <span className="text-stone-500 font-medium whitespace-nowrap">
            {resultsCount} ta guldasta
          </span>

          <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl">
            <ArrowUpDown size={14} className="text-stone-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-stone-700 text-xs sm:text-sm focus:outline-none cursor-pointer"
            >
              <option value="popular">Ommabopligi bo'yicha</option>
              <option value="price-asc">Narxi: Arzondan qimmatga</option>
              <option value="price-desc">Narxi: Qimmatdan arzonga</option>
              <option value="rating">Mijozlar reytingi bo'yicha</option>
            </select>
          </div>
        </div>

      </div>

    </div>
  );
}
