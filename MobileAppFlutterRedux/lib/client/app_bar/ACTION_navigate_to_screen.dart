import 'package:mobile_app_flutter_redux/client/infra/app_state.dart';
import 'package:mobile_app_flutter_redux/client/infra/basic/ACTION_app.dart';
import 'package:mobile_app_flutter_redux/client/infra/navigation/base_screen_chooser.dart';

class NavigateToConfigScreen extends AppAction {
  @override
  AppState? reduce() {
    return state.copy(
      ui: state.ui.copy(screenChoice: ScreenChoice.configuration),
    );
  }
}

class NavigateToPortfolioAndCashBalanceScreen extends AppAction {
  @override
  AppState? reduce() {
    return state.copy(
      ui: state.ui.copy(screenChoice: ScreenChoice.portfolioAndCashBalance),
    );
  }
}
