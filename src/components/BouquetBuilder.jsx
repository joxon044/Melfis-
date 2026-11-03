import React, { useState } from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  Send, 
  Check, 
  Plus, 
  Minus, 
  HeartHandshake, 
  Package,
  Gift
} from 'lucide-react';
import { 
  BUILDER_FLOWERS, 
  BUILDER_WRAPPINGS, 
  BUILDER_ADDONS,
  SHOP_INFO 
} from '../data/flowers';
import { formatPrice } from '../utils/formatters';

export default function BouquetBuilder({ onAddToCart }) {
  const [selectedFlowers, setSelectedFlowers] = useState([
    { flower: BUILDER_FLOWERS[0], count: 25 },
  ]);
  const [selectedWrapping, setSelectedWrapping] = useState(BUILDER_WRAPPINGS[0]);
  const [selectedAddons, setSelectedAddons] = useState(['card']);
  const [customNote, setCustomNote] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Calculate total price
  const flowerTotal = selectedFlowers.reduce(
    (sum, selection) => sum + selection.flower.pricePerStem * selection.count,
    0
  );
  const wrappingTotal = selectedWrapping.price;
  const addonsTotal = selectedAddons.reduce((sum, addonId) => {
    const addon = BUILDER_ADDONS.find(a => a.id === addonId);
    return sum + (addon ? addon.price : 0);
  }, 0);
  const totalPrice = flowerTotal + wrappingTotal + addonsTotal;

  const toggleAddon = (id) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter(a => a !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  const toggleFlower = (flower) => {
    setSelectedFlowers((current) => {
      const selected = current.find((selection) => selection.flower.id === flower.id);
      if (selected) {
        return current.length > 1
          ? current.filter((selection) => selection.flower.id !== flower.id)
          : current;
      }
      return [...current, { flower, count: 1 }];
    });
  };

  const updateFlowerCount = (flowerId, count) => {
    setSelectedFlowers((current) =>
      current.map((selection) =>
        selection.flower.id === flowerId ? { ...selection, count } : selection
      )
    );
  };

  const flowerDetails = selectedFlowers
    .map(({ flower, count }) => `${flower.name} (${count} dona)`)
    .join(', ');

  const handleAddToCart = () => {
    const customItem = {
      id: `custom-${Date.now()}`,
      name: `Maxsus Guldasta: ${flowerDetails}`,
      price: totalPrice,
      image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80",
      isCustom: true,
      customDetails: `Gullar: ${flowerDetails}, O'rov: ${selectedWrapping.name}, Qo'shimchalar: ${selectedAddons.map(id => BUILDER_ADDONS.find(a => a.id === id)?.name).join(', ')}${customNote ? `, Tabriknoma: "${customNote}"` : ''}`,
      quantity: 1,
    };

    onAddToCart(customItem);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2500);
  };

  const handleTelegramOrder = () => {
    const text = `🌸 *MELFIS FLOWER SHOP — MAXSUS BUYURTMA (KONSTRUKTOR):*%0A` +
      `Gullar: *${flowerDetails}*%0A` +
      `O'rov qog'ozi: *${selectedWrapping.name}*%0A` +
      `Qo'shimchalar: *${selectedAddons.map(id => BUILDER_ADDONS.find(a => a.id === id)?.name).join(', ')}*%0A` +
      (customNote ? `Tabriknoma matni: "${customNote}"%0A` : '') +
      `Jami hisoblangan narx: *${formatPrice(totalPrice)}*%0A%0A` +
      `Samarqand Pavarot choraxasi floristlariga tayyorlash uchun yuborilmoqda.`;
    
    window.open(`https://t.me/${SHOP_INFO.telegramUsername}?text=${text}`, '_blank');
  };

  return (
    <section id="builder" className="py-14 sm:py-20 bg-gradient-to-b from-stone-50 via-rose-50/30 to-stone-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/90 text-rose-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles size={14} className="text-rose-600" />
            <span>Interaktiv Florist Xizmati</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#1A1818] tracking-tight">
            O'z Orzungizdagi Guldastani Yig'ing
          </h2>
          <p className="mt-2 text-stone-600 text-sm sm:text-base">
            Gullarning turi, soni, hashamatli o'rov qog'ozi va sovg'alarni o'zingiz tanlang — biz esa Samarqand bo'ylab 24/7 tezkor yetkazib beramiz.
          </p>
        </div>

        {/* Builder Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls: Left 7 cols */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Flower Selection */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-xs">
              <h3 className="text-sm sm:text-base font-bold text-stone-900 mb-3 flex items-center justify-between">
                <span>1. Gullarni tanlang</span>
                <span className="text-xs font-normal text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                  {selectedFlowers.length} tur tanlandi
                </span>
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {BUILDER_FLOWERS.map((fl) => (
                  <button
                    key={fl.id}
                    onClick={() => toggleFlower(fl)}
                    aria-pressed={selectedFlowers.some((selection) => selection.flower.id === fl.id)}
                    className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                      selectedFlowers.some((selection) => selection.flower.id === fl.id)
                        ? 'border-rose-600 bg-rose-50/60 ring-2 ring-rose-500/20 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{fl.image}</div>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-stone-800 line-clamp-1">{fl.name}</div>
                      <div className="text-[11px] font-bold text-rose-700 mt-0.5">{formatPrice(fl.pricePerStem)} / dona</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Flower counts */}
              <div className="mt-5 space-y-4 border-t border-stone-100 pt-4">
                {selectedFlowers.map(({ flower, count }) => (
                  <div key={flower.id}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="min-w-0 truncate text-xs font-semibold text-stone-800">
                        {flower.image} {flower.name}
                      </span>
                      <span className="shrink-0 font-serif text-base font-bold text-rose-700">
                        {count} dona
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      step="1"
                      value={count}
                      aria-label={`${flower.name} soni`}
                      onChange={(event) => updateFlowerCount(flower.id, Number(event.target.value))}
                      className="w-full h-2 rounded-lg bg-stone-200 accent-rose-600 cursor-pointer"
                    />
                    <div className="mt-1 flex justify-between text-[10px] text-stone-400">
                      <span>1 dona</span>
                      <span>50 dona</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Wrapping Paper */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-xs">
              <h3 className="text-sm sm:text-base font-bold text-stone-900 mb-3 flex items-center justify-between">
                <span>2. O'rash qog'ozi va dizayni</span>
                <span className="text-xs text-stone-500 font-normal">Ipak lenta bepul</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {BUILDER_WRAPPINGS.map((wrap) => (
                  <button
                    key={wrap.id}
                    onClick={() => setSelectedWrapping(wrap)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                      selectedWrapping.id === wrap.id
                        ? 'border-rose-600 bg-rose-50/60 ring-2 ring-rose-500/20'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <span 
                      className="w-5 h-5 rounded-full border border-stone-300 shrink-0 shadow-xs"
                      style={{ backgroundColor: wrap.color }}
                    />
                    <div className="overflow-hidden">
                      <div className="text-xs font-semibold text-stone-800 truncate">{wrap.name}</div>
                      <div className="text-[10px] text-stone-500">{formatPrice(wrap.price)}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Add-ons & Greeting Card */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-xs">
              <h3 className="text-sm sm:text-base font-bold text-stone-900 mb-3 flex items-center gap-2">
                <Gift size={16} className="text-rose-600" />
                <span>3. Sovg'alar va Xattotlik xati</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                {BUILDER_ADDONS.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between select-none ${
                        isChecked
                          ? 'border-rose-600 bg-rose-50/60 text-stone-900'
                          : 'border-stone-200 hover:border-stone-300 text-stone-600'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold">
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${isChecked ? 'bg-rose-600 border-rose-600 text-white' : 'border-stone-300'}`}>
                          {isChecked && <Check size={12} strokeWidth={3} />}
                        </div>
                        <span>{addon.name}</span>
                      </div>
                      <span className="text-xs font-bold text-rose-700 ml-2 whitespace-nowrap">
                        {addon.price === 0 ? "BEPUL" : `+${formatPrice(addon.price)}`}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Free Card Textarea */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tabriknoma matni (guldastadagi maxsus konvertga yoziladi):
                </label>
                <textarea
                  rows={2}
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Yurakdan chiqqan so'zlaringizni yozib qoldiring..."
                  className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-stone-50/50 resize-none"
                />
              </div>
            </div>

          </div>

          {/* Live Preview & Summary Card: Right 5 cols */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden p-6 sm:p-7">
              
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
                    {selectedFlowers.map(({ flower }) => flower.image).join(' ')}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-stone-900">
                      Guldasta smetasi
                    </h4>
                    <p className="text-[11px] text-stone-400">Melfis Flower Samarqand</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                  24/7 Tayyorlash
                </span>
              </div>

              {/* Composition List */}
              <div className="py-4 space-y-3 text-xs sm:text-sm">
                {selectedFlowers.map(({ flower, count }) => (
                  <div key={flower.id} className="flex items-center justify-between gap-3">
                    <span className="text-stone-600">
                      {flower.name} × {count} dona
                    </span>
                    <span className="shrink-0 font-semibold text-stone-900">
                      {formatPrice(flower.pricePerStem * count)}
                    </span>
                  </div>
                ))}

                <div className="flex items-center justify-between">
                  <span className="text-stone-600">
                    O'rov: {selectedWrapping.name}
                  </span>
                  <span className="font-semibold text-stone-900">
                    {formatPrice(wrappingTotal)}
                  </span>
                </div>

                {selectedAddons.length > 0 && (
                  <div className="flex items-start justify-between">
                    <span className="text-stone-600 max-w-[180px]">
                      Qo'shimchalar: {selectedAddons.map(id => BUILDER_ADDONS.find(a => a.id === id)?.name).join(', ')}
                    </span>
                    <span className="font-semibold text-stone-900">
                      {formatPrice(addonsTotal)}
                    </span>
                  </div>
                )}

                {customNote && (
                  <div className="pt-2 border-t border-dashed border-stone-200 text-stone-500 italic text-xs">
                    "{customNote}"
                  </div>
                )}
              </div>

              {/* Total Price Display */}
              <div className="pt-4 border-t border-stone-200 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-stone-500 block">Jami qiymati:</span>
                  <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1C3F3A]">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
                  Tezkor buyurtma
                </span>
              </div>

              {/* Buttons */}
              <div className="mt-6 space-y-2.5">
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
                    isSuccess 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-[#1C3F3A] hover:bg-[#15302C] text-white'
                  }`}
                >
                  {isSuccess ? (
                    <>
                      <Check size={18} />
                      <span>Savatga muvaffaqiyatli qo'shildi!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      <span>Savatga qo'shish</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleTelegramOrder}
                  className="w-full py-3 rounded-2xl font-semibold text-xs sm:text-sm bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 flex items-center justify-center gap-2 transition-colors"
                >
                  <Send size={16} />
                  <span>Telegram orqali floristga yuborish</span>
                </button>
              </div>

              {/* Delivery Info Snippet */}
              <div className="mt-4 text-center">
                <p className="text-[11px] text-stone-400">
                  📍 Samarqand Pavarot choraxasidan 30 daqiqada yetkazib berish
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
