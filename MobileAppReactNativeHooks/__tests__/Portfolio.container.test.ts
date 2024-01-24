import { beforeEach, describe, expect, it } from '@jest/globals';
import { AvailableStock } from '../src/business/state/AvailableStock';
import { inject } from '../src/inject';
import { viewModel } from '../src/ui/cashBalanceAndPortfolio/Portfolio.container';
import { Portfolio } from '../src/business/state/Portfolio';
import { UseSet } from '../src/business/state/HooksAndContext';

describe('PortfolioContainer', () => {

  let ibm: AvailableStock, aapl: AvailableStock;

  let portfolio: Portfolio;

  let setPortfolio: UseSet<Portfolio> = (value: Portfolio | ((prevState: Portfolio) => Portfolio)) => {
    if (typeof value === 'function') {
      portfolio = value(portfolio);
    } else {
      portfolio = value;
    }
  };

  beforeEach(() => {
    inject({});

    ibm = new AvailableStock('IBM', 'I. B. Machines', 150.00);
    aapl = new AvailableStock('AAPL', 'Apple Inc.', 150.00);
    portfolio = new Portfolio();
  });

  it('should initialize with an empty or not empty portfolio.', () => {

    portfolio = portfolio.withoutStocks();
    let vm = viewModel(portfolio, setPortfolio);
    expect(vm.portfolioIsEmpty).toBe(true);

    portfolio = portfolio.withAddedStock(ibm, 1);
    vm = viewModel(portfolio, setPortfolio);
    expect(vm.portfolioIsEmpty).toBe(false);
  });

  it('should reflect stocks in the portfolio.', () => {
    portfolio = portfolio
      .withoutStocks()
      .withAddedStock(ibm, 1);

    let vm = viewModel(portfolio, setPortfolio);
    expect(vm.stocks.length).toBe(1);
    expect(vm.stocks[0].ticker).toBe('IBM');
  });

  it('should reflect multiple stocks in the portfolio.', () => {
    portfolio = portfolio
      .withoutStocks()
      .withAddedStock(ibm, 1)
      .withAddedStock(aapl, 2);

    let vm = viewModel(portfolio, setPortfolio);
    expect(vm.portfolioIsEmpty).toBe(false);
    expect(vm.stocks.length).toBe(2);
    expect(vm.stocks[0].ticker).toBe('IBM');
    expect(vm.stocks[1].ticker).toBe('AAPL');
  });
});
