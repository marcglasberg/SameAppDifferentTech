import 'package:flutter/material.dart';
import 'package:mobile_app_flutter_redux/client/portfolio_and_cash_screen/available_stocks/stock_and_buy_sell_buttons.dart';
import 'package:mobile_app_flutter_redux/models/available_stocks.dart';

class AvailableStocksPanel extends StatelessWidget {
  //
  static const style = TextStyle(fontSize: 20, color: Colors.black);

  final AvailableStocks availableStocks;

  const AvailableStocksPanel({
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
              StockAndBuySellButtons_Connector(availableStock: availableStock),
          ],
        ),
      ),
    );
  }
}
