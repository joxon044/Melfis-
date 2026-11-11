import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/product.dart';
import '../models/cart.dart';
import '../services/api_service.dart';
import '../theme/app_theme.dart';
import 'cart_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<Product> _products = sampleProducts;
  String _selectedCategory = 'all';
  bool _isLoading = false;

  final List<Map<String, String>> _categories = [
    {'id': 'all', 'name': 'Barchasi'},
    {'id': 'peonies', 'name': 'Pionlar'},
    {'id': 'roses', 'name': 'Atirgullar'},
    {'id': 'mix', 'name': 'Mikslar'},
  ];

  @override
  void initState() {
    super.initState();
    _loadProducts();
  }

  void _loadProducts() async {
    setState(() => _isLoading = true);
    final items = await ApiService.fetchProducts();
    if (mounted) {
      setState(() {
        _products = items;
        _isLoading = false;
      });
    }
  }

  List<Product> get _filteredProducts {
    if (_selectedCategory == 'all') return _products;
    return _products.where((p) => p.category == _selectedCategory).toList();
  }

  @override
  Widget build(BuildContext context) {
    final cart = Provider.of<CartProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: AppTheme.primary,
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(CupertinoIcons.sparkles, color: Colors.white, size: 14),
            ),
            const SizedBox(width: 8),
            const Text("MELFIS FLOWERS"),
          ],
        ),
        actions: [
          Stack(
            children: [
              IconButton(
                icon: const Icon(CupertinoIcons.bag, size: 24),
                onPressed: () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const CartScreen()));
                },
              ),
              if (cart.totalCount > 0)
                Positioned(
                  right: 8,
                  top: 8,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(
                      color: AppTheme.accentRose,
                      shape: BoxShape.circle,
                    ),
                    child: Text(
                      "${cart.totalCount}",
                      style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async => _loadProducts(),
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. Hero Banner Card (Ixcham va nafis dizayn)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [AppTheme.primary, AppTheme.primaryDark],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(color: AppTheme.primary.withOpacity(0.25), blurRadius: 15, offset: const Offset(0, 6)),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(CupertinoIcons.star_fill, color: AppTheme.accentGold, size: 12),
                          SizedBox(width: 5),
                          Text("Samarqandda №1 gullar uyi", style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w500)),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      "Nafis va Premium\nGullar Dunyosi",
                      style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold, height: 1.2),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      "Samarqand bo'ylab 24/7 tezkor yetkazib berish bilan eng sara guldastalar.",
                      style: TextStyle(color: Colors.white.withOpacity(0.85), fontSize: 13),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        _buildStatPill("24/7 Ochiq"),
                        const SizedBox(width: 8),
                        _buildStatPill("3 000+ Mijoz"),
                        const SizedBox(width: 8),
                        _buildStatPill("30 daq. yetkazish"),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // 2. Categories Filter
              SizedBox(
                height: 38,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: _categories.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 8),
                  itemBuilder: (context, index) {
                    final cat = _categories[index];
                    final isSelected = _selectedCategory == cat['id'];
                    return ChoiceChip(
                      label: Text(cat['name']!),
                      selected: isSelected,
                      selectedColor: AppTheme.primary,
                      backgroundColor: Colors.white,
                      labelStyle: TextStyle(
                        color: isSelected ? Colors.white : AppTheme.textDark,
                        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                        fontSize: 13,
                      ),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20), side: BorderSide(color: Colors.stone.shade200)),
                      onSelected: (_) {
                        setState(() => _selectedCategory = cat['id']!);
                      },
                    );
                  },
                ),
              ),
              const SizedBox(height: 20),

              // 3. Products Grid Header
              Row(
                mainAxisAlignment: MainAxisAlignment.between,
                children: [
                  const Text("Saralangan guldastalar", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.primary)),
                  Text("${_filteredProducts.length} ta gul", style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                ],
              ),
              const SizedBox(height: 12),

              // 4. Products Grid
              _isLoading
                  ? const Center(child: Padding(padding: EdgeInsets.all(40), child: CircularProgressIndicator()))
                  : GridView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: _filteredProducts.length,
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        crossAxisSpacing: 12,
                        mainAxisSpacing: 14,
                        childAspectRatio: 0.68,
                      ),
                      itemBuilder: (context, index) {
                        final product = _filteredProducts[index];
                        return _buildProductCard(context, product, cart);
                      },
                    ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatPill(String title) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.12),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(title, style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w500)),
    );
  }

  Widget _buildProductCard(BuildContext context, Product product, CartProvider cart) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 4)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Image + Badge
          Stack(
            children: [
              ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(18)),
                child: Image.network(
                  product.image,
                  height: 135,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
              ),
              if (product.badge != null)
                Positioned(
                  top: 8,
                  left: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                    decoration: BoxDecoration(
                      color: AppTheme.accentRose,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      product.badge!,
                      style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
            ],
          ),

          // Content
          Padding(
            padding: const EdgeInsets.all(10.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  product.name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.primary),
                ),
                const SizedBox(height: 2),
                Text(
                  product.description,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontSize: 10, color: AppTheme.textMuted),
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "${product.price} so'm",
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppTheme.accentRose),
                        ),
                        if (product.oldPrice != null)
                          Text(
                            "${product.oldPrice} so'm",
                            style: const TextStyle(fontSize: 9, color: AppTheme.textMuted, decoration: TextDecoration.lineThrough),
                          ),
                      ],
                    ),
                    InkWell(
                      onTap: () {
                        cart.addToCart(product);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text("${product.name} savatchaga qo'shildi!"),
                            duration: const Duration(seconds: 1),
                          ),
                        );
                      },
                      child: Container(
                        padding: const EdgeInsets.all(7),
                        decoration: BoxDecoration(
                          color: AppTheme.primary,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(CupertinoIcons.plus, color: Colors.white, size: 14),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

