// Generated by Celest. This file should not be modified manually, but
// it can be checked into version control.
// ignore_for_file: type=lint, unused_local_variable, unnecessary_cast, unnecessary_import

library;

import 'package:celest/celest.dart';

@Deprecated('Use `Apis` instead.')
typedef apis = Apis;

abstract final class Apis {
  static const admin = CloudApi(name: r'admin');

  static const database = CloudApi(name: r'database');

  static const portfolio = CloudApi(name: r'portfolio');

  static const stocks = CloudApi(name: r'stocks');
}

@Deprecated('Use `Functions` instead.')
typedef functions = Functions;

abstract final class Functions {
  static const adminDoSomething = CloudFunction(
    api: r'admin',
    functionName: r'doSomething',
  );

  static const adminSetDatabase = CloudFunction(
    api: r'admin',
    functionName: r'setDatabase',
  );

  static const databaseInit = CloudFunction(
    api: r'database',
    functionName: r'init',
  );

  static const portfolioAddCashBalance = CloudFunction(
    api: r'portfolio',
    functionName: r'addCashBalance',
  );

  static const portfolioBuyStock = CloudFunction(
    api: r'portfolio',
    functionName: r'buyStock',
  );

  static const portfolioReadCashBalance = CloudFunction(
    api: r'portfolio',
    functionName: r'readCashBalance',
  );

  static const portfolioReadPortfolio = CloudFunction(
    api: r'portfolio',
    functionName: r'readPortfolio',
  );

  static const portfolioRemoveCashBalance = CloudFunction(
    api: r'portfolio',
    functionName: r'removeCashBalance',
  );

  static const portfolioSellStock = CloudFunction(
    api: r'portfolio',
    functionName: r'sellStock',
  );

  static const stocksReadAvailableStocks = CloudFunction(
    api: r'stocks',
    functionName: r'readAvailableStocks',
  );

  static const stocksReadUpdatedStockPrice = CloudFunction(
    api: r'stocks',
    functionName: r'readUpdatedStockPrice',
  );
}
