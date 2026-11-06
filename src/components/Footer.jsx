import { 
  Heart, 
  MapPin, 
  Phone, 
  Send, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ArrowUp
} from 'lucide-react';
import InstagramIcon from './icons/InstagramIcon';
import { SHOP_INFO, CATEGORIES } from '../data/flowers';

export default function Footer({ onCategoryClick }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1A1818] text-stone-300 pt-16 pb-24 md:pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-stone-800">
          
          {/* Brand Info (Cols 1-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/images/footer-logo.png"
                alt="MELFIS FLOWER SHOP" 
                className="h-auto w-32 max-w-full rounded-sm object-contain"
              />
            </div>

            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
              Samarqandda nafis va premium gullar, mualliflik guldastalari va bayramona kayfiyat uyi. Har bir guldasta katta mehr bilan tayyorlanadi.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={SHOP_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-stone-800 hover:bg-rose-600 text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href={SHOP_INFO.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-stone-800 hover:bg-sky-500 text-white flex items-center justify-center transition-colors"
                aria-label="Telegram"
              >
                <Send size={18} />
              </a>
              <a
                href={`tel:${SHOP_INFO.phone}`}
                className="w-10 h-10 rounded-full bg-stone-800 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors"
                aria-label="Telefon"
              >
                <Phone size={18} />
              </a>
            </div>
          </div>

          {/* Quick Categories (Cols 5-7) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Gullar Katalogi
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-400">
              {CATEGORIES.slice(1, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      onCategoryClick(cat.id);
                      const el = document.getElementById('catalog');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-rose-300 transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <a href="#builder" className="text-rose-400 hover:text-rose-300 font-medium">
                  ✨ O'z guldastangizni yarating
                </a>
              </li>
            </ul>
          </div>

          {/* Delivery & Areas in Samarkand (Cols 8-9) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Yetkazib Berish
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-400">
              <li>Pavarot choraxasi (Bepul)</li>
              <li>Registon & Markaz</li>
              <li>Universitet xiyoboni</li>
              <li>Gagarin ko'chasi</li>
              <li>Sug'diyona massivi</li>
              <li>Vokzal va Aeroport</li>
              <li>Viloyat tumanlari</li>
            </ul>
          </div>

          {/* Contact Details (Cols 10-12) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Bog'lanish 24/7
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <p className="flex items-start gap-2">
                <MapPin size={16} className="text-rose-400 shrink-0 mt-0.5" />
                <span>{SHOP_INFO.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock size={16} className="text-emerald-400 shrink-0" />
                <span>{SHOP_INFO.workingHours}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={16} className="text-amber-400 shrink-0" />
                <a href={`tel:${SHOP_INFO.phone}`} className="hover:text-white font-mono font-bold text-stone-200">
                  {SHOP_INFO.phoneDisplay}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Send size={16} className="text-sky-400 shrink-0" />
                <a href={SHOP_INFO.telegramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  @{SHOP_INFO.telegramUsername}
                </a>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Payment Methods & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} <strong>MELFIS FLOWER SHOP</strong> (Samarqand). Barcha huquqlar himoyalangan.
          </div>

          {/* Payment Badges */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-stone-400">To'lov turlari:</span>
            <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-bold text-[10px] border border-stone-700">CLICK</span>
            <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-bold text-[10px] border border-stone-700">PAYME</span>
            <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-bold text-[10px] border border-stone-700">UZCARD</span>
            <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-bold text-[10px] border border-stone-700">HUMO</span>
          </div>

          {/* Scroll to Top */}
          <button
            onClick={scrollToTop}
            className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
            aria-label="Yuqoriga qaytish"
          >
            <ArrowUp size={16} />
          </button>
        </div>

      </div>
    </footer>
  );
}
