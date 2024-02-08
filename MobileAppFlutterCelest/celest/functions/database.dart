import 'package:celest_backend/models.dart';

/// For the moment, Celest has no database features, so I'm simulating a global database.
/// As soon as Celest has a database I'm going to remove this and replace it with the real thing.
// ignore: library_private_types_in_public_api
final _Database db = _Database();

class _Database {
  final Set<({String ticker, String name, double price})> _availableStocks = {};
  Portfolio _portfolio = Portfolio();

  List<({String ticker, String name, double price})> get availableStocks =>
      _availableStocks.toList();

  Portfolio get portfolio => _portfolio;

  void addCashBalance(double howMuch) {
    _portfolio = _portfolio.addCashBalance(howMuch);
  }

  void removeCashBalance(double howMuch) {
    _portfolio = _portfolio.removeCashBalance(howMuch);
  }

  void buyStock(AvailableStock availableStock, {required int howMany}) {
    _portfolio = _portfolio.buy(availableStock, howMany: howMany);
  }

  void sellStock(AvailableStock availableStock, {required int howMany}) {
    _portfolio = _portfolio.sell(availableStock, howMany: howMany);
  }

  void addAvailableStock({required String ticker, required String name, required double price}) {
    _availableStocks.add((ticker: ticker, name: name, price: price));
  }
}

/// I'm using the init function to simulate the database initialization.
/// In reality this would be an admin service that connects to a third-party stock price provider.
Future<void> init() async {
  if (db.availableStocks.isEmpty) {
    db.addAvailableStock(ticker: 'IBM', name: 'International Business Machines', price: 132.64);
    db.addAvailableStock(ticker: 'AAPL', name: 'Apple', price: 183.58);
    db.addAvailableStock(ticker: 'GOOG', name: 'Alphabet', price: 126.63);
    db.addAvailableStock(ticker: 'AMZN', name: 'Amazon', price: 125.30);
    db.addAvailableStock(ticker: 'META', name: 'Meta Platforms', price: 271.39);
    db.addAvailableStock(ticker: 'INTC', name: 'Intel', price: 29.86);
  }
}
