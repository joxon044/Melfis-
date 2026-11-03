import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Send, 
  Phone, 
  Check, 
  Star, 
  Clock, 
  Truck, 
  Sparkles,
  Info,
  Calendar
} from 'lucide-react';
import { formatPrice } from '../utils/formatters';
import { SHOP_INFO } from '../data/flowers';

export default function ProductModal({
  product,
  onClose,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
}) {
  const [activeImage, setActiveImage] = useState(product?.images?.[0] || product?.image || '');
  const [quantity, setQuantity] = useState(1);
  const [personalCardNote, setPersonalCardNote] = useState('');
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const displayedImage = activeImage || product.images?.[0] || product.image;

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      quantity,
      customDetails: personalCardNote ? `Tabriknoma so'zlari: "${personalCardNote}"` : undefined,
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  const handleTelegramOrder = () => {
    const text = `🌸 *Melfis Flower Shop orqali tezkor buyurtma:*%0A` +
      `Guldasta: *${product.name}*%0A` +
      `Miqdor: ${quantity} dona%0A` +
      `Umumiy narx: *${formatPrice(product.price * quantity)}*%0A` +
      (personalCardNote ? `Tabriknoma matni: "${personalCardNote}"%0A` : '') +
      `Yetkazish manzili: Samarqand bo'ylab 24/7`;
    window.open(`https://t.me/${SHOP_INFO.telegramUsername}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div 
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 my-8 max-h-[92vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-stone-100 text-stone-700 shadow-md transition-colors"
          aria-label="Yopish"
        >
          <X size={20} />
        </button>

        {/* Left Side: Images Gallery */}
        <div className="md:w-1/2 bg-stone-100 p-4 sm:p-6 flex flex-col justify-between">
          <div className="relative h-[25vh] min-h-[160px] max-h-[220px] rounded-2xl overflow-hidden shadow-inner bg-white md:aspect-[4/5] md:h-auto md:min-h-0 md:max-h-none">
            <img
              src={displayedImage}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#1C3F3A] text-white shadow-sm">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnails if multiple images */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    displayedImage === img ? 'border-rose-600 scale-105 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Delivery Promise Box */}
          <div className="mt-4 p-3 rounded-2xl bg-white/80 border border-stone-200 text-xs text-stone-600 space-y-1.5">
            <div className="flex items-center gap-2 font-medium text-emerald-800">
              <Truck size={15} />
              <span>Samarqand bo'ylab tezkor yetkazib berish (30-60 daq)</span>
            </div>
            <div className="flex items-center gap-2 text-stone-500">
              <Clock size={15} className="text-amber-600" />
              <span>24/7 buyurtmalar qabul qilinadi va yetkaziladi</span>
            </div>
          </div>
        </div>

        {/* Right Side: Product Details & Purchase Actions */}
        <div className="md:w-1/2 p-5 sm:p-7 overflow-y-auto max-h-[75vh] md:max-h-none flex flex-col justify-between">
          <div>
            {/* Category & Occasion Badges */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700">
                {product.occasion}
              </span>
              <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold ml-auto">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-stone-400">({product.reviewsCount} sharh)</span>
              </div>
            </div>

            {/* Product Name */}
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
              {product.name}
            </h2>

            {/* Price */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#1C3F3A]">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-base text-stone-400 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-3 text-stone-600 text-sm leading-relaxed">
              {product.description}
            </p>

            {/* Composition & Dimensions */}
            <div className="mt-5 space-y-2.5 pt-4 border-t border-stone-100 text-xs sm:text-sm">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-stone-800 min-w-[90px]">Tarkibi:</span>
                <span className="text-stone-600">{product.composition}</span>
              </div>
              {product.height && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-800 min-w-[90px]">O'lchamlari:</span>
                  <span className="text-stone-600">Balandligi: {product.height} | Eni: {product.diameter}</span>
                </div>
              )}
            </div>

            {/* Free Gift Card Note Field */}
            <div className="mt-5 pt-4 border-t border-stone-100">
              <label className="block text-xs font-bold text-stone-800 mb-1.5 flex items-center gap-1.5">
                <Sparkles size={14} className="text-rose-500" />
                Bepul xattotlik tabriknomasi (Guldastaga qo'shib beriladi):
              </label>
              <textarea
                rows={2}
                value={personalCardNote}
                onChange={(e) => setPersonalCardNote(e.target.value)}
                placeholder="Yaqiningizga tilaklaringizni yozing (masalan: Tug'ilgan kuning bilan, sevgilim!)..."
                className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none bg-stone-50/60"
              />
            </div>
          </div>

          {/* Action Area */}
          <div className="mt-6 pt-4 border-t border-stone-100 space-y-3">
            
            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-3">
              {/* Quantity selector */}
              <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-stone-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2.5 text-stone-600 hover:bg-stone-200 font-bold transition-colors"
                >
                  -
                </button>
                <span className="px-3 text-sm font-semibold text-stone-800 min-w-[28px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-2.5 text-stone-600 hover:bg-stone-200 font-bold transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
                  added 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-[#1C3F3A] hover:bg-[#15302C] text-white'
                }`}
              >
                {added ? (
                  <>
                    <Check size={18} />
                    <span>Savatga qo'shildi!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    <span>Savatga qo'shish ({formatPrice(product.price * quantity)})</span>
                  </>
                )}
              </button>

              {/* Wishlist button */}
              <button
                onClick={() => onToggleFavorite(product)}
                className={`p-3 rounded-xl border transition-colors ${
                  isFavorite 
                    ? 'bg-rose-50 border-rose-300 text-rose-600' 
                    : 'border-stone-200 text-stone-500 hover:text-rose-600 hover:bg-stone-50'
                }`}
                aria-label="Sevimlilar"
              >
                <Heart size={18} className={isFavorite ? 'fill-rose-500' : ''} />
              </button>
            </div>

            {/* Instant Telegram Checkout Option */}
            <button
              onClick={handleTelegramOrder}
              className="w-full py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 flex items-center justify-center gap-2 transition-colors"
            >
              <Send size={15} />
              <span>Telegram orqali 1-bosishda buyurtma berish (@{SHOP_INFO.telegramUsername})</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
