import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app_flutter_celest/models/available_stock.dart';

void main() {
  test('currentPriceStr', () {
    var availableStock = AvailableStock('AAPL', name: 'Apple', currentPrice: 150.0);
    expect(availableStock.currentPriceStr, 'US\$ 150.00');
  });

  test('withCurrentPrice', () {
    var availableStock = AvailableStock('AAPL', name: 'Apple', currentPrice: 150.0);
    var updatedStock = availableStock.withCurrentPrice(200.0);
    expect(updatedStock.currentPrice, 200.0);
  });

  test('toStock', () {
    var availableStock = AvailableStock('AAPL', name: 'Apple', currentPrice: 150.0);
    var stock = availableStock.toStock(shares: 10);
    expect(stock.ticker, 'AAPL');
    expect(stock.howManyShares, 10);
    expect(stock.averagePrice, 150.0);
  });

  test('Equality', () {
    var availableStock1 = AvailableStock('AAPL', name: 'Apple', currentPrice: 150.0);
    var availableStock2 = AvailableStock('AAPL', name: 'Apple', currentPrice: 150.0);
    expect(availableStock1, availableStock2);

    availableStock2 = AvailableStock('AAPL', name: 'Apple', currentPrice: 151.0);
    expect(availableStock1, isNot(availableStock2));
  });

  test('HashCode', () {
    var availableStock1 = AvailableStock('AAPL', name: 'Apple', currentPrice: 150.0);
    var availableStock2 = AvailableStock('AAPL', name: 'Apple', currentPrice: 150.0);
    expect(availableStock1.hashCode, availableStock2.hashCode);

    availableStock2 = AvailableStock('AAPL', name: 'Apple', currentPrice: 151.0);
    expect(availableStock1.hashCode, isNot(availableStock2.hashCode));
  });
}
