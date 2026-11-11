import 'package:flutter/material.dart';

class AppTheme {
  static const Color background = Color(0xFFFAF7F2);
  static const Color primary = Color(0xFF1C3F3A);
  static const Color primaryDark = Color(0xFF142E2A);
  static const Color accentRose = Color(0xFFE11D48);
  static const Color accentGold = Color(0xFFD97706);
  static const Color cardBg = Colors.white;
  static const Color textDark = Color(0xFF1A1818);
  static const Color textMuted = Color(0xFF78716C);

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: background,
      primaryColor: primary,
      colorScheme: ColorScheme.light(
        primary: primary,
        secondary: accentRose,
        surface: cardBg,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: background,
        elevation: 0,
        centerTitle: true,
        iconTheme: IconThemeData(color: primary),
        titleTextStyle: TextStyle(
          color: primary,
          fontSize: 18,
          fontWeight: FontWeight.bold,
          letterSpacing: -0.2,
        ),
      ),
    );
  }
}

