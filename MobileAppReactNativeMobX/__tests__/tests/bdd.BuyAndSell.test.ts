import { Bdd, Feature, reporter, row, val } from '../BddFramework/Bdd';
import 'react-native';
import { expect } from '@jest/globals';
import { inject, store } from '../../src/inject';
import { FeatureFileReporter } from '../BddFramework/FeatureFileReporter';
import CashBalance from '../../src/business/state/CashBalance';

reporter(new FeatureFileReporter());

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

    inject({});
    await store.availableStocks.loadAvailableStocks();

    // Given:
    store.portfolio.cashBalance.setAmount(120.00);
    const ibm = store.availableStocks.findBySymbol('IBM');
    ibm.setCurrentPrice(30.00);
    store.portfolio.clearStock('IBM');

    // When:
    store.portfolio.buy(ibm, 1);

    // Then:
    expect(store.portfolio.howManyStocks('IBM')).toBe(1);
    expect(store.portfolio.cashBalance).toEqual(new CashBalance(90.00));
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
  .run(async (ctx) => {

    inject({});
    await store.availableStocks.loadAvailableStocks();

    // Given:
    store.portfolio.cashBalance.setAmount(120.00);

    // We read and create the info from the "Available Stocks" table:

    const availableStocksTable = ctx.table('Available Stocks').rows;

    for (const row of availableStocksTable) {
      const ticker: string = row.val('Ticker');
      const price: number = row.val('Price');

      const stock = store.availableStocks.findBySymbol(ticker);
      stock.setCurrentPrice(price);
    }

    // We read and create the info from the "Portfolio" table:

    const portfolioTable = ctx.table('Portfolio').rows;

    for (const row of portfolioTable) {
      const ticker: string = row.val('Ticker');
      const quantity: number = row.val('Quantity');
      store.portfolio.setStockInPortfolio(ticker, quantity, 100);
    }

    // When:
    const ibm = store.availableStocks.findBySymbol('IBM');
    store.portfolio.sell(ibm, 1);

    // Then:
    expect(store.portfolio.howManyStocks('IBM')).toBe(2);
    expect(store.portfolio.howManyStocks('AAPL')).toBe(5);
    expect(store.portfolio.howManyStocks('GOOG')).toBe(12);
    expect(store.portfolio.cashBalance).toEqual(new CashBalance(150.00));
  });
