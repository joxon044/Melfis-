import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Melfis App Error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    try {
      localStorage.removeItem('melfis_current_user');
      localStorage.removeItem('melfis_cart');
      localStorage.removeItem('melfis_wishlist');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  returnFallback() {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6 text-center select-none font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-stone-200 shadow-xl space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 text-3xl flex items-center justify-center border border-rose-100">
            🌸
          </div>
          <h2 className="font-serif font-bold text-xl text-[#1C3F3A]">
            Melfis Flower Shop
          </h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            Ilovani yuklashda kichik muammo yuz berdi. Sahifani qayta yuklang yoki ilovani qayta oching.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={this.handleReload}
              className="w-full py-3 rounded-2xl bg-[#1C3F3A] hover:bg-[#15302C] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Sahifani qayta yuklash ⟳
            </button>
            <button
              onClick={this.handleReset}
              className="w-full py-2.5 rounded-2xl border border-stone-200 hover:bg-stone-50 text-stone-600 font-semibold text-xs transition-colors cursor-pointer"
            >
              Keshni tozalab qayta yuklash
            </button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      return this.returnFallback();
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
