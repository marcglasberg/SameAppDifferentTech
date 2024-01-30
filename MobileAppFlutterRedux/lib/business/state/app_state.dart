import 'available_stock.dart';
import 'available_stocks.dart';
import 'portfolio.dart';

class AppState {
  Portfolio portfolio;
  AvailableStocks availableStocks;

  static AppState initialState() => AppState(
        portfolio: Portfolio(),
        availableStocks: AvailableStocks(list: [
          AvailableStock('IBM', name: 'International Business Machines', currentPrice: 132.64),
          AvailableStock('AAPL', name: 'Apple', currentPrice: 183.58),
          AvailableStock('GOOG', name: 'Alphabet', currentPrice: 126.63),
          AvailableStock('AMZN', name: 'Amazon', currentPrice: 125.30),
          AvailableStock('META', name: 'Meta Platforms', currentPrice: 271.39),
          AvailableStock('INTC', name: 'Intel', currentPrice: 29.86),
        ]),
      );

  AppState({
    required this.portfolio,
    required this.availableStocks,
  });

  AppState copy({
    Portfolio? portfolio,
    AvailableStocks? availableStocks,
  }) {
    return AppState(
        portfolio: portfolio ?? this.portfolio,
        availableStocks: availableStocks ?? this.availableStocks);
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AppState && runtimeType == other.runtimeType && portfolio == other.portfolio;

  @override
  int get hashCode => portfolio.hashCode;
}
