import 'available_stocks.dart';
import 'portfolio.dart';

class AppState {
  Portfolio portfolio;
  AvailableStocks availableStocks;

  static AppState initialState() => AppState(
        portfolio: Portfolio.EMPTY,
        availableStocks: AvailableStocks.EMPTY,
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
