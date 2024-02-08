import 'package:celest_backend/models.dart';
import 'package:mobile_app_flutter_celest/client/infra/app_state.dart';
import 'package:mobile_app_flutter_celest/client/infra/basic/ACTION_app.dart';

class BuyStock_Action extends AppAction {
  //
  final AvailableStock availableStock;
  final int howMany;

  BuyStock_Action(
    this.availableStock, {
    required this.howMany,
  });

  @override
  AppState? reduce() {
    return state.copy(
      portfolio: state.portfolio.buy(availableStock, howMany: howMany),
    );
  }
}
