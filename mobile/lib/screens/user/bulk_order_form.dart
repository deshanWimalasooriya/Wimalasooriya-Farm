import 'dart:convert';
import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/custom_text_field.dart';
import '../../theme/app_theme.dart';

class BulkOrderForm extends StatefulWidget {
  const BulkOrderForm({Key? key}) : super(key: key);

  @override
  State<BulkOrderForm> createState() => _BulkOrderFormState();
}

class _BulkOrderFormState extends State<BulkOrderForm> {
  final _productController = TextEditingController();
  final _quantityController = TextEditingController();
  final _notesController = TextEditingController();
  bool _isLoading = false;

  void _submitOrder() async {
    if (_productController.text.isEmpty || _quantityController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill all required fields')),
      );
      return;
    }

    setState(() => _isLoading = true);
    try {
      final response = await ApiService.post('/farm/orders', {
        'product': _productController.text,
        'quantity': int.tryParse(_quantityController.text) ?? 0,
        'notes': _notesController.text,
      });

      if (response.statusCode == 201) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Order submitted successfully!')),
          );
          _productController.clear();
          _quantityController.clear();
          _notesController.clear();
        }
      } else {
        throw Exception('Failed to submit order');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: ${e.toString()}')),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Submit Bulk Order',
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: AppTheme.primaryText,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Request items directly from the farm administration.',
            style: TextStyle(color: AppTheme.secondaryText),
          ),
          const SizedBox(height: 24),
          CustomTextField(
            label: 'Product Name',
            controller: _productController,
            hint: 'e.g., Organic Fertilizer (50kg)',
          ),
          const SizedBox(height: 16),
          CustomTextField(
            label: 'Quantity',
            controller: _quantityController,
            keyboardType: TextInputType.number,
            hint: 'e.g., 10',
          ),
          const SizedBox(height: 16),
          CustomTextField(
            label: 'Additional Notes',
            controller: _notesController,
            maxLines: 4,
            hint: 'Special requirements...',
          ),
          const SizedBox(height: 32),
          CustomButton(
            text: 'Submit Request',
            isLoading: _isLoading,
            onPressed: _submitOrder,
          ),
        ],
      ),
    );
  }
}
