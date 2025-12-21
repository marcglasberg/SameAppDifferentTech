import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { runConfig, store } from './inject';
import AppBar from './ui/appBar/AppBar';

import { observer } from 'mobx-react-lite';
import ConfigurationScreen from './ui/configurationScreen/configurationScreen';
import ConfigButton from './ui/appBar/ConfigButton';

import Color from './ui/theme/Color';
import { Column } from './ui/utils/Layout';
import { StorageManager } from './business/dao/StorageManager';
import { AppState } from 'react-native';
import { AvailableStocksListContainer } from './ui/cashBalanceAndPortfolio/AvailableStocksList.container';
import { CashBalanceAndPortfolio } from './ui/cashBalanceAndPortfolio/CashBalanceAndPortfolio';

function App() {

  if (runConfig.playground) {
    // If there's a playground component, use it.
    return runConfig.playground;
  } else {
    // Otherwise, render the main app content.
    return <AppContent />;
  }
}

const AppContent = observer(() => {

  // When the app is shutting down, stop the save timer,
  // and save one last time (if necessary).
  useEffect(() => {

    const handleAppShutdown = async () => {
      try {
        console.log('Starting shutdown process...');
        await StorageManager.stopTimerAndSaves();
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
      {store.ui.ifShowConfigScreen
        ? <ConfigurationScreen />
        : <MainScreen />}
    </SafeAreaProvider>
  );
});

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
