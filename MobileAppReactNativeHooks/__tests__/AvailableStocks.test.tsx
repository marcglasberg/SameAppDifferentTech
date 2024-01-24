import { beforeEach, describe, expect, it } from '@jest/globals';
import { AvailableStocks } from '../src/business/state/AvailableStocks';
import { AvailableStock } from '../src/business/state/AvailableStock';
import { inject } from '../src/inject';

describe('AvailableStocks', () => {
  let availableStocks: AvailableStocks;

  beforeEach(async () => {
    inject({});
    availableStocks = await AvailableStocks.loadAvailableStocks();
  });

  it('finds stock by symbol or returns null', async () => {
    expect(availableStocks.findBySymbolOrNull('AAPL')).not.toBeNull();
    expect(availableStocks.findBySymbolOrNull('GOOG')).not.toBeNull();
    expect(availableStocks.findBySymbolOrNull('XXXX')).toBeNull();
  });

  it('throws error when stock not found by symbol', () => {
    expect(() => availableStocks.findBySymbol('XXXX')).toThrow('Stock not found: XXXX');
  });

  it('applies callback to each stock in the list', () => {
    let text = '';
    let callback = (stock: AvailableStock) => {
      text += stock.ticker.toString() + ',';
    };
    availableStocks.forEach(callback);
    expect(text).toBe('IBM,AAPL,GOOG,AMZN,META,INTC,');
  });
});
