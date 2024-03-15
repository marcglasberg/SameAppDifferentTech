import 'dart:async';

import 'package:async_redux/async_redux.dart';
import 'package:celest_backend/models.dart';
import 'package:mobile_app_flutter_celest/client/infra/app_state.dart';
import 'package:mobile_app_flutter_celest/client/infra/dao/dao.dart';
import 'ACTION_app.dart';

/// Do some stuff that needs to be done as soon as the app opens,
/// like reading info from the backend, opening websockets, etc.
///
/// The reducer will be retried indefinitely, while it fails.
/// The action is non-reentrant, so it can't be dispatched again while it's still running.
///
/// If [ifClearPortfolio] is true, the portfolio will be cleared immediately when the action is
/// dispatched, before the new data is fetched from the backend. This should be false when you
/// want the user to see the portfolio as it was before, for example, when some recent Portfolio
/// was read from the local device disk.
///
class InitApp_Action extends AppAction with Retry, UnlimitedRetries, NonReentrant {
  //
  bool ifClearPortfolio;

  InitApp_Action({this.ifClearPortfolio = false});

  @override
  void before() {
    if (ifClearPortfolio) dispatch(ClearPortfolio_Action());
  }

  @override
  Future<AppState?> reduce() async {
    // Initializes the DAO, if necessary, fetching data from the backend.
    await DAO.init();

    // The portfolio will be loaded from the local device disk, using the persistor. However, we
    // still need to read it from the cloud, in case it was updated from another device. When this
    // action is called, the persistor already loaded the portfolio from the local device disk,
    // so there is no risk of a race condition where the info from the disk arrives later than
    // the info from the cloud.
    var portfolio = await DAO.readPortfolio();

    return state.copy(portfolio: portfolio);
  }
}

/// Clears the portfolio: No stocks and no cash-balance.
class ClearPortfolio_Action extends AppAction {
  @override
  AppState reduce() {
    return state.copy(portfolio: Portfolio());
  }
}
