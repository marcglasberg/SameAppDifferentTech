import 'package:async_redux/async_redux.dart';
import 'package:flutter/material.dart';
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

  final ibmAvb = AvailableStock('IBM', name: 'I.B.M.', currentPrice: 150);
  final ibm_1Share = Stock('IBM', howManyShares: 1, averagePrice: 150);
  final ibm_2Shares = Stock('IBM', howManyShares: 2, averagePrice: 150);
  final aapl_1Share = Stock('AAPL', howManyShares: 1, averagePrice: 150);

  StockAndBuySellButtons getWidgetFromStore(Store<AppState> store) {
    BuildContext ctx = MockBuildContext(store);

    return StockAndBuySellButtonsConnector(
      availableStock: ibmAvb,
    ).build(ctx) as StockAndBuySellButtons;
  }

  test(
      'enables buy button when there is enough money to buy the stock. '
      'It disables otherwise.', () {
    // The BUY button is disabled, since we cannot buy stock when there is no money.
    var store = Store(
        initialState: AppState.from(cashBalance: 0, availableStocks: [ibmAvb]));
    var widget = getWidgetFromStore(store);
    expect(widget.ifBuyDisabled, true);

    // The BUY button is disabled, since we cannot buy stock that costs 150,
    // when there is only 100.
    store = Store(
        initialState:
            AppState.from(cashBalance: 100, availableStocks: [ibmAvb]));
    widget = getWidgetFromStore(store);
    expect(widget.ifBuyDisabled, true);

    // The BUY button is enabled, as we can buy stock that costs 150
    // when there is exactly 150.
    store = Store(
        initialState:
            AppState.from(cashBalance: 150, availableStocks: [ibmAvb]));
    widget = getWidgetFromStore(store);
    expect(widget.ifBuyDisabled, false);

    // The BUY button is enabled, as we can buy stock that costs 150
    // when there is more than 150.
    store = Store(
        initialState:
            AppState.from(cashBalance: 1000, availableStocks: [ibmAvb]));
    widget = getWidgetFromStore(store);
    expect(widget.ifBuyDisabled, false);
  });

  test(
      'enables sell button when there at least 1 stock. It disables otherwise.',
      () {
    //
    var store = Store(initialState: AppState.from(availableStocks: [ibmAvb]));
    var widget = getWidgetFromStore(store);
    expect(widget.ifSellDisabled, true);

    // Cannot sell IBM, when there are only AAPL stocks.
    store = Store(
        initialState:
            AppState.from(availableStocks: [ibmAvb], stocks: [aapl_1Share]));
    widget = getWidgetFromStore(store);
    expect(widget.ifSellDisabled, true);

    // Can sell IBM, when there are IBM stocks.
    store = Store(
        initialState: AppState.from(
            availableStocks: [ibmAvb], stocks: [aapl_1Share, ibm_1Share]));
    widget = getWidgetFromStore(store);
    expect(widget.ifSellDisabled, false);
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

    // Dispatches: BuyStock(connector.availableStock, howMany: 1),
    var widget = getWidgetFromStore(store);
    widget.onBuy(); // Buy 1 share of IBM stock.

    // Cash balance decreased by the price of 1 IBM stock. Portfolio now contains 1 IBM stock.
    await store.waitActionType(BuyStock);
    expect(
        store.state.portfolio.cashBalance.amount, 1000 - ibmAvb.currentPrice);
    expect(store.state.portfolio.howManyStocks(ibmAvb.ticker), 1);
  });

  test(
      'Buying stock without enough money. '
      'Note: In practice this error never happens, because the BUY button is disabled.',
      () async {
    // Set initial cash balance to 100, which is less than the price $150 of IBM stock.
    var store = Store(
      initialState: AppState.from(
        availableStocks: [ibmAvb],
        stocks: [],
        cashBalance: 100,
      ),
    );
    var widget = getWidgetFromStore(store);
    widget.onBuy(); // Try to buy 1 share of IBM stock.

    // Assert that we get an UserException.
    var action = await store.waitActionType(BuyStock);
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
    var widget = getWidgetFromStore(store);
    widget.onSell(); // Sell 1 share of IBM stock.

    // Cash balance has increased by the price of 1 IBM stock.
    var action = await store.waitActionType(SellStock);
    expect(
        action!.state.portfolio.cashBalance.amount, 500 + ibmAvb.currentPrice);

    // The portfolio now contains 1 IBM stock.
    expect(action.state.portfolio.howManyStocks(ibm_1Share.ticker), 1);
  });

  test(
      'Selling stock that is not in the portfolio. '
      'Note: In practice this error never happens, because the SELL button is disabled.',
      () async {
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

    var widget = getWidgetFromStore(store);
    widget.onSell(); // Try to sell 1 share of IBM stock.

    // Assert that we get an UserException.
    var action = await store.waitActionType(SellStock);
    expect(action!.status.originalError, isA<UserException>());
  });

  test(
      'Given: 2 shares of IBM, \$100 cash, stock costs \$150. '
      'Then: '
      ' * Buy button disabled (not enough money)'
      ' * Sell button enabled, '
      ' * Callback `onBuy` fails with `UserException`'
      ' * Callback `onSell` works.', () async {
    // Initial state: 2 shares of IBM stock in portfolio, $100 cash balance.
    // IBM available stock costs $150 per share.
    var store = Store(
      initialState: AppState.from(
        availableStocks: [ibmAvb],
        stocks: [ibm_2Shares],
        cashBalance: 100,
      ),
    );

    var widget = getWidgetFromStore(store);

    // Check that buy button is disabled (not enough money to buy at $150)
    expect(widget.ifBuyDisabled, true);

    // Check that sell button is enabled (we have IBM stock to sell)
    expect(widget.ifSellDisabled, false);

    // Try to buy: should fail with UserException (not enough money).
    widget.onBuy();
    var buyAction = await store.waitActionType(BuyStock);
    expect(buyAction!.status.originalError, isA<UserException>());

    // Try to sell, should work.
    widget.onSell();
    await store.waitActionType(SellStock);

    // Verify sell succeeded: cash balance increased by stock price.
    expect(store.state.portfolio.cashBalance.amount, 100 + ibmAvb.currentPrice);

    // Verify sell succeeded: portfolio now has 1 share instead of 2.
    expect(store.state.portfolio.howManyStocks(ibmAvb.ticker), 1);
  });
}
