import React from 'react';

import { SafeAreaView, ScrollView, StatusBar, Text, useColorScheme } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Text>Loren ipsum</Text>
        <Text>Loren ipsum dolor sit amet</Text>
        <Text>Loren ipsum dolor sit amet consectetur</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
