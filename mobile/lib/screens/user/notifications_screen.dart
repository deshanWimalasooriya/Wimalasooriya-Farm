import 'dart:convert';
import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../../theme/app_theme.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({Key? key}) : super(key: key);

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  List<dynamic> _notifications = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchNotifications();
  }

  Future<void> _fetchNotifications() async {
    try {
      final response = await ApiService.get('/notifications');
      if (response.statusCode == 200) {
        setState(() {
          _notifications = jsonDecode(response.body);
          _isLoading = false;
        });
      } else {
        setState(() => _isLoading = false);
      }
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  IconData _getIconForType(String type) {
    switch (type) {
      case 'ORDER_APPROVED':
        return Icons.check_circle;
      case 'ORDER_MESSAGE':
        return Icons.message;
      case 'NEW_ORDER':
        return Icons.shopping_basket;
      default:
        return Icons.notifications;
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator(color: AppTheme.primaryText));
    }

    if (_notifications.isEmpty) {
      return const Center(
        child: Text(
          'No recent notifications',
          style: TextStyle(color: AppTheme.secondaryText, fontSize: 16),
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _fetchNotifications,
      color: AppTheme.primaryText,
      child: ListView.builder(
        padding: const EdgeInsets.all(16.0),
        itemCount: _notifications.length,
        itemBuilder: (context, index) {
          final note = _notifications[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              leading: Icon(
                _getIconForType(note['type'] ?? ''),
                color: AppTheme.primaryAction,
              ),
              title: Text(
                note['message'] ?? 'Notification',
                style: const TextStyle(
                  color: AppTheme.primaryText,
                  fontWeight: FontWeight.bold,
                ),
              ),
              subtitle: Text(
                note['createdAt'] != null
                    ? DateTime.parse(note['createdAt']).toLocal().toString().split('.')[0]
                    : '',
                style: const TextStyle(color: AppTheme.secondaryText),
              ),
            ),
          );
        },
      ),
    );
  }
}
