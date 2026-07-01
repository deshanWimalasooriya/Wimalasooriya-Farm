import 'dart:convert';
import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../../theme/app_theme.dart';
import '../../widgets/order_card.dart';
import '../../widgets/custom_text_field.dart';

class AdminOrdersView extends StatefulWidget {
  const AdminOrdersView({Key? key}) : super(key: key);

  @override
  State<AdminOrdersView> createState() => _AdminOrdersViewState();
}

class _AdminOrdersViewState extends State<AdminOrdersView> {
  List<dynamic> _orders = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchOrders();
  }

  Future<void> _fetchOrders() async {
    try {
      final response = await ApiService.get('/admin/orders');
      if (response.statusCode == 200) {
        setState(() {
          _orders = jsonDecode(response.body);
          _isLoading = false;
        });
      } else {
        setState(() => _isLoading = false);
      }
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  void _approveOrder(String orderId) async {
    try {
      final response = await ApiService.put('/admin/orders/$orderId/approve', {});
      if (response.statusCode == 200) {
        _fetchOrders(); // Refresh the list
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Order approved successfully!')));
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    }
  }

  void _showRejectDialog(String orderId) {
    final reasonController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Reject or Message User', style: TextStyle(color: AppTheme.primaryText)),
          backgroundColor: AppTheme.surface,
          content: CustomTextField(
            label: 'Reason for rejection / Message',
            controller: reasonController,
            maxLines: 3,
            hint: 'E.g., Out of stock currently...',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel', style: TextStyle(color: AppTheme.secondaryText)),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
              onPressed: () async {
                Navigator.pop(context);
                try {
                  final response = await ApiService.put('/admin/orders/$orderId/reject', {
                    'message': reasonController.text,
                  });
                  if (response.statusCode == 200) {
                    _fetchOrders();
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Order rejected & message sent!')));
                    }
                  }
                } catch (e) {
                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
                  }
                }
              },
              child: const Text('Confirm Reject', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator(color: AppTheme.primaryText));
    }

    if (_orders.isEmpty) {
      return const Center(
        child: Text('No pending orders found.', style: TextStyle(color: AppTheme.secondaryText, fontSize: 16)),
      );
    }

    return RefreshIndicator(
      onRefresh: _fetchOrders,
      color: AppTheme.primaryText,
      child: ListView.builder(
        padding: const EdgeInsets.all(16.0),
        itemCount: _orders.length,
        itemBuilder: (context, index) {
          final order = _orders[index];
          final String status = order['status'] ?? 'pending';
          final String productDetails = order['product'] != null 
              ? '${order['quantity']}x ${order['product']}'
              : 'Unknown Product';

          return OrderCard(
            orderId: order['_id'] ?? 'N/A',
            status: status,
            date: productDetails, // Displaying product details in the date field for now
            actionWidget: status.toLowerCase() == 'pending' ? Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton(
                  onPressed: () => _showRejectDialog(order['_id']),
                  child: const Text('Reject', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
                ),
                const SizedBox(width: 8),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
                  onPressed: () => _approveOrder(order['_id']),
                  child: const Text('Approve', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                ),
              ],
            ) : null,
          );
        },
      ),
    );
  }
}
