# React Native with no third-party state management (hooks only)

> This is part of the <a href='../README.md'>**Same App, Different Tech**</a>
> project.
>
> It contains the same simple but not trivial **mobile app** implemented using a variety of **different tech stacks**.

### Why is this repository useful?

* It helps you learn **using Context and hooks to do React Native state management**.


* If you're already familiar with vanilla React Native, it provides you with a consistent reference point
  for you to <a href='../README.md'>learn other technologies</a> by comparing them
  through applications that are functionally identical.


* Feel free to clone this repository as a foundation for your own vanilla React Native applications.
  It's a starting point for clean, well organized, well documented code, which is easy to understand, develop,
  refactor, change, maintain and test.

## This app demonstrates the following:

* React Native app.

* Using Context and hooks for state management.

* Easy theming, and changing between light and dark modes.

* Easy approach to styling components.

* Uncoupling the backend communication by using a DAO (Data Access Object) pattern, featuring:
    * Using a "fake" backend for development and testing
    * Using a "real" backend for production
    * On-demand fetching (REST get), or continuous streaming (websocket)

* Saving data to local storage (using AsyncStorage).

* Configuring the app with a "Run Configuration".

* Creating a "playground" to help develop components in isolation.

* How to test the app.

* Organizing the app directories.

* Note: This example app does not cover Navigation, Authentication, or Internationalization aspects.

This is the app:

![Alt text](readme_images/App_Description.png)

# The State

The app state is composed of objects of the following classes:

<ul>
    <li>`Portfolio` contains the cash balance and the list of stocks owned by the user.</li>
    <li>`AvailableStocks` contains the list of stocks that are available for purchase.</li>
    <li>`Ui` contains state related to the user interface.</li>
</ul>

In [App.tsx](src/App.tsx) I declare the state, as follows:

```
const [portfolio, setPortfolio] = useState(new Portfolio());
const [avbStocks, setAvbStocks] = useState(new AvailableStocks([]));
const [ui, setUi] = useState(new Ui());
```

Then, I wrap the root of the component tree (`<AppContent />`) with context providers,
to pass down this state to all components that need it:

```
<Portfolio.Context.Provider value={{ portfolio: portfolio, setPortfolio: setPortfolio }}>
  <AvailableStocks.Context.Provider value={{ availableStocks: avbStocks, setAvailableStocks: setAvbStocks }}>
    <Ui.Context.Provider value={{ ui: ui, setUi: setUi }}>
      <AppContent />
    </Ui.Context.Provider>
  </AvailableStocks.Context.Provider>
</Portfolio.Context.Provider>
```

Note: I've defined static variables called `Context`, inside of classes `Portfolio`, `AvailableStocks` and `Ui`.
This is done simply to "namespace the context", so that I can write `<Portfolio.Context.Provider>`,
`<AvailableStocks.Context.Provider>` and `<Ui.Context.Provider>` as seen above.

For example, in [Portfolio.ts](src/business/state/Portfolio.tsx) I define:

```
static readonly Context = createContext({
  portfolio: new Portfolio(),
  setPortfolio: () => {}
});
```

## How to access the State

I defined hooks as static function called `use` inside each of the state classes.
For example, in [Portfolio.ts](src/business/state/Portfolio.tsx) I define:

``` 
static use() {
  const { portfolio, setPortfolio } = useContext(Portfolio.Context);
  return [portfolio, setPortfolio];
}
```

You can then access it from any component:

```
import { Portfolio } from '../../business/state/Portfolio';
...

const [portfolio, setPortfolio] = Portfolio.use();
<Text>{`Cash Balance: ${portfolio.cashBalance}`}</Text>
```

# Initializing the app

In the [index.js](index.js) file, we inject a few dependencies using the `inject` function.

The inject function can be found in the [inject.tsx](src/inject.tsx) file.
This simple function stores the injected dependencies in global variables,
enabling access from anywhere within the app.
Note it's generally acceptable to use global singletons in code architecture,
as long as they are constant and immutable.

```
inject({  
  dao: new SimulatedDao(),
  storage: Storage.newInMemoryInstance(),
  runConfig: testConfiguration,
});
```

Let's look at each of these in turn:

* **DAO**: The Data Access Object, which is responsible for fetching data from the backend.
* **Storage**: Responsible for saving data to local storage of the device.
* **RunConfig**: Contains configuration parameters for the app.

# The DAO

The `DAO` (Data Access Object) gets data from the backend.
Here's what it gives us:

* **Ready-to-use data:** The DAO takes care of getting data and turns it into simple objects that our app can
  easily use.


