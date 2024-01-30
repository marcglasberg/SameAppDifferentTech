import 'dart:async';
import 'dart:math';

import 'package:assorted_layout_widgets/assorted_layout_widgets.dart';
import 'package:async_redux/async_redux.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app_flutter_redux/client/cash_balance_and_portfolio/ACTION_buy_stock.dart';
import 'package:mobile_app_flutter_redux/client/cash_balance_and_portfolio/ACTION_sell_stock.dart';

import '../../business/state/app_state.dart';
import '../../business/state/available_stock.dart';
import '../../business/utils/app_vm_factory.dart';

class AvailableStockWidget_Connector extends StatelessWidget {
  //
  final AvailableStock availableStock;

  const AvailableStockWidget_Connector({
    super.key,
    required this.availableStock,
  });

  @override
  Widget build(BuildContext context) => StoreConnector<AppState, _Vm>(
        vm: () => _Factory(this),
        builder: (context, vm) {
          return AvailableStockWidget(
            availableStock: availableStock,
            onBuy: vm.onBuy,
            onSell: vm.onSell,
            ifHasMoneyToBuyStock: vm.ifHasMoneyToBuyStock,
            ifHasStockToSell: vm.ifHasStockToSell,
          );
        },
      );
}

class _Factory extends AppVmFactory<_Vm, AvailableStockWidget_Connector> {
  _Factory(AvailableStockWidget_Connector? connector) : super(connector);

  @override
  _Vm fromStore() => _Vm(
        onBuy: _onBuy,
        onSell: _onSell,
        ifHasMoneyToBuyStock: state.portfolio.hasMoneyToBuyStock(widget.availableStock),
        ifHasStockToSell: state.portfolio.hasStock(widget.availableStock),
      );

  void _onBuy() => dispatch(
        BuyStock_Action(connector.availableStock, howMany: 1),
      );

  void _onSell() => dispatch(
        SellStock_Action(connector.availableStock, howMany: 1),
      );
}

class _Vm extends Vm {
  //
  final VoidCallback onBuy, onSell;
  final bool ifHasMoneyToBuyStock, ifHasStockToSell;

  _Vm({
    required this.onBuy,
    required this.onSell,
    required this.ifHasMoneyToBuyStock,
    required this.ifHasStockToSell,
  }) : super(equals: [
          ifHasMoneyToBuyStock,
          ifHasStockToSell,
        ]);
}

class AvailableStockWidget extends StatefulWidget {
  //
  static const tickerStyle = TextStyle(fontSize: 26, color: Colors.black);
  static const nameStyle = TextStyle(fontSize: 16, color: Colors.black54);

  static const priceStyle =
      TextStyle(fontSize: 23, color: Colors.blue, fontWeight: FontWeight.bold);

  static final buyStyle = ElevatedButton.styleFrom(
    backgroundColor: Colors.green,
    foregroundColor: Colors.white,
  );

  static final sellStyle = ElevatedButton.styleFrom(
    backgroundColor: Colors.red,
    foregroundColor: Colors.white,
  );

  final AvailableStock availableStock;
  final VoidCallback onBuy, onSell;
  final bool ifHasMoneyToBuyStock, ifHasStockToSell;

  const AvailableStockWidget({
    super.key,
    required this.availableStock,
    required this.onBuy,
    required this.onSell,
    required this.ifHasMoneyToBuyStock,
    required this.ifHasStockToSell,
  });

  @override
  State<AvailableStockWidget> createState() => _AvailableStockWidgetState();
}

class _AvailableStockWidgetState extends State<AvailableStockWidget> {
  //
  Timer? timer;

  @override
  void initState() {
    super.initState();

    int randomIntBetween900And1100 = Random().nextInt(200) + 900;

    timer = Timer.periodic(Duration(milliseconds: randomIntBetween900And1100), (timer) {
      setState(() {
        // TODO: MARCELO !!!
        // widget.availableStock.fluctuatePrice();
      });
    });
  }

  @override
  void dispose() {
    timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const Pad(horizontal: 12.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 12),
          Row(
            children: [
              Text(widget.availableStock.ticker, style: AvailableStockWidget.tickerStyle),
              const Spacer(),
              Text(widget.availableStock.currentPriceStr, style: AvailableStockWidget.priceStyle),
            ],
          ),
          const SizedBox(height: 4),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                  child: Text(widget.availableStock.name, style: AvailableStockWidget.nameStyle)),
              const SizedBox(width: 8),
              _buyButton(),
              const SizedBox(width: 8),
              _sellButton(),
            ],
          ),
          const Box(height: 4),
          const Divider(),
        ],
      ),
    );
  }

  ElevatedButton _sellButton() => ElevatedButton(
        style: AvailableStockWidget.sellStyle,
        onPressed: widget.ifHasStockToSell ? widget.onSell : null,
        child: const Text('SELL'),
      );

  ElevatedButton _buyButton() => ElevatedButton(
        style: AvailableStockWidget.buyStyle,
        onPressed: widget.ifHasMoneyToBuyStock ? widget.onBuy : null,
        child: const Text('BUY'),
      );
}
