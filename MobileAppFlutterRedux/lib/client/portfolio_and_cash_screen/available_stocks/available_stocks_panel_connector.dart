import 'package:async_redux/async_redux.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app_flutter_redux/client/infra/app_state.dart';
import 'package:mobile_app_flutter_redux/models/available_stocks.dart';

import '../../infra/basic/app_vm_factory.dart';
import 'ACTION_fluctuate_stock_price.dart';
import 'ACTION_read_available_stocks.dart';
import 'available_stocks_panel.dart';

class AvailableStocksPanel_Connector extends StatelessWidget {
  //
  const AvailableStocksPanel_Connector();

  @override
  Widget build(BuildContext context) => StoreConnector<AppState, _Vm>(
        vm: () => _Factory(),
        onInit: _onInit,
        onDispose: _onDispose,
        builder: (context, vm) {
          return AvailableStocksPanel(
            availableStocks: vm.availableStocks,
          );
        },
      );

  void _onInit(Store<AppState> store) {
    store.dispatch(ReadAvailableStocks_Action());
    store.dispatch(FluctuateStockPrice_Action(true));
  }

  void _onDispose(Store<AppState> store) {
    store.dispatch(FluctuateStockPrice_Action(false));
  }
}

class _Factory extends AppVmFactory {
  @override
  _Vm fromStore() => _Vm(availableStocks: state.availableStocks);
}

class _Vm extends Vm {
  //
  final AvailableStocks availableStocks;

  _Vm({
    required this.availableStocks,
  }) : super(equals: [availableStocks]);
}
