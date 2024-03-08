import 'package:celest_backend/client.dart';
import 'package:mobile_app_flutter_celest/client/infra/app_state.dart';
import 'ACTION_app.dart';

class Celest_Action extends AppAction {
  //
  final CelestEnvironment celestEnv;

  Celest_Action(this.celestEnv);

  Celest_Action.toggle()
      : celestEnv = (celest.currentEnvironment == CelestEnvironment.local)
            ? CelestEnvironment.production
            : CelestEnvironment.local;

  @override
  AppState? reduce() {
    celest.init(environment: celestEnv);
    return state.copy(celestEnv: celestEnv);
  }
}