* **Hides complex details:** The DAO ensures that our app doesn't have to deal with the details of fetching data.
  Whether it's through JSON, gRPC, REST, GraphQL, or other ways, the DAO handles it all. This keeps things
  simple for the rest of the app.


* **Layer of separation:** The DAO separates the data fetching part from the rest of the app.
  This means if the way we get the data changes, the rest of the app stays the same.


* **Easier testing:** Since the DAO only deals with data, it's simpler to test if it works correctly without using
  the entire app. We can mock or simulate the DAO in our tests, allowing us to focus on the business
  logic and UI components independently of the data source.


* **Uncoupled development:** By mocking or simulating the DAO,
  we can work on a specific app feature even if its backend isn't ready yet.
  We can also simulate different scenarios, such as network errors, to see how the app behaves.

In the [Dao.ts](src/business/dao/Dao.ts) file, we define the `Dao` as an abstract class or interface:

```
export abstract class Dao {
  abstract readAvailableStocks(): Promise<AvailableStock[]>;
  abstract listenToStockPriceUpdates(onUpdate: (ticker: string, price: number) => void): void;
  abstract stopStockPriceUpdates(): void;
  ...
}
```

DAO methods are mostly Promises, because they need to asynchronously fetch data from the backend.

Once we inject the DAO into the app by doing `inject({ dao: ... })`, we can access it from anywhere in the app
by just importing it:

```
import { dao } from '../../inject';

const portfolio = await dao.loadPortfolio();
```

In this code, the DAO returns the portfolio as an object of type `Portfolio`, and not as JSON.
You should avoid returning JSON or any other specific transport data format from the DAO.
Always return rich objects that are easy to use by the rest of the app.

This makes it very easy to mock or simulate the DAO,
because creating an object is simpler than composing JSON information.

## Difference between mocking and simulating the DAO

A **mocked DAO** is a fake DAO that returns some **hard-coded** data. This is useful for both developing and testing the
app, as we can mock different scenarios, such as network errors, and see how the app behaves.

A **simulated DAO** is something different. It is also a fake DAO, but instead of returning hard-coded data, it returns
data that is generated by a **partial simulation of the backend**.

While mocking is much more common than simulation, I personally strongly prefer using a simulated DAO instead of a
mocked one. The reason is that a simulated DAO is much more realistic, and therefore more useful.

When you instantiate the app with a simulated DAO,
you can open the app yourself and interact with it as if it were connected to a real backend.
This is very useful for developing the app, as we don't have to worry whether the backend is ready or not.

But it also helps in automatic testing, as we don't need to create mocks for every single
scenario. We can just use the simulated DAO, and it will behave very similarly to the real backend.

When you are ready to switch to the real backend, you can just inject the "real DAO" in the app, instead of
the "simulated DAO". This is very easy to do, as the rest of the app doesn't need to change at all.

```
// Injecting the real DAO:
inject({
   dao: new RealDao(),
});

// Injecting the simulated DAO:
inject({
   dao: new SimulatedDao(),
});
```

You might believe that simulating the DAO requires more effort than mocking it, but usually, it doesn't,
because the simulation only needs to be "partial".
While the real backend needs to deal with multi-user concurrency,
the simulated DAO can just return data for a single user.

Similarly, the simulated DAO doesn't need to handle real login processes, talk to other services,
work with databases, or manage actual network errors, and so on.
It can simply return data without worrying about all these issues.
It doesn't need to be perfect, but just good enough to help us develop and test the app.

Please use the app code as given, and try it out a little. It's using a simulated DAO.
In file [SimulatedDao.ts](src/business/dao/SimulatedDao.ts) you can see how it returns a list of available stocks,
and generates random stock price updates every few milliseconds.

We start by creating a `SimulatedDao` class that extends `Dao`:

```
export class SimulatedDao extends Dao {
...
}
```

As an example, this is how we could implement the `readAvailableStocks()` method to simulate a data fetch:

```
private stocks: _Stock[] = [
  { ticker: 'IBM', name: 'International Business Machines', price: 132.64 },
  { ticker: 'AAPL', name: 'Apple', price: 183.58 },        
];

async readAvailableStocks(): Promise<AvailableStock[]> {  
  await new Promise(resolve => setTimeout(resolve, 500)); // Delay
  
  return this.stocks.map(stock => new AvailableStock(stock.ticker, stock.name, stock.price));
}
```

Note how the method waits for 500 milliseconds before returning the data. This is to simulate a network delay.

In the same [SimulatedDao.ts](src/business/dao/SimulatedDao.ts) file, look at the
methods `listenToStockPriceUpdates()` and `stopStockPriceUpdates()` to
see how we easily simulate the continuous streaming of stock price updates.

