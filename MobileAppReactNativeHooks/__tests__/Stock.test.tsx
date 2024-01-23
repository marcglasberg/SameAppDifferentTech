import 'react-native';
import { describe, expect, it } from '@jest/globals';
import { Stock } from '../src/business/state/Stock';

describe('Stock class', () => {
  it('calculates cost basis.', () => {
    const stock = new Stock('AAPL', 10, 150);
    expect(stock.costBasis).toBe(1500);
  });

  it('formats average price.', () => {
    const stock = new Stock('AAPL', 10, 150.4567);
    expect(stock.averagePriceStr).toBe('US$ 150.46');
  });

  it('handles zero shares.', () => {
    const stock = new Stock('AAPL', 0, 150);
    expect(stock.costBasis).toBe(0);
    expect(stock.toString()).toBe('AAPL: 0 shares');
  });

  it('handles negative average price.', () => {
    const stock = new Stock('AAPL', 10, -150);
    expect(stock.costBasis).toBe(-1500);
    expect(stock.averagePriceStr).toBe('US$ -150.00');
  });
});
