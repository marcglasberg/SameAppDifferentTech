import 'dart:async';
import 'dart:math';

import 'package:fast_immutable_collections/fast_immutable_collections.dart';
import 'package:mobile_app_flutter_redux/client/infra/run_config/run_config.dart';
import 'package:mobile_app_flutter_redux/models/available_stock.dart';

import '../dao.dart';

class SimulatedDao extends Dao {
  //
  static SimulatedDao get instance => RunConfig.instance.dao as SimulatedDao;

  SimulatedDao();

  @override
  Future<void> init() async {
    await simulatesWaiting(50);
  }

  @override
  Future<IList<AvailableStock>> readAvailableStocks() async {
    await simulatesWaiting(250);

    print('Just read ${_hardcodedStocks.length} stocks.');

    return _hardcodedStocks
        .map((stock) => AvailableStock(stock.ticker, name: stock.name, currentPrice: stock.price))
        .toIList();
  }

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
        final stocks = _hardcodedStocks;
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

final List<_Stock> _hardcodedStocks = [
  _Stock('IBM', 'International Business Machines', 132.64),
  _Stock('AAPL', 'Apple', 183.58),
  _Stock('GOOG', 'Alphabet', 126.63),
  _Stock('AMZN', 'Amazon', 125.30),
  _Stock('META', 'Meta Platforms', 271.39),
  _Stock('INTC', 'Intel', 29.86),
];

class _Stock {
  final String ticker;
  final String name;
  double price;

  _Stock(this.ticker, this.name, this.price);
}

/// Simulates waiting for the demonstrating with the app.
/// For tests, will wait a very small random amount of time.
Future<void> simulatesWaiting(int millis) {
  Random _random = Random.secure();
  return (RunConfig.instance.disablePlatformChannels)
      ? Future.delayed(Duration(milliseconds: _random.nextInt(20) + 1))
      : Future.delayed(Duration(milliseconds: millis));
}
