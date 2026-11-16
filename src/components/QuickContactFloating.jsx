import React, { useState, useRef, useEffect } from 'react';
import { SHOP_INFO } from '../data/flowers';
import { formatPrice } from '../utils/formatters';
import { 
  generateAiResponse, 
  INITIAL_AI_MESSAGE, 
  QUICK_QUESTIONS 
} from '../services/aiFloristEngine';

// Standalone SVG Icons (no external library dependency)
function ChatBubbleIcon({ size = 26, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

function CloseIcon({ size = 22, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  );
}

function SendIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
    </svg>
  );
}

function PhoneIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function TelegramIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m15 10-4 4l6 6l4-16l-18 7l4 2l2 6l3-4" />
    </svg>
  );
}

function SparklesIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
    </svg>
  );
}

function TrashIcon({ size = 15, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

export default function QuickContactFloating({ onSelectProduct }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_AI_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Natural bot response delay (450ms)
    setTimeout(() => {
      const response = generateAiResponse(text);
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: response.text,
        products: response.products,
        suggestions: response.suggestions,
        timestamp: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleResetChat = () => {
    setMessages([INITIAL_AI_MESSAGE]);
    setInputValue("");
  };

  // Helper to format bold **text** and links in AI messages
  const formatText = (text) => {
    const lines = text.split('\n');
    return lines.map((line, lineIdx) => {
      // Bold formatting
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={lineIdx} className="block leading-relaxed">
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} className="font-semibold text-stone-900">{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('*') && part.endsWith('*')) {
              return <em key={pIdx} className="italic text-stone-800">{part.slice(1, -1)}</em>;
            }
            return part;
          })}
        </span>
      );
    });
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end">
      
      {/* AI Chat Window */}
      {isOpen && (
        <div className="relative mb-3 w-[92vw] max-w-[390px] h-[550px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-stone-200/90 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Chat Header */}
          <div className="bg-[#1C3F3A] text-white px-4 py-3.5 flex items-center justify-between shadow-xs select-none">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-emerald-300 border border-white/20">
                  <SparklesIcon size={20} />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#1C3F3A]"></span>
              </div>
              <div>
                <div className="font-serif font-bold text-sm tracking-tight flex items-center gap-1.5">
                  <span>Melfis AI Florist</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-[10px] text-emerald-300 font-sans border border-emerald-400/30">AI</span>
                </div>
                <div className="text-[11px] text-emerald-200/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>24/7 Aqlli yordamchi</span>
                </div>
              </div>
            </div>

            {/* Quick Actions (Call, Telegram, Reset, Close) */}
            <div className="flex items-center gap-1 text-white/90">
              <a
                href={`tel:${SHOP_INFO.phone}`}
                title="Qo'ng'iroq qilish"
                className="p-1.5 rounded-xl hover:bg-white/15 transition-colors"
                aria-label="Qo'ng'iroq"
              >
                <PhoneIcon size={17} />
              </a>
              <a
                href={SHOP_INFO.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Telegram orqali yozish"
                className="p-1.5 rounded-xl hover:bg-white/15 transition-colors"
                aria-label="Telegram"
              >
                <TelegramIcon size={17} />
              </a>
              <button
                onClick={handleResetChat}
                title="Yangi suhbat boshlash"
                className="p-1.5 rounded-xl hover:bg-white/15 transition-colors text-white/70 hover:text-white"
                aria-label="Tozalash"
              >
                <TrashIcon size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/15 transition-colors text-white"
                aria-label="Yopish"
              >
                <CloseIcon size={19} />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF7F2]/60 scroll-smooth">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-xs transition-all ${
                    msg.sender === 'user'
                      ? 'bg-[#1C3F3A] text-white rounded-br-xs'
                      : 'bg-white text-stone-700 border border-stone-200/80 rounded-bl-xs'
                  }`}
                >
                  {formatText(msg.text)}

                  {/* Recommended Product Cards inside AI response */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-stone-100 space-y-2">
                      <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                        Tavsiya etilgan gullar:
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {msg.products.map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center gap-2.5 p-1.5 bg-[#FAF7F2] rounded-xl border border-stone-200/80 hover:border-emerald-500/50 transition-all cursor-pointer"
                            onClick={() => {
                              if (onSelectProduct) {
                                onSelectProduct(p);
                                setIsOpen(false);
                              }
                            }}
                          >
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-11 h-11 rounded-lg object-cover shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="font-serif font-bold text-stone-800 text-xs truncate">
                                {p.name}
                              </div>
                              <div className="text-emerald-700 font-bold text-[11px]">
                                {formatPrice(p.price)}
                              </div>
                            </div>
                            <span className="text-[10px] font-semibold text-[#1C3F3A] bg-white px-2 py-1 rounded-lg border border-stone-200">
                              Ko'rish →
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Suggestions Pills beneath bot messages */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                    {msg.suggestions.map((sugg, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSendMessage(sugg)}
                        className="text-[11px] font-medium bg-white hover:bg-emerald-50 text-stone-700 hover:text-[#1C3F3A] border border-stone-200 px-2.5 py-1 rounded-full shadow-2xs transition-all active:scale-95"
                      >
                        {sugg}
                      </button>
                    ))}
                  </div>
                )}

                {/* Timestamp */}
                <span className="text-[9px] text-stone-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white border border-stone-200/80 rounded-2xl px-3.5 py-2.5 w-fit shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[10px] text-stone-400 ml-1">AI javob yozmoqda...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Horizontal Scroll */}
          <div className="bg-white border-t border-stone-100 px-3 py-2 overflow-x-auto no-scrollbar flex gap-1.5">
            {QUICK_QUESTIONS.slice(0, 4).map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isTyping}
                className="shrink-0 text-[10px] font-semibold text-stone-600 hover:text-[#1C3F3A] bg-stone-50 hover:bg-emerald-50/70 border border-stone-200/70 px-2.5 py-1 rounded-lg transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white border-t border-stone-200/80 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Savolingizni yozing..."
              className="flex-1 text-xs px-3.5 py-2.5 rounded-full bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1C3F3A]/20 focus:bg-white text-stone-800 transition-all placeholder:text-stone-400"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="w-9 h-9 rounded-full bg-[#1C3F3A] hover:bg-[#15302C] disabled:bg-stone-200 text-white flex items-center justify-center transition-all active:scale-95 disabled:scale-100 cursor-pointer shrink-0 shadow-xs"
              aria-label="Yuborish"
            >
              <SendIcon size={15} />
            </button>
          </form>

        </div>
      )}

      {/* Floating Trigger Button (Matches user screenshot perfectly) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#1C3F3A] hover:bg-[#15302C] text-white flex items-center justify-center shadow-luxury hover:scale-105 active:scale-95 transition-all relative group cursor-pointer"
        aria-label="AI Florist Chat"
      >
        {/* Pulsing Green Online Indicator Dot */}
        <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 pointer-events-none">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
        </span>

        {isOpen ? (
          <CloseIcon size={24} className="transition-transform rotate-0" />
        ) : (
          <ChatBubbleIcon size={26} className="transition-transform group-hover:scale-110" />
        )}
      </button>

    </div>
  );
}
