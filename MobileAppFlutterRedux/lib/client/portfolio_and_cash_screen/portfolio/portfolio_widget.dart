import 'package:assorted_layout_widgets/assorted_layout_widgets.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app_flutter_redux/client/infra/app_state.dart';
import 'package:mobile_app_flutter_redux/client/infra/theme/app_themes.dart';
import 'package:mobile_app_flutter_redux/client/portfolio_and_cash_screen/cash_balance/cash_balance_widget.dart';
import 'package:mobile_app_flutter_redux/models/stock.dart';
import 'package:themed/themed.dart';

import '../portfolio_and_cash_screen.i18n.dart';

class PortfolioWidget extends StatelessWidget {
  const PortfolioWidget();

  static var textStyle = CashBalanceWidget.textStyle;

  @override
  Widget build(BuildContext context) {
    final portfolio = context.select((st) => st.portfolio);

    return Box(
      padding: const Pad(top: 12, bottom: 16, horizontal: 16),
      width: double.infinity,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.max,
        children: [
          Row(
            children: [
              Text('Portfolio:'.i18n, style: textStyle),
              const Box(width: 8),
              if (portfolio.isEmpty) Text('—', style: textStyle),
            ],
          ),
          const Box(height: 4),
          for (var stock in portfolio.stocks) StockInPortfolio(stock),
        ],
      ),
    );
  }
}

class StockInPortfolio extends StatelessWidget {
  const StockInPortfolio(this.stock);

  static var stockStyle = Font.small + AppColor.text;

  final Stock stock;

  @override
  Widget build(BuildContext context) => Padding(
        padding: const Pad(top: 6),
        child: Text(
          '${stock.ticker} (${stock.howManyShares} ' +
              'shares'.plural(stock.howManyShares) +
              ' @ US\$ ${stock.averagePriceStr})',
          style: stockStyle,
        ),
      );
}
