import 'dart:async';

import 'package:async_redux/async_redux.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app_flutter_celest/models/available_stock.dart';
import 'package:mobile_app_flutter_celest/models/available_stocks.dart';
import 'package:mobile_app_flutter_celest/models/cash_balance.dart';
import 'package:mobile_app_flutter_celest/models/portfolio.dart';
import 'package:mobile_app_flutter_celest/models/stock.dart';
import 'package:mobile_app_flutter_celest/models/ui.dart';

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
    this.ui = Ui.DEFAULT,
  });

  AppState.from({
    double cashBalance = 0.0,
    Iterable<Stock> stocks = const [],
    Iterable<AvailableStock> availableStocks = const [],
  }) : this(
          portfolio: Portfolio(
            cashBalance: CashBalance(cashBalance),
            stocks: stocks,
          ),
          availableStocks: AvailableStocks(availableStocks),
        );

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

extension BuildContextExtension on BuildContext {
  AppState get state => StoreProvider.of<AppState>(this, null).state;

  FutureOr<ActionStatus> dispatch(ReduxAction<AppState> action, {bool notify = true}) =>
      StoreProvider.of<AppState>(this, null).dispatch(action, notify: notify);

  Future<ActionStatus> dispatchAsync(ReduxAction<AppState> action, {bool notify = true}) =>
      StoreProvider.of<AppState>(this, null).dispatchAsync(action, notify: notify);

  ActionStatus dispatchSync(ReduxAction<AppState> action, {bool notify = true}) =>
      StoreProvider.of<AppState>(this, null).dispatchSync(action, notify: notify);
}
