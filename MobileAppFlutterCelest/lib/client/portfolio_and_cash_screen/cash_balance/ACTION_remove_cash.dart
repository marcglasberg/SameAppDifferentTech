import 'package:mobile_app_flutter_celest/client/infra/app_state.dart';
import 'package:mobile_app_flutter_celest/client/infra/basic/ACTION_app.dart';
import 'package:mobile_app_flutter_celest/client/infra/dao/dao.dart';

class RemoveCash_Action extends AppAction with CheckInternet {
  //
  final double howMuch;

  RemoveCash_Action(this.howMuch);

  @override
  Future<AppState?> reduce() async {
    var newCashBalance = await DAO.removeCashBalance(howMuch);

    return state.copy(
      portfolio: state.portfolio.withCashBalance(newCashBalance),
    );
  }
}
