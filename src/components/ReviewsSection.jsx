import React, { useState } from 'react';
import { Star, MessageSquare, CheckCircle, Heart, Plus, Sparkles } from 'lucide-react';
import { REVIEWS } from '../data/flowers';

export default function ReviewsSection() {
  const [reviewsList, setReviewsList] = useState(REVIEWS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('Samarqand');
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;

    const newRev = {
      id: Date.now(),
      name: newName,
      location: newLocation,
      rating: newRating,
      date: "Hozirgina",
      comment: newComment,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      bouquetName: "Melfis Premium Kompozitsiya",
    };

    setReviewsList([newRev, ...reviewsList]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowAddModal(false);
      setNewName('');
      setNewComment('');
    }, 1500);
  };

  return (
    <section id="reviews" className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-2 border border-amber-200">
              <Star size={13} className="fill-amber-500 text-amber-500" />
              <span>Samarqandliklar Ishonchi</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#1A1818] tracking-tight">
              Mijozlarimizning Samimiy Fikrlari
            </h2>
            <p className="mt-2 text-stone-600 text-sm sm:text-base max-w-xl">
              Har bir buyurtma — bu kimningdir baxti. Samarqand bo'ylab minglab insonlarga quvonch ulashganimizdan faxrlanamiz.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="bg-stone-50 border border-stone-200 px-4 py-2 rounded-2xl flex items-center gap-3">
              <div className="text-2xl font-serif font-black text-[#1C3F3A]">5.0</div>
              <div className="text-xs text-stone-600">
                <div className="flex text-amber-400">{"★".repeat(5)}</div>
                <span>100% ijobiy baho</span>
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-[#1C3F3A] hover:bg-[#15302C] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Plus size={16} />
              <span>Fikr qoldirish</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviewsList.map((review) => (
            <div
              key={review.id}
              className="bg-[#FAF7F2] p-6 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow duration-300"
            >
              <div>
                {/* Rating & Date */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-400 text-sm">
                    {"★".repeat(review.rating)}
                  </div>
                  <span className="text-[11px] text-stone-400 font-medium">
                    {review.date}
                  </span>
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                  "{review.comment}"
                </p>
              </div>

              {/* Author & Flower purchased */}
              <div className="mt-5 pt-4 border-t border-stone-200/60 flex items-center gap-3">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-10 h-10 rounded-full object-cover border border-rose-200"
                />
                <div className="min-w-0">
                  <div className="font-serif font-bold text-xs sm:text-sm text-stone-900 truncate">
                    {review.name}
                  </div>
                  <div className="text-[11px] text-stone-500 truncate">
                    {review.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Review Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
            <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 border border-stone-200">
              <h3 className="font-serif font-bold text-xl text-stone-900 mb-1">
                Fikr qoldirish
              </h3>
              <p className="text-xs text-stone-500 mb-4">
                Melfis gullari xizmati haqidagi taassurotlaringiz bilan bo'lishing.
              </p>

              {submitted ? (
                <div className="py-8 text-center text-emerald-600 space-y-2">
                  <CheckCircle size={44} className="mx-auto" />
                  <p className="font-bold text-sm">Rahmat! Fikringiz qabul qilindi.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Bahoyingiz:
                    </label>
                    <div className="flex gap-1 text-2xl text-amber-400 cursor-pointer">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span 
                          key={star} 
                          onClick={() => setNewRating(star)}
                          className={star <= newRating ? 'text-amber-400' : 'text-stone-200'}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Ismingiz:
                    </label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Masalan: Nilufar"
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Samarqanddagi manzilingiz:
                    </label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="Masalan: Samarqand, Gagarin ko'chasi"
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Izohingiz:
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Gullar sifati va yetkazib berish xizmati haqida yozing..."
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1C3F3A] text-white hover:bg-[#15302C]"
                    >
                      Yuborish
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
