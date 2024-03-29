library module_graphql;

import 'dart:async';

import 'package:celest_backend/client.dart';
import 'package:celest_backend/models.dart';
import 'package:celest_backend/my_src/models/cash_balance.dart';
import 'package:fast_immutable_collections/fast_immutable_collections.dart';

import 'dao.dart';

class RealDao extends Dao {
  //
  @override
  Future<void> init() async {
    return celest.functions.database.init();
  }

  @override
  Future<CashBalance> addCashBalance(double howMuch) =>
      celest.functions.portfolio.addCashBalance(howMuch);

  @override
  Future<CashBalance> removeCashBalance(double howMuch) =>
      celest.functions.portfolio.removeCashBalance(howMuch);

  @override
  Future<CashBalance> readCashBalance() => celest.functions.portfolio.readCashBalance();

  @override
  Future<Portfolio> readPortfolio() => celest.functions.portfolio.readPortfolio();

  @override
  Future<({Stock stock, CashBalance cashBalance})> buyStock(AvailableStock availableStock,
          {required int howMany}) =>
      celest.functions.portfolio.buyStock(availableStock, howMany: howMany);

  @override
  Future<({Stock stock, CashBalance cashBalance})> sellStock(AvailableStock availableStock,
          {required int howMany}) =>
      celest.functions.portfolio.sellStock(availableStock, howMany: howMany);

  @override
  Future<IList<AvailableStock>> readAvailableStocks() async =>
      celest.functions.stocks.readAvailableStocks();

  /// This method should be using Celest websockets to update the ticker price.
  /// But since websockets is not yet a feature in Celest, I'm polling the prices from a
  /// regular Celest function.
  ///
  /// As soon as Celest has websockets I'm going to modify this method to use the real thing,
  /// and delete function [celest.functions.stocks.readUpdatedStockPrice()]
  ///
  @override
  Future<void> startListeningToStockPriceUpdates({required PriceUpdate callback}) async {
    _callback = callback;

    _priceUpdateInterval?.cancel();

    _priceUpdateInterval = Timer.periodic(
      const Duration(milliseconds: 300),
      (Timer t) async {
        if (_callback != null) {
          final stock = await celest.functions.stocks.readUpdatedStockPrice();
          if (stock != null) _callback!(ticker: stock.ticker, price: stock.price);
        }
      },
    );
  }

  /// As soon as Celest has websockets I'm going to modify this method to use the real thing,
  /// and delete [_priceUpdateInterval] and [_callback].
  ///
  @override
  Future<void> stopListeningToStockPriceUpdates() async {
    _priceUpdateInterval?.cancel();
    _priceUpdateInterval = null;

    _callback = null;
  }

  Function({
    required String ticker,
    required double price,
  })? _callback;

  Timer? _priceUpdateInterval;
}
