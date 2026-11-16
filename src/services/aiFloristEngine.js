// Melfis AI Florist Knowledge & Conversation Engine
import { PRODUCTS, SAMARKAND_DISTRICTS, SHOP_INFO } from '../data/flowers';
import { formatPrice } from '../utils/formatters';

export const QUICK_QUESTIONS = [
  "🌹 Mashhur gullar",
  "🚚 Yetkazib berish narxlari",
  "📍 Do'kon qayerda va ish vaqti?",
  "🎂 Tug'ilgan kunga nima tavsiya qilasiz?",
  "✨ 101 ta atirgul narxi qancha?",
  "💳 To'lov usullari qanday?",
  "🎨 O'zim guldasta yig'sam bo'ladimi?",
  "💐 Gullarni qanday parvarishlash kerak?",
];

export const INITIAL_AI_MESSAGE = {
  id: "welcome-1",
  sender: "bot",
  text: "Assalomu alaykum! Men **Melfis AI Florist** yordamchisiman 🌸\n\nSizga Samarqand bo‘ylab eng nafis gullarni tanlash, yetkazib berish narxlari, ish vaqtimiz yoki buyurtma berishda bajonidil yordam beraman.\n\nQanday savolingiz bor?",
  suggestions: [
    "🌹 Mashhur gullar",
    "🚚 Yetkazib berish",
    "📍 Do'kon manzili",
    "🎂 Tug'ilgan kunga",
  ],
  timestamp: "Hozirgina",
};

/**
 * Intelligent message handler that analyzes user input and generates
 * helpful, friendly, natural Uzbek responses with optional product recommendations.
 */
