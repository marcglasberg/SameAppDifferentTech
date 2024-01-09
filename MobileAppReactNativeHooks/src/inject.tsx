import RunConfig from './business/RunConfig/RunConfig';
import { Dao } from './business/dao/Dao';
import { SimulatedDao } from './business/dao/SimulatedDao';
import { Storage } from './business/dao/Storage';
import { AbTesting } from './business/RunConfig/ABTesting';
import { Playground } from './ui/cashBalanceAndPortfolio/Playground';
import React from 'react';

/**
 * This must be called when the app starts, to set up the Store, the Dao,
 * Storage and the run configuration for the app.
 *
 * - If you omit the store, it will create a new one with default parameters.
 * - If you omit the dao, it will create a new SimulatedDao().
 * - If you omit the storage, it will use an in-memory storage.
 * - If you omit the config, it will use the default testConfiguration.
 *
 * It should also be called whenever a test starts to make sure this global
 * information does not leak from test to test. Usually, the tests need the
 * default configuration, so you can just call `inject({})` in the `beforeEach`
 * or right at the start of each test.
 */
export function inject(params: {
  dao?: Dao;
  storage?: Storage;
  runConfig?: RunConfig;
}): void {
  dao = params.dao ?? new SimulatedDao();
  storage = params.storage ?? Storage.newInMemoryInstance();
  runConfig = params.runConfig ?? testConfiguration;
}

/**
 * The Data Access Object lets the app communicate with the backend.
 * You may access the Dao methods directly like so: `dao.readStocks();`
 * Typically the dao is {@link RealDao} or {@link SimulatedDao}.
 */
export let dao: Dao;

export let storage: Storage;

/**
 * Holds information about how to run the app. The UI must be updated when
 * RunConfig properties change, but you should only change the RunConfig
 * during development.
 *
 * When creating components, you may define a {@link playground} for that
 * component. When the app runs, it will run it instead of the regular app.
 */
export let runConfig: RunConfig;

export const productionConfiguration = new RunConfig({
  playground: null,
  ifShowRunConfigInTheConfigScreen: false,
  ifPrintsDebugInfoToConsole: false,
  abTesting: AbTesting.AUTO
});

export const developmentConfiguration = new RunConfig({
  playground: null,
  ifShowRunConfigInTheConfigScreen: true,
  ifPrintsDebugInfoToConsole: true,
  abTesting: AbTesting.A
});

export const testConfiguration = new RunConfig({
  playground: null,
  ifShowRunConfigInTheConfigScreen: true,
  ifPrintsDebugInfoToConsole: false,
  abTesting: AbTesting.A
});

export const anotherConfiguration = new RunConfig({
  playground: <Playground />,
  ifShowRunConfigInTheConfigScreen: true,
  ifPrintsDebugInfoToConsole: true,
  abTesting: AbTesting.A
});
