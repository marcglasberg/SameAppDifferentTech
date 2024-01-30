import 'package:assorted_layout_widgets/assorted_layout_widgets.dart';
import 'package:async_redux/async_redux.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app_flutter_redux/business/state/stock.dart';
import 'package:mobile_app_flutter_redux/client/cash_balance_and_portfolio/ACTION_fluctuate_stock_price.dart';
import 'package:mobile_app_flutter_redux/client/cash_balance_and_portfolio/ACTION_read_available_stocks.dart';

import '../../business/state/app_state.dart';
import '../../business/state/available_stocks.dart';
import '../../business/utils/app_vm_factory.dart';
import 'available_stock_widget.dart';

class AvailableStocksXXX_Connector extends StatelessWidget {
  //
  const AvailableStocksXXX_Connector();

  @override
  Widget build(BuildContext context) => StoreConnector<AppState, _Vm>(
        vm: () => _Factory(),
        onInit: _onInit,
        onDispose: _onDispose,
        builder: (context, vm) {
          return AvailableStocksXXX(
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

// TODO: MARCELO Chose appropriate name.
class AvailableStocksXXX extends StatelessWidget {
  //
  static const style = TextStyle(fontSize: 20, color: Colors.black);

  final AvailableStocks availableStocks;

  const AvailableStocksXXX({
    super.key,
    required this.availableStocks,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            for (var availableStock in availableStocks.list)
              AvailableStockWidget_Connector(availableStock: availableStock),
          ],
        ),
      ),
    );
  }
}

class StockInPortfolio extends StatelessWidget {
  //
  static const stockStyle = TextStyle(fontSize: 16, color: Colors.black);

  final Stock stock;

  const StockInPortfolio(this.stock, {super.key});

  @override
  Widget build(BuildContext context) => Padding(
        padding: const Pad(top: 6),
        child: Text(
            '${stock.ticker} (${stock.howManyShares} shares @ US\$ ${stock.averagePriceStr})',
            style: stockStyle),
      );
}
