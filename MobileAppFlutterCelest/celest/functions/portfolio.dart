import 'package:celest_backend/exceptions.dart';
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

/// Buys the given [availableStock] and return the [Stock] bought.
/// This may thrown the same [TranslatableUserException] thrown by [Portfolio].
///
Future<Stock> buyStock(AvailableStock availableStock, {required int howMany}) async {
  db.buyStock(availableStock, howMany: howMany);
  return db.portfolio.getStock(availableStock.ticker);
}

/// Sells the given [availableStock] and return the [Stock] bought.
/// Returns `null` if all the stock was sold.
///
/// This may thrown the same [TranslatableUserException] thrown by [Portfolio].
///
Future<Stock?> sellStock(AvailableStock availableStock, {required int howMany}) async {
  db.sellStock(availableStock, howMany: howMany);
  return db.portfolio.getStockOrNull(availableStock.ticker);
}
