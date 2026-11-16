import React, { useState } from 'react';
import { registerUser, loginUser } from '../services/userService';

export default function AuthGate({ onAuthSuccess }) {
  const [mode, setMode] = useState('register'); // 'register' | 'login'
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (!name.trim()) {
        setError('Iltimos, ismingizni kiriting.');
        return;
      }
      if (!phone.trim() || phone.trim().length < 9) {
        setError('Iltimos, telefon raqamingizni to‘liq kiriting.');
        return;
      }
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Iltimos, haqiqiy email manzilini kiriting.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Parol kamida 6 ta belgidan iborat bo‘lishi kerak.');
      return;
    }

    setLoading(true);
    try {
      let user;
      if (mode === 'register') {
        user = await registerUser({ name, phone, email, password });
      } else {
        user = await loginUser({ email, password });
      }
      if (onAuthSuccess) {
        onAuthSuccess(user);
      }
    } catch (err) {
      setError(err.message || 'Xatolik yuz berdi. Qayta urinib ko‘ring.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FAF7F2] p-4 overflow-y-auto">
      {/* Background Floral Accents */}
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-rose-100/40 blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3"></div>

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200/90 p-6 sm:p-8 my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Logo & Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 text-2xl shadow-xs mb-3">
            🌸
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1C3F3A] tracking-tight">
            MELFIS FLOWER SHOP
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 font-medium">
            Samarqand · Nafis va premium gullar
          </p>
          <div className="mt-3 py-1.5 px-3 rounded-full bg-emerald-50 border border-emerald-200/80 inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800">
            <span>🔒</span>
            <span>Saytga kirish uchun avval ro‘yxatdan o‘ting</span>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl mb-5 text-xs font-bold select-none">
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            className={`py-2.5 rounded-xl transition-all cursor-pointer ${
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
            className={`py-2.5 rounded-xl transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-[#1C3F3A] shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Kirish
          </button>
        </div>

        {/* Initial Bonus Announcement (for register) */}
        {mode === 'register' && (
          <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200/80 flex items-center gap-2.5">
            <span className="text-xl">🎁</span>
            <div className="text-[11px] text-amber-950 leading-snug">
              <strong>500 000 so‘m sovg‘a balansi!</strong> Ro‘yxatdan o‘tganingizda profilingizga start balansi beriladi. Gullarni shu balans hisobidan sotib olishingiz mumkin.
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Ismingiz:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Sardor Rahimov"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1C3F3A]/20 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Telefon raqamingiz:
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+998 90 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1C3F3A]/20 transition-all font-medium"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Email manzilingiz:
            </label>
            <input
              type="email"
              required
              placeholder="Masalan: melfis@mail.uz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1C3F3A]/20 transition-all font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Parol:
            </label>
            <input
              type="password"
              required
              placeholder={mode === 'register' ? 'Kamida 6 ta belgi' : 'Parolingiz'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1C3F3A]/20 transition-all font-medium"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-[#1C3F3A] hover:bg-[#15302C] active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-md transition-all disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 mt-2"
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
        <div className="mt-5 pt-4 border-t border-stone-100 text-center text-[11px] text-stone-400">
          Melfis Flower Shop Samarqand · Barcha huquqlar himoyalangan
        </div>

      </div>
    </div>
  );
}
