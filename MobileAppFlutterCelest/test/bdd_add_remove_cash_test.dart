import 'package:async_redux/async_redux.dart';
import 'package:bdd_framework/bdd_framework.dart';
import 'package:celest_backend/client.dart';
import 'package:celest_backend/my_src/models/cash_balance.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app_flutter_celest/client/infra/app_state.dart';
import 'package:mobile_app_flutter_celest/client/infra/run_config/run_config.dart';
import 'package:mobile_app_flutter_celest/client/portfolio_and_cash_screen/cash_balance/ACTION_add_cash.dart';
import 'package:mobile_app_flutter_celest/client/portfolio_and_cash_screen/cash_balance/ACTION_remove_cash.dart';

void main() {
  var feature = BddFeature('Add/Remove cash');

  setUp(() {
    RunConfig.setTestInstance();
    celest.init(environment: CelestEnvironment.production);
  });

  Bdd(feature)
      .scenario('Add cash.')
      .given('The user has 120 dollars in cash-balance.')
      .when('The user adds 100 dollars.')
      .then('The user now has 220 dollars.')
      .run((ctx) async {
    // Given:

    var store = Store(
      initialState: AppState.from(cashBalance: 120.00),
    );

    await celest.functions.admin.setDatabase(
      store.state.portfolio,
      store.state.availableStocks.list,
    );

    // When:
    await store.dispatchAndWait(AddCash_Action(100));

    // Then:
    expect(store.state.portfolio.cashBalance, CashBalance(220.00));
  });

  Bdd(feature)
      .scenario('Remove cash.')
      .given('The user has 220 dollars in cash-balance.')
      .when('The user removes 100 dollars.')
      .then('The user now has 120 dollars.')
      .run((ctx) async {
    // Given:

    var store = Store(
      initialState: AppState.from(cashBalance: 220.00),
    );

    await celest.functions.admin.setDatabase(
      store.state.portfolio,
      store.state.availableStocks.list,
    );

    // When:
    await store.dispatchAndWait(RemoveCash_Action(100));

    // Then:
    expect(store.state.portfolio.cashBalance, CashBalance(120.00));
  });

  Bdd(feature)
      .scenario('Remove cash you don not have.')
      .given('The user has 30 dollars in cash-balance.')
      .when('The user removes 100 dollars.')
      .then('The user now has 0 dollars.')
      .run((ctx) async {
    // Given:

    var store = Store(
      initialState: AppState.from(cashBalance: 30.00),
    );

    await celest.functions.admin.setDatabase(
      store.state.portfolio,
      store.state.availableStocks.list,
    );

    // When:
    var status = await store.dispatchAndWait(RemoveCash_Action(100));

    // Then:
    // expect(store.state.portfolio.cashBalance, CashBalance(0.00));

    expect(status.originalError, isA<UserException>());
    expect(store.state.portfolio.cashBalance, CashBalance(30.00));
  });
}
