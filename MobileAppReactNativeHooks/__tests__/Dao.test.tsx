import 'react-native';
import { Dao } from '../src/business/dao/Dao';
import { inject, storage } from '../src/inject';
import { Portfolio } from '../src/business/state/Portfolio';
import { Stock } from '../src/business/state/Stock';
import { CashBalance } from '../src/business/state/CashBalance';
import { SimulatedDao } from '../src/business/dao/SimulatedDao';

describe('Dao', () => {
  let dao: Dao;
  let mockStorage: jest.MockedFunction<any>;

  beforeEach(() => {
    inject({});

    mockStorage = {
      setItem: jest.spyOn(storage, 'setItem'),
      getItem: jest.spyOn(storage, 'getItem')
    };

    dao = new SimulatedDao();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('saves portfolio.', async () => {
    const portfolio = new Portfolio({
        stocks: [new Stock('AAPL', 10, 150)],
        cashBalance: new CashBalance(1000)
      })
    ;
    await dao.savePortfolio(portfolio);
    let result = await storage.getItem('portfolio');
    expect(result).toBe(JSON.stringify(portfolio));
    expect(mockStorage.setItem).toHaveBeenCalledWith('portfolio', JSON.stringify(portfolio));
  });

  it('loads portfolio when portfolio exists.', async () => {
    const portfolio = new Portfolio({
      stocks: [new Stock('AAPL', 10, 150)],
      cashBalance: new CashBalance(1000)
    });
    mockStorage.getItem.mockResolvedValue(JSON.stringify(portfolio));
    const loadedPortfolio = await dao.loadPortfolio();
    expect(loadedPortfolio).toEqual(portfolio);
  });

  it('loads portfolio when portfolio does not exist.', async () => {
    mockStorage.getItem.mockResolvedValue(null);
    const loadedPortfolio = await dao.loadPortfolio();
    expect(loadedPortfolio).toEqual(new Portfolio());
  });

  it('throws error when saving portfolio fails', async () => {
    const portfolio = new Portfolio({
      stocks: [new Stock('AAPL', 10, 150)],
      cashBalance: new CashBalance(1000)
    });
    mockStorage.setItem.mockRejectedValue(new Error('Failed to save portfolio'));
    await expect(dao.savePortfolio(portfolio)).rejects.toThrow('Failed to save portfolio');
  });

  it('throws error when loading portfolio fails', async () => {
    mockStorage.getItem.mockRejectedValue(new Error('Failed to load portfolio'));
    await expect(dao.loadPortfolio()).rejects.toThrow('Failed to load portfolio');
  });
});
