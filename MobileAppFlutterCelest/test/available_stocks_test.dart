import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app_flutter_celest/models/available_stock.dart';
import 'package:mobile_app_flutter_celest/models/available_stocks.dart';

void main() {
  test('findBySymbolOrNull', () {
    var availableStock = AvailableStock('AAPL', name: 'Apple', currentPrice: 150.0);
    var availableStocks = AvailableStocks([availableStock]);

    expect(availableStocks.findBySymbolOrNull('AAPL'), availableStock);
    expect(availableStocks.findBySymbolOrNull('GOOG'), null);
  });

  test('findBySymbol', () {
    var availableStock = AvailableStock('AAPL', name: 'Apple', currentPrice: 150.0);
    var availableStocks = AvailableStocks([availableStock]);

    expect(availableStocks.findBySymbol('AAPL'), availableStock);
    expect(() => availableStocks.findBySymbol('GOOG'), throwsException);
  });

  test('forEach', () {
    var availableStock = AvailableStock('AAPL', name: 'Apple', currentPrice: 150.0);
    var availableStocks = AvailableStocks([availableStock]);

    availableStocks.forEach((stock) {
      expect(stock, availableStock);
    });
  });

  test('withAvailableStock', () {
    var availableStock = AvailableStock('AAPL', name: 'Apple', currentPrice: 150.0);
    var availableStocks = AvailableStocks([availableStock]);

    var newAvailableStock = AvailableStock('GOOG', name: 'Google', currentPrice: 1000.0);
    var updatedAvailableStocks = availableStocks.withAvailableStock(newAvailableStock);

    expect(updatedAvailableStocks.findBySymbolOrNull('AAPL'), availableStock);
    expect(updatedAvailableStocks.findBySymbolOrNull('GOOG'), newAvailableStock);
  });

  test('withUpdatedAvailableStock with non-existing stock', () {
    var availableStock = AvailableStock('AAPL', name: 'Apple', currentPrice: 150.0);
    var availableStocks = AvailableStocks([availableStock]);

    var newAvailableStock = AvailableStock('GOOG', name: 'Google', currentPrice: 1000.0);
    var updatedAvailableStocks = availableStocks.withUpdatedAvailableStock(newAvailableStock);

    expect(updatedAvailableStocks.findBySymbolOrNull('AAPL'), availableStock);
    expect(updatedAvailableStocks.findBySymbolOrNull('GOOG'), null);
  });

  test('withUpdatedAvailableStock with existing stock', () {
    var availableStock = AvailableStock('AAPL', name: 'Apple', currentPrice: 150.0);
    var availableStocks = AvailableStocks([availableStock]);

    var newAvailableStock = AvailableStock('GOOG', name: 'Google', currentPrice: 1000.0);
    var updatedAvailableStocks = availableStocks.withUpdatedAvailableStock(newAvailableStock);

    expect(updatedAvailableStocks.findBySymbolOrNull('AAPL'), availableStock);
    expect(updatedAvailableStocks.findBySymbolOrNull('GOOG'), null);
  });

  test('Equality', () {
    var availableStocks1 = AvailableStocks([
      AvailableStock('AAPL', name: 'Apple', currentPrice: 150.0),
    ]);
    var availableStocks2 = AvailableStocks([
      AvailableStock('AAPL', name: 'Apple', currentPrice: 150.0),
    ]);
    expect(availableStocks1, availableStocks2);

    availableStocks2 = AvailableStocks([
      AvailableStock('AAPL', name: 'Apple', currentPrice: 151.0),
    ]);
    expect(availableStocks1, isNot(availableStocks2));
  });

  test('HashCode', () {
    var availableStocks1 = AvailableStocks([
      AvailableStock('AAPL', name: 'Apple', currentPrice: 150.0),
    ]);
    var availableStocks2 = AvailableStocks([
      AvailableStock('AAPL', name: 'Apple', currentPrice: 150.0),
    ]);
    expect(availableStocks1.hashCode, availableStocks2.hashCode);

    availableStocks2 = AvailableStocks([
      AvailableStock('AAPL', name: 'Apple', currentPrice: 151.0),
    ]);
    expect(availableStocks1.hashCode, isNot(availableStocks2.hashCode));
  });
}