You can also run tests against the simulated DAO.
This speeds up integration tests to be as quick as unit tests,
because DAO calls immediately return predictable data.
With some backend preparation, you can also run the tests against the real backend.
If some tests succeed in the simulation but not with the actual backend,
then it's clear there's an issue with either the backend or the simulation.
It's usually easy to find out which one is the problem.

Please check the tests in the `__tests__` directory.

# The RunConfig

The `RunConfig` class is the "run configuration" which contains the configuration parameters for the app.
It's defined in file [RunConfig.ts](src/business/RunConfig/RunConfig.ts).

You can set up distinct configurations for various environments, like development, staging, and production.
You can also have different configurations for different developers. For example, you can have a configuration for John,
and another for Mary.
This approach is helpful if John and Mary work on separate features and require different backends or simulations.

Developer configurations are typically not committed to source control;
they are stored in a separate file that Git ignores.

I like to include a boolean flag in the run configuration to indicate whether users can view
and perhaps manually alter parts of the configuration within the app.
This feature is good for debugging, since it enables me to modify the configuration
without needing to recompile the app.

If you run the app and tap the "Settings" button in the top right corner, you'll see the configuration screen.

The list's first item is the 'Light/Dark mode' switch, accessible to all users.
The other items become available only if the `RunConfig.ifShowRunConfigInTheConfigScreen` flag
in the run configuration is set to `true`.

## A/B testing

For example, one of the options here lets the developer choose between `Auto`, `A` or `B`, for an A/B testing.

`Auto` means that the app will automatically choose between A and B,
based on criteria such as the user's ID or frameworks
like <a href='https://firebase.google.com/docs/ab-testing'>Firebase A/B testing</a>.

The other options, `A` and `B`, are for development or testing.
Tap the blue button on the configuration screen to switch between A and B;
you'll notice the app's behavior change accordingly.
I programmed the stock price's font size and color to be large and blue in A, and small and black in B.
This is the code:

```tsx
const $priceA = Font.big(Color.blueText);
const $priceB = Font.small();

<Text style={abTesting.choose($priceA, $priceB)}>
  {availableStock.currentPriceStr}
</Text>
```

The `abTesting.choose()` method takes two parameters: `$priceA` (price style for A) and `$priceB` (price style for B).
It returns the first parameter if the `RunConfig.abTesting` flag is set to `A`,
and the second parameter if it's set to `B`.

Check file [ABTesting.ts](src/business/RunConfig/ABTesting.ts) to see how this is implemented.

## Playground

Another feature I like to add to the run configuration is the `playground`.
It lets you choose a specific component to display instead of the entire app.
You can use it to develop and test that component in isolation.

For instance, `anotherConfiguration` is defined in the [inject.tsx](src/inject.tsx) file like this:

```tsx
import { Playground } from './ui/cashBalanceAndPortfolio/Playground';

export const anotherConfiguration = new RunConfig({
  playground: <Playground />,
  ifShowRunConfigInTheConfigScreen: false,
  ifPrintsDebugInfoToConsole: false,
  abTesting: AbTesting.A,
});
```

Next, open the `index.js` file and change it to `runConfig: anotherConfiguration`:

```
inject({
  store: new Store(),
  dao: new SimulatedDao(),
  storage: new Storage(),
  runConfig: anotherConfiguration,
  // runConfig: developmentConfiguration,
});                        
```                        

After hot reloading, you'll notice the app shows the `Playground` component
(see [Playground.tsx](src/ui/cashBalanceAndPortfolio/Playground.tsx)) instead of the usual app.

<div style="text-align: center;">
<img src="readme_images/PlaygroundExample.png" alt="Alt text" width="350"/>
</div>

# Saving information locally

The app can save information in the local device, by using the `Storage` and the `StorageManager` classes.

## The Storage class

The `Storage` class abstracts the low level mechanism that saves, loads,
and deletes data in the device's local storage (or in a fake in-memory storage)
by using `setItem`, `getItem`, and `removeItem`, respectively.
The app injects the storage as follows:

```
// Injecting the local disk storage:
inject({
   storage: new Storage(),
});

// Injecting the in-memory storage:
inject({
   storage: Storage.newInMemoryInstance(),
});
```

You can then access the storage from anywhere in the app by just importing it and calling its methods.
For example:

```
import { storage } from '../../inject';

const serializedPortfolio = JSON.stringify(portfolio);
storage.setItem('portfolio', serializedPortfolio);
```

Please check the [Storage.ts](src/business/dao/Storage.ts) file.
When using the **disk** storage, it acts as a simple wrapper around the `AsyncStorage` API.
When using the **in-memory** storage, it wraps an in-memory map.

When you run the app as provided, the data is being saved to the device's local disk:
If you buy some stocks, they will still be there when you kill the app and restart it.

