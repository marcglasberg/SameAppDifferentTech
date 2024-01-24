import 'react-native';
import { expect } from '@jest/globals';
import { inject } from '../src/inject';
import { BuyOrSell } from '../src/business/state/BuyOrSell';
import { Bdd, Feature, FeatureFileReporter, reporter, val } from 'easy-bdd-tool-jest';
import { Portfolio } from '../src/business/state/Portfolio';
import { CashBalance } from '../src/business/state/CashBalance';
import { AvailableStocks } from '../src/business/state/AvailableStocks';

reporter(new FeatureFileReporter());

const feature = new Feature('Average Price');

Bdd(feature)
  .scenario('Buying and Selling stocks changes the average price.')
  .given('IBM is an available stock.')
  .and('The user has [Quantity] shares of IBM at [At] dollars each.')
  .when('The user [BuyOrSell] [How many] of these stocks at [Price] for each share.')
  .then('The number of shares becomes [Quantity] plus/minus [How many].')
  .and('The average price for the stock becomes [Average Price].')
  //
  // Avg price = (10 x 100 + 2 * 50) / 12 = 91.67 dollars.
  .example(
    val('Quantity', 10),
    val('At', 100.00),
    val('BuyOrSell', BuyOrSell.BUY),
    val('How many', 2),
    val('Price', 50.00),
    val('Average Price', 91.67)
  )
  //
  // Avg price =  (1600 - 3 * 30) / (8 - 3) = 302.00 dollars.
  .example(
    val('Quantity', 8),
    val('At', 200.00),
    val('BuyOrSell', BuyOrSell.SELL),
    val('How many', 3),
    val('Price', 30.00),
    val('Average Price', 302.00)
  )
  .run(async (ctx) => {

    inject({});

    // Read example values.
    const quantity: number = ctx.example.val('Quantity');
    const atPrice: number = ctx.example.val('At');
    const buyOrSell: BuyOrSell = ctx.example.val('BuyOrSell');
    const howMany: number = ctx.example.val('How many');
    const price: number = ctx.example.val('Price');
    const averagePrice: number = ctx.example.val('Average Price');

    // Sets up everything and just make sure we have money to buy whatever we need.
    let portfolio = new Portfolio({ cashBalance: new CashBalance(100000.00) });

    // Given:
    let availableStocks = await AvailableStocks.loadAvailableStocks();
    expect(availableStocks.findBySymbolOrNull('IBM')).not.toBeNull();
    let availableStock = availableStocks.findBySymbol('IBM').withCurrentPrice(atPrice);
    portfolio = portfolio.withStock('IBM', quantity, atPrice);

    // When:
    availableStock = availableStock.withCurrentPrice(price);
    portfolio = portfolio.buyOrSell(buyOrSell, availableStock, howMany);

    // Then:
    expect(portfolio.howManyStocks('IBM')).toBe(quantity + (buyOrSell.isBuy ? howMany : -howMany));
    expect(portfolio.getStock('IBM').averagePrice).toBe(averagePrice);
  });
