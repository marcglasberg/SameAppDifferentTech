import 'package:async_redux_core/async_redux_core.dart';
import 'package:celest_backend/models.dart';
import 'package:celest_backend/my_src/models/cash_balance.dart';

import 'database.dart';

Future<CashBalance> addCashBalance(double howMuch) async {
  db.addCashBalance(howMuch);
  return db.portfolio.cashBalance;
}

Future<CashBalance> removeCashBalance(double howMuch) async {
  db.removeCashBalance(howMuch);
  return db.portfolio.cashBalance;
}

Future<CashBalance> readCashBalance() async => db.portfolio.cashBalance;

Future<Portfolio> readPortfolio() async => db.portfolio;

/// Buys the given [availableStock] and return the [Stock] bought.
/// This may thrown the same [UserException] thrown by [Portfolio].
///
Future<({Stock stock, CashBalance cashBalance})> buyStock(
  AvailableStock availableStock, {
  required int howMany,
}) async {
  db.buyStock(availableStock, howMany: howMany);

  return (
    stock: db.portfolio.getStock(availableStock.ticker),
    cashBalance: db.portfolio.cashBalance,
  );
}

/// Sells the given [availableStock] and return the [Stock] bought.
/// /// Returns a Stock with `howManyShares` zero and `averagePrice` zero if all the stock was sold.
///
/// This may thrown the same [UserException] thrown by [Portfolio].
///
Future<({Stock stock, CashBalance cashBalance})> sellStock(
  AvailableStock availableStock, {
  required int howMany,
}) async {
  db.sellStock(availableStock, howMany: howMany);

  return (
    stock: db.portfolio.getStockOrNull(availableStock.ticker) ?? //
        Stock.noStocks(availableStock.ticker),
    cashBalance: db.portfolio.cashBalance
  );
}
