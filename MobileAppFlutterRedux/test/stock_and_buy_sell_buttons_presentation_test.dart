import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app_flutter_redux/client/infra/run_config/run_config.dart';
import 'package:mobile_app_flutter_redux/client/infra/theme/app_themes.dart';
import 'package:mobile_app_flutter_redux/client/portfolio_and_cash_screen/available_stocks/stock_and_buy_sell_buttons.dart';
import 'package:mobile_app_flutter_redux/models/available_stock.dart';

void main() {
  setUp(() {
    RunConfig.setTestInstance();
  });

  final ibmAvb = AvailableStock('IBM', name: 'I.B.M.', currentPrice: 150);

  Widget createTestWidget({
    required AvailableStock availableStock,
    required VoidCallback onBuy,
    required VoidCallback onSell,
    required bool ifBuyDisabled,
    required bool ifSellDisabled,
  }) {
    return MaterialApp(
      home: Scaffold(
        body: StockAndBuySellButtons(
          availableStock: availableStock,
          onBuy: onBuy,
          onSell: onSell,
          ifBuyDisabled: ifBuyDisabled,
          ifSellDisabled: ifSellDisabled,
        ),
      ),
    );
  }

  testWidgets('displays stock ticker, name and price', (WidgetTester tester) async {
    await tester.pumpWidget(createTestWidget(
      availableStock: ibmAvb,
      onBuy: () {},
      onSell: () {},
      ifBuyDisabled: false,
      ifSellDisabled: false,
    ));

    // Verify ticker is displayed
    expect(find.text('IBM'), findsOneWidget);

    // Verify stock name is displayed
    expect(find.text('I.B.M.'), findsOneWidget);

    // Verify price is displayed
    expect(find.text(ibmAvb.currentPriceStr), findsOneWidget);
  });

  testWidgets('displays Buy and Sell buttons', (WidgetTester tester) async {
    await tester.pumpWidget(createTestWidget(
      availableStock: ibmAvb,
      onBuy: () {},
      onSell: () {},
      ifBuyDisabled: false,
      ifSellDisabled: false,
    ));

    // Verify Buy button exists
    expect(find.text('Buy'), findsOneWidget);

    // Verify Sell button exists
    expect(find.text('Sell'), findsOneWidget);
  });

  testWidgets('Buy button is disabled when ifBuyDisabled is true',
      (WidgetTester tester) async {
    await tester.pumpWidget(createTestWidget(
      availableStock: ibmAvb,
      onBuy: () {},
      onSell: () {},
      ifBuyDisabled: true,
      ifSellDisabled: false,
    ));

    // Find the Buy button
    final buyButton = find.ancestor(
      of: find.text('Buy'),
      matching: find.byType(ElevatedButton),
    );

    // Verify the button exists
    expect(buyButton, findsOneWidget);

    // Get the button widget and verify it's disabled
    final ElevatedButton button = tester.widget(buyButton);
    expect(button.onPressed, isNull);
  });

  testWidgets('Buy button is enabled when ifBuyDisabled is false',
      (WidgetTester tester) async {
    await tester.pumpWidget(createTestWidget(
      availableStock: ibmAvb,
      onBuy: () {},
      onSell: () {},
      ifBuyDisabled: false,
      ifSellDisabled: false,
    ));

    // Find the Buy button
    final buyButton = find.ancestor(
      of: find.text('Buy'),
      matching: find.byType(ElevatedButton),
    );

    // Get the button widget and verify it's enabled
    final ElevatedButton button = tester.widget(buyButton);
    expect(button.onPressed, isNotNull);
  });

  testWidgets('Sell button is disabled when ifSellDisabled is true',
      (WidgetTester tester) async {
    await tester.pumpWidget(createTestWidget(
      availableStock: ibmAvb,
      onBuy: () {},
      onSell: () {},
      ifBuyDisabled: false,
      ifSellDisabled: true,
    ));

    // Find the Sell button
    final sellButton = find.ancestor(
      of: find.text('Sell'),
      matching: find.byType(ElevatedButton),
    );

    // Verify the button exists
    expect(sellButton, findsOneWidget);

    // Get the button widget and verify it's disabled
    final ElevatedButton button = tester.widget(sellButton);
    expect(button.onPressed, isNull);
  });

  testWidgets('Sell button is enabled when ifSellDisabled is false',
      (WidgetTester tester) async {
    await tester.pumpWidget(createTestWidget(
      availableStock: ibmAvb,
      onBuy: () {},
      onSell: () {},
      ifBuyDisabled: false,
      ifSellDisabled: false,
    ));

    // Find the Sell button
    final sellButton = find.ancestor(
      of: find.text('Sell'),
      matching: find.byType(ElevatedButton),
    );

    // Get the button widget and verify it's enabled
    final ElevatedButton button = tester.widget(sellButton);
    expect(button.onPressed, isNotNull);
  });

  testWidgets('tapping enabled Buy button calls onBuy callback',
      (WidgetTester tester) async {
    bool buyWasCalled = false;

    await tester.pumpWidget(createTestWidget(
      availableStock: ibmAvb,
      onBuy: () {
        buyWasCalled = true;
      },
      onSell: () {},
      ifBuyDisabled: false,
      ifSellDisabled: false,
    ));

    // Find and tap the Buy button
    final buyButton = find.ancestor(
      of: find.text('Buy'),
      matching: find.byType(ElevatedButton),
    );

    await tester.tap(buyButton);
    await tester.pump();

    // Verify the callback was called
    expect(buyWasCalled, true);
  });

  testWidgets('tapping enabled Sell button calls onSell callback',
      (WidgetTester tester) async {
    bool sellWasCalled = false;

    await tester.pumpWidget(createTestWidget(
      availableStock: ibmAvb,
      onBuy: () {},
      onSell: () {
        sellWasCalled = true;
      },
      ifBuyDisabled: false,
      ifSellDisabled: false,
    ));

    // Find and tap the Sell button
    final sellButton = find.ancestor(
      of: find.text('Sell'),
      matching: find.byType(ElevatedButton),
    );

    await tester.tap(sellButton);
    await tester.pump();

    // Verify the callback was called
    expect(sellWasCalled, true);
  });

  testWidgets('disabled Buy button does not call onBuy callback when tapped',
      (WidgetTester tester) async {
    bool buyWasCalled = false;

    await tester.pumpWidget(createTestWidget(
      availableStock: ibmAvb,
      onBuy: () {
        buyWasCalled = true;
      },
      onSell: () {},
      ifBuyDisabled: true,
      ifSellDisabled: false,
    ));

    // Find the Buy button
    final buyButton = find.ancestor(
      of: find.text('Buy'),
      matching: find.byType(ElevatedButton),
    );

    // Try to tap the disabled button - this should not trigger the callback
    await tester.tap(buyButton, warnIfMissed: false);
    await tester.pump();

    // Verify the callback was NOT called
    expect(buyWasCalled, false);
  });

  testWidgets('disabled Sell button does not call onSell callback when tapped',
      (WidgetTester tester) async {
    bool sellWasCalled = false;

    await tester.pumpWidget(createTestWidget(
      availableStock: ibmAvb,
      onBuy: () {},
      onSell: () {
        sellWasCalled = true;
      },
      ifBuyDisabled: false,
      ifSellDisabled: true,
    ));

    // Find the Sell button
    final sellButton = find.ancestor(
      of: find.text('Sell'),
      matching: find.byType(ElevatedButton),
    );

    // Try to tap the disabled button - this should not trigger the callback
    await tester.tap(sellButton, warnIfMissed: false);
    await tester.pump();

    // Verify the callback was NOT called
    expect(sellWasCalled, false);
  });

  testWidgets('both buttons disabled when both flags are true',
      (WidgetTester tester) async {
    await tester.pumpWidget(createTestWidget(
      availableStock: ibmAvb,
      onBuy: () {},
      onSell: () {},
      ifBuyDisabled: true,
      ifSellDisabled: true,
    ));

    // Find both buttons
    final buyButton = find.ancestor(
      of: find.text('Buy'),
      matching: find.byType(ElevatedButton),
    );
    final sellButton = find.ancestor(
      of: find.text('Sell'),
      matching: find.byType(ElevatedButton),
    );

    // Verify both buttons are disabled
    final ElevatedButton buyWidget = tester.widget(buyButton);
    final ElevatedButton sellWidget = tester.widget(sellButton);
    expect(buyWidget.onPressed, isNull);
    expect(sellWidget.onPressed, isNull);
  });

  testWidgets('both buttons enabled when both flags are false',
      (WidgetTester tester) async {
    await tester.pumpWidget(createTestWidget(
      availableStock: ibmAvb,
      onBuy: () {},
      onSell: () {},
      ifBuyDisabled: false,
      ifSellDisabled: false,
    ));

    // Find both buttons
    final buyButton = find.ancestor(
      of: find.text('Buy'),
      matching: find.byType(ElevatedButton),
    );
    final sellButton = find.ancestor(
      of: find.text('Sell'),
      matching: find.byType(ElevatedButton),
    );

    // Verify both buttons are enabled
    final ElevatedButton buyWidget = tester.widget(buyButton);
    final ElevatedButton sellWidget = tester.widget(sellButton);
    expect(buyWidget.onPressed, isNotNull);
    expect(sellWidget.onPressed, isNotNull);
  });

  testWidgets('Buy button has gray background when disabled, green when enabled',
      (WidgetTester tester) async {
    // Test disabled state - gray background
    await tester.pumpWidget(createTestWidget(
      availableStock: ibmAvb,
      onBuy: () {},
      onSell: () {},
      ifBuyDisabled: true,
      ifSellDisabled: false,
    ));

    var buyButton = find.ancestor(
      of: find.text('Buy'),
      matching: find.byType(ElevatedButton),
    );
    var button = tester.widget<ElevatedButton>(buyButton);
    var style = button.style;
    expect(style, isNotNull);
    var backgroundColor = style!.backgroundColor?.resolve({WidgetState.disabled});
    expect(backgroundColor, AppColor.bkgGray);

    // Test enabled state - green background
    await tester.pumpWidget(createTestWidget(
      availableStock: ibmAvb,
      onBuy: () {},
      onSell: () {},
      ifBuyDisabled: false,
      ifSellDisabled: false,
    ));

    buyButton = find.ancestor(
      of: find.text('Buy'),
      matching: find.byType(ElevatedButton),
    );
    button = tester.widget<ElevatedButton>(buyButton);
    style = button.style;
    expect(style, isNotNull);
    backgroundColor = style!.backgroundColor?.resolve(<WidgetState>{});
    expect(backgroundColor, AppColor.buttonGreen);
  });

  testWidgets('Sell button has gray background when disabled, red when enabled',
      (WidgetTester tester) async {
    // Test disabled state - gray background
    await tester.pumpWidget(createTestWidget(
      availableStock: ibmAvb,
      onBuy: () {},
      onSell: () {},
      ifBuyDisabled: false,
      ifSellDisabled: true,
    ));

    var sellButton = find.ancestor(
      of: find.text('Sell'),
      matching: find.byType(ElevatedButton),
    );
    var button = tester.widget<ElevatedButton>(sellButton);
    var style = button.style;
    expect(style, isNotNull);
    var backgroundColor = style!.backgroundColor?.resolve({WidgetState.disabled});
    expect(backgroundColor, AppColor.bkgGray);

    // Test enabled state - red background
    await tester.pumpWidget(createTestWidget(
      availableStock: ibmAvb,
      onBuy: () {},
      onSell: () {},
      ifBuyDisabled: false,
      ifSellDisabled: false,
    ));

    sellButton = find.ancestor(
      of: find.text('Sell'),
      matching: find.byType(ElevatedButton),
    );
    button = tester.widget<ElevatedButton>(sellButton);
    style = button.style;
    expect(style, isNotNull);
    backgroundColor = style!.backgroundColor?.resolve(<WidgetState>{});
    expect(backgroundColor, AppColor.red);
  });
}
