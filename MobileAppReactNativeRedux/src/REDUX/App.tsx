import React from 'react';

import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './store.tsx';
import { Counter } from './counter.tsx';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

const AppContent: React.FC = () => {

  return (
    <SafeAreaProvider>
      <Counter />
    </SafeAreaProvider>
  );
};


export default App;
