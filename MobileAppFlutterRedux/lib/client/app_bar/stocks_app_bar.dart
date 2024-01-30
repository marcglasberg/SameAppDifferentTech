import 'package:flutter/material.dart';

class StocksAppBar extends StatelessWidget implements PreferredSizeWidget {
  static const kToolbarHeight = 56.0;

  const StocksAppBar({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return AppBar(title: const Text('Stocks App Demo'));
  }

  @override
  Size get preferredSize => const Size(double.infinity, kToolbarHeight);
}
