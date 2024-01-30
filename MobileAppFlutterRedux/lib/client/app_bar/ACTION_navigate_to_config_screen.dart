import 'package:mobile_app_flutter_redux/business/state/app_state.dart';
import 'package:mobile_app_flutter_redux/client/infra/ACTION_app.dart';
import 'package:mobile_app_flutter_redux/client/infra/base_screen_chooser.dart';

class NavigateToConfigScreen_Action extends AppAction {
  //
  @override
  AppState? reduce() {
    return state.copy(
      screenChoice: ScreenChoice.configuration,
    );
  }
}
