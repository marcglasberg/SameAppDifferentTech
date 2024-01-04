import { AppRegistry, Platform, UIManager } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { developmentConfiguration, inject } from './src/inject';
import { Store } from './src/business/state/Store';
import { SimulatedDao } from './src/business/dao/SimulatedDao';
import { Storage } from './src/business/dao/Storage';
import { StorageManager } from './src/business/dao/StorageManager';

inject({
  store: new Store({}),
  dao: new SimulatedDao(),
  storage: new Storage(),
  runConfig: developmentConfiguration,
  // runConfig: anotherConfiguration,
});

StorageManager.init().then();

// Enables layout animation feature which allows for smooth automatic animations during layout changes,
// such as when new views are added or existing ones are removed. This is necessary because, by default,
// layout animations are not enabled on Android as they are on iOS.
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental)
  UIManager.setLayoutAnimationEnabledExperimental(true);

AppRegistry.registerComponent(appName, () => App);
