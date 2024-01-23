import 'react-native';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { dao, inject } from '../src/inject';
import { StorageManager } from '../src/business/dao/StorageManager';
import { Portfolio } from '../src/business/state/Portfolio';
import { CashBalance } from '../src/business/state/CashBalance';

describe('StorageManager', () => {
  let daoSavePortfolioSpy: jest.MockedFunction<any>;
  let daoLoadPortfolioSpy: jest.MockedFunction<any>;
  let storageManager = new StorageManager();

  function dummy() {
  }

  beforeEach(() => {
    inject({});

    storageManager = new StorageManager();

    jest.useFakeTimers();
    daoSavePortfolioSpy = jest.spyOn(dao, 'savePortfolio').mockResolvedValue();
    daoLoadPortfolioSpy = jest.spyOn(dao, 'loadPortfolio').mockResolvedValue(new Portfolio());
    // copyFromSpy = jest.spyOn(portfolio, 'copyFrom');
  });

  afterEach(() => {
    storageManager.stopTimerAndSave();
    jest.clearAllTimers();
    jest.restoreAllMocks();
  });

  it('loads portfolio on initialization.', async () => {
    let countSetPortfolioCalled = 0;
    await storageManager.processPortfolio(new Portfolio(), () => {
      countSetPortfolioCalled++;
    });
    expect(daoLoadPortfolioSpy).toHaveBeenCalledTimes(1);
    expect(countSetPortfolioCalled).toBe(1);
  });

  it('does not load portfolio more than once.', async () => {
    let countSetPortfolioCalled = 0;
    await storageManager.processPortfolio(new Portfolio(), () => {
      countSetPortfolioCalled++;
    });
    await storageManager.processPortfolio(new Portfolio(), () => {
      countSetPortfolioCalled++;
    });
    expect(daoLoadPortfolioSpy).toHaveBeenCalledTimes(1);
    expect(countSetPortfolioCalled).toBe(1);
  });

  it('handles load portfolio failure gracefully.', async () => {
    daoLoadPortfolioSpy.mockRejectedValue(new Error('Failed to load'));
    let countSetPortfolioCalled = 0;
    await storageManager.processPortfolio(new Portfolio(), () => {
      countSetPortfolioCalled++;
    });
    expect(countSetPortfolioCalled).toBe(0);
  });

  it('saves portfolio.', async () => {

    expect(storageManager.intervalIsOn()).toBe(false);
    await storageManager.processPortfolio(new Portfolio(), dummy);
    expect(storageManager.intervalIsOn()).toBe(true);

    jest.advanceTimersByTime(2000);
    await storageManager.processPortfolio(new Portfolio({ cashBalance: new CashBalance(10) }), dummy);
    jest.advanceTimersByTime(2000);

    expect(daoSavePortfolioSpy).toHaveBeenCalledTimes(1);
  });
});
