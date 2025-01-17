import 'package:async_redux/async_redux.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app_flutter_redux/client/infra/app_state.dart';
import 'package:mobile_app_flutter_redux/client/infra/run_config/run_config.dart';
import 'package:mobile_app_flutter_redux/client/portfolio_and_cash_screen/available_stocks/ACTION_buy_stock.dart';
import 'package:mobile_app_flutter_redux/client/portfolio_and_cash_screen/available_stocks/ACTION_sell_stock.dart';
import 'package:mobile_app_flutter_redux/client/portfolio_and_cash_screen/available_stocks/stock_and_buy_sell_buttons.dart';
import 'package:mobile_app_flutter_redux/models/available_stock.dart';
import 'package:mobile_app_flutter_redux/models/stock.dart';

void main() {
  setUp(() {
    RunConfig.setTestInstance();
  });

  final ibmAvb = AvailableStock('IBM', name: 'I. B. Machines', currentPrice: 150);
  final ibm_1Share = Stock('IBM', howManyShares: 1, averagePrice: 150);
  final ibm_2Shares = Stock('IBM', howManyShares: 2, averagePrice: 150);
  final aapl_1Share = Stock('AAPL', howManyShares: 1, averagePrice: 150);

  Factory factory() => Factory(StockAndBuySellButtons_Connector(availableStock: ibmAvb));

  test('enables buy button when there is enough money to buy the stock. It disables otherwise.',
      () {
    // The BUY button is disabled, since we cannot buy stock when there is no money.
    var store = Store(initialState: AppState.from(cashBalance: 0, availableStocks: [ibmAvb]));
    var vm = Vm.createFrom(store, factory());
    expect(vm.ifBuyDisabled, true);

    // The BUY button is disabled, since we cannot buy stock that costs 150, when there is only 100.
    store = Store(initialState: AppState.from(cashBalance: 100, availableStocks: [ibmAvb]));
    vm = Vm.createFrom(store, factory());
    expect(vm.ifBuyDisabled, true);

    // The BUY button is enabled, as we can buy stock that costs 150 when there is exactly 150.
    store = Store(initialState: AppState.from(cashBalance: 150, availableStocks: [ibmAvb]));
    vm = Vm.createFrom(store, factory());
    expect(vm.ifBuyDisabled, false);

    // The BUY button is enabled, as we can buy stock that costs 150 when there is more than 150.
    store = Store(initialState: AppState.from(cashBalance: 1000, availableStocks: [ibmAvb]));
    vm = Vm.createFrom(store, factory());
    expect(vm.ifBuyDisabled, false);
  });

  test('enables sell button when there at least 1 stock. It disables otherwise.', () {
    //
    var store = Store(initialState: AppState.from(availableStocks: [ibmAvb]));
    var vm = Vm.createFrom(store, factory());
    expect(vm.ifSellDisabled, true);

    // Cannot sell IBM, when there are only AAPL stocks.
    store = Store(initialState: AppState.from(availableStocks: [ibmAvb], stocks: [aapl_1Share]));
    vm = Vm.createFrom(store, factory());
    expect(vm.ifSellDisabled, true);

    // Can sell IBM, when there are IBM stocks.
    store = Store(
        initialState: AppState.from(availableStocks: [ibmAvb], stocks: [aapl_1Share, ibm_1Share]));
    vm = Vm.createFrom(store, factory());
    expect(vm.ifSellDisabled, false);
  });

  test('Buying stock.', () async {
    //
    // Cash balance is 1000. There are no IBM stocks.
    var store = Store(
      initialState: AppState.from(
        availableStocks: [ibmAvb],
        stocks: [],
        cashBalance: 1000,
      ),
    );

    // Dispatches: BuyStock_Action(connector.availableStock, howMany: 1),
    var vm = Vm.createFrom(store, factory());
    vm.onBuy(); // Buy 1 share of IBM stock.

    // Cash balance decreased by the price of 1 IBM stock. Portfolio now contains 1 IBM stock.
    await store.waitActionType(BuyStock_Action);
    expect(store.state.portfolio.cashBalance.amount, 1000 - ibmAvb.currentPrice);
    expect(store.state.portfolio.howManyStocks(ibmAvb.ticker), 1);
  });

  test(
      'Buying stock without enough money. '
      'Note: In practice this error never happens, because the BUY button is disabled.', () async {
    // Set initial cash balance to 100, which is less than the price $150 of IBM stock.
    var store = Store(
      initialState: AppState.from(
        availableStocks: [ibmAvb],
        stocks: [],
        cashBalance: 100,
      ),
    );
    var vm = Vm.createFrom(store, factory());
    vm.onBuy(); // Try to buy 1 share of IBM stock.

    // Assert that we get an UserException.
    var action = await store.waitActionType(BuyStock_Action);
    expect(action!.status.originalError, isA<UserException>());
  });

  test('Selling stock.', () async {
    //
    // 2 shares of IBM stock in the portfolio. CashBalance is 500
    var store = Store(
      initialState: AppState.from(
        availableStocks: [ibmAvb],
        stocks: [ibm_2Shares],
        cashBalance: 500,
      ),
    );

    // VmFactory<AppState, T, Model>
    var vm = Vm.createFrom(store, factory());
    vm.onSell(); // Sell 1 share of IBM stock.

    // Cash balance has increased by the price of 1 IBM stock.
    var action = await store.waitActionType(SellStock_Action);
    expect(action!.state.portfolio.cashBalance.amount, 500 + ibmAvb.currentPrice);

    // The portfolio now contains 1 IBM stock.
    expect(action.state.portfolio.howManyStocks(ibm_1Share.ticker), 1);
  });

  test(
      'Selling stock that is not in the portfolio. '
      'Note: In practice this error never happens, because the SELL button is disabled.', () async {
    //
    // The portfolio does not contain IBM stock.
    var store = Store(
      initialState: AppState.from(
        availableStocks: [ibmAvb],
        stocks: [],
        // stocks: [aapl_1Share],
        cashBalance: 500,
      ),
    );

    var vm = Vm.createFrom(store, factory());
    vm.onSell(); // Try to sell 1 share of IBM stock.

    // Assert that we get an UserException.
    var action = await store.waitActionType(SellStock_Action);
    expect(action!.status.originalError, isA<UserException>());
  });
}
