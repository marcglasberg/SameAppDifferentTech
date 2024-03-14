import 'package:assorted_layout_widgets/assorted_layout_widgets.dart';
import 'package:async_redux/async_redux.dart';
import 'package:celest_backend/models.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app_flutter_celest/client/infra/app_state.dart';
import 'package:mobile_app_flutter_celest/client/infra/basic/app_vm_factory.dart';
import 'package:mobile_app_flutter_celest/client/infra/run_config/run_config.dart';
import 'package:mobile_app_flutter_celest/client/infra/theme/app_themes.dart';
import 'package:mobile_app_flutter_celest/client/portfolio_and_cash_screen/available_stocks/ACTION_buy_stock.dart';
import 'package:mobile_app_flutter_celest/client/portfolio_and_cash_screen/available_stocks/ACTION_sell_stock.dart';
import 'package:mobile_app_flutter_celest/client/utils/divider.dart';
import 'package:themed/themed.dart';

import '../portfolio_and_cash_screen.i18n.dart';

class StockAndBuySellButtons_Connector extends StatelessWidget {
  //
  final AvailableStock availableStock;

  const StockAndBuySellButtons_Connector({
    super.key,
    required this.availableStock,
  });

  @override
  Widget build(BuildContext context) => StoreConnector<AppState, _Vm>(
        vm: () => Factory(this),
        builder: (context, vm) {
          return StockAndBuySellButtons(
            availableStock: availableStock,
            onBuy: vm.onBuy,
            onSell: vm.onSell,
            ifBuyDisabled: vm.ifBuyDisabled,
            ifSellDisabled: vm.ifSellDisabled,
            isWaiting: vm.isWaiting,
          );
        },
      );
}

class Factory extends AppVmFactory<_Vm, StockAndBuySellButtons_Connector> {
  Factory(StockAndBuySellButtons_Connector? connector) : super(connector);

  @override
  _Vm fromStore() => _Vm(
        onBuy: _onBuy,
        onSell: _onSell,
        ifBuyDisabled: !state.portfolio.hasMoneyToBuyStock(widget.availableStock),
        ifSellDisabled: !state.portfolio.hasStock(widget.availableStock),
        isWaiting: isWaiting([BuyStock_Action, SellStock_Action]),
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
  final bool ifBuyDisabled, ifSellDisabled, isWaiting;

  _Vm({
    required this.onBuy,
    required this.onSell,
    required this.ifBuyDisabled,
    required this.ifSellDisabled,
    required this.isWaiting,
  }) : super(equals: [
          ifBuyDisabled,
          ifSellDisabled,
          isWaiting,
        ]);
}

class StockAndBuySellButtons extends StatelessWidget {
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
  final bool ifBuyDisabled, ifSellDisabled, isWaiting;

  const StockAndBuySellButtons({
    super.key,
    required this.availableStock,
    required this.onBuy,
    required this.onSell,
    required this.ifBuyDisabled,
    required this.ifSellDisabled,
    required this.isWaiting,
  });

  @override
  Widget build(BuildContext context) {
    var abTesting = RunConfig.instance.abTesting;

    return Padding(
      padding: const Pad(horizontal: 12.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          space12,
          Row(
            children: [
              Text(availableStock.ticker, style: tickerStyle),
              const Spacer(),
              Text(availableStock.currentPriceStr,
                  style: abTesting.choose(priceStyleA, priceStyleB)),
            ],
          ),
          space4,
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(child: Text(availableStock.name, style: nameStyle)),
              space8,
              _buyButton(),
              space8,
              _sellButton(),
            ],
          ),
          const Box(height: 4),
          const ThinDivider(),
        ],
      ),
    );
  }

  /// Note: If any operation is in progress ([isWaiting] is true) the button will be
  /// have its opacity reduced to 0.9, and you won't be able to press it.
  ///
  /// However, if there is not enough money to buy the stock ([ifBuyDisabled] is true)
  /// the button will be totally disabled.
  Widget _buyButton() => IgnorePointer(
        ignoring: isWaiting,
        child: Opacity(
          opacity: isWaiting ? 0.9 : 1.0,
          child: Theme(
            data: ThemeData(useMaterial3: false),
            child: ElevatedButton(
              style: buyStyle,
              onPressed: ifBuyDisabled ? null : onBuy,
              child: Text('Buy'.i18n),
            ),
          ),
        ),
      );

  /// Note: If any operation is in progress ([isWaiting] is true) the button will be
  /// have its opacity reduced to 0.9, and you won't be able to press it.
  ///
  /// However, if there is not enough stock to sell ([ifSellDisabled] is true)
  /// the button will be totally disabled.
  Widget _sellButton() => IgnorePointer(
        ignoring: isWaiting,
        child: Opacity(
          opacity: isWaiting ? 0.9 : 1.0,
          child: Theme(
            data: ThemeData(useMaterial3: false),
            child: ElevatedButton(
              style: sellStyle,
              onPressed: ifSellDisabled ? null : onSell,
              child: Text('Sell'.i18n),
            ),
          ),
        ),
      );
}
