# Flutter with Redux

> This is part of the <a href='../README.md'>**Same App, Different Tech**</a>
> project.
>
> It contains the same simple but not trivial **mobile app** implemented using a variety of *
*different tech stacks**.

### Why is this repository useful?

* It helps you learn **using Redux to do Flutter state management**.


* If you're already familiar Flutter with Redux, it provides you with a consistent reference point
  for you to <a href='../README.md'>learn other technologies</a> by comparing them
  through applications that are functionally identical.


* Feel free to clone this repository as a foundation for your own Flutter Redux applications.
  It's a starting point for clean, well organized, well documented code, which is easy to
  understand, develop, refactor, change, maintain and test.

## This app demonstrates the following:

* Flutter app.

* Using Redux (<a href="https://pub.dev/packages/async_redux">Async Redux</a>)
  for state management.

* Easy theming, and changing between light and dark modes,
  using the <a href="https://pub.dev/packages/themed">Themed</a> package.

* Easy Localization (translations),
  using the <a href="https://pub.dev/packages/i18n_extension">i18n_extension</a> package.

* Uncoupling the backend communication by using a DAO (Data Access Object) pattern, featuring:
    * Using a "fake" backend for development and testing
    * Using a "real" backend for production
    * On-demand fetching (REST get), or continuous streaming (websocket)

* Saving data to local storage (using Async Redux's `Persistor` class).

* Configuring the app with a "Run Configuration".

* How to test the app.

* Organizing the app directories.

* Note: This example app does not cover Navigation, Authentication, or Internationalization aspects.

This is the app:

![Alt text](readme_images/App_Description.png)

# The State

Class `AppState` is the app state, composed of 3 "sub-states":

* `Portfolio` contains the cash balance and the list of stocks owned by the user.
* `AvailableStocks` contains the list of stocks that are available for purchase.
* `Ui` contains state related to the user interface.

It's defined in [app_state.dart](lib/models/state/app_state.dart):

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
}
```

This state is managed by the `Store` class, which is part of the Redux package.

The `Business.init()` method (in [business.dart](lib/models/infra/basic/business.dart))
instantiates the business classes when the app starts. This method:

1. Sets up some app configurations.
2. Creates the "persistor" which loads the state from local device disk when the app starts,
   and saves the state whenever the state changes, later on.
3. If no state is found in the local device disk, it creates a new state and then saves it.
4. Creates the Redux "store" which holds the app state in memory.
5. Initializes the DAO (Data Access Object) which fetches data from the backend.
6. Runs a Redux action called `InitApp_Action` with stuff the Store needs to do as soon as the
   app opens.

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

  store.dispatch(InitApp_Action()); // 6
}
```

Note: The `persistor` object above implements the `Persistor` interface defined
in the Redux package:

```dart
abstract class Persistor<AppState> {

  Future<AppState?> readState();

  Future<void> deleteState();

  Future<void> persistDifference({AppState? lastPersistedState, AppState newState});
}
```

The `persistor` is passed to the `Store` constructor.
This allows the Redux store to monitor state changes, and call the appropriate `persistor`
methods whenever something needs to be loaded or saved.

Check file [app_persistor.dart](lib/models/infra/persistor/app_persistor.dart) to see how
loading and saving to local device disk is implemented. Note I'm saving to local files,
but a database could be used instead.

## How to access the State

Check file [app_homepage.dart](lib/client/infra/app_homepage.dart),
where I create the top of the widget tree. This includes setting up:

* The `StoreProvider` to provide the `Store` to the rest of the app.
* The app theme (colors and fonts, using the <a href="https://pub.dev/packages/themed">Themed</a>
  package)
* Localization (translations, using the <a href="https://pub.dev/packages/i18n_extension">
  i18n_extension</a> package)
* The lifecycle manager (which listens to app entering background and foreground)
* The app navigation/routes.
* The user exception dialog (to show error messages to the user)
* Analytics (hinted by a comment, but not implemented)

After this is done, the whole app can access the state and dispatch actions by using
the `StoreProvider` or a `StoreConnector`.

Using the `StoreProvider` is more direct, and you can use it from inside any widget in the tree:

```
StoreProvider.of<AppState>(context, this).dispatch(SomeAction_Action());
```

However, the recommended way is using the `StoreConnector`:

```dart
Widget build(BuildContext context) =>
    StoreConnector<AppState, Vm>(
        builder: (context, vm) => ConfigurationScreen(...);
        ...
    );
```

