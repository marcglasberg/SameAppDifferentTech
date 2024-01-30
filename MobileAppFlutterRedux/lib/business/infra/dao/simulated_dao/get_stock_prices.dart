import 'dart:async';
import 'dart:math';

import '../dao.dart';
import '../simulated_dao/get_initial_app_info.dart';

mixin GetStockPrices implements Dao {
  //
  Function({
    required String ticker,
    required double price,
  })? _callback;

  Timer? _priceUpdateInterval;

  @override
  Future<void> startListeningToStockPriceUpdates({required PriceUpdate callback}) async {
    _callback = callback;

    _priceUpdateInterval?.cancel();

    _priceUpdateInterval = Timer.periodic(const Duration(milliseconds: 300), (Timer t) {
      if (_callback != null) {
        final stocks = GetInitialAppInfo.stocks;
        if (stocks.isEmpty) return;

        final randomIndex = Random().nextInt(stocks.length);
        final randomStock = stocks[randomIndex];

        double newPrice = (randomStock.price + (Random().nextDouble() * 2 - 1) / 4).toDouble();

        newPrice = max(1, min(newPrice, 1000));

        stocks[randomIndex].price = newPrice;

        _callback!(
          ticker: randomStock.ticker,
          price: newPrice,
        );
      }
    });
  }

  @override
  Future<void> stopListeningToStockPriceUpdates() async {
    _priceUpdateInterval?.cancel();
    _priceUpdateInterval = null;

    _callback = null;
  }
}
