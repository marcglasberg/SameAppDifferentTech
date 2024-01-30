import 'package:mobile_app_flutter_redux/client/infra/base_screen_chooser.dart';

import 'available_stocks.dart';
import 'portfolio.dart';

class AppState {
  Portfolio portfolio;
  AvailableStocks availableStocks;
  ScreenChoice screenChoice;

  static AppState initialState() => AppState(
        portfolio: Portfolio.EMPTY,
        availableStocks: AvailableStocks.EMPTY,
        screenChoice: ScreenChoice.portfolioAndCashBalance,
      );

  AppState({
    required this.portfolio,
    required this.availableStocks,
    required this.screenChoice,
  });

  AppState copy({
    Portfolio? portfolio,
    AvailableStocks? availableStocks,
    ScreenChoice? screenChoice,
  }) {
    return AppState(
      portfolio: portfolio ?? this.portfolio,
      availableStocks: availableStocks ?? this.availableStocks,
      screenChoice: screenChoice ?? this.screenChoice,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AppState &&
          runtimeType == other.runtimeType &&
          portfolio == other.portfolio &&
          availableStocks == other.availableStocks &&
          screenChoice == other.screenChoice;

  @override
  int get hashCode => portfolio.hashCode ^ availableStocks.hashCode ^ screenChoice.hashCode;
}