export function generateAiResponse(userMessage) {
  const query = userMessage.toLowerCase().trim();

  // 1. Greetings (Salomlashish)
  if (/^(salom|assalom|qalaysiz|hayrli|privet|hello|hi)/i.test(query)) {
    return {
      text: "Assalomu alaykum! Melfis Flower Shop'ga xush kelibsiz 🌸\n\nBugun kimga va qanday munosabat bilan gul izlayapsiz? Masalan, **tug'ilgan kun**, **sevgi izhori**, **yubiley** yoki **shunchaki yaqiningizni xursand qilish** uchun ajoyib variantlarimiz bor!",
      suggestions: [
        "🌹 Mashhur gullar",
        "🎂 Tug'ilgan kunga gul tanlash",
        "🚚 Samarqand bo'ylab yetkazish",
      ],
    };
  }

  // 2. Thank you / Rahmat
  if (/(rahmat|katta rahmat|tashakkur|spasibo|thanks)/i.test(query)) {
    return {
      text: "Arzimaydi, doimo xizmatingizdamiz! 😊 Sizga quvonch ulashish biz uchun sharaf. Yana qandaydir savolingiz bormi?",
      suggestions: [
        "🌹 Barcha gullarni ko'rish",
        "📞 Operator bilan bog'lanish",
      ],
    };
  }

  // 3. Delivery / Yetkazib berish / Narxlari / Vaqti
  if (/(yetkaz|dostavk|kuryer|qachon olib|bepul|olib bor|hudud|rayon)/i.test(query)) {
    const districtsList = SAMARKAND_DISTRICTS.map(
      (d) => `• **${d.name}**: ${d.deliveryFee === 0 ? "Bepul 🎁" : formatPrice(d.deliveryFee)} (${d.time})`
    ).join("\n");

    return {
      text: `Samarqand shahri va viloyati bo‘ylab **24/7 tezkor yetkazib berish** xizmatimiz mavjud 🚚\n\n${districtsList}\n\n✨ **Muhim:** Yetkazishdan oldin guldastaning tayyor fotosuratini Telegram orqali yuboramiz. Shuningdek, qabul qiluvchiga **syurpriz va anonim** qilib yetkazib berishimiz ham mumkin!`,
      suggestions: [
        "📍 Do'kon manzili qayerda?",
        "💳 To'lov usullari",
        "🌹 Mashhur gullar",
      ],
    };
  }

  // 4. Location / Manzil / Ish vaqti / Telefon / Kontakt
  if (/(manzil|qayerda|lokatsiya|pavarot|ish vaqti|telefon|nomer|bog'lan|ochiq|kontakt|manzilingiz)/i.test(query)) {
    return {
      text: `📍 **Bizning manzilimiz:**\n${SHOP_INFO.address}\n\n⏰ **Ish tartibi:**\n${SHOP_INFO.workingHours} (dam olish kunlarisiz)\n\n📞 **Telefon raqamimiz:**\n[${SHOP_INFO.phoneDisplay}](tel:${SHOP_INFO.phone})\n\n💬 **Telegram:**\n[@${SHOP_INFO.telegramUsername}](${SHOP_INFO.telegramUrl})\n\n📸 **Instagram:**\n[@${SHOP_INFO.instagramUsername}](${SHOP_INFO.instagramUrl})\n\nMarhamat, do'konimizga kelib jonli ko'rishingiz yoki onlayn buyurtma berishingiz mumkin!`,
      suggestions: [
        "🚚 Yetkazib berish narxlari",
        "🌹 Mashhur gullar",
        "📞 Operatorga qo'ng'iroq",
      ],
    };
  }

  // 5. 101 ta atirgul / Qizil atirgullar / Roses
  if (/(101|yuz bir|atirgul|roza|qizil gul|avalanche|grand prix)/i.test(query)) {
    const roses = PRODUCTS.filter((p) => p.category === "roses");
    return {
      text: `Bizda haqiqiy **Gollandiya premium atirgullari** mavjud 🌹 Poyasi baquvvat, gulkosasi qalin va uzoq vaqt so'lmasdan yangi turadi:\n\n1. **101 Qizil Golland Atirguli 'Grand Prix'** — ${formatPrice(1450000)} (eng hashamatli va unutilmas sovg'a!)\n2. **51 Oq Atirgul 'Avalanche'** — ${formatPrice(850000)} (soflik va yuksak ehtirom ramzi)\n\nHar bir guldasta dizaynerlik mat qog'ozi va atlas ipak lenta bilan bepul bezatiladi.`,
      products: roses.slice(0, 2),
      suggestions: [
        "🚚 101 ta atirgulni yetkazish",
        "🌸 Pion gullari bormi?",
        "🎂 Tug'ilgan kunga tavsiya",
      ],
    };
  }

  // 6. Peonies / Pionlar
  if (/(pion|peony|sarah|pushti pion)/i.test(query)) {
    const peonies = PRODUCTS.filter((p) => p.category === "peonies");
    return {
      text: `Pionlar — bizning eng sevimli va xushbo‘y guldastalarimizdan biridir 🌸\n\n**Melfis Royal Peony Dream** — ${formatPrice(680000)}.\n\nNafis *Sarah Bernhardt* navli 19 dona pushti pionlar va frantsuz evkalipti shoxchalaridan yaratilgan. Uning nozik ifori xonani sehrli gul bog'iga aylantiradi!`,
      products: peonies.length > 0 ? peonies : PRODUCTS.slice(0, 1),
      suggestions: [
        "🌹 Atirgullarni ko'rish",
        "🚚 Qachon yetkazib berasiz?",
        "💳 To'lov usullari",
      ],
    };
  }

  // 7. Birthday / Tug'ilgan kun / Yubiley
  if (/(tug'ilgan|tugilgan|yubiley|tabrik|onam|opam|singlim)/i.test(query)) {
    const recommended = PRODUCTS.filter((p) => p.id === 3 || p.id === 4 || p.id === 9);
    return {
      text: `Tug‘ilgan kun va yubileylar uchun eng mashhur va ma'qul kelgan tavsiyalarimiz 🎉:\n\n1. **Samarqand Bahori Miksi** (${formatPrice(490000)}) — rang-barang eustoma va gortenziyali mualliflik guldastasi.\n2. **Velvet Box Quti** (${formatPrice(540000)}) — maxsus suvli floristik gubkada, vaza talab qilmaydi (10-14 kun yangi turadi).\n3. **Premium Sovg'a To'plami** (${formatPrice(620000)}) — Gullar + Ferrero Rocher + Oq yumshoq ayiqcha!\n\n🎁 **Bonus:** Har bir buyurtmaga bepul xattotlik tabriknomasi qo'shib beriladi (istagan tilagingizni yozib beramiz)!`,
      products: recommended,
      suggestions: [
        "📦 Qutidagi gullarni ko'rish",
        "🎁 Sovg'alar & Shokolad",
        "🚚 Samarqand bo'ylab yetkazish",
      ],
    };
  }

  // 8. Love / Romantic / Ayolimga / Sevgilimga / Qizimga
  if (/(sevgi|romantik|ayolim|sevgilim|qizimga|kelin|yaxshi ko'r)/i.test(query)) {
    const recommended = PRODUCTS.filter((p) => p.id === 2 || p.id === 1 || p.id === 9);
    return {
      text: `Sevgi izhori va romantik onlar uchun eng ajoyib kompozitsiyalar ❤️:\n\n• **101 ta Qizil Atirgul** — his-tuyg'ularingizni so'zsiz ifoda etadi.\n• **Melfis Royal Peony Dream** — eng nozik va xushbo'y tanlov.\n• **Sovg'a to'plami (Gullar + Ferrero + Ayiqcha)** — unutilmas shirin xursandchilik!\n\nYetkazib berishda anonimlik (kimdan ekanligini sir saqlash) xizmati ham bepul taqdim etiladi.`,
      products: recommended,
      suggestions: [
        "🌹 101 atirgul narxi",
        "🚚 Yetkazib berish vaqti",
        "🎨 Konstruktorda yig'ish",
      ],
    };
  }

  // 9. Boxes / Qutidagi gullar
  if (/(quti|box|baxmal|korobka)/i.test(query)) {
    const boxes = PRODUCTS.filter((p) => p.category === "boxes");
    return {
      text: `Qutidagi gullarimiz juda qulay va uzoq saqlanadi 🎁\n\n• **Velvet Box (Oq va pushti gullar)** — ${formatPrice(540000)}\n• **Golden Luxury Box (Oltin jiloli qora quti)** — ${formatPrice(790000)}\n\nUlarning tubida namlik saqlovchi floristik oazis (gubka) bo'lib, gullar 10-14 kungacha o'z go'zalligini yo'qotmaydi. Vaza qidirish shart emas!`,
      products: boxes,
      suggestions: [
        "🚚 Yetkazib berish narxlari",
        "💳 Qanday to'layman?",
        "🌹 Barcha gullarni ko'rish",
      ],
    };
  }

  // 10. Wedding / To'y / Kelin guldastasi
  if (/(to'y|toy|kelin|nikoh|unashtiruv|fata|zags)/i.test(query)) {
    const wedding = PRODUCTS.filter((p) => p.category === "wedding");
    return {
      text: `Samarqand to‘ylari uchun eng nafis kelin guldastasi 👰‍♀️🤍:\n\n**Kelin Guldastasi 'White Swan'** — ${formatPrice(590000)}.\nOq kallalar, oq pion atirgullari, nozik freziya va marvaridli tasmalar bilan bezatiladi.\n\n🎁 **Eng muhimi:** Kuyov kostyumi uchun maxsus butonerka mutlaqo **bepul** sovg'a qilinadi!`,
      products: wedding,
      suggestions: [
        "📍 Pavarot choraxasidagi do'kon",
        "📞 Florist bilan maslahat",
      ],
    };
  }

  // 11. Payments / To'lov usullari
  if (/(to'lov|tolov|oplata|payme|click|naqd|karta|uzum|qanday to'lash)/i.test(query)) {
    return {
      text: `Bizda to‘lov qilish juda qulay va xavfsiz 💳:\n\n1. **Payme** yoki **Click** orqali onlayn\n2. **Karta orqali** (Humo / UzCard / Visa)\n3. **Naqd pulda** — kuryer guldastani qo‘lingizga topshirganda\n\nChet eldan turib ham Samarqanddagi yaqinlaringiz uchun oson to‘lov qilib buyurtma berishingiz mumkin!`,
      suggestions: [
        "🚚 Yetkazib berish narxlari",
        "🌹 Gullar katalogi",
        "📞 Operator bilan aloqa",
      ],
    };
  }

  // 12. Bouquet Builder / Konstruktor
  if (/(konstruktor|o'zim|yig'|tayyorla|custom|maxsus guldasta)/i.test(query)) {
    return {
      text: `Ha, albatta! Saytimizda **"Guldasta Konstruktori"** bo‘limi bor 🎨✨\n\nU yerda:\n1. O‘zingiz yoqtirgan gullarni (pion, qizil/oq atirgul, gortenziya, tyulpan) donalab tanlaysiz.\n2. O‘rov qog‘ozini (blush pushti, hashamatli qora, krem yoki eko kraft) tanlaysiz.\n3. Ferrero shokoladi, ayiqcha va tabriknoma qo‘shishingiz mumkin.\n\nNarxi darhol hisoblanadi va barchasi sizning didingizga mos tayyorlanadi!`,
      suggestions: [
        "🌹 Tayyor guldastalarni ko'rish",
        "🚚 Samarqand bo'ylab yetkazish",
      ],
    };
  }

  // 13. Care tips / Gullarni parvarishlash
  if (/(parvarish|so'li|so'lib|uzoq turishi|suv|saqlash)/i.test(query)) {
    return {
      text: `Gullaringiz 10-14 kun yangidek turishi uchun oddiy floristik maslahatlar 💧:\n\n1. **Suvni yangilang:** Har 1-2 kunda sovuq toza suv quying.\n2. **Poyasini qiyalay kesing:** Vaza solishdan oldin poyasini 45° burchak ostida 1-2 sm qirqing.\n3. **Joyini to'g'ri tanlang:** To'g'ridan-to'g'ri quyosh nuri, konditsioner shamoli va mevalar yaqiniga qo'ymang.\n4. **Qutidagi gullar:** Gubkasiga har 2 kunda 50-100 ml sovuq suv quyib tursangiz kifoya!`,
      suggestions: [
        "🌹 Mashhur gullar",
        "📦 Qutidagi gullar",
      ],
    };
  }

  // 14. Specific Product Matching (nomi bo'yicha qidiruv)
  const matchedProduct = PRODUCTS.find((p) =>
    query.includes(p.name.toLowerCase()) ||
    p.description.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  );

  if (matchedProduct) {
    return {
      text: `Siz izlagan gul haqida ma'lumot 🌸:\n\n**${matchedProduct.name}**\n• Narxi: **${formatPrice(matchedProduct.price)}** ${matchedProduct.oldPrice ? `~~${formatPrice(matchedProduct.oldPrice)}~~` : ""}\n• Tarkibi: ${matchedProduct.composition}\n• O'lchami: Balandligi ${matchedProduct.height}, diametri ${matchedProduct.diameter}\n\n${matchedProduct.description}`,
      products: [matchedProduct],
      suggestions: [
        "🚚 Samarqand bo'ylab yetkazish",
        "💳 Qanday to'lasa bo'ladi?",
        "🌹 Boshqa gullarni ko'rish",
      ],
    };
  }

  // 15. Default helpful response
  return {
    text: `Savolingiz uchun tashakkur! 😊\n\nMen sizga Melfis Flower Shop gullari, narxlar, yetkazib berish hududlari va buyurtma berish bo'yicha ma'lumot bera olaman.\n\nQuyidagi mashhur savollardan birini tanlashingiz yoki to'g'ridan-to'g'ri floristimizga qo'ng'iroq qilishingiz mumkin:\n📞 [${SHOP_INFO.phoneDisplay}](tel:${SHOP_INFO.phone})`,
    suggestions: [
      "🌹 Eng mashhur gullar",
      "🚚 Yetkazib berish narxlari",
      "📍 Manzil va ish vaqti",
      "🎂 Tug'ilgan kunga tavsiya",
    ],
  };
}

