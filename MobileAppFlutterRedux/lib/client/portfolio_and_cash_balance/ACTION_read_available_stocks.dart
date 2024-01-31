import 'package:mobile_app_flutter_redux/business/state/app_state.dart';
import 'package:mobile_app_flutter_redux/business/state/available_stocks.dart';
import 'package:mobile_app_flutter_redux/client/infra/ACTION_app.dart';

import '../../business/infra/dao/dao.dart';

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
