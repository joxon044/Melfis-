import { Send, Heart, MessageCircle, ExternalLink } from 'lucide-react';
import InstagramIcon from './icons/InstagramIcon';
import { SHOP_INFO } from '../data/flowers';

export default function InstagramSection() {
  const instagramPosts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80",
      likes: 245,
      comments: 18,
      caption: "Sarah Bernhardt pionlarimiz bilan nafis kompozitsiya 🤍 #melfisflowers #samarqand",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
      likes: 512,
      comments: 42,
      caption: "101 ta qizil atirgul — ehtirom va sevgi izhori 🌹 Buyurtma uchun 24/7",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80",
      likes: 310,
      comments: 24,
      caption: "Yangi mualliflik guldastasi! Samarqand Pavarot choraxasi📍",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?auto=format&fit=crop&w=600&q=80",
      likes: 198,
      comments: 15,
      caption: "Baxmal qutilarda uzoq saqlanuvchi gullar to'plami ✨",
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
      likes: 420,
      comments: 31,
      caption: "Kelinlar uchun maxsus to'y guldastalari 👰‍♀️🤍",
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=600&q=80",
      likes: 275,
      comments: 19,
      caption: "Har tong yangi uzilgan gullar qabuli. 24/7 xizmatingizda!",
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Instagram Profile Card matching real profile info */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm mb-10 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            
            {/* Profile Avatar with Instagram Gradient Ring */}
            <div className="relative p-1 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-1 overflow-hidden">
                <img 
                  src="/images/logo.png" 
                  alt="MELFIS FLOWER SHOP" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-lg sm:text-xl text-stone-900 flex items-center justify-center sm:justify-start gap-1.5">
                    <span>{SHOP_INFO.instagramUsername}</span>
                    <span className="text-sky-500 text-sm">✓</span>
                  </h3>
                  <p className="text-xs text-stone-500 font-medium tracking-wider">
                    MELFISFLOWERS.SAMARQAND
                  </p>
                </div>

                <a
                  href={SHOP_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs sm:text-sm font-semibold shadow-xs hover:opacity-95 transition-all"
                >
                  <InstagramIcon size={16} />
                  <span>Obuna bo'lish</span>
                  <ExternalLink size={13} />
                </a>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center sm:justify-start gap-6 text-xs sm:text-sm py-1 border-y border-stone-100">
                <div>
                  <span className="font-bold text-stone-900">{SHOP_INFO.postsCount}</span>{" "}
                  <span className="text-stone-500">posts</span>
                </div>
                <div>
                  <span className="font-bold text-stone-900">{SHOP_INFO.followersCount}</span>{" "}
                  <span className="text-stone-500">followers</span>
                </div>
                <div>
                  <span className="font-bold text-stone-900">{SHOP_INFO.followingCount}</span>{" "}
                  <span className="text-stone-500">following</span>
                </div>
              </div>

              {/* Bio */}
              <div className="text-xs text-stone-600 space-y-1">
                <p className="font-semibold text-stone-800">Florist</p>
                <p>💐 Nafis va premium gullar 🤍</p>
                <p>📦 Buyurtma uchun 24/7</p>
                <p>📍 SAMARQAND Pavarot choraxasi</p>
                <p>📞 +998 70 039 07 19</p>
                <div className="pt-1 flex items-center justify-center sm:justify-start gap-3 text-sky-600 font-medium">
                  <a href={SHOP_INFO.telegramUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                    <Send size={12} /> t.me/Melfis_flowers
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Instagram Visual Posts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href={SHOP_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden bg-stone-200 shadow-xs block"
            >
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Hover overlay with likes & comments */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 text-white text-xs font-bold">
                <div className="flex items-center gap-1">
                  <Heart size={14} className="fill-white" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle size={14} className="fill-white" />
                  <span>{post.comments}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
