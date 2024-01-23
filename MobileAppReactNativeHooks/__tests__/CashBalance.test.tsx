import 'react-native';
import { describe, expect, it } from '@jest/globals';
import { CashBalance } from '../src/business/state/CashBalance';

describe('CashBalance', () => {

  it('initializes with the correct amount.', () => {
    const cashBalance = new CashBalance(100);
    expect(cashBalance.amount).toBe(100);
  });

  it('initializes with zero if NaN is passed.', () => {
    const cashBalance = new CashBalance(NaN);
    expect(cashBalance.amount).toBe(0);
  });

  it('sets the amount.', () => {
    let cashBalance = new CashBalance(100);
    cashBalance = cashBalance.withAmount(200);
    expect(cashBalance.amount).toBe(200);
  });

  it('adds to the amount.', () => {
    const cashBalance = new CashBalance(100).add(50);
    expect(cashBalance.amount).toBe(150);
  });

  it('removes from the amount.', () => {
    const cashBalance = new CashBalance(100).remove(50);
    expect(cashBalance.amount).toBe(50);
  });

  it('does not allow the amount to go below zero.', () => {
    const cashBalance = new CashBalance(100).remove(150);
    expect(cashBalance.amount).toBe(0);
  });

  it('converts to string.', () => {
    const cashBalance = new CashBalance(100);
    expect(cashBalance.toString()).toBe('US$ 100.00');
  });

  it('compares equality.', () => {
    const cashBalance1 = new CashBalance(100);
    const cashBalance2 = new CashBalance(100);
    expect(cashBalance1.equals(cashBalance2)).toBe(true);
  });

  it('compares inequality.', () => {
    const cashBalance1 = new CashBalance(100);
    const cashBalance2 = new CashBalance(200);
    expect(cashBalance1.equals(cashBalance2)).toBe(false);
  });
});
