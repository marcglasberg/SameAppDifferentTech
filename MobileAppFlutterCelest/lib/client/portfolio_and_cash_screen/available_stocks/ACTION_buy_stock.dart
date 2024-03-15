import 'package:async_redux/async_redux.dart';
import 'package:celest_backend/models.dart';
import 'package:mobile_app_flutter_celest/client/infra/app_state.dart';
import 'package:mobile_app_flutter_celest/client/infra/basic/ACTION_app.dart';
import 'package:mobile_app_flutter_celest/client/infra/dao/dao.dart';
import 'package:mobile_app_flutter_celest/client/utils/connectivity.dart';

class BuyStock_Action extends AppAction with CheckInternet, RespectRunConfig {
  //
  final AvailableStock availableStock;
  final int howMany;

  BuyStock_Action(
    this.availableStock, {
    required this.howMany,
  });

  @override
  Future<AppState?> reduce() async {
    var (stock: stock, cashBalance: cashBalance) =
        await DAO.buyStock(availableStock, howMany: howMany);

    var updatedPortfolio = state.portfolio
        .withStock(stock.ticker, stock.howManyShares, stock.averagePrice)
        .withCashBalance(cashBalance);

    return state.copy(portfolio: updatedPortfolio);
  }
}

