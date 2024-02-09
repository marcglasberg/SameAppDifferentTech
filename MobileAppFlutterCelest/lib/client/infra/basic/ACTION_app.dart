import 'package:async_redux/async_redux.dart';
import 'package:mobile_app_flutter_celest/client/infra/app_state.dart';
import 'package:mobile_app_flutter_celest/client/utils/connectivity.dart';

abstract class AppAction extends ReduxAction<AppState> {
  @override
  String toString() => runtimeType.toString();
}

/// Mixin that alters an Action in the following way:
/// Adds a wait-state, as soon as the action starts.
/// Removes the wait-state after the action is done.
///
/// It also checks for internet connection before the action.
///
/// You can check if the action is waiting by doing: `wait.isWaiting`
mixin WithWaitState implements AppAction {
  @override
  Future<void> before() async {
    await checkInternet();
    dispatch(WaitAction.add(this));
  }

  @override
  void after() => dispatch(WaitAction.remove(this));
}
