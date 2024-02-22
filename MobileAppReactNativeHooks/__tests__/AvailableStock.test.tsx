import 'react-native';
import { AvailableStock } from '../src/business/state/AvailableStock';

describe('AvailableStock', () => {

  it('initializes with correct values.', () => {
    const availableStock = new AvailableStock('AAPL', 'Apple Inc.', 150.00);
    expect(availableStock.ticker).toBe('AAPL');
    expect(availableStock.name).toBe('Apple Inc.');
    expect(availableStock.currentPrice).toBe(150.00);
  });

  it('returns current price as string.', () => {
    const availableStock = new AvailableStock('AAPL', 'Apple Inc.', 150.00);
    expect(availableStock.currentPriceStr).toBe('US$ 150.00');
  });

  it('converts to Stock.', () => {
    const availableStock = new AvailableStock('AAPL', 'Apple Inc.', 150.00);
    const convertedStock = availableStock.toStock(5);
    expect(convertedStock.ticker).toBe('AAPL');
    expect(convertedStock.howManyShares).toBe(5);
    expect(convertedStock.averagePrice).toBe(150.00);
  });

  it('updates current price.', () => {
    let availableStock = new AvailableStock('AAPL', 'Apple Inc.', 150.00);
    availableStock = availableStock.withCurrentPrice(155.00);
    expect(availableStock.ticker).toBe('AAPL');
    expect(availableStock.name).toBe('Apple Inc.');
    expect(availableStock.currentPrice).toBe(155.00);
  });
});
