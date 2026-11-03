import React from 'react';
import { CheckCircle2, Send, Phone, MapPin, Calendar, Clock, ShoppingBag } from 'lucide-react';
import { formatPrice } from '../utils/formatters';
import { SHOP_INFO } from '../data/flowers';

export default function OrderSuccessModal({ orderData, onClose }) {
  if (!orderData) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-stone-200 p-6 sm:p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Check Circle */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center mb-4">
          <CheckCircle2 size={42} strokeWidth={2.2} />
        </div>

        {/* Title & Order ID */}
        <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900">
          Buyurtmangiz qabul qilindi!
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Buyurtma raqami: <span className="font-mono font-bold text-stone-800">{orderData.orderId}</span>
        </p>

        {/* Order Details Card */}
        <div className="mt-5 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-left text-xs sm:text-sm space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200 font-bold text-stone-800">
            <span>Yetkazib berish vaqti:</span>
            <span className="text-rose-700 font-semibold">{orderData.deliveryTime}</span>
          </div>

          <div className="flex items-start justify-between text-stone-600">
            <span>Manzil:</span>
            <span className="font-medium text-stone-900 text-right max-w-[200px]">
              {orderData.district}, {orderData.address || "Pavarot choraxasi"}
            </span>
          </div>

          <div className="flex items-center justify-between text-stone-600">
            <span>Buyurtmachi:</span>
            <span className="font-medium text-stone-900">{orderData.customerName} ({orderData.phone})</span>
          </div>

          {orderData.isSurprise && (
            <div className="p-2 rounded-xl bg-rose-50 text-rose-800 text-xs">
              🎁 <strong>Kutilmagan sovg'a:</strong> {orderData.recipientName} ({orderData.recipientPhone})
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-stone-200 text-base font-bold text-[#1C3F3A]">
            <span>To'lov summasi ({orderData.paymentMethod}):</span>
            <span>{formatPrice(orderData.totalPrice)}</span>
          </div>
        </div>

        {/* Notice */}
        <p className="mt-4 text-xs text-stone-500 leading-relaxed">
          Floristimiz tez orada siz bilan bog'lanadi va gullar tayyor bo'lgach, yetkazishdan oldin fotosuratini Telegram orqali yuboradi.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 space-y-2.5">
          <a
            href={`https://t.me/${SHOP_INFO.telegramUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-2xl font-bold text-xs sm:text-sm bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Send size={16} />
            <span>Telegramda holatni bilish (@{SHOP_INFO.telegramUsername})</span>
          </a>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${SHOP_INFO.phone}`}
              className="py-2.5 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Phone size={14} className="text-emerald-600" />
              <span>Qo'ng'iroq qilish</span>
            </a>

            <button
              onClick={onClose}
              className="py-2.5 rounded-xl text-xs font-semibold bg-[#1C3F3A] hover:bg-[#15302C] text-white transition-colors"
            >
              Yana xarid qilish
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
