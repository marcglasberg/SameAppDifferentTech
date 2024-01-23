import { beforeEach, describe, expect, it } from '@jest/globals';
import { inject } from '../src/inject';
import { viewModel } from '../src/ui/cashBalanceAndPortfolio/CashBalance.container';
import { Portfolio } from '../src/business/state/Portfolio';
import { UseSet } from '../src/business/state/HooksAndContext';
import { CashBalance } from '../src/business/state/CashBalance';

describe('CashBalanceContainer', () => {

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
    portfolio = new Portfolio();
  });

  it('initializes with the correct cash balance.', () => {
    portfolio = portfolio.withCashBalance(new CashBalance(500));
    const vm = viewModel(portfolio, setPortfolio);
    expect(vm.cashBalance.amount).toBe(500);
  });

  it('adds $100 to the cash balance.', () => {
    portfolio = portfolio.withCashBalance(new CashBalance(500));
    const vm = viewModel(portfolio, setPortfolio);
    vm.onAdd();
    expect(portfolio.cashBalance.amount).toBe(600);
  });

  it('removes $100 from the cash balance.', () => {
    portfolio = portfolio.withCashBalance(new CashBalance(500));
    const vm = viewModel(portfolio, setPortfolio);
    vm.onRemove();
    expect(portfolio.cashBalance.amount).toBe(400);
  });

  it('should not allow the cash balance to go below zero.', () => {
    portfolio = portfolio.withCashBalance(new CashBalance(50));
    const vm = viewModel(portfolio, setPortfolio);
    vm.onRemove();
    expect(portfolio.cashBalance.amount).toBe(0);
  });
});
