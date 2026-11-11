import 'package:flutter/foundation.dart';
import 'product.dart';

class CartItem {
  final Product product;
  int quantity;

  CartItem({required this.product, this.quantity = 1});

  int get totalPrice => product.price * quantity;
}

class CartProvider extends ChangeNotifier {
  final List<CartItem> _items = [];

  List<CartItem> get items => _items;

  int get totalCount => _items.fold(0, (sum, item) => sum + item.quantity);

  int get subtotal => _items.fold(0, (sum, item) => sum + item.totalPrice);

  int get deliveryFee => 30000;

  int get totalPrice => subtotal + (items.isEmpty ? 0 : deliveryFee);

  void addToCart(Product product, {int qty = 1}) {
    final index = _items.indexWhere((element) => element.product.id == product.id);
    if (index >= 0) {
      _items[index].quantity += qty;
    } else {
      _items.add(CartItem(product: product, quantity: qty));
    }
    notifyListeners();
  }

  void removeFromCart(int productId) {
    _items.removeWhere((item) => item.product.id == productId);
    notifyListeners();
  }

  void updateQuantity(int productId, int qty) {
    final index = _items.indexWhere((item) => item.product.id == productId);
    if (index >= 0) {
      if (qty <= 0) {
        _items.removeAt(index);
      } else {
        _items[index].quantity = qty;
      }
      notifyListeners();
    }
  }

  void clearCart() {
    _items.clear();
    notifyListeners();
  }
}