If you change the app to use the in-memory storage, then the data will be lost when you kill the app.

When running tests, however, we always use the in-memory storage, so that each test starts with a clean slate.
That's why the default for the `inject` function is to use the in-memory storage:

```
beforeEach(async () => {
  inject({});
});
```

## The StorageManager class

The `StorageManager` class is the high-level code that actually loads the state when the app opens,
and then continuously keeps track and saves the ongoing state changes.
It uses the `storage` object to actually perform the load/save/delete operations,
which might have been configured, as explained above,
to save to disk (in production) or to memory (in development and tests).

Depending on the app, your storage needs will be different. For example:

* Some apps get all their information from the internet each time they're opened or when needed. They don't store data
  on your device.

* Apps with a small amount of data save everything whenever any data changes. These apps usually load all their data
  when you start them.

* Apps with a lot of data may only save the parts that change. They might load all their data at once when opened, or
  bit by bit as needed.

* If an app has corrupted or deprecated data, it may fix this by deleting all its stored data
  and getting fresh data from the internet.

* Other apps try to correct any corrupted data, apply some migration logic to deprecated data, and then save it again.

* Some apps automatically save data every time there's a change, but others only save when the app is closing, either by
  you or by the system.

* Other apps may need to save some information locally, but don't need to continuously keep track of changes.

The specific scenario which I have implemented in the [StorageManager.ts](src/business/dao/StorageManager.ts)
file is this:

1. The `StorageManager` loads all the state from disk as soon as the app opens.
   This is the only time when information is loaded.

   ```
   async processPortfolio(...) {
      ...
      async function loadPortfolio() {
        const loaded = await dao.loadPortfolio();
        setPortfolio(loaded);
        return loaded;
      }
    
      if (this.portfolioPersistor.isFirstInvocation()) {
        await this.portfolioPersistor.loadIt(loadPortfolio, 'Portfolio');
      }
   ```

4. The `processPortfolio()` method is called by the `useEffect` in the `AppContent` widget (in [App.tsx](src/App.tsx)):

   ```   
   const AppContent: React.FC = () => {     
     const [portfolio, setPortfolio] = usePortfolio();
     ...
     useEffect(() => {
       storageManager.processPortfolio(portfolio, setPortfolio);   
   ```

2. It then sets up a 2-second interval to periodically check if the state has been modified,
   and ensures that only one instance of this interval is active at any time.
   Only if a change is detected, it triggers a save operation.

   The reason why we do it in an interval, instead of saving the state as soon as it changes,
   is that we want to avoid too many saves making the app slow. We therefore "aggregate" all state changes
   that happened in the last 2 seconds, and save them all at once.

   ```typescript
   if (this.intervalId == null) {
     this.intervalId = setInterval(async () => {
       this.portfolioPersistor.processSave(this.localSavePortfolio);
     }, 2000);
   }
   ```

3. It uses a `Persistor` class ([Persistor.ts](src/business/dao/Persistor.ts))
   with fields `lastSaved`, `current` and `isBusy` to avoid saving unchanged state,
   to avoid concurrent load and save operations,
   and to prevent overlapping save operations during subsequent interval triggers.

   ```typescript            
   export class Persistor<T> {
      lastSaved: T | null = null;
      current: T | null = null;
      isBusy: boolean = false;

      processSave(saveFunction: (current: T, lastSaved: T | null) => Promise<void>) {
       if ((this.lastSaved !== this.current) && !this.isBusy) {
         this.isBusy = true;
         (async () => {
           try {
             if (this.current != null) {
               await saveFunction(this.current, this.lastSaved);
             }          
           } finally {
             this.lastSaved = this.current;
             this.isBusy = false;
           }
         })();
       }
      }
   }
   ```


5. In [App.tsx](src/App.tsx) there is a mechanism implemented with the `handleAppShutdown()` function,
   where a save is triggered immediately when the app is shutting down, ignoring the 2-second interval.
   This is important to make sure no state is lost: `storageManager.stopTimerAndSave()`.

# Theming the app

The main goals of theming the app are:

1. Detect automatically whether the operational system is in light or dark mode, and automatically adopt that mode.


2. Allow the user to manually select between light and dark modes.   
   Note while some apps may offer more than these two modes, such instances are rare.


3. Save the user's choice, so that the next time the app is opened, it will start with that.


4. Allow the React components to access the colors they need in an easy way.

I like this article about React Native theming, and suggest you follow it:
<a href="https://medium.com/simform-engineering/manage-dark-mode-in-react-native-application-2a04ba7e76d0">
_2 Easy Ways to Add Dark Mode in a React Native Application_</a>.

