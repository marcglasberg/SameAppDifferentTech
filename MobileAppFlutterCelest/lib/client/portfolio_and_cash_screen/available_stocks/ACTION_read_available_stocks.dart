import 'package:mobile_app_flutter_celest/client/infra/app_state.dart';
import 'package:mobile_app_flutter_celest/client/infra/basic/ACTION_app.dart';
import 'package:mobile_app_flutter_celest/client/infra/dao/dao.dart';
import 'package:mobile_app_flutter_celest/models/available_stocks.dart';

class ReadAvailableStocks_Action extends AppAction {
  //
  @override
  Future<AppState?> reduce() async {
    var availableStocks = await DAO.readAvailableStocks();

    return state.copy(
      availableStocks: AvailableStocks(availableStocks),
    );
  }
}
