import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Portfolio from '../../business/state/Portfolio';
import { Ui } from '../utils/Ui';

const ConfigButton: React.FC<{}> = ({}) => {

  const [ui, setUi] = Ui.use();

  return (

    <TouchableOpacity
      onPress={() => {
        ui.toggleConfigScreen();
      }}
      style={{ padding: 16 }}
    >
      <Icon name={'settings'} size={24} color={'white'} />
    </TouchableOpacity>

  );
};

export default ConfigButton;
