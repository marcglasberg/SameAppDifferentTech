import 'package:assorted_layout_widgets/assorted_layout_widgets.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app_flutter_redux/business/infra/basic/screen.dart';
import 'package:mobile_app_flutter_redux/client/app_bar/stocks_app_bar.dart';
import 'package:mobile_app_flutter_redux/client/portfolio_and_cash_balance/cash_balance_CONNECTOR.dart';
import 'package:mobile_app_flutter_redux/client/portfolio_and_cash_balance/portfolio_CONNECTOR.dart';
import 'package:mobile_app_flutter_redux/client/theme/app_themes.dart';

import 'available_stocks_CONNECTOR.dart';

class PortfolioAndCashBalanceScreen extends StatelessWidget with Screen {
  const PortfolioAndCashBalanceScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Stocks App Demo',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: const MyHomePage(),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  //
  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: AppColor.bkg,
      appBar: StocksAppBar(),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Box(
            color: AppColor.bkgGray,
            child: Column(
              children: [
                CashBalance_Connector(),
                Portfolio_Connector(),
              ],
            ),
          ),
          Expanded(child: AvailableStocks_Connector()),
        ],
      ),
    );
  }
}
