import React from 'react';
import { Switch, SwitchChangeEvent } from 'react-native';
import { observer } from 'mobx-react-lite';
import Color from '../theme/Color'; // Adjust the import path to your theme color definitions

interface AppSwitchProps {
  /** If true the user won't be able to toggle the switch. Default value is false. */
  disabled?: boolean;

  /** Invoked with the change event as an argument when the value changes. */
  onChange?: (event: SwitchChangeEvent) => void;

  /** Invoked with the new value when the value changes. */
  onValueChange?: (value: boolean) => void;

  /** The value of the switch. If true the switch will be turned on. Default value is false. */
  value?: boolean;
}

const AppSwitch: React.FC<AppSwitchProps> = observer(({ disabled, onChange, onValueChange, value }) => {

  const trackColor = {
    false: Color.palette.base20,
    true: Color.palette.green,
  };

  // The thumbColor now depends on the 'value' prop to determine its color.
  const thumbColor = value ? Color.palette.lightGreen : Color.palette.base30; // Adjust the color values as needed.

  return (
    <Switch
      disabled={disabled}
      onValueChange={onValueChange}
      value={value}
      onChange={onChange}
      trackColor={trackColor}
      thumbColor={thumbColor}
    />
  );
});

export default AppSwitch;
