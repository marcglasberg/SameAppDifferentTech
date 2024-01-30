import 'package:assorted_layout_widgets/assorted_layout_widgets.dart';
import 'package:async_redux/async_redux.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app_flutter_redux/business/state/app_state.dart';
import 'package:mobile_app_flutter_redux/business/state/cash_balance.dart';
import 'package:mobile_app_flutter_redux/business/utils/app_vm_factory.dart';
import 'package:mobile_app_flutter_redux/client/cash_balance_and_portfolio/ACTION_add_cash.dart';
import 'package:mobile_app_flutter_redux/client/cash_balance_and_portfolio/ACTION_remove_cash.dart';

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
      );

  void _onAddCash() => dispatch(AddCash_Action(100));

  void _onRemoveCash() => dispatch(RemoveCash_Action(100));
}

class _Vm extends Vm {
  //
  final CashBalance cashBalance;
  final VoidCallback onAddCash, onRemoveCash;

  _Vm({
    required this.cashBalance,
    required this.onAddCash,
    required this.onRemoveCash,
  }) : super(equals: [
          cashBalance,
        ]);
}

class CashBalanceWidget extends StatelessWidget {
  //
  static const style = TextStyle(fontSize: 20, color: Colors.black);

  final CashBalance cashBalance;
  final VoidCallback onAddCash, onRemoveCash;

  CashBalanceWidget({
    super.key,
    required this.cashBalance,
    required this.onAddCash,
    required this.onRemoveCash,
  });

  @override
  Widget build(BuildContext context) {
    return Box(
      padding: const Pad(top: 16, left: 16, right: 8),
      width: double.infinity,
      color: Colors.grey[300],
      child: Row(
        children: [
          Expanded(child: Text('Cash Balance: $cashBalance', style: style)),
          _addButton(),
          _removeButton(),
        ],
      ),
    );
  }

  CircleButton _removeButton() {
    return CircleButton(
      backgroundColor: Colors.red,
      tapColor: Colors.red[800],
      icon: const Icon(Icons.remove, color: Colors.white),
      onTap: onRemoveCash,
    );
  }

  CircleButton _addButton() {
    return CircleButton(
      backgroundColor: Colors.green,
      tapColor: Colors.green[700],
      icon: const Icon(Icons.add, color: Colors.white),
      onTap: onAddCash,
    );
  }
}
