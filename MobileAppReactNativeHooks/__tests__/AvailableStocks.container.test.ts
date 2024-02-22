import { AvailableStock } from '../src/business/state/AvailableStock';
import { inject } from '../src/inject';
import { viewModel } from '../src/ui/cashBalanceAndPortfolio/AvailableStock.container';
import { Portfolio } from '../src/business/state/Portfolio';
import { CashBalance } from '../src/business/state/CashBalance';
import { UseSet } from '../src/business/state/Hooks';

describe('AvailableStockContainer', () => {

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

  it('enables buy button when there is enough money to buy the stock.' +
    'It disables otherwise.', () => {
    const ibm = new AvailableStock('IBM', 'I. B. Machines', 150.00);

    // The BUY button is disabled, since we cannot buy stock when there is no money.
    let vm = viewModel(ibm, portfolio, setPortfolio);
    expect(vm.ifBuyDisabled).toBe(true);

    // The BUY button is disabled, since we cannot buy stock that costs 150, when there is only 100.
    portfolio = portfolio.withCashBalance(new CashBalance(100));
    vm = viewModel(ibm, portfolio, setPortfolio);
    expect(vm.ifBuyDisabled).toBe(true);

    // The BUY button is enabled, as we can buy stock that costs 150 when there is exactly 150.
    portfolio = portfolio.withCashBalance(new CashBalance(150));
    vm = viewModel(ibm, portfolio, setPortfolio);
    expect(vm.ifBuyDisabled).toBe(false);

    // The BUY button is enabled, as we can buy stock that costs 150 when there is more than 150.
    portfolio = portfolio.withCashBalance(new CashBalance(1000));
    vm = viewModel(ibm, portfolio, setPortfolio);
    expect(vm.ifBuyDisabled).toBe(false);
  });

  it('enables sell button when there at least 1 stock.' +
    'It disables otherwise.', () => {

    const ibm = new AvailableStock('IBM', 'I. B. Machines', 150.00);
    const aapl = new AvailableStock('AAPL', 'Apple Inc.', 150.00);

    portfolio = portfolio.withoutStocks();
    let vm = viewModel(ibm, portfolio, setPortfolio);
    expect(vm.ifSellDisabled).toBe(true);

    // Cannot sell IBM, when there are only AAPL stocks.
    portfolio = portfolio.withAddedStock(aapl, 1);
    vm = viewModel(ibm, portfolio, setPortfolio);
    expect(vm.ifSellDisabled).toBe(true);

    // Can sell IBM, when there are IBM stocks.
    portfolio = portfolio.withAddedStock(ibm, 1);
    vm = viewModel(ibm, portfolio, setPortfolio);
    expect(vm.ifSellDisabled).toBe(false);
  });

  test('Buying stock.', () => {
    const ibm = new AvailableStock('IBM', 'I. B. Machines', 150.00);

    // Cash balance is 1000. There are no IBM stocks.
    expect(portfolio.howManyStocks(ibm.ticker)).toBe(0);
    portfolio = portfolio.withCashBalance(new CashBalance(1000));

    const vm = viewModel(ibm, portfolio, setPortfolio);
    vm.onBuy(); // Buy 1 share of IBM stock.

    // Cash balance decreased by the price of 1 IBM stock. Portfolio now contains 1 IBM stock.
    expect(portfolio.cashBalance.amount).toBe(1000 - ibm.currentPrice);
    expect(portfolio.howManyStocks(ibm.ticker)).toBe(1);
  });

  test('Buying stock without enough money. ' +
    'Note: In practice this error never happens, because the BUY button is disabled.', () => {

    // Set initial cash balance to 100, which is less than the price of IBM stock.
    portfolio = portfolio.withCashBalance(new CashBalance(100));

    const ibm = new AvailableStock('IBM', 'I. B. Machines', 150.00);

    // Try to buy 1 share of IBM stock.
    const vm = viewModel(ibm, portfolio, setPortfolio);

    // Assert that an error is thrown.
    expect(() => vm.onBuy()).toThrow('Not enough money to buy stock');
  });

  test('Selling stock.', () => {
    const ibm = new AvailableStock('IBM', 'I. B. Machines', 150.00);

    // Add 2 shares of IBM stock to the portfolio.
    portfolio = portfolio.withAddedStock(ibm, 2);

    // Sell 1 share of IBM stock.
    const vm = viewModel(ibm, portfolio, setPortfolio);
    vm.onSell();

    // Cash balance has increased by the price of 1 IBM stock.
    expect(portfolio.cashBalance.amount).toBe(ibm.currentPrice);

    // The portfolio now contains 1 IBM stock.
    expect(portfolio.howManyStocks(ibm.ticker)).toBe(1);
  });

  test('Selling stock that is not in the portfolio. ' +
    'Note: In practice this error never happens, because the SELL button is disabled.', () => {
    const ibm = new AvailableStock('IBM', 'I. B. Machines', 150.00);

    // Ensure the portfolio does not contain IBM stock.
    portfolio = portfolio.withoutStock(ibm.ticker);

    // Try to sell 1 share of IBM stock.
    const vm = viewModel(ibm, portfolio, setPortfolio);
    expect(() => vm.onSell()).toThrow('Cannot sell stock you do not own');
  });
});
