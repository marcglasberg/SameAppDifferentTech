import { beforeEach, describe, expect, it } from '@jest/globals';
import { inject, store } from '../src/inject';
import { viewModel } from '../src/ui/cashBalanceAndPortfolio/CashBalance.container';

describe('CashBalanceContainer', () => {

  beforeEach(() => {
    inject({});
  });

  it('initializes with the correct cash balance.', () => {
    store.portfolio.cashBalance.setAmount(500);
    const vm = viewModel();
    expect(vm.cashBalance.amount).toBe(500);
  });

  it('adds $100 to the cash balance.', () => {
    store.portfolio.cashBalance.setAmount(500);
    const vm = viewModel();
    vm.onAdd();
    expect(store.portfolio.cashBalance.amount).toBe(600);
  });

  it('removes $100 from the cash balance.', () => {
    store.portfolio.cashBalance.setAmount(500);
    const vm = viewModel();
    vm.onRemove();
    expect(store.portfolio.cashBalance.amount).toBe(400);
  });

  it('should not allow the cash balance to go below zero.', () => {
    store.portfolio.cashBalance.setAmount(50);
    const vm = viewModel();
    vm.onRemove();
    expect(store.portfolio.cashBalance.amount).toBe(0);
  });
});
