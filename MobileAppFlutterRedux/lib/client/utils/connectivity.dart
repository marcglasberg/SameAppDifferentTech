import 'package:async_redux/async_redux.dart';
import 'package:mobile_app_flutter_redux/client/infra/app_state.dart';
import 'package:mobile_app_flutter_redux/client/infra/run_config/run_config.dart';

/// This changes the behavior of the [CheckInternet] mixin,
/// so that it uses the [RunConfig]. Use it like this:
///
/// ```dart
/// class BuyStock_Action extends AppAction with CheckInternet, RespectRunConfig {
/// ```
/// Note: Once an action with `RespectRunConfig` is used the first time, it will change the
/// behavior of the `CheckInternet` mixin for all other actions that use it.
/// Instead of using this mixin, this code could also be put into the app initialization code,
/// and in the tests initialization code. But this mixin is more convenient.
///
mixin RespectRunConfig on CheckInternet<AppState> {
  @override
  bool? get internetOnOffSimulation {
    CheckInternet.forceInternetOnOffSimulation = _internetOnOffSimulation;
    return _internetOnOffSimulation();
  }

  bool? _internetOnOffSimulation() {
    if (RunConfig.instance.disablePlatformChannels)
      return true;
    else if (!RunConfig.instance.ifChecksInternetConnection)
      return true;
    else
      return null;
  }
}
