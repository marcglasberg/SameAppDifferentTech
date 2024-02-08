import 'package:assorted_layout_widgets/assorted_layout_widgets.dart';
import 'package:async_redux/async_redux.dart';
import 'package:celest_backend/models.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app_flutter_celest/client/infra/app_state.dart';
import 'package:mobile_app_flutter_celest/client/infra/basic/app_vm_factory.dart';
import 'package:mobile_app_flutter_celest/client/infra/theme/app_themes.dart';
import 'package:mobile_app_flutter_celest/client/portfolio_and_cash_screen/cash_balance/cash_balance_connector.dart';
import 'package:mobile_app_flutter_celest/models/portfolio.dart';
import 'package:themed/themed.dart';

import '../portfolio_and_cash_screen.i18n.dart';

class Portfolio_Connector extends StatelessWidget {
  //
  const Portfolio_Connector();

  @override
  Widget build(BuildContext context) => StoreConnector<AppState, _Vm>(
        vm: () => _Factory(),
        builder: (context, vm) {
          return PortfolioWidget(portfolio: vm.portfolio);
        },
      );
}

class _Factory extends AppVmFactory {
  @override
  _Vm fromStore() => _Vm(portfolio: state.portfolio);
}

class _Vm extends Vm {
  //
  final Portfolio portfolio;

  _Vm({
    required this.portfolio,
  }) : super(equals: [portfolio]);
}

class PortfolioWidget extends StatelessWidget {
  //
  static var textStyle = CashBalanceWidget.textStyle;

  final Portfolio portfolio;

  const PortfolioWidget({
    super.key,
    required this.portfolio,
  });

  @override
  Widget build(BuildContext context) {
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
  //
  static var stockStyle = Font.small + AppColor.text;

  final Stock stock;

  const StockInPortfolio(this.stock, {super.key});

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
