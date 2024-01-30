import 'package:mobile_app_flutter_redux/business/state/app_state.dart';
import 'package:mobile_app_flutter_redux/business/state/available_stock.dart';
import 'package:mobile_app_flutter_redux/client/infra/ACTION_app.dart';

class SellStock_Action extends AppAction {
  //
  final AvailableStock availableStock;
  final int howMany;

  SellStock_Action(
    this.availableStock, {
    required this.howMany,
  });

  @override
  AppState? reduce() {
    return state.copy(
      portfolio: state.portfolio.sell(availableStock, howMany: howMany),
    );
  }
}