By following the article, you'll end up having to add this line to all components that need to access the colors:

```

const colors = useTheme().colors;

```                                            

While this approach is acceptable, given the theme is almost constant (only changing when the user changes the theme),
I'll consider the theme constant,
and then use extraordinary measures to force the screen to rebuild if the theme changes.

Please check file [Color.ts](src/ui/theme/Color.ts).
We first define a palette, containing all the colors defined by the designers in the app's design system:

```typescript
const palette = {
  white: '#fff',
  black: '#000',
  background: '#fff',
  backgroundSemiTransparent: 'rgba(255, 255, 255, 0.55)',
  ...
};
```

Then, we create a `Theme` type where we name all the colors that we use in the app:

```typescript
type Theme = {
  text: string;
  invertedText: string;
  error: string;
  divider: string;
  ...
}
```

Then, we create light and dark themes:

```typescript
const lightTheme: Theme = {
  text: palette.foreground,
  invertedText: palette.background,
  error: palette.red,
  ...
} as const;

const darkTheme: Theme = {
  text: palette.background,
  invertedText: palette.foreground,
  error: palette.red,
  ...
} as const;

```

Finally, `Color` gives us access to the colors, and to methods to change the theme.

In the UI code, we may simply import the `Color` and use it. For example:

```

import Color from '../theme/Color';
...

const $safeArea: ViewStyle = { backgroundColor: Color.appBar, ... };
const $row: ViewStyle = { backgroundColor: Color.appBar, ... };
const $title: TextStyle = {color: Color.palette.white, ... };

return (
  <SafeAreaView style={$safeArea}>
    <Row style={$row}>
      <Text style={$title}>{title}</Text>
...
```

In the business code, we may simply call `Color.setLightTheme()` and `.setDarkTheme()`, as needed:

```typescript
function toggleLightAndDarkMode(): Ui {
  const newUi = this.copyWith({ isLightMode: !this.isLightMode });

  if (newUi.isLightMode) Color.setLightTheme();
  else Color.setDarkTheme();

  return newUi;
}
```

## Styles

I like to define the styles in the components themselves, and not in a separate file, and name them
with a `$` prefix. This makes it easy to find them in the code, and avoids name conflicts.
It also makes it easy for one style to use another, so that you can build your styles in a modular way.
For example:

```typescript
const $button: ViewStyle = { fontSize: 20, padding: 16, justifyContent: 'center' };
const $upButton: ViewStyle = { ...$button, backgroundColor: Colors.up };
const $downButton: ViewStyle = { ...$button, backgroundColor: Colors.down };
```

Note: Instead of doing what I described above, you may prefer using `StyleSheet.create()`:

```
const MyComponent = () => {
  const styles = getStyles();
  return ...
);

const getStyles = () => StyleSheet.create({ button: { ... } });
```

## Fonts

In file [Font.ts](src/ui/theme/Font.ts) we define the fonts that we use in the app, taken from the design system:

* Small: 16px font
* Medium: 20px font
* Bold: 20px font, bold
* Big: 23px font, bold
* Large: 26px

We can then use it in our components. For example:

```
const $ticker = Font.large();
<Text style={$ticker}>{availableStock.ticker}</Text>
```

Or inline:

```
<Text style={Font.large()}>{availableStock.ticker}</Text>
```

The default font color is `Color.text`.
If the color we want is different, we can pass it to the method. For example:

```
Font.large(Color.textDimmed);
```

## Spacing

Some design systems also specify spacing between UI elements, in logical pixels.

One way to separate two components is to use padding. For example:

```
<Text style={{ paddingBottom: 12 }}>Apples</Text>
<Text>Oranges</Text>
```

And even define a `Spacing` class to help us stick to the valid values:

```
<Text style={{ paddingBottom: Spacing.px12 }}>Apples</Text>
<Text>Oranges</Text>
```

However, I think it is easier and more semantic to do it like this:

```
<Text>Apples</Text>
<Space.px12 />
<Text>Oranges</Text>
```

In file [Space.tsx](src/ui/theme/Space.tsx) we specify:

* `<Space.px4 />` for 4px of spacing
* `<Space.px8 />` for 8px of spacing
* `<Space.px12 />` for 12px of spacing
* `<Space.px16 />` for 16px of spacing
* `<Space.px20 />` for 20px of spacing

Having `<Space>` components also makes it easier to change the order of elements in the layout.
For example:

```
// Wrong: We need to to move the style between the components.
<Text>Oranges</Text>
<Text style={{ paddingBottom: Spacing.px12 }}>Apples</Text>;

// Right: just changed the order.
<Text>Oranges</Text>
<Space.px12 />
<Text>Apples</Text>
```

