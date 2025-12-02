import 'package:async_redux/async_redux.dart';
import 'package:mobile_app_flutter_redux/client/infra/app_state.dart';
import 'package:mobile_app_flutter_redux/client/infra/basic/ACTION_app.dart';
import 'package:mobile_app_flutter_redux/client/utils/connectivity.dart';

class RemoveCash extends AppAction with CheckInternet, RespectRunConfig {
  //
  final double howMuch;

  RemoveCash(this.howMuch);

  @override
  Future<AppState?> reduce() async {
    // Simulates some waiting.
    await Future.delayed(const Duration(milliseconds: 50));

    if (state.portfolio.cashBalance.isZero())
      throw UserException(
        'Cannot remove money',
        reason: 'The cash balance is already zero.',
      );

    return state.copy(
      portfolio: state.portfolio.removeCashBalance(howMuch),
    );
  }

  @override
  String toString() => 'RemoveCash($howMuch)';
}
