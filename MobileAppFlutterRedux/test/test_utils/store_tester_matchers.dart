import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app_flutter_redux/models/portfolio.dart';

/// Example: expect(portfolio, isPortfolio(ticker, howMany: 1, averagePrice: 10.5));
///
/// Here I demonstrate how to create CUSTOM MATCHERS to facilitate creating tests.
/// The matcher [isPortfolioWithStock] can be used like this:
///
/// ```
/// expect(portfolio, isPortfolio(ticker, howMany: 1, averagePrice: 10.5));
/// ```
///
/// It's equivalent of doing:
///
/// ```
/// expect(portfolio.howManyStocks(ticker), quantity + (buyOrSell.isBuy ? how : -how));
/// expect(portfolio.getStock(ticker).averagePrice, averagePrice);
/// ```
///
/// However, the matcher is simpler to write, and it also gives better error messages.
/// For example:
///
/// ```
/// ══╡ EXCEPTION CAUGHT BY BDD FRAMEWORK ╞══
/// The following TestFailure was thrown:
/// Expected: Portfolio with 13 IBM shares.
/// Actual: Portfolio:<Portfolio{stocks: [12 IBM @91.67], cashBalance: US$ 99900.00}>
/// Which: has 12 IBM shares at an average price of 91.67 dollars.
/// ```
///
Matcher isPortfolioWithStock({
  String? ticker,
  int? howManyShares,
  double? averagePrice,
}) =>
    _IsPortfolioWithStock(
      ticker: ticker,
      howManyShares: howManyShares,
      averagePrice: averagePrice,
    );

class _IsPortfolioWithStock extends Matcher {
  //
  final String? ticker;
  final int? howManyShares;
  final double? averagePrice;
  Portfolio? portfolio;

  _IsPortfolioWithStock({
    this.ticker,
    this.howManyShares,
    this.averagePrice,
  }) : portfolio = null;

  @override
  Description describe(Description description) {
    final portfolio = this.portfolio;
    final ticker = this.ticker;

    if (portfolio is! Portfolio)
      return description.add("Actual value of type Portfolio.");
    //
    else {
      if (ticker != null) {
        final stock = portfolio.getStockOrNull(ticker);
        if (stock == null) {
          if ((howManyShares != null && howManyShares != 0) ||
              (averagePrice != null && averagePrice != 0))
            return description.add("Portfolio containing stock ${this.ticker}.");
        } else {
          if (howManyShares != null && howManyShares != stock.howManyShares)
            return description.add("Portfolio with $howManyShares $ticker shares.");
          if (averagePrice != null && averagePrice != stock.averagePrice)
            return description.add(
                "Portfolio with $ticker shares with an average price of $averagePrice dollars.");
        }
      }
      throw AssertionError();
    }
  }

  @override
  Description describeMismatch(
    Object? item,
    Description mismatchDescription,
    Map<dynamic, dynamic> matchState,
    bool verbose,
  ) {
    final portfolio = this.portfolio;
    final ticker = this.ticker;

    if (portfolio is! Portfolio) {
      return mismatchDescription.add('is not a Portfolio');
    }

    if (ticker != null) {
      final stock = portfolio.getStockOrNull(ticker);
      if (stock == null) {
        return mismatchDescription.add("has no $ticker shares.");
      } else {
        mismatchDescription.add('has ${stock.howManyShares} $ticker shares '
            'at an average price of ${stock.averagePrice} dollars.');
      }
    }
    return mismatchDescription;
  }

  @override
  bool matches(Object? item, Map matchState) {
    //
    if (item is! Portfolio)
      return false;
    //
    else {
      final Portfolio portfolio = item;
      this.portfolio = portfolio;
      final ticker = this.ticker;

      if (ticker != null) {
        final stock = portfolio.getStockOrNull(ticker);
        if (stock == null) {
          if (howManyShares != null && howManyShares != 0) return false;
          if (averagePrice != null && averagePrice != 0) return false;
          return true;
        } else {
          if (howManyShares != null && howManyShares != stock.howManyShares) return false;
          if (averagePrice != null && averagePrice != stock.averagePrice) return false;
          return true;
        }
      }
      return true;
    }
  }
}
