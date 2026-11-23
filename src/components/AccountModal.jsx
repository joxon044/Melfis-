import React, { useState, useEffect } from 'react';
import { KeyRound, LogOut, Mail, PackageCheck, Phone, RefreshCw, Send, ShieldCheck, X } from 'lucide-react';
import { apiRequest } from '../api';
import { formatPrice } from '../utils/formatters';
import { SHOP_INFO } from '../data/flowers';

const TOP_UP_STATUS_LABELS = {
  pending: 'To‘lov tasdiqlanishi kutilmoqda',
  approved: 'Balansga qo‘shildi',
  rejected: 'Rad etildi',
};

const ORDER_STATUS_LABELS = {
  new: 'Yangi',
  confirmed: 'Tasdiqlandi',
  preparing: 'Tayyorlanmoqda',
  delivering: 'Yetkazilmoqda',
  completed: 'Yakunlandi',
  cancelled: 'Bekor qilindi',
};

export default function AccountModal({ isOpen, user, initialError, onClose, onAuth, onLogout, onOpenAdmin, onBalanceUpdate }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orders, setOrders] = useState(null);
  const [ordersError, setOrdersError] = useState('');
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [topups, setTopups] = useState([]);
  const [topupsError, setTopupsError] = useState('');
  const [isLoadingTopups, setIsLoadingTopups] = useState(true);
  const [submittingTopupAmount, setSubmittingTopupAmount] = useState(null);
  const [topupTelegramUrl, setTopupTelegramUrl] = useState('');
  const [balanceError, setBalanceError] = useState('');

  // Lock background body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !user) return undefined;
    let isActive = true;
    apiRequest('/api/balance/topups')
      .then(({ topups: userTopups }) => {
        if (isActive) {
          setTopups(userTopups);
          setTopupsError('');
        }
      })
      .catch((requestError) => {
        if (isActive) setTopupsError(requestError.message);
      })
      .finally(() => {
        if (isActive) setIsLoadingTopups(false);
      });
    return () => {
      isActive = false;
    };
  }, [isOpen, user]);

  const handleRequestTopUp = async (amount) => {
    setSubmittingTopupAmount(amount);
    setTopupsError('');
    setTopupTelegramUrl('');
    try {
      const { topup } = await apiRequest('/api/balance/topups', {
        method: 'POST',
        body: { amount },
      });
      setTopups((current) => [topup, ...current.filter((item) => item.id !== topup.id)]);
      const text = encodeURIComponent(
        `Assalomu alaykum! Melfis hisobimni to'ldirish uchun to'lov qilmoqchiman.\n` +
        `So'rov raqami: ${topup.id}\n` +
        `Mijoz: ${user.name}\nTelefon: ${user.phone}\n` +
        `Summa: ${formatPrice(amount)}\n\n` +
        `To'lovni tasdiqlash uchun chekni yuboryapman.`
      );
      setTopupTelegramUrl(`https://t.me/${SHOP_INFO.telegramUsername}?text=${text}`);
    } catch (requestError) {
      setTopupsError(requestError.message);
    } finally {
      setSubmittingTopupAmount(null);
    }
  };

  const handleRefreshBalance = async () => {
    setBalanceError('');
    try {
      const { user: refreshedUser } = await apiRequest('/api/auth/me');
      if (!refreshedUser) throw new Error('Sessiya tugagan. Qayta kiring.');
      onBalanceUpdate(refreshedUser);
    } catch (requestError) {
      setBalanceError(requestError.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const path = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const body = mode === 'register'
        ? { name, phone, email, password }
        : { email, password };
      const result = await apiRequest(path, { method: 'POST', body });
      onAuth(result.user);
      setPassword('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadOrders = async () => {
    setIsLoadingOrders(true);
    setOrdersError('');
    try {
      const result = await apiRequest('/api/orders');
      setOrders(result.orders);
    } catch (requestError) {
      setOrdersError(requestError.message);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiRequest('/api/auth/logout', { method: 'POST', body: {} });
      onLogout();
      onClose();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  if (!isOpen) return null;
  const visibleError = error || (!user ? initialError : '');

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200/90 overflow-hidden flex flex-col max-h-[88vh] animate-scale"
      >
        {/* Fixed Header (never scrolls away) */}
        <div className="flex items-center justify-between px-5 sm:px-6 pt-5 pb-4 border-b border-stone-100 shrink-0 bg-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100">
              {user ? (
                <span className="font-bold text-base">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
              ) : (
                <KeyRound size={20} />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="truncate font-serif text-lg font-bold text-stone-900 leading-tight">
                {user ? user.name : mode === 'register' ? 'Akkaunt yaratish' : 'Akkauntga kirish'}
              </h2>
              <p className="truncate text-xs text-stone-500">
                {user ? (user.role === 'admin' ? 'Administrator' : 'Melfis mijozi') : 'Buyurtma berish uchun akkaunt kerak'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors shrink-0 ml-2"
            aria-label="Yopish"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body with Clean Thin Scrollbar */}
        <div className="p-5 sm:p-6 overflow-y-auto modal-scrollbar flex-1 space-y-4">
          {user ? (
            <>
              {/* Contact info pill */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 p-3 rounded-2xl bg-stone-50 border border-stone-200/70 text-xs text-stone-600">
                {user.phone && (
                  <span className="flex items-center gap-1.5 font-medium">
                    <Phone size={13} className="text-emerald-700 shrink-0" />
                    {user.phone}
                  </span>
                )}
                {user.email && (
                  <span className="flex items-center gap-1.5 text-stone-500 truncate">
                    <Mail size={13} className="text-stone-400 shrink-0" />
                    {user.email}
                  </span>
                )}
              </div>

              {/* Hisob Balansi Card */}
              <div className="rounded-2xl bg-gradient-to-br from-[#1C3F3A] to-[#15302C] p-4 text-white shadow-md">
                <div className="flex items-center justify-between text-xs text-emerald-200">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span>💰</span> Hisob balansingiz
                  </span>
                  <button
                    type="button"
                    onClick={handleRefreshBalance}
                    className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-[10px] text-emerald-100 hover:bg-white/20"
                    title="Balansni yangilash"
                  >
                    <RefreshCw size={11} /> Yangilash
                  </button>
                </div>
                <div className="mt-2 text-2xl font-serif font-extrabold text-white tracking-tight">
                  {formatPrice(user.balance ?? 0)}
                </div>
                <p className="mt-1 text-[11px] text-emerald-100/70">
                  Ushbu balans bilan buyurtmalar uchun to‘lov qilishingiz mumkin
                </p>
                
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => setShowTopUp(!showTopUp)}
                    className="w-full flex items-center justify-center gap-1 rounded-xl bg-white/15 hover:bg-white/25 text-white py-2.5 px-3 text-xs font-semibold border border-white/20 transition-all cursor-pointer"
                  >
                    <span>{showTopUp ? 'To‘ldirishni yopish' : 'Balansni to‘ldirish'}</span>
                  </button>
                </div>

                {showTopUp && (
                  <div className="mt-3 pt-3 border-t border-white/15 space-y-2.5 animate-fadeIn">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-200">
                      <span>Summani tanlab, to‘lov so‘rovini yarating:</span>
                      <span className="text-[10px] text-sky-200">@{SHOP_INFO.telegramUsername}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[100000, 200000, 500000, 1000000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => handleRequestTopUp(amt)}
                          disabled={submittingTopupAmount !== null}
                          className="py-2 px-2.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all border border-white/20 active:scale-95 cursor-pointer flex items-center justify-between disabled:cursor-wait disabled:opacity-60"
                        >
                          <span>{submittingTopupAmount === amt ? 'Yuborilmoqda...' : `+${formatPrice(amt)}`}</span>
                          {submittingTopupAmount !== amt && <Send size={11} className="text-sky-300" />}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] leading-relaxed text-emerald-100/80">
                      So‘rov yuborilgach, to‘lovni Telegram orqali yuboring. Pul faqat admin to‘lovni tekshirib tasdiqlagandan keyin balansga qo‘shiladi.
                    </p>
                    {topupTelegramUrl && (
                      <a
                        href={topupTelegramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 rounded-xl bg-[#2AABEE] px-3 py-2.5 text-xs font-bold text-white hover:bg-[#229ED9]"
                      >
                        <Send size={13} /> Telegramda to‘lovni yuborish
                      </a>
                    )}
                  </div>
                )}
                {balanceError && <p role="alert" className="mt-2 text-[11px] text-red-100">{balanceError}</p>}
              </div>

              <section className="space-y-2 rounded-2xl border border-stone-200 bg-white p-3">
                <h3 className="text-xs font-bold text-stone-800">Balans to‘ldirish so‘rovlari</h3>
                {isLoadingTopups && <p className="text-xs text-stone-500">So‘rovlar yuklanmoqda...</p>}
                {topupsError && <p role="alert" className="text-xs text-red-700">{topupsError}</p>}
                {!isLoadingTopups && topups.length === 0 && !topupsError && (
                  <p className="text-xs text-stone-500">Hozircha so‘rovlar yo‘q.</p>
                )}
                {topups.slice(0, 5).map((topup) => (
                  <div key={topup.id} className="flex items-center justify-between gap-3 border-t border-stone-100 pt-2 text-xs">
                    <div>
                      <p className="font-semibold text-stone-800">{formatPrice(Number(topup.amount))}</p>
                      <p className="text-[10px] text-stone-500">{new Date(topup.created_at).toLocaleString('uz-UZ')}</p>
                    </div>
                    <span className={`text-right ${topup.status === 'approved' ? 'text-emerald-700' : topup.status === 'rejected' ? 'text-red-600' : 'text-amber-700'}`}>
                      {TOP_UP_STATUS_LABELS[topup.status] || topup.status}
                    </span>
                  </div>
                ))}
              </section>

              {/* Action buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={orders === null ? handleLoadOrders : () => setOrders(null)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 py-2.5 text-xs sm:text-sm font-semibold text-stone-700 hover:bg-stone-50 active:scale-98 transition-all cursor-pointer"
                >
                  <PackageCheck size={16} className="text-emerald-800" />
                  {orders === null ? 'Buyurtmalarim' : 'Buyurtmalarni yashirish'}
                </button>

                {isLoadingOrders && <p className="text-center text-xs text-stone-500 py-1">Buyurtmalar yuklanmoqda...</p>}
                {ordersError && <p className="rounded-xl bg-red-50 p-2.5 text-xs text-red-700">{ordersError}</p>}
                
                {orders && (
                  <div className="max-h-48 space-y-2 overflow-y-auto modal-scrollbar pr-1">
                    {orders.length === 0 ? (
                      <p className="rounded-xl bg-stone-50 p-3 text-center text-xs text-stone-500">Hozircha buyurtmalar yo‘q.</p>
                    ) : orders.map((order) => (
                      <div key={order.id} className="rounded-xl border border-stone-200 bg-stone-50/50 p-3 text-xs">
                        <div className="flex justify-between gap-2 font-semibold text-stone-800">
                          <span>{order.order_number}</span>
                          <span className="text-emerald-700">{ORDER_STATUS_LABELS[order.status] || order.status}</span>
                        </div>
                        <p className="mt-1 text-stone-500">{new Date(order.created_at).toLocaleString('uz-UZ')}</p>
                        <p className="mt-1 font-bold text-emerald-800">{formatPrice(Number(order.total_price))}</p>
                      </div>
                    ))}
                  </div>
                )}

                {user.role === 'admin' && (
                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 py-2.5 text-xs sm:text-sm font-semibold text-rose-800 hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    <ShieldCheck size={16} />
                    Admin buyurtmalar paneli
                  </button>
                )}

                {visibleError && <p role="alert" className="rounded-xl bg-red-50 p-2.5 text-xs text-red-700">{visibleError}</p>}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-semibold text-stone-500 hover:text-red-600 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <LogOut size={16} /> Akkauntdan chiqish
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 rounded-xl bg-stone-100 p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); }}
                  className={`rounded-lg py-2 transition-all ${mode === 'login' ? 'bg-white text-emerald-900 shadow-sm' : 'text-stone-500'}`}
                >
                  Kirish
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(''); }}
                  className={`rounded-lg py-2 transition-all ${mode === 'register' ? 'bg-white text-emerald-900 shadow-sm' : 'text-stone-500'}`}
                >
                  Ro‘yxatdan o‘tish
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 pt-1">
                {mode === 'register' && (
                  <>
                    <input
                      required
                      autoComplete="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Ismingiz"
                      maxLength={100}
                      className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                    />
                    <input
                      required
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="Telefon raqamingiz"
                      maxLength={30}
                      className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                    />
                  </>
                )}
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email"
                  maxLength={254}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
                <input
                  required
                  type="password"
                  autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={mode === 'register' ? 'Parol (kamida 10 belgi)' : 'Parol'}
                  minLength={mode === 'register' ? 10 : undefined}
                  maxLength={128}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
                {visibleError && <p role="alert" className="rounded-xl bg-red-50 p-2.5 text-xs text-red-700">{visibleError}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-[#1C3F3A] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#15302C] disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? 'Kuting...' : mode === 'register' ? 'Akkaunt yaratish' : 'Kirish'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
