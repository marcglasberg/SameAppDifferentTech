import 'package:async_redux/async_redux.dart';
import 'package:mobile_app_flutter_celest/client/infra/app_state.dart';
import 'package:mobile_app_flutter_celest/client/utils/connectivity.dart';

abstract class AppAction extends ReduxAction<AppState> {
  @override
  String toString() => runtimeType.toString();
}

/// Mixin that checks for internet connection before the action.
/// If there's no internet, it shows a message and doesn't execute the action.
mixin CheckInternet implements AppAction {
  @override
  Future<void> before() async {
    await checkInternet();
  }
}
