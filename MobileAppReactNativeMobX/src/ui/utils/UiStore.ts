import { makeAutoObservable, observable } from 'mobx';
import { Dimensions, EmitterSubscription, ScaledSize } from 'react-native';
import Color from '../theme/Color';
import { print } from '../../business/utils/utils';

export class UiStore {
  language: string = 'en_US';
  ifShowConfigScreen: boolean = false;
  isLightMode: boolean = true;

  screen: {
    width: number;
    height: number;
  } = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  };

  private dimensionSubscription?: EmitterSubscription;

  constructor() {
    makeAutoObservable(this, { screen: observable.struct });

    // Handle device rotations or dimension changes.
    this.dimensionSubscription = Dimensions.addEventListener('change', this.handleDimensionsChange);
  }

  public toggleConfigScreen() {
    this.ifShowConfigScreen = !this.ifShowConfigScreen;
  }

  public toggleLightAndDarkMode() {
    this.isLightMode = !this.isLightMode;

    if (this.isLightMode) Color.setLightTheme();
    else Color.setDarkTheme();
  }

  private printDimensions(): void {
    print(`Screen size: ${JSON.stringify(this.screen)}`);
  }

  handleDimensionsChange = ({
                              window,

                              // Note: This value ignores multi-window mode. It's not useful in practice.
                              // eslint-disable-next-line @typescript-eslint/no-unused-vars
                              screen,
                            }: {
    window: ScaledSize;
    screen: ScaledSize;
  }): void => {
    this.screen = {
      width: window.width,
      height: window.height,
    };
    this.printDimensions();
  };

  // TODO: The store is never destroyed, so do we need to call this? Maybe in tests, since there we may recreate the state.
  cleanup(): void {
    this.dimensionSubscription?.remove();
  }
}
