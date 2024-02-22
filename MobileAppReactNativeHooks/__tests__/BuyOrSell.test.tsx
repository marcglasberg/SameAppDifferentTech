import 'react-native';
import { BuyOrSell } from '../src/business/state/BuyOrSell';

describe('BuyOrSell', () => {
  test('isBuy and isSell.', () => {
    expect(BuyOrSell.BUY.isBuy).toBeTruthy();
    expect(BuyOrSell.SELL.isBuy).toBeFalsy();
    expect(BuyOrSell.BUY.isSell).toBeFalsy();
    expect(BuyOrSell.SELL.isSell).toBeTruthy();
  });

  it('returns BUY when toString is called on BUY, ' +
    'and returns SELL when toString is called on SELL.', () => {
    expect(BuyOrSell.BUY.toString()).toBe('BUY');
    expect(BuyOrSell.SELL.toString()).toBe('SELL');
  });
});
