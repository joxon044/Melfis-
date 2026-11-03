import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveFromWishlist,
  onAddToCart,
  onOpenProductModal,
}) {
  if (!isOpen) return null;

  const handleAddAllToCart = () => {
    wishlistItems.forEach(item => {
      onAddToCart(item);
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 w-full sm:w-auto max-w-full flex sm:pl-10">
        <div className="w-full sm:w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-[#FAF7F2]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                <Heart size={18} className="fill-rose-500" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900">
                  Yoqtirgan gullaringiz
                </h3>
                <p className="text-[11px] text-stone-500">
                  {wishlistItems.length} ta guldasta saqlangan
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-200 text-stone-600 transition-colors"
              aria-label="Yopish"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            {wishlistItems.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-300 mx-auto flex items-center justify-center">
                  <Heart size={32} />
                </div>
                <h4 className="font-serif font-bold text-base text-stone-800">
                  Sevimlilar ro'yxati bo'sh
                </h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Gullardagi yurakcha belgisini bosib, yoqqan guldastalarni shu yerda saqlab qo'yishingiz mumkin.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800"
                >
                  Gullarni ko'rish
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex gap-3 items-center group"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      onClick={() => {
                        onClose();
                        onOpenProductModal(item);
                      }}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 
                        onClick={() => {
                          onClose();
                          onOpenProductModal(item);
                        }}
                        className="font-serif font-bold text-xs sm:text-sm text-stone-900 truncate cursor-pointer hover:text-rose-600"
                      >
                        {item.name}
                      </h4>
                      <p className="text-xs font-bold text-[#1C3F3A] mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => onAddToCart(item)}
                        className="p-2 rounded-xl bg-[#1C3F3A] text-white hover:bg-[#15302C] transition-colors"
                        title="Savatga qo'shish"
                      >
                        <ShoppingBag size={15} />
                      </button>
                      <button
                        onClick={() => onRemoveFromWishlist(item.id)}
                        className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-stone-100 transition-colors"
                        title="O'chirish"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {wishlistItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-[#FAF7F2]">
              <button
                onClick={handleAddAllToCart}
                className="w-full py-3 rounded-2xl font-bold text-xs sm:text-sm bg-[#1C3F3A] hover:bg-[#15302C] text-white flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <ShoppingBag size={16} />
                <span>Barchasini savatchaga qo'shish</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
