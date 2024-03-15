import 'package:async_redux/async_redux.dart';
import 'package:mobile_app_flutter_redux/client/infra/app_state.dart';
import 'package:mobile_app_flutter_redux/client/infra/basic/ACTION_app.dart';
import 'package:mobile_app_flutter_redux/client/utils/connectivity.dart';

class RemoveCash_Action extends AppAction with CheckInternet, RespectRunConfig {
  //
  final double howMuch;

  RemoveCash_Action(this.howMuch);

  @override
  Future<AppState?> reduce() async {
    // Simulates some waiting.
    await Future.delayed(const Duration(milliseconds: 10));

    return state.copy(
      portfolio: state.portfolio.removeCashBalance(howMuch),
    );
  }
}
