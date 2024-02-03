// ignore_for_file: prefer_const_constructors

import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app_flutter_redux/models/stock.dart';

void main() {
  test('costBasis', () {
    var stock = Stock( 'AAPL', howManyShares: 10, averagePrice: 150.0);
    expect(stock.costBasis, 1500.0);
  });

  test('averagePriceStr', () {
    var stock = Stock( 'AAPL', howManyShares: 10, averagePrice: 150.0);
    expect(stock.averagePriceStr, 'US\$ 150.00');
  });

  test('toJson', () {
    final stock = Stock( 'AAPL', howManyShares: 10, averagePrice: 150.0);
    final json = stock.toJson();
    expect(json, {'ticker': 'AAPL', 'howManyShares': 10, 'averagePrice': 150.0});
  });

  test('fromJson', () {
    final json = {'ticker': 'AAPL', 'howManyShares': 10, 'averagePrice': 150.0};
    var stock = Stock.fromJson(json);
    expect(stock.ticker, 'AAPL');
    expect(stock.howManyShares, 10);
    expect(stock.averagePrice, 150.0);
  });

  test('Equality', () {
    var stock1 = Stock( 'AAPL', howManyShares: 10, averagePrice: 150.0);
    var stock2 = Stock( 'AAPL', howManyShares: 10, averagePrice: 150.0);
    expect(stock1, stock2);

    stock2 = Stock( 'AAPL', howManyShares: 10, averagePrice: 151.0);
    expect(stock1, isNot(stock2));
  });

  test('HashCode', () {
    var stock1 = Stock( 'AAPL', howManyShares: 10, averagePrice: 150.0);
    var stock2 = Stock( 'AAPL', howManyShares: 10, averagePrice: 150.0);
    expect(stock1.hashCode, stock2.hashCode);

    stock2 = Stock( 'AAPL', howManyShares: 10, averagePrice: 151.0);
    expect(stock1.hashCode, isNot(stock2.hashCode));
  });
}
