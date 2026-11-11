class Product {
  final int id;
  final String name;
  final String category;
  final String occasion;
  final int price;
  final int? oldPrice;
  final String? badge;
  final String image;
  final String description;
  final int inStock;
  final List<String> composition;

  Product({
    required this.id,
    required this.name,
    required this.category,
    required this.occasion,
    required this.price,
    this.oldPrice,
    this.badge,
    required this.image,
    required this.description,
    this.inStock = 10,
    this.composition = const [],
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      category: json['category'] ?? 'all',
      occasion: json['occasion'] ?? 'Barchasi',
      price: json['price'] ?? 0,
      oldPrice: json['oldPrice'],
      badge: json['badge'],
      image: json['image'] ?? 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9',
      description: json['description'] ?? '',
      inStock: json['inStock'] ?? 10,
      composition: List<String>.from(json['composition'] ?? []),
    );
  }
}

// Boshlang'ich mahsulotlar (Offline holatida ham ko'rinishi uchun)
final List<Product> sampleProducts = [
  Product(
    id: 1,
    name: "Melfis Royal Peony Dream",
    category: "peonies",
    occasion: "Sevgi & Romantika",
    price: 680000,
    oldPrice: 750000,
    badge: "TOP HIT",
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80",
    description: "19 ta nozik pushti Gollandiya pioni, evkalipt barglari va premium ipak lentalar.",
  ),
  Product(
    id: 2,
    name: "Madam Bombastic Premium",
    category: "roses",
    occasion: "Tug'ilgan kun",
    price: 520000,
    badge: "YANGI",
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80",
    description: "25 ta xushbo'y buta atirgullari, nozik oq qadoqda.",
  ),
  Product(
    id: 3,
    name: "Samarqand Bahori Miks",
    category: "mix",
    occasion: "Minnatdorchilik",
    price: 450000,
    image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80",
    description: "Pion, xrizantema, gortenziya va mavsumiy yovvoyi gullar uyg'unligi.",
  ),
  Product(
    id: 4,
    name: "Red Naomi 51 ta Atirgul",
    category: "roses",
    occasion: "Sevgi & Romantika",
    price: 1100000,
    oldPrice: 1250000,
    badge: "PREMIUM",
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80",
    description: "51 ta qizil Ekvador atirgullari, 70 sm uzunlikda.",
  ),
];

