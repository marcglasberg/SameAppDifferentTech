import 'package:async_redux/async_redux.dart';
import 'package:mobile_app_flutter_redux/client/infra/app_state.dart';
import 'package:mobile_app_flutter_redux/models/portfolio.dart';
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
    // There's nothing we need to do here.
    return null;
  }
}

/// Clears the portfolio: No stocks and no cash-balance.
class ClearPortfolio_Action extends AppAction {
  @override
  AppState reduce() {
    return state.copy(portfolio: Portfolio());
  }
}
