import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/cart.dart';
import '../services/api_service.dart';
import '../theme/app_theme.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _addressController = TextEditingController();
  bool _isLoading = false;

  void _submitOrder(BuildContext context, CartProvider cart) async {
    if (cart.items.isEmpty) return;
    if (_nameController.text.trim().isEmpty || _phoneController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Iltimos, ismingiz va telefon raqamingizni kiriting.")),
      );
      return;
    }

    setState(() => _isLoading = true);

    final success = await ApiService.createOrder(
      name: _nameController.text.trim(),
      phone: _phoneController.text.trim(),
      address: _addressController.text.trim().isEmpty ? 'Samarqand' : _addressController.text.trim(),
      deliveryDate: 'Bugun tezkor',
      items: cart.items.map((e) => {
        'id': e.product.id,
        'name': e.product.name,
        'price': e.product.price,
        'quantity': e.quantity,
      }).toList(),
      subtotal: cart.subtotal,
      deliveryFee: cart.deliveryFee,
      totalPrice: cart.totalPrice,
    );

    setState(() => _isLoading = false);

    if (!mounted) return;

    if (success) {
      cart.clearCart();
      showDialog(
        context: context,
        builder: (ctx) => AlertDialog(
          backgroundColor: AppTheme.background,
          title: const Text("🌸 Buyurtmangiz qabul qilindi!", style: TextStyle(color: AppTheme.primary, fontWeight: FontWeight.bold)),
          content: const Text("Tez orada operatorimiz siz bilan bog'lanadi. Melfis xizmatini tanlaganingiz uchun rahmat!"),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(ctx);
                Navigator.pop(context);
              },
              child: const Text("Tushundim", style: TextStyle(color: AppTheme.primary, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Buyurtma yuborishda xatolik yuz berdi. Internetni tekshiring.")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final cart = Provider.of<CartProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text("Savatcha"),
        actions: [
          if (cart.items.isNotEmpty)
            IconButton(
              icon: const Icon(CupertinoIcons.trash, size: 20),
              onPressed: () => cart.clearCart(),
            ),
        ],
      ),
      body: cart.items.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(CupertinoIcons.cart, size: 64, color: AppTheme.textMuted.withOpacity(0.4)),
                  const SizedBox(height: 16),
                  const Text("Savatchangiz bo'sh", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.primary)),
                  const SizedBox(height: 6),
                  const Text("Katalogdan o'zingiz yoqtirgan gullarni tanlang", style: TextStyle(fontSize: 13, color: AppTheme.textMuted)),
                ],
              ),
            )
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // List of items
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: cart.items.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final item = cart.items[index];
                      return Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 8, offset: const Offset(0, 3)),
                          ],
                        ),
                        child: Row(
                          children: [
                            ClipRRect(
                              borderRadius: BorderRadius.circular(12),
                              child: Image.network(
                                item.product.image,
                                width: 70,
                                height: 70,
                                fit: BoxFit.cover,
                              ),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    item.product.name,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.primary),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    "${item.product.price} so'm",
                                    style: const TextStyle(color: AppTheme.accentRose, fontWeight: FontWeight.w600, fontSize: 13),
                                  ),
                                ],
                              ),
                            ),
                            Row(
                              children: [
                                IconButton(
                                  icon: const Icon(CupertinoIcons.minus_circle, size: 22, color: AppTheme.primary),
                                  onPressed: () => cart.updateQuantity(item.product.id, item.quantity - 1),
                                ),
                                Text("${item.quantity}", style: const TextStyle(fontWeight: FontWeight.bold)),
                                IconButton(
                                  icon: const Icon(CupertinoIcons.plus_circle, size: 22, color: AppTheme.primary),
                                  onPressed: () => cart.updateQuantity(item.product.id, item.quantity + 1),
                                ),
                              ],
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 24),

                  // Order Details Input Form
                  Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10)],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text("Yetkazib berish ma'lumotlari", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.primary)),
                        const SizedBox(height: 14),
                        TextField(
                          controller: _nameController,
                          decoration: InputDecoration(
                            labelText: "Ismingiz *",
                            prefixIcon: const Icon(CupertinoIcons.person, size: 20),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        ),
                        const SizedBox(height: 12),
                        TextField(
                          controller: _phoneController,
                          keyboardType: TextInputType.phone,
                          decoration: InputDecoration(
                            labelText: "Telefon raqamingiz *",
                            prefixIcon: const Icon(CupertinoIcons.phone, size: 20),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        ),
                        const SizedBox(height: 12),
                        TextField(
                          controller: _addressController,
                          decoration: InputDecoration(
                            labelText: "Manzil (Samarqand bo'ylab)",
                            prefixIcon: const Icon(CupertinoIcons.location, size: 20),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Price breakdown
                  Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.between,
                          children: [
                            const Text("Gullar narxi:"),
                            Text("${cart.subtotal} so'm", style: const TextStyle(fontWeight: FontWeight.w600)),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.between,
                          children: [
                            const Text("Yetkazib berish:"),
                            Text("${cart.deliveryFee} so'm", style: const TextStyle(fontWeight: FontWeight.w600)),
                          ],
                        ),
                        const Divider(height: 24),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.between,
                          children: [
                            const Text("JAMI TO‘LOV:", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.primary)),
                            Text("${cart.totalPrice} so'm", style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 17, color: AppTheme.accentRose)),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Checkout button
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      onPressed: _isLoading ? null : () => _submitOrder(context, cart),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primary,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                      ),
                      child: _isLoading
                          ? const CircularProgressIndicator(color: Colors.white)
                          : const Text("Buyurtmani tasdiqlash", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                    ),
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
    );
  }
}

