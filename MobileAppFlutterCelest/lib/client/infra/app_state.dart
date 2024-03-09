import 'dart:async';

import 'package:async_redux/async_redux.dart';
import 'package:celest_backend/client.dart';
import 'package:celest_backend/models.dart';
import 'package:celest_backend/my_src/models/cash_balance.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app_flutter_celest/models/available_stocks.dart';
import 'package:mobile_app_flutter_celest/models/ui.dart';

class AppState {
  final Portfolio portfolio;
  final AvailableStocks availableStocks;
  final CelestEnvironment celestEnv;
  final Ui ui;

  static AppState initialState() => AppState(
        portfolio: Portfolio.EMPTY,
        availableStocks: AvailableStocks.EMPTY,
        celestEnv: celest.currentEnvironment,
        ui: Ui.DEFAULT,
      );

  AppState({
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
          portfolio: Portfolio(
            cashBalance: CashBalance(cashBalance),
            stocks: stocks,
          ),
          availableStocks: AvailableStocks(availableStocks),
        );

  AppState copy({
    Portfolio? portfolio,
    AvailableStocks? availableStocks,
    CelestEnvironment? celestEnv,
    Ui? ui,
  }) {
    return AppState(
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
          portfolio == other.portfolio &&
          availableStocks == other.availableStocks &&
          ui == other.ui &&
          celestEnv == other.celestEnv;

  @override
  int get hashCode =>
      portfolio.hashCode ^ availableStocks.hashCode ^ ui.hashCode ^ celestEnv.hashCode;
}

extension BuildContextExtension on BuildContext {
  //
  AppState get state => StoreProvider.state<AppState>(this);

  FutureOr<ActionStatus> dispatch(ReduxAction<AppState> action, {bool notify = true}) =>
      StoreProvider.dispatch(this, action, notify: notify);

  Future<ActionStatus> dispatchAndWait(ReduxAction<AppState> action, {bool notify = true}) =>
      StoreProvider.dispatchAndWait(this, action, notify: notify);

  ActionStatus dispatchSync(ReduxAction<AppState> action, {bool notify = true}) =>
      StoreProvider.dispatchSync(this, action, notify: notify);
}
