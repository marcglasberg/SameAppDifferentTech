import 'package:mobile_app_flutter_redux/business/state/app_state.dart';
import 'package:mobile_app_flutter_redux/client/infra/ACTION_app.dart';

class RemoveCash_Action extends AppAction {
  //
  final double howMuch;

  RemoveCash_Action(this.howMuch);

  @override
  AppState? reduce() {
    return state.copy(
      portfolio: state.portfolio.removeCashBalance(howMuch),
    );
  }
}
