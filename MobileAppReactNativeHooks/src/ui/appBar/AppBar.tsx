import React from 'react';
import { SafeAreaView, StatusBar, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Color from '../theme/Color';
import { TextStyle, ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import { Row, Spacer } from '../utils/Layout';
import { Font } from '../theme/Font';

const AppBar: React.FC<{
  title: string;
  actionButton?: React.ReactNode;
}> = ({ title, actionButton }) => {

  const insets = useSafeAreaInsets();
  const $safeArea: ViewStyle = {
    backgroundColor: Color.appBar,
    paddingTop: insets.top
  };

  const $row: ViewStyle = {
    height: 60, paddingLeft: 16, backgroundColor: Color.appBar,
    justifyContent: 'center', alignItems: 'center'
  };

  const $title: TextStyle = Font.bold(Color.palette.white);

  return (
    <SafeAreaView style={$safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="rgba(0,0,0,0.25)" translucent={true} />

      <Row style={$row}>
        <Text style={$title}>{title}</Text>
        <Spacer />
        {actionButton && actionButton}
      </Row>

    </SafeAreaView>
  );
};

export default AppBar;
