import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

export default function ProductCard({
  product,
  onProductClick,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
}) {
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(product);
  };

  const discountPercent = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
    : 0;

  return (
    <div 
      onClick={() => onProductClick(product)}
      className="group relative bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-rose-200 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Product Image Box */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-100">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.badge && (
            <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase bg-[#1C3F3A] text-white shadow-sm">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 shadow-sm ${
            isFavorite
              ? 'bg-rose-500 text-white'
              : 'bg-white/85 text-stone-600 hover:text-rose-600 hover:bg-white'
          }`}
          aria-label="Sevimlilarga qo'shish"
        >
          <Heart size={16} className={isFavorite ? 'fill-white' : ''} />
        </button>

        {/* Quick View Button (hover desktop) */}
        <div className="absolute bottom-3 left-3 right-3 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
          <span className="w-full py-2 bg-white/95 backdrop-blur-sm text-stone-800 rounded-xl text-xs font-semibold text-center shadow-md hover:bg-rose-50 hover:text-rose-700 flex items-center justify-center gap-1.5">
            <Eye size={14} />
            Batafsil ko'rish
          </span>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-2.5 sm:p-4 lg:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Size Chips */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <div className="flex items-center gap-1">
              <Star size={13} className="text-amber-400 fill-amber-400" />
              <span className="font-semibold text-stone-700">{product.rating}</span>
              <span className="text-[11px] text-stone-400">({product.reviewsCount})</span>
            </div>
            {product.height && (
              <span className="text-[11px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-medium">
                {product.height}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-serif text-sm sm:text-base lg:text-lg font-bold text-stone-900 group-hover:text-rose-700 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-[11px] sm:text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="mt-3 sm:mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-1">
          <div>
            <div className="text-sm sm:text-base lg:text-lg font-bold text-[#1C3F3A] whitespace-nowrap">
              {formatPrice(product.price)}
            </div>
            {product.oldPrice && (
              <div className="text-xs text-stone-400 line-through">
                {formatPrice(product.oldPrice)}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 active:scale-95 shadow-xs shrink-0 ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-800 hover:text-rose-900 border border-rose-200'
            }`}
            aria-label="Savatga qo'shish"
          >
            {added ? (
              <>
                <Check size={16} />
                <span className="hidden sm:inline">Qo'shildi</span>
              </>
            ) : (
              <>
                <ShoppingBag size={16} />
                <span className="hidden sm:inline">Savatga</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
