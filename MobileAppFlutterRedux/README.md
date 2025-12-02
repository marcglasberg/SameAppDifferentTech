# Flutter with Async Redux

> This is part of
> the **<a href="https://github.com/marcglasberg/SameAppDifferentTech">Same App,
Different Tech</a>**
> repository.
>
> It contains the same simple but non-trivial **mobile app** implemented using a
> variety of *different tech stacks*.

### Why is this useful?

* It helps you learn **Async Redux state management for Flutter**.


* If you're already familiar with Async Redux for Flutter, it provides you with
  a consistent reference point for you
  to [learn other technologies](https://github.com/marcglasberg/SameAppDifferentTech)
  by comparing them through applications that are functionally identical.


* You may clone this as a foundation for your own Flutter Redux applications.
  It's a starting point for clean, well organized, well documented code, which
  is easy to understand, develop, refactor, change, maintain and test.

## This app demonstrates the following

* A Flutter app.

* Using Async Redux (see [website](https://asyncredux.com)
  and [package](https://pub.dev/packages/async_redux))
  for state management.

* Easy theming, and changing between light and dark modes,
  using the [Themed](https://pub.dev/packages/themed) package.

* Easy Localization (translations),
  using the [i18n_extension](https://pub.dev/packages/i18n_extension) package.

* Uncoupling the backend communication by using a DAO (Data Access Object)
  pattern, featuring:
    * Using a "fake" backend for development and testing
    * Using a "real" backend for production
    * On-demand fetching (REST get), or continuous streaming (websocket)

* Saving data to the local device storage (using `Persistor` provided by Async
  Redux).

* Configuring the app with a "Run Configuration".

* How to test the app.

* Organizing the app directories.

* Note: This example app does not cover Authentication or Navigation (even
  though Async Redux does contain navigation features).

This is the app:

![Alt text](readme_images/App_Description.png)

# The State

Class `AppState` is the app state, composed of 3 substates:

* `Portfolio` contains the cash balance and the list of stocks owned by the
  user.
* `AvailableStocks` contains the list of stocks that are available for purchase.
* `Ui` contains state related to the user interface.

It's defined in [app_state.dart](lib/client/infra/app_state.dart):

```dart
class AppState {
  Portfolio portfolio;
  AvailableStocks availableStocks;
  Ui ui;

  static AppState initialState() =>
      AppState(
        portfolio: Portfolio.EMPTY,
        availableStocks: AvailableStocks.EMPTY,
        ui: Ui.DEFAULT,
      );

  ...
```

This state is managed by the `Store` class, which is part of the Async Redux
package.

The `Business.init()` method (
in [business.dart](lib/client/infra/basic/business.dart))
instantiates the business classes when the app starts. This method:

1. Sets up some app configurations.
2. Creates the "persistor" which loads the state from the local device disk when
   the app starts, and saves the state whenever the state changes, later on.
3. If no state is found in the local device disk, it creates a new state and
   then saves it.
4. Creates the Redux "store" which holds the app state in memory.
5. Initializes the DAO (Data Access Object, like a Repository) which is
   responsible for fetching data from the backend.
6. Runs a Redux action called `InitApp` with stuff the Store needs to do as soon
   as the app opens.

```dart
Future<void> init(RunConfig runConfig) async {
  // 1
  RunConfig.setInstance(runConfig);

  // 2
  var persistor = AppPersistor();
  AppState? initialState = await persistor.readState();

  // 3
  if (initialState == null) {
    initialState = AppState.initialState();
    await persistor.saveInitialState(initialState);
  }

  // 4
  store = Store<AppState>(
      initialState: initialState,
      persistor: persistor,
      ...
  );

  await DAO.init(); // 5

  store.dispatch(InitApp()); // 6
}
```

Note: The `persistor` object above implements the `Persistor` interface defined
in the Async Redux package:

```dart
abstract class Persistor<AppState> {
  Future<AppState?> readState();

  Future<void> deleteState();

  Future<void> persistDifference(
      {AppState? lastPersistedState, AppState newState});
}
```

The `persistor` is passed to the `Store` constructor.
This allows the Redux store to monitor state changes, and call the appropriate
`persistor` methods whenever something needs to be loaded or saved.

Check file [app_persistor.dart](lib/client/infra/persistor/app_persistor.dart)
to see how loading and saving to local device disk is implemented.
This example app saves to local files, but a database could be used instead.

## How to access the State

Check file [app_homepage.dart](lib/client/infra/basic/app_homepage.dart),
where the root of the widget tree is defined. This includes setting up:

* The `StoreProvider` to provide the `Store` to the rest of the app.
* The app theme (colors and fonts, using
  the [Themed](https://pub.dev/packages/themed) package)
* Localization (translations, using
  the [i18n_extension](https://pub.dev/packages/i18n_extension) package)
* The lifecycle manager (which listens to app entering background and
  foreground)
* The app navigation/routes.
* The user exception dialog (to show error messages to the user)
* Analytics (hinted by a comment, but not implemented)

After this is done, all widgets can access the state and dispatch actions by
using
[extension methods](https://asyncredux.com/flutter/basics/using-the-store-state)
on the widget's `context`:

```
var stocks = context.state.portfolio.stocks;        
var stocks = context.select((st)=>st.portfolio.stocks);        
context.dispatch(AddCash(42));        
```

# Initializing the app

In [main.dart](lib/client/infra/basic/main.dart) we create a
"run-configuration", and start the app with it:

```dart
void main() async {
  var runConfig = RunConfig(
    dao: new SimulatedDao(),
    ifShowRunConfigInTheConfigScreen: true,
    abTesting: AbTesting.A,
  );

  startApp(runConfig);
}
```

Then, the `startApp()` function instantiates the
Business layer (state classes and Redux actions),
and the Client layer (widgets and screens):

```dart
Future<void> startApp(RunConfig runConfig) async {
  WidgetsFlutterBinding.ensureInitialized();

  await Future.wait([
    Business.init(runConfig),
    Client.init(),
  ]);

  runApp(const AppHomePage());
}
```

# The DAO

The `DAO` (Data Access Object) gets data from the backend.
Here's what it gives us:

* **Ready-to-use data:** The DAO takes care of fetching the data from the
  server, and turning it into business objects that our app can readily use.


* **Hides complex details:** The DAO ensures that our app doesn't have to deal
  with the details of fetching data.
  Whether it's through JSON, gRPC, REST, GraphQL, or other ways, the DAO handles
  it all. This keeps
  things simple for the rest of the app.


* **Layer of separation:** The DAO separates the data fetching part from the
  rest of the app. This means if the way we get the data changes, the rest of
  the app stays the same.


* **Easier testing:** Since the DAO only deals with data, it's simpler to test
  if it works correctly without using the entire app. We can mock or simulate
  the DAO in our tests, allowing us to focus on the business logic and UI
  widgets independently of the data source.


* **Uncoupled development:** By mocking or simulating the DAO, we can work on a
  specific app feature even if its backend isn't ready yet. We can also simulate
  different scenarios, such as network errors, to see how the app behaves.

In the [dao.dart](lib/client/infra/dao/dao.dart) file, we define the `Dao`
interface:

```dart
abstract class Dao {
  Future<void> init();

  Future<IList<AvailableStock>> readAvailableStocks();

  Future<void> startListeningToStockPriceUpdates(
      {required PriceUpdate callback});

  Future<void> stopListeningToStockPriceUpdates();
}
```

DAO methods usually return Futures, because they need to asynchronously fetch
data from the backend.

Once we inject the DAO into the run-configuration
(by doing `var runConfig = RunConfig(dao: RealDao())`)
we can access it from anywhere in the app by just importing it:

```
import 'package:mobile_app_flutter_redux/business/infra/dao/dao.dart';

var myStocks = await DAO.readAvailableStocks();
```

Note that the `readAvailableStocks()` method returns an `IList`, not a `List`.
Since Redux state needs to be immutable, we use the `IList` (immutable List)
from
the [fast_immutable_collections](https://pub.dev/packages/fast_immutable_collections)
package.

Also note, it returns the available stocks as a list of objects of type
`AvailableStock`, and not as JSON.
You should avoid returning JSON or any other specific transport data format from
the DAO. Always return rich objects that are easy to use by the rest of the app.

This makes it very easy to mock or simulate the DAO,
because creating an object is simpler than composing JSON information.

## Difference between mocking and simulating

A **mocked DAO** is a fake DAO that returns some **hard-coded** data. This is
useful for both
developing and testing the app, as we can mock different scenarios, such as
network errors, and see
how the app behaves.

A **simulated DAO** is something different. It is also a fake DAO, but instead
of returning hard-coded data, it returns data that is generated by a **partial
simulation of the backend**.

While mocking is much more common than simulation, I personally strongly prefer
using a simulated DAO instead of a mocked one. The reason is that a simulated
DAO is much more realistic, and therefore more useful.

When you instantiate the app with a simulated DAO, you can open the app yourself
and interact with it as if it were connected to a real backend.
This is very useful for developing the app, as we don't have to worry whether
the backend is ready or not.

But it also helps in automatic testing, as we don't need to create mocks for
every single scenario. We can just use the simulated DAO, and it will behave
like the real backend.

When you are ready to switch to the real backend, you can just inject the "real
DAO" in the app, instead of the "simulated DAO". This is very easy to do, as the
rest of the app doesn't need to change at all.

```dart
// Injecting the simulated DAO:
var runConfig = RunConfig(
    dao: SimulatedDao()
);

// Injecting the real DAO:
var runConfig = RunConfig(
    dao: RealDao()
);
```

You might think that simulating the DAO requires more effort than mocking it,
but it usually doesn't, because the simulation only needs to be partial.
While the real backend needs to deal with multi-user concurrency,
the simulated DAO can just return data for a single user (the logged-in user).

Similarly, the simulated DAO doesn't need to handle real login processes, talk
to other services, work with databases, or manage actual network errors, and so
on. It can simply return data without worrying about any of these issues.
It doesn't need to be perfect, just good enough to help us develop and test the
app.

Please run the app and try it out a little. It's using a simulated DAO.
In
file [simulated_dao.dart](lib/client/infra/dao/simulated_dao/simulated_dao.dart)
you can see how it returns a list of predefined available stocks, and generates
random stock price updates every few milliseconds.

We start by creating a `SimulatedDao` class that extends `Dao`:

```dart
class SimulatedDao extends Dao {
  ...
}
```

As an example, this is how we could implement the `readAvailableStocks()` method
to simulate a data fetch:

```dart
Future<IList<AvailableStock>> readAvailableStocks() async {
  await simulateWaiting(250);
  print('Just read ${_hardcodedStocks.length} stocks.');

  return _hardcodedStocks.map(AvailableStock.from).toIList();
}

final List<({String ticker, String name, double price})> _hardcodedStocks = [
  (ticker: 'IBM', name: 'International Business Machines', price: 132.64),
  (ticker: 'AAPL', name: 'Apple', price: 183.58),
  ...
];

```

Note how the method waits for 250 milliseconds before returning the data.
This is to simulate a network delay.

In this same file, look at methods `listenToStockPriceUpdates()` and
`stopListeningToStockPriceUpdates()` to see how we simulate the continuous
streaming of stock price updates.

You can also run tests against the simulated DAO.
This speeds up integration tests to be as quick as unit tests,
because DAO calls immediately return predictable data.
With some backend preparation, you can also run the tests against the real
backend.
If some tests succeed in the simulation but not with the actual backend,
then it's clear there's an issue with either the backend or the simulation.
It's usually easy to find out which one is the problem.

Please check the tests in the [test](test) directory.

# The RunConfig

The `RunConfig` class is the "run configuration" which contains the
configuration parameters for the app. It's defined in
file [run_config.dart](lib/client/infra/run_config/run_config.dart).

You can set up distinct configurations for various environments,
like development, staging, and production.
You can also have different configurations for different developers.
For example, you can have a configuration for John, and another for Mary.
This approach is helpful if John and Mary work on separate features and require
different backends or simulations.

Developer configurations are typically not committed to source control;
they are stored in a separate file that Git ignores.

I like to include a boolean flag in the run configuration to indicate whether
users can view and perhaps manually alter parts of the configuration within the
app. This feature is good for debugging, since it enables modifying the
configuration without recompiling the app.

If you run the app and tap the "Settings" icon in the top-right corner,
you'll be taken to the configuration screen.

The first two items on this screen are the 'Light/Dark mode' and
'English/Spanish' switches, which are available to all users. The other items
are for developers and only appear if the
`RunConfig.ifShowRunConfigInTheConfigScreen` flag is set to `true`.

## A/B testing

For example, one of the options in the configuration screen lets developers
choose between `Auto`, `A` or `B`, for an A/B testing.

`Auto` means that the app will automatically choose between A and B,
based on criteria such as the user's ID or frameworks
like [Firebase A/B testing](https://firebase.google.com/docs/ab-testing).

The other options, `A` and `B`, are for development or testing.
Tap the blue button on the configuration screen to switch between A and B;
you'll notice the app's behavior changes accordingly:
The stock price font is large/blue in A, and small/black in B.

This is the code:

```
static var priceStyleA = Font.large + AppColor.blue + FontWeight.bold;
static var priceStyleB = Font.medium + AppColor.text + FontWeight.normal;

Widget build(BuildContext context) {
  return ...
     Text(
       availableStock.currentPriceStr, 
       style: abTesting.choose(priceStyleA, priceStyleB)
     )
```

The `abTesting.choose()` method takes two parameters: `priceStyleA` and
`priceStyleB`.
It returns the first parameter if the `RunConfig.abTesting` flag is set to `A`,
and the second parameter if it's set to `B`.

Check file [ab_testing.dart](lib/client/infra/run_config/ab_testing.dart) to see
how this is implemented.

# Theming the app

The main goals of theming the app are:

1. Detect automatically whether the operating system is in light or dark mode,
   and automatically adopt that mode.


2. Allow the user to manually select between light and dark modes.   
   Note that while some apps may offer more than these two modes, such instances
   are rare.


3. Save the user's choice, so that the next time the app is opened, it will
   start with that.


4. Allow the Flutter widgets to access the colors they need in an easy way.

Please check file [app_themes.dart](lib/client/infra/theme/app_themes.dart)

We first define a `Font` class, with all the fonts defined by the designers in
the app's design
system:

```dart
class Font {

  static const small = TextStyleRef(
    TextStyle(
      inherit: false,
      fontSize: 16,
      color: AppColor.text,
      fontWeight: FontWeight.normal,
      textBaseline: TextBaseline.alphabetic,
      fontFeatures: fontFeatures,
      leadingDistribution: TextLeadingDistribution.even,
    ),
  );

  static const medium = TextStyleRef(
    TextStyle(...),
  );
```

Then, we create an `AppColor` class, with all the colors of the **light** theme:

```dart
class AppColor {
  static const text = ColorRef(const Color(0xF0000000), id: 'text');
  static const textDimmed = ColorRef(const Color(0x60000000), id: 'dimmed');
  static const bkg = ColorRef(const Color(0xFFFFFFFF), id: 'bkg');

  ...
}
```

Finally, we create a map with the dark theme:

```dart

Map<ThemeRef, Object> darkTheme = {
  AppColor.text: const Color(0xFFFFFFFF),
  AppColor.textDimmed: const Color(0x60FFFFFF),
  AppColor.bkg: const Color(0xF0000000),
  ...
}
```

In the UI code, we may simply import the `Font` and `AppColor` and use it. For
example:

```
import 'package:mobile_app_flutter_redux/client/theme/app_themes.dart';

Text('Done', style: Font.small + AppColor.white),
```

To toggle between light and dark modes, we dispatch the
`ToggleLightAndDarkMode` action.

Check
file [ACTION_toggle_light_and_dark_mode.dart](lib/client/configuration_screen/ACTION_toggle_light_and_dark_mode.dart)
to see how this is implemented:

```
if (ui.isDarkMode) 
   Themed.currentTheme = darkTheme;
else 
   Themed.clearCurrentTheme();
```

## Spacing

Some design systems also specify spacing between UI elements, in logical pixels.

One way to separate two widgets is to use padding.
However, I think it is easier and more semantic to do it like this:

```
Row(
   children: [
      space8,
      ElevatedButton(child: const Text('Buy')),
      space8,
      ElevatedButton(child: const Text('Sell')),
   ],
);
```

In file [app_themes.dart](lib/client/infra/theme/app_themes.dart) we specify all
the spacings we need:

```
const double px8 = 8;
const double px12 = 12; 
...

const Widget space8 = SizedBox(width: px8, height: px8);
const Widget space12 = SizedBox(width: px12, height: px12); 
...
```

# Translating the app to Spanish

The app text is translated using
the [i18n_extension](https://pub.dev/packages/i18n_extension) package.
This package allows translating strings by simply
appending a `.i18n` extension to them. For example:

```
// Will be translated to "Buy" in English, and "Comprar" in Spanish.
Text('Buy'.i18n);
```

And then defining a translations file:

```
extension Localization on String {
  static final _t = Translations("en-US") +
      {
        "en-US": "Buy",
        "es-ES": "Comprar",
      };

  String get i18n => localize(this, _t);
}                                 
```

# Testing the app

To completely test the app, we need at least:

* Unit tests
* Widget tests
* Integration tests (which I implement as BDD tests,
  by using [BDD Framework](https://pub.dev/packages/bdd_framework)
  (my own library for Behavior-Driven Development)
* Golden tests (which consist of comparing the rendered UI with a reference
  image)

The tests are inside the `test` directory.

### Unit tests

The simplest tests are the unit tests that exercise:

* The model classes, like [stock_test.dart](test/stock_test.dart)
* The utility classes, like [utils_test.dart](test/utils_test.dart)
* The infrastructure classes in the [infra](lib/client/infra) directory

<br>

### Widget tests

Consider the widget which shows one of the available stocks the user can buy.
It displays the stock ticker and name, its current price, and two buttons for
buying and selling
the stock. Here are two of them in a column:

<div style="text-align: center;">
<img src="readme_images/AvailableStock.png" alt="Alt text" width="300"/>
</div> 

<br>

File [available_stocks_panel.dart](lib/client/portfolio_and_cash_screen/available_stocks/available_stocks_panel.dart)
defines the `AvailableStocksPanel` widget, which uses
`context.state.availableStocks` to access the store directly within the UI code:

```
return SingleChildScrollView(
   child: Center(
     child: Column(      
       children: [        
         for (var availableStock in context.state.availableStocks.list)
            AvailableStockWidget_Connector(availableStock: availableStock),
       ]
     )
   )
);
```

To test this widget, we need to use "widget tests" (`testWidgets`) to render the
widget, and then interact with the UI and check that the rendered widget is as
expected.

For example, suppose we want to test that the BUY button is disabled when there
is no money to buy stock.
We can create the initial state with zero money, and then find the BUY button
and check that its color is gray.
Then, we can add some money and check that its color changes to green.

In other words, testing this widget is hard, because it must be tested through
UI tests, which are more complex, slow and brittle.

### The connector pattern

Another alternative is to create a separate "connector" widget to access the
store, and then another widget that gets all its state in its constructor.

This is called the "connector pattern", or the "smart/dumb widget pattern".

This is demonstrated in
file [stock_and_buy_sell_buttons.dart](lib/client/portfolio_and_cash_screen/available_stocks/stock_and_buy_sell_buttons.dart),
where widget `StockAndBuySellButtonsConnector` uses `context` extensions
to read information from the state, and then returns an instance of the
`StockAndBuySellButtons` widget.

1. Testing the Connector (smart widget)

   The connector widget `StockAndBuySellButtonsConnector` does not contain UI
   logic. It will:

    * Use `context.select()` to read the state.
    * Use `context.dispatch` to create callbacks that dispatch actions.
    * Instantiate the "dumb" widget `StockAndBuySellButtons`, passing all
      information it needs in its constructor.

   Here it is:

    ```dart                                      
    class StockAndBuySellButtonsConnector extends StatelessWidget {
      const StockAndBuySellButtonsConnector({ required this.availableStock });
   
      final AvailableStock availableStock;      
      
      Widget build(BuildContext context) {
        final portfolio = context.select((AppState state) => state.portfolio);
      
        return StockAndBuySellButtons(
          availableStock: availableStock,
          onBuy: () => context.dispatch(BuyStock(availableStock, howMany: 1)),
          onSell: () => context.dispatch(SellStock(availableStock, howMany: 1)),
          ifBuyDisabled: !portfolio.hasMoneyToBuyStock(availableStock),
          ifSellDisabled: !portfolio.hasStock(availableStock),
        );
      }
    }
    ```   

   Testing the **connector widget** is mainly testing that the information it
   reads from the store is correctly passed to the "dumb" widget.

   This is shown in
   file [stock_and_buy_sell_buttons_test.dart](test/stock_and_buy_sell_buttons_test.dart)

   For example, let's test creating a state with 2 shares of IBM stock in the
   user's portfolio, and `$100` of cash balance.
   The available stock to buy is IBM, which costs `$150` per share.

   We then check that:
    * `ifBuyDisabled` is true, meaning the buy button will be disabled.
    * `ifSellDisabled` is false, meaning the sell button will be enabled.
    * `onBuy` will fail with a `UserException` (we don't have enough money).
    * `onSell` will work.

   ```dart
   test(
      'Given: 2 shares of IBM, \$100 cash, stock costs \$150. '
      'Then: '
      ' * Buy button disabled (not enough money)'
      ' * Sell button enabled, '
      ' * Callback `onBuy` fails with `UserException`'
      ' * Callback `onSell` works.', () async {
        
    // Initial state: 2 shares of IBM stock in portfolio, $100 cash balance.
    // IBM available stock costs $150 per share.
    var store = Store(
      initialState: AppState.from(
        availableStocks: [ibmAvb],
        stocks: [ibm_2Shares],
        cashBalance: 100,
      ),
    );

    var widget = getWidgetFromStore(store);

    // Check that buy button is disabled (not enough money to buy at $150)
    expect(widget.ifBuyDisabled, true);

    // Check that sell button is enabled (we have IBM stock to sell)
    expect(widget.ifSellDisabled, false);

    // Try to buy: should fail with UserException (not enough money).
    widget.onBuy();
    var buyAction = await store.waitActionType(BuyStock);
    expect(buyAction!.status.originalError, isA<UserException>());

    // Try to sell, should work.
    widget.onSell();
    var sellAction = await store.waitActionType(SellStock);

    // Verify sell succeeded: cash balance increased by stock price.
    expect(sellAction!.state.portfolio.cashBalance.amount, 100 + ibmAvb.currentPrice);

    // Verify sell succeeded: portfolio now has 1 share instead of 2.
    expect(sellAction.state.portfolio.howManyStocks(ibmAvb.ticker), 1);
   });
   ```

2. Testing the View (the dumb widget)

   File [stock_and_buy_sell_buttons.dart](lib/client/portfolio_and_cash_screen/available_stocks/stock_and_buy_sell_buttons.dart)
   also contains `StockAndBuySellButtons`, which is the "view" (also called the
   "dumb widget"). It does not access the
   store directly. Instead, it gets all information from its constructor.

   ```
   const StockAndBuySellButtons({
     required this.availableStock,
     required this.onBuy,
     required this.onSell,
     required this.ifBuyDisabled,
     required this.ifSellDisabled,
   });
   ```

   The only way to test this widget is through "widget tests" (`testWidgets`).
   However, the ability to configure it through its constructor simplifies the
   testing process.

   For example, we don't need to test that the BUY button is disabled when there
   is no money to buy stock. We just need to test that
   passing `ifBuyDisabled: true` to the constructor will indeed
   make the button gray.

   Likewise, we don't need to test that pressing the BUY button will call the
   correct store function. We just need to test that it actually calls
   the `onBuy()` callback.

## BDD tests

BDD stands for _Behavior-Driven Development_.

It's a way of writing executable tests that are easy to read, even for
non-programmers, and that also serve as documentation.

I won't go into details here, but I'm providing two files with BDD tests, to
demonstrate how to create them:

* [bdd_average_price_test.dart](test/bdd_average_price_test.dart)
* [bdd_buy_and_sell_test.dart](test/bdd_buy_and_sell_test.dart)

These BDD tests use
package [BDD Framework](https://pub.dev/packages/bdd_framework)
that I have developed myself.

Let's see an example of a BDD test description that specifies the behavior of
the app when the user buys stocks:

```gherkin
Feature: Buying and Selling Stocks

  Scenario: Buying stocks

    Given The user has 120 dollars in cash-balance.
    And IBM price is 30 dollars.
    And The user has no IBM stocks.
    When The user buys 1 IBM.
    Then The user now has 1 IBM.
    And The cash-balance is now 90 dollars.
```

The following is the implementation of the test:

```dart
void main() {
  var feature = BddFeature('Buying and Selling Stocks');

  Bdd(feature)
      .scenario('Buying stocks.')
      .given('The user has 120 dollars in cash-balance.')
      .and('IBM price is 30 dollars.')
      .and('The user has no IBM stocks.')
      .when('The user buys 1 IBM.')
      .then('The user now has 1 IBM.')
      .and('The cash-balance is now 90 dollars.')
      .run((ctx) async {
    //
    // Given:
    var ibm = AvailableStock('IBM', name: 'IBM corp', currentPrice: 30);
    var state = AppState.from(cashBalance: 120, availableStocks: [ibm]);
    var store = Store(initialState: state);

    // When:
    await store.dispatchAndWait(BuyStock(ibm, howMany: 1));

    // Then:
    expect(store.state.portfolio.howManyStocks('IBM'), 1);
    expect(store.state.portfolio.cashBalance, CashBalance(90));
  });
}
```

> Note the above BDD test runs against the **simulated backend**,
> which means it runs as fast as a unit test.
> To run it against the **real backend**, inject the real DAO
> instead of the simulated one, by doing
> `RunConfig.setInstance(RunConfig(dao: RealDao()));`

### Feature files

File [run_all.dart](test/run_all.dart) contains the following code:

```dart
import 'package:bdd_framework/bdd_framework.dart';
import 'package:flutter_test/flutter_test.dart';
import 'bdd_average_price_test.dart' as bdd_average_price;
import 'bdd_buy_and_sell_test.dart' as bdd_buy_and_sell;

void main() async {
  BddReporter.set(FeatureFileReporter(clearAllOutputBeforeRun: true));
  group('bdd_buy_and_sell_test.dart', bdd_buy_and_sell.main);
  group('bdd_average_price_test.dart', bdd_average_price.main);
  await BddReporter.reportAll();
}
```

Running this file, which uses the `FeatureFileReporter`, will run the BDD tests,
and automatically generate `.feature` files from them.

Please see the generated files in the [gen_features](gen_features) directory:

* [average_price.feature](gen_features/average_price.feature)
* [buying_and_selling_stocks.feature](gen_features/buying_and_selling_stocks.feature)

These files may be committed to source control,
and can be used as living documentation that evolves as the app evolves.

# App Directories

Here's a typical way to organize directories in a Flutter app:

```
lib/
├── widgets/
├── screens/
├── navigation/
├── assets/
│   ├── images/
│   └── fonts/
├── styles/
├── utils/
├── services/
└── models/ 

```

I don't like this typical structure, because it spreads out related code into
different directories. For example, if I want to see all the code related to the
`AvailableStock`, in the above structure, I may need to look into
the `widgets`, `screens`, `styles`, `services`, and `models` directories.

Instead, I'd suggest another way that keeps related code together.

## By feature

In this approach, we create a directory called `features`, and then a
subdirectory for each feature, and put all the code related to each feature
inside it. This has two important advantages:

* It's easier to find related code, as it's all in the same directory. When a
  new developer joins the team, it's easier for them to find the code they need
  to work on. It's also easier for them to understand the code, as they don't
  need to jump from directory to directory.


* It's easier to rename or delete a feature, as all the code related to it is in
  the same directory. For example, if you want to rename the `AvailableStock`
  feature to `StockToBuy`, you can see all the code that needs renaming
  together.

The `infra` directory contains infrastructure code related to the architecture
and wiring of the app.

Finally, a separate `utils` directory is still needed, as it contains code that
is not related to any specific feature, but is used by all features.

```
src/
├── features/
│   ├── cash_balance_and_portfolio/
│   │   ├── cash_balance/
│   │   └── portfolio/
│   ├── profile/
│   ├── signup/
│   ├── login/
│   ├── help_and_support/
│   ├── configuration_screen/
│   └── app_bar/
│
├── infra/
│   ├── auth/    
│   ├── dao/    
│   ├── run_config/
│   ├── theme/
│   └── navigation/
│
└── utils/
```

## By feature with Business/UI separation

In the above approach, the directory of a specific feature will contain both the
UI and business code related to that feature.

For example, the Portfolio code:

```
src/
├── features/
│   ├── portfolio_and_cash_screen/
│   │   ├── portfolio/
│   │   │   ├── ACTION_buy_stock.dart
│   │   │   ├── ACTION_sell_stock.dart
│   │   │   ├── portfolio.dart (Business code)
│   │   │   ├── portfolio_widget.dart (UI code)
│   │   │   └── portfolio_connector.dart (UI code)
```

This makes it very easy to find all the code related to a feature, but it also
makes it easier for developers to couple business and UI code.
For example, creating a Flutter widget that contains a function to calculate
some business logic.

To solve this, we can separate the business and UI code into different
directories:

```
src/
├── business/
│   ├── infra/    
│   │   ├── dao/    
│   │   ├── run_config/
│   ├── utils/
│   └── state/ 
│       ├── portfolio/
│       ├── profile/
│       ├── sign_up/
│       ├── log_in/
│       ├── help_and_support/
│       ├── configuration_screen/
│       └── app_state.dart
│    
└── ui/
    ├── theme/ 
    ├── utils/     
    ├── portfolio_and_cash_screen/
    │   ├── cash_balance/
    │   └── portfolio/
    ├── profile/
    ├── sign_up/
    ├── log_in/
    ├── help_and_support/
    ├── configuration_screen/
    └── app_bar/
```

For example, the Portfolio code would be:

```
src/
├── business/
│   ├── state/ 
│   │   ├── portfolio/
│   │   │   ├── 
│       │   ├── ACTION_sell_stock.dart
│           └── portfolio.dart (Business code)
│
├── ui/
│   ├── portfolio_and_cash_screen/
│   │   ├── portfolio/
    │   │   ├── portfolio_widget.dart (UI code)
        │   └── portfolio_connector.dart (UI code)
```

## By feature with Model and Client separation

If our goal is sharing code between a mobile application and the admin dashboard
that the company's employees can access, we can separate the client code and the
business models into different directories:

For example, the Portfolio code:

```
src/
├── client/
│   ├── infra/
│   │   ├── basic/    
│   │   ├── dao/    
│   │   ├── navigation/    
│   │   ├── persistor/    
│   │   ├── run_config    
│   │   └── theme    
│   │   └── app_state.dart    
│   ├── app_bar/
│   ├── configuration_screen/
│   ├── portfolio_and_cash_screen/
│   ├── profile/
│   ├── sign_up/
│   ├── log_in/
│   └── help_and_support/
│
└── models/
    ├── available_stock.dart
    ├── available_stocks.dart
    ├── buy_or_sell.dart
    ├── cash_balance.dart
    ├── portfolio.dart
    ├── stock.dart
    ├── ui.dart   
    └── utils/   
```

For example, the Portfolio code would be:

```
src/
├── client/
│   ├── portfolio_and_cash_screen/
│   │   └── portfolio/
│   │   │   ├── ACTION_buy_stock.dart
│   │   │   ├── ACTION_sell_stock.dart
│       │   ├── portfolio_widget.dart 
│           └── portfolio_connector.dart
├── models/
│   ├── portfolio/
│   │   └── portfolio.dart 
```

     
---

# What now?

Visit [asyncredux.com](https://asyncredux.com/)
to learn more about building Flutter apps with Async Redux.

Visit the home page of the [**Same App, Different Tech**](../README.md) project,
and compare this same mobile app implemented using a variety of **different tech
stacks**.
