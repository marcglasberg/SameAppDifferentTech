import 'package:async_redux/async_redux.dart';
import 'package:bdd_framework/bdd_framework.dart';
import 'package:celest_backend/models.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app_flutter_celest/client/infra/app_state.dart';
import 'package:mobile_app_flutter_celest/client/portfolio_and_cash_screen/available_stocks/ACTION_buy_stock.dart';
import 'package:mobile_app_flutter_celest/client/portfolio_and_cash_screen/available_stocks/ACTION_sell_stock.dart';
import 'package:mobile_app_flutter_celest/models/cash_balance.dart';

import 'test_utils/matchers.dart';

void main() {
  var feature = BddFeature('Buying and Selling Stocks');

  Bdd(feature)
      .scenario('Buying stocks.')
      .given('The user has 120 dollars in cash-balance.')
      .and('IBM price is 30 dollars.')
      .and('The user has no IBM stocks.')
      .when('The user buys 1 IBM.')
      .then('The user now has 1 IBM.')
      .and('The cash-balance is now 90 dollars.')
      .run((ctx) async {
    // Given:
    var ibm = AvailableStock('IBM', name: 'IBM corp', currentPrice: 30.00);

    var state = AppState.from(
      cashBalance: 120.00,
      availableStocks: [ibm],
    );

    var storeTester = StoreTester(initialState: state);

    // When:
    await storeTester.dispatchAndWait(BuyStock_Action(ibm, howMany: 1));
    storeTester.wait(BuyStock_Action);

    // Then:
    expect(storeTester.lastInfo.state.portfolio.howManyStocks('IBM'), 1);
    expect(storeTester.lastInfo.state.portfolio.cashBalance, CashBalance(90.00));
  });

  Bdd(feature)
      .scenario('Selling stocks.')
      .given('The user has 120 dollars in cash-balance.')
      .and('The current stock prices are as such:')
      .table(
        'Available Stocks',
        row(val('Ticker', 'AAPL'), val('Price', 50.25)),
        row(val('Ticker', 'IBM'), val('Price', 30.00)),
        row(val('Ticker', 'GOOG'), val('Price', 60.75)),
      )
      .and('The user Portfolio contains:')
      .table(
        'Portfolio',
        row(val('Ticker', 'AAPL'), val('Quantity', 5)),
        row(val('Ticker', 'IBM'), val('Quantity', 3)),
        row(val('Ticker', 'GOOG'), val('Quantity', 12)),
      )
      .when('The user sells 1 IBM.')
      .then('The user now has 2 IBM.')
      .and('AAPL is still 5, and GOOG is still 12.')
      .and('The cash-balance is now 150 dollars.')
      .run((ctx) async {
    // Given:

    // We read and create the info from the "Available Stocks" table:
    var availableStocksTable = ctx.table('Available Stocks').rows;

    var availableStocks = availableStocksTable
        .map((row) => AvailableStock(
              row.val('Ticker'),
              name: row.val('Ticker') + ' corp',
              currentPrice: row.val('Price'),
            ))
        .toList();

    // We read and create the info from the "Portfolio" table:
    var portfolioTable = ctx.table('Portfolio').rows;

    var stocks = portfolioTable
        .map((row) => Stock(
              row.val('Ticker'),
              howManyShares: row.val('Quantity'),
              averagePrice: 42, // Any value will do.
            ))
        .toList();

    var state = AppState.from(
      availableStocks: availableStocks,
      stocks: stocks,
      cashBalance: 120.00,
    );

    var storeTester = StoreTester(initialState: state);

    // When:
    var ibm = state.availableStocks.findBySymbol('IBM');
    var info = await storeTester.dispatchAndWait(SellStock_Action(ibm, howMany: 1));

    // Then:
    expect(info.state.portfolio.howManyStocks('IBM'), 2);
    expect(info.state.portfolio.howManyStocks('AAPL'), 5);
    expect(info.state.portfolio.howManyStocks('GOOG'), 12);
    expect(info.state.portfolio.cashBalance, CashBalance(150.00));

    //  /// The code below shows the alternative hard-coded implementation:
    //
    //  // Given:
    //  var aapl = AvailableStock('AAPL', name: 'Apple corp', currentPrice: 50.25);
    //  var ibm = AvailableStock('IBM', name: 'IBM corp', currentPrice: 30.00);
    //  var goog = AvailableStock('GOOG', name: 'Alphabet corp', currentPrice: 60.75);
    //
    //  var availableStocks = [aapl, ibm, goog];
    //  var stocks = [
    //    Stock( 'AAPL', howManyShares: 5, averagePrice: 100),
    //    Stock( 'IBM', howManyShares: 3, averagePrice: 100),
    //    Stock( 'GOOG', howManyShares: 12, averagePrice: 100),
    //  ];
    //
    //  var state = AppState.from(
    //    availableStocks: availableStocks,
    //    stocks: stocks,
    //    cashBalance: 120.00);
    //
    //  var storeTester = StoreTester(initialState: state);
    //
    //  // When:
    //  var info = await storeTester.dispatchAndWait(SellStock_Action(ibm, howMany: 1));
    //
    //  // Then:
    //  expect(info.state.portfolio.howManyStocks('IBM'), 2);
    //  expect(info.state.portfolio.howManyStocks('AAPL'), 5);
    //  expect(info.state.portfolio.howManyStocks('GOOG'), 12);
    //  expect(info.state.portfolio.cashBalance, CashBalance(150.00));
  });

  Bdd(feature)
      .scenario('Selling stocks you don’t have.')
      .given('The user has 120 dollars in cash-balance.')
      .and('IBM price is 30 dollars.')
      .and('The user has no IBM stocks.')
      .when('The user sells 1 IBM.')
      .then('We get an error.')
      .and('The user continues to have 0 IBM.')
      .and('The cash-balance continues to be 120 dollars.')
      .run((ctx) async {
    // Given:
    var ibm = AvailableStock('IBM', name: 'IBM corp', currentPrice: 30.00);

    var state = AppState.from(
      cashBalance: 120.00,
      availableStocks: [ibm],
    );

    expect(state.portfolio.stocks, isEmpty); // No IBM.

    var storeTester = StoreTester(initialState: state);

    // When:
    var info = await storeTester.dispatchAndWait(SellStock_Action(ibm, howMany: 1));

    // Then:
    expect(info.error, isAError('Cannot sell stock you do not own'));
    expect(info.state.portfolio.howManyStocks(ibm.ticker), 0);
    expect(info.state.portfolio.cashBalance, CashBalance(120.00));
  });
}
