import 'react-native';
import { beforeEach, expect } from '@jest/globals';
import { inject } from '../src/inject';
import { CashBalance } from '../src/business/state/CashBalance';
import { Bdd, Feature, FeatureFileReporter, reporter, row, val } from 'easy-bdd-tool-jest';
import { AvailableStocks } from '../src/business/state/AvailableStocks';
import { Portfolio } from '../src/business/state/Portfolio';

reporter(new FeatureFileReporter());

let availableStocks: AvailableStocks;

beforeEach(async () => {
  inject({});
  availableStocks = await AvailableStocks.loadAvailableStocks();
});

const feature = new Feature('Buying and Selling Stocks');

Bdd(feature)
  .scenario('Buying stocks.')
  .given('The user has 120 dollars in cash-balance.')
  .and('IBM price is 30 dollars.')
  .and('The user has no IBM stocks.')
  .when('The user buys 1 IBM.')
  .then('The user now has 1 IBM.')
  .and('The cash-balance is now 90 dollars.')
  .run(async (ctx) => {

    // Given:
    let portfolio = new Portfolio({ cashBalance: new CashBalance(120) });

    const ibm = availableStocks.findBySymbol('IBM').withCurrentPrice(30.00);
    portfolio = portfolio.withoutStock('IBM');

    // When:
    portfolio = portfolio.buy(ibm, 1);

    // Then:
    expect(portfolio.howManyStocks('IBM')).toBe(1);
    expect(portfolio.cashBalance).toEqual(new CashBalance(90.00));
  });

Bdd(feature)
  .scenario('Selling stocks.')
  .given('The user has 120 dollars in cash-balance.')
  .and('The current stock prices are as such:')
  .table(
    'Available Stocks',
    row(val('Ticker', 'AAPL'), val('Price', 50.25)),
    row(val('Ticker', 'IBM'), val('Price', 30.00)),
    row(val('Ticker', 'GOOG'), val('Price', 60.75))
  )
  .and('The user Portfolio contains:')
  .table(
    'Portfolio',
    row(val('Ticker', 'AAPL'), val('Quantity', 5)),
    row(val('Ticker', 'IBM'), val('Quantity', 3)),
    row(val('Ticker', 'GOOG'), val('Quantity', 12))
  )
  .when('The user sells 1 IBM.')
  .then('The user now has 2 IBM.')
  .and('AAPL is still 5, and GOOG is still 12.')
  .and('The cash-balance is now 150 dollars.')
  .run(async (ctx) => {

    // Given:
    let portfolio = new Portfolio({ cashBalance: new CashBalance(120) });

    // We read and create the info from the "Available Stocks" table:

    const availableStocksTable = ctx.table('Available Stocks').rows;

    for (const row of availableStocksTable) {
      const ticker: string = row.val('Ticker');
      const price: number = row.val('Price');

      const stock = availableStocks.findBySymbol(ticker);
      availableStocks = availableStocks.withAvailableStock(stock.withCurrentPrice(price));
    }

    // We read and create the info from the "Portfolio" table:

    const portfolioTable = ctx.table('Portfolio').rows;

    for (const row of portfolioTable) {
      const ticker: string = row.val('Ticker');
      const quantity: number = row.val('Quantity');
      portfolio = portfolio.withStock(ticker, quantity, 100);
    }

    // When:
    const ibm = availableStocks.findBySymbol('IBM');
    portfolio = portfolio.sell(ibm, 1);

    // Then:
    expect(portfolio.howManyStocks('IBM')).toBe(2);
    expect(portfolio.howManyStocks('AAPL')).toBe(5);
    expect(portfolio.howManyStocks('GOOG')).toBe(12);
    expect(portfolio.cashBalance).toEqual(new CashBalance(150.00));

    // The code below shows the alternative hard-coded implementation:
    // inject({});
    // await store.availableStocks.loadAvailableStocks();
    //
    // // Given:
    // store.portfolio.cashBalance.setAmount(120.00);
    //
    // const aapl = store.availableStocks.findBySymbol('AAPL');
    // const ibm = store.availableStocks.findBySymbol('IBM');
    // const goog = store.availableStocks.findBySymbol('GOOG');
    //
    // aapl.setCurrentPrice(50.25);
    // ibm.setCurrentPrice(30.00);
    // goog.setCurrentPrice(60.75);
    //
    // store.portfolio.setStockInPortfolio('AAPL', 5, 100);
    // store.portfolio.setStockInPortfolio('IBM', 3, 100);
    // store.portfolio.setStockInPortfolio('GOOG', 12, 100);
    //
    // // When:
    // store.portfolio.sell(ibm, 1);
    //
    // // Then:
    // expect(store.portfolio.howManyStocks('IBM')).toBe(2);
    // expect(store.portfolio.howManyStocks('AAPL')).toBe(5);
    // expect(store.portfolio.howManyStocks('GOOG')).toBe(12);
    // expect(store.portfolio.cashBalance).toEqual(new CashBalance(150.00));

  });
