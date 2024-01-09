import React, { createContext, useContext } from 'react';
import { Dimensions, EmitterSubscription, ScaledSize } from 'react-native';
import Color from '../theme/Color';
import { print } from '../../business/utils/utils';

export class Ui {

  readonly language: string;
  readonly ifShowConfigScreen: boolean;
  readonly isLightMode: boolean;
  readonly screen: { width: number; height: number; };

  private readonly dimensionSubscription?: EmitterSubscription;

  constructor({
                language = 'en_US',
                ifShowConfigScreen = false,
                isLightMode = true,
                width = Dimensions.get('window').width,
                height = Dimensions.get('window').height
              }: {
    language?: string,
    ifShowConfigScreen?: boolean,
    isLightMode?: boolean,
    width?: number,
    height?: number
  } = {}) {
    this.language = language;
    this.ifShowConfigScreen = ifShowConfigScreen;
    this.isLightMode = isLightMode;
    this.screen = {
      width: width,
      height: height
    };

    // Handle device rotations or dimension changes.
    this.dimensionSubscription = Dimensions.addEventListener('change', this.handleDimensionsChange);
  }

  copyWith({
             language = this.language,
             ifShowConfigScreen = this.ifShowConfigScreen,
             isLightMode = this.isLightMode,
             width = this.screen.width,
             height = this.screen.height
           }: {
    language?: string,
    ifShowConfigScreen?: boolean,
    isLightMode?: boolean,
    width?: number,
    height?: number
  } = {}): Ui {
    return new Ui({
      language,
      ifShowConfigScreen,
      isLightMode,
      width,
      height
    });
  }

  public toggleConfigScreen(): Ui {
    return this.copyWith({
        ifShowConfigScreen: !this.ifShowConfigScreen
      }
    );
  }

  public toggleLightAndDarkMode(): Ui {
    const newUi = this.copyWith({
      isLightMode: !this.isLightMode
    });

    if (newUi.isLightMode) Color.setLightTheme();
    else Color.setDarkTheme();

    return newUi;
  }

  private printDimensions(): void {
    print(`Screen size: ${JSON.stringify(this.screen)}`);
  }

  // TODO: MARCELO implement this for real. The result is being discarded.
  handleDimensionsChange = ({
                              window
                            }: {
    window: ScaledSize;
    screen: ScaledSize;
  }): Ui => {
    const newUi = this.copyWith({
      width: window.width,
      height: window.height
    });

    newUi.printDimensions();

    return newUi;
  };

  // TODO: The store is never destroyed, so do we need to call this? Maybe in tests, since there we may recreate the state.
  cleanup(): void {
    this.dimensionSubscription?.remove();
  }

  static readonly Context = createContext<{
    ui: Ui;
    setUi: React.Dispatch<React.SetStateAction<Ui>>
  }>({
    ui: new Ui(), setUi: () => {
    }
  });

  static use(): [Ui, React.Dispatch<React.SetStateAction<Ui>>] {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { ui, setUi } = useContext(Ui.Context);
    return [ui, setUi];
  }
}

