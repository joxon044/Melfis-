import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/product.dart';

class ApiService {
  static const String baseUrl = 'https://melfis.vercel.app';
  static const String botApiKey = 'melfis_live_key_9f8e7d6c5b4a3210';

  // 1. Mahsulotlarni serverdan yuklash
  static Future<List<Product>> fetchProducts() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/bot/products'),
        headers: {'x-api-key': botApiKey},
      ).timeout(const Duration(seconds: 8));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final List list = data['products'] ?? [];
        return list.map((json) => Product.fromJson(json)).toList();
      }
    } catch (_) {
      // Server javob bermasa yoki oflayn bo'lsa, zaxira ma'lumotlar qaytariladi
    }
    return sampleProducts;
  }

  // 2. Yangi buyurtma yuborish
  static Future<bool> createOrder({
    required String name,
    required String phone,
    required String address,
    required String deliveryDate,
    required List<Map<String, dynamic>> items,
    required int subtotal,
    required int deliveryFee,
    required int totalPrice,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/orders'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'customerName': name,
          'phone': phone,
          'district': 'Samarqand sh.',
          'address': address,
          'deliveryDate': deliveryDate,
          'paymentMethod': 'cash',
          'subtotal': subtotal,
          'deliveryFee': deliveryFee,
          'totalPrice': totalPrice,
          'items': items,
        }),
      ).timeout(const Duration(seconds: 10));

      return response.statusCode == 200 || response.statusCode == 201;
    } catch (_) {
      return false;
    }
  }
}

