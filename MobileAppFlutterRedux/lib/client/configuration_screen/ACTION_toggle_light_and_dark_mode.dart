import 'package:mobile_app_flutter_redux/client/infra/app_state.dart';
import 'package:mobile_app_flutter_redux/client/infra/basic/ACTION_app.dart';
import 'package:mobile_app_flutter_redux/client/infra/theme/app_themes.dart';
import 'package:themed/themed.dart';

class ToggleLightAndDarkMode_Action extends AppAction {
  //
  @override
  AppState? reduce() {
    //
    bool isDarkMode = !state.ui.isDarkMode;

    if (isDarkMode)
      Themed.currentTheme = darkTheme;
    else
      Themed.clearCurrentTheme();

    return state.copy(
      ui: state.ui.toggleLightAndDarkMode(),
    );
  }
}
