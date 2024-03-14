import 'package:async_redux/async_redux.dart';
import 'package:flutter/foundation.dart';
import 'package:mobile_app_flutter_celest/client/infra/app_state.dart';
import 'package:mobile_app_flutter_celest/client/infra/persistor/app_persistor.dart';
import 'package:mobile_app_flutter_celest/client/portfolio_and_cash_screen/available_stocks/ACTION_fluctuate_stock_price.dart';

import '../run_config/run_config.dart';
import 'ACTION_init_app.dart';

class Business {
  static late Store<AppState> store;

  /// 1. Sets up some app configurations.
  /// 2. Creates the "persistor" which loads the state from local device disk when the app starts,
  ///     and saves the state whenever the state changes, later on.
  /// 3. If no state is found in the local device disk, it creates a new state and then saves it.
  /// 4. Creates the Redux "store" which holds the app state in memory.
  /// 5. Runs a Redux action called `InitApp_Action` with stuff the Store needs to do as soon as the
  /// app opens.
  static Future<void> init(RunConfig runConfig) async {
    //
    // 1. Set the RunConfig instance.
    RunConfig.setInstance(runConfig);

    // 2. Create the persistor, and try to read any previously saved state.
    var persistor = AppPersistor();
    AppState? initialState = await persistor.readState();

    // 3. If there is no saved state, create a new empty one and save it.
    if (initialState == null) {
      initialState = AppState.initialState();
      await persistor.saveInitialState(initialState);
    }

    // 4. Create the store.
    store = Store<AppState>(
      initialState: initialState,
      persistor: persistor,
      globalWrapError: AppWrapError(),
      wrapReduce: AppWrapReduce(),
      actionObservers: kReleaseMode ? null : [AppObserver()],
    );

    // 5. Do stuff that needs to be done as soon as the app opens.
    store.dispatch(InitApp_Action());
  }
}

// TODO: MARCELO: This will be useful soon to unwrap errors thrown by the backend.
class AppWrapError<St> extends GlobalWrapError<St> {
  //
  @override
  Object? wrap(Object error, [StackTrace? stackTrace, ReduxAction<St>? action]) {
    return error;
  }
}

/// Not doing anything at the moment.
class AppWrapReduce extends WrapReduce<AppState> {
  //
  @override
  bool ifShouldProcess() => false;

  @override
  AppState process({
    required AppState oldState,
    required AppState newState,
  }) {
    return newState;
  }
}

class AppObserver extends ConsoleActionObserver<AppState> {
  @override
  void observe(ReduxAction<AppState> action, int dispatchCount, {required bool ini}) {
    if (ini && action is! SetStockPrice_Action) super.observe(action, dispatchCount, ini: ini);
  }
}
