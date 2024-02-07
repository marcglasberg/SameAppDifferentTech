import 'package:mobile_app_flutter_celest/client/infra/app_state.dart';
import 'package:mobile_app_flutter_celest/client/infra/basic/ACTION_app.dart';
import 'package:mobile_app_flutter_celest/client/infra/navigation/base_screen_chooser.dart';

class NavigateToConfigScreen_Action extends AppAction {
  @override
  AppState? reduce() {
    return state.copy(
      ui: state.ui.copy(screenChoice: ScreenChoice.configuration),
    );
  }
}

class NavigateToPortfolioAndCashBalanceScreen_Action extends AppAction {
  @override
  AppState? reduce() {
    return state.copy(
      ui: state.ui.copy(screenChoice: ScreenChoice.portfolioAndCashBalance),
    );
  }
}
