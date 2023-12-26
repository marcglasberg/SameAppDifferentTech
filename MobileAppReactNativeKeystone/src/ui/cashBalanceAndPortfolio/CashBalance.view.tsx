import React from 'react';
import { Text } from 'react-native';
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import CircleButton from '../utils/CircleButton';
import { Row, Spacer } from '../utils/Layout';
import { Font } from '../theme/Font';
import { Space } from '../theme/Space';
import { CashBalance } from '../../business/state/CashBalance';
import Color from '../theme/Color';
import { observer } from 'mobx-react-lite';

export const CashBalanceView: React.FC<{
  cashBalance: CashBalance;
  onAdd: () => void;
  onRemove: () => void;
}>
  = observer(({ cashBalance, onAdd, onRemove }) => {

  const $cashBalance: ViewStyle = { paddingTop: 16, paddingLeft: 16, paddingRight: 8, alignItems: 'center' };

  return (
    <Row style={$cashBalance}>

      <Text style={Font.medium()}>{`Cash Balance: ${cashBalance}`}</Text>

      <Space.px8 />
      <Spacer />

      <CircleButton
        color={'white'}
        backgroundColor={Color.up}
        icon={'add'}
        onPress={onAdd}
      />

      <Space.px4 />

      <CircleButton
        color={'white'}
        backgroundColor={Color.down}
        icon={'remove'}
        onPress={onRemove}
      />

    </Row>
  );
});
