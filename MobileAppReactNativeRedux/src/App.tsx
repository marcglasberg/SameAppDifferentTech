import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { runConfig } from './inject';
import { AppState } from 'react-native';
import { StorageManager } from './business/dao/StorageManager';
import ConfigurationScreen from './ui/configurationScreen/configurationScreen';
import { Column } from './ui/utils/Layout';
import AppBar from './ui/appBar/AppBar';
import { CashBalanceAndPortfolio } from './ui/cashBalanceAndPortfolio/CashBalanceAndPortfolio';
import { AvailableStocksListContainer } from './ui/cashBalanceAndPortfolio/AvailableStocksList.container';
import Color from './ui/theme/Color';
import ConfigButton from './ui/appBar/ConfigButton';
import { RootState, store } from './store.tsx';
import { Provider, useDispatch, useSelector } from 'react-redux';

function App() {

  // The storageManager saves information to the device's local storage.
  const [storageManager, setStorageManager] = useState(new StorageManager());

  if (runConfig.playground) {

    // If there's a playground component, use it.
    return runConfig.playground;

  } else {

    // Otherwise, render the main app content.
    return (
      <Provider store={store}>
        <StorageManager.Context.Provider
          value={{ storageManager: storageManager, setStorageManager: setStorageManager }}>
          <AppContent />
        </StorageManager.Context.Provider>
      </Provider>
    );
  }
}

const AppContent: React.FC = () => {

  const storageManager = StorageManager.use();
  const portfolio = useSelector((state: RootState) => state.portfolio);
  const ui = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();

  // When the app is shutting down, stop the save timer,
  // and save one last time (if necessary).
  useEffect(() => {

    storageManager.processPortfolio(portfolio, dispatch).then();

    const handleAppShutdown = async () => {
      try {
        console.log('Starting shutdown process...');
        await storageManager.stopTimerAndSave().then();
        ui.cleanup();
        console.log('Shutdown process completed.');
      } catch (error) {
        console.error('Error during shutdown:', error);
      }
    };

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState.match(/inactive|background/))
        handleAppShutdown().catch(error => {
          console.error('Failed to complete shutdown tasks:', error);
        });
    });

    return () => {
      subscription.remove();
    };
    // eslint-disable-next-line
  }, [portfolio, ui]);

  return (
    <SafeAreaProvider>
      {ui.ifShowConfigScreen
        ? <ConfigurationScreen />
        : <MainScreen />}
    </SafeAreaProvider>
  );
};

const MainScreen: React.FC<{}> = ({}) => {

  return (
    <Column style={{ flex: 1 }}>
      <AppBar title="Stocks App Demo" actionButton={<ConfigButton />} />
      <Column style={{ backgroundColor: Color.background, flex: 1 }}>
        <CashBalanceAndPortfolio />
        <AvailableStocksListContainer />
      </Column>
    </Column>
  );
};

export default App;
