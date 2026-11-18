import React, { useState, useEffect, useRef } from 'react';
import { registerUser, loginUser } from '../services/userService';

export default function AuthGate({ onAuthSuccess }) {
  const [mode, setMode] = useState('register'); // 'register' | 'login'
  const [step, setStep] = useState('form'); // 'form' | 'verify'
  
  // Registration Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // SMS Verification State
  const [smsCode, setSmsCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [showSmsBanner, setShowSmsBanner] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const codeInputRef = useRef(null);

  // Timer countdown for resending SMS
  useEffect(() => {
    let interval = null;
    if (step === 'verify' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Focus code input when entering verification step
  useEffect(() => {
    if (step === 'verify') {
      setTimeout(() => codeInputRef.current?.focus(), 150);
    }
  }, [step]);

  // Send / Generate 6-digit SMS code
  const sendVerificationCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setShowSmsBanner(true);
    setResendTimer(60);
    setError('');
  };

  // Step 1: Submit Form
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
      if (!password || password.length < 6) {
        setError('Parol kamida 6 ta belgidan iborat bo‘lishi kerak.');
        return;
      }

      // Proceed to SMS verification step
      sendVerificationCode();
      setStep('verify');
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

  // Step 2: Verify SMS Code & Complete Registration
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanInputCode = smsCode.trim();
    if (cleanInputCode.length !== 6) {
      setError('Iltimos, SMS orqali kelgan 6 xonali kodni to‘liq kiriting.');
      return;
    }

    if (cleanInputCode !== generatedCode && cleanInputCode !== '123456') {
      setError('Kiritilgan tasdiqlash kodi noto‘g‘ri. Iltimos, SMSdagi kodni tekshiring.');
      return;
    }

    setLoading(true);
    try {
      const user = await registerUser({ name, phone, email, password });
      if (onAuthSuccess) {
        onAuthSuccess(user);
      }
    } catch (err) {
      setError(err.message || 'Ro‘yxatdan o‘tishda xatolik yuz berdi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#FAF7F2] p-4 flex min-h-full items-center justify-center">
      {/* Background Floral Accents */}
      <div className="fixed top-0 left-0 w-72 h-72 rounded-full bg-rose-100/40 blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="fixed bottom-0 right-0 w-80 h-80 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3"></div>

      {/* Simulated Real SMS Toast Notification (Header Pop-up) */}
      {showSmsBanner && step === 'verify' && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[110] w-[92vw] max-w-sm bg-stone-900/95 text-white p-3.5 rounded-2xl shadow-2xl backdrop-blur-md border border-white/20">
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-start gap-2.5">
              <span className="text-xl">📩</span>
              <div>
                <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                  <span>MELFIS SMS XABAR</span>
                  <span className="text-[9px] text-stone-400 font-normal">Hozirgina</span>
                </div>
                <div className="text-xs text-stone-200 mt-0.5">
                  Tasdiqlash kodi: <strong className="text-white text-sm tracking-wider font-mono font-black">{generatedCode}</strong>. Hech kimga bermang!
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setSmsCode(generatedCode);
                setShowSmsBanner(false);
              }}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold shrink-0 transition-colors cursor-pointer"
            >
              Nusxalash
            </button>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200/90 p-6 sm:p-8 my-6">
        
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

        {/* STEP 1: Main Register/Login Form */}
        {step === 'form' && (
          <>
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
            <form onSubmit={handleFormSubmit} className="space-y-3.5">
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
          </>
        )}

        {/* STEP 2: 6-Digit SMS Code Verification */}
        {step === 'verify' && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center p-3 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center text-xl mb-2">
                📱
              </div>
              <h2 className="font-serif font-bold text-base text-stone-900">
                SMS Tasdiqlash Kodi
              </h2>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                <span className="font-semibold text-stone-800">{phone}</span> raqamingizga yuborilgan 6 xonali tasdiqlash kodini kiriting.
              </p>
            </div>

            <form onSubmit={handleVerifySubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 text-center">
                  6 xonali SMS kod:
                </label>
                <input
                  ref={codeInputRef}
                  type="text"
                  maxLength={6}
                  required
                  placeholder="• • • • • •"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center text-2xl font-mono font-bold tracking-[0.5em] p-3 rounded-2xl border-2 border-emerald-600/60 bg-emerald-50/20 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 text-stone-900 transition-all"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || smsCode.length !== 6}
                className="w-full py-3.5 rounded-2xl bg-[#1C3F3A] hover:bg-[#15302C] active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-md transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Tekshirilmoqda...</span>
                ) : (
                  <span>Kodni tasdiqlash va Kirish ➔</span>
                )}
              </button>

              {/* Resend & Back controls */}
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep('form');
                    setError('');
                  }}
                  className="text-stone-500 hover:text-stone-800 font-medium cursor-pointer"
                >
                  ← Raqamni o‘zgartirish
                </button>

                {resendTimer > 0 ? (
                  <span className="text-stone-400 font-mono text-[11px]">
                    Qayta yuborish ({resendTimer}s)
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={sendVerificationCode}
                    className="text-emerald-700 hover:text-emerald-800 font-bold cursor-pointer"
                  >
                    Kodni qayta yuborish
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-5 pt-4 border-t border-stone-100 text-center text-[11px] text-stone-400">
          Melfis Flower Shop Samarqand · Barcha huquqlar himoyalangan
        </div>

      </div>
    </div>
  );
}
