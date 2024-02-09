import 'package:flutter/material.dart';
import 'package:mobile_app_flutter_celest/client/infra/app_state.dart';
import 'package:mobile_app_flutter_celest/client/portfolio_and_cash_screen/available_stocks/stock_and_buy_sell_buttons.dart';

class AvailableStocksPanel_Mixed extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Note: `context.state.availableStocks.list` is the same as
            // `StoreProvider.of<AppState>(context, this).state.availableStocks`
            for (var availableStock in context.state.availableStocks.list)
              StockAndBuySellButtons_Connector(availableStock: availableStock),
          ],
        ),
      ),
    );
  }
}
