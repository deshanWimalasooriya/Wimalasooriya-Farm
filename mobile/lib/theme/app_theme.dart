import 'package:flutter/material.dart';

class AppTheme {
  // Color Palette
  static const Color background = Color(0xFFEBEBEB);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color primaryText = Color(0xFF013547);
  static const Color secondaryText = Color(0xFF6C6F6E);
  static const Color border = Color(0xFFD0D8DF);
  static const Color primaryAction = Color(0xFFDDBA9B);

  static ThemeData get theme {
    return ThemeData(
      scaffoldBackgroundColor: background,
      primaryColor: primaryAction,
      appBarTheme: const AppBarTheme(
        backgroundColor: surface,
        foregroundColor: primaryText,
        elevation: 0,
        iconTheme: IconThemeData(color: primaryText),
        titleTextStyle: TextStyle(
          color: primaryText,
          fontSize: 20,
          fontWeight: FontWeight.bold,
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: surface,
        selectedItemColor: primaryText,
        unselectedItemColor: secondaryText,
        elevation: 8,
      ),
      cardTheme: const CardThemeData(
        color: surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(12)),
          side: BorderSide(color: border, width: 1),
        ),
        elevation: 0,
      ),
      iconTheme: const IconThemeData(
        color: primaryText,
      ),
      textTheme: const TextTheme(
        bodyLarge: TextStyle(color: primaryText, fontSize: 16),
        bodyMedium: TextStyle(color: secondaryText, fontSize: 14),
        titleLarge: TextStyle(color: primaryText, fontSize: 22, fontWeight: FontWeight.bold),
      ),
    );
  }
}
