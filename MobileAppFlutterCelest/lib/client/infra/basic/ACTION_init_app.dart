import 'package:mobile_app_flutter_celest/client/infra/app_state.dart';
import 'ACTION_app.dart';

// Stuff the Store needs to do as soon as the app opens,
// like reading info from the backend, opening websockets, etc.
class InitApp_Action extends AppAction {
  //
  @override
  AppState? reduce() {
    return null;
  }
}