The `StoreConnector` allows you to use the _dumb/smart pattern_, which is more verbose but
more clean-code. It's also easier to test, as it clearly separates the business and the UI layers.
More on that later.

# Initializing the app

In [main.dart](lib/client/infra/main.dart) we create a "run-configuration",
and start the app with it:

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
Business layer (like state classes and AsyncRedux/Actions),
and the Client layer (like widgets and screens):

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

* **Ready-to-use data:** The DAO takes care of getting data and turns it into simple objects that
  our app can
  easily use.


* **Hides complex details:** The DAO ensures that our app doesn't have to deal with the details of
  fetching data.
  Whether it's through JSON, gRPC, REST, GraphQL, or other ways, the DAO handles it all. This keeps
  things simple for the rest of the app.


* **Layer of separation:** The DAO separates the data fetching part from the rest of the app.
  This means if the way we get the data changes, the rest of the app stays the same.


* **Easier testing:** Since the DAO only deals with data, it's simpler to test if it works correctly
  without using the entire app. We can mock or simulate the DAO in our tests, allowing us to focus
  on the business logic and UI components independently of the data source.


* **Uncoupled development:** By mocking or simulating the DAO,
  we can work on a specific app feature even if its backend isn't ready yet.
  We can also simulate different scenarios, such as network errors, to see how the app behaves.

In the [dao.dart](lib/models/infra/dao/dao.dart) file, we define the `Dao` interface:

```dart
abstract class Dao {

  Future<void> init();

  Future<IList<AvailableStock>> readAvailableStocks();

  Future<void> startListeningToStockPriceUpdates({required PriceUpdate callback});

  Future<void> stopListeningToStockPriceUpdates();
}
```

DAO methods return mostly Futures, because they need to asynchronously fetch data from the backend.

Once we inject the DAO into the run-configuration
(by doing `var runConfig = RunConfig(dao: RealDao())`)
we can access it from anywhere in the app by just importing it:

```
import 'package:mobile_app_flutter_redux/business/infra/dao/dao.dart';

var myStocks = await DAO.readAvailableStocks();
```

In the above code, the DAO returns the available stocks as a list of objects of
type `AvailableStock`, and not as JSON.
You should avoid returning JSON or any other specific transport data format from the DAO.
Always return rich objects that are easy to use by the rest of the app.

This makes it very easy to mock or simulate the DAO,
because creating an object is simpler than composing JSON information.

## Difference between mocking and simulating the DAO

A **mocked DAO** is a fake DAO that returns some **hard-coded** data. This is useful for both
developing and testing the app, as we can mock different scenarios, such as network errors, and see
how the app behaves.

A **simulated DAO** is something different. It is also a fake DAO, but instead of returning
hard-coded data, it returns data that is generated by a **partial simulation of the backend**.

While mocking is much more common than simulation, I personally strongly prefer using a simulated
DAO instead of a mocked one. The reason is that a simulated DAO is much more realistic, and
therefore more useful.

When you instantiate the app with a simulated DAO, you can open the app yourself and interact with
it as if it were connected to a real backend.
This is very useful for developing the app, as we don't have to worry whether the backend is ready
or not.

But it also helps in automatic testing, as we don't need to create mocks for every single
scenario. We can just use the simulated DAO, and it will behave very similarly to the real backend.

When you are ready to switch to the real backend, you can just inject the "real DAO" in the app,
instead of the "simulated DAO". This is very easy to do, as the rest of the app doesn't need to
change at all.

```dart
// Injecting the real DAO:
var runConfig = RunConfig(
    dao: RealDao()
);

// Injecting the simulated DAO:
var runConfig = RunConfig(
    dao: SimulatedDao()
);
```

You might believe that simulating the DAO requires more effort than mocking it, but usually, it
doesn't, because the simulation only needs to be "partial".
While the real backend needs to deal with multi-user concurrency,
the simulated DAO can just return data for a single user.

Similarly, the simulated DAO doesn't need to handle real login processes, talk to other services,
work with databases, or manage actual network errors, and so on.
It can simply return data without worrying about all these issues.
It doesn't need to be perfect, but just good enough to help us develop and test the app.

Please use the app code as given, and try it out a little. It's using a simulated DAO.
In file [simulated_dao.dart](lib/models/infra/dao/simulated_dao/simulated_dao.dart) you can see
how it returns a list of predefined available stocks, and generates random stock price updates every
few milliseconds.

We start by creating a `SimulatedDao` class that extends `Dao`:

