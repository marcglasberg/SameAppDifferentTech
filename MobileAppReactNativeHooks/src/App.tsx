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
import { Ui } from './ui/utils/Ui';
import { Portfolio } from './business/state/Portfolio';
import {
  AvailableStocksContext,
  PortfolioContext,
  UiContext,
  usePortfolio,
  useUi
} from './business/state/HooksAndContext';
import { AvailableStocks } from './business/state/AvailableStocks';

function App() {

  // The storageManager saves information to the device's local storage.
  const [storageManager, setStorageManager] = useState(new StorageManager());

  // Declare all the state.
  const [portfolio, setPortfolio] = useState(new Portfolio());
  const [avbStocks, setAvbStocks] = useState(new AvailableStocks([]));
  const [ui, setUi] = useState(new Ui());

  if (runConfig.playground) {

    // If there's a playground component, use it.
    return runConfig.playground;

  } else {

    // Otherwise, render the main app content.
    return (
      <StorageManager.Context.Provider value={{ storageManager: storageManager, setStorageManager: setStorageManager }}>
        <PortfolioContext.Provider value={{ portfolio: portfolio, setPortfolio: setPortfolio }}>
          <AvailableStocksContext.Provider value={{ availableStocks: avbStocks, setAvailableStocks: setAvbStocks }}>
            <UiContext.Provider value={{ ui: ui, setUi: setUi }}>
              <AppContent />
            </UiContext.Provider>
          </AvailableStocksContext.Provider>
        </PortfolioContext.Provider>
      </StorageManager.Context.Provider>
    );
  }
}

const AppContent: React.FC = () => {

  const storageManager = StorageManager.use();
  const [portfolio, setPortfolio] = usePortfolio();
  const [ui, setUi] = useUi();

  // When the app is shutting down, stop the save timer,
  // and save one last time (if necessary).
  useEffect(() => {

    storageManager.processPortfolio(portfolio, setPortfolio).then();

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