## Simple layout components

In file [Layout.tsx](src/ui/utils/Layout.tsx) I define a few simple components that substitute some of the uses
of `<View>`:

* `<Row>` instead of `<View style={{ flexDirection: 'row'}>`
* `<Column>` instead of `<View style={{ flexDirection: 'column'}>`
* `<Spacer>` instead of `<View style={{ flex: flex}}>` when used for adjustable empty space

Then, instead of this:

```

<View>
   <Text>Some options</Text>
   <View style={{ flexDirection: 'row', backgroundColor: Color.background, flex: 1 }}>
      <Option1 />
      <Option2 />
   </View>
   <View style={{ flex: 1 }} />
   <Text>Footer</Text>
</View>
```

We can write a more semantic code, which I believe is easier to read:

```
<Column>
   <Text>Some options</Text>
   <Row style={{ backgroundColor: Color.background, flex: 1 }}>
      <Option1 />
      <Option2 />
   </Row>
   <Spacer />
   <Text>Footer</Text>
</Column>
```

# Testing the app

To test the app I use:

* <a href="https://www.npmjs.com/package/jest">Jest</a>
* <a href="https://www.npmjs.com/package/easy-bdd-tool-jest">BDD Framework For Jest</a> (my own library for
  Behavior-Driven Development)
* <a href="https://www.npmjs.com/package/@testing-library/react-native">React Native Testing Library</a> (RNTL)

The tests are inside the `__tests__` directory.

Note, in many of those tests I inject the appropriate infrastructure objects by calling `inject` with an empty object
inside `beforeEach`:

```
beforeEach(() => {
   inject({});   
});
```

This injects:

* A simulated DAO
* An in-memory storage
* A run-configuration appropriate for tests