```dart
class SimulatedDao extends Dao {
  ...
}
```

As an example, this is how we could implement the `readAvailableStocks()` method to simulate a data
fetch:

```dart
Future<IList<AvailableStock>> readAvailableStocks() async {
  await simulatesWaiting(250);

  return _hardcodedStocks
      .map((stock) => AvailableStock(stock.ticker, name: stock.name, currentPrice: stock.price))
      .toIList();
}

```

Note how the method waits for 250 milliseconds before returning the data.
This is to simulate a network delay.

In this same file, look at the methods `listenToStockPriceUpdates()` and `stopStockPriceUpdates()`
to see how we easily simulate the continuous streaming of stock price updates.

You can also run tests against the simulated DAO.
This speeds up integration tests to be as quick as unit tests,
because DAO calls immediately return predictable data.
With some backend preparation, you can also run the tests against the real backend.
If some tests succeed in the simulation but not with the actual backend,
then it's clear there's an issue with either the backend or the simulation.
It's usually easy to find out which one is the problem.

Please check the tests in the `test` directory.

# The RunConfig

The `RunConfig` class is the "run configuration" which contains the configuration parameters
for the app. It's defined in file [RunConfig.dart](lib/models/infra/run_config/run_config.dart).

You can set up distinct configurations for various environments,
like development, staging, and production.
You can also have different configurations for different developers.
For example, you can have a configuration for John, and another for Mary.
This approach is helpful if John and Mary work on separate features and require different backends
or simulations.

Developer configurations are typically not committed to source control;
they are stored in a separate file that Git ignores.

I like to include a boolean flag in the run configuration to indicate whether users can view
and perhaps manually alter parts of the configuration within the app.
This feature is good for debugging, since it enables me to modify the configuration
without needing to recompile the app.

If you run the app and tap the "Settings" icon button in the top right corner,
you'll be taken to the configuration screen.

The first item in this screen is the 'Light/Dark mode' switch, accessible to all users.
The other items become available only if the `RunConfig.ifShowRunConfigInTheConfigScreen` flag
in the run configuration is set to `true`.

## A/B testing

For example, one of the options here lets the developer choose between `Auto`, `A` or `B`, for an
A/B testing.

`Auto` means that the app will automatically choose between A and B,
based on criteria such as the user's ID or frameworks
like <a href='https://firebase.google.com/docs/ab-testing'>Firebase A/B testing</a>.

The other options, `A` and `B`, are for development or testing.
Tap the blue button on the configuration screen to switch between A and B;
you'll notice the app's behavior change accordingly.
I programmed the stock price's font size and color to be large and blue in A,
and small and black in B.

This is the code:

```
static var priceStyleA = Font.large + AppColor.blue + FontWeight.bold;
static var priceStyleB = Font.medium + AppColor.text + FontWeight.normal;

Widget build(BuildContext context) {
  return ...
     Text(availableStock.currentPriceStr, style: abTesting.choose(priceStyleA, priceStyleB))
```

The `abTesting.choose()` method takes two parameters: `priceStyleA` and `priceStyleB`.
It returns the first parameter if the `RunConfig.abTesting` flag is set to `A`,
and the second parameter if it's set to `B`.

Check file [ab_testing.dart](lib/models/infra/run_config/ab_testing.dart) to see how
this is implemented.

# Theming the app

The main goals of theming the app are:

1. Detect automatically whether the operational system is in light or dark mode, and automatically
   adopt that mode.


2. Allow the user to manually select between light and dark modes.   
   Note while some apps may offer more than these two modes, such instances are rare.


3. Save the user's choice, so that the next time the app is opened, it will start with that.


4. Allow the React components to access the colors they need in an easy way.

Please check file [app_themes.dart](lib/client/theme/app_themes.dart)

We first define a `Font` class, with all the fonts defined by the designers in the app's design
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

In the UI code, we may simply import the `Font` and `AppColor` and use it. For example:

```
import 'package:mobile_app_flutter_redux/client/theme/app_themes.dart';

Text("Done", style: Font.small + AppColor.white),
```

To toggle between light and dark modes, we dispatch the `ToggleLightAndDarkMode_Action`.

Check
file [ACTION_toggle_light_and_dark_mode.dart](lib/client/configuration_screen/ACTION_toggle_light_and_dark_mode.dart)
to see how this is implemented:

```
if (isDarkMode) 
   Themed.currentTheme = darkTheme;
else 
   Themed.clearCurrentTheme();
```

