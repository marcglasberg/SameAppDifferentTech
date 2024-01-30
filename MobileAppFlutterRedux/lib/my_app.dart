import 'package:flutter/material.dart';
import 'package:mobile_app_flutter_redux/business/infra/basic/screen.dart';
import 'package:mobile_app_flutter_redux/client/app_bar/stocks_app_bar.dart';
import 'package:mobile_app_flutter_redux/client/cash_balance_and_portfolio/available_stocks_CONNECTOR.dart';
import 'package:mobile_app_flutter_redux/client/cash_balance_and_portfolio/cash_balance_CONNECTOR.dart';
import 'package:mobile_app_flutter_redux/client/cash_balance_and_portfolio/portfolio_CONNECTOR.dart';

class MyApp extends StatelessWidget with Screen {
  const MyApp({super.key});

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
      appBar: StocksAppBar(),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CashBalance_Connector(),
          Portfolio_Connector(),
          Expanded(child: AvailableStocksXXX_Connector()),
        ],
      ),
    );
  }
}
