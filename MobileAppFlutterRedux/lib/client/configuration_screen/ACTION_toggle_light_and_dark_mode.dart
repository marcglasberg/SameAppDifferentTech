import 'package:mobile_app_flutter_redux/client/infra/app_state.dart';
import 'package:mobile_app_flutter_redux/client/infra/basic/ACTION_app.dart';
import 'package:mobile_app_flutter_redux/client/infra/theme/app_themes.dart';
import 'package:themed/themed.dart';

class ToggleLightAndDarkMode extends AppAction {
  //
  @override
  AppState? reduce() {
    //
    var ui = state.ui.toggleLightAndDarkMode();

    if (ui.isDarkMode)
      Themed.currentTheme = darkTheme;
    else
      Themed.clearCurrentTheme();

    return state.copy(
      ui: ui,
    );
  }
}
