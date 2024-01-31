import 'package:mobile_app_flutter_redux/client/infra/base_screen_chooser.dart';

import 'available_stocks.dart';
import 'portfolio.dart';
import 'ui.dart';

class AppState {
  Portfolio portfolio;
  AvailableStocks availableStocks;
  ScreenChoice screenChoice;
  Ui ui;

  static AppState initialState() => AppState(
        portfolio: Portfolio.EMPTY,
        availableStocks: AvailableStocks.EMPTY,
        screenChoice: ScreenChoice.portfolioAndCashBalance,
        ui: Ui.DEFAULT,
      );

  AppState({
    required this.portfolio,
    required this.availableStocks,
    required this.screenChoice,
    required this.ui,
  });

  AppState copy({
    Portfolio? portfolio,
    AvailableStocks? availableStocks,
    ScreenChoice? screenChoice,
    Ui? ui,
  }) {
    return AppState(
      portfolio: portfolio ?? this.portfolio,
      availableStocks: availableStocks ?? this.availableStocks,
      screenChoice: screenChoice ?? this.screenChoice,
      ui: ui ?? this.ui,
    );
  }

  @override
  String toString() {
    return 'AppState{\n'
        '   portfolio: $portfolio,\n'
        '   availableStocks: $availableStocks,\n'
        '   screenChoice: $screenChoice,\n'
        '   ui: $ui\n'
        '}';
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AppState &&
          runtimeType == other.runtimeType &&
          portfolio == other.portfolio &&
          availableStocks == other.availableStocks &&
          screenChoice == other.screenChoice &&
          ui == other.ui;

  @override
  int get hashCode =>
      portfolio.hashCode ^ availableStocks.hashCode ^ screenChoice.hashCode ^ ui.hashCode;
}
