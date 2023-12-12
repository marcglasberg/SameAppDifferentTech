import 'react-native';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { UiStore } from '../src/ui/utils/UiStore';
import Color from '../src/ui/theme/Color';
import { ScaledSize } from 'react-native';

describe('UiStore', () => {
  let uiStore: UiStore;

  beforeEach(() => {
    uiStore = new UiStore();
  });

  afterEach(() => {
    uiStore.cleanup();
  });

  it('should toggle config screen visibility.', () => {
    expect(uiStore.ifShowConfigScreen).toBe(false);
    uiStore.toggleConfigScreen();
    expect(uiStore.ifShowConfigScreen).toBe(true);
    uiStore.toggleConfigScreen();
    expect(uiStore.ifShowConfigScreen).toBe(false);
  });

  it('should toggle between light and dark mode.', () => {
    const setLightThemeSpy = jest.spyOn(Color, 'setLightTheme');
    const setDarkThemeSpy = jest.spyOn(Color, 'setDarkTheme');

    expect(uiStore.isLightMode).toBe(true);
    uiStore.toggleLightAndDarkMode();
    expect(uiStore.isLightMode).toBe(false);
    expect(setDarkThemeSpy).toHaveBeenCalled();

    uiStore.toggleLightAndDarkMode();
    expect(uiStore.isLightMode).toBe(true);
    expect(setLightThemeSpy).toHaveBeenCalled();
  });

  it('should update screen dimensions on dimension change.', () => {
    const newDimensions: ScaledSize = { width: 500, height: 800, scale: 1, fontScale: 1 };
    uiStore.handleDimensionsChange({ window: newDimensions, screen: newDimensions });

    expect(uiStore.screen.width).toBe(newDimensions.width);
    expect(uiStore.screen.height).toBe(newDimensions.height);
  });
});
