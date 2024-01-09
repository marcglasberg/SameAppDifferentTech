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
import Portfolio from './business/state/Portfolio';
import AvailableStocks from './business/state/AvailableStocks';

function App() {

  // Declare all the state.
  const [ui, setUi] = useState(new Ui());
  const [portfolio, setPortfolio] = useState(new Portfolio());
  const [avbStocks, setAvbStocks] = useState(new AvailableStocks([]));

  if (runConfig.playground) {

    // If there's a playground component, use it.
    return runConfig.playground;

  } else {

    // Otherwise, render the main app content.
    return (
      <Ui.Context.Provider value={{ ui: ui, setUi: setUi }}>
        <Portfolio.Context.Provider value={{ portfolio: portfolio, setPortfolio: setPortfolio }}>
          <AvailableStocks.Context.Provider value={{ availableStocks: avbStocks, setAvailableStocks: setAvbStocks }}>
            <AppContent />
          </AvailableStocks.Context.Provider>
        </Portfolio.Context.Provider>
      </Ui.Context.Provider>
    );
  }
}

const AppContent: React.FC = () => {

  const [ui, setUi] = Ui.use();

  // When the app is shutting down, stop the save timer,
  // and save one last time (if necessary).
  useEffect(() => {

    const handleAppShutdown = async () => {
      try {
        console.log('Starting shutdown process...');
        await StorageManager.stopTimerAndSaves().then();
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
  }, []);

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
