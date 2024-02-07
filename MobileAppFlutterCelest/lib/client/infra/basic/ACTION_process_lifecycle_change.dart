import 'package:flutter/material.dart';
import 'package:mobile_app_flutter_celest/client/infra/app_state.dart';
import 'ACTION_app.dart';

/// We don't want the persistor to start saving stuff while the app is being turned off.
/// We want to avoid the app to be killed in the middle of saving.
///
/// Flutter app lifecycle is confusing, and it's not very clear when is the last chance we have to
/// save before the app is killed, but here we're pausing the persistor when the app is [paused]
/// or [detached], and then resume it when the app is [resumed] or [inactive].
///
class ProcessLifecycleChange_Action extends AppAction {
  //
  final AppLifecycleState lifecycle;

  ProcessLifecycleChange_Action(this.lifecycle);

  @override
  AppState? reduce() {
    //
    if (lifecycle == AppLifecycleState.paused || lifecycle == AppLifecycleState.detached) {
      store.persistAndPausePersistor();
    }
    //
    else if (lifecycle == AppLifecycleState.resumed || lifecycle == AppLifecycleState.inactive) {
      store.resumePersistor();
    }
    //
    else
      throw AssertionError(lifecycle);

    return null;
  }
}
