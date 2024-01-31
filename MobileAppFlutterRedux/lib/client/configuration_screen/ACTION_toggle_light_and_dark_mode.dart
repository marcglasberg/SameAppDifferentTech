import 'package:mobile_app_flutter_redux/business/state/app_state.dart';
import 'package:mobile_app_flutter_redux/client/infra/ACTION_app.dart';
import 'package:mobile_app_flutter_redux/client/theme/app_themes.dart';
import 'package:themed/themed.dart';

class ToggleLightAndDarkMode_Action extends AppAction {
  //
  bool forceDarkMode;

  ToggleLightAndDarkMode_Action({this.forceDarkMode = false});

  @override
  AppState? reduce() {
    //
    bool isDarkMode = forceDarkMode ? true : !state.ui.isDarkMode;

    if (isDarkMode)
      Themed.currentTheme = darkTheme;
    else
      Themed.clearCurrentTheme();

    return state.copy(
      ui: state.ui.toggleLightAndDarkMode(),
    );
  }
}
