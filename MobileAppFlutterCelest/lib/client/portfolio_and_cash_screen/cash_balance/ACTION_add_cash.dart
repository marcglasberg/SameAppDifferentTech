import 'package:mobile_app_flutter_celest/client/infra/app_state.dart';
import 'package:mobile_app_flutter_celest/client/infra/basic/ACTION_app.dart';

class AddCash_Action extends AppAction {
  //
  final double howMuch;

  AddCash_Action(this.howMuch);

  @override
  AppState? reduce() {
    return state.copy(
      portfolio: state.portfolio.addCashBalance(howMuch),
    );
  }
}
