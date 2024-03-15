import 'package:async_redux/async_redux.dart';
import 'package:mobile_app_flutter_redux/client/infra/app_state.dart';
import 'package:mobile_app_flutter_redux/client/infra/basic/ACTION_app.dart';
import 'package:mobile_app_flutter_redux/client/utils/connectivity.dart';
import 'package:mobile_app_flutter_redux/models/available_stock.dart';

class SellStock_Action extends AppAction with CheckInternet, RespectRunConfig {
  //
  final AvailableStock availableStock;
  final int howMany;

  SellStock_Action(
    this.availableStock, {
    required this.howMany,
  });

  @override
  Future<AppState?> reduce() async {
    // Simulates some waiting.
    await Future.delayed(const Duration(milliseconds: 10));

    return state.copy(
      portfolio: state.portfolio.sell(availableStock, howMany: howMany),
    );
  }
}
