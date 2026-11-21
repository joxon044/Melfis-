import React, { useState, useEffect } from 'react';
import { registerUser, loginUser } from '../services/userService';

export default function AuthGate({ onAuthSuccess, initialError }) {
  const [mode, setMode] = useState('register'); // 'register' | 'login'
  
  // Registration Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Prevent background and page scrolling while AuthGate is active
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (!name.trim()) {
        setError('Iltimos, ismingizni kiriting.');
        return;
      }
      if (!phone.trim() || phone.replace(/\D/g, '').length < 9) {
        setError('Iltimos, telefon raqamingizni to‘liq kiriting (masalan: +998 90 123 45 67).');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('Iltimos, to‘g‘ri email manzilini kiriting.');
        return;
      }
      if (!password || password.length < 10) {
        setError('Parol kamida 10 ta belgidan iborat bo‘lishi kerak.');
        return;
      }
      setLoading(true);
      try {
        const user = await registerUser({ name, phone, email, password });
        if (onAuthSuccess) onAuthSuccess(user);
      } catch (err) {
        setError(err.message || 'Ro‘yxatdan o‘tishda xatolik yuz berdi.');
      } finally {
        setLoading(false);
      }
    } else {
      // Login directly
      if (!email.trim() || !email.includes('@')) {
        setError('Iltimos, to‘g‘ri email manzilini kiriting.');
        return;
      }
      if (!password) {
        setError('Iltimos, parolingizni kiriting.');
        return;
      }

      setLoading(true);
      try {
        const user = await loginUser({ email, password });
        if (onAuthSuccess) {
          onAuthSuccess(user);
        }
      } catch (err) {
        setError(err.message || 'Kirishda xatolik yuz berdi. Qayta urinib ko‘ring.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#FAF7F2] flex items-center justify-center p-3 sm:p-5 overflow-y-auto sm:overflow-hidden select-none">
      {/* Background Floral Accents */}
      <div className="fixed top-0 left-0 w-72 h-72 rounded-full bg-rose-100/40 blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="fixed bottom-0 right-0 w-80 h-80 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3"></div>

      {/* Main Card — Wide, airy, no scroll, no cramps */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200/90 p-5 sm:p-7">
        
        {/* Logo & Header */}
        <div className="text-center mb-4 sm:mb-5">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-rose-50 border border-rose-100 text-xl shadow-2xs mb-2">
            🌸
          </div>
          <h1 className="font-serif text-xl sm:text-2xl font-black text-[#1C3F3A] tracking-tight">
            MELFIS FLOWER SHOP
          </h1>
          <p className="text-xs text-stone-500 mt-0.5 font-medium">
            Samarqand · Nafis va premium gullar
          </p>
          <div className="mt-2 py-1 px-3 rounded-full bg-emerald-50 border border-emerald-200/80 inline-flex items-center gap-1.5 text-[10.5px] font-semibold text-emerald-800">
            <span>🔒</span>
            <span>Saytga kirish uchun avval ro‘yxatdan o‘ting</span>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl mb-4 text-xs font-bold select-none">
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-[#1C3F3A] shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Ro‘yxatdan o‘tish
          </button>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-[#1C3F3A] shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Kirish
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-3">
          {mode === 'register' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Ismingiz:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Sardor Rahimov"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1C3F3A]/20 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Telefon raqamingiz:
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+998 90 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1C3F3A]/20 transition-all font-medium"
                />
              </div>
            </div>
          )}

          <div className={mode === 'register' ? 'grid grid-cols-1 sm:grid-cols-2 gap-2.5' : 'space-y-3'}>
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                Email manzilingiz:
              </label>
              <input
                type="email"
                required
                placeholder="melfis@mail.uz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1C3F3A]/20 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                Parol:
              </label>
              <input
                type="password"
                required
                placeholder={mode === 'register' ? 'Kamida 10 ta belgi' : 'Parolingiz'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1C3F3A]/20 transition-all font-medium"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="py-1.5 px-3 rounded-xl bg-amber-50/80 border border-amber-200/70 flex items-center gap-2 text-[11px] text-amber-900 font-medium">
              <span>🎁</span>
              <span>Ro‘yxatdan o‘tganingizda <strong>500 000 so‘m</strong> sovg‘a balansi beriladi!</span>
            </div>
          )}

          {(error || initialError) && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {error || initialError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#1C3F3A] hover:bg-[#15302C] active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-md transition-all disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 mt-1"
          >
            {loading ? (
              <span>Tekshirilmoqda...</span>
            ) : mode === 'register' ? (
              <span>Ro‘yxatdan o‘tish va Kirish ➔</span>
            ) : (
              <span>Akkauntga kirish ➔</span>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-stone-100 text-center text-[10px] text-stone-400">
          Melfis Flower Shop Samarqand · Barcha huquqlar himoyalangan
        </div>

      </div>
    </div>
  );
}