## Spacing

Some design systems also specify spacing between UI elements, in logical pixels.

One way to separate two components is to use padding.
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

In file [app_themes.dart](lib/client/theme/app_themes.dart) we specify all the spacings we need:

```
const double px8 = 8;
const double px12 = 12; 
...

const Widget space8 = SizedBox(width: px8, height: px8);
const Widget space12 = SizedBox(width: px12, height: px12); 
...
```

# Testing the app

To test the app I use:

* Unit tests
* Widget tests
* Bdd tests, by using <a href="https://pub.dev/packages/bdd_framework">BDD Framework</a>
  (my own library for Behavior-Driven Development)

The tests are inside the `test` directory.

### Testing business, utility, and state classes

The simplest tests are the unit tests that exercise the business classes and utility classes.
For example, [Stock.test.dart](__tests__/Stock.test.dart)
and [utils.test.dart](__tests__/utils.test.dart).

Then, I test the state classes,
in [Ui.test.dart](__tests__/Ui.test.dart),
[Portfolio.test.dart](__tests__/Portfolio.test.dart)
and [AvailableStock.test.dart](__tests__/AvailableStock.test.dart):

<br>

### Testing the app infrastructure

Then I test the infrastructure classes, in [RunConfig.test.dart](__tests__/RunConfig.test.dart),
[Storage.test.dart](__tests__/Storage.test.dart),
[StorageManager.test.dart](__tests__/StorageManager.test.dart)
and [Dao.test.dart](__tests__/Dao.test.dart).


<br>

### Testing components

