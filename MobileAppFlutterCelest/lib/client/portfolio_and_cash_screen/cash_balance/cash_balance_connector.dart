import 'package:assorted_layout_widgets/assorted_layout_widgets.dart';
import 'package:async_redux/async_redux.dart';
import 'package:celest_backend/my_src/models/cash_balance.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app_flutter_celest/client/infra/app_state.dart';
import 'package:mobile_app_flutter_celest/client/infra/basic/app_vm_factory.dart';
import 'package:mobile_app_flutter_celest/client/infra/theme/app_themes.dart';
import 'package:themed/themed.dart';

import '../portfolio_and_cash_screen.i18n.dart';
import 'ACTION_add_cash.dart';
import 'ACTION_remove_cash.dart';

class CashBalance_Connector extends StatelessWidget {
  //
  const CashBalance_Connector();

  @override
  Widget build(BuildContext context) => StoreConnector<AppState, _Vm>(
        vm: () => _Factory(),
        builder: (context, vm) {
          return CashBalanceWidget(
            cashBalance: vm.cashBalance,
            onAddCash: vm.onAddCash,
            onRemoveCash: vm.onRemoveCash,
            isWaiting: vm.isWaiting,
          );
        },
      );
}

class _Factory extends AppVmFactory {
  @override
  _Vm fromStore() => _Vm(
        cashBalance: state.portfolio.cashBalance,
        onAddCash: _onAddCash,
        onRemoveCash: _onRemoveCash,
        isWaiting: _isWaiting(),
      );

  void _onAddCash() => dispatch(AddCash_Action(100));

  void _onRemoveCash() => dispatch(RemoveCash_Action(100));

  bool _isWaiting() =>
      state.wait.isWaitingForType<AddCash_Action>() ||
      state.wait.isWaitingForType<RemoveCash_Action>();
}

class _Vm extends Vm {
  //
  final CashBalance cashBalance;
  final VoidCallback onAddCash, onRemoveCash;
  final bool isWaiting;

  _Vm({
    required this.cashBalance,
    required this.onAddCash,
    required this.onRemoveCash,
    required this.isWaiting,
  }) : super(equals: [
          cashBalance,
          isWaiting,
        ]);
}

class CashBalanceWidget extends StatelessWidget {
  //
  static var textStyle = Font.medium + AppColor.text;

  final CashBalance cashBalance;
  final VoidCallback onAddCash, onRemoveCash;
  final bool isWaiting;

  CashBalanceWidget({
    super.key,
    required this.cashBalance,
    required this.onAddCash,
    required this.onRemoveCash,
    required this.isWaiting,
  });

  @override
  Widget build(BuildContext context) {
    return Box(
      padding: const Pad(top: 12, left: 16, right: 3),
      width: double.infinity,
      child: Row(
        children: [
          Expanded(child: Text('Cash Balance:'.i18n + ' $cashBalance', style: textStyle)),
          _addButton(),
          _removeButton(),
        ],
      ),
    );
  }

  CircleButton _addButton() {
    return CircleButton(
      backgroundColor: isWaiting ? AppColor.disabledGray : AppColor.buttonGreen,
      clickAreaMargin: const Pad(all: 3.0, left: 6, vertical: 4),
      tapColor: isWaiting ? AppColor.disabledGray : AppColor.buttonGreen.lighter(0.2),
      icon: const Icon(Icons.add, color: AppColor.white),
      onTap: isWaiting ? null : onAddCash,
    );
  }

  CircleButton _removeButton() {
    return CircleButton(
      backgroundColor: isWaiting ? AppColor.disabledGray : AppColor.buttonRed,
      clickAreaMargin: const Pad(all: 3.0, left: 3.5, right: 5, vertical: 4),
      tapColor: isWaiting ? AppColor.disabledGray : AppColor.buttonRed.lighter(0.2),
      icon: const Icon(Icons.remove, color: AppColor.white),
      onTap: isWaiting ? null : onRemoveCash,
    );
  }
}
