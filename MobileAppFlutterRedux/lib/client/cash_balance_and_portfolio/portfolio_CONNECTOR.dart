import 'package:assorted_layout_widgets/assorted_layout_widgets.dart';
import 'package:async_redux/async_redux.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app_flutter_redux/business/state/app_state.dart';
import 'package:mobile_app_flutter_redux/business/state/portfolio.dart';
import 'package:mobile_app_flutter_redux/business/state/stock.dart';
import 'package:mobile_app_flutter_redux/business/utils/app_vm_factory.dart';

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
  static const style = TextStyle(fontSize: 20, color: Colors.black);

  final Portfolio portfolio;

  const PortfolioWidget({
    super.key,
    required this.portfolio,
  });

  @override
  Widget build(BuildContext context) {
    return Box(
      padding: const Pad(vertical: 16, horizontal: 16),
      width: double.infinity,
      color: Colors.grey[300],
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.max,
        children: [
          Row(
            children: [
              const Text('Portfolio:', style: style),
              const Box(width: 8),
              if (portfolio.isEmpty) const Text('—', style: style),
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
  static const stockStyle = TextStyle(fontSize: 16, color: Colors.black);

  final Stock stock;

  const StockInPortfolio(this.stock, {super.key});

  @override
  Widget build(BuildContext context) => Padding(
        padding: const Pad(top: 6),
        child: Text(
            '${stock.ticker} (${stock.howManyShares} shares @ US\$ ${stock.averagePriceStr})',
            style: stockStyle),
      );
}
