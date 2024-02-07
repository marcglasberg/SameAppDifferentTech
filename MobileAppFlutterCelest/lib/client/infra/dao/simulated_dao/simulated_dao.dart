import 'dart:async';
import 'dart:math';

import 'package:fast_immutable_collections/fast_immutable_collections.dart';
import 'package:mobile_app_flutter_celest/client/infra/run_config/run_config.dart';
import 'package:mobile_app_flutter_celest/models/available_stock.dart';

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
    return _hardcodedStocks.map(AvailableStock.from).toIList();
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
        final List<({String ticker, String name, double price})> stocks = _hardcodedStocks;
        if (stocks.isEmpty) return;

        final randomIndex = Random().nextInt(stocks.length);
        final randomStock = stocks[randomIndex];

        double newPrice = (randomStock.price + (Random().nextDouble() * 2 - 1) / 4).toDouble();

        newPrice = max(1, min(newPrice, 1000));

        stocks[randomIndex] = (
          ticker: randomStock.ticker,
          name: randomStock.ticker,
          price: newPrice,
        );

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

final List<({String ticker, String name, double price})> _hardcodedStocks = [
  (ticker: 'IBM', name: 'International Business Machines', price: 132.64),
  (ticker: 'AAPL', name: 'Apple', price: 183.58),
  (ticker: 'GOOG', name: 'Alphabet', price: 126.63),
  (ticker: 'AMZN', name: 'Amazon', price: 125.30),
  (ticker: 'META', name: 'Meta Platforms', price: 271.39),
  (ticker: 'INTC', name: 'Intel', price: 29.86),
];

/// Simulates waiting for the demonstrating with the app.
/// For tests, will wait a very small random amount of time.
Future<void> simulatesWaiting(int millis) {
  Random _random = Random.secure();
  return (RunConfig.instance.disablePlatformChannels)
      ? Future.delayed(Duration(milliseconds: _random.nextInt(20) + 1))
      : Future.delayed(Duration(milliseconds: millis));
}
