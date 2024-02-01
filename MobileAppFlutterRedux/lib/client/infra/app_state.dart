import 'package:mobile_app_flutter_redux/models/available_stocks.dart';
import 'package:mobile_app_flutter_redux/models/portfolio.dart';
import 'package:mobile_app_flutter_redux/models/ui.dart';

class AppState {
  Portfolio portfolio;
  AvailableStocks availableStocks;
  Ui ui;

  static AppState initialState() => AppState(
        portfolio: Portfolio.EMPTY,
        availableStocks: AvailableStocks.EMPTY,
        ui: Ui.DEFAULT,
      );

  AppState({
    required this.portfolio,
    required this.availableStocks,
    required this.ui,
  });

  AppState copy({
    Portfolio? portfolio,
    AvailableStocks? availableStocks,
    Ui? ui,
  }) {
    return AppState(
      portfolio: portfolio ?? this.portfolio,
      availableStocks: availableStocks ?? this.availableStocks,
      ui: ui ?? this.ui,
    );
  }

  @override
  String toString() {
    return 'AppState{\n'
        '   portfolio: $portfolio,\n'
        '   availableStocks: $availableStocks,\n'
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
          ui == other.ui;

  @override
  int get hashCode => portfolio.hashCode ^ availableStocks.hashCode ^ ui.hashCode;
}
