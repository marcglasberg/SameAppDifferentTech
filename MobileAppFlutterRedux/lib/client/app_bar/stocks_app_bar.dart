import 'package:async_redux/async_redux.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app_flutter_redux/business/state/app_state.dart';
import 'package:mobile_app_flutter_redux/client/app_bar/ACTION_navigate_to_config_screen.dart';

class StocksAppBar extends StatelessWidget implements PreferredSizeWidget {
  static const kToolbarHeight = 56.0;

  const StocksAppBar({super.key});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      title: const Text('Stocks App Demo'),
      actions: [
        _settingsIconButton(context),
      ],
    );
  }

  IconButton _settingsIconButton(BuildContext context) {
    return IconButton(
      icon: const Icon(Icons.settings),
      tooltip: 'Open configuration screen',
      onPressed: () {
        StoreProvider.of<AppState>(context, this).dispatch(NavigateToConfigScreen_Action());
      },
    );
  }

  @override
  Size get preferredSize => const Size(double.infinity, kToolbarHeight);
}
