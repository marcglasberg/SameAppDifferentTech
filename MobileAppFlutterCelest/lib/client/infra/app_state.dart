import 'dart:async';

import 'package:async_redux/async_redux.dart';
import 'package:celest_backend/client.dart';
import 'package:celest_backend/models.dart';
import 'package:celest_backend/my_src/models/cash_balance.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app_flutter_celest/models/available_stocks.dart';
import 'package:mobile_app_flutter_celest/models/ui.dart';

class AppState {
  final Wait wait;
  final Portfolio portfolio;
  final AvailableStocks availableStocks;
  final CelestEnvironment celestEnv;
  final Ui ui;

  static AppState initialState() => AppState(
        wait: Wait(),
        portfolio: Portfolio.EMPTY,
        availableStocks: AvailableStocks.EMPTY,
        celestEnv: celest.currentEnvironment,
        ui: Ui.DEFAULT,
      );

  AppState({
    required this.wait,
    required this.portfolio,
    required this.availableStocks,
    CelestEnvironment? celestEnv,
    this.ui = Ui.DEFAULT,
  }) : celestEnv = celestEnv ?? celest.currentEnvironment;

  AppState.from({
    double cashBalance = 0.0,
    Iterable<Stock> stocks = const [],
    Iterable<AvailableStock> availableStocks = const [],
  }) : this(
          wait: Wait(),
          portfolio: Portfolio(
            cashBalance: CashBalance(cashBalance),
            stocks: stocks,
          ),
          availableStocks: AvailableStocks(availableStocks),
        );

  AppState copy({
    Wait? wait,
    Portfolio? portfolio,
    AvailableStocks? availableStocks,
    CelestEnvironment? celestEnv,
    Ui? ui,
  }) {
    return AppState(
      wait: wait ?? this.wait,
      portfolio: portfolio ?? this.portfolio,
      availableStocks: availableStocks ?? this.availableStocks,
      celestEnv: celestEnv ?? this.celestEnv,
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
          wait == other.wait &&
          portfolio == other.portfolio &&
          availableStocks == other.availableStocks &&
          ui == other.ui &&
          celestEnv == other.celestEnv;

  @override
  int get hashCode => wait.hashCode ^ portfolio.hashCode ^ availableStocks.hashCode ^ ui.hashCode;
}

extension BuildContextExtension on BuildContext {
  AppState get state => StoreProvider.of<AppState>(this, null).state;

  FutureOr<ActionStatus> dispatch(ReduxAction<AppState> action, {bool notify = true}) =>
      StoreProvider.of<AppState>(this, null).dispatch(action, notify: notify);

  Future<ActionStatus> dispatchAndWait(ReduxAction<AppState> action, {bool notify = true}) =>
      StoreProvider.of<AppState>(this, null).dispatchAndWait(action, notify: notify);

  ActionStatus dispatchSync(ReduxAction<AppState> action, {bool notify = true}) =>
      StoreProvider.of<AppState>(this, null).dispatchSync(action, notify: notify);
}
