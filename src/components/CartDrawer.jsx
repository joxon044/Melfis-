import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Send, 
  Truck, 
  Clock, 
  Gift, 
  MapPin, 
  Phone, 
  User, 
  CreditCard,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatPrice, generateTelegramOrderUrl } from '../utils/formatters';
import { SAMARKAND_DISTRICTS, SHOP_INFO } from '../data/flowers';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderSuccess,
}) {
  if (!isOpen) return null;

  // Checkout form state
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [selectedDistrict, setSelectedDistrict] = useState(SAMARKAND_DISTRICTS[0]);
  const [address, setAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('Bugun (Tezkor)');
  const [deliveryTime, setDeliveryTime] = useState('Eng yaqin vaqtda (30-60 daq)');
  const [isSurprise, setIsSurprise] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('+998 ');
  const [cardMessage, setCardMessage] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Click');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Subtotal & delivery calculations
  const itemsSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = selectedDistrict ? selectedDistrict.deliveryFee : 0;
  const grandTotal = itemsSubtotal + deliveryFee;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  };

  const handleCheckout = (isTelegram = false) => {
    if (cartItems.length === 0) return;

    if (!customerName.trim() || phone.trim().length < 9) {
      setFormError("Iltimos, ismingiz va telefon raqamingizni kiriting!");
      return;
    }

    setFormError('');
    setIsSubmitting(true);

    const orderData = {
      orderId: 'MF-' + Math.floor(100000 + Math.random() * 900000),
      items: cartItems,
      subtotal: itemsSubtotal,
      deliveryFee: deliveryFee,
      totalPrice: grandTotal,
      customerName,
      phone,
      district: selectedDistrict.name,
      address,
      deliveryDate,
      deliveryTime,
      isSurprise,
      recipientName,
      recipientPhone,
      cardMessage,
      notes,
      paymentMethod,
      createdAt: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
    };

    if (isTelegram) {
      const url = generateTelegramOrderUrl(orderData);
      window.open(url, '_blank');
    }

    triggerConfetti();

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderSuccess(orderData);
      onClearCart();
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 w-full sm:w-auto max-w-full flex sm:pl-10">
        <div className="w-full sm:w-screen max-w-md sm:max-w-lg bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-[#FAF7F2]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#1C3F3A] text-white flex items-center justify-center">
                <ShoppingBag size={18} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900">
                  Buyurtma savatchasi
                </h3>
                <p className="text-[11px] text-stone-500">
                  {cartItems.length} xil mahsulot tanlangan
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

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
            
            {/* Empty state */}
            {cartItems.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
                  <ShoppingBag size={36} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg text-stone-800">
                    Savatchangiz bo'sh
                  </h4>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                    Katalogdan eng chiroyli pionlar va nafis guldastalarni tanlang.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-[#1C3F3A] text-white text-xs font-semibold hover:bg-[#15302C] transition-all"
                >
                  Gullar katalogiga o'tish
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                    <span>Tanlangan gullar:</span>
                    <button 
                      onClick={onClearCart}
                      className="text-rose-600 hover:text-rose-700 hover:underline"
                    >
                      Tozalash
                    </button>
                  </div>

                  {cartItems.map((item) => (
                    <div 
                      key={item.id}
                      className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex gap-3 items-center"
                    >
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-16 h-16 rounded-xl object-cover shrink-0 bg-white"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-xs sm:text-sm text-stone-900 truncate">
                          {item.name}
                        </h4>
                        {item.customDetails && (
                          <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                            {item.customDetails}
                          </p>
                        )}
                        <div className="text-xs font-bold text-rose-700 mt-1">
                          {formatPrice(item.price)}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden shrink-0">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-stone-600 hover:bg-stone-100 font-bold text-xs"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2 text-xs font-bold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-stone-600 hover:bg-stone-100 font-bold text-xs"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                        aria-label="O'chirish"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Delivery Location in Samarkand */}
                <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                    <MapPin size={16} className="text-rose-600" />
                    <span>Samarqand bo'ylab yetkazib berish hududi:</span>
                  </div>

                  <select
                    value={selectedDistrict.name}
                    onChange={(e) => {
                      const dist = SAMARKAND_DISTRICTS.find(d => d.name === e.target.value);
                      if (dist) setSelectedDistrict(dist);
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium"
                  >
                    {SAMARKAND_DISTRICTS.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name} ({d.deliveryFee === 0 ? "BEPUL" : formatPrice(d.deliveryFee)}) — {d.time}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Aniq manzil (Ko'cha, uy, mo'ljal yoki xonadon raqami)..."
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                {/* Surprise Order Toggle */}
                <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-3">
                  <div 
                    onClick={() => setIsSurprise(!isSurprise)}
                    className="flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2">
                      <Gift size={18} className="text-rose-600" />
                      <div>
                        <div className="text-xs font-bold text-rose-950">
                          Surpriz (Kutilmagan sovg'a)
                        </div>
                        <div className="text-[10px] text-rose-700">
                          Oluvchiga narxi mutlaqo aytilmaydi va chek berilmaydi
                        </div>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={isSurprise} 
                      onChange={() => {}} 
                      className="w-4 h-4 accent-rose-600 cursor-pointer"
                    />
                  </div>

                  {isSurprise && (
                    <div className="pt-2 border-t border-rose-200/80 space-y-2 animate-fadeIn">
                      <input
                        type="text"
                        placeholder="Sovg'a egasining ismi (masalan: Madinaxon)"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-rose-300 bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                      />
                      <input
                        type="tel"
                        placeholder="Sovg'a egasining telefon raqami (+998 ...)"
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-rose-300 bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                      />
                    </div>
                  )}
                </div>

                {/* Customer Details */}
                <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-3">
                  <div className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <User size={15} className="text-stone-500" />
                    <span>Sizning ma'lumotlaringiz (Buyurtmachi):</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Ismingiz *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                    <input
                      type="tel"
                      placeholder="Telefon raqamingiz *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-400 font-mono"
                    />
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Bepul tabriknomaga tilaklar yoki kuryerga izoh..."
                    value={cardMessage}
                    onChange={(e) => setCardMessage(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
                  />
                </div>

                {/* Payment Method */}
                <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
                  <span className="text-xs font-bold text-stone-800 block">
                    To'lov turi:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {['Click', 'Payme', 'Naqd / Karta'].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                          paymentMethod === method
                            ? 'bg-[#1C3F3A] text-white border-[#1C3F3A]'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {formError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}
              </>
            )}

          </div>

          {/* Footer with totals and action buttons */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-[#FAF7F2] space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Gullar qiymati:</span>
                  <span className="font-semibold text-stone-800">{formatPrice(itemsSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Yetkazib berish ({selectedDistrict.name}):</span>
                  <span className="font-semibold text-stone-800">
                    {deliveryFee === 0 ? "BEPUL" : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-bold text-[#1C3F3A] pt-2 border-t border-stone-200">
                  <span>Jami to'lov:</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {/* Instant Telegram Order */}
                <button
                  type="button"
                  onClick={() => handleCheckout(true)}
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl font-bold text-xs sm:text-sm bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                >
                  <Send size={16} />
                  <span>Telegram orqali buyurtma berish (@{SHOP_INFO.telegramUsername})</span>
                </button>

                {/* Direct Web Checkout */}
                <button
                  type="button"
                  onClick={() => handleCheckout(false)}
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-2xl font-bold text-xs sm:text-sm bg-[#1C3F3A] hover:bg-[#15302C] text-white flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98"
                >
                  <CheckCircle2 size={16} />
                  <span>Sayt orqali buyurtmani tasdiqlash</span>
                </button>
              </div>

              <p className="text-[10px] text-center text-stone-400">
                🔒 Samarqand Pavarot choraxasi floristlari 24/7 buyurtmangizni qabul qiladi
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
