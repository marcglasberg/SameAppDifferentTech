import 'react-native';
import Color from '../src/ui/theme/Color';
import { ScaledSize } from 'react-native';
import { Ui } from '../src/ui/utils/Ui';

describe('Ui', () => {
  let ui: Ui;

  beforeEach(() => {
    ui = new Ui();
  });

  afterEach(() => {
    ui.cleanup();
  });

  it('should toggle config screen visibility.', () => {
    expect(ui.ifShowConfigScreen).toBe(false);
    ui = ui.toggleConfigScreen();
    expect(ui.ifShowConfigScreen).toBe(true);
    ui = ui.toggleConfigScreen();
    expect(ui.ifShowConfigScreen).toBe(false);
  });

  it('should toggle between light and dark mode.', () => {
    const setLightThemeSpy = jest.spyOn(Color, 'setLightTheme');
    const setDarkThemeSpy = jest.spyOn(Color, 'setDarkTheme');

    expect(ui.isLightMode).toBe(true);
    ui = ui.toggleLightAndDarkMode();
    expect(ui.isLightMode).toBe(false);
    expect(setDarkThemeSpy).toHaveBeenCalled();

    ui = ui.toggleLightAndDarkMode();
    expect(ui.isLightMode).toBe(true);
    expect(setLightThemeSpy).toHaveBeenCalled();
  });

  it('should update screen dimensions on dimension change.', () => {
    const newDimensions: ScaledSize = { width: 500, height: 800, scale: 1, fontScale: 1 };
    ui = ui.handleDimensionsChange({ window: newDimensions, screen: newDimensions });

    expect(ui.screen.width).toBe(newDimensions.width);
    expect(ui.screen.height).toBe(newDimensions.height);
  });
});
