# Melfis Flower Shop

React va Vite asosidagi gul do‘koni. Sayt Vercel’da, API esa Vercel serverless functions orqali ishlaydi. Buyurtmalar va akkauntlar PostgreSQL’da saqlanadi.

## Ishga tushirish

```sh
npm install
npm run dev
```

Faqat Vite dev server frontendni ishga tushiradi. API bilan lokal integratsiyani sinash uchun Vercel CLI, `DATABASE_URL` va ishga tushirilgan schema kerak:

```sh
vercel dev
```

## PostgreSQL sozlash

1. PostgreSQL provider’da ma’lumotlar bazasi yarating.
2. `db/schema.sql` faylining SQL’ini provider’ning SQL console’ida bir marta ishga tushiring.
3. Vercel project settings’da `DATABASE_URL` environment variable qo‘shing. `.env.example` faqat format namunasi; haqiqiy parol yoki URL’ni repoga qo‘shmang.
4. Vercel’ga deploy qiling. `api/` ichidagi funksiyalar `/api/...` manzillarida ishlaydi.

## Admin akkaunt

Avval sayt orqali oddiy mijoz akkaunti yarating. So‘ng PostgreSQL console’da faqat shu email uchun rolni o‘zgartiring:

```sql
UPDATE users
SET role = 'admin'
WHERE email = LOWER('admin@example.com');
```

`admin@example.com` o‘rniga akkauntning email manzilini yozing. Admin akkauntga qayta kirgandan so‘ng navbar’dagi akkaunt belgisidan admin buyurtmalar paneli ochiladi.

## API imkoniyatlari

- `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- `GET /api/orders` va `POST /api/orders` — akkaunt orqali buyurtmalar tarixi va yangi buyurtma
- `GET /api/admin/orders` va `PATCH /api/admin/orders/:id` — admin buyurtmalarni ko‘rish va holatini yangilash

Buyurtma narxlari serverda qayta hisoblanadi. Login sessiyasi HttpOnly cookie’da saqlanadi; admin huquqi bazadagi `users.role` orqali tekshiriladi.

## Android va iPhone ilovalari

Ilova Capacitor orqali yaratiladi va `https://melfis.vercel.app` API’siga ulanadi. Domenni almashtirish kerak bo‘lsa, builddan oldin `VITE_API_BASE_URL` ni yangi HTTPS asosiy domeniga (`/api` qo‘shmasdan) o‘rnating.

Android Studio va Android SDK o‘rnatilgan kompyuterda:

```powershell
$env:VITE_API_BASE_URL="https://melfis.vercel.app"
npm run mobile:android
```

Xcode o‘rnatilgan macOS’da iPhone ilovasini build qilish:

```sh
export VITE_API_BASE_URL="https://melfis.vercel.app"
npm run mobile:ios
```

Bu buyruqlar frontend’ni build qilib, Capacitor platforma loyihalariga sync qiladi va Android Studio yoki Xcode’ni ochadi. Android APK/AAB’ni Android Studio’dan, iOS arxivini Xcode’dan chiqarish mumkin. iPhone ilovasini build qilish va simulator yoki qurilmada ishga tushirish uchun macOS hamda Xcode kerak. API CORS ruxsati faqat Capacitor’ning `https://localhost` manziliga beriladi; boshqa sayt manzillariga ruxsat qo‘shilmaydi.

`assets/logo.png` — Android/iOS ilovalarining ikonka va splash screen tasvirlari uchun manba. PWA ikonkalari `public/icons/` ichida.
