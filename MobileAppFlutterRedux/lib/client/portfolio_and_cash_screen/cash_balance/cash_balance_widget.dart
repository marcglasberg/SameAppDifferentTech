import 'package:assorted_layout_widgets/assorted_layout_widgets.dart';
import 'package:async_redux/async_redux.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app_flutter_redux/client/infra/app_state.dart';
import 'package:mobile_app_flutter_redux/client/infra/theme/app_themes.dart';
import 'package:themed/themed.dart';

import '../portfolio_and_cash_screen.i18n.dart';
import 'ACTION_add_cash.dart';
import 'ACTION_remove_cash.dart';

class CashBalanceWidget extends StatefulWidget {
  const CashBalanceWidget();

  static var textStyle = Font.medium + AppColor.text;

  @override
  State<CashBalanceWidget> createState() => _CashBalanceWidgetState();
}

class _CashBalanceWidgetState extends State<CashBalanceWidget> {
  @override
  Widget build(BuildContext context) {
    final cashBalance = context.select((st) => st.portfolio.cashBalance);

    return Box(
      padding: const Pad(top: 12, left: 16, right: 3),
      width: double.infinity,
      child: Row(
        children: [
          Expanded(
            child: Text(
              'Cash Balance:'.i18n + ' $cashBalance',
              style: CashBalanceWidget.textStyle,
            ),
          ),
          _addButton(),
          _removeButton(),
        ],
      ),
    );
  }

  CircleButton _removeButton() {
    return CircleButton(
      backgroundColor: AppColor.buttonRed,
      clickAreaMargin: const Pad(all: 3.0, left: 3.5, right: 5, vertical: 4),
      tapColor: AppColor.buttonRed.lighter(0.2),
      icon: const Icon(Icons.remove, color: Colors.white),
      onTap: () => context.dispatch(RemoveCash(100)),
    );
  }

  CircleButton _addButton() {
    return CircleButton(
      backgroundColor: AppColor.buttonGreen,
      clickAreaMargin: const Pad(all: 3.0, left: 6, vertical: 4),
      tapColor: AppColor.buttonGreen.lighter(0.2),
      icon: const Icon(Icons.add, color: Colors.white),
      onTap: () => context.dispatch(AddCash(100)),
    );
  }
}