Please check the `src\ui\cashBalanceAndPortfolio\alternative_implementations\` directory.

It contains a `mixed` directory containing two "mixed" components which are **not used** in the app:

* [AvailableStock.mixed.dart](src/ui/cashBalanceAndPortfolio/alternative_implementations/mixed/AvailableStock.mixed.dart)
* [Portfolio.mixed.dart](src/ui/cashBalanceAndPortfolio/alternative_implementations/mixed/Portfolio.mixed.dart)

They are provided here as examples,
for comparison with the "container/view" components we actually use in the app.

These mixed components have hooks inside the UI code.
They **mix** accessing the state from inside the UI code.

For example, consider the component called `AvailableStock` which displays one of the
available stocks the user can buy.
It displays the stock ticker and name, its current price, and two buttons for buying and selling the
stock.
Here are two of them in a column:

<div style="text-align: center;">
<img src="readme_images/AvailableStock.png" alt="Alt text" width="300"/>
</div>     

File [AvailableStock.mixed.dart](src/ui/cashBalanceAndPortfolio/alternative_implementations/mixed/AvailableStock.mixed.dart)
defines the `AvailableStock_Mixed` component,
which accesses the store directly within the UI code, for example, here:

```dart
<MaterialButton label="BUY"
backgroundColor={Color.up}
disabled={!portfolio.hasMoneyToBuyStock(availableStock)}
onPress={() => {
animateAddition();
setPortfolio(portfolio.buy(availableStock, 1));
}} /
>
/
>
```

To test this mixed component, we need to use the React Native Testing Library (RNTL),
render the component, then interact with the UI, and check that the rendered component is as
expected.

For example, suppose we want to test that the BUY button is disabled when there is no money to buy
stock.
We can create the initial state with zero money, and then find the BUY button and check that its
color is grey.
Then, we can add some money and check that its color changes to green.

In other words, testing this component is hard, because it must be tested through UI tests,
which are more complex, slow and brittle.

### The container/view pattern

The components I actually use in the app are composed of a separate "container" to access the store,
and a "view" that gets all its information from the container.

The combination of **container** and **view** is called the "container/view pattern",
or "container/presentational pattern", or "smart/dumb pattern".

While we don't strictly need this pattern to create the component,
the separation of concerns is still useful, in my opinion, because it makes the code easier to test
and to understand.

1. The Container

   File [AvailableStock.container.dart](src/ui/cashBalanceAndPortfolio/AvailableStock.container.dart)
   contains `AvailableStockContainer`, which has no UI.
   Its goal is simply to access the store, create a data structure called the "view-model" with all
   the necessary
   information, and pass it down to the "view component".

   ```dart                                      
   // The container component.
   export const AvailableStockContainer: React.FC<{ availableStock: AvailableStock }> 
      = ({ availableStock }) => {
   
        const { portfolio, setPortfolio } = useContext(PortfolioContext);
        return <AvailableStockView {...viewModel(availableStock, portfolio, setPortfolio)} />;
        };
                                        
   // Function to create the view-model.
   export function viewModel(
       availableStock: AvailableStock,
       portfolio: Portfolio,
       setPortfolio: UseSet<Portfolio>
   ) {        
       return {
           availableStock,
           ifBuyDisabled: !portfolio.hasMoneyToBuyStock(availableStock),
           ifSellDisabled: !portfolio.hasStock(availableStock),
           abTesting: runConfig.abTesting,
           onBuy: () => { setPortfolio(prevPortfolio => prevPortfolio.buy(availableStock, 1)); },
           onSell: () => { setPortfolio(prevPortfolio => prevPortfolio.sell(availableStock, 1)); }
       };
   }
   ```   

   Let's see how to test the **container** in
   file [AvailableStocks.container.test.dart](__tests__/AvailableStocks.container.test.dart).

   Testing the container is basically testing that the view-model is correct. This is easy to do, as
   we can
   simply call the `viewModel()` function with different states, and check that the view-model
   properties
   are as expected.

   First, we import the view-model from:

   ```dart
   import { viewModel } from '.../AvailableStock.container';
   ```

   We then set the store state, create the view-model by calling the `viewModel()` function,
   and check that the view-model properties are as expected. Example:

   ```dart
   // The BUY button is disabled, since we cannot buy stock when there is no money.
   let portfolio = new Portfolio();
   let ibm = new AvailableStock('IBM', 'I. B. Machines', 150.00);
   let vm = viewModel(ibm, portfolio, setPortfolio);
   expect(vm.ifBuyDisabled).toBe(true);
   ```

   We can also call the callbacks defined in the view-model,
   and check that they do what they are supposed to do. Example:

   ```dart
   // Cash balance is 1000. There are no IBM stocks.
   let portfolio = new Portfolio().withCashBalance(new CashBalance(1000));
   expect(store.portfolio.howManyStocks(ibm.ticker)).toBe(0);
   
   const vm = viewModel(ibm, portfolio, setPortfolio);
   vm.onBuy(); // Buy 1 share of IBM stock.
   
   // Cash balance decreased by the price of 1 IBM stock. Portfolio now contains 1 IBM stock.
   expect(portfolio.cashBalance.amount).toBe(1000 - ibm.currentPrice);
   expect(portfolio.howManyStocks(ibm.ticker)).toBe(1);
   ```


2. The View

   File [AvailableStock.view.dart](src/ui/cashBalanceAndPortfolio/AvailableStock.view.dart)
   contains `AvailableStockView`, which does not access the store directly.
   Instead, it gets all information in its constructor.

   ```dart
   export const AvailableStockView: React.FC<{
     availableStock: AvailableStock;
     ifBuyDisabled: boolean;
     ifSellDisabled: boolean;
     abTesting: AbTesting,
     onBuy: () => void;
     onSell: () => void;
   }>
     = ({
          availableStock,
          ifBuyDisabled,
          ifSellDisabled,
          abTesting,
          onBuy,
          onSell,
        }) => {
   
   return <...>
   ```

   Just like when testing the mixed component, the only way to test the view is through UI testing,
   using the React Native Testing Library.   
   However, the ability to configure it through its constructor simplifies the testing process.

   For example, we don't need to test that the BUY button is disabled when there is no money to buy
   stock.
   We just need to test that passing `ifBuyDisabled: true` to the constructor will indeed disable
   the button.

   Likewise, we don't need to test that pressing the BUY button will call the correct store
   function.
   We just need to test that it actually calls the `onBuy()` callback.

## BDD tests

BDD stands for _Behavior-Driven Development_.

It's a way of writing executable tests that are easy to read, even for non-programmers,
and that also serve as documentation.

I won't go into details here, but I'm providing two files with BDD tests, to demonstrate how to
create them:

* [bdd.AveragePrice.test.dart](__tests__/bdd.AveragePrice.test.dart)
* [bdd.BuyAndSell.test.dart](__tests__/bdd.BuyAndSell.test.dart)

These BDD tests use a **<a href="https://www.npmjs.com/package/easy-bdd-tool-jest">BDD Framework For
Jest</a>**,
that I have developed myself.

Let's see an example of a BDD test description that specifies the behavior of the app when the user
buys stocks:

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
let
availableStocks: AvailableStocks;

beforeEach
(
async () => {
inject({});
availableStocks = await AvailableStocks.loadAvailableStocks();
});

const feature = new Feature('Buying and Selling Stocks');

Bdd(feature)
    .scenario('Buying stocks.')
    .given('The user has 120 dollars in cash-balance.')
    .and('IBM price is 30 dollars.')
    .and('The user has no IBM stocks.')
    .when('The user buys 1 IBM.')
    .then('The user now has 1 IBM.')
    .and('The cash-balance is now 90 dollars.')
    .run(async (ctx) => {

// Given:
let portfolio = new Portfolio({ cashBalance: new CashBalance(120) });

const ibm = availableStocks.findBySymbol('IBM').withCurrentPrice(30.00);
portfolio = portfolio.withoutStock('IBM');

// When:
portfolio = portfolio.buy(ibm, 1);

// Then:
expect(portfolio.howManyStocks('IBM')).toBe(1);
expect(portfolio.cashBalance).toEqual(new CashBalance(90.00));
});
```

Please note, the above BDD test runs against the **simulated backend**.
This means it runs as fast as a unit test.

If you want to run it against the **real backend**,
you can do so by injecting the real DAO instead of the simulated one, like so:

```dart
inject({ dao: new RealDao() });
```

### Feature files

The BDD tests also contain the following code:

```dart
reporter
(new FeatureFileReporter
(
)
);
```

Using this reporter means that `.feature` files will be automatically generated whenever the BDD
tests run.

Please see the generated files in the `gen_features` directory:

* `average_price.feature`
* `buying_and_selling_stocks.feature`

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

I don't like this typical structure, because it spreads out related code into different directories.
For example, if I want to see all the code related to the `AvailableStock`, in the above structure,
I may need to look into
the `widgets`, `screens`, `styles`, `services`, and `models` directories.

Instead, I'd suggest another way that keeps related code together.

## By feature

In this approach, we create a directory called `features`, and then a subdirectory for each feature,
and put all the code related to each feature inside it.
This has two important advantages:

* It's easier to find related code, as it's all in the same directory. When a new developer joins
  the team, it's easier for them to find the code they need to work on. It's also easier for them
  to understand the code, as they don't need to jump from directory to directory.


* It's easier to rename or delete a feature, as all the code related to it is in the same directory.
  For example, if you want to rename the `AvailableStock` feature to `StockToBuy`, you can see all
  the code that needs renaming together.

The `infra` directory contains infrastructure code related to the architecture and wiring of the
app.

Finally, a separate `utils` directory is still needed, as it contains code that is not related to
any specific feature, but is used by all features.

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

In the above approach, the directory of a specific feature will contain both the UI and business
code related to that feature.

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

This makes it very easy to find all the code related to a feature, but it also makes it easier for
developers to couple business and UI code.
For example, creating Flutter widget that contains a function to calculate some business logic.

To solve this, we can separate the business and UI code into different directories:

```
src/
├── business/
│   ├── infra/    
│   │   ├── dao/    
│   │   ├── RunConfig/
│   ├── utils/
│   └── state/ 
│       ├── portfolio/
│       ├── profile/
│       ├── signUp/
│       ├── logIn/
│       ├── helpAndSupport/
│       ├── configurationScreen/
│       └── app_state.ts
│    
└── ui/
    ├── theme/ 
    ├── utils/     
    ├── portfolio_and_cash_screen/
    │   ├── cashBalance/
    │   └── portfolio/
    ├── profile/
    ├── signUp/
    ├── logIn/
    ├── helpAndSupport/
    ├── configurationScreen/
    └── appBar/
```

For example, the Portfolio code would be:

```
src/
├── business/
│   ├── state/ 
│   │   ├── portfolio/
│   │   │   ├── ACTION_buy_stock.dart
│       │   ├── ACTION_sell_stock.dart
│           └── Portfolio.dart (Business code)
│
├── ui/
│   ├── portfolio_and_cash_screen/
│   │   ├── portfolio/
    │   │   ├── portfolio_widget.dart (UI code)
        │   └── portfolio_connector.dart (UI code)
```

## By feature with Model/Client separation

If our goal is sharing code between a mobile application and the admin dashboard that the company's
employees can access, we can separate the client code and the business models into different
directories:

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
│   │   └── app_state.ts    
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
│   │   └── Portfolio.dart 
```

     
---

# What now?

Visit the home page of the <a href='../README.md'>**Same App, Different Tech**</a> project,
and compare this same mobile app implemented using a variety of **different tech stacks**.

