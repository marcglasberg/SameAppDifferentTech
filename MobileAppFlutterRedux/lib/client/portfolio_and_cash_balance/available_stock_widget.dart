import 'package:assorted_layout_widgets/assorted_layout_widgets.dart';
import 'package:async_redux/async_redux.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app_flutter_redux/business/infra/run_config/run_config.dart';
import 'package:mobile_app_flutter_redux/client/theme/app_themes.dart';
import 'package:themed/themed.dart';

import '../../business/state/app_state.dart';
import '../../business/state/available_stock.dart';
import '../../business/utils/app_vm_factory.dart';
import '../utils/divider.dart';
import 'ACTION_buy_stock.dart';
import 'ACTION_sell_stock.dart';

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

class AvailableStockWidget extends StatelessWidget {
  //
  static var tickerStyle = Font.giant + AppColor.text;
  static var nameStyle = Font.small + AppColor.textDimmed;
  static var priceStyleA = Font.large + AppColor.blue + FontWeight.bold;
  static var priceStyleB = Font.medium + AppColor.text + FontWeight.normal;

  static var buyStyle = ElevatedButton.styleFrom(
    textStyle: Font.small,
    foregroundColor: AppColor.white,
    backgroundColor: AppColor.buttonGreen,
    disabledBackgroundColor: AppColor.bkgGray,
    disabledForegroundColor: AppColor.textDimmed,
  );

  static var sellStyle = ElevatedButton.styleFrom(
    textStyle: Font.small,
    foregroundColor: AppColor.white,
    backgroundColor: AppColor.red,
    disabledBackgroundColor: AppColor.bkgGray,
    disabledForegroundColor: AppColor.textDimmed,
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
  Widget build(BuildContext context) {
    return Padding(
      padding: const Pad(horizontal: 12.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 12),
          Row(
            children: [
              Text(availableStock.ticker, style: tickerStyle),
              const Spacer(),
              Text(availableStock.currentPriceStr,
                  style: RunConfig.instance.abTesting.choose(priceStyleA, priceStyleB)),
            ],
          ),
          const SizedBox(height: 4),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(child: Text(availableStock.name, style: nameStyle)),
              const SizedBox(width: 8),
              _buyButton(),
              const SizedBox(width: 8),
              _sellButton(),
            ],
          ),
          const Box(height: 4),
          const ThinDivider(),
        ],
      ),
    );
  }

  Widget _buyButton() => Theme(
        data: ThemeData(useMaterial3: false),
        child: ElevatedButton(
          style: buyStyle,
          onPressed: ifHasMoneyToBuyStock ? onBuy : null,
          child: const Text('Buy'),
        ),
      );

  Widget _sellButton() => Theme(
        data: ThemeData(useMaterial3: false),
        child: ElevatedButton(
          style: sellStyle,
          onPressed: ifHasStockToSell ? onSell : null,
          child: const Text('Sell'),
        ),
      );
}
