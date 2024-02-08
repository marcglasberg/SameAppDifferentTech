/// For the moment, Celest has no database features, so I'm simulating a global database.
/// As soon as Celest has a database I'm going to remove this and replace it with the real thing.
// ignore: library_private_types_in_public_api
final _Database db = _Database();

class _Database {
  final Set<({String ticker, String name, double price})> _availableStocks = {};

  List<({String ticker, String name, double price})> get availableStocks =>
      _availableStocks.toList();

  void addStock({required String ticker, required String name, required double price}) {
    _availableStocks.add((ticker: ticker, name: name, price: price));
  }
}

/// I'm using the init function to simulate the database initialization.
/// In reality this would be an admin service that connects to a third-party stock price provider.
Future<void> init() async {
  if (db.availableStocks.isEmpty) {
    db.addStock(ticker: 'IBM', name: 'International Business Machines', price: 132.64);
    db.addStock(ticker: 'AAPL', name: 'Apple', price: 183.58);
    db.addStock(ticker: 'GOOG', name: 'Alphabet', price: 126.63);
    db.addStock(ticker: 'AMZN', name: 'Amazon', price: 125.30);
    db.addStock(ticker: 'META', name: 'Meta Platforms', price: 271.39);
    db.addStock(ticker: 'INTC', name: 'Intel', price: 29.86);
  }
}
