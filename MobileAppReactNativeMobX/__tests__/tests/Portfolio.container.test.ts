import { beforeEach, describe, expect, it } from '@jest/globals';
import AvailableStock from '../../src/business/state/AvailableStock';
import { inject, store } from '../../src/inject';
import { viewModel } from '../../src/ui/cashBalanceAndPortfolio/Portfolio.container';

describe('PortfolioContainer', () => {

  let ibm: AvailableStock, aapl: AvailableStock;

  beforeEach(() => {
    inject({});

    ibm = new AvailableStock('IBM', 'I. B. Machines', 150.00);
    aapl = new AvailableStock('AAPL', 'Apple Inc.', 150.00);
  });

  it('should initialize with an empty or not empty portfolio.', () => {

    store.portfolio.clearAll();
    let vm = viewModel();
    expect(vm.portfolioIsEmpty).toBe(true);

    store.portfolio.addStock(ibm, 1);
    vm = viewModel();
    expect(vm.portfolioIsEmpty).toBe(false);
  });

  it('should reflect stocks in the portfolio.', () => {
    store.portfolio.clearAll();
    store.portfolio.addStock(ibm, 1);

    const vm = viewModel();
    expect(vm.stocks.length).toBe(1);
    expect(vm.stocks[0].ticker).toBe('IBM');
  });

  it('should reflect multiple stocks in the portfolio.', () => {
    store.portfolio.clearAll();
    store.portfolio.addStock(ibm, 1);
    store.portfolio.addStock(aapl, 2);

    const vm = viewModel();
    expect(vm.portfolioIsEmpty).toBe(false);
    expect(vm.stocks.length).toBe(2);
    expect(vm.stocks[0].ticker).toBe('IBM');
    expect(vm.stocks[1].ticker).toBe('AAPL');
  });
});
