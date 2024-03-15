import 'package:async_redux/async_redux.dart';
import 'package:mobile_app_flutter_celest/client/infra/app_state.dart';
import 'package:mobile_app_flutter_celest/client/infra/basic/ACTION_app.dart';
import 'package:mobile_app_flutter_celest/client/infra/dao/dao.dart';
import 'package:mobile_app_flutter_celest/client/utils/connectivity.dart';

class AddCash_Action extends AppAction with CheckInternet, RespectRunConfig {
  //
  final double howMuch;

  AddCash_Action(this.howMuch);

  @override
  Future<AppState?> reduce() async {
    var newCashBalance = await DAO.addCashBalance(howMuch);

    return state.copy(
      portfolio: state.portfolio.withCashBalance(newCashBalance),
    );
  }
}
