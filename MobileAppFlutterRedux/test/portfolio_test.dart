// ignore_for_file: prefer_const_constructors

import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app_flutter_redux/models/available_stock.dart';
import 'package:mobile_app_flutter_redux/models/buy_or_sell.dart';
import 'package:mobile_app_flutter_redux/models/cash_balance.dart';
import 'package:mobile_app_flutter_redux/models/portfolio.dart';
import 'package:mobile_app_flutter_redux/models/stock.dart';

void main() {
  test('addCashBalance', () {
    var portfolio = Portfolio(cashBalance: CashBalance(100.0));
    portfolio = portfolio.addCashBalance(50.0);
    expect(portfolio.cashBalance.amount, 150.0);
  });

  test('removeCashBalance', () {
    var portfolio = Portfolio(cashBalance: CashBalance(100.0));
    portfolio = portfolio.removeCashBalance(50.0);
    expect(portfolio.cashBalance.amount, 50.0);
  });

  test('withAddedStock', () {
    var portfolio = Portfolio(
      stocks: [Stock(ticker: 'AAPL', howManyShares: 10, averagePrice: 150.0)],
    );

    portfolio = portfolio.withAddedStock(
      AvailableStock('GOOG', name: 'Google', currentPrice: 1000.0),
      5,
    );

    expect(portfolio.stocks.length, 2);
    expect(portfolio.stocks[1].ticker, 'GOOG');
    expect(portfolio.stocks[1].howManyShares, 5);
  });

  test('isEmpty', () {
    final portfolio = Portfolio();
    expect(portfolio.isEmpty, true);
  });

  test('withoutStock', () {
    var portfolio =
        Portfolio(stocks: [Stock(ticker: 'AAPL', howManyShares: 10, averagePrice: 150.0)]);
    portfolio = portfolio.withoutStock('AAPL');
    expect(portfolio.stocks.any((stock) => stock.ticker == 'AAPL'), false);
  });

  test('withoutStocks', () {
    var portfolio =
        Portfolio(stocks: [Stock(ticker: 'AAPL', howManyShares: 10, averagePrice: 150.0)]);
    portfolio = portfolio.withoutStocks();
    expect(portfolio.stocks.isEmpty, true);
  });

  test('howManyStocks', () {
    final portfolio =
        Portfolio(stocks: [Stock(ticker: 'AAPL', howManyShares: 10, averagePrice: 150.0)]);
    expect(portfolio.howManyStocks('AAPL'), 10);
  });

  test('getStock', () {
    final portfolio =
        Portfolio(stocks: [Stock(ticker: 'AAPL', howManyShares: 10, averagePrice: 150.0)]);
    final stock = portfolio.getStock('AAPL');
    expect(stock.ticker, 'AAPL');
    expect(stock.howManyShares, 10);
    expect(stock.averagePrice, 150.0);
  });

  test('getStockOrNull', () {
    final portfolio =
        Portfolio(stocks: [Stock(ticker: 'AAPL', howManyShares: 10, averagePrice: 150.0)]);
    final stock = portfolio.getStockOrNull('AAPL');
    expect(stock?.ticker, 'AAPL');
    expect(stock?.howManyShares, 10);
    expect(stock?.averagePrice, 150.0);
  });

  test('hasStock', () {
    final portfolio =
        Portfolio(stocks: [Stock(ticker: 'AAPL', howManyShares: 10, averagePrice: 150.0)]);
    final hasStock = portfolio.hasStock(AvailableStock('AAPL', name: 'Apple', currentPrice: 150.0));
    expect(hasStock, true);
  });

  test('hasMoneyToBuyStock', () {
    final portfolio = Portfolio(cashBalance: CashBalance(200.0));
    final hasMoney =
        portfolio.hasMoneyToBuyStock(AvailableStock('AAPL', name: 'Apple', currentPrice: 150.0));
    expect(hasMoney, true);
  });

  test('totalCostBasis', () {
    final portfolio = Portfolio(
      stocks: [Stock(ticker: 'AAPL', howManyShares: 10, averagePrice: 150.0)],
      cashBalance: CashBalance(200.0),
    );
    expect(portfolio.totalCostBasis, 1700.0);
  });

  test('buy', () {
    var portfolio = Portfolio(cashBalance: CashBalance(200.0));
    portfolio =
        portfolio.buy(AvailableStock('AAPL', name: 'Apple', currentPrice: 150.0), howMany: 1);
    expect(portfolio.cashBalance.amount, 50.0);
    expect(portfolio.stocks.length, 1);
    expect(portfolio.stocks[0].ticker, 'AAPL');
    expect(portfolio.stocks[0].howManyShares, 1);
    expect(portfolio.stocks[0].averagePrice, 150.0);
    expect(
        () => portfolio.buy(AvailableStock('AAPL', name: 'Apple', currentPrice: 150.0), howMany: 1),
        throwsException);
  });

  test('sell', () {
    var portfolio = Portfolio(
      cashBalance: CashBalance(200.0),
      stocks: [Stock(ticker: 'AAPL', howManyShares: 10, averagePrice: 150.0)],
    );
    portfolio =
        portfolio.sell(AvailableStock('AAPL', name: 'Apple', currentPrice: 150.0), howMany: 1);

    expect(portfolio.cashBalance.amount, 350.0);
    expect(portfolio.stocks.length, 1);
    expect(portfolio.stocks[0].ticker, 'AAPL');
    expect(portfolio.stocks[0].howManyShares, 9);
    expect(
        () =>
            portfolio.sell(AvailableStock('AAPL', name: 'Apple', currentPrice: 150.0), howMany: 10),
        throwsException);
  });

  test('copyWith', () {
    var portfolio = Portfolio(
      cashBalance: CashBalance(200.0),
      stocks: [Stock(ticker: 'AAPL', howManyShares: 10, averagePrice: 150.0)],
    );
    var copiedPortfolio = portfolio.copyWith(cashBalance: CashBalance(100.0));
    expect(copiedPortfolio.cashBalance.amount, 100.0);
    expect(copiedPortfolio.stocks, portfolio.stocks);
  });

  test('Portfolio.EMPTY', () {
    expect(Portfolio.EMPTY.cashBalance, CashBalance.ZERO);
    expect(Portfolio.EMPTY.stocks, isEmpty);
    expect(Portfolio.EMPTY.isEmpty, isTrue);
  });

  test('copyWith changes stocks', () {
    var portfolio = Portfolio(
      stocks: [Stock(ticker: 'AAPL', howManyShares: 10, averagePrice: 150.0)],
    );
    var copiedPortfolio = portfolio.copyWith(
      stocks: [Stock(ticker: 'GOOG', howManyShares: 5, averagePrice: 1000.0)],
    );
    expect(copiedPortfolio.stocks[0].ticker, 'GOOG');
  });

  test('withStock', () {
    var portfolio = Portfolio(
      stocks: [Stock(ticker: 'AAPL', howManyShares: 10, averagePrice: 150.0)],
    );
    portfolio = portfolio.withStock('GOOG', 5, 1000.0);
    expect(portfolio.stocks.length, 2);
    expect(portfolio.stocks[1].ticker, 'GOOG');
    expect(portfolio.stocks[1].howManyShares, 5);
    expect(portfolio.stocks[1].averagePrice, 1000.0);
  });

  test('buyOrSell', () {
    var portfolio = Portfolio(cashBalance: CashBalance(200.0));
    portfolio = portfolio.buyOrSell(
      BuyOrSell.buy,
      AvailableStock('AAPL', name: 'Apple', currentPrice: 150.0),
      1,
    );
    expect(portfolio.cashBalance.amount, 50.0);
    expect(portfolio.stocks.length, 1);
    expect(portfolio.stocks[0].ticker, 'AAPL');
    expect(portfolio.stocks[0].howManyShares, 1);
    expect(portfolio.stocks[0].averagePrice, 150.0);
  });

  test('fromJson with multiple stocks', () {
    final json = {
      'cashBalance': {'amount': 100.0},
      'stocks': [
        {'ticker': 'AAPL', 'howManyShares': 10, 'averagePrice': 150.0},
        {'ticker': 'GOOG', 'howManyShares': 5, 'averagePrice': 1000.0},
      ],
    };
    var portfolio = Portfolio.fromJson(json);
    expect(portfolio.cashBalance.amount, 100.0);
    expect(portfolio.stocks.length, 2);
    expect(portfolio.stocks[0].ticker, 'AAPL');
    expect(portfolio.stocks[0].howManyShares, 10);
    expect(portfolio.stocks[0].averagePrice, 150.0);
    expect(portfolio.stocks[1].ticker, 'GOOG');
    expect(portfolio.stocks[1].howManyShares, 5);
    expect(portfolio.stocks[1].averagePrice, 1000.0);
  });

  test('Equality with multiple stocks', () {
    var portfolio1 = Portfolio(
      cashBalance: CashBalance(100.0),
      stocks: [
        Stock(ticker: 'AAPL', howManyShares: 10, averagePrice: 150.0),
        Stock(ticker: 'GOOG', howManyShares: 5, averagePrice: 1000.0),
      ],
    );
    var portfolio2 = Portfolio(
      cashBalance: CashBalance(100.0),
      stocks: [
        Stock(ticker: 'AAPL', howManyShares: 10, averagePrice: 150.0),
        Stock(ticker: 'GOOG', howManyShares: 5, averagePrice: 1000.0),
      ],
    );
    expect(portfolio1, portfolio2);
  });

  test('HashCode with multiple stocks', () {
    var portfolio1 = Portfolio(
      cashBalance: CashBalance(100.0),
      stocks: [
        Stock(ticker: 'AAPL', howManyShares: 10, averagePrice: 150.0),
        Stock(ticker: 'GOOG', howManyShares: 5, averagePrice: 1000.0),
      ],
    );
    var portfolio2 = Portfolio(
      cashBalance: CashBalance(100.0),
      stocks: [
        Stock(ticker: 'AAPL', howManyShares: 10, averagePrice: 150.0),
        Stock(ticker: 'GOOG', howManyShares: 5, averagePrice: 1000.0),
      ],
    );
    expect(portfolio1.hashCode, portfolio2.hashCode);
  });

  test('fromJson with null', () {
    var portfolio = Portfolio.fromJson(null);
    expect(portfolio, Portfolio.EMPTY);
  });

  test('toJson', () {
    final portfolio = Portfolio(
        cashBalance: CashBalance(100.0),
        stocks: [Stock(ticker: 'AAPL', howManyShares: 10, averagePrice: 150.0)]);
    final json = portfolio.toJson();
    expect(json, {
      'cashBalance': {'amount': 100.0},
      'stocks': [
        {'ticker': 'AAPL', 'howManyShares': 10, 'averagePrice': 150.0}
      ]
    });
  });

  test('fromJson', () {
    final json = {
      'cashBalance': {'amount': 100.0},
      'stocks': [
        {'ticker': 'AAPL', 'howManyShares': 10, 'averagePrice': 150.0}
      ]
    };
    var portfolio = Portfolio.fromJson(json);
    expect(portfolio.cashBalance.amount, 100.0);
    expect(portfolio.stocks.length, 1);
    expect(portfolio.stocks[0].ticker, 'AAPL');
    expect(portfolio.stocks[0].howManyShares, 10);
    expect(portfolio.stocks[0].averagePrice, 150.0);
  });

  test('Equality', () {
    var portfolio1 = Portfolio(
        cashBalance: CashBalance(100.0),
        stocks: [Stock(ticker: 'AAPL', howManyShares: 10, averagePrice: 150.0)]);
    var portfolio2 = Portfolio(
        cashBalance: CashBalance(100.0),
        stocks: [Stock(ticker: 'AAPL', howManyShares: 10, averagePrice: 150.0)]);
    expect(portfolio1, portfolio2);

    portfolio2 = Portfolio(
        cashBalance: CashBalance(101.0),
        stocks: [Stock(ticker: 'AAPL', howManyShares: 10, averagePrice: 150.0)]);
    expect(portfolio1, isNot(portfolio2));
  });

  test('HashCode', () {
    var portfolio1 = Portfolio(
        cashBalance: CashBalance(100.0),
        stocks: [Stock(ticker: 'AAPL', howManyShares: 10, averagePrice: 150.0)]);
    var portfolio2 = Portfolio(
        cashBalance: CashBalance(100.0),
        stocks: [Stock(ticker: 'AAPL', howManyShares: 10, averagePrice: 150.0)]);
    expect(portfolio1.hashCode, portfolio2.hashCode);

    portfolio2 = Portfolio(
        cashBalance: CashBalance(101.0),
        stocks: [Stock(ticker: 'AAPL', howManyShares: 10, averagePrice: 150.0)]);
    expect(portfolio1.hashCode, isNot(portfolio2.hashCode));
  });
}