I won't explain these here, since I have already done so above. Please refer
to [The DAO](#the-dao), [The RunConfig](#the-runconfig), and [The Storage class](#the-storage-class).

<br>

### Testing business, utility, and state classes

The simplest tests are the unit tests that exercise the business classes and utility classes.
For example, [Stock.test.tsx](__tests__/Stock.test.tsx) and [utils.test.ts](__tests__/utils.test.ts).

Then, I test the state classes,
in [Ui.test.ts](__tests__/Ui.test.ts),
[Portfolio.test.tsx](__tests__/Portfolio.test.tsx)
and [AvailableStock.test.tsx](__tests__/AvailableStock.test.tsx):

<br>

### Testing the app infrastructure

Then I test the infrastructure classes, in [RunConfig.test.tsx](__tests__/RunConfig.test.tsx),
[Storage.test.tsx](__tests__/Storage.test.tsx),
[StorageManager.test.tsx](__tests__/StorageManager.test.tsx)
and [Dao.test.tsx](__tests__/Dao.test.tsx).


<br>

### Testing components

Please check the `src\ui\cashBalanceAndPortfolio\alternative_implementations\` directory.

It contains a `mixed` directory containing two "mixed" components which are **not used** in the app:

* [AvailableStock.mixed.tsx](src/ui/cashBalanceAndPortfolio/alternative_implementations/mixed/AvailableStock.mixed.tsx)
* [Portfolio.mixed.tsx](src/ui/cashBalanceAndPortfolio/alternative_implementations/mixed/Portfolio.mixed.tsx)

They are provided here as examples,
for comparison with the "container/view" components we actually use in the app.

These mixed components have hooks inside the UI code.
They **mix** accessing the state from inside the UI code.

For example, consider the component called `AvailableStock` which displays one of the
available stocks the user can buy.
It displays the stock ticker and name, its current price, and two buttons for buying and selling the stock.
Here are two of them in a column:

<div style="text-align: center;">
<img src="readme_images/AvailableStock.png" alt="Alt text" width="300"/>
</div>     

File [AvailableStock.mixed.tsx](src/ui/cashBalanceAndPortfolio/alternative_implementations/mixed/AvailableStock.mixed.tsx)
defines the `AvailableStock_Mixed` component,
which accesses the store directly within the UI code, for example, here:

```
<MaterialButton label="BUY"
    backgroundColor={Color.up}
    disabled={!portfolio.hasMoneyToBuyStock(availableStock)}
    onPress={() => {
        animateAddition();
        setPortfolio(portfolio.buy(availableStock, 1));
    }} /> 
/>
```

To test this mixed component, we need to use the React Native Testing Library (RNTL),
render the component, then interact with the UI, and check that the rendered component is as expected.

For example, suppose we want to test that the BUY button is disabled when there is no money to buy stock.
We can create the initial state with zero money, and then find the BUY button and check that its color is grey.
Then, we can add some money and check that its color changes to green.

In other words, testing this component is hard, because it must be tested through UI tests,
which are more complex, slow and brittle.

### The container/view pattern

The components I actually use in the app are composed of a separate "container" to access the store,
and a "view" that gets all its information from the container.

The combination of **container** and **view** is called the "container/view pattern",
or "container/presentational pattern", or "smart/dumb pattern".

While we don't strictly need this pattern to create the component,
the separation of concerns is still useful, in my opinion, because it makes the code easier to test and to understand.

1. The Container

   File [AvailableStock.container.tsx](src/ui/cashBalanceAndPortfolio/AvailableStock.container.tsx)
   contains `AvailableStockContainer`, which has no UI.
   Its goal is simply to access the store, create a data structure called the "view-model" with all the necessary
   information, and pass it down to the "view component".

   ```                                      
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
   file [AvailableStocks.container.test.ts](__tests__/AvailableStocks.container.test.ts).

   Testing the container is basically testing that the view-model is correct. This is easy to do, as we can
   simply call the `viewModel()` function with different states, and check that the view-model properties
   are as expected.

   First, we import the view-model from:

   ```
   import { viewModel } from '.../AvailableStock.container';
   ```

   We then set the store state, create the view-model by calling the `viewModel()` function,
   and check that the view-model properties are as expected. Example:

   ```typescript
   // The BUY button is disabled, since we cannot buy stock when there is no money.
   let portfolio = new Portfolio();
   let ibm = new AvailableStock('IBM', 'I. B. Machines', 150.00);
   let vm = viewModel(ibm, portfolio, setPortfolio);
   expect(vm.ifBuyDisabled).toBe(true);
   ```

   We can also call the callbacks defined in the view-model,
   and check that they do what they are supposed to do. Example:

   ```typescript
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

   File [AvailableStock.view.tsx](src/ui/cashBalanceAndPortfolio/AvailableStock.view.tsx)
   contains `AvailableStockView`, which does not access the store directly.
   Instead, it gets all information in its constructor.

   ```
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

   For example, we don't need to test that the BUY button is disabled when there is no money to buy stock.
   We just need to test that passing `ifBuyDisabled: true` to the constructor will indeed disable the button.

   Likewise, we don't need to test that pressing the BUY button will call the correct store function.
   We just need to test that it actually calls the `onBuy()` callback.

### Using hooks

Please check the `src\ui\cashBalanceAndPortfolio\alternative_implementations\` directory again.
It contains a `hooks` directory containing
another example
file [AvailableStock.hook.tsx](src/ui/cashBalanceAndPortfolio/alternative_implementations/hooks/AvailableStock.hook.tsx),
which is **not used** in the app.

Compare it with files [AvailableStock.container.tsx](src/ui/cashBalanceAndPortfolio/AvailableStock.container.tsx)
and [AvailableStock.view.tsx](src/ui/cashBalanceAndPortfolio/AvailableStock.view.tsx).

Instead of defining a container component which returns a view component,
the "hooks implementation" is a single component that gets its information from a hook. In this case:

* Instead of a container component, we have a hook.

* Instead of a view component that gets information from its constructor,
  we have a component that gets its information from the hook.

Some people say that hooks are better than the container/view pattern, because they are simpler and more
straightforward. I personally think that by using hooks like this, you are still using the container/view pattern.
As long as you first get your information from the store, and then pass it down to a component that consumes
this information, that's what defines the pattern for me.

One other difference when using hooks, is that some people like to have more than one hook in the component.
For example, you may have one hook to read information from the store, another to serve as a "controller" for the UI,
etc. I personally prefer to have a single hook, which gets all the information from the store, and then pass it down
to the component, as seen in
file [AvailableStock.hook.tsx](src/ui/cashBalanceAndPortfolio/alternative_implementations/hooks/AvailableStock.hook.tsx).

Note that testing the hook itself is exactly the same as testing the previous `viewModel` function,
as they are identical.
However, my personal opinion is that having the original "container/view" components is a bit easier than using hooks,
because to test the view component with hooks you have to mock the hook,
while before you only needed to send the correct parameters to the constructor.

## BDD tests

BDD stands for _Behavior-Driven Development_.

It's a way of writing executable tests that are easy to read, even for non-programmers,
and that also serve as documentation.

I won't go into details here, but I'm providing two files with BDD tests, to demonstrate how to create them:

* [bdd.AveragePrice.test.ts](__tests__/bdd.AveragePrice.test.ts)
* [bdd.BuyAndSell.test.ts](__tests__/bdd.BuyAndSell.test.ts)

These BDD tests use a **<a href="https://www.npmjs.com/package/easy-bdd-tool-jest">BDD Framework For Jest</a>**,
that I have developed myself.

Let's see an example of a BDD test description that specifies the behavior of the app when the user buys stocks:

```
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

```
let availableStocks: AvailableStocks;

beforeEach(async () => {
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

```
inject({dao: new RealDao()});
```

### Feature files

The BDD tests also contain the following code:

```
reporter(new FeatureFileReporter());
```

Using this reporter means that `.feature` files will be automatically generated whenever the BDD tests run.

Please see the generated files in the `gen_features` directory:

* `average_price.feature`
* `buying_and_selling_stocks.feature`

These files may be committed to source control,
and can be used as living documentation that evolves as the app evolves.

# App Directories

Here's a typical way to organize directories in a React Native app:

```
src/
├── components/
├── screens/
├── navigation/
├── assets/
│   ├── images/
│   └── fonts/
├── styles/
├── utils/
├── services/
├── stores/  
├── models/  
├── constants/
└── hooks/
```

I don't like this typical structure, because it spreads out related code into different directories.
For example, if I want to see all the code related to the `AvailableStock`, in the above structure,
I may need to look into the `components`, `screens`, `styles`, `utils`, `stores`, `models`, `constants`
and `hooks` directories.

Instead, I'd suggest another way that keeps related code together.

## By feature

In this approach, we create a directory called `features`, and then a subdirectory for each feature,
and put all the code related to each feature inside it.
This has two important advantages:

* It's easier to find related code, as it's all in the same directory. When a new developer joins the team,
  it's easier for them to find the code they need to work on. It's also easier for them to understand the code,
  as they don't need to jump from directory to directory.


* It's easier to rename or delete a feature, as all the code related to it is in the same directory.
  For example, if you want to rename the `AvailableStock` feature to `StockToBuy`, you can see all the code
  that needs renaming together.

The `infra` directory contains infrastructure code related to the architecture and wiring of the app.

Finally, a separate `utils` directory is still needed, as it contains code that is not related to any specific feature,
but is used by all features.

```
src/
├── features/
│   ├── cashBalanceAndPortfolio/
│   │   ├── cashBalance/
│   │   └── portfolio/
│   ├── profile/
│   ├── signUp/
│   ├── logIn/
│   ├── helpAndSupport/
│   ├── configurationScreen/
│   └── appBar/
│
├── infra/
│   ├── auth/    
│   ├── dao/    
│   ├── RunConfig/
│   ├── theme/
│   └── navigation/
│
└── utils/
```

## By feature with Business/UI separation

In the above approach, the directory of a specific feature will contain both the UI and business code related to
that feature.

For example, the Portfolio code:

```
src/
├── features/
│   ├── cashBalanceAndPortfolio/
│   │   ├── portfolio/
│   │   │   ├── Portfolio.tsx (Business code)
│   │   │   ├── Portfolio.container.tsx (UI code)
│   │   │   └── Portfolio.view.tsx (UI code)
```

This makes it very easy to find all the code related to a feature, but creates two potential problems:

1. It's easier for developers to make the mistake of coupling business and UI code.
   For example, a React component that has a function to calculate some business logic.


2. If the business code is in the same directory as the UI code,
   it's going to be hard to reuse the business code in a different UI.
   For example, we may want to reuse the `Portfolio` business code to create
   the admin dashboard that the company's employees can access.

To solve these problems, we can separate the business and UI code into different directories:

```
src/
├── business/
│   ├── auth/    
│   ├── dao/    
│   ├── RunConfig/
│   ├── utils/
│   └── state/ 
│       ├── cashBalanceAndPortfolio/
│       ├── portfolio/
│       ├── profile/
│       ├── signUp/
│       ├── logIn/
│       ├── helpAndSupport/
│       ├── configurationScreen/
│       └── Store.ts
│    
└── ui/
    ├── theme/ 
    ├── utils/
    └── navigation/ 
    ├── cashBalanceAndPortfolio/
    │   ├── cashBalance/
    │   └── portfolio/
    ├── profile/
    ├── signUp/
    ├── logIn/
    ├── helpAndSupport/
    ├── configurationScreen/
    └── appBar/
```

For example, the Portfolio code:

```
src/
├── business/
│   ├── state/ 
│   │   ├── cashBalanceAndPortfolio/
│   │   │   └── Portfolio.tsx (Business code)
│
├── ui/
│   ├── cashBalanceAndPortfolio/
│   │   └── portfolio/
│   │       ├── Portfolio.container.tsx (UI code)
│   │       └── Portfolio.view.tsx (UI code)
```

     
---

# What now?

Visit the home page of the <a href='../README.md'>**Same App, Different Tech**</a> project,
and compare this same mobile app implemented using a variety of **different tech stacks**.

