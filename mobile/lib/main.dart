import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'theme/app_theme.dart';
import 'providers/auth_provider.dart';
import 'screens/auth/login_screen.dart';
import 'screens/user/user_dashboard.dart';
import 'screens/admin/admin_dashboard.dart';

void main() {
  runApp(const ProviderScope(child: WimalasooriyaFarmApp()));
}

class WimalasooriyaFarmApp extends ConsumerWidget {
  const WimalasooriyaFarmApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);

    return MaterialApp(
      title: 'Wimalasooriya Farm',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.theme,
      home: authState.user == null
          ? const LoginScreen()
          : (authState.user!.role == 'admin'
              ? const AdminDashboard()
              : const UserDashboard()),
    );
  }
}
