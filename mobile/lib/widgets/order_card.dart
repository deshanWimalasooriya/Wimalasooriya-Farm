import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class OrderCard extends StatelessWidget {
  final String orderId;
  final String status;
  final String date;
  final VoidCallback? onTap;
  final Widget? actionWidget;

  const OrderCard({
    Key? key,
    required this.orderId,
    required this.status,
    required this.date,
    this.onTap,
    this.actionWidget,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Card(
        margin: const EdgeInsets.only(bottom: 12),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Order #$orderId',
                    style: const TextStyle(
                      color: AppTheme.primaryText,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: _getStatusColor(status).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(4),
                      border: Border.all(color: _getStatusColor(status)),
                    ),
                    child: Text(
                      status.toUpperCase(),
                      style: TextStyle(
                        color: _getStatusColor(status),
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.calendar_today, size: 14, color: AppTheme.secondaryText),
                  const SizedBox(width: 4),
                  Text(
                    date,
                    style: const TextStyle(color: AppTheme.secondaryText, fontSize: 14),
                  ),
                ],
              ),
              if (actionWidget != null) ...[
                const SizedBox(height: 16),
                const Divider(color: AppTheme.border),
                const SizedBox(height: 8),
                actionWidget!,
              ]
            ],
          ),
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return Colors.orange;
      case 'approved':
        return Colors.green;
      case 'rejected':
        return Colors.red;
      default:
        return AppTheme.secondaryText;
    }
  }
}
