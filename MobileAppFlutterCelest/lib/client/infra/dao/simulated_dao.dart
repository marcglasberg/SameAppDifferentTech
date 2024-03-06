import 'dart:async';
import 'dart:math';

import 'package:celest_backend/models.dart';
import 'package:celest_backend/my_src/models/cash_balance.dart';
import 'package:fast_immutable_collections/fast_immutable_collections.dart';
import 'package:mobile_app_flutter_celest/client/infra/dao/real_dao.dart';
import 'package:mobile_app_flutter_celest/client/infra/run_config/run_config.dart';

import 'dao.dart';

class SimulatedDao extends RealDao {
  //
  @override
  Future<void> init() async {
    await simulatesWaiting(15);
    return super.init();
  }

  @override
  Future<CashBalance> addCashBalance(double howMuch) async {
    await simulatesWaiting(250);
    return super.addCashBalance(howMuch);
  }

  @override
  Future<CashBalance> removeCashBalance(double howMuch) async {
    await simulatesWaiting(250);
    return super.removeCashBalance(howMuch);
  }

  @override
  Future<CashBalance> readCashBalance() async {
    await simulatesWaiting(250);
    return super.readCashBalance();
  }

  @override
  Future<Portfolio> readPortfolio() async {
    await simulatesWaiting(250);
    return super.readPortfolio();
  }

  @override
  Future<({Stock stock, CashBalance cashBalance})> buyStock(
    AvailableStock availableStock, {
    required int howMany,
  }) async {
    await simulatesWaiting(250);
    return super.buyStock(availableStock, howMany: howMany);
  }

  @override
  Future<({Stock stock, CashBalance cashBalance})> sellStock(
    AvailableStock availableStock, {
    required int howMany,
  }) async {
    await simulatesWaiting(250);
    return super.sellStock(availableStock, howMany: howMany);
  }

  @override
  Future<IList<AvailableStock>> readAvailableStocks() async {
    await simulatesWaiting(250);
    return super.readAvailableStocks();
  }

  @override
  Future<void> startListeningToStockPriceUpdates({required PriceUpdate callback}) async {
    await simulatesWaiting(150);
    return super.startListeningToStockPriceUpdates(callback: callback);
  }

  @override
  Future<void> stopListeningToStockPriceUpdates() async {
    await simulatesWaiting(10);
    super.stopListeningToStockPriceUpdates();
  }
}

/// Simulates waiting for the demonstrating with the app.
/// For tests, will wait a very small random amount of time.
Future<void> simulatesWaiting(int millis) {
  Random _random = Random.secure();
  return (RunConfig.instance.disablePlatformChannels)
      ? Future.delayed(Duration(milliseconds: _random.nextInt(20) + 1))
      : Future.delayed(Duration(milliseconds: millis));
}
