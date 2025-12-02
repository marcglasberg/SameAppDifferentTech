import 'package:async_redux/async_redux.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app_flutter_redux/client/infra/app_state.dart';
import 'package:mobile_app_flutter_redux/client/portfolio_and_cash_screen/available_stocks/stock_and_buy_sell_buttons.dart';
import 'ACTION_fluctuate_stock_price.dart';
import 'ACTION_read_available_stocks.dart';

class AvailableStocksPanel extends StatefulWidget {
  const AvailableStocksPanel();

  @override
  State<AvailableStocksPanel> createState() => _AvailableStocksPanelState();
}

class _AvailableStocksPanelState extends State<AvailableStocksPanel> {
  @override
  void initState() {
    super.initState();
    context.dispatch(ReadAvailableStocks());
    context.dispatch(FluctuateStockPrice(true));
  }

  @override
  void dispose() {
    context.dispatch(FluctuateStockPrice(false));
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            for (var availableStock in context.state.availableStocks.list)
              StockAndBuySellButtonsConnector(availableStock: availableStock),
          ],
        ),
      ),
    );
  }
}
