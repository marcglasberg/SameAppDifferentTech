import 'package:celest_backend/models.dart';
import 'package:celest_backend/my_src/models/cash_balance.dart';
import 'package:mobile_app_flutter_celest/client/infra/app_state.dart';
import 'package:mobile_app_flutter_celest/client/infra/basic/ACTION_app.dart';
import 'package:mobile_app_flutter_celest/client/infra/dao/dao.dart';

class SellStock_Action extends AppAction with CheckInternet {
  //
  final AvailableStock availableStock;
  final int howMany;

  SellStock_Action(
    this.availableStock, {
    required this.howMany,
  });

  @override
  Future<AppState?> reduce() async {
    //
    Stock stockX;
    CashBalance cashBalanceX;

    try {
      var (stock: stock, cashBalance: cashBalance) =
          await DAO.sellStock(availableStock, howMany: howMany);

      cashBalanceX = cashBalance;
      stockX = stock;
    } catch (error) {
      rethrow;
    }

    var updatedPortfolio = state.portfolio
        .withStock(stockX.ticker, stockX.howManyShares, stockX.averagePrice)
        .withCashBalance(cashBalanceX);

    return state.copy(portfolio: updatedPortfolio);
  }
}
