import React, { useState } from 'react';
import { KeyRound, LogOut, Mail, PackageCheck, Phone, ShieldCheck, User, X } from 'lucide-react';
import { apiRequest } from '../api';
import { formatPrice } from '../utils/formatters';

const ORDER_STATUS_LABELS = {
  new: 'Yangi',
  confirmed: 'Tasdiqlandi',
  preparing: 'Tayyorlanmoqda',
  delivering: 'Yetkazilmoqda',
  completed: 'Yakunlandi',
  cancelled: 'Bekor qilindi',
};

export default function AccountModal({ isOpen, user, initialError, onClose, onAuth, onLogout, onOpenAdmin }) {
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
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative my-auto max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl border border-stone-200 bg-white p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-stone-500 hover:bg-stone-100"
          aria-label="Yopish"
        >
          <X size={20} />
        </button>

        {user ? (
          <div className="pt-2">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
                <User size={22} />
              </div>
              <div className="min-w-0">
                <h2 className="truncate font-serif text-xl font-bold text-stone-900">{user.name}</h2>
                <p className="truncate text-xs text-stone-500">{user.email}</p>
              </div>
            </div>

            <div className="space-y-2 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm">
              <p className="flex items-center gap-2 text-stone-600"><Mail size={15} />{user.email}</p>
              <p className="flex items-center gap-2 text-stone-600"><Phone size={15} />{user.phone}</p>
            </div>

            <button
              type="button"
              onClick={orders === null ? handleLoadOrders : () => setOrders(null)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50"
            >
              <PackageCheck size={17} />
              {orders === null ? 'Buyurtmalarim' : 'Buyurtmalarni yashirish'}
            </button>
            {isLoadingOrders && <p className="mt-3 text-center text-xs text-stone-500">Buyurtmalar yuklanmoqda...</p>}
            {ordersError && <p className="mt-3 rounded-xl bg-red-50 p-3 text-xs text-red-700">{ordersError}</p>}
            {orders && (
              <div className="mt-3 max-h-56 space-y-2 overflow-y-auto">
                {orders.length === 0 ? (
                  <p className="rounded-xl bg-stone-50 p-3 text-center text-xs text-stone-500">Hozircha buyurtmalar yo‘q.</p>
                ) : orders.map((order) => (
                  <div key={order.id} className="rounded-xl border border-stone-200 p-3 text-xs">
                    <div className="flex justify-between gap-2 font-semibold text-stone-800">
                      <span>{order.order_number}</span>
                      <span>{ORDER_STATUS_LABELS[order.status] || order.status}</span>
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
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 py-3 text-sm font-semibold text-rose-800 hover:bg-rose-100"
              >
                <ShieldCheck size={17} />
                Admin buyurtmalar paneli
              </button>
            )}

            {visibleError && <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-xs text-red-700">{visibleError}</p>}
            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-stone-500 hover:bg-stone-50"
            >
              <LogOut size={17} /> Akkauntdan chiqish
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
                <KeyRound size={22} />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-stone-900">
                  {mode === 'register' ? 'Akkaunt yaratish' : 'Akkauntga kirish'}
                </h2>
                <p className="text-xs text-stone-500">Buyurtma berish uchun akkaunt kerak</p>
              </div>
            </div>

            <div className="mb-5 grid grid-cols-2 rounded-xl bg-stone-100 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                className={`rounded-lg py-2 ${mode === 'login' ? 'bg-white text-emerald-900 shadow-sm' : 'text-stone-500'}`}
              >
                Kirish
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(''); }}
                className={`rounded-lg py-2 ${mode === 'register' ? 'bg-white text-emerald-900 shadow-sm' : 'text-stone-500'}`}
              >
                Ro‘yxatdan o‘tish
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'register' && (
                <>
                  <input
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Ismingiz"
                    maxLength={100}
                    className="w-full rounded-xl border border-stone-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                  <input
                    required
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Telefon raqamingiz"
                    maxLength={30}
                    className="w-full rounded-xl border border-stone-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
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
                className="w-full rounded-xl border border-stone-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
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
                className="w-full rounded-xl border border-stone-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
              {visibleError && <p role="alert" className="rounded-xl bg-red-50 p-3 text-xs text-red-700">{visibleError}</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[#1C3F3A] py-3 text-sm font-bold text-white transition-colors hover:bg-[#15302C] disabled:opacity-60"
              >
                {isSubmitting ? 'Kuting...' : mode === 'register' ? 'Akkaunt yaratish' : 'Kirish'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
