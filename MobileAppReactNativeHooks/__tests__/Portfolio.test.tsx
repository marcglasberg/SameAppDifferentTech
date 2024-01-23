import 'react-native';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { Portfolio } from '../src/business/state/Portfolio';
import { AvailableStock } from '../src/business/state/AvailableStock';
import { BuyOrSell } from '../src/business/state/BuyOrSell';

describe('Portfolio', () => {
  let portfolio: Portfolio;
  let availableStock: AvailableStock;

  beforeEach(() => {
    portfolio = new Portfolio();
    availableStock = new AvailableStock('AAPL', 'Apple', 150);
  });

  it('should add stock to portfolio.', () => {
    portfolio = portfolio.withAddedStock(availableStock, 10);
    expect(portfolio.howManyStocks('AAPL')).toBe(10);
  });

  it('should clear all stocks from portfolio.', () => {
    portfolio = portfolio
      .withAddedStock(availableStock, 10)
      .withoutStocks();
    expect(portfolio.isEmpty).toBe(true);
  });

  it('should clear specific stock from portfolio.', () => {
    portfolio = portfolio
      .withAddedStock(availableStock, 10)
      .withoutStock('AAPL');
    expect(portfolio.howManyStocks('AAPL')).toBe(0);
  });

  it('should throw error when buying stock with insufficient balance.', () => {
    expect(() => portfolio.buy(availableStock, 10)).toThrow('Not enough money to buy stock');
  });

  it('should throw error when selling stock not owned.', () => {
    expect(() => portfolio.sell(availableStock, 10)).toThrow('Cannot sell stock you do not own');
  });

  it('should increase cash balance when selling stock.', () => {
    portfolio = portfolio
      .withAddedStock(availableStock, 10)
      .addCashBalance(2000)
      .sell(availableStock, 10);

    expect(portfolio.cashBalance.amount).toBe(3500);
  });

  it('should decrease cash balance when buying stock.', () => {
    portfolio = portfolio
      .addCashBalance(2000)
      .buy(availableStock, 10);

    expect(portfolio.cashBalance.amount).toBe(500);
  });

  it('calculates total cost basis.', () => {
    portfolio = portfolio
      .withAddedStock(availableStock, 10)
      .addCashBalance(2000);
    expect(portfolio.totalCostBasis).toBe(3500);
  });

  it('handles buy or sell operations.', () => {
    portfolio = portfolio
      .addCashBalance(2000)
      .buyOrSell(BuyOrSell.BUY, availableStock, 10);
    expect(portfolio.howManyStocks('AAPL')).toBe(10);

    portfolio = portfolio.buyOrSell(BuyOrSell.SELL, availableStock, 5);
    expect(portfolio.howManyStocks('AAPL')).toBe(5);
  });
});
