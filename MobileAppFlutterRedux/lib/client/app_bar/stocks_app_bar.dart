import 'package:async_redux/async_redux.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app_flutter_redux/client/app_bar/ACTION_navigate_to_screen.dart';
import 'package:mobile_app_flutter_redux/client/infra/theme/app_themes.dart';
import 'package:themed/themed.dart';

import '../infra/app_state.dart';
import 'stocks_app_bar.i18n.dart';

class SimpleAppBar extends StatelessWidget implements PreferredSizeWidget {
  //
  static const kToolbarHeight = 56.0;

  final String title;

  const SimpleAppBar({
    super.key,
    required this.title,
  });

  Widget? iconButton(BuildContext context) {
    return null;
  }

  @override
  Widget build(BuildContext context) {
    Widget? iconButton = this.iconButton(context);

    return AppBar(
      title: Text(title, style: Font.medium + AppColor.white),
      backgroundColor: AppColor.darkGreen,
      actions: [
        if (iconButton != null) iconButton,
      ],
    );
  }

  @override
  Size get preferredSize => const Size(double.infinity, kToolbarHeight);
}

class StocksAppBar extends SimpleAppBar {
  //
  StocksAppBar({super.key}) : super(title: 'Stocks App Demo'.i18n);

  @override
  Widget iconButton(BuildContext context) {
    return IconButton(
      icon: const Icon(Icons.settings, color: AppColor.white),
      tooltip: 'Open configuration screen',
      onPressed: () {
        print(context.state.availableStocks);
        context.dispatch(NavigateToConfigScreen_Action());
      },
    );
  }
}
