import 'package:async_redux/async_redux.dart';
import 'package:bdd_framework/bdd_framework.dart';
import 'package:celest_backend/models.dart';
import "package:flutter_test/flutter_test.dart";
import 'package:mobile_app_flutter_celest/client/infra/app_state.dart';
import 'package:mobile_app_flutter_celest/client/portfolio_and_cash_screen/available_stocks/ACTION_buy_stock.dart';
import 'package:mobile_app_flutter_celest/client/portfolio_and_cash_screen/available_stocks/ACTION_sell_stock.dart';
import 'package:mobile_app_flutter_celest/models/buy_or_sell.dart';

import 'test_utils/store_tester_matchers.dart';

void main() {
  var feature = BddFeature('Average Price');

  Bdd(feature)
      .scenario('Buying and Selling stocks changes the average price.')
      .given('The user has <Quantity> shares of <Ticker> at <At> dollars each.')
      .when('The user <BuyOrSell> <How many> of these stock at <Price> for each share.')
      .then('The number of shares becomes <Quantity> plus/minus <How many>.')
      .and('The average price for the stock becomes <Average Price>.')
      // Avg price = (10 x 100 + 2 * 50) / 12 = 91.67 dollars.
      .example(
        val('Ticker', 'IBM'),
        val('Quantity', 10),
        val('At', 100.00),
        val('BuyOrSell', BuyOrSell.buy),
        val('How many', 2),
        val('Price', 50.00),
        val('Average Price', 91.67),
      )
      // Avg price =  (1600 - 3 * 30) / (8 - 3) = 302.00 dollars.
      .example(
        val('Ticker', 'IBM'),
        val('Quantity', 8),
        val('At', 200.00),
        val('BuyOrSell', BuyOrSell.sell),
        val('How many', 3),
        val('Price', 30.00),
        val('Average Price', 302.00),
      )
      .run((ctx) async {
    //
    String ticker = ctx.example.val('Ticker');
    int quantity = ctx.example.val('Quantity');
    double at = ctx.example.val('At');
    BuyOrSell buyOrSell = ctx.example.val('BuyOrSell');
    int how = ctx.example.val('How many');
    double price = ctx.example.val('Price');
    double averagePrice = ctx.example.val('Average Price');

    // Given:

    var avbStock = AvailableStock(ticker, name: '$ticker corp', currentPrice: price);

    var stock = Stock(ticker, howManyShares: quantity, averagePrice: at);

    var storeTester = StoreTester(
      initialState: AppState.from(
        cashBalance: 100000.00, // Enough money to buy whatever we want.
        availableStocks: [avbStock],
        stocks: [stock],
      ),
    );

    // When:
    await storeTester.dispatchAndWait(
      buyOrSell.isBuy
          ? BuyStock_Action(avbStock, howMany: how)
          : SellStock_Action(avbStock, howMany: how),
    );

    // Then:
    var portfolio = storeTester.lastInfo.state.portfolio;

    // Tip: Here I'm using a custom matcher: `isPortfolioWithStock`.
    // Check its documentation in file `test/utils/store_tester_matchers.dart`.
    //
    // This is equivalent of doing:
    // ```
    // expect(portfolio.howManyStocks(ticker), quantity + (buyOrSell.isBuy ? how : -how));
    // expect(portfolio.getStock(ticker).averagePrice, averagePrice);
    // ```
    expect(
        portfolio,
        isPortfolioWithStock(
          ticker: ticker,
          howManyShares: quantity + (buyOrSell.isBuy ? how : -how),
          averagePrice: averagePrice,
        ));
  });
}
