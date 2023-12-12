import 'react-native';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { dao, inject, store } from '../src/inject';
import { StorageManager } from '../src/business/dao/StorageManager';
import Portfolio from '../src/business/state/Portfolio';

describe('StorageManager', () => {
  let savePortfolioSpy: jest.MockedFunction<any>;
  let loadPortfolioSpy: jest.MockedFunction<any>;
  let copyFromSpy: jest.MockedFunction<any>;

  beforeEach(() => {
    inject({});

    jest.useFakeTimers();
    savePortfolioSpy = jest.spyOn(dao, 'savePortfolio').mockResolvedValue();
    loadPortfolioSpy = jest.spyOn(dao, 'loadPortfolio').mockResolvedValue(new Portfolio());
    copyFromSpy = jest.spyOn(store.portfolio, 'copyFrom');
  });

  afterEach(() => {
    StorageManager.stopTimerAndSaves();
    jest.clearAllTimers();
    jest.restoreAllMocks();
  });

  it('initializes only once.', async () => {
    await StorageManager.init();
    await StorageManager.init();
    expect(loadPortfolioSpy).toHaveBeenCalledTimes(1);
  });

  it('loads portfolio on initialization.', async () => {
    await StorageManager.init();
    expect(loadPortfolioSpy).toHaveBeenCalledTimes(1);
  });

  it('saves portfolio when marked as changed.', async () => {
    await StorageManager.init();
    StorageManager.markPortfolioChanged();
    jest.advanceTimersByTime(2000);
    expect(savePortfolioSpy).toHaveBeenCalledTimes(1);
  });

  it('does not save portfolio when not marked as changed.', async () => {
    await StorageManager.init();
    jest.advanceTimersByTime(2000);
    expect(savePortfolioSpy).not.toHaveBeenCalled();
  });

  it('handles load portfolio failure gracefully.', async () => {
    loadPortfolioSpy.mockRejectedValue(new Error('Failed to load'));
    await StorageManager.init();
    expect(copyFromSpy).not.toHaveBeenCalled();
  });

  it('handles save portfolio failure gracefully.', async () => {
    savePortfolioSpy.mockRejectedValue(new Error('Failed to save'));
    await StorageManager.init();
    StorageManager.markPortfolioChanged();
    jest.advanceTimersByTime(2000);
    expect(savePortfolioSpy).toHaveBeenCalledTimes(1);
  });
});
